#!/usr/bin/env node
// House renderer: an HTML film is a pure function of time. window.seek(t) paints frame t.
//
//   node scripts/render.mjs projects/<slug>/film.html --sheet     # one frame per beat -> contact sheet (review loop)
//   node scripts/render.mjs projects/<slug>/film.html             # full render, H.264 yuv420p CRF 16, mixed audio
//
// The film must define, before load ends:
//   window.FILM  = { width, height, fps, duration, bpm?, seed?, silent? }
//   window.seek  = (t) => { ...paint the frame at t seconds... }     (may return a Promise)
//   window.CUES  = [{ t, sfx, gain? }]   optional; SFX hits, usually built from window.BEATS
// The renderer injects, before any film script runs:
//   window.__RENDER = true, window.BEATS = { beats:[...], downbeats:[...], tempo_bpm, source }
//
// Review (nothing is encoded; writes PNG sheets next to the render):
//   --sheet [--every n]          one frame per beat (labelled: beat, downbeat, sound cues)
//   --strip=2.1:2.6              EVERY frame of a stretch: motion, contacts, transitions, pops
//   --at=0.1,0.8,1.6             chosen moments
//   --crop=x,y,w,h               full-resolution detail of a region (frame pixels), with any of the above
//   --crop-at=<selector>,w,h     a crop that follows an element through the frames (e.g. --crop-at=#cta,600,240)
//   --cols=n --w=px --zoom=2     sheet columns, cell width, capture density for crops
//   (strip / crop review adapted from ClaudeAnimationBase by John Heibel, MIT License)
// Sound cues are derived from the picture: any element with data-sfx="<kind>" is measured every frame,
// and the moment it appears on screen (or lands, with data-sfx-at="land") becomes a cue, panned by its
// on-screen position and weighted by its size. window.CUES adds manual cues on top.
//   --cues                        print the derived cue table and grid check, then exit
// Options: --out <file.mp4>  --audio <track>  --crf 16  --no-verify  --no-audio
import { chromium } from "playwright";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STUDIO = path.resolve(HERE, "..");

// ---------- args
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => {
  const eq = argv.find((a) => a.startsWith(`--${n}=`)); if (eq) return eq.slice(n.length + 3);
  const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};
const REVIEW = flag("sheet") || !!opt("strip") || !!opt("at");
const ZOOM = REVIEW ? Number(opt("zoom", 1)) : 1;
const filmPath = path.resolve(argv.find((a) => a.endsWith(".html")) ?? "");
if (!filmPath.endsWith(".html") || !fs.existsSync(filmPath)) die("usage: node scripts/render.mjs <film.html> [--sheet] [--out file.mp4] [--audio track] [--crf 16]");
const filmDir = path.dirname(filmPath);
const name = path.basename(filmPath, ".html");
const crf = Number(opt("crf", 16));
const out = path.resolve(opt("out", path.join(filmDir, "renders", `${name}.mp4`)));
const audioDir = path.join(filmDir, "audio");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

function die(msg) { console.error(`render: ${msg}`); process.exit(1); }
function run(cmd, args, { quiet = true } = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 << 20 });
  if (r.status !== 0) die(`${cmd} ${args.join(" ")}\n${r.stderr || r.stdout}`);
  if (!quiet) process.stdout.write(r.stdout);
  return r;
}
const py = (script, ...a) => run("python3", [path.join(HERE, script), ...a]);

// ---------- 1. static lint: the render contract
const BANNED = [
  [/Math\.random\s*\(/, "Math.random — use seeded mulberry32"],
  [/\bsetTimeout\s*\(|\bsetInterval\s*\(/, "timers — derive everything from t"],
  [/requestAnimationFrame\s*\(/, "requestAnimationFrame — seek(t) paints the frame"],
  [/Date\.now\s*\(|performance\.now\s*\(|new Date\s*\(\s*\)/, "wall-clock time — use t"],
  [/(^|[;{\s])transition\s*:/, "CSS transition — compute the value from t"],
  [/(^|[;{\s])animation(-name)?\s*:|@keyframes/, "CSS animation — compute the value from t"],
  [/\.play\s*\(\s*\)/, "media .play() — the renderer owns time"],
];
function lint(file) {
  const problems = [];
  // blank out comments (keeping newlines so line numbers stay right)
  const keepLines = (m) => m.replace(/[^\n]/g, " ");
  const src = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, keepLines).replace(/\/\*[\s\S]*?\*\//g, keepLines);
  const raw = fs.readFileSync(file, "utf8").split("\n");
  src.split("\n").forEach((line, i) => {
    const code = line.replace(/(^|[^:])\/\/.*$/, "$1");
    for (const [re, why] of BANNED) if (re.test(code)) problems.push(`${path.relative(STUDIO, file)}:${i + 1}  ${why}\n    ${raw[i].trim()}`);
  });
  return problems;
}
const ownFiles = [filmPath, ...fs.readdirSync(filmDir, { recursive: true })
  .map((f) => path.join(filmDir, f))
  .filter((f) => /\.(m?js|css)$/.test(f) && !/(^|[\\/])(vendor|node_modules|renders|\.hyperframes)[\\/]/.test(path.relative(filmDir, f)))];
const lintProblems = ownFiles.flatMap(lint);
if (lintProblems.length) die(`render contract violations:\n  ${lintProblems.join("\n  ")}`);

// ---------- 2. browser (offline: only file:// loads)
async function launch() {
  try { return await chromium.launch(); }
  catch { return await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
}
const browser = await launch();
const violations = [];
async function openFilm(beats) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: ZOOM });
  await page.route("**/*", (r) => (r.request().url().startsWith("file:") || r.request().url().startsWith("data:") ? r.continue() : r.abort()));
  page.on("pageerror", (e) => violations.push(`page error: ${e.message}`));
  page.on("requestfailed", (r) => violations.push(`blocked/failed load: ${r.url()}`));
  page.on("console", (m) => { if (m.text().startsWith("[contract]")) violations.push(m.text()); });
  await page.addInitScript((b) => {
    window.__RENDER = true;
    window.BEATS = b;
    // Runtime guard: flag contract breaks that come from the film's own code (not vendored libs).
    const own = () => { const s = new Error().stack || ""; const lines = s.split("\n").slice(3, 6).join(" "); return !/vendor|playwright|__puppeteer/.test(lines) && /file:/.test(lines); };
    const wrap = (obj, key, label) => { const orig = obj[key]; obj[key] = function (...a) { if (own()) console.log(`[contract] ${label} called`); return orig.apply(this, a); }; };
    wrap(window, "setTimeout", "setTimeout"); wrap(window, "setInterval", "setInterval");
    wrap(window, "requestAnimationFrame", "requestAnimationFrame"); wrap(Math, "random", "Math.random");
  }, beats);
  await page.goto(pathToFileURL(filmPath).href, { waitUntil: "load" });
  await page.waitForFunction(() => window.FILM && typeof window.seek === "function", null, { timeout: 15000 })
    .catch(() => die("film never defined window.FILM and window.seek"));
  await page.evaluate(() => document.fonts.ready);
  const film = await page.evaluate(() => window.FILM);
  for (const k of ["width", "height", "fps", "duration"]) if (!(film[k] > 0)) die(`window.FILM.${k} must be a positive number`);
  await page.setViewportSize({ width: film.width, height: film.height });
  return { page, film };
}

// ---------- 3. sound: score (supplied or synthesized) -> beat grid -> cues -> sfx -> mix @ -14 LUFS
let { page, film } = await openFilm(null);
let beats = { beats: [], downbeats: [], tempo_bpm: film.bpm ?? 100, source: "none" };
let mixPath = null;
let cues = [];
const wantAudio = !film.silent && !flag("no-audio");
if (wantAudio) {
  let track = opt("audio");
  if (track) {
    track = path.resolve(track);
    py("analyze_audio.py", track, "--fps", String(film.fps), "--out", path.join(audioDir, "beats.json"));
    beats = { ...JSON.parse(fs.readFileSync(path.join(audioDir, "beats.json"), "utf8")), source: "measured" };
  } else {
    track = path.join(audioDir, "score.wav");
    py("synth_audio.py", "score", "--bpm", String(film.bpm ?? 100), "--duration", String(film.duration), "--seed", String(film.seed ?? 7), "--out", track);
    beats = JSON.parse(fs.readFileSync(path.join(audioDir, "score.beats.json"), "utf8"));
    // measure it anyway and record the drift so the grid is honest
    py("analyze_audio.py", track, "--fps", String(film.fps), "--out", path.join(audioDir, "beats.measured.json"));
  }
  fs.writeFileSync(path.join(audioDir, "beats.json"), JSON.stringify(beats, null, 2));
  await page.close();
  ({ page, film } = await openFilm(beats));
  const manual = (await page.evaluate(() => window.CUES || [])).map((c) => ({ ...c, source: "manual" }));
  const derived = await deriveCues(page, film, beats);
  cues = [...derived, ...manual].filter((c) => c.t >= 0 && c.t < film.duration).sort((x, y) => x.t - y.t);
  fs.writeFileSync(path.join(audioDir, "cues.json"), JSON.stringify(cues, null, 2));
  printCues(cues);
  if (flag("cues")) { await browser.close(); process.exit(0); }
  const pre = path.join(audioDir, "mix.pre.wav");
  if (cues.length) {
    const sfx = path.join(audioDir, "sfx.wav");
    py("synth_audio.py", "sfx", "--duration", String(film.duration), "--cues", path.join(audioDir, "cues.json"), "--seed", String(film.seed ?? 7), "--out", sfx);
    run("ffmpeg", ["-y", "-v", "error", "-i", track, "-i", sfx, "-filter_complex",
      "[0:a]aresample=48000,volume=0.75[m];[1:a]aresample=48000,volume=1.0[s];[m][s]amix=inputs=2:normalize=0:duration=first", "-t", String(film.duration), pre]);
  } else {
    run("ffmpeg", ["-y", "-v", "error", "-i", track, "-ar", "48000", "-t", String(film.duration), pre]);
  }
  // two-pass loudnorm to -14 LUFS integrated, -1.5 dBTP
  const m = run("ffmpeg", ["-hide_banner", "-i", pre, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]).stderr;
  const j = JSON.parse(m.slice(m.lastIndexOf("{"), m.lastIndexOf("}") + 1));
  mixPath = path.join(audioDir, "mix.wav");
  run("ffmpeg", ["-y", "-v", "error", "-i", pre, "-af",
    `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,alimiter=limit=0.75:attack=1:release=50:level=false`,
    "-ar", "48000", mixPath]);
}

const seek = (t) => page.evaluate(async (tt) => { await window.seek(tt); }, t);
const shot = () => page.screenshot({ type: "png", clip: { x: 0, y: 0, width: film.width, height: film.height } });

// ---------- 4a. review: beat sheet, every-frame strip, chosen moments; optional full-res crops
if (REVIEW) {
  const fps = film.fps, frame = 1 / fps;
  let picks, kind;
  if (opt("strip")) {
    const [a, b] = opt("strip").split(":").map(Number);
    if (!(b > a)) die("--strip wants start:end in seconds, e.g. --strip=2.1:2.6");
    picks = []; for (let i = Math.round(a * fps); i <= Math.round(b * fps); i++) picks.push({ t: i / fps });
    kind = `strip-${a}-${b}`;
  } else if (opt("at")) {
    picks = opt("at").split(",").map((v) => ({ t: Number(v) }));
    kind = "at";
  } else {
    const every = Number(opt("every", 1));
    const grid = beats.beats.length ? beats.beats : Array.from({ length: Math.ceil(film.duration / 0.6) }, (_, i) => i * 0.6);
    picks = grid.map((t, i) => ({ t, beat: i })).filter(({ t, beat }) => t < film.duration && beat % every === 0);
    picks.push({ t: Math.max(0, film.duration - frame), end: true });
    kind = "beats";
  }
  picks = picks.filter((p) => p.t >= 0 && p.t < film.duration + 1e-6);

  // crop: a fixed region, or one that follows an element
  const crop = opt("crop") ? opt("crop").split(",").map(Number) : null;
  let follow = null;
  if (opt("crop-at")) { const parts = opt("crop-at").split(","); follow = { sel: parts.slice(0, -2).join(","), w: +parts.at(-2), h: +parts.at(-1) }; }
  const regionAt = async () => {
    if (crop) return { x: crop[0], y: crop[1], width: crop[2], height: crop[3] };
    if (follow) {
      const c = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [(r.left + r.right) / 2, (r.top + r.bottom) / 2]; }, follow.sel);
      if (!c) die(`--crop-at: no element matches ${follow.sel}`);
      const x = Math.min(Math.max(0, c[0] - follow.w / 2), film.width - follow.w), y = Math.min(Math.max(0, c[1] - follow.h / 2), film.height - follow.h);
      return { x, y, width: follow.w, height: follow.h };
    }
    return { x: 0, y: 0, width: film.width, height: film.height };
  };

  const beatT = beats.beats || [], down = new Set((beats.downbeats || []).map((t) => t.toFixed(3)));
  const subGrid = sub16(beatT);
  const label = (p) => {
    const bits = [];
    if (p.end) bits.push("end");
    else if (p.beat !== undefined) bits.push(`beat ${p.beat}${down.has(p.t.toFixed(3)) ? " · DOWNBEAT" : ""}`);
    else {
      bits.push(`f${Math.round(p.t * fps)}`);
      const k = subGrid.findIndex((g) => Math.abs(g - p.t) < frame / 2);
      if (k >= 0) bits.push(k % 4 === 0 ? (down.has(subGrid[k].toFixed(3)) ? "DOWNBEAT" : "beat") : k % 2 === 0 ? "8th" : "16th");
    }
    const hits = cues.filter((c) => Math.abs(c.t - p.t) < frame / 2 + 1e-6).map((c) => c.sfx);
    if (hits.length) bits.push(`♪ ${[...new Set(hits)].join("+")}`);
    return bits.join(" · ");
  };

  const dir = path.join(path.dirname(out), `${name}.${kind}${crop || follow ? ".crop" : ""}`);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cells = [];
  let region = { width: film.width, height: film.height };
  for (const [i, p] of picks.entries()) {
    await seek(p.t);
    region = await regionAt();
    const f = path.join(dir, `${String(i).padStart(3, "0")}.png`);
    fs.writeFileSync(f, await page.screenshot({ type: "png", clip: region }));
    cells.push({ f: path.basename(f), t: p.t, label: label(p) });
  }
  const isStrip = kind.startsWith("strip");
  const landscape = region.width >= region.height;
  const cols = Number(opt("cols", isStrip ? 6 : crop || follow ? 3 : landscape ? 4 : 6));
  const cw = Number(opt("w", isStrip ? (landscape ? 320 : 200) : crop || follow ? Math.min(640, region.width * ZOOM) : landscape ? 480 : 260));
  const ch = Math.round((cw * region.height) / region.width);
  const fonts = path.join(STUDIO, "brand", "fonts");
  const what = isStrip ? "every frame" : kind === "beats" ? "one frame per beat" : "chosen moments";
  const html = `<!doctype html><html><head><style>
    @font-face{font-family:Inter;src:url("${pathToFileURL(path.join(fonts, "inter-latin-500-normal.woff2")).href}")}
    body{margin:0;background:#111;font-family:Inter,sans-serif;color:#ddd;padding:16px;width:${cols * (cw + 12) + 20}px}
    h1{font-size:15px;font-weight:500;margin:0 0 12px;color:#fafafa} .g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:12px}
    figure{margin:0} img{width:${cw}px;height:${ch}px;display:block;border-radius:4px;background:#000;image-rendering:${crop || follow ? "pixelated" : "auto"}}
    figcaption{font-size:12px;padding:5px 2px;color:#a3a3a3} figcaption b{color:#f59e0b;font-weight:500}
    </style></head><body><h1>${name} · ${what} · ${film.width}×${film.height} · ${beats.tempo_bpm} BPM (${beats.source})${crop || follow ? ` · crop ${follow ? follow.sel + " " : ""}${Math.round(region.width)}×${Math.round(region.height)} @${ZOOM}x` : ""} · ${cells.length} frames</h1><div class="g">
    ${cells.map((c) => `<figure><img src="${c.f}"><figcaption><b>${c.t.toFixed(2)}s</b> · ${c.label}</figcaption></figure>`).join("")}
    </div></body></html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  const sp = await browser.newPage({ viewport: { width: cols * (cw + 12) + 20, height: 400 } });
  await sp.goto(pathToFileURL(path.join(dir, "index.html")).href);
  await sp.evaluate(() => document.fonts.ready);
  const sheet = `${dir}.png`;
  await sp.screenshot({ path: sheet, fullPage: true });
  await browser.close();
  report();
  console.log(`sheet: ${sheet}\nNow LOOK at it${kind === "beats" ? " and score it (SCORECARD.md) before any full render" : ""}.`);
  process.exit(violations.length ? 1 : 0);
}

// ---------- 4b. determinism check: same t must paint identical pixels regardless of seek order
if (!flag("no-verify")) {
  const probes = [0.37, 0.71, 0.97].map((p) => Math.round(p * film.duration * film.fps) / film.fps);
  for (const t of probes) {
    await seek(t); const a = await shot();
    await seek(0); await seek(film.duration / 2); await seek(Math.max(0, t - 1 / film.fps));
    await seek(t); const b = await shot();
    if (!a.equals(b)) die(`frame at ${t}s differs depending on seek order — state is carried between frames`);
  }
}

// ---------- 4c. full render -> ffmpeg (H.264 yuv420p CRF 16)
const total = Math.round(film.duration * film.fps);
const args = ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(film.fps), "-c:v", "png", "-i", "-"];
if (mixPath) args.push("-i", mixPath);
args.push("-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-pix_fmt", "yuv420p", "-r", String(film.fps));
if (mixPath) args.push("-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-shortest");
args.push("-movflags", "+faststart", out);
const ff = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((res, rej) => ff.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
const t0 = Date.now();
for (let i = 0; i < total; i++) {
  await seek(i / film.fps);
  const buf = await shot();
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % film.fps === 0) process.stdout.write(`\rframe ${i}/${total}`);
}
ff.stdin.end();
await done;
await browser.close();
process.stdout.write(`\rframe ${total}/${total} in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
report();
console.log(`video: ${out}\nNext: bash scripts/qa.sh ${path.relative(process.cwd(), out)}`);
process.exit(violations.length ? 1 : 0);

function report() {
  if (violations.length) console.error(`render contract / load problems:\n  ${[...new Set(violations)].join("\n  ")}`);
}

// ---------- picture-derived sound cues
function sub16(B) { return B.flatMap((t, i) => (i + 1 < B.length ? [0, 1, 2, 3].map((k) => t + ((B[i + 1] - t) * k) / 4) : [t])); }
// Measure every [data-sfx] element each frame: how much of it is actually visible (opacity, clipping by
// overflow masks, the viewport, stroke draw-on), where it is, how big it is. Its on-screen moment becomes a cue.
async function deriveCues(page, film, beats) {
  const fps = film.fps, total = Math.round(film.duration * fps), frame = 1 / fps;
  await page.evaluate(() => {
    window.__measureSfx = () => {
      const W = innerWidth, H = innerHeight, out = [];
      document.querySelectorAll("[data-sfx]").forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        let x0 = Math.max(r.left, 0), y0 = Math.max(r.top, 0), x1 = Math.min(r.right, W), y1 = Math.min(r.bottom, H), op = 1;
        for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
          const cs = getComputedStyle(e);
          op *= parseFloat(cs.opacity);
          if (cs.display === "none" || cs.visibility === "hidden") op = 0;
          if (e !== el && !(e instanceof SVGElement) && cs.overflow !== "visible") {
            const pr = e.getBoundingClientRect();
            x0 = Math.max(x0, pr.left); y0 = Math.max(y0, pr.top); x1 = Math.min(x1, pr.right); y1 = Math.min(y1, pr.bottom);
          }
        }
        const full = r.width * r.height;
        let v = full < 1 ? 0 : (op * Math.max(0, x1 - x0) * Math.max(0, y1 - y0)) / full;
        const cs = getComputedStyle(el), da = parseFloat(cs.strokeDasharray);
        if (da > 0) v *= Math.min(1, Math.max(0, 1 - (parseFloat(cs.strokeDashoffset) || 0) / da));
        out.push({ id: el.id || `${el.tagName.toLowerCase()}[${idx}]`, kind: el.dataset.sfx, at: el.dataset.sfxAt || "start",
          gain: parseFloat(el.dataset.sfxGain || "1"), v, cx: (r.left + r.right) / 2 / W, area: full / (W * H) });
      });
      return out;
    };
  });
  const prev = new Map(), events = [];
  for (let i = 0; i <= total; i++) {
    const t = Math.min(i, total - 1) / fps;
    if (i === total) break;
    await page.evaluate(async (tt) => { await window.seek(tt); }, t);
    for (const m of await page.evaluate(() => window.__measureSfx())) {
      const before = prev.get(m.id) ?? 0, thr = m.at === "land" ? 0.97 : 0.02;
      if (before < thr && m.v >= thr) {
        const pan = Math.max(-0.8, Math.min(0.8, (m.cx - 0.5) * 1.4));
        const gain = Math.min(1, Math.max(0.3, 0.4 + 2.2 * Math.sqrt(m.area))) * m.gain;
        events.push({ t, sfx: m.kind, gain: +gain.toFixed(3), pan: +pan.toFixed(3), source: `picture:${m.id}` });
      }
      prev.set(m.id, m.v);
    }
  }
  // merge same-kind hits within 60 ms (a stagger of ten nodes is one gesture, not ten clicks)
  events.sort((a, b) => a.t - b.t);
  const merged = [];
  for (const e of events) {
    const last = merged.findLast((m) => m.sfx === e.sfx && e.t - m.t <= 0.06);
    if (last) { last.n = (last.n || 1) + 1; last.gain = Math.min(1.2, Math.max(last.gain, e.gain) * 1.08); last.pan = +((last.pan + e.pan) / 2).toFixed(3); last.source += `+${e.source.split(":")[1]}`; }
    else merged.push({ ...e });
  }
  // put hits on the measured grid: within 1.5 frames -> snap the sound to the grid point; further -> warn
  const B = beats.beats || [];
  const grid = sub16(B); // beats, 8ths and 16ths of the measured grid
  for (const c of merged) {
    if (!grid.length) break;
    const g = grid.reduce((best, x) => (Math.abs(x - c.t) < Math.abs(best - c.t) ? x : best), grid[0]);
    const off = c.t - g;
    if (Math.abs(off) <= 1.5 * frame) { c.t = +g.toFixed(4); c.grid = "on"; }
    else c.grid = `${off > 0 ? "+" : ""}${Math.round(off * 1000)}ms`;
  }
  return merged;
}

function printCues(list) {
  if (!list.length) { console.log("cues: none (tag on-screen actions with data-sfx, or set window.CUES)"); return; }
  console.log("cues (t · sfx · gain · pan · grid · source):");
  for (const c of list) console.log(`  ${c.t.toFixed(3).padStart(7)}s  ${String(c.sfx).padEnd(7)} ${(c.gain ?? 1).toFixed(2)}  ${(c.pan ?? 0) >= 0 ? " " : ""}${(c.pan ?? 0).toFixed(2)}  ${(c.grid ?? "-").padEnd(7)} ${c.source}`);
  const off = list.filter((c) => c.grid && c.grid !== "on");
  if (off.length) console.log(`  WARNING: ${off.length} on-screen moment(s) fall off the 16th-note grid; move the animation onto it:\n    ${off.map((c) => `${c.t.toFixed(2)}s ${c.source} (${c.grid})`).join("\n    ")}`);
}

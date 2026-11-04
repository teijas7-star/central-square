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
// Options: --out <file.mp4>  --audio <track>  --sheet  --crf 16  --no-verify  --no-audio  --every <n beats>
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
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
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
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
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
  const cues = (await page.evaluate(() => window.CUES || [])).filter((c) => c.t >= 0 && c.t < film.duration);
  fs.writeFileSync(path.join(audioDir, "cues.json"), JSON.stringify(cues, null, 2));
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

// ---------- 4a. review sheet: one frame per beat
if (flag("sheet")) {
  const every = Number(opt("every", 1));
  const grid = beats.beats.length ? beats.beats : Array.from({ length: Math.ceil(film.duration / 0.6) }, (_, i) => i * 0.6);
  const picks = grid.map((t, i) => ({ t, i })).filter(({ t, i }) => t < film.duration && i % every === 0);
  picks.push({ t: Math.max(0, film.duration - 1 / film.fps), i: -1 }); // always show the last frame
  const times = picks.map((p) => p.t);
  const down = new Set((beats.downbeats || []).map((t) => t.toFixed(3)));
  const dir = path.join(path.dirname(out), `${name}.sheet`);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cells = [];
  for (const [i, t] of times.entries()) {
    await seek(t);
    const f = path.join(dir, `beat-${String(i).padStart(3, "0")}.png`);
    fs.writeFileSync(f, await shot());
    cells.push({ f: path.basename(f), t, label: picks[i].i < 0 ? "end" : `beat ${picks[i].i}${down.has(t.toFixed(3)) ? " · DOWNBEAT" : ""}` });
  }
  const cols = film.width >= film.height ? 4 : 6;
  const cw = film.width >= film.height ? 480 : 260;
  const ch = Math.round((cw * film.height) / film.width);
  const fonts = path.join(STUDIO, "brand", "fonts");
  const html = `<!doctype html><html><head><style>
    @font-face{font-family:Inter;src:url("${pathToFileURL(path.join(fonts, "inter-latin-500-normal.woff2")).href}")}
    body{margin:0;background:#111;font-family:Inter,sans-serif;color:#ddd;padding:16px;width:${cols * (cw + 12) + 20}px}
    h1{font-size:15px;font-weight:500;margin:0 0 12px;color:#fafafa} .g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:12px}
    figure{margin:0} img{width:${cw}px;height:${ch}px;display:block;border-radius:4px;background:#000}
    figcaption{font-size:12px;padding:5px 2px;color:#a3a3a3} figcaption b{color:#f59e0b;font-weight:500}
    </style></head><body><h1>${name} · ${film.width}×${film.height} · ${film.duration}s · ${beats.tempo_bpm} BPM (${beats.source}) · ${times.length} frames</h1><div class="g">
    ${cells.map((c) => `<figure><img src="${c.f}"><figcaption><b>${c.t.toFixed(2)}s</b> · ${c.label}</figcaption></figure>`).join("")}
    </div></body></html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  const sp = await browser.newPage({ viewport: { width: cols * (cw + 12) + 20, height: 400 } });
  await sp.goto(pathToFileURL(path.join(dir, "index.html")).href);
  await sp.evaluate(() => document.fonts.ready);
  const sheet = path.join(path.dirname(out), `${name}.beats.png`);
  await sp.screenshot({ path: sheet, fullPage: true });
  await browser.close();
  report();
  console.log(`sheet: ${sheet}\nNow LOOK at it and score it (SCORECARD.md) before any full render.`);
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

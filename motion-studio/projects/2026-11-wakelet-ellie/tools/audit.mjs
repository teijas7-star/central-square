// Rule audit for the Wakelet × Ellie film.
//   node tools/audit.mjs [WxH]            DOM checks every frame: headline words on screen (≤5), palette of styled colours
//   node tools/audit.mjs --video out.mp4  pixel checks: longest static stretch (must be ≤20 frames except the final 2 s)
import { chromium } from "/home/user/central-square/motion-studio/node_modules/playwright/index.mjs";
import { spawnSync } from "node:child_process";
import path from "node:path";
const argv = process.argv.slice(2);
const film = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../film.html");

if (argv[0] === "--video") {
  // per-frame mean absolute difference via ffmpeg; a frame is "static" if it barely changes from the previous one
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", argv[1], "-vf", "scale=96:54:flags=area,format=gray,tblend=all_mode=difference,signalstats,metadata=mode=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 26 });
  const vals = [...(r.stderr + r.stdout).matchAll(/YAVG=([\d.]+)/g)].map((m) => +m[1]);
  const fps = 30, total = vals.length, endHold = total - 2 * fps;
  let run = 0, worst = { len: 0, at: 0 };
  // downscaled to 96x54 so grain mostly averages out. Measured grain-only frame difference (identical content, new grain
  // tile) is 0.26-0.33; "static" = changing less than 1.5x that floor, i.e. nothing but grain is moving.
  const thr = 0.5;
  vals.forEach((v, i) => { if (v <= thr && i < endHold) { run++; if (run > worst.len) worst = { len: run, at: (i - run + 1) / fps }; } else run = 0; });
  console.log(`frames ${total}; longest static run before the end hold: ${worst.len} frames at ${worst.at.toFixed(2)}s -> ${worst.len <= 20 ? "PASS" : "FAIL"}`);
  process.exit(worst.len <= 20 ? 0 : 1);
}

const [w, h] = (argv[0] || "1920x1080").split("x").map(Number);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto("file://" + film); await p.evaluate(() => document.fonts.ready);
const total = await p.evaluate(() => Math.round(FILM.duration * FILM.fps));
let maxWords = 0, at = 0;
for (let f = 0; f < total; f++) {
  const n = await p.evaluate((t) => {
    seek(t);
    // headline type: visible .kh elements in the foreground, excluding the small attribution and end-card URL/subline
    const words = [...document.querySelectorAll("#fg > .kh")].filter((e) => getComputedStyle(e).display !== "none" && parseFloat(e.style.fontSize) >= 80 * Math.min(innerWidth, innerHeight) / 1080)
      .map((e) => [...e.querySelectorAll(".w")].filter((w) => { const r = w.getBoundingClientRect(), m = w.parentElement.getBoundingClientRect(); return r.bottom > m.top + 2 && r.top < m.bottom - 2; }).map((w) => w.textContent.trim()).filter(Boolean).length || (e.querySelector(".w") ? 0 : e.textContent.trim().split(/\s+/).length))
      .reduce((a, c) => a + c, 0);
    return words;
  }, f / 30);
  if (n > maxWords) { maxWords = n; at = f / 30; }
}
const colors = await p.evaluate(() => { const set = new Set(); for (const e of document.querySelectorAll("*")) { const cs = getComputedStyle(e); for (const k of ["color", "backgroundColor"]) { const v = cs[k]; if (v && !/rgba\(0, 0, 0, 0\)|transparent/.test(v)) set.add(v); } } return [...set]; });
console.log(`${w}x${h}: max headline words on screen ${maxWords} (at ${at.toFixed(2)}s) -> ${maxWords <= 5 ? "PASS" : "FAIL"}`);
console.log(`styled colours in use (${colors.length}):\n  ${colors.join("\n  ")}`);
await b.close();

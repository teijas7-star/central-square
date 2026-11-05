// Write captions.srt from film-li.html's window.CAPTIONS (the same text that is on screen).
//   node tools/srt.mjs [out.srt]
import { chromium } from "/home/user/central-square/motion-studio/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.resolve(process.argv[2] || path.join(here, "../out-li/captions.srt"));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto("file://" + path.join(here, "../film-li.html"));
const caps = await p.evaluate(() => window.CAPTIONS);
await b.close();
const ts = (s) => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
// SRT lines stay short for the LinkedIn caption box: wrap at ~38 characters, max 2 lines
const wrap = (txt) => { const words = txt.split(" "), lines = [""]; for (const w of words) { if ((lines.at(-1) + " " + w).trim().length > 38 && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = (lines.at(-1) + " " + w).trim(); } return lines; };
const blocks = [];
for (const [a, z, txt] of caps) {
  const lines = wrap(txt);
  if (lines.length <= 2) blocks.push([a, z, lines.join("\n")]);
  else { const mid = a + (z - a) * 0.5; blocks.push([a, mid, lines.slice(0, 2).join("\n")], [mid, z, lines.slice(2).join("\n")]); }
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, blocks.map(([a, z, t], i) => `${i + 1}\n${ts(a)} --> ${ts(z)}\n${t}\n`).join("\n"));
console.log(`${out}: ${blocks.length} cues`);

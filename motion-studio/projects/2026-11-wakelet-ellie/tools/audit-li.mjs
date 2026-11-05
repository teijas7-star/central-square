// LinkedIn rule audit for film-li.html.
//   node tools/audit-li.mjs 1080x1350        (or 1080x1080)
// Checks, sampled every 2nd frame; a problem must persist for 6 samples (12 frames) to count, so entrances don't trip it:
//   safe area (64 px sides/top, 120 px clear at the bottom) · on-screen text ≥ 30 px effective size
//   headline/card overlaps · ≤ 5 headline words (quote cuts excepted) · headline cap height ≥ 96 px on 4:5
//   words on screen by frame 8 · palette colours only
import { chromium } from "/home/user/central-square/motion-studio/node_modules/playwright/index.mjs";
import path from "node:path";
const film = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../film-li.html");
const [w, h] = (process.argv[2] || "1080x1350").split("x").map(Number);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto("file://" + film); await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
const total = await p.evaluate(() => Math.round(FILM.duration * FILM.fps));

const probe = (t) => p.evaluate((t) => {
  seek(t);
  const S = innerWidth / 1080, safe = { l: 64 * S - 1, r: innerWidth - 64 * S + 1, t: 64 * S - 1, b: innerHeight - 120 * S + 1 };
  const visible = (e) => { for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false; if (/inset\(100%|inset\(0px 100%|inset\(0px 0px 100%/.test(cs.clipPath)) return false; } return true; };
  const scaleOf = (e) => { const r = e.getBoundingClientRect(); return e.offsetWidth ? r.width / e.offsetWidth : 1; };
  const out = { small: [], unsafe: [], overlap: [], words: 0, quote: false, heads: [] };
  // text nodes
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode()); ) {
    const txt = n.nodeValue.trim(); if (!txt || /^[▪·|]$/.test(txt)) continue;
    const e = n.parentElement; if (!e || e.closest("script,style,svg") || !visible(e)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); let r = rg.getBoundingClientRect();
    { const mk = e.closest(".m"); if (mk) { const mr = mk.getBoundingClientRect(); r = { left: Math.max(r.left, mr.left), right: Math.min(r.right, mr.right), top: Math.max(r.top, mr.top), bottom: Math.min(r.bottom, mr.bottom) }; r.width = r.right - r.left; r.height = r.bottom - r.top; } } // only what the mask lets through is visible
    if (r.width < 2 || r.height < 2 || r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight) continue;
    // fully hidden by a mask (words before their entrance)
    const m = e.closest(".m"); if (m) { const mr = m.getBoundingClientRect(); if (r.bottom <= mr.top + 2 || r.top >= mr.bottom - 2) continue; }
    // inside a card that is being cropped by a zoom (the frame itself is the window): skip text outside the viewport
    const eff = parseFloat(getComputedStyle(e).fontSize) * scaleOf(e) * (e.closest(".kh") ? 1 : scaleOf(e.closest(".card") || e) / scaleOf(e) || 1);
    const key = txt.slice(0, 40);
    if (eff < 29.5 * S) out.small.push(`${key} (${eff.toFixed(1)}px)`);
    if (r.left < safe.l || r.right > safe.r || r.top < safe.t || r.bottom > safe.b) out.unsafe.push(key);
  }
  // headlines: words, cap height, overlap with cards
  const cards = [...document.querySelectorAll(".card")].filter(visible).map((c) => c.getBoundingClientRect());
  for (const k of document.querySelectorAll("#fg > .kh")) {
    if (!visible(k) || !k.querySelector(".w")) continue;
    const ws = [...k.querySelectorAll(".w")].filter((x) => { const r = x.getBoundingClientRect(), mr = x.parentElement.getBoundingClientRect(); return r.bottom > mr.top + 2 && r.top < mr.bottom - 2; });
    if (!ws.length) continue;
    const isQuote = /[“”…]/.test(k.textContent);
    if (isQuote) out.quote = true; else out.words += ws.length;
    out.heads.push({ text: k.textContent.replace(/\s+/g, " ").trim().slice(0, 30), size: parseFloat(k.style.fontSize), quote: isQuote });
    const kr = k.getBoundingClientRect();
    for (const cr of cards) if (kr.left < cr.right && kr.right > cr.left && kr.top < cr.bottom && kr.bottom > cr.top) out.overlap.push(k.textContent.trim().slice(0, 24));
  }
  return out;
}, t);

const runs = {}, fails = { small: new Map(), unsafe: new Map(), overlap: new Map() };
let maxWords = 0, maxAt = 0, minCap = { size: 1e9, text: "" };
for (let f = 0; f < total; f += 2) {
  const o = await probe(f / 30);
  for (const k of ["small", "unsafe", "overlap"]) {
    const now = new Set(o[k]);
    for (const key of now) { const id = k + "|" + key; runs[id] = (runs[id] || 0) + 1; if (runs[id] >= 6 && !fails[k].has(key)) fails[k].set(key, ((f - 10) / 30).toFixed(2) + "s"); }
    for (const id of Object.keys(runs)) if (id.startsWith(k + "|") && !now.has(id.slice(k.length + 1))) runs[id] = 0;
  }
  if (o.words > maxWords) { maxWords = o.words; maxAt = f / 30; }
  for (const hd of o.heads) if (!hd.quote && hd.size < minCap.size) minCap = { size: hd.size, text: hd.text };
}
const f8 = await probe(8 / 30);
const colors = await p.evaluate(() => { const set = new Set(); for (const e of document.querySelectorAll("*")) { const cs = getComputedStyle(e); for (const k of ["color", "backgroundColor"]) { const v = cs[k]; if (v && !/rgba\(0, 0, 0, 0\)|transparent/.test(v)) set.add(v.replace(/rgba?\((\d+), (\d+), (\d+).*/, "$1,$2,$3")); } } return [...set]; });
const PAL = ["10,5,17", "124,94,255", "157,139,255", "198,82,63", "244,240,237", "21,15,29"];
const off = colors.filter((c) => !PAL.includes(c));
const tall = h / w > 1.12, capPx = minCap.size * 0.69; // Fraunces cap height ≈ 0.69 em
const line = (ok, msg) => console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
console.log(`== ${w}x${h}`);
line(f8.words > 0, `words on screen at frame 8 (${f8.words})`);
line(maxWords <= 5, `max headline words on screen: ${maxWords} at ${maxAt.toFixed(2)}s (quote cuts excepted)`);
line(!tall || capPx >= 96, `smallest headline: "${minCap.text}" at ${minCap.size.toFixed(0)}px, cap height ≈ ${capPx.toFixed(0)}px${tall ? " (4:5 needs ≥ 96)" : ""}`);
line(!fails.small.size, `text ≥ 30 px${fails.small.size ? ": " + [...fails.small].map(([k, v]) => `${k} @${v}`).join("; ") : ""}`);
line(!fails.unsafe.size, `inside the safe area${fails.unsafe.size ? ": " + [...fails.unsafe].map(([k, v]) => `${k} @${v}`).join("; ") : ""}`);
line(!fails.overlap.size, `no headline/card overlaps${fails.overlap.size ? ": " + [...fails.overlap].map(([k, v]) => `${k} @${v}`).join("; ") : ""}`);
line(!off.length, `palette only${off.length ? ": off-palette " + off.join(" | ") : ""} (alpha variants of palette colours allowed)`);
await b.close();

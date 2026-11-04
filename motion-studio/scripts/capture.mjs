#!/usr/bin/env node
// Capture real product UI and brand assets from a URL, so films show the actual product (never invented screens).
//
//   node scripts/capture.mjs https://centralsquare.ai --out projects/<slug>/assets/capture
//   node scripts/capture.mjs https://dashboard.centralsquare.ai --out ... --storage-state auth.json
//
// Writes, per host, into <out>/<host>/:
//   desktop-full.png, mobile-full.png        full pages (1440 wide @2x, 390 wide @3x)
//   desktop-01.png …, mobile-01.png …        viewport-by-viewport sections (ready-made shots)
//   ui-01-<tag>.png …                        large visible sections/cards cut out at @2x (UI to animate)
//   logo-*.svg|png, img-*.png|jpg            logos and content images found on the page
//   manifest.json                            title, description, colors (area-weighted), fonts, files
// Logged-in screens: export a Playwright storage state after signing in (see the motion-reel skill), pass
// --storage-state; never type credentials into a script. Pages behind auth without one are captured as-is (login).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (n, d) => { const e = argv.find((a) => a.startsWith(`--${n}=`)); if (e) return e.slice(n.length + 3); const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const url = argv.find((a) => /^https?:\/\//.test(a));
if (!url) { console.error("usage: node scripts/capture.mjs <url> [--out dir] [--storage-state auth.json] [--sections 8]"); process.exit(1); }
const host = new URL(url).host.replace(/[^a-z0-9.-]/gi, "_");
const outDir = path.resolve(opt("out", "assets/capture"), host);
const maxSections = Number(opt("sections", 8));
fs.mkdirSync(outDir, { recursive: true });

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const launchOpts = proxy && !/^https?:\/\/(localhost|127\.)/.test(url) ? { proxy: { server: proxy, bypass: "localhost,127.0.0.1" } } : {};
let browser;
try { browser = await chromium.launch(launchOpts); }
catch { browser = await chromium.launch({ ...launchOpts, executablePath: "/opt/pw-browsers/chromium" }); }
const storageState = opt("storage-state");
const files = [];
const save = (name, buf) => { fs.writeFileSync(path.join(outDir, name), buf); files.push(name); };

async function open(kind) {
  const ctx = await browser.newContext(kind === "desktop"
    ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, storageState }
    : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, storageState });
  const page = await ctx.newPage();
  // "load", then up to 8 s for the network to go quiet: apps with live connections (websockets, polling)
  // never reach networkidle, so don't wait for it forever.
  const res = await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((e) => { throw new Error(`could not load ${url}: ${e.message.split("\n")[0]}`); });
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  if (page.url() !== url) console.log(`  (${kind}) redirected to ${page.url()}`);
  if (res && res.status() >= 400) console.warn(`warning: ${url} answered HTTP ${res.status()}`);
  await page.evaluate(() => document.fonts.ready);
  // settle lazy content: walk the page once
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(120); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  return { ctx, page };
}

try {
  // ---------- desktop: full page, sections, UI cut-outs, brand data
  const { ctx, page } = await open("desktop");
  save("desktop-full.png", await page.screenshot({ fullPage: true }));
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0; i < maxSections && i * 900 < H; i++) {
    await page.evaluate((y) => scrollTo(0, y), i * 900); await page.waitForTimeout(250);
    save(`desktop-${String(i + 1).padStart(2, "0")}.png`, await page.screenshot());
  }
  await page.evaluate(() => scrollTo(0, 0));

  const info = await page.evaluate(() => {
    const meta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || null;
    const W = innerWidth, area = new Map(), fonts = new Map();
    const norm = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(",").map((x) => parseFloat(x)); if (p.length === 4 && p[3] < 0.5) return null; return "#" + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""); };
    for (const el of [document.body, ...document.querySelectorAll("body *")]) {
      const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
      const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
      const a = Math.min(r.width, W) * Math.min(r.height, 4000);
      const bg = norm(cs.backgroundColor); if (bg) area.set(bg, (area.get(bg) || 0) + a);
      if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        const fg = norm(cs.color); if (fg) area.set(fg, (area.get(fg) || 0) + a * 0.25);
        const ff = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
        const role = /^H[1-3]$/.test(el.tagName) ? "heading" : el.closest("button,a") ? "ui" : "body";
        const k = `${ff}|${role}`; fonts.set(k, (fonts.get(k) || 0) + (el.textContent || "").length);
      }
    }
    const total = [...area.values()].reduce((s, v) => s + v, 0) || 1;
    const colors = [...area.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([hex, v]) => ({ hex, share: +(v / total).toFixed(3) }));
    const fontList = [...fonts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => { const [family, role] = k.split("|"); return { family, role, chars: n }; });
    const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family.replace(/["']/g, "")} ${f.weight} ${f.style}`);
    const logos = [...document.querySelectorAll("svg,img")].filter((e) => {
      const s = `${e.id} ${e.getAttribute("class") || ""} ${e.getAttribute("alt") || ""} ${e.getAttribute("aria-label") || ""} ${e.getAttribute("src") || ""}`.toLowerCase();
      return s.includes("logo") || (e.closest("header,nav") && e.closest("a[href='/'],a[href='./'],a[href^='" + location.origin + "']"));
    }).slice(0, 6).map((e) => e.tagName.toLowerCase() === "svg" ? { kind: "svg", markup: e.outerHTML } : { kind: "img", src: e.currentSrc || e.src });
    const images = [...document.images].filter((i) => i.naturalWidth >= 300 && i.naturalHeight >= 200).slice(0, 30).map((i) => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt }));
    const headings = [...document.querySelectorAll("h1,h2,h3")].map((h) => h.textContent.trim().replace(/\s+/g, " ")).filter(Boolean).slice(0, 20);
    return { title: document.title, description: meta("description") || meta("og:description"), ogImage: meta("og:image"), colors, fonts: fontList, fontFacesLoaded: [...new Set(loaded)].slice(0, 20), logos, images, headings };
  });

  // UI cut-outs: big visible blocks (sections, cards, panels, tables, charts)
  const blocks = await page.$$("main > *, section, [class*='card' i], [class*='panel' i], table, [role='region'], [class*='chart' i]");
  let n = 0;
  for (const b of blocks) {
    if (n >= 16) break;
    const box = await b.boundingBox(); if (!box || box.width < 280 || box.height < 160 || box.height > 2600) continue;
    const tag = (await b.evaluate((e) => (e.getAttribute("class") || e.tagName).split(/\s+/)[0])).replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "block";
    try { save(`ui-${String(++n).padStart(2, "0")}-${tag}.png`, await b.screenshot()); } catch { n--; }
  }

  // logos and images (fetched through the same browser context, so proxy/auth apply)
  const ext = (ct, src) => (/svg/.test(ct) ? "svg" : /png/.test(ct) ? "png" : /webp/.test(ct) ? "webp" : /jpe?g/.test(ct) || /\.jpe?g/i.test(src) ? "jpg" : "bin");
  for (const [i, l] of info.logos.entries()) {
    if (l.kind === "svg") save(`logo-${i + 1}.svg`, `<?xml version="1.0" encoding="UTF-8"?>\n${l.markup.includes("xmlns=") ? l.markup : l.markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')}`);
    else { const r = await ctx.request.get(l.src).catch(() => null); if (r?.ok()) save(`logo-${i + 1}.${ext(r.headers()["content-type"] || "", l.src)}`, await r.body()); }
  }
  for (const [i, im] of info.images.entries()) {
    if (im.src.startsWith("data:")) continue;
    const r = await ctx.request.get(im.src).catch(() => null);
    if (r?.ok()) save(`img-${String(i + 1).padStart(2, "0")}.${ext(r.headers()["content-type"] || "", im.src)}`, await r.body());
  }
  await ctx.close();

  // ---------- mobile: full page + sections
  const m = await open("mobile");
  save("mobile-full.png", await m.page.screenshot({ fullPage: true }));
  const MH = await m.page.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0; i < Math.min(maxSections, 6) && i * 844 < MH; i++) {
    await m.page.evaluate((y) => scrollTo(0, y), i * 844); await m.page.waitForTimeout(250);
    save(`mobile-${String(i + 1).padStart(2, "0")}.png`, await m.page.screenshot());
  }
  await m.ctx.close();

  const manifest = { url, capturedAt: new Date().toISOString(), authenticated: !!storageState, ...info, logos: info.logos.map((l) => l.kind), files };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`captured ${url} -> ${path.relative(process.cwd(), outDir)}/`);
  console.log(`  title: ${info.title}`);
  console.log(`  colors: ${info.colors.slice(0, 8).map((c) => `${c.hex} ${(c.share * 100).toFixed(0)}%`).join(", ")}`);
  console.log(`  fonts: ${info.fonts.map((f) => `${f.family} (${f.role})`).join(", ")}`);
  console.log(`  files (${files.length}):\n    ${files.join("\n    ")}`);
} catch (e) {
  console.error(`capture failed: ${e.message}`);
  if (/ERR_TUNNEL_CONNECTION_FAILED|ERR_PROXY|403/.test(e.message)) console.error("The environment's network policy may be blocking this host: add it under Allowed domains in the cloud environment settings.");
  process.exitCode = 1;
} finally {
  await browser.close();
}

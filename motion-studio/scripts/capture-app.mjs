#!/usr/bin/env node
// Read-only crawl of a logged-in web app (e.g. dashboard.centralsquare.ai) for real product shots.
//   node scripts/capture-app.mjs https://dashboard.centralsquare.ai/ --storage-state auth.json --out projects/<slug>/assets/capture/app [--max 60]
// Follows same-origin <a href> links only. Never clicks buttons, never submits forms, and skips any URL that
// looks like it changes state (logout, delete, approve, send, oauth, impersonate, api, join/invite tokens).
// Writes per page: <slug>.png (viewport @2x), <slug>-full.png (full page @2x), and pages.json (url, title, text, links).
// Output contains private data: it lives under assets/capture/ (gitignored). Never commit the storage state.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (n, d) => { const e = argv.find((a) => a.startsWith(`--${n}=`)); if (e) return e.slice(n.length + 3); const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const start = argv.find((a) => /^https?:\/\//.test(a));
const state = opt("storage-state");
if (!start || !state) { console.error("usage: node scripts/capture-app.mjs <url> --storage-state auth.json --out dir [--max 60]"); process.exit(1); }
const out = path.resolve(opt("out", "app-capture")); const max = Number(opt("max", 60));
fs.mkdirSync(out, { recursive: true });
const origin = new URL(start).origin;
const UNSAFE = /logout|log-out|signout|sign-out|delete|remove|approve|send|unsubscribe|oauth|\/auth\/|impersonate|\/api\/|\/join\/|\/l\/|billing\/checkout|invite/i;

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const lo = proxy ? { proxy: { server: proxy } } : {};
let browser;
try { browser = await chromium.launch(lo); } catch { browser = await chromium.launch({ ...lo, executablePath: "/opt/pw-browsers/chromium" }); }
const ctx = await browser.newContext({ storageState: state, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const norm = (u) => { try { const x = new URL(u, origin); x.hash = ""; return x.origin === origin ? x.href : null; } catch { return null; } };
const page = await ctx.newPage();
const queue = [norm(start)], seen = new Set(queue), pages = [];
while (queue.length && pages.length < max) {
  const url = queue.shift();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500); // let charts and lazy panels settle
    const final = page.url();
    const data = await page.evaluate(() => ({
      title: document.title,
      text: (document.querySelector("main") || document.body).innerText.slice(0, 6000),
      links: [...document.querySelectorAll("a[href]")].map((a) => a.href),
    }));
    const slug = new URL(final).pathname.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 80) || "root";
    if (!pages.some((p) => p.slug === slug)) {
      await page.screenshot({ path: path.join(out, `${slug}.png`) });
      await page.screenshot({ path: path.join(out, `${slug}-full.png`), fullPage: true }).catch(() => {});
      pages.push({ url: final, slug, title: data.title, text: data.text, links: [...new Set(data.links.map(norm).filter(Boolean))] });
      console.log(`ok  ${final}`);
    }
    for (const l of data.links.map(norm).filter(Boolean)) if (!seen.has(l) && !UNSAFE.test(l)) { seen.add(l); queue.push(l); }
  } catch (e) { console.log(`err ${url}  ${e.message.split("\n")[0]}`); }
}
fs.writeFileSync(path.join(out, "pages.json"), JSON.stringify(pages, null, 2));
await browser.close();
console.log(`${pages.length} pages -> ${path.relative(process.cwd(), out)}/`);

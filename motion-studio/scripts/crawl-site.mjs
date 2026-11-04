#!/usr/bin/env node
// Crawl a public site (same origin) and extract structured text per page, for knowledge graphs and briefs.
//   node scripts/crawl-site.mjs https://centralsquare.ai/ --out projects/<slug>/docs/site [--max 60]
// Writes <out>/pages.json: [{ url, title, description, headings:[{level,text}], blocks:[text], links:[url],
//   images:[{src,alt}], stats:[sentences with numbers], quotes:[blockquote text] }] and a screenshot per page.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (n, d) => { const e = argv.find((a) => a.startsWith(`--${n}=`)); if (e) return e.slice(n.length + 3); const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const start = argv.find((a) => /^https?:\/\//.test(a));
if (!start) { console.error("usage: node scripts/crawl-site.mjs <url> [--out dir] [--max 60]"); process.exit(1); }
const out = path.resolve(opt("out", "site")); const max = Number(opt("max", 60));
fs.mkdirSync(path.join(out, "shots"), { recursive: true });
const origin = new URL(start).origin;
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
let browser;
const lo = proxy ? { proxy: { server: proxy } } : {};
try { browser = await chromium.launch(lo); } catch { browser = await chromium.launch({ ...lo, executablePath: "/opt/pw-browsers/chromium" }); }
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const norm = (u) => { try { const x = new URL(u, origin); x.hash = ""; x.search = ""; return x.origin === origin ? x.href.replace(/\/$/, "") || x.href : null; } catch { return null; } };
const queue = [norm(start)], seen = new Set(queue), pages = [];
while (queue.length && pages.length < max) {
  const url = queue.shift();
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: "load", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
    if (!res || res.status() >= 400 || !(res.headers()["content-type"] || "").includes("html")) { await page.close(); continue; }
    const data = await page.evaluate(() => {
      const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
      const meta = (n) => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || null;
      const main = document.querySelector("main") || document.body;
      const headings = [...main.querySelectorAll("h1,h2,h3,h4")].map((h) => ({ level: +h.tagName[1], text: clean(h.innerText) })).filter((h) => h.text);
      const blocks = [...main.querySelectorAll("p,li,blockquote,figcaption,td,dt,dd")].map((e) => clean(e.innerText)).filter((t) => t.length > 2);
      const uniq = [...new Set(blocks)];
      const quotes = [...main.querySelectorAll("blockquote,q,[class*='quote' i]")].map((e) => clean(e.innerText)).filter((t) => t.length > 20);
      const stats = uniq.filter((t) => /\d/.test(t) && /(%|x\b|×|hours?|days?|weeks?|months?|members?|minutes?|\$|k\b|half)/i.test(t)).slice(0, 40);
      return { title: document.title, description: meta("description") || meta("og:description"), headings, blocks: uniq, quotes: [...new Set(quotes)],
        stats, links: [...document.querySelectorAll("a[href]")].map((a) => a.href), images: [...document.images].filter((i) => i.naturalWidth > 120).map((i) => ({ src: i.currentSrc || i.src, alt: i.alt })) };
    });
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home";
    await page.screenshot({ path: path.join(out, "shots", `${slug}.png`), fullPage: true }).catch(() => {});
    pages.push({ url, slug, ...data, links: [...new Set(data.links.map(norm).filter(Boolean))] });
    for (const l of pages.at(-1).links) if (!seen.has(l) && !/\.(pdf|png|jpe?g|svg|webp|zip|xml)$/i.test(l)) { seen.add(l); queue.push(l); }
    console.log(`ok  ${url}  (${data.headings.length} headings, ${data.blocks.length} blocks)`);
  } catch (e) { console.log(`err ${url}  ${e.message.split("\n")[0]}`); }
  await page.close();
}
fs.writeFileSync(path.join(out, "pages.json"), JSON.stringify(pages, null, 2));
await browser.close();
console.log(`${pages.length} pages -> ${path.relative(process.cwd(), out)}/pages.json`);

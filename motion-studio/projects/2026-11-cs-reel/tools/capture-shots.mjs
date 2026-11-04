// Hero product shots for the Wakelet-structured reel, from the logged-in dashboard, with PII blurred in the DOM.
// Read-only: navigates and expands view-only disclosures ("Possible matches/duplicates"); never clicks actions.
//   node tools/capture-shots.mjs <auth.json> https://dashboard.centralsquare.ai/<community>
import { chromium } from "/home/user/central-square/motion-studio/node_modules/playwright/index.mjs";
import fs from "node:fs";
const AUTH = process.argv[2], BASE = process.argv[3] || process.env.CS_COMMUNITY_URL; // e.g. https://dashboard.centralsquare.ai/<community>
const OUT = "assets/ui-app"; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", proxy: { server: process.env.HTTPS_PROXY } });
const c = await b.newContext({ storageState: AUTH, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await c.newPage();
const go = async (path) => { await p.goto(BASE + path, { waitUntil: "load" }); await p.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(1800); };

// names to blur: every member on People, plus prospects/customers named in approvals and the sidebar
await go("/members");
// rows read as: [initials] · name · account(s) · messages · last active. A name is the line right before an account label.
let names = await p.evaluate(() => {
  const L = (document.querySelector("main") || document.body).innerText.split("\n").map((s) => s.trim()).filter(Boolean);
  const ACC = /^(WhatsApp|Slack|Discord|Email|Gmail|Reddit|Circle|YouTube|LinkedIn|Instagram|Twitter\/X|X|Teams|Telegram|HubSpot)(\s*·.*)?$/;
  return L.filter((s, i) => i + 1 < L.length && ACC.test(L[i + 1]) && !ACC.test(s) && s.length < 40 && !/^\d/.test(s));
});
console.log("people names found:", names.length);
names = names.flatMap((n) => [n, n.split(/\s+/)[0]]).map((s) => s.replace(/[^\p{L}\p{N} .'-]/gu, "").trim()).filter((s) => s.length > 2 && !/^teijas$/i.test(s));
// extra names to blur (prospects, private groups) live outside git: assets/ui-app/extra-redactions.json
const EXTRA = fs.existsSync(`${OUT}/extra-redactions.json`) ? JSON.parse(fs.readFileSync(`${OUT}/extra-redactions.json`, "utf8")) : [];
const BLUR = [...new Set([...names, ...EXTRA])].sort((a, b) => b.length - a.length);
fs.writeFileSync(`${OUT}/redacted-terms.json`, JSON.stringify(BLUR, null, 1));
console.log(`blurring ${BLUR.length} terms + phones + emails`);

async function redact() {
  await p.evaluate((terms) => {
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(\\+?\\d[\\d ()\\-]{7,}\\d|[\\w.+-]+@[\\w-]+\\.[\\w.]+|\\b(?:${terms.map(esc).join("|")})\\b)`, "g");
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let n; (n = walker.nextNode()); ) { if (re.test(n.nodeValue) && !n.parentElement.closest("script,style")) hits.push(n); re.lastIndex = 0; }
    for (const n of hits) {
      const span = document.createElement("span");
      span.innerHTML = n.nodeValue.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])).replace(re, (m) => `<span style="filter:blur(5px);">${m}</span>`);
      n.parentNode.replaceChild(span, n);
    }
    // avatars with initials/photos next to people: soften
    document.querySelectorAll("img[src*='avatar'], img[alt]:not([alt=''])").forEach((i) => { if (i.width < 64) i.style.filter = "blur(4px)"; });
  }, BLUR);
  await p.waitForTimeout(300);
}
const shot = async (name, clip) => { await redact(); await p.screenshot({ path: `${OUT}/${name}.png`, ...(clip ? { clip } : {}) }); console.log("shot", name); };
const el = async (name, locator) => { await redact(); const h = await locator.first().elementHandle(); if (!h) { console.log("missing", name); return; } await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await h.screenshot({ path: `${OUT}/${name}.png` }); console.log("el", name); };

// 1 · Sources: where the answers live (connected apps)
await go("/settings/connected-apps"); await shot("connected-apps");
// 2 · One person, many accounts: People + possible duplicates
await go("/members"); await shot("people");
const dup = p.getByText(/Possible duplicates/i); if (await dup.count()) { await dup.first().click().catch(() => {}); await p.waitForTimeout(1500); await shot("people-duplicates"); }
// 3 · Ellie keeps watch: a project with sources + scheduled tasks
await go("/ellie/projects/agent_project_4576f666-8c2b-4207-9c7a-2c37d7712a1b"); await shot("project");
await go("/ellie/projects/agent_project_455b9c59-81cb-4163-9ff1-0c11f3fae377"); await shot("project-2");
// 4 · Ask Ellie
await go("/ellie"); await shot("ellie-chat");
// 5 · You approve: waiting on you + possible matches
await go("/approvals"); await shot("approvals");
const pm = p.getByText(/Possible matches/i); if (await pm.count()) { await pm.first().click().catch(() => {}); await p.waitForTimeout(1500); await shot("approvals-matches"); }
await b.close();

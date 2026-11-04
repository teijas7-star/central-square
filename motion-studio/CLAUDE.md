# Central Square AI — Motion Studio House Rules

Every video made in this folder follows these rules. They override any skill's defaults when they conflict.
The owner is Teijas (teijas@centralsquare.ai). If a rule blocks something they explicitly asked for, say so and ask. Don't quietly break the rule.

---

## 1. Who we are on screen

**Central Square AI** is the AI-powered hub for community operators: events, engagement, analytics, sponsor matching and member management in one place. It replaces the WhatsApp + Discord + Notion + Eventbrite patchwork.
Tagline: **"A digital agora where communities thrive."** The product has two layers: **The Square** (public discovery) and **The Arcades** (community homes).
Buyers: community leads at enterprises and mid-size SaaS companies, universities, foundations and professional associations. We are not aiming at hobbyist groups.
Product source of truth: `../claude.md`, `../business_plan.md`, `../app/partner/page.tsx`. Read them before writing any copy.

**Voice:** human, warm, civic, confident. Short declarative lines. No hype words ("revolutionary", "game-changing", "unlock", "supercharge", "seamless", "leverage"). No exclamation marks. Speak to the operator ("your members", "your sponsors").

**Look** (tokens in `brand/tokens.css` and `brand/brand.json`):
- Ground: near-black `#0B0B0B` (`#000`, `#171717`, `#262626` for layers). Ink: `#FAFAFA`, muted `#A3A3A3`.
- **Amber `#F59E0B` is the only accent. Use it for one thing per frame**: the key word, the active node, or the CTA. Never more than one.
- Green `#22C55E` means "live/online" only.
- Display type: **Playfair Display** (600 for headlines, 400 italic for the emphasis word). Body/UI/captions: **Inter** 400–600. No other families.
- Visual metaphor: **networks and constellations** (warm points of light joined by thin lines) and **the public square**. Repo imagery: `../public/images/city-square.png`, `../public/images/earth-from-space.png`, `../public/design/boston-skyline.jpg`.
- Aesthetic: lived-in, warm, spacious, never sterile-corporate. Dark theme. Generous negative space.
- **There is no logo file in the repo yet.** Until one is added to `brand/`, the lockup is the wordmark "Central Square AI" set in Inter 500 with 0.32em tracking, uppercase, muted ink, over the amber constellation hub. Never invent a logo mark.

## 2. Truth rules (non-negotiable)

1. **Every factual claim on screen needs a source**, listed in the project's `BRIEF.md` "Sources" table. That covers numbers, customer names, quotes and outcomes. If there's no source, cut the claim or ask.
2. **Adobe, Microsoft and the Aspen Institute are targets in the business plan, not customers.** Never show their names or logos, or imply a partnership, unless Teijas confirms in writing for that video.
3. No invented testimonials, metrics, logos, user counts or UI that doesn't exist. Use real product screens (capture the running app or `npx hyperframes capture <url>`). Label mocked or future UI on screen as "Concept" or "Coming soon".
4. No cloned voices, avatars or likenesses of real people without their recorded consent. No content imitating another brand's look.
5. `/reverse-any-video` and `/style-sampling` are for learning a technique or porting our own work. Never ship a recreation of someone else's video.

## 3. Which tool (route)

| Job | Use | Notes |
|---|---|---|
| Anything by default: promos, explainers, social clips, title cards, data stories, captions | **HyperFrames** (`/hyperframes` first, then `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`) | Pinned to the version in `package.json` → `hyperframesVersion`. Always `npx --yes hyperframes@<that version>`. |
| Reusing real React components from `../components` / `../app`, or batch-rendering many data-driven variants | **Remotion** (`/remotion-best-practices` routes to the rest) | Remotion needs a paid company license once we have more than 3 people. Run `/remotion-license` and confirm with Teijas before using it on anything that ships. |
| Hand-drawn storybook / ink-and-watercolour explainer | **claude-animation** plugin skill | Node canvas + ffmpeg, frame-exact, synthesized sound. |
| A live-presented deck | `/slideshow` | |
| A Figma frame, brand asset or storyboard | `/figma` (the Figma MCP connector is available) | |

Start a new HyperFrames video with **`bash scripts/new-video.sh <slug> [landscape|portrait|square]`**, never a bare `hyperframes init`. The scaffold carries the brand fonts, local GSAP, the branded end card and `BRIEF.md`.

## 4. Work loop (every video)

1. **Brief.** Fill in `projects/<slug>/BRIEF.md` with Teijas, or draft it from their notes and confirm. Settle the one thing, the audience, the channel and the CTA before building anything.
2. **Storylines.** Offer three genuinely different storylines in words only (see the hyperframes `references/story.md`). Teijas picks one, unless they said "no stops".
3. **SPEC.md.** Turn every adjective into a number: durations, type sizes, eases, colors and shot list by frame/second. Name the defaults we're banning.
4. **Sound plan.** For music, run `python3 scripts/analyze_audio.py assets/audio/<track> --fps 30 --out beats.json` (or `npx hyperframes beats`). Cuts land on beats, and big reveals land on downbeats or strong onsets.
5. **Build** scene by scene in `compositions/`. Search `/hyperframes-registry` before hand-building any named effect.
6. **Check:** `npm run check` until it reports 0 errors and 0 warnings. Weigh every warning; never silence one blindly.
7. **Look:** `npm run snapshot` and actually read the frames. Write `REVIEW.md` per the hyperframes `references/review.md`.
8. **Preview → approval → render:** `npm run render`, which uses `--quality delivery`.
9. **QA:** `bash ../../scripts/qa.sh renders/<file>.mp4`. Open the contact sheet it writes and look at every frame. Fix and re-render until it passes.
10. **Deliver:** name the file `cs-<slug>-<W>x<H>-v<N>.mp4`. Report the path, the duration, the QA output and anything that's still a judgment call.

"Done" means steps 6–9 passed **and** you looked at the frames yourself. Never say a video is done from a successful exit code alone.

## 5. Craft bar (the numbers)

- **One idea per shot.** If a frame needs two sentences, it's two shots.
- **Reading time:** hold text on screen for at least 0.4 s + 0.3 s per word, and at least 1.2 s for anything readable.
- **Type minimums** (at 1080 on the short side): headline ≥ 7vmin, body ≥ 3vmin, captions ≥ 3.6vmin, with nothing smaller than 2.4vmin. Max 7 words per caption line, 2 lines.
- **Safe areas:** all content in the 90% action-safe box and all text in the 80% title-safe box. For 9:16 social, also keep the bottom 20% and right 12% clear of key text (platform UI).
- **Motion:** entrances 0.4–0.9 s on `expo.out`/`power3.out`, and moves on `power3.inOut`. No linear moves except slow drifts and pushes (≤ 3% scale over ≥ 2 s). No bounce/elastic on text; `back.out` is for small UI pops only. Stagger 50–90 ms. Never animate everything at once.
- **Pacing:** social cuts every 1.5–3 s; explainers 3–6 s per beat. Open on the hook in the first 1.0 s, with no slow logo intro. The end card is the last 2.5–4 s and uses the CTA.
- **Color:** amber only once per frame. Check contrast (HyperFrames check runs WCAG AA, and it must pass).
- **Sound** (any film over ~15 s): music + SFX on visible actions. Mix to **−14 LUFS integrated, true peak ≤ −1 dBTP**, with voice 6–9 dB above the music bed. Use only licensed or royalty-free music, and record its license in `BRIEF.md`.
- **Captions** are on by default for social (burned in, Inter 600, white with a subtle dark plate). Off for website hero loops.

## 6. Formats

| Channel | Size | Length | Notes |
|---|---|---|---|
| LinkedIn / X feed | 1080×1080 or 1080×1920 | 15–45 s | Captions on; hook in 1 s; works with sound off |
| Website hero loop | 1920×1080 | 6–12 s | Silent, seamless loop, no captions |
| Explainer / sales email | 1920×1080 | 60–90 s | VO + captions, chaptered beats |
| Pitch / event screen | 1920×1080 (or 3840×2160) | as needed | Big type, slower pace |

Delivery codec: H.264, yuv420p, 30 fps, AAC 48 kHz (HyperFrames' delivery preset). Use ProRes/MOV only when someone asks for an editable master or alpha.

## 7. Technical rules for this repo

- **No network at render time.** Fonts come from `brand/fonts/` → `assets/fonts/`, and GSAP from `brand/vendor/gsap.min.js` → `assets/vendor/`. Never reference a CDN in a composition: headless renders here can't reach it and the render fails.
- Each scene repeats the `@font-face` block it uses (HyperFrames lint requires it in the file). Copy it from `brand/tokens.css`.
- Lay out in **vmin** so a scene reflows across 16:9, 9:16 and 1:1.
- Everything visible is a function of timeline time: no `Math.random()` without a seed, no `Date.now()`, no timers.
- Environment setup: `bash scripts/setup.sh` (idempotent). **Run it first in every new cloud session** if `python3 -c "import librosa"` fails or `node_modules/` is missing, because cloud containers start fresh.
- In the cloud container, Playwright's bundled browser differs from the npm package. Launch with `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`. HyperFrames finds Chrome by itself.
- Optional local tools not installed by default: whisper-cpp (transcription), Kokoro TTS and MusicGen (`npx hyperframes doctor` shows install lines). HeyGen features cost money, so ask before using them.
- **Git:** commit sources (`projects/<slug>/` HTML, BRIEF, SPEC, REVIEW, small assets). Never commit renders, snapshots or large media: `renders/` and `.hyperframes/` are gitignored, and any asset over 10 MB needs Teijas's OK. Hand finished videos over as files, not commits.
- Skills are vendored in `.claude/skills/` (lock: `skills-lock.json`). Update them with `npx skills update` or `npx hyperframes update`, then re-run a smoke render before committing.

## 8. Layout

```
motion-studio/
  CLAUDE.md            ← these rules
  brand/               tokens.css, brand.json, fonts/, vendor/gsap.min.js
  templates/           cs-endcard/ (branded HyperFrames starter), BRIEF.md
  scripts/             setup.sh, new-video.sh, analyze_audio.py, qa.sh
  assets/              shared music/, sfx/, footage/, images/ (licensed, sourced)
  projects/<slug>/     one folder per video (slug: yyyy-mm-short-name)
  .claude/skills/      Remotion + HyperFrames skills (vendored)
```

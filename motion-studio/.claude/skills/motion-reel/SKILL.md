---
name: motion-reel
description: Make a Central Square AI product reel or showreel rendered from code (window.seek(t) films). Use when the user asks for a launch video, showreel, product reel, animated explainer or motion ad, for Central Square AI or its dashboard.
---

# Motion reel

Everything here runs from `motion-studio/` (`cd motion-studio` first), and **follows `motion-studio/CLAUDE.md`**: the render contract, look, sound, truth rules and craft bar. This skill is the order of work on top of it.

## Inputs to collect first
Ask only for what's missing. Defaults are in brackets.
- **Product:** Central Square AI, https://centralsquare.ai/ (marketing site) and https://dashboard.centralsquare.ai/ (the product).
- **Duration** [15 s social, 30 s launch, 60–90 s explainer].
- **Formats** [16:9, 9:16 and 1:1]. Also available: 4:5.
- **Brand colors and fonts** [`brand/tokens.css`: the live site — lavender ground `#F6F4FB`, violet `#6B4EFF`, violet→coral headline gradient, Geist + Geist Mono]. If the captured site disagrees with the tokens, show both and ask which wins.
- **A reference:** a frame, video or image folder [none].
- **Music:** a file, or "synthesize" [synthesize at 100 BPM].
- **The one thing** viewers should remember, and the **CTA** (these go in `BRIEF.md`).

Make the project first: `bash scripts/new-video.sh <yyyy-mm-slug> landscape`. Paths below are relative to `projects/<slug>/` unless they start with `scripts/`.

## Pipeline
1. **Gather assets** from the URLs with Playwright:
   ```bash
   node scripts/capture.mjs https://centralsquare.ai/ --out projects/<slug>/assets/capture
   node scripts/capture.mjs https://dashboard.centralsquare.ai/ --out projects/<slug>/assets/capture [--storage-state auth.json]
   ```
   - Capture writes full pages (desktop @2x, mobile @3x), viewport-by-viewport sections, cut-out UI blocks, logos, images and a `manifest.json` (colours by area, fonts, headings).
   - **List what you got** (file, what it shows, size) and say which shots it can support.
   - **Logged-in dashboard screens** need a storage state. Teijas signs in once in a local browser and exports it, e.g. `npx playwright codegen --save-storage=auth.json https://dashboard.centralsquare.ai/`, then hands over `auth.json`. Never ask for or type a password. Never commit `auth.json`.
   - **If capture is blocked** (the cloud environment's network policy must allow both hosts), or a screen needs real data, ask for screenshots or a screen recording. **Never invent screens.**
2. **If a reference exists, write `docs/style_guide.md` from it.** Cover:
   - palette (hex), type (families, sizes in vmin, weights), layout grid;
   - motion vocabulary (eases or spring presets, durations, staggers), cut rhythm, texture;
   - **what to take** and **what not to take**.

   It adapts the reference to our brand; it never copies it (see CLAUDE.md truth rules).
3. **Measure or synthesize music → `audio/beats.json`.**
   - Supplied track: `python3 scripts/analyze_audio.py <track> --fps 30 --out audio/beats.json`.
   - "Synthesize": `render.mjs` generates the score at `FILM.bpm` and writes the exact grid. Run `node scripts/render.mjs film.html --cues` once to produce `audio/beats.json`.
   - Note the tempo, downbeats and energy sections.
4. **Write `docs/shotlist.md` on the beat grid.** One row per shot:
   - beat or bar range and time;
   - what's on screen, with which captured asset (by filename);
   - the motion (spring preset or ease, from where to where);
   - the `data-sfx` hit;
   - the copy, word for word.

   It needs a hook by 2 s, something new every 2–4 s, and the CTA on the last 2.5–4 s. **Show it and wait for OK** (skip only if told "no stops").
5. **Build `film.html` with `window.seek(t)`, using `lib/motion.js`.**
   - Springs: `spring(t, start, "snappy" | "smooth" | "gentle" | "pop")`, plus `grid(FILM, window.BEATS)`, `rise`, `wipe`, `draw`, `count`, `camera`, `noise`, `hash`.
   - Time every event from the beat grid.
   - Put real UI in as `<img src="assets/capture/...">` and animate it as screens, crops and camera moves over the real pixels.
   - Tag each visible action with `data-sfx`. Lay out in vmin with orientation queries so every format reflows.
   - Follow CLAUDE.md.
6. **Contact sheet → critique pass → fix. Three rounds minimum.**
   - Each round runs `prompts/critique-pass.txt` exactly: beat sheet, cue table, strips and crops, six scores, banned-defaults sweep, the three worst problems with concrete fixes.
   - Record each round in `SCORECARD.md`.
   - Continue past 3 rounds until every score is 8 or higher.
7. **Render all formats:** `bash scripts/deliver.sh projects/<slug>/film.html 16x9,9x16,1x1`.
   - It runs `render.mjs` per format: frames, then SFX derived from the picture, then the mix normalized to −14 LUFS (true peak ≤ −1 dBTP), then H.264 CRF 16.
   - Then it runs `qa.sh` on each, a one-frame-per-beat `contact.png`, and `poster.png`.
   - Output: `out/final.mp4` (first format), `out/final-<format>.mp4`, `out/qa.txt`.
   - Look at the 9:16 and 1:1 contact sheets too: reflow can break layouts that worked at 16:9.
8. **Deliver** `out/final.mp4` (plus the other formats), `out/contact.png` and `out/poster.png`. Include:
   - the final scorecard row and the QA lines (LUFS, true peak, specs);
   - which captured assets were used;
   - **what you'd improve next:** the 2–3 most valuable changes, honestly ranked.

## Hard rules
- **Real product UI only. Never invent screens,** data, metrics, customers or logos. No capture means ask.
- No `Math.random`, no timers, no `requestAnimationFrame`, no CSS transitions or animations in render mode. `render.mjs` refuses to render and names the line.
- Banned: corner labels, a centered title on a gradient, everything fading in, frame borders, glow on UI chrome, generic particle bursts.
- Don't show Adobe, Microsoft or Aspen Institute (business-plan targets, not customers) without written confirmation.
- Don't say a reel is done until the critique has run 3+ rounds with every score at 8 or higher, and `qa.sh` passes for every format.

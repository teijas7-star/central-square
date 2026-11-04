# Scorecard — <slug>

Score from the **beat sheet** (`renders/film.beats.png`, one frame per beat), not from memory.
Every row must be **8+** before the full render. Each pass: fix the **3 lowest** first, re-sheet, re-score.

| Pass | Hook (first 2 s) | Readability at phone size | Motion quality | Variety (new thing every 2–4 s) | Brand accuracy | Sound sync | 3 worst problems → fixes |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |

**How to score each column**
- **Hook:** by 2.0 s is there one striking, specific image or line? No logo intro, no empty frame.
- **Readability:** view the sheet with frames ~260 px wide (phone-feed size). Can every word be read? Does each line hold long enough (0.4 s + 0.3 s per word)?
- **Motion quality:** eases are intentional (expo/cubic out, in-out for moves); no linear slides; staggers, not everything moving at once; nothing pops without a cause.
- **Variety:** list what's new at each 2–4 s window. Any window with nothing new scores ≤ 6.
- **Brand accuracy:** Playfair + Inter only; amber as the single accent and focal point; dark ground; no banned defaults (centered title on gradient, fade-everything, corner labels, frame borders, glow on UI chrome, generic particle bursts); claims sourced in BRIEF.md.
- **Sound sync:** `render.mjs --cues` prints **no off-grid WARNING**. Every visible action that should make a sound is tagged `data-sfx`. In strips, the ♪ marker sits on the frame where the action reads. The mix measures −14 LUFS by `qa.sh`.
- **Motion quality** is scored from **strips** (`--strip`) of the key moments, not from the beat sheet alone. Readability of small type is scored from **crops** (`--crop` / `--crop-at`).

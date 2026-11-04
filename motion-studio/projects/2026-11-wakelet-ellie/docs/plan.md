# Wakelet × Ellie: plan (rebuild from scratch)

**Format:** 1920×1080 (plus 1080×1080 and 1080×1920 re-set from the same timeline) · 30 fps · **37.0 s** (34 s of story + 1 s lockup build + 2 s hold) · **120 BPM**: beat = 0.5 s = 15 frames, bar = 2 s.
**Look:** base `#0A0511`, violet `#7C5EFF` / `#9D8BFF`, coral `#C6523F` (= Ellie), cream `#F4F0ED`, ink `#150F1D`. Fraunces 500 for headlines (−2% tracking), Inter for UI. Grain 2.5%, violet vignette, three depth layers (particle field, cards, type) with parallax, directional motion blur on fast moves. Three cream single-frame flash cuts: Ellie snap (b16), the drop (b50), lockup (b69).
**Hero device:** the square. Violet = community/members, coral = Ellie. Squares drop, shatter into 200 members, scan, wipe between scenes, and converge into the monogram.
**Claims:** only "½ day back, every week" (James Davis, Wakelet story). Dashboard numbers are illustrative UI. Placeholder people only ("Sam Rivera"). Platform glyphs are generic shapes, not third-party logos.

## Beat sheet (b = beat index, f = frame)

| # | Beats (time) | Picture | Type (≤5 words) | Sound |
|---|---|---|---|---|
| 1 Cold open | b0–6 (0–3 s) | Black. Violet square falls, **lands b1**, shatters b2 into 200 member squares drifting over faint glyphs (chat, hash, camera, X, envelope, mic). Push-in. | b2 "Thousands of members." → hard cut b4 "Two people." | thud b1, impact b2, tick b4 |
| 2 The mess | b6–14 (3–7 s) | Whip-pan montage: spreadsheet, doc, contact card, chat bubbles fly in from the 4 edges on b6/7/8/9, then 2 more on b10/11; pile overlaps and jitters; members buried. Camera shakes on each hit. | b8 "Spread across" b10 "four places." | whoosh ×6 |
| 3 Ellie arrives | b14–18 (7–9 s) | Coral square slices diagonally through the pile b14–15; **b16 cream flash**, everything snaps into one aligned grid. | b16 "Meet Ellie." | riser → impact b16 |
| 4 Quiet ones | b18–28 (9–14 s) | Member field: few big loud squares, many small dim ones. Coral scan line sweeps b18–22, quiet squares light coral. "Going quiet" card springs b22, counter 0→21; "Returning" card b24, 0→44 (illustrative). | b18 "Finds who" b20 "you can't see." | tick per lit cluster, pop b22/b24 |
| 5 One person | b28–36 (14–18 s) | Three chips (WhatsApp / Email / Slack, placeholder "Sam Rivera") slide in b28/29/30, collide b32 → one avatar card; "Same person" pill pops b33. | b28 "Many records." b32 "One person." | whoosh ×3, impact b32, pop b33 |
| 6 Every Monday | b36–44 (18–22 s) | "MON" tile flips b36; rows cascade b37/38/39; coral checks tick b40/41/42. | b36 "Every Monday." b40 "Nobody asked." | flip b36, tick ×3, chime ×3 |
| 7 You approve | b44–50 (22–25 s) | Draft card springs b44; cursor glides b45–47; **click b47** → coral burst; card flies off b48. Square wipe out b49. | b44 "Nothing sends" b46 "without your yes." | pop b47 (the approve pop), whoosh b48 |
| 8 Payoff | b50–60 (25–30 s) | **Drop b50**: cream flash, "½ day" fills frame (80%→100%, overshoot) in violet→coral; clock spins backwards behind. b52 "back. every week." b54 team photo in a square mask expands to fill frame, slow push. | b50 "½ day" b52 "back. every week." | riser into b50, **bass drop b50**, whoosh b54 |
| 9 James | b60–68 (30–34 s) | James in a square mask (left third), quote in 4 cuts, "loudest voices" in coral; small attribution. | b60 "It helps you identify" b62 "underserved members…" b64 "…who might not be" b66 "the loudest voices." | soft chime b66 |
| 10 Lockup | b68–74 (34–37 s) | Member squares rush to center b68, converge into the monogram b69 (cream flash), wordmark b70, subline b71, URL; **hold 2 s** to 37.0 s. | "centralsquare ▪ ai" / "Ellie, the agent for community teams." | impact b69, chime b70 |

## Components (shared, BPM-tied)
`Square` (drop/shatter/wipe), `Card` (sheet, doc, contact, chat, metric, draft), `Pill` (back-out pop), `Counter` (count-up), `KineticHeadline` (masked slides + scale punch, 1–2 words per hit, hard-cut exits), plus `Particles` (200 members as pure functions of t), `Camera` (push, shake, whip with directional blur), `Grain`, `Vignette`, `Flash`.
Easing: entrances expo-out; pills/buttons/counters back-out; camera springs.

## Rules to audit against
No side text columns (except James, by design) · ≤5 words on screen (excluding the small attribution and the end URL) · no static hold >20 frames except the final 2 s · palette only · no real PII · only the ½-day claim · every cut and hit on a beat.

**Unsourced copy from the brief:** "Thousands of members." Wakelet's community size isn't stated on the story page. I've kept it because the brief asks for it, and flagged it.

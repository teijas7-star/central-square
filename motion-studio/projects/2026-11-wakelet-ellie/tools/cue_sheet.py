#!/usr/bin/env python3
"""Write docs/cue-sheet.md from audio/cues.json (+ the music grid), addressed in bar.beat at 120 BPM.

    python3 tools/cue_sheet.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
cues = json.load(open(os.path.join(ROOT, "audio", "cues.json")))
BEAT, FPS = 0.5, 30

SCENES = [(0, "1 Cold open"), (6, "2 The mess"), (14, "3 Ellie arrives"), (18, "4 Finds the quiet ones"), (28, "5 One person"),
          (36, "6 Every Monday"), (44, "7 You approve"), (50, "8 Payoff (the drop)"), (60, "9 James"), (68, "10 Lockup")]
NOTES = {"thud": "low body hit", "impact": "boom + crack", "whoosh": "air swish, lands on the beat", "tick": "short click",
         "pop": "bright pitched pop", "chime": "two-partial bell", "riser": "noise + tone sweep INTO the beat", "drop": "sub-bass drop (32-100 Hz) + transient"}

def scene(beat):
    name = SCENES[0][1]
    for b, n in SCENES:
        if beat >= b: name = n
    return name

def where(t):
    beat = t / BEAT
    bar, inbar = int(beat // 4) + 1, beat % 4 + 1
    return f"{bar}.{inbar:g}", round(t * FPS)

lines = ["# SFX + music cue sheet: Wakelet × Ellie (120 BPM, 30 fps, 37.0 s)", "",
         "**Music:** synthesized bed at 120 BPM (A minor: Am–F–C–G, one chord per bar). Pad only in bar 1; kick on 1 and 3, clap on 2 and 4, 8th-note hats from bar 2; outro rings out over the last 1.5 s. Mixed to −14 LUFS, true peak below −1 dBTP.",
         "**Licensed track swap:** pick a 120 BPM track and align its first downbeat to 0:00. The film reads the measured grid (`--audio track.wav`), and every picture-derived cue below re-snaps to it.",
         "**Key moments:** shatter (bar 1.3), Ellie snap + cream flash (bar 5.1), approve pop (bar 12.4), **bass drop on ½ day (bar 13.3)**, lockup flash (bar 18.2).", "",
         "| # | Time | Bar.beat | Frame | Scene | SFX | Gain | Pan | Source | Sound |", "|---|---|---|---|---|---|---|---|---|---|"]
for i, c in enumerate(sorted(cues, key=lambda c: c["t"])):
    bb, f = where(c["t"])
    src = c.get("source", "manual").replace("picture:", "on-screen: ")
    lines.append(f"| {i + 1} | {c['t']:.3f}s | {bb} | {f} | {scene(c['t'] / BEAT)} | **{c['sfx']}** | {c.get('gain', 1):.2f} | {c.get('pan', 0):+.2f} | {src} | {NOTES.get(c['sfx'], '')} |")
out = os.path.join(ROOT, "docs", "cue-sheet.md")
open(out, "w").write("\n".join(lines) + "\n")
print(out, len(cues), "cues")

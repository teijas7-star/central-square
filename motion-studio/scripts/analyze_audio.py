#!/usr/bin/env python3
"""Analyze a music/voice track so cuts and hits land on the audio.

    python3 scripts/analyze_audio.py assets/music/track.mp3 [--fps 30] [--out beats.json]

Writes JSON with tempo, beat times, downbeats (every 4th beat from the strongest phase),
strong onsets, energy sections, and the same times as frame numbers at --fps — ready to paste
into a GSAP timeline (seconds) or a Remotion composition (frames).
"""
import argparse, json, sys
import numpy as np
import librosa


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--fps", type=float, default=30.0)
    ap.add_argument("--out")
    a = ap.parse_args()

    y, sr = librosa.load(a.audio, sr=22050, mono=True)
    dur = len(y) / sr
    hop = 512

    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset_env, sr=sr, hop_length=hop)
    beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)
    tempo = float(np.atleast_1d(tempo)[0])

    # Downbeats: pick the 4-beat phase where harmony changes and the low end hits hardest.
    # (Chords usually change on the 1; kick-only phase is ambiguous when the kick plays on 1 and 3.)
    downbeats = []
    if len(beat_frames) >= 4:
        bf = np.clip(beat_frames, 0, len(onset_env) - 1)
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop)
        cs = librosa.util.sync(chroma, np.concatenate([[0], bf]), aggregate=np.median)
        change = np.r_[np.linalg.norm(np.diff(cs, axis=1), axis=0)][: len(bf)]
        S = np.abs(librosa.stft(y, hop_length=hop))
        low = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[: int(200 / (sr / 2048)) + 1]), sr=sr, hop_length=hop)
        lows = low[np.clip(bf, 0, len(low) - 1)]
        z = lambda v: (v - v.mean()) / (v.std() + 1e-9)
        score = z(change) + 0.5 * z(lows)
        phase = int(np.argmax([score[p::4].mean() for p in range(4)]))
        downbeats = beats[phase::4].tolist()

    # Strong onsets: top 20% by strength — good for hits, pops, impact frames.
    on_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, hop_length=hop, backtrack=True)
    if len(on_frames):
        s = onset_env[on_frames]
        keep = on_frames[s >= np.percentile(s, 80)]
        strong = librosa.frames_to_time(keep, sr=sr, hop_length=hop).tolist()
    else:
        strong = []

    # Energy sections: RMS smoothed over ~2 s, split where it changes level.
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    win = max(1, int(2.0 * sr / hop))
    smooth = np.convolve(rms, np.ones(win) / win, mode="same")
    levels = np.digitize(smooth, np.quantile(smooth, [0.33, 0.66]))
    names = ["low", "mid", "high"]
    sections, start = [], 0
    for i in range(1, len(levels) + 1):
        if i == len(levels) or levels[i] != levels[start]:
            t0 = float(librosa.frames_to_time(start, sr=sr, hop_length=hop))
            t1 = float(librosa.frames_to_time(i, sr=sr, hop_length=hop)) if i < len(levels) else dur
            if sections and sections[-1]["energy"] == names[int(levels[start])]:
                sections[-1]["end"] = round(t1, 3)
            elif t1 - t0 >= 1.0 or not sections:
                sections.append({"start": round(t0, 3), "end": round(t1, 3), "energy": names[int(levels[start])]})
            else:
                sections[-1]["end"] = round(t1, 3)
            start = i

    f = lambda ts: [int(round(t * a.fps)) for t in ts]
    r = lambda ts: [round(float(t), 3) for t in ts]
    out = {
        "file": a.audio, "duration": round(dur, 3), "fps": a.fps, "tempo_bpm": round(tempo, 2),
        "beats": r(beats), "beat_frames": f(beats),
        "downbeats": r(downbeats), "downbeat_frames": f(downbeats),
        "strong_onsets": r(strong), "strong_onset_frames": f(strong),
        "sections": sections,
    }
    text = json.dumps(out, indent=2)
    if a.out:
        open(a.out, "w").write(text)
        print(f"{a.audio}: {tempo:.1f} BPM, {len(beats)} beats, {len(downbeats)} downbeats, "
              f"{len(strong)} strong onsets, {len(sections)} sections -> {a.out}", file=sys.stderr)
    else:
        print(text)


if __name__ == "__main__":
    main()

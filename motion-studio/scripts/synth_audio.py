#!/usr/bin/env python3
"""Synthesize the score and SFX in code (house rule: no stock audio unless a track is supplied).

    # A warm minor-key bed at a tempo, for a duration
    python3 scripts/synth_audio.py score --bpm 100 --duration 12 --out audio/score.wav [--seed 7]

    # SFX placed so each hit LANDS at its time (whooshes/risers pre-roll into the time)
    python3 scripts/synth_audio.py sfx --duration 12 --cues cues.json --out audio/sfx.wav
    # cues.json: [{"t": 0.6, "sfx": "pop", "pan": -0.4}, {"t": 2.4, "sfx": "whoosh", "gain": 0.8}, ...]

SFX kinds: pop, tick, whoosh, riser, impact, chime, thud, drop.
Everything is deterministic (seeded). Output: 48 kHz stereo float WAV, peak-limited; loudness is
normalized to -14 LUFS at mux time by render.mjs.
"""
import argparse, json
import numpy as np
import soundfile as sf

SR = 48000


def rng_for(seed):
    return np.random.default_rng(seed)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    sus = max(0, n - a - d - r)
    e = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(sus, s), np.linspace(s, 0, max(r, 1))])
    return e[:n] if len(e) >= n else np.pad(e, (0, n - len(e)))


def lp(x, cutoff):
    # 2nd-order-ish low-pass applied in the frequency domain (vectorized, deterministic)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / np.sqrt(1 + (f / hi) ** 4))
    return np.fft.irfft(X, len(x))


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def place(buf, sig, t, gain=1.0):
    i = int(round(t * SR))
    if i < 0:
        sig = sig[-i:]; i = 0
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += gain * sig[: j - i]


# ---------------------------------------------------------------- score
def score(bpm, duration, seed, style="warm"):
    if style == "drive":
        return score_drive(bpm, duration, seed)
    r = rng_for(seed)
    n = int(duration * SR)
    pad = np.zeros(n); bass = np.zeros(n); drums = np.zeros(n)
    beat = 60.0 / bpm; bar = 4 * beat
    # A minor: Am - F - C - G (i - VI - III - VII), voiced warm and close
    chords = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 60, 64, 67], [55, 59, 62, 67]]
    roots = [45, 41, 48, 43]
    nbars = int(np.ceil(duration / bar))
    for b in range(nbars):
        t0 = b * bar; L = int(bar * SR * 1.15)
        tt = np.arange(L) / SR
        ch = chords[b % 4]
        sig = np.zeros(L)
        for k, m in enumerate(ch):
            f = midi(m)
            for det in (-0.07, 0.07):  # two detuned saws-ish (sum of 6 harmonics) per voice
                ff = f * 2 ** (det / 12)
                ph = r.uniform(0, 2 * np.pi)
                sig += sum(np.sin(2 * np.pi * ff * h * tt + ph) / h for h in range(1, 7)) * 0.5
        sig = lp(sig, 1400) * env_adsr(L, 0.35, 0.4, 0.8, 0.5) / 10
        place(pad, sig, t0)
        # bass: root on beats 1 and 3 (from bar 2 on)
        if b >= 1:
            for bt in (0, 2):
                Lb = int(beat * 1.6 * SR); tb = np.arange(Lb) / SR
                s = np.sin(2 * np.pi * midi(roots[b % 4]) * tb) + 0.25 * np.sin(2 * np.pi * 2 * midi(roots[b % 4]) * tb)
                place(bass, s * env_adsr(Lb, 0.01, 0.2, 0.6, 0.3) * 0.35, t0 + bt * beat)
        # drums from bar 2: kick on 1 & 3, soft clap on 2 & 4, hats on 8ths
        if b >= 1:
            for q in range(4):
                tq = t0 + q * beat
                if q in (0, 2):
                    place(drums, sfx_kick(), tq, 0.55)
                else:
                    place(drums, sfx_clap(r), tq, 0.18)
                for e in (0, 0.5):
                    place(drums, sfx_hat(r), tq + e * beat, 0.07 if e else 0.05)
    mix = pad * 0.9 + bass + drums
    # last 1.5 s: fade drums/bass, let the pad ring
    fade = np.ones(n); k = int(1.5 * SR); fade[-k:] = np.linspace(1, 0, k)
    mix = mix * fade
    return stereo(mix, width=0.25, seed=seed)


def score_drive(bpm, duration, seed):
    """Energetic, warm bed: four-on-the-floor from beat 1 (the hook needs energy immediately), offbeat bass,
    16th-note plucked arpeggio over a sidechained pad, A minor Am-F-C-G. Breakdown on bar 12 lifts into the drop."""
    r = rng_for(seed)
    n = int(duration * SR)
    pad = np.zeros(n); bass = np.zeros(n); drums = np.zeros(n); arp = np.zeros(n)
    beat = 60.0 / bpm; bar = 4 * beat; six = beat / 4
    chords = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 60, 64, 67], [55, 59, 62, 67]]
    roots = [45, 41, 48, 43]
    nbars = int(np.ceil(duration / bar))
    breakdown = {11}  # bar index before the drop (bar 13 = 24 s at 120 BPM): drums thin out, riser takes over
    for b in range(nbars):
        t0 = b * bar; ch = chords[b % 4]
        L = int(bar * SR * 1.1); tt = np.arange(L) / SR
        sig = np.zeros(L)
        for m in ch:
            for det in (-0.08, 0.08):
                ff = midi(m) * 2 ** (det / 12); ph = r.uniform(0, 2 * np.pi)
                sig += sum(np.sin(2 * np.pi * ff * h * tt + ph) / h for h in range(1, 6)) * 0.4
        sig = lp(sig, 1800) * env_adsr(L, 0.05, 0.3, 0.75, 0.3) / 12
        # sidechain pump: duck the pad on every beat
        pump = np.ones(L); bl = int(beat * SR)
        for q in range(5):
            i = q * bl; k = min(L - i, int(0.22 * SR))
            if k > 0: pump[i:i + k] = np.linspace(0.35, 1, k)
        place(pad, sig * pump, t0)
        # arp: 16ths through the chord, plucked
        notes = ch + [ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12]
        for k in range(16):
            Ln = int(six * SR * 1.4); tn = np.arange(Ln) / SR; f = midi(notes[k % len(notes)] + 12)
            pl = (np.sin(2 * np.pi * f * tn) + 0.3 * np.sin(4 * np.pi * f * tn)) * np.exp(-tn * 22)
            place(arp, pl * (0.11 if b not in breakdown else 0.16), t0 + k * six)
        # bass: offbeat 8ths on the root (octave pulse)
        if b not in breakdown:
            for q in range(4):
                Lb = int(beat * 0.45 * SR); tb = np.arange(Lb) / SR; f = midi(roots[b % 4])
                sb = np.sin(2 * np.pi * f * tb) + 0.4 * np.sin(2 * np.pi * 2 * f * tb)
                place(bass, sb * env_adsr(Lb, 0.005, 0.08, 0.7, 0.08) * 0.32, t0 + q * beat + beat / 2)
        # drums
        for q in range(4):
            tq = t0 + q * beat
            if b not in breakdown or q < 2:
                place(drums, sfx_kick(), tq, 0.6)
            if q in (1, 3) and b not in breakdown:
                place(drums, sfx_clap(r), tq, 0.22)
            for e in (0.5,):
                place(drums, sfx_hat(r), tq + e * beat, 0.09)
            place(drums, sfx_hat(r), tq + 0.25 * beat, 0.035); place(drums, sfx_hat(r), tq + 0.75 * beat, 0.035)
    mix = pad + bass + drums + arp
    fade = np.ones(n); k = int(1.2 * SR); fade[-k:] = np.linspace(1, 0, k)
    return stereo(mix * fade, width=0.3, seed=seed)


def sfx_kick():
    L = int(0.35 * SR); t = np.arange(L) / SR
    f = 45 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def sfx_clap(r):
    L = int(0.18 * SR); t = np.arange(L) / SR
    return bp(r.standard_normal(L), 900, 3500) * np.exp(-t * 30)


def sfx_hat(r):
    L = int(0.06 * SR); t = np.arange(L) / SR
    return bp(r.standard_normal(L), 6000, 14000) * np.exp(-t * 70)


# ---------------------------------------------------------------- sfx
def make_sfx(kind, r):
    """Return (signal, landing_offset_seconds): the hit lands landing_offset into the signal."""
    if kind == "pop":
        L = int(0.12 * SR); t = np.arange(L) / SR
        f = 900 * np.exp(-t * 18) + 380
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38) * 0.8, 0.0
    if kind == "tick":
        L = int(0.04 * SR); t = np.arange(L) / SR
        return bp(r.standard_normal(L), 2500, 9000) * np.exp(-t * 120) * 1.2, 0.0
    if kind == "whoosh":
        L = int(0.55 * SR); t = np.arange(L) / SR
        noise = r.standard_normal(L); out = np.zeros(L)
        for i, (lo, hi) in enumerate([(300, 900), (600, 1800), (1200, 3600), (2000, 6000)]):
            seg = bp(noise, lo, hi); w = np.exp(-((t / t[-1] - (0.35 + i * 0.15)) ** 2) / 0.02)
            out += seg * w
        return out * 0.6 * np.sin(np.pi * t / t[-1]) ** 2, 0.42
    if kind == "riser":
        L = int(1.2 * SR); t = np.arange(L) / SR
        f = 200 * 2 ** (3 * t / t[-1])
        tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
        nz = bp(r.standard_normal(L), 1500, 8000) * 0.4
        return (tone + nz) * (t / t[-1]) ** 2, 1.2
    if kind == "impact":
        L = int(1.2 * SR); t = np.arange(L) / SR
        boom = np.sin(2 * np.pi * np.cumsum(38 + 80 * np.exp(-t * 14)) / SR) * np.exp(-t * 3.5)
        crack = lp(r.standard_normal(L), 4000) * np.exp(-t * 25) * 0.4
        return (boom + crack) * 0.9, 0.0
    if kind == "chime":
        L = int(1.6 * SR); t = np.arange(L) / SR
        s = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(1318.5, 0.5, 3), (1975.5, 0.3, 4.5), (2637, 0.15, 6)])
        return s * np.minimum(1, t * 400), 0.0
    if kind == "drop":  # the bass drop: a long sub sweep with a noise transient
        L = int(2.2 * SR); t = np.arange(L) / SR
        sub = np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-t * 6)) / SR) * np.exp(-t * 1.6)
        hit = lp(r.standard_normal(L), 3000) * np.exp(-t * 18) * 0.5
        return (sub * 1.1 + hit), 0.0
    if kind == "thud":
        L = int(0.3 * SR); t = np.arange(L) / SR
        return np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t * 40)) / SR) * np.exp(-t * 14), 0.0
    raise SystemExit(f"unknown sfx kind: {kind}")


def sfx_track(duration, cues, seed):
    """Each cue: t (where the hit lands), sfx, optional gain and pan (-1 left .. 1 right, equal-power)."""
    r = rng_for(seed)
    n = int(duration * SR); L = np.zeros(n); R = np.zeros(n)
    for c in cues:
        sig, land = make_sfx(c["sfx"], r)
        g = float(c.get("gain", 1.0)); pan = max(-1.0, min(1.0, float(c.get("pan", 0.0))))
        th = (pan + 1) * np.pi / 4
        place(L, sig, float(c["t"]) - land, g * np.cos(th) * np.sqrt(2))
        place(R, sig, float(c["t"]) - land, g * np.sin(th) * np.sqrt(2))
    st = np.stack([L, R], axis=1)
    peak = np.max(np.abs(st)) or 1.0
    return (st / peak * 0.89).astype(np.float32)


def stereo(x, width, seed):
    d = int(0.011 * SR)
    left = x; right = np.concatenate([np.zeros(d), x[:-d]]) if d < len(x) else x
    st = np.stack([left * (1 - width) + right * width, right * (1 - width) + left * width], axis=1)
    peak = np.max(np.abs(st)) or 1.0
    return (st / peak * 0.89).astype(np.float32)  # ~ -1 dBFS peak; LUFS normalized at mux


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("score"); s.add_argument("--bpm", type=float, default=100); s.add_argument("--duration", type=float, required=True)
    s.add_argument("--style", default="warm", choices=["warm", "drive"])
    s.add_argument("--seed", type=int, default=7); s.add_argument("--out", required=True)
    x = sub.add_parser("sfx"); x.add_argument("--duration", type=float, required=True); x.add_argument("--cues", required=True)
    x.add_argument("--seed", type=int, default=7); x.add_argument("--out", required=True)
    a = ap.parse_args()
    if a.cmd == "score":
        sf.write(a.out, score(a.bpm, a.duration, a.seed, a.style), SR, subtype="FLOAT")
        # The score is generated on an exact grid, so write that grid next to it (same schema as
        # analyze_audio.py). analyze_audio.py on the WAV should agree within ~30 ms.
        beat = 60.0 / a.bpm
        beats = [round(i * beat, 4) for i in range(int(a.duration / beat) + 1)]
        grid = {"file": a.out, "duration": a.duration, "tempo_bpm": a.bpm, "source": "synth-grid",
                "beats": beats, "downbeats": beats[::4],
                "bars": [{"start": b, "chord": ["Am", "F", "C", "G"][i % 4]} for i, b in enumerate(beats[::4])],
                "drums_from": round(4 * beat, 4)}
        json.dump(grid, open(a.out.rsplit(".", 1)[0] + ".beats.json", "w"), indent=2)
    else:
        cues = json.load(open(a.cues))
        sf.write(a.out, sfx_track(a.duration, cues, a.seed), SR, subtype="FLOAT")
    print(a.out)


if __name__ == "__main__":
    main()

/* Central Square AI: motion library for seek(t) films. Every function is pure: same input, same output.
   Load with <script src="lib/motion.js"></script>; everything is on window.Motion (classic script, so it
   works from file:// without a server). No timers, no rAF, no Math.random.

   Springs are the closed-form solution of a damped harmonic oscillator, so spring(t) is a function of time,
   not a simulation stepped frame to frame (which would carry state between frames). */
(function () {
  "use strict";

  // ---------------------------------------------------------------- numbers
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const mix = (a, b, k) => a + (b - a) * k;
  const remap = (x, a, b, c = 0, d = 1) => mix(c, d, clamp((x - a) / (b - a)));

  // ---------------------------------------------------------------- seeded randomness
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // hash(i, seed) -> [0,1): random access, no sequence state (safe inside seek)
  const hash = (i, seed = 0) => mulberry32((Math.imul(i | 0, 0x9e3779b1) ^ Math.imul(seed | 0, 0x85ebca6b)) >>> 0)();
  // smooth 1-D value noise in [-1,1]: for drift, wobble, hand-held camera
  function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return mix(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, u);
  }

  // ---------------------------------------------------------------- eases (0..1 -> 0..1)
  const ease = {
    linear: (x) => x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outQuart: (x) => 1 - Math.pow(1 - x, 4),
    outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
    outBack: (x, s = 1.7) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
  };
  // progress of a tween that starts at `start` and lasts `dur`, eased
  const prog = (t, start, dur, fn = ease.outExpo) => fn(clamp((t - start) / dur));

  // ---------------------------------------------------------------- springs
  // Presets: stiffness k, damping c, mass m. zeta = c / (2*sqrt(k*m)) < 1 overshoots.
  const SPRINGS = {
    snappy: { stiffness: 380, damping: 30 },   // UI arriving: fast, ~3% overshoot
    smooth: { stiffness: 170, damping: 26 },   // general purpose, no visible bounce
    gentle: { stiffness: 90, damping: 19 },    // big layout and camera moves
    pop: { stiffness: 420, damping: 22, velocity: 8 }, // small nodes and badges: starts with a kick, one clear overshoot
    wobbly: { stiffness: 180, damping: 11 },   // playful; use sparingly, never on text
  };
  // value of a spring released at time 0 from 0 toward 1 (may overshoot). velocity in units/s.
  function springValue(t, cfg = SPRINGS.smooth) {
    if (t <= 0) return 0;
    const k = cfg.stiffness ?? 170, c = cfg.damping ?? 26, m = cfg.mass ?? 1, v0 = cfg.velocity ?? 0;
    const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)), x0 = -1;
    let x;
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z);
      x = Math.exp(-z * w0 * t) * (x0 * Math.cos(wd * t) + ((v0 + z * w0 * x0) / wd) * Math.sin(wd * t));
    } else if (z === 1) {
      x = Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
    } else {
      const s = Math.sqrt(z * z - 1), r1 = -w0 * (z - s), r2 = -w0 * (z + s);
      const c1 = (v0 - r2 * x0) / (r1 - r2), c2 = x0 - c1;
      x = c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    }
    return 1 + x;
  }
  // spring(t, start, cfg) -> 0..~1 progress of a spring released at `start`
  const spring = (t, start, cfg = SPRINGS.smooth) => springValue(t - start, typeof cfg === "string" ? SPRINGS[cfg] : cfg);
  // seconds until the spring stays within eps of rest (for planning shots on the beat grid)
  function springSettle(cfg = SPRINGS.smooth, eps = 0.005) {
    cfg = typeof cfg === "string" ? SPRINGS[cfg] : cfg;
    let last = 0;
    for (let t = 0; t < 10; t += 1 / 240) if (Math.abs(springValue(t, cfg) - 1) > eps) last = t;
    return +last.toFixed(3);
  }

  // ---------------------------------------------------------------- beat grid
  // grid(FILM, window.BEATS): beat(n), sub(n, div) (div=2: 8ths, 4: 16ths), bar(n), SPB
  function grid(film, injected) {
    const SPB = 60 / (film.bpm || 100);
    const B = injected && injected.beats && injected.beats.length ? injected.beats : null;
    const beat = (n) => (B && B[n] !== undefined ? B[n] : n * SPB);
    const sub = (n, div = 4) => { const i = Math.floor(n / div), f = (n % div) / div; return mix(beat(i), beat(i + 1), f); };
    return { SPB, beat, sub, bar: (n) => beat(n * 4) };
  }
  const stagger = (i, each, start = 0) => start + i * each;

  // ---------------------------------------------------------------- element helpers (write styles from t)
  // masked rise: put the element in an overflow:hidden parent; k=0 hidden below, k=1 in place
  const rise = (el, k, dist = 112) => { el.style.transform = `translateY(${(1 - k) * dist}%)`; };
  const wipe = (el, k, dir = "right") => {
    const p = (1 - clamp(k)) * 100;
    el.style.clipPath = dir === "right" ? `inset(0 ${p}% 0 0)` : dir === "left" ? `inset(0 0 0 ${p}%)` : dir === "down" ? `inset(0 0 ${p}% 0)` : `inset(${p}% 0 0 0)`;
  };
  const draw = (svgEl, k) => { svgEl.setAttribute("pathLength", 1); svgEl.setAttribute("stroke-dasharray", 1); svgEl.setAttribute("stroke-dashoffset", 1 - clamp(k)); };
  // count-up for real numbers only (source in BRIEF.md); formats with thousands separators
  const count = (el, k, to, { from = 0, decimals = 0, prefix = "", suffix = "" } = {}) => {
    el.textContent = prefix + mix(from, to, clamp(k)).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  };
  // camera: pan/zoom a world element; focus point in px of the world, scale >= 1 zooms in
  const camera = (el, { x = 0, y = 0, scale = 1, rotate = 0 } = {}) => {
    el.style.transformOrigin = "0 0";
    el.style.transform = `translate(${-x * scale}px, ${-y * scale}px) scale(${scale}) rotate(${rotate}deg)`;
  };

  window.Motion = { clamp, mix, remap, mulberry32, hash, noise, ease, prog, SPRINGS, springValue, spring, springSettle, grid, stagger, rise, wipe, draw, count, camera };
})();

"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
const T = {
  bg: "#0a0a0a",
  card: "#1A1A1A",
  border: "#333333",
  orange: "#FF6B35",
  blue: "#4A90E2",
  green: "#48BB78",
  purple: "#A855F7",
  amber: "#F59E0B",
  red: "#EF4444",
  textPrimary: "#F0F0F0",
  textSecondary: "#999999",
  textMuted: "#666666",
};

/* ─────────────────────────── CSS ANIMATIONS ─────────────────────────── */
const cssAnimations = `
  @keyframes partnerFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes partnerFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes partnerFloat2 {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(1deg); }
  }
  @keyframes partnerPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes partnerSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes partnerGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,107,53,0.15); }
    50% { box-shadow: 0 0 40px rgba(255,107,53,0.3); }
  }
  @keyframes partnerSlideRight {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes partnerTyping {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes partnerBarGrow {
    from { width: 0%; }
    to { width: var(--bar-width); }
  }
  @keyframes partnerNodePulse {
    0%, 100% { r: 6; opacity: 0.8; }
    50% { r: 8; opacity: 1; }
  }
  @keyframes partnerDash {
    to { stroke-dashoffset: -20; }
  }
  .partner-section {
    opacity: 0;
    transform: translateY(32px);
  }
  .partner-section.visible {
    animation: partnerFadeUp 0.7s ease both;
  }
`;

/* ─────────────────────────── GRID BG ─────────────────────────── */
function GridBG() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.12, pointerEvents: "none" }}>
      <defs>
        <pattern id="grid80p" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid80p)" />
    </svg>
  );
}

/* ─────────────────────────── HERO NETWORK VISUALIZATION ─────────────────────────── */
function HeroNetwork() {
  const nodes = [
    { x: 150, y: 80, r: 8, hero: true },
    { x: 320, y: 120, r: 7, hero: true },
    { x: 480, y: 70, r: 6, hero: true },
    { x: 240, y: 200, r: 5, hero: false },
    { x: 100, y: 180, r: 4, hero: false },
    { x: 400, y: 190, r: 5, hero: false },
    { x: 550, y: 160, r: 4, hero: false },
    { x: 200, y: 40, r: 3, hero: false },
    { x: 350, y: 30, r: 3, hero: false },
    { x: 50, y: 120, r: 3, hero: false },
    { x: 600, y: 100, r: 3, hero: false },
    { x: 280, y: 260, r: 3, hero: false },
    { x: 450, y: 250, r: 3, hero: false },
    { x: 160, y: 260, r: 3, hero: false },
    { x: 520, y: 240, r: 3, hero: false },
  ];
  const edges: [number, number][] = [
    [0,1],[0,3],[0,4],[0,7],[1,2],[1,3],[1,5],[1,8],[2,5],[2,6],[2,10],
    [3,4],[3,5],[3,11],[3,13],[4,9],[4,13],[5,6],[5,12],[5,14],[6,10],[6,14],
    [7,8],[8,1],[9,4],[11,12],[11,13],[12,14],
  ];
  return (
    <svg viewBox="0 0 650 290" style={{ width: "100%", maxWidth: 650, position: "absolute", top: 0, right: 0, opacity: 0.35, zIndex: 0 }}>
      <defs>
        <filter id="heroGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="edgeGradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={T.orange} stopOpacity="0.4" />
          <stop offset="100%" stopColor={T.orange} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const isHero = nodes[a].hero || nodes[b].hero;
        const mx = (nodes[a].x + nodes[b].x) / 2 + ((i % 3) - 1) * 20;
        const my = (nodes[a].y + nodes[b].y) / 2 + ((i % 2) - 0.5) * 15;
        return (
          <path key={i}
            d={`M${nodes[a].x},${nodes[a].y} Q${mx},${my} ${nodes[b].x},${nodes[b].y}`}
            fill="none"
            stroke={isHero ? `${T.orange}35` : "#2D374820"}
            strokeWidth={isHero ? 1.2 : 0.6}
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          {n.hero && <circle cx={n.x} cy={n.y} r={n.r * 2.5} fill={`${T.orange}08`} />}
          <circle
            cx={n.x} cy={n.y} r={n.r}
            fill={n.hero ? T.orange : "#4A5568"}
            filter={n.hero ? "url(#heroGlow)" : undefined}
            opacity={n.hero ? 0.9 : 0.35}
          >
            {n.hero && (
              <animate attributeName="r" values={`${n.r};${n.r + 2};${n.r}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            )}
          </circle>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────── CHAOS TOOLS VISUAL ─────────────────────────── */
function ChaosTools() {
  const tools = [
    { name: "Google Sheets", x: 10, y: 0, rot: -3, color: "#34A853", badge: "47 rows" },
    { name: "WhatsApp", x: 55, y: 8, rot: 2, color: "#25D366", badge: "12 unread" },
    { name: "Gmail", x: 15, y: 45, rot: -2, color: "#EA4335", badge: "8 threads" },
    { name: "Eventbrite", x: 52, y: 42, rot: 3, color: "#F6682F", badge: "3 events" },
    { name: "Notion", x: 5, y: 82, rot: 1, color: "#999", badge: "docs" },
    { name: "Discord", x: 58, y: 78, rot: -1, color: "#5865F2", badge: "5 channels" },
  ];
  return (
    <div style={{ position: "relative", width: "100%", height: 200 }}>
      {tools.map((t, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${t.x}%`,
          top: `${t.y}%`,
          width: "38%",
          background: "#151515",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          transform: `rotate(${t.rot}deg)`,
          animation: `partnerFloat${i % 2 === 0 ? "" : "2"} ${3.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
          zIndex: i,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
              <span style={{ fontSize: 10, color: T.textSecondary, fontWeight: 500 }}>{t.name}</span>
            </div>
            <div style={{ fontSize: 8, color: t.color, background: `${t.color}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>
              {t.badge}
            </div>
          </div>
          <div style={{ display: "flex", gap: 3 }}>
            {[40, 65, 30, 55].map((w, j) => (
              <div key={j} style={{ height: 3, borderRadius: 1, background: `${T.textMuted}30`, flex: `0 0 ${w}%` }} />
            ))}
          </div>
        </div>
      ))}
      {/* Connector lines showing chaos */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" }}>
        <line x1="35%" y1="20%" x2="60%" y2="25%" stroke={`${T.red}25`} strokeWidth="1" strokeDasharray="4 4" style={{ animation: "partnerDash 1s linear infinite" }} />
        <line x1="30%" y1="55%" x2="55%" y2="50%" stroke={`${T.red}25`} strokeWidth="1" strokeDasharray="4 4" style={{ animation: "partnerDash 1.5s linear infinite" }} />
        <line x1="25%" y1="35%" x2="20%" y2="60%" stroke={`${T.red}25`} strokeWidth="1" strokeDasharray="4 4" style={{ animation: "partnerDash 1.2s linear infinite" }} />
      </svg>
    </div>
  );
}

/* ─────────────────────────── DASHBOARD MOCKUP ─────────────────────────── */
function DashboardMockup() {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      overflow: "hidden",
      animation: "partnerGlow 4s ease-in-out infinite",
    }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: "#141414" }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: T.red, opacity: 0.7 }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: T.amber, opacity: 0.7 }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: T.green, opacity: 0.7 }} />
        <span style={{ fontSize: 10, color: T.textMuted, marginLeft: 8, fontFamily: "monospace" }}>The Square &mdash; Dashboard</span>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Metric cards row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Health Score", value: "87", color: T.green, trend: "+12" },
            { label: "Active Members", value: "214", color: T.blue, trend: "+18" },
            { label: "Engagement", value: "64%", color: T.orange, trend: "+5%" },
            { label: "Events", value: "8", color: T.purple, trend: "+3" },
          ].map((m, i) => (
            <div key={i} style={{ flex: 1, background: "#111", border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>{m.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: m.color, fontFamily: "var(--font-serif)" }}>{m.value}</span>
                <span style={{ fontSize: 10, color: T.green }}>&#9650; {m.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mini chart */}
        <div style={{ background: "#111", border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>Member Engagement — 6 months</div>
          <svg viewBox="0 0 400 80" style={{ width: "100%", height: 60 }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.orange} stopOpacity="0.3" />
                <stop offset="100%" stopColor={T.orange} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,60 L67,48 L133,52 L200,38 L267,28 L333,22 L400,10" fill="none" stroke={T.orange} strokeWidth="2" />
            <path d="M0,60 L67,48 L133,52 L200,38 L267,28 L333,22 L400,10 L400,80 L0,80Z" fill="url(#chartGrad)" />
            {[0,67,133,200,267,333,400].map((x, i) => (
              <line key={i} x1={x} y1="0" x2={x} y2="80" stroke="#333" strokeWidth="0.5" />
            ))}
          </svg>
        </div>

        {/* Community cards row */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { name: "Adobe Live BCN", members: 156, color: T.red },
            { name: "SF Design Week", members: 89, color: T.blue },
            { name: "PM Network", members: 234, color: T.purple },
          ].map((c, i) => (
            <div key={i} style={{ flex: 1, background: "#111", border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: c.color }} />
                <span style={{ fontSize: 10, color: T.textPrimary, fontWeight: 500 }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 9, color: T.textMuted }}>{c.members} members</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── AI CHAT MOCKUP ─────────────────────────── */
function AIChatMockup() {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      overflow: "hidden",
    }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: "#141414" }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: `${T.orange}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: T.orange }} />
        </div>
        <span style={{ fontSize: 12, color: T.textPrimary, fontWeight: 500 }}>Ellie</span>
        <span style={{ fontSize: 10, color: T.green, marginLeft: "auto" }}>&#9679; Online</span>
      </div>

      {/* Messages */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* User message */}
        <div style={{
          alignSelf: "flex-end",
          background: "#222",
          border: `1px solid ${T.border}`,
          borderRadius: "12px 12px 4px 12px",
          padding: "10px 14px",
          maxWidth: "85%",
          animation: "partnerSlideRight 0.5s ease 0.3s both",
        }}>
          <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.5 }}>
            I run a design community in Barcelona, about 200 members. We meet monthly and coordinate on WhatsApp.
          </div>
        </div>

        {/* AI response 1 */}
        <div style={{
          alignSelf: "flex-start",
          background: `${T.orange}08`,
          border: `1px solid ${T.orange}20`,
          borderRadius: "12px 12px 12px 4px",
          padding: "10px 14px",
          maxWidth: "85%",
          animation: "partnerSlideRight 0.5s ease 0.8s both",
        }}>
          <div style={{ fontSize: 10, color: T.orange, fontWeight: 600, marginBottom: 4 }}>Ellie</div>
          <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>
            Setting up your Arcade with event management, member directory, and sponsor matching for design-focused brands.
          </div>
        </div>

        {/* AI response 2 */}
        <div style={{
          alignSelf: "flex-start",
          background: `${T.orange}08`,
          border: `1px solid ${T.orange}20`,
          borderRadius: "12px 12px 12px 4px",
          padding: "10px 14px",
          maxWidth: "85%",
          animation: "partnerSlideRight 0.5s ease 1.3s both",
        }}>
          <div style={{ fontSize: 10, color: T.orange, fontWeight: 600, marginBottom: 4 }}>Ellie</div>
          <div style={{ fontSize: 12, color: "#D1D5DB", lineHeight: 1.5 }}>
            Deploying agents to your WhatsApp group and Instagram now&hellip; Your Arcade will be live in 30 seconds.
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: `${T.orange}15`, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: T.orange, borderRadius: 2, animation: "partnerBarGrow 2s ease 1.8s both", ["--bar-width" as string]: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── FLYWHEEL DIAGRAM ─────────────────────────── */
function FlywheelDiagram() {
  const steps = [
    { label: "Bots collect", sub: "WhatsApp, IG, Eventbrite", color: T.orange, angle: 0 },
    { label: "AI insights", sub: "patterns & predictions", color: T.blue, angle: 90 },
    { label: "Operators act", sub: "events, outreach, content", color: T.green, angle: 180 },
    { label: "Better outcomes", sub: "retention & growth", color: T.purple, angle: 270 },
  ];
  const r = 90;
  const cx = 130;
  const cy = 110;
  return (
    <div style={{ position: "relative", width: 260, height: 220, margin: "0 auto" }}>
      <svg viewBox="0 0 260 220" style={{ width: "100%", height: "100%" }}>
        {/* Circular arrow path */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${T.textMuted}20`} strokeWidth="1.5"
          strokeDasharray="8 4" style={{ animation: "partnerDash 3s linear infinite" }} />
        {/* Arrow indicators */}
        {[45, 135, 225, 315].map((angle, i) => {
          const ax = cx + (r + 2) * Math.cos((angle * Math.PI) / 180);
          const ay = cy + (r + 2) * Math.sin((angle * Math.PI) / 180);
          return (
            <circle key={i} cx={ax} cy={ay} r={3} fill={steps[i].color} opacity={0.6} />
          );
        })}
      </svg>
      {/* Center */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: T.textPrimary, fontFamily: "var(--font-serif)" }}>87</div>
        <div style={{ fontSize: 8, color: T.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.15em" }}>health</div>
      </div>
      {/* Labels at 4 positions */}
      {steps.map((s, i) => {
        const positions = [
          { left: "50%", top: -4, transform: "translateX(-50%)" },
          { right: -20, top: "50%", transform: "translateY(-50%)" },
          { left: "50%", bottom: -4, transform: "translateX(-50%)" },
          { left: -20, top: "50%", transform: "translateY(-50%)" },
        ];
        const pos = positions[i];
        return (
          <div key={i} style={{
            position: "absolute", ...pos,
            textAlign: "center",
            width: 100,
          } as React.CSSProperties}>
            <div style={{ fontSize: 10, fontWeight: 600, color: s.color }}>{s.label}</div>
            <div style={{ fontSize: 8, color: T.textMuted }}>{s.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── INTERSECTION OBSERVER HOOK ─────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    const sections = el.querySelectorAll(".partner-section");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function PartnerPage() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const scrollRef = useScrollReveal();

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      color: T.textPrimary,
      fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
    }}>
      <GridBG />
      <style dangerouslySetInnerHTML={{ __html: cssAnimations }} />

      <div ref={scrollRef} style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "80px 32px 120px" }}>

        {/* ═══════════════════════════ HERO ═══════════════════════════ */}
        <div className="partner-section visible" style={{ marginBottom: 100, position: "relative", minHeight: 280 }}>
          <HeroNetwork />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase" as const, color: T.textMuted, marginBottom: 20 }}>
              DESIGN PARTNER PROGRAM
            </div>
            <h1 style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: 64,
              fontWeight: 400,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: T.textPrimary,
              margin: 0,
              textTransform: "lowercase" as const,
            }}>
              Central Square
            </h1>
            <p style={{ fontSize: 20, color: T.textSecondary, fontWeight: 300, marginTop: 20, lineHeight: 1.6, maxWidth: 480 }}>
              The operating system for community programs.<br />
              We&apos;re inviting a small group of partners to shape it with us.
            </p>
            <div style={{ marginTop: 32, display: "flex", gap: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.green, boxShadow: `0 0 8px ${T.green}60` }} />
                <span style={{ fontSize: 13, color: T.textSecondary }}>5 spots available</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.orange, boxShadow: `0 0 8px ${T.orange}60` }} />
                <span style={{ fontSize: 13, color: T.textSecondary }}>90-day pilot</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.blue, boxShadow: `0 0 8px ${T.blue}60` }} />
                <span style={{ fontSize: 13, color: T.textSecondary }}>Free access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ THE PROBLEM ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            THE PROBLEM
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 32, textTransform: "lowercase" as const,
          }}>
            community operators are drowning in tools
          </h2>

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* Stats */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { stat: "8+", label: "tools to manage a single community", color: T.orange },
                { stat: "15hrs", label: "per week on manual operations", color: T.blue },
                { stat: "0", label: "platforms built for the operator", color: T.purple },
              ].map((item, i) => (
                <div key={i} style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
                  padding: "20px 24px", borderLeft: `3px solid ${item.color}`,
                  display: "flex", alignItems: "center", gap: 20,
                }}>
                  <div style={{ fontSize: 40, fontWeight: 300, color: item.color, fontFamily: "var(--font-serif)", minWidth: 70, textAlign: "center" }}>
                    {item.stat}
                  </div>
                  <div style={{ fontSize: 15, color: T.textSecondary, lineHeight: 1.5 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Chaos visual */}
            <div style={{ flex: 1 }}>
              <ChaosTools />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ WHAT WE'RE BUILDING ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            WHAT WE&apos;RE BUILDING
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 16, textTransform: "lowercase" as const,
          }}>
            one platform to run your entire community
          </h2>
          <p style={{ fontSize: 16, color: T.textSecondary, lineHeight: 1.7, fontWeight: 300, marginBottom: 32, maxWidth: 640 }}>
            Central Square gives community operators a single hub &mdash; powered by AI &mdash; that replaces the patchwork of tools you use today. Events, engagement, analytics, sponsor matching, and member management. All in one place.
          </p>

          <div style={{ display: "flex", gap: 24 }}>
            {/* Feature cards */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { title: "AI-Powered Onboarding", desc: "Describe your community in 60 seconds. Ellie configures everything.", icon: "&#9889;", color: T.orange },
                { title: "Cross-Platform Agents", desc: "Deploy to WhatsApp, Instagram, Eventbrite. Zero migration.", icon: "&#9883;", color: T.blue },
                { title: "Community Intelligence", desc: "Health scoring, engagement patterns, churn prediction.", icon: "&#9733;", color: T.green },
                { title: "Sponsor Matching", desc: "Automated brand-community fit. Real ROI metrics.", icon: "&#9830;", color: T.purple },
              ].map((f, i) => (
                <div key={i} style={{
                  background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px",
                  display: "flex", gap: 16, alignItems: "flex-start",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${f.color}12`, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, color: f.color, flexShrink: 0,
                  }} dangerouslySetInnerHTML={{ __html: f.icon }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard mockup */}
            <div style={{ flex: 1 }}>
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ HOW IT WORKS (AI CHAT + FLYWHEEL) ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            HOW IT WORKS
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 32, textTransform: "lowercase" as const,
          }}>
            describe your community. william handles the rest.
          </h2>

          <div style={{ display: "flex", gap: 32 }}>
            {/* AI Chat */}
            <div style={{ flex: 1 }}>
              <AIChatMockup />
            </div>

            {/* Flywheel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.textMuted, marginBottom: 16, textAlign: "center" }}>
                The Intelligence Flywheel
              </div>
              <FlywheelDiagram />
              <div style={{ fontSize: 13, color: T.textSecondary, textAlign: "center", fontStyle: "italic", marginTop: 16, maxWidth: 240 }}>
                Every interaction makes the platform smarter
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ THE PROGRAM ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            THE PROGRAM
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 16, textTransform: "lowercase" as const,
          }}>
            design partner &mdash; not beta tester
          </h2>
          <p style={{ fontSize: 16, color: T.textSecondary, lineHeight: 1.7, fontWeight: 300, marginBottom: 32, maxWidth: 640 }}>
            We&apos;re selecting 5 community programs to co-build Central Square with. You get early access and a direct line to the product team. We get honest usage and real feedback.
          </p>

          <div style={{ display: "flex", gap: 20 }}>
            {/* What you get */}
            <div style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: T.green }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: T.green, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 20 }}>
                What you get
              </div>
              {[
                "Free access for the entire pilot (6 months)",
                "Direct line to founders \u2014 weekly check-ins",
                "Priority feature requests \u2014 you shape the roadmap",
                "Founding partner pricing when we go paid",
                "Your community data and insights from day one",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: T.green, marginTop: 7, flexShrink: 0 }} />
                  <div style={{ fontSize: 14, color: "#D1D5DB", lineHeight: 1.6, fontWeight: 300 }}>{item}</div>
                </div>
              ))}
            </div>
            {/* What we need */}
            <div style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: T.blue }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: T.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 20 }}>
                What we need from you
              </div>
              {[
                "An active community with regular events or engagement",
                "A point person who will use the platform weekly",
                "Honest, direct feedback \u2014 tell us when it sucks",
                "Access to your existing channels (WhatsApp, events, etc.)",
                "30 minutes every two weeks for a check-in call",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, background: T.blue, marginTop: 7, flexShrink: 0 }} />
                  <div style={{ fontSize: 14, color: "#D1D5DB", lineHeight: 1.6, fontWeight: 300 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ 90-DAY TIMELINE ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            90-DAY PILOT
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 40, textTransform: "lowercase" as const,
          }}>
            from onboarding to decision in 3 months
          </h2>

          <div style={{ display: "flex", gap: 16 }}>
            {[
              {
                phase: "Week 1", title: "Onboarding",
                desc: "We deploy AI agents on your existing channels. No migration, no disruption. Your community doesn\u2019t even notice.",
                color: T.orange, icon: "&#9889;",
                metrics: ["Agents deployed", "Channels connected", "First data in"],
              },
              {
                phase: "Week 2-4", title: "First insights",
                desc: "The platform starts collecting engagement data and surfacing patterns you\u2019ve never seen before.",
                color: T.blue, icon: "&#9733;",
                metrics: ["Health score live", "Member mapping", "Engagement patterns"],
              },
              {
                phase: "Month 2", title: "Deep usage",
                desc: "You\u2019re using Central Square for events, member management, and sponsor outreach. We iterate on your feedback.",
                color: T.green, icon: "&#9830;",
                metrics: ["Full platform adoption", "Sponsor matches", "Growth insights"],
              },
              {
                phase: "Month 3", title: "Evaluation",
                desc: "We review together \u2014 what worked, what didn\u2019t. You decide to continue on founding partner terms.",
                color: T.purple, icon: "&#10003;",
                metrics: ["ROI measured", "Decision point", "Partner terms offered"],
              },
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: T.card,
                  border: `1px solid ${hoveredStep === i ? step.color + "60" : T.border}`,
                  borderRadius: 10,
                  padding: "24px 20px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                  transition: "border-color 0.3s ease",
                }}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: step.color, opacity: hoveredStep === i ? 1 : 0.5, transition: "opacity 0.3s" }} />
                <div style={{ fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: step.color, marginBottom: 8 }}>{step.phase}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, fontWeight: 300, marginBottom: 16 }}>{step.desc}</div>
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {step.metrics.map((m, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: 2, background: step.color, opacity: 0.6 }} />
                      <span style={{ fontSize: 11, color: T.textMuted }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════ IDEAL PARTNER ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: T.orange, marginBottom: 12 }}>
            IDEAL PARTNER
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
            fontSize: 36, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
            margin: 0, marginBottom: 24, textTransform: "lowercase" as const,
          }}>
            who this is for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { title: "Professional communities", desc: "Design, tech, creative, or industry networks with 50-500+ active members", color: T.orange, num: "50-500+", unit: "members" },
              { title: "Institutional programs", desc: "Universities, nonprofits, or civic orgs running community engagement initiatives", color: T.blue, num: "Civic", unit: "& nonprofit" },
              { title: "Enterprise community teams", desc: "Companies with customer or employee communities who need better tooling", color: T.green, num: "B2B", unit: "community teams" },
            ].map((p, i) => (
              <div key={i} style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "28px 24px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: p.color }} />
                <div style={{ fontSize: 28, fontWeight: 300, color: p.color, fontFamily: "var(--font-serif)", marginBottom: 4 }}>{p.num}</div>
                <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 16 }}>{p.unit}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, fontWeight: 300 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════ CTA ═══════════════════════════ */}
        <div className="partner-section" style={{ marginBottom: 64 }}>
          <div style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: "60px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top gradient line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.orange}, ${T.blue}, ${T.purple})` }} />

            {/* Subtle radial glow */}
            <div style={{
              position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
              width: 400, height: 400, borderRadius: "50%",
              background: `radial-gradient(circle, ${T.orange}08 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }}>
              <h2 style={{
                fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                fontSize: 40, fontWeight: 400, lineHeight: 1.15, color: T.textPrimary,
                margin: 0, marginBottom: 16, textTransform: "lowercase" as const,
              }}>
                let&apos;s build this together
              </h2>
              <p style={{ fontSize: 17, color: T.textSecondary, fontWeight: 300, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.6 }}>
                We&apos;re selecting 5 design partners for our first cohort.
                If you run a community and want to shape the future of community operations, we want to talk.
              </p>
              <a
                href="mailto:teijas@centralsquare.ai?subject=Design Partner Program"
                style={{
                  display: "inline-block",
                  background: T.orange,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "16px 40px",
                  borderRadius: 8,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.target as HTMLAnchorElement;
                  el.style.background = "#e55d2b";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = `0 8px 24px ${T.orange}40`;
                }}
                onMouseLeave={(e) => {
                  const el = e.target as HTMLAnchorElement;
                  el.style.background = T.orange;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                Get in touch
              </a>
              <div style={{ marginTop: 16, fontSize: 13, color: T.textMuted }}>
                teijas@centralsquare.ai
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
        <div style={{ textAlign: "center", paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 300 }}>
            Central Square &middot; San Francisco &middot; 2025
          </div>
        </div>

      </div>
    </div>
  );
}

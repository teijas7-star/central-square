"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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
  textDim: "#444444",
};

/* ─────────────────────────── GRID BG ─────────────────────────── */
function GridBG() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.3 }}>
      <defs>
        <pattern id="grid80" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid80)" />
    </svg>
  );
}

/* ─────────────────────────── NETWORK VIZ (Title Slide) ─────────────────────────── */
function NetworkViz() {
  const nodes = [
    { x: 420, y: 100, r: 8, hero: true }, { x: 560, y: 180, r: 7, hero: true },
    { x: 350, y: 220, r: 6, hero: true }, { x: 480, y: 300, r: 5, hero: false },
    { x: 300, y: 140, r: 4, hero: false }, { x: 620, y: 280, r: 5, hero: false },
    { x: 400, y: 380, r: 4, hero: false }, { x: 250, y: 300, r: 4, hero: false },
    { x: 550, y: 400, r: 4, hero: false }, { x: 180, y: 200, r: 3, hero: false },
    { x: 680, y: 180, r: 3, hero: false }, { x: 320, y: 440, r: 3, hero: false },
    { x: 600, y: 100, r: 3, hero: false }, { x: 200, y: 380, r: 3, hero: false },
    { x: 500, y: 460, r: 3, hero: false }, { x: 150, y: 280, r: 3, hero: false },
    { x: 700, y: 350, r: 3, hero: false }, { x: 440, y: 50, r: 3, hero: false },
  ];
  const edges: [number, number][] = [
    [0,1],[0,2],[0,3],[0,4],[0,17],[1,3],[1,5],[1,10],[1,12],[2,3],[2,4],[2,7],
    [3,6],[3,8],[5,8],[5,16],[6,8],[6,11],[7,9],[7,13],[7,15],[8,14],[9,15],[10,12],[11,14],[13,15],[14,8],
  ];
  return (
    <svg viewBox="0 0 850 520" style={{ width: "100%", maxWidth: 750, opacity: 0.5, position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", zIndex: 0 }}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {edges.map(([a, b], i) => {
        const mx = (nodes[a].x + nodes[b].x) / 2 + (Math.random() - 0.5) * 30;
        const my = (nodes[a].y + nodes[b].y) / 2 + (Math.random() - 0.5) * 30;
        const isHero = nodes[a].hero || nodes[b].hero;
        return <path key={i} d={`M${nodes[a].x},${nodes[a].y} Q${mx},${my} ${nodes[b].x},${nodes[b].y}`} fill="none" stroke={isHero ? `${T.orange}40` : "#2D374830"} strokeWidth={isHero ? 1.2 : 0.8} />;
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.hero ? T.orange : "#4A5568"} filter={n.hero ? "url(#glow)" : undefined} opacity={n.hero ? 1 : 0.5} />
      ))}
    </svg>
  );
}

/* ─────────────────────────── SLIDE LAYOUT ─────────────────────────── */
function SlideLayout({ eyebrow, slideNum, total, children }: { eyebrow?: string; slideNum: number; total: number; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <GridBG />
      {eyebrow && (
        <div style={{ position: "absolute", top: 48, left: 48, zIndex: 10, fontSize: 10, fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#9CA3AF" }}>
          {eyebrow}
        </div>
      )}
      <div style={{ position: "absolute", bottom: 48, right: 48, zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: T.textDim, letterSpacing: "0.15em" }}>
          {String(slideNum).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#374151" strokeWidth="0.5" opacity={0.5} /></svg>
      </div>
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "100px 80px 80px 80px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────── HELPER COMPONENTS ─────────────────────────── */
function BulletList({ items, color = T.orange }: { items: string[]; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: color, marginTop: 7, flexShrink: 0 }} />
          <div style={{ fontSize: 16, color: "#D1D5DB", lineHeight: 1.6, fontWeight: 300 }}>{item}</div>
        </div>
      ))}
    </div>
  );
}

function PricingCard({ tier, price, features, highlighted = false, accent = T.amber }: { tier: string; price: string; features: string[]; highlighted?: boolean; accent?: string }) {
  return (
    <div style={{ background: highlighted ? "#1E1A14" : T.card, border: `1px solid ${highlighted ? accent : T.border}`, borderRadius: 12, padding: "32px 28px", flex: 1, minWidth: 200, position: "relative" }}>
      {highlighted && <div style={{ position: "absolute", top: -1, left: 24, right: 24, height: 3, background: accent, borderRadius: "0 0 2px 2px" }} />}
      <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: T.textMuted, marginBottom: 8 }}>{tier}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color: T.textPrimary, marginBottom: 20, fontFamily: "var(--font-serif)" }}>{price}</div>
      {features.map((f, i) => (
        <div key={i} style={{ fontSize: 13, color: T.textSecondary, marginBottom: 8, paddingLeft: 16, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: T.textMuted }}>·</span>{f}
        </div>
      ))}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; saas: number; sponsor: number; tx: number }[] }) {
  const max = Math.max(...data.map(d => d.saas + d.sponsor + d.tx));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 32, height: 220 }}>
      {data.map((d, i) => {
        const total = d.saas + d.sponsor + d.tx;
        const h = (total / max) * 190;
        const hS = (d.saas / total) * h;
        const hO = (d.sponsor / total) * h;
        const hT = (d.tx / total) * h;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: 8 }}>${(total / 1000).toFixed(0)}K</div>
            <div style={{ width: 48, display: "flex", flexDirection: "column", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: hS, background: T.blue }} />
              <div style={{ height: hO, background: T.orange }} />
              <div style={{ height: hT, background: "#5A6C7D" }} />
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function AllocationBars({ items }: { items: { label: string; pct: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: T.textPrimary }}>{item.label}</span>
            <span style={{ fontSize: 14, color: T.textSecondary }}>{item.pct}%</span>
          </div>
          <div style={{ height: 8, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── SVG Icons ─── */
function UserIcon({ size = 24, color = "#9CA3AF" }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

function CigaretteIcon({ size = 24, color = "#9CA3AF" }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="1" y="15" width="18" height="4" rx="1" /><path d="M21 8c0-2-1-3-3-3s-3 1-3 3 1 3 3 3 3-1 3-3z" /><line x1="19" y1="11" x2="19" y2="15" /></svg>;
}

function MicIcon({ size = 32, color = T.blue }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><rect x="9" y="1" width="6" height="11" rx="3" /><path d="M19 10a7 7 0 01-14 0" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>;
}

/* ─────────────────────────── INDIVIDUAL SLIDES ─────────────────────────── */

/* SLIDE 1: Title */
function Slide01Title() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <GridBG />
      <NetworkViz />
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 88, fontWeight: 400, lineHeight: 0.95, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          central<br />square
        </h1>
        <p style={{ fontSize: 22, fontWeight: 300, color: "#bbb", marginTop: 24, maxWidth: 480 }}>
          The digital public square for real human connection
        </p>
        <div style={{ marginTop: 48, fontSize: 13, fontWeight: 600, color: T.orange, letterSpacing: "0.1em" }}>
          SEED ROUND &middot; $3M
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 48, right: 48, zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: T.textDim, letterSpacing: "0.15em" }}>01 / 26</span>
        <svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#374151" strokeWidth="0.5" opacity={0.5} /></svg>
      </div>
    </div>
  );
}

/* SLIDE 2: Connection Crisis */
function Slide02({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="THE PROBLEM" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 600, textTransform: "lowercase" as const }}>
          we&apos;re in a connection crisis
        </h2>
        <div style={{ display: "flex", gap: 60, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {["60% of adults report feeling lonely — the loneliness epidemic rivals smoking in health impact",
                "Social platforms promised connection but delivered isolation and algorithmic manipulation",
                "Real-world communities growing 40% YoY as people seek genuine belonging",
              ].map((t, i) => (
                <div key={i} style={{ borderLeft: `1px solid #374151`, paddingLeft: 16, fontSize: 15, color: "#D1D5DB", lineHeight: 1.6, fontWeight: 300 }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 500 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 32 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: T.textMuted, marginBottom: 16 }}>HEALTH EQUIVALENCY</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                <UserIcon size={28} color={T.textSecondary} />
                <span style={{ fontSize: 16, color: T.textMuted }}>=</span>
                <CigaretteIcon size={28} color={T.textSecondary} />
                <span style={{ fontSize: 13, color: T.textSecondary, marginLeft: 8 }}>Loneliness = 15 cigarettes/day</span>
              </div>
              {[{ label: "Dementia risk", val: "+50%" }, { label: "Stroke risk", val: "+32%" }, { label: "Heart disease", val: "+29%" }, { label: "Premature death", val: "+29%" }].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 14, color: T.textSecondary }}>{item.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: T.orange }}>{item.val}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "16px 0", borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8 }}>ECONOMIC IMPACT</div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div><div style={{ fontSize: 28, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)" }}>$154B</div><div style={{ fontSize: 11, color: T.textMuted }}>Annual US cost</div></div>
                  <div><div style={{ fontSize: 28, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)" }}>$6.7B</div><div style={{ fontSize: 11, color: T.textMuted }}>UK employer cost</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 3: Platform Problem */
function Slide03({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="WHY PLATFORMS FAIL" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 700, textTransform: "lowercase" as const }}>
          existing &apos;social&apos; media optimize for attention, not belonging
        </h2>
        <div style={{ display: "flex", gap: 60, width: "100%" }}>
          <div style={{ flex: 1 }}>
            {["Algorithmic feeds bury community content under viral noise", "Creator-centric models collapse when individuals leave", "No economic infrastructure for community sustainability"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: `${T.red}80`, marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: 16, color: "#D1D5DB", lineHeight: 1.6, fontWeight: 300 }}>{t}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 320, height: 400 }}>
              {/* Standing figure */}
              <svg width="80" height="200" viewBox="0 0 80 200" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
                <circle cx="40" cy="25" r="16" fill="#2D3748" stroke="#4A5568" strokeWidth="1" />
                <rect x="25" y="45" width="30" height="60" rx="8" fill="#2D3748" stroke="#4A5568" strokeWidth="1" />
                <rect x="32" y="90" width="16" height="24" rx="3" fill="#1A1A1A" stroke="#4A5568" strokeWidth="0.5" />
                <line x1="32" y1="105" x2="32" y2="160" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
                <line x1="48" y1="105" x2="48" y2="160" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {/* Floating notifications */}
              {[
                { x: 40, y: 60, icon: "\u2665", color: "#EF4444", delay: "0s" },
                { x: 220, y: 90, icon: "\uD83D\uDCAC", color: T.blue, delay: "0.5s" },
                { x: 60, y: 250, icon: "\u21BB", color: T.green, delay: "1s" },
                { x: 240, y: 200, icon: "+1", color: T.purple, delay: "1.5s" },
                { x: 180, y: 310, icon: "\u2665", color: "#E1306C", delay: "0.7s" },
                { x: 30, y: 160, icon: "\u2605", color: T.amber, delay: "1.2s" },
              ].map((notif, i) => (
                <div key={i} style={{ position: "absolute", left: notif.x, top: notif.y, width: 36, height: 36, borderRadius: 18, background: `${notif.color}20`, border: `1px solid ${notif.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: notif.color, animation: `pitchBob 3s ease-in-out ${notif.delay} infinite` }}>
                  {notif.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 4: Insight - Place */
function Slide04({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="THE INSIGHT" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 600, textTransform: "lowercase" as const }}>
          community needs a place to live
        </h2>
        <div style={{ display: "flex", gap: 60, width: "100%" }}>
          <div style={{ flex: "0 0 35%" }}>
            <div style={{ borderLeft: `4px solid ${T.blue}`, paddingLeft: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 18, color: "#D1D5DB", fontStyle: "italic", lineHeight: 1.6, fontWeight: 300 }}>
                &ldquo;We built the internet&apos;s highways. We forgot its public squares.&rdquo;
              </div>
            </div>
          </div>
          <div style={{ flex: "0 0 65%", display: "flex", justifyContent: "center" }}>
            <svg viewBox="0 0 700 300" style={{ width: "100%", maxWidth: 600 }}>
              {/* Physical World nodes (left) */}
              {[{ y: 80, label: "Meetups" }, { y: 150, label: "Events" }, { y: 220, label: "Chapters" }].map((node, i) => (
                <g key={`p${i}`}>
                  <circle cx={100} cy={node.y} r={20} fill={`${T.blue}15`} stroke={`${T.blue}50`} strokeWidth="1" />
                  <text x={100} y={node.y + 4} textAnchor="middle" fill={T.textSecondary} fontSize="9" fontFamily="sans-serif">{node.label}</text>
                  <line x1={120} y1={node.y} x2={300} y2={150} stroke={`${T.blue}30`} strokeWidth="1" markerEnd="url(#arrowBlue)" />
                </g>
              ))}
              {/* Central Square hub */}
              <circle cx={350} cy={150} r={45} fill={`${T.orange}15`} stroke={T.orange} strokeWidth="1.5" />
              <text x={350} y={145} textAnchor="middle" fill={T.orange} fontSize="10" fontWeight="600" fontFamily="sans-serif">Central</text>
              <text x={350} y={160} textAnchor="middle" fill={T.orange} fontSize="10" fontWeight="600" fontFamily="sans-serif">Square</text>
              {/* Digital World nodes (right) */}
              {[{ y: 80, label: "Analytics" }, { y: 150, label: "Sponsors" }, { y: 220, label: "Growth" }].map((node, i) => (
                <g key={`d${i}`}>
                  <circle cx={600} cy={node.y} r={20} fill={`${T.orange}10`} stroke={`${T.orange}40`} strokeWidth="1" />
                  <text x={600} y={node.y + 4} textAnchor="middle" fill={T.textSecondary} fontSize="9" fontFamily="sans-serif">{node.label}</text>
                  <line x1={400} y1={150} x2={580} y2={node.y} stroke={`${T.orange}30`} strokeWidth="1" markerEnd="url(#arrowOrange)" />
                </g>
              ))}
              {/* Labels */}
              <text x={100} y={270} textAnchor="middle" fill={T.textMuted} fontSize="11" fontFamily="sans-serif">Physical World</text>
              <text x={600} y={270} textAnchor="middle" fill={T.textMuted} fontSize="11" fontFamily="sans-serif">Digital World</text>
              <defs>
                <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d={`M0,0 L6,3 L0,6`} fill={`${T.blue}50`} /></marker>
                <marker id="arrowOrange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d={`M0,0 L6,3 L0,6`} fill={`${T.orange}50`} /></marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 5: Solution Discovery */
function Slide05({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="THE SOLUTION" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 700, textTransform: "lowercase" as const }}>
          from idea to Arcade in 90 seconds
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <div style={{ background: "linear-gradient(90deg, #0a0a0a 60%, transparent)", position: "relative", zIndex: 1 }}>
              {[
                { num: "01", label: "Describe your community to William" },
                { num: "02", label: "AI generates your Arcade configuration" },
                { num: "03", label: "Sponsor matching runs automatically" },
                { num: "04", label: "Go live with full intelligence stack" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, border: `1px solid ${T.blue}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.blue, flexShrink: 0 }}>{step.num}</div>
                  <div style={{ fontSize: 15, color: "#D1D5DB", lineHeight: 1.5, fontWeight: 300, paddingTop: 4 }}>{step.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1.2 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Voice viz */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <MicIcon size={24} />
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {[12, 20, 8, 24, 16, 28, 10, 22, 14, 26, 18, 12].map((h, i) => (
                    <div key={i} style={{ width: 3, height: h, background: T.blue, borderRadius: 2, opacity: 0.6 }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: T.textMuted, marginLeft: "auto" }}>Listening...</span>
              </div>
              {/* AI transcription */}
              <div style={{ background: `${T.orange}08`, border: `1px solid ${T.orange}20`, borderRadius: 8, padding: "12px 16px" }}>
                <span style={{ fontSize: 11, color: T.orange }}>William AI</span>
                <div style={{ fontSize: 13, color: T.textSecondary, marginTop: 4 }}>Setting up &ldquo;SF Design Collective&rdquo; with event management, member directory, and sponsor matching...</div>
              </div>
              {/* Sponsor matching */}
              <div style={{ display: "flex", gap: 8 }}>
                {[{ name: "Adobe", match: "94%" }, { name: "Figma", match: "91%" }].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: T.textPrimary }}>{s.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.green }}>{s.match}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 6: Strategy - Real World */
function Slide06({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="GO-TO-MARKET" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 700, textTransform: "lowercase" as const }}>
          start with real-world communities already meeting
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: "0 0 40%" }}>
            {[{ label: "Enterprise", desc: "Adobe, Microsoft-scale community programs" }, { label: "Professional", desc: "Design, tech, creative industry networks" }, { label: "Multi-chapter", desc: "Aspen Institute, civic organizations" }].map((item, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${T.green}`, paddingLeft: 16, marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: T.textSecondary, fontWeight: 300 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: "0 0 60%" }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.textMuted, marginBottom: 16 }}>THE SQUARE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { name: "Adobe Live", status: "Live", color: "#FF0000" },
                  { name: "SF Design Collective", status: "Live", color: T.blue },
                  { name: "Aspen Institute Spain", status: "Setting up", color: T.green },
                  { name: "RunClub BCN", status: "Live", color: T.orange },
                  { name: "Figma Community", status: "Invited", color: T.purple },
                  { name: "Wakelet EDU", status: "Live", color: T.amber },
                ].map((c, i) => (
                  <div key={i} style={{ background: "#111", border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 12px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: `${c.color}20`, marginBottom: 8 }} />
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: c.status === "Live" ? T.green : T.textMuted }}>{c.status}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 24, padding: "10px 0", borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 11, color: T.textMuted }}>6 communities</span>
                <span style={{ fontSize: 11, color: T.textMuted }}>4 live</span>
                <span style={{ fontSize: 11, color: T.green }}>12K+ members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 7: Burned Out */
function Slide07({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="OPERATOR PAIN" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 600, textTransform: "lowercase" as const }}>
          community builders are burned out
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: "0 0 35%" }}>
            <div style={{ borderLeft: `3px solid ${T.orange}`, paddingLeft: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 16, color: "#D1D5DB", fontStyle: "italic", lineHeight: 1.6, fontWeight: 300 }}>
                &ldquo;I spend more time on admin than actually building community.&rdquo;
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8 }}>— Community operator, 2,400 members</div>
            </div>
          </div>
          <div style={{ flex: "0 0 65%", position: "relative", minHeight: 340 }}>
            {/* Chaos visualization with floating tool windows */}
            {[
              { name: "Google Sheets", x: 10, y: 0, rot: -5, badge: 3, color: "#34A853" },
              { name: "Gmail", x: 200, y: 20, rot: 3, badge: 47, color: "#EA4335" },
              { name: "Eventbrite", x: 380, y: 10, rot: -2, badge: 8, color: "#F6682F" },
              { name: "Notion", x: 50, y: 130, rot: 4, badge: 0, color: "#000" },
              { name: "Discord", x: 240, y: 150, rot: -3, badge: 156, color: "#5865F2" },
              { name: "WhatsApp", x: 430, y: 120, rot: 2, badge: 89, color: "#25D366" },
              { name: "Instagram", x: 100, y: 250, rot: -4, badge: 24, color: "#E1306C" },
              { name: "Stripe", x: 320, y: 260, rot: 3, badge: 5, color: "#635BFF" },
            ].map((tool, i) => (
              <div key={i} style={{ position: "absolute", left: tool.x, top: tool.y, transform: `rotate(${tool.rot}deg)`, width: 140, background: "#111", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", zIndex: i }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: tool.color }} />
                    <span style={{ fontSize: 10, color: T.textPrimary, fontWeight: 500 }}>{tool.name}</span>
                  </div>
                  {tool.badge > 0 && (
                    <div style={{ background: T.red, borderRadius: 8, padding: "1px 5px", fontSize: 9, color: "white", fontWeight: 600 }}>{tool.badge}</div>
                  )}
                </div>
                <div style={{ height: 20, background: "#1A1A1A", borderRadius: 3 }} />
              </div>
            ))}
            {/* Chaotic connector lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1, opacity: 0.15 }}>
              <line x1="80" y1="30" x2="270" y2="170" stroke={T.red} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="270" y1="40" x2="310" y2="170" stroke={T.red} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="450" y1="30" x2="500" y2="140" stroke={T.red} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="120" y1="150" x2="170" y2="270" stroke={T.red} strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 8: Competition */
function Slide08({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="COMPETITION" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 700, textTransform: "lowercase" as const }}>
          a market with no clear winner
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, width: "100%" }}>
          {[
            { name: "Discord", focus: "Gaming chat", weakness: "No community ops", color: "#5865F2" },
            { name: "Circle", focus: "Online courses", weakness: "No real-world tools", color: "#8B5CF6" },
            { name: "Mighty Networks", focus: "Creator platforms", weakness: "No intelligence", color: "#06B6D4" },
            { name: "Bevy/CMX", focus: "Enterprise events", weakness: "No member experience", color: "#F59E0B" },
          ].map((c, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `2px solid ${c.color}`, borderRadius: 8, padding: "24px 20px" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 12 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>FOCUS</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 16 }}>{c.focus}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>WEAKNESS</div>
              <div style={{ fontSize: 13, color: T.orange }}>{c.weakness}</div>
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.orange}30`, borderRadius: 8, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: T.orange }} />
          <span style={{ fontSize: 14, color: "#D1D5DB", fontWeight: 300 }}>Central Square is the only platform combining real-world community operations with AI intelligence and a sponsorship marketplace.</span>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 9: Market Exploding */
function Slide09({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="MARKET SIZE" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, maxWidth: 600, textTransform: "lowercase" as const }}>
          community is exploding
        </h2>
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          {[
            { stat: "87%", label: "of companies now invest in community programs", sub: "Enterprise adoption at all-time high. Community budgets growing 28% CAGR.", color: T.orange },
            { stat: "12M+", label: "professional communities active globally", sub: "Design, tech, creative, and industry networks seeking better infrastructure.", color: T.blue },
            { stat: "2.5M+", label: "institutional communities in education & civic", sub: "Universities, foundations, and civic organizations digitalizing rapidly.", color: T.green },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "40px 28px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 72, fontWeight: 300, color: item.color, lineHeight: 1, marginBottom: 16, fontFamily: "var(--font-serif)" }}>{item.stat}</div>
              <div style={{ height: 1, background: T.border, marginBottom: 16 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 10: Business Model */
function Slide10({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="BUSINESS MODEL" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          business model
        </h2>
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          <PricingCard tier="Communities" price="$50-500/mo" features={["Self-serve onboarding", "AI agent deployment", "Basic analytics & insights", "Community Arcade home"]} />
          <PricingCard tier="Enterprises" price="$5K-30K/mo" features={["Custom AI training", "Multi-community dashboard", "Advanced intelligence", "Dedicated support", "White-label options"]} highlighted accent={T.amber} />
          <PricingCard tier="Marketplace" price="15-20%" features={["Sponsor matching", "Event transactions", "Community services", "Revenue share model"]} />
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: T.textMuted }}>Example:</span>
          <span style={{ fontSize: 13, color: T.textSecondary }}>Enterprise client @ $10K/mo + 15% marketplace fee on $50K sponsorship</span>
          <span style={{ fontSize: 13, color: T.green, fontWeight: 600, marginLeft: "auto" }}>= $17.5K net / month</span>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 11: Traction - Coalition */
function Slide11({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="TRACTION" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          building the coalition
        </h2>
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          <div style={{ flex: "0 0 66%", display: "flex", gap: 16 }}>
            {[
              { name: "Adobe", desc: "2.4M community members", type: "Enterprise", logo: <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 2,30 12,30" fill="#FF0000" /><polygon points="16,2 30,30 20,30" fill="#FF0000" /><polygon points="16,16 10,30 22,30" fill="#FF0000" /></svg> },
              { name: "Aspen Institute Spain", desc: "Civic leadership network", type: "Institutional", logo: <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,4 20,14 30,14 22,20 25,30 16,24 7,30 10,20 2,14 12,14" fill={T.amber} /></svg> },
              { name: "Wakelet", desc: "Education community platform", type: "Enterprise", logo: <svg width="32" height="32" viewBox="0 0 32 32"><text x="4" y="24" fontSize="22" fontWeight="700" fill={T.blue} fontFamily="sans-serif">W</text></svg> },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 20px" }}>
                <div style={{ marginBottom: 12 }}>{p.logo}</div>
                <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.textMuted, marginBottom: 8 }}>{p.type}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: T.textPrimary, marginBottom: 8, fontFamily: "var(--font-serif)" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: T.textSecondary }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ flex: "0 0 34%" }}>
            <div style={{ background: T.card, border: `1px dashed ${T.border}`, borderRadius: 12, padding: "28px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.orange, marginBottom: 12 }}>IN CONVERSATION</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary, marginBottom: 8, fontFamily: "var(--font-serif)" }}>Aspen Institute UK</div>
              <div style={{ fontSize: 13, color: T.textSecondary }}>Expanding institutional partnerships across European civic networks</div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 12: Revenue Projection */
function Slide12({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="REVENUE" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          revenue projection
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.blue}`, borderRadius: 8, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.blue, marginBottom: 8 }}>YEAR 1</div>
              <div style={{ fontSize: 36, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", marginBottom: 12 }}>$1M</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>· 50 communities @ avg $500/mo</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>· 5 enterprise @ avg $10K/mo</div>
              <div style={{ fontSize: 13, color: T.textSecondary }}>· $200K marketplace revenue</div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.orange}`, borderRadius: 8, padding: "24px 28px" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.orange, marginBottom: 8 }}>YEAR 2</div>
              <div style={{ fontSize: 36, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", marginBottom: 12 }}>$3M+</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>· 300 communities scaling</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginBottom: 4 }}>· 20+ enterprise accounts</div>
              <div style={{ fontSize: 13, color: T.textSecondary }}>· $800K+ marketplace revenue</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <BarChart data={[
              { label: "Year 1", saas: 600000, sponsor: 200000, tx: 200000 },
              { label: "Year 2", saas: 1600000, sponsor: 600000, tx: 800000 },
            ]} />
            <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
              {[{ label: "SaaS", color: T.blue }, { label: "Sponsorship", color: T.orange }, { label: "Transactions", color: "#5A6C7D" }].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 11, color: T.textMuted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 13: Team */
function Slide13({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="TEAM" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          building in San Francisco
        </h2>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { name: "Teijas", role: "CEO", bio: "Community builder. Product leader. Built and managed communities across 4 continents. Led product at multiple startups.", resp: "Product, execution, customer relationships" },
            { name: "William Powers", role: "COO", bio: "Co-founder of BlueFin Labs (sold to Twitter). 20+ years operations and strategy at the intersection of data, media, and communities.", resp: "Vision, institutional partnerships, data strategy" },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 24px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: `${T.orange}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12, color: T.orange }}>{p.name[0]}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.textPrimary }}>{p.name}</div>
              <div style={{ fontSize: 13, color: T.orange, marginBottom: 10 }}>{p.role}</div>
              <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5, marginBottom: 10 }}>{p.bio}</div>
              <div style={{ fontSize: 12, color: T.textMuted, fontStyle: "italic" }}>{p.resp}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { name: "Jeremy Rishel", role: "Advisor · CTO SoFi", bio: "Former CTO at SoFi. Deep enterprise infrastructure and scaling expertise." },
            { name: "Chester Chipperfield", role: "Advisor · ex-Tesla, Apple", bio: "Former head of social at Tesla and Apple. Brand and community strategy." },
          ].map((a, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.blue}40`, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: `${T.blue}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.blue, flexShrink: 0 }}>{a.name[0]}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary }}>{a.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{a.role}</div>
                <div style={{ fontSize: 12, color: T.textSecondary }}>{a.bio}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: `${T.orange}10`, border: `1px solid ${T.orange}30`, borderRadius: 8, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: T.orange, fontWeight: 600 }}>HIRING PLAN</span>
          <span style={{ fontSize: 13, color: T.textSecondary }}>3 engineers (Q1) &middot; 1 designer (Q2) &middot; 2 GTM (Q3)</span>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 14: Vision - Civic Layer */
function Slide14({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="VISION" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 42, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          from communities &#8594; to the civic layer of the internet
        </h2>
        <div style={{ display: "flex", gap: 20, width: "100%" }}>
          {[
            { phase: "SEED → SERIES A", title: "Community Graph", items: ["Professional infrastructure", "Universal member identity", "Cross-community discovery"], market: "$2.4B SAM", color: T.blue, num: "01" },
            { phase: "SERIES A → B", title: "Live Public Discourse", items: ["Real-time community conversations", "AI-moderated public forums", "Democratic content curation"], market: "$8B TAM", color: T.purple, num: "02" },
            { phase: "SERIES B → EXIT", title: "Community Marketplace", items: ["Services & talent marketplace", "Community-powered commerce", "Economic infrastructure"], market: "$12B TAM", color: T.orange, num: "03" },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 8, padding: "24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: `${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: p.color }}>{p.num}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: T.textPrimary }}>{p.title}</div>
              </div>
              {p.items.map((item, j) => (
                <div key={j} style={{ fontSize: 13, color: T.textSecondary, marginBottom: 6, paddingLeft: 12, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: T.textMuted }}>·</span>{item}
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: p.color }}>{p.phase}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{p.market}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, justifyContent: "center" }}>
          {["SEED", "SERIES A", "SERIES B", "EXIT"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "6px 16px", border: `1px solid ${i === 0 ? T.orange : T.border}`, borderRadius: 4, fontSize: 11, fontWeight: 600, color: i === 0 ? T.orange : T.textMuted }}>{label}</div>
              {i < 3 && <div style={{ width: 40, height: 1, background: T.border }} />}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 15: Data Moat */
function Slide15({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="DATA MOAT" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 42, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          community intelligence: the data layer no one else has
        </h2>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: T.amber }} />
          <span style={{ fontSize: 13, color: T.textSecondary }}>William Powers co-founded BlueFin Labs (sold to Twitter) — the data company that pioneered social TV analytics</span>
        </div>
        <div style={{ display: "flex", gap: 16, width: "100%" }}>
          {[
            { num: "01", title: "Operator Intelligence", items: ["Community health scoring", "Engagement pattern analysis", "Churn prediction models", "Growth recommendations"], phase: "Phase 1", color: T.purple },
            { num: "02", title: "Sponsor Intelligence", items: ["Community-brand fit scoring", "ROI prediction models", "Audience quality metrics", "Automated matching"], phase: "Phase 1-2", color: T.blue },
            { num: "03", title: "Live Discourse Intelligence", items: ["Conversation quality analysis", "Topic trend detection", "Sentiment tracking", "Cultural health metrics"], phase: "Phase 2-3", color: T.orange },
          ].map((card, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "24px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: card.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: `${card.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: card.color }}>{card.num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary }}>{card.title}</div>
              </div>
              {card.items.map((item, j) => (
                <div key={j} style={{ fontSize: 13, color: T.textSecondary, marginBottom: 6, paddingLeft: 12, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: T.textMuted }}>·</span>{item}
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 11, color: card.color }}>{card.phase}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: T.textSecondary, fontStyle: "italic" }}>
          Every community interaction feeds the intelligence flywheel — compounding data advantage over time
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 16 (NEW): Product Onboarding */
function Slide16({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="PRODUCT" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          conversational AI onboarding
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <BulletList items={[
              "60-second setup — talk, don't fill forms",
              "William understands your community type and deploys instantly",
              "AI agents configure channels, onboarding flows, and analytics automatically",
            ]} />
            <div style={{ marginTop: 24, background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 12, color: T.orange, marginBottom: 8 }}>KEY INSIGHT</div>
              <div style={{ fontSize: 14, color: T.textSecondary, fontStyle: "italic" }}>&ldquo;Zero configuration required. Describe your community and William handles the rest.&rdquo;</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { from: "user", text: "I run a design community in Barcelona, about 200 members. We meet monthly and use WhatsApp to coordinate." },
                { from: "ai", text: "Great! I'll set up your community hub with event management, member directory, and sponsor matching for design-focused brands." },
                { from: "ai", text: "Deploying AI agents to your WhatsApp group and Instagram now... Your Arcade will be live in 30 seconds." },
              ].map((msg, i) => (
                <div key={i} style={{ background: msg.from === "ai" ? `${T.orange}10` : "#222", border: `1px solid ${msg.from === "ai" ? `${T.orange}30` : T.border}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: msg.from === "ai" ? T.textPrimary : T.textSecondary, alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                  {msg.from === "ai" && <span style={{ fontSize: 11, color: T.orange, display: "block", marginBottom: 4 }}>William</span>}
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 17 (NEW): AI Agents */
function Slide17({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="PRODUCT" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          AI agents deploy across your channels
        </h2>
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          {[
            { platform: "WhatsApp", members: "156 members", status: "LIVE", color: "#25D366" },
            { platform: "Instagram", members: "2,400 followers", status: "LIVE", color: "#E1306C" },
            { platform: "Eventbrite", members: "890 attendees", status: "LIVE", color: "#F6682F" },
          ].map((p, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "32px 24px", flex: 1, position: "relative" }}>
              <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, color: T.green, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: T.green, boxShadow: `0 0 8px ${T.green}60` }} />
                {p.status}
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: p.color, marginBottom: 12 }}>{p.platform}</div>
              <div style={{ fontSize: 32, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", marginBottom: 8 }}>{p.members}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>Zero migration required</div>
              <div style={{ marginTop: 16, height: 4, borderRadius: 2, background: `${p.color}20`, overflow: "hidden" }}>
                <div style={{ width: "78%", height: "100%", background: p.color, borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>78% engagement rate</div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 18 (NEW): Cold Start Flywheel */
function Slide18({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="COLD START" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          AI agents solve the cold start problem
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%", maxWidth: 700, margin: "0 auto" }}>
          {[
            { phase: "Day 1", title: "Deploy", desc: "AI agents go live on WhatsApp, Instagram, Eventbrite — zero migration required", color: T.orange },
            { phase: "Week 1", title: "Collect 312 data points", desc: "Member interactions, event RSVPs, content engagement all captured automatically", color: T.blue },
            { phase: "Month 1", title: "Intelligence", desc: "William generates first actionable insights: churn risks, growth opportunities, sponsor matches", color: T.green },
            { phase: "Month 3+", title: "Full Flywheel", desc: "Compounding intelligence, automated operations, predictive community management", color: T.purple },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: step.color, boxShadow: `0 0 16px ${step.color}50` }} />
                {i < 3 && <div style={{ width: 2, height: 64, background: `${step.color}30` }} />}
              </div>
              <div style={{ paddingBottom: i < 3 ? 24 : 0 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: step.color, marginBottom: 4 }}>{step.phase}</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 19 (NEW): Five Pillars */
function Slide19({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="PROPRIETARY TECHNOLOGY" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          five intelligence pillars
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Row 1: 3 cards */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { num: "01", name: "Operator Intelligence", desc: "Real-time community health scoring, engagement analytics, churn prediction, and growth recommendations", color: T.orange },
              { num: "02", name: "Sponsor Intelligence", desc: "Community-brand fit scoring, ROI prediction, audience quality metrics, and automated matching engine", color: T.blue },
              { num: "03", name: "Discourse Intelligence", desc: "Conversation quality analysis, topic trend detection, sentiment tracking, and cultural health metrics", color: T.green },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 8, padding: "24px 20px" }}>
                <div style={{ fontSize: 32, fontWeight: 200, color: p.color, marginBottom: 8, fontFamily: "var(--font-serif)" }}>{p.num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          {/* Row 2: 2 cards */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { num: "04", name: "Bot Intelligence", desc: "Autonomous AI agents across WhatsApp, Instagram, and events — collecting data and executing tasks 24/7", color: T.purple },
              { num: "05", name: "William AI Coach", desc: "Proactive recommendations, automated execution, pattern recognition across all community interactions", color: T.amber },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${p.color}`, borderRadius: 8, padding: "24px 20px" }}>
                <div style={{ fontSize: 32, fontWeight: 200, color: p.color, marginBottom: 8, fontFamily: "var(--font-serif)" }}>{p.num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 20: Execution Milestones */
function Slide20({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="EXECUTION" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          24 months to Series A readiness
        </h2>
        <div style={{ display: "flex", gap: 20, width: "100%" }}>
          {[
            { phase: "Foundation", period: "Months 1-8", deliverables: ["Core platform launch", "AI agent deployment", "5 enterprise pilots", "50 communities"], metrics: "$200K ARR", team: "8 people", color: T.green },
            { phase: "Validation", period: "Months 9-16", deliverables: ["Marketplace launch", "Sponsor matching live", "10 enterprise clients", "100 communities"], metrics: "$1.2M ARR", team: "15 people", color: T.orange },
            { phase: "Scale", period: "Months 17-24", deliverables: ["International expansion", "API platform", "30+ enterprise", "500+ communities"], metrics: "$3M+ ARR", team: "25 people", color: T.red },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderTop: `3px solid ${p.color}`, borderRadius: 8, padding: "24px 20px" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: p.color, marginBottom: 4 }}>{p.phase}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>{p.period}</div>
              {p.deliverables.map((d, j) => (
                <div key={j} style={{ fontSize: 13, color: T.textSecondary, marginBottom: 6, paddingLeft: 12, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: T.textMuted }}>·</span>{d}
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "10px 0", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 18, fontWeight: 600, color: p.color }}>{p.metrics}</div></div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{p.team}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.orange}30`, borderRadius: 8, padding: "14px 24px", textAlign: "center" }}>
          <span style={{ fontSize: 14, color: T.textSecondary }}>Series A position: <span style={{ color: T.orange, fontWeight: 600 }}>$3M+ ARR, 300K users, 60+ enterprise customers, clear path to $10M</span></span>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 21: Use of Funds */
function Slide21({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="USE OF FUNDS" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          use of funds: $3M seed round
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: "0 0 40%" }}>
            <div style={{ fontSize: 14, color: T.textSecondary, marginBottom: 24 }}>24-month runway to Series A readiness with capital-efficient allocation</div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px" }}>
              <div style={{ fontSize: 28, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", marginBottom: 4 }}>24 months</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>Runway at current burn assumptions</div>
            </div>
          </div>
          <div style={{ flex: "0 0 60%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Engineering", pct: 55, color: T.blue, detail: "$1.65M — Core platform, AI/ML, infrastructure" },
                { label: "Operations", pct: 12, color: T.green, detail: "$360K — Community success, support" },
                { label: "Infrastructure", pct: 12, color: T.purple, detail: "$360K — Cloud, AI compute, security" },
                { label: "Founders", pct: 10, color: T.orange, detail: "$300K — Below-market salaries" },
                { label: "Buffer", pct: 11, color: T.textMuted, detail: "$330K — Strategic reserve" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 3, height: 16, background: item.color, borderRadius: 2 }} />
                      <span style={{ fontSize: 14, color: T.textPrimary }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.pct}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginLeft: 11, marginBottom: 4 }}>{item.detail}</div>
                  <div style={{ height: 6, background: "#111", borderRadius: 3, overflow: "hidden", marginLeft: 11 }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 22: Path to Exit */
function Slide22({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="PATH TO EXIT" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          path to exit
        </h2>
        <div style={{ display: "flex", gap: 0, alignItems: "flex-start", width: "100%" }}>
          {[
            { stage: "Seed", val: "$30M", sub: "Post-money valuation", color: T.blue },
            { stage: "Series A", val: "$80-100M", sub: "At $3M+ ARR", color: T.purple },
            { stage: "Series B", val: "$500M-1B", sub: "At $15M+ ARR", color: "#6B7280" },
            { stage: "EXIT", val: "$5B+", sub: "Category leadership", color: T.orange },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderTop: `3px solid ${s.color}`, borderRadius: 8, padding: "24px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: s.color, marginBottom: 8 }}>{s.stage}</div>
                <div style={{ fontSize: 28, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{s.sub}</div>
              </div>
              {i < 3 && <div style={{ width: 40, height: 2, background: T.border, margin: "0 auto" }} />}
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: T.amber }} />
          <span style={{ fontSize: 13, color: T.textSecondary }}>Valuation insight: Community platforms with AI intelligence trade at 25-40x ARR (vs 10-15x for traditional SaaS)</span>
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: T.textMuted }}>
          We are building the infrastructure layer for human connection — a market that only grows as digital life expands
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 23: The Ask */
function Slide23({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="THE ASK" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          the ask
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `8px solid ${T.blue}`, borderRadius: 12, padding: 32 }}>
              <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16 }}>RAISING</div>
              <div style={{ fontSize: 64, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)", lineHeight: 1, marginBottom: 8 }}>$3,000,000</div>
              <div style={{ fontSize: 16, color: T.textSecondary, marginBottom: 24 }}>for 10% equity</div>
              <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 8 }}>Post-money valuation</div>
              <div style={{ fontSize: 28, fontWeight: 300, color: T.blue, fontFamily: "var(--font-serif)" }}>$30M</div>
              <div style={{ marginTop: 24, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>FUND BREAKDOWN</div>
                {[{ label: "Engineering & AI", pct: "55%" }, { label: "Operations", pct: "12%" }, { label: "Infrastructure", pct: "12%" }, { label: "Founders", pct: "10%" }, { label: "Buffer", pct: "11%" }].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: T.textSecondary }}>
                    <span>{f.label}</span><span>{f.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16 }}>24-MONTH OUTCOMES</div>
              {[
                { metric: "$3M ARR", desc: "Annual recurring revenue" },
                { metric: "300K+", desc: "Community members on platform" },
                { metric: "60+", desc: "Enterprise customers" },
              ].map((o, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 22, fontWeight: 600, color: T.orange, fontFamily: "var(--font-serif)" }}>{o.metric}</span>
                  <span style={{ fontSize: 14, color: T.textSecondary }}>{o.desc}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 16, color: T.textSecondary, fontStyle: "italic", lineHeight: 1.6, padding: "0 4px" }}>
              &ldquo;We&apos;re not building another social platform. We&apos;re building the civic infrastructure layer for human connection.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 24: FAQ */
function Slide24({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="FAQ" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 48, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          commonly asked questions
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { q: "Why not just use Discord or Slack?", a: "Those are chat tools, not community operating systems. They have no AI intelligence, no sponsorship marketplace, and no tools for real-world event management." },
            { q: "How do you solve the chicken-and-egg problem?", a: "We start with communities already meeting in the real world. They have members — they just need better tools. Our AI agents deploy on their existing channels." },
            { q: "What's your defensibility?", a: "Compounding community intelligence data. Every interaction trains our models. Plus network effects from the sponsorship marketplace and cross-community discovery." },
            { q: "Why is now the right time?", a: "Three converging trends: enterprise community budgets at all-time high, AI capabilities enabling autonomous agents, and post-pandemic demand for real human connection." },
            { q: "How do you acquire communities?", a: "Enterprise sales (top-down) plus community operator word-of-mouth (bottom-up). Early partners like Adobe create credibility for the entire platform." },
            { q: "What's the exit strategy?", a: "Multiple paths: strategic acquisition (Salesforce, Microsoft, Meta), continued growth to IPO, or category-defining platform. Community infrastructure is a $12B+ market." },
          ].map((item, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 25: Appendix - Market Detail */
function Slide25({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="APPENDIX A" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          market sizing detail
        </h2>
        <div style={{ display: "flex", gap: 48, width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>TAM / SAM / SOM</div>
            {[
              { label: "TAM", val: "$12B", desc: "Total community platform market", color: T.blue },
              { label: "SAM", val: "$2.4B", desc: "Professional & enterprise communities", color: T.orange },
              { label: "SOM", val: "$240M", desc: "English-speaking real-world communities", color: T.green },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: `${m.color}15`, border: `1px solid ${m.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: m.color }}>{m.label}</div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 300, color: T.textPrimary, fontFamily: "var(--font-serif)" }}>{m.val}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Adjacent Markets</div>
            {[
              { market: "Events Industry", val: "$1.1T", growth: "12% CAGR" },
              { market: "Coworking", val: "$30B", growth: "15% CAGR" },
              { market: "Creator Economy", val: "$104B", growth: "22% CAGR" },
              { market: "Enterprise SaaS", val: "$195B", growth: "18% CAGR" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 14, color: T.textSecondary }}>{m.market}</span>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary }}>{m.val}</span>
                  <span style={{ fontSize: 12, color: T.green, marginLeft: 8 }}>{m.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* SLIDE 26: Appendix - Unit Economics */
function Slide26({ n, total }: { n: number; total: number }) {
  return (
    <SlideLayout eyebrow="APPENDIX B" slideNum={n} total={total}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.textPrimary, margin: 0, textTransform: "lowercase" as const }}>
          unit economics
        </h2>
        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          <div style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 24px" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.blue, marginBottom: 16 }}>COMMUNITY TIER</div>
            {[
              { label: "Avg Revenue / Community", val: "$200/mo" },
              { label: "CAC", val: "$400" },
              { label: "LTV (36mo, 5% churn)", val: "$6,120" },
              { label: "LTV:CAC Ratio", val: "15:1" },
              { label: "Payback Period", val: "2 months" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 13, color: T.textSecondary }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{m.val}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 24px" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.orange, marginBottom: 16 }}>ENTERPRISE TIER</div>
            {[
              { label: "Avg Revenue / Client", val: "$15K/mo" },
              { label: "CAC", val: "$25K" },
              { label: "LTV (36mo, 3% churn)", val: "$480K" },
              { label: "LTV:CAC Ratio", val: "19:1" },
              { label: "Payback Period", val: "1.7 months" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 13, color: T.textSecondary }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{m.val}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 24px" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: T.green, marginBottom: 16 }}>MARKETPLACE</div>
            {[
              { label: "Take Rate", val: "15-20%" },
              { label: "Avg Transaction", val: "$5,000" },
              { label: "Revenue / Transaction", val: "$750-1K" },
              { label: "Transactions / Mo (Y2)", val: "80+" },
              { label: "Monthly Marketplace Rev", val: "$60-80K" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 13, color: T.textSecondary }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
export default function PitchPage() {
  const TOTAL = 26;
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const touchStartRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, TOTAL - 1));
    if (clamped !== current) {
      setCurrent(clamped);
      setAnimKey((k) => k + 1);
    }
  }, [current]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  useEffect(() => { containerRef.current?.focus(); }, []);

  const cssKeyframes = `
    @keyframes pitchFadeSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pitchFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pitchBob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
  `;

  function renderSlide() {
    const n = current + 1;
    switch (current) {
      case 0: return <Slide01Title />;
      case 1: return <Slide02 n={n} total={TOTAL} />;
      case 2: return <Slide03 n={n} total={TOTAL} />;
      case 3: return <Slide04 n={n} total={TOTAL} />;
      case 4: return <Slide05 n={n} total={TOTAL} />;
      case 5: return <Slide06 n={n} total={TOTAL} />;
      case 6: return <Slide07 n={n} total={TOTAL} />;
      case 7: return <Slide08 n={n} total={TOTAL} />;
      case 8: return <Slide09 n={n} total={TOTAL} />;
      case 9: return <Slide10 n={n} total={TOTAL} />;
      case 10: return <Slide11 n={n} total={TOTAL} />;
      case 11: return <Slide12 n={n} total={TOTAL} />;
      case 12: return <Slide13 n={n} total={TOTAL} />;
      case 13: return <Slide14 n={n} total={TOTAL} />;
      case 14: return <Slide15 n={n} total={TOTAL} />;
      case 15: return <Slide16 n={n} total={TOTAL} />;
      case 16: return <Slide17 n={n} total={TOTAL} />;
      case 17: return <Slide18 n={n} total={TOTAL} />;
      case 18: return <Slide19 n={n} total={TOTAL} />;
      case 19: return <Slide20 n={n} total={TOTAL} />;
      case 20: return <Slide21 n={n} total={TOTAL} />;
      case 21: return <Slide22 n={n} total={TOTAL} />;
      case 22: return <Slide23 n={n} total={TOTAL} />;
      case 23: return <Slide24 n={n} total={TOTAL} />;
      case 24: return <Slide25 n={n} total={TOTAL} />;
      case 25: return <Slide26 n={n} total={TOTAL} />;
      default: return null;
    }
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onTouchStart={(e) => { touchStartRef.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartRef.current === null) return;
        const diff = e.changedTouches[0].clientX - touchStartRef.current;
        if (diff < -50) next();
        if (diff > 50) prev();
        touchStartRef.current = null;
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: T.bg,
        color: T.textPrimary,
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
        overflow: "hidden",
        outline: "none",
        userSelect: "none",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cssKeyframes }} />

      {/* Vertical dot navigation (right side) */}
      <div style={{
        position: "absolute",
        top: 48,
        right: 32,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 20,
      }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 4 : 4,
              height: i === current ? 32 : 4,
              borderRadius: 9999,
              border: "none",
              background: i === current ? "white" : "rgba(255,255,255,0.2)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (i !== current) {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.4)";
                (e.target as HTMLButtonElement).style.height = "8px";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== current) {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)";
                (e.target as HTMLButtonElement).style.height = "4px";
              }
            }}
          />
        ))}
      </div>

      {/* SLIDE CONTENT with animation */}
      <div
        key={`slide-${animKey}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          animation: "pitchFadeSlideIn 0.5s ease both",
        }}
      >
        {renderSlide()}
      </div>

      {/* Click zones for navigation */}
      <div
        onClick={prev}
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "20%", cursor: current > 0 ? "w-resize" : "default", zIndex: 15 }}
      />
      <div
        onClick={next}
        style={{ position: "absolute", top: 0, right: 60, bottom: 0, width: "20%", cursor: current < TOTAL - 1 ? "e-resize" : "default", zIndex: 15 }}
      />
    </div>
  );
}

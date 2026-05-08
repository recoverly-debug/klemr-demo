import React, { useState, useEffect, useRef } from "react";
import { X, RefreshCw, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0E0D0B",
  bgElevated: "#16140F",
  bgCard: "#1A1814",
  bgCardHover: "#221E18",
  border: "#2A2620",
  borderBright: "#3A342B",
  text: "#F5F0E6",
  textSec: "#A8A095",
  textMuted: "#5C564E",
  amber: "#F7B955",
  amberBright: "#FFD580",
  amberDim: "#8B6A30",
  amberInk: "#E89A2D",
  mint: "#5EEAD4",
  mintInk: "#3FBFA8",
  mintDim: "#2C5F58",
  red: "#F87171",
  blue: "#7DD3FC",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@400;500;600;700&display=swap');

  .k-display { font-family: 'Instrument Serif', 'Times New Roman', serif; font-weight: 400; letter-spacing: -0.02em; }
  .k-body    { font-family: 'DM Sans', system-ui, sans-serif; }
  .k-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .k-hand    { font-family: 'Caveat', cursive; font-weight: 500; }

  @keyframes k-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.85); } }
  @keyframes k-pulse-ring { 0% { transform: scale(0.8); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  @keyframes k-slide-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes k-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes k-flash { 0% { color: #FFE9B8; text-shadow: 0 0 24px rgba(255,213,128,0.6); } 100% { color: #F7B955; text-shadow: 0 0 0 rgba(0,0,0,0); } }
  @keyframes k-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  @keyframes k-hand-in {
    0%   { opacity: 0; transform: translateY(4px) rotate(var(--r, -2deg)) scale(0.92); }
    60%  { opacity: 1; transform: translateY(0) rotate(calc(var(--r, -2deg) - 1deg)) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) rotate(var(--r, -2deg)) scale(1); }
  }

  @keyframes k-stamp {
    0%   { opacity: 0; transform: scale(2.4) rotate(-18deg); filter: blur(2px); }
    55%  { opacity: 1; transform: scale(0.92) rotate(-7deg); filter: blur(0); }
    100% { opacity: 0.96; transform: scale(1) rotate(-9deg); filter: blur(0); }
  }

  @keyframes k-check-in {
    from { opacity: 0; transform: translateX(-4px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .k-pulse { animation: k-pulse 1.8s ease-in-out infinite; }
  .k-slide-in { animation: k-slide-in 0.45s cubic-bezier(.2,.8,.2,1); }
  .k-fade-in { animation: k-fade-in 0.6s ease-out; }
  .k-flash { animation: k-flash 1.6s ease-out; }
  .k-stamp { animation: k-stamp 0.7s cubic-bezier(.2,.9,.3,1.1) both; }
  .k-hand-anim { animation: k-hand-in 0.7s cubic-bezier(.3,.7,.3,1.2) both; }
  .k-check-in { animation: k-check-in 0.4s ease-out both; }

  .k-shimmer {
    background: linear-gradient(90deg, transparent 20%, rgba(247,185,85,0.08) 50%, transparent 80%);
    background-size: 200% 100%;
    animation: k-shimmer 3s linear infinite;
  }

  .k-pulse-ring::after {
    content: ''; position: absolute; inset: 0; border-radius: 9999px;
    border: 1px solid #5EEAD4; animation: k-pulse-ring 1.6s ease-out infinite;
  }

  .k-stream::-webkit-scrollbar { width: 3px; }
  .k-stream::-webkit-scrollbar-track { background: transparent; }
  .k-stream::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }

  html, body, #root { background: ${C.bg}; }
  ::selection { background: ${C.amber}; color: ${C.bg}; }

  @media (max-width: 1024px) {
    .k-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
    .k-dossiers-grid { grid-template-columns: 1fr 1fr !important; }
    .k-services-grid { grid-template-columns: 1fr 1fr !important; }
    .k-hero-h1 { font-size: 44px !important; }
  }
  @media (max-width: 720px) {
    .k-shell { padding: 16px 16px 60px !important; }
    .k-header-right { gap: 8px !important; }
    .k-header-merchant { display: none !important; }
    .k-hero-h1 { font-size: 32px !important; }
    .k-hero-counter { font-size: 44px !important; }
    .k-hand-cluster { display: none !important; }
    .k-inspector { width: 100% !important; }
    .k-dossiers-grid { grid-template-columns: 1fr !important; }
    .k-services-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Klemr Seal — the primary brand mark + reclaimed stamp
// ─────────────────────────────────────────────────────────────────────────────
function KlemrSeal({ size = 36, color = C.amber, ink = false }) {
  const stroke = ink ? 1.6 : 1.4;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {ink && (
          <filter id={`k-ink-${size}`}>
            <feGaussianBlur stdDeviation="0.18" />
          </filter>
        )}
      </defs>
      <g filter={ink ? `url(#k-ink-${size})` : undefined} opacity={ink ? 0.94 : 1}>
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth={stroke * 0.7} opacity="0.55" />
        <circle cx="20" cy="20" r="14.5" fill="none" stroke={color} strokeWidth={stroke} />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = 20 + Math.cos(angle) * 16.2;
          const y1 = 20 + Math.sin(angle) * 16.2;
          const x2 = 20 + Math.cos(angle) * 17.4;
          const y2 = 20 + Math.sin(angle) * 17.4;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={stroke * 0.85} strokeLinecap="round" />;
        })}
        <line x1="14.5" y1="11.5" x2="14.5" y2="28.5" stroke={color} strokeWidth={stroke * 1.6} strokeLinecap="round" />
        <line x1="14.5" y1="20" x2="22" y2="12" stroke={color} strokeWidth={stroke * 1.6} strokeLinecap="round" />
        <line x1="17.5" y1="17" x2="25.5" y2="28" stroke={color} strokeWidth={stroke * 1.6} strokeLinecap="round" />
        <line x1="25.5" y1="28" x2="22.5" y2="28" stroke={color} strokeWidth={stroke * 1.6} strokeLinecap="round" />
        <circle cx="20" cy="6.5" r="0.9" fill={color} />
      </g>
    </svg>
  );
}

function Wordmark({ size = 26 }) {
  return (
    <span className="k-display" style={{ fontSize: size, color: C.text, lineHeight: 1, letterSpacing: "-0.015em" }}>
      klemr<span style={{ color: C.amber }}>.</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom icons
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  Eye: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7z" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="0.9" fill={color} stroke="none" />
    </svg>
  ),
  Dossier: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M3 6h7l2 2.5h9v11.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
      <path d="M16 8.5l3.5-2.5v2.5" />
      <line x1="7" y1="14" x2="13" y2="14" opacity="0.5" />
      <line x1="7" y1="17" x2="11" y2="17" opacity="0.5" />
    </svg>
  ),
  Camera: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M3 8h3l1.5-2h9L18 8h3v11H3V8z" />
      <circle cx="12" cy="13.5" r="3.5" />
      <circle cx="12" cy="13.5" r="1" fill={color} stroke="none" />
    </svg>
  ),
  Receipt: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M5 3h14v15.5l-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1L5 19.5z" />
      <line x1="8" y1="8" x2="16" y2="8" opacity="0.6" />
      <line x1="8" y1="11" x2="14" y2="11" opacity="0.6" />
      <line x1="8" y1="14" x2="13" y2="14" opacity="0.6" />
    </svg>
  ),
  Reclaim: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M20 7c-2 5-6 8-12 8" />
      <path d="M11 11l-3 4 4 2.5" />
    </svg>
  ),
  Pulse: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  ),
  Plug: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M9 2v6M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8z" />
      <path d="M12 17v5" />
    </svg>
  ),
  Check: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
      <path d="M4 12.5l5 5 11-12" />
    </svg>
  ),
  Pattern: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block" }}>
      <circle cx="5" cy="17" r="2" fill={color} opacity="0.5" />
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.75" />
      <circle cx="19" cy="7" r="2" fill={color} />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// HandNote — animated handwritten annotation (memoized; mounts once)
// ─────────────────────────────────────────────────────────────────────────────
const HandNote = React.memo(function HandNote({ children, color = C.amberInk, rotate = -2, size = 18, delay = 0, style }) {
  // Build the style object only once per component lifetime.
  // Re-running this on every parent render is what was causing the text flicker.
  const computedStyle = React.useMemo(() => ({
    "--r": `${rotate}deg`,
    fontFamily: "'Caveat', cursive",
    color,
    fontSize: size,
    lineHeight: 1.15,
    animationDelay: `${delay}s`,
    display: "inline-block",
    whiteSpace: "nowrap",
    ...(style || {}),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  return (
    <span className="k-hand k-hand-anim" style={computedStyle}>
      {children}
    </span>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────
const MERCHANT = { name: "Verdant Botanicals", tier: "Skincare · DTC · $24M ARR" };

const ACTIVITY_TEMPLATES = [
  { tone: "watch",  text: "watching #VB-44102 leave the warehouse" },
  { tone: "watch",  text: "got the dimensions before they shipped — 12×10×8, 2.3lb" },
  { tone: "watch",  text: "snapped the package photo for the dossier" },
  { tone: "watch",  text: "sealed the dossier on #VB-44102. clean ship." },
  { tone: "issue",  text: "ups invoiced #VB-43998. they're saying 4lb. dossier has 2.3lb." },
  { tone: "filed",  text: "filing on #VB-43998. dossier has the receipts." },
  { tone: "won",    text: "won. $12.47 coming back on #VB-43998.", amount: 12.47 },
  { tone: "issue",  text: "fedex says #VB-44087 was on time. tracking says 1h 44m late." },
  { tone: "filed",  text: "filed the fedex one. $487 if they pay up." },
  { tone: "won",    text: "$487 in. that's 8 fedex late ones this month.", amount: 487.32 },
  { tone: "notice", text: "noticed all our tuesday ups shipments getting overbilled" },
  { tone: "notice", text: "flagging the pattern. filing as a batch." },
  { tone: "watch",  text: "3 new dossiers opened. 2 ups, 1 fedex." },
  { tone: "watch",  text: "sealed 12 dossiers today. all clean." },
  { tone: "issue",  text: "weird zone mismatch on #VB-44210. ups billed zone 7, was zone 5." },
  { tone: "filed",  text: "filed the zone one. small but it's something." },
  { tone: "won",    text: "$4.18 in on the zone mismatch.", amount: 4.18 },
  { tone: "won",    text: "$1,232 in. ups dim weight batch. nice run.", amount: 1232.45 },
  { tone: "notice", text: "residential surcharges going up on commercial addresses again" },
  { tone: "filed",  text: "flagged 11 of those today. filing batch tomorrow." },
];

const TONE = {
  watch:  { color: C.mint,  label: "watching" },
  issue:  { color: C.red,   label: "caught it" },
  filed:  { color: C.blue,  label: "filed" },
  won:    { color: C.amber, label: "reclaimed" },
  notice: { color: "#C4B5FD", label: "noticed" },
};

const DOSSIERS = [
  {
    id: "VB-44102", carrier: "UPS", state: "in_transit",
    evidence: [
      { label: "manifest captured", time: "9:14a", done: true },
      { label: "dimensions logged · 12×10×8", time: "9:14a", done: true },
      { label: "weight confirmed · 2.3 lb", time: "9:15a", done: true },
      { label: "warehouse photo", time: "9:16a", done: true },
      { label: "departure scan", time: "11:47a", done: true },
      { label: "zone confirmed · 5", time: "11:47a", done: true },
      { label: "waiting for ups invoice", time: "—", done: false, pending: true },
    ],
    note: "ups always tries to overcharge dim on this size",
    noteRotate: -3, amount: null,
  },
  {
    id: "VB-43998", carrier: "UPS", state: "filing",
    evidence: [
      { label: "dossier locked", time: "yesterday", done: true },
      { label: "ups invoiced 4.0 lb dim", time: "2h ago", done: true, flag: true },
      { label: "dossier says 2.3 lb", time: "—", done: true, ours: true },
      { label: "dispute filed · UPS Capital", time: "12m ago", done: true },
      { label: "awaiting credit", time: "—", done: false, pending: true },
    ],
    note: "caught it — exactly why we keep dossiers",
    noteRotate: 2, amount: 12.47,
  },
  {
    id: "VB-44087", carrier: "FedEx", state: "filing",
    evidence: [
      { label: "manifest captured", time: "Mon 2:22p", done: true },
      { label: "guaranteed by 4:30p Wed", time: "—", done: true },
      { label: "delivered 6:14p Wed", time: "Wed", done: true, flag: true },
      { label: "1h 44m late · MBG triggered", time: "—", done: true, ours: true },
      { label: "auto-filed via FedEx portal", time: "1h ago", done: true },
    ],
    note: "took a week last time. always does.",
    noteRotate: -1, amount: 487.32,
  },
  {
    id: "VB-43820", carrier: "FedEx", state: "reclaimed",
    evidence: [
      { label: "dossier locked", time: "8d ago", done: true },
      { label: "filed for late delivery", time: "7d ago", done: true },
      { label: "fedex confirmed credit", time: "today", done: true },
      { label: "$487.32 returned", time: "today", done: true, ours: true },
    ],
    note: "easy one",
    noteRotate: -4, amount: 487.32,
  },
  {
    id: "VB-44210", carrier: "UPS", state: "watching",
    evidence: [
      { label: "manifest captured", time: "now", done: true },
      { label: "dimensions logged · 8×6×4", time: "now", done: true },
      { label: "weight · 0.9 lb", time: "now", done: true },
      { label: "warehouse photo", time: "—", done: false, pending: true },
      { label: "awaiting departure scan", time: "—", done: false, pending: true },
    ],
    note: "small one. probably clean.",
    noteRotate: 1, amount: null,
  },
  {
    id: "VB-43914", carrier: "UPS", state: "reclaimed",
    evidence: [
      { label: "dossier locked", time: "5d ago", done: true },
      { label: "ups billed zone 7", time: "3d ago", done: true, flag: true },
      { label: "dossier says zone 5", time: "—", done: true, ours: true },
      { label: "credit confirmed", time: "today", done: true },
    ],
    note: "small but it counts",
    noteRotate: 2, amount: 4.18,
  },
];

const SCAN_TARGETS = [
  "watching #VB-44210 ship out",
  "logging dimensions on #VB-44211",
  "snapping photo · #VB-44209",
  "departure scan · #VB-44208",
  "manifest reconciliation",
  "watching 3 packages go through ups dock",
];

// Helpers
const fmt$ = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n) => Math.floor(n).toLocaleString("en-US");

const STATE_META = {
  watching:   { color: C.mint,  label: "watching", desc: "gathering evidence" },
  in_transit: { color: C.mint,  label: "in transit", desc: "dossier sealed, en route" },
  invoiced:   { color: C.red,   label: "discrepancy", desc: "carrier billed wrong" },
  filing:     { color: C.blue,  label: "filing", desc: "dispute in progress" },
  reclaimed:  { color: C.amber, label: "reclaimed", desc: "money returned" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Watermark — security paper feel
// ─────────────────────────────────────────────────────────────────────────────
const Watermark = React.memo(function Watermark() {
  const text = " EVIDENCE · KLEMR · DOSSIER · KLEMR · WITNESS · KLEMR · RECEIPT · KLEMR ";
  const rows = Array.from({ length: 80 });
  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: "0.28em",
        color: C.text, opacity: 0.022, userSelect: "none",
      }}
    >
      {rows.map((_, i) => (
        <div key={i} style={{ whiteSpace: "nowrap", lineHeight: "32px", transform: i % 2 ? "translateX(-30px)" : "none" }}>
          {text.repeat(20)}
        </div>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export default function KlemrDemo() {
  const [recovered, setRecovered] = useState(42847.0);
  const [flash, setFlash] = useState(false);
  const [logEntries, setLogEntries] = useState(() => {
    const seed = [];
    for (let i = 0; i < 6; i++) {
      const tpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      seed.push({ ...tpl, id: Math.random(), age: i * 30 });
    }
    return seed;
  });
  const [scanIdx, setScanIdx] = useState(0);
  const [scanProgress, setScanProgress] = useState(34);
  const [activeDossierCount, setActiveDossierCount] = useState(1247);
  const [selected, setSelected] = useState(null);
  const [pulse, setPulse] = useState(0);
  const flashTimer = useRef(null);

  useEffect(() => {
    let timer;
    const tick = () => {
      const tpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const entry = { ...tpl, id: Math.random(), age: 0 };
      setLogEntries((prev) => [entry, ...prev].slice(0, 16));
      if (entry.tone === "won" && entry.amount) {
        setRecovered((r) => r + entry.amount);
        setFlash(true);
        clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlash(false), 1500);
      }
      if (entry.tone === "watch" && /opened/.test(entry.text)) {
        setActiveDossierCount((n) => n + 3);
      }
      timer = setTimeout(tick, 1800 + Math.random() * 2600);
    };
    timer = setTimeout(tick, 2200);
    return () => { clearTimeout(timer); clearTimeout(flashTimer.current); };
  }, [pulse]);

  useEffect(() => {
    const t = setInterval(() => {
      setScanProgress((p) => {
        const np = p + 1.0 + Math.random() * 1.8;
        if (np >= 100) {
          setScanIdx((i) => (i + 1) % SCAN_TARGETS.length);
          return 4;
        }
        return np;
      });
    }, 240);
    return () => clearInterval(t);
  }, []);

  const spotCheck = React.useCallback(() => {
    setPulse((n) => n + 1);
    setScanProgress(2);
    [0, 600, 1300, 1900].forEach((delay, idx) => {
      setTimeout(() => {
        const pool = idx === 3
          ? ACTIVITY_TEMPLATES.filter((t) => t.tone === "won")
          : ACTIVITY_TEMPLATES.filter((t) => t.tone !== "won");
        const tpl = pool[Math.floor(Math.random() * pool.length)];
        const entry = { ...tpl, id: Math.random(), age: 0 };
        setLogEntries((prev) => [entry, ...prev].slice(0, 16));
        if (entry.tone === "won" && entry.amount) {
          setRecovered((r) => r + entry.amount);
          setFlash(true);
          setTimeout(() => setFlash(false), 1500);
        }
      }, delay);
    });
  }, []);

  // Inject the stylesheet exactly once into document.head, outside React's render tree.
  // This prevents any chance of font @import or keyframe re-evaluation on parent re-renders.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("klemr-demo-styles")) return;
    const tag = document.createElement("style");
    tag.id = "klemr-demo-styles";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }, []);

  // Handler for closing inspector — stable reference for memoization
  const closeInspector = React.useCallback(() => setSelected(null), []);

  return (
    <>
      <Watermark />
      <div className="k-body" style={{ background: C.bg, color: C.text, minHeight: "100vh", position: "relative" }}>
        <div className="k-shell" style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 28px 80px", position: "relative", zIndex: 2 }}>
          <Header onSpotCheck={spotCheck} />
          <Hero
            recovered={recovered}
            flash={flash}
            logEntries={logEntries}
            scanIdx={scanIdx}
            scanProgress={scanProgress}
            activeDossierCount={activeDossierCount}
          />
          <DashboardGrid onSelect={setSelected} />
          <Footer />
        </div>
        {selected && <Inspector dossier={selected} onClose={closeInspector} />}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────
const Header = React.memo(function Header({ onSpotCheck }) {
  return (
    <div className="flex items-center justify-between" style={{ paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center" style={{ gap: 14 }}>
        <KlemrSeal size={38} color={C.amber} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
          <Wordmark size={28} />
          <span className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>
            shipping witness · evidence-first
          </span>
        </div>
      </div>

      <div className="flex items-center k-header-right" style={{ gap: 16 }}>
        <div className="flex items-center" style={{ gap: 8, padding: "8px 14px", border: `1px solid ${C.border}`, borderRadius: 999, background: C.bgElevated }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: C.mint, position: "relative" }}>
            <div className="k-pulse-ring" style={{ position: "absolute", inset: 0, borderRadius: 999 }} />
          </div>
          <span className="k-mono" style={{ fontSize: 11, color: C.textSec, letterSpacing: "0.1em" }}>AGENT · ON THE CLOCK</span>
        </div>
        <div className="k-header-merchant" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.2 }}>
          <span className="k-body" style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{MERCHANT.name}</span>
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>{MERCHANT.tier}</span>
        </div>
        <button
          onClick={onSpotCheck}
          className="k-mono"
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
            background: C.amber, color: C.bg, border: "none", borderRadius: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer",
            textTransform: "uppercase", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.amberBright; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.amber; }}
        >
          <RefreshCw size={13} strokeWidth={2.5} />
          spot-check now
        </button>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Hero — split into static + dynamic so static text never re-renders
// ─────────────────────────────────────────────────────────────────────────────

// Pure static prose. Memoized so it mounts once and stays put.
const HeroStaticText = React.memo(function HeroStaticText() {
  return (
    <>
      <h1 className="k-display k-hero-h1" style={{
        fontSize: 64, lineHeight: 1.02, color: C.text, margin: 0, marginBottom: 20,
      }}>
        every shipment gets a <em style={{ color: C.amber, fontStyle: "italic" }}>dossier</em>.
      </h1>
      <p className="k-body" style={{ fontSize: 16, color: C.textSec, lineHeight: 1.55, maxWidth: 480, marginBottom: 36 }}>
        klemr's agent watches each order leave the warehouse, locks the evidence, and waits. when carriers overbill — and they do — the receipts are already in hand.
      </p>
    </>
  );
});

// The dossier-count line. Memoized on its single prop.
const HeroEyebrow = React.memo(function HeroEyebrow({ activeDossierCount }) {
  return (
    <div className="k-mono" style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 24 }}>
      live · {MERCHANT.name} · {fmtInt(activeDossierCount)} dossiers open
    </div>
  );
});

// The counter card. Only re-renders when recovered or flash actually changes.
const HeroCounter = React.memo(function HeroCounter({ recovered, flash }) {
  return (
    <div
      style={{
        display: "inline-flex", flexDirection: "column",
        padding: "20px 28px",
        border: `1px solid ${C.borderBright}`,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${C.bgElevated} 0%, ${C.bgCard} 100%)`,
        boxShadow: "0 0 0 1px rgba(247,185,85,0.18), 0 0 24px rgba(247,185,85,0.10)",
        position: "relative",
      }}>
      <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
        reclaimed this month
      </span>
      <div className="k-display" style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 22, color: C.amber, fontWeight: 400 }}>$</span>
        <span
          className={(flash ? "k-flash " : "") + "k-hero-counter"}
          style={{ fontSize: 64, color: C.amber, fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1 }}
        >
          {fmt$(recovered)}
        </span>
      </div>
      <span className="k-mono" style={{ fontSize: 11, color: C.textMuted, marginTop: 8 }}>
        across {Math.floor(recovered / 124.33)} sealed dossiers
      </span>
    </div>
  );
});

// Static handwritten cluster — never re-renders.
const HeroHandCluster = React.memo(function HeroHandCluster() {
  return (
    <div className="k-hand-cluster" style={{ position: "absolute", left: "calc(100% + 8px)", top: 38, display: "flex", flexDirection: "column", gap: 6 }}>
      <HandNote color={C.amberInk} rotate={-4} size={22} delay={0.6}>
        ← +$1,232 today
      </HandNote>
      <HandNote color={C.amberInk} rotate={-2} size={16} delay={1.0} style={{ opacity: 0.85, marginLeft: 14 }}>
        nice run on ups dim weight
      </HandNote>
    </div>
  );
});

// Agent feed — its own component so its updates don't bubble to the static side.
const AgentFeed = React.memo(function AgentFeed({ logEntries, scanIdx, scanProgress }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      overflow: "hidden",
      height: "100%",
      minHeight: 400,
      display: "flex",
      flexDirection: "column",
    }}>
      <div className="flex items-center justify-between" style={{
        padding: "14px 18px",
        borderBottom: `1px solid ${C.border}`,
        background: C.bgElevated,
      }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <Icon.Pulse size={14} color={C.mint} />
          <span className="k-mono" style={{ fontSize: 11, color: C.text, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            agent feed
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: C.mint }} className="k-pulse" />
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em" }}>LIVE</span>
        </div>
      </div>

      <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span className="k-mono flex items-center" style={{ fontSize: 10, color: C.textSec, letterSpacing: "0.05em", gap: 6 }}>
            <Icon.Eye size={11} color={C.mint} />
            {SCAN_TARGETS[scanIdx]}
          </span>
          <span className="k-mono" style={{ fontSize: 10, color: C.amber }}>{Math.floor(scanProgress)}%</span>
        </div>
        <div style={{ height: 2, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${scanProgress}%`, height: "100%",
            background: `linear-gradient(90deg, ${C.amberDim}, ${C.amber}, ${C.amberBright})`,
            transition: "width 0.24s linear",
            boxShadow: `0 0 8px ${C.amber}`,
          }} />
        </div>
      </div>

      <div className="k-stream" style={{
        flex: 1, padding: "14px 18px",
        overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 12,
        fontSize: 12,
      }}>
        {logEntries.map((e, idx) => (
          <FeedRow key={e.id} entry={e} isFirst={idx === 0} idx={idx} />
        ))}
      </div>
    </div>
  );
});

// A single feed row — memoized so existing rows never re-render when a new one is prepended.
const FeedRow = React.memo(function FeedRow({ entry, isFirst, idx }) {
  const t = TONE[entry.tone];
  return (
    <div className="k-slide-in flex" style={{ gap: 10, alignItems: "flex-start" }}>
      <div style={{ minWidth: 8, paddingTop: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: 999, background: t.color, boxShadow: isFirst ? `0 0 8px ${t.color}` : "none" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex items-center" style={{ gap: 8, marginBottom: 2 }}>
          <span className="k-mono" style={{ color: t.color, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            {t.label}
          </span>
          <span className="k-mono" style={{ color: C.textMuted, fontSize: 9 }}>
            {isFirst ? "now" : `${idx * 12 + (idx % 5)}s ago`}
          </span>
        </div>
        <div className="k-body" style={{ fontSize: 13, color: entry.tone === "won" ? C.amberBright : C.text, lineHeight: 1.45, fontWeight: entry.tone === "won" ? 500 : 400 }}>
          {entry.text}
        </div>
      </div>
    </div>
  );
}, (prev, next) => {
  // Only re-render when the entry identity, position, or first-status actually changes.
  return prev.entry.id === next.entry.id && prev.isFirst === next.isFirst && prev.idx === next.idx;
});

function Hero({ recovered, flash, logEntries, scanIdx, scanProgress, activeDossierCount }) {
  return (
    <section style={{ paddingTop: 56, paddingBottom: 48 }}>
      <div className="k-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 56 }}>
        <div>
          <HeroEyebrow activeDossierCount={activeDossierCount} />
          <HeroStaticText />
          <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 28, position: "relative" }}>
            <HeroCounter recovered={recovered} flash={flash} />
            <HeroHandCluster />
          </div>
        </div>
        <AgentFeed logEntries={logEntries} scanIdx={scanIdx} scanProgress={scanProgress} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────
const DashboardGrid = React.memo(function DashboardGrid({ onSelect }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <ActiveDossiers onSelect={onSelect} />
      <ConnectedServices />
    </section>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Active Dossiers
// ─────────────────────────────────────────────────────────────────────────────
const ActiveDossiers = React.memo(function ActiveDossiers({ onSelect }) {
  return (
    <Card>
      <CardHeader
        eyebrow="active dossiers"
        title="evidence locked, waiting"
        right={
          <div className="flex items-center" style={{ gap: 8 }}>
            <Icon.Dossier size={12} color={C.textMuted} />
            <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em" }}>
              {DOSSIERS.length} OF 1,247 SHOWN
            </span>
          </div>
        }
      />
      <div className="k-dossiers-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: 16, gap: 14 }}>
        {DOSSIERS.map((d) => (
          <DossierCard key={d.id} dossier={d} onSelect={onSelect} />
        ))}
      </div>
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${C.border}`, background: C.bgElevated }}>
        <div className="flex items-center justify-between">
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em" }}>
            CLICK ANY DOSSIER TO READ THE FILE
          </span>
          <ChevronRight size={12} color={C.textMuted} />
        </div>
      </div>
    </Card>
  );
});

const DossierCard = React.memo(function DossierCard({ dossier, onSelect }) {
  const meta = STATE_META[dossier.state];
  const reclaimed = dossier.state === "reclaimed";
  const handleClick = React.useCallback(() => onSelect(dossier), [onSelect, dossier]);

  return (
    <button
      onClick={handleClick}
      style={{
        position: "relative",
        textAlign: "left",
        background: C.bgElevated,
        border: `1px solid ${reclaimed ? "rgba(247,185,85,0.25)" : C.border}`,
        borderRadius: 10,
        padding: "16px 16px 14px",
        cursor: "pointer",
        transition: "all 0.18s",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.bgCardHover; e.currentTarget.style.borderColor = C.borderBright; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = C.bgElevated; e.currentTarget.style.borderColor = reclaimed ? "rgba(247,185,85,0.25)" : C.border; }}
    >
      {reclaimed && (
        <div className="k-stamp" style={{ position: "absolute", top: 10, right: 10 }}>
          <KlemrSeal size={48} color={C.amber} ink />
        </div>
      )}

      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <Icon.Dossier size={13} color={C.textSec} />
          <span className="k-mono" style={{ fontSize: 11, color: C.text, fontWeight: 600, letterSpacing: "0.04em" }}>
            #{dossier.id}
          </span>
        </div>
        <span className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {dossier.carrier}
        </span>
      </div>

      <div className="flex items-center" style={{ gap: 6, marginBottom: 12 }}>
        <div style={{ width: 6, height: 6, borderRadius: 999, background: meta.color }} className={dossier.state === "watching" || dossier.state === "in_transit" ? "k-pulse" : ""} />
        <span className="k-mono" style={{ fontSize: 10, color: meta.color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
          {meta.label}
        </span>
        <span className="k-body" style={{ fontSize: 11, color: C.textMuted }}>· {meta.desc}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
        {dossier.evidence.slice(0, 5).map((ev, i) => (
          <div key={i} className="flex items-center k-check-in" style={{ gap: 8, animationDelay: `${i * 0.05}s` }}>
            {ev.pending ? (
              <div style={{ width: 12, height: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="k-mono" style={{ fontSize: 11, color: C.textMuted, lineHeight: 1 }}>⋯</span>
              </div>
            ) : ev.flag ? (
              <div style={{ width: 12, height: 12, borderRadius: 999, background: "rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="k-mono" style={{ fontSize: 9, color: C.red, lineHeight: 1, fontWeight: 700 }}>!</span>
              </div>
            ) : ev.ours ? (
              <KlemrSeal size={12} color={C.amber} />
            ) : (
              <Icon.Check size={11} color={C.mint} />
            )}
            <span className="k-mono" style={{
              fontSize: 11,
              color: ev.flag ? C.red : ev.pending ? C.textMuted : ev.ours ? C.amber : C.textSec,
              lineHeight: 1.4,
              flex: 1,
            }}>
              {ev.label}
            </span>
            <span className="k-mono" style={{ fontSize: 9, color: C.textMuted }}>
              {ev.time}
            </span>
          </div>
        ))}
        {dossier.evidence.length > 5 && (
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginLeft: 20, marginTop: 2 }}>
            + {dossier.evidence.length - 5} more
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 10, borderTop: `1px dashed ${C.border}`, gap: 12 }}>
        <HandNote color={dossier.state === "reclaimed" ? C.amberInk : C.mintInk} rotate={dossier.noteRotate} size={15} delay={0.2}>
          {dossier.note}
        </HandNote>
        {dossier.amount !== null && (
          <div className="k-display" style={{ fontSize: 22, color: reclaimed ? C.amber : C.text, fontWeight: 400, lineHeight: 1, whiteSpace: "nowrap" }}>
            {reclaimed ? "+" : ""}${fmt$(dossier.amount)}
          </div>
        )}
      </div>
    </button>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Connected services — horizontal strip below dossiers
// ─────────────────────────────────────────────────────────────────────────────
const ConnectedServices = React.memo(function ConnectedServices() {
  const services = [
    { name: "ShipStation", detail: "1,247 dossiers · synced 2m ago" },
    { name: "UPS", detail: "evidence-watching · 84 active" },
    { name: "FedEx", detail: "evidence-watching · 31 active" },
    { name: "USPS", detail: "evidence-watching · 12 active" },
  ];
  return (
    <Card>
      <CardHeader
        eyebrow="connected"
        title="evidence sources"
        right={<Icon.Plug size={12} color={C.textMuted} />}
      />
      <div className="k-services-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {services.map((s, i) => (
          <div key={s.name} className="flex items-center" style={{
            padding: "16px 18px", gap: 12,
            borderLeft: i === 0 ? "none" : `1px solid ${C.border}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 7,
              background: C.bgElevated, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {s.name === "ShipStation" ? <Icon.Receipt size={14} color={C.mint} /> : <Icon.Eye size={14} color={C.mint} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center" style={{ gap: 6, marginBottom: 2 }}>
                <span className="k-body" style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>{s.name}</span>
                <div style={{ width: 5, height: 5, borderRadius: 999, background: C.mint }} className="k-pulse" />
              </div>
              <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Inspector
// ─────────────────────────────────────────────────────────────────────────────
function Inspector({ dossier, onClose }) {
  const meta = STATE_META[dossier.state];
  const reclaimed = dossier.state === "reclaimed";

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)", zIndex: 50, animation: "k-fade-in 0.2s ease-out",
      }} />
      <div className="k-body k-inspector" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 520, maxWidth: "100vw",
        background: C.bgCard,
        borderLeft: `1px solid ${C.borderBright}`,
        zIndex: 51,
        animation: "k-slide-in 0.35s cubic-bezier(.2,.8,.2,1)",
        display: "flex", flexDirection: "column",
        color: C.text,
      }}>
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <Icon.Dossier size={14} color={C.amber} />
            <span className="k-mono" style={{ fontSize: 11, color: C.textSec, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              dossier · #{dossier.id}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            borderRadius: 6, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.textSec, cursor: "pointer",
          }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: 28, flex: 1, overflowY: "auto", position: "relative" }}>
          <div className="flex items-center" style={{ gap: 10, marginBottom: 18 }}>
            <div style={{
              padding: "5px 12px", borderRadius: 4,
              background: `${meta.color}1A`,
              border: `1px solid ${meta.color}50`,
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: meta.color }} />
              <span className="k-mono" style={{ fontSize: 10, color: meta.color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                {meta.label}
              </span>
            </div>
            <span className="k-body" style={{ fontSize: 12, color: C.textMuted }}>{meta.desc}</span>
          </div>

          <h2 className="k-display" style={{ fontSize: 36, color: C.text, lineHeight: 1.05, margin: 0, marginBottom: 8 }}>
            {dossier.carrier} · #{dossier.id}
          </h2>

          {dossier.amount !== null && (
            <div className="k-display" style={{ fontSize: 40, color: C.amber, marginBottom: 22, display: "flex", alignItems: "baseline", gap: 4 }}>
              {reclaimed ? "+" : ""}${fmt$(dossier.amount)}
              {reclaimed && (
                <HandNote color={C.amberInk} rotate={-4} size={18} delay={0.4} style={{ marginLeft: 12 }}>
                  ← back in the bank
                </HandNote>
              )}
            </div>
          )}

          <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12, marginTop: 14 }}>
            the evidence
          </div>
          <div style={{
            background: C.bgElevated,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "16px 18px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {dossier.evidence.map((ev, i) => (
              <div key={i} className="flex items-center" style={{ gap: 10 }}>
                {ev.pending ? (
                  <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="k-mono" style={{ fontSize: 12, color: C.textMuted }}>⋯</span>
                  </div>
                ) : ev.flag ? (
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: "rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="k-mono" style={{ fontSize: 9, color: C.red, fontWeight: 700 }}>!</span>
                  </div>
                ) : ev.ours ? (
                  <KlemrSeal size={14} color={C.amber} />
                ) : (
                  <Icon.Check size={12} color={C.mint} />
                )}
                <span className="k-mono" style={{
                  fontSize: 12,
                  color: ev.flag ? C.red : ev.pending ? C.textMuted : ev.ours ? C.amber : C.text,
                  flex: 1,
                }}>
                  {ev.label}
                </span>
                <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>{ev.time}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "16px 18px", background: "rgba(247,185,85,0.04)", border: `1px dashed rgba(247,185,85,0.3)`, borderRadius: 10 }}>
            <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
              the agent's note
            </div>
            <HandNote color={C.amberInk} rotate={-1} size={22} delay={0.3} style={{ display: "block" }}>
              {dossier.note}
            </HandNote>
          </div>

          <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 28, marginBottom: 10 }}>
            what's next
          </div>
          <p className="k-body" style={{ fontSize: 14, color: C.textSec, lineHeight: 1.6, margin: 0 }}>
            {nextStep(dossier.state)}
          </p>
        </div>
      </div>
    </>
  );
}

function nextStep(state) {
  switch (state) {
    case "watching":   return "still gathering. once the carrier picks up, we'll lock the dossier and wait for the invoice.";
    case "in_transit": return "dossier is sealed. now we wait. when the carrier invoices, we'll cross-check against the locked evidence.";
    case "invoiced":   return "we caught the discrepancy. preparing to file with the carrier's dispute portal — usually within the hour.";
    case "filing":     return "filed. carriers typically respond in 3–7 business days. we'll auto-confirm credit when it posts.";
    case "reclaimed":  return "credit confirmed. money is back. dossier closed.";
    default:           return "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Card primitives
// ─────────────────────────────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

function CardHeader({ eyebrow, title, right }) {
  return (
    <div style={{
      padding: "16px 20px",
      borderBottom: `1px solid ${C.border}`,
      background: C.bgElevated,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16,
    }}>
      <div>
        <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 }}>
          {eyebrow}
        </div>
        <div className="k-display" style={{ fontSize: 18, color: C.text, lineHeight: 1.1 }}>
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
const Footer = React.memo(function Footer() {
  return (
    <div style={{
      marginTop: 64, paddingTop: 28,
      borderTop: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div className="flex items-center" style={{ gap: 12 }}>
        <KlemrSeal size={28} color={C.amber} />
        <Wordmark size={20} />
      </div>
      <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        demo · sample merchant data
      </div>
    </div>
  );
});

// Brand primitives — Seal, Wordmark, Icons, HandNote, shared keyframes
(function() {
const { C } = window.KLEMR;

const KLEMR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@400;500;600;700&display=swap');

  .k-display { font-family: 'Instrument Serif', 'Times New Roman', serif; font-weight: 400; letter-spacing: -0.02em; }
  .k-body    { font-family: 'DM Sans', system-ui, sans-serif; }
  .k-mono    { font-family: 'JetBrains Mono', ui-monospace, monospace; }
  .k-hand    { font-family: 'Caveat', cursive; font-weight: 500; }

  @keyframes k-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.85); } }
  @keyframes k-pulse-ring { 0% { transform: scale(0.8); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  @keyframes k-slide-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes k-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes k-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes k-stamp {
    0%   { opacity: 0; transform: scale(2.4) rotate(-18deg); filter: blur(2px); }
    55%  { opacity: 1; transform: scale(0.92) rotate(-7deg); filter: blur(0); }
    100% { opacity: 0.96; transform: scale(1) rotate(-9deg); filter: blur(0); }
  }
  @keyframes k-hand-in {
    0%   { opacity: 0; transform: translateY(4px) rotate(var(--r, -2deg)) scale(0.92); }
    60%  { opacity: 1; transform: translateY(0) rotate(calc(var(--r, -2deg) - 1deg)) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) rotate(var(--r, -2deg)) scale(1); }
  }
  @keyframes k-progress-pulse { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
  @keyframes k-trace { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

  .k-pulse { animation: k-pulse 1.8s ease-in-out infinite; }
  .k-slide-in { animation: k-slide-in 0.45s cubic-bezier(.2,.8,.2,1) both; }
  .k-fade-in { animation: k-fade-in 0.6s ease-out both; opacity: 1; }
  .k-stamp { animation: k-stamp 0.8s cubic-bezier(.2,.9,.3,1.1) both; }
  .k-hand-anim { animation: k-hand-in 0.7s cubic-bezier(.3,.7,.3,1.2) both; }

  .k-pulse-ring::after {
    content: ''; position: absolute; inset: 0; border-radius: 9999px;
    border: 1px solid ${C.mint}; animation: k-pulse-ring 1.6s ease-out infinite;
  }
  .k-stream::-webkit-scrollbar { width: 3px; }
  .k-stream::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
  ::selection { background: ${C.amber}; color: ${C.bg}; }

  .k-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; transition: all .18s;
  }
  .k-btn-primary { background: ${C.amber}; color: ${C.bg}; }
  .k-btn-primary:hover { background: ${C.amberBright}; }
  .k-btn-ghost { background: transparent; color: ${C.textSec}; border: 1px solid ${C.border}; }
  .k-btn-ghost:hover { color: ${C.text}; border-color: ${C.borderBright}; }
  .k-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .k-input {
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: ${C.bg}; color: ${C.text};
    border: 1px solid ${C.border}; border-radius: 8px;
    padding: 12px 14px; width: 100%; outline: none; transition: border-color .18s;
  }
  .k-input:focus { border-color: ${C.amber}; }

  .k-tile {
    background: ${C.bgElevated}; border: 1px solid ${C.border};
    border-radius: 10px; padding: 16px; cursor: pointer;
    transition: all .18s; text-align: left;
  }
  .k-tile:hover { background: ${C.bgCardHover}; border-color: ${C.borderBright}; }
  .k-tile.k-tile-active { border-color: ${C.amber}; background: rgba(247,185,85,0.06); }
`;

function injectKlemrStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("klemr-shared-styles")) return;
  const tag = document.createElement("style");
  tag.id = "klemr-shared-styles";
  tag.textContent = KLEMR_CSS;
  document.head.appendChild(tag);
}

function KlemrSeal({ size = 36, color = C.amber, ink = false }) {
  const stroke = ink ? 1.6 : 1.4;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {ink && (
          <filter id={`k-ink-${size}-${color.replace('#','')}`}>
            <feGaussianBlur stdDeviation="0.18" />
          </filter>
        )}
      </defs>
      <g filter={ink ? `url(#k-ink-${size}-${color.replace('#','')})` : undefined} opacity={ink ? 0.94 : 1}>
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

function Wordmark({ size = 26, color = C.text }) {
  return (
    <span className="k-display" style={{ fontSize: size, color, lineHeight: 1, letterSpacing: "-0.015em" }}>
      klemr<span style={{ color: C.amber }}>.</span>
    </span>
  );
}

const KIcon = {
  Eye: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7z" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="0.9" fill={color} stroke="none" />
    </svg>
  ),
  Dossier: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h7l2 2.5h9v11.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
      <path d="M16 8.5l3.5-2.5v2.5" />
      <line x1="7" y1="14" x2="13" y2="14" opacity="0.5" />
      <line x1="7" y1="17" x2="11" y2="17" opacity="0.5" />
    </svg>
  ),
  Check: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5 11-12" />
    </svg>
  ),
  Plug: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v6M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8z" />
      <path d="M12 17v5" />
    </svg>
  ),
  Pulse: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  ),
  Arrow: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Lock: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  Camera: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h3l1.5-2h9L18 8h3v11H3V8z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  ),
  Truck: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  ),
  Receipt: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v15.5l-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1L5 19.5z" />
    </svg>
  ),
  Spark: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M18.5 5.5l-2.8 2.8M8.3 15.7l-2.8 2.8" />
    </svg>
  ),
  Search: ({ size = 14, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  ),
};

const HandNote = React.memo(function HandNote({ children, color = C.amberInk, rotate = -2, size = 18, delay = 0, style }) {
  const computedStyle = React.useMemo(() => ({
    "--r": `${rotate}deg`,
    fontFamily: "'Caveat', cursive",
    color, fontSize: size, lineHeight: 1.15,
    animationDelay: `${delay}s`,
    display: "inline-block", whiteSpace: "nowrap",
    ...(style || {}),
  }), []);
  return <span className="k-hand k-hand-anim" style={computedStyle}>{children}</span>;
});

function Watermark() {
  const text = " EVIDENCE · KLEMR · DOSSIER · KLEMR · WITNESS · KLEMR · RECEIPT · KLEMR ";
  const rows = Array.from({ length: 30 });
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      overflow: "hidden",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, letterSpacing: "0.28em",
      color: C.text, opacity: 0.022, userSelect: "none",
    }}>
      {rows.map((_, i) => (
        <div key={i} style={{ whiteSpace: "nowrap", lineHeight: "32px", transform: i % 2 ? "translateX(-30px)" : "none" }}>
          {text.repeat(20)}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { injectKlemrStyles, KlemrSeal, Wordmark, KIcon, HandNote, Watermark });
})();

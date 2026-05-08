import { memo, useMemo } from "react";
import { C } from "../tokens.js";

export function KlemrMark({ size = 36, color = C.amber, ink = false, animated = false }) {
  const stroke = ink ? 1.8 : 1.6;
  const filterId = `k-ink-${size}-${color.replace('#','')}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
      {ink && (
        <defs><filter id={filterId}><feGaussianBlur stdDeviation="0.18" /></filter></defs>
      )}
      <g filter={ink ? `url(#${filterId})` : undefined} opacity={ink ? 0.94 : 1}>
        <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth={stroke * 0.55} opacity="0.32" />
        <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth={stroke} />
        {[
          { a: -90 },
          { a: 30  },
          { a: 150 },
        ].map((n, i) => {
          const rad = (n.a * Math.PI) / 180;
          const r = 11.4;
          const cx = 20 + Math.cos(rad) * r;
          const cy = 20 + Math.sin(rad) * r;
          const tx = -Math.sin(rad), ty = Math.cos(rad);
          const nx = Math.cos(rad), ny = Math.sin(rad);
          const armLen = 2.4;
          return (
            <g key={i}>
              <line
                x1={cx - tx * armLen} y1={cy - ty * armLen}
                x2={cx} y2={cy}
                stroke={color} strokeWidth={stroke} strokeLinecap="round"
              />
              <line
                x1={cx} y1={cy}
                x2={cx + nx * armLen * 0.85} y2={cy + ny * armLen * 0.85}
                stroke={color} strokeWidth={stroke} strokeLinecap="round"
              />
            </g>
          );
        })}
        <line
          x1="11.5" y1="13.2" x2="26" y2="26"
          stroke={color} strokeWidth={stroke * 1.15} strokeLinecap="round"
          className={animated ? "k-sweep" : undefined}
          style={animated ? { transformOrigin: "20px 20px" } : undefined}
        />
        <circle cx="20" cy="20" r={stroke * 0.9} fill={color} />
        <circle cx="26" cy="26" r={stroke * 1.05} fill={color} />
        <circle cx="26" cy="26" r={stroke * 2.2} fill="none" stroke={color} strokeWidth={stroke * 0.4} opacity="0.5" />
      </g>
    </svg>
  );
}

export const KlemrSeal = KlemrMark;

export function Wordmark({ size = 26, color = C.text }) {
  return (
    <span className="k-display" style={{ fontSize: size, color, lineHeight: 1, letterSpacing: "-0.015em" }}>
      klemr<span style={{ color: C.amber }}>.</span>
    </span>
  );
}

export const HandNote = memo(function HandNote({ children, color = C.amberInk, rotate = -2, size = 18, delay = 0, style }) {
  const computedStyle = useMemo(() => ({
    "--r": `${rotate}deg`,
    fontFamily: "'Caveat', cursive",
    color, fontSize: size, lineHeight: 1.15,
    animationDelay: `${delay}s`,
    display: "inline-block", whiteSpace: "nowrap",
    ...(style || {}),
  }), []);
  return <span className="k-hand k-hand-anim" style={computedStyle}>{children}</span>;
});

export const Icon = {
  Eye: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12c2.5-4.5 6-7 10-7s7.5 2.5 10 7c-2.5 4.5-6 7-10 7s-7.5-2.5-10-7z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="0.9" fill={color} stroke="none"/></svg>,
  Dossier: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h7l2 2.5h9v11.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/><path d="M16 8.5l3.5-2.5v2.5"/><line x1="7" y1="14" x2="13" y2="14" opacity="0.5"/><line x1="7" y1="17" x2="11" y2="17" opacity="0.5"/></svg>,
  Pattern: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24"><circle cx="5" cy="17" r="2" fill={color} opacity="0.5"/><circle cx="12" cy="12" r="2" fill={color} opacity="0.75"/><circle cx="19" cy="7" r="2" fill={color}/></svg>,
  Settings: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Pulse: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>,
  Check: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5 11-12"/></svg>,
  Arrow: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  Refresh: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>,
  X: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Play: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="6 4 20 12 6 20 6 4"/></svg>,
  Pause: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Film: ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="1.5"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/></svg>,
};

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { C } from "../tokens.js";

export function AgentLine({ children, isCurrent }) {
  return (
    <div className="k-fade-in" style={{
      display: "flex", alignItems: "stretch",
      paddingLeft: 14,
      borderLeft: isCurrent ? `2px solid ${C.mint}` : `2px solid transparent`,
    }}>
      <div style={{
        fontFamily: "'Geist', system-ui, sans-serif",
        fontSize: 15, lineHeight: 1.55, color: C.text, fontWeight: 400,
        maxWidth: 580, letterSpacing: 0,
      }}>
        {children}
        {isCurrent && <span className="k-caret" style={{ color: C.textSec, marginLeft: 2 }}>▍</span>}
      </div>
    </div>
  );
}

export function UserLine({ children }) {
  return (
    <div className="k-fade-in" style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        background: "#1A1714", border: `1px solid ${C.border}`,
        color: C.text, fontSize: 14.5, lineHeight: 1.5,
        padding: "10px 14px", borderRadius: 14,
        maxWidth: 480, fontFamily: "'Geist', system-ui, sans-serif",
      }}>{children}</div>
    </div>
  );
}

export const ActiveInputCtx = React.createContext({
  activeId: null,
  request: () => {},
  release: () => {},
});

export function ResolvedUndo({ onClick, revealAfterMs }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const t = setTimeout(() => setShown(true), revealAfterMs);
    return () => clearTimeout(t);
  }, [revealAfterMs]);
  if (!shown) return null;
  return (
    <button onClick={onClick} className="k-fade-in" style={{
      background: "transparent", border: "none", color: C.textMuted,
      fontSize: 12, cursor: "pointer", padding: "2px 4px",
      fontFamily: "'Geist', system-ui, sans-serif", textDecoration: "underline",
      textDecorationColor: C.border,
    }}>undo</button>
  );
}

export function DelayedReveal({ ms, children }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(true); return; }
    const t = setTimeout(() => setShown(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  if (!shown) return null;
  return <div className="k-fade-in">{children}</div>;
}

import React, { useState, useRef, useEffect, useContext } from "react";
import { C } from "../tokens.js";
import { ActiveInputCtx } from "./AgentLine.jsx";

export function AskKlemr({ onSend, prompts, referenceChip, onDismissReference, focusSignal }) {
  const [draft, setDraft] = useState("");
  const ctx = useContext(ActiveInputCtx);
  const inputRef = useRef(null);
  const myId = "composer";
  const submit = (text) => {
    const t = (text || draft).trim();
    if (!t) return;
    onSend(t, referenceChip ? referenceChip.ref : null);
    setDraft("");
    if (ctx.activeId === myId) ctx.release(myId);
  };
  const claim = () => ctx.request(myId);
  useEffect(() => {
    if (focusSignal == null) return;
    const el = inputRef.current;
    if (el) { el.focus(); claim(); }
  }, [focusSignal]);
  const hasText = draft.trim().length > 0;
  const showPrompts = !!(prompts && prompts.length) && !referenceChip;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "'Geist', system-ui, sans-serif" }}>
      {showPrompts && (
        <div className="k-mono k-fade-in" style={{
          fontSize: 11.5, color: C.textSec, lineHeight: 1.5, letterSpacing: 0.01,
          padding: "0 4px",
        }}>
          {prompts.map((p, i) => (
            <React.Fragment key={p}>
              {i > 0 && <span style={{ color: C.textMuted, padding: "0 8px", userSelect: "none" }}>·</span>}
              <button onClick={() => submit(p)} style={{
                background: "transparent", border: "none", padding: 0,
                color: C.textSec, cursor: "pointer",
                fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textSec; }}
              >{p}</button>
            </React.Fragment>
          ))}
        </div>
      )}

      {referenceChip && (
        <div className="k-mono k-fade-in" style={{
          display: "inline-flex", alignSelf: "flex-start", alignItems: "center",
          gap: 8, padding: "4px 8px 4px 10px",
          background: C.bgCard, border: `1px solid ${C.border}`,
          borderRadius: 8, color: C.textSec, fontSize: 11.5, letterSpacing: 0.01,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}>
          <span style={{ color: C.textMuted }}>re:</span>
          <span style={{ color: C.text }}>{referenceChip.label}</span>
          <button
            type="button"
            onClick={onDismissReference}
            aria-label="clear reference"
            title="clear reference"
            style={{
              background: "transparent", border: "none", padding: 0, marginLeft: 2,
              color: C.textMuted, cursor: "pointer", fontSize: 13, lineHeight: 1,
              fontFamily: "inherit", display: "inline-flex", alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
          >×</button>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{
        display: "flex", alignItems: "center", gap: 8,
        border: `1px solid ${C.border}`, borderRadius: 14, background: C.bgCard,
        padding: "6px 6px 6px 12px",
      }}>
        <button
          type="button"
          title="attach a file or invoice"
          onClick={(e) => e.preventDefault()}
          style={{
            background: "transparent", border: "none", padding: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 22, height: 22, cursor: "pointer", color: C.textMuted,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.textSec; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <input
          ref={inputRef}
          value={draft} onChange={(e) => { setDraft(e.target.value); claim(); }}
          onFocus={claim}
          placeholder={referenceChip ? `reply about ${referenceChip.label.toLowerCase()}…` : "tell me what to look at"}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: C.text, fontSize: 14.5, fontFamily: "'Geist', system-ui, sans-serif",
            padding: "10px 4px", letterSpacing: 0,
          }}
        />
        <button
          type="submit"
          aria-label="send"
          style={{
            width: 28, height: 28, borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
            background: hasText ? C.text : "transparent",
            border: hasText ? `1px solid ${C.text}` : `1px solid ${C.border}`,
            color: hasText ? C.bg : C.textMuted,
            transition: "background 0.15s, border-color 0.15s, color 0.15s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </form>
    </div>
  );
}

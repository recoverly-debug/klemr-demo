import React, { useState, useEffect } from "react";
import { C } from "../tokens.js";
import { Typewriter, RichTypewriter } from "./Typewriter.jsx";
import { ResolvedUndo } from "./AgentLine.jsx";

export function InlineActions({ chips, onPick, cardKey, contextLabel, onCustom, superseded }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center",
      marginTop: 14, fontFamily: "'Geist Mono', ui-monospace, monospace",
      fontSize: 13, color: C.text, gap: 0,
      opacity: superseded ? 0.45 : 1,
      pointerEvents: superseded ? "none" : "auto",
    }}
    aria-disabled={superseded ? "true" : undefined}
    title={superseded ? "moved on — answer the latest prompt below" : undefined}
    >
      {chips.map((c, i) => (
        <React.Fragment key={c.label}>
          {i > 0 && (
            <span style={{ color: C.textMuted, padding: "0 10px", userSelect: "none" }}>·</span>
          )}
          <button
            onClick={() => onPick(c)}
            disabled={superseded}
            tabIndex={superseded ? -1 : 0}
            style={{
              background: "transparent", border: "none", padding: "2px 0",
              cursor: superseded ? "default" : "pointer", color: C.text, letterSpacing: 0,
              fontFamily: "inherit", fontSize: "inherit",
              borderBottom: c.primary && !superseded ? `1px solid ${C.amber}` : "1px solid transparent",
              paddingBottom: 2,
              textDecoration: superseded ? "line-through" : "none",
              textDecorationColor: superseded ? C.border : "transparent",
            }}
          >{c.label}</button>
        </React.Fragment>
      ))}
      {!superseded && (
        <React.Fragment>
          <span style={{ color: C.textMuted, padding: "0 10px", userSelect: "none" }}>·</span>
          <button
            onClick={() => { if (onCustom) onCustom(contextLabel || cardKey); }}
            title="reply about this card in the composer below"
            style={{
              background: "transparent", border: "none", padding: "2px 0",
              cursor: "pointer", color: C.textMuted, letterSpacing: 0,
              fontFamily: "inherit", fontSize: "inherit",
              fontStyle: "italic",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.textSec; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 1 }}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            something else…
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

export function CardMessage({
  headline, body, lean, chips, resolved, onPick, isCurrent,
  typed = false, startDelay = 0, headlineHtml, bodyHtml, speed = 8, onTyped,
  nested = false, cardKey, contextLabel, superseded = false, onCustom,
}) {
  const headlineLen = headlineHtml ? headlineHtml.replace(/<[^>]+>/g, "").length : 0;
  const bodyLen     = bodyHtml     ? bodyHtml.replace(/<[^>]+>/g, "").length     : 0;
  const leanLen     = lean         ? lean.length                                  : 0;
  const headlineDelay = startDelay;
  const bodyDelay     = headlineDelay + headlineLen * speed + 180;
  const leanDelay     = bodyDelay     + bodyLen     * speed + 200;
  const actionsDelay  = leanDelay     + leanLen     * speed + 220;
  const totalRevealMs = actionsDelay + 60;

  const [revealed, setRevealed] = useState(!typed);
  useEffect(() => {
    if (!typed) { setRevealed(true); return; }
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setRevealed(true); return; }
    const t = setTimeout(() => setRevealed(true), totalRevealMs);
    return () => clearTimeout(t);
  }, [typed, totalRevealMs]);

  useEffect(() => {
    if (revealed && onTyped) onTyped();
  }, [revealed]);

  if (resolved) {
    const resolvedLen = resolved.line.length;
    const pickedChip = chips && chips.find(c => c.outcome && c.outcome.line === resolved.line);
    const pickedLabel = pickedChip ? pickedChip.label : null;
    return (
      <div className="k-fade-in" style={{
        paddingLeft: nested ? 0 : 14,
        borderLeft: nested ? "none" : (isCurrent ? `2px solid ${C.mint}` : `2px solid transparent`),
      }}>
        <div style={{
          fontFamily: "'Geist', system-ui, sans-serif", maxWidth: 580,
          opacity: 0.72,
        }}>
          <h3 style={{
            margin: "0 0 8px", fontSize: 16, lineHeight: 1.4, letterSpacing: 0,
            color: C.text, fontWeight: 600,
          }}>
            {headlineHtml
              ? <span dangerouslySetInnerHTML={{ __html: headlineHtml }} />
              : headline}
          </h3>
          <p style={{ margin: "0 0 10px", color: C.textSec, fontSize: 14.5, lineHeight: 1.55 }}>
            {bodyHtml
              ? <span dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              : body}
          </p>
          {lean && (
            <p style={{
              margin: "0 0 4px", fontSize: 14, lineHeight: 1.5,
              color: C.text, fontStyle: "italic", fontWeight: 400,
            }}>
              {lean}
            </p>
          )}
        </div>
        {pickedLabel && chips && (
          <div className="k-mono k-fade-in" style={{
            fontSize: 13, color: C.textMuted, marginTop: 10,
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0,
            lineHeight: 1.6,
          }}>
            <span style={{ color: C.textMuted, marginRight: 8 }}>you picked</span>
            {chips.map((c, i) => {
              const isPicked = c.label === pickedLabel;
              return (
                <React.Fragment key={c.label}>
                  {i > 0 && <span style={{ color: C.textMuted, padding: "0 8px", opacity: 0.5 }}>·</span>}
                  <span style={{
                    color: isPicked ? C.text : C.textMuted,
                    opacity: isPicked ? 1 : 0.55,
                    fontWeight: isPicked ? 600 : 400,
                    textDecoration: isPicked && c.primary ? `underline 1px ${C.amber}` : "none",
                    textUnderlineOffset: 3,
                  }}>{c.label}</span>
                </React.Fragment>
              );
            })}
          </div>
        )}
        <div style={{
          fontFamily: "'Geist', system-ui, sans-serif", fontSize: 14, lineHeight: 1.5,
          color: C.textSec, display: "flex", alignItems: "center",
          gap: 10, flexWrap: "wrap", marginTop: 14,
        }}>
          <span>
            <Typewriter text={resolved.line} speed={speed} delay={0} />
            {isCurrent && <span className="k-caret" style={{ color: C.textSec, marginLeft: 2 }}>▍</span>}
          </span>
          <ResolvedUndo
            onClick={() => onPick(null)}
            revealAfterMs={resolvedLen * speed + 120}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="k-fade-in" style={{
      paddingLeft: nested ? 0 : 14,
      borderLeft: nested ? "none" : (isCurrent ? `2px solid ${C.mint}` : `2px solid transparent`),
    }}>
      <div style={{ fontFamily: "'Geist', system-ui, sans-serif", maxWidth: 580 }}>
        <h3 style={{
          margin: "0 0 8px", fontSize: 16, lineHeight: 1.4, letterSpacing: 0,
          color: C.text, fontWeight: 600,
        }}>
          {typed && headlineHtml
            ? <RichTypewriter html={headlineHtml} speed={speed} delay={headlineDelay} />
            : headline}
        </h3>
        <p style={{ margin: "0 0 10px", color: C.textSec, fontSize: 14.5, lineHeight: 1.55 }}>
          {typed && bodyHtml
            ? <RichTypewriter html={bodyHtml} speed={speed} delay={bodyDelay} />
            : body}
        </p>
        {lean && (
          <p style={{
            margin: "0 0 4px", fontSize: 14, lineHeight: 1.5,
            color: C.text, fontStyle: "italic", fontWeight: 400,
          }}>
            {typed
              ? <Typewriter text={lean} speed={speed} delay={leanDelay} />
              : lean}
          </p>
        )}
        {revealed && (
          <div className="k-fade-in">
            <InlineActions chips={chips} onPick={onPick} cardKey={cardKey} contextLabel={contextLabel} onCustom={onCustom} superseded={superseded} />
          </div>
        )}
        {isCurrent && revealed && <span className="k-caret" style={{ color: C.textSec, marginLeft: 2, fontSize: 13 }}>▍</span>}
      </div>
    </div>
  );
}

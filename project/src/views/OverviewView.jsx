import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from "react";
import { C, fmt$ } from "../tokens.js";
import {
  QUICK_ACTIONS, PROMPTS_CARD1, PROMPTS_CARD2, PROMPTS_RECAP, PROMPT_REPLIES,
} from "../data.js";
import { buildMorningBriefings } from "../data/briefings.js";
import { Typewriter, RichTypewriter } from "../components/Typewriter.jsx";
import { AgentLine, UserLine, ActiveInputCtx, DelayedReveal } from "../components/AgentLine.jsx";
import { CardMessage, InlineActions, PickedLine } from "../components/CardMessage.jsx";
import { AskKlemr } from "../components/AskKlemr.jsx";
import { ActingOnRail } from "../components/ActingOnRail.jsx";

export function OverviewView({ recovered, flash, logEntries, scanIdx, scanProgress, activeDossierCount, setView, openDossier }) {
  const [c1, setC1] = useState(null);
  const [c2, setC2] = useState(null);
  const [c1Done, setC1Done] = useState(false);
  const [c2Done, setC2Done] = useState(false);
  const [card1Typed, setCard1Typed] = useState(false);
  const [card2Typed, setCard2Typed] = useState(false);
  const [settledLineDone, setSettledLineDone] = useState(false);
  const [recoveredLineDone, setRecoveredLineDone] = useState(false);
  const RESOLVED_SPEED = 8;
  const RESOLVED_GAP = 320;
  const [thread, setThread] = useState([]);
  const [showLedger, setShowLedger] = useState(false);

  // Auto-scroll
  const scrollRef = useRef(null);
  const stickToBottomRef = useRef(true);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      stickToBottomRef.current = distanceFromBottom < 120;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const stick = () => {
      if (stickToBottomRef.current) el.scrollTop = el.scrollHeight;
    };
    const queueStick = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(stick);
    };
    const ro = new ResizeObserver(queueStick);
    const observeAll = () => {
      Array.from(el.children).forEach(child => ro.observe(child));
    };
    observeAll();
    const mo = new MutationObserver((muts) => {
      muts.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) ro.observe(node);
        });
      });
      queueStick();
    });
    mo.observe(el, { childList: true, subtree: true });
    return () => { ro.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    stickToBottomRef.current = true;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.length]);

  // Active input coordination
  const [activeInputId, setActiveInputId] = useState(null);
  const requestActiveInput = useCallback((id) => {
    setActiveInputId(id);
  }, []);
  const releaseActiveInput = useCallback((id) => {
    setActiveInputId(prev => prev === id ? null : prev);
  }, []);
  const activeInputCtxValue = useMemo(() => ({
    activeId: activeInputId,
    request: requestActiveInput,
    release: releaseActiveInput,
  }), [activeInputId, requestActiveInput, releaseActiveInput]);

  const [composerRef, setComposerRef] = useState(null);
  const [composerFocusN, setComposerFocusN] = useState(0);
  const dismissComposerRef = useCallback(() => setComposerRef(null), []);
  const focusComposerForCard = useCallback((cardKey) => {
    const labelMap = {
      "card1": "#VB-44087",
      "card2": "the 11 ups reclassifications",
    };
    let label = labelMap[cardKey] || cardKey;
    if (typeof cardKey === "string" && (cardKey.startsWith("#") || cardKey.includes(" "))) {
      label = cardKey;
    }
    let ref = null;
    if (label === "#VB-44087" || cardKey === "card1") ref = "card1";
    else if (label === "the 11 ups reclassifications" || cardKey === "card2") ref = "card2";
    setComposerRef({ label, ref });
    setComposerFocusN(n => n + 1);
  }, []);

  // Morning briefings — derived from dossiers awaiting your call.
  // briefings[0] is the "expanded" (bigger one first) card; briefings[1]
  // is the "collapsed" follow-up. Both carry headline/body/lean/label
  // built from real dossier data.
  const briefings = useMemo(() => buildMorningBriefings(), []);
  const expanded = briefings[0];
  const collapsed = briefings[1];

  const c1Chips = useMemo(() => [
    { label: "re-file with noaa", primary: true,  outcome: { tone: "won",   line: "noaa attachment sent. i'll log the response when it lands." } },
    { label: "call dispute line",                  outcome: { tone: "won",   line: "queued a dispute call for tomorrow morning." } },
    { label: "let it go",                          outcome: { tone: "muted", line: "letting it go. logged in the dossier." } },
  ], []);
  const c2Chips = useMemo(() => [
    { label: "file the batch", primary: true, outcome: { tone: "won",   line: "batch sent. watching for the reply alongside the others." } },
    { label: "wait a week",                    outcome: { tone: "muted", line: "holding for a week. i'll re-surface if it grows." } },
    { label: "open first",                     outcome: { tone: "muted", line: "opened in patterns view. come back when you're ready." }, then: () => setView && setView("patterns") },
  ], [setView]);

  // Reused 3x: when card 2 lands as a chained thread item (after card 1
  // was resolved off-script). Pulled into a constant so all 3 sites stay
  // identical to the standalone card 2 render below.
  const card2CardProps = useMemo(() => ({
    label: collapsed.label,
    headlineHtml: collapsed.headlineHtml,
    bodyHtml: collapsed.bodyHtml,
    lean: collapsed.lean,
    chips: c2Chips,
  }), [collapsed, c2Chips]);

  // Mid-stream protection
  const streamingRef = useRef(null);
  const streamingQueueRef = useRef([]);
  const drainStreamingQueue = useCallback(() => {
    const q = streamingQueueRef.current;
    streamingQueueRef.current = [];
    q.forEach(fn => { try { fn(); } catch (e) {} });
  }, []);
  const afterStream = useCallback((fn) => {
    if (!streamingRef.current) { fn(); return; }
    streamingQueueRef.current.push(fn);
  }, []);
  const markStreamingStart = useCallback((id) => {
    if (streamingRef.current && streamingRef.current !== id) drainStreamingQueue();
    streamingRef.current = id;
  }, [drainStreamingQueue]);
  const markStreamingDone = useCallback((id) => {
    if (streamingRef.current === id) streamingRef.current = null;
    drainStreamingQueue();
  }, [drainStreamingQueue]);

  useEffect(() => {
    const last = [...thread].reverse().find(it => it.kind === "agent" && !it.thinking);
    if (last) markStreamingStart(last.id);
  }, [thread, markStreamingStart]);

  const appendAgentToThread = useCallback((text, extras = {}) => {
    const aid = `a-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    setThread(t => [...t, { id: aid, kind: "agent", text, ...extras }]);
  }, []);

  const appendUserChip = useCallback((label) => {
    const uid = `u-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    setThread(t => [...t, { id: uid, kind: "user", text: label, fromChip: true }]);
  }, []);

  // Terminal state — once the recap's "next thing" line has landed, the
  // morning is resolved. Every chip in the thread (and any superseded
  // card chrome above) should disable so a stray click can't re-run the
  // resolution outcomes or stack another recap.
  const morningResolved = thread.some(it =>
    it.kind === "agent" &&
    (it.text || "").startsWith("i'll bring you the next thing")
  );

  const withUserTurnAndStream = useCallback((inner) => (c) => {
    // After the recap, every chip is dead — belt-and-suspenders against
    // any superseded prop the JSX missed.
    if (morningResolved) return;
    if (c === null) { inner(c); return; }
    if (c.custom) { inner(c); return; }
    appendUserChip(c.label);
    afterStream(() => inner(c));
  }, [appendUserChip, afterStream, morningResolved]);

  const onAsk = useCallback((text, refKey) => {
    const uid = `u-${Date.now()}`;
    const aid = `a-${Date.now()}`;
    setThread(t => [...t, { id: uid, kind: "user", text, replyTo: refKey || null }]);

    if (refKey === "card1" || refKey === "card2") {
      const customLine = `logged "${text}". i'll work on it and bring you the answer when it's ready.`;
      // Already mid-conversation? Then everything goes to the thread.
      // Don't mutate the standalone card state — its resolution lives
      // entirely below, and the original card stays as superseded
      // context above.
      const inThreadMode = thread.length > 0;
      const card2Extras = { cardProps: card2CardProps, chipsTarget: "card2" };
      const resolveCard = () => {
        if (!inThreadMode) {
          if (refKey === "card1") {
            setC1({ tone: "muted", line: customLine });
            setC1Done(true);
          } else {
            setC2({ tone: "muted", line: customLine });
            setC2Done(true);
          }
        }
        appendAgentToThread(customLine);
        if (refKey === "card1") {
          const d = customLine.length * 8 + 500;
          setTimeout(() => {
            appendAgentToThread(
              "and a smaller pattern question — feels like a billing mistake on their end.",
              card2Extras
            );
          }, d);
        }
      };
      afterStream(resolveCard);
      setComposerRef(null);
      return;
    }

    setThread(t => [...t, { id: aid, kind: "agent", text: "thinking…", thinking: true }]);
    const reply = PROMPT_REPLIES[text]
      || (QUICK_ACTIONS.find(qa => qa.label === text) || {}).reply
      || "logged. i'll work on this and bring you the answer when it's ready.";
    afterStream(() => {
      setTimeout(() => {
        setThread(t => t.map(item => item.id === aid ? { ...item, text: reply, thinking: false } : item));
      }, 600);
    });
    const replyTypeMs = 600 + reply.length * 8 + 600;
    setTimeout(() => {
      setThread(t => {
        const last = [...t].reverse().find(it => it.kind === "agent" && !it.thinking);
        if (last && last.reaskFor) return t;
        const threadCard = [...t].reverse().find(it => it.kind === "agent" && it.cardProps);
        if (threadCard) {
          const idx = t.indexOf(threadCard);
          const after = t.slice(idx + 1);
          const ANSWERED_PREFIXES = ["batch sent", "holding for a week", "opened in patterns", "logged \""];
          const answered = after.some(it => it.kind === "agent" && ANSWERED_PREFIXES.some(p => (it.text || "").startsWith(p)));
          if (!answered) {
            const rid = `r-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
            return [...t, {
              id: rid, kind: "agent",
              reaskFor: "card2",
              text: "anyway — still on you for the 11 reclassifications.",
              chips: c2Chips,
              contextLabel: collapsed.contextLabel,
            }];
          }
          return t;
        }
        const reaskFor = !c1 ? "card1" : (!c2 ? "card2" : null);
        if (!reaskFor) return t;
        const rid = `r-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
        const reaskText = reaskFor === "card1"
          ? "anyway — still on you for the fedex denial."
          : "anyway — still on you for the 11 reclassifications.";
        const reaskChips = reaskFor === "card1" ? c1Chips : c2Chips;
        const ctxLabel = reaskFor === "card1" ? expanded.contextLabel : collapsed.contextLabel;
        return [...t, {
          id: rid, kind: "agent",
          reaskFor,
          text: reaskText,
          chips: reaskChips,
          contextLabel: ctxLabel,
        }];
      });
    }, replyTypeMs);
  }, [setView, c1, c2, c1Chips, c2Chips, afterStream, collapsed, expanded, card2CardProps]);

  const bothResolved = c1 && c2;

  const card1Superseded = !c1 && thread.some(it => it.kind === "agent" && it.reaskFor === "card1");
  const card2Superseded = !c2 && thread.some(it => it.kind === "agent" && it.reaskFor === "card2");

  const recoveredFrozen = useRef(null);
  if (recoveredFrozen.current === null && (c1 || c2)) {
    recoveredFrozen.current = recovered;
  }
  const recoveredForRecap = recoveredFrozen.current ?? recovered;
  const SETTLED_LINE = "that's everything you need to call. here's the rest.";
  const RECOVERED_LINE = `you've reclaimed $${fmt$(recoveredForRecap)} across 14 sealed claims this month — oct 1 to oct 28.`;

  useEffect(() => {
    if (!bothResolved || !c2Done) return;
    const t1 = setTimeout(() => setSettledLineDone(true), 200 + SETTLED_LINE.length * 8 + 250);
    return () => clearTimeout(t1);
  }, [bothResolved, c2Done]);
  useEffect(() => {
    if (!settledLineDone) return;
    const t = setTimeout(() => setRecoveredLineDone(true), 200 + RECOVERED_LINE.length * 8 + 250);
    return () => clearTimeout(t);
  }, [settledLineDone, RECOVERED_LINE.length]);

  const lastThreadAgent = [...thread].reverse().find(it => it.kind === "agent");
  let currentKey;
  if (lastThreadAgent) currentKey = `thread:${lastThreadAgent.id}`;
  else if (bothResolved) currentKey = "next-thing";
  else if (c1 && !c2) currentKey = "card2";
  else if (c1 && c2) currentKey = "settled-line";
  else currentKey = "card1";

  return (
    <ActiveInputCtx.Provider value={activeInputCtxValue}>
    <div style={{
      display: "flex", flex: 1, minHeight: 0, width: "100%",
      maxWidth: 1440, margin: "0 auto", position: "relative",
      height: "100%", overflow: "hidden",
    }}>
      <div ref={scrollRef} style={{
        display: "flex", flexDirection: "column", flex: 1, minWidth: 0,
        padding: "56px 48px 0", gap: 28, maxWidth: 760, margin: "0 auto",
        width: "100%",
        overflowY: "auto",
        height: "100%",
      }} className="k-scroll">
        <AgentLine>
          <Typewriter text="two things to clear this morning. the bigger one first." speed={8} />
        </AgentLine>

        <CardMessage
          label={expanded.label}
          typed
          startDelay={1250}
          headlineHtml={expanded.headlineHtml}
          bodyHtml={expanded.bodyHtml}
          lean={expanded.lean}
          chips={c1Chips}
          resolved={c1}
          superseded={card1Superseded || morningResolved}
          cardKey="card1"
          contextLabel={expanded.contextLabel}
          isCurrent={currentKey === "card1"}
          onTyped={() => setCard1Typed(true)}
          onCustom={() => focusComposerForCard("card1")}
          onPick={withUserTurnAndStream((c) => {
            if (c === null) { setC1(null); setC1Done(false); setCard1Typed(true); return; }
            if (thread.length > 0) {
              appendAgentToThread(c.outcome.line);
              const tdelay = c.outcome.line.length * RESOLVED_SPEED + 500;
              setTimeout(() => {
                appendAgentToThread(
                  "and a smaller pattern question — feels like a billing mistake on their end.",
                  { cardProps: card2CardProps, chipsTarget: "card2" }
                );
              }, tdelay);
              if (c.then) c.then();
              return;
            }
            setC1(c.outcome);
            const ms = c.outcome.line.length * RESOLVED_SPEED + RESOLVED_GAP;
            setTimeout(() => setC1Done(true), ms);
            if (c.custom) {
              setTimeout(() => {
                appendAgentToThread(
                  "and a smaller pattern question — feels like a billing mistake on their end.",
                  { cardProps: card2CardProps, chipsTarget: "card2" }
                );
              }, ms + 200);
            }
            if (c.then) c.then();
          })}
        />

        {c1 && c1Done && thread.length === 0 && (
          <AgentLine>
            <Typewriter text="and a smaller pattern question — feels like a billing mistake on their end." speed={8} delay={200} />
          </AgentLine>
        )}

        {c1 && c1Done && thread.length === 0 && (
          <CardMessage
            label={collapsed.label}
            typed
            startDelay={1700}
            headlineHtml={collapsed.headlineHtml}
            bodyHtml={collapsed.bodyHtml}
            lean={collapsed.lean}
            chips={c2Chips}
            resolved={c2}
            superseded={card2Superseded || morningResolved}
            cardKey="card2"
            contextLabel={collapsed.contextLabel}
            isCurrent={currentKey === "card2"}
            onTyped={() => setCard2Typed(true)}
            onCustom={() => focusComposerForCard("card2")}
            onPick={withUserTurnAndStream((c) => {
              if (c === null) { setC2(null); setC2Done(false); return; }
              if (thread.length > 0) {
                appendAgentToThread(c.outcome.line);
                if (c.then) c.then();
                return;
              }
              setC2(c.outcome);
              const ms = c.outcome.line.length * RESOLVED_SPEED + RESOLVED_GAP;
              setTimeout(() => setC2Done(true), ms);
              if (c.then) c.then();
            })}
          />
        )}

        {bothResolved && c2Done && (
          <AgentLine isCurrent={currentKey === "settled-line"}>
            <Typewriter text={SETTLED_LINE} speed={8} delay={200} />
          </AgentLine>
        )}

        {bothResolved && settledLineDone && (
          <AgentLine>
            <RichTypewriter
              html={`you've reclaimed <span style="color:${C.amber};font-variant-numeric:tabular-nums">$${fmt$(recovered)}</span> across 14 sealed claims this month — oct 1 to oct 28.`}
              speed={8}
              delay={200}
            />
          </AgentLine>
        )}

        {bothResolved && recoveredLineDone && (
          <div className="k-fade-in" style={{ paddingLeft: 14 }}>
            <button onClick={() => setShowLedger(s => !s)} className="k-mono" style={{
              background: "transparent", border: "none", color: C.textSec,
              fontSize: 11.5, letterSpacing: 0.01, cursor: "pointer",
              padding: 0, textDecoration: "underline", textDecorationColor: C.border,
              fontFamily: "'Geist Mono', ui-monospace, monospace",
            }}>
              {showLedger ? "hide the ledger ↑" : "show me the ledger →"}
            </button>
            {showLedger && (
              <div className="k-fade-in k-mono" style={{
                marginTop: 12, display: "grid", gridTemplateColumns: "auto 1fr auto", rowGap: 6, columnGap: 14,
                fontSize: 11, color: C.textSec, maxWidth: 520,
              }}>
                <span style={{ color: C.amber, fontVariantNumeric: "tabular-nums" }}>+$487.00</span>
                <span>ups · #VB-44102 · today 11:47a</span>
                <span style={{ color: C.textMuted }}>↘ counted</span>
                <span style={{ color: C.amber, fontVariantNumeric: "tabular-nums" }}>+$1,232.00</span>
                <span>fedex · #VB-43509 · oct 14</span>
                <span style={{ color: C.textMuted }}>↘ counted</span>
                <span style={{ color: C.amber, fontVariantNumeric: "tabular-nums" }}>+$214.00</span>
                <span>ups · #VB-43881 · yesterday</span>
                <span style={{ color: C.textMuted }}>↘ counted</span>
                <span style={{ color: C.mint, fontVariantNumeric: "tabular-nums" }}>+$12.47</span>
                <span>ups · #VB-43998 · filing now</span>
                <span style={{ color: C.mint }}>⏳ pending</span>
              </div>
            )}
          </div>
        )}

        {bothResolved && recoveredLineDone && (
          <AgentLine isCurrent={currentKey === "next-thing"}>
            <Typewriter text="i'll bring you the next thing when it's ready." speed={8} delay={200} />
          </AgentLine>
        )}

        {thread.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
            {thread.map(item => item.kind === "user"
              ? <UserLine key={item.id}>{item.text}</UserLine>
              : (
                <AgentLine key={item.id} isCurrent={currentKey === `thread:${item.id}`}>
                  {item.thinking
                    ? <span style={{ color: C.textMuted }}><span className="k-blink">●</span> thinking…</span>
                    : <Typewriter
                        text={item.text}
                        speed={8}
                        delay={120}
                        onDone={() => markStreamingDone(item.id)}
                      />}
                  {item.cardProps && (() => {
                    const textLen = (item.text || "").length;
                    const cardStart = 120 + textLen * 8 + 350;
                    return (
                      <div style={{ marginTop: 14 }}>
                        <CardMessage
                          {...item.cardProps}
                          typed
                          startDelay={cardStart}
                          isCurrent={false}
                          nested
                          cardKey={item.id}
                          contextLabel={item.chipsTarget === "card2" ? collapsed.contextLabel : undefined}
                          resolved={item.chipsTarget === "card2" ? c2 : undefined}
                          superseded={item.chipsTarget === "card2" ? (card2Superseded || morningResolved) : false}
                          onTyped={() => setCard2Typed(true)}
                          onCustom={() => focusComposerForCard("card2")}
                          onPick={withUserTurnAndStream((c) => {
                            if (item.chipsTarget === "card2") {
                              if (c === null) { setC2(null); setC2Done(false); return; }
                              setC2(c.outcome);
                              setC2Done(true);
                              appendAgentToThread(c.outcome.line);
                              const d1 = c.outcome.line.length * RESOLVED_SPEED + 500;
                              setTimeout(() => {
                                appendAgentToThread(SETTLED_LINE);
                              }, d1);
                              const d2 = d1 + SETTLED_LINE.length * 8 + 500;
                              setTimeout(() => {
                                appendAgentToThread(RECOVERED_LINE);
                              }, d2);
                              const d3 = d2 + RECOVERED_LINE.length * 8 + 500;
                              setTimeout(() => {
                                appendAgentToThread("i'll bring you the next thing when it's ready.");
                              }, d3);
                              if (c.then) c.then();
                            }
                          })}
                        />
                      </div>
                    );
                  })()}
                  {item.reaskFor && (() => {
                    // Already answered → collapse to the same muted
                    // "you picked" treatment used by resolved cards.
                    if (item.pickedLabel) {
                      return (
                        <div style={{ marginTop: 4 }}>
                          <PickedLine chips={item.chips} pickedLabel={item.pickedLabel} />
                        </div>
                      );
                    }
                    const textLen = (item.text || "").length;
                    const chipsStart = 120 + textLen * 8 + 280;
                    return (
                      <DelayedReveal ms={chipsStart}>
                        <InlineActions
                          chips={item.chips}
                          cardKey={item.id}
                          contextLabel={item.contextLabel}
                          superseded={morningResolved}
                          onCustom={() => focusComposerForCard(item.reaskFor)}
                          onPick={withUserTurnAndStream((c) => {
                            // Stamp the pick onto the thread item so
                            // the chip row collapses on next render.
                            setThread(t => t.map(it =>
                              it.id === item.id ? { ...it, pickedLabel: c.label } : it
                            ));
                            if (item.reaskFor === "card1") {
                              setC1(c.outcome);
                              setC1Done(true);
                              appendAgentToThread(c.outcome.line);
                              if (!c.custom) {
                                const delay = c.outcome.line.length * RESOLVED_SPEED + 500;
                                setTimeout(() => {
                                  appendAgentToThread(
                                    "and a smaller pattern question — feels like a billing mistake on their end.",
                                    { cardProps: card2CardProps, chipsTarget: "card2" }
                                  );
                                }, delay);
                              }
                              if (c.then) c.then();
                            } else if (item.reaskFor === "card2") {
                              setC2(c.outcome);
                              setC2Done(true);
                              appendAgentToThread(c.outcome.line);
                              if (!c.custom) {
                                const d1 = c.outcome.line.length * RESOLVED_SPEED + 500;
                                setTimeout(() => {
                                  appendAgentToThread(SETTLED_LINE);
                                }, d1);
                                const d2 = d1 + SETTLED_LINE.length * 8 + 500;
                                setTimeout(() => {
                                  appendAgentToThread(RECOVERED_LINE);
                                }, d2);
                                const d3 = d2 + RECOVERED_LINE.length * 8 + 500;
                                setTimeout(() => {
                                  appendAgentToThread("i'll bring you the next thing when it's ready.");
                                }, d3);
                              }
                              if (c.then) c.then();
                            }
                          })}
                        />
                      </DelayedReveal>
                    );
                  })()}
                </AgentLine>
              )
            )}
          </div>
        )}

        <div aria-hidden style={{ height: 24 }} />

        <div style={{
          position: "sticky", bottom: 0, marginTop: "auto",
          paddingTop: 32, paddingBottom: 24,
          background: `linear-gradient(to bottom, transparent, ${C.bg} 28%, ${C.bg} 100%)`,
        }}>
          <AskKlemr onSend={onAsk} referenceChip={composerRef} onDismissReference={dismissComposerRef} focusSignal={composerFocusN} prompts={(() => {
            if (thread.length === 0) {
              if (!c1 && card1Typed) return PROMPTS_CARD1;
              if (c1 && c1Done && !c2 && card2Typed) return PROMPTS_CARD2;
              if (bothResolved && recoveredLineDone) return PROMPTS_RECAP;
              return null;
            }
            const latestCardItem = [...thread].reverse().find(it => it.kind === "agent" && it.cardProps);
            if (latestCardItem) {
              const idx = thread.indexOf(latestCardItem);
              const afterCard = thread.slice(idx + 1);
              if (afterCard.some(it => it.text === "i'll bring you the next thing when it's ready.")) {
                return PROMPTS_RECAP;
              }
              if (afterCard.length === 0 && card2Typed) {
                return PROMPTS_CARD2;
              }
              return null;
            }
            const recapInThread = thread.some(
              it => it.kind === "agent" &&
              (it.text || "").startsWith("i'll bring you the next thing")
            );
            if (recapInThread) return PROMPTS_RECAP;
            return null;
          })()} />
        </div>
      </div>

      <ActingOnRail logEntries={logEntries} openDossier={openDossier} setView={setView} />
    </div>
    </ActiveInputCtx.Provider>
  );
}

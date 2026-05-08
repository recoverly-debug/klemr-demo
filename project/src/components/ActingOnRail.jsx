import { memo, useState, useEffect } from "react";
import { C } from "../tokens.js";
import { STAGE_BY_KEY } from "../data.js";

function relTime(createdAt, nowMs) {
  const sec = Math.max(0, Math.floor((nowMs - createdAt) / 1000));
  if (sec < 45) return "now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  return `${Math.round(hr / 24)}d`;
}

function absTime(createdAt) {
  const d = new Date(createdAt);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")}${ampm}`;
}

const RIGHT_NOW = [
  "right now: cross-checking noaa data on #VB-44156",
  "right now: pulling tracking pings on the fedex one",
  "right now: watching invoice clear on #VB-44102",
  "right now: matching invoice line for the duplicate surcharge",
  "right now: re-reading the dim weight denial language",
];

function RightNowLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % RIGHT_NOW.length), 25000);
    return () => clearInterval(t);
  }, []);
  return (
    <div key={i} className="k-mono k-fade-in k-pulse" style={{
      fontSize: 11, color: C.mint, letterSpacing: "0.02em",
      marginBottom: 18, lineHeight: 1.4,
    }}>
      {RIGHT_NOW[i]}
    </div>
  );
}

const FeedRow = memo(function FeedRow({ entry, isNewest, nowMs, onOpen }) {
  const stage = entry.stage ? STAGE_BY_KEY[entry.stage] : null;
  const dotColor = stage ? stage.color : C.textMuted;
  const clickable = /#VB-\d+/.test(entry.text);

  const [faded, setFaded] = useState(false);
  useEffect(() => {
    if (!isNewest) return;
    setFaded(false);
    const t = setTimeout(() => setFaded(true), 50);
    return () => clearTimeout(t);
  }, [isNewest, entry.id]);

  return (
    <div
      className={`k-feed-row k-slide-in ${isNewest ? "is-active" : ""} ${faded ? "is-faded" : ""}`}
      onClick={clickable ? onOpen : undefined}
      style={{
        cursor: clickable ? "pointer" : "default",
        display: "grid", gridTemplateColumns: "14px 36px 1fr",
        gap: 10, alignItems: "flex-start",
        marginBottom: 4,
      }}
    >
      <div
        className={`k-feed-dot ${isNewest ? "k-feed-dot-pulse" : ""}`}
        style={{ background: dotColor, color: dotColor }}
      />
      <div
        className={`k-mono ${isNewest ? "k-flash" : ""}`}
        title={absTime(entry.createdAt)}
        style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.02em", paddingTop: 5, fontVariantNumeric: "tabular-nums" }}
      >
        {relTime(entry.createdAt, nowMs)}
      </div>
      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55, fontFamily: "'Geist', system-ui, sans-serif" }}>
        {entry.text}
      </div>
    </div>
  );
}, (prev, next) => prev.entry.id === next.entry.id && prev.isNewest === next.isNewest && prev.nowMs === next.nowMs);

export const ActingOnRail = memo(function ActingOnRail({ logEntries, openDossier, setView }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const visible = logEntries.slice(0, 12);
  const newest = visible[0];
  const newestAge = newest ? Math.max(0, Math.floor((nowMs - newest.createdAt) / 1000)) : 0;
  const lastUpdateLabel =
    !newest ? "—" :
    newestAge < 5 ? "just now" :
    newestAge < 60 ? `${newestAge}s ago` :
    newestAge < 3600 ? `${Math.floor(newestAge / 60)}m ago` :
    `${Math.floor(newestAge / 3600)}h ago`;

  const extractShip = (text) => {
    const m = text.match(/#VB-\d+/);
    return m ? m[0].replace("#", "").toLowerCase() : null;
  };

  return (
    <aside className="k-scroll" style={{
      width: 340, flexShrink: 0,
      borderLeft: `1px solid ${C.border}`,
      background: C.bg,
      display: "flex", flexDirection: "column",
      alignSelf: "stretch",
      padding: "56px 24px 64px",
      overflowY: "auto",
      height: "100%",
    }}>
      <RightNowLine />

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map((entry, i) => (
          <FeedRow
            key={entry.id}
            entry={entry}
            isNewest={i === 0}
            nowMs={nowMs}
            onOpen={() => {
              const ship = extractShip(entry.text);
              if (ship && openDossier) openDossier(ship);
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 18, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="k-mono" style={{ fontSize: 10.5, color: C.textMuted, letterSpacing: "0.04em" }}>
          1,247 shipments · last update {lastUpdateLabel}
        </div>
        <div className="k-mono" style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.02em" }}>
          showing the last 2 hours
          {setView && (
            <>
              <span style={{ padding: "0 6px", color: C.textMuted, opacity: 0.6 }}>·</span>
              <button
                type="button"
                onClick={() => setView("filings")}
                className="k-mono"
                style={{
                  background: "transparent", border: "none", padding: 0,
                  color: C.textSec, fontSize: 11, letterSpacing: "0.02em",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: C.border,
                  textUnderlineOffset: 3,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.textDecorationColor = C.textMuted; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textSec; e.currentTarget.style.textDecorationColor = C.border; }}
              >
                see all filings →
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
});

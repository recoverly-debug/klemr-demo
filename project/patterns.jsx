// Pattern Inbox — agent-detected billing patterns across the merchant's history
(function() {
const C = window.KLEMR.C;
const { KlemrSeal, HandNote, Watermark } = window;

const PATTERNS_INIT = [
  {
    id: "p1",
    title: "ups dim weight on tuesday outbound",
    severity: "high",
    detail: "every tuesday batch out of dock 2 is being billed at +73% dim weight average. dossier weights match invoices on every other day.",
    affected: 47,
    estimated: 1832.40,
    confidence: 96,
    age: "noticed 2 days ago",
    note: "tuesday morning shift uses different scale. recalibrate or we keep filing.",
    state: "actionable",
  },
  {
    id: "p2",
    title: "fedex residential surcharge on commercial",
    severity: "med",
    detail: "11 commercial-zoned addresses are getting hit with residential surcharges. address verification missing on these.",
    affected: 11,
    estimated: 47.30,
    confidence: 88,
    age: "noticed today",
    note: "small but recurring. easy fix in shipstation address rules.",
    state: "actionable",
  },
  {
    id: "p3",
    title: "ups zone-7 billing on zone-5 routes",
    severity: "med",
    detail: "7 packages in the last 30 days billed at zone 7 when our manifest + gps confirms zone 5. credit per package ~$4.18.",
    affected: 7,
    estimated: 29.26,
    confidence: 99,
    age: "filed yesterday",
    note: "filed batch dispute. waiting on ups response.",
    state: "filed",
  },
  {
    id: "p4",
    title: "fedex late-delivery streak",
    severity: "high",
    detail: "8 fedex express shipments missed guaranteed delivery in the last 30 days. all eligible for money-back guarantee.",
    affected: 8,
    estimated: 487.32,
    confidence: 100,
    age: "won this week",
    note: "money-back guarantee — they paid up.",
    state: "reclaimed",
  },
  {
    id: "p5",
    title: "duplicate fuel surcharge ups",
    severity: "low",
    detail: "fuel surcharge appearing twice on 3 invoices. once at base, once as adjustment.",
    affected: 3,
    estimated: 18.90,
    confidence: 100,
    age: "noticed yesterday",
    note: "obvious one. filing tomorrow morning.",
    state: "actionable",
  },
];

const SEV = {
  high: { color: C.red, label: "high impact" },
  med:  { color: C.amber, label: "medium" },
  low:  { color: C.textSec, label: "small but adds up" },
};

const STATE_BADGE = {
  actionable: { color: C.mint, label: "actionable", desc: "ready to file" },
  filed:      { color: C.blue, label: "filed", desc: "waiting on carrier" },
  reclaimed:  { color: C.amber, label: "reclaimed", desc: "money back" },
};

function PatternInbox() {
  const [patterns, setPatterns] = React.useState(PATTERNS_INIT);
  const [selected, setSelected] = React.useState("p1");
  const [filter, setFilter] = React.useState("all");

  const filtered = filter === "all" ? patterns : patterns.filter((p) => p.state === filter);
  const sel = patterns.find((p) => p.id === selected) || patterns[0];

  const totalActionable = patterns.filter((p) => p.state === "actionable").reduce((s, p) => s + p.estimated, 0);
  const totalFiled = patterns.filter((p) => p.state === "filed").reduce((s, p) => s + p.estimated, 0);
  const totalRecovered = patterns.filter((p) => p.state === "reclaimed").reduce((s, p) => s + p.estimated, 0);

  const fileNow = (id) => {
    setPatterns((ps) => ps.map((p) => p.id === id ? { ...p, state: "filed", age: "filed just now", note: "filed. carriers reply 3-7 business days." } : p));
  };

  return (
    <div className="k-body" style={{
      width: 1100, height: 720,
      background: C.bg, color: C.text,
      borderRadius: 14, overflow: "hidden",
      position: "relative", display: "grid", gridTemplateRows: "auto 1fr",
    }}>
      <Watermark />

      {/* Header */}
      <div style={{
        padding: "20px 32px", borderBottom: `1px solid ${C.border}`,
        background: C.bgElevated, position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <KlemrSeal size={28} color={C.amber} />
          <div>
            <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              pattern inbox · agent-detected
            </div>
            <div className="k-display" style={{ fontSize: 22, color: C.text, lineHeight: 1.05, marginTop: 2 }}>
              the agent sees what you don't.
            </div>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 18 }}>
          <SummaryStat label="actionable" value={`$${window.KLEMR.fmt$(totalActionable)}`} color={C.mint} />
          <SummaryStat label="in flight" value={`$${window.KLEMR.fmt$(totalFiled)}`} color={C.blue} />
          <SummaryStat label="reclaimed" value={`$${window.KLEMR.fmt$(totalRecovered)}`} color={C.amber} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", overflow: "hidden", position: "relative", zIndex: 2 }}>
        {/* Pattern list */}
        <div style={{ borderRight: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* Filter strip */}
          <div className="flex items-center" style={{
            padding: "12px 24px", gap: 6, borderBottom: `1px solid ${C.border}`, background: C.bg,
          }}>
            {[
              { k: "all", l: "all" },
              { k: "actionable", l: "actionable" },
              { k: "filed", l: "in flight" },
              { k: "reclaimed", l: "reclaimed" },
            ].map((f) => (
              <button key={f.k} onClick={() => setFilter(f.k)} className="k-mono" style={{
                fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "5px 10px", borderRadius: 5, cursor: "pointer", border: "none",
                background: filter === f.k ? C.amber : "transparent",
                color: filter === f.k ? C.bg : C.textSec,
                fontWeight: 600, transition: "all .15s",
              }}>
                {f.l}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>{filtered.length} pattern{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="k-stream" style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {filtered.map((p) => {
              const active = p.id === selected;
              const badge = STATE_BADGE[p.state];
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{
                  width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                  background: active ? "rgba(247,185,85,0.05)" : "transparent",
                  borderLeft: `2px solid ${active ? C.amber : "transparent"}`,
                  padding: "14px 24px",
                  display: "flex", flexDirection: "column", gap: 8,
                  transition: "background .15s",
                }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: SEV[p.severity].color }} />
                    <span className="k-mono" style={{ fontSize: 9, color: badge.color, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                      {badge.label}
                    </span>
                    <span className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.08em" }}>
                      · {p.age}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: active ? C.text : C.textSec, fontWeight: 500, lineHeight: 1.3 }}>
                    {p.title}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>
                      {p.affected} shipments
                    </span>
                    <span className="k-display" style={{ fontSize: 18, color: p.state === "reclaimed" ? C.amber : C.text }}>
                      {p.state === "reclaimed" ? "+" : ""}${window.KLEMR.fmt$(p.estimated)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="k-stream" style={{ overflowY: "auto", padding: "28px 32px", background: C.bgElevated }}>
          <PatternDetail pattern={sel} onFile={() => fileNow(sel.id)} />
        </div>
      </div>
    </div>
  );
}

function PatternDetail({ pattern: p, onFile }) {
  if (!p) return null;
  const sev = SEV[p.severity];
  const badge = STATE_BADGE[p.state];

  return (
    <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
          <div style={{
            padding: "5px 12px", borderRadius: 4,
            background: `${badge.color}1A`, border: `1px solid ${badge.color}50`,
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: badge.color }} />
            <span className="k-mono" style={{ fontSize: 10, color: badge.color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              {badge.label}
            </span>
          </div>
          <span className="k-mono" style={{ fontSize: 10, color: sev.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {sev.label}
          </span>
        </div>
        <h2 className="k-display" style={{ fontSize: 32, color: C.text, lineHeight: 1.1, margin: 0, marginBottom: 10 }}>
          {p.title}
        </h2>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, margin: 0 }}>
          {p.detail}
        </p>
      </div>

      {/* Numbers row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <NumStat label="affected shipments" value={p.affected} />
        <NumStat label="estimated $" value={`$${window.KLEMR.fmt$(p.estimated)}`} accent={C.amber} />
        <NumStat label="confidence" value={`${p.confidence}%`} />
      </div>

      {/* Mini visualization — affected over time */}
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: "16px 18px",
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            occurrences · last 30 days
          </span>
          <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>{p.affected} hits</span>
        </div>
        <Sparkline severity={p.severity} count={p.affected} />
      </div>

      {/* Agent's note */}
      <div style={{
        padding: "16px 18px",
        background: "rgba(247,185,85,0.04)",
        border: `1px dashed rgba(247,185,85,0.3)`,
        borderRadius: 10,
      }}>
        <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
          agent's note
        </div>
        <HandNote color={C.amberInk} rotate={-1} size={20} delay={0.2} style={{ display: "block", whiteSpace: "normal", lineHeight: 1.3 }}>
          {p.note}
        </HandNote>
      </div>

      {/* Actions */}
      <div className="flex items-center" style={{ gap: 10, marginTop: 4 }}>
        {p.state === "actionable" && (
          <>
            <button className="k-btn k-btn-primary" onClick={onFile}>
              file batch dispute · ${window.KLEMR.fmt$(p.estimated)}
            </button>
            <button className="k-btn k-btn-ghost">view all {p.affected} dossiers</button>
          </>
        )}
        {p.state === "filed" && (
          <>
            <button className="k-btn k-btn-ghost" disabled>filed — awaiting response</button>
            <button className="k-btn k-btn-ghost">view filing receipt</button>
          </>
        )}
        {p.state === "reclaimed" && (
          <button className="k-btn k-btn-ghost">view recovery breakdown</button>
        )}
      </div>
    </div>
  );
}

function Sparkline({ severity, count }) {
  // Deterministic-ish bars
  const bars = React.useMemo(() => {
    const seed = count + (severity === "high" ? 7 : severity === "med" ? 3 : 1);
    return Array.from({ length: 30 }, (_, i) => {
      const v = Math.abs(Math.sin(i * 1.7 + seed)) * 0.65 + Math.abs(Math.cos(i * 0.7 + seed)) * 0.35;
      return v;
    });
  }, [severity, count]);
  const color = severity === "high" ? C.red : severity === "med" ? C.amber : C.textSec;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
      {bars.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${Math.max(8, v * 100)}%`,
          background: v > 0.7 ? color : C.border,
          borderRadius: 2, transition: "all .3s",
          opacity: v > 0.7 ? 1 : 0.55,
        }} />
      ))}
    </div>
  );
}

function NumStat({ label, value, accent }) {
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "14px 16px",
    }}>
      <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </div>
      <div className="k-display" style={{ fontSize: 26, color: accent || C.text, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1.15 }}>
      <span className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase" }}>{label}</span>
      <span className="k-display" style={{ fontSize: 18, color, marginTop: 2 }}>{value}</span>
    </div>
  );
}

window.PatternInbox = PatternInbox;
})();

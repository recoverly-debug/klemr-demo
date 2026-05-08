// Dispute Timeline — animated dossier vs carrier invoice walkthrough
(function() {
const C = window.KLEMR.C;
const { KlemrSeal, KIcon, HandNote, Watermark } = window;

const TIMELINE_STEPS = [
  { id: 0, t: "+0:00", actor: "warehouse", title: "label printed", body: "manifest captured · 12×10×8 · 2.3 lb · zone 5", tone: "watch" },
  { id: 1, t: "+0:02", actor: "agent", title: "dossier opened", body: "#VB-44102 · evidence collection started", tone: "watch" },
  { id: 2, t: "+0:14", actor: "warehouse", title: "package photo", body: "snapped at packing station · sealed in dossier", tone: "watch" },
  { id: 3, t: "+2:33", actor: "ups", title: "departure scan", body: "picked up at 11:47a · zone 5 confirmed by gps", tone: "watch" },
  { id: 4, t: "+2:33", actor: "agent", title: "dossier sealed", body: "all evidence locked. immutable from here.", tone: "lock" },
  { id: 5, t: "+38h",  actor: "ups",   title: "ups invoice arrives", body: "billed: 4.0 lb dim · zone 5 · $24.18", tone: "issue" },
  { id: 6, t: "+38h",  actor: "agent", title: "discrepancy caught", body: "invoice 4.0 lb · dossier 2.3 lb · Δ 1.7 lb · $12.47 owed back", tone: "issue" },
  { id: 7, t: "+38h",  actor: "agent", title: "dispute filed", body: "auto-submitted to ups capital with full dossier · ref #DR-22847", tone: "filed" },
  { id: 8, t: "+5d",   actor: "ups",   title: "credit posted", body: "ups confirmed: $12.47 returned to account", tone: "won" },
  { id: 9, t: "+5d",   actor: "agent", title: "reclaimed", body: "dossier closed. money back. another one for the file.", tone: "won" },
];

const TONE = {
  watch:  { color: C.mint, label: "watching" },
  lock:   { color: C.amber, label: "sealed" },
  issue:  { color: C.red, label: "caught" },
  filed:  { color: C.blue, label: "filed" },
  won:    { color: C.amber, label: "reclaimed" },
};

const ACTORS = {
  warehouse: { label: "warehouse", color: C.textSec, icon: "📦" },
  agent: { label: "klemr agent", color: C.amber, icon: "★" },
  ups: { label: "ups", color: C.violet, icon: "🚚" },
};

function DisputeTimeline() {
  const [cursor, setCursor] = React.useState(2);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    if (cursor >= TIMELINE_STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setCursor((c) => c + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, cursor]);

  const reset = () => { setCursor(0); setPlaying(true); };
  const step = TIMELINE_STEPS[cursor];

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
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: C.bgElevated, position: "relative", zIndex: 2,
      }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <KlemrSeal size={28} color={C.amber} />
          <div>
            <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              dossier · #VB-44102 · ups
            </div>
            <div className="k-display" style={{ fontSize: 22, color: C.text, lineHeight: 1.05, marginTop: 2 }}>
              the dispute, end-to-end
            </div>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: 10 }}>
          <button className="k-btn k-btn-ghost" onClick={reset}>↻ replay</button>
          <button className="k-btn k-btn-primary" onClick={() => setPlaying((p) => !p)}>
            {playing ? "❚❚ pause" : "▶ play"}
          </button>
        </div>
      </div>

      {/* Body — split: left timeline, right evidence panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", overflow: "hidden", position: "relative", zIndex: 2 }}>
        {/* Timeline rail */}
        <div style={{
          padding: "28px 36px", overflowY: "auto",
          borderRight: `1px solid ${C.border}`,
          background: C.bg,
        }} className="k-stream">
          <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>
            timeline · t = ship time
          </div>

          <div style={{ position: "relative", paddingLeft: 26 }}>
            {/* spine */}
            <div style={{ position: "absolute", left: 7, top: 6, bottom: 6, width: 1, background: C.border }} />
            <div style={{
              position: "absolute", left: 7, top: 6, width: 1,
              height: `${(cursor / (TIMELINE_STEPS.length - 1)) * 100}%`,
              background: `linear-gradient(180deg, ${C.amberDim}, ${C.amber})`,
              transition: "height 0.5s ease",
            }} />

            {TIMELINE_STEPS.map((s, i) => {
              const tone = TONE[s.tone];
              const actor = ACTORS[s.actor];
              const active = i === cursor;
              const past = i < cursor;
              const future = i > cursor;
              return (
                <div key={i} onClick={() => { setCursor(i); setPlaying(false); }} style={{
                  position: "relative", paddingBottom: 18, cursor: "pointer",
                  opacity: future ? 0.32 : 1, transition: "opacity .3s",
                }}>
                  <div style={{
                    position: "absolute", left: -26, top: 4,
                    width: 15, height: 15, borderRadius: 999,
                    background: past || active ? tone.color : C.bg,
                    border: `1.5px solid ${past || active ? tone.color : C.border}`,
                    boxShadow: active ? `0 0 12px ${tone.color}` : "none",
                    transition: "all .3s",
                  }} className={active ? "k-pulse" : ""} />
                  <div className="flex items-center" style={{ gap: 10, marginBottom: 4 }}>
                    <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>{s.t}</span>
                    <span className="k-mono" style={{
                      fontSize: 9, color: actor.color, letterSpacing: "0.12em", textTransform: "uppercase",
                      background: `${actor.color}15`, padding: "2px 7px", borderRadius: 4,
                    }}>{actor.label}</span>
                    <span className="k-mono" style={{ fontSize: 9, color: tone.color, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
                      · {tone.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: active ? C.text : C.textSec, fontWeight: active ? 500 : 400, marginBottom: 3 }}>
                    {s.title}
                  </div>
                  <div className="k-mono" style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>
                    {s.body}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence panel — context-sensitive */}
        <EvidencePanel cursor={cursor} step={step} />
      </div>
    </div>
  );
}

function EvidencePanel({ cursor, step }) {
  return (
    <div style={{
      padding: "28px 32px", overflow: "auto", background: C.bgElevated,
      display: "flex", flexDirection: "column", gap: 18,
    }} className="k-stream">
      <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase" }}>
        the dossier
      </div>

      {/* Always-visible package card */}
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: 16, position: "relative",
        boxShadow: cursor >= 4 ? `inset 0 0 0 1px ${C.amber}40` : "none",
        transition: "box-shadow .4s",
      }}>
        {cursor >= 4 && (
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <KIcon.Lock size={13} color={C.amber} />
          </div>
        )}
        <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
          package · #VB-44102
        </div>

        {/* Photo placeholder */}
        <div style={{
          height: 120, borderRadius: 8,
          background: `repeating-linear-gradient(135deg, ${C.bgCard}, ${C.bgCard} 8px, ${C.bgElevated} 8px, ${C.bgElevated} 16px)`,
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 12, position: "relative", overflow: "hidden",
        }}>
          {cursor >= 2 ? (
            <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <KIcon.Camera size={22} color={C.textSec} />
              <span className="k-mono" style={{ fontSize: 10, color: C.textSec, letterSpacing: "0.1em" }}>
                package photo · 9:16a
              </span>
            </div>
          ) : (
            <span className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.1em" }}>
              awaiting photo…
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <Stat label="dimensions" value="12×10×8" mono />
          <Stat label="weight" value="2.3 lb" mono accent={cursor >= 5 ? C.amber : null} />
          <Stat label="zone" value="5" mono />
        </div>
      </div>

      {/* Comparison panel — only when invoice arrives */}
      {cursor >= 5 && (
        <div className="k-fade-in" style={{
          background: "rgba(248,113,113,0.04)", border: `1px solid rgba(248,113,113,0.25)`,
          borderRadius: 12, padding: 16,
        }}>
          <div className="k-mono" style={{ fontSize: 9, color: C.red, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
            ⚠ discrepancy detected
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 18px 1fr", gap: 10, alignItems: "center" }}>
            <div style={{ background: C.bg, padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
                dossier says
              </div>
              <div className="k-display" style={{ fontSize: 26, color: C.amber }}>2.3 lb</div>
              <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>scale + photo, 9:15a</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span className="k-mono" style={{ fontSize: 10, color: C.textMuted }}>vs</span>
            </div>
            <div style={{ background: C.bg, padding: 12, borderRadius: 8, border: `1px solid rgba(248,113,113,0.3)` }}>
              <div className="k-mono" style={{ fontSize: 9, color: C.red, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
                ups billed
              </div>
              <div className="k-display" style={{ fontSize: 26, color: C.red }}>4.0 lb</div>
              <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>dim weight applied</div>
            </div>
          </div>
          {cursor >= 6 && (
            <div className="k-fade-in flex items-center justify-between" style={{
              marginTop: 12, padding: "10px 12px",
              background: C.bg, border: `1px dashed ${C.amber}50`, borderRadius: 8,
            }}>
              <span className="k-mono" style={{ fontSize: 11, color: C.textSec }}>overcharge</span>
              <span className="k-display" style={{ fontSize: 22, color: C.amber }}>$12.47</span>
            </div>
          )}
        </div>
      )}

      {/* Filing receipt */}
      {cursor >= 7 && (
        <div className="k-fade-in" style={{
          background: C.bgCard, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: 16,
        }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <KIcon.Receipt size={13} color={C.blue} />
            <span className="k-mono" style={{ fontSize: 10, color: C.blue, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
              dispute filed · #DR-22847
            </span>
          </div>
          <div className="k-mono" style={{ fontSize: 11, color: C.textSec, lineHeight: 1.5 }}>
            submitted to ups capital portal with full dossier attached.<br/>
            we attached the photo, the scale reading, and the gps zone confirmation.
          </div>
        </div>
      )}

      {/* Reclaimed stamp */}
      {cursor >= 9 && (
        <div className="k-fade-in" style={{
          padding: "20px 18px", textAlign: "center", position: "relative",
          background: `linear-gradient(135deg, ${C.bgCard}, ${C.bgElevated})`,
          border: `1px solid ${C.borderBright}`, borderRadius: 12,
        }}>
          <div style={{ position: "absolute", top: 14, right: 14 }}>
            <div className="k-stamp"><KlemrSeal size={48} color={C.amber} ink /></div>
          </div>
          <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>
            credit posted
          </div>
          <div className="k-display" style={{ fontSize: 38, color: C.amber, lineHeight: 1 }}>
            +$12.47
          </div>
          <HandNote color={C.amberInk} rotate={-3} size={18} delay={0.4} style={{ marginTop: 10 }}>
            another one for the file.
          </HandNote>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, mono, accent }) {
  return (
    <div style={{
      background: C.bgElevated, border: `1px solid ${C.border}`,
      borderRadius: 6, padding: "8px 10px",
    }}>
      <div className="k-mono" style={{ fontSize: 8, color: C.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2 }}>
        {label}
      </div>
      <div className={mono ? "k-mono" : "k-body"} style={{ fontSize: 13, color: accent || C.text, fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

window.DisputeTimeline = DisputeTimeline;
})();

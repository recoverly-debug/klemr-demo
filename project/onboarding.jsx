// Onboarding flow — 4-step setup wizard
(function() {
const C = window.KLEMR.C;
const { KlemrSeal, Wordmark, KIcon, HandNote, Watermark } = window;

function Onboarding() {
  const [step, setStep] = React.useState(0);
  const [carriers, setCarriers] = React.useState({ ups: true, fedex: true, usps: false, dhl: false });
  const [shipPlatform, setShipPlatform] = React.useState("shipstation");
  const [scanComplete, setScanComplete] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);

  React.useEffect(() => {
    if (step !== 3 || scanComplete) return;
    const t = setInterval(() => {
      setScanProgress((p) => {
        const np = p + 1.4 + Math.random() * 1.6;
        if (np >= 100) { setScanComplete(true); return 100; }
        return np;
      });
    }, 80);
    return () => clearInterval(t);
  }, [step, scanComplete]);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const reset = () => { setStep(0); setScanComplete(false); setScanProgress(0); };

  return (
    <div className="k-body" style={{
      width: 1100, height: 720,
      background: C.bg, color: C.text,
      borderRadius: 14, overflow: "hidden",
      position: "relative",
      display: "grid", gridTemplateColumns: "320px 1fr",
    }}>
      <Watermark />
      {/* Sidebar */}
      <aside style={{
        background: C.bgElevated, borderRight: `1px solid ${C.border}`,
        padding: "32px 28px", position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
      }}>
        <div className="flex items-center" style={{ gap: 12, marginBottom: 40 }}>
          <KlemrSeal size={32} color={C.amber} />
          <Wordmark size={24} />
        </div>

        <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 18 }}>
          set up · 4 steps
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { n: 1, t: "your warehouse", d: "where the packages go out" },
            { n: 2, t: "carriers to watch", d: "we listen for invoices" },
            { n: 3, t: "shipping platform", d: "manifest source" },
            { n: 4, t: "first scan", d: "we go look around" },
          ].map((s, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <div key={i} style={{
                padding: "14px 12px",
                borderRadius: 8,
                background: active ? "rgba(247,185,85,0.06)" : "transparent",
                border: `1px solid ${active ? "rgba(247,185,85,0.3)" : "transparent"}`,
                display: "flex", gap: 12, alignItems: "flex-start",
                cursor: done ? "pointer" : "default",
                transition: "all .18s",
              }} onClick={() => done && setStep(i)}>
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: `1px solid ${done ? C.amber : active ? C.amber : C.border}`,
                  background: done ? C.amber : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  {done ? <KIcon.Check size={11} color={C.bg} /> : (
                    <span className="k-mono" style={{ fontSize: 10, color: active ? C.amber : C.textMuted, fontWeight: 600 }}>{s.n}</span>
                  )}
                </div>
                <div>
                  <div className="k-body" style={{ fontSize: 13, color: active || done ? C.text : C.textSec, fontWeight: 500, lineHeight: 1.2 }}>
                    {s.t}
                  </div>
                  <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: "14px 16px", border: `1px dashed ${C.border}`, borderRadius: 10, background: "rgba(94,234,212,0.03)" }}>
          <div className="k-mono" style={{ fontSize: 9, color: C.mintInk, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
            why klemr
          </div>
          <HandNote color={C.mintInk} rotate={-2} size={18} delay={0.1} style={{ display: "block", whiteSpace: "normal", lineHeight: 1.25 }}>
            carriers overbill 4-7% of shipments. we keep receipts so you don't have to.
          </HandNote>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: "48px 56px", overflow: "hidden", position: "relative", zIndex: 2, display: "flex", flexDirection: "column" }}>
        <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
          step {step + 1} of 4
        </div>

        {step === 0 && <StepWarehouse />}
        {step === 1 && <StepCarriers carriers={carriers} setCarriers={setCarriers} />}
        {step === 2 && <StepPlatform platform={shipPlatform} setPlatform={setShipPlatform} />}
        {step === 3 && <StepScan progress={scanProgress} complete={scanComplete} />}

        <div style={{ flex: 1 }} />

        <div className="flex items-center justify-between" style={{ paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
          <button className="k-btn k-btn-ghost" onClick={step === 0 ? reset : prev} disabled={step === 0}>
            ← back
          </button>
          <div className="flex items-center" style={{ gap: 6 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: i === step ? 24 : 8, height: 4, borderRadius: 2,
                background: i <= step ? C.amber : C.border, transition: "all .3s",
              }} />
            ))}
          </div>
          {step < 3 ? (
            <button className="k-btn k-btn-primary" onClick={next}>
              continue <KIcon.Arrow size={12} color={C.bg} />
            </button>
          ) : scanComplete ? (
            <button className="k-btn k-btn-primary" onClick={reset}>
              go to dashboard <KIcon.Arrow size={12} color={C.bg} />
            </button>
          ) : (
            <button className="k-btn k-btn-ghost" disabled>
              scanning…
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function StepWarehouse() {
  const [name, setName] = React.useState("Verdant Botanicals");
  const [addr, setAddr] = React.useState("2104 Industrial Way, Portland OR 97210");
  return (
    <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 className="k-display" style={{ fontSize: 44, color: C.text, margin: 0, marginBottom: 10 }}>
          where do packages <em style={{ color: C.amber, fontStyle: "italic" }}>leave from</em>?
        </h1>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
          this anchors every dossier — the agent watches departures from this origin.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
        <label>
          <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            merchant name
          </div>
          <input className="k-input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            warehouse address
          </div>
          <input className="k-input" value={addr} onChange={(e) => setAddr(e.target.value)} />
        </label>
      </div>
      <div style={{ position: "relative", marginTop: 4 }}>
        <HandNote color={C.amberInk} rotate={-2} size={18} delay={0.6}>
          ↑ we'll geofence this. zone-mismatch billing dies here.
        </HandNote>
      </div>
    </div>
  );
}

function StepCarriers({ carriers, setCarriers }) {
  const list = [
    { id: "ups", name: "UPS", desc: "dim weight & zone disputes" },
    { id: "fedex", name: "FedEx", desc: "money-back guarantees" },
    { id: "usps", name: "USPS", desc: "limited dispute surface" },
    { id: "dhl", name: "DHL Express", desc: "intl. service-level checks" },
  ];
  return (
    <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 className="k-display" style={{ fontSize: 44, color: C.text, margin: 0, marginBottom: 10 }}>
          who should we <em style={{ color: C.amber, fontStyle: "italic" }}>watch</em>?
        </h1>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
          pick the carriers you ship through. the agent will start opening dossiers on every label.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 600 }}>
        {list.map((c) => {
          const on = carriers[c.id];
          return (
            <button
              key={c.id}
              className={`k-tile ${on ? "k-tile-active" : ""}`}
              onClick={() => setCarriers({ ...carriers, [c.id]: !on })}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: C.bg, border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <KIcon.Truck size={18} color={on ? C.amber : C.textSec} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{c.name}</div>
                <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{c.desc}</div>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                border: `1.5px solid ${on ? C.amber : C.border}`,
                background: on ? C.amber : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {on && <KIcon.Check size={10} color={C.bg} />}
              </div>
            </button>
          );
        })}
      </div>
      <HandNote color={C.amberInk} rotate={1} size={17} delay={0.6} style={{ alignSelf: "flex-start" }}>
        tip — ups + fedex covers ~90% of overbilling
      </HandNote>
    </div>
  );
}

function StepPlatform({ platform, setPlatform }) {
  const list = [
    { id: "shipstation", name: "ShipStation", desc: "1-click oauth · 1,247 labels last 30d" },
    { id: "shopify", name: "Shopify Shipping", desc: "via Shopify admin api" },
    { id: "easypost", name: "EasyPost", desc: "api key" },
    { id: "shippo", name: "Shippo", desc: "api key" },
  ];
  return (
    <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 className="k-display" style={{ fontSize: 44, color: C.text, margin: 0, marginBottom: 10 }}>
          where do labels <em style={{ color: C.amber, fontStyle: "italic" }}>come from</em>?
        </h1>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
          your shipping platform is our manifest source. dimensions, weight, declared zone — all locked at print time.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 600 }}>
        {list.map((p) => {
          const on = platform === p.id;
          return (
            <button key={p.id} className={`k-tile ${on ? "k-tile-active" : ""}`}
              onClick={() => setPlatform(p.id)}
              style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: C.bg, border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <KIcon.Receipt size={16} color={on ? C.amber : C.textSec} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{p.name}</div>
                <div className="k-mono" style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{p.desc}</div>
              </div>
              <div style={{
                width: 16, height: 16, borderRadius: 999,
                border: `1.5px solid ${on ? C.amber : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {on && <div style={{ width: 8, height: 8, borderRadius: 999, background: C.amber }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepScan({ progress, complete }) {
  const targets = [
    { t: "reading 90 days of shipping history", done: progress > 14 },
    { t: "matching invoices against manifests", done: progress > 32 },
    { t: "flagging dim-weight discrepancies", done: progress > 54 },
    { t: "checking late-delivery guarantees", done: progress > 74 },
    { t: "opening dossiers on the rest", done: progress > 92 },
  ];
  const found = Math.floor(progress * 12.4);
  const recovered = Math.floor(progress * 86.3);

  return (
    <div className="k-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 className="k-display" style={{ fontSize: 44, color: C.text, margin: 0, marginBottom: 10 }}>
          {complete ? <>look what we <em style={{ color: C.amber, fontStyle: "italic" }}>already found</em>.</> : <>going to look around <em style={{ color: C.amber, fontStyle: "italic" }}>now</em>…</>}
        </h1>
        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
          {complete ? "the agent ran a 90-day backfill while you were reading. there's already money on the table." : "the agent is reading your shipping history. takes about a minute."}
        </p>
      </div>

      <div style={{
        background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: 22, maxWidth: 620,
      }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <KIcon.Eye size={14} color={C.mint} />
            <span className="k-mono" style={{ fontSize: 11, color: C.text, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              backfill scan
            </span>
          </div>
          <span className="k-mono" style={{ fontSize: 11, color: C.amber }}>{Math.floor(progress)}%</span>
        </div>
        <div style={{ height: 3, background: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 18 }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: `linear-gradient(90deg, ${C.amberDim}, ${C.amber}, ${C.amberBright})`,
            transition: "width 0.12s linear",
            boxShadow: `0 0 8px ${C.amber}`,
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {targets.map((s, i) => (
            <div key={i} className="flex items-center" style={{ gap: 10, opacity: s.done ? 1 : 0.4, transition: "opacity .3s" }}>
              {s.done ? <KIcon.Check size={12} color={C.mint} /> : <span className="k-mono" style={{ fontSize: 11, color: C.textMuted, width: 12, textAlign: "center" }}>⋯</span>}
              <span className="k-mono" style={{ fontSize: 12, color: s.done ? C.textSec : C.textMuted }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>

      {complete && (
        <div className="k-fade-in" style={{
          background: `linear-gradient(135deg, ${C.bgElevated}, ${C.bgCard})`,
          border: `1px solid ${C.borderBright}`,
          boxShadow: "0 0 0 1px rgba(247,185,85,0.18), 0 0 24px rgba(247,185,85,0.10)",
          borderRadius: 12, padding: "20px 24px", maxWidth: 620,
          display: "flex", alignItems: "center", gap: 28,
        }}>
          <div style={{ position: "relative" }}>
            <KlemrSeal size={56} color={C.amber} ink />
          </div>
          <div style={{ flex: 1 }}>
            <div className="k-mono" style={{ fontSize: 9, color: C.textMuted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              already-claimable
            </div>
            <div className="k-display" style={{ fontSize: 40, color: C.amber, lineHeight: 1 }}>
              ${window.KLEMR.fmt$(recovered + 2847.21)}
            </div>
            <div className="k-mono" style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
              across {found + 38} flagged shipments · we'll file these in the morning
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.Onboarding = Onboarding;
})();

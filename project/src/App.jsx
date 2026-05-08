import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { C } from "./tokens.js";
import { STYLES } from "./styles.js";
import { ACTIVITY_TEMPLATES } from "./data.js";
import { KlemrMark, Wordmark, Icon } from "./components/Icons.jsx";
import { OverviewView } from "./views/OverviewView.jsx";

const SIDEBAR_WORKING = [
  "reading the ups invoice for dock 2",
  "matching scans on the fedex ground shipment",
  "pulling weather data for the noaa re-file",
  "reconciling the $487 credit that just landed",
  "watching invoice #44102 clear at ups",
];
function SidebarWorkingLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % SIDEBAR_WORKING.length), 25000);
    return () => clearInterval(t);
  }, []);
  return (
    <div key={i} className="k-mono k-fade-in" style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.5 }}>
      {SIDEBAR_WORKING[i]}
    </div>
  );
}

const Sidebar = memo(function Sidebar({ view, setView, needsAction, stuckFilings, leaksToReview, collapsed, setCollapsed }) {
  const items = [
    { id: "overview", label: "Overview", icon: Icon.Pulse,
      badge: needsAction > 0 ? { count: needsAction, tone: "red", title: `${needsAction} need${needsAction === 1 ? "s" : ""} your call` } : null },
    { id: "dossiers", label: "Shipment Dossiers", icon: Icon.Dossier },
    { id: "filings", label: "Claim Filings", icon: Icon.Film,
      badge: stuckFilings > 0 ? { count: stuckFilings, tone: "red", title: `${stuckFilings} stuck — carrier pushed back` } : null },
    { id: "patterns", label: "Recurring Leaks", icon: Icon.Pattern,
      badge: leaksToReview > 0 ? { count: leaksToReview, tone: "amber", title: `${leaksToReview} leak${leaksToReview === 1 ? "" : "s"} to review` } : null },
    { id: "setup", label: "Setup", icon: Icon.Settings },
  ];

  return (
    <aside style={{
      width: collapsed ? 60 : 240, flexShrink: 0,
      background: C.bgElevated, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      padding: collapsed ? "20px 8px" : "20px 14px",
      transition: "width 0.22s cubic-bezier(.4,.2,.2,1), padding 0.22s",
      position: "relative",
    }}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "expand" : "collapse"}
        style={{
          position: "absolute", top: 28, right: -10, zIndex: 5,
          width: 20, height: 20, borderRadius: 999,
          background: C.bgElevated, border: `1px solid ${C.border}`,
          color: C.textSec, cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit", fontSize: 11, lineHeight: 1,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.borderBright; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textSec; e.currentTarget.style.borderColor = C.border; }}
      >
        {collapsed ? "›" : "‹"}
      </button>

      <div className="flex items-center" style={{
        gap: 12, padding: collapsed ? "0 0 22px" : "0 6px 22px",
        borderBottom: `1px solid ${C.border}`, marginBottom: 16,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <KlemrMark size={collapsed ? 28 : 32} color={C.amber} animated />
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <Wordmark size={22} />
            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>
              your ops teammate for carrier billing
            </span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{ height: 1, background: C.border, margin: "0 6px 14px" }} />
      )}

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((it) => (
          <div
            key={it.id}
            className={`k-nav-item ${view === it.id ? "active" : ""}`}
            onClick={() => setView(it.id)}
            title={collapsed ? it.label : undefined}
            style={collapsed ? { justifyContent: "center", padding: "10px 8px", position: "relative" } : undefined}
          >
            <span className="k-nav-icon"><it.icon size={collapsed ? 17 : 15} /></span>
            {!collapsed && <span>{it.label}</span>}
            {!collapsed && it.badge && (
              <span className={`k-nav-badge ${it.badge.tone}`} title={it.badge.title}>{it.badge.count}</span>
            )}
            {collapsed && it.badge && (
              <span title={it.badge.title} style={{
                position: "absolute", top: 4, right: 4,
                width: 6, height: 6, borderRadius: 999,
                background: it.badge.tone === "red" ? C.red : C.amber,
              }} />
            )}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {collapsed ? (
        <div title="agent · live · watching dock 3" style={{
          padding: 8, border: `1px solid ${C.border}`, borderRadius: 8,
          background: C.bgCard, display: "flex", justifyContent: "center",
        }}>
          <div className="k-pulse-ring" style={{ width: 8, height: 8, borderRadius: 999, background: C.mint }} />
        </div>
      ) : (
        <div style={{
          padding: 12, border: `1px solid ${C.border}`, borderRadius: 10,
          background: C.bgCard,
        }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
            <div className="k-pulse-ring" style={{ width: 8, height: 8, borderRadius: 999, background: C.mint }} />
            <span className="k-mono" style={{ fontSize: 10, color: C.mint, letterSpacing: "0.04em", fontWeight: 500 }}>
              klemr is working
            </span>
          </div>
          <SidebarWorkingLine />
        </div>
      )}
    </aside>
  );
});

const TopBar = memo(function TopBar({ title, minimal }) {
  return (
    <header style={{
      flexShrink: 0,
      padding: minimal ? "16px 32px" : "20px 32px", borderBottom: `1px solid ${C.border}`,
      background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 className="k-display" style={{ fontSize: minimal ? 18 : 24, color: C.text, margin: 0, lineHeight: 1.05 }}>
          {title}
        </h1>
      </div>
    </header>
  );
});

function StubView({ label }) {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      color: C.textMuted, fontFamily: "'Geist Mono', ui-monospace, monospace",
      fontSize: 13, letterSpacing: "0.04em",
    }}>
      {label} — coming soon
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [recovered, setRecovered] = useState(42847.0);
  const [flash, setFlash] = useState(false);
  const [logEntries, setLogEntries] = useState(() => {
    const now = Date.now();
    const m = (mins) => now - mins * 60_000;
    return [
      { id: "seed-1", createdAt: m(3),  stage: "pushback", text: "I'm refiling the fedex dispute on #VB-44156. They denied it citing weather, but the noaa data shows no advisory was issued for that route on that day." },
      { id: "seed-2", createdAt: m(8),  stage: "paid",     text: "Ups returned $487 on #VB-44102 — the eighth late-delivery refund recovered this month.", amount: 487 },
      { id: "seed-3", createdAt: m(17), stage: "filed",    text: "I filed a dispute on #VB-43998 for an oversized-package charge that didn't match the actual dimensions. Ups typically responds in six to fourteen days." },
      { id: "seed-4", createdAt: m(22), stage: "invoice",  text: "I'm seeing a recurring package handling surcharge on shipments leaving dock 3. I've started filing these automatically." },
      { id: "seed-5", createdAt: m(41), stage: "invoice",  text: "I matched the invoice line for #VB-43972 to the original manifest. The charge is correct — nothing to file." },
      { id: "seed-6", createdAt: m(60), stage: "paid",     text: "Ups returned $214 on #VB-43881 for a dimensional weight correction.", amount: 214 },
      { id: "seed-7", createdAt: m(72), stage: "filed",    text: "I filed a late-delivery dispute on #VB-43844, a fedex ground shipment that missed its guaranteed delivery date." },
      { id: "seed-8", createdAt: m(120),stage: "invoice",  text: "I caught a duplicate residential surcharge on #VB-43799 — ups billed it twice on the same invoice." },
      { id: "seed-9", createdAt: m(125),stage: "invoice",  text: "I reconciled this week's ups invoice — fourteen line items, all clean." },
    ];
  });
  const [scanIdx, setScanIdx] = useState(0);
  const [scanProgress, setScanProgress] = useState(34);
  const [activeDossierCount] = useState(1247);
  const [pulse, setPulse] = useState(0);
  const flashTimer = useRef(null);

  useEffect(() => {
    if (document.getElementById("klemr-styles")) return;
    const tag = document.createElement("style");
    tag.id = "klemr-styles";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    let timer;
    const tick = () => {
      const tpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const entry = { ...tpl, id: `live-${Date.now()}-${Math.random()}`, createdAt: Date.now() };
      setLogEntries(prev => [entry, ...prev].slice(0, 12));
      if (entry.amount) {
        setRecovered(r => r + entry.amount);
        setFlash(true);
        clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setFlash(false), 1500);
      }
      timer = setTimeout(tick, 25000 + Math.random() * 15000);
    };
    timer = setTimeout(tick, 12000);
    return () => { clearTimeout(timer); clearTimeout(flashTimer.current); };
  }, [pulse]);

  useEffect(() => {
    const t = setInterval(() => {
      setScanProgress(p => {
        const np = p + 0.6 + Math.random() * 1.0;
        if (np >= 100) return 4;
        return np;
      });
    }, 1400);
    return () => clearInterval(t);
  }, []);

  const spotCheck = useCallback(() => {
    setPulse(n => n + 1);
    setScanProgress(2);
    [0, 600, 1300, 1900].forEach((delay, idx) => {
      setTimeout(() => {
        const pool = idx === 3 ? ACTIVITY_TEMPLATES.filter(t => t.amount) : ACTIVITY_TEMPLATES.filter(t => !t.amount);
        const tpl = pool[Math.floor(Math.random() * pool.length)];
        const entry = { ...tpl, id: `live-${Date.now()}-${Math.random()}`, createdAt: Date.now() };
        setLogEntries(prev => [entry, ...prev].slice(0, 12));
        if (entry.amount) {
          setRecovered(r => r + entry.amount);
          setFlash(true);
          setTimeout(() => setFlash(false), 1500);
        }
      }, delay);
    });
  }, []);

  const openDossierFn = useCallback((d) => {}, []);

  const titles = {
    overview: "Overview",
    dossiers: "Shipment Dossiers",
    filings: "Claim Filings",
    patterns: "Recurring Leaks",
    setup: "Setup",
  };

  const stuckFilings = 2;
  const leaksToReview = 1;
  const needsAction = stuckFilings;

  return (
    <div className="k-body" style={{ display: "flex", height: "100vh", background: C.bg, color: C.text }}>
      <Sidebar
        view={view} setView={setView}
        needsAction={needsAction}
        stuckFilings={stuckFilings}
        leaksToReview={leaksToReview}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar title={titles[view]} minimal={view === "overview"} />
        <div className="k-scroll" style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {view === "overview" && (
            <OverviewView
              recovered={recovered} flash={flash} logEntries={logEntries}
              scanIdx={scanIdx} scanProgress={scanProgress}
              activeDossierCount={activeDossierCount}
              setView={setView} openDossier={openDossierFn}
            />
          )}
          {view === "dossiers" && <StubView label="dossiers" />}
          {view === "filings" && <StubView label="filings" />}
          {view === "patterns" && <StubView label="patterns" />}
          {view === "setup" && <StubView label="setup" />}
        </div>
      </div>
    </div>
  );
}

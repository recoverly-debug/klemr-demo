export const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Caveat:wght@400;500;600;700&display=swap');

  .k-display { font-family: 'Instrument Serif', serif; font-weight: 400; letter-spacing: -0.02em; }
  .k-body { font-family: 'Geist', system-ui, sans-serif; }
  .k-mono { font-family: 'Geist Mono', ui-monospace, monospace; }
  .k-hand { font-family: 'Caveat', cursive; font-weight: 500; }

  @keyframes k-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.85); } }
  @keyframes k-pulse-ring { 0% { transform: scale(0.8); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  @keyframes k-slide-in { from { transform: translateY(6px); } to { transform: translateY(0); } }
  @keyframes k-fade-in { from { opacity: 0.6; } to { opacity: 1; } }
  @keyframes k-flash { 0% { color: #FFE9B8; text-shadow: 0 0 24px rgba(255,213,128,0.6); } 100% { color: #F7B955; text-shadow: 0 0 0; } }
  @keyframes k-stamp {
    0% { opacity: 0; transform: scale(2.4) rotate(-18deg); filter: blur(2px); }
    55% { opacity: 1; transform: scale(0.92) rotate(-7deg); filter: blur(0); }
    100% { opacity: 0.96; transform: scale(1) rotate(-9deg); filter: blur(0); }
  }
  @keyframes k-hand-in {
    0% { opacity: 0; transform: translateY(4px) rotate(var(--r, -2deg)) scale(0.92); }
    60% { opacity: 1; transform: translateY(0) rotate(calc(var(--r, -2deg) - 1deg)) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) rotate(var(--r, -2deg)) scale(1); }
  }

  .k-pulse { animation: k-pulse 1.8s ease-in-out infinite; }
  .k-slide-in { animation: k-slide-in 0.45s cubic-bezier(.2,.8,.2,1) both; opacity: 1; }
  .k-fade-in { animation: k-fade-in 0.35s ease-out both; opacity: 1; }
  .k-flash { animation: k-flash 1.6s ease-out; }
  .k-stamp { animation: k-stamp 0.7s cubic-bezier(.2,.9,.3,1.1) both; }
  .k-hand-anim { animation: k-hand-in 0.7s cubic-bezier(.3,.7,.3,1.2) both; }

  @keyframes k-cursor-ring { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
  .k-cursor-ring { animation: k-cursor-ring 0.9s ease-out both; }
  @keyframes k-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .k-blink { animation: k-blink 1.05s steps(2, end) infinite; }
  @keyframes k-caret { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .k-caret { animation: k-caret 1.1s ease-in-out infinite; display: inline-block; margin-left: 1px; }

  .k-pulse-ring { position: relative; }
  .k-pulse-ring::after {
    content: ''; position: absolute; inset: 0; border-radius: 9999px;
    border: 1px solid #5EEAD4; animation: k-pulse-ring 1.6s ease-out infinite;
  }

  .k-feed-row {
    position: relative;
    padding: 10px 10px 10px 12px;
    border-radius: 6px;
    border-left: 2px solid transparent;
    transition: background 0.18s ease, border-left-color 2.6s ease 0.4s;
    cursor: default;
  }
  .k-feed-row:hover { background: rgba(94,234,212,0.04); }
  .k-feed-row.is-active { border-left-color: rgba(94,234,212,0.55); }
  .k-feed-row.is-active.is-faded { border-left-color: transparent; }
  .k-feed-dot { width: 8px; height: 8px; border-radius: 999px; flex-shrink: 0; margin-top: 6px; }
  .k-feed-dot-pulse { position: relative; }
  .k-feed-dot-pulse::after {
    content: ''; position: absolute; inset: -3px; border-radius: 999px;
    border: 1px solid currentColor; opacity: 0.45;
    animation: k-pulse-ring 1.6s ease-out infinite;
  }

  @keyframes k-sweep {
    0%, 100% { transform: rotate(0deg); opacity: 0.95; }
    25% { transform: rotate(-3deg); opacity: 1; }
    50% { transform: rotate(0deg); opacity: 0.85; }
    75% { transform: rotate(2deg); opacity: 1; }
  }
  .k-sweep { animation: k-sweep 6s ease-in-out infinite; transform-origin: 20px 20px; transform-box: fill-box; }

  .k-stream::-webkit-scrollbar, .k-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .k-stream::-webkit-scrollbar-track, .k-scroll::-webkit-scrollbar-track { background: transparent; }
  .k-stream::-webkit-scrollbar-thumb, .k-scroll::-webkit-scrollbar-thumb { background: #2A2620; border-radius: 3px; }
  .k-stream::-webkit-scrollbar-thumb:hover, .k-scroll::-webkit-scrollbar-thumb:hover { background: #3A342B; }

  ::selection { background: #F7B955; color: #0E0D0B; }

  .k-btn {
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 9px 14px; border-radius: 7px; border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; transition: all .18s;
  }
  .k-btn-primary { background: #F7B955; color: #0E0D0B; }
  .k-btn-primary:hover { background: #FFD580; }
  .k-btn-cream { background: transparent; color: #F5F0E6; border: 1px solid #F5F0E6; }
  .k-btn-cream:hover { background: rgba(245,240,230,0.06); }
  .k-btn-ghost { background: transparent; color: #A8A095; border: 1px solid #2A2620; }
  .k-btn-ghost:hover { color: #F5F0E6; border-color: #3A342B; }
  .k-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .k-input {
    font-family: 'Geist', system-ui, sans-serif; font-size: 14px;
    background: #0E0D0B; color: #F5F0E6;
    border: 1px solid #2A2620; border-radius: 8px;
    padding: 12px 14px; width: 100%; outline: none; transition: border-color .18s;
  }
  .k-input:focus { border-color: #F7B955; }

  .k-tile {
    background: #16140F; border: 1px solid #2A2620;
    border-radius: 10px; padding: 16px; cursor: pointer;
    transition: all .18s; text-align: left;
  }
  .k-tile:hover { background: #221E18; border-color: #3A342B; }
  .k-tile.active { border-color: #F7B955; background: rgba(247,185,85,0.06); }

  .k-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px 10px 12px; border-radius: 8px; cursor: pointer;
    color: #A8A095; font-size: 13px; font-weight: 500;
    transition: all .15s;
    border: 1px solid transparent;
    border-left: 2px solid transparent;
  }
  .k-nav-item:hover { background: #16140F; color: #F5F0E6; }
  .k-nav-item.active { background: transparent; color: #F5F0E6; border-left-color: #5EEAD4; }
  .k-nav-item.active .k-nav-icon { color: #F5F0E6; }

  .k-nav-icon { color: #5C564E; transition: color .15s; flex-shrink: 0; }
  .k-nav-item:hover .k-nav-icon { color: #A8A095; }

  .k-nav-badge {
    margin-left: auto; font-family: 'Geist Mono', ui-monospace, monospace; font-size: 9px;
    letter-spacing: 0.04em; padding: 2px 7px; border-radius: 999px;
    display: inline-flex; align-items: center; gap: 5px;
    border: 1px solid transparent;
  }
  .k-nav-badge::before {
    content: ""; width: 5px; height: 5px; border-radius: 999px; flex-shrink: 0;
  }
  .k-nav-badge.amber { color: #F7B955; background: rgba(247,185,85,0.10); border-color: rgba(247,185,85,0.22); }
  .k-nav-badge.amber::before { background: #F7B955; }
  .k-nav-badge.red   { color: #E5634A; background: rgba(229,99,74,0.10);  border-color: rgba(229,99,74,0.24); }
  .k-nav-badge.red::before   { background: #E5634A; }

  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
`;

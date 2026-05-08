export const C = {
  bg: "#0E0D0B", bgElevated: "#16140F", bgCard: "#1A1814", bgCardHover: "#221E18",
  border: "#2A2620", borderBright: "#3A342B",
  text: "#F5F0E6", textSec: "#A8A095", textMuted: "#5C564E",
  amber: "#F7B955", amberBright: "#FFD580", amberDim: "#8B6A30", amberInk: "#E89A2D",
  mint: "#5EEAD4", mintInk: "#3FBFA8", mintDim: "#2C5F58",
  red: "#F87171", blue: "#7DD3FC", violet: "#C4B5FD",
};

export const fmt$ = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtInt = (n) => Math.floor(n).toLocaleString("en-US");

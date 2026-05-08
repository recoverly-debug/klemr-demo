import { memo, useRef, useEffect, useMemo } from "react";

export const Typewriter = memo(function Typewriter({ text, speed = 8, delay = 0, className, style, onDone }) {
  const ref = useRef(null);
  const doneRef = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (doneRef.current) {
      node.textContent = text;
      return;
    }
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { node.textContent = text; doneRef.current = true; if (onDone) onDone(); return; }
    let i = 0;
    let timer = null;
    let cancelled = false;
    node.textContent = "";
    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) { doneRef.current = true; if (onDone) onDone(); return; }
      i += 1;
      node.textContent = text.slice(0, i);
      timer = setTimeout(tick, speed);
    };
    const start = setTimeout(tick, delay);
    return () => { cancelled = true; clearTimeout(start); if (timer) clearTimeout(timer); };
  }, [text, speed, delay]);
  return <span ref={ref} className={className} style={style} />;
});

export function buildHtmlFrames(html) {
  const frames = [""];
  const stack = [];
  let cur = "";
  let i = 0;
  while (i < html.length) {
    const ch = html[i];
    if (ch === "<") {
      const close = html.indexOf(">", i);
      if (close === -1) break;
      const tagSrc = html.slice(i, close + 1);
      cur += tagSrc;
      const isClose = tagSrc[1] === "/";
      const isSelf = tagSrc.endsWith("/>");
      if (!isClose && !isSelf) {
        const m = tagSrc.match(/^<\s*([a-zA-Z0-9]+)/);
        if (m) stack.push(m[1]);
      } else if (isClose) {
        stack.pop();
      }
      i = close + 1;
    } else {
      cur += ch;
      const closes = stack.slice().reverse().map(n => `</${n}>`).join("");
      frames.push(cur + closes);
      i += 1;
    }
  }
  return frames;
}

export const RichTypewriter = memo(function RichTypewriter({ html, speed = 8, delay = 0, className, style, onDone }) {
  const ref = useRef(null);
  const frames = useMemo(() => buildHtmlFrames(html), [html]);
  const doneRef = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (doneRef.current) {
      node.innerHTML = html;
      return;
    }
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { node.innerHTML = html; doneRef.current = true; if (onDone) onDone(); return; }
    let i = 0;
    let timer = null;
    let cancelled = false;
    node.innerHTML = "";
    const tick = () => {
      if (cancelled) return;
      if (i >= frames.length - 1) { node.innerHTML = html; doneRef.current = true; if (onDone) onDone(); return; }
      i += 1;
      node.innerHTML = frames[i];
      timer = setTimeout(tick, speed);
    };
    const start = setTimeout(tick, delay);
    return () => { cancelled = true; clearTimeout(start); if (timer) clearTimeout(timer); };
  }, [html, frames, speed, delay]);
  return <span ref={ref} className={className} style={style} />;
});

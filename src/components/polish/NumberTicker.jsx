import { useEffect, useRef, useState } from 'react';

/**
 * NumberTicker — counts up from 0 to a numeric `value` when scrolled into view.
 * Non-numeric targets (e.g. "1-2wk", "$0", "24/7") simply fade in over the same
 * timing. Triggers once.
 *
 * Props:
 *   value     — target number, or a string (numeric strings animate; others fade)
 *   duration  — seconds (default 1.5)
 */
export default function NumberTicker({ value, duration = 1.5, className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [display, setDisplay] = useState(null);

  const isNumeric = /^-?\d+(\.\d+)?$/.test(String(value).trim());
  const target = isNumeric ? Number(value) : null;

  // Fire once when scrolled into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Count-up animation for numeric targets.
  useEffect(() => {
    if (!inView || !isNumeric) return;
    let raf;
    let start;
    const decimals = String(value).includes('.') ? String(value).split('.')[1].length : 0;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const current = target * progress;
      setDisplay(decimals ? current.toFixed(decimals) : Math.round(current).toString());
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, isNumeric, target, duration, value]);

  const content = isNumeric ? (display ?? '0') : value;

  return (
    <span
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {content}
    </span>
  );
}

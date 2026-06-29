/**
 * MarqueeRow — horizontal infinite scroll of pills (pure CSS, no JS). The track
 * is duplicated so the loop is seamless; on hover the animation slows to 0.3x
 * speed (duration stretched ~3.33x).
 *
 * Props: industries — array of label strings.
 */
const BASE_DURATION = 32; // seconds for one full loop

export default function MarqueeRow({ industries = [] }) {
  const items = [...industries, ...industries]; // duplicate for seamless wrap

  return (
    <div className="marquee" aria-label="Industries we build for">
      <style>{`
        .marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          gap: 0.85rem;
          animation: marqueeScroll ${BASE_DURATION}s linear infinite;
          will-change: transform;
        }
        .marquee:hover .marquee-track { animation-duration: ${Math.round(BASE_DURATION / 0.3)}s; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
      <div className="marquee-track">
        {items.map((label, i) => (
          <span className="pill" key={i} aria-hidden={i >= industries.length ? 'true' : undefined}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

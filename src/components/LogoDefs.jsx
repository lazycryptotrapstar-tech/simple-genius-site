/**
 * LogoDefs — the shared SVG <defs> (gradients + filters) for the Simple Genius
 * logo. Mounted ONCE at the App root so the gradient/filter IDs referenced by
 * every Logo / Watermark instance resolve without duplicate-ID collisions.
 *
 * Copied byte-for-byte from the original index.html. Do not edit IDs or stops.
 */
export default function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="g-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8EF8A" /><stop offset="25%" stopColor="#D4AF37" /><stop offset="60%" stopColor="#A07820" /><stop offset="100%" stopColor="#6B4E12" />
        </linearGradient>
        <linearGradient id="g-gold2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EDD76A" /><stop offset="50%" stopColor="#C49B28" /><stop offset="100%" stopColor="#7A5510" />
        </linearGradient>
        <linearGradient id="g-gold-sm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0DC6A" /><stop offset="50%" stopColor="#C8A025" /><stop offset="100%" stopColor="#85640E" />
        </linearGradient>
        <linearGradient id="g-amethyst" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DA9EFF" /><stop offset="45%" stopColor="#A855F7" /><stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>
        <linearGradient id="g-wordgold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5E07A" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#AA8A2E" />
        </linearGradient>
        <filter id="f-purple-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b4" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b9" />
          <feMerge><feMergeNode in="b9" /><feMergeNode in="b4" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="f-gear-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.7" />
        </filter>
        <filter id="f-purple-gear" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feFlood floodColor="#A855F7" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="g-gear-ambient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

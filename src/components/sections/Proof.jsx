/**
 * Proof — replaces the old capability card grid. Genius explains what we'd
 * build; this section's one job is evidence that we actually build it.
 */
const PROOF_POINTS = [
  {
    marker: 'in production',
    text: 'A multi-tenant revenue platform running live, with real client teams working in it every day.',
  },
  {
    marker: 'end to end',
    text: 'Ticketing built whole — inventory, checkout with integrated payments, and gate check-in at the door.',
  },
  {
    marker: 'proven live',
    text: 'AI outreach that drafts, sends, and answers replies inside guardrails — with a human in the loop where it matters.',
  },
];

export default function Proof() {
  return (
    <section id="proof" style={{ padding: '5.5rem 1.5rem', background: 'var(--obsidian)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
        <div>
          <span className="section-label"><span className="accent-line"></span>01 · Built and running</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, marginTop: '0.75rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Proof beats <span className="grad-gold">promises.</span>
          </h2>
          <ul style={{ listStyle: 'none', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {PROOF_POINTS.map((p) => (
              <li key={p.marker} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lime)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {p.marker}
                </span>
                <span style={{ fontSize: '0.95rem', color: '#c8cdd6', lineHeight: 1.7, fontWeight: 300 }}>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <a href="https://demo.simplegenius.io" target="_blank" rel="noreferrer" className="proof-frame" aria-label="Open the live demo">
          <div className="proof-frame-bar">
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-url">demo.simplegenius.io</span>
          </div>
          <div className="proof-frame-body">
            <div className="proof-mock">
              <div className="proof-mock-side">
                <span></span><span></span><span></span><span></span>
              </div>
              <div className="proof-mock-main">
                <div className="proof-mock-row proof-mock-row--wide"></div>
                <div className="proof-mock-cards">
                  <span></span><span></span><span></span>
                </div>
                <div className="proof-mock-row"></div>
                <div className="proof-mock-row proof-mock-row--short"></div>
              </div>
            </div>
            <span className="proof-frame-cta">Click around the live demo ↗</span>
          </div>
        </a>
      </div>
    </section>
  );
}

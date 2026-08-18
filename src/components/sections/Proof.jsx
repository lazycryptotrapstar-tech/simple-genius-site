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
    text: 'Ticketing built whole: inventory, checkout with integrated payments, and gate check-in at the door.',
  },
  {
    marker: 'proven live',
    text: 'AI outreach that drafts, sends, and answers replies inside guardrails, with a human in the loop where it matters.',
  },
];

const DEMOS = [
  {
    url: 'https://demo.simplegenius.io',
    urlLabel: 'demo.simplegenius.io',
    kicker: 'Athletics platform — CRM, AI outreach, ticketing',
    cta: 'Click around the live demo ↗',
    ariaLabel: 'Open the live athletics platform demo',
    accent: null,
  },
  {
    url: 'https://nsaballoonco.com',
    urlLabel: 'nsaballoonco.com',
    kicker: 'Event studio — AI intake agent, live client site',
    cta: 'Meet Poppy on the live site ↗',
    ariaLabel: 'Open the live NSA Balloon Co site',
    accent: 'rose',
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
              <li key={p.marker} className="proof-point">
                <span className="proof-point-marker">{p.marker}</span>
                <span className="proof-point-text">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="proof-frames">
          {DEMOS.map((d) => (
            <a
              key={d.urlLabel}
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className={`proof-frame${d.accent ? ` proof-frame--${d.accent}` : ''}`}
              aria-label={d.ariaLabel}
            >
              <div className="proof-frame-bar">
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-url">{d.urlLabel}</span>
              </div>
              <div className="proof-frame-body">
                <div className="proof-mock">
                  <div className="proof-mock-side">
                    <span></span><span></span><span></span>
                  </div>
                  <div className="proof-mock-main">
                    <div className="proof-mock-row proof-mock-row--wide"></div>
                    <div className="proof-mock-cards">
                      <span></span><span></span><span></span>
                    </div>
                    <div className="proof-mock-row proof-mock-row--short"></div>
                  </div>
                </div>
                <span className="proof-frame-kicker">{d.kicker}</span>
                <span className="proof-frame-cta">{d.cta}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

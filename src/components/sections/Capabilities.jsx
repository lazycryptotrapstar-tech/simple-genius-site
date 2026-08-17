import SpotlightCard from '../polish/SpotlightCard';

/**
 * Capabilities — three capability blurbs that replace the old 7-card service
 * grid. Copy is fixed per spec. Each card's CTA scrolls back to the Genius hero.
 */
const CAPABILITIES = [
  {
    title: 'AI-integrated operational platforms',
    blurb: 'CRMs and agents that learn how your business runs and surface the next action.',
  },
  {
    title: 'Conversational and workflow automation',
    blurb: 'Agents and integrations that embed in daily work — not bolted on, not chat widgets.',
  },
  {
    title: 'Systems for appointment-based businesses',
    blurb: 'Booking, reminders, follow-ups, and quoting for brokers, trades, and salons — from a team that builds full ticketing and multi-tenant platforms.',
  },
];

const cardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(212,175,55,0.1)',
  borderRadius: '1.25rem',
  padding: '2rem 1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  height: '100%',
};

export default function Capabilities() {
  return (
    <section id="capabilities" style={{ padding: '5rem 1.5rem', background: 'var(--obsidian)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '3.5rem', maxWidth: 640 }}>
          <span className="section-label"><span className="accent-line"></span>01 · What we build</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 700, marginTop: '0.75rem', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Platforms that turn operational data <span className="grad-gold">into action.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
          {CAPABILITIES.map((c) => (
            <SpotlightCard key={c.title} style={cardStyle}>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', lineHeight: 1.35, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{c.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.7, fontWeight: 300, flex: 1 }}>{c.blurb}</p>
                <a href="#top" style={{ fontSize: '0.62rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textDecoration: 'none', marginTop: '0.5rem' }}>
                  Talk to Genius →
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * WhyUs — the 4 "why Simple Genius" cards, ported verbatim from the original
 * index.html WHY US section.
 */
const CARDS = [
  { title: 'We explain everything in plain English', body: "No jargon, no acronyms, no tech talk. We tell you what we're building, why it matters, and what to expect, in language that actually makes sense." },
  { title: 'We work with what you already have', body: 'Google Sheets, your existing CRM, your email platform: we build around your current tools. No need to buy new software or change how you work.' },
  { title: 'You own it. We hand it over.', body: "Everything we build belongs to you. We train your team, document how it works, and make sure you're never dependent on us to keep it running." },
];

export default function WhyUs() {
  return (
    <section id="why" style={{ padding: '5rem 1.5rem', background: 'var(--obsidian3)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, var(--amethyst-dim) 0%, transparent 55%)', pointerEvents: 'none' }}></div>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="section-label"><span className="accent-line"></span>03 · Why Simple Genius</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            We're operators, <span className="grad-amethyst">not theorists.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2.5rem' }}>
          {CARDS.map((c) => (
            <div className="why-card" key={c.title}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{c.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.75, fontWeight: 300 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * HowItWorks — the 4-step Discovery / Build / Refine / Hand Off process,
 * ported verbatim from the original index.html PROCESS section.
 */
const STEPS = [
  { n: '01 — Discovery', color: 'var(--gold)', accent: true, title: 'Learn your process', body: 'We learn your process, your data, and where the friction is. No assumptions.' },
  { n: '02 — Build', color: 'var(--lime)', accent: false, title: 'Move fast', body: "Most initial systems are live within 1–2 weeks. We don't do six-month roadmaps before writing a line of code." },
  { n: '03 — Refine', color: 'var(--lime)', accent: false, title: 'Iterate on real usage', body: 'We iterate based on real usage, not assumptions. The system improves as your team uses it.' },
  { n: '04 — Hand Off', color: 'var(--gold)', accent: true, title: 'You own it', body: 'You own it. We train your team and document everything. No dependency, no black boxes.' },
];

export default function HowItWorks() {
  return (
    <section id="process" style={{ padding: '5rem 1.5rem', background: 'var(--obsidian)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="section-label"><span className="accent-line"></span>How We Work</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, marginTop: '0.75rem', letterSpacing: '-0.02em' }}>
            From discovery to <span className="grad-gold">hand-off in weeks,</span><br />not months.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '2rem' }}>
          {STEPS.map((s) => (
            <div className="why-card" key={s.n} style={s.accent ? { borderColor: 'var(--gold)' } : undefined}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: s.color, marginBottom: '0.75rem' }}>{s.n}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.7, fontWeight: 300 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

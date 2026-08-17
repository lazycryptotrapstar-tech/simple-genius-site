/**
 * Contact — replaces the original form entirely. A single "still here?" prompt
 * pointing humans to email. No form, no dropdown.
 */
export default function Contact() {
  return (
    <section id="contact" style={{ padding: '5rem 1.5rem 7rem', background: 'var(--obsidian)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(92,184,50,0.06) 0%, transparent 55%)', pointerEvents: 'none' }}></div>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span className="section-label"><span className="accent-line"></span>04 · Prefer a human?</span>
        <p style={{ fontSize: '1.05rem', color: '#9ca3af', lineHeight: 1.8, marginTop: '1.5rem', fontWeight: 300 }}>
          Prefer to talk to a human first? Email{' '}
          <a href="mailto:hello@simplegenius.io" style={{ color: 'var(--gold)', textDecoration: 'none' }}>hello@simplegenius.io</a>
          . A real person reads every message.
        </p>
      </div>
    </section>
  );
}

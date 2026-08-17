/**
 * Footer — brand, location/email, link row, copyright. Row layout on desktop,
 * centered column on mobile (see .footer-grid rules in global.css).
 * LinkedIn and X remain "#" placeholders (Dee updates later).
 */
export default function Footer() {
  return (
    <footer className="footer-glow" style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#000' }}>
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Simple </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#F5E07A,#D4AF37,#AA8A2E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Genius.</span>
          </div>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280' }}>
            McKinney, TX &nbsp;·&nbsp; <a href="mailto:hello@simplegenius.io" style={{ color: '#6b7280', textDecoration: 'none' }}>hello@simplegenius.io</a>
          </p>
        </div>

        <div className="footer-links">
          <a href="#top" className="footer-link footer-link--gold">Talk to Genius ↑</a>
          <a href="#" className="footer-link">LinkedIn</a>
          <a href="#" className="footer-link">X / Twitter</a>
          <a href="mailto:hello@simplegenius.io" className="footer-link">Email</a>
        </div>

        <p className="footer-copy">© 2025 Simple Genius Consulting</p>
      </div>
    </footer>
  );
}

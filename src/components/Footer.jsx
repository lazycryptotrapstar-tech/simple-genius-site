/**
 * Footer — ported from the original index.html. Location (McKinney, TX), email,
 * and social links. LinkedIn and X remain "#" placeholders (Dee updates later).
 */
const socialBase = {
  fontSize: '0.6rem',
  fontWeight: 800,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: '#6b7280',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

export default function Footer() {
  const hoverIn = (e) => (e.currentTarget.style.color = '#D4AF37');
  const hoverOut = (e) => (e.currentTarget.style.color = '#6b7280');

  return (
    <footer className="footer-glow" style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', background: '#000' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>Simple </span>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#F5E07A,#D4AF37,#AA8A2E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Genius.</span>
          </div>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280' }}>
            McKinney, TX &nbsp;·&nbsp; <a href="mailto:hello@simplegenius.io" style={{ color: '#6b7280', textDecoration: 'none' }}>hello@simplegenius.io</a>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2.5rem' }}>
          <a href="#" style={socialBase} onMouseOver={hoverIn} onMouseOut={hoverOut}>LinkedIn</a>
          <a href="#" style={socialBase} onMouseOver={hoverIn} onMouseOut={hoverOut}>X / Twitter</a>
          <a href="mailto:hello@simplegenius.io" style={socialBase} onMouseOver={hoverIn} onMouseOut={hoverOut}>Email</a>
        </div>
        <p style={{ fontSize: '0.6rem', color: '#4b5563', letterSpacing: '0.1em' }}>© 2025 Simple Genius Consulting</p>
      </div>
    </footer>
  );
}

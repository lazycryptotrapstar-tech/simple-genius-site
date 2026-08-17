import Logo from './Logo';

const CALENDAR_URL = 'https://cal.com/dee-chitman-kelly-los110/30min';

/** Wordmark: "Simple" white + "Genius." gold gradient. */
function Wordmark({ fontSize = '1.15rem' }) {
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.18em', lineHeight: 1 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Simple</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize, fontWeight: 700, background: 'linear-gradient(135deg,#F5E07A,#D4AF37,#AA8A2E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>Genius.</span>
    </span>
  );
}

/**
 * Nav — deliberately minimal. The hero owns the Genius CTA; the nav's two jobs
 * are brand presence when scrolled and the human path (book a call).
 */
export default function Nav() {
  return (
    <nav>
      <div className="nav-inner">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <div className="nav-logo-clip"><Logo size={48} /></div>
            <span style={{ marginLeft: '-8px' }}><Wordmark /></span>
          </a>

          <a href={CALENDAR_URL} target="_blank" rel="noreferrer" className="nav-book-link">
            Book a call ↗
          </a>
        </div>
      </div>
    </nav>
  );
}

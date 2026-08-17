import { useEffect, useState } from 'react';
import Logo from './Logo';

/** Wordmark: "Simple" white + "Genius." gold gradient. */
function Wordmark({ fontSize = '1.25rem' }) {
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.18em', lineHeight: 1 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Simple</span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize, fontWeight: 700, background: 'linear-gradient(135deg,#F5E07A,#D4AF37,#AA8A2E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>Genius.</span>
    </span>
  );
}

const LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#process', label: 'How It Works' },
  { href: '#why', label: 'Why Us' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Reflect the drawer state on <body> (drives the hamburger -> X animation).
  useEffect(() => {
    document.body.classList.toggle('mob-menu-open', open);
    return () => document.body.classList.remove('mob-menu-open');
  }, [open]);

  // Close the drawer when clicking outside it.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!e.target.closest('.mob-nav-drawer') && !e.target.closest('.mob-menu-btn')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <>
      <nav>
        <div className="nav-inner">
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', height: '5.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
              <div className="nav-logo-clip"><Logo size={62} /></div>
              <span style={{ marginLeft: '-10px' }}><Wordmark /></span>
            </a>

            <div className="md-nav" style={{ display: 'none' }}>
              {LINKS.map((l) => (
                <a key={l.href} href={l.href}>{l.label}</a>
              ))}
            </div>

            <button className="mob-menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>

            <a href="#top" className="btn-gold nav-cta-desktop" style={{ padding: '0.7rem 1.8rem', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Talk to Genius →
            </a>
          </div>
        </div>
      </nav>

      <div className={`mob-nav-drawer${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <div className="mob-cta-row">
          <a href="#top" onClick={() => setOpen(false)}>Talk to Genius →</a>
        </div>
      </div>
    </>
  );
}

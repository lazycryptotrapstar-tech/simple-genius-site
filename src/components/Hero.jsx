import Logo from './Logo';

/**
 * Hero — the landing centerpiece. Preserves the original purple/lime glows, the
 * hero aura, and the logo scale-in entrance animation. The wordmark + slogan +
 * CTA buttons are replaced by the Genius agent, passed in as children, beneath
 * the big centered logo mark.
 */
export default function Hero({ children }) {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '7rem 1.5rem 5rem',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <div className="hero-glow-top"></div>
      <div className="hero-glow-lime"></div>
      <div className="hero-aura"></div>

      <Logo className="hero-logo-mark" />

      {children}
    </section>
  );
}

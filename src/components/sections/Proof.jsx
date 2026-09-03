import { useEffect, useRef, useState } from 'react';
import NumberTicker from '../polish/NumberTicker';

/**
 * Proof — evidence that we actually build what Genius describes.
 * Two clickable live-demo frames (athletics platform, event studio), plus a row
 * of in-production builds: the Switchboard live call line and the countertop
 * quoting platform (client tool, deliberately unlinked).
 *
 * Listens for `genius:proof-mention` window events (dispatched by the Genius
 * chat when a reply surfaces one of these) and briefly glows the matching card.
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

const STATS = [
  { value: 7, label: 'systems live in production' },
  { value: 5, label: 'industries served' },
  { value: '1–2wk', label: 'discovery to first ship' },
];

const DEMOS = [
  {
    key: 'athletics',
    url: 'https://demo.simplegenius.io',
    urlLabel: 'demo.simplegenius.io',
    kicker: 'Athletics platform — CRM, AI outreach, ticketing',
    cta: 'Click around the live demo ↗︎',
    ariaLabel: 'Open the live athletics platform demo',
    accent: null,
    shot: '/shots/athletics-demo.jpg',
    shotAlt: 'Screenshot of the live athletics platform demo',
  },
  {
    key: 'nsa',
    url: 'https://nsaballoonco.com',
    urlLabel: 'nsaballoonco.com',
    kicker: 'Event studio — AI intake agent, live client site',
    cta: 'Meet Poppy on the live site ↗︎',
    ariaLabel: 'Open the live NSA Balloon Co site',
    accent: 'rose',
    shot: '/shots/nsa-balloon.jpg',
    shotAlt: 'Screenshot of the live NSA Balloon Co event studio site',
  },
];

const CALL_ROWS = [
  { marker: 'answers', text: 'the calls your front desk can’t get to' },
  { marker: 'quotes', text: 'services and books the appointment on the spot' },
  { marker: 'logs', text: 'every call, and emails you when one needs a human' },
];

export default function Proof() {
  const [pinged, setPinged] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onMention = (e) => {
      setPinged(e.detail);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setPinged(null), 4500);
    };
    window.addEventListener('genius:proof-mention', onMention);
    return () => {
      window.removeEventListener('genius:proof-mention', onMention);
      clearTimeout(timerRef.current);
    };
  }, []);

  const pingClass = (key) => (pinged === key ? ' proof-frame--pinged' : '');

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
          <div className="stats-row">
            {STATS.map((s, i) => (
              <div key={s.label} className="stat-item">
                <span className="stat-num grad-gold font-display">
                  <NumberTicker value={s.value} />
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="proof-frames">
          {DEMOS.map((d) => (
            <a
              key={d.urlLabel}
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className={`proof-frame${d.accent ? ` proof-frame--${d.accent}` : ''}${pingClass(d.key)}`}
              aria-label={d.ariaLabel}
            >
              <div className="proof-frame-bar">
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-dot"></span>
                <span className="proof-frame-url">{d.urlLabel}</span>
              </div>
              <div className="proof-frame-body">
                <img
                  className="proof-shot"
                  src={d.shot}
                  alt={d.shotAlt}
                  width="1280"
                  height="800"
                  loading="lazy"
                />
                <span className="proof-frame-kicker">{d.kicker}</span>
                <span className="proof-frame-cta">{d.cta}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="proof-more">
        <a
          href="tel:+14697540536"
          className={`proof-frame proof-frame--call${pingClass('switchboard')}`}
          aria-label="Call the live Switchboard AI receptionist demo line"
        >
          <div className="proof-frame-bar">
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-url">+1 (469) 754-0536</span>
            <span className="proof-live" aria-hidden="true"><span className="proof-live-dot"></span>live</span>
          </div>
          <div className="proof-frame-body">
            <div className="proof-call">
              <span className="proof-call-number font-display grad-gold">(469) 754-0536</span>
              {CALL_ROWS.map((r) => (
                <div key={r.marker} className="proof-call-row">
                  <span className="proof-call-marker">{r.marker}</span>
                  <span className="proof-call-text">{r.text}</span>
                </div>
              ))}
            </div>
            <span className="proof-frame-kicker">Switchboard — AI phone receptionist for service businesses</span>
            <span className="proof-frame-cta">Call the live demo line {'↗︎'}</span>
          </div>
        </a>

        <a
          href="https://platinum.simplegenius.io/demo"
          target="_blank"
          rel="noreferrer"
          className="proof-frame"
          aria-label="Try the countertop quoting platform demo"
        >
          <div className="proof-frame-bar">
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-dot"></span>
            <span className="proof-frame-url">platinum.simplegenius.io/demo</span>
          </div>
          <div className="proof-frame-body">
            <img
              className="proof-shot"
              src="/shots/platinum-quote.jpg"
              alt="Screenshot of a countertop quote with measured slab layouts"
              width="1280"
              height="800"
              loading="lazy"
            />
            <span className="proof-frame-kicker">Quoting platform — in production for a DFW countertop fabricator</span>
            <span className="proof-frame-cta">Try the demo quote builder {'↗︎'}</span>
          </div>
        </a>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useGenius } from './useGenius';
import SpotlightCard from '../polish/SpotlightCard';
import MagneticButton from '../polish/MagneticButton';
import './Genius.css';

// --- Configurable constants -------------------------------------------------
const CALENDAR_URL = 'https://cal.com/dee-chitman-kelly-los110/30min';
const PLACEHOLDER_TEXT = 'Message Genius…';
const SUGGESTIONS = [
  'We miss calls and leads go cold',
  'No-shows are killing my estimates',
  'Show me something you’ve built',
];
// ---------------------------------------------------------------------------

/**
 * Clean assistant text for display: hide the machine-readable closing brief
 * (fenced ```json block) and strip any markdown tells that slip through the
 * prompt's plain-text rule (# headings, ** bold, em dashes).
 */
const displayText = (t) =>
  (t || '')
    .replace(/```(?:json)?[\s\S]*?(?:```|$)/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+—\s+/g, ', ')
    .trimEnd();

/**
 * Linkify the things Genius actually hands out: full URLs, our known bare
 * domains, and the Switchboard demo phone number. Whitelist-based on purpose —
 * generic linkification would false-positive on emails and stray dots.
 */
const LINK_RE = /(https?:\/\/[^\s]+|(?:demo\.simplegenius\.io|nsaballoonco\.com|cal\.com\/)[^\s]*|\+?1?\s?\(469\)\s?754-0536)/g;
const PHONE_RE = /\(469\)\s?754-0536/;

const renderRich = (text) =>
  text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    const url = part.replace(/[.,;:!?)]+$/, '');
    const trailing = part.slice(url.length);
    const href = PHONE_RE.test(url)
      ? 'tel:+14697540536'
      : url.startsWith('http') ? url : `https://${url}`;
    return (
      <span key={i}>
        <a className="genius-link" href={href} target={href.startsWith('tel:') ? undefined : '_blank'} rel="noreferrer">{url}</a>
        {trailing}
      </span>
    );
  });

/** Map a completed reply to the proof card it surfaced, if any. */
const proofMentionKey = (t) =>
  t.includes('demo.simplegenius.io') ? 'athletics'
  : t.includes('nsaballoonco.com') ? 'nsa'
  : PHONE_RE.test(t) ? 'switchboard'
  : null;

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Genius — the conversational intake agent that anchors the hero.
 *  - Resting: headline + subline + input + suggestion chips
 *  - Active:  agent-style thread (avatar + flowing text) above the composer
 *  - Closing: confirmation card once the brief has been emitted to n8n
 */
export default function Genius() {
  const { messages, sendMessage, isStreaming, briefEmitted, error, reset } = useGenius();
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  const hasConversation = messages.length > 0;
  const awaitingFirstToken =
    isStreaming && (messages.length === 0 || messages[messages.length - 1].role === 'user' || !messages[messages.length - 1].content);

  // Keep the newest message in view as it streams.
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  // Announce completed replies to assistive tech (announcing per-token would be noise).
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);
  const announcement = !isStreaming && lastAssistant ? displayText(lastAssistant.content) : '';

  // When a completed reply surfaces one of our live builds, let the Proof
  // section know so the matching card glows.
  useEffect(() => {
    if (isStreaming || !lastAssistant) return;
    const key = proofMentionKey(lastAssistant.content);
    if (key) window.dispatchEvent(new CustomEvent('genius:proof-mention', { detail: key }));
  }, [isStreaming]); // eslint-disable-line react-hooks/exhaustive-deps

  // While a conversation (or the closing card) is up, shrink the hero logo so
  // it stays visible the whole chat — the thread scrolls under it.
  useEffect(() => {
    const active = hasConversation || briefEmitted;
    document.body.classList.toggle('genius-active', active);
    return () => document.body.classList.remove('genius-active');
  }, [hasConversation, briefEmitted]);

  // The moment a conversation starts, snap the page to the top so the chat
  // owns the screen from a stable position (instant — no smooth-scroll drift).
  useEffect(() => {
    if (hasConversation) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [hasConversation]);

  // Mobile chat layout. iOS never shrinks the page for the keyboard — it just
  // pans to the focused input, which left the logo off-screen and a dead strip
  // under the composer. While the composer is focused, size the hero to the
  // visible viewport (--vvh) and hold the page at the top so logo / thread /
  // composer stack exactly into the space above the keyboard. Outside focus the
  // var is dropped so browser-chrome show/hide can't resize the hero mid-scroll.
  useEffect(() => {
    const chatting = hasConversation && !briefEmitted;
    document.body.classList.toggle('genius-chat', chatting);
    const vv = window.visualViewport;
    const root = document.documentElement;
    if (!chatting || !vv) return () => document.body.classList.remove('genius-chat');
    const sync = () => {
      if (document.activeElement === inputRef.current) {
        root.style.setProperty('--vvh', `${Math.round(vv.height)}px`);
        window.scrollTo(0, 0);
      } else {
        root.style.removeProperty('--vvh');
      }
    };
    sync();
    vv.addEventListener('resize', sync);
    return () => {
      vv.removeEventListener('resize', sync);
      root.style.removeProperty('--vvh');
      document.body.classList.remove('genius-chat');
    };
  }, [hasConversation, briefEmitted]);

  // Auto-grow the composer with the draft, capped so it never eats the thread.
  const autoGrow = (el) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft;
    if (!text.trim() || isStreaming) return;
    setDraft('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      // Keep focus in the composer so the mobile keyboard never dismisses —
      // the open/close cycle is what makes the page jump on iOS.
      inputRef.current.focus();
    }
    sendMessage(text);
  };

  const handleSuggestion = (text) => {
    if (isStreaming) return;
    sendMessage(text);
  };

  const handleReset = () => {
    reset();
    setDraft('');
  };

  // --- Closing state --------------------------------------------------------
  if (briefEmitted) {
    return (
      <div className="genius genius--closing">
        <h1 className="sr-only">Simple Genius — AI operational platforms</h1>
        <div className="genius-confirm-card">
          <div className="genius-confirm-icon" aria-hidden="true">✦</div>
          <h2 className="genius-confirm-title">We've got your details.</h2>
          <p className="genius-confirm-body">
            The Simple Genius team will be in touch within one business day.
            Want to skip the wait? Grab a time right here:
          </p>
          {CALENDAR_URL && (
            <>
              <div className="genius-cal-embed">
                <iframe
                  src={`${CALENDAR_URL}?theme=dark`}
                  title="Book a discovery call"
                  loading="lazy"
                />
              </div>
              <a className="genius-confirm-link" href={CALENDAR_URL} target="_blank" rel="noreferrer">
                Or open the calendar in a new tab →
              </a>
            </>
          )}
          <button type="button" className="genius-restart" onClick={handleReset}>
            Start a new conversation
          </button>
        </div>
      </div>
    );
  }

  // --- Resting / Active states ---------------------------------------------
  return (
    <div className={`genius ${hasConversation ? 'genius--active' : 'genius--resting'}`}>
      {!hasConversation ? (
        <div className="genius-intro">
          <h1 className="genius-headline">What are you trying to build?</h1>
          <p className="genius-subline">
            Simple Genius builds AI-powered operational platforms: custom CRMs, intake
            agents, and workflow systems that run your day-to-day — and that you own.
          </p>
          <p className="genius-presence">
            <span className="genius-presence-dot" aria-hidden="true"></span>
            Genius is online
          </p>
        </div>
      ) : (
        <h1 className="sr-only">Talk to Genius — the Simple Genius intake agent</h1>
      )}

      {hasConversation && (
        <div className="genius-thread" ref={threadRef} tabIndex={0}>
          {messages.map((m, i) => {
            if (m.role === 'user') {
              return (
                <div key={i} className="genius-msg genius-msg--user">
                  <div className="genius-bubble">{m.content}</div>
                </div>
              );
            }
            // The hook appends an empty assistant turn while waiting on the first
            // token — the typing indicator below stands in for it.
            if (!m.content) return null;
            return (
              <div key={i} className="genius-msg genius-msg--assistant">
                <span className="genius-avatar" aria-hidden="true">✦</span>
                <div className="genius-answer">
                  {renderRich(displayText(m.content))}
                  {isStreaming && i === messages.length - 1 && (
                    <span className="genius-caret" aria-hidden="true" />
                  )}
                </div>
              </div>
            );
          })}
          {awaitingFirstToken && (
            <div className="genius-msg genius-msg--assistant">
              <span className="genius-avatar" aria-hidden="true">✦</span>
              <div className="genius-typing" aria-label="Genius is thinking">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="sr-only" aria-live="polite">{announcement}</div>

      <form className="genius-input-row" onSubmit={handleSubmit}>
        <SpotlightCard className="genius-input-shell">
          <textarea
            ref={inputRef}
            className="genius-input"
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              autoGrow(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
            }}
            placeholder={PLACEHOLDER_TEXT}
            aria-label="Message Genius"
            autoComplete="off"
          />
          <MagneticButton
            type="submit"
            className="genius-send"
            aria-label="Send"
            disabled={isStreaming || !draft.trim()}
            onPointerDown={(e) => e.preventDefault()} /* don't steal focus from the composer */
            onMouseDown={(e) => e.preventDefault()}
          >
            <SendIcon />
          </MagneticButton>
        </SpotlightCard>
      </form>

      {!hasConversation && (
        <>
          <ul className="genius-chips">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button type="button" className="genius-chip" onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
          <p className="genius-notice">
            Genius is an AI agent. Conversations go to the Simple Genius team.{' '}
            <a href="/privacy">Privacy</a>
          </p>
        </>
      )}

      {error && (
        <p className="genius-error" role="alert">
          {error} Or email <a href="mailto:hello@simplegenius.io">hello@simplegenius.io</a> instead.
        </p>
      )}
    </div>
  );
}

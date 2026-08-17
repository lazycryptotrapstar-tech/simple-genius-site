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
  const { messages, sendMessage, isStreaming, briefEmitted, error } = useGenius();
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  const hasConversation = messages.length > 0;
  const awaitingFirstToken =
    isStreaming && (messages.length === 0 || messages[messages.length - 1].role === 'user' || !messages[messages.length - 1].content);

  // Keep the newest message in view as it streams.
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft;
    if (!text.trim() || isStreaming) return;
    setDraft('');
    sendMessage(text);
  };

  const handleSuggestion = (text) => {
    if (isStreaming) return;
    sendMessage(text);
  };

  // --- Closing state --------------------------------------------------------
  if (briefEmitted) {
    return (
      <div className="genius genius--closing">
        <div className="genius-confirm-card">
          <div className="genius-confirm-icon">✦</div>
          <h2 className="genius-confirm-title">We've got your details.</h2>
          <p className="genius-confirm-body">
            The Simple Genius team will be in touch within one business day.
          </p>
          {CALENDAR_URL && (
            <a className="genius-confirm-cta" href={CALENDAR_URL} target="_blank" rel="noreferrer">
              Grab a time now →
            </a>
          )}
        </div>
      </div>
    );
  }

  // --- Resting / Active states ---------------------------------------------
  return (
    <div className={`genius ${hasConversation ? 'genius--active' : 'genius--resting'}`}>
      {!hasConversation && (
        <div className="genius-intro">
          <h1 className="genius-headline">What are you trying to build?</h1>
        </div>
      )}

      {hasConversation && (
        <div className="genius-thread" ref={threadRef}>
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
                  {displayText(m.content)}
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

      <form className="genius-input-row" onSubmit={handleSubmit}>
        <SpotlightCard className="genius-input-shell">
          <input
            className="genius-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={PLACEHOLDER_TEXT}
            aria-label="Message Genius"
            autoComplete="off"
            disabled={isStreaming}
          />
          <MagneticButton
            type="submit"
            className="genius-send"
            aria-label="Send"
            disabled={isStreaming || !draft.trim()}
          >
            <SendIcon />
          </MagneticButton>
        </SpotlightCard>
      </form>

      {!hasConversation && (
        <div className="genius-chips" role="list">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="genius-chip" onClick={() => handleSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="genius-error">{error}</p>}
    </div>
  );
}

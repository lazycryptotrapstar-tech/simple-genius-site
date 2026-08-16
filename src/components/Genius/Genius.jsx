import { useEffect, useRef, useState } from 'react';
import { useGenius } from './useGenius';
import Logo from '../Logo';
import SpotlightCard from '../polish/SpotlightCard';
import MagneticButton from '../polish/MagneticButton';
import './Genius.css';

// --- Configurable constants -------------------------------------------------
const CALENDAR_URL = 'https://cal.com/dee-chitman-kelly-los110/30min';
const PLACEHOLDER_TEXT = "What's eating your time, or what are you trying to build?";
// ---------------------------------------------------------------------------

/**
 * Genius — the conversational intake agent that anchors the hero.
 *  - Resting: brand mark + "What are you trying to build?" + input
 *  - Active:  streaming conversation thread above a bottom-anchored input
 *  - Closing: confirmation card once the brief has been emitted to n8n
 */
export default function Genius() {
  const { messages, sendMessage, isStreaming, briefEmitted, error } = useGenius();
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  const hasConversation = messages.length > 0;

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
          <Logo size={48} className="genius-intro-mark" />
          <h1 className="genius-headline">What are you trying to build?</h1>
        </div>
      )}

      {hasConversation && (
        <div className="genius-thread" ref={threadRef}>
          {messages.map((m, i) => (
            <div key={i} className={`genius-msg genius-msg--${m.role}`}>
              <div className="genius-bubble">
                {m.content}
                {m.role === 'assistant' && isStreaming && i === messages.length - 1 && (
                  <span className="genius-caret" aria-hidden="true" />
                )}
              </div>
            </div>
          ))}
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
            {isStreaming ? '…' : '→'}
          </MagneticButton>
        </SpotlightCard>
      </form>

      {error && <p className="genius-error">{error}</p>}
    </div>
  );
}

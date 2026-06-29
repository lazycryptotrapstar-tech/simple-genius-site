import { useState, useRef, useCallback } from 'react';
import { GENIUS_SYSTEM_PROMPT } from './systemPrompt';

const GENIUS_ENDPOINT = '/api/genius';
const BRIEF_ENDPOINT = '/api/genius/brief';

/**
 * Try to extract a closing JSON brief from the end of an assistant message.
 * Genius's closing behavior emits the brief as a fenced ```json block (preferred)
 * or as a bare trailing {...} object. Returns the parsed object, or null.
 */
function extractBrief(text) {
  if (!text) return null;

  // 1) Fenced ```json ... ``` block (last one wins).
  const fenceRe = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match;
  let lastFenced = null;
  while ((match = fenceRe.exec(text)) !== null) lastFenced = match[1].trim();
  if (lastFenced) {
    try {
      const obj = JSON.parse(lastFenced);
      if (obj && typeof obj === 'object') return obj;
    } catch { /* fall through */ }
  }

  // 2) Bare trailing JSON object — scan back from the last '}' to its matching '{'.
  const end = text.lastIndexOf('}');
  if (end !== -1) {
    let depth = 0;
    for (let i = end; i >= 0; i--) {
      const ch = text[i];
      if (ch === '}') depth++;
      else if (ch === '{') {
        depth--;
        if (depth === 0) {
          const candidate = text.slice(i, end + 1);
          try {
            const obj = JSON.parse(candidate);
            if (obj && typeof obj === 'object') return obj;
          } catch { /* not valid JSON, give up */ }
          break;
        }
      }
    }
  }
  return null;
}

/**
 * useGenius — conversation state + streaming transport for the Genius agent.
 *
 * Returns:
 *   messages      — [{ role: 'user' | 'assistant', content }]
 *   sendMessage   — (text) => void; appends the user turn, streams the reply
 *   isStreaming   — true while a reply is streaming in
 *   briefEmitted  — true once a closing JSON brief was POSTed to n8n
 *   error         — last transport error message, or null
 */
export function useGenius() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [briefEmitted, setBriefEmitted] = useState(false);
  const [error, setError] = useState(null);
  const briefSentRef = useRef(false);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const userMsg = { role: 'user', content: trimmed };

    // Snapshot the outgoing history (prior turns + this user turn) for the request.
    const outgoing = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    let assistantText = '';

    try {
      const res = await fetch(GENIUS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: outgoing, system: GENIUS_SYSTEM_PROMPT }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Genius is unavailable (status ${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Parse the Anthropic SSE stream forwarded by the Pages Function.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // keep the trailing partial event

        for (const evt of events) {
          for (const line of evt.split('\n')) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith('data:')) continue;
            const data = trimmedLine.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              if (json.type === 'content_block_delta' && json.delta?.type === 'text_delta') {
                assistantText += json.delta.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: assistantText };
                  return next;
                });
              }
            } catch { /* ignore keep-alives / non-JSON lines */ }
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong talking to Genius.');
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'assistant' && last.content === '') {
          next[next.length - 1] = {
            role: 'assistant',
            content: 'Sorry — I lost the connection there. Mind trying that again?',
          };
        }
        return next;
      });
    } finally {
      setIsStreaming(false);
    }

    // After the turn completes, look for a closing brief and forward it to n8n once.
    if (!briefSentRef.current) {
      const brief = extractBrief(assistantText);
      if (brief) {
        briefSentRef.current = true;
        try {
          await fetch(BRIEF_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(brief),
          });
        } catch { /* delivery is best-effort from the client's perspective */ }
        setBriefEmitted(true);
      }
    }
  }, [messages, isStreaming]);

  return { messages, sendMessage, isStreaming, briefEmitted, error };
}

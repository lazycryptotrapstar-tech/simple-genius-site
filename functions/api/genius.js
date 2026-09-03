/**
 * POST /api/genius
 *
 * Proxies the Genius conversation to the Anthropic Messages API with streaming
 * and forwards the SSE stream back to the client unchanged.
 *
 * The system prompt lives server-side (functions/_lib/geniusPrompt.js) and a
 * client-supplied `system` field is ignored — this endpoint only runs Genius.
 *
 * Request body: { messages: [{ role, content }] }
 * Env:          ANTHROPIC_API_KEY, GENIUS_MODEL (optional override)
 */
import { GENIUS_SYSTEM_PROMPT } from '../_lib/geniusPrompt.js';
import { json, originAllowed, visitorId } from '../_lib/http.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2048;

// The prompt runs 4–6 turns; these caps leave generous headroom while keeping
// a single request from carrying an arbitrarily large (billable) payload.
const MAX_MESSAGES = 32;
const MAX_MESSAGE_CHARS = 4000;
const MAX_TOTAL_CHARS = 48000;
const UPSTREAM_TIMEOUT_MS = 90000;

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'Server is missing ANTHROPIC_API_KEY.' }, 500);
  }
  if (!originAllowed(request)) {
    return json({ error: 'Forbidden.' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const messages = sanitizeMessages(body?.messages);
  if (!messages) {
    return json({ error: 'Request must include a valid `messages` array.' }, 400);
  }

  // Abort upstream if the visitor disconnects, and cap total stream time.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), UPSTREAM_TIMEOUT_MS);
  try {
    request.signal?.addEventListener('abort', () => controller.abort('client-disconnected'));
  } catch { /* request.signal unavailable in some runtimes */ }

  const userId = await visitorId(request);

  let upstream;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: env.GENIUS_MODEL || DEFAULT_MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        // cache_control: the ~1,700-token prompt is identical every turn —
        // caching it cuts per-turn input cost substantially.
        system: [{ type: 'text', text: GENIUS_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages,
        ...(userId ? { metadata: { user_id: userId } } : {}),
      }),
    });
  } catch (err) {
    clearTimeout(timer);
    console.error('genius: failed to reach Anthropic:', String(err));
    return json({ error: 'Genius hit a snag. Try again in a moment.' }, 502);
  }

  if (!upstream.ok || !upstream.body) {
    clearTimeout(timer);
    const detail = await safeText(upstream);
    // Log upstream detail server-side only — API error bodies are not for clients.
    console.error('genius: Anthropic error', upstream.status, detail.slice(0, 500));
    if (upstream.status === 429 || upstream.status === 529) {
      return json({ error: 'Genius is busier than usual right now. Give it a minute.' }, 429);
    }
    return json({ error: 'Genius hit a snag. Try again in a moment.' }, 502);
  }

  // Forward the SSE stream straight through to the browser.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  });
}

/**
 * Validate and rebuild the conversation history: known roles only, string
 * content only, per-message and total size caps. Returns null when invalid.
 */
function sanitizeMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) return null;
  let total = 0;
  const out = [];
  for (const m of input) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const content = m.content.slice(0, MAX_MESSAGE_CHARS);
    total += content.length;
    if (total > MAX_TOTAL_CHARS) return null;
    out.push({ role: m.role, content });
  }
  if (out[out.length - 1].role !== 'user') return null;
  return out;
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

/**
 * POST /api/genius
 *
 * Proxies the Genius conversation to the Anthropic Messages API with streaming
 * and forwards the SSE stream back to the client unchanged.
 *
 * Request body: { messages: [{ role, content }], system: "..." }
 * Env:          ANTHROPIC_API_KEY
 */
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2048;

export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'Server is missing ANTHROPIC_API_KEY.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const { messages, system } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Request must include a non-empty `messages` array.' }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        stream: true,
        ...(system ? { system } : {}),
        messages,
      }),
    });
  } catch (err) {
    return json({ error: 'Failed to reach Anthropic.', detail: String(err) }, 500);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await safeText(upstream);
    return json({ error: 'Anthropic API error.', status: upstream.status, detail }, 500);
  }

  // Forward the SSE stream straight through to the browser.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

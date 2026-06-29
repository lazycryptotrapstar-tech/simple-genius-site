/**
 * POST /api/genius/brief
 *
 * Receives the closing JSON brief from the client and forwards it to the n8n
 * intake webhook, authenticated with a shared secret header.
 *
 * Request body: the brief JSON object (forwarded verbatim).
 * Env:          N8N_BRIEF_WEBHOOK_URL, GENIUS_WEBHOOK_SECRET
 */
export async function onRequestPost({ request, env }) {
  if (!env.N8N_BRIEF_WEBHOOK_URL || !env.GENIUS_WEBHOOK_SECRET) {
    return json({ error: 'Server is missing N8N_BRIEF_WEBHOOK_URL or GENIUS_WEBHOOK_SECRET.' }, 500);
  }

  let brief;
  try {
    brief = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  let upstream;
  try {
    upstream = await fetch(env.N8N_BRIEF_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Genius-Secret': env.GENIUS_WEBHOOK_SECRET,
      },
      body: JSON.stringify(brief),
    });
  } catch (err) {
    return json({ error: 'Failed to reach n8n.', detail: String(err) }, 500);
  }

  if (!upstream.ok) {
    const detail = await safeText(upstream);
    return json({ error: 'n8n webhook error.', status: upstream.status, detail }, 500);
  }

  return json({ status: 'ok' }, 200);
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

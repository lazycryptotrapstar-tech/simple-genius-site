/**
 * POST /api/genius/brief
 *
 * Receives the closing JSON brief from the client, validates it against the
 * brief schema, and forwards the sanitized object to the n8n intake webhook,
 * authenticated with a shared secret header. Unknown fields are dropped —
 * arbitrary payloads never ride the trusted secret into n8n.
 *
 * Env: N8N_BRIEF_WEBHOOK_URL, GENIUS_WEBHOOK_SECRET
 */
import { json, originAllowed } from '../../_lib/http.js';

const MAX_BODY_BYTES = 131072; // 128 KB
const UPSTREAM_TIMEOUT_MS = 15000;

const TIERS = new Set(['platform', 'productized', 'referral_candidate']);
const CONFIDENCE = new Set(['high', 'medium', 'low']);
const BOOKING = new Set(['booked', 'pending', 'declined', 'n/a']);

export async function onRequestPost({ request, env }) {
  if (!env.N8N_BRIEF_WEBHOOK_URL || !env.GENIUS_WEBHOOK_SECRET) {
    return json({ error: 'Server is missing N8N_BRIEF_WEBHOOK_URL or GENIUS_WEBHOOK_SECRET.' }, 500);
  }
  if (!originAllowed(request)) {
    return json({ error: 'Forbidden.' }, 403);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ error: 'Unreadable body.' }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: 'Brief too large.' }, 413);
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const brief = sanitizeBrief(input);
  if (!brief) {
    return json({ error: 'Not a valid brief.' }, 400);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), UPSTREAM_TIMEOUT_MS);

  let upstream;
  try {
    upstream = await fetch(env.N8N_BRIEF_WEBHOOK_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'X-Genius-Secret': env.GENIUS_WEBHOOK_SECRET,
      },
      body: JSON.stringify(brief),
    });
  } catch (err) {
    console.error('brief: failed to reach n8n:', String(err));
    return json({ error: 'Could not deliver the brief. Email hello@simplegenius.io instead.' }, 502);
  } finally {
    clearTimeout(timer);
  }

  if (!upstream.ok) {
    // Log upstream detail server-side only — never echo internal error bodies.
    const detail = await safeText(upstream);
    console.error('brief: n8n error', upstream.status, detail.slice(0, 500));
    return json({ error: 'Could not deliver the brief. Email hello@simplegenius.io instead.' }, 502);
  }

  return json({ status: 'ok' }, 200);
}

/**
 * Rebuild the brief from a whitelist of known fields with type checks and size
 * caps, matching the schema in the Genius system prompt. Returns null when the
 * object is not recognizably a brief (a real brief always carries a prospect
 * with an email, and a classification).
 */
function sanitizeBrief(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;

  const prospect = input.prospect;
  const classification = input.classification;
  if (!prospect || typeof prospect !== 'object' || !classification || typeof classification !== 'object') return null;

  const email = str(prospect.email, 254);
  const name = str(prospect.name, 200);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) return null;

  const tier = TIERS.has(classification.tier) ? classification.tier : null;
  if (!tier) return null;

  return {
    captured_at: str(input.captured_at, 40),
    prospect: {
      name,
      company: str(prospect.company, 300),
      email,
      role: str(prospect.role, 200),
      referrer: str(prospect.referrer, 300),
    },
    classification: {
      tier,
      confidence: CONFIDENCE.has(classification.confidence) ? classification.confidence : 'low',
      rationale: str(classification.rationale, 1000),
    },
    problem_in_their_words: str(input.problem_in_their_words, 4000),
    diagnosis: str(input.diagnosis, 4000),
    suggested_first_build: str(input.suggested_first_build, 2000),
    budget_signals: str(input.budget_signals, 1000),
    timeline_signals: str(input.timeline_signals, 1000),
    tools_in_use: strArray(input.tools_in_use, 30, 200),
    projects_shown: strArray(input.projects_shown, 10, 300),
    call_agenda: strArray(input.call_agenda, 12, 500),
    risk_flags: strArray(input.risk_flags, 12, 500),
    booking_status: BOOKING.has(input.booking_status) ? input.booking_status : 'n/a',
    raw_transcript: transcript(input.raw_transcript),
  };
}

function str(v, max) {
  return typeof v === 'string' && v.length > 0 ? v.slice(0, max) : null;
}

function strArray(v, maxItems, maxLen) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x) => typeof x === 'string')
    .slice(0, maxItems)
    .map((x) => x.slice(0, maxLen));
}

function transcript(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(0, 64)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

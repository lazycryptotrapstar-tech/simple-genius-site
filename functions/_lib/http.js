/**
 * Shared helpers for the /api/* Pages Functions.
 */

const ALLOWED_HOSTS = new Set(['simplegenius.io', 'www.simplegenius.io']);

/**
 * Same-site gate for browser-originated POSTs. Browsers always attach an
 * Origin header to cross-site and same-site POST fetches and never let a page
 * forge it, so requiring an allowed Origin (or, failing that, Referer) blocks
 * casual scripted abuse and every cross-site browser call. `.pages.dev` covers
 * Cloudflare Pages preview deploys; localhost covers `wrangler pages dev`.
 */
export function originAllowed(request) {
  const raw = request.headers.get('origin') || request.headers.get('referer');
  if (!raw) return false;
  let host;
  try {
    host = new URL(raw).hostname;
  } catch {
    return false;
  }
  return (
    ALLOWED_HOSTS.has(host) ||
    host.endsWith('.pages.dev') ||
    host === 'localhost' ||
    host === '127.0.0.1'
  );
}

export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** SHA-256 of the connecting IP, truncated — stable per-visitor id for abuse attribution, no raw IP stored. */
export async function visitorId(request) {
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return null;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('genius:' + ip));
  return Array.from(new Uint8Array(digest).slice(0, 16), (b) => b.toString(16).padStart(2, '0')).join('');
}

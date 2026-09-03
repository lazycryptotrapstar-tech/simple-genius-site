# Simple Genius — simplegenius.io

The marketing site for Simple Genius, built with Vite + React. The hero is
**Genius**, a Claude-powered conversational intake agent that qualifies
prospects, surfaces live demo links, and emits a structured brief to an n8n
webhook. Claude is called server-side through a Cloudflare Pages Function so the
API key never reaches the browser; the brief is forwarded to n8n through a second
function authenticated with a shared secret.

The Genius system prompt lives server-side in `functions/_lib/geniusPrompt.js`
and never ships to the browser. Both API functions validate input, enforce
same-site Origin, cap payload sizes, and never echo upstream error bodies.

## Local development

```bash
npm install
npm run dev      # Vite dev server (http://localhost:5173)
```

> Note: the `/api/*` routes are Cloudflare Pages Functions. They don't run under
> the plain Vite dev server. To exercise Genius end-to-end locally, run the site
> through `wrangler pages dev` (or test against the Cloudflare preview deploy).

## Build

```bash
npm run build    # client build + SSR build + prerender into dist/
npm run preview  # preview the production build
```

The build has three steps: the client bundle, an SSR bundle
(`src/entry-server.jsx` → `dist-server/`), and `scripts/prerender.mjs`, which
injects the fully rendered page into `dist/index.html` so crawlers and social
unfurlers see real content. The client re-renders over the static HTML with
`createRoot` (no hydration contract).

## Deploy — Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Functions:** `functions/` is picked up automatically (`/api/genius`,
  `/api/genius/brief`).

### Required environment variables (Cloudflare Pages project)

| Variable | Used by | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | `functions/api/genius.js` | Server-side key for the Anthropic Messages API |
| `N8N_BRIEF_WEBHOOK_URL` | `functions/api/genius/brief.js` | n8n webhook that receives the structured brief |
| `GENIUS_WEBHOOK_SECRET` | `functions/api/genius/brief.js` | Shared secret sent as `X-Genius-Secret` to n8n |
| `GENIUS_MODEL` *(optional)* | `functions/api/genius.js` | Overrides the default model (`claude-sonnet-4-6`) |

## Project structure

```
index.html                     Head: SEO meta, canonical, favicons, JSON-LD
public/
  robots.txt  sitemap.xml      Crawler surface
  _headers                     Security headers + asset caching (Cloudflare Pages)
  og-image.png                 1200×630 social unfurl image (PNG — SVG og-images don't render)
  favicon.svg/.ico  icon-*.png apple-touch-icon.png  site.webmanifest
  privacy.html                 Static privacy page
  shots/                       Real screenshots for the Proof section
src/
  main.jsx                     React 18 root mount
  entry-server.jsx             SSR entry for the build-time prerender
  App.jsx                      Page composition
  styles/                      tokens.css, animations.css, global.css
  components/
    LogoDefs.jsx               Shared SVG <defs> (mounted once)
    Logo.jsx                   Gear-brain logo mark
    Watermark.jsx              Faint fixed background logo
    Nav.jsx  Hero.jsx  Footer.jsx
    Genius/                    useGenius.js, Genius.jsx, Genius.css
    polish/                    MagneticButton, NumberTicker (unused), MarqueeRow, SpotlightCard, ScrollReveal
    sections/                  Proof, HowItWorks, WhyUs, Contact
functions/
  _lib/                        geniusPrompt.js (server-side system prompt), http.js (shared guards)
  api/genius.js                Anthropic streaming proxy (validated, origin-gated, prompt-cached)
  api/genius/brief.js          n8n brief forwarder (schema-validated)
scripts/prerender.mjs          Injects rendered HTML into dist/index.html
```

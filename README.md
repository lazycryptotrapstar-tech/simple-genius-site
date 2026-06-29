# Simple Genius — simplegenius.io

The marketing site for Simple Genius, built with Vite + React. The hero is
**Genius**, a Claude-powered conversational intake agent that qualifies
prospects, surfaces live demo links, and emits a structured brief to an n8n
webhook. Claude is called server-side through a Cloudflare Pages Function so the
API key never reaches the browser; the brief is forwarded to n8n through a second
function authenticated with a shared secret.

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
npm run build    # outputs static assets to dist/
npm run preview  # preview the production build
```

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

## ⚠️ Before deploying

The Genius system prompt in `src/components/Genius/systemPrompt.js` is a
**placeholder**. Paste the Genius v2 system prompt into that file before any
production deploy — without it, the agent has no instructions.

## Project structure

```
index.html                     Vite entry (head preserved from the original site)
public/og-image.svg            OG image, served at site root
src/
  main.jsx                     React 18 root mount
  App.jsx                      Page composition
  styles/                      tokens.css, animations.css, global.css
  components/
    LogoDefs.jsx               Shared SVG <defs> (mounted once)
    Logo.jsx                   Gear-brain logo mark
    Watermark.jsx              Faint fixed background logo
    Nav.jsx  Hero.jsx  Footer.jsx
    Genius/                    systemPrompt.js, useGenius.js, Genius.jsx, Genius.css
    polish/                    MagneticButton, NumberTicker, MarqueeRow, SpotlightCard, ScrollReveal
    sections/                  Capabilities, HowItWorks, WhyUs, Contact
functions/api/
  genius.js                    Anthropic streaming proxy
  genius/brief.js              n8n brief forwarder
```

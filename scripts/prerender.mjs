/**
 * Build-time prerender: injects the server-rendered page into dist/index.html.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle in
 * dist-server/). Fails the build loudly if the render or injection fails —
 * never ship an empty page silently.
 */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const indexPath = fileURLToPath(new URL('dist/index.html', root));

const { render } = await import(new URL('dist-server/entry-server.js', root).href);
const appHtml = render();

if (!appHtml || appHtml.length < 1000) {
  throw new Error(`prerender: suspiciously short render output (${appHtml.length} chars)`);
}

const marker = '<div id="root"></div>';
const doc = readFileSync(indexPath, 'utf8');
if (!doc.includes(marker)) {
  throw new Error('prerender: could not find <div id="root"></div> in dist/index.html');
}

writeFileSync(indexPath, doc.replace(marker, `<div id="root">${appHtml}</div>`));
rmSync(fileURLToPath(new URL('dist-server', root)), { recursive: true, force: true });

console.log(`prerender: injected ${appHtml.length} chars of static HTML into dist/index.html`);

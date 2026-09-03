import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * Server entry for the build-time prerender step (scripts/prerender.mjs).
 * Renders the full page to static HTML so crawlers and social unfurlers see
 * real content instead of an empty <div id="root">. The client entry
 * (main.jsx) re-renders over it with createRoot — no hydration contract.
 */
export function render() {
  return renderToString(<App />);
}

import Logo from './Logo';

/**
 * Watermark — fixed, centered, faint background instance of the logo ("Genius
 * in the background"). 3.8% opacity, 0.5px blur, max 700px, pointer-events none,
 * z-index 0. Styling lives in .watermark (global.css); the gears still spin via
 * the shared gear classes. The big size lets the CSS width clamp take over.
 */
export default function Watermark() {
  return (
    <div className="watermark" aria-hidden="true">
      <Logo size={700} />
    </div>
  );
}

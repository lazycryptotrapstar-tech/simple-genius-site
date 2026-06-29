import { useRef, useState } from 'react';

/**
 * SpotlightCard — wraps children and renders a soft gold-tinted radial gradient
 * that follows the cursor while it's over the element. The gradient layer is
 * pointer-events: none so it never intercepts clicks/focus.
 *
 * Props: className (applied to the wrapper), children.
 */
export default function SpotlightCard({ children, className = '', style = {}, ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{ position: 'relative', ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(212,175,55,0.30), transparent 70%)`,
          zIndex: 0,
        }}
      />
      {children}
    </div>
  );
}

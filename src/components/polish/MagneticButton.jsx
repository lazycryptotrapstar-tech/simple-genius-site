import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const PROXIMITY = 40; // px from the button edge at which the magnet engages
const PULL = 0.35;    // fraction of the cursor offset the button travels

/**
 * MagneticButton — when the cursor comes within PROXIMITY px of the button, it
 * eases toward the cursor on a soft spring, snapping back on leave. Forwards all
 * button props (type, className, disabled, onClick, aria-label, children).
 */
export default function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 12, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 12, mass: 0.4 });

  useEffect(() => {
    const handleMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Distance from the cursor to the nearest point on the button rect.
      const dxEdge = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dyEdge = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dxEdge, dyEdge);

      if (dist < PROXIMITY) {
        x.set((e.clientX - cx) * PULL);
        y.set((e.clientY - cy) * PULL);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

import { motion } from 'framer-motion';

/**
 * ScrollReveal — fades + lifts its children into view once, using the site's
 * signature cubic-bezier(0.16, 1, 0.3, 1) easing.
 *
 * Props: children, className, plus any extra props forwarded to the wrapper.
 */
export default function ScrollReveal({ children, className = '', ...props }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

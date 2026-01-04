import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function Card({ 
  children, 
  className = '',
  glassmorphism = true,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-2xl p-6 shadow-xl',
        glassmorphism 
          ? 'backdrop-blur-md bg-white/70 border border-white/20 glass-shadow' 
          : 'bg-white',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}


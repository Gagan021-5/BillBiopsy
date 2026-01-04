import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function Button({ 
  children, 
  onClick, 
  disabled, 
  variant = 'primary',
  className = '',
  ...props 
}) {
  const baseStyles = 'px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#2563EB] to-[#1e40af] text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}


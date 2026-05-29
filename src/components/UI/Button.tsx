import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'ghost' | 'danger' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'gold',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  const variantClasses = {
    gold: 'bg-loom-gold hover:bg-loom-gold2 text-loom-bg font-semibold disabled:opacity-40',
    ghost: 'bg-transparent border border-loom-border hover:border-loom-gold text-loom-muted hover:text-loom-cream disabled:opacity-40',
    danger: 'bg-loom-error hover:bg-red-700 text-white font-semibold disabled:opacity-40',
    sage: 'bg-loom-sage hover:bg-loom-sage2 text-white font-semibold disabled:opacity-40',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        inline-flex items-center justify-center gap-2 transition-all duration-200
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

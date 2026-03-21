import React from 'react';
import { motion } from 'framer-motion';

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'md',
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantBase = {
    default: 'liquid-button',
    primary: 'liquid-button',
    ghost: 'bg-transparent hover:bg-foreground/5 rounded-full border-none',
  };

  return (
    <motion.button
      className={`
        ${variantBase[variant]}
        ${sizeStyles[size]}
        font-medium tracking-wide text-foreground
        transition-all duration-200
        flex items-center justify-center gap-2
        min-h-[44px]
        ${className}
      `}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default LiquidButton;

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: 'purple' | 'blue' | 'none';
  hoverGlow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, glow = 'none' }) => {
  const glowStyles = {
    purple: 'shadow-[0_8px_32px_hsl(265_90%_65%/0.2)]',
    blue: 'shadow-[0_8px_32px_hsl(210_100%_60%/0.2)]',
    none: '',
  };

  return (
    <div className="relative">
      <motion.div
        className={`glass ${glowStyles[glow]} ${className} relative z-10`}
        onClick={onClick}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
};

export default GlassCard;

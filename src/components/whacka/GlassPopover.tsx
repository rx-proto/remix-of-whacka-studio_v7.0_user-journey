import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const GlassPopover: React.FC<GlassPopoverProps> = ({ isOpen, onClose, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-sm popover-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`fixed z-50 right-4 top-20 liquid-glass rounded-2xl p-2 min-w-[180px] ${className}`}
            style={{ background: 'hsl(0 0% 100% / 0.03)', transformOrigin: 'top right' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlassPopover;

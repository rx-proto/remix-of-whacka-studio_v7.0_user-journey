import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

interface WhackaMascotProps {
  isActive: boolean;
  onTap: () => void;
  onLongPress: () => void;
}

const WhackaMascot: React.FC<WhackaMascotProps> = ({ isActive, onTap, onLongPress }) => {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handlePressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!isLongPress.current) {
      onTap();
    }
  };

  const handlePressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressCancel}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressCancel}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.div
            key="mic"
            className="w-16 h-16 rounded-full flex items-center justify-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'radial-gradient(circle at 40% 40%, #D4D3FB 0%, #E396C0 35%, #FF21E3 60%, #89C2FF 80%, #C3FFFF 100%)',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 30px 8px rgba(227, 217, 250, 0.5), inset 0 0 20px rgba(224, 237, 255, 0.6)',
            }}
          >
            {/* Outer frosted ring */}
            <div
              className="absolute inset-[-8px] rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(246,252,254,0.9) 13%, rgba(242,239,255,0.7) 57%, rgba(246,255,251,0.6) 100%)',
                filter: 'blur(6px)',
                zIndex: -1,
              }}
            />
            <Mic size={22} className="text-white/90 relative z-10 drop-shadow-sm" />
          </motion.div>
        ) : (
          <motion.div
            key="mascot"
            className="w-16 h-16 rounded-full flex items-center justify-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'radial-gradient(circle at 40% 40%, #D4D3FB 0%, #E396C0 35%, #FF21E3 60%, #89C2FF 80%, #C3FFFF 100%)',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 30px 8px rgba(227, 217, 250, 0.5), inset 0 0 20px rgba(224, 237, 255, 0.6)',
            }}
          >
            <div
              className="absolute inset-[-8px] rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(246,252,254,0.9) 13%, rgba(242,239,255,0.7) 57%, rgba(246,255,251,0.6) 100%)',
                filter: 'blur(6px)',
                zIndex: -1,
              }}
            />
            {/* Sparkle star icons matching reference */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="relative z-10 drop-shadow-sm">
              {/* Main 4-point star */}
              <path
                d="M18 3 C18 3, 20 13, 20.5 15.5 C21 18, 33 18, 33 18 C33 18, 21 18, 20.5 20.5 C20 23, 18 33, 18 33 C18 33, 16 23, 15.5 20.5 C15 18, 3 18, 3 18 C3 18, 15 18, 15.5 15.5 C16 13, 18 3, 18 3Z"
                fill="url(#starGradient)"
              />
              {/* Small star bottom-left */}
              <path
                d="M9 24 C9 24, 10 27, 10.5 28 C11 29, 14 29, 14 29 C14 29, 11 29, 10.5 30 C10 31, 9 34, 9 34 C9 34, 8 31, 7.5 30 C7 29, 4 29, 4 29 C4 29, 7 29, 7.5 28 C8 27, 9 24, 9 24Z"
                fill="url(#starGradient2)"
              />
              {/* Tiny star */}
              <path
                d="M7 20 C7 20, 7.5 21.5, 7.7 22 C7.9 22.5, 9.5 22.5, 9.5 22.5 C9.5 22.5, 7.9 22.5, 7.7 23 C7.5 23.5, 7 25, 7 25 C7 25, 6.5 23.5, 6.3 23 C6.1 22.5, 4.5 22.5, 4.5 22.5 C4.5 22.5, 6.1 22.5, 6.3 22 C6.5 21.5, 7 20, 7 20Z"
                fill="url(#starGradient2)"
              />
              <defs>
                <linearGradient id="starGradient" x1="18" y1="4" x2="18" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(240,230,255,0.75)" />
                </linearGradient>
                <linearGradient id="starGradient2" x1="9" y1="24" x2="9" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                  <stop offset="100%" stopColor="rgba(235,225,255,0.65)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WhackaMascot;

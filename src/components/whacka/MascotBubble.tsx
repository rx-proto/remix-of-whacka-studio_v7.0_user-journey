import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const tips = ['长按语音输入', '点我文本输入', '点我添加附件'];

interface MascotBubbleProps {
  isActive: boolean;
}

const MascotBubble: React.FC<MascotBubbleProps> = ({ isActive }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(false);
      return;
    }

    const firstTimer = setTimeout(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }, 3000);

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }, 10000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <AnimatePresence>
      {visible && !isActive && (
        <motion.div
          className="absolute -top-12 -left-2 whitespace-nowrap z-50"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
        >
          <div className="glass-button px-3 py-1.5 text-xs text-foreground/80 rounded-xl flex items-center gap-1.5">
            <Lightbulb size={12} className="text-muted-foreground" />
            {tips[tipIndex]}
          </div>
          {/* Triangle tail pointing toward mascot (bottom-right) */}
          <svg
            className="absolute -bottom-1.5 right-3"
            width="10"
            height="8"
            viewBox="0 0 10 8"
            style={{ pointerEvents: 'none' }}
          >
            <path d="M2 0L8 0L5 8Z" className="fill-foreground/[0.05]" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MascotBubble;

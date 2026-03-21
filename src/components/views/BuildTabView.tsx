import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Square } from 'lucide-react';

const IDEAS = [
  'Build a "turn me into a magic character" generator',
  'Create a pet mood tracker with behavior predictions',
  'Make a daily fortune cookie with generative art',
  'Design a recipe app that uses fridge photos',
  'Build a habit tracker with streak animations',
  'Create a dream journal with AI interpretations',
  'Make a plant care reminder with photo diagnosis',
  'Build a movie night picker for couples',
  'Design a micro-journal that asks one question daily',
  'Create a walk tracker that draws art from routes',
  'Build a language flashcard app with spaced repetition',
  'Make a birthday countdown with gift idea suggestions',
  'Create a mood playlist generator from selfies',
  'Build a travel bucket list with cost estimates',
  'Design a daily sketch challenge app',
  'Make a gratitude jar that shows past entries randomly',
];

interface BuildTabViewProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onBubbleClick: (text: string) => void;
  onMicPressStart: () => void;
  onMicPressEnd: () => void;
  onMicPressCancel: () => void;
  isBuilding: boolean;
  onStopBuild?: () => void;
}

// Generate random but stable bubble positions
const generateBubbleLayout = (count: number) => {
  const bubbles: Array<{ x: number; y: number; delay: number; duration: number; dx: number; dy: number }> = [];
  const rng = (seed: number) => {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  };
  const rand = rng(42);

  for (let i = 0; i < count; i++) {
    bubbles.push({
      x: rand() * 80 + 5,       // 5-85% from left
      y: rand() * 55 + 5,       // 5-60% from top
      delay: rand() * 3,
      duration: 3 + rand() * 3, // 3-6s float cycle
      dx: (rand() - 0.5) * 12,  // float range x
      dy: (rand() - 0.5) * 10,  // float range y
    });
  }
  return bubbles;
};

const BUBBLE_LAYOUT = generateBubbleLayout(IDEAS.length);

const BuildTabView: React.FC<BuildTabViewProps> = ({
  inputText,
  onInputChange,
  onSend,
  onBubbleClick,
  onMicPressStart,
  onMicPressEnd,
  onMicPressCancel,
  isBuilding,
  onStopBuild,
}) => {
  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Floating idea bubbles area */}
      <div className="flex-1 relative overflow-hidden">
        {IDEAS.map((idea, i) => {
          const layout = BUBBLE_LAYOUT[i];
          return (
            <motion.button
              key={i}
              className="absolute max-w-[200px] px-3 py-2 rounded-2xl text-[12px] leading-snug text-left"
              style={{
                left: `${layout.x}%`,
                top: `${layout.y}%`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.45)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.06)',
                color: 'rgba(0,0,0,0.55)',
              }}
              onClick={() => onBubbleClick(idea)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                x: [0, layout.dx, 0],
                y: [0, layout.dy, 0],
              }}
              transition={{
                opacity: { duration: layout.duration, repeat: Infinity, delay: layout.delay, ease: 'easeInOut' },
                x: { duration: layout.duration, repeat: Infinity, delay: layout.delay, ease: 'easeInOut' },
                y: { duration: layout.duration, repeat: Infinity, delay: layout.delay, ease: 'easeInOut' },
              }}
            >
              {idea}
            </motion.button>
          );
        })}
      </div>

      {/* Input box – positioned above nav bar */}
      <div className="px-4 pb-[calc(env(safe-area-inset-bottom,0px)+24px+56px+16px)]">
        <div
          className="w-full rounded-2xl px-3 py-2.5 flex flex-col gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.3) 100%)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Describe your app idea..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm min-w-0 resize-none leading-relaxed"
            style={{ minHeight: '3.5rem' }}
            rows={2}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            disabled={isBuilding}
          />

          <div className="flex items-center justify-end gap-1.5">
            <motion.button
              className="p-1.5 rounded-full text-muted-foreground flex items-center justify-center flex-shrink-0"
              style={{ minHeight: 32, minWidth: 32 }}
              whileTap={{ scale: 0.9 }}
              onMouseDown={onMicPressStart}
              onMouseUp={onMicPressEnd}
              onMouseLeave={onMicPressCancel}
              onTouchStart={onMicPressStart}
              onTouchEnd={(e) => { e.preventDefault(); onMicPressEnd(); }}
              onTouchCancel={onMicPressCancel}
            >
              <Mic size={18} />
            </motion.button>

            {isBuilding ? (
              <motion.button
                onClick={onStopBuild}
                className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                whileTap={{ scale: 0.9 }}
              >
                <motion.svg className="absolute inset-0" width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="2" />
                  <motion.circle
                    cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="100"
                    strokeDashoffset="75"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                  />
                </motion.svg>
                <Square size={12} className="text-primary relative z-10" fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                onClick={onSend}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.35) 100%)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[45%] rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 100%)',
                    filter: 'blur(1px)',
                  }}
                />
                <Send size={14} className="text-foreground relative z-10" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildTabView;

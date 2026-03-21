import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Square } from 'lucide-react';

const IDEAS = [
  'Build a magic character generator',
  'Create a pet mood tracker',
  'Make a daily fortune cookie app',
  'Design a recipe finder from fridge photos',
  'Build a habit tracker with streaks',
  'Create a dream journal with AI',
  'Make a plant care reminder app',
  'Build a movie night picker',
  'Design a micro-journal app',
  'Create a mood playlist generator',
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

// 2-column grid layout with jitter to avoid overlaps
const generateBubbleLayout = (count: number) => {
  const cols = 2;
  const rows = Math.ceil(count / cols);
  const cellW = 88 / cols;
  const cellH = 75 / rows;

  const rng = (seed: number) => {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  };
  const rand = rng(42);

  const bubbles: Array<{ x: number; y: number; delay: number; duration: number; dx: number; dy: number }> = [];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = 4 + col * cellW;
    const baseY = 2 + row * cellH;
    bubbles.push({
      x: baseX + rand() * (cellW * 0.35),
      y: baseY + rand() * (cellH * 0.3),
      delay: rand() * 4,
      duration: 4 + rand() * 3,
      dx: (rand() - 0.5) * 6,
      dy: (rand() - 0.5) * 5,
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
      {/* Warm gradient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: '70vw',
            height: '70vw',
            left: '15%',
            bottom: '18%',
            background: 'radial-gradient(circle, rgba(255,127,110,0.18) 0%, rgba(255,127,110,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '60vw',
            height: '60vw',
            left: '30%',
            bottom: '25%',
            background: 'radial-gradient(circle, rgba(255,160,90,0.15) 0%, rgba(255,160,90,0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '55vw',
            height: '55vw',
            left: '20%',
            bottom: '30%',
            background: 'radial-gradient(circle, rgba(255,220,130,0.14) 0%, rgba(255,220,130,0) 70%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      {/* Floating idea bubbles area */}
      <div className="flex-1 relative overflow-hidden pt-14">
        {IDEAS.map((idea, i) => {
          const layout = BUBBLE_LAYOUT[i];
          return (
            <motion.button
              key={i}
              className="absolute max-w-[160px] px-3 py-2 rounded-2xl text-[11px] leading-snug text-left text-slate-700"
              style={{
                left: `${layout.x}%`,
                top: `${layout.y}%`,
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onClick={() => onBubbleClick(idea)}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
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

      {/* Input box – flat, minimal shadow */}
      <div className="relative z-10 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+24px+56px+16px)]">
        <div
          className="w-full rounded-2xl px-3 py-2.5 flex flex-col gap-2"
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
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

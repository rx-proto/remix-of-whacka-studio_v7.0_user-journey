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
  const cellW = 90 / cols;
  // Bubbles span from ~20% to ~85% of the container height
  const startY = 20;
  const endY = 85;
  const totalH = endY - startY;
  const cellH = totalH / rows;

  const rng = (seed: number) => {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  };
  const rand = rng(42);

  const bubbles: Array<{ x: number; y: number; delay: number; duration: number; dx: number; dy: number; bgAlpha: number }> = [];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = 6 + col * cellW;
    const baseY = startY + row * cellH;
    bubbles.push({
      x: baseX + rand() * (cellW * 0.3),
      y: baseY + rand() * (cellH * 0.2),
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
    <div className="relative flex flex-col h-full overflow-hidden pb-[calc(env(safe-area-inset-bottom,0px)+56px+16px)]">
      {/* Warm gradient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: '90vw',
            height: '90vw',
            left: '5%',
            top: '5%',
            background: 'radial-gradient(circle, rgba(255,200,160,0.13) 0%, rgba(255,200,160,0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '100vw',
            height: '100vw',
            left: '0%',
            top: '15%',
            background: 'radial-gradient(circle, rgba(255,127,110,0.18) 0%, rgba(255,127,110,0) 65%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '85vw',
            height: '85vw',
            left: '20%',
            top: '25%',
            background: 'radial-gradient(circle, rgba(255,160,90,0.16) 0%, rgba(255,160,90,0) 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '80vw',
            height: '80vw',
            left: '10%',
            top: '40%',
            background: 'radial-gradient(circle, rgba(255,220,130,0.15) 0%, rgba(255,220,130,0) 65%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Floating idea bubbles area */}
      <div className="flex-1 relative overflow-hidden pt-14 z-0">
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

      {/* Input box – flat, minimal shadow, moved up */}
      <div className="relative z-30 px-4 pb-4 -mt-12">
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
            placeholder="Describe your app idea...（这里idea bubble位置不变，输入框靠近bubble下方，而不是现在这种太低了的，但我调不了）"
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm min-w-0 resize-none leading-relaxed"
            style={{ minHeight: '3.5rem' }}
            rows={2}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            disabled={isBuilding}
          />

          <div className="flex items-center justify-between">
            {/* Free credits indicator */}
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/>
              </svg>
              <span className="text-[11px] text-slate-900">Free credits <span style={{ color: '#F97316' }}>13</span>/15</span>
            </div>

            <div className="flex items-center gap-1.5">
              <motion.button
                className="p-1.5 rounded-full text-slate-900 flex items-center justify-center flex-shrink-0"
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
    </div>
  );
};

export default BuildTabView;

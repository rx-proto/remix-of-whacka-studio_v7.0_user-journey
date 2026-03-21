import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Mic, Send, Square } from 'lucide-react';
import cardMagic from '@/assets/card-magic-character.jpg';
import cardFortune from '@/assets/card-fortune-cookie.jpg';
import cardPet from '@/assets/card-pet-mood.jpg';

const IDEA_CARDS = [
  { title: 'Magic Character Generator', description: 'Build a "turn me into a magic character" generator', image: cardMagic },
  { title: 'Daily Fortune Cookie', description: 'Build a daily fortune cookie app that gives me a unique motivational quote with generative art each morning', image: cardFortune },
  { title: 'Pet Mood Tracker', description: 'Create a pet mood tracker where I log my cat\'s behavior and it predicts their mood patterns', image: cardPet },
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
  const [currentCard, setCurrentCard] = useState(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) {
      setCurrentCard(prev => prev < IDEA_CARDS.length - 1 ? prev + 1 : 0);
    } else if (info.offset.x > 50) {
      setCurrentCard(prev => prev > 0 ? prev - 1 : IDEA_CARDS.length - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-[120px] pt-16">
      {/* Idea Cards */}
      <div className="relative w-full max-w-[280px] mb-10 flex-shrink-0" style={{ height: 330, perspective: 800 }}>
        {IDEA_CARDS.map((card, i) => {
          const offset = ((i - currentCard) % IDEA_CARDS.length + IDEA_CARDS.length) % IDEA_CARDS.length;
          if (offset > 2) return null;
          const isActive = offset === 0;
          return (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                border: isActive ? '1.5px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.35)',
                boxShadow: isActive
                  ? '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.1)'
                  : '0 4px 20px rgba(0,0,0,0.06)',
                transformOrigin: 'center center',
              }}
              animate={{
                x: offset === 0 ? 0 : offset === 1 ? 60 : 90,
                y: offset === 0 ? 0 : offset === 1 ? -20 : -30,
                scale: 1 - offset * 0.08,
                rotateZ: offset === 0 ? 0 : offset * 5,
                opacity: 1 - offset * 0.2,
                zIndex: 10 - offset,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={() => isActive && onBubbleClick(card.description)}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={isActive ? handleDragEnd : undefined}
              whileDrag={isActive ? { rotateZ: -3, scale: 1.02 } : undefined}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${card.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <div className={`relative flex flex-col items-center justify-center h-full px-7 text-center ${!isActive ? 'pointer-events-none' : 'cursor-pointer'}`}>
                <h3 className="text-[19px] font-bold mb-2 text-white drop-shadow-lg">{card.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/90 drop-shadow-md">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input box – liquid glass style */}
      <div
        className="w-full max-w-[420px] rounded-2xl px-3 py-2.5 flex flex-col gap-2"
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
          placeholder="Write your idea, quickly build your app..."
          className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none text-sm min-w-0 resize-none leading-relaxed"
          style={{ minHeight: '4.5rem' }}
          rows={3}
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
              {/* White highlight */}
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
  );
};

export default BuildTabView;

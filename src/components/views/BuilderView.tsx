import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Loader2, ExternalLink, Copy, Send, Paperclip, Mic, Pencil, Share, X, Clock } from 'lucide-react';
import SegmentedControl from '../whacka/SegmentedControl';
import GlassCard from '../whacka/GlassCard';
import LiquidButton from '../whacka/LiquidButton';
import GlassPopover from '../whacka/GlassPopover';

interface BuilderViewProps {
  prompt: string;
  onBack: () => void;
}

const thinkingSteps = [
  'Analyzing your idea...',
  'Generating database schema...',
  'Building UI components...',
  'Polishing the design...',
  'Almost ready! ✨',
];

const sampleApps = [
  { emoji: '💰', name: '记账小能手', desc: '智能记录每一笔开支' },
  { emoji: '📊', name: '预算追踪器', desc: '可视化你的财务目标' },
];

const BuilderView: React.FC<BuilderViewProps> = ({ prompt, onBack }) => {
  const [mode, setMode] = useState(0);
  const [buildPhase, setBuildPhase] = useState(0);
  const [isBuilding, setIsBuilding] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [previewFromCard, setPreviewFromCard] = useState(false);

  useEffect(() => {
    if (!isBuilding) return;
    const timers: NodeJS.Timeout[] = [];
    thinkingSteps.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setBuildPhase(i);
        if (i === thinkingSteps.length - 1) {
          setTimeout(() => {
            setIsBuilding(false);
            setTimeout(() => setIsReady(true), 3000);
          }, 800);
        }
      }, (i + 1) * 1200));
    });
    return () => timers.forEach(clearTimeout);
  }, [isBuilding]);

  const handleCardPreview = () => {
    setPreviewFromCard(true);
    setMode(1);
  };

  const handleBack = () => {
    if (previewFromCard) {
      setPreviewFromCard(false);
      setMode(0);
    } else {
      onBack();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-background z-40 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <motion.button
          onClick={handleBack}
          className="liquid-button w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-muted-foreground"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <SegmentedControl tabs={['Chat', 'Preview']} activeTab={mode} onChange={setMode} />
        <div className="w-10" />
      </div>

      {/* Share Popover */}
      <GlassPopover isOpen={showShare} onClose={() => setShowShare(false)} className="min-w-[300px] left-4 right-4 top-16 p-5 space-y-5">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center text-4xl">📱</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <Pencil size={12} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="glass-subtle rounded-xl px-3 py-2.5">
          <p className="text-sm text-muted-foreground">A budget tracking app with expense categories and savings goals.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground mb-1.5">url</p>
          <div className="glass-subtle rounded-xl px-3 py-2.5 flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex-1 truncate">whacka.app/my-budget-app-x7k2</span>
            <button className="text-primary p-1"><Copy size={14} /></button>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1.5">qrcode <span className="text-xs">（长按保存）</span></p>
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-muted/50 rounded-xl flex items-center justify-center"><span className="text-3xl">📲</span></div>
          </div>
        </div>
        <div className="flex gap-2">
          <LiquidButton className="flex-1" size="sm">仅保存</LiquidButton>
          <LiquidButton variant="primary" className="flex-1" size="sm">保存并发布</LiquidButton>
        </div>
      </GlassPopover>

      {/* Content */}
      <motion.div
        className="flex-1 overflow-y-auto px-4 pb-24"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80 && mode === 0) setMode(1);
          if (info.offset.x > 80 && mode === 1) setMode(0);
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence mode="wait">
          {mode === 0 ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 py-4"
            >
              {/* User message */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] relative overflow-hidden"
                  style={{
                    background: 'hsl(0 0% 50% / 0.12)',
                    backdropFilter: 'blur(24px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                    border: '1px solid hsl(0 0% 100% / 0.08)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <p className="text-sm text-foreground relative z-10">{prompt}</p>
                </div>
              </div>

              {/* AI Response - Building + sample apps inside */}
              <div className="flex justify-start">
                <GlassCard className="p-4 max-w-[85%] space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {isBuilding ? (
                        <Loader2 size={14} className="animate-spin text-primary" />
                      ) : (
                        <Check size={14} className="text-emerald-400" />
                      )}
                      <span>{isBuilding ? 'Building your app...' : 'Build complete'}</span>
                    </div>
                    {thinkingSteps.map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: i <= buildPhase ? 1 : 0.3, x: 0 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        {i < buildPhase ? (
                          <Check size={14} className="text-emerald-400" />
                        ) : i === buildPhase ? (
                          <Loader2 size={14} className="animate-spin text-primary" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />
                        )}
                        <span className={i <= buildPhase ? 'text-foreground' : 'text-muted-foreground'}>
                          {step}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Estimated time + sample apps - always visible inside the card */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="space-y-3 pt-3 border-t border-muted-foreground/10 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} className="text-amber-500 flex-shrink-0" />
                      <span>预计需要 <strong className="text-foreground">60s</strong> 生成，先看看类似的应用？</span>
                    </div>
                    <div className="space-y-2">
                      {sampleApps.map((app) => (
                        <motion.button
                          key={app.name}
                          onClick={handleCardPreview}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                          style={{
                            background: 'hsl(0 0% 50% / 0.08)',
                            border: '1px solid hsl(0 0% 100% / 0.06)',
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-xl flex-shrink-0">
                            {app.emoji}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{app.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.desc}</p>
                          </div>
                          <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </GlassCard>
              </div>

              {/* Ready message */}
              {isReady && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-start"
                >
                  <GlassCard className="p-4 max-w-[85%] space-y-3">
                    <div className="space-y-3">
                      <p className="text-sm text-foreground">Your app is ready! 🎉</p>
                      <p className="text-sm text-muted-foreground">
                        I've built a fully functional app based on your description. Switch to Preview to see it in action, or keep chatting to make changes.
                      </p>
                      <div className="flex justify-end">
                        <motion.button
                          onClick={() => setMode(1)}
                          className="liquid-button px-3 py-1.5 rounded-full text-xs font-medium text-foreground flex items-center gap-1.5"
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={12} />
                          Preview
                        </motion.button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-4"
            >
              <GlassCard className="overflow-hidden aspect-[9/16]" glow="purple">
                <div className="w-full h-full bg-gradient-to-b from-secondary/50 to-background flex items-center justify-center">
                  <div className="text-center space-y-4 px-6">
                    <span className="text-5xl">📱</span>
                    <h3 className="text-lg font-semibold text-foreground">App Preview</h3>
                    <p className="text-sm text-muted-foreground">Your generated app would render here</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Input - iOS style */}
      {mode === 0 && !isBuilding && isReady && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe space-y-2.5">
          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <p className="text-[13px] text-slate-700 leading-snug flex-1">
                  Your app is auto saved & published. Share or add to phone screen through{' '}
                  <Share size={13} className="inline-block text-slate-500 -mt-0.5" />{' '}
                  anytime!
                </p>
                <button onClick={() => setShowTip(false)} className="text-slate-400 mt-0.5 flex-shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="liquid-glass rounded-2xl p-3 space-y-2.5">
            <textarea
              placeholder="Ask for changes..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none resize-none text-sm leading-relaxed min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <motion.button
                  className="liquid-button p-2.5 rounded-full text-muted-foreground min-h-[36px] min-w-[36px] flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <Paperclip size={16} />
                </motion.button>
                <motion.button
                  className="liquid-button p-2.5 rounded-full text-muted-foreground min-h-[36px] min-w-[36px] flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic size={16} />
                </motion.button>
              </div>
              <motion.button
                className="liquid-button px-4 py-2 text-sm font-medium text-foreground flex items-center gap-2 min-h-[36px]"
                whileTap={{ scale: 0.95 }}
              >
                <Send size={14} />
                Send
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BuilderView;

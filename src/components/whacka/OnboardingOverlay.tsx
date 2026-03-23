import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  content: React.ReactNode;
  spotlight?: { cx: number; cy: number; r: number };
  textPosition: 'center' | 'above-bottom' | 'below-top';
  showDots?: boolean;
  dotIndex?: number; // index among dot-steps (0-3)
}

const TOTAL_DOT_STEPS = 4;

const STORAGE_KEY = 'whacka-onboarding-done';

interface OnboardingOverlayProps {
  forceShow?: boolean;
  onDone?: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ forceShow, onDone }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  const steps: OnboardingStep[] = [
    // Step 0: Welcome — no dots, show "tap anywhere" hint
    {
      content: (
        <p className="text-[15px] leading-relaxed text-white font-medium">
          Welcome to Whacka! You can create your own apps here and explore apps made by others.
        </p>
      ),
      textPosition: 'center',
      showDots: false,
    },
    // Step 1: Explore — dot 0
    {
      content: (
        <p className="text-[15px] leading-relaxed text-white font-medium">
          Browse apps made by others on the <span style={{ color: '#F97316', fontWeight: 600 }}>Explore</span> page.
        </p>
      ),
      spotlight: { cx: 288, cy: 792, r: 38 },
      textPosition: 'above-bottom',
      showDots: true,
      dotIndex: 0,
    },
    // Step 2: Create — dot 1
    {
      content: (
        <p className="text-[15px] leading-relaxed text-white font-medium">
          Create your app here. You get <span style={{ color: '#F97316', fontWeight: 600 }}>15 free credits daily</span> — earn bonus credits by creating and inviting friends.
        </p>
      ),
      spotlight: { cx: 195, cy: 792, r: 38 },
      textPosition: 'above-bottom',
      showDots: true,
      dotIndex: 1,
    },
    // Step 3: Home — dot 2
    {
      content: (
        <p className="text-[15px] leading-relaxed text-white font-medium">
          View your <span style={{ color: '#F97316', fontWeight: 600 }}>created, remixed and bookmarked</span> apps in Home.
        </p>
      ),
      spotlight: { cx: 102, cy: 792, r: 38 },
      textPosition: 'above-bottom',
      showDots: true,
      dotIndex: 2,
    },
    // Step 4: Bulb — dot 3
    {
      content: (
        <p className="text-[15px] leading-relaxed text-slate-800 font-medium">
          Whacka lets you add any app to your phone's home screen and use it <span style={{ color: '#F97316', fontWeight: 600 }}>like a native app</span>. You can always find the instructions here.
        </p>
      ),
      spotlight: { cx: 305, cy: 38, r: 28 },
      textPosition: 'below-top',
      showDots: true,
      dotIndex: 3,
    },
    // Step 5: Have fun — no dots
    {
      content: (
        <div className="flex flex-col items-center gap-1">
          <span className="text-[22px] font-bold text-slate-800">
            Have fun in{' '}
            <span
              style={{
                fontFamily: "'Pacifico', cursive",
                fontSize: '22px',
                color: '#F97316',
                fontWeight: 400,
              }}
            >
              Whacka
            </span>
          </span>
          <button
            onClick={() => {}}
            className="mt-4 px-8 py-2.5 rounded-full text-white font-semibold text-[15px]"
            style={{ backgroundColor: '#F97316' }}
            data-dismiss="true"
          >
            Yes I will!
          </button>
        </div>
      ),
      textPosition: 'center',
      showDots: false,
    },
  ];

  useEffect(() => {
    if (forceShow) { setVisible(true); setStep(0); return; }
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, [forceShow]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    onDone?.();
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else dismiss();
  };

  const handleSkip = () => dismiss();

  if (!visible) return null;

  const current = steps[step];
  const sp = current.spotlight;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onboarding"
          className="fixed inset-0 z-[99999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleNext}
        >
          {/* Dark overlay with circular cutout */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <mask id="onboarding-mask">
                <rect width="100%" height="100%" fill="white" />
                {sp && <circle cx={sp.cx} cy={sp.cy} r={sp.r} fill="black" />}
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.72)" mask="url(#onboarding-mask)" />
          </svg>

          {/* Orange ring around spotlight */}
          {sp && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: sp.cx - sp.r - 3,
                top: sp.cy - sp.r - 3,
                width: (sp.r + 3) * 2,
                height: (sp.r + 3) * 2,
                borderRadius: '50%',
                border: '2.5px solid #F97316',
              }}
            />
          )}

          {/* Text card */}
          <div
            className="absolute left-0 right-0 z-10 flex flex-col items-center px-6"
            style={{
              ...(current.textPosition === 'center' && { top: '50%', transform: 'translateY(-50%)' }),
              ...(current.textPosition === 'above-bottom' && { bottom: 120 }),
              ...(current.textPosition === 'below-top' && { top: 80 }),
            }}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="text-center max-w-[300px] bg-white rounded-2xl px-6 py-5"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            >
              {current.content}

              {/* Welcome step: tap hint instead of dots */}
              {step === 0 && (
                <p className="text-[12px] text-slate-400 mt-4">Tap anywhere to continue</p>
              )}

              {/* Dots for middle steps only */}
              {current.showDots && (
                <div className="flex items-center justify-center gap-1.5 mt-4">
                  {Array.from({ length: TOTAL_DOT_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: i === current.dotIndex ? 18 : 6,
                        backgroundColor: i === current.dotIndex ? '#F97316' : '#e2e8f0',
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Skip — top left, hidden on first and last */}
          {step > 0 && step < steps.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleSkip(); }}
              className="absolute top-14 left-5 z-20 text-[13px] text-white/80 font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingOverlay;

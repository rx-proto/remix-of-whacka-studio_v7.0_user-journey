import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  text: string;
  spotlight?: { cx: number; cy: number; r: number };
  textPosition: 'center' | 'above-bottom' | 'below-top';
}

// Viewport 390x844
// Bottom bar: px-14 (56px), height 56, bottom offset ~24px => bar top ~764, bar bottom ~820
// Bar inner width = 278, starts x=56. 3 tabs each ~93px wide.
// Home center: 56+46=102, Create center: 56+139=195, Explore center: 56+232=288
// Tab vertical center: 764 + 28 = 792
// Lightbulb: top bar px-4, right group gap-1. Approx center x=300, y=36

const STEPS: OnboardingStep[] = [
  {
    text: 'Welcome to Whacka! You can create your own apps here and explore apps made by others.',
    textPosition: 'center',
  },
  {
    text: 'Browse apps made by others on the Explore page.',
    spotlight: { cx: 288, cy: 792, r: 38 },
    textPosition: 'above-bottom',
  },
  {
    text: 'Create your app here. You get 15 free credits daily — earn bonus credits by creating and inviting friends.',
    spotlight: { cx: 195, cy: 792, r: 38 },
    textPosition: 'above-bottom',
  },
  {
    text: 'View your created, remixed, and bookmarked apps in Home.',
    spotlight: { cx: 102, cy: 792, r: 38 },
    textPosition: 'above-bottom',
  },
  {
    text: "Whacka lets you add any app to your phone's home screen and use it like a native app. You can always find the instructions here.",
    spotlight: { cx: 300, cy: 38, r: 28 },
    textPosition: 'below-top',
  },
  {
    text: 'Have fun in Whacka! 🎉',
    textPosition: 'center',
  },
];

const STORAGE_KEY = 'whacka-onboarding-done';

interface OnboardingOverlayProps {
  forceShow?: boolean;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ forceShow }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceShow) { setVisible(true); return; }
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, [forceShow]);

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else { setVisible(false); localStorage.setItem(STORAGE_KEY, 'true'); }
  };

  const handleSkip = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!visible) return null;

  const current = STEPS[step];
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
          {/* Dark overlay with circular cutout via SVG mask */}
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
              ...(current.textPosition === 'above-bottom' && { bottom: 160 }),
              ...(current.textPosition === 'below-top' && { top: 90 }),
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
              <p className="text-[15px] leading-relaxed text-slate-800 font-medium">
                {current.text}
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 18 : 6,
                      backgroundColor: i === step ? '#F97316' : '#e2e8f0',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Skip — top left */}
          {step < STEPS.length - 1 && (
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

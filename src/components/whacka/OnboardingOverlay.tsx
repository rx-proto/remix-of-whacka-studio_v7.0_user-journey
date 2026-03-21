import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  text: string;
  spotlight?: { x: string; y: string; width: string; height: string; borderRadius: string };
  textPosition: 'center' | 'above-bottom' | 'below-top';
}

const STEPS: OnboardingStep[] = [
  {
    text: 'Welcome to Whacka! You can create your own apps here and explore apps made by others.',
    textPosition: 'center',
  },
  {
    text: 'Browse apps made by others on the Explore page.',
    spotlight: { x: 'calc(100% - 56px - 14%)', y: 'calc(100% - 56px - env(safe-area-inset-bottom, 0px) - 24px)', width: '80px', height: '52px', borderRadius: '26px' },
    textPosition: 'above-bottom',
  },
  {
    text: 'Create your app here. You get 15 free credits daily — earn bonus credits by creating and inviting friends.',
    spotlight: { x: 'calc(50% - 40px)', y: 'calc(100% - 56px - env(safe-area-inset-bottom, 0px) - 24px)', width: '80px', height: '52px', borderRadius: '26px' },
    textPosition: 'above-bottom',
  },
  {
    text: 'View your created, remixed, and bookmarked apps in Home.',
    spotlight: { x: '14%', y: 'calc(100% - 56px - env(safe-area-inset-bottom, 0px) - 24px)', width: '80px', height: '52px', borderRadius: '26px' },
    textPosition: 'above-bottom',
  },
  {
    text: 'Whacka lets you add any app to your phone\'s home screen and use it like a native app. You can always find the instructions here.',
    spotlight: { x: 'calc(100% - 100px)', y: '16px', width: '44px', height: '44px', borderRadius: '22px' },
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
    if (forceShow) {
      setVisible(true);
      return;
    }
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) setVisible(true);
  }, [forceShow]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  const handleSkip = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!visible) return null;

  const current = STEPS[step];
  const hasSpotlight = !!current.spotlight;

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
          {/* Dark overlay with optional spotlight cutout */}
          {hasSpotlight ? (
            <div className="absolute inset-0">
              {/* Full dark layer */}
              <div className="absolute inset-0 bg-black/70" />
              {/* Spotlight hole via mask */}
              <div
                className="absolute"
                style={{
                  left: current.spotlight!.x,
                  top: current.spotlight!.y,
                  width: current.spotlight!.width,
                  height: current.spotlight!.height,
                  borderRadius: current.spotlight!.borderRadius,
                  boxShadow: '0 0 0 200vmax rgba(0,0,0,0.70)',
                  background: 'transparent',
                  border: '2px solid rgba(249, 115, 22, 0.8)',
                  zIndex: 1,
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/70" />
          )}

          {/* Text content */}
          <div
            className="absolute left-0 right-0 z-10 flex flex-col items-center px-8"
            style={{
              ...(current.textPosition === 'center' && { top: '50%', transform: 'translateY(-50%)' }),
              ...(current.textPosition === 'above-bottom' && { bottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 24px + 70px)' }),
              ...(current.textPosition === 'below-top' && { top: '80px' }),
            }}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-[300px]"
            >
              <p className="text-[16px] leading-relaxed text-white font-medium">
                {current.text}
              </p>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? 20 : 6,
                      backgroundColor: i === step ? '#F97316' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>

              <p className="text-[13px] text-white/50 mt-4">
                {step < STEPS.length - 1 ? 'Tap to continue' : 'Tap to start'}
              </p>
            </motion.div>
          </div>

          {/* Skip button */}
          {step < STEPS.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleSkip(); }}
              className="absolute top-14 right-5 z-20 text-[13px] text-white/60 font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)' }}
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

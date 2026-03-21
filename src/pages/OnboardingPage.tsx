import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Check, AtSign } from 'lucide-react';
import avatarYang from '@/assets/avatar-yang.jpg';
import avatarDefault1 from '@/assets/avatar-default-1.png';
import avatarDefault2 from '@/assets/avatar-default-2.png';

const STEPS = ['Name', 'Handle', 'Avatar'];

const glassInputStyle: React.CSSProperties = {
  background: 'hsla(0,0%,100%,0.35)',
  backdropFilter: 'blur(24px) saturate(1.8)',
  border: '1px solid hsla(0,0%,100%,0.5)',
  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 4px rgba(0,0,0,0.03)',
};

const avatarOptions = [
  { id: 'default-1', src: avatarDefault1, label: 'Violet' },
  { id: 'default-2', src: avatarDefault2, label: 'Coral' },
  { id: 'yang', src: avatarYang, label: 'Photo' },
];

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('default-1');
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleDone = () => {
    const avatar = avatarOptions.find(a => a.id === selectedAvatar)?.src || avatarDefault1;
    completeOnboarding(displayName || 'User', avatar);
    navigate('/');
  };

  const canNext = step === 0
    ? displayName.trim().length > 0
    : step === 1
      ? handle.trim().length > 0
      : true;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Aurora */}
      <div className="absolute inset-x-0 top-0 h-[300px] overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-violet-300/20 blur-2xl" />
        <div className="absolute top-20 right-6 w-44 h-44 rounded-full bg-sky-200/25 blur-2xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i <= step
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full ${i < step ? 'bg-slate-900' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content with fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">What's your name?</h2>
                  <p className="text-sm text-slate-400 mt-1">This is how you'll appear to others</p>
                </div>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full h-12 px-4 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none text-center"
                  style={glassInputStyle}
                />
              </>
            )}

            {step === 1 && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Pick a handle</h2>
                  <p className="text-sm text-slate-400 mt-1">Choose a unique username</p>
                </div>
                <div className="relative">
                  <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-900" />
                  <input
                    value={handle}
                    onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="your_handle"
                    autoFocus
                    className="w-full h-12 pl-11 pr-4 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                    style={glassInputStyle}
                  />
                </div>
                {handle.trim().length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emerald-500 text-center font-medium"
                  >
                    @{handle} is available ✓
                  </motion.p>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Choose an avatar</h2>
                  <p className="text-sm text-slate-400 mt-1">You can change this later in settings</p>
                </div>
                <div className="flex gap-5 justify-center">
                  {avatarOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedAvatar(opt.id)}
                      className={`flex flex-col items-center gap-2 transition-all ${
                        selectedAvatar === opt.id ? 'scale-110' : 'opacity-60'
                      }`}
                    >
                      <div
                        className={`w-20 h-20 rounded-full overflow-hidden border-3 transition-colors ${
                          selectedAvatar === opt.id ? 'border-slate-900 shadow-lg' : 'border-slate-200'
                        }`}
                      >
                        <img src={opt.src} alt={opt.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-10">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 h-12 rounded-full text-sm font-semibold text-slate-600 active:scale-[0.98] transition-transform"
              style={glassInputStyle}
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext && setStep(step + 1)}
              disabled={!canNext}
              className={`flex-1 h-12 rounded-full text-sm font-semibold text-white active:scale-[0.98] transition-all ${
                canNext ? 'bg-slate-900' : 'bg-slate-300 cursor-not-allowed'
              }`}
              style={canNext ? {
                backdropFilter: 'blur(24px) saturate(1.8)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.25)',
              } : undefined}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleDone}
              className="flex-1 h-12 rounded-full bg-slate-900 text-white text-sm font-semibold active:scale-[0.98] transition-transform"
              style={{
                backdropFilter: 'blur(24px) saturate(1.8)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

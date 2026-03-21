import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

/* 
 * Pacifico-style "Whacka" SVG with stroke draw-on animation.
 * We use the Google Fonts CSS import + an SVG <text> element rendered as a path via stroke-dasharray/offset animation.
 */
const WhackaHandwritten = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load Pacifico font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Wait for font to load
    document.fonts.ready.then(() => {
      document.fonts.load('20px Pacifico').then(() => {
        setReady(true);
      });
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!ready) return <div style={{ height: 60 }} />;

  return (
    <div className="flex justify-center">
      <svg width="200" height="60" viewBox="0 0 200 60" className="overflow-visible">
        <defs>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}</style>
        </defs>
        {/* Single text element: thick stroke acts as the visible "ink", drawn on via dashoffset */}
        <motion.text
          x="100"
          y="44"
          textAnchor="middle"
          fontFamily="'Pacifico', cursive"
          fontSize="40"
          fontWeight="400"
          letterSpacing="1"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          paintOrder="stroke"
          initial={{ strokeDasharray: 800, strokeDashoffset: 800 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 4, ease: 'linear' }}
        >
          Whacka
        </motion.text>
        {/* Clean fill appears on top after stroke finishes drawing */}
        <motion.text
          x="100"
          y="44"
          textAnchor="middle"
          fontFamily="'Pacifico', cursive"
          fontSize="40"
          fontWeight="400"
          letterSpacing="1"
          fill="#0f172a"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1.2, ease: 'easeOut' }}
        >
          Whacka
        </motion.text>
      </svg>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('yang@whacka.com');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      const result = register(email, password);
      if (result.success) {
        setFadeOut(true);
        setTimeout(() => navigate('/onboarding'), 400);
      } else {
        setError(result.error || 'Registration failed');
      }
    } else {
      const result = login(email, password);
      if (result.success) {
        setFadeOut(true);
        setTimeout(() => navigate('/'), 400);
      } else {
        setError(result.error || 'Login failed');
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#F9FAFB] flex flex-col"
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Aurora background */}
      <div className="absolute inset-x-0 top-0 h-[400px] overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-sky-300/20 blur-2xl" />
        <div className="absolute top-20 right-6 w-44 h-44 rounded-full bg-amber-200/25 blur-2xl" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-orange-200/20 blur-2xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 max-w-sm mx-auto w-full">
        {/* Handwritten Logo */}
        <div className="mb-12">
          <WhackaHandwritten />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: 'easeOut' }}
          className="space-y-3"
        >
          {/* Email */}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-900" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full h-12 pl-11 pr-4 rounded-full text-sm text-slate-900 placeholder:text-muted-foreground outline-none"
              style={{ background: 'hsla(0,0%,100%,0.35)', backdropFilter: 'blur(24px) saturate(1.8)', border: '1px solid hsla(0,0%,100%,0.5)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 4px rgba(0,0,0,0.03)' }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-900" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full h-12 pl-11 pr-11 rounded-full text-sm text-slate-900 placeholder:text-muted-foreground outline-none"
              style={{ background: 'hsla(0,0%,100%,0.35)', backdropFilter: 'blur(24px) saturate(1.8)', border: '1px solid hsla(0,0%,100%,0.5)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 4px rgba(0,0,0,0.03)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-slate-900"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password (register only) */}
          {mode === 'register' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="relative"
            >
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-900" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-full h-12 pl-11 pr-4 rounded-full text-sm text-slate-900 placeholder:text-muted-foreground outline-none"
                style={{ background: 'hsla(0,0%,100%,0.35)', backdropFilter: 'blur(24px) saturate(1.8)', border: '1px solid hsla(0,0%,100%,0.5)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 4px rgba(0,0,0,0.03)' }}
              />
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform !mt-5 relative overflow-hidden bg-slate-900 text-white"
            style={{
              backdropFilter: 'blur(24px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} />
          </button>
        </motion.form>

        {/* Toggle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6, ease: 'easeOut' }}
          className="text-center text-sm text-slate-400 mt-6"
        >
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-slate-900 font-semibold">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-slate-900 font-semibold">
                Sign In
              </button>
            </>
          )}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AuthPage;

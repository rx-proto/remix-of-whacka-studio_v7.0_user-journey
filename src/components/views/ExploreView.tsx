import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import StickyTopBar from '@/components/whacka/StickyTopBar';
import PlaylistsSection from './PlaylistsSection';
import { useAuth } from '@/hooks/useAuth';
import avatarYang from '@/assets/avatar-yang.jpg';
import heroTitle from '@/assets/hero-title.png';
import HeroCard from './HeroCard';

export interface AppInfo {
  id: number;
  name: string;
  desc: string;
  icon: string;
}

/* ── Static Whacka Logo (matches auth page SVG) ── */
const WhackaLogoStatic = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.fonts.ready.then(() => {
      document.fonts.load('20px Pacifico').then(() => setReady(true));
    });
    return () => { document.head.removeChild(link); };
  }, []);
  if (!ready) return <div style={{ height: 44 }} />;
  return (
    <svg width="160" height="48" viewBox="0 0 200 55" className="overflow-visible block">
      <defs>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}</style>
      </defs>
      <text x="0" y="42" textAnchor="start" fontFamily="'Pacifico', cursive" fontSize="42" fontWeight="400" letterSpacing="1" fill="#0f172a">
        Whacka
      </text>
    </svg>
  );
};

/* ── Data ── */

const freshIdeas = [
  { id: 1, name: 'FitTrack Pro', author: 'Sarah K.', video: '/videos/pick-1.mp4', desc: 'AI-powered fitness tracking with personalized plans', glowColor: '#F0C1CE' },
  { id: 2, name: 'MoodJournal', author: 'Alex W.', video: '/videos/pick-2.mp4', desc: 'Track your mental health journey daily', glowColor: '#4E59C5' },
  { id: 3, name: 'Family Hub', author: 'Chen L.', video: '/videos/pick-3.mp4', desc: 'Family organization made simple', glowColor: '#D2F873' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ── Component ── */

interface ExploreViewProps {
  onOpenCategory?: (categoryId: string) => void;
  onOpenApp?: (app: AppInfo) => void;
  onCollectApp?: (app: AppInfo) => void;
  savedIds?: number[];
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  onOpenPlaylist?: (index?: number) => void;
  onOpenUser?: (authorName: string) => void;
  onOpenNotifications?: () => void;
  onOpenMenu?: () => void;
  initialPlaylist?: string;
  onPlaylistConsumed?: () => void;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onOpenApp, onOpenPlaylist, onOpenUser, onOpenNotifications, onOpenMenu, isLoggedIn = true, initialPlaylist, onPlaylistConsumed }) => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="relative min-h-screen">

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
        {/* Sticky Menu + Bell bar with scroll-reveal */}
        <StickyTopBar
          onOpenMenu={onOpenMenu}
          onOpenNotifications={onOpenNotifications}
          showNotification={isLoggedIn}
        />


        {/* ── Editor's Picks — horizontal square cards ── */}
        <motion.div variants={item} className="space-y-3 py-2">
          <div className="px-7 flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <path d="M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" stroke="#ef4444"/>
            </svg>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Editor's Picks</h2>
          </div>

          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory pl-7 pr-4 scroll-pl-7"
            style={{ scrollbarWidth: 'none' }}
          >
            {freshIdeas.map((app) => (
              <motion.div
                key={app.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenApp?.({ id: app.id, name: app.name, desc: app.desc, icon: '' })}
                className="flex-shrink-0 w-[72%] aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform snap-start relative"
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                {/* Looping video background */}
                <video
                  src={app.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
                {/* Glass highlight — top-left shine */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)',
                  }}
                />
                {/* Inner glass edge border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    maskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)',
                    WebkitMaskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)',
                  }}
                />
                {/* Bottom-right subtle shadow inset */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none z-[1]"
                  style={{
                    boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.1), inset 1px 1px 4px rgba(255,255,255,0.3)',
                  }}
                />

                {/* Bottom info with dark overlay */}
                <div className="absolute bottom-0 left-0 right-0 pt-12 px-4 pb-4 z-[2] bg-gradient-to-t from-black/55 via-black/25 to-transparent">
                  <button
                    className="flex items-center gap-1.5 mb-1.5"
                    onClick={(e) => { e.stopPropagation(); onOpenUser?.(app.author); }}
                  >
                    <img src={avatarYang} alt="avatar" className="w-4 h-4 rounded-full object-cover" />
                    <span className="text-[11px] text-white/70 font-medium">{app.author}</span>
                  </button>
                  <h3 className="text-base font-bold text-white leading-tight">{app.name}</h3>
                  <p className="text-[12px] text-white/70 mt-0.5 leading-snug line-clamp-2">{app.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="flex-shrink-0 w-4" aria-hidden />
          </div>
        </motion.div>

        {/* ── Playlists ── */}
        <PlaylistsSection onOpenPlaylist={onOpenPlaylist} onOpenApp={onOpenApp} initialPlaylist={initialPlaylist} onPlaylistConsumed={onPlaylistConsumed} />
      </motion.div>

      {/* Update banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-0 right-0 z-[900] flex justify-center"
          >
            <button
              onClick={() => setShowBanner(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium text-foreground backdrop-blur-xl mx-auto"
              style={{
                background: 'rgba(255,255,255,0.72)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
              }}
            >
              <RefreshCw size={13} className="text-muted-foreground" />
              New features available — tap to explore
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </div>
  );
};

export default ExploreView;

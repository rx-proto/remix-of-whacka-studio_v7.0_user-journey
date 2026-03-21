import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { AppInfo } from './ExploreView';

import iconBudgetbuddy from '@/assets/icon-budgetbuddy.png';
import iconSnake from '@/assets/icon-snake.png';
import iconHabittracker from '@/assets/icon-habittracker.png';
import iconColorpalette from '@/assets/icon-colorpalette.png';
import iconMeditation from '@/assets/icon-meditation.png';
import iconTodopro from '@/assets/icon-todopro.png';
import iconFittrack from '@/assets/icon-fittrack.png';
import iconMoodjournal from '@/assets/icon-moodjournal.png';
import iconFamilyhub from '@/assets/icon-familyhub.png';

const trending = [
  { id: 5, name: 'Budget Buddy', icon: iconBudgetbuddy, likes: 167, author: 'Olivia M.', comments: 42, highlight: '10K+ users', desc: 'Smart expense tracking with AI insights', tagColor: '#2E7D32' },
  { id: 6, name: 'Snake Classic', icon: iconSnake, likes: 312, author: 'GameStudio', comments: 89, highlight: "Editor's Pick", desc: 'Retro snake game reimagined', tagColor: '#E65100' },
  { id: 7, name: 'Habit Tracker', icon: iconHabittracker, likes: 89, author: 'David R.', comments: 23, highlight: '', desc: 'Build lasting habits with streaks', tagColor: '' },
  { id: 8, name: 'Color Palette', icon: iconColorpalette, likes: 145, author: 'Design Co.', comments: 56, highlight: '5K+ users', desc: 'Generate beautiful color schemes', tagColor: '#6A1B9A' },
  { id: 9, name: 'Meditation', icon: iconMeditation, likes: 201, author: 'Zen Labs', comments: 67, highlight: '', desc: 'Guided meditation & breathing', tagColor: '' },
  { id: 10, name: 'Todo Pro', icon: iconTodopro, likes: 178, author: 'Productivity Inc.', comments: 34, highlight: '', desc: 'Task management made beautiful', tagColor: '' },
  { id: 11, name: 'FitTrack Pro', icon: iconFittrack, likes: 234, author: 'Sarah K.', comments: 78, highlight: 'Trending', desc: 'AI-powered fitness tracking', tagColor: '#1565C0' },
  { id: 12, name: 'MoodJournal', icon: iconMoodjournal, likes: 156, author: 'Alex W.', comments: 45, highlight: '', desc: 'Track your mental health journey', tagColor: '' },
  { id: 13, name: 'Family Hub', icon: iconFamilyhub, likes: 98, author: 'Chen L.', comments: 31, highlight: 'New', desc: 'Family organization made simple', tagColor: '#00695C' },
];

const PLAYLIST_ICONS: Record<string, JSX.Element> = {
  Top: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44"/></svg>,
  Games: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.146 15.854a1.207 1.207 0 0 1 1.708 0l1.56 1.56A2 2 0 0 1 15 18.828V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.172a2 2 0 0 1 .586-1.414z"/><path d="M18.828 15a2 2 0 0 1-1.414-.586l-1.56-1.56a1.207 1.207 0 0 1 0-1.708l1.56-1.56A2 2 0 0 1 18.828 9H21a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/><path d="M6.586 14.414A2 2 0 0 1 5.172 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.172a2 2 0 0 1 1.414.586l1.56 1.56a1.207 1.207 0 0 1 0 1.708z"/><path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.172a2 2 0 0 1-.586 1.414l-1.56 1.56a1.207 1.207 0 0 1-1.708 0l-1.56-1.56A2 2 0 0 1 9 5.172z"/></svg>,
  Muse: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.001 15.085A1.5 1.5 0 0 1 9 16.5"/><circle cx="18.5" cy="8.5" r="3.5"/><circle cx="7.5" cy="16.5" r="5.5"/><circle cx="7.5" cy="4.5" r="2.5"/></svg>,
  Life: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/></svg>,
  Tools: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.34 17.52a10 10 0 1 0-2.82 2.82"/><circle cx="19" cy="19" r="2"/><path d="m13.41 13.41 4.18 4.18"/><circle cx="12" cy="12" r="2"/></svg>,
};

const playlists: { name: string; appIds: number[] }[] = [
  { name: 'Top', appIds: [5, 8, 9, 11, 12, 13, 6, 7, 10] },
  { name: 'Games', appIds: [6, 7, 10] },
  { name: 'Muse', appIds: [7, 10, 5] },
  { name: 'Life', appIds: [8, 9, 6] },
  { name: 'Tools', appIds: [5, 10, 11] },
];

const SWIPE_THRESHOLD = 50;

interface PlaylistsSectionProps {
  onOpenPlaylist?: (index?: number) => void;
  onOpenApp?: (app: AppInfo) => void;
  initialPlaylist?: string;
  onPlaylistConsumed?: () => void;
}

const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({ onOpenPlaylist, onOpenApp, initialPlaylist, onPlaylistConsumed }) => {
  const [activeTag, setActiveTag] = useState(0);
  const [direction, setDirection] = useState(0);
  const tagScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  // Handle initialPlaylist from sidebar navigation
  useEffect(() => {
    if (!initialPlaylist) return;
    const idx = playlists.findIndex(p => p.name === initialPlaylist);
    if (idx >= 0) {
      setActiveTag(idx);
      // Scroll section into view and make it sticky
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      onPlaylistConsumed?.();
    }
  }, [initialPlaylist, onPlaylistConsumed]);

  useEffect(() => {
    const el = tagScrollRef.current;
    if (!el) return;
    const activeBtn = el.children[activeTag] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTag]);

  // Sticky tag bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= 0);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const switchTag = useCallback((newIndex: number) => {
    setDirection(newIndex > activeTag ? 1 : -1);
    setActiveTag(newIndex);
  }, [activeTag]);

  const handleSwipe = useCallback((_: any, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD && activeTag < playlists.length - 1) {
      switchTag(activeTag + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD && activeTag > 0) {
      switchTag(activeTag - 1);
    }
  }, [activeTag, switchTag]);

  const currentApps = playlists[activeTag].appIds.map(id => trending.find(a => a.id === id)!).filter(Boolean);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const tagBar = (
    <div
      className={`pt-3 pb-0 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''}`}
      style={{
        backgroundColor: isSticky ? 'rgba(249, 250, 251, 0.85)' : 'transparent',
        backdropFilter: isSticky ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isSticky ? 'blur(20px) saturate(180%)' : 'none',
      }}
    >
      <div
        ref={tagScrollRef}
        className="flex gap-5 overflow-x-auto pl-7 pr-4 relative"
        style={{ scrollbarWidth: 'none' }}
      >
        {playlists.map((pl, i) => (
          <motion.button
            key={pl.name}
            onClick={() => switchTag(i)}
            whileTap={{ scale: 0.97 }}
            className={`flex-shrink-0 pb-2.5 text-[15px] font-bold transition-colors relative
              ${activeTag === i ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <span className="flex items-center gap-1.5">{PLAYLIST_ICONS[pl.name]}{pl.name}</span>
          </motion.button>
        ))}
      </div>
      <div className="h-px bg-border/50 mx-7" />
    </div>
  );

  return (
    <div ref={sectionRef}>
      <div className="px-7 flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z"/>
          <path d="M8 9V2"/>
          <path d="M15.295 19.562 16 22" stroke="#F97316"/>
          <path d="m17 16 3.758 2.098" stroke="#F97316"/>
          <path d="m19 12.5 3.026-.598" stroke="#F97316"/>
        </svg>
        <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Playlists</h2>
      </div>

      {/* Tag bar — pt-3 absorbed from title gap */}
      {tagBar}
      {/* Spacer when sticky */}
      {isSticky && <div className="h-[54px]" />}

      {/* Swipeable app list */}
      <motion.div
        className="px-7 overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleSwipe}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTag}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="space-y-0"
          >
            {currentApps.map((app) => (
              <motion.div
                key={app.id}
                onClick={() => onOpenApp?.({ id: app.id, name: app.name, desc: app.desc, icon: app.icon })}
                className="cursor-pointer active:bg-slate-50 transition-colors flex gap-3.5 py-2 border-b border-slate-100/80 last:border-b-0"
              >
                <div
                  className="w-[56px] h-[56px] rounded-2xl flex-shrink-0 relative"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <img src={app.icon} alt={app.name} className="w-full h-full object-cover rounded-2xl" />
                  {/* Glass highlight — top-left shine */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)',
                    }}
                  />
                  {/* Inner glass edge border */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      border: '1.5px solid rgba(255,255,255,0.5)',
                      maskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)',
                      WebkitMaskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)',
                    }}
                  />
                  {/* Bottom-right subtle shadow inset */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.1), inset 1px 1px 4px rgba(255,255,255,0.3)',
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0 flex items-center">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-foreground truncate">{app.name}</h3>
                      {app.highlight && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                          style={{ color: app.tagColor, backgroundColor: app.tagColor ? `${app.tagColor}26` : 'transparent' }}
                        >
                          {app.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-0.5 line-clamp-1">{app.desc}</p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-slate-300 flex-shrink-0 self-center" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PlaylistsSection;

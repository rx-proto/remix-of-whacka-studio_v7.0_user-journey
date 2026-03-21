import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useScroll, PanInfo } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import avatarDefault1 from '@/assets/avatar-default-1.png';
import avatarDefault2 from '@/assets/avatar-default-2.png';
import type { AppInfo } from './ExploreView';

import iconBudgetbuddy from '@/assets/icon-budgetbuddy.png';
import iconSnake from '@/assets/icon-snake.png';
import iconHabittracker from '@/assets/icon-habittracker.png';
import iconColorpalette from '@/assets/icon-colorpalette.png';
import iconMeditation from '@/assets/icon-meditation.png';
import iconTodopro from '@/assets/icon-todopro.png';

/* ── Mock user data ── */
const MOCK_USERS: Record<string, { avatar: string; handle: string; bio: string; published: number; followers: string; likes: string; apps: { id: number; name: string; desc: string; icon: string; glowColor: string }[] }> = {
  default: {
    avatar: avatarDefault1,
    handle: '@creator',
    bio: 'Building cool apps ✨',
    published: 3,
    followers: '842',
    likes: '2.1K',
    apps: [
      { id: 101, name: 'Budget Buddy', desc: 'Smart expense tracking with AI insights', icon: iconBudgetbuddy, glowColor: 'bg-emerald-200' },
      { id: 102, name: 'Habit Tracker', desc: 'Build lasting habits with streaks', icon: iconHabittracker, glowColor: 'bg-sky-200' },
      { id: 103, name: 'Color Palette', desc: 'Generate beautiful color schemes', icon: iconColorpalette, glowColor: 'bg-violet-200' },
    ],
  },
};

// All author names map to the same mock for now
const getUserData = (name: string) => {
  const data = MOCK_USERS.default;
  return { ...data, handle: `@${name.toLowerCase().replace(/[\s.]+/g, '_')}` };
};

const CARD_ROTATIONS = [-1.2, 0.8, -0.6, 1.0, -0.9, 0.5];

/* ── WalletCard (simplified, no swipe actions) ── */
interface CardProps {
  app: { id: number; name: string; desc: string; icon: string; glowColor: string };
  index: number;
  onOpen: () => void;
  scrollRef: React.RefObject<HTMLElement | null>;
}

const ProfileCard: React.FC<CardProps> = ({ app, index, onOpen, scrollRef }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    container: scrollRef,
    offset: ['start end', 'center center', 'end start'],
  });
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 0.93]);
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  return (
    <motion.div ref={cardRef} className="relative" style={{ marginTop: index > 0 ? '-6px' : '0', scale: cardScale }}>
      <motion.div
        className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl h-[140px] px-5 py-3 cursor-pointer overflow-hidden"
        style={{ zIndex: index + 1, rotate: rotation, boxShadow: '0 2px 20px rgba(168,155,210,0.12), 0 1px 4px rgba(0,0,0,0.04)' }}
        onClick={onOpen}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`absolute -top-4 -left-4 w-[100px] h-[100px] rounded-full ${app.glowColor} blur-2xl opacity-40 pointer-events-none`} />
        <div className={`absolute -bottom-6 -right-6 w-[140px] h-[140px] rounded-full ${app.glowColor} blur-3xl opacity-35 pointer-events-none`} />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <div className="w-[76px] h-[76px] rounded-2xl overflow-hidden border border-black/5 shadow-lg rotate-[12deg]">
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full pr-20">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight truncate">{app.name}</h3>
          <p className="text-xs text-slate-400 truncate mt-2">{app.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── UserProfileView ── */
interface UserProfileViewProps {
  authorName: string;
  onBack: () => void;
  onOpenApp?: (app: AppInfo) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ authorName, onBack, onOpenApp }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const userData = getUserData(authorName);
  const [following, setFollowing] = React.useState(false);

  return (
    <motion.div
      ref={scrollRef}
      className="min-h-screen relative overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Back button */}
      <header className="sticky top-0 z-30 px-4 pt-4 pb-2">
        <motion.button
          onClick={onBack}
          className="flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-900"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
      </header>

      {/* Profile header */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[300px] overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-sky-300/20 blur-2xl" />
          <div className="absolute top-20 right-6 w-44 h-44 rounded-full bg-amber-200/25 blur-2xl" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-orange-200/20 blur-2xl" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F9FAFB] to-transparent" />
        </div>

        <div className="relative flex flex-col items-center pt-6 pb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mb-3">
            <img src={userData.avatar} alt={authorName} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{authorName}</h2>
          <p className="text-sm text-slate-400 mb-4">{userData.handle}</p>

          {/* Stats */}
          <div className="flex gap-8 mb-5">
            {[
              { value: userData.published, label: 'Published' },
              { value: userData.followers, label: 'Followers' },
              { value: userData.likes, label: 'Likes' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-lg font-bold text-slate-800">{s.value}</span>
                <span className="text-[11px] text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Follow button */}
          <button
            onClick={() => setFollowing(f => !f)}
            className={`w-[120px] py-2.5 rounded-full text-sm font-semibold transition-all ${
              following
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-900 text-white'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Apps list */}
      <div className="px-4 pt-2 pb-8">
        <h3 className="text-base font-bold text-slate-800 mb-3">Published Apps</h3>
        <div className="space-y-0">
          {userData.apps.map((app, i) => (
            <ProfileCard
              key={app.id}
              app={app}
              index={i}
              onOpen={() => onOpenApp?.({ id: app.id, name: app.name, desc: app.desc, icon: app.icon })}
              scrollRef={scrollRef}
            />
          ))}
        </div>
      </div>

      <div className="h-32" />
    </motion.div>
  );
};

export default UserProfileView;

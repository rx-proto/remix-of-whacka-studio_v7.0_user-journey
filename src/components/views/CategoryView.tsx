import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Activity, DollarSign, Gamepad2, Users, Briefcase, Home } from 'lucide-react';
import type { AppInfo } from './ExploreView';

import categoryHealth from '@/assets/category-health.jpg';
import categoryFinance from '@/assets/category-finance.jpg';
import categoryGames from '@/assets/category-games.jpg';
import categorySocial from '@/assets/category-social.jpg';
import categoryProductivity from '@/assets/category-productivity.jpg';
import categoryFamily from '@/assets/category-family.jpg';

import iconFittrack from '@/assets/icon-fittrack.png';
import iconMoodjournal from '@/assets/icon-moodjournal.png';
import iconFamilyhub from '@/assets/icon-familyhub.png';
import iconQuizmaster from '@/assets/icon-quizmaster.png';
import iconBudgetbuddy from '@/assets/icon-budgetbuddy.png';
import iconSnake from '@/assets/icon-snake.png';
import iconHabittracker from '@/assets/icon-habittracker.png';
import iconColorpalette from '@/assets/icon-colorpalette.png';
import iconMeditation from '@/assets/icon-meditation.png';
import iconTodopro from '@/assets/icon-todopro.png';

const categories = [
  { id: 'health', name: 'Health', icon: Activity },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'games', name: 'Games', icon: Gamepad2 },
  { id: 'social', name: 'Social', icon: Users },
  { id: 'productivity', name: 'Productivity', icon: Briefcase },
  { id: 'family', name: 'Family', icon: Home },
];

const coverImages: Record<string, string> = {
  health: categoryHealth, finance: categoryFinance, games: categoryGames,
  social: categorySocial, productivity: categoryProductivity, family: categoryFamily,
};

const categoryApps: Record<string, Array<{ id: number; name: string; icon: string; author: string; likes: number; highlight: string; desc: string }>> = {
  health: [
    { id: 1, name: 'FitTrack Pro', icon: iconFittrack, author: 'Sarah K.', likes: 1200, highlight: '超 1k likes', desc: 'AI fitness tracking with plans' },
    { id: 2, name: 'MoodJournal', icon: iconMoodjournal, author: 'Alex W.', likes: 890, highlight: 'Top Rated', desc: 'Track your mental health' },
    { id: 9, name: 'Meditation', icon: iconMeditation, author: 'Zen Labs', likes: 2100, highlight: '10K+ users', desc: 'Guided meditation & breathing' },
    { id: 7, name: 'Habit Tracker', icon: iconHabittracker, author: 'David R.', likes: 450, highlight: 'New', desc: 'Build lasting habits' },
  ],
  finance: [
    { id: 5, name: 'Budget Buddy', icon: iconBudgetbuddy, author: 'Olivia M.', likes: 1670, highlight: '10K+ users', desc: 'Smart expense tracking' },
    { id: 10, name: 'Todo Pro', icon: iconTodopro, author: 'Prod Inc.', likes: 780, highlight: 'Trending', desc: 'Financial task management' },
  ],
  games: [
    { id: 6, name: 'Snake Classic', icon: iconSnake, author: 'GameStudio', likes: 3120, highlight: "Editor's Pick", desc: 'Retro snake reimagined' },
    { id: 4, name: 'Quiz Master', icon: iconQuizmaster, author: 'Dev Team', likes: 560, highlight: 'Fun', desc: 'Interactive quiz battles' },
  ],
  social: [
    { id: 3, name: 'Family Hub', icon: iconFamilyhub, author: 'Chen L.', likes: 920, highlight: '5K+ users', desc: 'Family organization' },
    { id: 2, name: 'MoodJournal', icon: iconMoodjournal, author: 'Alex W.', likes: 890, highlight: 'Shared', desc: 'Share your journey' },
  ],
  productivity: [
    { id: 10, name: 'Todo Pro', icon: iconTodopro, author: 'Prod Inc.', likes: 1780, highlight: 'Trending', desc: 'Task management' },
    { id: 7, name: 'Habit Tracker', icon: iconHabittracker, author: 'David R.', likes: 450, highlight: 'New', desc: 'Build habits with streaks' },
    { id: 8, name: 'Color Palette', icon: iconColorpalette, author: 'Design Co.', likes: 1450, highlight: '5K+ users', desc: 'Beautiful color schemes' },
  ],
  family: [
    { id: 3, name: 'Family Hub', icon: iconFamilyhub, author: 'Chen L.', likes: 920, highlight: 'Top Rated', desc: 'Family organization made simple' },
    { id: 1, name: 'FitTrack Pro', icon: iconFittrack, author: 'Sarah K.', likes: 1200, highlight: 'Family Plan', desc: 'Family fitness together' },
  ],
};

interface CategoryViewProps {
  categoryId: string;
  onBack: () => void;
  onChangeCategory: (id: string) => void;
  onOpenApp?: (app: AppInfo) => void;
  onCollectApp?: (app: AppInfo) => void;
  savedIds?: number[];
}

const CategoryView: React.FC<CategoryViewProps> = ({ categoryId, onBack, onChangeCategory, onOpenApp, onCollectApp, savedIds = [] }) => {
  const apps = categoryApps[categoryId] || [];
  const cover = coverImages[categoryId];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-center bg-[#F9FAFB]/80 backdrop-blur-md">
        <motion.button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 active:bg-slate-200 transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </motion.button>
        <h1 className="text-base font-semibold text-slate-900 ml-3">Category</h1>
      </header>

      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => {
            const isActive = cat.id === categoryId;
            return (
              <button
                key={cat.id}
                onClick={() => onChangeCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all
                  ${isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-transparent text-slate-500 border border-slate-200 active:bg-slate-900 active:text-white active:border-transparent'
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-24">
        <div className="columns-2 gap-3 space-y-3">
          {apps.map((app, idx) => (
            <motion.div
              key={`${app.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => onOpenApp?.({ id: app.id, name: app.name, desc: app.desc, icon: app.icon })}
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={cover} alt={app.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {app.highlight}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{app.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{app.desc}</p>
                  </div>
                  {(() => {
                    const isSaved = savedIds.includes(app.id);
                    return (
                      <button
                        onClick={(e) => { e.stopPropagation(); if (!isSaved) onCollectApp?.({ id: app.id, name: app.name, desc: app.desc, icon: app.icon }); }}
                        className={`flex-shrink-0 w-14 text-center text-[10px] font-semibold py-0.5 rounded-full transition-all active:scale-95
                          ${isSaved
                            ? 'bg-transparent text-slate-400 border border-slate-200'
                            : 'bg-slate-900 text-white'
                          }`}
                      >
                        {isSaved ? 'Saved' : 'GET'}
                      </button>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-medium">{app.author}</span>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Heart size={10} />
                    <span className="text-[10px] font-mono">{app.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;

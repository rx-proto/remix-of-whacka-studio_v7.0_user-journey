import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Flame } from 'lucide-react';

const INITIAL_HISTORY = ['Fitness Tracker', 'Budget App', 'Meditation', 'Snake Game', 'Recipe Manager'];

const HOT_TRENDS = [
  { rank: 1, label: 'AI Personal Assistant', hot: true, category: 'Productivity', desc: 'Build smart assistants with natural language' },
  { rank: 2, label: 'Habit Streak Tracker', hot: true, category: 'Health', desc: 'Track daily habits with visual streaks' },
  { rank: 3, label: 'Split Bill Calculator', hot: true, category: 'Finance', desc: 'Easy expense splitting for groups' },
  { rank: 4, label: 'Mood Board Creator', hot: false, category: 'Design', desc: 'Curate visual inspiration boards' },
  { rank: 5, label: 'Workout Planner', hot: false, category: 'Health', desc: 'Plan and log your training sessions' },
  { rank: 6, label: 'Pomodoro Timer', hot: false, category: 'Productivity', desc: 'Focus sessions with timed breaks' },
];

const SUGGESTED = ['Design Tools', 'Analytics', 'Mini Games', 'Note Taking'];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState(INITIAL_HISTORY);

  const removeHistoryItem = (word: string) => {
    setHistory(prev => prev.filter(w => w !== word));
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="relative min-h-screen">
      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 space-y-5">
        {/* Search Bar - matches nav capsule style */}
        <motion.div variants={item} className="pt-16 px-7">
          <div className="relative glass-button rounded-full overflow-hidden" style={{ height: 48 }}>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps, tools, creators..."
              className="w-full h-full pl-10 pr-10 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground active:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div variants={item} className="px-7">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTED.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full bg-slate-100/80 text-xs font-medium text-slate-600
                  flex-shrink-0 active:bg-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Searches */}
        {history.length > 0 && (
          <motion.div variants={item} className="px-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent</span>
              <button
                onClick={clearHistory}
                className="text-xs text-slate-400 active:text-slate-600 transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((word) => (
                <div
                  key={word}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full
                    bg-white border border-slate-100 text-[13px] text-slate-700 font-medium
                    shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{word}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeHistoryItem(word); }}
                    className="text-slate-300 active:text-slate-500 ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Now - WalletCard style */}
        <motion.div variants={item} className="px-7 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trending Now</span>
          <div className="space-y-2">
            {HOT_TRENDS.map((trend, i) => (
              <motion.div
                key={trend.rank}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3.5 py-3 cursor-pointer active:opacity-70 transition-opacity border-b border-slate-100/60 last:border-b-0"
              >
                <span className={`text-2xl font-black tabular-nums w-8 text-center ${
                  trend.rank <= 3 ? 'text-slate-900' : 'text-slate-300'
                }`}>
                  {trend.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-slate-800 tracking-tight truncate">{trend.label}</h3>
                    {trend.hot && <Flame size={13} className="text-orange-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{trend.desc}</p>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-400 font-medium flex-shrink-0 border border-slate-100">
                  {trend.category}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="h-32" />
      </motion.div>
    </div>
  );
};

export default SearchView;

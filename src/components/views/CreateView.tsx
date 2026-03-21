import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const suggestions = [
  ['记账助手，支持拍照识别小票', '每日习惯打卡 + 统计图表', '语言学习 + 相机翻译'],
  ['宠物健康管理日记', 'AI 智能食谱推荐', '团队协作看板工具'],
  ['个人简历生成器', '音乐节奏小游戏', '旅行计划 + 地图标记'],
];

const thinkingSteps = [
  'Analyzing your idea...',
  'Generating database schema...',
  'Building UI components...',
  'Polishing the design...',
  'Almost ready! ✨',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface CreateViewProps {
  onStartBuild: (text: string) => void;
  onGoPreview: () => void;
  onSetInput: (text: string) => void;
  isBuilding: boolean;
  buildPhase: number;
}

const CreateView: React.FC<CreateViewProps> = ({ onStartBuild, onGoPreview, onSetInput, isBuilding, buildPhase }) => {
  const [suggestionPage, setSuggestionPage] = useState(0);

  const currentSuggestions = suggestions[suggestionPage % suggestions.length];

  const handleRefresh = () => {
    setSuggestionPage(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative px-6">
      {/* Aurora gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-sky-300/20 blur-2xl" />
        <div className="absolute top-20 right-6 w-44 h-44 rounded-full bg-amber-200/25 blur-2xl" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-orange-200/20 blur-2xl" />
        <div className="absolute top-32 left-1/4 w-36 h-36 rounded-full bg-sky-200/15 blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-violet-200/15 blur-2xl" />
      </div>

      {/* Agent Blob */}
      <motion.div variants={item} className="relative z-10 mb-8">
        <motion.div
          className="w-28 h-28 rounded-full relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-[-16px] rounded-full" style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
            filter: 'blur(8px)',
          }} />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a78bfa, #c4b5fd, #818cf8, #6366f1)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-[3px] rounded-full" style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25) 0%, transparent 60%)',
          }} />
          {isBuilding && (
            <motion.div
              className="absolute inset-[-6px] rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'rgba(255,255,255,0.7)', borderRightColor: 'rgba(255,255,255,0.2)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Content area */}
      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {!isBuilding ? (
            <motion.div
              key="suggestions"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <motion.p variants={item} className="text-sm text-slate-400 text-center mb-4">告诉我你想创建什么应用</motion.p>
              {currentSuggestions.map((s, i) => (
                <motion.button
                  key={`${suggestionPage}-${i}`}
                  variants={item}
                  onClick={() => onSetInput(s)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100/80 text-sm text-slate-600 active:bg-white/80 transition-colors shadow-sm"
                >
                  {s}
                </motion.button>
              ))}
              <motion.button
                variants={item}
                onClick={handleRefresh}
                className="w-full py-2.5 rounded-xl border border-slate-100 text-sm text-slate-400 font-medium
                  flex items-center justify-center gap-2 active:bg-slate-50 transition-colors mt-2"
              >
                <RefreshCw size={14} />
                换一换
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="building"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-slate-700 text-center mb-4">创作中...</p>
              {thinkingSteps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i <= buildPhase ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  {i < buildPhase ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <path d="M2 6L5 9L10 3" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : i === buildPhase ? (
                    <motion.div
                      className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-violet-500 flex-shrink-0"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-200 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${i <= buildPhase ? 'text-slate-700' : 'text-slate-300'}`}>{step}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateView;

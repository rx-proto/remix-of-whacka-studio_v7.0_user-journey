import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Star, ChevronRight, GraduationCap, Settings,
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { FOLLOWING_LIST } from './SideMenuPages';

/* ── Recent Activity Data (shared with HomeView) ── */
export const RECENT_ACTIVITY = [
  { playlist: 'Camera Fun', action: 'Joined the trending challenge', time: '2h ago', actionType: 'joined' as const, target: undefined as string | undefined },
  { playlist: 'Camera Fun', action: 'Liked', target: 'FitTrack Pro', time: '5h ago', actionType: 'liked' as const },
  { playlist: 'Mini App Jam', action: 'Commented on', target: 'Recipe Finder', comment: 'The ingredient filter is so handy!', time: '1d ago', actionType: 'other' as const },
  { playlist: 'Mini App Jam', action: 'Remixed', target: 'Todo Master', time: '2d ago', actionType: 'other' as const },
  { playlist: 'Camera Fun', action: 'Commented on', target: 'Budget Buddy', comment: 'The charts are really clean', time: '3d ago', actionType: 'other' as const },
  { playlist: 'Productivity', action: 'Liked', target: 'Zen Space', time: '4d ago', actionType: 'other' as const },
];

export const FOLLOWING_PREVIEW = FOLLOWING_LIST;

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLight: boolean;
  onToggleTheme: () => void;
  onNavigateSubPage?: (page: 'follow' | 'subscription' | 'settings' | 'guides' | 'recent', options?: { tab?: string }) => void;
  onOpenUser?: (name: string) => void;
  onRecentAction?: (actionType: string, payload?: any) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, isLight, onNavigateSubPage, onOpenUser, onRecentAction }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    onClose();
    navigate('/auth');
  };

  const handleSeeAll = (page: 'recent' | 'follow') => {
    onClose();
    onNavigateSubPage?.(page);
  };

  const handleRecentClick = (item: typeof RECENT_ACTIVITY[0], index: number) => {
    if (index === 0) {
      // "Camera Fun" - navigate to explore with Camera Fun playlist
      onClose();
      onRecentAction?.('openPlaylist', { playlistName: 'Camera Fun' });
    } else if (index === 1) {
      // "Liked FitTrack Pro" - open FitTrack Pro details
      onClose();
      onRecentAction?.('openApp', { name: 'FitTrack Pro' });
    }
  };

  const handleFollowingClick = (name: string) => {
    onClose();
    onOpenUser?.(name);
  };

  const textColor = isLight ? 'text-slate-900' : 'text-foreground';
  const subtextColor = isLight ? 'text-slate-400' : 'text-muted-foreground';
  const activeStyle = isLight ? 'active:bg-slate-50' : 'active:bg-foreground/5';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-0 top-0 bottom-0 z-[3] w-[72%] max-w-[320px] flex flex-col"
            style={{ background: isLight ? '#FFFFFF' : 'hsl(240 10% 10%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex-1 flex flex-col overflow-hidden pt-14">
              {/* ── Recent Section (flex-[3]) ── */}
              <div className="flex-[3] flex flex-col min-h-0 px-4">
                <div className="flex items-center justify-between py-2 flex-shrink-0">
                  <span className={`text-[15px] font-bold ${textColor}`}>Recent</span>
                  <span
                    className={`text-[13px] font-medium ${subtextColor} cursor-pointer`}
                    onClick={() => handleSeeAll('recent')}
                  >
                    See all
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-0">
                  {RECENT_ACTIVITY.map((item, i) => (
                    <div
                      key={i}
                      className={`py-3 ${i < RECENT_ACTIVITY.length - 1 ? 'border-b border-border/20' : ''} ${i <= 1 ? 'cursor-pointer active:bg-slate-50/50 transition-colors rounded-lg' : ''}`}
                      onClick={() => handleRecentClick(item, i)}
                    >
                      <p className={`text-[13px] font-semibold ${textColor}`}># {item.playlist}</p>
                      <p className={`text-[12px] mt-0.5 ${subtextColor}`}>
                        {item.action}{item.target ? <> <span className="font-medium">{item.target}</span></> : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-4 border-b border-border/30 flex-shrink-0" />

              {/* ── Following Section (flex-[2]) ── */}
              <div className="flex-[2] flex flex-col min-h-0 px-4 mt-1">
                <div className="flex items-center justify-between py-2 flex-shrink-0">
                  <span className={`text-[15px] font-bold ${textColor}`}>Following</span>
                  <span
                    className={`text-[13px] font-medium ${subtextColor} cursor-pointer`}
                    onClick={() => handleSeeAll('follow')}
                  >
                    See all
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-0 pb-1">
                  {FOLLOWING_LIST.map((u, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 py-2.5 cursor-pointer active:bg-slate-50/50 transition-colors rounded-lg ${i < FOLLOWING_LIST.length - 1 ? 'border-b border-border/20' : ''}`}
                      onClick={() => handleFollowingClick(u.name)}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-sm flex-shrink-0">
                        {u.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold ${textColor}`}>{u.name}</p>
                        <p className={`text-[11px] ${subtextColor}`}>{u.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Bottom fixed: Subscription, Guides, Settings, Sign Out ── */}
              <div className="border-t border-border/30 px-3 py-2 space-y-0.5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
                {[
                  { id: 'subscription' as const, icon: Star, label: 'Subscription' },
                  { id: 'guides' as const, icon: GraduationCap, label: 'Guides' },
                  { id: 'settings' as const, icon: Settings, label: 'Settings' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => { onClose(); onNavigateSubPage?.(id); }}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold transition-colors ${textColor} ${activeStyle}`}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{label}</span>
                    <ChevronRight size={16} className={subtextColor} />
                  </button>
                ))}

                <div className="border-t border-border/30 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold transition-colors
                      ${isLight ? 'text-red-500 active:bg-red-50' : 'text-red-400 active:bg-red-400/10'}`}
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;

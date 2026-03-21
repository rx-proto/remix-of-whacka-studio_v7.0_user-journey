import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Smartphone, ExternalLink, Share, PlusSquare, Gamepad2, LogIn, Trophy, Music, Play, Zap, Bell, BellOff, Shield, Lock, Eye, EyeOff, Globe, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import avatarYang from '@/assets/avatar-yang.jpg';

/* ── Mock Data ── */
const NOTIFICATIONS = [
  { avatar: '🧑‍💻', name: 'Sarah K.', action: 'liked your app', target: 'My Budget', time: '2m ago', type: 'like' },
  { avatar: '🎨', name: 'Alex W.', action: 'remixed', target: 'FitTrack Pro', time: '8m ago', type: 'remix' },
  { avatar: '🚀', name: 'Chen L.', action: 'followed you', target: '', time: '15m ago', type: 'follow' },
  { avatar: '📊', name: 'Olivia M.', action: 'commented on', target: 'Workout Log', time: '1h ago', type: 'comment' },
  { avatar: '💪', name: 'David R.', action: 'liked your app', target: 'Recipe Finder', time: '2h ago', type: 'like' },
  { avatar: '🧘', name: 'Zen Labs', action: 'remixed', target: 'Meditation', time: '3h ago', type: 'remix' },
  { avatar: '🎮', name: 'GameStudio', action: 'followed you', target: '', time: '5h ago', type: 'follow' },
  { avatar: '🎯', name: 'Design Co.', action: 'commented on', target: 'Color Palette', time: '6h ago', type: 'comment' },
  { avatar: '⚡', name: 'Prod Inc.', action: 'liked your app', target: 'Todo Pro', time: '8h ago', type: 'like' },
  { avatar: '✨', name: 'Emily T.', action: 'followed you', target: '', time: '12h ago', type: 'follow' },
];

export const FOLLOWING_LIST = [
  { avatar: '🧑‍💻', name: 'Sarah K.', handle: '@sarah_k', relation: 'mutual' as const },
  { avatar: '🎨', name: 'Alex W.', handle: '@alex_w', relation: 'following' as const },
  { avatar: '🚀', name: 'Chen L.', handle: '@chen_l', relation: 'mutual' as const },
  { avatar: '📊', name: 'Olivia M.', handle: '@olivia_m', relation: 'following' as const },
  { avatar: '💪', name: 'David R.', handle: '@david_r', relation: 'mutual' as const },
  { avatar: '🎯', name: 'Design Co.', handle: '@design_co', relation: 'following' as const },
];

const FOLLOWERS_LIST = [
  { avatar: '🧘', name: 'Zen Labs', handle: '@zen_labs', relation: 'mutual' as const },
  { avatar: '🎮', name: 'GameStudio', handle: '@gamestudio', relation: 'follow_back' as const },
  { avatar: '🎯', name: 'Design Co.', handle: '@design_co', relation: 'mutual' as const },
  { avatar: '⚡', name: 'Prod Inc.', handle: '@prod_inc', relation: 'follow_back' as const },
  { avatar: '✨', name: 'Emily T.', handle: '@emily_t', relation: 'mutual' as const },
  { avatar: '🧑‍💻', name: 'Sarah K.', handle: '@sarah_k', relation: 'mutual' as const },
];

const SUBSCRIPTIONS = [
  { name: 'Pro Plan', status: 'Active', renewDate: 'Mar 15, 2026' },
  { name: 'Cloud Storage', status: 'Active', renewDate: 'Apr 2, 2026' },
];

const NOTIFICATION_TABS = ['All', 'Likes', 'Remixes', 'Follows', 'Comments'] as const;
const FOLLOW_TABS = ['Following', 'Followers'] as const;

export const NotificationPage: React.FC<{ isLight: boolean; initialTab?: string }> = ({ isLight, initialTab }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'All');
  const typeMap: Record<string, string> = { Likes: 'like', Remixes: 'remix', Follows: 'follow', Comments: 'comment' };
  const filtered = activeTab === 'All' ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.type === typeMap[activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-0 border-b border-foreground/10">
        {NOTIFICATION_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center pb-2.5 text-xs font-bold transition-all relative
              ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="notif-tab-full" className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="space-y-0">
        {filtered.map((n, i) => (
          <div key={i} className="flex items-center gap-3 py-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg flex-shrink-0">
              {n.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-foreground'}`}>
                <span className="font-bold">{n.name}</span>{' '}
                {n.action}{' '}
                {n.target && <span className="font-bold">{n.target}</span>}
              </p>
            </div>
            <span className="text-[11px] text-slate-400 flex-shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FollowPage: React.FC<{ isLight: boolean; onOpenUser?: (name: string) => void; initialTab?: string }> = ({ isLight, onOpenUser, initialTab }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'Following');
  const list = activeTab === 'Following' ? FOLLOWING_LIST : FOLLOWERS_LIST;

  const getButtonStyle = (relation: string, tab: string) => {
    if (relation === 'mutual') return { text: 'Mutual', style: 'bg-slate-900 text-white' };
    if (tab === 'Following') return { text: 'Following', style: 'bg-slate-100 text-slate-500' };
    return { text: 'Follow Back', style: 'bg-slate-900 text-white' };
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-0 border-b border-foreground/10">
        {FOLLOW_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center pb-2.5 text-sm font-bold transition-all relative
              ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="follow-tab-full" className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        {list.map((u, i) => {
          const btn = getButtonStyle(u.relation, activeTab);
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-3.5 cursor-pointer active:bg-slate-50/50 transition-colors rounded-xl -mx-1 px-1"
              onClick={() => onOpenUser?.(u.name)}
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg flex-shrink-0">
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>{u.name}</p>
                <p className="text-xs text-slate-400">{u.handle}</p>
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className={`text-xs font-medium px-4 py-1.5 rounded-full ${btn.style}`}
              >
                {btn.text}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SubscriptionPage: React.FC<{ isLight: boolean }> = ({ isLight }) => (
  <div className="space-y-3">
    {SUBSCRIPTIONS.map(sub => (
      <div key={sub.name} className="bg-white rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>{sub.name}</p>
            <p className="text-xs text-slate-400 mt-1">Renews {sub.renewDate}</p>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold">{sub.status}</span>
        </div>
      </div>
    ))}
  </div>
);

export const SettingsPage: React.FC<{ isLight: boolean; user: any }> = ({ isLight, user }) => {
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [likesNotif, setLikesNotif] = useState(true);
  const [followNotif, setFollowNotif] = useState(true);
  const [remixNotif, setRemixNotif] = useState(true);

  const sectionTitle = (text: string) => (
    <p className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wider pl-1 pt-5 pb-1">{text}</p>
  );

  const settingRow = (icon: React.ReactNode, label: string, value: React.ReactNode, border = true) => (
    <div className={`flex items-center justify-between py-3 px-1 ${border ? 'border-b border-border/40' : ''}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-foreground'}`}>{label}</span>
      </div>
      {value}
    </div>
  );

  const toggleSwitch = (checked: boolean, onChange: (v: boolean) => void, disabled = false) => (
    <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} className={disabled ? 'opacity-40' : ''} />
  );

  const notifSubEnabled = pushNotif || emailNotif;

  return (
    <div>
      {/* Account */}
      {sectionTitle('Account')}
      <div className="flex items-center gap-4 py-3 px-1 border-b border-border/40">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/80 shadow-md">
          <img src={user?.avatar || avatarYang} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>{user?.name || 'Yang'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || 'yang@whacka.com'}</p>
        </div>
        <ChevronDown size={16} className="text-muted-foreground -rotate-90" />
      </div>
      <button className="flex items-center gap-3 w-full py-3 px-1 border-b border-border/40 text-left active:bg-muted/30 transition-colors">
        <Shield size={18} className="text-foreground" />
        <span className={`text-sm flex-1 ${isLight ? 'text-slate-700' : 'text-foreground'}`}>Change Password</span>
        <ChevronDown size={16} className="text-muted-foreground -rotate-90" />
      </button>
      <button className="flex items-center gap-3 w-full py-3 px-1 text-left active:bg-muted/30 transition-colors">
        <Globe size={18} className="text-foreground" />
        <span className={`text-sm flex-1 ${isLight ? 'text-slate-700' : 'text-foreground'}`}>Language</span>
        <span className="text-xs text-muted-foreground mr-1">English</span>
        <ChevronDown size={16} className="text-muted-foreground -rotate-90" />
      </button>

      {/* Notifications */}
      {sectionTitle('Notifications')}
      {settingRow(<Bell size={18} className="text-foreground" />, 'Push Notifications', toggleSwitch(pushNotif, setPushNotif))}
      {settingRow(<BellOff size={18} className="text-foreground" />, 'Email Notifications', toggleSwitch(emailNotif, setEmailNotif), notifSubEnabled)}

      <AnimatePresence>
        {notifSubEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-2 border-l-2 border-border/30 ml-2 mt-1">
              {settingRow(<span className="text-sm">❤️</span>, 'Likes', toggleSwitch(likesNotif, setLikesNotif))}
              {settingRow(<span className="text-sm">👥</span>, 'New Followers', toggleSwitch(followNotif, setFollowNotif))}
              {settingRow(<span className="text-sm">🔄</span>, 'Remixes', toggleSwitch(remixNotif, setRemixNotif), false)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danger Zone */}
      {sectionTitle('')}
      <button className="flex items-center gap-3 w-full py-3 px-1 text-left active:bg-red-50 transition-colors">
        <Trash2 size={18} className="text-red-500" />
        <span className="text-sm font-medium text-red-500">Delete Account</span>
      </button>
    </div>
  );
};

/* ── Recent Page (full list) ── */
import { RECENT_ACTIVITY } from './SideMenu';

export const RecentPage: React.FC<{ isLight: boolean }> = ({ isLight }) => (
  <div className="space-y-0">
    {RECENT_ACTIVITY.map((item, i) => (
      <div key={i} className={`py-3.5 ${i < RECENT_ACTIVITY.length - 1 ? 'border-b border-border/20' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className={`text-[14px] font-semibold ${isLight ? 'text-slate-700' : 'text-foreground'}`}># {item.playlist}</h4>
            <p className={`text-[12px] mt-0.5 leading-snug ${isLight ? 'text-slate-400' : 'text-muted-foreground'}`}>
              {item.action}{item.target ? <> <span className="font-medium">{item.target}</span></> : ''}
              {item.comment ? <>: {item.comment}</> : ''}
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground flex-shrink-0 pt-0.5">{item.time}</span>
        </div>
      </div>
    ))}
  </div>
);

export const GuidesPage: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const steps = [
    { icon: Smartphone, text: 'Tap the **Get** button on any app you like' },
    { icon: ExternalLink, text: 'Open the copied link in **Safari** or **Chrome**' },
    { icon: Share, text: 'Tap the **Share** button in your browser' },
    { icon: PlusSquare, text: 'Select **"Add to Home Screen"** and confirm' },
  ];

  const gameTips = [
    { icon: LogIn, text: 'Add a **login screen** so players can save progress and come back for more 🔥' },
    { icon: Trophy, text: 'Drop in a **leaderboard** — nothing hits harder than seeing your name on top 🏆' },
    { icon: Music, text: 'Sound design matters! Add **music & sound effects** for taps, scores, and game over — vibes are everything 🎵' },
    { icon: Play, text: 'Design a **sick start screen** and a **friendly game over screen** that makes players wanna hit replay ✨' },
    { icon: Zap, text: 'Nail the **game pacing** — too fast = rage quit, too slow = snoozefest. Find that "one more round" sweet spot 💫' },
    { icon: Gamepad2, text: 'Don\'t skip **rewards & penalties**! Stars for wins 🌟, screen shakes for fails — keep \'em hooked 😆' },
  ];

  const renderBoldText = (text: string) =>
    text.split('**').map((part, j) =>
      j % 2 === 1
        ? <span key={j} className={`font-semibold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>{part}</span>
        : <span key={j}>{part}</span>
    );

  return (
    <div className="space-y-3">
      {/* Guide 1: Add to Home Screen */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => setIsOpen(v => !v)}
          className="w-full p-4 flex items-center gap-3 text-left"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Smartphone size={17} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>How to add apps to your Home Screen</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Install apps like native — no app store needed</p>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 space-y-3.5 border-t border-slate-50">
                <div className="pt-3.5" />
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <step.icon size={14} className="text-primary" />
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed flex-1">
                      <span className="text-slate-400 font-semibold mr-1.5">{i + 1}.</span>
                      {renderBoldText(step.text)}
                    </p>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-50">
                  🎉 That's it! The app will appear on your Home Screen just like any other app.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Guide 2: Game Tips */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => setIsGameOpen(v => !v)}
          className="w-full p-4 flex items-center gap-3 text-left"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Gamepad2 size={17} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-foreground'}`}>How to make a banger mini game 🎮</p>
            <p className="text-[11px] text-slate-400 mt-0.5">6 tips to keep players coming back for more</p>
          </div>
          <motion.div animate={{ rotate: isGameOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isGameOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 space-y-3.5 border-t border-slate-50">
                <div className="pt-3.5" />
                {gameTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <tip.icon size={14} className="text-primary" />
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed flex-1">
                      {renderBoldText(tip.text)}
                    </p>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-50">
                  🎯 Follow these tips and your game will be absolutely unputdownable!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Mic, MessageSquare, MessageCircle, Clock,
  Check, Loader2, Volume2, Copy, Share2, ImagePlus, Pencil, RefreshCw, Quote, Share, X
} from 'lucide-react';
import WhackaLogo from './WhackaLogo';
import DetailsPanelContent from '../views/DetailsPanelContent';
import { QRCodeSVG } from 'qrcode.react';
import VoiceWave from './VoiceWave';
import BottomTabBar from './BottomTabBar';
import CreatePanel from './CreatePanel';
import BuildTabView from '../views/BuildTabView';
import type { AppView } from '../../pages/Index';

/* Hand-drawn star SVG - matches BottomTabBar */
const HandDrawnStar = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C12.3 6 14 8 18 8.5C14.5 9.5 13 11.5 12 16C11 11.5 9 9.5 5.5 8.5C9.5 8 11.7 6 12 2Z"
      fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M18 14C18.2 16 19 17 21 17.2C19.2 17.8 18.3 18.8 18 21C17.7 18.8 16.8 17.8 15 17.2C16.8 17 17.8 16 18 14Z"
      fill="currentColor" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const getNowTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const thinkingSteps = [
  'Analyzing your idea...',
  'Generating database schema...',
  'Building UI components...',
  'Polishing the design...',
  'Almost ready! ✨',
];

const VOICE_SIMULATION_TEXT = '帮我创建一个语言学习app加入相机拍照功能识别外语文字';

const IDEAS = [
  '给我创建一个语言学习app加入相机拍照功能识别外语文字',
  '帮我做一个记账app支持拍照识别小票',
  '创建一个每日习惯打卡应用带统计图表',
];

interface FloatingAssistantProps {
  isLight: boolean;
  appView: AppView;
  onViewChange: (view: AppView) => void;
  appName?: string;
  appDesc?: string;
  mainTab?: number;
  onMainTabChange?: (tab: number) => void;
  isPanelOpen?: boolean;
  onPanelOpenChange?: (open: boolean) => void;
  panelType?: 'preview' | 'details';
  hideTabBar?: boolean;
  sidebarOpen?: boolean;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  homeGateActive?: boolean;
}

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ isLight, appView, onViewChange, appName: externalAppName, appDesc: externalAppDesc, mainTab = 0, onMainTabChange, isPanelOpen = false, onPanelOpenChange, panelType = 'preview', hideTabBar = false, sidebarOpen = false, isLoggedIn = true, onRequireAuth, homeGateActive = false }) => {
  const prevMainTabRef = useRef(mainTab);
  useEffect(() => {
    prevMainTabRef.current = mainTab;
  });
  // Capsule input state (explore/studio page only)
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'versions' | 'config' | 'publish' | 'comment'>('chat');
  const [urlCopied, setUrlCopied] = useState(false);
  const [appName, setAppName] = useState('My Awesome App');
  const [appDesc, setAppDesc] = useState('A smart app built with Whacka — create, explore, and share your ideas effortlessly.');

  // Sync with external app info
  useEffect(() => {
    if (externalAppName) setAppName(externalAppName);
    if (externalAppDesc) setAppDesc(externalAppDesc);
  }, [externalAppName, externalAppDesc]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const isLive = panelType === 'details';
  const appUrl = 'https://swift-box-996.whacka.app';
  const [inputText, setInputText] = useState('');
  const [capsuleText, setCapsuleText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quotedMsg, setQuotedMsg] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildPhase, setBuildPhase] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);
  const [showAutoSaveTip, setShowAutoSaveTip] = useState(false);
  const [showBonusTip, setShowBonusTip] = useState(false);
  const [showVoiceIndicator, setShowVoiceIndicator] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [configToggles, setConfigToggles] = useState<Record<string, boolean>>({
    'Voice Mode': true,
    'Real-time Translation': false,
    'Debug Info': false,
    'Auth': false,
    'PC Adaptive': false,
  });

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const voiceSimTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const capsuleInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current && activeTab === 'chat') {
      setTimeout(() => {
        chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isBuilding, buildPhase, isPanelOpen, activeTab]);

  // Idea carousel for capsule
  useEffect(() => {
    if (!isCapsuleOpen) return;
    const interval = setInterval(() => {
      setIdeaIndex(prev => (prev + 1) % IDEAS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCapsuleOpen]);

  // Auto-select social tab for live apps
  useEffect(() => {
    if (isPanelOpen && panelType === 'details') setActiveTab('comment');
    else if (isPanelOpen && panelType === 'preview') setActiveTab('chat');
  }, [isPanelOpen, panelType]);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isPanelOpen]);

  // Build simulation
  useEffect(() => {
    if (!isBuilding) return;
    onViewChange('preview');
    setIsCapsuleOpen(false);
    setIsPanelOpen(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    thinkingSteps.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setBuildPhase(i);
      if (i === thinkingSteps.length - 1) {
          setTimeout(() => {
            setIsBuilding(false);
            setBuildComplete(true);
            setShowAutoSaveTip(true);
            setShowBonusTip(true);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: 'Your app is ready! 🎉 The preview has been updated.',
              timestamp: getNowTime(),
            }]);
            setTimeout(() => setBuildComplete(false), 3000);
          }, 800);
        }
      }, (i + 1) * 1200));
    });
    return () => timers.forEach(clearTimeout);
  }, [isBuilding, onViewChange]);

  // Voice simulation
  useEffect(() => {
    if (!showVoiceIndicator) {
      if (voiceSimTimer.current) {
        clearInterval(voiceSimTimer.current);
        voiceSimTimer.current = null;
      }
      return;
    }
    let charIndex = 0;
    setVoiceText('');
    voiceSimTimer.current = setInterval(() => {
      charIndex++;
      if (charIndex <= VOICE_SIMULATION_TEXT.length) {
        setVoiceText(VOICE_SIMULATION_TEXT.slice(0, charIndex));
      }
    }, 80);
    return () => {
      if (voiceSimTimer.current) {
        clearInterval(voiceSimTimer.current);
        voiceSimTimer.current = null;
      }
    };
  }, [showVoiceIndicator]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isBuilding) return;
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: getNowTime() }]);
    setInputText('');
    setIsBuilding(true);
    setBuildPhase(0);
  };

  const handleCapsuleSend = () => {
    const text = capsuleText.trim();
    if (!text || isBuilding) return;
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: getNowTime() }]);
    setCapsuleText('');
    setIsBuilding(true);
    setBuildPhase(0);
  };

  const handleVoiceSend = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text, timestamp: getNowTime() }]);
    setIsBuilding(true);
    setBuildPhase(0);
  };

  const handlePressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowVoiceIndicator(true);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLongPress.current) {
      const finalText = voiceText || VOICE_SIMULATION_TEXT;
      setShowVoiceIndicator(false);
      setVoiceText('');
      handleVoiceSend(finalText);
    } else {
      if (!isLoggedIn && onRequireAuth) {
        onRequireAuth();
        return;
      }
      if (appView === 'explore') {
        // Switch to Create tab
        onMainTabChange?.(2);
      } else {
        setIsPanelOpen(prev => !prev);
      }
    }
  };

  const handlePressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setShowVoiceIndicator(false);
    setVoiceText('');
  };

  // Voice-only press handlers for capsule mic button
  const handleVoicePressStart = () => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowVoiceIndicator(true);
    }, 500);
  };

  const handleVoicePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (isLongPress.current) {
      const finalText = voiceText || VOICE_SIMULATION_TEXT;
      setShowVoiceIndicator(false);
      setVoiceText('');
      handleVoiceSend(finalText);
    }
  };

  const handlePanelDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y > 80) setIsPanelOpen(false);
  };

  const baseTabs = [
    { key: 'chat' as const, label: 'Chat' },
    { key: 'publish' as const, label: 'Publish' },
  ];

  const tabs = panelType === 'details'
    ? [{ key: 'comment' as const, label: 'Comment' }, ...baseTabs]
    : baseTabs;

  const versions = [
    { id: 'v3', label: 'Added dark mode toggle', time: '2 min ago', active: true },
    { id: 'v2', label: 'Updated hero section', time: '8 min ago', active: false },
    { id: 'v1', label: 'Initial build', time: '15 min ago', active: false },
  ];

  const setIsPanelOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const newVal = typeof v === 'function' ? v(isPanelOpen) : v;
    onPanelOpenChange?.(newVal);
  };

  // Visual order: Home(0)=0, Build(2)=1, Explore(1)=2
  const TAB_POS: Record<number, number> = { 0: 0, 1: 2, 2: 1 };
  const prevPos = TAB_POS[prevMainTabRef.current] ?? prevMainTabRef.current;
  const buildSlideX = prevPos < 1 ? '100%' : '-100%';

  return (
    <>
      {/* ===== BOTTOM TAB BAR (explore/home views only) ===== */}
      {appView === 'explore' && !hideTabBar && (
        <motion.div
          animate={{ x: sidebarOpen ? '72%' : 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 34 }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
        <BottomTabBar
          activeTab={homeGateActive ? 0 : mainTab}
          onTabChange={(i) => onMainTabChange?.(i)}
        />
        </motion.div>
      )}

      {/* ===== BUILD TAB VIEW (inline, when tab 2 is active) ===== */}
      <AnimatePresence mode="wait">
        {appView === 'explore' && mainTab === 2 && (
          <motion.div
            key="build-tab-view"
            className="fixed inset-0 z-30 bg-[#F9FAFB]"
            initial={{ x: buildSlideX, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: buildSlideX, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <BuildTabView
              inputText={capsuleText}
              onInputChange={setCapsuleText}
              onSend={handleCapsuleSend}
              onBubbleClick={(text) => setCapsuleText(text)}
              onMicPressStart={handleVoicePressStart}
              onMicPressEnd={handleVoicePressEnd}
              onMicPressCancel={handlePressCancel}
              isBuilding={isBuilding}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DRAWER PANEL - portaled to body ===== */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isPanelOpen && (
            <>
              <motion.div
                key="drawer-backdrop"
                className="fixed inset-0 z-[998] bg-background/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPanelOpen(false)}
              />
              <motion.div
                key="drawer-panel"
                className="fixed left-0 right-0 bottom-0 z-[1000] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl bg-background"
                style={{ height: '67vh' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.2}
                onDragEnd={handlePanelDragEnd}
              >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>
            <>
            <div className="flex gap-0 border-b border-foreground/10 mb-1 pt-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-center pb-2.5 text-sm font-bold transition-all relative capitalize ${
                    activeTab === tab.key ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div layoutId="assistant-panel-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
                  )}
                </button>
              ))}
            </div>
            {activeTab !== 'comment' && <div ref={chatScrollRef} className="flex-1 overflow-y-auto min-h-0 px-4 pb-2">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' && (
                  <motion.div key="chat" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3 py-2">
                    {messages.length === 0 && !isBuilding && (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">Ask for changes to your app</p>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {/* Name */}
                        <p className="text-[13px] text-muted-foreground mb-1 px-1">
                          {msg.role === 'user' ? <span className="font-bold">liyang</span> : <span style={{ fontFamily: "'Pacifico', cursive", fontSize: '15px', fontWeight: 400 }}>Whacka</span>}
                        </p>
                        {/* Bubble */}
                        <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm ${
                          msg.role === 'user'
                            ? 'chat-bubble-user rounded-br-md'
                            : 'chat-bubble-ai rounded-bl-md'
                        }`}>
                          {msg.content}
                        </div>
                        {/* Timestamp + actions */}
                        <div className={`flex items-center gap-2 mt-1 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] text-muted-foreground/60">{msg.timestamp}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                setCopiedIndex(i);
                                setTimeout(() => setCopiedIndex(null), 1500);
                              }}
                              className="p-1 rounded-md hover:bg-foreground/5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            >
                              {copiedIndex === i ? <Check size={11} className="text-primary" /> : <Copy size={11} />}
                            </button>
                            <button
                              onClick={() => setQuotedMsg(msg.content)}
                              className="p-1 rounded-md hover:bg-foreground/5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            >
                              <Quote size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === 'publish' && (
                  <motion.div key="publish" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-5 py-2">
                    {/* APP INFO group */}
                    <div>
                      <p className="text-[13px] text-foreground font-bold mb-2 px-1">App Info</p>
                      <div className="space-y-2">
                        {/* Name + Icon row */}
                        <div className="flex items-stretch gap-2">
                          {/* Name */}
                          <div className="bg-foreground/[0.03] rounded-xl px-4 py-3 flex-1 min-w-0">
                            <p className="text-[11px] text-muted-foreground/60 mb-1">Name</p>
                            {isEditingName ? (
                              <input
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                onBlur={() => setIsEditingName(false)}
                                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
                                className="w-full bg-transparent text-sm text-foreground outline-none min-h-[36px]"
                                autoFocus
                              />
                            ) : (
                              <button onClick={() => setIsEditingName(true)} className="text-sm text-foreground text-left truncate w-full min-h-[36px]">
                                {appName}
                              </button>
                            )}
                          </div>
                          {/* Icon */}
                          <div className="bg-foreground/[0.03] rounded-xl px-4 py-3 flex-shrink-0">
                            <p className="text-[11px] text-muted-foreground/60 mb-1">Icon</p>
                            <div className="flex items-center gap-2">
                              <button className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xl overflow-hidden border border-foreground/5 active:scale-95 transition-transform" title="Upload icon">
                                🚀
                                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg rounded-br-[13px] bg-foreground/40 flex items-center justify-center">
                                  <Pencil size={9} className="text-background" />
                                </span>
                              </button>
                              <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Regenerate icon">
                                <RefreshCw size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Tagline */}
                        <div className="bg-foreground/[0.03] rounded-xl px-4 py-3">
                          <p className="text-[11px] text-muted-foreground/60 mb-1">Tagline <span className="text-muted-foreground/30">·</span> <span className="text-muted-foreground/40">Shown on the App card</span></p>
                          {isEditingDesc ? (
                            <textarea
                              value={appDesc}
                              onChange={(e) => setAppDesc(e.target.value)}
                              onBlur={() => setIsEditingDesc(false)}
                              className="w-full bg-transparent text-sm text-foreground outline-none resize-none min-h-[44px]"
                              autoFocus
                              rows={2}
                            />
                          ) : (
                            <button onClick={() => setIsEditingDesc(true)} className="text-sm text-foreground leading-relaxed text-left w-full min-h-[36px]">
                              {appDesc}
                            </button>
                          )}
                        </div>
                        {/* Note to Users */}
                        <div className="bg-foreground/[0.03] rounded-xl px-4 py-3">
                          <p className="text-[11px] text-muted-foreground/60 mb-1">Note to Users</p>
                          {isEditingInstruction ? (
                            <textarea
                              value={instructionText}
                              onChange={(e) => setInstructionText(e.target.value)}
                              onBlur={() => setIsEditingInstruction(false)}
                              className="w-full bg-transparent text-sm text-foreground outline-none resize-none min-h-[60px]"
                              placeholder="Share how this app works, or tell us about your creative inspiration! A great intro helps your creation stand out."
                              autoFocus
                              rows={3}
                            />
                          ) : (
                            <button onClick={() => setIsEditingInstruction(true)} className="text-sm leading-relaxed text-left w-full min-h-[36px]">
                              {instructionText || <span className="text-muted-foreground/40">Share how this app works, or tell us about your creative inspiration! A great intro helps your creation stand out.</span>}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Live-only: Share Section */}
                    {isLive && (
                      <div>
                        <p className="text-[13px] text-foreground font-bold mb-2 px-1">Share</p>
                        <div className="space-y-2">
                          {/* URL */}
                          <div className="bg-foreground/[0.03] rounded-xl px-4 py-3">
                            <p className="text-[11px] text-muted-foreground/60 mb-1">URL</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground break-all flex-1 font-mono select-all">{appUrl}</p>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(appUrl);
                                  setUrlCopied(true);
                                  setTimeout(() => setUrlCopied(false), 2000);
                                }}
                                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                              >
                                {urlCopied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                              </button>
                            </div>
                          </div>
                          {/* QR Code */}
                          <div className="bg-foreground/[0.03] rounded-xl px-4 py-3">
                            <p className="text-[11px] text-muted-foreground/60 mb-2">QR Code <span className="text-muted-foreground/30">·</span> <span className="text-muted-foreground/40">Scan or long-press to save and share</span></p>
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white rounded-xl p-3">
                                <QRCodeSVG value={appUrl} size={140} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Publish Section */}
                    <div>
                      {isLive && <p className="text-[13px] text-foreground font-bold mb-1 px-1">Publish</p>}
                      {isLive && (
                        <p className="text-[11px] text-muted-foreground/60 mb-2 px-1">Last published 2025/03/10 14:32:05</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-3.5 rounded-full bg-foreground text-background text-sm font-semibold active:scale-[0.98] transition-transform">
                          {isLive ? 'Save & Publish Latest Version' : 'Publish'}
                        </button>
                        {isLive && (
                          <button className="px-4 py-3.5 rounded-full bg-muted text-muted-foreground text-xs font-medium active:scale-[0.98] transition-transform">
                            Unpublish
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>}
            {activeTab === 'comment' ? (
              <motion.div key="comment" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 flex flex-col min-h-0 px-4">
                <DetailsPanelContent variant="social" />
              </motion.div>
            ) : activeTab === 'chat' ? (
              <>
                {/* Bonus credits tip */}
                <AnimatePresence>
                  {showBonusTip && !isBuilding && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="mx-4 mb-2 rounded-full px-4 py-3 flex items-center gap-3"
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
                    >
                      <p className="text-[12px] text-slate-800 leading-snug flex-1">
                        10 messages reached! Daily creation bonus{' '}
                        <span style={{ color: '#F97316', fontWeight: 600 }}>+5</span>{' '}credits{' '}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block -mt-0.5 text-slate-500"><circle cx="12" cy="12" r="10"/><path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/></svg>
                      </p>
                      <button onClick={() => setShowBonusTip(false)} className="text-slate-400 flex-shrink-0">
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {showAutoSaveTip && !isBuilding && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25 }}
                      className="mx-4 mb-2 rounded-full px-4 py-3 flex items-center gap-3"
                      style={{ background: '#1e293b' }}
                    >
                      
                      <p className="text-[12px] text-white/90 leading-snug flex-1">
                        Your app is auto saved & published. Share or add to phone screen through <Share size={10} className="inline-block text-white/60 -mt-0.5" /> anytime!
                      </p>
                      <button onClick={() => setShowAutoSaveTip(false)} className="text-white/50 flex-shrink-0">
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              <div className="flex-shrink-0 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-2 border-t border-foreground/5">
                {/* Building step carousel — one at a time */}
                <AnimatePresence mode="wait">
                  {isBuilding && (
                    <motion.div
                      key={`step-${buildPhase}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mb-2 flex items-center gap-2 text-xs px-1"
                    >
                      <Loader2 size={12} className="animate-spin text-primary" />
                      <span className="text-muted-foreground">{thinkingSteps[buildPhase]}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Quoted message indicator */}
                <AnimatePresence>
                  {quotedMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-foreground/5"
                    >
                      <Quote size={12} className="text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground truncate flex-1">{quotedMsg}</p>
                      <button onClick={() => setQuotedMsg(null)} className="text-muted-foreground/50 hover:text-muted-foreground text-xs">✕</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-2 bg-foreground/5 rounded-full px-3 py-2">
                  <motion.button className="p-2 rounded-full text-foreground flex-shrink-0" whileTap={{ scale: 0.9 }}>
                    <Mic size={16} />
                  </motion.button>
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe your changes..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none min-h-[36px] max-h-[100px] py-2 leading-snug"
                    rows={1}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                  <motion.button
                    className={`p-2 rounded-full flex-shrink-0 transition-colors ${inputText.trim() ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
              </>
            ) : (
              <div className="flex-shrink-0 pb-[env(safe-area-inset-bottom,8px)]" />
            )}
            </>
          </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ===== VOICE RECOGNITION BUBBLE ===== */}
      <AnimatePresence>
        {showVoiceIndicator && (
          <motion.div
            className="fixed bottom-24 right-4 left-4 z-[1001]"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="floating-panel rounded-2xl px-4 py-3 max-w-sm ml-auto">
              <div className="flex items-center gap-2 mb-2">
                <VoiceWave />
                <span className="text-xs text-muted-foreground">识别中...</span>
              </div>
              <p className="text-sm text-foreground min-h-[20px]">
                {voiceText}
                <motion.span
                  className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAssistant;

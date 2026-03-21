import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Share } from 'lucide-react';
import iconFittrack from '@/assets/icon-fittrack.png';
import ShareDropdown from '../components/whacka/ShareDropdown';
import SideMenu from '../components/whacka/SideMenu';
import FloatingAssistant from '../components/whacka/FloatingAssistant';
import ExploreView from '../components/views/ExploreView';
import type { AppInfo } from '../components/views/ExploreView';
import HomeView from '../components/views/HomeView';
import type { StudioApp } from '../components/views/HomeView';
import UserProfileView from '../components/views/UserProfileView';
import CategoryView from '../components/views/CategoryView';
import DetailsView from '../components/views/DetailsView';
import { useAuth } from '../hooks/useAuth';

// Import sub-page components from SideMenu file for reuse
import { NotificationPage, FollowPage, SubscriptionPage, SettingsPage, GuidesPage, RecentPage } from '../components/whacka/SideMenuPages';

export type AppView = 'explore' | 'preview' | 'category' | 'details' | 'userProfile';
type SubPage = 'notification' | 'follow' | 'subscription' | 'settings' | 'guides' | 'recent' | null;

const SUB_PAGE_TITLES: Record<string, string> = {
  notification: 'Notifications',
  follow: 'Follow',
  subscription: 'Subscription',
  guides: 'Guides',
  settings: 'Settings',
  recent: 'Recent',
};

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState(1); // default to Explore tab
  const [prevTab, setPrevTab] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [isLight, setIsLight] = useState(true);
  const [appView, setAppView] = useState<AppView>('explore');
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [currentApp, setCurrentApp] = useState<AppInfo | null>(null);
  const [collectedApps, setCollectedApps] = useState<StudioApp[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState<'preview' | 'details'>('preview');
  const [subPage, setSubPage] = useState<SubPage>(null);
  const [followInitialTab, setFollowInitialTab] = useState<string>('Following');
  const [previewShareOpen, setPreviewShareOpen] = useState(false);
  const [notifInitialTab, setNotifInitialTab] = useState<string>('All');
  const [profileAuthor, setProfileAuthor] = useState<string>('');
  const [initialPlaylist, setInitialPlaylist] = useState<string | undefined>(undefined);

  const handleOpenUser = (authorName: string) => {
    setProfileAuthor(authorName);
    setAppView('userProfile');
  };

  // When switching to preview from assistant build, ensure panel type is 'preview' (draft)
  const handleViewChange = (view: AppView) => {
    if (view === 'preview' && appView !== 'preview') {
      setPanelType('preview');
    }
    setAppView(view);
  };
  

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLight]);

  const handleTabChange = (tab: number) => {
    // Gate Home tab (index 0) when not logged in
    if (tab === 0 && !isLoggedIn) {
      navigate('/auth');
      return;
    }
    setPrevTab(mainTab);
    setMainTab(tab);
  };

  const handleOpenCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setAppView('category');
  };

  const handleOpenApp = (app: AppInfo) => {
    setCurrentApp(app);
    setAppView('details');
  };

  const handleOpenBuilderFromHome = (app: AppInfo, pt: 'preview' | 'details') => {
    setCurrentApp(app);
    setPanelType(pt);
    setAppView('preview');
    setIsPanelOpen(true);
  };

  const handleRemixApp = (app: AppInfo) => {
    // Add as draft to collected apps
    const alreadyDraft = collectedApps.some(a => a.id === app.id && a.status === 'draft');
    if (!alreadyDraft) {
      setCollectedApps(prev => [
        ...prev,
        {
          id: Date.now(), // unique id so it doesn't clash with the collected one
          name: app.name,
          desc: app.desc,
          status: 'draft' as const,
          icon: app.icon,
          glowColor: 'bg-violet-200',
        },
      ]);
    }
    // Navigate to draft preview
    setCurrentApp(app);
    setPanelType('preview');
    setAppView('preview');
    setIsPanelOpen(true);
  };

  const handleCollectApp = (app: AppInfo) => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
    const alreadyCollected = collectedApps.some(a => a.id === app.id);
    if (alreadyCollected) return;
    setCollectedApps(prev => [...prev, {
      id: app.id,
      name: app.name,
      desc: app.desc,
      status: 'collected' as const,
      icon: app.icon,
      glowColor: 'bg-violet-200',
    }]);
  };

  const handleRequireAuth = () => {
    navigate('/auth');
  };

  // Visual tab positions: Home(0)=0, Explore(1)=2, Build(2)=1
  const TAB_POSITION: Record<number, number> = { 0: 0, 1: 2, 2: 1 };
  const slideDir = useRef(1);
  if (mainTab !== prevTab) {
    slideDir.current = (TAB_POSITION[mainTab] ?? mainTab) > (TAB_POSITION[prevTab] ?? prevTab) ? 1 : -1;
  }

  const tabVariants = {
    enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
  };

  const tabContent = [
    {
      key: 'home-page',
      content: (
        <HomeView
          onOpenBuilder={handleOpenBuilderFromHome}
          onOpenDetails={handleOpenApp}
          collectedApps={collectedApps}
          onOpenFollowers={() => {
            setFollowInitialTab('Followers');
            setSubPage('follow');
          }}
          onOpenNotifications={() => { setNotifInitialTab('All'); setSubPage('notification'); }}
          onOpenMenu={() => setShowProfile(true)}
          onOpenLikes={() => { setNotifInitialTab('Likes'); setSubPage('notification'); }}
        />
      ),
    },
    {
      key: 'explore-page',
      content: (
        <ExploreView
          onOpenCategory={handleOpenCategory}
          onOpenApp={handleOpenApp}
          onCollectApp={handleCollectApp}
          savedIds={collectedApps.map(a => a.id)}
          isLoggedIn={isLoggedIn}
          onRequireAuth={handleRequireAuth}
          onOpenNotifications={() => setSubPage('notification')}
          onOpenMenu={() => setShowProfile(true)}
          initialPlaylist={initialPlaylist}
          onPlaylistConsumed={() => setInitialPlaylist(undefined)}
        />
      ),
    },
  ];

  const sidebarWidth = '72%';

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${isLight ? 'bg-[#F9FAFB]' : 'bg-ambient'}`}>
      {/* Sidebar rendered outside the shifting wrapper */}
      <SideMenu
        isOpen={showProfile}
        onClose={() => {
          setShowProfile(false);
        }}
        isLight={isLight}
        onToggleTheme={() => setIsLight(!isLight)}
        onNavigateSubPage={(page, options) => {
          if (page === 'follow' && options?.tab) {
            setFollowInitialTab(options.tab);
          } else if (page === 'follow') {
            setFollowInitialTab('Following');
          }
          setSubPage(page);
          setShowProfile(false);
        }}
        onOpenUser={(name) => {
          setShowProfile(false);
          handleOpenUser(name);
        }}
        onRecentAction={(actionType, payload) => {
          if (actionType === 'openPlaylist') {
            // Switch to explore tab with playlist
            setInitialPlaylist(payload.playlistName);
            setPrevTab(mainTab);
            setMainTab(1);
            setAppView('explore');
          } else if (actionType === 'openApp') {
            // Open FitTrack Pro details
            const fittrackApp: AppInfo = { id: 11, name: 'FitTrack Pro', desc: 'AI-powered fitness tracking', icon: iconFittrack };
            // Try to find the real icon from imports
            handleOpenApp(fittrackApp);
          }
        }}
      />

      {/* Sub-page full screen overlay */}
      <AnimatePresence>
        {subPage && (
          <motion.div
            key={subPage}
            className={`fixed inset-0 z-50 flex flex-col ${isLight ? 'bg-[#F9FAFB]' : 'bg-ambient'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Aurora bg */}
            <div className="absolute inset-x-0 top-0 h-[200px] overflow-hidden pointer-events-none">
              <div className="absolute top-6 left-4 w-32 h-32 rounded-full bg-sky-300/15 blur-2xl" />
              <div className="absolute top-12 right-2 w-28 h-28 rounded-full bg-amber-200/20 blur-2xl" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-orange-200/15 blur-2xl" />
            </div>

            <header className="relative z-10 px-4 pt-14 pb-4 flex items-center gap-3">
              <motion.button
                onClick={() => {
                  setSubPage(null);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-slate-500 active:bg-slate-50"
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <h1 className="text-xl font-bold text-slate-900">{SUB_PAGE_TITLES[subPage]}</h1>
            </header>

            <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-8">
              {subPage === 'notification' && <NotificationPage isLight={isLight} initialTab={notifInitialTab} />}
              {subPage === 'follow' && <FollowPage isLight={isLight} initialTab={followInitialTab} onOpenUser={(name) => { setSubPage(null); handleOpenUser(name); }} />}
              {subPage === 'subscription' && <SubscriptionPage isLight={isLight} />}
              {subPage === 'settings' && <SettingsPage isLight={isLight} user={user} />}
              {subPage === 'guides' && <GuidesPage isLight={isLight} />}
              {subPage === 'recent' && <RecentPage isLight={isLight} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Entire page shifts right when sidebar is open */}
      <motion.div
        className="fixed inset-0 z-0 flex flex-col"
        animate={{ x: showProfile ? sidebarWidth : 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 34 }}
      >
        <AnimatePresence mode="wait">
          {appView === 'explore' ? (
            <motion.div
              key="explore-shell"
              className="relative flex-1 min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >

              <main className="h-full overflow-hidden relative">
                <AnimatePresence initial={false} mode="popLayout" custom={slideDir.current}>
                  {tabContent[mainTab] && (
                    <motion.div
                      key={tabContent[mainTab].key}
                      custom={slideDir.current}
                      className="absolute inset-0 overflow-y-auto"
                      variants={tabVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      {tabContent[mainTab].content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </motion.div>
          ) : appView === 'category' ? (
            <motion.div
              key="category-shell"
              className="relative flex-1 min-h-0 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CategoryView
                categoryId={selectedCategory}
                onBack={() => setAppView('explore')}
                onChangeCategory={setSelectedCategory}
                onOpenApp={handleOpenApp}
                onCollectApp={handleCollectApp}
                savedIds={collectedApps.map(a => a.id)}
              />
            </motion.div>
          ) : appView === 'details' ? (
            <motion.div
              key="details-shell"
              className="relative flex-1 min-h-0 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <DetailsView
                app={currentApp || { id: 0, name: 'App', desc: '', icon: '' }}
                onBack={() => setAppView('explore')}
                onCollect={handleCollectApp}
                onRemix={handleRemixApp}
                isSaved={collectedApps.some(a => a.id === currentApp?.id)}
                isLoggedIn={isLoggedIn}
                onRequireAuth={handleRequireAuth}
                onOpenUser={handleOpenUser}
              />
            </motion.div>
          ) : appView === 'userProfile' ? (
            <motion.div
              key="user-profile-shell"
              className="relative flex-1 min-h-0 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <UserProfileView
                authorName={profileAuthor}
                onBack={() => setAppView('explore')}
                onOpenApp={handleOpenApp}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview-shell"
              className="flex flex-col flex-1 min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <header className="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-center justify-between">
                <motion.button
                  onClick={() => setAppView('explore')}
                  className="liquid-button w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-foreground"
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={() => setIsPanelOpen(true)}
                  className="liquid-button px-4 py-2 rounded-full flex items-center justify-center min-h-[44px]"
                  whileTap={{ scale: 0.95 }}
                >
                  <h1 className="text-sm font-semibold text-foreground">
                    {currentApp?.name || 'My Awesome App'}
                  </h1>
                </motion.button>
                {panelType === 'details' ? (
                  <motion.button
                    onClick={() => setPreviewShareOpen(prev => !prev)}
                    className="liquid-button w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-foreground"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share size={20} />
                  </motion.button>
                ) : (
                  <div className="w-10 h-10 min-w-[44px]" />
                )}
              </header>

              {/* Share Dropdown for live apps */}
              {panelType === 'details' && (
                <ShareDropdown
                  isOpen={previewShareOpen}
                  onClose={() => setPreviewShareOpen(false)}
                  shareUrl={`https://whacka.app/app/${currentApp?.name?.toLowerCase().replace(/\s+/g, '-') || 'example-id'}`}
                  shareText={`Check out ${currentApp?.name || 'this app'} on Whacka!`}
                />
              )}

              <main className="flex-1 overflow-y-auto px-4 pb-24 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {currentApp?.icon ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border border-foreground/5 shadow-lg">
                      <img src={currentApp.icon} alt={currentApp.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-6xl">📱</span>
                  )}
                  <h2 className="text-lg font-semibold text-foreground">{currentApp?.name || 'Your App Preview'}</h2>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {currentApp?.desc || 'Your generated app renders here. Use the assistant to make changes.'}
                  </p>
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <FloatingAssistant
        isLight={isLight}
        appView={appView}
        sidebarOpen={showProfile}
        onViewChange={handleViewChange}
        appName={currentApp?.name}
        appDesc={currentApp?.desc}
        mainTab={mainTab}
        onMainTabChange={handleTabChange}
        isPanelOpen={isPanelOpen}
        onPanelOpenChange={setIsPanelOpen}
        panelType={panelType}
        hideTabBar={false}
        isLoggedIn={isLoggedIn}
        onRequireAuth={handleRequireAuth}
      />
    </div>
  );
};

export default Index;

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share } from 'lucide-react';
import type { AppInfo } from './ExploreView';
import DetailsPanelContent, { defaultSocialData } from './DetailsPanelContent';
import ShareDropdown from '@/components/whacka/ShareDropdown';

interface DetailsViewProps {
  app: AppInfo;
  onBack: () => void;
  onCollect: (app: AppInfo) => void;
  onRemix?: (app: AppInfo) => void;
  isSaved: boolean;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  onOpenUser?: (authorName: string) => void;
}

const DetailsView: React.FC<DetailsViewProps> = ({ app, onBack, onCollect, onRemix, isSaved, isLoggedIn = true, onRequireAuth, onOpenUser }) => {
  const [drawerExpanded, setDrawerExpanded] = useState(true);
  const [drawerHeight, setDrawerHeight] = useState<'30vh' | '50vh' | '75vh'>('30vh');
  const [shareOpen, setShareOpen] = useState(false);
  const [inputExpanded, setInputExpanded] = useState(false);
  const baseHeight = useRef<'30vh' | '50vh'>('30vh');

  const handleTabChange = (tab: 'instruction' | 'comments') => {
    baseHeight.current = tab === 'comments' ? '50vh' : '30vh';
    setDrawerHeight(inputExpanded ? '75vh' : baseHeight.current);
  };

  const handleInputExpandChange = (expanded: boolean) => {
    setInputExpanded(expanded);
    setDrawerHeight(expanded ? '75vh' : baseHeight.current);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-center justify-between">
        <motion.button
          onClick={onBack}
          className="liquid-button w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-foreground"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.button
          onClick={() => setDrawerExpanded(prev => !prev)}
          className="liquid-button px-4 py-2 rounded-full flex items-center justify-center min-h-[44px]"
          whileTap={{ scale: 0.95 }}
        >
          <h1 className="text-sm font-semibold text-foreground">{app.name}</h1>
        </motion.button>
        <motion.button
          onClick={() => setShareOpen(prev => !prev)}
          className="liquid-button w-10 h-10 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px] text-foreground"
          whileTap={{ scale: 0.9 }}
        >
          <Share size={20} />
        </motion.button>
      </header>

      {/* Share Dropdown */}
      <ShareDropdown
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={`https://whacka.app/app/${app.name.toLowerCase().replace(/\s+/g, '-')}`}
        shareText={`Check out ${app.name} on Whacka!`}
      />

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-[40vh]">
        <div className="text-center space-y-4">
          {app.icon ? (
            <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border border-foreground/5 shadow-lg">
              <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <span className="text-6xl">📱</span>
          )}
          <h2 className="text-lg font-semibold text-foreground">{app.name}</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">{app.desc}</p>
        </div>
      </main>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {drawerExpanded && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-[40]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerExpanded(false)}
            />
            <motion.div
              key="drawer"
              className="fixed left-0 right-0 bottom-0 z-[50] rounded-t-3xl bg-background shadow-[0_-4px_30px_rgba(0,0,0,0.08)]"
              initial={{ y: '100%' }}
              animate={{ y: 0, height: drawerHeight }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.y > 50) setDrawerExpanded(false);
              }}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-foreground/20" />
              </div>
              <div className="flex flex-col px-4 pb-2" style={{ height: 'calc(100% - 24px)' }}>
                <DetailsPanelContent social={defaultSocialData} onRemix={() => onRemix?.(app)} appName={app.name} appDesc={app.desc} isSaved={isSaved} onCollect={() => onCollect(app)} isLoggedIn={isLoggedIn} onRequireAuth={onRequireAuth} onTabChange={handleTabChange} onInputExpandChange={handleInputExpandChange} onOpenUser={onOpenUser} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailsView;

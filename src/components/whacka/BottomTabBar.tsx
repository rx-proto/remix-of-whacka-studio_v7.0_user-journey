import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, Sparkle } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  onCreateClick?: () => void;
}

const BAR_HEIGHT = 56;

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  // Visual order: Home(0), Build(2), Explore(1)
  const tabs = [
    { index: 0, icon: Home, label: 'Home', iconSize: 18, filledIcon: HomeFilled },
    { index: 2, icon: Sparkle, label: 'Build', iconSize: 19, filledIcon: SparkleFilledIcon },
    { index: 1, icon: Compass, label: 'Explore', iconSize: 20, filledIcon: CompassFilled },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+24px)] px-14">
      <div
        className="glass-button rounded-full flex items-center overflow-hidden relative w-full"
        style={{ height: BAR_HEIGHT }}
      >
        <div className="flex items-center w-full p-1 relative" style={{ height: BAR_HEIGHT }}>
          {tabs.map((tab) => (
            <div key={tab.index} className="flex-1 flex justify-center relative" style={{ minWidth: 0 }}>
              {/* Active tab white highlight background */}
              {activeTab === tab.index && (
                <motion.div
                  layoutId="tab-highlight"
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <TabButton
                icon={tab.icon}
                label={tab.label}
                isActive={activeTab === tab.index}
                onClick={() => onTabChange(tab.index)}
                height={BAR_HEIGHT}
                iconSize={tab.iconSize}
                filledIcon={tab.filledIcon}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SparkleFilledIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
      fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const HomeFilled: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 10.182V22h18V10.182L12 2L3 10.182Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    <rect x="9" y="14" width="6" height="8" rx="1" fill="white" />
  </svg>
);

const CompassFilled: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" strokeWidth={2} />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="white" />
  </svg>
);

const TabButton: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  height: number;
  iconSize?: number;
  filledIcon?: React.FC<{ size: number }>;
}> = ({ icon: Icon, label, isActive, onClick, height, iconSize = 18, filledIcon: FilledIcon }) => (
  <motion.button
    onClick={onClick}
    className="relative z-10 flex flex-col items-center gap-0.5 px-5 py-1 rounded-full justify-center flex-1 text-foreground"
    style={{ height: height - 8 }}
    whileTap={{ scale: 0.92 }}
  >
    {isActive ? (
      FilledIcon ? <FilledIcon size={iconSize} /> :
      <Icon size={iconSize} strokeWidth={2} />
    ) : (
      <Icon size={iconSize} strokeWidth={1.5} />
    )}
    <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
  </motion.button>
);

export default BottomTabBar;

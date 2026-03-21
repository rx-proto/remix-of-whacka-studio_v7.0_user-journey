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
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+24px)] px-14">
      <div
        className="glass-button rounded-full flex items-center overflow-hidden relative w-full"
        style={{ height: BAR_HEIGHT }}
      >
        <div className="flex items-center w-full p-1 relative" style={{ height: BAR_HEIGHT }}>
          {/* Home tab */}
          <div className="flex-1 flex justify-center" style={{ minWidth: 0 }}>
            <TabButton
              icon={Home}
              label="Home"
              isActive={activeTab === 0}
              onClick={() => onTabChange(0)}
              height={BAR_HEIGHT}
              iconSize={18}
            />
          </div>

          {/* Build tab – Sparkle icon */}
          <div className="flex-1 flex justify-center" style={{ minWidth: 0 }}>
            <TabButton
              icon={Sparkle}
              label="Build"
              isActive={activeTab === 2}
              onClick={() => onTabChange(2)}
              height={BAR_HEIGHT}
              iconSize={19}
              filledIcon={SparkleFilledIcon}
            />
          </div>

          {/* Explore tab */}
          <div className="flex-1 flex justify-center" style={{ minWidth: 0 }}>
            <TabButton
              icon={Compass}
              label="Explore"
              isActive={activeTab === 1}
              onClick={() => onTabChange(1)}
              height={BAR_HEIGHT}
              iconSize={20}
            />
          </div>
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
      Icon === Home ? <HomeFilled size={iconSize} /> : <CompassFilled size={iconSize} />
    ) : (
      <Icon size={iconSize} strokeWidth={1.5} />
    )}
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </motion.button>
);

export default BottomTabBar;

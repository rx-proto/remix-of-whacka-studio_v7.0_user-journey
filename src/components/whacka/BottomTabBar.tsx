import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, Plus } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  onCreateClick: () => void;
}

const BAR_HEIGHT = 56;
const PLUS_W = 60;
const SPRING = { type: 'spring' as const, stiffness: 350, damping: 30 };

const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  onCreateClick,
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

          {/* Create button – orange-pink gradient rounded rect */}
          <motion.button
            className="relative z-20 flex items-center justify-center rounded-full mx-1.5 flex-shrink-0"
            style={{ width: PLUS_W, height: BAR_HEIGHT - 16 }}
            onClick={onCreateClick}
            whileTap={{ scale: 0.88 }}
          >
            <div
              className="absolute inset-0 rounded-full overflow-hidden bg-black"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
            <Plus size={19} strokeWidth={2.2} className="relative z-10 text-white" />
          </motion.button>

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


/* Filled Home icon: house outline filled, door cutout white */
const HomeFilled: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 10.182V22h18V10.182L12 2L3 10.182Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <rect x="9" y="14" width="6" height="8" rx="1" fill="white" />
  </svg>
);

/* Filled Compass icon: outer circle filled, inner diamond/circle cutout white */
const CompassFilled: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" strokeWidth={2} />
    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="white" />
  </svg>
);

/* Small helper for tab buttons */
const TabButton: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  height: number;
  iconSize?: number;
}> = ({ icon: Icon, label, isActive, onClick, height, iconSize = 18 }) => (
  <motion.button
    onClick={onClick}
    className="relative z-10 flex flex-col items-center gap-0.5 px-5 py-1 rounded-full justify-center flex-1 text-foreground"
    style={{ height: height - 8 }}
    whileTap={{ scale: 0.92 }}
  >
    {isActive ? (
      Icon === Home ? <HomeFilled size={iconSize} /> : <CompassFilled size={iconSize} />
    ) : (
      <Icon size={iconSize} strokeWidth={1.5} />
    )}
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </motion.button>
);

export default BottomTabBar;

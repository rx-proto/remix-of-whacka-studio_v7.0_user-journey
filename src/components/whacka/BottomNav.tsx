import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFabClick: () => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'community', icon: Compass, label: 'Community' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onFabClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="relative flex items-end w-full max-w-md px-4 pb-4">
        {/* FAB */}
        <motion.button
          className="absolute left-1/2 -translate-x-1/2 -top-4 z-10 w-14 h-14 rounded-full 
            bg-gradient-to-br from-neon-purple to-neon-blue
            flex items-center justify-center
            text-foreground text-2xl font-light
            animate-pulse-glow"
          onClick={onFabClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl font-light drop-shadow-lg">+</span>
        </motion.button>

        {/* Nav Bar */}
        <div className="glass w-full flex items-center justify-around py-2 px-4 rounded-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 min-w-[56px] min-h-[44px] rounded-xl transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;

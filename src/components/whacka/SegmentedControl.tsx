import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps {
  tabs: string[];
  activeTab: number;
  onChange: (index: number) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="glass-button p-1 flex gap-0.5 relative h-10">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          className={`
            relative z-10 px-3.5 py-1.5 rounded-full text-sm font-medium
            transition-colors duration-200 flex items-center justify-center
            ${activeTab === i ? 'text-foreground' : 'text-muted-foreground'}
          `}
        >
          {tab}
        </button>
      ))}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full liquid-glass"
        style={{ width: `calc(${100 / tabs.length}% - 4px)` }}
        animate={{ left: `calc(${activeTab * (100 / tabs.length)}% + 2px)` }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      />
    </div>
  );
};

export default SegmentedControl;

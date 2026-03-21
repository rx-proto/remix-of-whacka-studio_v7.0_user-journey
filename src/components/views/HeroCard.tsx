import React from 'react';

const HeroCard: React.FC = () => {
  return (
    <div className="px-7 py-1">
      <div className="flex items-baseline gap-2">
        <span className="text-[20px] font-semibold text-slate-800 tracking-tight">Build Apps with</span>
        <span
          style={{ fontFamily: "'Pacifico', cursive", fontSize: '22px', color: '#C95A3C' }}
        >
          Whacka
        </span>
      </div>
    </div>
  );
};

export default HeroCard;

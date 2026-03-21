import React from 'react';

const WhackaLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      className={`select-none ${className}`}
      style={{
        fontFamily: "'Pacifico', cursive",
        fontSize: '20px',
        fontWeight: 400,
        letterSpacing: '0.5px',
        lineHeight: 1,
      }}
    >
      Whacka
    </span>
  );
};

export default WhackaLogo;

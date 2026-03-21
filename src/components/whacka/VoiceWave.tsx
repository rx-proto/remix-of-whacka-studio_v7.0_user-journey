import React from 'react';

const VoiceWave: React.FC = () => {
  return (
    <div className="flex items-center gap-1 h-6 px-2">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-muted-foreground/60 voice-wave-bar"
          style={{
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;

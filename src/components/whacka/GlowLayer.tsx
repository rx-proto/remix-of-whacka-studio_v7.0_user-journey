import React from 'react';

interface GlowLayerProps {
  variant?: 'creative' | 'fab' | 'card';
  active?: boolean;
  soft?: boolean;
  className?: string;
}

const glowBackgrounds = {
  creative: `
    radial-gradient(circle at 10% 50%, hsla(160, 90%, 60%, 0.6), transparent 45%),
    radial-gradient(circle at 35% 25%, hsla(275, 80%, 70%, 0.55), transparent 45%),
    radial-gradient(circle at 65% 70%, hsla(340, 95%, 65%, 0.55), transparent 45%),
    radial-gradient(circle at 90% 40%, hsla(35, 95%, 60%, 0.5), transparent 40%)
  `,
  fab: `
    radial-gradient(circle at 10% 50%, hsla(160, 90%, 60%, 0.5), transparent 45%),
    radial-gradient(circle at 35% 25%, hsla(275, 80%, 70%, 0.45), transparent 45%),
    radial-gradient(circle at 65% 70%, hsla(340, 95%, 65%, 0.45), transparent 45%),
    radial-gradient(circle at 90% 40%, hsla(35, 95%, 60%, 0.4), transparent 40%)
  `,
  card: `
    radial-gradient(circle at 50% 50%, hsla(160, 80%, 65%, 0.3), transparent 60%)
  `,
};

const GlowLayer: React.FC<GlowLayerProps> = ({
  variant = 'creative',
  active = false,
  soft = false,
  className = '',
}) => {
  const bg = glowBackgrounds[variant];
  const opacity = active ? (soft ? 0.65 : 1) : 0;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: '-40%',
        borderRadius: '50%',
        background: bg,
        filter: 'blur(50px)',
        opacity,
        pointerEvents: 'none',
        transition: 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        transform: active ? 'scale(1.03)' : 'scale(1)',
        zIndex: 0,
      }}
    />
  );
};

export default GlowLayer;

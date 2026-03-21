import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Lightbulb } from 'lucide-react';

interface StickyTopBarProps {
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onOpenTip?: () => void;
  onTestOnboarding?: () => void;
  showNotification?: boolean;
  children?: React.ReactNode;
  threshold?: number;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  onOpenMenu,
  onOpenNotifications,
  onOpenTip,
  showNotification = true,
  children,
  threshold = 20,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full" style={{ height: threshold }} />
      <div
        className="sticky top-0 z-30 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(249, 250, 251, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.04)' : '1px solid transparent',
        }}
      >
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <button onClick={onOpenMenu} className="flex items-center justify-center min-h-[44px] min-w-[44px]">
            <Menu size={20} className="text-slate-900" />
          </button>
          <div className="flex items-center gap-1">
            <button onClick={onOpenTip} className="flex items-center justify-center min-h-[44px] min-w-[44px]">
              <Lightbulb size={20} className="text-slate-400" />
            </button>
            <button onClick={onOpenNotifications} className="flex items-center justify-center min-h-[44px] min-w-[44px] relative">
              <Search size={20} className="text-slate-900" />
            </button>
          </div>
        </div>
        {children && (
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{ maxHeight: scrolled ? '60px' : '0px', opacity: scrolled ? 1 : 0 }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default StickyTopBar;

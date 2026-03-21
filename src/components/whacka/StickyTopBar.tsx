import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell } from 'lucide-react';

interface StickyTopBarProps {
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  showNotification?: boolean;
  /** Optional children rendered below the icons when scrolled (the "功能栏") */
  children?: React.ReactNode;
  /** Scroll threshold in px to reveal background bar. Default 20 */
  threshold?: number;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  onOpenMenu,
  onOpenNotifications,
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
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible sentinel element — when it scrolls out of view, bar reveals */}
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
        {/* Icons row */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <button onClick={onOpenMenu} className="flex items-center justify-center min-h-[44px] min-w-[44px]">
            <Menu size={20} className="text-slate-900" />
          </button>
          <button onClick={onOpenNotifications} className="flex items-center justify-center min-h-[44px] min-w-[44px] relative">
            <Bell size={20} className="text-slate-900" />
            {showNotification && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-destructive" />
            )}
          </button>
        </div>

        {/* Functional bar — slides in on scroll */}
        {children && (
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: scrolled ? '60px' : '0px',
              opacity: scrolled ? 1 : 0,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default StickyTopBar;

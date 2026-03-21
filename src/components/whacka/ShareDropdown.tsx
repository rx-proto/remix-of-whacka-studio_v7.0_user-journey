import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Check } from 'lucide-react';
import redditIcon from '@/assets/icon-reddit.png';

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
  shareText?: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({
  isOpen,
  onClose,
  shareUrl = 'https://whacka.app/app/example-id',
  shareText = 'Check out this app on Whacka!',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareItems = [
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: (
        <div className="w-5 h-5 flex items-center justify-center">
          {copied ? <Check size={18} className="text-foreground" /> : <Link2 size={18} className="text-foreground" />}
        </div>
      ),
      action: handleCopyLink,
    },
    {
      label: 'Share to X',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      label: 'Share to Reddit',
      icon: (
        <img src={redditIcon} alt="Reddit" className="w-6 h-6 rounded-full object-cover" />
      ),
      action: () => window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank'),
    },
    {
      label: 'Share to Telegram',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#26A5E4" d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank'),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="share-overlay"
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="share-dropdown"
            className="fixed right-4 top-16 z-[70] w-[48vw] rounded-2xl liquid-glass overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ transformOrigin: 'top right' }}
          >
            <div className="py-1">
              {shareItems.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <div className="h-px bg-foreground/[0.06] mx-3" />}
                  <motion.button
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 active:bg-foreground/5 transition-colors"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-[13px] font-medium text-foreground">{item.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareDropdown;

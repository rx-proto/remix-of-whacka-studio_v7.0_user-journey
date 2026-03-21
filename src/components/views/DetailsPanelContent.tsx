import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Pencil, Check, Send, Shuffle, Bookmark, Paperclip, X, ChevronDown, ChevronUp, Share, Copy, ExternalLink, Plus } from 'lucide-react';

import iconBudget from '@/assets/icon-budget.png';
import iconFittrack from '@/assets/icon-fittrack.png';
import iconRecipe from '@/assets/icon-recipe.png';

export interface SocialData {
  authorName: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  remixes: number;
  bookmarks: number;
  publishText: string;
}

export const defaultSocialData: SocialData = {
  authorName: 'Yang',
  authorAvatar: '',
  likes: 312,
  comments: 89,
  remixes: 24,
  bookmarks: 56,
  publishText: 'Built this over the weekend — finally got the AI integration working smoothly 🎉',
};

interface ReplyData {
  id: number;
  name: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

interface CommentData {
  id: number;
  name: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  images?: string[];
  replies?: ReplyData[];
}

const initialComments: CommentData[] = [
  { id: 1, name: 'Sarah K.', avatar: '👩‍💻', text: 'This is amazing! Love the UI design.', likes: 23, time: '2d' },
  { id: 2, name: 'Alex W.', avatar: '🧑‍🎨', text: 'How did you get the animations so smooth?', likes: 15, time: '3d', replies: [
    { id: 201, name: 'Yang', avatar: '🧑‍💻', text: 'Framer Motion + some custom spring configs!', likes: 8, time: '3d' },
    { id: 202, name: 'Sarah K.', avatar: '👩‍💻', text: 'That explains it, the transitions are buttery smooth', likes: 3, time: '2d' },
    { id: 203, name: 'Alex W.', avatar: '🧑‍🎨', text: 'Thanks! Going to try that in my project', likes: 1, time: '2d' },
  ]},
  { id: 3, name: 'Chen L.', avatar: '👨‍💼', text: 'Remixed this and added dark mode — thanks for sharing!', likes: 42, time: '1w' },
  { id: 4, name: 'Mia R.', avatar: '👩‍🔬', text: 'Super clean code structure. Following for more!', likes: 8, time: '1w', images: [iconBudget, iconFittrack, iconRecipe] },
  { id: 5, name: 'Jordan T.', avatar: '🧑‍🚀', text: 'Insane work 🔥🔥', likes: 31, time: '1w' },
  { id: 6, name: 'Nina P.', avatar: '👩‍🎤', text: 'Can you share the source code?', likes: 5, time: '2w' },
];

const mockAttachments = [iconBudget, iconFittrack, iconRecipe];

interface DetailsPanelContentProps {
  social?: SocialData;
  truncatePublish?: boolean;
  variant?: 'full' | 'social';
  onRemix?: () => void;
  appName?: string;
  appDesc?: string;
  isSaved?: boolean;
  onCollect?: () => void;
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
  onTabChange?: (tab: 'instruction' | 'comments') => void;
  onInputExpandChange?: (expanded: boolean) => void;
  onOpenUser?: (authorName: string) => void;
}

/* ── Comment single item ── */
const CommentItem: React.FC<{
  c: CommentData;
  isLiked: boolean;
  onToggleLike: () => void;
  onReply: (name: string) => void;
  likedReplies: Record<number, boolean>;
  onToggleReplyLike: (id: number) => void;
}> = ({ c, isLiked, onToggleLike, onReply, likedReplies, onToggleReplyLike }) => {
  const [showReplies, setShowReplies] = useState(false);
  const replyCount = c.replies?.length ?? 0;

  return (
    <div>
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: c.id * 0.04 }}
      >
        <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center text-base flex-shrink-0">
          {c.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
            <span className="text-[11px] text-muted-foreground">{c.time}</span>
          </div>
          <p className="text-[13px] text-foreground/85 leading-relaxed mt-0.5">{c.text}</p>
          {c.images && c.images.length > 0 && (
            <div className="flex gap-1.5 mt-1.5">
              {c.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-14 h-14 rounded-lg object-cover" />
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 mt-1">
            <button onClick={() => onReply(c.name)} className="text-[11px] text-muted-foreground font-medium">Reply</button>
            {replyCount > 0 && (
              <button
                onClick={() => setShowReplies(v => !v)}
                className="flex items-center gap-0.5 text-[11px] text-primary font-medium"
              >
                {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showReplies ? 'Hide' : `View ${replyCount}`} {replyCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={onToggleLike}
          className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-2"
        >
          <Heart
            size={14}
            className={isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}
          />
          <span className="text-[10px] text-muted-foreground">{c.likes + (isLiked ? 1 : 0)}</span>
        </button>
      </motion.div>

      {/* Replies */}
      <AnimatePresence>
        {showReplies && c.replies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-12 mt-2 space-y-3 border-l-2 border-foreground/5 pl-3">
              {c.replies.map((r) => (
                <div key={r.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center text-sm flex-shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-foreground">{r.name}</span>
                      <span className="text-[10px] text-muted-foreground">{r.time}</span>
                    </div>
                    <p className="text-[12px] text-foreground/85 leading-relaxed mt-0.5">{r.text}</p>
                    <button onClick={() => onReply(r.name)} className="text-[10px] text-muted-foreground font-medium mt-0.5">Reply</button>
                  </div>
                  <button
                    onClick={() => onToggleReplyLike(r.id)}
                    className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1"
                  >
                    <Heart size={12} className={likedReplies[r.id] ? 'text-red-500 fill-red-500' : 'text-muted-foreground'} />
                    <span className="text-[9px] text-muted-foreground">{r.likes + (likedReplies[r.id] ? 1 : 0)}</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Expanded comment input ── */
const ExpandedInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  attachments: string[];
  onRemoveAttachment: (i: number) => void;
  onSend: () => void;
  onClose: () => void;
  onAttach: () => void;
}> = ({ value, onChange, attachments, onRemoveAttachment, onSend, onClose, onAttach }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasContent = value.trim().length > 0 || attachments.length > 0;

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex-shrink-0 border-t border-foreground/10 bg-background"
    >
      <div className="relative z-10 px-2 pt-2 pb-2">
        {/* Attached images */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 px-1">
            {attachments.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <button
                  onClick={() => onRemoveAttachment(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <div className="bg-foreground/5 rounded-2xl px-3 py-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="w-full bg-transparent text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
          />
          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              onClick={onAttach}
              className="w-8 h-8 rounded-full flex items-center justify-center text-foreground"
            >
              <Paperclip size={16} />
            </button>
            <button
              onClick={onSend}
              className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all ${
                hasContent
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground'
              }`}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Bottom bar (collapsed) ── */
const CommentBottomBar: React.FC<{
  liked: boolean;
  onToggleLike: () => void;
  likesCount: number;
  commentsCount: number;
  onInputClick: () => void;
}> = ({ liked, onToggleLike, likesCount, commentsCount, onInputClick }) => (
  <div className="flex-shrink-0 border-t border-foreground/5 pt-2 mt-2">
    <div className="flex items-center gap-3 px-1 pb-1">
      <button
        onClick={onToggleLike}
        className="flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
      >
        <Heart size={20} className={liked ? 'text-red-500 fill-red-500' : 'text-foreground'} />
        <span className="text-sm font-semibold text-foreground">{likesCount}</span>
      </button>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <MessageCircle size={20} className="text-foreground" />
        <span className="text-sm font-semibold text-foreground">{commentsCount}</span>
      </div>
      <div
        onClick={onInputClick}
        className="flex-1 flex items-center bg-foreground/5 rounded-full px-3 py-2 cursor-text"
      >
        <span className="flex-1 text-sm text-muted-foreground">Add a comment...</span>
      </div>
    </div>
  </div>
);

/* ── Main component ── */
const DetailsPanelContent: React.FC<DetailsPanelContentProps> = ({
  social = defaultSocialData,
  truncatePublish = false,
  variant = 'full',
  onRemix,
  appName,
  appDesc,
  isSaved,
  onCollect,
  isLoggedIn = true,
  onRequireAuth,
  onTabChange,
  onInputExpandChange,
  onOpenUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [publishText, setPublishText] = useState(social.publishText);
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'instruction' | 'comments'>('instruction');
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showGetGuide, setShowGetGuide] = useState(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const [showCopiedBanner, setShowCopiedBanner] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'instruction' | 'comments') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleSave = () => setIsEditing(false);
  const toggleLike = (id: number) => setLikedComments(prev => ({ ...prev, [id]: !prev[id] }));

  const handleReply = (name: string) => {
    setCommentText(`@${name} `);
    setIsInputExpanded(true);
    onInputExpandChange?.(true);
    setAttachments([]);
  };

  const handleExpandInput = () => {
    setIsInputExpanded(true);
    onInputExpandChange?.(true);
    setAttachments([...mockAttachments]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendComment = () => {
    if (!commentText.trim() && attachments.length === 0) return;
    const newComment: CommentData = {
      id: Date.now(),
      name: 'You',
      avatar: '😊',
      text: commentText,
      likes: 0,
      time: 'now',
      images: attachments.length > 0 ? [...attachments] : undefined,
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    setAttachments([]);
    setIsInputExpanded(false);
    onInputExpandChange?.(false);
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const likesCount = social.likes + (liked ? 1 : 0);

  const renderCommentsList = (cmts: CommentData[]) => (
    <div className="px-1 space-y-4 pb-2 pt-2">
      {cmts.map((c) => (
        <CommentItem
          key={c.id}
          c={c}
          isLiked={!!likedComments[c.id]}
          onToggleLike={() => toggleLike(c.id)}
          onReply={handleReply}
          likedReplies={likedComments}
          onToggleReplyLike={(id) => toggleLike(id)}
        />
      ))}
      <div ref={commentsEndRef} />
    </div>
  );

  const renderBottomArea = () => (
    <AnimatePresence>
      {isInputExpanded ? (
        <ExpandedInput
          key="expanded"
          value={commentText}
          onChange={setCommentText}
          attachments={attachments}
          onRemoveAttachment={handleRemoveAttachment}
          onSend={handleSendComment}
          onClose={() => { setIsInputExpanded(false); onInputExpandChange?.(false); setAttachments([]); }}
          onAttach={() => setAttachments([...mockAttachments])}
        />
      ) : (
        <CommentBottomBar
          key="collapsed"
          liked={liked}
          onToggleLike={() => setLiked(l => !l)}
          likesCount={likesCount}
          commentsCount={social.comments + comments.length - initialComments.length}
          onInputClick={handleExpandInput}
        />
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs — only in full (details) variant */}
      {variant === 'full' && (
        <div className="flex gap-0 border-b border-foreground/10 mb-1 pt-2 flex-shrink-0">
          {(['instruction', 'comments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 text-center pb-2.5 text-sm font-bold transition-all relative capitalize
                ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="detail-panel-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {variant !== 'full' ? (
        <>
          <div className="flex-1 overflow-y-auto min-h-0 flex-shrink-0">
            {renderCommentsList(comments)}
          </div>
          {renderBottomArea()}
        </>
      ) : activeTab === 'instruction' ? (
        <div className="flex-1 overflow-y-auto min-h-0 px-1 py-2">
          {/* App name + author + Get button */}
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-foreground truncate">{appName || 'App'}</h3>
              <button onClick={() => onOpenUser?.(social.authorName)} className="text-[15px] font-bold text-muted-foreground hover:text-foreground transition-colors text-left">{social.authorName}</button>
            </div>
            <button
              onClick={onRemix}
              className="h-7 px-4 rounded-full text-xs font-semibold active:scale-95 transition-all flex items-center justify-center gap-1 flex-shrink-0 ml-3 text-white"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              <Shuffle size={12} />
              <span>{social.remixes ?? 0}</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground leading-relaxed">
            {social.publishText}
            {' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">#productivity</span>
          </p>


          {/* Like & Bookmark inline */}
          <div className="flex items-center justify-end gap-4 mt-3">
            <button onClick={() => setLiked(l => !l)} className="flex items-center gap-1.5 active:scale-95 transition-transform">
              <Heart size={16} className={liked ? 'text-pink-500 fill-pink-500' : 'text-foreground'} />
              <span className={`text-sm font-semibold ${liked ? 'text-pink-500' : 'text-foreground'}`}>{likesCount}</span>
            </button>
            <button
              onClick={() => { if (!isLoggedIn && onRequireAuth) { onRequireAuth?.(); return; } onCollect?.(); }}
              className="flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Bookmark size={16} className={isSaved ? 'text-orange-500 fill-orange-500' : 'text-foreground'} />
              <span className={`text-sm font-semibold ${isSaved ? 'text-orange-500' : 'text-foreground'}`}>{social.bookmarks ?? 0}</span>
            </button>
          </div>
        </div>
      ) : activeTab === 'comments' ? (
        <>
          <div className="flex-1 overflow-y-auto min-h-0 flex-shrink-0">
            {renderCommentsList(comments)}
          </div>
          {renderBottomArea()}
        </>
      ) : null}

      {/* Get Guide Bottom Sheet */}
      <AnimatePresence>
        {showGetGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowGetGuide(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl px-5 pt-4 pb-8 max-w-md mx-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-foreground/15 mx-auto mb-4" />

              <h3 className="text-lg font-bold text-foreground text-center mb-1">Add to Home Screen</h3>
              <p className="text-[13px] text-muted-foreground text-center mb-5">Install this app on your phone in 3 easy steps</p>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Open in Safari or Chrome</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">Paste the copied link in your browser's address bar</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Share size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Tap the Share button</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">In Safari, tap <span className="inline-flex items-center align-middle mx-0.5 border border-foreground/15 rounded px-1 py-0.5"><Share size={10} /></span> at the bottom. In Chrome, tap <span className="font-semibold text-foreground">⋮</span> at the top right</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Plus size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">Add to Home Screen</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">Select <span className="font-semibold text-foreground">"Add to Home Screen"</span> and confirm</p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center mt-5 leading-relaxed">
                You can revisit this guide anytime in <span className="font-semibold text-foreground">Menu → Guides</span>
              </p>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText('https://whacka.app/app/fittrack-pro');
                  setHasCopiedUrl(true);
                  setShowGetGuide(false);
                }}
                className="w-full mt-3 py-3 rounded-full bg-foreground text-background text-sm font-semibold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                {hasCopiedUrl ? <Check size={16} /> : <Copy size={16} />}
                {hasCopiedUrl ? 'Got it' : 'Got it & Copy URL'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Copied banner */}
      <AnimatePresence>
        {showCopiedBanner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed bottom-16 left-4 right-4 z-[100] bg-foreground text-background text-center text-sm font-medium py-3 px-4 rounded-2xl shadow-lg"
          >
            Link copied! Open in your browser and add to Home Screen.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailsPanelContent;

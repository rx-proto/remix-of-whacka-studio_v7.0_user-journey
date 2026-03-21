import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useScroll, PanInfo, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import StickyTopBar from '@/components/whacka/StickyTopBar';
import avatarYang from '@/assets/avatar-yang.jpg';
import type { AppInfo } from './ExploreView';

import iconBudget from '@/assets/icon-budget.png';
import iconRecipe from '@/assets/icon-recipe.png';
import iconWorkout from '@/assets/icon-workout.png';
import iconJournal from '@/assets/icon-journal.png';
import iconFittrack from '@/assets/icon-fittrack.png';
import iconMeditation from '@/assets/icon-meditation.png';
import iconTodopro from '@/assets/icon-todopro.png';

export interface StudioApp {
  id: number;
  name: string;
  desc: string;
  status: 'live' | 'draft' | 'collected';
  icon: string;
  glowColor: string;
}

const defaultApps: StudioApp[] = [
  { id: 1, name: 'My Budget', desc: 'Track expenses & savings goals', status: 'live', icon: iconBudget, glowColor: 'bg-emerald-200' },
  { id: 2, name: 'Recipe Finder', desc: 'Find recipes by ingredients', status: 'draft', icon: iconRecipe, glowColor: 'bg-orange-200' },
  { id: 3, name: 'Workout Log', desc: 'Log workouts & track progress', status: 'live', icon: iconWorkout, glowColor: 'bg-fuchsia-200' },
  { id: 4, name: 'Daily Journal', desc: 'Write your thoughts every day', status: 'draft', icon: iconJournal, glowColor: 'bg-sky-200' },
  { id: 5, name: 'FitTrack Pro', desc: 'AI-powered fitness coaching', status: 'live', icon: iconFittrack, glowColor: 'bg-rose-200' },
  { id: 6, name: 'Zen Space', desc: 'Guided meditation & breathing', status: 'draft', icon: iconMeditation, glowColor: 'bg-violet-200' },
  { id: 7, name: 'Todo Master', desc: 'Smart task management system', status: 'live', icon: iconTodopro, glowColor: 'bg-blue-200' },
];

const CARD_ROTATIONS = [-1.2, 0.8, -0.6, 1.0, -0.9, 0.5, -1.1];
const SWIPE_THRESHOLD = -50;
const SNAP_X = -72;
const SPRING = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 1.1 };

type FolderType = 'live' | 'drafts' | 'collection';

const FOLDER_CONFIG: Record<FolderType, { label: string; folderLabel: string; gradientFrom: string; gradientTo: string }> = {
  live: { label: 'Published Apps', folderLabel: 'Published', gradientFrom: 'rgba(59,130,246,0.8)', gradientTo: 'rgba(96,165,250,0.4)' },
  drafts: { label: 'Draft Apps', folderLabel: 'Drafts', gradientFrom: 'rgba(100,116,139,0.85)', gradientTo: 'rgba(148,163,184,0.45)' },
  collection: { label: 'Saved Apps', folderLabel: 'Saved', gradientFrom: 'rgba(124,58,237,0.8)', gradientTo: 'rgba(167,139,250,0.4)' },
};

/* ─── Delete Confirmation Dialog ─── */
interface DeleteDialogProps {
  app: StudioApp;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ app, onClose, onConfirm }) => {
  const [confirmName, setConfirmName] = useState('');
  const canDelete = confirmName === app.name;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-[10000] flex items-center justify-center px-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
              <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete {app.name}?</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            This action cannot be undone. All data associated with this app will be permanently deleted.
          </p>
          <p className="text-xs text-slate-400 mb-2">
            Type <span className="font-semibold text-slate-600">{app.name}</span> to confirm
          </p>
          <input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={app.name}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-slate-400 transition-colors mb-4"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-slate-100 text-slate-600 text-sm font-medium active:scale-[0.98] transition-transform"
            >
              Cancel
            </button>
            <button
              onClick={() => { if (canDelete) onConfirm(); }}
              disabled={!canDelete}
              className={`flex-1 py-3 rounded-full text-sm font-semibold active:scale-[0.98] transition-all ${
                canDelete ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

interface HomeViewProps {
  onOpenBuilder: (app: AppInfo, panelType: 'preview' | 'details') => void;
  onOpenDetails?: (app: AppInfo) => void;
  collectedApps?: StudioApp[];
  onSubViewChange?: (inSubView: boolean) => void;
  onOpenFollowers?: () => void;
  onOpenNotifications?: () => void;
  onOpenMenu?: () => void;
  onOpenLikes?: () => void;
}

/* ─── WalletCard ─── */
interface WalletCardProps {
  app: StudioApp;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
  rotation: number;
}

const WalletCard: React.FC<WalletCardProps> = ({ app, index, onOpen, onDelete, scrollContainerRef, rotation }) => {
  const x = useMotionValue(0);
  const actionOpacity = useTransform(x, [SNAP_X, SNAP_X / 3, 0], [1, 0.3, 0]);
  const [swiped, setSwiped] = useState(false);
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    container: scrollContainerRef,
    offset: ['start end', 'center center', 'end start'],
  });

  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 0.93]);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < SWIPE_THRESHOLD) setSwiped(true);
    else setSwiped(false);
    // Keep isDragging true briefly to prevent click from firing
    setTimeout(() => { isDragging.current = false; }, 50);
  };

  const handleClick = () => {
    if (isDragging.current) return;
    if (swiped) { setSwiped(false); return; }
    onOpen();
  };

  const statusLabel = app.status === 'collected' ? 'Collected' : app.status === 'live' ? 'Live' : 'Draft';
  const statusStyle = app.status === 'collected'
    ? 'bg-violet-50 text-violet-500'
    : app.status === 'live'
      ? 'bg-emerald-50 text-emerald-500'
      : 'bg-slate-50 text-slate-400';

  return (
    <motion.div ref={cardRef} className="relative" style={{ marginTop: index > 0 ? '-6px' : '0', scale: cardScale }}>
      <motion.div className="absolute inset-y-0 right-0 flex items-center pr-5" style={{ opacity: actionOpacity }}>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="w-11 h-11 rounded-full flex items-center justify-center text-slate-800 active:scale-90 transition-transform"
        >
          <Trash2 size={20} strokeWidth={1.5} />
        </button>
      </motion.div>

      <motion.div
        className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-3xl h-[140px] px-5 py-3 cursor-pointer overflow-hidden"
        style={{ x, zIndex: index + 1, rotate: rotation, boxShadow: '0 2px 20px rgba(168, 155, 210, 0.12), 0 1px 4px rgba(0,0,0,0.04)' }}
        drag="x"
        dragConstraints={{ left: SNAP_X, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 35 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: swiped ? SNAP_X : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        onClick={handleClick}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={`absolute -top-4 -left-4 w-[100px] h-[100px] rounded-full ${app.glowColor} blur-2xl opacity-40 pointer-events-none`} />
        <div className={`absolute -bottom-6 -right-6 w-[140px] h-[140px] rounded-full ${app.glowColor} blur-3xl opacity-35 pointer-events-none`} />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden border border-black/5 rotate-[12deg]"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)' }}>
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
            {/* Glass highlight — top-left shine */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)' }} />
            {/* Inner glass edge border */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ border: '1.5px solid rgba(255,255,255,0.5)', maskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)', WebkitMaskImage: 'linear-gradient(135deg, black 0%, rgba(0,0,0,0.3) 50%, transparent 80%)' }} />
            {/* Depth inset shadow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.1), inset 1px 1px 4px rgba(255,255,255,0.3)' }} />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full pr-20">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight truncate">{app.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-2">{app.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── FolderStack (Dock thumbnail – iOS folder style) ─── */
interface FolderStackProps {
  apps: StudioApp[];
  label: string;
  isBlue: boolean;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
}

const FolderStack: React.FC<FolderStackProps> = ({ apps, label, isBlue, gradientFrom, gradientTo, onClick }) => {
  const layers = apps.slice(0, 3);
  const transforms = [
    { rotate: 2, x: 2, y: -2, z: 30 },
    { rotate: 7, x: 8, y: -5, z: 20 },
    { rotate: -5, x: -6, y: -8, z: 10 },
  ];

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer active:scale-[0.96] transition-transform"
      style={{ width: '100%' }}
    >
      <div className="relative w-[120px] h-[120px]">
        {layers.length > 0 && [...layers].reverse().map((app, i) => {
          const reverseIndex = layers.length - 1 - i;
          const t = transforms[reverseIndex] || transforms[2];
          return (
            <div
              key={app.id}
              className="absolute inset-0 rounded-2xl overflow-hidden border shadow-sm"
              style={{
                transform: `rotate(${t.rotate}deg) translate(${t.x}px, ${t.y}px)`,
                zIndex: t.z,
                borderColor: isBlue ? 'rgba(120,160,255,0.3)' : 'rgba(180,140,240,0.25)',
              }}
            >
              <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
            </div>
          );
        })}

        <div
          className="absolute top-0 left-0 w-full h-full rounded-3xl shadow-lg overflow-hidden flex items-end justify-center pb-3"
          style={{
            backgroundColor: isBlue ? 'rgba(239,246,255,1)' : 'rgba(255,255,255,1)',
            zIndex: 40,
          }}
        >
          {isBlue ? (
            <>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-2xl opacity-50" style={{ background: gradientFrom }} />
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: gradientTo }} />
            </>
          ) : (
            <>
              <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-50" style={{ background: gradientFrom }} />
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: gradientTo }} />
            </>
          )}
          <span
            className="relative z-10 text-[13px] font-semibold"
            style={{ color: isBlue ? 'rgb(37,99,235)' : 'rgb(71,85,105)' }}
          >
            {label} · {apps.length}
          </span>
        </div>
      </div>
    </button>
  );
};

/* ─── SwappableContent (core swap component) ─── */
interface SwappableContentProps {
  layoutId: string;
  isExpanded: boolean;
  apps: StudioApp[];
  folderType: FolderType;
  isBlue?: boolean;
  onClick?: () => void;
  onOpenApp: (app: StudioApp) => void;
  onDeleteApp: (app: StudioApp) => void;
  scrollRef: React.RefObject<HTMLElement | null>;
}

const SwappableContent: React.FC<SwappableContentProps> = ({
  layoutId, isExpanded, apps, folderType, isBlue = false, onClick, onOpenApp, onDeleteApp, scrollRef,
}) => {
  const config = FOLDER_CONFIG[folderType];

  return (
    <motion.div layoutId={layoutId} transition={SPRING}>
      {isExpanded ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800">{config.label}</h3>
          </div>
          {apps.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-slate-400">No apps here yet</p>
              <p className="text-xs text-slate-300 mt-1">Create or collect apps to see them here</p>
            </div>
          ) : (
            <div className="space-y-0">
              {apps.map((app, i) => (
                <WalletCard
                  key={`${app.id}-${app.status}`}
                  app={app}
                  index={i}
                  onOpen={() => onOpenApp(app)}
                  onDelete={() => onDeleteApp(app)}
                  scrollContainerRef={scrollRef}
                  rotation={CARD_ROTATIONS[i % CARD_ROTATIONS.length]}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <FolderStack
          apps={apps}
          label={config.folderLabel}
          isBlue={isBlue}
          gradientFrom={config.gradientFrom}
          gradientTo={config.gradientTo}
          onClick={onClick || (() => {})}
        />
      )}
    </motion.div>
  );
};




/* ─── ProfileHeader ─── */
const ProfileHeader: React.FC<{ liveCount: number; onOpenFollowers?: () => void; onOpenLikes?: () => void; onPublishedClick?: () => void }> = ({ liveCount, onOpenFollowers, onOpenLikes, onPublishedClick }) => (
  <div className="relative w-full">
    <div className="absolute inset-x-0 top-0 h-[360px] overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-8 w-52 h-52 rounded-full bg-sky-300/20 blur-2xl" />
      <div className="absolute top-20 right-6 w-44 h-44 rounded-full bg-amber-200/25 blur-2xl" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-orange-200/20 blur-2xl" />
      <div className="absolute top-32 left-1/4 w-36 h-36 rounded-full bg-sky-200/15 blur-2xl" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F9FAFB] to-transparent" />
    </div>

    <div className="relative flex flex-col items-center pb-4">
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mb-3">
        <img src={avatarYang} alt="Yang" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">Yang</h2>
      <p className="text-sm text-slate-400 mb-4">@yang_dev</p>
      <div className="flex gap-8">
        {[
          { value: liveCount, label: 'Published', onClick: onPublishedClick },
          { value: '1.2K', label: 'Followers', onClick: onOpenFollowers },
          { value: '486', label: 'Likes', onClick: onOpenLikes },
        ].map(s => (
          <div
            key={s.label}
            className="flex flex-col items-center cursor-pointer active:opacity-70"
            onClick={s.onClick}
          >
            <span className="text-lg font-bold text-slate-800">{s.value}</span>
            <span className="text-[11px] text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══ HomeView ═══ */
const HomeView: React.FC<HomeViewProps> = ({ onOpenBuilder, onOpenDetails, collectedApps = [], onOpenFollowers, onOpenNotifications, onOpenMenu, onOpenLikes }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFolder, setActiveFolder] = useState<FolderType>('live');
  const [deleteTarget, setDeleteTarget] = useState<StudioApp | null>(null);
  const [apps, setApps] = useState(defaultApps);

  const allApps = [...apps, ...collectedApps];
  const liveApps = allApps.filter(a => a.status === 'live');
  const draftApps = allApps.filter(a => a.status === 'draft');
  const collectedList = allApps.filter(a => a.status === 'collected');

  const appsMap: Record<FolderType, StudioApp[]> = {
    live: liveApps,
    drafts: draftApps,
    collection: collectedList,
  };

  let leftId: FolderType, rightId: FolderType, stageId: FolderType;
  if (activeFolder === 'live') {
    leftId = 'collection'; rightId = 'drafts'; stageId = 'live';
  } else if (activeFolder === 'collection') {
    leftId = 'live'; rightId = 'drafts'; stageId = 'collection';
  } else {
    leftId = 'collection'; rightId = 'live'; stageId = 'drafts';
  }

  const handleOpenApp = (app: StudioApp) => {
    const appInfo: AppInfo = { id: app.id, name: app.name, desc: app.desc, icon: app.icon };
    if (app.status === 'collected' && onOpenDetails) {
      onOpenDetails(appInfo);
    } else {
      onOpenBuilder(appInfo, app.status === 'live' ? 'details' : 'preview');
    }
  };

  const handleDeleteApp = (app: StudioApp) => {
    setDeleteTarget(app);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setApps(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <motion.div
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative"
    >
      <StickyTopBar
        onOpenMenu={onOpenMenu}
        onOpenNotifications={onOpenNotifications}
      />
      <ProfileHeader liveCount={liveApps.length} onOpenFollowers={onOpenFollowers} onOpenLikes={onOpenLikes} onPublishedClick={() => setActiveFolder('live')} />

      <LayoutGroup>
        <div className="flex justify-center gap-8 px-4 py-4">
          <SwappableContent
            layoutId={`swap-${leftId}`}
            isExpanded={false}
            apps={appsMap[leftId]}
            folderType={leftId}
            isBlue={leftId === 'live'}
            onClick={() => setActiveFolder(leftId)}
            onOpenApp={handleOpenApp}
            onDeleteApp={handleDeleteApp}
            scrollRef={scrollRef}
          />
          <SwappableContent
            layoutId={`swap-${rightId}`}
            isExpanded={false}
            apps={appsMap[rightId]}
            folderType={rightId}
            isBlue={rightId === 'live'}
            onClick={() => setActiveFolder(rightId)}
            onOpenApp={handleOpenApp}
            onDeleteApp={handleDeleteApp}
            scrollRef={scrollRef}
          />
        </div>

        <div className="px-4 pb-8">
          <SwappableContent
            layoutId={`swap-${stageId}`}
            isExpanded={true}
            apps={appsMap[stageId]}
            folderType={stageId}
            onOpenApp={handleOpenApp}
            onDeleteApp={handleDeleteApp}
            scrollRef={scrollRef}
          />
        </div>
      </LayoutGroup>

      <div className="h-32" />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteDialog
            app={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>


    </motion.div>
  );
};

export default HomeView;

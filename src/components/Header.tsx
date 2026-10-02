import React from 'react';
import { 
  Menu, 
  SquarePen, 
  Search, 
  Bell, 
  WifiOff, 
  MessageCirclePlus, 
  UploadCloud, 
  Droplet, 
  UserSearch, 
  Lightbulb,
  RefreshCw,
  CheckCircle2,
  CloudUpload
} from 'lucide-react';
import { ActiveModule } from '../types';
import { useLanguage } from '../context/LanguageContext';

export type SyncStatus = 'idle' | 'syncing' | 'synced';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenCreatePost: () => void;
  onOpenNotifications: () => void;
  onSearchClick: () => void;
  unreadNotificationsCount?: number;
  isOffline?: boolean;
  activeModule?: ActiveModule;
  onSelectModule?: (module: ActiveModule) => void;
  syncStatus?: SyncStatus;
  syncedCount?: number;
  pendingSyncCount?: number;
  onManualSync?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenCreatePost,
  onOpenNotifications,
  onSearchClick,
  unreadNotificationsCount = 1,
  isOffline = false,
  activeModule = 'hope' as ActiveModule,
  onSelectModule,
  syncStatus = 'idle',
  syncedCount = 0,
  pendingSyncCount = 0,
  onManualSync,
  onRefresh,
  isRefreshing = false,
}) => {
  const { language, l } = useLanguage();
  const isEn = language === 'en';

  const getSecondWord = (mod: ActiveModule) => {
    switch (mod) {
      case 'chat': return 'CHAT';
      case 'media': return 'MEDIA';
      case 'brain': return 'BRAIN';
      case 'care': return 'CARE';
      case 'find': return 'FIND';
      case 'profile': return 'PROFILE';
      case 'hope':
      default:
        return 'HOPE';
    }
  };

  const getModuleColor = (mod: ActiveModule) => {
    switch (mod) {
      case 'chat': return '#0D9488';
      case 'media': return '#9333EA';
      case 'brain': return '#D97706';
      case 'care': return '#E11D48';
      case 'find': return '#059669';
      case 'profile': return '#475569';
      case 'hope':
      default:
        return '#E53935';
    }
  };

  const getComposerProps = (mod: ActiveModule) => {
    switch (mod) {
      case 'chat': return { text: l('মেসেজ বা চ্যাট লিখুন...', 'Type a message or chat...'), icon: MessageCirclePlus };
      case 'media': return { text: l('নতুন ভিডিও বা রিল আপলোড করুন...', 'Upload a new video or reel...'), icon: UploadCloud };
      case 'brain': return { text: l('নতুন প্রশ্ন বা ডিবেট পোস্ট করুন...', 'Ask a health question or topic...'), icon: Lightbulb };
      case 'care': return { text: l('জরুরি রক্তের আবেদন পোস্ট করুন...', 'Post urgent blood donation request...'), icon: Droplet };
      case 'find': return { text: l('নিখোঁজ ব্যক্তির তথ্য পোস্ট করুন...', 'Report a missing person notice...'), icon: UserSearch };
      case 'hope':
      default:
        return { text: l('নতুন পোস্ট বা জরুরি তথ্য লিখুন...', 'Write a post or urgent update...'), icon: SquarePen };
    }
  };

  const composer = getComposerProps(activeModule);
  const ComposerIcon = composer.icon;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      {/* Offline Indicator Banner */}
      {isOffline && (
        <div id="banner-offline-mode" className="bg-amber-500 text-white text-[10px] font-bold py-1 px-3 flex items-center justify-between w-full shadow-inner animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 mx-auto">
            <WifiOff className="w-3.5 h-3.5 shrink-0" />
            <span>{l('অফলাইন মোড (পোস্ট ও পরিবর্তন অফলাইনে সেভ হচ্ছে)', 'Offline Mode (Posts and changes saved locally)')}</span>
          </div>
          {pendingSyncCount > 0 && (
            <span className="bg-amber-700/60 text-amber-100 text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0">
              {pendingSyncCount} {l('পেন্ডিং', 'pending')}
            </span>
          )}
        </div>
      )}

      {/* Syncing Status Indicator Banner */}
      {!isOffline && syncStatus === 'syncing' && (
        <div id="banner-sync-progress" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-[11px] font-semibold py-1.5 px-3 flex items-center justify-center gap-2 w-full shadow-sm animate-in slide-in-from-top-2 duration-200">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-200" />
          <span>
            {l('ডেটা সিঙ্ক হচ্ছে...', 'Syncing data...')} {pendingSyncCount > 0 ? (isEn ? `${pendingSyncCount} changes updating` : `${pendingSyncCount}টি নতুন পরিবর্তন আপডেট করা হচ্ছে`) : (isEn ? 'Syncing offline changes with server' : 'অফলাইন পরিবর্তনসমূহ সার্ভারে যুক্ত হচ্ছে')}
          </span>
        </div>
      )}

      {/* Synced Success Indicator Banner */}
      {!isOffline && syncStatus === 'synced' && (
        <div id="banner-sync-complete" className="bg-emerald-600 text-white text-[11px] font-semibold py-1.5 px-3 flex items-center justify-between w-full shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex items-center gap-2 mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>
              {l('ডেটা সিঙ্ক সম্পন্ন (Data Synced)!', 'Data Synced Successfully!')} {syncedCount > 0 ? (isEn ? `${syncedCount} offline posts updated` : `${syncedCount}টি অফলাইন পোস্ট লাইভ ফিডে সফলভাবে আপডেট হয়েছে`) : (isEn ? 'All data is up to date' : 'সব ডেটা আপ-টু-ডেট আছে')}
            </span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <div className="flex items-center justify-between px-1.5 sm:px-3 py-1.5 sm:py-2 gap-1 sm:gap-1.5 w-full">
        {/* Left section: Hamburger Menu & Brand Logo */}
        <div className="flex items-center shrink-0">
          <button
            id="btn-hamburger-menu"
            onClick={onOpenMenu}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-95 shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          {/* Brand Logo */}
          <div 
            onClick={() => onSelectModule && onSelectModule('hope')}
            className="flex items-center cursor-pointer select-none pl-0.5 pr-1 py-0.5 active:opacity-80 transition-opacity"
          >
            <span className="font-black text-base sm:text-lg tracking-tight text-gray-950">DESTI</span>
            <span 
              className="font-black text-base sm:text-lg tracking-tight ml-0.5"
              style={{ color: getModuleColor(activeModule) }}
            >
              {getSecondWord(activeModule)}
            </span>
          </div>
        </div>

        {/* Center: Post composer input pill (Only for Hope feed) */}
        {activeModule === 'hope' ? (
          <div
            id="input-create-post-trigger"
            onClick={onOpenCreatePost}
            className="flex-1 min-w-0 flex items-center justify-between bg-white hover:bg-gray-50/80 active:bg-gray-100/70 border border-gray-200 hover:border-gray-300 active:border-gray-400 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-2xs cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium truncate">
              {composer.text}
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {l('পোস্ট করুন', 'Post')}
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors">
                <ComposerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0"></div>
        )}

        {/* Right section: Search and Notification Icons */}
        <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
          
          {/* Module-Specific Action Button (If not Hope) */}
          {activeModule !== 'hope' && activeModule !== 'profile' && (
             <button
               onClick={onOpenCreatePost}
               className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90"
               aria-label="Add / Action"
             >
               <ComposerIcon className="w-6 h-6 sm:w-6 sm:h-6 stroke-[2.5]" />
             </button>
          )}

          {/* Sync Data Button / Status Badge */}
          {syncStatus === 'syncing' ? (
            <div 
              id="header-sync-indicator-syncing"
              className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-[11px] font-semibold animate-pulse"
              title={l('অফলাইন পরিবর্তন সিঙ্ক করা হচ্ছে...', 'Syncing offline changes...')}
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span className="hidden xs:inline">{l('সিঙ্ক হচ্ছে', 'Syncing')}</span>
            </div>
          ) : syncStatus === 'synced' ? (
            <div 
              id="header-sync-indicator-synced"
              className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full text-[11px] font-bold animate-in fade-in"
              title={l('ডেটা সফলভাবে সিঙ্ক সম্পন্ন হয়েছে', 'Data synced successfully')}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xs:inline">{l('সিঙ্কড', 'Synced')}</span>
            </div>
          ) : pendingSyncCount > 0 ? (
            <button
              id="btn-header-manual-sync"
              onClick={onManualSync}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95"
              title={isEn ? `${pendingSyncCount} posts pending sync. Click to sync now` : `${pendingSyncCount}টি পোস্ট সিঙ্ক করার অপেক্ষায় আছে। ক্লিক করে এখনই সিঙ্ক করুন`}
            >
              <CloudUpload className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden xs:inline">{l('সিঙ্ক করুন', 'Sync')}</span>
              <span className="w-4 h-4 bg-amber-600 text-white rounded-full text-[9px] flex items-center justify-center font-extrabold">
                {pendingSyncCount}
              </span>
            </button>
          ) : null}

          {/* Refresh Feed Button (Social Media Style) */}
          {onRefresh && (
            <button
              id="btn-header-refresh-feed"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90"
              aria-label={l('ফিড রিফ্রেশ করুন', 'Refresh feed')}
              title={l('নতুন পোস্ট ও আপডেট দেখতে রিফ্রেশ করুন', 'Refresh feed for latest posts')}
            >
              <RefreshCw
                className={`w-5 h-5 sm:w-5 sm:h-5 text-gray-700 transition-transform ${
                  isRefreshing ? 'animate-spin text-rose-600' : 'hover:rotate-180 duration-500'
                }`}
              />
            </button>
          )}

          {/* Search Button */}
          <button
            id="btn-header-search"
            onClick={onSearchClick}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          {/* Notification Bell Button */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full relative transition-all active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-[#E53935] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

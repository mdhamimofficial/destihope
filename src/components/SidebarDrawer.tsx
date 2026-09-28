import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Droplet, 
  MessageSquare, 
  PlaySquare, 
  Brain, 
  UserSearch, 
  Sliders, 
  HardDrive, 
  RefreshCw, 
  Phone, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  X, 
  Search, 
  Check, 
  RotateCcw, 
  Info, 
  Bell, 
  Settings, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Shield,
  Smartphone,
  Eye,
  Zap,
  Sparkles
} from 'lucide-react';
import { ActiveModule, UserProfile, HubManualControls } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ActiveModule) => void;
  currentUser: UserProfile;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentLang?: 'bn' | 'en';
  onToggleLanguage?: () => void;
  dataSaverEnabled?: boolean;
  onToggleDataSaver?: () => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  onOpenBlueprint?: () => void;
  isOffline?: boolean;
  onToggleOfflineMode?: () => void;
  pendingSyncCount?: number;
  onTriggerSync?: () => void;
  activeModule?: ActiveModule;
  hubControls?: HubManualControls;
  onUpdateHubControl?: <K extends keyof HubManualControls>(key: K, value: HubManualControls[K]) => void;
  onResetHubControls?: () => void;
  onApplyMinimalPreset?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  currentUser,
  isDarkMode = false,
  onToggleDarkMode,
  currentLang = 'bn',
  onToggleLanguage,
  dataSaverEnabled = false,
  onOpenSettings,
  onOpenNotifications,
  onOpenBlueprint,
  isOffline = false,
  pendingSyncCount = 0,
  onTriggerSync,
  activeModule = 'hope',
  hubControls = {
    showLiveAlert: true,
    showQuickActions: true,
    showCategoryPills: true,
    compactFeedMode: false,
    autoPlayMedia: true,
    showModuleBadges: true,
    enableAnimations: true,
    hapticSoundFeedback: true,
    autoCloseOrbitTimer: true,
    dataSaver: false,
    highContrastMode: false,
  },
  onUpdateHubControl,
  onResetHubControls,
  onApplyMinimalPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'controls' | 'tools'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [storageUsed, setStorageUsed] = useState('48.6 MB');
  const [isClearingStorage, setIsClearingStorage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDonorCard, setShowDonorCard] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const isBn = currentLang === 'bn';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearCache = () => {
    setIsClearingStorage(true);
    setTimeout(() => {
      setStorageUsed('0.0 MB');
      setIsClearingStorage(false);
      triggerToast(isBn ? 'অ্যাপের ক্যাশ ও অস্থায়ী ডেটা মুক্ত করা হয়েছে (৪৮.৬ MB ফাঁকা)' : 'Cache memory cleared (48.6 MB freed)');
    }, 800);
  };

  // Modular Directory
  const modulesList = [
    {
      id: 'hope' as ActiveModule,
      name: 'DestiHope',
      label: isBn ? 'কমিউনিটি ও সমাজসেবা' : 'Community & Feed',
      description: isBn ? 'নাগরিক সহায়তা, গণফিড ও জরুরি পোস্ট' : 'Civic relief, social feed & posts',
      icon: Home,
      tag: isBn ? 'প্রধান' : 'Primary'
    },
    {
      id: 'care' as ActiveModule,
      name: 'DestiCare',
      label: isBn ? 'জরুরি রক্ত ও স্বাস্থ্যসেবা' : 'Blood & Emergency Aid',
      description: isBn ? 'রক্তদাতা অনুসন্ধান, অ্যাম্বুলেন্স ও হেল্প' : 'Donor search, requests & health aid',
      icon: Droplet,
      tag: isBn ? 'জরুরি' : 'Urgent'
    },
    {
      id: 'chat' as ActiveModule,
      name: 'DestiChat',
      label: isBn ? 'সুরক্ষিত মেসেজিং' : 'Encrypted Messages',
      description: isBn ? 'ইনস্ট্যান্ট চ্যাট, গ্রুপ ও ডিরেক্ট মেসেজ' : 'Direct messages, channels & alerts',
      icon: MessageSquare,
      tag: isBn ? 'সক্রিয়' : 'Active'
    },
    {
      id: 'media' as ActiveModule,
      name: 'DestiMedia',
      label: isBn ? 'ভিডিও ও রিলস হাব' : 'Media & Video Feed',
      description: isBn ? 'শর্টস, সামাজিক প্রতিবেদন ও ভিডিও' : 'Short clips, news footage & media',
      icon: PlaySquare,
      tag: isBn ? 'মিডিয়া' : 'Media'
    },
    {
      id: 'brain' as ActiveModule,
      name: 'DestiBrain',
      label: isBn ? 'জ্ঞানভাণ্ডার ও দক্ষতা' : 'Knowledge & Learning',
      description: isBn ? 'কুইজ, ক্যারিয়ার ও প্রাসঙ্গিক তথ্যভাণ্ডার' : 'Quizzes, skill guides & resources',
      icon: Brain,
      tag: 'AI/Info'
    },
    {
      id: 'find' as ActiveModule,
      name: 'DestiFind',
      label: isBn ? 'নিখোঁজ সন্ধান ও রেসকিউ' : 'Missing Persons Rescue',
      description: isBn ? 'নিখোঁজ মানুষের তালিকা ও ডিরেক্টরি' : 'Lost individuals register & rescue directory',
      icon: UserSearch,
      tag: isBn ? 'পাবলিক' : 'Public'
    }
  ];

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modulesList;
    const q = searchQuery.toLowerCase();
    return modulesList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );
  }, [searchQuery, isBn]);

  // Count active customizations
  const customizedCount = useMemo(() => {
    let count = 0;
    if (!hubControls.showLiveAlert) count++;
    if (!hubControls.showQuickActions) count++;
    if (!hubControls.showCategoryPills) count++;
    if (hubControls.compactFeedMode) count++;
    if (!hubControls.autoPlayMedia) count++;
    if (!hubControls.showModuleBadges) count++;
    if (!hubControls.enableAnimations) count++;
    if (!hubControls.autoCloseOrbitTimer) count++;
    if (hubControls.highContrastMode) count++;
    if (hubControls.dataSaver) count++;
    return count;
  }, [hubControls]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Drawer Container - Solid, clean, professional software layout */}
      <div 
        className={`relative w-full sm:w-[420px] max-w-[430px] h-full flex flex-col z-10 overflow-hidden shadow-2xl transition-colors ${
          isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
        }`}
      >
        {/* HEADER: Sharp, clean, utilitarian */}
        <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E53935] flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              <span className="text-base tracking-tighter">DH</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  DESTI HUB
                </h2>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  v2.4
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                {isBn ? 'সেন্ট্রাল সিস্টেম ও কন্ট্রোল সেন্টার' : 'System & Application Control'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close Hub"
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* USER STATUS BAR: Compact, clean summary */}
        <div className={`px-5 py-2.5 border-b text-xs flex items-center justify-between shrink-0 ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-semibold truncate">{currentUser.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono text-[11px]">{currentUser.bloodGroup || 'User'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isOffline ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                {isBn ? 'অফলাইন' : 'Offline'}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                {isBn ? 'অনলাইন' : 'Online'}
              </span>
            )}
            {pendingSyncCount > 0 && (
              <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1 rounded text-[10px]">
                {pendingSyncCount} {isBn ? 'পেন্ডিং' : 'pending'}
              </span>
            )}
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS: Clean segmented tabs */}
        <div className={`p-2 border-b shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`grid grid-cols-3 p-1 rounded-lg gap-1 ${
            isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-1.5 px-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isBn ? 'মডিউল' : 'Modules'}</span>
            </button>

            <button
              onClick={() => setActiveTab('controls')}
              className={`py-1.5 px-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 relative cursor-pointer ${
                activeTab === 'controls'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#E53935]" />
              <span>{isBn ? 'কন্ট্রোল' : 'Controls'}</span>
              {customizedCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`py-1.5 px-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'tools'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{isBn ? 'টুলস' : 'Tools'}</span>
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION BANNER */}
        {toastMessage && (
          <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs px-4 py-2 font-medium flex items-center justify-between shrink-0">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="p-0.5 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* TAB 1: MODULES DIRECTORY */}
          {activeTab === 'modules' && (
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBn ? 'মডিউল বা সেবা খুঁজুন...' : 'Search modules or tools...'}
                  className={`w-full pl-9 pr-8 py-2 rounded-lg text-xs outline-hidden border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-slate-500' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Module List */}
              <div className="space-y-1.5">
                {filteredModules.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? isDarkMode
                            ? 'bg-slate-800 border-[#E53935] text-white'
                            : 'bg-red-50 border-red-200 text-slate-900'
                          : isDarkMode
                            ? 'bg-slate-800 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#E53935] text-white'
                            : isDarkMode
                              ? 'bg-slate-700 text-slate-300 group-hover:text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:text-slate-900'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-700 dark:text-slate-300">
                              · {item.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                            {item.label}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isActive ? (
                          <span className="text-[11px] font-medium text-[#E53935] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {isBn ? 'সক্রিয়' : 'Active'}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Fast Module Switcher Banner */}
              <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                isDarkMode ? 'bg-slate-800 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {isBn ? 'দ্রুত মডিউল সুইচ' : 'Quick Switch'}
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    {isBn ? 'পরবর্তী সেবা মডিউলে দ্রুত স্থানান্তর করুন' : 'Cycle to next ecosystem module'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const order: ActiveModule[] = ['hope', 'care', 'chat', 'media', 'brain', 'find'];
                    const curIndex = order.indexOf(activeModule);
                    const nextMod = order[(curIndex + 1) % order.length];
                    onSelectModule(nextMod);
                    triggerToast(isBn ? `সুইচ করা হয়েছে: ${nextMod.toUpperCase()}` : `Switched to ${nextMod.toUpperCase()}`);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL CONTROLS CENTER (User can toggle non-essential items) */}
          {activeTab === 'controls' && (
            <div className="p-4 space-y-5">
              {/* Presets and summary header */}
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isBn ? 'ম্যানুয়াল ইন্টারফেস কন্ট্রোল' : 'Manual Interface Controls'}
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                    {isBn ? 'অপ্রয়োজনীয় উপাদানগুলো নিজের মতো বন্ধ বা চালু রাখুন' : 'Toggle non-essential visual elements as desired'}
                  </p>
                </div>

                <button
                  onClick={onResetHubControls}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-[#E53935] cursor-pointer"
                  title="Reset to default settings"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                </button>
              </div>

              {/* Preset Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onResetHubControls}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    customizedCount === 0
                      ? 'border-[#E53935] bg-red-50 dark:bg-red-950'
                      : isDarkMode
                        ? 'border-slate-800 bg-slate-800 hover:bg-slate-800'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{isBn ? 'ডিফল্ট মোড' : 'Default View'}</span>
                    {customizedCount === 0 && <Check className="w-3 h-3 text-[#E53935]" />}
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
                    {isBn ? 'সব স্ট্যান্ডার্ড এলিমেন্ট দৃশ্যমান' : 'All standard controls visible'}
                  </p>
                </button>

                <button
                  onClick={onApplyMinimalPreset}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    !hubControls.showLiveAlert && !hubControls.showQuickActions && hubControls.compactFeedMode
                      ? 'border-[#E53935] bg-red-50 dark:bg-red-950'
                      : isDarkMode
                        ? 'border-slate-800 bg-slate-800 hover:bg-slate-800'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{isBn ? 'মিনিমালিস্ট মোড' : 'Minimal View'}</span>
                    {!hubControls.showLiveAlert && !hubControls.showQuickActions && hubControls.compactFeedMode && (
                      <Check className="w-3 h-3 text-[#E53935]" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5">
                    {isBn ? 'অপ্রয়োজনীয় ব্যানার ও পিলস লুকানো' : 'Hides banners, pills & padding'}
                  </p>
                </button>
              </div>

              {/* Group 1: Interface Visibility */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {isBn ? '১. ইন্টারফেস দৃশ্যমানতা' : '1. Interface Elements'}
                </span>

                <div className={`rounded-lg border divide-y overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
                }`}>
                  {/* Live Alert Banner */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'জরুরি লাইভ অ্যালার্ট ব্যানার' : 'Emergency Live Alert Banner'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'হোম ফিডের ওপরের গুরুত্বপূর্ণ নোটিশ ও সতর্কবার্তা' : 'Top pinned urgent notice banner on home'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.showLiveAlert}
                      onClick={() => onUpdateHubControl?.('showLiveAlert', !hubControls.showLiveAlert)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.showLiveAlert ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.showLiveAlert ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Quick Action Bar */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'কুইক অ্যাকশন বাটন বার' : 'Quick Actions Bar'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'রক্তদান, সাহায্য চাওয়া ও জরুরি বাটনগুলোর ফ্লোটিং বার' : 'Action shortcuts for blood, relief & SOS'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.showQuickActions}
                      onClick={() => onUpdateHubControl?.('showQuickActions', !hubControls.showQuickActions)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.showQuickActions ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.showQuickActions ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Category Pills */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'ক্যাটাগরি ফিল্টার বার' : 'Category Filter Pills'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'ফিডের ক্যাটাগরি বাটনগুলো (রক্ত, নিখোঁজ, সংবাদ ইত্যাদি)' : 'Horizontal category pill filters on home feed'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.showCategoryPills}
                      onClick={() => onUpdateHubControl?.('showCategoryPills', !hubControls.showCategoryPills)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.showCategoryPills ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.showCategoryPills ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Compact Feed Mode */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'কমপ্যাক্ট ফিড ভিউ' : 'Compact Feed Layout'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'কার্ডের অতিরিক্ত মার্জিন কমিয়ে বেশি কন্টেন্ট একসাথে দেখা' : 'Reduces card padding to display more items on screen'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.compactFeedMode}
                      onClick={() => onUpdateHubControl?.('compactFeedMode', !hubControls.compactFeedMode)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.compactFeedMode ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.compactFeedMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group 2: Notifications & Motion */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {isBn ? '২. নোটিফিকেশন ও ইন্টারঅ্যাকশন' : '2. Notifications & Motion'}
                </span>

                <div className={`rounded-lg border divide-y overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
                }`}>
                  {/* Module Badges */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'নোটিফিকেশন ব্যাজ কাউন্টার' : 'Notification Badges'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'বটম বার ও মডিউল আইকনে লাল কাউন্টার নম্বর দেখানো' : 'Display unread red count dots on navigation'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.showModuleBadges}
                      onClick={() => onUpdateHubControl?.('showModuleBadges', !hubControls.showModuleBadges)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.showModuleBadges ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.showModuleBadges ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* UI Animations */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'UI ট্রানজিশন ও অ্যানিমেশন' : 'UI Motion & Transitions'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'স্ক্রিন পরিবর্তনে মসৃণ গতি (ধীরগতির ডিভাইসে বন্ধের সুবিধা)' : 'Disable motion transitions for lower latency'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.enableAnimations}
                      onClick={() => onUpdateHubControl?.('enableAnimations', !hubControls.enableAnimations)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.enableAnimations ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.enableAnimations ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Auto-Close Orbit Timer */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'মডিউল সুইচার অটো-ক্লোজ' : 'Switcher Auto-Dismiss'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'সুইচার মেনু ৫ সেকেন্ড পর নিজে থেকে বন্ধ হওয়া' : 'Automatically close module menu after 5 seconds of inactivity'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.autoCloseOrbitTimer}
                      onClick={() => onUpdateHubControl?.('autoCloseOrbitTimer', !hubControls.autoCloseOrbitTimer)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.autoCloseOrbitTimer ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.autoCloseOrbitTimer ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group 3: Data & Media */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  {isBn ? '৩. ডেটা ও পারফরম্যান্স' : '3. Data & Media'}
                </span>

                <div className={`rounded-lg border divide-y overflow-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-800 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
                }`}>
                  {/* Data Saver Mode */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'ডাটা সেভার মোড' : 'Data Saver Mode'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'মোবাইল ডেটা বাঁচাতে ছবির রেজোলিউশন সীমিতকরণ' : 'Load compressed media to conserve bandwidth'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.dataSaver}
                      onClick={() => onUpdateHubControl?.('dataSaver', !hubControls.dataSaver)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.dataSaver ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.dataSaver ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Auto Play Media */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'মিডিয়া অটো-প্লে' : 'Autoplay Video'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'স্ক্রল করার সময় ভিডিও স্বয়ংক্রিয়ভাবে চালু হওয়া' : 'Play video previews automatically while scrolling'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.autoPlayMedia}
                      onClick={() => onUpdateHubControl?.('autoPlayMedia', !hubControls.autoPlayMedia)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.autoPlayMedia ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.autoPlayMedia ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* High Contrast Mode */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'হাই কনট্রাস্ট মোড' : 'High Contrast Mode'}
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'সহজে পড়ার জন্য স্পষ্ট লেখা ও ডিপ বর্ডার' : 'Enhances border clarity and text contrast'}
                      </p>
                    </div>
                    <button
                      role="switch"
                      aria-checked={hubControls.highContrastMode}
                      onClick={() => onUpdateHubControl?.('highContrastMode', !hubControls.highContrastMode)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                        hubControls.highContrastMode ? 'bg-[#E53935]' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        hubControls.highContrastMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOOLS & SYSTEM UTILITIES */}
          {activeTab === 'tools' && (
            <div className="p-4 space-y-4">
              {/* Storage & Cache Management */}
              <div className={`p-3.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <HardDrive className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'স্টোরেজ ও ক্যাশ মেমোরি' : 'Storage & Cache'}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? `ব্যবহৃত ক্যাশ: ${storageUsed}` : `Cached data: ${storageUsed}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClearCache}
                    disabled={isClearingStorage || storageUsed === '0.0 MB'}
                    className="px-3 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {isClearingStorage ? (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        ...
                      </span>
                    ) : (
                      isBn ? 'খালি করুন' : 'Clear'
                    )}
                  </button>
                </div>
              </div>

              {/* Offline Sync Manager */}
              <div className={`p-3.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'ক্লাউড ডেটা সিঙ্ক' : 'Cloud Data Sync'}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isOffline 
                          ? isBn ? 'বর্তমানে অফলাইনে আছেন' : 'Currently in offline mode'
                          : pendingSyncCount > 0 
                            ? isBn ? `${pendingSyncCount}টি আইটেম আপলোড বাকি` : `${pendingSyncCount} items pending`
                            : isBn ? 'সকল ডেটা ক্লাউডে সুরক্ষিত' : 'All local changes synchronized'
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onTriggerSync) onTriggerSync();
                      triggerToast(isBn ? 'ক্লাউড ডেটা সিঙ্ক সম্পন্ন হয়েছে' : 'Cloud synchronization complete');
                    }}
                    className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    {isBn ? 'এখনই সিঙ্ক' : 'Sync Now'}
                  </button>
                </div>
              </div>

              {/* Blood Donor ID Card */}
              <div className={`p-3.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950 flex items-center justify-center text-[#E53935] shrink-0">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'ডিজিটাল রক্তদাতা কার্ড' : 'Blood Donor ID'}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? `গ্রুপ: ${currentUser.bloodGroup || 'A+'} · প্রস্তুত` : `Group: ${currentUser.bloodGroup || 'A+'} · Ready`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDonorCard((prev) => !prev)}
                    className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    {showDonorCard ? (isBn ? 'লুকান' : 'Hide') : (isBn ? 'কার্ড দেখুন' : 'View ID')}
                  </button>
                </div>

                {showDonorCard && (
                  <div className={`mt-3 pt-3 border-t text-xs space-y-2 ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>{isBn ? 'নাম:' : 'Name:'}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>{isBn ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                      <span className="font-bold text-[#E53935]">{currentUser.bloodGroup || 'A+'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>{isBn ? 'ফোন নম্বর:' : 'Contact:'}</span>
                      <span className="font-mono text-slate-900 dark:text-white">{currentUser.phone || '01700-000000'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                      <span>{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {isBn ? 'স্বেচ্ছায় রক্তদানে আগ্রহী' : 'Available to Donate'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* National Emergency 999 Hotline */}
              <div className={`p-3.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950 flex items-center justify-center text-[#E53935] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'জাতীয় জরুরি সেবা (৯৯৯)' : 'National Emergency (999)'}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স' : 'Police, Fire Service & Ambulance'}
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:999"
                    className="px-3 py-1.5 rounded bg-[#E53935] text-white text-xs font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>999</span>
                  </a>
                </div>
              </div>

              {/* Quick Documentation Info */}
              <div className={`p-3.5 rounded-lg border ${
                isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <button
                  onClick={() => setShowHelpDialog((prev) => !prev)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {isBn ? 'ব্যবহার নির্দেশিকা ও নীতিমালার বিবরণ' : 'Usage Guide & Policies'}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                        {isBn ? 'রক্তদান, সাহায্য চাওয়া ও নিরাপত্তার নিয়ম' : 'Safety rules, blood aid & guidelines'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showHelpDialog ? 'rotate-90' : ''}`} />
                </button>

                {showHelpDialog && (
                  <div className={`mt-3 pt-3 border-t text-xs space-y-2 text-slate-600 dark:text-slate-300 ${
                    isDarkMode ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <p>• {isBn ? 'রক্তদানের জন্য কমপক্ষে ৩ মাস ব্যবধান থাকা প্রয়োজন।' : 'Minimum 3 months interval required between blood donations.'}</p>
                    <p>• {isBn ? 'নিখোঁজ ব্যক্তির তথ্যে সর্বদা সঠিক জিডি নম্বর ও কন্টাক্ট নম্বর দিন।' : 'Always provide verified contact number and GD entry for missing cases.'}</p>
                    <p>• {isBn ? 'সব কন্ট্রোল আপনার ডিভাইসে সেভ থাকে এবং পেজ লোডে বজায় থাকে।' : 'All manual interface settings are preserved in local storage.'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM UTILITY FOOTER: Clean, professional action bar */}
        <div className={`p-3 border-t flex items-center justify-between shrink-0 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentLang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'লাইট' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>{isBn ? 'ডার্ক' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Settings Shortcut */}
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              onClose();
            }}
            className="p-2 rounded text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications Shortcut */}
          <button
            onClick={() => {
              if (onOpenNotifications) onOpenNotifications();
              onClose();
            }}
            className="p-2 rounded text-slate-700 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Close Hub */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SidebarDrawer;

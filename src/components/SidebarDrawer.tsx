import React from 'react';
import { 
  X, 
  Home, 
  MessageCircle, 
  PlaySquare, 
  Brain, 
  Droplet, 
  Search, 
  UserSearch,
  User, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  WifiOff, 
  Settings, 
  HelpCircle,
  ExternalLink,
  Crown,
  Download,
  Wifi,
  RefreshCw
} from 'lucide-react';
import { ActiveModule, UserProfile } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ActiveModule) => void;
  currentUser: UserProfile;
  dataSaverEnabled: boolean;
  onToggleDataSaver: () => void;
  onOpenBlueprint?: () => void;
  isOffline?: boolean;
  onToggleOfflineMode?: () => void;
  pendingSyncCount?: number;
  onTriggerSync?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  currentUser,
  dataSaverEnabled,
  onToggleDataSaver,
  onOpenBlueprint,
  isOffline = false,
  onToggleOfflineMode,
  pendingSyncCount = 0,
  onTriggerSync,
}) => {
  if (!isOpen) return null;

  const modules = [
    { id: 'hope' as ActiveModule, name: 'Desti Hope', sub: 'হোম ও সামাজিক নেটওয়ার্ক', icon: Home, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'chat' as ActiveModule, name: 'Desti Chat', sub: 'কমিউনিকেশন ও ব্লাড চ্যাট', icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'media' as ActiveModule, name: 'Desti Media', sub: 'ভিডিও, রিলস ও অডিও স্ট্রিম', icon: PlaySquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'brain' as ActiveModule, name: 'Desti Brain', sub: 'শিক্ষা, এআই টিউটর ও বিতর্ক', icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'care' as ActiveModule, name: 'Desti Care', sub: 'হাসপাতাল ও ব্লাড ব্যাংক', icon: Droplet, color: 'text-red-500', bg: 'bg-rose-50' },
    { id: 'find' as ActiveModule, name: 'Desti Find', sub: 'উদ্ধার ও নিখোঁজ সন্ধান', icon: UserSearch, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 'profile' as ActiveModule, name: 'Unified Profile', sub: 'হোপ পয়েন্টস ও ব্যাজ', icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* User Card & Header */}
        <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-2.5 right-2.5 w-10 h-10 flex items-center justify-center text-gray-200 hover:text-white rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 active:scale-90 transition-all cursor-pointer touch-manipulation"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center space-x-3 mt-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-base truncate">{currentUser.name}</h3>
              <p className="text-xs text-gray-300">@{currentUser.username}</p>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded font-bold">
                  {currentUser.bloodGroup} রক্তদাতা
                </span>
                <span className="text-[10px] bg-teal-600 px-1.5 py-0.5 rounded font-bold flex items-center">
                  <Award className="w-3 h-3 mr-0.5" />
                  {currentUser.hopePoints} HP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="p-3 flex-1 space-y-1">
          <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase px-2 mb-1">
            DestiHope ইকোসিস্টেম মডিউল
          </div>

          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  onSelectModule(mod.id);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors active:scale-98"
              >
                <div className={`w-9 h-9 rounded-lg ${mod.bg} ${mod.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 leading-none mb-1">
                    {mod.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {mod.sub}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Bangladesh-First Features */}
          <div className="pt-3 mt-2 border-t border-gray-100">
            <div className="text-[11px] font-bold tracking-wider text-gray-400 uppercase px-2 mb-2">
              বাংলাদেশ ফিচার ও ডাটা সেভার
            </div>

            {/* Data Saver Mode Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 mb-1.5">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-gray-800">ডাটা সেভার মোড</span>
              </div>
              <button
                onClick={onToggleDataSaver}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                  dataSaverEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    dataSaverEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Offline Simulation / Network Toggle */}
            {onToggleOfflineMode && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 mb-1.5">
                <div className="flex items-center space-x-2">
                  {isOffline ? (
                    <WifiOff className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Wifi className="w-4 h-4 text-blue-600" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">
                      নেটওয়ার্ক সংযোগ (টেস্ট মোড)
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {isOffline ? 'বর্তমানে অফলাইন (সিমুলেশন)' : 'বর্তমানে অনলাইন'}
                    </span>
                  </div>
                </div>
                <button
                  id="btn-toggle-offline-simulation"
                  onClick={onToggleOfflineMode}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    isOffline 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {isOffline ? 'অনলাইন করুন' : 'অফলাইন করুন'}
                </button>
              </div>
            )}

            {/* Pending Sync Trigger (if any) */}
            {pendingSyncCount > 0 && onTriggerSync && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 mb-1.5 text-amber-900">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold">
                    {pendingSyncCount}টি অফলাইন পোস্ট সিঙ্ক অপেক্ষারত
                  </span>
                </div>
                <button
                  onClick={() => {
                    onTriggerSync();
                    onClose();
                  }}
                  className="text-xs font-extrabold bg-amber-600 text-white px-2 py-1 rounded-md hover:bg-amber-700 transition-colors"
                >
                  সিঙ্ক করুন
                </button>
              </div>
            )}

            {/* Emergency Hotline fast button */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 text-red-700">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold">জরুরি জাতীয় কল: ৯৯৯</span>
              </div>
              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded">
                ফ্রি
              </span>
            </div>
          </div>

          {/* Trust & Governance */}
          <div className="pt-3 mt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 px-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>ব্লুপ্রিন্ট ও গভর্ন্যান্স আর্কিটেকচার</span>
            </div>
            <div className="flex items-center space-x-2 px-2 py-1 text-xs text-gray-500">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Super Owner / Founder Control</span>
            </div>
          </div>

          {/* Master Blueprint PDF & Project Backup Download */}
          <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
            <button
              id="btn-open-blueprint-pdf"
              onClick={() => {
                if (onOpenBlueprint) {
                  onOpenBlueprint();
                } else {
                  window.open('/blueprint.html', '_blank');
                }
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold text-xs shadow-xs hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>মাস্টার ব্লুপ্রিন্ট (PDF ডাউনলোড)</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">
                PDF
              </span>
            </button>

            <a
              id="btn-download-project-zip"
              href="/destihope-project.zip"
              download="destihope-project.zip"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold text-xs shadow-xs hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-white shrink-0" />
                <span>প্রজেক্ট ব্যাকআপ ডাউনলোড (ZIP)</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">
                ZIP
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-700">DestiHope Bangladesh Ecosystem</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Version 2.0 • Module-Level Blueprint</p>
        </div>
      </div>
    </div>
  );
};

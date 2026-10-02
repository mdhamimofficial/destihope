import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Bell, 
  UserCheck, 
  Smartphone, 
  KeyRound, 
  Trash2, 
  Download, 
  ChevronRight, 
  Check, 
  AlertCircle,
  HelpCircle,
  Globe,
  Sliders,
  Moon,
  Sun,
  WifiOff,
  Palette,
  Volume2,
  RefreshCw,
  Languages,
  EyeOff,
  User
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  currentLang?: 'bn' | 'en';
  onToggleLanguage?: () => void;
  dataSaverEnabled?: boolean;
  onToggleDataSaver?: () => void;
  onSaveNotice?: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isDarkMode = false,
  onToggleDarkMode,
  currentLang = 'bn',
  onToggleLanguage,
  dataSaverEnabled = false,
  onToggleDataSaver,
  onSaveNotice,
}) => {
  const { language, setLanguage, l, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'preferences' | 'privacy' | 'security' | 'notifications' | 'account'>('preferences');
  
  // Local fallback states if not controlled
  const [localDarkMode, setLocalDarkMode] = useState(isDarkMode);
  const [localLang, setLocalLang] = useState<'bn' | 'en'>(currentLang);
  const [localDataSaver, setLocalDataSaver] = useState(dataSaverEnabled);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'medium' | 'large'>('normal');

  // Privacy settings state
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'community' | 'verified'>('public');
  const [showPhoneToPublic, setShowPhoneToPublic] = useState(false);
  const [showBloodDonorStatus, setShowBloodDonorStatus] = useState(true);
  const [searchByPhoneEnabled, setSearchByPhoneEnabled] = useState(false);
  const [activityStatusVisible, setActivityStatusVisible] = useState(true);

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [activeSessionsCount, setActiveSessionsCount] = useState(2);

  // Notification preferences
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [bloodRequestsNearby, setBloodRequestsNearby] = useState(true);
  const [missingCaseUpdates, setMissingCaseUpdates] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);

  if (!isOpen) return null;

  const notify = (msg: string) => {
    if (onSaveNotice) {
      onSaveNotice(msg);
    }
  };

  const handleToggleDark = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      setLocalDarkMode(!localDarkMode);
    }
    const nextVal = onToggleDarkMode ? !isDarkMode : !localDarkMode;
    notify(`ডার্ক মোড ${nextVal ? 'চালু' : 'বন্ধ'} হয়েছে`);
  };

  const handleToggleLang = (selectedLang?: 'bn' | 'en') => {
    const target = selectedLang || (currentLang === 'bn' ? 'en' : 'bn');
    if (onToggleLanguage) {
      onToggleLanguage();
    } else {
      setLocalLang(target);
    }
    notify(`ভাষা পরিবর্তন: ${target === 'bn' ? 'বাংলা (Bangla)' : 'English'}`);
  };

  const handleToggleData = () => {
    if (onToggleDataSaver) {
      onToggleDataSaver();
    } else {
      setLocalDataSaver(!localDataSaver);
    }
    const nextVal = onToggleDataSaver ? !dataSaverEnabled : !localDataSaver;
    notify(`ডাটা সেভার ${nextVal ? 'চালু' : 'বন্ধ'} হয়েছে`);
  };

  const activeDark = onToggleDarkMode ? isDarkMode : localDarkMode;
  const activeLanguage = language;
  const activeDataSaver = onToggleDataSaver ? dataSaverEnabled : localDataSaver;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 animate-fadeIn">
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border transition-colors ${
        activeDark 
          ? 'bg-gray-900 border-gray-800 text-gray-100' 
          : 'bg-white border-gray-100 text-gray-800'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b transition-colors ${
          activeDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              activeDark ? 'bg-red-950/60 text-red-400' : 'bg-red-50 text-red-600'
            }`}>
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className={`font-bold text-base leading-tight ${activeDark ? 'text-white' : 'text-gray-900'}`}>{l('সেটিংস ও প্রাইভেসি', 'Settings & Privacy')}</h2>
              <p className={`text-xs ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>{l('অ্যাকাউন্ট নিরাপত্তা ও গোপনীয়তা নিয়ন্ত্রণ', 'Manage security, privacy & preferences')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              activeDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DestiHope Segmented Navigation Tabs */}
        <div className={`flex border-b px-4 py-2.5 gap-2 overflow-x-auto no-scrollbar ${
          activeDark ? 'border-gray-800 bg-gray-950/50' : 'border-gray-100 bg-slate-50'
        }`}>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'preferences'
                ? activeDark 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-600 text-white shadow-xs'
                : activeDark 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{l('প্রেফারেন্স', 'Preferences')}</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? activeDark 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-600 text-white shadow-xs'
                : activeDark 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>{l('প্রাইভেসি', 'Privacy')}</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'security'
                ? activeDark 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-600 text-white shadow-xs'
                : activeDark 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{l('নিরাপত্তা', 'Security')}</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'notifications'
                ? activeDark 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-600 text-white shadow-xs'
                : activeDark 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{l('নোটিফিকেশন', 'Notifications')}</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'account'
                ? activeDark 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-red-600 text-white shadow-xs'
                : activeDark 
                  ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200/80 hover:bg-gray-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{l('অ্যাকাউন্ট', 'Account')}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className={`p-5 overflow-y-auto space-y-4 flex-1 ${activeDark ? 'text-gray-200' : 'text-gray-800'}`}>
          
          {/* TAB 0: PREFERENCES (General / Display / Language) */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* 1. Dark Mode Toggle Card */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                activeDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      activeDark ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {activeDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${activeDark ? 'text-white' : 'text-gray-900'}`}>
                        {l('ডার্ক মোড (Dark Theme)', 'Dark Mode (Dark Theme)')}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeDark ? l('ডার্ক থিম সক্রিয় রয়েছে (চোখের স্বস্তিদায়ক)', 'Dark theme is active (comfortable for eyes)') : l('লাইট থিম সক্রিয় রয়েছে (স্বাভাবিক ভিউ)', 'Light theme is active (standard view)')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="settings-toggle-dark-mode"
                    onClick={handleToggleDark}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      activeDark ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                    aria-label="ডার্ক মোড টগল করুন"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      activeDark ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* 2. Language Selection Card */}
              <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                activeDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border border-gray-100'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeDark ? 'bg-blue-900/60 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${activeDark ? 'text-white' : 'text-gray-900'}`}>
                      {l('অ্যাপ্লিকেশন ভাষা (App Language)', 'App Language (ভাষা)')}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {l('মেনু ও নোটিফিকেশনের মূল ভাষা নির্বাচন করুন', 'Select primary language for interface & alerts')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleLang('bn')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      activeLanguage === 'bn'
                        ? activeDark
                          ? 'border-blue-500 bg-blue-950/60 text-blue-200 font-bold shadow-xs'
                          : 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                        : activeDark
                          ? 'border-gray-700 bg-gray-800/60 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-200 hover:bg-white text-gray-700 text-xs'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">বাংলা (Bangla)</div>
                      <div className={`text-[10px] ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>{l('ডিফল্ট বাংলা ইন্টারফেস', 'Default Bangla Interface')}</div>
                    </div>
                    {activeLanguage === 'bn' && <Check className="w-4 h-4 text-blue-500" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleLang('en')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      activeLanguage === 'en'
                        ? activeDark
                          ? 'border-blue-500 bg-blue-950/60 text-blue-200 font-bold shadow-xs'
                          : 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                        : activeDark
                          ? 'border-gray-700 bg-gray-800/60 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-200 hover:bg-white text-gray-700 text-xs'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">English (ইংরেজি)</div>
                      <div className={`text-[10px] ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>{l('ইংরেজি ইন্টারফেস', 'English Interface')}</div>
                    </div>
                    {activeLanguage === 'en' && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                </div>
              </div>

              {/* 3. Data Saver Mode Card */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                activeDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border border-gray-100 hover:border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      activeDark ? 'bg-teal-900/60 text-teal-400' : 'bg-teal-50 text-teal-600'
                    }`}>
                      <WifiOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${activeDark ? 'text-white' : 'text-gray-900'}`}>
                        {l('ডাটা সেভার (Data Saver Mode)', 'Data Saver Mode')}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activeDataSaver ? l('কম ব্যান্ডউইথ খরচ হচ্ছে, ছবি কমপ্রেসড', 'Lower data used, compressed media') : l('স্বাভাবিক কোয়ালিটিতে ছবি ও কন্টেন্ট প্রদর্শন', 'Full quality media and content')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="settings-toggle-data-saver"
                    onClick={handleToggleData}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      activeDataSaver ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                    aria-label="ডাটা সেভার পরিবর্তন"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      activeDataSaver ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* 4. Additional App Preferences */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
                  {l('অন্যান্য পছন্দসমূহ', 'Other Preferences')}
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">{l('অ্যাকশন সাউন্ড ইফেক্ট', 'Action Sound Effects')}</div>
                    <div className="text-[11px] text-gray-500">{l('লাইক, কমেন্ট ও দান নিশ্চিতকরণে মৃদু সাউন্ড', 'Sound feedback on likes and actions')}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEffectsEnabled(!soundEffectsEnabled);
                      notify(`সাউন্ড ইফেক্ট: ${!soundEffectsEnabled ? 'চালু' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      soundEffectsEnabled ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      soundEffectsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Auto Play Video */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">{l('ভিডিও স্বয়ংক্রিয় প্লেব্যাক', 'Auto-play Videos')}</div>
                    <div className="text-[11px] text-gray-500">{l('ফিডে স্ক্রোল করার সময় ভিডিও নিজে থেকে চলবে', 'Videos play automatically while scrolling')}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoPlayVideos(!autoPlayVideos);
                      notify(`অটো-প্লে: ${!autoPlayVideos ? 'চালু' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      autoPlayVideos ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      autoPlayVideos ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

            </div>
          )}
          
          {/* TAB 1: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  প্রোফাইল দৃশ্যমানতা (Profile Visibility)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileVisibility('public');
                      notify('প্রোফাইল দৃশ্যমানতা: পাবলিক করা হয়েছে');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      profileVisibility === 'public'
                        ? 'border-red-500 bg-red-50/60 text-red-900 font-bold shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">পাবলিক</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">সবাই দেখতে পারবে</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileVisibility('community');
                      notify('প্রোফাইল দৃশ্যমানতা: শুধু কমিউনিটি');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      profileVisibility === 'community'
                        ? 'border-red-500 bg-red-50/60 text-red-900 font-bold shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">কমিউনিটি</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">শুধুমাত্র নিবন্ধিতরা</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileVisibility('verified');
                      notify('প্রোফাইল দৃশ্যমানতা: শুধু ভেরিফায়েড সদস্য');
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      profileVisibility === 'verified'
                        ? 'border-red-500 bg-red-50/60 text-red-900 font-bold shadow-xs'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">ভেরিফায়েড</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">যাচাইকৃত ভলান্টিয়ার</div>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">ফোন নম্বর প্রকাশ্য রাখুন</div>
                    <div className="text-[11px] text-gray-500">জরুরি ছাড়া অন্য সাধারণ ব্যবহারকারীদের কাছে নম্বর লুকানো থাকবে</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneToPublic(!showPhoneToPublic);
                      notify(`ফোন নম্বর দৃশ্যমানতা: ${!showPhoneToPublic ? 'প্রকাশিত' : 'গোপন'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      showPhoneToPublic ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      showPhoneToPublic ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">রক্তদাতা তালিকায় নাম দেখান</div>
                    <div className="text-[11px] text-gray-500">Desti Care মডিউলে রক্তের প্রয়োজনে আপনাকে সন্ধান করা যাবে</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBloodDonorStatus(!showBloodDonorStatus);
                      notify(`রক্তদাতা তালিকায় অন্তর্ভুক্তি: ${!showBloodDonorStatus ? 'চালু' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      showBloodDonorStatus ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      showBloodDonorStatus ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">ফোন নম্বর দিয়ে সার্চ করার অনুমতি</div>
                    <div className="text-[11px] text-gray-500">পরিচিতরা আপনার নম্বর দিয়ে DestiHope এ খুঁজে পাবে</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchByPhoneEnabled(!searchByPhoneEnabled);
                      notify(`সার্চ পারমিশন: ${!searchByPhoneEnabled ? 'অনুমোদিত' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      searchByPhoneEnabled ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      searchByPhoneEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">অ্যাকাউন্ট নিরাপত্তা রেটিং: চমৎকার</div>
                  <div className="text-[11px] text-emerald-700">টু-ফ্যাক্টর অথেনটিকেশন ও জরুরি পিন সক্রিয় আছে।</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">টু-ফ্যাক্টর অথেনটিকেশন (2FA)</div>
                    <div className="text-[11px] text-gray-500">প্রতিবার নতুন ডিভাইসে লগইনের সময় SMS ও ওটিপি লাগবে</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      notify(`2FA নিরাপত্তা: ${!twoFactorEnabled ? 'চালু' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      twoFactorEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="pr-3">
                    <div className="text-xs font-bold text-gray-900">সন্দেহজনক লগইন অ্যালার্ট</div>
                    <div className="text-[11px] text-gray-500">অপরিচিত লোকেশন বা ডিভাইস থেকে সাইন-ইন হলে সতর্কবার্তা পাবেন</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginAlerts(!loginAlerts);
                      notify(`লগইন অ্যালার্ট: ${!loginAlerts ? 'চালু' : 'বন্ধ'}`);
                    }}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      loginAlerts ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      loginAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Change Password / PIN */}
                <button
                  type="button"
                  onClick={() => notify('পাসওয়ার্ড পরিবর্তনের ভেরিফিকেশন কোড পাঠানো হয়েছে')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <KeyRound className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">পাসওয়ার্ড ও সিকিউরিটি পিন পরিবর্তন</div>
                      <div className="text-[10px] text-gray-400">সর্বশেষ আপডেট: ৩০ দিন পূর্বে</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Active Sessions */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">সক্রিয় সেশন (Active Devices)</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{activeSessionsCount}টি ডিভাইসে লগইন আছে (ঢাকা ও চট্টগ্রাম)</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSessionsCount(1);
                      notify('অন্যান্য সকল ডিভাইস থেকে লগআউট করা হয়েছে');
                    }}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    অন্যান্য সব লগআউট
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="pr-3">
                  <div className="text-xs font-bold text-gray-900">জাতীয় জরুরি ব্রডকাস্ট</div>
                  <div className="text-[11px] text-gray-500">বন্যা, ঘূর্ণিঝড় বা জরুরি লাল সতর্কবার্তা</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmergencyAlerts(!emergencyAlerts);
                    notify(`জরুরি অ্যালার্ট: ${!emergencyAlerts ? 'চালু' : 'বন্ধ'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    emergencyAlerts ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    emergencyAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="pr-3">
                  <div className="text-xs font-bold text-gray-900">আশেপাশের রক্তের আবেদন</div>
                  <div className="text-[11px] text-gray-500">আপনার রক্তের গ্রুপ ও জেলার সাথে মিললে তাৎক্ষণিক পুশ নোটিফিকেশন</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBloodRequestsNearby(!bloodRequestsNearby);
                    notify(`রক্তের আবেদন নোটিফিকেশন: ${!bloodRequestsNearby ? 'চালু' : 'বন্ধ'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    bloodRequestsNearby ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    bloodRequestsNearby ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="pr-3">
                  <div className="text-xs font-bold text-gray-900">নিখোঁজ কেসের আপডেট</div>
                  <div className="text-[11px] text-gray-500">আপনার ফলো করা নিখোঁজ ব্যক্তির কোনো হদিস বা অগ্রগতি পাওয়া গেলে</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMissingCaseUpdates(!missingCaseUpdates);
                    notify(`নিখোঁজ আপডেট নোটিফিকেশন: ${!missingCaseUpdates ? 'চালু' : 'বন্ধ'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    missingCaseUpdates ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    missingCaseUpdates ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="pr-3">
                  <div className="text-xs font-bold text-gray-900">চ্যাট ও ইনবক্স মেসেজ</div>
                  <div className="text-[11px] text-gray-500">ভলান্টিয়ার বা গ্রুপের নতুন বার্তার নোটিফিকেশন</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setChatNotifications(!chatNotifications);
                    notify(`চ্যাট নোটিফিকেশন: ${!chatNotifications ? 'চালু' : 'বন্ধ'}`);
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    chatNotifications ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    chatNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">ইউজারনেম</span>
                  <span className="text-xs text-gray-900 font-semibold">@{currentUser.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">ফোন নম্বর</span>
                  <span className="text-xs text-gray-900 font-semibold">{currentUser.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">রক্তের গ্রুপ</span>
                  <span className="text-xs text-red-600 font-bold">{currentUser.bloodGroup}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">ঠিকানা / জেলা</span>
                  <span className="text-xs text-gray-900">{currentUser.district}{currentUser.area ? `, ${currentUser.area}` : ''}</span>
                </div>
              </div>

              {/* Data Archive Download */}
              <button
                type="button"
                onClick={() => notify('আপনার DestiHope অ্যাকাউন্ট ডাটার কপি জেনারেট হচ্ছে...')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Download className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs font-bold text-gray-900">ব্যক্তিগত তথ্যের কপি ডাউনলোড করুন</div>
                    <div className="text-[10px] text-gray-500">আপনার পোস্ট, রক্তদানের রেকর্ড ও হিস্ট্রি</div>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                  JSON
                </span>
              </button>

              {/* Deactivate / Delete Account */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => notify('নিরাপত্তা নিশ্চিত করতে অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-700 hover:bg-rose-100 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="text-xs font-bold text-rose-800">অ্যাকাউন্ট নিষ্ক্রিয় বা মুছে ফেলুন</div>
                      <div className="text-[10px] text-rose-600">৩০ দিনের মধ্যে পুনরুদ্ধার সম্ভব</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between transition-colors ${
          activeDark ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-100'
        }`}>
          <span className={`text-[11px] ${activeDark ? 'text-gray-400' : 'text-gray-500'}`}>
            পরিবর্তনসমূহ স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়
          </span>
          <button
            onClick={() => {
              notify('সকল সেটিংস সংরক্ষিত হয়েছে');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            সম্পন্ন করুন
          </button>
        </div>

      </div>
    </div>
  );
};

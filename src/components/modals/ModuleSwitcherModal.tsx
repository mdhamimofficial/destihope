import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Droplet, 
  User, 
  Home, 
  MessageSquare, 
  PlaySquare, 
  Brain, 
  UserSearch, 
  ArrowLeftRight, 
  Settings, 
  Bell, 
  CreditCard, 
  Trash2, 
  HelpCircle, 
  BarChart2,
  Sparkles,
  Globe 
} from 'lucide-react';
import { ActiveModule, UserProfile } from '../../types';
import { currentUser as defaultUser } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface ModuleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (mod: ActiveModule) => void;
  activeModule: ActiveModule;
  currentUser?: UserProfile;
  dataSaverEnabled?: boolean;
  onToggleDataSaver?: () => void;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
  onShowHopePointsInfo?: () => void;
}

// 6 Core Modules definition precisely matching user's DestiHub image
const DESTI_MODULES = [
  {
    id: 'hope' as ActiveModule,
    title: 'DestiHope',
    subtitle: 'Community',
    subtitleBn: 'কমিউনিটি',
    icon: Home,
    iconColor: 'text-[#E53935]',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50',
  },
  {
    id: 'care' as ActiveModule,
    title: 'DestiCare',
    subtitle: 'Health',
    subtitleBn: 'স্বাস্থ্য',
    icon: Droplet,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-950/50',
  },
  {
    id: 'chat' as ActiveModule,
    title: 'DestiChat',
    subtitle: 'Messaging',
    subtitleBn: 'মেসেজিং',
    icon: MessageSquare,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    id: 'media' as ActiveModule,
    title: 'DestiMedia',
    subtitle: 'Video & Reels',
    subtitleBn: 'ভিডিও ও রিলস',
    icon: PlaySquare,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    id: 'brain' as ActiveModule,
    title: 'DestiBrain',
    subtitle: 'Learning & AI',
    subtitleBn: 'লার্নিং ও এআই',
    icon: Brain,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
  },
  {
    id: 'find' as ActiveModule,
    title: 'DestiFind',
    subtitle: 'People & Search',
    subtitleBn: 'মানুষ ও সন্ধান',
    icon: UserSearch,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
];

export const ModuleSwitcherModal: React.FC<ModuleSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  activeModule,
  currentUser = defaultUser,
  dataSaverEnabled = false,
  onToggleDataSaver,
  onOpenSettings,
  onOpenNotifications,
  onShowHopePointsInfo,
}) => {
  const { l, language, toggleLanguage, isEn } = useLanguage();
  const [storageSize, setStorageSize] = useState('52.8 MB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLang = () => {
    toggleLanguage();
    const nextLang = language === 'bn' ? 'en' : 'bn';
    showToast(nextLang === 'en' ? 'Language switched to English' : 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে');
  };

  const handleClearStorage = () => {
    setStorageSize('0.0 MB');
    showToast(l('স্টোরেজ ও ক্যাশ সফলভাবে খালি করা হয়েছে!', 'Storage & cache space cleared successfully!'));
  };

  const currentModItem = DESTI_MODULES.find((m) => m.id === activeModule) || DESTI_MODULES[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] p-0 sm:p-4 overflow-hidden"
          onClick={onClose}
        >
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{toastMessage}</span>
            </div>
          )}

          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 w-full max-w-md max-h-[92vh] sm:max-h-[90vh] flex flex-col rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.25)] border-t sm:border border-gray-100 dark:border-slate-800 overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Sheet Drag Notch (Mobile) */}
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0 sm:hidden" />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-5 py-3 space-y-4">
              
              {/* ================= 1. DESTIHUB BRAND HEADER ================= */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  {/* Desti Red Leaf Emblem */}
                  <div className="w-11 h-11 rounded-2xl bg-[#E53935] flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        d="M20 4.5C12.5 4.5 4.5 9.5 4.5 20C15 20 20 12 20 4.5Z"
                        fill="currentColor"
                      />
                      <path
                        d="M4.5 20C8 16 12 13 17 11.5"
                        stroke="#B71C1C"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight flex items-center leading-none">
                      <span className="text-gray-950 dark:text-white">DESTI</span>
                      <span className="text-[#E53935] ml-0.5">HUB</span>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                      {isEn ? 'All of Desti, in one place' : 'এক প্ল্যাটফর্মে ডেস্টির সবকিছু'}
                    </p>
                  </div>
                </div>

                {/* Header Right Actions: Language Switcher + Close Button */}
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-destihub-modal-language"
                    onClick={handleToggleLang}
                    title={l('ভাষা পরিবর্তন (বাংলা / English)', 'Switch Language (Bangla / English)')}
                    className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-all cursor-pointer active:scale-95 group shadow-2xs"
                    aria-label={l('ভাষা পরিবর্তন (বাংলা / English)', 'Switch Language (Bangla / English)')}
                  >
                    <Globe className="w-5 h-5 stroke-[2]" />
                    <span className="absolute -top-0.5 -right-0.5 text-[8.5px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full uppercase leading-none shadow-xs">
                      {language === 'bn' ? 'বাং' : 'EN'}
                    </span>
                  </button>

                  {/* Close Button */}
                  <button
                    id="btn-destihub-close"
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
                    aria-label={l('বন্ধ করুন', 'Close')}
                  >
                    <X className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>
              </div>

              {/* ================= 2. USER PROFILE CARD ================= */}
              <div className="rounded-3xl p-3.5 bg-white dark:bg-slate-850 border border-gray-150 dark:border-slate-800 shadow-2xs space-y-3">
                {/* User Info Header */}
                <div 
                  onClick={() => {
                    onSelectModule('profile');
                    onClose();
                  }}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-bold text-base text-gray-900 dark:text-white truncate group-hover:text-red-600 transition-colors">
                        {currentUser.name || 'Tanvir Ahmed'}
                      </h2>
                      <p className="text-xs text-gray-400 font-normal">
                        @{currentUser.username || 'tanvir_ahmed'}
                      </p>
                      <div className="mt-1">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 dark:fill-emerald-900" />
                          <span>{isEn ? 'Active Member' : 'অ্যাক্টিভ মেম্বার'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </div>

              {/* ================= 3. DESTI ECOSYSTEM SECTION ================= */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-1 h-4.5 bg-[#E53935] rounded-full inline-block mr-2" />
                    <h3 className="font-bold text-base text-gray-950 dark:text-white">
                      {isEn ? 'Desti Ecosystem' : 'ডেস্টি ইকোসিস্টেম'}
                    </h3>
                  </div>

                  <button
                    onClick={() => showToast(l('Desti Ecosystem মডিউলসমূহ সম্পূর্ণ সক্রিয়', 'Desti Ecosystem modules are all active'))}
                    className="text-xs font-semibold text-[#E53935] hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{isEn ? 'View All' : 'সব দেখুন'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 6 Module Cards in 3x2 Grid (Centered layout matching image) */}
                <div className="grid grid-cols-3 gap-2.5">
                  {DESTI_MODULES.map((mod) => {
                    const isActive = mod.id === activeModule;
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.id}
                        id={`destihub-card-${mod.id}`}
                        onClick={() => {
                          onSelectModule(mod.id);
                          onClose();
                        }}
                        className={`p-3 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center text-center relative group ${
                          isActive
                            ? 'bg-white dark:bg-slate-800 border-2 border-rose-400 dark:border-rose-500 shadow-sm shadow-red-500/10'
                            : 'bg-white dark:bg-slate-850 border border-gray-150 dark:border-slate-800 hover:border-gray-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Centered Icon Container */}
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 ${mod.iconBg}`}
                        >
                          <Icon className={`w-5 h-5 ${mod.iconColor}`} />
                        </div>

                        {/* Title & Subtitle */}
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white leading-tight">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-normal truncate mt-0.5">
                          {isEn ? mod.subtitle : mod.subtitleBn}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Currently on Module Card */}
                <div 
                  onClick={() => {
                    const otherMods = DESTI_MODULES.filter((m) => m.id !== activeModule);
                    const next = otherMods[0];
                    if (next) {
                      onSelectModule(next.id);
                      onClose();
                    }
                  }}
                  className="rounded-2xl border border-pink-100/90 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-800/50 p-3 flex items-center justify-between cursor-pointer hover:bg-rose-50/70 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#E53935] flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="w-4 h-4 stroke-[2.3]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {isEn ? 'Currently on' : 'বর্তমান মডিউল:'} <strong className="text-[#E53935] font-bold">{currentModItem.title}</strong>
                      </p>
                      <p className="text-[11px] text-gray-400 font-normal truncate">
                        {isEn ? 'Switch to another module anytime' : 'যেকোনো সময় অন্য মডিউলে সুইচ করুন'}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </div>
              </div>

              {/* ================= 4. MY DESTI SECTION ================= */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-1 h-4.5 bg-[#E53935] rounded-full inline-block mr-2" />
                    <h3 className="font-bold text-base text-gray-950 dark:text-white">
                      {isEn ? 'My Desti' : 'মাই ডেস্টি'}
                    </h3>
                  </div>
                  <div className="flex items-center text-xs text-gray-400 font-medium">
                    <Settings className="w-3.5 h-3.5 mr-1" />
                    <span>{isEn ? 'Manage Your Experience' : 'আপনার অভিজ্ঞতা নিয়ন্ত্রণ করুন'}</span>
                  </div>
                </div>

                {/* Menu List Card with clean dividers */}
                <div className="bg-white dark:bg-slate-850 border border-gray-150 dark:border-slate-800 rounded-3xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-800 shadow-2xs">
                  {/* 1. Settings & Privacy */}
                  <div
                    onClick={() => {
                      if (onOpenSettings) onOpenSettings();
                      else showToast(l('সেটিংস ওপেন করা হচ্ছে...', 'Opening Settings...'));
                    }}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Settings className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Settings & Privacy' : 'সেটিংস ও প্রাইভেসী'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* 2. Notifications */}
                  <div
                    onClick={() => {
                      if (onOpenNotifications) onOpenNotifications();
                      else showToast(l('নোটিফিকেশন ওপেন করা হচ্ছে...', 'Opening Notifications...'));
                    }}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Bell className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Notifications' : 'নোটিফিকেশনস'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* 3. Account & Profile */}
                  <div
                    onClick={() => {
                      onSelectModule('profile');
                      onClose();
                    }}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <User className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Account & Profile' : 'অ্যাকাউন্ট ও প্রোফাইল'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* 4. Payments & Donation */}
                  <div
                    onClick={() => {
                      if (onShowHopePointsInfo) onShowHopePointsInfo();
                      else showToast(l('হোপ পয়েন্ট ও ডোনেশন ইতিহাস সক্রিয়', 'Hope Points & donation history is active'));
                    }}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <CreditCard className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Payments & Donation' : 'পেমেন্ট ও ডোনেশন'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  {/* 5. Data Saver */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <BarChart2 className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                        {isEn ? 'Data Saver' : 'ডাটা সেভার'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onToggleDataSaver) onToggleDataSaver();
                        else showToast(l(`ডাটা সেভার: ${!dataSaverEnabled ? 'চালু' : 'বন্ধ'}`, `Data Saver: ${!dataSaverEnabled ? 'ON' : 'OFF'}`));
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5 shrink-0 ${
                        dataSaverEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-700'
                      }`}
                      aria-label="Toggle Data Saver"
                    >
                      <span
                        className={`w-5 h-5 bg-white rounded-full transition-transform shadow-xs ${
                          dataSaverEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 6. Storage & Clear Space */}
                  <div
                    onClick={handleClearStorage}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Trash2 className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Storage & Clear Space' : 'স্টোরেজ ও ক্লিয়ার স্পেস'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 font-mono text-xs">
                      <span>{storageSize}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* 7. Help & Support */}
                  <div
                    onClick={() => showToast(l('DestiHelp সাপোর্ট সার্বক্ষণিক ২৪/৭ প্রস্তুত', 'DestiHelp support is active 24/7'))}
                    className="p-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <HelpCircle className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-red-600 transition-colors">
                        {isEn ? 'Help & Support' : 'সাহায্য ও সাপোর্ট'}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </div>

              {/* ================= 5. BOTTOM BRAND BANNER ================= */}
              <div className="relative rounded-2xl p-4 bg-gradient-to-r from-rose-100/80 via-pink-50/70 to-rose-100/60 dark:from-slate-800 dark:via-rose-950/20 dark:to-slate-800 border border-pink-100/90 dark:border-slate-800 overflow-hidden flex items-center justify-between">
                {/* Abstract wavy gradient ribbon graphic on left */}
                <div className="absolute left-0 bottom-0 top-0 w-32 opacity-40 pointer-events-none">
                  <svg viewBox="0 0 100 80" fill="none" className="w-full h-full object-cover">
                    <path d="M0,80 Q30,20 60,50 T100,0 L0,0 Z" fill="#F43F5E" opacity="0.3" />
                    <path d="M0,80 Q40,40 70,60 T100,30 L0,80 Z" fill="#E11D48" opacity="0.5" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <h4 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">
                    DestiHub
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    People • Purpose • Possibility
                  </p>
                </div>

                {/* Cursive red script in bottom right matching image */}
                <div className="relative z-10 text-right select-none pointer-events-none pr-1">
                  <span className="font-['Caveat',cursive] text-[#E53935] text-lg sm:text-xl font-bold rotate-[-6deg] tracking-wide inline-block leading-tight text-right drop-shadow-2xs">
                    A Better<br />Bangladesh Together
                  </span>
                </div>
              </div>

              {/* ================= 6. FOOTER LINKS ================= */}
              <div className="flex items-center justify-between pt-2 pb-1 text-xs text-gray-400 font-medium px-1">
                <div className="flex items-center space-x-2.5">
                  <button 
                    onClick={() => showToast(l('শর্তাবলী ও নীতিমালা', 'Terms of Service'))} 
                    className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    Terms
                  </button>
                  <span>|</span>
                  <button 
                    onClick={() => showToast(l('গোপনীয়তা নীতিমালা', 'Privacy Policy'))} 
                    className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    Privacy
                  </button>
                  <span>|</span>
                  <button 
                    onClick={() => showToast(l('ডেস্টি সম্পর্কে জানুন', 'About Desti Ecosystem'))} 
                    className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    About Desti
                  </button>
                </div>
                <div className="text-gray-400">
                  Version 1.0.0
                </div>
              </div>

              <div className="h-2" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

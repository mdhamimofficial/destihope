import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  WifiOff, 
  CheckCircle, 
  ArrowLeft,
  Phone,
  FileText,
  Droplet,
  Heart,
  Clock,
  AlertCircle,
  Edit3,
  ChevronRight,
  Check,
  Sparkles,
  MapPin,
  Search,
  Brain,
  Video,
  MessageSquare,
  Bell,
  ExternalLink,
  Calendar,
  Share2,
  Lock
} from 'lucide-react';
import { UserProfile, DonorWillingnessStatus, ActiveModule } from '../../types';
import { ManageDonorStatusModal } from '../modals/ManageDonorStatusModal';
import { useLanguage } from '../../context/LanguageContext';

interface DestiProfileViewProps {
  user: UserProfile;
  onUpdateUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
  dataSaverEnabled: boolean;
  onToggleDataSaver: () => void;
  onShowHopePointsInfo: () => void;
  onBackToHome: () => void;
  onNavigateModule?: (module: 'hope' | 'care' | 'find' | 'brain' | 'chat' | 'media' | 'profile') => void;
  onSelectModule?: (mod: ActiveModule) => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
}

export const DestiProfileView: React.FC<DestiProfileViewProps> = ({
  user,
  onUpdateUser,
  dataSaverEnabled,
  onToggleDataSaver,
  onShowHopePointsInfo,
  onBackToHome,
  onNavigateModule,
  onSelectModule,
  activeSubTab = 'overview',
  onSelectSubTab
}) => {
  const { l, isEn } = useLanguage();
  // Donor Willingness local state with localStorage fallback & sync
  const [donorWillingness, setDonorWillingness] = useState<DonorWillingnessStatus>(() => {
    try {
      const saved = localStorage.getItem('desticare_user_donor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.willingness) return parsed.willingness;
      }
    } catch (e) {
      // ignore
    }
    return user.donorWillingness || (user.isDonorAvailable ? 'available' : 'available');
  });

  const [availableMonths, setAvailableMonths] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('desticare_user_donor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.months) return parsed.months;
      }
    } catch (e) {
      // ignore
    }
    return user.availableAfterMonths || 2;
  });

  const [dateNote, setDateNote] = useState<string>(() => {
    return user.availableDateNote || '২ মাস পর প্রস্তুত (নভেম্বর ২০২৬)';
  });

  // Active module profile inside 'modules' tab: 'care' | 'find' | 'brain' | 'media' | 'chat'
  const [activeModuleProfile, setActiveModuleProfile] = useState<'care' | 'find' | 'brain' | 'media' | 'chat'>('care');
  
  // Modal for managing full donor status
  const [isManageDonorModalOpen, setIsManageDonorModalOpen] = useState(false);

  // General settings state
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [smsFallback, setSmsFallback] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState(user.phone || '01811-223344');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Status feedback toast
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2800);
  };

  useEffect(() => {
    if (activeSubTab === 'back_home') {
      onBackToHome();
    }
  }, [activeSubTab, onBackToHome]);

  // Synchronize when user prop changes from external
  useEffect(() => {
    if (user.donorWillingness) {
      setDonorWillingness(user.donorWillingness);
    }
    if (user.availableAfterMonths) {
      setAvailableMonths(user.availableAfterMonths);
    }
    if (user.availableDateNote) {
      setDateNote(user.availableDateNote);
    }
  }, [user.donorWillingness, user.availableAfterMonths, user.availableDateNote]);

  // Future month calculation
  const calculateFutureMonthNote = (m: number) => {
    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const banglaNumerals: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    const toBanglaNum = (num: number) => num.toString().split('').map(d => banglaNumerals[d] || d).join('');
    
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + m);
    const mName = banglaMonths[targetDate.getMonth()];
    const yNum = toBanglaNum(targetDate.getFullYear());
    return `${toBanglaNum(m)} {l('মাস পর প্রস্তুত', 'Available after months')} (${mName} ${yNum})`;
  };

  // Handle 1-tap change of willingness
  const handleSetWillingness = (status: DonorWillingnessStatus, customMonths?: number) => {
    const months = customMonths !== undefined ? customMonths : availableMonths;
    let newDateNote = '';
    
    if (status === 'after_months') {
      newDateNote = calculateFutureMonthNote(months);
      setDateNote(newDateNote);
    }

    setDonorWillingness(status);
    if (customMonths !== undefined) {
      setAvailableMonths(customMonths);
    }

    const isAvailable = status === 'available';

    // Sync with localStorage so DestiCareView gets it instantly
    const profileSync = {
      willingness: status,
      months: months,
      availableDateNote: newDateNote,
      bloodGroup: user.bloodGroup,
      district: user.district,
      upazila: user.area || 'ধানমন্ডি',
      phone: user.phone
    };

    try {
      localStorage.setItem('desticare_user_donor_profile', JSON.stringify(profileSync));
    } catch (e) {
      // ignore
    }

    // Call onUpdateUser to update global currentUser state
    if (onUpdateUser) {
      onUpdateUser(prev => ({
        ...prev,
        isDonorAvailable: isAvailable,
        donorWillingness: status,
        availableAfterMonths: months,
        availableDateNote: newDateNote,
        moduleProfiles: {
          ...prev.moduleProfiles,
          care: {
            ...prev.moduleProfiles?.care,
            donorWillingness: status,
            availableAfterMonths: months,
            availableDateNote: newDateNote,
            bloodGroup: prev.bloodGroup,
            totalDonations: prev.stats?.donations ?? 8,
            lastDonationDate: '১ মাস আগে',
            district: prev.district,
            area: prev.area || 'ধানমন্ডি',
            phone: prev.phone,
            emergencyAlertEnabled: emergencyAlertsEnabled
          }
        }
      }));
    }

    if (status === 'available') {
      showFeedback(l('জরুরি রক্তদানের স্ট্যাটাস: "ইচ্ছুক ও প্রস্তুত" হিসেবে সেভ করা হয়েছে 🩸', 'Blood donor status saved: "Ready & Available" 🩸'));
    } else if (status === 'after_months') {
      showFeedback(l(`স্ট্যাটাস আপডেট: ${newDateNote} হিসেবে সেট করা হয়েছে ⏳`, `Status update: Set to ${newDateNote} ⏳`));
    } else {
      showFeedback(l('জরুরি রক্তদানের স্ট্যাটাস: "আপাতত বন্ধ" করা হয়েছে 🔒', 'Blood donor status: Set to "Currently Unavailable" 🔒'));
    }
  };

  const donationsCount = user.stats?.donations ?? user.totalDonations ?? 8;

  const badges = [
    { name: 'Blood Hero', desc: `${donationsCount} বার সফল রক্তদান`, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { name: 'Life Saver', desc: 'জরুরি রক্তের আবেদনে দ্রুত সাড়া', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Rescue Radar', desc: 'নিখোঁজ কেস সন্ধান সহায়তা', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Knowledge Master', desc: 'এআই হেলথ কুইজে শীর্ষ ১০%', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  ];

  return (
    <div className="bg-gray-50 flex-1 flex flex-col min-h-screen pb-24 relative font-sans">
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-100 p-2.5 sm:p-3.5 sticky top-0 z-20 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title={l('হোমে ফিরুন', 'Return to Home')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div 
            onClick={onBackToHome}
            className="cursor-pointer select-none"
          >
            <h2 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              DESTI<span className="text-slate-600">PROFILE</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">{l('ব্যক্তিগত ও মডিউল প্রোফাইল সেটিংস', 'Personal & Module Profile Settings')}</p>
          </div>
        </div>

        <button
          onClick={onShowHopePointsInfo}
          className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black rounded-full flex items-center gap-1 shadow-2xs hover:bg-amber-100 transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{user.hopePoints} HP</span>
        </button>
      </div>

      {/* Primary Sub-tab Switcher */}
      <div className="flex items-center px-3 py-2 space-x-1.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar sticky top-[53px] z-10 shadow-2xs">
        {[
          { id: 'overview', label: l('👤 সাধারণ পরিচিতি', '👤 Overview') },
          { id: 'modules', label: l('🗂️ মডিউল প্রোফাইল', '🗂️ Modules') },
          { id: 'badges', label: l('🏆 হোপ পয়েন্ট ও ব্যাজ', '🏆 Badges & Points') },
          { id: 'security', label: l('🔒 এসওএস ও নিরাপত্তা', '🔒 Security') },
          { id: 'back_home', label: l('🏠 হোমে ফিরুন', '🏠 Home') }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab && onSelectSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= 1. OVERVIEW TAB ================= */}
      {activeSubTab === 'overview' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* User ID Hero Card */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-2xs flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-2xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                <CheckCircle className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-gray-900 truncate">{user.name}</h3>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  {user.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{user.phone}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {user.area ? `${user.area}, ${user.district}` : user.district}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 text-center shadow-2xs">
              <span className="text-lg font-black text-rose-600 block">
                {donationsCount}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">{l('রক্তদান সংখ্যা', 'Total Donations')}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200 text-center shadow-2xs">
              <span className="text-lg font-black text-amber-600 block">{user.hopePoints}</span>
              <span className="text-[10px] text-gray-500 font-semibold">{l('হোপ পয়েন্ট', 'Hope Points')}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-gray-200 text-center shadow-2xs">
              <span className="text-lg font-black text-emerald-600 block">{l('লেভেল ২', 'Level 2')}</span>
              <span className="text-[10px] text-gray-500 font-semibold">{l('কমিউনিটি র‍্যাংক', 'Community Rank')}</span>
            </div>
          </div>

          {/* ================= HIGHLIGHTED: DESTICARE DONOR WILLINGNESS STATUS CARD ================= */}
          <div className="bg-white p-4 rounded-3xl border-2 border-rose-100 shadow-2xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full opacity-60 pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shadow-2xs">
                  <Heart className="w-4 h-4 fill-rose-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    {l('DestiCare রক্তদান ইচ্ছুকতার স্ট্যাটাস', 'DestiCare Blood Donor Willingness')}
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    {l('রক্তের প্রয়োজনে রোগীরা আপনার লোকেশন দেখে যোগাযোগ করতে পারবে', 'Patients in urgent need can find and contact you')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsManageDonorModalOpen(true)}
                className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3 h-3" />
                <span>সম্পাদনা</span>
              </button>
            </div>

            {/* Current Active Status Indicator */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    donorWillingness === 'available' ? 'bg-emerald-400' :
                    donorWillingness === 'after_months' ? 'bg-amber-400' : 'bg-gray-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    donorWillingness === 'available' ? 'bg-emerald-500' :
                    donorWillingness === 'after_months' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                </span>
                <div>
                  <span className="text-xs font-black text-gray-900 block">
                    {donorWillingness === 'available' && '🟢 রক্ত দিতে ইচ্ছুক (এখনই প্রস্তুত)'}
                    {donorWillingness === 'after_months' && `🟡 ${dateNote || `${availableMonths} {l('মাস পর প্রস্তুত', 'Available after months')}`}`}
                    {donorWillingness === 'unavailable' && '⚪ আপাতত রক্ত দিতে ইচ্ছুক নই'}
                  </span>
                  <span className="text-[10px] text-gray-500 block">
                    গ্রুপ: <strong className="text-rose-600">{user.bloodGroup}</strong> | এলাকা: {user.area || 'ধানমন্ডি'}, {user.district}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Quick 1-Tap Selectors */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => handleSetWillingness('available')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center text-center ${
                  donorWillingness === 'available'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-2xs font-black'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs mb-0.5">🟢</span>
                <span>রক্ত দিতে ইচ্ছুক</span>
              </button>

              <button
                onClick={() => handleSetWillingness('after_months')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center text-center ${
                  donorWillingness === 'after_months'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-2xs font-black'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs mb-0.5">⏳</span>
                <span>কয়েক মাস পর</span>
              </button>

              <button
                onClick={() => handleSetWillingness('unavailable')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center text-center ${
                  donorWillingness === 'unavailable'
                    ? 'bg-gray-100 border-gray-400 text-gray-800 shadow-2xs font-black'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs mb-0.5">⚪</span>
                <span>{l('আপাতত বন্ধ', 'Currently Unavailable')}</span>
              </button>
            </div>

            {/* If after_months is active, show months selector chips */}
            {donorWillingness === 'after_months' && (
              <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-900">কত মাস পর রক্ত দিতে পারবেন?</span>
                  <span className="text-amber-700 font-bold">{dateNote}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 6].map((m) => {
                    const isMActive = availableMonths === m;
                    const bNums: Record<number, string> = { 1: '১', 2: '২', 3: '৩', 4: '৪', 6: '৬' };
                    return (
                      <button
                        key={m}
                        onClick={() => handleSetWillingness('after_months', m)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                          isMActive
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-white text-amber-900 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {bNums[m]} মাস
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab('modules');
                  setActiveModuleProfile('care');
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>সম্পূর্ণ DestiCare মডিউল প্রোফাইল দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('care')}
                  className="text-[11px] font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                  <span>ব্লাড ব্যাংক</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Profiles Quick Access Card */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                আপনার মডিউল প্রোফাইলসমূহ
              </h4>
              <button
                onClick={() => onSelectSubTab && onSelectSubTab('modules')}
                className="text-[11px] font-bold text-slate-900 bg-gray-100 px-2.5 py-1 rounded-xl hover:bg-gray-200"
              >
                সবগুলো দেখুন
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab('modules');
                  setActiveModuleProfile('care');
                }}
                className="p-2.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-left hover:bg-rose-50 transition-colors flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 block truncate">DestiCare</span>
                  <span className="text-[10px] text-rose-600 block font-semibold">
                    {donorWillingness === 'available' ? l('🟢 ইচ্ছুক', '🟢 Ready') : donorWillingness === 'after_months' ? l('🟡 কয়েক মাস পর', '🟡 In Months') : l('⚪ আপাতত বন্ধ', '⚪ Unavailable')}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab('modules');
                  setActiveModuleProfile('find');
                }}
                className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-left hover:bg-emerald-50 transition-colors flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 block truncate">DestiFind</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">🟢 রেসকিউ ভলান্টিয়ার</span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab('modules');
                  setActiveModuleProfile('brain');
                }}
                className="p-2.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-left hover:bg-indigo-50 transition-colors flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 block truncate">DestiBrain</span>
                  <span className="text-[10px] text-indigo-700 block font-semibold">নলেজ চ্যাম্পিয়ন (লেভেল ৩)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab('modules');
                  setActiveModuleProfile('media');
                }}
                className="p-2.5 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-left hover:bg-purple-50 transition-colors flex items-center space-x-2"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 block truncate">DestiMedia</span>
                  <span className="text-[10px] text-purple-700 block font-semibold">কমিউনিটি রিপোর্টার</span>
                </div>
              </button>
            </div>
          </div>

          {/* Emergency Digital Health Passport */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-3xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-400" />
                ডিজিটাল হেলথ পাসপোর্ট
              </h4>
              <p className="text-[10px] text-gray-300">
                জরুরি প্রয়োজনে সাথে রাখার জন্য মেডিকেল আইডি কার্ড ডাউনলোড করুন
              </p>
            </div>
            <button
              onClick={() => showFeedback('আপনার ডিজিটাল হেলথ পাসপোর্ট প্রস্তুত ও ডাউনলোড করা হয়েছে!')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 active:scale-95 transition-transform shadow-sm"
            >
              ডাউনলোড
            </button>
          </div>
        </div>
      )}

      {/* ================= 2. MODULE PROFILES TAB ================= */}
      {activeSubTab === 'modules' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Module Selector Pill Bar */}
          <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'care', label: '🩸 Donator Account (ডোনার)', title: 'মূল ডোনার একাউন্ট' },
              { id: 'find', label: '🔍 DestiFind', title: 'নিখোঁজ অনুসন্ধান' },
              { id: 'brain', label: '🧠 DestiBrain', title: 'এআই স্বাস্থ্য শিক্ষা' },
              { id: 'media', label: '📰 DestiMedia', title: 'জরুরি ব্রডকাস্ট' },
              { id: 'chat', label: '💬 DestiChat', title: 'কমিউনিটি সহায়তা' }
            ].map((m) => {
              const isActive = activeModuleProfile === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModuleProfile(m.id as any)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-center ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* ---------------- 2.1 DESTICARE MODULE PROFILE ---------------- */}
          {activeModuleProfile === 'care' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Module Header Card - Donator Account */}
              <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full pointer-events-none" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                      Desti Hope • Donator Account (মূল ডোনার অ্যাকাউন্ট)
                    </span>
                    <h3 className="text-xl font-black mt-1">ডোনার অ্যাকাউন্ট প্রোফাইল</h3>
                    <p className="text-xs text-rose-100">
                      আপনার রক্তের গ্রুপ <strong className="text-white underline">{user.bloodGroup}</strong> এবং এলাকা <strong className="text-white underline">{user.area || 'ধানমন্ডি'}, {user.district}</strong>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30 backdrop-blur-xs">
                    <Droplet className="w-6 h-6 fill-white" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-center">
                  <div>
                    <span className="text-base font-black">{donationsCount} বার</span>
                    <span className="text-[10px] text-rose-100 block">মোট রক্তদান</span>
                  </div>
                  <div>
                    <span className="text-base font-black">১ মাস আগে</span>
                    <span className="text-[10px] text-rose-100 block">শেষ রক্তদান</span>
                  </div>
                  <div>
                    <span className="text-base font-black">১০০% ভেরিফাইড</span>
                    <span className="text-[10px] text-rose-100 block">ডোনার ট্রাস্ট</span>
                  </div>
                </div>
              </div>

              {/* WILLINGNESS SELECTION & DETAILED CONTROLS */}
              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                      রক্তদানে ইচ্ছুকতার অবস্থা (Willingness Status)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      জরুরি প্রয়োজনে রোগীরা আপনাকে ফোন করতে পারবে কি না নির্ধারণ করুন
                    </p>
                  </div>

                  <button
                    onClick={() => setIsManageDonorModalOpen(true)}
                    className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এডিট করুন</span>
                  </button>
                </div>

                {/* Option 1: Available */}
                <div 
                  onClick={() => handleSetWillingness('available')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                    donorWillingness === 'available'
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 shrink-0 ${
                    donorWillingness === 'available'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {donorWillingness === 'available' && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-gray-900">🟢 রক্ত দিতে ইচ্ছুক (এখনই প্রস্তুত)</h5>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        সক্রিয় ডোনার
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      নিকটস্থ জরুরি রক্তের আবেদনে আপনি সাড়া দিতে পারবেন এবং সার্চ তালিকায় সবার উপরে প্রদর্শন করা হবে।
                    </p>
                  </div>
                </div>

                {/* Option 2: After Months */}
                <div 
                  onClick={() => handleSetWillingness('after_months')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col space-y-2.5 ${
                    donorWillingness === 'after_months'
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 shrink-0 ${
                      donorWillingness === 'after_months'
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {donorWillingness === 'after_months' && <Check className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-gray-900">🟡 কয়েক মাস পর রক্ত দিতে পারব</h5>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          সাময়িক বিরতি
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                        সম্প্রতি রক্ত দিয়েছেন বা সাময়িক অসুস্থ? মাস নির্বাচন করুন, সময় শেষ হলে স্বয়ংক্রিয়ভাবে পুনরায় সক্রিয় হবেন।
                      </p>
                    </div>
                  </div>

                  {/* Interactive Month Picker when selected */}
                  {donorWillingness === 'after_months' && (
                    <div className="pl-8 pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          মাস নির্বাচন করুন:
                        </span>
                        <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          {dateNote}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[1, 2, 3, 4, 6].map((m) => {
                          const isMActive = availableMonths === m;
                          const bNums: Record<number, string> = { 1: '১', 2: '২', 3: '৩', 4: '৪', 6: '৬' };
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetWillingness('after_months', m);
                              }}
                              className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                                isMActive
                                  ? 'bg-amber-600 text-white shadow-2xs font-black'
                                  : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                              }`}
                            >
                              {bNums[m]} মাস
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 3: Unavailable */}
                <div 
                  onClick={() => handleSetWillingness('unavailable')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3 ${
                    donorWillingness === 'unavailable'
                      ? 'border-gray-500 bg-gray-50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 shrink-0 ${
                    donorWillingness === 'unavailable'
                      ? 'border-gray-600 bg-gray-600 text-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {donorWillingness === 'unavailable' && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-gray-900">⚪ আপাতত রক্ত দিতে ইচ্ছুক নই</h5>
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                        নিষ্ক্রিয়
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      ব্যক্তিগত বা স্বাস্থ্যগত কারণে বর্তমানে রক্তদানে অপারগ। সার্চ তালিকা থেকে যোগাযোগ তথ্য লুকানো থাকবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Donor Smart Card Preview - Only for users who have donated at least once */}
              {donationsCount >= 1 ? (
                <div className="bg-slate-900 text-white rounded-3xl p-4 border border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-30" 
                    style={{
                      backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(244, 63, 94, 0.2) 0%, transparent 60%)'
                    }}
                  />
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
                      <span className="text-xs font-black tracking-wider text-rose-400">
                        DESTI-CARE DIGITAL DONOR CARD
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      ভেরিফাইড ডোনার
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">{user.name}</h4>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{user.phone}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        লোকেশন: {user.area || 'ধানমন্ডি'}, {user.district}
                      </p>
                    </div>

                    <div className="text-center bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                      <span className="text-xl font-black text-rose-400 block">{user.bloodGroup}</span>
                      <span className="text-[9px] text-slate-300 uppercase tracking-widest block font-bold">গ্রুপ</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">মোট রক্তদান:</span>
                      <span className="font-bold text-white">{donationsCount} বার</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">স্ট্যাটাস:</span>
                      <span className="font-bold text-emerald-400">
                        {donorWillingness === 'available' ? '🟢 প্রস্তুত' : donorWillingness === 'after_months' ? `🟡 ${dateNote}` : '⚪ বন্ধ'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-4 border border-slate-700/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black tracking-wider text-slate-200">
                        ডিজিটাল স্মার্ট ডোনার কার্ড (লকড)
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-medium">
                      ১টি রক্তদান প্রয়োজন
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    স্মার্ট ডোনার আইডি কার্ডটি পেতে অন্তত <strong>১ বার</strong> রক্তদান সম্পন্ন করতে হবে। রক্তদান করলেই স্বয়ংক্রিয়ভাবে আপনার ডিজিটাল ডোনার আইডি সক্রিয় হবে।
                  </p>
                  <div className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs border border-slate-700">
                    <span className="text-slate-400">অগ্রগতি:</span>
                    <span className="font-bold text-amber-400">০ / ১ রক্তদান সম্পন্ন (০%)</span>
                  </div>
                </div>
              )}

              {/* Notifications Toggle */}
              <div className="bg-white p-4 rounded-3xl border border-gray-200 flex items-center justify-between shadow-2xs">
                <div className="space-y-0.5 pr-2">
                  <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-rose-600" />
                    জরুরি রক্তের পুশ নোটিফিকেশন
                  </h5>
                  <p className="text-[11px] text-gray-500">
                    আপনার এলাকায় {user.bloodGroup} রক্তের আবেদন আসলে সাথে সাথে সতর্কবার্তা পাঠাবে।
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEmergencyAlertsEnabled(!emergencyAlertsEnabled);
                    showFeedback(`জরুরি রক্তের অ্যালার্ট: ${!emergencyAlertsEnabled ? 'চালু' : 'বন্ধ'} করা হয়েছে`);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                    emergencyAlertsEnabled ? 'bg-rose-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-md ${
                      emergencyAlertsEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Jump to DestiCare Module */}
              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('care')}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Droplet className="w-4 h-4" />
                  <span>DestiCare ব্লাড ব্যাংক ও ডোনার তালিকায় যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ---------------- 2.2 DESTIFIND MODULE PROFILE ---------------- */}
          {activeModuleProfile === 'find' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-3xl shadow-md space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                  DestiFind রেসকিউ ভলান্টিয়ার প্রোফাইল
                </span>
                <h3 className="text-xl font-black">নিখোঁজ সন্ধান ও রেসকিউ টিম</h3>
                <p className="text-xs text-emerald-100">
                  কমিউনিটি উদ্ধার অভিযানে আপনি একজন যাচাইকৃত ভলান্টিয়ার (Verified Rescuer)।
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div>
                    <span className="text-base font-black">৩টি</span>
                    <span className="text-[10px] text-emerald-200 block">উদ্ধারে সহায়তা</span>
                  </div>
                  <div>
                    <span className="text-base font-black">১৫ কিমি</span>
                    <span className="text-[10px] text-emerald-200 block">সার্চ রেডিয়াস</span>
                  </div>
                  <div>
                    <span className="text-base font-black">{l('লেভেল ২', 'Level 2')}</span>
                    <span className="text-[10px] text-emerald-200 block">রেসকিউ র‍্যাংক</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-gray-900">ভলান্টিয়ার সেটিংস ও দক্ষতা:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-2xl">
                    <span className="font-semibold text-gray-800">সার্চ রেডিয়াস কভারেজ:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">১৫ কিমি</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-2xl">
                    <span className="font-semibold text-gray-800">বিশেষ দক্ষতা:</span>
                    <span className="font-bold text-gray-700">প্রাথমিক চিকিৎসা, বাইকার</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-2xl">
                    <span className="font-semibold text-gray-800">জরুরি তল্লাশি নোটিফিকেশন:</span>
                    <span className="font-bold text-emerald-700">সক্রিয়</span>
                  </div>
                </div>
              </div>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('find')}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Search className="w-4 h-4" />
                  <span>DestiFind নিখোঁজ তালিকা ও মানচিত্রে যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ---------------- 2.3 DESTIBRAIN MODULE PROFILE ---------------- */}
          {activeModuleProfile === 'brain' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-5 rounded-3xl shadow-md space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                  DestiBrain এআই লার্নিং প্রোফাইল
                </span>
                <h3 className="text-xl font-black">নলেজ চ্যাম্পিয়ন (লেভেল ৩)</h3>
                <p className="text-xs text-indigo-100">
                  এআই স্বাস্থ্য কুইজ ও জরুরি ফার্স্ট-এইড নির্দেশিকায় শীর্ষ ১০% লার্নার।
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div>
                    <span className="text-base font-black">১৮টি</span>
                    <span className="text-[10px] text-indigo-200 block">কুইজ সম্পন্ন</span>
                  </div>
                  <div>
                    <span className="text-base font-black">৪২০</span>
                    <span className="text-[10px] text-indigo-200 block">নলেজ স্কোর</span>
                  </div>
                  <div>
                    <span className="text-base font-black">২৬টি</span>
                    <span className="text-[10px] text-indigo-200 block">এআই সেশন</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-black text-gray-900">অর্জন ও প্রিয় বিষয়:</h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold">
                    🩺 প্রাথমিক চিকিৎসা ও সিপিআর
                  </span>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                    🩸 রক্তদান ও নিরাপত্তা
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
                    💊 জরুরি ওষুধ নির্দেশিকা
                  </span>
                </div>
              </div>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('brain')}
                  className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Brain className="w-4 h-4" />
                  <span>DestiBrain এআই ও কুইজে যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ---------------- 2.4 DESTIMEDIA MODULE PROFILE ---------------- */}
          {activeModuleProfile === 'media' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-gradient-to-br from-purple-600 to-pink-700 text-white p-5 rounded-3xl shadow-md space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                  DestiMedia ব্রডকাস্ট প্রোফাইল
                </span>
                <h3 className="text-xl font-black">কমিউনিটি রিপোর্টার</h3>
                <p className="text-xs text-purple-100">
                  জরুরি সচেতনতামূলক ভিডিও এবং উদ্ধার আপডেট সম্প্রচারে সক্রিয় অবদানকারী।
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div>
                    <span className="text-base font-black">১২টি</span>
                    <span className="text-[10px] text-purple-200 block">পোস্ট/ভিডিও</span>
                  </div>
                  <div>
                    <span className="text-base font-black">৭টি</span>
                    <span className="text-[10px] text-purple-200 block">যাচাইকৃত রিপোর্ট</span>
                  </div>
                  <div>
                    <span className="text-base font-black">৯৪%</span>
                    <span className="text-[10px] text-purple-200 block">বিশ্বাসযোগ্যতা</span>
                  </div>
                </div>
              </div>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('media')}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Video className="w-4 h-4" />
                  <span>DestiMedia ভিডিও ফিডে যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ---------------- 2.5 DESTICHAT MODULE PROFILE ---------------- */}
          {activeModuleProfile === 'chat' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-800 text-white p-5 rounded-3xl shadow-md space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full inline-block">
                  DestiChat ভলান্টিয়ার প্রোফাইল
                </span>
                <h3 className="text-xl font-black">হেল্পলাইন ভলান্টিয়ার</h3>
                <p className="text-xs text-blue-100">
                  জরুরি বার্তায় সরাসরি সহায়তা প্রদানকারী ও কমিউনিটি মডারেটর।
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-center">
                  <div>
                    <span className="text-base font-black">২ মিনিট</span>
                    <span className="text-[10px] text-blue-200 block">গড় রেসপন্স</span>
                  </div>
                  <div>
                    <span className="text-base font-black">৩৪ জন</span>
                    <span className="text-[10px] text-blue-200 block">সাহায্যপ্রাপ্ত</span>
                  </div>
                  <div>
                    <span className="text-base font-black">৪.৯ ★</span>
                    <span className="text-[10px] text-blue-200 block">হেল্পার রেটিং</span>
                  </div>
                </div>
              </div>

              {onNavigateModule && (
                <button
                  onClick={() => onNavigateModule('chat')}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>DestiChat হেল্পলাইনে যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. BADGES & HOPE POINTS TAB ================= */}
      {activeSubTab === 'badges' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Hope Point Level Card */}
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                রেসকিউ হিরো টায়ার
              </span>
              <Award className="w-6 h-6 text-amber-200 animate-bounce" />
            </div>
            <div>
              <span className="text-2xl font-black">{user.hopePoints} HP</span>
              <p className="text-xs text-amber-100 mt-0.5">পরবর্তী টায়ার: গোল্ড চ্যাম্পিয়ন (৫০০ HP)</p>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div style={{ width: `${Math.min(100, (user.hopePoints / 500) * 100)}%` }} className="bg-white h-full rounded-full" />
            </div>
          </div>

          {/* Earned Badges Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 px-1">অর্জিত ব্যাজসমূহ:</h4>
            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((b, i) => (
                <div key={i} className={`p-3 rounded-2xl border ${b.color} space-y-1 shadow-2xs`}>
                  <div className="flex items-center space-x-1.5">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold">{b.name}</span>
                  </div>
                  <p className="text-[10px] opacity-85 leading-snug">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Point Earning Opportunities */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 space-y-2.5">
            <h4 className="text-xs font-bold text-gray-900">{l('হোপ পয়েন্ট', 'Hope Points')} অর্জনের সুযোগ:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span>🩸 রক্তদান সম্পন্ন করুন</span>
                <span className="font-bold text-amber-700">+১০০ HP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span>🔍 নিখোঁজ ব্যক্তির সঠিক অবস্থান তথ্য দিন</span>
                <span className="font-bold text-amber-700">+৫০ HP</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span>🧠 স্বাস্থ্য কুইজ ব্যাটল জয় করুন</span>
                <span className="font-bold text-amber-700">+১০ HP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. SECURITY & SOS TAB ================= */}
      {activeSubTab === 'security' && (
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {/* Emergency SOS Contact */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-rose-600" />
                জরুরি এসওএস নম্বর
              </h4>
              <button
                onClick={() => {
                  setIsEditingPhone(!isEditingPhone);
                  if (isEditingPhone) {
                    showFeedback('জরুরি এসওএস নম্বর সংরক্ষিত হয়েছে!');
                  }
                }}
                className="text-[11px] text-rose-600 font-bold"
              >
                {isEditingPhone ? 'সংরক্ষণ' : 'পরিবর্তন'}
              </button>
            </div>
            {isEditingPhone ? (
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmergencyPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-mono"
              />
            ) : (
              <p className="text-xs text-gray-700 font-mono bg-gray-50 p-2.5 rounded-xl">
                {emergencyPhone} (পিতা/অভিভাবক)
              </p>
            )}
            <p className="text-[10px] text-gray-400">
              জরুরি বিপদ সংকেত পাঠালে এই নম্বরে সরাসরি লোকেশন এসএমএস চলে যাবে।
            </p>
          </div>

          {/* Data Saver Offline Toggle */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5 pr-2">
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <WifiOff className="w-4 h-4 text-emerald-600" />
                ডাটা সেভার ও অফলাইন মোড
              </h4>
              <p className="text-[11px] text-gray-500">
                দুর্বল ইন্টারনেটে ভিডিও লোডিং বন্ধ রেখে টেক্সট ও এসএমএস ব্যাকআপ রাখবে।
              </p>
            </div>
            <button
              onClick={onToggleDataSaver}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                dataSaverEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-md ${
                  dataSaverEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* SMS Fallback Switch */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 flex items-center justify-between shadow-2xs">
            <div className="space-y-0.5 pr-2">
              <h4 className="text-xs font-bold text-gray-900">এসএমএস ফলব্যাক অ্যালার্ট</h4>
              <p className="text-[11px] text-gray-500">
                ইন্টারনেট সংযোগ না থাকলে রক্তের আবেদন সরাসরি টেলকো গেটওয়ে দিয়ে পাঠানো হবে।
              </p>
            </div>
            <button
              onClick={() => setSmsFallback(!smsFallback)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                smsFallback ? 'bg-slate-900' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-md ${
                  smsFallback ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Full Manage Donor Status Modal */}
      <ManageDonorStatusModal
        isOpen={isManageDonorModalOpen}
        onClose={() => setIsManageDonorModalOpen(false)}
        currentUser={{
          ...user,
          donorWillingness,
          availableAfterMonths: availableMonths,
          availableDateNote: dateNote
        }}
        onSave={(updatedProfile) => {
          if (updatedProfile.donorWillingness) {
            setDonorWillingness(updatedProfile.donorWillingness);
          }
          if (updatedProfile.availableAfterMonths) {
            setAvailableMonths(updatedProfile.availableAfterMonths);
          }
          if (updatedProfile.availableDateNote) {
            setDateNote(updatedProfile.availableDateNote);
          }

          const profileSync = {
            willingness: updatedProfile.donorWillingness ?? donorWillingness,
            months: updatedProfile.availableAfterMonths ?? availableMonths,
            availableDateNote: updatedProfile.availableDateNote ?? dateNote,
            bloodGroup: updatedProfile.bloodGroup ?? user.bloodGroup,
            district: updatedProfile.district ?? user.district,
            upazila: updatedProfile.area ?? user.area ?? 'ধানমন্ডি',
            phone: updatedProfile.phone ?? user.phone
          };

          try {
            localStorage.setItem('desticare_user_donor_profile', JSON.stringify(profileSync));
          } catch (e) {
            // ignore
          }

          if (onUpdateUser) {
            onUpdateUser(prev => ({
              ...prev,
              ...updatedProfile,
              moduleProfiles: {
                ...prev.moduleProfiles,
                care: {
                  ...prev.moduleProfiles?.care,
                  donorWillingness: updatedProfile.donorWillingness ?? donorWillingness,
                  availableAfterMonths: updatedProfile.availableAfterMonths ?? availableMonths,
                  availableDateNote: updatedProfile.availableDateNote ?? dateNote,
                  bloodGroup: updatedProfile.bloodGroup ?? prev.bloodGroup,
                  district: updatedProfile.district ?? prev.district,
                  area: updatedProfile.area ?? prev.area ?? 'ধানমন্ডি',
                  phone: updatedProfile.phone ?? prev.phone,
                  totalDonations: prev.stats?.donations ?? 8,
                  lastDonationDate: '১ মাস আগে',
                  emergencyAlertEnabled: emergencyAlertsEnabled
                }
              }
            }));
          }

          showFeedback('রক্তদাতা প্রোফাইল ও ইচ্ছুকতার তথ্য সফলভাবে আপডেট হয়েছে! 🎉');
        }}
      />
    </div>
  );
};

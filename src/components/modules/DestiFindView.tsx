import React, { useState } from 'react';
import { 
  Menu,
  Search, 
  Bell,
  UserSearch, 
  MapPin, 
  Calendar, 
  Phone, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Camera,
  Award,
  BadgeCheck,
  QrCode,
  Share2,
  HeartHandshake,
  Clock,
  Compass,
  Activity,
  AlertTriangle,
  ExternalLink,
  Check,
  Copy,
  Flame,
  User,
  Star,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { MissingCase, UserProfile, ActiveModule } from '../../types';
import { mockMissingCases } from '../../data/mockData';
import { getNextCaseId, peekNextCaseId, SUPPORTED_COUNTRIES } from '../../utils/caseIdGenerator';

export type SearchFilterType = 'name' | 'desti_id' | 'police_id';

export const SEARCH_FILTER_OPTIONS: { id: SearchFilterType; label: string; placeholder: string; icon: string }[] = [
  { id: 'name', label: 'নাম', placeholder: 'নিখোঁজ ব্যক্তির নাম দিয়ে খুঁজুন...', icon: '👤' },
  { id: 'desti_id', label: 'Desti Find ID', placeholder: 'Desti Find ID (যেমন: FIND-BD-8902)...', icon: '🆔' },
  { id: 'police_id', label: 'পুলিশ কেইস/জিডি', placeholder: 'পুলিশ কেইস বা জিডি আইডি (যেমন: GD-1284)...', icon: '👮' }
];

const getInitialDefaultFilter = (): SearchFilterType => {
  try {
    const saved = localStorage.getItem('destifind_search_default_filter');
    if (saved === 'name' || saved === 'desti_id' || saved === 'police_id') {
      return saved;
    }
  } catch (e) {}
  return 'name';
};

interface DestiFindViewProps {
  onOpenReportMissing?: () => void;
  onSelectCase?: (c: MissingCase) => void;
  onCallContact: (phone: string) => void;
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  currentUser?: UserProfile;
  onUpdateUser?: (user: UserProfile) => void;
}

export const DestiFindView: React.FC<DestiFindViewProps> = ({
  onCallContact,
  onOpenReportMissing,
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenMenu,
  onOpenNotifications,
  activeSubTab = 'cases',
  onSelectSubTab,
  currentUser,
  onUpdateUser
}) => {
  const [cases, setCases] = useState<MissingCase[]>(mockMissingCases);
  const [filterStatus] = useState<'all' | 'Searching' | 'Found'>('all');
  const [searchCaseQuery, setSearchCaseQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterSettingsOpen, setIsFilterSettingsOpen] = useState(true);

  // Search Filter State with persistence for user default choice
  const [defaultFilter, setDefaultFilter] = useState<SearchFilterType>(getInitialDefaultFilter);
  const [activeSearchFilter, setActiveSearchFilter] = useState<SearchFilterType>(getInitialDefaultFilter);
  const [filterSavedNotice, setFilterSavedNotice] = useState(false);

  const [radarRadius, setRadarRadius] = useState<number>(5);
  const [selectedCaseModal, setSelectedCaseModal] = useState<MissingCase | null>(null);

  // Rescuer Profile state
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [copiedBadgeId, setCopiedBadgeId] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // New report form state
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonAge, setNewPersonAge] = useState('');
  const [newPersonLocation, setNewPersonLocation] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');
  const [newPoliceCaseId, setNewPoliceCaseId] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('BD');
  const [lastGeneratedCaseId, setLastGeneratedCaseId] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleSetDefaultFilter = (filterId: SearchFilterType) => {
    setDefaultFilter(filterId);
    setActiveSearchFilter(filterId);
    try {
      localStorage.setItem('destifind_search_default_filter', filterId);
    } catch (e) {}
    setFilterSavedNotice(true);
    setTimeout(() => setFilterSavedNotice(false), 2400);
  };

  const filteredCases = cases.filter((c) => {
    if (activeSubTab === 'found') return c.status === 'Found';
    if (activeSubTab === 'cases') {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    }
    if (searchCaseQuery.trim()) {
      const q = searchCaseQuery.toLowerCase().trim();
      if (activeSearchFilter === 'name') {
        return (c.personName || '').toLowerCase().includes(q);
      }
      if (activeSearchFilter === 'desti_id') {
        return (c.caseId || '').toLowerCase().includes(q);
      }
      if (activeSearchFilter === 'police_id') {
        const policeMatch = (c.policeCaseId || '').toLowerCase().includes(q);
        const descMatch = (c.description || '').toLowerCase().includes(q);
        return policeMatch || descMatch;
      }
      // fallback
      const nameMatch = (c.personName || '').toLowerCase().includes(q);
      const caseIdMatch = (c.caseId || '').toLowerCase().includes(q);
      const districtMatch = (c.district || '').toLowerCase().includes(q);
      const policeMatch = (c.policeCaseId || '').toLowerCase().includes(q);
      return nameMatch || caseIdMatch || districtMatch || policeMatch;
    }
    return true;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    // Generate yearly sequential case ID (e.g. FIND-BD-0001)
    const generatedCaseId = getNextCaseId(selectedCountry);
    setLastGeneratedCaseId(generatedCaseId);

    const newCase: MissingCase = {
      id: `case-${Date.now()}`,
      caseId: generatedCaseId,
      personName: newPersonName,
      age: Number(newPersonAge) || 20,
      gender: 'অন্যান্য',
      lastSeenTime: 'আজ সকাল ১০:০০',
      lastSeenDate: 'আজ সকাল ১০:০০',
      lastSeenLocation: newPersonLocation || 'ঢাকা',
      district: 'ঢাকা',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      description: 'জরুরি সন্ধান চলছে। পরিবারের সাথে যোগাযোগ করুন।',
      guardianContact: newGuardianPhone || '01700-000000',
      contactPhone: newGuardianPhone || '01700-000000',
      status: 'Searching',
      policeCaseId: newPoliceCaseId.trim() || undefined,
      reportedDate: 'এইমাত্র'
    };

    setCases(prev => [newCase, ...prev]);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      if (onSelectSubTab) onSelectSubTab('cases');
    }, 2500);
  };

  return (
    <div className="bg-gray-50 flex-1 flex flex-col min-h-screen pb-20 relative">
      {/* Top Navigation Bar: Desti Hope Style 1st Row (DESTI in Black, FIND in Green) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 gap-1 sm:gap-2 w-full">
          {/* Left section: Hamburger Menu & Brand Logo */}
          <div className="flex items-center shrink-0">
            <button
              id="btn-hamburger-menu"
              onClick={onOpenMenu || onOpenModuleSwitcher}
              className="w-10 h-10 -ml-1 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-95 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => onSelectModule && onSelectModule('hope')}
              className="flex items-center tracking-tight px-1.5 py-1 cursor-pointer select-none -ml-0.5 active:opacity-80 transition-opacity"
            >
              <span className="font-black text-base sm:text-lg text-gray-950">DESTI</span>
              <span className="font-black text-base sm:text-lg text-emerald-600 ml-0.5">
                FIND
              </span>
            </div>
          </div>

          {/* Center: Post composer input pill (like Desti Hope) */}
          <div
            id="input-create-post-trigger"
            onClick={() => {
              if (onOpenReportMissing) {
                onOpenReportMissing();
              } else if (onSelectSubTab) {
                onSelectSubTab('report');
              }
            }}
            className="flex-1 min-w-0 flex items-center justify-between bg-white hover:bg-emerald-50/40 active:bg-emerald-50/70 border border-gray-200 hover:border-gray-300 active:border-gray-400 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-2xs cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium truncate">
              নিখোঁজ ব্যক্তির তথ্য পোস্ট করুন...
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                রিপোর্ট করুন
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 ml-1 transition-colors">
                <UserSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right section: Search and Notification Icons */}
          <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
            {/* Search Button */}
            <button
              id="btn-header-search"
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                if (isSearchOpen) {
                  setSearchCaseQuery('');
                }
              }}
              className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
                isSearchOpen
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            </button>

            {/* Notification Bell Button */}
            <button
              id="btn-header-notifications"
              onClick={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                }
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full relative transition-all active:scale-90 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
              <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-[#E53935] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none shadow-xs">
                1
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Input Bar with Filter Selector & Custom User Default Toggle (Shown when Search icon is clicked) */}
      {isSearchOpen && (
        <div className="p-3 bg-white border-b border-gray-100 animate-in fade-in slide-in-from-top-1 duration-150 space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex items-center bg-gray-100/90 rounded-full px-3.5 py-2.5 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-sm">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder={
                  SEARCH_FILTER_OPTIONS.find(f => f.id === activeSearchFilter)?.placeholder ||
                  "খুঁজুন..."
                }
                value={searchCaseQuery}
                onChange={(e) => setSearchCaseQuery(e.target.value)}
                className="w-full text-sm text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-500 min-w-0"
                autoFocus
              />
              {searchCaseQuery && (
                <button
                  type="button"
                  onClick={() => setSearchCaseQuery('')}
                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-gray-400 hover:bg-gray-500 text-white rounded-full ml-2 transition-colors cursor-pointer shrink-0"
                  title="মুছে ফেলুন"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
            <button 
              type="button"
              onClick={() => setIsFilterSettingsOpen(!isFilterSettingsOpen)}
              className={`p-1.5 sm:p-2 shrink-0 rounded-full transition-colors cursor-pointer ${isFilterSettingsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'}`}
              title="সার্চ ফিল্টার"
            >
              <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Filters Row */}
          {isFilterSettingsOpen && (
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 pt-0.5 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] text-gray-400 font-bold shrink-0">ফিল্টার:</span>
                {SEARCH_FILTER_OPTIONS.map((f) => {
                  const isSelected = activeSearchFilter === f.id;
                  const isDefault = defaultFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveSearchFilter(f.id)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{f.icon}</span>
                      <span>{f.label}</span>
                      {isDefault && (
                        <span className={`text-[8.5px] px-1 py-0.2 rounded font-black tracking-tight ${
                          isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          ডিফল্ট
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Set as Default Filter Button / Active Status */}
              <div className="flex items-center justify-end">
                {defaultFilter !== activeSearchFilter ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultFilter(activeSearchFilter)}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 cursor-pointer flex items-center space-x-1 transition-colors active:scale-95"
                    title="বর্তমান ফিল্টারটিকে আপনার স্থায়ী ডিফল্ট সার্চ ফিল্টার করুন"
                  >
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>'{SEARCH_FILTER_OPTIONS.find(f => f.id === activeSearchFilter)?.label}' ডিফল্ট করুন</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/80 px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>ডিফল্ট ফিল্টার সক্রিয়</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {filterSavedNotice && (
            <div className="py-1 px-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg text-center animate-in fade-in">
              ✓ '{SEARCH_FILTER_OPTIONS.find(f => f.id === defaultFilter)?.label}' সফলভাবে আপনার ডিফল্ট সার্চ ফিল্টার হিসেবে সেট করা হয়েছে!
            </div>
          )}
        </div>
      )}

      {/* ================= 1. MISSING CASES LIST ================= */}
      {activeSubTab === 'cases' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Cases Cards */}
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center text-gray-500 space-y-2 bg-white rounded-3xl m-3 border border-gray-200/80 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-gray-800">কোনো নিখোঁজ কেস পাওয়া যায়নি</p>
              <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                নাম, কেস আইডি বা জেলা সঠিকভাবে লিখেছেন কি না পরীক্ষা করে আবার চেষ্টা করুন।
              </p>
              {searchCaseQuery && (
                <button
                  onClick={() => setSearchCaseQuery('')}
                  className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer pt-1"
                >
                  সার্চ ক্লিয়ার করুন
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredCases.map((c) => {
              const isFound = c.status === 'Found';
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseModal(c)}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col transition-all active:scale-98 cursor-pointer group"
                >
                  <div className="flex p-3 gap-3">
                    <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60">
                      <img
                        src={c.photo}
                        alt={c.personName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-1.5 left-1.5 text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs ${
                        isFound
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white animate-pulse'
                      }`}>
                        {isFound ? 'উদ্ধারকৃত' : 'সন্ধান চলছে'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-gray-900 truncate">{c.personName}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">{c.caseId}</span>
                        </div>
                        {c.policeCaseId && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[9.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.2 rounded font-mono">
                              👮 কেইস/জিডি: {c.policeCaseId}
                            </span>
                          </div>
                        )}
                        <p className="text-[11px] text-gray-600 font-semibold mt-0.5">
                          বয়স: {c.age} বছর • {c.gender}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {c.lastSeenLocation}, {c.district}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                          নিখোঁজ: {c.lastSeenDate ?? c.lastSeenTime}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100">
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          {c.reportedDate}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCallContact(c.contactPhone ?? c.guardianContact);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-xs active:scale-95 transition-transform"
                        >
                          <Phone className="w-3 h-3" />
                          <span>কল করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* ================= 2. RESCUE RADAR TAB ================= */}
      {activeSubTab === 'radar' && (
        <div className="flex-1 p-4 flex flex-col space-y-4 overflow-y-auto">
          {/* Radar Controller Card */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="text-xs font-bold text-gray-900">কাছাকাছি নিখোঁজ অনুসন্ধান রাডার</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                জিপিএস সক্রিয়
              </span>
            </div>

            {/* Radius selector */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-600 font-semibold">অনুসন্ধান ব্যাসার্ধ:</span>
              <div className="flex space-x-1.5">
                {[1, 3, 5, 10].map((km) => (
                  <button
                    key={km}
                    onClick={() => setRadarRadius(km)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      radarRadius === km
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {km} কিমি
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Animated Radar Visual Display */}
          <div className="relative aspect-square max-h-[300px] w-full mx-auto rounded-3xl bg-slate-950 border border-emerald-900/60 overflow-hidden flex items-center justify-center shadow-xl">
            {/* Concentric Radar Rings */}
            <div className="absolute w-64 h-64 rounded-full border border-emerald-500/20" />
            <div className="absolute w-44 h-44 rounded-full border border-emerald-500/30" />
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/40" />
            <div className="absolute w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-400 animate-ping" />

            {/* Center Pulse Dot (User Location) */}
            <div className="relative z-10 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400" />

            {/* Simulated Radar Ping Blips */}
            <div className="absolute top-16 left-20 z-10 flex flex-col items-center group cursor-pointer">
              <div className="w-8 h-8 rounded-full border-2 border-red-500 bg-red-600/30 p-0.5 overflow-hidden animate-bounce">
                <img src={mockMissingCases[0]?.photo} alt="blip" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-red-300 bg-black/80 px-1 rounded mt-0.5">
                {mockMissingCases[0]?.personName}
              </span>
            </div>

            <div className="absolute bottom-16 right-16 z-10 flex flex-col items-center group cursor-pointer">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-500/30 p-0.5 overflow-hidden">
                <img src={mockMissingCases[1]?.photo} alt="blip" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-amber-200 bg-black/80 px-1 rounded mt-0.5">
                {mockMissingCases[1]?.personName}
              </span>
            </div>

            {/* Sweeping Radar Scanner Line */}
            <div 
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.25)_0deg,transparent_60deg)] animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              আপনার এলাকায় ২ জন নিখোঁজ ব্যক্তির রিপোর্ট রয়েছে
            </span>
            <p className="text-[11px] text-emerald-800">
              কাউকে শনাক্ত করতে পারলে তাৎক্ষণিক স্বজন বা পুলিশকে অবহিত করুন।
            </p>
          </div>
        </div>
      )}

      {/* ================= 3. REPORT MISSING TAB ================= */}
      {activeSubTab === 'report' && (
        <div className="flex-1 p-4 overflow-y-auto">
          <form onSubmit={handleCreateReport} className="bg-white p-4 rounded-3xl border border-gray-200/90 shadow-sm space-y-3">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">নিখোঁজ ব্যক্তির তথ্য দিন</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">তথ্য যাচাই করে দ্রুত জরুরি নেটওয়ার্কে সম্প্রচার করা হবে।</p>
            </div>

            {reportSubmitted ? (
              <div className="p-6 text-center text-emerald-700 space-y-2.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 animate-bounce" />
                <h4 className="font-bold text-sm">রিপোর্ট সফলভাবে সম্প্রচারিত হয়েছে!</h4>
                {lastGeneratedCaseId && (
                  <div className="bg-white py-1.5 px-3 rounded-xl border border-emerald-300 shadow-2xs inline-block my-1">
                    <span className="text-[10px] text-gray-500 block">বরাদ্দকৃত কেস আইডি:</span>
                    <span className="text-sm font-black font-mono text-emerald-700">{lastGeneratedCaseId}</span>
                  </div>
                )}
                <p className="text-xs text-emerald-600">আমাদের ভলান্টিয়ার টিম দ্রুত উদ্ধার তৎপরতায় যুক্ত হয়েছে।</p>
              </div>
            ) : (
              <>
                {/* Country Selection & Live Case ID Preview */}
                <div className="space-y-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">
                      দেশ কোড নির্বাচন করুন *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      ১ জানুয়ারি থেকে বার্ষিক রিসেট
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedCountry(c.code)}
                        className={`px-2 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border transition-all cursor-pointer ${
                          selectedCountry === c.code
                            ? 'bg-white border-emerald-500 text-emerald-800 shadow-2xs'
                            : 'bg-white/70 border-gray-200 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <span className="text-sm">{c.flag}</span>
                        <span className="font-mono">{c.code}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs mt-1">
                    <span className="text-[11px] font-bold text-gray-700">জেনারেটেড কেস আইডি:</span>
                    <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-300">
                      {peekNextCaseId(selectedCountry)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">নিখোঁজ ব্যক্তির পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সায়মা আক্তার"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">বয়স (বছর) *</label>
                    <input
                      type="number"
                      required
                      placeholder="যেমন: ১৫"
                      value={newPersonAge}
                      onChange={(e) => setNewPersonAge(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">সর্বশেষ অবস্থান *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মিরপুর ১০, ঢাকা"
                      value={newPersonLocation}
                      onChange={(e) => setNewPersonLocation(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01700-000000"
                    value={newGuardianPhone}
                    onChange={(e) => setNewGuardianPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    পুলিশ কেইস বা জিডি নম্বর (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: GD-1284/2025 বা কেইস নং..."
                    value={newPoliceCaseId}
                    onChange={(e) => setNewPoliceCaseId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="p-3 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-1 bg-gray-50">
                  <Camera className="w-6 h-6 text-gray-400 mx-auto" />
                  <span className="text-xs font-bold text-gray-700 block">সাম্প্রতিক ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-gray-400 block">ক্লিয়ার ছবি দ্রুত উদ্ধারে সহায়তা করে</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md active:scale-95 transition-transform"
                >
                  জরুরি রিপোর্ট সম্প্রচার করুন
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {/* ================= 4. FOUND RECORDS TAB ================= */}
      {activeSubTab === 'found' && (
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-bold text-gray-900">সফল উদ্ধার আর্কাইভ</h3>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              ভলান্টিয়ার সাফল্য
            </span>
          </div>

          <div className="space-y-3">
            {cases.filter(c => c.status === 'Found').map((c) => (
              <div key={c.id} className="p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs flex items-center space-x-3">
                <img src={c.photo} alt={c.personName} referrerPolicy="no-referrer" className="w-14 h-14 rounded-2xl object-cover border border-emerald-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{c.personName}</h4>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      নিরাপদে উদ্ধার
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{c.lastSeenLocation}, {c.district}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ❤️ পরিবারের কাছে হস্তান্তর সম্পন্ন
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. RESCUER PROFILE TAB ================= */}
      {activeSubTab === 'profile' && (
        <div className="flex-1 p-3 space-y-3.5 overflow-y-auto pb-6">
          {/* Official Rescuer Identity Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-4.5 border border-emerald-500/30 shadow-xl">
            {/* Background Watermark Elements */}
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-500/5 pointer-events-none" />

            {/* Top Row: Organization Badge & Duty Status Indicator */}
            <div className="flex items-center justify-between relative z-10 border-b border-emerald-800/40 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block leading-tight">
                    Desti Rescue Corps
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium">ভলান্টিয়ার রেসপন্ডার ইউনিট</span>
                </div>
              </div>

              {/* On-Duty / Off-Duty Toggle Pill */}
              <button
                type="button"
                onClick={() => setIsOnDuty(!isOnDuty)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border cursor-pointer ${
                  isOnDuty
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                    : 'bg-gray-800/60 border-gray-700 text-gray-400'
                }`}
                title="ডিউটি স্ট্যাটাস পরিবর্তন করুন"
              >
                <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
                <span>{isOnDuty ? 'ON DUTY' : 'OFF DUTY'}</span>
              </button>
            </div>

            {/* Rescuer Profile Details */}
            <div className="pt-3.5 flex items-start space-x-3.5 relative z-10">
              <div className="relative shrink-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Rescuer Avatar"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center shadow-xs">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-black text-white truncate">
                    {currentUser?.name || 'তানভীর আহমেদ'}
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30 shrink-0">
                    সার্টিফাইড
                  </span>
                </div>

                {/* Case/Badge ID with Quick Copy */}
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] font-mono font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded border border-white/10">
                    BD-RES-2026-7042
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('BD-RES-2026-7042');
                      setCopiedBadgeId(true);
                      setTimeout(() => setCopiedBadgeId(false), 2000);
                    }}
                    className="text-gray-400 hover:text-emerald-300 p-0.5 cursor-pointer"
                    title="আইডি কপি করুন"
                  >
                    {copiedBadgeId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-gray-300">
                  <div>
                    <span className="text-gray-500 block text-[9px]">রক্তের গ্রুপ:</span>
                    <span className="font-bold text-rose-400">{currentUser?.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px]">এলাকা:</span>
                    <span className="font-bold text-gray-200 truncate block">মিরপুর, ঢাকা</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions on Rescuer Card */}
            <div className="mt-4 pt-3 border-t border-emerald-800/30 flex items-center space-x-2 relative z-10">
              <button
                type="button"
                onClick={() => setShowIdCardModal(true)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>ডিজিটাল আইডি কার্ড</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 2500);
                }}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 border border-white/10 active:scale-95 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>শেয়ার</span>
              </button>
            </div>
            {showShareToast && (
              <div className="mt-2 py-1 px-2.5 bg-emerald-800/90 text-emerald-200 text-[10px] font-bold rounded-lg text-center animate-in fade-in">
                ✓ রেসকিউয়ার আইডি লিঙ্ক কপি করা হয়েছে!
              </div>
            )}
          </div>

          {/* Rescue Mission Impact Statistics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>উদ্ধার তৎপরতা ও অবদান</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                র‍্যাঙ্ক: গোল্ড রেসপন্ডার 🎖️
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <span className="text-base font-black text-emerald-600 block">৮</span>
                <span className="text-[10px] font-bold text-gray-700 block">সফল উদ্ধার</span>
                <span className="text-[8.5px] text-gray-400">ব্যক্তিগত অবদান</span>
              </div>
              <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <span className="text-base font-black text-teal-600 block">১৫</span>
                <span className="text-[10px] font-bold text-gray-700 block">সার্চ মিশন</span>
                <span className="text-[8.5px] text-gray-400">মাঠপর্যায়ে</span>
              </div>
              <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <span className="text-base font-black text-blue-600 block">৪৮</span>
                <span className="text-[10px] font-bold text-gray-700 block">ফিল্ড আওয়ার</span>
                <span className="text-[8.5px] text-gray-400">স্বেচ্ছাসেবা</span>
              </div>
              <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 text-center shadow-2xs">
                <span className="text-base font-black text-amber-600 block">৯৮%</span>
                <span className="text-[10px] font-bold text-gray-700 block">রেসপন্স রেট</span>
                <span className="text-[8.5px] text-gray-400">দ্রুত সাড়া</span>
              </div>
            </div>
          </div>

          {/* Rescuer Specialized Badges */}
          <div className="bg-white p-3.5 rounded-3xl border border-gray-200/80 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>অর্জিত রেসকিউ মেডেল ও ব্যাজ</span>
              </h4>
              <span className="text-[10px] text-gray-500 font-semibold">৪/৬ আনলকড</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 text-base">
                  🏅
                </div>
                <div className="min-w-0">
                  <h5 className="text-[11px] font-bold text-gray-900 truncate">প্রথম উদ্ধারকারী</h5>
                  <p className="text-[9.5px] text-gray-500">পরিবারে স্বজন ফিরিয়ে দেওয়ার অবদান</p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 text-base">
                  🌙
                </div>
                <div className="min-w-0">
                  <h5 className="text-[11px] font-bold text-gray-900 truncate">নাইট সার্চ হিরো</h5>
                  <p className="text-[9.5px] text-gray-500">রাত্রিকালীন জরুরি তল্লাশি অভিযান</p>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50/60 rounded-2xl border border-rose-200/60 flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 text-base">
                  🚑
                </div>
                <div className="min-w-0">
                  <h5 className="text-[11px] font-bold text-gray-900 truncate">ফার্স্ট এইড সার্টিফাইড</h5>
                  <p className="text-[9.5px] text-gray-500">উদ্ধার পরবর্তী জরুরি প্রাথমিক চিকিৎসা</p>
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/60 rounded-2xl border border-teal-200/60 flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0 text-base">
                  🤝
                </div>
                <div className="min-w-0">
                  <h5 className="text-[11px] font-bold text-gray-900 truncate">কমিউনিটি গার্ডিয়ান</h5>
                  <p className="text-[9.5px] text-gray-500">১০+ নিখোঁজ সন্ধানে সক্রিয় অংশগ্রহণ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Emergency Dispatch Support & Command Contacts */}
          <div className="bg-emerald-50 p-3.5 rounded-3xl border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>জরুরি রেসকিউ হটলাইন ও কমান্ড</span>
              </span>
              <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                ২৪/৭ সচল
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCallContact('999')}
                className="py-2.5 px-3 bg-white rounded-2xl border border-emerald-300 text-left hover:bg-emerald-100/50 transition-all flex items-center justify-between cursor-pointer shadow-2xs"
              >
                <div>
                  <span className="text-[10px] text-gray-500 block">জাতীয় জরুরি সেবা</span>
                  <span className="text-xs font-black text-gray-900">৯৯৯ (999)</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => onCallContact('16111')}
                className="py-2.5 px-3 bg-white rounded-2xl border border-emerald-300 text-left hover:bg-emerald-100/50 transition-all flex items-center justify-between cursor-pointer shadow-2xs"
              >
                <div>
                  <span className="text-[10px] text-gray-500 block">Desti কমান্ড সেন্টার</span>
                  <span className="text-xs font-black text-emerald-700">১৬১১১ (16111)</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Rescuer ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 space-y-0">
            {/* ID Card Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 text-center relative">
              <button
                type="button"
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-white/10 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-1.5 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-sm font-black tracking-wider uppercase">DESTI RESCUE CORPS</h3>
              <p className="text-[10px] text-emerald-200">অফিসিয়াল ভলান্টিয়ার রেসকিউয়ার আইডি</p>
            </div>

            {/* ID Card Body */}
            <div className="p-5 space-y-4 text-center bg-gray-50/50">
              <div className="relative inline-block mx-auto">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt="Rescuer"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md mx-auto"
                />
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white shadow-xs">
                  VERIFIED
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-gray-900">{currentUser?.name || 'তানভীর আহমেদ'}</h4>
                <p className="text-xs font-mono font-bold text-emerald-700">ID: BD-RES-2026-7042</p>
                <p className="text-[11px] text-gray-500 mt-0.5">রেসকিউ টিম: ঢাকা উত্তর জোন • সেক্টর ৪</p>
              </div>

              {/* QR Code Graphic Box */}
              <div className="p-3 bg-white rounded-2xl border border-gray-200 inline-block shadow-2xs">
                <QrCode className="w-24 h-24 text-gray-800 mx-auto" />
                <span className="text-[9px] text-gray-400 block mt-1">কুইক ভেরিফিকেশন কিউআর কোড</span>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowIdCardModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIdCardModal(false);
                    setShowShareToast(true);
                    setTimeout(() => setShowShareToast(false), 2500);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>আইডি শেয়ার করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Details Popup Modal */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
              <img src={selectedCaseModal.photo} alt={selectedCaseModal.personName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                {selectedCaseModal.caseId}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-gray-900">{selectedCaseModal.personName}</h3>
                <span className="text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  {selectedCaseModal.caseId}
                </span>
              </div>
              {selectedCaseModal.policeCaseId && (
                <div className="mt-1">
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono inline-block">
                    👮 পুলিশ কেইস / জিডি নং: {selectedCaseModal.policeCaseId}
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">বয়স: {selectedCaseModal.age} বছর • {selectedCaseModal.gender}</p>
              <p className="text-xs text-gray-700 mt-1">{selectedCaseModal.description}</p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setSelectedCaseModal(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  onCallContact(selectedCaseModal.contactPhone ?? selectedCaseModal.guardianContact);
                  setSelectedCaseModal(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
              >
                <Phone className="w-4 h-4" />
                <span>অভিভাবককে কল</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

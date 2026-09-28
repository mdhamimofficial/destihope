import React, { useState, useMemo, useEffect } from 'react';
import { 
  Droplet, 
  Building2, 
  Search, 
  Phone, 
  PlusCircle, 
  CheckCircle2,
  Siren,
  MapPin, 
  QrCode, 
  Share2, 
  Users, 
  RotateCcw,
  Heart,
  Calendar,
  Sparkles,
  Navigation,
  MessageSquare,
  Edit3,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Clock,
  AlertCircle,
  User,
  Lock,
  Award,
  CheckCircle,
  Bell,
  Upload,
  Menu,
  RefreshCw
} from 'lucide-react';
import { mockDonors, mockHospitals } from '../../data/mockData';
import { BangladeshLocationFilter } from '../common/BangladeshLocationFilter';
import { getDivisionOfDistrict } from '../../data/bangladeshLocations';
import { BloodDonor, UserProfile, DonorWillingnessStatus, ActiveModule } from '../../types';
import { ContactDonorModal } from '../modals/ContactDonorModal';
import { ManageDonorStatusModal } from '../modals/ManageDonorStatusModal';
import { PullToRefresh } from '../common/PullToRefresh';

interface DestiCareViewProps {
  onOpenMenu?: () => void;
  onOpenCreateBloodRequest: () => void;
  onCallContact: (phone: string) => void;
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenNotifications?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  currentUser?: UserProfile;
  onUpdateUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export const DestiCareView: React.FC<DestiCareViewProps> = ({
  onOpenMenu,
  onOpenCreateBloodRequest,
  onCallContact,
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenNotifications,
  activeSubTab = 'bloodbank',
  onSelectSubTab,
  currentUser,
  onUpdateUser
}) => {
  // Search toggle state (for expanding search row on search icon click)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Blood group filter
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
  // Location cascading filter
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('all');
  
  // Search text query
  const [donorSearchQuery, setDonorSearchQuery] = useState('');

  // Controls whether the cascading location filter is expanded inside the search area
  const [isLocationFilterExpanded, setIsLocationFilterExpanded] = useState(false);

  // Check if any location filter is currently active
  const hasLocationFilter = selectedDivision !== 'all' || selectedDistrict !== 'all' || selectedUpazila !== 'all';

  // Modals state
  const [selectedDonorForContact, setSelectedDonorForContact] = useState<BloodDonor | null>(null);
  const [isManageStatusOpen, setIsManageStatusOpen] = useState(false);

  // Ambulance simulator state
  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);
  const [ambulanceEta, setAmbulanceEta] = useState(7);

  // In-app toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pull-to-refresh state for DestiCare
  const [isCareRefreshing, setIsCareRefreshing] = useState(false);
  const handleRefreshCare = async () => {
    setIsCareRefreshing(true);
    await new Promise((r) => setTimeout(r, 750));
    setIsCareRefreshing(false);
    showToast('✨ রক্তের আবেদন ও ডোনার তালিকা রিফ্রেশ হয়েছে!');
  };

  // User's own donor profile stored locally & synced with currentUser
  const [userDonorProfile, setUserDonorProfile] = useState<{
    willingness: DonorWillingnessStatus;
    months?: number;
    availableDateNote?: string;
    bloodGroup: string;
    district: string;
    upazila: string;
    phone: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('desticare_user_donor_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      willingness: currentUser?.donorWillingness || (currentUser?.isDonorAvailable ? 'available' : 'available'),
      months: currentUser?.availableAfterMonths || 2,
      availableDateNote: currentUser?.availableDateNote || '২ মাস পর প্রস্তুত (নভেম্বর ২০২৬)',
      bloodGroup: currentUser?.bloodGroup || 'O+',
      district: currentUser?.district || 'ঢাকা',
      upazila: currentUser?.area || 'ধানমন্ডি',
      phone: currentUser?.phone || '01712-889900'
    };
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Update localStorage when user donor profile changes
  const handleUpdateDonorProfile = (newSettings: Partial<UserProfile>) => {
    const updated = {
      willingness: newSettings.donorWillingness ?? userDonorProfile.willingness,
      months: newSettings.availableAfterMonths ?? userDonorProfile.months,
      availableDateNote: newSettings.availableDateNote ?? userDonorProfile.availableDateNote,
      bloodGroup: newSettings.bloodGroup ?? userDonorProfile.bloodGroup,
      district: newSettings.district ?? userDonorProfile.district,
      upazila: newSettings.area ?? userDonorProfile.upazila,
      phone: newSettings.phone ?? userDonorProfile.phone
    };
    setUserDonorProfile(updated);
    try {
      localStorage.setItem('desticare_user_donor_profile', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    if (onUpdateUser) {
      onUpdateUser(prev => ({
        ...prev,
        ...newSettings
      }));
    }
  };

  // Quick 1-tap change willingness
  const handleQuickSetWillingness = (status: DonorWillingnessStatus) => {
    let dateNote = '';
    if (status === 'after_months') {
      dateNote = `${userDonorProfile.months || 2} মাস পর প্রস্তুত`;
    }
    handleUpdateDonorProfile({
      donorWillingness: status,
      isDonorAvailable: status === 'available',
      availableDateNote: dateNote
    });
  };

  // Handle cascading location change
  const handleLocationChange = (division: string, district: string, upazila: string) => {
    setSelectedDivision(division);
    setSelectedDistrict(district);
    setSelectedUpazila(upazila);
  };

  // Combine mock donors with the current user's profile if active
  const allDonors: BloodDonor[] = useMemo(() => {
    const list: BloodDonor[] = [];

    // If user has a profile and is willing to donate, add user as a special donor card at the top
    if (userDonorProfile && userDonorProfile.willingness === 'available') {
      list.push({
        id: 'current-user-donor',
        name: currentUser?.name ? `${currentUser.name} (আপনি)` : 'আপনার ডোনার প্রোফাইল',
        bloodGroup: userDonorProfile.bloodGroup,
        division: getDivisionOfDistrict(userDonorProfile.district) || 'ঢাকা',
        district: userDonorProfile.district,
        upazila: userDonorProfile.upazila,
        area: userDonorProfile.upazila,
        phone: userDonorProfile.phone,
        lastDonation: '১ মাস আগে',
        donationsCount: currentUser?.stats?.donations || 3,
        totalDonations: currentUser?.stats?.donations || 3,
        badge: 'Blood Hero',
        isAvailable: true,
        willingnessStatus: 'available',
        willingNote: 'যেকোনো জরুরি প্রয়োজনে ফোন করুন, আমি রক্ত দিতে প্রস্তুত।'
      });
    }

    // Automatically only show donors who are willing to donate blood right now!
    // Donors who are after_months or unavailable are excluded.
    const willingMockDonors = mockDonors.filter(
      (d) => d.willingnessStatus === 'available' || (d.isAvailable && !d.willingnessStatus)
    );
    list.push(...willingMockDonors);
    return list;
  }, [userDonorProfile, currentUser]);

  // Filtered Donors based on:
  // 1. Blood Group
  // 2. Division, District, Upazila (manual location selection)
  // 3. Free text search
  // (Automatically only includes donors who are willing/ready to donate blood)
  const filteredDonors = useMemo(() => {
    return allDonors.filter((donor) => {
      // 1. Blood group filter
      if (selectedGroup !== 'all' && donor.bloodGroup !== selectedGroup) return false;

      // 2. Automatically only show donors who are ready/willing
      const isReady = donor.willingnessStatus === 'available' || (donor.isAvailable && !donor.willingnessStatus);
      if (!isReady) return false;

      // 3. Division filter
      if (selectedDivision !== 'all') {
        const donorDiv = donor.division || getDivisionOfDistrict(donor.district);
        if (donorDiv !== selectedDivision) return false;
      }

      // 4. District filter
      if (selectedDistrict !== 'all' && donor.district !== selectedDistrict) return false;

      // 5. Upazila filter
      if (selectedUpazila !== 'all') {
        const matchUpazila =
          (donor.upazila && donor.upazila.toLowerCase().includes(selectedUpazila.toLowerCase())) ||
          (donor.area && donor.area.toLowerCase().includes(selectedUpazila.toLowerCase()));
        if (!matchUpazila) return false;
      }

      // 6. Search query filter
      if (donorSearchQuery.trim()) {
        const q = donorSearchQuery.trim().toLowerCase();
        const matchName = donor.name.toLowerCase().includes(q);
        const matchArea = donor.area.toLowerCase().includes(q);
        const matchDistrict = donor.district.toLowerCase().includes(q);
        const matchUpazila = donor.upazila ? donor.upazila.toLowerCase().includes(q) : false;
        const matchGroup = donor.bloodGroup.toLowerCase().includes(q);
        if (!matchName && !matchArea && !matchDistrict && !matchUpazila && !matchGroup) {
          return false;
        }
      }

      return true;
    });
  }, [allDonors, selectedGroup, selectedDivision, selectedDistrict, selectedUpazila, donorSearchQuery]);

  const filteredHospitals = mockHospitals.filter((h) => {
    if (selectedDivision !== 'all') {
      const hospDiv = h.division || getDivisionOfDistrict(h.district);
      if (hospDiv !== selectedDivision) return false;
    }
    if (selectedDistrict !== 'all' && h.district !== selectedDistrict) return false;
    if (selectedUpazila !== 'all') {
      const matchUpazila =
        (h.upazila && h.upazila.toLowerCase().includes(selectedUpazila.toLowerCase())) ||
        (h.address && h.address.toLowerCase().includes(selectedUpazila.toLowerCase()));
      if (!matchUpazila) return false;
    }
    if (donorSearchQuery.trim()) {
      const q = donorSearchQuery.trim().toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchDist = h.district.toLowerCase().includes(q);
      const matchAddr = h.address.toLowerCase().includes(q);
      const matchIcu = h.icuStatus.toLowerCase().includes(q);
      if (!matchName && !matchDist && !matchAddr && !matchIcu) return false;
    }
    return true;
  });

  const handleDispatchAmbulance = () => {
    setAmbulanceDispatched(true);
    setAmbulanceEta(7);
  };

  return (
    <div className="bg-gray-50 flex-1 flex flex-col min-h-screen pb-20 relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 border border-white/20 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar: Identical to Home Page (DESTI HOPE -> DESTI CARE) */}
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
              <span className="font-black text-base sm:text-lg text-rose-600 ml-0.5">
                CARE
              </span>
            </div>
          </div>

          {/* Center: Post composer input pill (like Home feed) */}
          <div
            id="input-create-post-trigger"
            onClick={onOpenCreateBloodRequest}
            className="flex-1 min-w-0 flex items-center justify-between bg-white hover:bg-rose-50/40 active:bg-rose-50/70 border border-gray-200 hover:border-gray-300 active:border-gray-400 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-2xs cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium truncate">
              জরুরি রক্তের আবেদন পোস্ট করুন...
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                পোস্ট করুন
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center shrink-0 ml-1 transition-colors">
                <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 fill-rose-600 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right section: Search and Notification Icons */}
          <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
            {/* Refresh Button */}
            <button
              id="btn-care-header-refresh"
              onClick={handleRefreshCare}
              disabled={isCareRefreshing}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90 relative cursor-pointer"
              aria-label="রিফ্রেশ করুন"
              title="ডোনার ও রক্তের তালিকা রিফ্রেশ করুন"
            >
              <RefreshCw
                className={`w-5 h-5 sm:w-5 sm:h-5 text-gray-700 transition-transform ${
                  isCareRefreshing ? 'animate-spin text-rose-600' : 'hover:rotate-180 duration-500'
                }`}
              />
            </button>

            {/* Search Button */}
            <button
              id="btn-header-search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
                isSearchOpen || donorSearchQuery || hasLocationFilter
                  ? 'text-rose-600 bg-rose-50'
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

        {/* Expandable Search & Location Filter Drawer */}
        {(isSearchOpen || donorSearchQuery || hasLocationFilter) && (
          <div className="bg-white border-t border-gray-100 px-3 py-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100/90 rounded-xl px-2.5 py-1.5 border border-gray-200 focus-within:border-rose-400 focus-within:bg-white transition-all shadow-2xs">
                <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder={
                    activeSubTab === 'hospitals'
                      ? 'হাসপাতাল খুঁজুন...'
                      : 'ডোনার, রক্ত বা এলাকা খুঁজুন...'
                  }
                  value={donorSearchQuery}
                  onChange={(e) => setDonorSearchQuery(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400 min-w-0 pr-1"
                  autoFocus={isSearchOpen && !donorSearchQuery}
                />
                {donorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDonorSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1 cursor-pointer mr-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Location filter button inside search drawer */}
              <button
                type="button"
                onClick={() => setIsLocationFilterExpanded(!isLocationFilterExpanded)}
                title="বাংলাদেশ লোকেশন ফিল্টার"
                className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer relative ${
                  hasLocationFilter
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : isLocationFilterExpanded
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                {hasLocationFilter && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full ring-1 ring-white" />
                )}
              </button>
            </div>

            {/* Cascading Bangladesh Location Filter Drawer */}
            {isLocationFilterExpanded && (
              <div className="pt-2 border-t border-gray-100 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    বাংলাদেশ অবস্থান ফিল্টার (বিভাগ, জেলা, উপজেলা)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLocationFilterExpanded(false)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer px-1"
                  >
                    সম্পন্ন ✕
                  </button>
                </div>
                <BangladeshLocationFilter
                  selectedDivision={selectedDivision}
                  selectedDistrict={selectedDistrict}
                  selectedUpazila={selectedUpazila}
                  onChange={handleLocationChange}
                />
              </div>
            )}

            {/* Active Location Filter Pill */}
            {hasLocationFilter && !isLocationFilterExpanded && (
              <div className="flex items-center justify-between bg-rose-50/90 border border-rose-200/90 rounded-xl px-2.5 py-1 text-xs text-rose-800 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setIsLocationFilterExpanded(true)}
                  className="flex items-center space-x-1.5 min-w-0 text-left hover:underline cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="font-bold text-[10px] truncate">
                    {selectedDivision !== 'all' && `${selectedDivision} বিভাগ`}
                    {selectedDistrict !== 'all' && ` > ${selectedDistrict}`}
                    {selectedUpazila !== 'all' && ` > ${selectedUpazila}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDivision('all');
                    setSelectedDistrict('all');
                    setSelectedUpazila('all');
                  }}
                  className="flex items-center space-x-1 text-rose-600 hover:text-rose-700 font-bold text-[10px] shrink-0 ml-2 hover:underline cursor-pointer p-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>রিসেট</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ================= 1. BLOOD BANK & DONORS ================= */}
      {activeSubTab === 'bloodbank' && (
        <PullToRefresh
          id="care-pull-to-refresh"
          onRefresh={handleRefreshCare}
          className="flex-1 flex flex-col"
        >
          {/* Blood Group Matrix Bar */}
          <div className="p-3 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">রক্তের গ্রুপ বাছাই করুন:</span>
              {selectedGroup !== 'all' && (
                <button onClick={() => setSelectedGroup('all')} className="text-[11px] text-rose-600 font-semibold cursor-pointer">
                  রিসেট
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(selectedGroup === bg ? 'all' : bg)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                    selectedGroup === bg
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-102'
                      : 'bg-gray-50 text-gray-800 border-gray-200/80 hover:bg-rose-50/50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Donors List - Automatically only shows available donors willing to donate */}
          <div className="p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-1">
              <span className="flex items-center gap-1.5 text-gray-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>রক্তদানে প্রস্তুত রক্তদাতা ({filteredDonors.length} জন)</span>
              </span>
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                যাচাইকৃত ডোনার
              </span>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="p-6 bg-white rounded-3xl border border-gray-200/80 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800">কোনো রক্তদাতা পাওয়া যায়নি</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {selectedDistrict !== 'all' || selectedDivision !== 'all' || selectedGroup !== 'all' || donorSearchQuery
                      ? 'আপনার নির্বাচিত ফিল্টারে বর্তমানে কোনো ডোনার নেই। ডিফল্ট রেজাল্ট দেখতে ফিল্টার রিসেট করুন অথবা সরাসরি রক্তের আবেদন পোস্ট করুন।'
                      : 'বর্তমানে কোনো ডোনার তালিকাভুক্ত নেই।'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGroup('all');
                      setSelectedDivision('all');
                      setSelectedDistrict('all');
                      setSelectedUpazila('all');
                      setDonorSearchQuery('');
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>সব ফিল্টার ক্লিয়ার</span>
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCreateBloodRequest}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>রক্তের আবেদন দিন</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredDonors.map((donor) => {
                const isUser = donor.id === 'current-user-donor';
                const isReady = donor.willingnessStatus === 'available' || (donor.isAvailable && !donor.willingnessStatus);
                const isAvailableLater = donor.willingnessStatus === 'after_months';

                return (
                  <div
                    key={donor.id}
                    onClick={() => setSelectedDonorForContact(donor)}
                    className={`p-3.5 rounded-2xl border transition-all shadow-2xs flex items-center justify-between cursor-pointer hover:border-rose-300 hover:shadow-xs ${
                      isUser
                        ? 'bg-rose-50/40 border-rose-200 ring-2 ring-rose-100'
                        : 'bg-white border-gray-200/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-black text-rose-600 leading-none">{donor.bloodGroup}</span>
                        <span className="text-[8px] font-bold text-rose-400 uppercase mt-0.5">গ্রুপ</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{donor.name}</h4>
                          {isUser && (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded-md">
                              আপনার প্রোফাইল
                            </span>
                          )}

                          {/* Willingness Badge */}
                          {isReady ? (
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              প্রস্তুত
                            </span>
                          ) : isAvailableLater ? (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                              {donor.availableDateNote || `${donor.availableAfterMonths} মাস পর`}
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-md">
                              অনুপলব্ধ
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {donor.upazila ? `${donor.upazila}, ` : ''}{donor.area ? `${donor.area}, ` : ''}{donor.district}
                        </p>

                        <p className="text-[10px] text-gray-400 mt-0.5">
                          শেষ রক্তদান: {donor.lastDonation} • মোট: {donor.totalDonations ?? donor.donationsCount} বার
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDonorForContact(donor);
                        }}
                        className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </PullToRefresh>
      )}

      {/* ================= 2. HOSPITALS & ICU ================= */}
      {activeSubTab === 'hospitals' && (
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-5 h-5 text-rose-600" />
              <h3 className="text-xs font-bold text-gray-900">হাসপাতাল ও আইসিইউ ডিরেক্টরি</h3>
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
              ২৪/৭ চালু
            </span>
          </div>

          {/* Location Filter for Hospitals */}
          <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xs font-bold text-gray-700 mb-2">এলাকা অনুযায়ী হাসপাতাল খুঁজুন:</p>
            <BangladeshLocationFilter
              selectedDivision={selectedDivision}
              selectedDistrict={selectedDistrict}
              selectedUpazila={selectedUpazila}
              onChange={handleLocationChange}
            />
          </div>

          <div className="space-y-3">
            {filteredHospitals.length === 0 ? (
              <div className="p-6 bg-white rounded-3xl border border-gray-200/80 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800">কোনো হাসপাতাল পাওয়া যায়নি</h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    আপনার নির্বাচিত এলাকায় বর্তমানে কোনো হাসপাতালের তথ্য নেই। সব এলাকা সিলেক্ট করে আবার দেখুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDivision('all');
                    setSelectedDistrict('all');
                    setSelectedUpazila('all');
                  }}
                  className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>সব হাসপাতাল দেখুন</span>
                </button>
              </div>
            ) : (
              filteredHospitals.map((hosp) => {
                const hasIcu = (hosp.icuAvailable ?? 0) > 0 || hosp.icuStatus.includes('খালি');
                const phoneToCall = hosp.phone ?? hosp.emergencyPhone;
                return (
                  <div key={hosp.id} className="p-4 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{hosp.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {hosp.address}, {hosp.district}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        hasIcu
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        ICU: {hosp.icuStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <span className="text-gray-500 text-[11px]">হটলাইন: {phoneToCall}</span>
                      <button
                        onClick={() => onCallContact(phoneToCall)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center space-x-1 text-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= 3. AMBULANCE SOS DISPATCHER ================= */}
      {activeSubTab === 'ambulance' && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-3xl shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                জাতীয় ইমার্জেন্সি রেসপন্স
              </span>
              <Siren className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <h3 className="text-base font-black">দ্রুততম অ্যাম্বুলেন্স সার্ভিস</h3>
            <p className="text-xs text-red-100 leading-relaxed">
              জরুরি মুহূর্তে ১ ক্লিকে নিকটস্থ অ্যাম্বুলেন্স ড্রাইভারে সিগন্যাল পাঠান অথবা ৯৯৯ হটলাইনে কল করুন।
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => onCallContact('999')}
                className="flex-1 py-2.5 bg-white text-red-700 hover:bg-gray-100 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>৯৯৯ এ কল করুন</span>
              </button>
              <button
                onClick={handleDispatchAmbulance}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <Siren className="w-4 h-4 text-amber-400" />
                <span>অনলাইন কল</span>
              </button>
            </div>
          </div>

          {ambulanceDispatched && (
            <div className="p-4 bg-emerald-50 rounded-3xl border-2 border-emerald-500 shadow-md space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  অ্যাম্বুলেন্স রওনা হয়েছে
                </span>
                <span className="text-xs font-bold text-emerald-900 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                  ETA: ~{ambulanceEta} মিনিট
                </span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-gray-900">ড্রাইভার: মো. রফিক ইসলাম</h4>
                  <p className="text-gray-500 text-[11px]">ঢাকা মেট্রো-ছ ১১-২৪৫২ (ICU সাপোর্ট)</p>
                </div>
                <button
                  onClick={() => onCallContact('01711-998877')}
                  className="p-2.5 rounded-full bg-emerald-600 text-white active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-700 px-1">অ্যাম্বুলেন্সের ধরন:</h4>
            {[
              { title: 'আইসিইউ / লাইফ সাপোর্ট অ্যাম্বুলেন্স', desc: 'ভেন্টিলেটর, অক্সিজেন ও সার্বক্ষণিক প্যারামেডিক সহ', price: '৳২,৫০০ থেকে শুরু' },
              { title: 'এসি অ্যাম্বুলেন্স (সাধারণ রোগী)', desc: 'আরামদায়ক স্ট্রেচার ও অক্সিজেন সাপোর্ট', price: '৳১,২০০ থেকে শুরু' },
              { title: 'ফ্রি চ্যারিটি ক্যারিয়ার', desc: 'অসহায় ও দরিদ্র রোগীদের জন্য বিনামূল্যে', price: 'বিনামূল্যে' }
            ].map((srv, idx) => (
              <div key={idx} className="p-3 bg-white rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs">
                <div className="pr-2">
                  <h5 className="font-bold text-gray-900">{srv.title}</h5>
                  <p className="text-[11px] text-gray-500">{srv.desc}</p>
                </div>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md shrink-0">
                  {srv.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. DONATOR ACCOUNT (মূল ডোনার অ্যাকাউন্ট) ================= */}
      {(activeSubTab === 'profile' || activeSubTab === 'donorcard') && (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Main Account Identity - Desti Hope Donator Account */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
                  DESTI HOPE • DONATOR ACCOUNT
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-500 font-bold">
                ID: DH-88291
              </span>
            </div>

            {/* Profile Avatar & Details */}
            <div className="flex items-center space-x-3.5">
              <div className="relative shrink-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                  alt={currentUser?.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/30 shadow-xs"
                />
                <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1 rounded-full shadow-xs">
                  <Droplet className="w-3 h-3 fill-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-gray-900 truncate">
                    {currentUser?.name || 'তানভীর আহমেদ'}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  @{currentUser?.username || 'tanvir'} • <span className="font-bold text-rose-600">{currentUser?.role || 'Blood Hero'}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {userDonorProfile.upazila}, {userDonorProfile.district}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-gray-700 font-bold">{userDonorProfile.phone}</span>
                </div>
              </div>

              <div className="text-center bg-rose-50 border border-rose-200 px-3 py-2 rounded-2xl shrink-0">
                <span className="text-xl font-black text-rose-600 block leading-none">
                  {userDonorProfile.bloodGroup}
                </span>
                <span className="text-[8px] font-bold text-rose-800 uppercase tracking-widest mt-1 block">
                  গ্রুপ
                </span>
              </div>
            </div>

            {/* Key Metrics / Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                <span className="text-base font-black text-gray-900 block leading-tight">
                  {currentUser?.stats?.donations ?? 4} বার
                </span>
                <span className="text-[10px] text-gray-500 font-medium">মোট রক্তদান</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                <span className="text-base font-black text-rose-600 block leading-tight">
                  {currentUser?.hopePoints || 450} HP
                </span>
                <span className="text-[10px] text-gray-500 font-medium">হোপ পয়েন্ট</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                <span className={`text-xs font-black block leading-tight truncate ${
                  userDonorProfile.willingness === 'available'
                    ? 'text-emerald-600'
                    : userDonorProfile.willingness === 'after_months'
                    ? 'text-amber-600'
                    : 'text-gray-500'
                }`}>
                  {userDonorProfile.willingness === 'available'
                    ? '🟢 প্রস্তুত'
                    : userDonorProfile.willingness === 'after_months'
                    ? `🟡 ${userDonorProfile.months || 2} মাস পর`
                    : '⚪ বন্ধ'}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">ডোনার স্ট্যাটাস</span>
              </div>
            </div>
          </div>

          {/* THE SMART DONOR CARD: Conditioned on >= 1 blood donations */}
          {(currentUser?.stats?.donations ?? 4) >= 1 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-black text-gray-900">
                    ডিজিটাল স্মার্ট ডোনার আইডি কার্ড (Smart Donor Pass)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  সক্রিয় কার্ড
                </span>
              </div>

              {/* Luxury Card UI - Clean & GPU-Safe (no heavy blur-xl filters) */}
              <div 
                id="smart-donor-pass-card"
                className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-5 shadow-2xl border border-rose-500/40 select-none"
                style={{
                  background: 'linear-gradient(145deg, #090b10 0%, #1c050f 45%, #2e0513 80%, #150209 100%)'
                }}
              >
                {/* Decorative subtle pattern (NO heavy blur filters to prevent GPU buffer corruption on mobile) */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40" 
                  style={{
                    backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(244, 63, 94, 0.25) 0%, transparent 55%), radial-gradient(circle at 10% 90%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)'
                  }}
                />

                <div className="relative z-10 space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-md shrink-0">
                        <Droplet className="w-4 h-4 fill-white text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-black tracking-widest text-rose-300 uppercase block leading-none font-mono">
                          DESTI DONOR PASS
                        </span>
                        <span className="text-[9px] text-rose-200/80 font-mono tracking-wider mt-0.5 block">
                          DONOR ID: DH-88291
                        </span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                      ভেরিফাইড ডোনার
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div className="pr-2 min-w-0">
                      <h3 className="text-lg font-black text-white truncate">{currentUser?.name || 'তানভীর আহমেদ'}</h3>
                      <p className="text-xs text-rose-200/90 font-medium truncate mt-0.5">
                        @{currentUser?.username || 'tanvir'} • {userDonorProfile.upazila}, {userDonorProfile.district}
                      </p>
                      <p className="text-xs font-mono text-rose-300/90 mt-0.5 font-bold tracking-wide">{userDonorProfile.phone}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shadow-inner shrink-0">
                      <span className="text-2xl font-black text-rose-400 leading-none">{userDonorProfile.bloodGroup}</span>
                      <span className="text-[8.5px] font-bold text-white/80 uppercase tracking-wider mt-1">রক্তের গ্রুপ</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-white/15 text-xs">
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                      <span className="text-rose-200/70 text-[10px] block font-medium">মোট রক্তদান:</span>
                      <span className="font-black text-white text-xs mt-0.5 block">{currentUser?.stats?.donations ?? 4} বার সম্পন্ন</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
                      <span className="text-rose-200/70 text-[10px] block font-medium">বর্তমান স্ট্যাটাস:</span>
                      <span className={`font-black text-xs mt-0.5 block truncate ${
                        userDonorProfile.willingness === 'available'
                          ? 'text-emerald-400'
                          : userDonorProfile.willingness === 'after_months'
                          ? 'text-amber-400'
                          : 'text-gray-300'
                      }`}>
                        {userDonorProfile.willingness === 'available'
                          ? '🟢 এখনই দেওয়া যাবে'
                          : userDonorProfile.willingness === 'after_months'
                          ? `🟡 ${userDonorProfile.availableDateNote}`
                          : '⚪ আপাতত বন্ধ'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 flex items-center justify-between border-t border-white/10 text-[10.5px] text-rose-200/80 font-medium">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>স্ক্যান করে ডোনার সত্যতা যাচাই করুন</span>
                    </span>
                    <span className="text-white/60 font-mono font-bold">DestiHope ২০২৬</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Card */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => showToast('স্মার্ট ডোনার কার্ডটি আপনার ডিভাইসে সংরক্ষিত হয়েছে!')}
                  className="py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>কার্ড শেয়ার / সেভ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManageStatusOpen(true)}
                  className="py-2.5 bg-white hover:bg-gray-50 active:scale-95 border border-gray-200 text-gray-800 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-600" />
                  <span>ডোনার তথ্য পরিবর্তন</span>
                </button>
              </div>
            </div>
          ) : (
            /* LOCKED CARD STATE FOR USERS WITH 0 BLOOD DONATIONS */
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 border border-slate-700 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider text-slate-100">
                      ডিজিটাল স্মার্ট ডোনার কার্ড (লকড)
                    </h4>
                    <span className="text-[9px] text-slate-400">
                      স্মার্ট ডোনার পাস আনলক করতে রক্তদান আবশ্যক
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                  ১টি রক্তদান প্রয়োজন
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Desti Hope এর ডিজিটাল স্মার্ট ডোনার আইডি কার্ডটি শুধুমাত্র রক্তদাতাদের জন্য সংরক্ষিত। আপনি অন্তত <strong>১ বার রক্তদান সম্পন্ন করলে</strong> স্বয়ংক্রিয়ভাবে আপনার ডিজিটাল ডোনার আইডি কার্ড সক্রিয় হবে।
              </p>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">কার্ড আনলক অগ্রগতি:</span>
                  <span className="font-bold text-amber-400">০ / ১ রক্তদান সম্পন্ন</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-rose-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>হাসপাতাল ও জরুরি সেবায় তাৎক্ষণিক অগ্রাধিকার</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>অনলাইন কিউআর কোড যুক্ত অফিশিয়াল ভেরিফিকেশন পাস</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsManageStatusOpen(true)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>রক্তদান করেছেন? রেকর্ড আপডেট করুন</span>
              </button>
            </div>
          )}

          {/* QUICK WILLINGNESS SWITCHER */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  রক্তদানে ইচ্ছুকতার অবস্থা (Willingness Status)
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  সার্চ রেজাল্টে রোগীরা আপনাকে ডোনার হিসেবে দেখতে পারবে কি না
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManageStatusOpen(true)}
                className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3 h-3" />
                <span>এডিট</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleUpdateDonorProfile({ isDonorAvailable: true, donorWillingness: 'available' })}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  userDonorProfile.willingness === 'available'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs block">🟢 প্রস্তুত</span>
                <span className="text-[9px] text-gray-500 mt-0.5 block">এখনই রক্ত দেব</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDonorProfile({ isDonorAvailable: false, donorWillingness: 'after_months', availableAfterMonths: 2 })}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  userDonorProfile.willingness === 'after_months'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs block">🟡 কয়েক মাস পর</span>
                <span className="text-[9px] text-gray-500 mt-0.5 block">{userDonorProfile.months || 2} মাস বিরতি</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateDonorProfile({ isDonorAvailable: false, donorWillingness: 'unavailable' })}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  userDonorProfile.willingness === 'unavailable'
                    ? 'border-gray-500 bg-gray-100 text-gray-900 font-bold shadow-2xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs block">⚪ আপাতত বন্ধ</span>
                <span className="text-[9px] text-gray-500 mt-0.5 block">অপারগ</span>
              </button>
            </div>
          </div>

          {/* Account Settings & Emergency Alerts */}
          <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-rose-600" />
                  জরুরি রক্তের নোটিফিকেশন অ্যালার্ট
                </h5>
                <p className="text-[10px] text-gray-500">
                  আপনার এলাকা ({userDonorProfile.district}) এ {userDonorProfile.bloodGroup} রক্তের প্রয়োজন হলে পুশ নোটিফিকেশন পাঠাবে
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                চালু আছে
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Contact & Blood Request Modal */}
      <ContactDonorModal
        donor={selectedDonorForContact}
        isOpen={!!selectedDonorForContact}
        onClose={() => setSelectedDonorForContact(null)}
        onCall={onCallContact}
        userLocation={`${userDonorProfile.upazila}, ${userDonorProfile.district}`}
      />

      {/* 2. Manage Donor Willingness & Profile Modal */}
      {currentUser && (
        <ManageDonorStatusModal
          isOpen={isManageStatusOpen}
          onClose={() => setIsManageStatusOpen(false)}
          currentUser={{
            ...currentUser,
            bloodGroup: userDonorProfile.bloodGroup,
            district: userDonorProfile.district,
            area: userDonorProfile.upazila,
            phone: userDonorProfile.phone,
            donorWillingness: userDonorProfile.willingness,
            availableAfterMonths: userDonorProfile.months,
            availableDateNote: userDonorProfile.availableDateNote
          }}
          onSave={handleUpdateDonorProfile}
        />
      )}
    </div>
  );
};

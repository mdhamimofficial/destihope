import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'bn' | 'en';

export interface Translations {
  [key: string]: {
    bn: string;
    en: string;
  };
}

export const translations: Translations = {
  // Navigation & Branding
  appName: { bn: 'ডেস্টিহোপ', en: 'DestiHope' },
  hubTitle: { bn: 'ডেস্টিহাব', en: 'DestiHub' },
  hubSubtitle: { bn: 'এক প্ল্যাটফর্ম। সীমাহীন সম্ভাবনা।', en: 'One Ecosystem. Endless Possibilities.' },
  home: { bn: 'হোম', en: 'Home' },
  chat: { bn: 'চ্যাট', en: 'Chat' },
  media: { bn: 'মিডিয়া', en: 'Media' },
  brain: { bn: 'ব্রেন', en: 'Brain' },
  care: { bn: 'কেয়ার', en: 'Care' },
  find: { bn: 'নিখোঁজ', en: 'Find' },
  profile: { bn: 'প্রোফাইল', en: 'Profile' },
  close: { bn: 'বন্ধ করুন', en: 'Close' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  confirm: { bn: 'নিশ্চিত', en: 'Confirm' },
  reset: { bn: 'রিসেট', en: 'Reset' },
  done: { bn: 'সম্পন্ন', en: 'Done' },
  search: { bn: 'অনুসন্ধান করুন...', en: 'Search...' },
  searchPlaceholder: { bn: 'খুঁজুন... (রক্ত, মানুষ, মিডিয়া)', en: 'Search anything... (blood, people, media)' },
  emergency999: { bn: 'জরুরি ৯৯৯', en: 'Emergency 999' },
  call: { bn: 'কল করুন', en: 'Call' },
  active: { bn: 'সক্রিয়', en: 'Active' },
  online: { bn: 'অনলাইন', en: 'Online' },
  offline: { bn: 'অফলাইন', en: 'Offline' },
  offlineBanner: { bn: 'অফলাইন মোড (পোস্ট ও পরিবর্তন অফলাইনে সেভ হচ্ছে)', en: 'Offline Mode (Posts and changes saved locally)' },
  syncing: { bn: 'ডেটা সিঙ্ক হচ্ছে...', en: 'Syncing data...' } ,
  synced: { bn: 'ডেটা সিঙ্ক সম্পন্ন', en: 'Data synced' },
  pendingSync: { bn: 'পেন্ডিং', en: 'pending' },
  syncNow: { bn: 'সিঙ্ক করুন', en: 'Sync Now' },
  postNow: { bn: 'পোস্ট করুন', en: 'Post' },
  writePostHope: { bn: 'নতুন পোস্ট বা জরুরি তথ্য লিখুন...', en: 'Write a new post or urgent relief note...' },
  writePostCare: { bn: 'জরুরি রক্তের আবেদন পোস্ট করুন...', en: 'Post urgent blood donation request...' },
  writePostFind: { bn: 'নিখোঁজ ব্যক্তির তথ্য পোস্ট করুন...', en: 'Report a missing person notice...' },
  writePostBrain: { bn: 'নতুন প্রশ্ন বা ডিবেট পোস্ট করুন...', en: 'Ask a health question or topic...' },
  writePostMedia: { bn: 'নতুন ভিডিও বা রিল আপলোড করুন...', en: 'Upload a new video or reel...' },
  writePostChat: { bn: 'মেসেজ বা চ্যাট লিখুন...', en: 'Write a message or chat...' },

  // Desti Hub
  togetherChange: { bn: 'একসাথে\nগড়ব\nপরিবর্তন', en: 'Together\nWe Create\nChange' },
  betterTogether: { bn: 'একসাথে\nসুন্দর', en: 'Better\nTogether' },
  activeMember: { bn: 'অ্যাক্টিভ মেম্বার', en: 'Active Member' },
  bloodGroup: { bn: 'রক্তের গ্রুপ', en: 'Blood Group' },
  hopePoints: { bn: 'হোপ পয়েন্ট', en: 'Hope Points' },
  contributions: { bn: 'অবদান', en: 'Contributions' },
  viewProfile: { bn: 'আপনার প্রোফাইল দেখুন', en: 'View Your Profile' },
  profileSubtitle: { bn: 'অ্যাক্টিভিটি • ব্যাজ • ইমপ্যাক্ট • আরো', en: 'Activity • Badges • Impact • More' },
  ecosystem: { bn: 'ডেস্টি ইকোসিস্টেম', en: 'Desti Ecosystem' },
  ecosystemSubtitle: { bn: 'যেকোনো মডিউলে দ্রুত সুইচ করুন', en: 'Switch between modules instantly' },
  manageModules: { bn: 'মডিউল কনফিগ', en: 'Manage Modules' },
  currentlyOn: { bn: 'বর্তমান মডিউল', en: 'Currently on' },
  switchModuleSubtitle: { bn: 'যেকোনো সময় অন্য মডিউলে যান', en: 'Switch to another module anytime' },
  switchModule: { bn: 'মডিউল সুইচ', en: 'Switch Module' },
  myDesti: { bn: 'মাই ডেস্টি', en: 'My Desti' },
  myDestiSubtitle: { bn: 'আপনার অভিজ্ঞতা নিয়ন্ত্রণ ও কাস্টমাইজ করুন', en: 'Control, customize and manage your experience' },
  settings: { bn: 'সেটিংস ও প্রাইভেসী', en: 'Settings & Privacy' },
  settingsSubtitle: { bn: 'সিকিউরিটি, গোপনীয়তা ও নোটিফিকেশন', en: 'Security, privacy & notifications' },
  notifications: { bn: 'নোটিফিকেশনস', en: 'Notifications' },
  notificationsSubtitle: { bn: 'অ্যালার্ট ও নতুন আপডেট', en: 'Alerts & updates' },
  account: { bn: 'অ্যাকাউন্ট ও প্রোফাইল', en: 'Account & Profile' },
  accountSubtitle: { bn: 'ব্যক্তিগত তথ্য ও পছন্দসমূহ', en: 'Personal info, preferences' },
  payments: { bn: 'পেমেন্ট ও ডোনেশন ইতিহাস', en: 'Payments & Donation History' },
  paymentsSubtitle: { bn: 'হোপ পয়েন্ট ও অনুদান তথ্য', en: 'Hope Points & donations' },
  dataSaver: { bn: 'ডাটা সেভার', en: 'Data Saver' },
  dataSaverSubtitle: { bn: 'কম ডাটা ব্যবহার করুন', en: 'Use less data' },
  storage: { bn: 'স্টোরেজ ও ক্লিয়ার স্পেস', en: 'Storage & Clear Space' },
  storageSubtitle: { bn: 'ক্যাশ খালি করে মেমোরি বাঁচান', en: 'Free up space' },
  backup: { bn: 'প্রজেক্ট ব্যাকআপ (ZIP)', en: 'Project Backup (ZIP)' },
  backupSubtitle: { bn: 'সম্পূর্ণ সোর্স কোড ডাউনলোড করুন', en: 'Download complete source code' },
  help: { bn: 'সাহায্য ও সাপোর্ট', en: 'Help & Support' },
  helpSubtitle: { bn: 'সার্বক্ষণিক সহায়তা পান', en: 'Get help anytime' },
  defaultMode: { bn: 'ডিফল্ট মোড', en: 'Default Mode' },
  defaultModeDesc: { bn: 'সব স্ট্যান্ডার্ড এলিমেন্ট দৃশ্যমান', en: 'All standard elements visible' },
  minimalMode: { bn: 'মিনিমাল মোড', en: 'Minimal Mode' },
  minimalModeDesc: { bn: 'অপ্রয়োজনীয় ব্যানার গোপন', en: 'Hides unnecessary banners' },
  cacheCleared: { bn: 'ক্যাশ মেমোরি সফলভাবে মুক্ত করা হয়েছে', en: 'Cache memory cleared successfully' },
  cacheAlreadyEmpty: { bn: 'ক্যাশ মেমোরি ইতিমধ্যেই খালি আছে', en: 'Cache memory is already empty' },
  backupStarted: { bn: 'প্রজেক্ট ব্যাকআপ ZIP ডাউনলোড শুরু হয়েছে!', en: 'Project backup ZIP download started!' },
  switchedTo: { bn: 'সুইচ করা হয়েছে:', en: 'Switched to:' },
  dataSaverOn: { bn: 'ডাটা সেভার মোড: চালু', en: 'Data Saver Mode: ON' },
  dataSaverOff: { bn: 'ডাটা সেভার মোড: বন্ধ', en: 'Data Saver Mode: OFF' },

  // Bottom Navigation Labels
  navHome: { bn: 'হোম', en: 'Home' },
  navChat: { bn: 'চ্যাট', en: 'Chat' },
  navMedia: { bn: 'মিডিয়া', en: 'Media' },
  navBrain: { bn: 'ব্রেন', en: 'Brain' },
  navCare: { bn: 'কেয়ার', en: 'Care' },
  navFind: { bn: 'নিখোঁজ', en: 'Find' },
  navProfile: { bn: 'প্রোফাইল', en: 'Profile' },
  navDonors: { bn: 'ডোনার', en: 'Donors' },
  navHospitals: { bn: 'হাসপাতাল', en: 'Hospitals' },
  navAmbulance: { bn: 'অ্যাম্বুলেন্স', en: 'Ambulance' },
  navCases: { bn: 'নিখোঁজ', en: 'Cases' },
  navRescued: { bn: 'উদ্ধার', en: 'Rescued' },
  navRadar: { bn: 'রাডার', en: 'Radar' },
  navAiDoctor: { bn: 'এআই', en: 'AI Doctor' },
  navQuestions: { bn: 'প্রশ্ন', en: 'Q&A' },
  navQuiz: { bn: 'কুইজ', en: 'Quiz' },
  navDebate: { bn: 'ডিবেট', en: 'Debate' },
  navFeed: { bn: 'ফিড', en: 'Feed' },
  navReels: { bn: 'রিলস', en: 'Reels' },
  navChannels: { bn: 'চ্যানেল', en: 'Channels' },
  navOverview: { bn: 'পরিচিতি', en: 'Overview' },
  navPoints: { bn: 'পয়েন্ট', en: 'Points' },
  navSecurity: { bn: 'নিরাপত্তা', en: 'Security' },
  navModules: { bn: 'মডিউল', en: 'Modules' },
  navNew: { bn: 'নতুন', en: 'New' },
  navGroups: { bn: 'গ্রুপ', en: 'Groups' },

  // Category Pills
  catForYou: { bn: 'আপনার জন্য', en: 'For You' },
  catBlood: { bn: 'রক্তের আবেদন', en: 'Blood Help' },
  catMissing: { bn: 'নিখোঁজ সন্ধান', en: 'Missing' },
  catNews: { bn: 'সংবাদ', en: 'News' },
  catCommunity: { bn: 'কমিউনিটি', en: 'Community' },

  // Quick Action Bar
  qaDonateBlood: { bn: 'রক্তদান', en: 'Donate Blood' },
  qaAskHelp: { bn: 'সাহায্য চান', en: 'Ask Help' },
  qaFindMissing: { bn: 'নিখোঁজ সন্ধান', en: 'Find Missing' },
  qaEmergency: { bn: 'জরুরি সেবা', en: 'Emergency' },

  // Post & Feed Actions
  like: { bn: 'পছন্দ', en: 'Like' },
  comment: { bn: 'মন্তব্য', en: 'Comment' },
  share: { bn: 'শেয়ার', en: 'Share' },
  urgent: { bn: 'জরুরি', en: 'Urgent' },
  searching: { bn: 'খোঁজা হচ্ছে', en: 'Searching' },
  bagsNeeded: { bn: 'ব্যাগ প্রয়োজন', en: 'bags needed' },
  hospital: { bn: 'হাসপাতাল', en: 'Hospital' },
  timeLeft: { bn: 'বাকি', en: 'left' },
  iWillDonate: { bn: 'আমি রক্ত দিতে প্রস্তুত', en: 'I Want to Donate' },
  shareUrgent: { bn: 'জরুরি কেস শেয়ার করুন', en: 'Share Urgent Case' },
  provideSighting: { bn: 'দেখা যাওয়ার সন্ধান দিন', en: 'Report Sighting' },
  verifiedBadge: { bn: 'যাচাইকৃত', en: 'Verified' },
  agoHours: { bn: 'ঘণ্টা আগে', en: 'hours ago' },
  agoMinutes: { bn: 'মিনিট আগে', en: 'minutes ago' },
  justNow: { bn: 'এইমাত্র', en: 'Just now' },

  // DestiCare Module
  careTag: { bn: 'DestiCare রক্তদান ও স্বাস্থ্য', en: 'DestiCare Blood & Health' },
  selectBloodGroup: { bn: 'রক্তের গ্রুপ বাছাই করুন:', en: 'Select Blood Group:' },
  allGroups: { bn: 'সব গ্রুপ', en: 'All Groups' },
  smartDonorPass: { bn: 'ডিজিটাল স্মার্ট ডোনার কার্ড (Smart Donor Pass)', en: 'Digital Smart Donor ID Card (Smart Donor Pass)' },
  verifiedDonor: { bn: 'ভেরিফায়েড ডোনার', en: 'Verified Donor' },
  donorReady: { bn: 'রক্তদানে প্রস্তুত', en: 'Ready to Donate' },
  donorAvailableNow: { bn: 'এখনই দেওয়া যাবে', en: 'Available to Donate Now' },
  totalDonations: { bn: 'মোট রক্তদান', en: 'Total Donations' },
  times: { bn: 'বার', en: 'times' },
  timesDone: { bn: 'বার সম্পন্ন', en: 'times completed' },
  donorWillingnessHeading: { bn: 'DestiCare রক্তদান ইচ্ছুকতার স্ট্যাটাস', en: 'DestiCare Donor Willingness Status' },
  donorWillingnessSub: { bn: 'রক্তের প্রয়োজনে রোগীরা আপনার লোকেশন দেখে যোগাযোগ করতে পারবে', en: 'Patients in need can view your location and contact you directly' },
  readyAndWilling: { bn: 'ইচ্ছুক ও প্রস্তুত', en: 'Ready & Available' },
  readyAfter: { bn: 'মাস পর প্রস্তুত', en: 'Available in months' },
  currentlyUnavailable: { bn: 'আপাতত বন্ধ', en: 'Unavailable' },
  ambulanceCall: { bn: 'অ্যাম্বুলেন্স কল করুন', en: 'Dispatch Ambulance' },
  ambulanceEta: { bn: 'অ্যাম্বুলেন্স পৌঁছাবে ৭ মিনিটে', en: 'Ambulance arriving in 7 minutes' },
  contactDonor: { bn: 'যোগাযোগ করুন', en: 'Contact Donor' },
  hospitalDirectory: { bn: 'হাসপাতাল ডিরেক্টরি ও আইসিইউ', en: 'Hospital Directory & ICU' },

  // DestiFind Module
  findTag: { bn: 'DestiFind নিখোঁজ মানুষ উদ্ধার হাব', en: 'DestiFind Missing Persons Rescue Hub' },
  reportMissingBtn: { bn: 'নিখোঁজ রিপোর্ট করুন', en: 'Report Missing Person' },
  activeCases: { bn: 'চলমান নিখোঁজ কেস', en: 'Active Missing Cases' },
  solvedCases: { bn: 'উদ্ধার হওয়া ব্যক্তি', en: 'Successfully Rescued' },
  lastSeenLocation: { bn: 'সর্বশেষ অবস্থান:', en: 'Last Seen Location:' },
  lastSeenDate: { bn: 'নিখোঁজের তারিখ:', en: 'Date Missing:' },
  contactGuardian: { bn: 'অভিভাবকের নম্বর:', en: 'Guardian Contact:' },
  reportSightingBtn: { bn: 'দেখা গেছে এমন তথ্য দিন', en: 'Report Sighting' },

  // DestiBrain Module
  brainTag: { bn: 'DestiBrain জ্ঞানভাণ্ডার ও এআই স্বাস্থ্য সেবা', en: 'DestiBrain Health Knowledge & AI Consultation' },
  aiDoctorTitle: { bn: 'এআই স্বাস্থ্য সহকারী', en: 'AI Health Doctor' },
  aiDoctorSub: { bn: 'লক্ষণ বিশ্লেষণ ও প্রাথমিক চিকিৎসা পরামর্শ', en: 'Symptom analysis & first-aid guidance' },
  askQuestion: { bn: 'প্রশ্ন জিজ্ঞাসা করুন', en: 'Ask a Question' },
  dailyQuiz: { bn: 'দৈনিক স্বাস্থ্য কুইজ', en: 'Daily Health Quiz' },
  debateHub: { bn: 'লাইভ হেলথ ডিবেট', en: 'Live Health Debate' },
  score: { bn: 'স্কোর:', en: 'Score:' },
  voteFor: { bn: 'পক্ষে ভোট', en: 'Vote For' },
  voteAgainst: { bn: 'বিপক্ষে ভোট', en: 'Vote Against' },

  // DestiMedia Module
  mediaTag: { bn: 'DestiMedia ভিডিও ও সচেতনতা হাব', en: 'DestiMedia Video & Awareness Hub' },
  uploadVideoBtn: { bn: 'ভিডিও আপলোড', en: 'Upload Video' },
  shortsReels: { bn: 'শর্টস ও রিলস', en: 'Shorts & Reels' },
  subscribe: { bn: 'সাবস্ক্রাইব', en: 'Subscribe' },
  subscribed: { bn: 'সাবস্ক্রাইবড', en: 'Subscribed' },
  views: { bn: 'ভিউ', en: 'views' },

  // DestiChat Module
  chatTag: { bn: 'DestiChat সুরক্ষিত মেসেজিং হাব', en: 'DestiChat Encrypted Messaging Hub' },
  typeMessage: { bn: 'একটি মেসেজ লিখুন...', en: 'Type a message...' },
  voiceCall: { bn: 'ভয়েস কল', en: 'Voice Call' },
  videoCall: { bn: 'ভিডিও কল', en: 'Video Call' },
  endCall: { bn: 'কল শেষ করুন', en: 'End Call' },
  encryptedNote: { bn: 'এন্ড-টু-এন্ড এনক্রিপ্টেড নিরাপদ চ্যাট', en: 'End-to-end encrypted secure chat' },

  // Language Switch
  languageLabel: { bn: 'বাংলা', en: 'English' },
  languageSwitchPrompt: { bn: 'ভাষা পরিবর্তন', en: 'Language Switch' },
  switchSuccessEn: { bn: 'ভাষা পরিবর্তন করে ইংরেজি করা হয়েছে', en: 'Language switched to English' },
  switchSuccessBn: { bn: 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে', en: 'Language switched to Bengali' },

  // General Actions
  viewDetails: { bn: 'বিস্তারিত দেখুন', en: 'View Details' },
  contact: { bn: 'যোগাযোগ:', en: 'Contact:' },
  bloodNeeded: { bn: 'রক্ত প্রয়োজন', en: 'Blood Needed' },
  missingAlert: { bn: 'নিখোঁজ', en: 'Missing' },
  highPriority: { bn: 'জরুরি', en: 'URGENT' },
  copyPhone: { bn: 'নম্বর কপি করুন', en: 'Copy Phone' },
  copied: { bn: 'কপি হয়েছে', en: 'Copied' },
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  l: (bn: string, en: string) => string;
  isBn: boolean;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('destihope_language');
    return (saved as Language) || 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('destihope_language', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (!item) return fallback || key;
    return item[language] || fallback || item.en || key;
  };

  const l = (bn: string, en: string): string => {
    return language === 'en' ? en : bn;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        l,
        isBn: language === 'bn',
        isEn: language === 'en'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

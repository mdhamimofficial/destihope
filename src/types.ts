export type ActiveModule = 'hope' | 'chat' | 'media' | 'brain' | 'care' | 'find' | 'profile';

export type FeedCategory = 'For You' | 'Blood Help' | 'Missing' | 'News' | 'Community';

export interface HubManualControls {
  showLiveAlert: boolean;          // জরুরি লাইভ অ্যালার্ট ব্যানার
  showQuickActions: boolean;       // কুইক অ্যাকশন বোতাম বার
  showCategoryPills: boolean;      // ক্যাটাগরি ফিল্টার পিলস
  compactFeedMode: boolean;        // কমপ্যাক্ট/ঘন ফিড মোড
  autoPlayMedia: boolean;          // মিডিয়া অটো-প্লে
  showModuleBadges: boolean;       // নোটিফিকেশন রেড ব্যাজ ও কাউন্টার
  enableAnimations: boolean;       // ফ্লুইড অ্যানিমেশন ও মোশন
  hapticSoundFeedback: boolean;    // ইন্টারঅ্যাকশন সাউন্ড/হ্যাপটিক
  autoCloseOrbitTimer: boolean;    // ৫-সেকেন্ড অটো-ক্লোজ টাইমার
  dataSaver: boolean;              // ডাটা সেভার
  highContrastMode: boolean;       // হাই কনট্রাস্ট মোড
}

export interface FeedPost {
  id: string;
  type: 'blood' | 'missing' | 'news' | 'social';
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    moduleBadge?: string;
    iconBg?: string;
  };
  timeAgo: string;
  location?: string;
  badges?: { text: string; color: string; bg: string }[];
  image?: string;
  title?: string;
  content: string;
  bloodDetails?: {
    group: string;
    bagsNeeded: number;
    hospital: string;
    deadlineHours: number;
    timeRemainingText: string;
    progressPercent: number;
    contactPhone: string;
  };
  missingDetails?: {
    personName: string;
    lastSeenDate: string;
    lastSeenLocation: string;
    clothingDescription: string;
    caseId: string;
    status: 'Searching' | 'Found' | 'Closed';
    contactPhone: string;
  };
  newsDetails?: {
    source: string;
    category: string;
    reads?: number;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  hopePointsReward?: number;
  isPendingSync?: boolean;
  syncedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other' | 'system';
  text: string;
  time: string;
  type?: 'text' | 'image' | 'voice' | 'location' | 'case_card' | 'blood_card' | 'missing_card' | 'brain_card' | 'media_card';
  mediaUrl?: string;
  duration?: string;
  moduleOrigin?: 'hope' | 'care' | 'find' | 'brain' | 'media';
  caseCardData?: {
    title: string;
    desc: string;
    badge: string;
    bloodGroup?: string;
    hospital?: string;
    phone?: string;
    caseId?: string;
    photo?: string;
    status?: string;
    actionLabel?: string;
    secondaryActionLabel?: string;
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  avatar: string;
  type: 'personal' | 'group' | 'blood_chat' | 'missing_chat' | 'saved';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned?: boolean;
  isSaved?: boolean;
  onlineStatus?: boolean;
  membersCount?: number;
  badge?: string;
  moduleOrigin?: 'hope' | 'care' | 'find' | 'brain' | 'media';
  moduleTag?: string;
  phone?: string;
  verified?: boolean;
}

export interface MediaItem {
  id: string;
  type: 'video' | 'reel' | 'audio';
  title: string;
  creator: {
    name: string;
    avatar: string;
    isVerified: boolean;
    subscribers?: string;
  };
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  views: string;
  uploadDate: string;
  likes: number;
  commentsCount: number;
  category: string;
  description?: string;
  chapters?: { time: string; title: string; seconds: number }[];
  isFactChecked?: boolean;
  factCheckedBy?: string;
  lifeAction?: { label: string; actionType: 'blood' | 'find' | 'emergency'; targetModule: string; linkText: string };
  hopeReward?: number;
}

export interface BrainQuestion {
  id: string;
  title: string;
  category?: string;
  author: string;
  votes: number;
  upvotes?: number;
  answersCount: number;
  hasAcceptedAnswer?: boolean;
  timeAgo?: string;
  time?: string;
  tags: string[];
}

export interface DebateTopic {
  id: string;
  title?: string;
  motion: string;
  category: string;
  forVotes: number;
  againstVotes: number;
  activeSpeakers: number;
  status: 'Live' | 'Voting' | 'Concluded';
  description: string;
}

export interface HospitalDirectoryItem {
  id: string;
  name: string;
  district: string;
  upazila?: string;
  division?: string;
  address: string;
  emergencyPhone: string;
  ambulancePhone: string;
  phone?: string;
  verified: boolean;
  departments: string[];
  bloodBankAvailable: boolean;
  icuStatus: string;
  icuAvailable?: number;
}

export type DonorWillingnessStatus = 'available' | 'after_months' | 'unavailable';

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  district: string;
  upazila?: string;
  division?: string;
  area: string;
  phone: string;
  lastDonation: string;
  donationsCount: number;
  totalDonations?: number;
  badge: 'Life Saver' | 'Blood Hero' | 'First Donor' | 'Regular Donor';
  isAvailable: boolean;
  willingnessStatus?: DonorWillingnessStatus;
  availableAfterMonths?: number;
  availableDateNote?: string;
  willingNote?: string;
}

export interface MissingCase {
  id: string;
  caseId: string;
  personName: string;
  age: number;
  photo: string;
  gender: string;
  lastSeenLocation: string;
  district: string;
  lastSeenTime: string;
  lastSeenDate?: string;
  description: string;
  guardianContact: string;
  contactPhone?: string;
  status: 'Searching' | 'Found' | 'Closed';
  verifiedCase?: boolean;
  policeCaseId?: string;
  reportedDate: string;
}

export interface ModuleProfileCare {
  donorWillingness: DonorWillingnessStatus;
  availableAfterMonths?: number;
  availableDateNote?: string;
  willingNote?: string;
  bloodGroup: string;
  totalDonations: number;
  lastDonationDate: string;
  district: string;
  area: string;
  phone: string;
  emergencyAlertEnabled: boolean;
}

export interface ModuleProfileFind {
  isVolunteerActive: boolean;
  searchRadiusKm: number;
  rescuesAssisted: number;
  specialSkills: string[];
  verifiedRescuer: boolean;
  alertNotification: boolean;
}

export interface ModuleProfileBrain {
  healthLearnerRank: string;
  quizzesCompleted: number;
  knowledgeScore: number;
  preferredTopics: string[];
  aiConsultationsCount: number;
}

export interface ModuleProfileMedia {
  isCommunityReporter: boolean;
  broadcastsShared: number;
  verifiedReports: number;
  reputationScore: number;
}

export interface ModuleProfileChat {
  isHelplineHelper: boolean;
  averageResponseTime: string;
  helpedUsersCount: number;
}

export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  phone: string;
  district: string;
  area?: string;
  bloodGroup: string;
  hopePoints: number;
  totalDonations?: number;
  badges: string[];
  role: 'General User' | 'Verified Rescuer' | 'Blood Hero' | 'Moderator' | 'Founder';
  isDonorAvailable: boolean;
  donorWillingness?: DonorWillingnessStatus;
  availableAfterMonths?: number;
  availableDateNote?: string;
  willingNote?: string;
  moduleProfiles?: {
    care?: ModuleProfileCare;
    find?: ModuleProfileFind;
    brain?: ModuleProfileBrain;
    media?: ModuleProfileMedia;
    chat?: ModuleProfileChat;
  };
  stats: {
    donations: number;
    rescuesAssisted: number;
    answersGiven: number;
    postsCount: number;
  };
}

import { FeedPost, ChatConversation, MediaItem, BrainQuestion, DebateTopic, HospitalDirectoryItem, BloodDonor, MissingCase, UserProfile } from '../types';

export const initialFeedPosts: FeedPost[] = [
  {
    id: 'blood-1',
    type: 'blood',
    author: {
      name: 'DestiBloodBank',
      avatar: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Care',
      iconBg: 'bg-red-500'
    },
    timeAgo: '২ ঘণ্টা আগে',
    location: 'ঢাকা',
    badges: [
      { text: 'জরুরি', color: 'text-red-700', bg: 'bg-red-100' },
      { text: 'HIGH', color: 'text-white', bg: 'bg-red-600' }
    ],
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=400&q=80',
    title: 'O+ রক্ত প্রয়োজন',
    content: 'ঢাকা মেডিকেল কলেজ হাসপাতাল একজন রোগীর জন্য জরুরি ভিত্তিতে O+ রক্ত প্রয়োজন। যারা দিতে পারেন অনুগ্রহ করে যোগাযোগ করুন।',
    bloodDetails: {
      group: 'O+',
      bagsNeeded: 2,
      hospital: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
      deadlineHours: 3,
      timeRemainingText: '০২:১৫:৩০ বাকি',
      progressPercent: 68,
      contactPhone: '01712-345678'
    },
    likes: 84,
    comments: 19,
    shares: 45,
    hopePointsReward: 10
  },
  {
    id: 'missing-1',
    type: 'missing',
    author: {
      name: 'DestiFind',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Find',
      iconBg: 'bg-teal-600'
    },
    timeAgo: '৫ ঘণ্টা আগে',
    location: 'চট্টগ্রাম',
    badges: [
      { text: 'নিখোঁজ', color: 'text-amber-800', bg: 'bg-orange-100' },
      { text: 'খোঁজা হচ্ছে', color: 'text-yellow-900', bg: 'bg-amber-200' }
    ],
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    title: 'নিখোঁজ: সামিউল ইসলাম',
    content: 'গত ১৬ এপ্রিল ২০২৫, বিকাল ৫:৩০ মিনিটে আগ্রাবাদ, চট্টগ্রাম এলাকার শেষ দেখা গেছে। পরনে ছিল নীল টি-শার্ট ও কালো জিন্স।',
    missingDetails: {
      personName: 'সামিউল ইসলাম',
      lastSeenDate: '১৬ এপ্রিল ২০২৫',
      lastSeenLocation: 'আগ্রাবাদ, চট্টগ্রাম',
      clothingDescription: 'নীল টি-শার্ট ও কালো জিন্স',
      caseId: 'FIND-BD-8902',
      status: 'Searching',
      contactPhone: '01823-998877'
    },
    likes: 132,
    comments: 28,
    shares: 89,
    hopePointsReward: 10
  },
  {
    id: 'news-1',
    type: 'news',
    author: {
      name: 'DestiNews',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'News',
      iconBg: 'bg-blue-600'
    },
    timeAgo: '৮ ঘণ্টা আগে',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    title: 'পরিষ্কার নদী, সুস্থ শহর: নতুন উদ্যোগ',
    content: 'বাংলাদেশের প্রধান শহরগুলোতে নদী পুনরুদ্ধারে নতুন কর্মসূচি গ্রহণ করেছে সরকার, জানালেন পরিবেশ উপদেষ্টা। নদীর নাব্যতা বৃদ্ধি ও দূষণ রোধে ড্রোন সার্ভিল্যান্স চালু হবে।',
    newsDetails: {
      source: 'জাতীয় পরিবেশ সেল',
      category: 'পরিবেশ ও প্রযুক্তি',
      reads: 3240
    },
    likes: 256,
    comments: 42,
    shares: 18
  },
  {
    id: 'social-1',
    type: 'social',
    author: {
      name: 'ড. রফিকুল ইসলাম',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    timeAgo: '১২ ঘণ্টা আগে',
    location: 'রাজশাহী',
    title: 'সম্প্রদায়ের ঐক্য ও রক্তদানের মহত্ব',
    content: 'আজকে রাজশাহী মেডিকেল কলেজে এক যুবকের ডাকে মাত্র ২০ মিনিটে ৩ জন স্বেচ্ছাসেবী রক্তদাতা এগিয়ে এসেছেন। DestiHope প্ল্যাটফর্মের পারস্পরিক বিশ্বাসই আমাদের শক্তি। সবাইকে আন্তরিক ধন্যবাদ!',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80',
    likes: 412,
    comments: 53,
    shares: 34
  },
  {
    id: 'blood-2',
    type: 'blood',
    author: {
      name: 'DestiBloodBank',
      avatar: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Care',
      iconBg: 'bg-red-500'
    },
    timeAgo: '৩ ঘণ্টা আগে',
    location: 'সিলেট',
    badges: [
      { text: 'জরুরি', color: 'text-red-700', bg: 'bg-red-100' },
      { text: 'B+ রক্ত', color: 'text-white', bg: 'bg-red-500' }
    ],
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
    title: 'B+ রক্ত প্রয়োজন',
    content: 'সিলেট এমএজি ওসমানী মেডিকেল কলেজ হাসপাতালে নবজাতকের অস্ত্রোপচারের জন্য জরুরি ১ ব্যাগ B+ রক্ত প্রয়োজন।',
    bloodDetails: {
      group: 'B+',
      bagsNeeded: 1,
      hospital: 'সিলেট এমএজি ওসমানী মেডিকেল কলেজ',
      deadlineHours: 4,
      timeRemainingText: '০৩:৪০:০০ বাকি',
      progressPercent: 40,
      contactPhone: '01711-223344'
    },
    likes: 56,
    comments: 12,
    shares: 22,
    hopePointsReward: 10
  }
];

export const mockConversations: ChatConversation[] = [
  {
    id: 'chat-1',
    title: 'সাদিয়া তাসনিম (A+ রক্তদাতা)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    type: 'blood_chat',
    moduleOrigin: 'care',
    moduleTag: 'DestiCare রক্তদান',
    lastMessage: 'ভাই, আমি ধানমন্ডি থেকে রওনা হয়েছি। ঢামেক ইমার্জেন্সিতে আসছি।',
    lastMessageTime: '২ মি. আগে',
    unreadCount: 2,
    isPinned: true,
    onlineStatus: true,
    phone: '01822-334455',
    verified: true,
    badge: 'A+ ডোনার'
  },
  {
    id: 'chat-2',
    title: 'সামিউল সন্ধান দল (চট্টগ্রাম)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    type: 'missing_chat',
    moduleOrigin: 'find',
    moduleTag: 'DestiFind নিখোঁজ কেস #৭৮২',
    lastMessage: 'আগ্রাবাদ সিডিএ এলাকায় মাইকিং সম্পন্ন হয়েছে। লাইভ আপডেট চেক করুন।',
    lastMessageTime: '১০ মি. আগে',
    unreadCount: 3,
    isPinned: true,
    onlineStatus: true,
    membersCount: 18,
    badge: 'উদ্ধার দল'
  },
  {
    id: 'chat-3',
    title: 'তানভীর আহমেদ (DestiHope ফ্রেন্ড)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    type: 'personal',
    moduleOrigin: 'hope',
    moduleTag: 'DestiHope ডিরেক্ট মেসেজ',
    lastMessage: 'আপনার পোস্টটা দেখলাম ভাই! রক্ত ম্যানেজ হয়েছে কি না জানাবেন।',
    lastMessageTime: '২৫ মি. আগে',
    unreadCount: 0,
    onlineStatus: true,
    phone: '01711-998877',
    verified: true
  },
  {
    id: 'chat-4',
    title: 'এআই হেলথ ডক্টর (DestiBrain)',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    type: 'personal',
    moduleOrigin: 'brain',
    moduleTag: 'DestiBrain এআই কনসালটেশন',
    lastMessage: 'প্লাটিলেট টেস্টের রিপোর্ট অনুযায়ী আপনার ফ্লুইড ইনটেক বাড়ানো প্রয়োজন।',
    lastMessageTime: '৪৫ মি. আগে',
    unreadCount: 1,
    onlineStatus: true,
    badge: 'AI ডক্টর'
  },
  {
    id: 'chat-5',
    title: 'ঢামেক ট্রান্সফিউশন ও আইসিইউ হেল্প ডেস্ক',
    avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150',
    type: 'blood_chat',
    moduleOrigin: 'care',
    moduleTag: 'DestiCare হসপিটাল ডেস্ক',
    lastMessage: 'রোগীর বেড নম্বর ১২৭ (আইসিইউ ৩)। ক্রস-ম্যাচিং স্লিপ প্রস্তুত আছে।',
    lastMessageTime: '১ ঘণ্টা আগে',
    unreadCount: 0,
    onlineStatus: true,
    phone: '01711-223344',
    verified: true,
    badge: 'হাসপাতাল'
  },
  {
    id: 'chat-6',
    title: 'বাংলা ইনসাইটস (DestiMedia ক্রিয়েটর)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    type: 'personal',
    moduleOrigin: 'media',
    moduleTag: 'DestiMedia আলোচনা',
    lastMessage: 'রক্তদান সচেতনতা নিয়ে বানানো নতুন ভিডিওটি ড্রাফট পাঠিয়েছি। দেখবেন প্লিজ।',
    lastMessageTime: '২ ঘণ্টা আগে',
    unreadCount: 0,
    onlineStatus: false,
    badge: 'ভিডিও ক্রিয়েটর'
  },
  {
    id: 'chat-7',
    title: 'Desti Brain ডিবেট ফোরাম',
    avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80',
    type: 'group',
    moduleOrigin: 'brain',
    moduleTag: 'DestiBrain স্টাডি সার্কেল',
    lastMessage: 'আজ রাত ৯টায় নতুন মোশন: এআই ও ভবিষ্যৎ কর্মসংস্থান।',
    lastMessageTime: '৩ ঘণ্টা আগে',
    unreadCount: 0,
    membersCount: 142
  },
  {
    id: 'chat-8',
    title: 'Desti ভলান্টিয়ার ইমার্জেন্সি স্কোয়াড',
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80',
    type: 'group',
    moduleOrigin: 'care',
    moduleTag: 'রেসকিউ টিম ঢাকা',
    lastMessage: 'সেন্ট্রাল ব্লাড ব্যাংক কোঅর্ডিনেশনের নতুন শিফট তালিকা আপডেট করা হয়েছে।',
    lastMessageTime: '৪ ঘণ্টা আগে',
    unreadCount: 0,
    membersCount: 68,
    badge: 'জরুরি দল'
  },
  {
    id: 'chat-saved',
    title: 'সংরক্ষিত বার্তা (Saved Messages)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    type: 'saved',
    moduleOrigin: 'hope',
    moduleTag: 'ব্যক্তিগত নোট ও বুকমার্ক',
    lastMessage: '📌 [সংরক্ষিত ইমার্জেন্সি নোট]: ঢামেক হেমাটোলজি জরুরি রক্তের হটলাইন: ০২-৯৩৩০১৮৬ | সেন্ট্রাল ভলান্টিয়ার ডেস্ক: ০৯৬১২-০০০৯৯৯',
    lastMessageTime: 'আজ, ০৮:৪৫ AM',
    unreadCount: 0,
    isPinned: true,
    isSaved: true,
    badge: 'সংরক্ষিত'
  }
];

export const mockMediaList: MediaItem[] = [
  {
    id: 'media-1',
    type: 'video',
    title: 'পদ্মা রেল সংযোগ: দক্ষিণাঞ্চলের অর্থনীতিতে নতুন দিগন্ত',
    creator: {
      name: 'বাংলা ইনসাইটস',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      isVerified: true,
      subscribers: '124K'
    },
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
    duration: '14:25',
    views: '45K',
    uploadDate: '১ দিন আগে',
    likes: 3800,
    commentsCount: 145,
    category: 'উন্নয়ন ও অর্থনীতি'
  },
  {
    id: 'reel-1',
    type: 'reel',
    title: 'মাত্র ১০ মিনিটে কীভাবে রক্তদানের প্রস্তুতি নিবেন? 🩸',
    creator: {
      name: 'DestiCare টিপস',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80',
      isVerified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    duration: '0:45',
    views: '120K',
    uploadDate: '৩ ঘণ্টা আগে',
    likes: 12400,
    commentsCount: 310,
    category: 'স্বাস্থ্য'
  },
  {
    id: 'reel-2',
    type: 'reel',
    title: 'হারানো মানুষ খুঁজে পেতে ড্রোনের বাস্তব প্রয়োগ!',
    creator: {
      name: 'রেসকিউ নেটওয়ার্ক বিডি',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      isVerified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80',
    duration: '0:58',
    views: '89K',
    uploadDate: '৬ ঘণ্টা আগে',
    likes: 8900,
    commentsCount: 220,
    category: 'প্রযুক্তি ও উদ্ধার'
  },
  {
    id: 'audio-1',
    type: 'audio',
    title: 'পডকাস্ট #১২: তরুণ প্রজন্মের নাগরিক দায়িত্ব ও সামাজিক পরিবর্তন',
    creator: {
      name: 'ভয়েস অফ ঢাকা',
      avatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=120&q=80',
      isVerified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    duration: '32:10',
    views: '15K',
    uploadDate: '২ দিন আগে',
    likes: 1200,
    commentsCount: 94,
    category: 'পডকাস্ট'
  }
];

export const mockBrainQuestions: BrainQuestion[] = [
  {
    id: 'q-1',
    title: 'এইচএসসি ২০২৫ শিক্ষার্থীদের জন্য আইসিটি ৩য় অধ্যায়ের ডিজিটাল লজিক সহজে বোঝার উপায় কী?',
    category: 'শিক্ষা ও আইসিটি',
    author: 'তাহসিন রহমান',
    votes: 48,
    answersCount: 14,
    hasAcceptedAnswer: true,
    timeAgo: '৪ ঘণ্টা আগে',
    tags: ['এইচএসসি', 'আইসিটি', 'ডিজিটাল লজিক']
  },
  {
    id: 'q-2',
    title: 'বিসিএস প্রিলির জন্য বাংলাদেশের সংবিধানের গুরুত্বপূর্ণ অনুচ্ছেদগুলো কীভাবে দ্রুত মনে রাখা যায়?',
    category: 'বিসিএস ও ক্যারিয়ার',
    author: 'ফারহানা ইয়াসমিন',
    votes: 92,
    answersCount: 26,
    hasAcceptedAnswer: true,
    timeAgo: '১ দিন আগে',
    tags: ['বিসিএস', 'সংবিধান', 'সাধারণ জ্ঞান']
  },
  {
    id: 'q-3',
    title: 'রক্তদানের পর শরীরে পুনরায় রক্ত তৈরি হতে কতদিন সময় লাগে এবং কী খাবার খাওয়া উচিত?',
    category: 'স্বাস্থ্য বিজ্ঞান',
    author: 'নাঈম হাসান',
    votes: 65,
    answersCount: 8,
    hasAcceptedAnswer: true,
    timeAgo: '২ দিন আগে',
    tags: ['রক্তদান', 'স্বাস্থ্য', 'পুষ্টি']
  }
];

export const mockDebateTopics: DebateTopic[] = [
  {
    id: 'debate-1',
    motion: 'শিক্ষাক্ষেত্রে কৃত্রিম বুদ্ধিমত্তা (AI)-এর ব্যবহার শিক্ষার্থীদের সৃজনশীলতা বৃদ্ধির চেয়ে অলসতা বাড়াচ্ছে।',
    category: 'শিক্ষা ও প্রযুক্তি',
    forVotes: 642,
    againstVotes: 718,
    activeSpeakers: 28,
    status: 'Live',
    description: 'এই বিতর্কে পক্ষে যুক্তি দেওয়া হচ্ছে যে এআই হোমওয়ার্ক করে দিলে শেখার প্রক্রিয়া ব্যাহত হয়। বিপক্ষে যুক্তি হচ্ছে এআই ব্যক্তিগত টিউটর হিসেবে চিন্তার দিগন্ত খুলে দেয়।'
  },
  {
    id: 'debate-2',
    motion: 'সোশ্যাল মিডিয়ার তথ্যের সত্যতা যাচাই বাধ্যতামূলক করার আইন নাগরিক মতপ্রকাশের স্বাধীনতা ক্ষুণ্ণ করবে না।',
    category: 'আইন ও সমাজ',
    forVotes: 890,
    againstVotes: 512,
    activeSpeakers: 15,
    status: 'Voting',
    description: 'গুজব রোধ এবং সত্য তথ্য রক্ষার দাবিতে আইন প্রণয়ন বনাম নাগরিক নজরদারির আশঙ্কা।'
  }
];

export const mockHospitals: HospitalDirectoryItem[] = [
  {
    id: 'hosp-1',
    name: 'ঢাকা মেডিকেল কলেজ হাসপাতাল (DMCH)',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'রমনা',
    address: 'বকশিবাজার, ঢাকা ১০০০',
    emergencyPhone: '02-55165600',
    ambulancePhone: '01711-000001',
    verified: true,
    departments: ['ইমার্জেন্সি', 'কার্ডিওলজি', 'বার্ন ও প্লাস্টিক সার্জারি', 'আইসিইউ', 'ব্লাড ব্যাংক'],
    bloodBankAvailable: true,
    icuStatus: '৪টি সিট খালি আছে'
  },
  {
    id: 'hosp-2',
    name: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল (CMCH)',
    division: 'চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    upazila: 'পাঁচলাইশ',
    address: 'কে বি ফজলুল কাদের রোড, চট্টগ্রাম',
    emergencyPhone: '031-616335',
    ambulancePhone: '01819-000002',
    verified: true,
    departments: ['ট্রমা ও জরুরি', 'নিউরোলজি', 'শিশু বিভাগ', 'ব্লাড ট্রান্সফিউশন'],
    bloodBankAvailable: true,
    icuStatus: '২টি সিট খালি আছে'
  },
  {
    id: 'hosp-3',
    name: 'বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU)',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'শাহবাগ',
    address: 'শাহবাগ, ঢাকা ১০০০',
    emergencyPhone: '02-9661051',
    ambulancePhone: '01712-000003',
    verified: true,
    departments: ['হেমাটোলজি', 'অনকোলজি', 'নেফ্রোলজি', 'সুপার স্পেশালাইজড'],
    bloodBankAvailable: true,
    icuStatus: '১টি সিট খালি আছে'
  },
  {
    id: 'hosp-4',
    name: 'রাজশাহী মেডিকেল কলেজ হাসপাতাল (RMCH)',
    division: 'রাজশাহী',
    district: 'রাজশাহী',
    upazila: 'রাজপাড়া',
    address: 'লক্ষ্মীপুর, রাজশাহী',
    emergencyPhone: '0721-772150',
    ambulancePhone: '01713-000004',
    verified: true,
    departments: ['জরুরি বিভাগ', 'সার্জারি', 'ব্লাড ব্যাংক'],
    bloodBankAvailable: true,
    icuStatus: '৩টি সিট খালি আছে'
  },
  {
    id: 'hosp-5',
    name: 'শহীদ সোহরাওয়ার্দী মেডিকেল কলেজ হাসপাতাল',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'মোহাম্মদপুর',
    address: 'শেরেবাংলা নগর, ঢাকা',
    emergencyPhone: '02-48110000',
    ambulancePhone: '01715-000005',
    verified: true,
    departments: ['ইমার্জেন্সি', 'মেডিসিন', 'গাইনী', 'ব্লাড ব্যাংক'],
    bloodBankAvailable: true,
    icuStatus: '২টি সিট খালি আছে'
  },
  {
    id: 'hosp-6',
    name: 'খুলনা মেডিকেল কলেজ হাসপাতাল',
    division: 'খুলনা',
    district: 'খুলনা',
    upazila: 'খুলনা সদর',
    address: 'বয়রা, খুলনা',
    emergencyPhone: '041-760350',
    ambulancePhone: '01714-000006',
    verified: true,
    departments: ['জরুরি', 'কার্ডিওলজি', 'ব্লাড ব্যাংক'],
    bloodBankAvailable: true,
    icuStatus: '১টি সিট খালি আছে'
  },
  {
    id: 'hosp-7',
    name: 'সিলেট এমএজি ওসমানী মেডিকেল কলেজ',
    division: 'সিলেট',
    district: 'সিলেট',
    upazila: 'কোতোয়ালী',
    address: 'মেডিকেল রোড, সিলেট',
    emergencyPhone: '0821-713667',
    ambulancePhone: '01716-000007',
    verified: true,
    departments: ['জরুরি বিভাগ', 'আইসিইউ', 'ব্লাড ট্রান্সফিউশন'],
    bloodBankAvailable: true,
    icuStatus: '৩টি সিট খালি আছে'
  }
];

export const mockDonors: BloodDonor[] = [
  {
    id: 'donor-1',
    name: 'তানভীর আহমেদ',
    bloodGroup: 'O+',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'ধানমন্ডি',
    area: 'ধানমন্ডি',
    phone: '01712-345678',
    lastDonation: '৪ মাস আগে',
    donationsCount: 8,
    badge: 'Blood Hero',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'যেকোনো সময় জরুরি প্রয়োজনে রক্ত দিতে প্রস্তুত।'
  },
  {
    id: 'donor-2',
    name: 'সাব্বির হোসেন',
    bloodGroup: 'A+',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'মিরপুর',
    area: 'মিরপুর ১০',
    phone: '01819-456789',
    lastDonation: '৫ মাস আগে',
    donationsCount: 4,
    badge: 'Life Saver',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'মিরপুর ও আশেপাশের এলাকায় দ্রুত যেতে পারব।'
  },
  {
    id: 'donor-3',
    name: 'আরিফুল ইসলাম',
    bloodGroup: 'B+',
    division: 'চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    upazila: 'পাঁচলাইশ',
    area: 'জিইসি মোড়',
    phone: '01912-334455',
    lastDonation: '৬ মাস আগে',
    donationsCount: 3,
    badge: 'Regular Donor',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'চট্টগ্রাম শহরের যেকোনো হাসপাতালে যেতে পারব।'
  },
  {
    id: 'donor-4',
    name: 'নুসরাত জাহান',
    bloodGroup: 'AB+',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'উত্তরা',
    area: 'উত্তরা সেক্টর ৭',
    phone: '01611-889900',
    lastDonation: '১ মাস আগে',
    donationsCount: 2,
    badge: 'Regular Donor',
    isAvailable: false,
    willingnessStatus: 'after_months',
    availableAfterMonths: 2,
    availableDateNote: '২ মাস পর প্রস্তুত (নভেম্বর ২০২৬)',
    willingNote: 'গত মাসে রক্ত দিয়েছি, ডাক্তার পরামর্শ অনুযায়ী ২ মাস পর আবার দিতে পারব।'
  },
  {
    id: 'donor-5',
    name: 'হাসান মাহমুদ',
    bloodGroup: 'O-',
    division: 'সিলেট',
    district: 'সিলেট',
    upazila: 'কোতোয়ালী',
    area: 'জিন্দাবাজার',
    phone: '01733-112233',
    lastDonation: '৫ মাস আগে',
    donationsCount: 6,
    badge: 'Life Saver',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'O নেগেটিভ বিরল গ্রুপ, জরুরি ডাক পেলে সাথে সাথে আসব।'
  },
  {
    id: 'donor-6',
    name: 'মেহেদী হাসান রনি',
    bloodGroup: 'B-',
    division: 'রাজশাহী',
    district: 'রাজশাহী',
    upazila: 'বোয়ালিয়া',
    area: 'সাহেব বাজার',
    phone: '01718-990011',
    lastDonation: '৪ মাস আগে',
    donationsCount: 5,
    badge: 'Blood Hero',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'রাজশাহী সদর ও মেডিকেল এলাকায় উপস্থিত থাকতে পারব।'
  },
  {
    id: 'donor-7',
    name: 'নাজমুল সাকিব',
    bloodGroup: 'A-',
    division: 'খুলনা',
    district: 'খুলনা',
    upazila: 'সোনাডাঙ্গা',
    area: 'সোনাডাঙ্গা বাস স্ট্যান্ড',
    phone: '01814-223344',
    lastDonation: '২ মাস আগে',
    donationsCount: 3,
    badge: 'Regular Donor',
    isAvailable: false,
    willingnessStatus: 'after_months',
    availableAfterMonths: 1,
    availableDateNote: '১ মাস পর প্রস্তুত (অক্টোবর ২০২৬)',
    willingNote: 'বর্তমানে একটু ঠাণ্ডা জ্বর, আগামী মাস থেকে প্রস্তুত থাকব।'
  },
  {
    id: 'donor-8',
    name: 'সাদিয়া আফরিন',
    bloodGroup: 'O+',
    division: 'চট্টগ্রাম',
    district: 'কুমিল্লা',
    upazila: 'কুমিল্লা আদর্শ সদর',
    area: 'কান্দিরপাড়',
    phone: '01915-556677',
    lastDonation: '৪ মাস আগে',
    donationsCount: 4,
    badge: 'Life Saver',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'কুমিল্লা সদরে যেকোনো সময় রক্ত দিতে পারব।'
  },
  {
    id: 'donor-9',
    name: 'কামরুল হাসান',
    bloodGroup: 'A+',
    division: 'রংপুর',
    district: 'রংপুর',
    upazila: 'রংপুর সদর (কোতোয়ালী)',
    area: 'পায়রা চত্বর',
    phone: '01725-778899',
    lastDonation: '৫ মাস আগে',
    donationsCount: 7,
    badge: 'Blood Hero',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'রংপুর মেডিকেল কলেজ হাসপাতালে রক্তদানে অগ্রাধিকার দেব।'
  },
  {
    id: 'donor-10',
    name: 'ফাহিম মোর্শেদ',
    bloodGroup: 'B+',
    division: 'ময়মনসিংহ',
    district: 'ময়মনসিংহ',
    upazila: 'ময়মনসিংহ সদর (কোতোয়ালী)',
    area: 'গাঙ্গিনার পাড়',
    phone: '01620-112255',
    lastDonation: '৩ মাস আগে',
    donationsCount: 3,
    badge: 'Regular Donor',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'ময়মনসিংহ মেডিকেল কলেজ এরিয়ায় প্রস্তুত।'
  },
  {
    id: 'donor-11',
    name: 'রাশেদুল করিম',
    bloodGroup: 'AB-',
    division: 'বরিশাল',
    district: 'বরিশাল',
    upazila: 'বরিশাল সদর (কোতোয়ালী)',
    area: 'সদর রোড',
    phone: '01719-887766',
    lastDonation: '৬ মাস আগে',
    donationsCount: 5,
    badge: 'Life Saver',
    isAvailable: true,
    willingnessStatus: 'available',
    willingNote: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতালে সহজে যেতে পারব।'
  },
  {
    id: 'donor-12',
    name: 'শাহরিয়ার কবির',
    bloodGroup: 'O+',
    division: 'ঢাকা',
    district: 'গাজীপুর',
    upazila: 'টঙ্গী',
    area: 'টঙ্গী বাজার',
    phone: '01888-334422',
    lastDonation: '১ মাস আগে',
    donationsCount: 6,
    badge: 'Blood Hero',
    isAvailable: false,
    willingnessStatus: 'after_months',
    availableAfterMonths: 3,
    availableDateNote: '৩ মাস পর প্রস্তুত (ডিসেম্বর ২০২৬)',
    willingNote: 'সম্প্রতি ডেঙ্গু রোগীর জন্য দিয়েছি, ডিসেম্বর থেকে পুনরায় দিতে পারব।'
  },
  {
    id: 'donor-13',
    name: 'কাজী আশরাফুল',
    bloodGroup: 'A+',
    division: 'ঢাকা',
    district: 'ঢাকা',
    upazila: 'গুলশান',
    area: 'গুলশান ২',
    phone: '01711-224466',
    lastDonation: '৭ মাস আগে',
    donationsCount: 2,
    badge: 'Regular Donor',
    isAvailable: false,
    willingnessStatus: 'unavailable',
    willingNote: 'ব্যক্তিগত কারণে আপাতত রক্ত দিতে পারছি না।'
  }
];

export const mockMissingCases: MissingCase[] = [
  {
    id: 'miss-1',
    caseId: 'FIND-BD-8902',
    personName: 'সামিউল ইসলাম',
    age: 17,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    gender: 'পুরুষ',
    lastSeenLocation: 'আগ্রাবাদ মোড়, চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    lastSeenTime: '১৬ এপ্রিল ২০২৫, বিকাল ৫:৩০',
    description: 'পরনে ছিল নীল রঙের গোলগলা টি-শার্ট ও কালো রঙের জিন্স প্যান্ট। উচ্চতা আনুমানিক ৫ ফুট ৫ ইঞ্চি। ডান হাতের তালুতে ছোট তিল রয়েছে। কোনো সহৃদয় ব্যক্তি সন্ধান পেলে দ্রুত যোগাযোগ করুন।',
    guardianContact: '01823-998877',
    status: 'Searching',
    verifiedCase: true,
    policeCaseId: 'GD-7741/2025',
    reportedDate: '১৬ এপ্রিল ২০২৫'
  },
  {
    id: 'miss-2',
    caseId: 'FIND-BD-8894',
    personName: 'শিশু আরিয়ান (৮ বছর)',
    age: 8,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    gender: 'পুরুষ',
    lastSeenLocation: 'মিরপুর ১০ গোলচত্বর, ঢাকা',
    district: 'ঢাকা',
    lastSeenTime: '১৪ এপ্রিল ২০২৫, দুপুর ২:০০',
    description: 'লাল জামা পরা ছিল। কথা বলতে কিছুটা লজ্জা পায়। অভিভাবক পাগলের মতো খুঁজছেন। থানা জিডি নং ১২৮৪।',
    guardianContact: '01715-667788',
    status: 'Searching',
    verifiedCase: true,
    policeCaseId: 'GD-1284/2025',
    reportedDate: '১৪ এপ্রিল ২০২৫'
  },
  {
    id: 'miss-3',
    caseId: 'FIND-BD-8840',
    personName: 'ফারহানা আক্তার',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    gender: 'মহিলা',
    lastSeenLocation: 'যাত্রাবাড়ী, ঢাকা',
    district: 'ঢাকা',
    lastSeenTime: '১০ এপ্রিল ২০২৫',
    description: 'নিখোঁজের ২৪ ঘণ্টার মধ্যে ভলান্টিয়ার টিম ও পুলিশের সহায়তায় সুস্থ অবস্থায় উদ্ধার করা হয়েছে। পরিবারকে হস্তান্তর করা হয়েছে।',
    guardianContact: '01911-332211',
    status: 'Found',
    verifiedCase: true,
    policeCaseId: 'GD-5520/2025',
    reportedDate: '১০ এপ্রিল ২০২৫'
  }
];

export const currentUser: UserProfile = {
  name: 'তানভীর আহমেদ',
  username: 'tanvir_ahmed',
  bio: 'স্বেচ্ছাসেবী রক্তদাতা (O+) ও কমিউনিটি মডারেটর | মানবতার সেবায় DestiHope পরিবারের সদস্য।',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  phone: '01712-345678',
  district: 'ঢাকা',
  area: 'ধানমন্ডি',
  bloodGroup: 'O+',
  hopePoints: 140,
  badges: ['Life Saver', 'Blood Hero', 'New Helper', 'Guardian'],
  role: 'Blood Hero',
  isDonorAvailable: true,
  donorWillingness: 'available',
  availableAfterMonths: 2,
  availableDateNote: '২ মাস পর প্রস্তুত (নভেম্বর ২০২৬)',
  willingNote: 'যেকোনো জরুরি প্রয়োজনে ফোন করুন, আমি রক্ত দিতে প্রস্তুত।',
  moduleProfiles: {
    care: {
      donorWillingness: 'available',
      availableAfterMonths: 2,
      availableDateNote: '২ মাস পর প্রস্তুত (নভেম্বর ২০২৬)',
      willingNote: 'যেকোনো জরুরি প্রয়োজনে ফোন করুন, আমি রক্ত দিতে প্রস্তুত।',
      bloodGroup: 'O+',
      totalDonations: 8,
      lastDonationDate: '১ মাস আগে',
      district: 'ঢাকা',
      area: 'ধানমন্ডি',
      phone: '01712-345678',
      emergencyAlertEnabled: true
    },
    find: {
      isVolunteerActive: true,
      searchRadiusKm: 15,
      rescuesAssisted: 3,
      specialSkills: ['প্রাথমিক চিকিৎসা', 'এলাকা সন্ধানকারী', 'বাইকার ভলান্টিয়ার'],
      verifiedRescuer: true,
      alertNotification: true
    },
    brain: {
      healthLearnerRank: 'নলেজ চ্যাম্পিয়ন (লেভেল ৩)',
      quizzesCompleted: 18,
      knowledgeScore: 420,
      preferredTopics: ['প্রাথমিক চিকিৎসা ও সিপিআর', 'রক্তদান ও নিরাপত্তা', 'জরুরি ওষুধ নির্দেশিকা'],
      aiConsultationsCount: 26
    },
    media: {
      isCommunityReporter: true,
      broadcastsShared: 12,
      verifiedReports: 7,
      reputationScore: 94
    },
    chat: {
      isHelplineHelper: true,
      averageResponseTime: '২ মিনিট',
      helpedUsersCount: 34
    }
  },
  stats: {
    donations: 8,
    rescuesAssisted: 3,
    answersGiven: 14,
    postsCount: 19
  }
};

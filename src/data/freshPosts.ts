import { FeedPost } from '../types';

export const freshPostsPool: FeedPost[] = [
  {
    id: 'refresh-post-1',
    type: 'blood',
    author: {
      name: 'রেড ক্রিসেন্ট সোসাইটি ঢাকা',
      avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Care',
      iconBg: 'bg-red-600'
    },
    timeAgo: 'এইমাত্র',
    location: 'মিরপুর, ঢাকা',
    badges: [
      { text: 'জরুরি রিকুয়েস্ট', color: 'text-red-700', bg: 'bg-red-100' },
      { text: 'URGENT', color: 'text-white', bg: 'bg-red-600' }
    ],
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=400&q=80',
    title: 'AB+ রক্তের জরুরি আবেদন (থ্যালাসেমিয়া রোগী)',
    content: 'মিরপুর হার্ট ফাউন্ডেশন হাসপাতালে একজন ১০ বছর বয়সী শিশুর জন্য দ্রুত ১ ব্যাগ AB+ রক্ত প্রয়োজন। ডোনার ভাইবোনেরা দ্রুত যোগাযোগ করুন।',
    bloodDetails: {
      group: 'AB+',
      bagsNeeded: 1,
      hospital: 'ন্যাশনাল হার্ট ফাউন্ডেশন, মিরপুর',
      deadlineHours: 2,
      timeRemainingText: '০১:৪৫:০০ বাকি',
      progressPercent: 40,
      contactPhone: '01899-223344'
    },
    likes: 12,
    comments: 3,
    shares: 8,
    hopePointsReward: 15
  },
  {
    id: 'refresh-post-2',
    type: 'news',
    author: {
      name: 'DestiHope সেন্ট্রাল ডিরেক্টরি',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Hope',
      iconBg: 'bg-rose-600'
    },
    timeAgo: '১ মিনিট আগে',
    location: 'কুড়িগ্রাম ও গাইবান্ধা',
    badges: [
      { text: 'ত্রাণ বিতরণ', color: 'text-blue-800', bg: 'bg-blue-100' },
      { text: 'সফল মিশন', color: 'text-emerald-800', bg: 'bg-emerald-100' }
    ],
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80',
    title: 'বন্যাদুর্গত ৫০০ পরিবারের মাঝে পুষ্টিকর খাদ্য সহায়তা সম্পন্ন',
    content: 'DestiHope ভলান্টিয়ার টিমের অক্লান্ত পরিশ্রমে কুড়িগ্রামের চর এলাকায় সফলভাবে জরুরি ওষুধ ও ৫০০০ কেজি খাদ্যসামগ্রী পৌঁছানো হয়েছে। সকলকে ধন্যবাদ!',
    newsDetails: {
      source: 'DestiHope ফিল্ড টিম',
      category: 'মানবিক উদ্যোগ',
      reads: 342
    },
    likes: 128,
    comments: 24,
    shares: 39,
    hopePointsReward: 5
  },
  {
    id: 'refresh-post-3',
    type: 'missing',
    author: {
      name: 'DestiFind পুলিশ সেল',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      verified: true,
      moduleBadge: 'Find',
      iconBg: 'bg-emerald-600'
    },
    timeAgo: '২ মিনিট আগে',
    location: 'উত্তরা, ঢাকা',
    badges: [
      { text: 'সন্ধান সমাপ্ত', color: 'text-emerald-800', bg: 'bg-emerald-100' },
      { text: 'উদ্ধার', color: 'text-teal-900', bg: 'bg-teal-200' }
    ],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    title: 'উদ্ধার সম্পন্ন: নিখোঁজ মায়ানকে পরিবারের কাছে হস্তান্তর',
    content: 'গতকালের নিখোঁজ হওয়া শিশু মায়ানকে উত্তরা ৭ নম্বর সেক্টর থেকে সুস্থ অবস্থায় উদ্ধার করা হয়েছে। DestiFind নেটওয়ার্কের সক্রিয় তথ্যের জন্য আন্তরিক কৃতজ্ঞতা।',
    missingDetails: {
      personName: 'মায়ান চৌধুরী',
      lastSeenDate: '২১ এপ্রিল ২০২৬',
      lastSeenLocation: 'উত্তরা সেক্টর ৭',
      clothingDescription: 'হলুদ রঙের জ্যাকেট',
      caseId: 'DF-99042',
      status: 'Found',
      contactPhone: '01911-002233'
    },
    likes: 215,
    comments: 48,
    shares: 67,
    hopePointsReward: 10
  }
];

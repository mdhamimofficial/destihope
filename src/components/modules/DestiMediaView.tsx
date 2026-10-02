import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle,
  Film,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Menu,
  Search,
  Bell,
  Video,
  Award,
  ShieldCheck,
  Flame,
  Clock,
  Eye,
  Sparkles,
  Download,
  AlertTriangle,
  Droplet,
  UserSearch,
  User,
  Users,
  Layers,
  ArrowLeft,
  Settings,
  Clapperboard,
  ExternalLink,
  Plus,
  Trash2,
  Tv,
  Check,
  Radio,
  Sliders,
  PlaySquare,
  Compass,
  Minimize2,
  Maximize2,
  RotateCcw,
  RotateCw,
  Heart,
  Headphones,
  Mic,
} from 'lucide-react';
import { MediaItem, ActiveModule, UserProfile } from '../../types';
import { mockMediaList } from '../../data/mockData';
import { DestiMediaUploadModal } from '../modals/DestiMediaUploadModal';
import { useLanguage } from '../../context/LanguageContext';

interface DestiMediaViewProps {
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onSearchClick?: () => void;
  onOpenCreatePost?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  currentUser?: UserProfile;
  onUpdateUser?: React.Dispatch<React.SetStateAction<UserProfile>>;
  onEarnHopePoints?: (pts: number, reason?: string) => void;
}

const CATEGORY_CHIPS = [
  { id: 'all', label: '✨ সকল মানবিক কনটেন্ট' },
  { id: 'first_aid', label: '🚑 ফার্স্ট এইড গাইড' },
  { id: 'blood', label: '🩸 রক্তদান জরুরি মিশন' },
  { id: 'rescue', label: '🔍 নিখোঁজ সন্ধান স্টোরি' },
  { id: 'verified', label: '🛡️ বিএমডিসি ভেরিফাইড' },
  { id: 'shorts', label: '⚡ আল্ট্রা রিলস' },
  { id: 'podcasts', label: '🎙️ পডকাস্ট ও অডিও' },
  { id: 'skills', label: '🧠 ক্যারিয়ার ও স্কিল' },
  { id: 'saved', label: '⭐ সংরক্ষিত লাইব্রেরি' },
];

export const DestiMediaView: React.FC<DestiMediaViewProps> = ({
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenMenu,
  onOpenNotifications,
  onSearchClick,
  onOpenCreatePost,
  activeSubTab = 'feed',
  onSelectSubTab,
  currentUser,
  onUpdateUser,
  onEarnHopePoints,
}) => {
  const { l, isEn } = useLanguage();
  const [items, setItems] = useState<MediaItem[]>(mockMediaList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Active Video Watch Page (YouTube style) & PiP Mini-Player
  const [activeWatchVideo, setActiveWatchVideo] = useState<MediaItem | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0); // in seconds
  const [videoDurationSeconds, setVideoDurationSeconds] = useState(680); // default simulated
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Podcast Player State
  const [activeAudioItem, setActiveAudioItem] = useState<MediaItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDurationSeconds] = useState(1850);

  // Reels double-tap flying heart animation & audio
  const [flyingHeart, setFlyingHeart] = useState<{ id: number; x: number; y: number } | null>(null);
  const [isReelMuted, setIsReelMuted] = useState(false);

  // Subscribed channels map
  const [subscribedMap, setSubscribedMap] = useState<Record<string, boolean>>({
    'ডা. সানজিদা আহমেদ (BMDC রেজি: ৪১৫২০)': true,
    'DestiCare সেন্ট্রাল স্কোয়াড': true,
    'DestiFind রেসকিউ টিম বিডি': true,
  });

  // Selected subscription creator filter
  const [selectedSubCreator, setSelectedSubCreator] = useState<string>('all');

  // Likes & Saves
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    'media-burn-care': true,
    'reel-1': true,
  });
  const [dislikedMap, setDislikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({
    'media-burn-care': true,
  });

  // Offline downloaded map
  const [downloadedMap, setDownloadedMap] = useState<Record<string, boolean>>({
    'media-burn-care': true,
  });

  // Hope Points Tipped
  const [tippedHpMap, setTippedHpMap] = useState<Record<string, number>>({});

  // Media Profile Tabs
  const [profileTab, setProfileTab] = useState<'uploads' | 'history' | 'settings'>('uploads');

  // Media Settings State
  const [dataSaverMode, setDataSaverMode] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState<'720p' | '360p'>('720p');
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  // User's own uploads
  const [myUploads, setMyUploads] = useState<MediaItem[]>([
    {
      id: 'my-vid-1',
      type: 'reel',
      title: 'আমার প্রথম রক্তদানের চমৎকার অভিজ্ঞতা ও ভয় কাটিয়ে ওঠার গল্প 🩸',
      creator: {
        name: 'তানভীর আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        isVerified: true,
        subscribers: '320',
      },
      thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80',
      duration: '0:55',
      views: '1.2K',
      uploadDate: '২ দিন আগে',
      likes: 184,
      commentsCount: 22,
      category: 'রক্তদান অভিযান',
    },
  ]);

  // Desti Media Creator Chats (মিডিয়া মডিউলে ক্রিয়েটরদের সাথে এক্সক্লুসিভ চ্যাট)
  interface CreatorConversation {
    id: string;
    creatorName: string;
    avatar: string;
    role: string;
    online: boolean;
    unreadCount: number;
    lastMessage: string;
    lastTime: string;
    messages: {
      id: string;
      sender: 'me' | 'creator';
      text: string;
      time: string;
    }[];
  }

  const [creatorChats, setCreatorChats] = useState<CreatorConversation[]>([
    {
      id: 'cc-1',
      creatorName: 'ডা. সানজিদা আহমেদ (BMDC রেজি: ৪১৫২০)',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80',
      role: 'চিকিৎসক ও সার্জারি ট্রেইনি',
      online: true,
      unreadCount: 1,
      lastMessage: 'আপনার প্রশ্নের উত্তর দিয়েছি। পোড়ার স্থানে বরফ দেবেন না কখনো।',
      lastTime: '১০ মিনিট আগে',
      messages: [
        {
          id: 'm1',
          sender: 'me',
          text: 'আপু, আপনার ফার্স্ট এইড ভিডিওটা দেখেছিলাম। পুড়ে গেলে কি মধু দেওয়া ঠিক হবে?',
          time: 'দুপুর ১:২০',
        },
        {
          id: 'm2',
          sender: 'creator',
          text: 'আপনার প্রশ্নের উত্তর দিয়েছি। পোড়ার স্থানে বরফ বা ঘরোয়া মলম না দিয়ে শুধু নরমাল ট্যাপের পানি ১৫ মিনিট ঢালবেন। প্রয়োজনে দ্রুত নিকটস্থ বার্ন ইউনিটে যাবেন।',
          time: 'দুপুর ১:২৫',
        },
      ],
    },
    {
      id: 'cc-2',
      creatorName: 'DestiCare সেন্ট্রাল স্কোয়াড',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80',
      role: 'জরুরি রক্তদান কোঅর্ডিনেটর',
      online: true,
      unreadCount: 1,
      lastMessage: 'আগামীকালের ঢামেক ব্লাড ডোনেশন ক্যাম্প ভিডিওতে আপনার সহযোগিতা প্রয়োজন।',
      lastTime: '১ ঘণ্টা আগে',
      messages: [
        {
          id: 'm3',
          sender: 'creator',
          text: 'আগামীকালের ঢামেক ব্লাড ডোনেশন ক্যাম্প ভিডিওতে আপনার সহযোগিতা প্রয়োজন। আপনি কি লাইভ স্ট্রিম কাভারেজে যুক্ত হতে পারবেন?',
          time: 'দুপুর ১২:৩০',
        },
      ],
    },
    {
      id: 'cc-3',
      creatorName: 'ডা. রফিকুল ইসলাম (মেডিসিন বিশেষজ্ঞ)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80',
      role: 'মেডিসিন বিশেষজ্ঞ',
      online: false,
      unreadCount: 0,
      lastMessage: 'সাপে কাটা নিয়ে পরবর্তী ভিডিওতে এন্টিভেনম প্রাপ্তির সরকারি তালিকা যুক্ত করব।',
      lastTime: 'গতকাল',
      messages: [
        {
          id: 'm4',
          sender: 'me',
          text: 'স্যার, আপনার সাপে কাটার ভিডিওটা খুবই সময়োপযোগী ছিল!',
          time: 'গতকাল বিকাল ৫:১৫',
        },
        {
          id: 'm5',
          sender: 'creator',
          text: 'ধন্যবাদ তানভীর। সাপে কাটা নিয়ে পরবর্তী ভিডিওতে এন্টিভেনম প্রাপ্তির সরকারি তালিকা যুক্ত করব।',
          time: 'গতকাল বিকাল ৫:২৮',
        },
      ],
    },
  ]);

  const [activeCreatorChatId, setActiveCreatorChatId] = useState<string | null>(null);
  const [chatMessageText, setChatMessageText] = useState('');

  // Comments State
  const [commentInput, setCommentInput] = useState('');
  const [videoComments, setVideoComments] = useState<
    Record<string, { id: string; author: string; avatar: string; text: string; time: string; likes: number; isPinned?: boolean }[]>
  >({
    'media-burn-care': [
      {
        id: 'c1',
        author: 'ডা. সানজিদা আহমেদ (লেখক)',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80',
        text: '📌 পিন করা বার্তা: পোড়া স্থানে কখনোই ডিমের কুসুম বা টুথপেস্ট দেবেন না। সাধারণ ট্যাপের পানিতে অন্তত ১৫-২০ মিনিট ভিজিয়ে রাখাই ত্বক বাঁচানোর সেরা চিকিৎসা।',
        time: '২ দিন আগে',
        likes: 184,
        isPinned: true,
      },
      {
        id: 'c2',
        author: 'তানভীর আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        text: 'অসাধারণ তথ্য আপু! আমাদের পরিবারের সবাই সবসময় ভাবত বরফ দেওয়া ভালো। ভুল ভাঙল।',
        time: '১ দিন আগে',
        likes: 42,
      },
    ],
  });

  // Fullscreen Reels (Shorts) Player state
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isReelPlaying, setIsReelPlaying] = useState(true);
  const [showReelComments, setShowReelComments] = useState(false);
  const [reelComments, setReelComments] = useState<string[]>([
    'অসাধারণ তথ্য! সবার রক্তদান সম্পর্কে এই ভুল ধারণাগুলো ভাঙা উচিত। ❤️',
    'রক্তের গ্রুপ ও ক্রস-ম্যাচিং নিয়ে আরও ভিডিও চাই ডাক্তার আপু।',
    'আমি গত মাসে ৩য় বার রক্ত দিলাম, কোনো দুর্বলতা হয়নি!',
  ]);
  const [reelCommentText, setReelCommentText] = useState('');

  const videoProgressInterval = useRef<any>(null);

  // Auto increment simulated playback progress
  useEffect(() => {
    if (activeWatchVideo && isVideoPlaying) {
      videoProgressInterval.current = setInterval(() => {
        setVideoCurrentTime((prev) => {
          if (prev >= videoDurationSeconds) {
            setIsVideoPlaying(false);
            return videoDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      clearInterval(videoProgressInterval.current);
    }
    return () => clearInterval(videoProgressInterval.current);
  }, [activeWatchVideo, isVideoPlaying, playbackSpeed, videoDurationSeconds]);

  // Audio Podcast simulated progress interval
  useEffect(() => {
    let interval: any = null;
    if (activeAudioItem && isAudioPlaying) {
      interval = setInterval(() => {
        setAudioCurrentTime((prev) => {
          if (prev >= audioDurationSeconds) {
            setIsAudioPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeAudioItem, isAudioPlaying, audioDurationSeconds]);

  // Auto minimize video into PiP mini-player when switching subtabs away from feed
  useEffect(() => {
    if (activeSubTab && activeSubTab !== 'feed' && activeWatchVideo && !isMinimized) {
      setIsMinimized(true);
    }
  }, [activeSubTab, activeWatchVideo, isMinimized]);

  // When clicking shorts category chip, route directly to reels
  useEffect(() => {
    if (selectedCategory === 'shorts') {
      if (onSelectSubTab) onSelectSubTab('reels');
      setSelectedCategory('all');
    }
  }, [selectedCategory, onSelectSubTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSubscribe = (creatorName: string) => {
    setSubscribedMap((prev) => {
      const next = !prev[creatorName];
      showToast(next ? `"${creatorName}" চ্যানেল সাবস্ক্রাইব করা হয়েছে! 🔔` : `সাবস্ক্রিপশন বাতিল করা হয়েছে`);
      return { ...prev, [creatorName]: next };
    });
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => {
      const next = !prev[id];
      if (next && dislikedMap[id]) {
        setDislikedMap((d) => ({ ...d, [id]: false }));
      }
      return { ...prev, [id]: next };
    });
  };

  const toggleDislike = (id: string) => {
    setDislikedMap((prev) => {
      const next = !prev[id];
      if (next && likedMap[id]) {
        setLikedMap((l) => ({ ...l, [id]: false }));
      }
      return { ...prev, [id]: next };
    });
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => {
      const next = !prev[id];
      showToast(next ? 'লাইব্রেরিতে সেভ করা হয়েছে ⭐' : 'সংরক্ষণ থেকে অপসারিত');
      return { ...prev, [id]: next };
    });
  };

  const toggleDownload = (id: string) => {
    setDownloadedMap((prev) => {
      const next = !prev[id];
      showToast(next ? 'জরুরি অফলাইন দেখার জন্য ডাউনলোড সম্পন্ন! 📥' : 'অফলাইন মেমোরি থেকে মুছে ফেলা হয়েছে');
      return { ...prev, [id]: next };
    });
  };

  const handleSendHopePoints = (videoId: string, points: number) => {
    setTippedHpMap((prev) => ({
      ...prev,
      [videoId]: (prev[videoId] || 0) + points,
    }));
    if (onEarnHopePoints) {
      onEarnHopePoints(points, 'ক্রিয়েটর সাপোর্ট');
    }
    showToast(`🎉 ক্রিয়েটরকে +${points} Hope Points সাপোর্ট পাঠানো হয়েছে!`);
  };

  const handleAddComment = (videoId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: 'তানভীর আহমেদ',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: commentInput.trim(),
      time: 'এইমাত্র',
      likes: 0,
    };

    setVideoComments((prev) => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));

    setCommentInput('');
    showToast('আপনার মন্তব্য প্রকাশিত হয়েছে!');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filter items
  const videos = items.filter((i) => i.type === 'video');
  const reels = items.filter((i) => i.type === 'reel');
  const audios = items.filter((i) => i.type === 'audio');
  const savedItems = items.filter((i) => savedMap[i.id]);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'first_aid') return v.category.includes('ফার্স্ট এইড');
    if (selectedCategory === 'blood') return v.category.includes('রক্তদান');
    if (selectedCategory === 'rescue') return v.category.includes('উদ্ধার') || v.category.includes('নিখোঁজ');
    if (selectedCategory === 'verified') return v.isFactChecked;
    if (selectedCategory === 'skills') return v.category.includes('ক্যারিয়ার') || v.category.includes('স্কিল');
    if (selectedCategory === 'saved') return savedMap[v.id];

    return true;
  });

  const filteredAudios = audios.filter((a) => {
    return (
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Followed creators list
  const followedCreators = [
    {
      name: 'ডা. সানজিদা আহমেদ (BMDC রেজি: ৪১৫২০)',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80',
      unread: true,
      role: 'চিকিৎসক ও সার্জন',
    },
    {
      name: 'DestiCare সেন্ট্রাল স্কোয়াড',
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80',
      unread: true,
      role: 'জরুরি রক্তদান টিম',
    },
    {
      name: 'DestiFind রেসকিউ টিম বিডি',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
      unread: false,
      role: 'উদ্ধারকারী নেটওয়ার্ক',
    },
    {
      name: 'ডা. রফিকুল ইসলাম (মেডিসিন বিশেষজ্ঞ)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80',
      unread: false,
      role: 'মেডিসিন বিশেষজ্ঞ',
    },
  ];

  // Videos from subscriptions
  const subscriptionVideos = items.filter((item) => {
    if (selectedSubCreator !== 'all') {
      return item.creator.name === selectedSubCreator;
    }
    return Boolean(subscribedMap[item.creator.name]);
  });

  const currentReel = reels[currentReelIndex] || reels[0];

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex((prev) => prev + 1);
      setIsReelPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex((prev) => prev - 1);
      setIsReelPlaying(true);
    }
  };

  const isFeedTab = activeSubTab === 'feed' || activeSubTab === 'home' || activeSubTab === 'videos' || !activeSubTab;

  return (
    <div className="bg-[#090b10] text-white flex-1 flex flex-col h-full relative pb-20 overflow-hidden font-sans select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 border border-purple-400/40 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 1. ORIGINAL TOP HEADER (১ম সারি আগের মতো অপরিবর্তিত) ================= */}
      <div className="bg-slate-950 border-b border-zinc-900 p-2 sm:p-3 sticky top-0 z-40 shadow-md flex items-center justify-between text-white">
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenMenu}
            className="w-9 h-9 sm:w-10 sm:h-10 -ml-1 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-all active:scale-95 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => {
              if (onOpenModuleSwitcher) {
                onOpenModuleSwitcher();
              } else {
                setActiveWatchVideo(null);
                if (onSelectSubTab) onSelectSubTab('feed');
              }
            }}
            className="flex items-center tracking-tight px-1.5 py-1 cursor-pointer select-none -ml-0.5 active:opacity-80 transition-opacity"
            title="DestiHub ইকোসিস্টেম খুলুন"
          >
            <span className="font-black text-base sm:text-lg text-white">DESTI</span>
            <span className="font-black text-base sm:text-lg text-purple-500 ml-0.5">MEDIA</span>
          </div>
        </div>

        {/* Center: Search / Upload Action Pill */}
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div
            onClick={() => {
              setIsUploadModalOpen(true);
              if (onOpenCreatePost) onOpenCreatePost();
            }}
            className="flex-1 min-w-0 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 active:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 active:border-zinc-500 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-inner cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 font-medium truncate">
              {l('নতুন ভিডিও বা রিল আপলোড করুন...', 'Upload a new video or reel...')}
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-800/60">
                {l('আপলোড করুন', 'Upload')}
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-900/40 group-hover:bg-purple-900/70 flex items-center justify-center shrink-0 ml-1 transition-colors">
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Search & Notifications */}
        <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
          <button
            onClick={() => {
              setShowSearchBar((prev) => !prev);
              if (onSearchClick) onSearchClick();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-all active:scale-90 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full relative transition-all active:scale-90 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-zinc-950 leading-none shadow-xs">
              1
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {showSearchBar && (
        <div className="p-2.5 bg-zinc-900 border-b border-zinc-800 animate-in fade-in duration-100">
          <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1.5 border border-zinc-700">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder={l('ভিডিও, ফার্স্ট এইড বা ডাক্তার গাইড খুঁজুন...', 'Search videos, first aid, or guides...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 pl-2 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-zinc-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. HORIZONTAL CATEGORY RAIL (ONLY ON FEED TAB) ================= */}
      {(!activeWatchVideo || isMinimized) && isFeedTab && (
        <div className="shrink-0 bg-[#090b10]/95 backdrop-blur-md border-b border-white/[0.06] px-3 py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORY_CHIPS.map((chip) => {
            const isSel = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20 border border-purple-400/30 ring-1 ring-purple-400/20'
                    : 'bg-zinc-900/90 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-white/[0.05]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ================= 3. IN-APP THEATER WATCH SCREEN (WHEN VIDEO IS OPENED) ================= */}
      {activeWatchVideo && !isMinimized ? (
        <div className="flex-1 overflow-y-auto bg-[#090b10] flex flex-col animate-in fade-in duration-150">
          {/* Top Back Nav with Live Status & PiP Minimize */}
          <div className="px-3.5 py-2.5 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between border-b border-white/[0.06] sticky top-0 z-30">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveWatchVideo(null);
                  setIsMinimized(false);
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-zinc-300 hover:text-white cursor-pointer bg-zinc-900/80 hover:bg-zinc-800 px-3 py-1.5 rounded-full border border-white/[0.06] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>বন্ধ করুন</span>
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="flex items-center space-x-1.5 text-xs font-bold text-purple-300 hover:text-white cursor-pointer bg-purple-950/60 hover:bg-purple-900/80 px-3 py-1.5 rounded-full border border-purple-500/30 transition-colors"
                title="মিনিমাইজ করে ব্রাউজ করুন"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>মিনিমাইজ (PiP)</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-purple-300 font-bold bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>থিয়েটার মোড</span>
            </div>
          </div>

          {/* Cinematic Video Canvas */}
          <div className="relative w-full max-w-4xl mx-auto p-2 sm:p-4">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/[0.1] group">
              <img
                src={activeWatchVideo.thumbnail}
                alt={activeWatchVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Big Center Play/Pause Toggle Indicator */}
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className={`absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer ${
                  isVideoPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 shadow-2xl'
                }`}
              >
                {isVideoPlaying ? (
                  <Pause className="w-7 h-7 text-white fill-white" />
                ) : (
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                )}
              </button>

              {/* Bottom Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col space-y-2">
                {/* Scrub Progress Bar */}
                <div
                  className="w-full h-2 hover:h-3 bg-white/20 rounded-full cursor-pointer relative transition-all group/scrub"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickPos = (e.clientX - rect.left) / rect.width;
                    setVideoCurrentTime(Math.floor(clickPos * videoDurationSeconds));
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full relative"
                    style={{ width: `${(videoCurrentTime / videoDurationSeconds) * 100}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/scrub:scale-100 transition-transform" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="hover:text-white cursor-pointer">
                      {isVideoPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 fill-white ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setVideoCurrentTime((prev) => Math.max(0, prev - 10))}
                      className="hover:text-white cursor-pointer p-0.5 text-zinc-400 hover:text-white"
                      title="১০ সেকেন্ড পিছিয়ে যান"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setVideoCurrentTime((prev) => Math.min(videoDurationSeconds, prev + 10))}
                      className="hover:text-white cursor-pointer p-0.5 text-zinc-400 hover:text-white"
                      title="১০ সেকেন্ড এগিয়ে যান"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white cursor-pointer">
                      {isMuted ? <VolumeX className="w-4.5 h-4.5 text-red-400" /> : <Volume2 className="w-4.5 h-4.5" />}
                    </button>

                    <span className="text-[11px] font-mono text-zinc-400">
                      {formatSeconds(videoCurrentTime)} / {formatSeconds(videoDurationSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const speeds = [1.0, 1.25, 1.5, 2.0];
                        const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                        setPlaybackSpeed(speeds[nextIndex]);
                      }}
                      className="px-2 py-1 bg-black/50 border border-white/10 hover:border-white/30 text-[11px] font-bold rounded-lg hover:text-white cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="max-w-4xl mx-auto w-full p-4 space-y-4">
            <div className="space-y-2">
              <h1 className="text-base sm:text-lg font-black text-white leading-snug">
                {activeWatchVideo.title}
              </h1>

              <div className="flex items-center flex-wrap gap-2 text-xs text-zinc-400">
                <span>{activeWatchVideo.views} ভিউ</span>
                <span>•</span>
                <span>{activeWatchVideo.uploadDate}</span>
                <span>•</span>
                <span className="text-purple-400 font-bold">{activeWatchVideo.category}</span>
                {activeWatchVideo.isFactChecked && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold text-[11px] bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{activeWatchVideo.factCheckedBy || 'মেডিকেল ভেরিফাইড'}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Creator / Channel Bar with Subscribe */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/90 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={activeWatchVideo.creator.avatar}
                  alt={activeWatchVideo.creator.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                      {activeWatchVideo.creator.name}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {activeWatchVideo.creator.subscribers || '150K'} সাবস্ক্রাইবার
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleSubscribe(activeWatchVideo.creator.name)}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                  subscribedMap[activeWatchVideo.creator.name]
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-white hover:bg-zinc-200 text-black shadow-md'
                }`}
              >
                {subscribedMap[activeWatchVideo.creator.name] ? 'সাবস্ক্রাইবড ✓' : 'সাবস্ক্রাইব'}
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full">
                <button
                  onClick={() => toggleLike(activeWatchVideo.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-l-full hover:bg-zinc-800 transition-colors cursor-pointer ${
                    likedMap[activeWatchVideo.id] ? 'text-purple-400' : 'text-zinc-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${likedMap[activeWatchVideo.id] ? 'fill-purple-400' : ''}`} />
                  <span>{likedMap[activeWatchVideo.id] ? activeWatchVideo.likes + 1 : activeWatchVideo.likes}</span>
                </button>
                <div className="w-px h-5 bg-zinc-700" />
                <button
                  onClick={() => toggleDislike(activeWatchVideo.id)}
                  className={`px-3 py-2 rounded-r-full hover:bg-zinc-800 transition-colors cursor-pointer ${
                    dislikedMap[activeWatchVideo.id] ? 'text-red-400' : 'text-zinc-400'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${dislikedMap[activeWatchVideo.id] ? 'fill-red-400' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('ভিডিওর লিংক কপি করা হয়েছে!');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Share2 className="w-4 h-4" />
                <span>শেয়ার</span>
              </button>

              <button
                onClick={() => toggleDownload(activeWatchVideo.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  downloadedMap[activeWatchVideo.id]
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{downloadedMap[activeWatchVideo.id] ? 'ডাউনলোডড ✓' : 'অফলাইন সেভ'}</span>
              </button>

              <button
                onClick={() => toggleSave(activeWatchVideo.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  savedMap[activeWatchVideo.id]
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${savedMap[activeWatchVideo.id] ? 'fill-amber-400' : ''}`} />
                <span>{savedMap[activeWatchVideo.id] ? 'সেভড' : 'সংরক্ষণ'}</span>
              </button>

              <button
                onClick={() => handleSendHopePoints(activeWatchVideo.id, 10)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 hover:from-purple-600 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-purple-900/40 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>+১০ HP পাঠান</span>
              </button>
            </div>

            {/* ⭐ UNIQUE FEATURE: LIFE-SAVING ACTION CARD */}
            {activeWatchVideo.lifeAction && (
              <div className="p-4 bg-gradient-to-r from-purple-950/90 via-indigo-950/80 to-zinc-950 border border-purple-500/50 rounded-2xl flex items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    {activeWatchVideo.lifeAction.actionType === 'blood' ? (
                      <Droplet className="w-5 h-5 text-red-200 fill-red-400" />
                    ) : activeWatchVideo.lifeAction.actionType === 'find' ? (
                      <UserSearch className="w-5 h-5 text-amber-200" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block truncate">
                      {activeWatchVideo.lifeAction.label}
                    </span>
                    <span className="text-[11px] text-purple-300 block truncate">
                      DestiHope সরাসরি জীবনরক্ষাকারী নেটওয়ার্ক
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSelectModule) {
                      onSelectModule(activeWatchVideo.lifeAction!.targetModule as ActiveModule);
                      showToast(`${activeWatchVideo.lifeAction!.linkText}-এ রিডাইরেক্ট করা হচ্ছে...`);
                    }
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-purple-100 text-purple-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center space-x-1 active:scale-95"
                >
                  <span>{activeWatchVideo.lifeAction.linkText}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Emergency Chapters */}
            {activeWatchVideo.chapters && activeWatchVideo.chapters.length > 0 && (
              <div className="p-3.5 bg-zinc-900/90 rounded-2xl border border-white/[0.06] space-y-2.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>জরুরি চ্যাপ্টার ও টাইমস্ট্যাম্প (সরাসরি ক্লিক করে ওই সেকেন্ডে জাম্প করুন):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeWatchVideo.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setVideoCurrentTime(ch.seconds);
                        setIsVideoPlaying(true);
                        showToast(`চ্যাপ্টার: ${ch.title}`);
                      }}
                      className="flex items-center space-x-2.5 p-2.5 bg-zinc-800/80 hover:bg-purple-950/60 border border-zinc-700/60 hover:border-purple-500 rounded-xl text-left text-xs transition-colors cursor-pointer group"
                    >
                      <span className="font-mono text-purple-400 font-bold bg-purple-950/90 px-2 py-0.5 rounded text-[11px] border border-purple-500/30">
                        {ch.time}
                      </span>
                      <span className="text-zinc-200 group-hover:text-white truncate font-medium">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description Box */}
            <div className="p-3.5 bg-zinc-900/70 rounded-2xl border border-white/[0.06] text-xs space-y-2">
              <p className={`text-zinc-300 leading-relaxed ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                {activeWatchVideo.description ||
                  'এই ভিডিওটিতে গুরুত্বপূর্ণ সচেতনতামূলক তথ্য ও স্বাস্থ্য পরামর্শ দেওয়া হয়েছে। রেজিস্টার্ড চিকিৎসকের নির্দেশনা মেনে চলুন।'}
              </p>
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-purple-400 font-bold cursor-pointer hover:underline"
              >
                {isDescriptionExpanded ? 'সংক্ষিপ্ত করুন ▲' : 'বিস্তারিত পড়ুন ▼'}
              </button>
            </div>

            {/* Comments Section */}
            <div className="p-4 bg-zinc-900/90 rounded-2xl border border-white/[0.06] space-y-3">
              <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>মন্তব্যসমূহ ({(videoComments[activeWatchVideo.id] || []).length + 140})</span>
              </h3>

              <form onSubmit={(e) => handleAddComment(activeWatchVideo.id, e)} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="একটি গঠনমূলক বা সহানুভূতিশীল মন্তব্য লিখুন..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-purple-500 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="p-2.5 bg-purple-600 disabled:bg-zinc-800 text-white rounded-full transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {(videoComments[activeWatchVideo.id] || []).map((comm) => (
                  <div key={comm.id} className="flex items-start space-x-2.5 text-xs">
                    <img
                      src={comm.avatar}
                      alt={comm.author}
                      referrerPolicy="no-referrer"
                      className="w-7.5 h-7.5 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-zinc-800/60 p-3 rounded-xl border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-200">{comm.author}</span>
                        <span className="text-[10.5px] text-zinc-500">{comm.time}</span>
                      </div>
                      <p className="text-zinc-300 mt-1 leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Up Next Recommendation */}
            <div className="p-3.5 bg-zinc-900/90 rounded-2xl border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center space-x-1.5">
                  <PlaySquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>পরবর্তী সুপারিশকৃত মানবিক ভিডিও:</span>
                </span>
                {autoPlayNext && (
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30 font-medium">
                    অটো-প্লে চালু
                  </span>
                )}
              </div>
              {(() => {
                const nextVid = filteredVideos.find((v) => v.id !== activeWatchVideo.id) || filteredVideos[0];
                if (!nextVid) return null;
                return (
                  <div
                    onClick={() => {
                      setActiveWatchVideo(nextVid);
                      setVideoCurrentTime(0);
                      setIsVideoPlaying(true);
                      showToast(`চালানো হচ্ছে: ${nextVid.title}`);
                    }}
                    className="flex items-center space-x-3 p-2 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl cursor-pointer border border-zinc-700/50 hover:border-purple-500/50 transition-all group"
                  >
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-black">
                      <img src={nextVid.thumbnail} alt={nextVid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">{nextVid.duration}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">{nextVid.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{nextVid.creator.name}</p>
                      <p className="text-[10px] text-zinc-500">{nextVid.views} ভিউ</p>
                    </div>
                    <span className="text-xs text-purple-400 font-bold shrink-0">এখনই চালান →</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        /* ================= 4. SUBTABS VIEW SWITCHER ================= */
        <div className="flex-1 overflow-y-auto bg-[#090b10]">
          {/* ================= TAB 1: FEED (HOME VIDEOS & REELS SHELF) ================= */}
          {isFeedTab && (
            <div className="max-w-4xl mx-auto w-full p-3 sm:p-4 space-y-6">
              {/* HERO SPOTLIGHT PREMIERE */}
              {filteredVideos.length > 0 && selectedCategory === 'all' && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div
                    onClick={() => {
                      setActiveWatchVideo(filteredVideos[0]);
                      setVideoCurrentTime(0);
                      setIsVideoPlaying(true);
                    }}
                    className="relative bg-zinc-900/90 rounded-3xl border border-white/[0.1] hover:border-purple-500/70 overflow-hidden shadow-2xl cursor-pointer transition-all"
                  >
                    <div className="relative aspect-video w-full bg-black overflow-hidden">
                      <img
                        src={filteredVideos[0].thumbnail}
                        alt={filteredVideos[0].title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md animate-pulse">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>স্পটলাইট ফিচার্ড</span>
                          </span>
                          {filteredVideos[0].isFactChecked && (
                            <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center space-x-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>BMDC সার্টিফাইড</span>
                            </span>
                          )}
                        </div>

                        <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                          {filteredVideos[0].duration}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-white ml-1" />
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-left space-y-1.5">
                        <div className="flex items-center space-x-2 text-xs text-purple-300 font-bold">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>আজকের সর্বাধিক জীবনরক্ষাকারী টিউটোরিয়াল</span>
                        </div>
                        <h2 className="text-sm sm:text-base font-black text-white leading-snug drop-shadow-md line-clamp-2">
                          {filteredVideos[0].title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-zinc-950/60">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={filteredVideos[0].creator.avatar}
                          alt={filteredVideos[0].creator.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border-2 border-purple-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{filteredVideos[0].creator.name}</p>
                          <p className="text-[11px] text-zinc-400">{filteredVideos[0].views} ভিউ • {filteredVideos[0].uploadDate}</p>
                        </div>
                      </div>
                      <span className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-md">
                        এখনই দেখুন
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* DESTI SHORTS / REELS SHELF */}
              {selectedCategory === 'all' && (
                <div className="space-y-3 py-2 border-y border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center shadow-md">
                        <Clapperboard className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-black text-white">Desti Shorts / রিলস</h3>
                    </div>
                    <button
                      onClick={() => onSelectSubTab && onSelectSubTab('reels')}
                      className="text-xs text-purple-400 font-bold hover:underline cursor-pointer"
                    >
                      সব রিলস দেখুন →
                    </button>
                  </div>

                  <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {reels.map((r, rIdx) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setCurrentReelIndex(rIdx);
                          if (onSelectSubTab) onSelectSubTab('reels');
                        }}
                        className="relative w-36 sm:w-44 aspect-[9/16] rounded-2xl overflow-hidden shrink-0 bg-zinc-900 border border-white/[0.08] shadow-xl cursor-pointer group hover:border-purple-500/70 transition-all"
                      >
                        <img
                          src={r.thumbnail}
                          alt={r.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/20" />

                        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                            {r.title}
                          </p>
                          <span className="text-[10px] text-zinc-300 font-medium block">
                            👁️ {r.views} ভিউ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIO PODCASTS & HEALTH TALKS SHELF */}
              {audios.length > 0 && (selectedCategory === 'all' || selectedCategory === 'podcasts') && (
                <div className="space-y-3 py-2 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                        <Headphones className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-black text-white">ভয়েস পডকাস্ট ও স্বাস্থ্য আলোচনা</h3>
                    </div>
                    <span className="text-[11px] text-zinc-400">{filteredAudios.length} টি পর্ব</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredAudios.map((aud) => {
                      const isCurrentAudio = activeAudioItem?.id === aud.id;
                      return (
                        <div
                          key={aud.id}
                          onClick={() => {
                            if (isCurrentAudio) {
                              setIsAudioPlaying(!isAudioPlaying);
                            } else {
                              setActiveAudioItem(aud);
                              setIsAudioPlaying(true);
                              setAudioCurrentTime(0);
                              showToast(`পডকাস্ট চালানো হচ্ছে: ${aud.title}`);
                            }
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrentAudio
                              ? 'bg-purple-950/40 border-purple-500/70 shadow-lg shadow-purple-900/30'
                              : 'bg-zinc-900/80 hover:bg-zinc-900 border-white/[0.06] hover:border-purple-500/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black border border-white/10">
                              <img src={aud.thumbnail} alt={aud.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                {isCurrentAudio && isAudioPlaying ? (
                                  <Pause className="w-5 h-5 text-white fill-white" />
                                ) : (
                                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                )}
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{aud.title}</h4>
                              <p className="text-[11px] text-purple-300 font-medium truncate">{aud.creator.name}</p>
                              <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mt-0.5">
                                <span className="font-mono">{aud.duration}</span>
                                <span>•</span>
                                <span>{aud.views} ভিউ</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {isCurrentAudio && isAudioPlaying && (
                              <div className="flex items-end space-x-0.5 h-4">
                                <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
                                <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s] h-4"></span>
                                <span className="w-1 bg-purple-400 rounded-full animate-bounce h-2"></span>
                              </div>
                            )}
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              isCurrentAudio ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-300'
                            }`}>
                              {isCurrentAudio && isAudioPlaying ? 'শুনছেন' : 'শুনুন'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MAIN VIDEO CARDS FEED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <Film className="w-4 h-4 text-purple-400" />
                    <span>মানবিক ভিডিওসমূহ ({filteredVideos.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => {
                        setActiveWatchVideo(video);
                        setVideoCurrentTime(0);
                        setIsVideoPlaying(true);
                      }}
                      className="bg-zinc-900/80 hover:bg-zinc-900 rounded-2xl border border-white/[0.06] hover:border-purple-500/50 overflow-hidden shadow-md cursor-pointer group transition-all"
                    >
                      <div className="relative aspect-video w-full bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                          {video.duration}
                        </span>

                        {video.isFactChecked && (
                          <span className="absolute top-2 left-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span>ভেরিফাইড</span>
                          </span>
                        )}
                      </div>

                      <div className="p-3">
                        <div className="flex items-start space-x-2.5">
                          <img
                            src={video.creator.avatar}
                            alt={video.creator.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-purple-500 shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                              {video.title}
                            </h4>
                            <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400 mt-1">
                              <span className="truncate">{video.creator.name}</span>
                              <CheckCircle className="w-3 h-3 text-purple-400 fill-purple-400 shrink-0" />
                            </div>
                            <div className="flex items-center space-x-1.5 text-[10.5px] text-zinc-500 mt-0.5">
                              <span>{video.views} ভিউ</span>
                              <span>•</span>
                              <span>{video.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: REELS (FULL IMMERSION SHORTS MODE) ================= */}
          {activeSubTab === 'reels' && (
            <div className="relative h-full flex flex-col bg-black overflow-hidden select-none">
              <div
                className="flex-1 relative flex items-center justify-center bg-zinc-950 cursor-pointer overflow-hidden"
                onClick={() => setIsReelPlaying(!isReelPlaying)}
                onDoubleClick={(e) => {
                  toggleLike(currentReel.id);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setFlyingHeart({ id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top });
                  setTimeout(() => setFlyingHeart(null), 800);
                }}
              >
                <img
                  src={currentReel.thumbnail}
                  alt={currentReel.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30" />

                {/* Flying Heart Animation on Double Click */}
                {flyingHeart && (
                  <div
                    style={{ left: flyingHeart.x, top: flyingHeart.y }}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 animate-in zoom-in-50 fade-in duration-300"
                  >
                    <Heart className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-2xl animate-bounce" />
                  </div>
                )}

                {/* Top Right Sound Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReelMuted(!isReelMuted);
                    showToast(isReelMuted ? 'সাউন্ড চালু 🔊' : 'মিউট করা হয়েছে 🔇');
                  }}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="সাউন্ড নিয়ন্ত্রণ"
                >
                  {isReelMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>

                {!isReelPlaying && (
                  <div className="relative z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                )}

                {/* Up/Down Reel navigation */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 right-2 z-20 flex flex-col space-y-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handlePrevReel}
                    disabled={currentReelIndex === 0}
                    className={`p-2 rounded-full backdrop-blur-md ${
                      currentReelIndex === 0 ? 'bg-white/5 text-white/20' : 'bg-black/50 text-white hover:bg-black/70 cursor-pointer'
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextReel}
                    disabled={currentReelIndex === reels.length - 1}
                    className={`p-2 rounded-full backdrop-blur-md ${
                      currentReelIndex === reels.length - 1
                        ? 'bg-white/5 text-white/20'
                        : 'bg-black/50 text-white hover:bg-black/70 cursor-pointer'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Floating Actions */}
                <div
                  className="absolute right-3 bottom-14 z-20 flex flex-col items-center space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => toggleLike(currentReel.id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-125 ${
                        likedMap[currentReel.id] ? 'bg-red-500/20 text-red-500 scale-105' : 'bg-black/40 text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-5 h-5 ${likedMap[currentReel.id] ? 'fill-red-500' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">
                      {likedMap[currentReel.id] ? currentReel.likes + 1 : currentReel.likes}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowReelComments(true)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">
                      {currentReel.commentsCount + reelComments.length - 3}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleSave(currentReel.id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={`p-2.5 rounded-full backdrop-blur-md ${
                        savedMap[currentReel.id] ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${savedMap[currentReel.id] ? 'fill-amber-400' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">সেভ</span>
                  </button>

                  <button
                    onClick={() => handleSendHopePoints(currentReel.id, 10)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="p-2.5 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 backdrop-blur-md text-amber-300 border border-purple-400/40 shadow-lg group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="text-[9.5px] font-black mt-1 text-purple-200">+১০ HP</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('রিল লিংক কপি করা হয়েছে!');
                    }}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">শেয়ার</span>
                  </button>
                </div>

                {/* Bottom Title, Creator Info & Spinning Audio Disc */}
                <div
                  className="absolute left-4 right-16 bottom-4 z-20 text-left space-y-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-white">@{currentReel.creator.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                  </div>
                  <p className="text-xs text-white/95 line-clamp-2 leading-relaxed drop-shadow font-medium">
                    {currentReel.title}
                  </p>

                  {/* Direct Life Action Pill if present */}
                  {currentReel.lifeAction && (
                    <div className="pt-0.5">
                      <button
                        onClick={() => {
                          if (onSelectModule) {
                            onSelectModule(currentReel.lifeAction!.targetModule as ActiveModule);
                            showToast(`${currentReel.lifeAction!.linkText}-এ নিয়ে যাওয়া হচ্ছে...`);
                          }
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full text-[11px] font-black shadow-lg shadow-red-900/40 border border-white/20 active:scale-95 transition-transform cursor-pointer"
                      >
                        <span>{currentReel.lifeAction.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Animated Rotating Sound Disc Ticker */}
                  <div className="flex items-center space-x-2 text-[10.5px] text-zinc-300 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-800 border border-white/30 flex items-center justify-center animate-spin [animation-duration:3s]">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    </div>
                    <span className="truncate">অরিজিনাল অডিও • Desti Media Humanitarian Reel</span>
                  </div>
                </div>
              </div>

              {/* Reel Comments Drawer */}
              {showReelComments && (
                <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
                  <div className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-4 max-h-[70%] flex flex-col">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <h3 className="text-xs font-bold text-white">মন্তব্য ({reelComments.length})</h3>
                      <button
                        onClick={() => setShowReelComments(false)}
                        className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                      {reelComments.map((com, idx) => (
                        <div key={idx} className="bg-zinc-800/80 p-2.5 rounded-xl text-xs text-zinc-200">
                          {com}
                        </div>
                      ))}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!reelCommentText.trim()) return;
                        setReelComments((prev) => [reelCommentText.trim(), ...prev]);
                        setReelCommentText('');
                      }}
                      className="pt-2 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        placeholder="মন্তব্য লিখুন..."
                        value={reelCommentText}
                        onChange={(e) => setReelCommentText(e.target.value)}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-xs text-white rounded-full px-3.5 py-2 focus:outline-none"
                      />
                      <button type="submit" className="p-2 bg-purple-600 rounded-full text-white cursor-pointer">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: SUBSCRIPTIONS (ইউটিউব সাবসক্রিপশনস স্টাইল) ================= */}
          {activeSubTab === 'subscriptions' && (
            <div className="max-w-4xl mx-auto w-full p-3 sm:p-4 space-y-5">
              {/* Followed Creators Avatar Rail */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    ফলো করা চ্যানেলসমূহ ({followedCreators.length})
                  </h3>
                  <button
                    onClick={() => setSelectedSubCreator('all')}
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      selectedSubCreator === 'all' ? 'text-purple-400 bg-purple-950/50' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    সব দেখুন
                  </button>
                </div>

                <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
                  {followedCreators.map((creator) => {
                    const isSelected = selectedSubCreator === creator.name;
                    return (
                      <button
                        key={creator.name}
                        onClick={() => setSelectedSubCreator(isSelected ? 'all' : creator.name)}
                        className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
                      >
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            referrerPolicy="no-referrer"
                            className={`w-14 h-14 rounded-full object-cover p-0.5 border-2 transition-all ${
                              isSelected
                                ? 'border-purple-500 scale-105 shadow-md shadow-purple-500/30'
                                : 'border-zinc-700 group-hover:border-zinc-500'
                            }`}
                          />
                          {creator.unread && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-[#090b10]" />
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-300 font-bold max-w-[70px] truncate text-center group-hover:text-white">
                          {creator.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feed of Videos from Subscriptions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h2 className="text-sm font-black text-white flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>
                      {selectedSubCreator === 'all'
                        ? 'সাবস্ক্রিপশনের লেটেস্ট রিলিজ'
                        : `${selectedSubCreator}-এর ভিডিও`}
                    </span>
                  </h2>
                  <span className="text-xs text-zinc-400">{subscriptionVideos.length} টি ভিডিও</span>
                </div>

                {subscriptionVideos.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 space-y-2">
                    <Users className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
                    <p className="text-xs font-semibold">এই চ্যানেলের কোনো নতুন ভিডিও পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptionVideos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => {
                          setActiveWatchVideo(video);
                          setVideoCurrentTime(0);
                          setIsVideoPlaying(true);
                        }}
                        className="bg-zinc-900/80 hover:bg-zinc-900 rounded-2xl border border-white/[0.06] hover:border-purple-500/50 p-3 shadow-md cursor-pointer transition-all flex flex-col sm:flex-row gap-3.5 group"
                      >
                        <div className="relative aspect-video sm:w-56 rounded-xl overflow-hidden shrink-0 bg-black">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {video.duration}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                              {video.title}
                            </h3>
                            <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                              <span className="font-semibold text-zinc-300">{video.creator.name}</span>
                              <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400 shrink-0" />
                            </div>
                            <p className="text-[11px] text-zinc-500">{video.views} ভিউ • {video.uploadDate}</p>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-white/[0.04] mt-2">
                            <span className="text-[10px] text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-500/30 font-medium">
                              {video.category}
                            </span>
                            <span className="text-xs text-purple-400 font-bold group-hover:underline">প্লে করুন →</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: CREATOR CHAT (DESTI MEDIA নিজস্ব ক্রিয়েটর চ্যাট সিস্টেম) ================= */}
          {activeSubTab === 'chat' && (
            <div className="max-w-4xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col p-2 sm:p-4">
              {activeCreatorChatId ? (
                /* Active 1-on-1 Creator Chat Screen */
                (() => {
                  const currentChat = creatorChats.find((c) => c.id === activeCreatorChatId);
                  if (!currentChat) return null;
                  return (
                    <div className="flex-1 flex flex-col bg-zinc-900/95 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                      {/* Chat Header */}
                      <div className="p-3 sm:p-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <button
                            onClick={() => setActiveCreatorChatId(null)}
                            className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <div className="relative">
                            <img
                              src={currentChat.avatar}
                              alt={currentChat.creatorName}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shrink-0"
                            />
                            {currentChat.online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-zinc-950"></span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-white flex items-center space-x-1">
                              <span>{currentChat.creatorName}</span>
                              <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                            </h3>
                            <p className="text-[10px] text-zinc-400">
                              {currentChat.role} • {currentChat.online ? 'অনলাইন আছেন' : 'অফলাইন'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] bg-purple-950/80 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
                            মিডিয়া ভেরিফাইড
                          </span>
                        </div>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#090b10]">
                        <div className="text-center my-2">
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-medium">
                            🔒 এই চ্যাট শুধুমাত্র Desti Media ক্রিয়েটর ও আপনার মধ্যে সংরক্ষিত
                          </span>
                        </div>

                        {currentChat.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-2xl text-xs space-y-1 ${
                                m.sender === 'me'
                                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs shadow-md'
                                  : 'bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-tl-xs'
                              }`}
                            >
                              <p className="leading-relaxed">{m.text}</p>
                              <span
                                className={`text-[9.5px] block text-right ${
                                  m.sender === 'me' ? 'text-purple-200' : 'text-zinc-500'
                                }`}
                              >
                                {m.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Question Chips */}
                      <div className="px-3 py-1.5 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                        <span className="text-[10px] text-zinc-500 font-bold shrink-0">পরামর্শ প্রশ্ন:</span>
                        <button
                          onClick={() => {
                            const q = 'পোড়া ক্ষতস্থানে টুথপেস্ট বা বরফ দেওয়া কি ঠিক?';
                            setChatMessageText(q);
                          }}
                          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-purple-950/60 text-zinc-300 hover:text-purple-300 text-[10.5px] font-medium border border-zinc-700/60 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          🩹 পোড়ায় প্রাথমিক চিকিৎসা
                        </button>
                        <button
                          onClick={() => {
                            const q = 'রক্তদানের আগে ও পরে কী খাবার খাওয়া উচিত?';
                            setChatMessageText(q);
                          }}
                          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-purple-950/60 text-zinc-300 hover:text-purple-300 text-[10.5px] font-medium border border-zinc-700/60 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          🩸 রক্তদানের প্রস্তুতি
                        </button>
                        <button
                          onClick={() => {
                            const q = 'সাপে কাটলে সরকারি হাসপাতালে অ্যান্টিভেনম কীভাবে পাব?';
                            setChatMessageText(q);
                          }}
                          className="px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-purple-950/60 text-zinc-300 hover:text-purple-300 text-[10.5px] font-medium border border-zinc-700/60 whitespace-nowrap cursor-pointer transition-colors"
                        >
                          🐍 সাপে কাটার অ্যান্টিভেনম
                        </button>
                      </div>

                      {/* Chat Input Bar */}
                      <div className="p-2.5 sm:p-3 bg-zinc-950 border-t border-zinc-800 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const voiceMsg = {
                              id: `msg-${Date.now()}`,
                              sender: 'me' as const,
                              text: '🎙️ ভয়েস বার্তা (০:১৭) • "জরুরি ফার্স্ট এইড নির্দেশনা সম্পর্কে জানতে চাই..."',
                              time: 'এইমাত্র',
                            };
                            setCreatorChats((prev) =>
                              prev.map((c) =>
                                c.id === currentChat.id
                                  ? {
                                      ...c,
                                      messages: [...c.messages, voiceMsg],
                                      lastMessage: voiceMsg.text,
                                      lastTime: 'এইমাত্র',
                                    }
                                  : c
                              )
                            );
                            showToast('ভয়েস অডিও বার্তা পাঠানো হয়েছে!');
                            setTimeout(() => {
                              const autoReply = {
                                id: `msg-${Date.now() + 1}`,
                                sender: 'creator' as const,
                                text: 'আপনার ভয়েস মেসেজ পেয়েছি। চিকিৎসকের পরামর্শ অনুযায়ী প্রাথমিক অবস্থায় আক্রান্ত স্থান স্থির রাখুন এবং অযথা প্যানিক করবেন না। জরুরি প্রয়োজনে হটলাইন ১৬২৬৩-এ কল দিন।',
                                time: 'এইমাত্র',
                              };
                              setCreatorChats((prev) =>
                                prev.map((c) =>
                                  c.id === currentChat.id
                                    ? {
                                        ...c,
                                        messages: [...c.messages, autoReply],
                                        lastMessage: autoReply.text,
                                        lastTime: 'এইমাত্র',
                                        unreadCount: 0,
                                      }
                                    : c
                                )
                              );
                            }, 1200);
                          }}
                          className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                          title="ভয়েস রেকর্ড করে পাঠান"
                        >
                          <Mic className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          placeholder="ক্রিয়েটরকে মেসেজ লিখুন..."
                          value={chatMessageText}
                          onChange={(e) => setChatMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && chatMessageText.trim()) {
                              const sentText = chatMessageText.trim();
                              const newMsg = {
                                id: `msg-${Date.now()}`,
                                sender: 'me' as const,
                                text: sentText,
                                time: 'এইমাত্র',
                              };
                              setCreatorChats((prev) =>
                                prev.map((c) =>
                                  c.id === currentChat.id
                                    ? {
                                        ...c,
                                        messages: [...c.messages, newMsg],
                                        lastMessage: newMsg.text,
                                        lastTime: 'এইমাত্র',
                                      }
                                    : c
                                )
                              );
                              setChatMessageText('');
                              showToast('মেসেজ সফলভাবে পাঠানো হয়েছে!');

                              // Realistic automated Doctor/Coordinator advice
                              setTimeout(() => {
                                let replyText = 'আপনার বার্তার জন্য ধন্যবাদ। বিষয়টি পর্যালোচনা করে দ্রুত সমাধান দেওয়া হচ্ছে।';
                                const lower = sentText.toLowerCase();

                                if (currentChat.id === 'cc-1') {
                                  // Dr. Sanjida (First Aid / Burn)
                                  if (lower.includes('পোড়া') || lower.includes('বরফ') || lower.includes('আগুন') || lower.includes('টুথপেস্ট')) {
                                    replyText = 'পোড়া স্থানে ভুলেও বরফ, টুথপেস্ট বা ডিম লাগাবেন না। সাথে সাথে সাধারণ তাপমাত্রার ট্যাপের পানিতে অন্তত ১৫-২০ মিনিট ভিজিয়ে রাখুন। ফোসকা পড়লে ফাটাবেন না। প্রয়োজনে নিকটস্থ বার্ন ইউনিটে যাবেন।';
                                  } else if (lower.includes('রক্ত') || lower.includes('খাবার') || lower.includes('দুর্বল')) {
                                    replyText = 'রক্তদানের আগে প্রচুর পানি পান করুন ও পুষ্টিকর খাবার খেয়ে যান। রক্তদানের পর অন্তত ১৫ মিনিট শুয়ে থাকুন এবং খেজুর ও জুস খান। ৪-৮ সপ্তাহের মধ্যে শরীরের রক্তকণিকা সম্পূর্ণ স্বাভাবিক হয়ে যায়।';
                                  } else {
                                    replyText = 'আপনার প্রশ্নটির জন্য ধন্যবাদ। যেকোনো জরুরি শারীরিক জটিলতায় ঘরোয়া টোটকা না মেনে দ্রুত রেজিস্টার্ড চিকিৎসকের পরামর্শ নেওয়া আবশ্যক।';
                                  }
                                } else if (currentChat.id === 'cc-2') {
                                  // DestiCare Central Squad
                                  if (lower.includes('রক্ত') || lower.includes('ডোনার') || lower.includes('জরুরি')) {
                                    replyText = 'আমাদের কেন্দ্রীয় ডাটাবেজে রোগীর রক্তের গ্রুপ ও হাসপাতালের নাম দিয়ে DestiCare-এ একটি লাইভ রিকুয়েস্ট পোস্ট করুন। নিকটস্থ ৫ কিমির মধ্যে থাকা ভলান্টিয়ার ডোনারদের কাছে অটো-নোটিফিকেশন পাঠানো হবে!';
                                  } else {
                                    replyText = 'জরুরি রক্তের চাহিদা সমন্বয়ে আমাদের টিম সার্বক্ষণিক ২৪/৭ কাজ করছে। আপনার হাসপাতালের অবস্থান জানান, আমরা ব্যবস্থা করছি।';
                                  }
                                } else if (currentChat.id === 'cc-3') {
                                  // Dr. Rafiqul (Medicine)
                                  if (lower.includes('সাপ') || lower.includes('রাসেলস') || lower.includes('কামড়')) {
                                    replyText = 'সাপে কাটলে আক্রান্ত অঙ্গ ভুলেও ব্লেড দিয়ে কাটবেন না বা শক্ত বাঁধন দেবেন না! আক্রান্ত পা বা হাত স্প্লিন্ট দিয়ে শক্ত করে স্থির রেখে রোগীকে অবিলম্বে সরকারি হাসপাতালে নিন—সেখানে এন্টিভেনম ফ্রি!';
                                  } else {
                                    replyText = 'ধন্যবাদ। যেকোনো উপসর্গ ৩ দিনের বেশি থাকলে পরীক্ষা ছাড়া অ্যান্টিবায়োটিক সেবন করবেন না। রেজিস্টার্ড ডাক্তারের পরামর্শ নিন।';
                                  }
                                }

                                const doctorReply = {
                                  id: `msg-${Date.now() + 1}`,
                                  sender: 'creator' as const,
                                  text: replyText,
                                  time: 'এইমাত্র',
                                };

                                setCreatorChats((prev) =>
                                  prev.map((c) =>
                                    c.id === currentChat.id
                                      ? {
                                          ...c,
                                          messages: [...c.messages, doctorReply],
                                          lastMessage: doctorReply.text,
                                          lastTime: 'এইমাত্র',
                                          unreadCount: 0,
                                        }
                                      : c
                                  )
                                );
                              }, 1200);
                            }
                          }}
                          className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-purple-500 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!chatMessageText.trim()) return;
                            const sentText = chatMessageText.trim();
                            const newMsg = {
                              id: `msg-${Date.now()}`,
                              sender: 'me' as const,
                              text: sentText,
                              time: 'এইমাত্র',
                            };
                            setCreatorChats((prev) =>
                              prev.map((c) =>
                                c.id === currentChat.id
                                ? {
                                    ...c,
                                    messages: [...c.messages, newMsg],
                                    lastMessage: newMsg.text,
                                    lastTime: 'এইমাত্র',
                                  }
                                : c
                              )
                            );
                            setChatMessageText('');
                            showToast('মেসেজ সফলভাবে পাঠানো হয়েছে!');

                            setTimeout(() => {
                              let replyText = 'আপনার বার্তার জন্য ধন্যবাদ। বিষয়টি পর্যালোচনা করে দ্রুত সমাধান দেওয়া হচ্ছে।';
                              const lower = sentText.toLowerCase();

                              if (currentChat.id === 'cc-1') {
                                if (lower.includes('পোড়া') || lower.includes('বরফ') || lower.includes('আগুন') || lower.includes('টুথপেস্ট')) {
                                  replyText = 'পোড়া স্থানে ভুলেও বরফ, টুথপেস্ট বা ডিম লাগাবেন না। সাথে সাথে সাধারণ তাপমাত্রার ট্যাপের পানিতে অন্তত ১৫-২০ মিনিট ভিজিয়ে রাখুন। ফোসকা পড়লে ফাটাবেন না। প্রয়োজনে নিকটস্থ বার্ন ইউনিটে যাবেন।';
                                } else if (lower.includes('রক্ত') || lower.includes('খাবার') || lower.includes('দুর্বল')) {
                                  replyText = 'রক্তদানের আগে প্রচুর পানি পান করুন ও পুষ্টিকর খাবার খেয়ে যান। রক্তদানের পর অন্তত ১৫ মিনিট শুয়ে থাকুন এবং খেজুর ও জুস খান। ৪-৮ সপ্তাহের মধ্যে শরীরের রক্তকণিকা সম্পূর্ণ স্বাভাবিক হয়ে যায়।';
                                } else {
                                  replyText = 'আপনার প্রশ্নটির জন্য ধন্যবাদ। যেকোনো জরুরি শারীরিক জটিলতায় ঘরোয়া টোটকা না মেনে দ্রুত রেজিস্টার্ড চিকিৎসকের পরামর্শ নেওয়া আবশ্যক।';
                                }
                              } else if (currentChat.id === 'cc-2') {
                                if (lower.includes('রক্ত') || lower.includes('ডোনার') || lower.includes('জরুরি')) {
                                  replyText = 'আমাদের কেন্দ্রীয় ডাটাবেজে রোগীর রক্তের গ্রুপ ও হাসপাতালের নাম দিয়ে DestiCare-এ একটি লাইভ রিকুয়েস্ট পোস্ট করুন। নিকটস্থ ৫ কিমির মধ্যে থাকা ভলান্টিয়ার ডোনারদের কাছে অটো-নোটিফিকেশন পাঠানো হবে!';
                                } else {
                                  replyText = 'জরুরি রক্তের চাহিদা সমন্বয়ে আমাদের টিম সার্বক্ষণিক ২৪/৭ কাজ করছে। আপনার হাসপাতালের অবস্থান জানান, আমরা ব্যবস্থা করছি।';
                                }
                              } else if (currentChat.id === 'cc-3') {
                                if (lower.includes('সাপ') || lower.includes('রাসেলস') || lower.includes('কামড়')) {
                                  replyText = 'সাপে কাটলে আক্রান্ত অঙ্গ ভুলেও ব্লেড দিয়ে কাটবেন না বা শক্ত বাঁধন দেবেন না! আক্রান্ত পা বা হাত স্প্লিন্ট দিয়ে শক্ত করে স্থির রেখে রোগীকে অবিলম্বে সরকারি হাসপাতালে নিন—সেখানে এন্টিভেনম ফ্রি!';
                                } else {
                                  replyText = 'ধন্যবাদ। যেকোনো উপসর্গ ৩ দিনের বেশি থাকলে পরীক্ষা ছাড়া অ্যান্টিবায়োটিক সেবন করবেন না। রেজিস্টার্ড ডাক্তারের পরামর্শ নিন।';
                                }
                              }

                              const doctorReply = {
                                id: `msg-${Date.now() + 1}`,
                                sender: 'creator' as const,
                                text: replyText,
                                time: 'এইমাত্র',
                              };

                              setCreatorChats((prev) =>
                                prev.map((c) =>
                                  c.id === currentChat.id
                                    ? {
                                        ...c,
                                        messages: [...c.messages, doctorReply],
                                        lastMessage: doctorReply.text,
                                        lastTime: 'এইমাত্র',
                                        unreadCount: 0,
                                      }
                                    : c
                                )
                              );
                            }, 1200);
                          }}
                          disabled={!chatMessageText.trim()}
                          className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-40 text-white rounded-full transition-transform active:scale-95 cursor-pointer shadow-md"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                );
              })()
            ) : (
              /* All Creator Chats List */
              <div className="flex-1 flex flex-col space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/80 via-zinc-900 to-zinc-950 border border-purple-500/30 shadow-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-black text-purple-300">
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                    <span>DESTI MEDIA ক্রিয়েটর চ্যাট হাব</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    আপনার পছন্দের ভলান্টিয়ার ক্রিয়েটর ও ডাক্তারদের সাথে সরাসরি কথা বলুন
                  </h2>
                  <p className="text-xs text-zinc-400">
                    ফার্স্ট এইড প্রশ্ন, রক্তদান কোঅর্ডিনেশন বা স্বাস্থ্য সচেতনতামূলক ভিডিও পরামর্শের জন্য এক্সক্লুসিভ ইনবক্স।
                  </p>
                </div>

                <div className="flex-1 bg-zinc-900/80 rounded-3xl border border-white/[0.06] overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>সক্রিয় ইনবক্স ({creatorChats.length})</span>
                    <span className="text-[11px] text-purple-400">২টি অপঠিত বার্তা</span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60">
                    {creatorChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          setActiveCreatorChatId(chat.id);
                          // mark read
                          setCreatorChats((prev) =>
                            prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
                          );
                        }}
                        className="p-3 sm:p-3.5 hover:bg-zinc-800/60 transition-colors cursor-pointer flex items-center space-x-3 group"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={chat.avatar}
                            alt={chat.creatorName}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-full object-cover border border-purple-500 group-hover:scale-105 transition-transform"
                          />
                          {chat.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-zinc-900" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs sm:text-sm font-bold text-white truncate flex items-center space-x-1">
                              <span>{chat.creatorName}</span>
                              <CheckCircle className="w-3 h-3 text-purple-400 fill-purple-400 shrink-0" />
                            </span>
                            <span className="text-[10px] text-zinc-500 shrink-0 ml-1 font-mono">
                              {chat.lastTime}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>

                        {chat.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-purple-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-md">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          {/* ================= TAB 5: PROFILE & SETTINGS (DESTI MEDIA নিজস্ব প্রোফাইল ও সেটিংস) ================= */}
          {activeSubTab === 'profile' && (
            <div className="max-w-4xl mx-auto w-full p-3 sm:p-4 space-y-5">
              {/* User Channel Header */}
              <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900 border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-md"
                      />
                      <span className="absolute bottom-0 right-0 p-1 bg-purple-600 rounded-full text-white text-[9px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-white">তানভীর আহমেদ</h2>
                      <p className="text-xs text-zinc-400 font-mono">@tanvir_desti • ভলান্টিয়ার ক্রিয়েটর</p>
                      <p className="text-[11px] text-purple-300 font-medium mt-0.5">রক্তদাতা ও স্বাস্থ্য সচেতনতা কর্মী</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন আপলোড</span>
                  </button>
                </div>

                {/* Channel Stats Row */}
                <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/[0.06]">
                  <div className="text-center p-2 rounded-xl bg-zinc-950/60">
                    <span className="text-xs sm:text-sm font-black text-white block">{myUploads.length}</span>
                    <span className="text-[10px] text-zinc-400">আপলোড</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-zinc-950/60">
                    <span className="text-xs sm:text-sm font-black text-white block">১.২K</span>
                    <span className="text-[10px] text-zinc-400">ভিউ</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-zinc-950/60">
                    <span className="text-xs sm:text-sm font-black text-white block">৩২০</span>
                    <span className="text-[10px] text-zinc-400">সাবস্ক্রাইবার</span>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-zinc-950/60">
                    <span className="text-xs sm:text-sm font-black text-purple-400 block">৬৫০</span>
                    <span className="text-[10px] text-zinc-400">HP পয়েন্ট</span>
                  </div>
                </div>
              </div>

              {/* Profile Subtabs (My Uploads / Saved & History / Settings) */}
              <div className="flex border-b border-zinc-800 text-xs font-bold">
                <button
                  onClick={() => setProfileTab('uploads')}
                  className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-b-2 ${
                    profileTab === 'uploads'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  আমার আপলোডসমূহ
                </button>
                <button
                  onClick={() => setProfileTab('history')}
                  className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-b-2 ${
                    profileTab === 'history'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  সংরক্ষিত ও ইতিহাস
                </button>
                <button
                  onClick={() => setProfileTab('settings')}
                  className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-b-2 ${
                    profileTab === 'settings'
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  মিডিয়া সেটিংস
                </button>
              </div>

              {/* Subtab 1: MY UPLOADS */}
              {profileTab === 'uploads' && (
                <div className="space-y-3">
                  {myUploads.length === 0 ? (
                    <div className="text-center py-10 text-zinc-500 space-y-2">
                      <Video className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
                      <p className="text-xs font-semibold">আপনি এখনও কোনো ভিডিও বা রিল আপলোড করেননি</p>
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold"
                      >
                        প্রথম কন্টেন্ট {l('আপলোড করুন', 'Upload')}
                      </button>
                    </div>
                  ) : (
                    myUploads.map((up) => (
                      <div
                        key={up.id}
                        className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={up.thumbnail}
                            alt={up.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-purple-400 bg-purple-950/70 px-1.5 py-0.5 rounded">
                              {up.type}
                            </span>
                            <h4 className="text-xs font-bold text-white truncate mt-1">{up.title}</h4>
                            <p className="text-[10px] text-zinc-400">{up.views} ভিউ • {up.likes} লাইক</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setMyUploads((prev) => prev.filter((x) => x.id !== up.id));
                            showToast('আপলোডটি অপসারিত হয়েছে');
                          }}
                          className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Subtab 2: SAVED & WATCH HISTORY */}
              {profileTab === 'history' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      সংরক্ষিত ও ডাউনলোড করা কন্টেন্ট ({savedItems.length + Object.keys(downloadedMap).length})
                    </h3>
                    {savedItems.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4 text-center">কোনো বুকমার্ক করা ভিডিও নেই</p>
                    ) : (
                      savedItems.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveWatchVideo(s);
                            setVideoCurrentTime(0);
                            setIsVideoPlaying(true);
                          }}
                          className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-500/50"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={s.thumbnail}
                              alt={s.title}
                              referrerPolicy="no-referrer"
                              className="w-14 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
                              <p className="text-[10px] text-zinc-400">{s.creator.name}</p>
                            </div>
                          </div>
                          <span className="text-xs text-purple-400 font-bold shrink-0">দেখুন →</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Subtab 3: MEDIA SETTINGS (DESTI MEDIA নিজস্ব সেটিংস) */}
              {profileTab === 'settings' && (
                <div className="space-y-3 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-zinc-800">
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>মিডিয়া ও প্লেয়ার সেটিংস</span>
                  </h3>

                  {/* Setting 1: Data Saver */}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
                    <div>
                      <h4 className="text-xs font-bold text-white">ডাটা সেভার মোড</h4>
                      <p className="text-[11px] text-zinc-400">লো-রেজোলিউশন ও অডিও-ফার্স্ট ব্যান্ডউইথ সাশ্রয়</p>
                    </div>
                    <button
                      onClick={() => {
                        setDataSaverMode(!dataSaverMode);
                        showToast(`ডাটা সেভার: ${!dataSaverMode ? 'চালু' : 'বন্ধ'}`);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        dataSaverMode ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          dataSaverMode ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Setting 2: Auto Play Next */}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
                    <div>
                      <h4 className="text-xs font-bold text-white">অটো-প্লে পরবর্তী ভিডিও</h4>
                      <p className="text-[11px] text-zinc-400">একটি ভিডিও শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তীটি প্লে হবে</p>
                    </div>
                    <button
                      onClick={() => {
                        setAutoPlayNext(!autoPlayNext);
                        showToast(`অটো-প্লে: ${!autoPlayNext ? 'চালু' : 'বন্ধ'}`);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        autoPlayNext ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          autoPlayNext ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Setting 3: Offline Download Quality */}
                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/80">
                    <div>
                      <h4 className="text-xs font-bold text-white">অফলাইন ডাউনলোড কোয়ালিটি</h4>
                      <p className="text-[11px] text-zinc-400">জরুরি অবস্থায় অফলাইন দেখার ভিডিও রেজোলিউশন</p>
                    </div>
                    <select
                      value={downloadQuality}
                      onChange={(e) => {
                        setDownloadQuality(e.target.value as any);
                        showToast(`ডাউনলোড কোয়ালিটি: ${e.target.value}`);
                      }}
                      className="bg-zinc-800 border border-zinc-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="720p">HD 720p</option>
                      <option value="360p">ডাটা সেভার 360p</option>
                    </select>
                  </div>

                  {/* Setting 4: Emergency Alerts */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">জরুরি স্বাস্থ্য ও লাইভ মিশন নোটিফিকেশন</h4>
                      <p className="text-[11px] text-zinc-400">রক্তদান ও রেসকিউ জরুরি ভিডিও পোস্ট হলে তৎক্ষণাৎ জানানো</p>
                    </div>
                    <button
                      onClick={() => {
                        setEmergencyAlerts(!emergencyAlerts);
                        showToast(`জরুরি নোটিফিকেশন: ${!emergencyAlerts ? 'চালু' : 'বন্ধ'}`);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        emergencyAlerts ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          emergencyAlerts ? 'left-6' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= FLOATING MINI-PLAYER (PICTURE-IN-PICTURE) ================= */}
      {activeWatchVideo && isMinimized && (
        <div className="fixed bottom-16 left-2 right-2 max-w-md mx-auto z-40 bg-zinc-950/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl p-2 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div
            onClick={() => {
              setIsMinimized(false);
              if (onSelectSubTab) onSelectSubTab('feed');
            }}
            className="flex items-center space-x-2.5 min-w-0 flex-1 cursor-pointer group"
          >
            <div className="relative w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-black border border-white/10 group-hover:border-purple-400/60 transition-colors">
              <img
                src={activeWatchVideo.thumbnail}
                alt={activeWatchVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isVideoPlaying && (
                <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                {activeWatchVideo.title}
              </p>
              <p className="text-[10px] text-purple-300 truncate">
                {activeWatchVideo.creator.name} • {formatSeconds(videoCurrentTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
            >
              {isVideoPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsMinimized(false);
                if (onSelectSubTab) onSelectSubTab('feed');
              }}
              className="w-8 h-8 rounded-full hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="থিয়েটার মোডে ফিরুন"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveWatchVideo(null);
                setIsMinimized(false);
              }}
              className="w-8 h-8 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-red-400 flex items-center justify-center cursor-pointer transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= FLOATING AUDIO PODCAST PLAYER ================= */}
      {activeAudioItem && !activeWatchVideo && (
        <div className="fixed bottom-16 left-2 right-2 max-w-md mx-auto z-40 bg-gradient-to-r from-purple-950/95 via-zinc-950/95 to-indigo-950/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl p-2.5 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 relative bg-black border border-white/10">
              <img src={activeAudioItem.thumbnail} alt={activeAudioItem.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{activeAudioItem.title}</p>
              <p className="text-[10px] text-purple-300 truncate">
                {activeAudioItem.creator.name} • {formatSeconds(audioCurrentTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => setIsAudioPlaying(!isAudioPlaying)}
              className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer shadow-md transition-transform active:scale-95"
            >
              {isAudioPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setActiveAudioItem(null);
                setIsAudioPlaying(false);
              }}
              className="w-7 h-7 rounded-full text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Creator Studio Upload Modal */}
      <DestiMediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmitMedia={(newMedia) => {
          setItems((prev) => [newMedia, ...prev]);
          setMyUploads((prev) => [newMedia, ...prev]);
          if (newMedia.type === 'video') {
            setActiveWatchVideo(newMedia);
          } else {
            setCurrentReelIndex(0);
            setIsReelPlaying(true);
            if (onSelectSubTab) onSelectSubTab('reels');
          }
          showToast('নতুন কন্টেন্ট সফলভাবে আপলোড হয়েছে! (+১০ HP)');
        }}
      />
    </div>
  );
};

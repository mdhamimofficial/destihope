import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu,
  Search, 
  Bell,
  Phone, 
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video, 
  ArrowLeft, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff,
  Users, 
  CheckCheck,
  Check,
  ShieldCheck,
  Clock,
  SquarePen,
  X,
  Droplet,
  HeartHandshake,
  Send,
  MoreVertical,
  Plus,
  Sparkles,
  Camera,
  Image as ImageIcon,
  FileText,
  MapPin,
  CheckCircle2,
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  AlertCircle,
  ExternalLink,
  UserSearch,
  Brain,
  Clapperboard,
  Heart,
  Info,
  Radio,
  Layers,
  Siren,
  Activity,
  Building2,
  Flame,
  Zap,
  Navigation,
  Bookmark,
  Pin,
  MessageSquare,
  MessageCircle,
  User,
  PlusCircle,
  Moon,
  Sun,
  Globe,
  Wifi,
  Award,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Settings,
  Lock,
  Copy,
  Edit3
} from 'lucide-react';
import { ChatConversation, ChatMessage, ActiveModule, UserProfile } from '../../types';
import { mockConversations } from '../../data/mockData';
import { DestiChatCreateStoryModal } from '../modals/DestiChatCreateStoryModal';

interface DestiChatViewProps {
  onBackToHome?: () => void;
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onOpenCreatePost?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
  currentUser?: UserProfile;
  onUpdateUser?: (user: UserProfile) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  language?: 'bn' | 'en';
  onToggleLanguage?: () => void;
  dataSaverEnabled?: boolean;
  onToggleDataSaver?: () => void;
  onEmergencyCallClick?: () => void;
  onTimerClick?: () => void;
  onReportsClick?: () => void;
  onLocationClick?: () => void;
}

// Initial conversation messages dictionary
const initialMessagesMap: Record<string, ChatMessage[]> = {
  'chat-1': [
    {
      id: 'm1-1',
      sender: 'other',
      text: 'আসসালামু আলাইকুম তানভীর ভাই। ঢামেক ইমার্জেন্সিতে রোগী সাব্বির আহমেদের জন্য জরুরি A+ রক্তের আবেদন দেখেছি।',
      time: '১০:০৫ AM',
      type: 'text'
    },
    {
      id: 'm1-card',
      sender: 'other',
      text: 'জরুরি রক্তের আবেদন কনফার্মেশন কার্ড',
      time: '১০:০৬ AM',
      type: 'blood_card',
      moduleOrigin: 'care',
      caseCardData: {
        title: 'জরুরি A+ রক্তের আবেদন (রোগী: সাব্বির আহমেদ)',
        desc: 'ঢাকা মেডিকেল কলেজ হাসপাতাল • ৩য় তলা হেমাটোলজি ওয়ার্ড • হিমোগ্লোবিন ৬.২',
        badge: 'DestiCare জরুরি',
        bloodGroup: 'A+',
        hospital: 'ঢামেক জরুরি বিভাগ',
        phone: '01822-334455',
        status: 'অপেক্ষমাণ',
        actionLabel: 'আমি রক্ত দিতে প্রস্তুত'
      }
    },
    {
      id: 'm1-2',
      sender: 'me',
      text: 'ওয়ালাইকুমুস সালাম আপু। রোগী এখন কোন ইউনিটে আছে? ডাক্তার কি ক্রস-ম্যাচিং করতে বলেছেন?',
      time: '১০:০৮ AM',
      type: 'text'
    },
    {
      id: 'm1-3',
      sender: 'other',
      text: 'জি ভাই, ডাক্তার সাহেব ব্লাড ব্যাংকে ক্রস-ম্যাচিং করতে বলেছেন। আমি ধানমন্ডি থেকে রওনা হয়েছি, ইনশাআল্লাহ ১৫ মিনিটের মধ্যে ঢামেক ইমার্জেন্সিতে পৌঁছাব।',
      time: '১০:১০ AM',
      type: 'text'
    },
    {
      id: 'm1-loc',
      sender: 'other',
      text: 'আমার বর্তমান লাইভ লোকেশন শেয়ার করেছি',
      time: '১০:১১ AM',
      type: 'location',
      caseCardData: {
        title: 'লাইভ লোকেশন: ঢাকা মেডিকেল মোড়',
        desc: 'আনুমানিক ৫ মিনিটে পৌঁছাবে (দূরত্ব ১.২ কিমি)',
        badge: 'জিপিএস ট্র্যাকিং'
      }
    }
  ],
  'chat-2': [
    {
      id: 'm2-1',
      sender: 'other',
      text: 'জরুরি নিখোঁজ নোটিশ: ১০ বছর বয়সী সামিউল ইসলাম গতকাল দুপুর ২টা থেকে চট্টগ্রাম আগ্রাবাদ এলাকা থেকে নিখোঁজ।',
      time: '০৮:৩০ AM',
      type: 'missing_card',
      moduleOrigin: 'find',
      caseCardData: {
        title: 'নিখোঁজ শিশু সন্ধান: সামিউল ইসলাম (১০ বছর)',
        desc: 'গায়ের রঙ ফর্সা, পরনে ছিল নীল শার্ট ও কালো প্যান্ট। আগ্রাবাদ সিডিএ এলাকা।',
        badge: 'DestiFind কেস #৭৮২',
        caseId: 'FIND-782',
        photo: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=300',
        status: 'সক্রিয় অনুসন্ধান',
        actionLabel: 'ক্লু বা তথ্য প্রদান করুন'
      }
    },
    {
      id: 'm2-2',
      sender: 'other',
      text: 'আমাদের ভলান্টিয়ার টিম আগ্রাবাদ বাদামতলী ও চৌমুহনী মোড়ে মাইকিং ও পোস্টারিং শেষ করেছে।',
      time: '০৯:১৫ AM',
      type: 'text'
    },
    {
      id: 'm2-3',
      sender: 'me',
      text: 'আলহামদুলিল্লাহ টিম! আমাদের চকবাজার ও জিইসি সার্কেল ভলান্টিয়ারদেরও ছবি ও ডিটেইলস পাঠানো হয়েছে। সিসিটিভি ফুটেজ দেখার চেষ্টা চলছে।',
      time: '০৯:২০ AM',
      type: 'text'
    }
  ],
  'chat-3': [
    {
      id: 'm3-1',
      sender: 'other',
      text: 'তানভীর ভাই, DestiHope-এ আপনার পোস্টটা দেখলাম। ব্লাড ডোনার পাওয়ার খবর পেয়ে খুব ভালো লাগল!',
      time: 'গতকাল',
      type: 'text'
    },
    {
      id: 'm3-2',
      sender: 'me',
      text: 'ধন্যবাদ তানভীর ভাই। DestiCare-এর সহায়তায় দ্রুত ডোনারের সাথে যোগাযোগ করা গেছে। রোগীর অবস্থা এখন কিছুটা স্থিতিশীল।',
      time: 'গতকাল',
      type: 'text'
    }
  ],
  'chat-4': [
    {
      id: 'm4-1',
      sender: 'other',
      text: 'আসসালামু আলাইকুম। আমি DestiBrain এআই হেলথ ডক্টর। আপনার স্বাস্থ্য সংক্রান্ত যেকোনো লক্ষণ বা মেডিকেল রিপোর্ট নিয়ে কথা বলতে পারেন।',
      time: '১০:০০ AM',
      type: 'text'
    },
    {
      id: 'm4-2',
      sender: 'me',
      text: 'আমার গত ২ দিন ধরে ১০১ ডিগ্রি জ্বর আর তীব্র শরীর ব্যথা। সাথে হালকা বমি বমি ভাব আছে। কী করণীয়?',
      time: '১০:০২ AM',
      type: 'text'
    },
    {
      id: 'm4-3',
      sender: 'other',
      text: 'লক্ষণগুলো ডেঙ্গুর সাথে মিল রয়েছে। প্যারাসিটামল ৫০০ মি.গ্রা. ছাড়া কোনো ব্যথানাশক ওষুধ খাবেন না। প্রচুর পরিমাণে তরল পান করুন এবং নিকটস্থ ল্যাবে CBC ও NS1 অ্যান্টিজেন টেস্ট করান।',
      time: '১০:০৩ AM',
      type: 'brain_card',
      moduleOrigin: 'brain',
      caseCardData: {
        title: 'এআই প্রাথমিক স্বাস্থ্য পর্যালোচনা রিপোর্ট',
        desc: 'সতর্কতা: উচ্চ জ্বর ও তীব্র শরীর ব্যথায় পানিশূন্যতা রোধ করুন। রক্তের প্লাটিলেট পরীক্ষা জরুরি।',
        badge: 'DestiBrain এআই প্রেসক্রিপশন গাইড',
        actionLabel: 'ল্যাব টেস্ট লিস্ট দেখুন'
      }
    }
  ],
  'chat-8': [
    {
      id: 'm8-1',
      sender: 'other',
      text: 'আসসালামু আলাইকুম টিম! আজ রাতে ঢামেক ও সোহরাওয়ার্দী হাসপাতালের জরুরি ব্লাড শিফট নির্ধারণ করা হয়েছে।',
      time: '০২:৩০ PM',
      type: 'text'
    },
    {
      id: 'm8-2',
      sender: 'me',
      text: 'আলহামদুলিল্লাহ, মিরপুর ও ধানমন্ডি জোনের ৪ জন ভলান্টিয়ার অন-কল আছেন। যেকোনো ইমার্জেন্সিতে কল দিলেই হবে।',
      time: '০২:৩৫ PM',
      type: 'text'
    }
  ],
  'chat-saved': [
    {
      id: 'ms-1',
      sender: 'me',
      text: '📌 [সংরক্ষিত ইমার্জেন্সি নোট]: ঢামেক হেমাটোলজি জরুরি রক্তের হটলাইন: ০২-৯৩৩০১৮৬ | সেন্ট্রাল ভলান্টিয়ার ডেস্ক: ০৯৬১২-০০০৯৯৯',
      time: 'গতকাল, ০৯:১৫ PM',
      type: 'text'
    },
    {
      id: 'ms-2',
      sender: 'me',
      text: '🩸 জরুরি ডোনার যোগাযোগ: সাদিয়া তাসনিম (A+ রক্তদাতা - ধানমন্ডি) - 01822-334455',
      time: 'আজ, ০৮:৪৫ AM',
      type: 'text'
    },
    {
      id: 'ms-3',
      sender: 'me',
      text: '📝 প্রেসক্রিপশন নোট: ডেঙ্গু সতর্কতায় দিনে ৩-৪ লিটার তরল গ্রহণ, শুধুমাত্র প্যারাসিটামল ৫০০ মি.গ্রা. এবং নিয়মিত সিবিসি টেস্ট।',
      time: 'আজ, ০৯:০০ AM',
      type: 'text'
    }
  ]
};

// Mock emergency call history
const mockCalls = [
  { id: 'c1', name: 'সাদিয়া তাসনিম (A+ ডোনার)', type: 'incoming', time: 'আজ, ১০:১৫ AM', duration: '৩ মিনিট ১২ সেকেন্ড', phone: '01822-334455', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', module: 'care' },
  { id: 'c2', name: 'ঢামেক জরুরি ব্লাড ডেস্ক', type: 'outgoing', time: 'আজ, ০৯:৪০ AM', duration: '১ মিনিট ৪৫ সেকেন্ড', phone: '01711-223344', avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150', module: 'care' },
  { id: 'c3', name: 'চট্টগ্রাম রেসকিউ কোঅর্ডিনেটর', type: 'missed', time: 'গতকাল, ০৮:২০ PM', duration: 'মিসড কল', phone: '01933-445566', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80', module: 'find' },
  { id: 'c4', name: 'তানভীর আহমেদ', type: 'outgoing', time: 'গতকাল, ০৪:১০ PM', duration: '২ মিনিট ৩০ সেকেন্ড', phone: '01711-998877', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', module: 'hope' }
];

// 24/7 National and Ecosystem Emergency Hotlines
const emergencyHotlines = [
  { id: 'h1', title: 'জাতীয় জরুরি সেবা', number: '৯৯৯', desc: 'পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স সহায়তা', badge: '২৪/৭ টোল-ফ্রি', color: 'bg-rose-500' },
  { id: 'h2', title: 'স্বাস্থ্য বাতায়ন', number: '১৬২৬৩', desc: 'সরকারি বিশেষজ্ঞ ডাক্তারদের জরুরি স্বাস্থ্য পরামর্শ', badge: 'স্বাস্থ্য মন্ত্রণালয়', color: 'bg-teal-600' },
  { id: 'h3', title: 'শিশু সহায়তা ও নিখোঁজ হেল্পলাইন', number: '১০৯৮', desc: 'হারিয়ে যাওয়া শিশু উদ্ধার ও সমাজসেবা ডেস্ক', badge: 'টোল-ফ্রি', color: 'bg-amber-600' },
  { id: 'h4', title: 'রেড ক্রিসেন্ট জরুরি রক্ত ব্যাংক', number: '০২-৯৩৩০১৮৬', desc: 'জরুরি রক্তের চাহিদা ও প্লাজমা রিকুইজিশন সাপোর্ট', badge: 'ব্লাড ব্যাংক', color: 'bg-red-600' },
  { id: 'h5', title: 'Desti ভলান্টিয়ার রেসকিউ ডেস্ক', number: '০৯৬১২-০০০৯৯৯', desc: 'সেন্ট্রাল ইমার্জেন্সি ডোনার ও রেসকিউ কোঅর্ডিনেশন', badge: 'ইকোসিস্টেম', color: 'bg-emerald-600' }
];

export const DestiChatView: React.FC<DestiChatViewProps> = ({ 
  onBackToHome,
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenMenu,
  onOpenNotifications,
  onOpenCreatePost,
  activeSubTab = 'chat',
  onSelectSubTab,
  currentUser,
  onUpdateUser,
  isDarkMode = false,
  onToggleDarkMode,
  language = 'bn',
  onToggleLanguage,
  dataSaverEnabled = false,
  onToggleDataSaver,
  onEmergencyCallClick,
  onTimerClick,
  onReportsClick,
  onLocationClick
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(initialMessagesMap);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'personal' | 'saved'>('all');
  const [tabSubFilter, setTabSubFilter] = useState<string>('all');
  const [activeModuleSubFilter, setActiveModuleSubFilter] = useState<'all' | 'care' | 'find' | 'brain' | 'media'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'care' | 'find' | 'groups' | 'brain' | 'media'>('all');
  const [inputMessage, setInputMessage] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isCreateNoteModalOpen, setIsCreateNoteModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [profileNotificationEnabled, setProfileNotificationEnabled] = useState(true);
  const [internalSubTab, setInternalSubTab] = useState<string>(activeSubTab || 'chat');
  useEffect(() => {
    if (activeSubTab) setInternalSubTab(activeSubTab);
  }, [activeSubTab]);

  const [chatUserStatus, setChatUserStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const [chatBio, setChatBio] = useState('সহযোগিতায় সর্বদা প্রস্তুত 🕊️ | DestiHope ভলান্টিয়ার');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [chatLastSeenEnabled, setChatLastSeenEnabled] = useState(true);
  const [chatReadReceiptsEnabled, setChatReadReceiptsEnabled] = useState(true);
  const [chatSoundEnabled, setChatSoundEnabled] = useState(true);
  const [privacyOnlineStatus, setPrivacyOnlineStatus] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'emergency' | 'prescription' | 'contact' | 'general'>('emergency');
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupPurpose, setNewGroupPurpose] = useState('ভলান্টিয়ার রেসকিউ টিম');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; avatar: string; phone?: string; isVideo?: boolean } | null>(null);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallSpeaker, setIsCallSpeaker] = useState(true);
  const [callTimer, setCallTimer] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [confirmedBloodCard, setConfirmedBloodCard] = useState<boolean>(false);
  const [chatToast, setChatToast] = useState<string | null>(null);

  // Universal Eco-Tools Modal States
  const [activeToolModal, setActiveToolModal] = useState<'sos' | 'blood' | 'find' | 'ai' | null>(null);
  const [bloodToolGroup, setBloodToolGroup] = useState('A+');
  const [bloodToolHospital, setBloodToolHospital] = useState('ঢাকা মেডিকেল কলেজ হাসপাতাল');
  const [bloodToolContact, setBloodToolContact] = useState('০১৭০০-১২৩৪৫৬');
  const [bloodToolBags, setBloodToolBags] = useState(1);
  const [sosLocation, setSosLocation] = useState('ধানমন্ডি ২৭, ঢাকা');
  const [sosPatient, setSosPatient] = useState('জরুরি আইসিইউ রোগী');
  const [sosUrgency, setSosUrgency] = useState<'critical' | 'urgent'>('critical');
  const [findPerson, setFindPerson] = useState('মোঃ আবির হোসেন (বয়স ১২)');
  const [findArea, setFindArea] = useState('চট্টগ্রাম আগ্রাবাদ সিডিএ');
  const [findContact, setFindContact] = useState('০১৮১১-২২৩৩৪৪');
  const [aiSymptomText, setAiSymptomText] = useState('');
  const [aiGeneratedSummary, setAiGeneratedSummary] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChat) {
      scrollToBottom();
    }
  }, [activeChat, messagesMap]);

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (activeCallContact) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCallContact]);

  // Tab counts calculation
  const countAll = conversations.length;
  const countPersonal = conversations.filter(c => c.type === 'personal' || (c.type !== 'group' && (!c.membersCount || c.membersCount <= 0) && c.type !== 'saved' && c.id !== 'chat-saved')).length;
  const countGroups = conversations.filter(c => c.type === 'group' || (c.membersCount && c.membersCount > 0)).length;
  const countModules = conversations.filter(c => (c.moduleOrigin && ['care', 'find', 'brain', 'media'].includes(c.moduleOrigin)) || c.type === 'blood_chat' || c.type === 'missing_chat').length;
  const countSaved = conversations.filter(c => c.isSaved || c.type === 'saved' || c.id === 'chat-saved').length;

  // Unread badge calculations for each tab
  const unreadAll = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadPersonal = conversations.filter(c => c.type === 'personal' || (c.type !== 'group' && (!c.membersCount || c.membersCount <= 0) && c.type !== 'saved' && c.id !== 'chat-saved')).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadGroups = conversations.filter(c => c.type === 'group' || (c.membersCount && c.membersCount > 0)).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadModules = conversations.filter(c => (c.moduleOrigin && ['care', 'find', 'brain', 'media'].includes(c.moduleOrigin)) || c.type === 'blood_chat' || c.type === 'missing_chat').reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadSaved = 0;

  // Toggle bookmark / save chat
  const toggleSaveChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.map(c => {
      if (c.id === chatId) {
        const nextSaved = !c.isSaved;
        showToast(nextSaved ? `📌 "${c.title}" সেভড তালিকায় যোগ করা হয়েছে` : `"${c.title}" সেভড তালিকা থেকে সরানো হয়েছে`);
        return { ...c, isSaved: nextSaved };
      }
      return c;
    }));
  };

  // Add new note to Saved Messages
  const handleSaveNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    const prefix = newNoteCategory === 'emergency' ? '🚨 [জরুরি ইমার্জেন্সি নোট]' :
                   newNoteCategory === 'prescription' ? '📝 [প্রেসক্রিপশন/ওষুধ নোট]' :
                   newNoteCategory === 'contact' ? '📞 [জরুরি যোগাযোগ নম্বর]' : '📌 [সংরক্ষিত নোট]';
    const newMsg: ChatMessage = {
      id: `note-${Date.now()}`,
      sender: 'me',
      text: `${prefix}: ${newNoteText.trim()}`,
      time: timeStr,
      type: 'text'
    };

    setMessagesMap(prev => ({
      ...prev,
      'chat-saved': [...(prev['chat-saved'] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === 'chat-saved') {
        return {
          ...c,
          lastMessage: newMsg.text,
          lastMessageTime: 'এইমাত্র'
        };
      }
      return c;
    }));

    setNewNoteText('');
    setIsCreateNoteModalOpen(false);
    showToast('✅ নতুন নোট Saved Messages-এ সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // Create new group chat
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    const newGroup: ChatConversation = {
      id: `group-${Date.now()}`,
      title: newGroupTitle.trim(),
      avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=120&q=80',
      type: 'group',
      moduleOrigin: 'care',
      moduleTag: newGroupPurpose,
      lastMessage: 'গ্রুপ তৈরি হয়েছে। সবাইকে স্বাগতম!',
      lastMessageTime: 'এইমাত্র',
      unreadCount: 0,
      membersCount: 5,
      badge: 'টিম গ্রুপ'
    };

    setConversations(prev => [newGroup, ...prev]);
    setMessagesMap(prev => ({
      ...prev,
      [newGroup.id]: [
        {
          id: `gm-${Date.now()}`,
          sender: 'me',
          text: `🎉 "${newGroupTitle.trim()}" গ্রুপ তৈরি করা হয়েছে। উদ্দেশ্য: ${newGroupPurpose}`,
          time: 'এইমাত্র',
          type: 'text'
        }
      ]
    }));

    setNewGroupTitle('');
    setIsCreateGroupModalOpen(false);
    setActiveChat(newGroup);
    showToast(`✅ "${newGroup.title}" গ্রুপ তৈরি হয়েছে!`);
  };

  // Filter conversations based on category tab, submodule filters, and search
  const filteredConversations = conversations.filter((c) => {
    // Sub-tab constraints
    if (activeSubTab === 'blood') {
      if (c.type !== 'blood_chat' && c.moduleOrigin !== 'care') return false;
    } else if (activeSubTab === 'groups') {
      if (c.type !== 'group' && (!c.membersCount || c.membersCount <= 0)) return false;
    }

    // 1. Category Tab: All Chats | Personal | Saved
    if (activeCategoryTab === 'personal') {
      if (c.type === 'group' || (c.membersCount && c.membersCount > 0) || c.type === 'saved' || c.id === 'chat-saved') {
        return false;
      }
      if (tabSubFilter === 'online' && !c.onlineStatus) return false;
      if (tabSubFilter === 'unread' && (!c.unreadCount || c.unreadCount <= 0)) return false;
    } else if (activeCategoryTab === 'saved') {
      if (!c.isSaved && c.type !== 'saved' && c.id !== 'chat-saved') {
        return false;
      }
      if (tabSubFilter === 'notes' && c.id !== 'chat-saved' && c.type !== 'saved') return false;
      if (tabSubFilter === 'chats' && (c.id === 'chat-saved' || c.type === 'saved')) return false;
    } else if (activeCategoryTab === 'all') {
      if (tabSubFilter === 'unread' && (!c.unreadCount || c.unreadCount <= 0)) return false;
      if (tabSubFilter === 'pinned' && !c.isPinned && !c.isSaved && !c.badge?.includes('পিন') && !c.badge?.includes('জরুরি')) return false;
    }

    // Legacy / Sub filter compatibility if activeFilter is set
    if (activeFilter !== 'all') {
      if (activeFilter === 'care' && c.type !== 'blood_chat' && c.moduleOrigin !== 'care') return false;
      if (activeFilter === 'find' && c.type !== 'missing_chat' && c.moduleOrigin !== 'find') return false;
      if (activeFilter === 'groups' && c.type !== 'group' && (!c.membersCount || c.membersCount <= 0)) return false;
      if (activeFilter === 'brain' && c.moduleOrigin !== 'brain') return false;
      if (activeFilter === 'media' && c.moduleOrigin !== 'media') return false;
    }

    // 2. Search query (মানুষ / chat / group search)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) || 
        c.lastMessage.toLowerCase().includes(q) ||
        (c.moduleTag && c.moduleTag.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  // Current active conversation messages
  const activeMessages = activeChat 
    ? (messagesMap[activeChat.id] || [
        {
          id: 'def-1',
          sender: 'other',
          text: `আসসালামু আলাইকুম! ${activeChat.title}-এর সাথে যোগাযোগ শুরু হয়েছে।`,
          time: 'এইমাত্র',
          type: 'text'
        }
      ])
    : [];

  const handleSendMessage = (customText?: string, customType?: ChatMessage['type'], cardData?: ChatMessage['caseCardData']) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend && !customType) return;
    if (!activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: textToSend || (customType === 'blood_card' ? 'রক্তদানের আবেদন কার্ড' : 'সংযুক্ত ফাইল পাঠানো হয়েছে'),
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      type: customType || 'text',
      moduleOrigin: activeChat.moduleOrigin,
      caseCardData: cardData
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    // Update conversation lastMessage
    setConversations(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          lastMessage: textToSend || 'সংযুক্ত বার্তা পাঠানো হয়েছে',
          lastMessageTime: 'এইমাত্র'
        };
      }
      return c;
    }));

    setInputMessage('');
    setShowAttachmentMenu(false);

    // Simulated responsive reply if it's AI Doctor
    if (activeChat.moduleOrigin === 'brain') {
      setTimeout(() => {
        const aiReply: ChatMessage = {
          id: `ai-reply-${Date.now()}`,
          sender: 'other',
          text: 'ধন্যবাদ আপনার মেসেজের জন্য। আমি আপনার বর্ণনা বিশ্লেষণ করছি। শরীরের তাপমাত্রা ও রক্তের চাপ পর্যবেক্ষণ করুন। জরুরি প্রয়োজনে দ্রুত নিকটস্থ স্বাস্থ্যকেন্দ্রে যান।',
          time: 'এইমাত্র',
          type: 'text'
        };
        setMessagesMap(prev => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), aiReply]
        }));
      }, 1200);
    }
  };

  const handleStartCall = (isVideo: boolean = false) => {
    if (!activeChat) return;
    setActiveCallContact({
      name: activeChat.title,
      avatar: activeChat.avatar,
      phone: activeChat.phone || '01822-334455',
      isVideo
    });
  };

  const handleEndCall = () => {
    setActiveCallContact(null);
    setCallTimer(0);
  };

  const showToast = (msg: string) => {
    setChatToast(msg);
    setTimeout(() => setChatToast(null), 3000);
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get module badge styling
  const getModuleBadge = (origin?: string) => {
    switch (origin) {
      case 'care':
        return { label: 'DestiCare রক্তদান', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: Droplet };
      case 'find':
        return { label: 'DestiFind উদ্ধার', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: UserSearch };
      case 'brain':
        return { label: 'DestiBrain এআই', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Brain };
      case 'media':
        return { label: 'DestiMedia আলোচনা', bg: 'bg-violet-50 text-violet-700 border-violet-200', icon: Clapperboard };
      case 'hope':
      default:
        return { label: 'DestiHope ফ্রেন্ড', bg: 'bg-teal-50 text-teal-700 border-teal-200', icon: HeartHandshake };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] text-gray-900 font-sans select-none overflow-hidden">
      {/* Toast Alert */}
      {chatToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{chatToast}</span>
        </div>
      )}

      {/* ================= IF IN CONVERSATION VIEW ================= */}
      {activeChat ? (
        <div className="flex flex-col h-full bg-white relative z-30">
          {/* Active Chat Header */}
          <div className="px-3 py-2.5 bg-white border-b border-gray-200/90 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button 
                onClick={() => setActiveChat(null)}
                className="p-1.5 -ml-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
              </button>

              <div className="relative shrink-0 cursor-pointer" onClick={() => handleStartCall(false)}>
                <img 
                  src={activeChat.avatar} 
                  alt={activeChat.title}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                />
                {activeChat.onlineStatus && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="min-w-0 flex flex-col">
                <div className="flex items-center space-x-1">
                  <h2 className="text-sm font-bold text-gray-900 truncate leading-tight">
                    {activeChat.title}
                  </h2>
                  {activeChat.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-gray-500">
                  <span className="truncate">
                    {activeChat.onlineStatus ? 'সক্রিয় আছেন' : 'কিছুক্ষণ আগে সক্রিয় ছিলেন'}
                  </span>
                  {activeChat.moduleTag && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-teal-600 truncate">{activeChat.moduleTag}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button 
                onClick={() => handleStartCall(false)}
                className="w-9 h-9 flex items-center justify-center text-teal-600 hover:bg-teal-50 rounded-full transition-colors active:scale-90"
                title="ভয়েস কল করুন"
              >
                <Phone className="w-4.5 h-4.5 stroke-[2.3]" />
              </button>
              <button 
                onClick={() => handleStartCall(true)}
                className="w-9 h-9 flex items-center justify-center text-teal-600 hover:bg-teal-50 rounded-full transition-colors active:scale-90"
                title="ভিডিও কল করুন"
              >
                <Video className="w-5 h-5 stroke-[2.3]" />
              </button>
              <button 
                onClick={() => showToast(`${activeChat.title}-এর বিস্তারিত প্রোফাইল ওপেন হচ্ছে...`)}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
                title="তথ্য"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Module Context Smart Banner (Cross-module integration card on top) */}
          {activeChat.moduleOrigin === 'care' && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-rose-50 to-rose-100/60 border-b border-rose-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Droplet className="w-3.5 h-3.5 fill-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-rose-900 truncate">
                    জরুরি রক্তদান কেস • ঢাকা মেডিকেল কলেজ হাসপাতাল
                  </p>
                  <p className="text-[10px] text-rose-700 truncate font-medium">
                    গ্রুপ: A+ • রোগী: সাব্বির আহমেদ • আইসিইউ-৩
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setConfirmedBloodCard(true);
                  showToast('রক্তদান প্রতিশ্রুতি কনফার্ম করা হয়েছে!');
                }}
                className="text-[11px] font-bold bg-rose-600 hover:bg-rose-700 active:scale-95 text-white px-2.5 py-1 rounded-full shrink-0 shadow-xs transition-all cursor-pointer"
              >
                {confirmedBloodCard ? 'কনফার্মড ✓' : 'আমি প্রস্তুত'}
              </button>
            </div>
          )}

          {activeChat.moduleOrigin === 'find' && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100/60 border-b border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserSearch className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-emerald-900 truncate">
                    নিখোঁজ কেস #৭৮২: সামিউল ইসলাম (১০ বছর)
                  </p>
                  <p className="text-[10px] text-emerald-700 truncate font-medium">
                    আগ্রাবাদ, চট্টগ্রাম • লাইভ সার্চ অপারেশন চলমান
                  </p>
                </div>
              </div>
              <button 
                onClick={() => showToast('নিখোঁজ কেসের লাইভ রাডার ওপেন হচ্ছে...')}
                className="text-[11px] font-bold bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-2.5 py-1 rounded-full shrink-0 shadow-xs transition-all cursor-pointer"
              >
                কেস রাডার
              </button>
            </div>
          )}

          {activeChat.moduleOrigin === 'brain' && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-purple-50 to-purple-100/60 border-b border-purple-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Brain className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-purple-900 truncate">
                    DestiBrain এআই স্বাস্থ্য সহকারী
                  </p>
                  <p className="text-[10px] text-purple-700 truncate font-medium">
                    মেডিকেল টিপস ও লক্ষণ পর্যবেক্ষণ সক্রিয়
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-200/70 px-2 py-0.5 rounded-full">
                AI ভেরিফাইড
              </span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f0f2f5]/60">
            {/* Start of conversation encryption label */}
            <div className="text-center my-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-white/90 px-3 py-1 rounded-full shadow-2xs border border-gray-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>এন্ড-টু-এন্ড এনক্রিপ্টেড নিরাপদ চ্যাট</span>
              </span>
            </div>

            {activeMessages.map((msg) => {
              const isMe = msg.sender === 'me';

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Normal Text Message */}
                  {(!msg.type || msg.type === 'text') && (
                    <div 
                      className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-2xs ${
                        isMe 
                          ? 'bg-teal-600 text-white rounded-br-xs' 
                          : 'bg-white text-gray-900 rounded-bl-xs border border-gray-200/70'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${
                        isMe ? 'text-teal-100' : 'text-gray-400'
                      }`}>
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-teal-200" />}
                      </div>
                    </div>
                  )}

                  {/* DestiCare Blood Card Message */}
                  {msg.type === 'blood_card' && (
                    <div className="max-w-[88%] w-full bg-white rounded-2xl border-2 border-rose-200 shadow-sm overflow-hidden my-1">
                      <div className="bg-rose-500 px-3 py-2 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Droplet className="w-4 h-4 fill-white" />
                          <span className="text-xs font-bold">জরুরি রক্তের আবেদন</span>
                        </div>
                        <span className="text-[10px] font-black bg-white text-rose-600 px-2 py-0.5 rounded-full">
                          {msg.caseCardData?.bloodGroup || 'A+'} রক্ত
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-gray-900 mb-1">
                          {msg.caseCardData?.title}
                        </h4>
                        <p className="text-[11px] text-gray-600 mb-2 leading-relaxed">
                          {msg.caseCardData?.desc}
                        </p>
                        <div className="bg-rose-50 p-2 rounded-lg border border-rose-100 text-[11px] text-rose-800 space-y-0.5 mb-2.5">
                          <p>🏥 <b>হাসপাতাল:</b> {msg.caseCardData?.hospital}</p>
                          <p>📞 <b>হটলাইন:</b> {msg.caseCardData?.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setConfirmedBloodCard(true);
                              showToast('আপনি রক্তদানে সম্মতি জানিয়েছেন। ধন্যবাদ!');
                            }}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>{confirmedBloodCard ? 'সম্মতি নিশ্চিত ✓' : 'আমি রক্ত দিতে রাজি'}</span>
                          </button>
                          <button 
                            onClick={() => handleStartCall(false)}
                            className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs p-1.5 rounded-lg transition-all"
                            title="কল করুন"
                          >
                            <Phone className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>{msg.caseCardData?.badge}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  )}

                  {/* DestiFind Missing Person Card Message */}
                  {msg.type === 'missing_card' && (
                    <div className="max-w-[88%] w-full bg-white rounded-2xl border-2 border-emerald-200 shadow-sm overflow-hidden my-1">
                      <div className="bg-emerald-700 px-3 py-2 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <UserSearch className="w-4 h-4" />
                          <span className="text-xs font-bold">নিখোঁজ সন্ধান বুলেটিন</span>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full">
                          {msg.caseCardData?.caseId || 'কেস #৭৮২'}
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start space-x-3 mb-2.5">
                          {msg.caseCardData?.photo && (
                            <img 
                              src={msg.caseCardData.photo} 
                              alt="Missing Person" 
                              className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 mb-0.5">
                              {msg.caseCardData?.title}
                            </h4>
                            <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                              {msg.caseCardData?.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => showToast('তথ্য প্রদানের ফর্ম ওপেন হয়েছে')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>ক্লু বা তথ্য প্রদান করুন</span>
                          </button>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>{msg.caseCardData?.badge}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  )}

                  {/* DestiBrain Card Message */}
                  {msg.type === 'brain_card' && (
                    <div className="max-w-[88%] w-full bg-white rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden my-1">
                      <div className="bg-purple-600 px-3 py-2 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Brain className="w-4 h-4" />
                          <span className="text-xs font-bold">এআই হেলথ ডক্টর সামারি</span>
                        </div>
                        <span className="text-[10px] font-bold bg-purple-700 text-purple-100 px-2 py-0.5 rounded-full">
                          জরুরি ট্রায়াজ
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-800 leading-relaxed mb-2 font-medium">
                          {msg.caseCardData?.desc}
                        </p>
                        <button 
                          onClick={() => showToast('মেডিকেল টেস্ট ও হেলথ নির্দেশিকা লোড হচ্ছে...')}
                          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{msg.caseCardData?.actionLabel || 'রিপোর্ট দেখুন'}</span>
                        </button>
                      </div>
                      <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>{msg.caseCardData?.badge}</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  )}

                  {/* Location Message */}
                  {msg.type === 'location' && (
                    <div className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm shadow-2xs border ${
                      isMe ? 'bg-teal-50 border-teal-200 text-teal-950' : 'bg-white border-gray-200 text-gray-900'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs">{msg.caseCardData?.title}</p>
                          <p className="text-[10px] text-gray-500">{msg.caseCardData?.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => showToast('লাইভ ম্যাপ জিপিএস ট্র্যাকিং ওপেন হচ্ছে...')}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-1 rounded-lg transition-all"
                      >
                        ম্যাপে দেখুন
                      </button>
                      <div className="flex items-center justify-end mt-1 text-[10px] text-gray-400">
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Smart Replies Bar (Messenger dynamic suggestion chips) */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {activeChat.moduleOrigin === 'care' ? (
              <>
                <button 
                  onClick={() => handleSendMessage('আমি ১৫ মিনিটের মধ্যে আসছি ভাই।')}
                  className="text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  আমি ১৫ মিনিটে আসছি 🩸
                </button>
                <button 
                  onClick={() => handleSendMessage('হাসপাতালের কোন তলায় রোগী আছে?')}
                  className="text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  কোন তলায় রোগী?
                </button>
                <button 
                  onClick={() => handleSendMessage('রক্তের ব্যাগ রেডি আছে তো?')}
                  className="text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  ব্যাগ রেডি আছে?
                </button>
              </>
            ) : activeChat.moduleOrigin === 'find' ? (
              <>
                <button 
                  onClick={() => handleSendMessage('আমার কাছে সম্ভাব্য তথ্য ও ছবি আছে।')}
                  className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  তথ্য ও ছবি আছে 🔍
                </button>
                <button 
                  onClick={() => handleSendMessage('উদ্ধার টিমে আমি যুক্ত হতে চাই।')}
                  className="text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  টিমে যুক্ত হব
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleSendMessage('জি ভাই, বুঝতে পেরেছি।')}
                  className="text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  জি বুঝতে পেরেছি 👍
                </button>
                <button 
                  onClick={() => handleSendMessage('ধন্যবাদ আপনাকে!')}
                  className="text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  ধন্যবাদ আপনাকে! 🙏
                </button>
                <button 
                  onClick={() => handleSendMessage('কল দিচ্ছি, ধরুন প্লিজ।')}
                  className="text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
                >
                  কল দিচ্ছি 📞
                </button>
              </>
            )}
          </div>

          {/* Module Attachment Popup Drawer */}
          {showAttachmentMenu && (
            <div className="p-3 bg-white border-t border-gray-200 shadow-lg grid grid-cols-4 gap-2 animate-in slide-in-from-bottom-2 duration-150">
              <button 
                onClick={() => {
                  handleSendMessage('🩸 [জরুরি রক্তের আবেদন কার্ড পাঠানো হয়েছে]', 'blood_card', {
                    title: 'জরুরি রক্তের আবেদন (সরাসরি ডোনার অনুরোধ)',
                    desc: 'ঢাকা মেডিকেল কলেজ হাসপাতাল • ব্লাড ব্যাংক রিকুয়েস্ট',
                    badge: 'DestiCare রক্তদান',
                    bloodGroup: 'A+',
                    hospital: 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
                    phone: '01822-334455'
                  });
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-rose-50 border border-rose-100 text-rose-600 transition-colors"
              >
                <Droplet className="w-5 h-5 mb-1 fill-rose-500 text-rose-500" />
                <span className="text-[10px] font-bold">রক্তের কার্ড</span>
              </button>

              <button 
                onClick={() => {
                  handleSendMessage('📍 [লাইভ লোকেশন শেয়ার করা হয়েছে]', 'location', {
                    title: 'বর্তমান লাইভ লোকেশন',
                    desc: 'শাহবাগ মোড়, ঢাকা (১ কিমি দূরত্বে)',
                    badge: 'লাইভ জিপিএস'
                  });
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-teal-50 border border-teal-100 text-teal-600 transition-colors"
              >
                <MapPin className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">লোকেশন</span>
              </button>

              <button 
                onClick={() => {
                  handleSendMessage('📷 [প্রেসক্রিপশন ও মেডিকেল টেস্টের ছবি সংযুক্ত]');
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-blue-50 border border-blue-100 text-blue-600 transition-colors"
              >
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">ছবি / প্রেসক্রিপশন</span>
              </button>

              <button 
                onClick={() => {
                  handleSendMessage('📄 [মেডিকেল রিপোর্ট ফাইল (PDF) সংযুক্ত]');
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-amber-50 border border-amber-100 text-amber-600 transition-colors"
              >
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">ডকুমেন্ট</span>
              </button>
            </div>
          )}

          {/* Chat Composer Input Bar */}
          <div className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-1.5">
            <button 
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                showAttachmentMenu ? 'bg-teal-600 text-white' : 'text-teal-600 hover:bg-teal-50'
              }`}
              title="সংযুক্ত করুন"
            >
              <Plus className="w-5 h-5 stroke-[2.4]" />
            </button>

            <button 
              onClick={() => handleSendMessage('📷 [তাৎক্ষণিক ছবি তোলা হয়েছে]')}
              className="w-9 h-9 text-gray-500 hover:text-teal-600 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
              title="ক্যামেরা"
            >
              <Camera className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0 bg-[#f0f2f5] hover:bg-[#e4e6e9] focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/50 rounded-full px-3.5 py-1.5 flex items-center transition-all">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="মেসেজ লিখুন..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
              />
              <button 
                onClick={() => setInputMessage(prev => prev + ' 😊')}
                className="text-gray-400 hover:text-gray-600 p-1"
                title="ইমোজি"
              >
                <Smile className="w-4.5 h-4.5" />
              </button>
            </div>

            {inputMessage.trim() ? (
              <button 
                onClick={() => handleSendMessage()}
                className="w-9 h-9 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
                title="পাঠান"
              >
                <Send className="w-4 h-4 stroke-[2.3]" />
              </button>
            ) : (
              <button 
                onClick={() => {
                  handleSendMessage('🎙️ [ভয়েস নোট (০০:১৫ সেকেন্ড)]');
                  showToast('ভয়েস বার্তা পাঠানো হয়েছে');
                }}
                className="w-9 h-9 text-teal-600 hover:bg-teal-50 rounded-full flex items-center justify-center transition-colors shrink-0"
                title="ভয়েস রেকর্ড"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ================= MAIN INBOX / MESSENGER VIEW ================= */
        <div className="flex flex-col h-full overflow-hidden">
          {/* ================= TOP AREA: SOCIAL MESSENGER FEEL ================= */}
          {/* ================= TOP NAVIGATION: MENU, NAME, SEARCH COMPOSER, NOTIFICATIONS & PROFILE ================= */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
            {/* Top Row: Exactly matching DestiHope Header height, touch target and proportions */}
            <div className="flex items-center justify-between px-2 sm:px-3 h-14 sm:h-16 gap-1 sm:gap-2 w-full">
              {/* Left section: Hamburger Menu & Brand Logo */}
              <div className="flex items-center shrink-0">
                <button
                  id="btn-destichat-menu"
                  type="button"
                  onClick={onOpenMenu}
                  className="w-9 h-9 sm:w-10 sm:h-10 -ml-1 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-95 shrink-0 touch-manipulation cursor-pointer"
                  aria-label="Open navigation menu"
                  title="মেনু খুলুন"
                >
                  <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.5] pointer-events-none" />
                </button>

                {/* Brand Logo - placed close to the menu icon */}
                <div 
                  onClick={() => {
                    setActiveCategoryTab('all');
                    setSearchQuery('');
                    if (onSelectSubTab) onSelectSubTab('chat');
                  }}
                  className="flex items-center cursor-pointer select-none py-1 -ml-1 active:opacity-80 transition-opacity"
                  title="Desti Chat Home"
                >
                  <span className="font-black text-lg sm:text-xl tracking-tight text-gray-950">DESTI</span>
                  <span className="font-black text-lg sm:text-xl tracking-tight ml-0.5 text-teal-600">CHAT</span>
                </div>
              </div>

              {/* Center: Search Composer Pill (matching DestiHope's input pill style) */}
              <div className="flex-1 min-w-[70px] max-w-xs sm:max-w-md h-9 sm:h-10 flex items-center bg-[#f0f2f5] hover:bg-[#e4e6eb] focus-within:bg-white border border-transparent focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 rounded-full px-2.5 sm:px-3.5 shadow-2xs transition-all mx-1 sm:mx-2 group">
                <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-700 mr-1.5 shrink-0 transition-colors pointer-events-none" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="খুঁজুন..."
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs sm:text-sm text-gray-800 placeholder:text-gray-500 font-medium min-w-0"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-700 p-0.5 rounded-full transition-colors shrink-0 cursor-pointer ml-1 touch-manipulation"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-3.5 h-3.5 pointer-events-none" />
                  </button>
                )}
              </div>

              {/* Right section: Notifications and Profile Icons with guaranteed 40px touch targets */}
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                {/* Notification Bell Button */}
                <button 
                  id="btn-destichat-notifications"
                  type="button"
                  onClick={onOpenNotifications}
                  className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full relative transition-all active:scale-90 shrink-0 cursor-pointer touch-manipulation select-none"
                  title="নোটিফিকেশন"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] pointer-events-none" />
                  <span className="pointer-events-none absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-[#E53935] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none shadow-xs">
                    1
                  </span>
                </button>

                {/* Profile Avatar Button - Scoped specifically to DestiChat Module */}
                <button
                  id="btn-destichat-profile"
                  type="button"
                  onClick={() => {
                    const nextSubTab = (internalSubTab === 'profile' || activeSubTab === 'profile') ? 'chat' : 'profile';
                    setInternalSubTab(nextSubTab);
                    if (onSelectSubTab) onSelectSubTab(nextSubTab);
                  }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90 shrink-0 cursor-pointer touch-manipulation select-none relative ${
                    (internalSubTab === 'profile' || activeSubTab === 'profile') ? 'ring-2 ring-teal-600 bg-teal-50' : ''
                  }`}
                  title="আমার চ্যাট প্রোফাইল ও সেটিংস"
                  aria-label="চ্যাট প্রোফাইল"
                >
                  <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden ring-2 ring-gray-200 hover:ring-teal-500 transition-all flex items-center justify-center bg-gray-100 shadow-2xs pointer-events-none relative">
                    {currentUser?.avatar ? (
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name || 'User Profile'} 
                        className="w-full h-full object-cover pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-4.5 h-4.5 text-gray-700 stroke-[2.2] pointer-events-none" />
                    )}
                  </div>
                  {/* Status Indicator Dot */}
                  <span className={`pointer-events-none absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    chatUserStatus === 'online' ? 'bg-emerald-500' : chatUserStatus === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                </button>
              </div>
            </div>

            {/* Category Tabs or Chat Profile Indicator Bar */}
            {(internalSubTab === 'profile' || activeSubTab === 'profile') ? (
              <div className="flex items-center justify-between px-3.5 py-2 bg-teal-50/70 border-t border-teal-100">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    chatUserStatus === 'online' ? 'bg-emerald-500' : chatUserStatus === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-xs font-bold text-teal-950">DESTICHAT প্রোফাইল ও সেটিংস</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    {chatUserStatus === 'online' ? 'অনলাইন' : chatUserStatus === 'busy' ? 'ব্যস্ত' : 'অফলাইন'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInternalSubTab('chat');
                    if (onSelectSubTab) onSelectSubTab('chat');
                  }}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>চ্যাটে ফিরুন</span>
                </button>
              </div>
            ) : (
              /* Clean Category Tabs: All Chats, Personal, Saved */
              <div className="flex items-center px-3.5 py-2 bg-white border-t border-gray-100 gap-2">
                {[
                  { id: 'all', label: 'All Chats', unread: unreadAll },
                  { id: 'personal', label: 'Personal', unread: unreadPersonal },
                  { id: 'saved', label: 'Saved', unread: unreadSaved }
                ].map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveCategoryTab(tab.id as any);
                        setTabSubFilter('all');
                        setInternalSubTab('chat');
                        if (activeSubTab !== 'chat' && onSelectSubTab) {
                          onSelectSubTab('chat');
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs font-bold'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.unread > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                          isActive ? 'bg-white/25 text-white' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {tab.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= 1. CALLS & HOTLINES TAB (SUBTAB: 'calls') ================= */}
          {activeSubTab === 'calls' ? (
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-3 space-y-3.5">
              {/* Recent Calls */}
              <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-1.5">
                    <PhoneCall className="w-4 h-4 text-teal-600" />
                    <h3 className="text-xs font-bold text-gray-900">জরুরি কল হিস্ট্রি</h3>
                  </div>
                  <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">৪টি সাম্প্রতিক কল</span>
                </div>

                <div className="space-y-1.5">
                  {mockCalls.map((call) => (
                    <div 
                      key={call.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 border border-gray-100/80 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img 
                          src={call.avatar} 
                          alt={call.name} 
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{call.name}</h4>
                          <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-0.5">
                            {call.type === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-teal-600" />}
                            {call.type === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-blue-600" />}
                            {call.type === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />}
                            <span>{call.time}</span>
                            <span>•</span>
                            <span className="truncate">{call.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button 
                          onClick={() => setActiveCallContact({ name: call.name, avatar: call.avatar, phone: call.phone, isVideo: false })}
                          className="w-8.5 h-8.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="কল করুন"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setActiveCallContact({ name: call.name, avatar: call.avatar, phone: call.phone, isVideo: true })}
                          className="w-8.5 h-8.5 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="ভিডিও কল"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 24/7 National & Ecosystem Emergency Hotlines */}
              <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-1.5">
                    <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
                    <h3 className="text-xs font-bold text-gray-900">২৪/৭ জরুরি হটলাইন (১-ট্যাপ ডায়াল)</h3>
                  </div>
                  <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">টোল-ফ্রি</span>
                </div>

                <div className="space-y-2">
                  {emergencyHotlines.map((h) => (
                    <div 
                      key={h.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-teal-50/30 hover:border-teal-200 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className={`text-[10px] font-bold text-white px-1.5 py-0.2 rounded-md ${h.color}`}>
                            {h.number}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 truncate">{h.title}</h4>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{h.desc}</p>
                      </div>

                      <button 
                        onClick={() => setActiveCallContact({ name: h.title, avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150', phone: h.number, isVideo: false })}
                        className="px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>ডায়াল</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeSubTab === 'module_switch' ? (
            /* ================= 2. MODULE SWITCHER VIEW (SUBTAB: 'module_switch') ================= */
            <div className="flex-1 overflow-y-auto bg-gray-50/60 p-3 space-y-3.5">
              {/* Top Banner & Info */}
              <div className="bg-linear-to-r from-teal-700 to-teal-900 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold bg-white/20 text-teal-100 px-2.5 py-0.5 rounded-full inline-block">
                      মডিউল মেসেজিং রাডার
                    </span>
                    <h3 className="text-base font-black mt-1">মডিউলভিত্তিক সেকশন ও বার্তা হাব</h3>
                    <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
                      নিচের প্রতিটি সেকশনে দেখুন কোন মডিউল থেকে কে কে জরুরি মেসেজ পাঠিয়েছেন।
                    </p>
                  </div>
                  <button 
                    onClick={onOpenModuleSwitcher}
                    className="px-3 py-1.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1 shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>সব মডিউল</span>
                  </button>
                </div>
              </div>

              {/* Section 1: Desti Care (রক্ত ও জরুরি স্বাস্থ্য) */}
              <div className="bg-white rounded-2xl border border-rose-100 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                      <Droplet className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Desti Care • ব্লাড নেটওয়ার্ক</h4>
                      <span className="text-[10px] text-rose-700 font-semibold">২ জন প্রেরক সক্রিয় বার্তা পাঠিয়েছেন</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('care')}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>DestiCare খুলুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 space-y-2 divide-y divide-gray-50">
                  {/* Sender 1 */}
                  <div className="pt-1.5 first:pt-0 flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150" 
                        alt="ডা. রফিকুল ইসলাম"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">ডা. রফিকুল ইসলাম</span>
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">ঢামেক জরুরি</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          "রোগীর হিমোগ্লোবিন রিপোর্ট আপলোড করা হয়েছে, জরুরি A+ রক্তদাতা প্রস্তুত।"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">১০:১৫ AM • ২ অপঠিত বার্তা</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const targetConv = conversations.find(c => c.id === 'c1') || conversations[0];
                        setActiveChat(targetConv);
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      চ্যাট খুলুন
                    </button>
                  </div>

                  {/* Sender 2 */}
                  <div className="pt-2 flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                        alt="তানভীর আহমেদ"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">তানভীর আহমেদ</span>
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full">O+ ডোনার</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          "আমি রক্ত দিতে প্রস্তুত, হাসপাতালের অবস্থান জানান।"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">০৯:৪০ AM</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const targetConv = conversations.find(c => c.id === 'c4') || conversations[0];
                        setActiveChat(targetConv);
                      }}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      চ্যাট খুলুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Desti Find (নিখোঁজ অনুসন্ধান ও রেসকিউ) */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <UserSearch className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Desti Find • নিখোঁজ রাডার</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">১ জন প্রেরক আপডেট পাঠিয়েছেন</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('find')}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>DestiFind খুলুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                        alt="রেসকিউ টিম ঢাকা উত্তর"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">রেসকিউ টিম (ঢাকা উত্তর)</span>
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">সন্ধান কেস #DF-809</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          "মিরপুর-১০ এলাকায় নিখোঁজ শিশুর সম্ভাব্য অবস্থান শনাক্ত হয়েছে, ভলান্টিয়ার টিম উপস্থিত।"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">০৯:৩০ AM • ১ অপঠিত</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const targetConv = conversations.find(c => c.id === 'c2') || conversations[0];
                        setActiveChat(targetConv);
                      }}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      চ্যাট খুলুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Desti Brain (এআই ডক্টর ও সহায়তা) */}
              <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-purple-50/80 border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Desti Brain • এআই কনসালটেশন</h4>
                      <span className="text-[10px] text-purple-700 font-semibold">স্মার্ট এআই স্বাস্থ্য বিশ্লেষণ বার্তা</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('brain')}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>DestiBrain খুলুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        AI
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">Desti AI Doctor Assistant</span>
                          <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full">স্মার্ট বট</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          "আপনার প্রেসক্রিপশন ও লক্ষণ অনুযায়ী এআই সামারি তৈরি সম্পন্ন হয়েছে।"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">১০:০০ AM</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const targetConv = conversations.find(c => c.id === 'c3') || conversations[0];
                        setActiveChat(targetConv);
                      }}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      এআই চ্যাট
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 4: Desti Media (মানবিক স্টোরি ও রিলস) */}
              <div className="bg-white rounded-2xl border border-violet-100 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-violet-50/80 border-b border-violet-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                      <Clapperboard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Desti Media • মানবিক স্টোরি</h4>
                      <span className="text-[10px] text-violet-700 font-semibold">ফিল্ড রিপোর্টার ও মিডিয়া বার্তা</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('media')}
                    className="text-[11px] font-bold text-violet-700 hover:text-violet-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>DestiMedia খুলুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start space-x-2.5 min-w-0">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
                        alt="রেসকিউ জার্নালিস্ট রাহাত"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-100 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">রেসকিউ জার্নালিস্ট রাহাত</span>
                          <span className="text-[9px] font-bold bg-violet-100 text-violet-800 px-1.5 py-0.2 rounded-full">মিডিয়া</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
                          "বন্যাদুর্গত এলাকার খাদ্য বিতরণ অভিযানের লাইভ ভিডিওতে নতুন বার্তা।"
                        </p>
                        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">০৮:৫০ AM</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => onSelectModule?.('media')}
                      className="px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      মিডিয়া খুলুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 5: Desti Hope (সেন্ট্রাল ফিড) */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-2xs overflow-hidden">
                <div className="px-3.5 py-2.5 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Desti Hope • সেন্ট্রাল ইমার্জেন্সি ফিড</h4>
                      <span className="text-[10px] text-amber-800 font-semibold">সেন্ট্রাল ভলান্টিয়ার ডেস্ক ও হেল্পলাইন</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('hope')}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>হোমে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <p className="font-bold text-gray-900">Desti Hope নোটিফিকেশন ডেস্ক</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">আপনি সফলভাবে রক্তদান নিশ্চিত করে ৫০ HP পয়েন্ট অর্জন করেছেন!</p>
                  </div>
                  <button 
                    onClick={() => onSelectModule?.('hope')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    ফিড দেখুন
                  </button>
                </div>
              </div>
            </div>
          ) : activeSubTab === 'community' ? (
            /* ================= 3. COMMUNITY & GROUP CREATION HUB (SUBTAB: 'community') ================= */
            <div className="flex-1 overflow-y-auto bg-gray-50/60 p-3 space-y-3.5">
              {/* Community Banner with Create Group Button */}
              <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold bg-white/20 text-blue-100 px-2.5 py-0.5 rounded-full inline-block">
                      কমিউনিটি ও ভলান্টিয়ার স্কোয়াড
                    </span>
                    <h3 className="text-base font-black mt-1">কমিউনিটি হাব ও গ্রুপ নেটওয়ার্ক</h3>
                    <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
                      জরুরি উদ্ধার, রক্তদান ও এলাকাভিত্তিক ভলান্টিয়ার গ্রুপে যুক্ত থাকুন বা নতুন গ্রুপ গঠন করুন।
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="px-3 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shrink-0 active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-700" />
                    <span>নতুন গ্রুপ</span>
                  </button>
                </div>
              </div>

              {/* Group Category Filter Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setTabSubFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    tabSubFilter === 'all' ? 'bg-gray-900 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  সব গ্রুপ ({countGroups})
                </button>
                <button
                  onClick={() => setTabSubFilter('volunteer')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                    tabSubFilter === 'volunteer' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-blue-700 border border-blue-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>ভলান্টিয়ার স্কোয়াড</span>
                </button>
                <button
                  onClick={() => setTabSubFilter('blood')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shrink-0 cursor-pointer ${
                    tabSubFilter === 'blood' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-700 border border-rose-200'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span>ব্লাড ডোনার টিম</span>
                </button>
              </div>

              {/* Groups List */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'cg1',
                    name: 'ভলান্টিয়ার রেসকিউ টিম (সেন্ট্রাল)',
                    category: 'volunteer',
                    members: '১৮৫ জন সক্রিয় সদস্য',
                    purpose: 'জরুরি দুর্যোগ ও উদ্ধার টিম',
                    lastMsg: 'মিরপুর এলাকায় ব্লাড ক্যাম্পেইন ও হেল্প ডেস্ক প্রস্তুত করা হচ্ছে।',
                    time: '১০:১০ AM',
                    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150',
                    isJoined: true
                  },
                  {
                    id: 'cg2',
                    name: 'ঢাকা ইমার্জেন্সি ব্লাড ডোনার্স',
                    category: 'blood',
                    members: '৩২০ জন সদস্য',
                    purpose: '২৪/৭ রক্তের আবেদন কোঅর্ডিনেশন',
                    lastMsg: 'জরুরি B+ রক্তদাতা প্রয়োজন সোহরাওয়ার্দী হাসপাতালে।',
                    time: '০৯:৪৫ AM',
                    avatar: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=150',
                    isJoined: true
                  },
                  {
                    id: 'cg3',
                    name: 'নিখোঁজ অনুসন্ধান স্কোয়াড ঢাকা',
                    category: 'volunteer',
                    members: '৯৪ জন ভলান্টিয়ার',
                    purpose: 'হারিয়ে যাওয়া মানুষ উদ্ধার টিম',
                    lastMsg: 'নতুন কেস ফাইলে ছবি ও শেষ দেখা লোকেশন সংযুক্ত করা হয়েছে।',
                    time: 'গতকাল',
                    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
                    isJoined: true
                  },
                  {
                    id: 'cg4',
                    name: 'অ্যাম্বুলেন্স ও প্যারামেডিক সেল',
                    category: 'blood',
                    members: '৪২ জন প্যারামেডিক',
                    purpose: 'আইসিইউ ও জরুরি ট্রান্সপোর্ট',
                    lastMsg: 'উত্তরা ও ধানমন্ডি রুটে ২টি ফ্রি অ্যাম্বুলেন্স স্ট্যান্ডবাই।',
                    time: 'গতকাল',
                    avatar: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150',
                    isJoined: false
                  }
                ].filter(g => tabSubFilter === 'all' || g.category === tabSubFilter).map(grp => (
                  <div 
                    key={grp.id}
                    className="bg-white rounded-2xl p-3.5 border border-gray-200/80 hover:border-teal-300 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start space-x-3 min-w-0">
                        <img 
                          src={grp.avatar} 
                          alt={grp.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{grp.name}</h4>
                          <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-0.5">
                            <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-md">{grp.purpose}</span>
                            <span>•</span>
                            <span>{grp.members}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 line-clamp-1">
                            {grp.lastMsg}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-gray-400 shrink-0">{grp.time}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>ভেরিফাইড কমিউনিটি গ্রুপ</span>
                      </span>

                      <button
                        onClick={() => {
                          const existingGroup = conversations.find(c => c.type === 'group' || (c.membersCount && c.membersCount > 0)) || conversations[0];
                          setActiveChat(existingGroup);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        গ্রুপ চ্যাটে যান
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (activeSubTab === 'profile' || internalSubTab === 'profile') ? (
            /* ================= 4. DESTICHAT MODULE-SPECIFIC PROFILE & SETTINGS ================= */
            <div className="flex-1 overflow-y-auto bg-gray-50/70 p-3.5 space-y-3.5 pb-24">
              {/* Chat Profile Header Card */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full overflow-hidden p-0.5 ring-3 transition-all ${
                        chatUserStatus === 'online' ? 'ring-emerald-500' : chatUserStatus === 'busy' ? 'ring-amber-500' : 'ring-gray-300'
                      }`}>
                        <img 
                          src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
                          alt="DestiChat Profile" 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-2 border-white ${
                        chatUserStatus === 'online' ? 'bg-emerald-500' : chatUserStatus === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-black text-gray-950 truncate">
                          {currentUser?.name || 'তানভীর আহমেদ'}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      </div>
                      <div className="flex items-center space-x-1 mt-0.5 text-xs text-gray-500">
                        <span className="font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                          @{currentUser?.name ? currentUser.name.toLowerCase().replace(/\s+/g, '') : 'tanveer'}.destichat
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(`@${currentUser?.name ? currentUser.name.toLowerCase().replace(/\s+/g, '') : 'tanveer'}.destichat`);
                            showToast('চ্যাট আইডি কপি করা হয়েছে');
                          }}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                          title="চ্যাট আইডি কপি করুন"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        DestiChat সক্রিয় অ্যাকাউন্ট
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInternalSubTab('chat');
                      if (onSelectSubTab) onSelectSubTab('chat');
                    }}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>চ্যাটে ফিরুন</span>
                  </button>
                </div>

                {/* DestiChat Status Bio */}
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-500">চ্যাট স্ট্যাটাস ও বায়ো</span>
                    {!isEditingBio && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempBio(chatBio);
                          setIsEditingBio(true);
                        }}
                        className="text-xs text-teal-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>পরিবর্তন</span>
                      </button>
                    )}
                  </div>
                  {isEditingBio ? (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        placeholder="আপনার চ্যাট স্ট্যাটাস লিখুন..."
                        className="w-full px-3 py-1.5 bg-white border border-teal-300 rounded-lg text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                        maxLength={80}
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingBio(false)}
                          className="px-2.5 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-200 cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (tempBio.trim()) {
                              setChatBio(tempBio.trim());
                              showToast('চ্যাট স্ট্যাটাস আপডেট করা হয়েছে');
                            }
                            setIsEditingBio(false);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                        >
                          সংরক্ষণ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-gray-800 italic">
                      "{chatBio}"
                    </p>
                  )}
                </div>

                {/* Live Chat Status Selector */}
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2">অনলাইন উপস্থিতি ও অ্যাক্টিভিটি</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'online', label: 'অনলাইন', color: 'bg-emerald-500', desc: 'সবার কাছে সক্রিয়', activeBorder: 'border-emerald-500 bg-emerald-50/50' },
                      { id: 'busy', label: 'ব্যস্ত (DND)', color: 'bg-amber-500', desc: 'সাইলেন্ট মোড', activeBorder: 'border-amber-500 bg-amber-50/50' },
                      { id: 'offline', label: 'অদৃশ্য', color: 'bg-gray-400', desc: 'লাস্ট সিন গোপন', activeBorder: 'border-gray-500 bg-gray-100' }
                    ].map((status) => {
                      const isSelected = chatUserStatus === status.id;
                      return (
                        <button
                          key={status.id}
                          type="button"
                          onClick={() => {
                            setChatUserStatus(status.id as any);
                            showToast(`উপস্থিতি '${status.label}' নির্ধারণ করা হয়েছে`);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected ? `${status.activeBorder} shadow-2xs ring-1 ring-teal-500` : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                            <span className="text-xs font-bold text-gray-900">{status.label}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">{status.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chat Preferences & Privacy Settings */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-2xs space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <Settings className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-gray-900">চ্যাট প্রাইভেসি ও সেটিংস (DestiChat)</h4>
                </div>

                {/* 1. Last Seen Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">লাস্ট সিন ও অ্যাক্টিভ স্ট্যাটাস</p>
                      <p className="text-[10.5px] text-gray-500">অন্যরা দেখতে পাবে আপনি কখন অনলাইনে ছিলেন</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setChatLastSeenEnabled(!chatLastSeenEnabled);
                      showToast(chatLastSeenEnabled ? 'লাস্ট সিন বন্ধ করা হয়েছে' : 'লাস্ট সিন চালু করা হয়েছে');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${chatLastSeenEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${chatLastSeenEnabled ? 'translate-x-5.5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* 2. Read Receipts Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">রিড রিসিটস (নীল টিক)</p>
                      <p className="text-[10.5px] text-gray-500">মেসেজ পড়া হলে প্রেরক নিশ্চিত হবেন</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setChatReadReceiptsEnabled(!chatReadReceiptsEnabled);
                      showToast(chatReadReceiptsEnabled ? 'রিড রিসিটস নিষ্ক্রিয়' : 'রিড রিসিটস সক্রিয়');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${chatReadReceiptsEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${chatReadReceiptsEnabled ? 'translate-x-5.5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* 3. Notifications & Tone Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">চ্যাট পুশ নোটিফিকেশন ও সাউন্ড</p>
                      <p className="text-[10.5px] text-gray-500">নতুন মেসেজে শব্দ ও অ্যালার্ট আসবে</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setProfileNotificationEnabled(!profileNotificationEnabled);
                      showToast(profileNotificationEnabled ? 'চ্যাট নোটিফিকেশন বন্ধ করা হয়েছে' : 'চ্যাট নোটিফিকেশন সক্রিয় করা হয়েছে');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${profileNotificationEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${profileNotificationEnabled ? 'translate-x-5.5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* 4. Data Saver Mode */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">ডাটা সেভার (অল্প ইন্টারনেট)</p>
                      <p className="text-[10.5px] text-gray-500">ছবি ও মিডিয়া স্বয়ংক্রিয় ডাউনলোড হবে না</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={onToggleDataSaver}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${dataSaverEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-xs ${dataSaverEnabled ? 'translate-x-5.5' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* 5. Clear Local Chat Cache */}
                <div className="flex items-center justify-between py-1.5 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">চ্যাট ক্যাশ ও মেমোরি খালি করুন</p>
                      <p className="text-[10.5px] text-gray-500">৩২.৪ এমবি অফলাইন মেসেজ ও মিডিয়া সংরক্ষিত</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => showToast('লোকাল চ্যাট ক্যাশ সফলভাবে পরিষ্কার করা হয়েছে')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    ক্যাশ মুছুন
                  </button>
                </div>
              </div>

              {/* Chat Security & Encryption Card */}
              <div className="bg-linear-to-r from-teal-900 to-emerald-950 rounded-2xl p-4 text-white shadow-xs space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <h4 className="text-xs font-bold text-white">এন্ড-টু-এন্ড এনক্রিপ্টেড চ্যাট (E2EE)</h4>
                </div>
                <p className="text-[11px] text-emerald-100/85 leading-relaxed">
                  DestiChat-এর সমস্ত ব্যক্তিগত ও দলগত বার্তা, অডিও ভয়েস নোট এবং ফাইল সুরক্ষিত। শুধু আপনি এবং বার্তা প্রাপক ছাড়া তৃতীয় কোনো পক্ষ এটি দেখতে পারবে না।
                </p>
              </div>

              {/* Secondary Link to Global Profile & Back to Chat Action */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setInternalSubTab('chat');
                    if (onSelectSubTab) onSelectSubTab('chat');
                  }}
                  className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>চ্যাট ইনবক্সে ফিরে যান</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectModule?.('profile')}
                  className="py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>মূল DestiHope প্রোফাইল</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : activeSubTab === 'upload' ? (
            /* ================= 5. UPLOAD & ACTION HUB (SUBTAB: 'upload') ================= */
            <div className="flex-1 overflow-y-auto bg-gray-50/60 p-3 space-y-3.5">
              {/* Upload Hub Banner */}
              <div className="bg-linear-to-r from-teal-600 to-emerald-700 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold bg-white/20 text-teal-100 px-2.5 py-0.5 rounded-full inline-block">
                      আপলোড ও অ্যাকশন সেন্টার
                    </span>
                    <h3 className="text-base font-black mt-1">নতুন কনটেন্ট বা জরুরি আবেদন</h3>
                    <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
                      দ্রুত নতুন বার্তা, রক্তের আবেদন, নিখোঁজ ব্যক্তির পোস্ট অথবা মানবিক স্টোরি তৈরি করুন।
                    </p>
                  </div>
                  <button 
                    onClick={() => onSelectSubTab?.('chat')}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    ইনবক্সে ফিরে যান
                  </button>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. New Direct Message */}
                <div 
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/90 hover:border-teal-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                        নতুন চ্যাট বার্তা পাঠান
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        যে কোনো রক্তদাতা, ডাক্তার বা উদ্ধারকারী ভলান্টিয়ারকে সরাসরি ১-টু-১ বার্তা পাঠান।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Blood Request */}
                <div 
                  onClick={() => onSelectModule?.('care')}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/90 hover:border-rose-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Droplet className="w-5 h-5 fill-current" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                        জরুরি রক্তের আবেদন তৈরি করুন
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        রোগীর তথ্য, রক্তের গ্রুপ ও হাসপাতাল লোকেশন দিয়ে লাইভ ব্লাড রিকুইজিশন ছাড়ুন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Missing Person Post */}
                <div 
                  onClick={() => onSelectModule?.('find')}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <UserSearch className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        নিখোঁজ ব্যক্তির সন্ধান রিপোর্ট করুন
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        ছবি, নাম, শেষ দেখা স্থান ও পরিবারের ফোন নম্বর দিয়ে নিখোঁজ বুলেটিন জারি করুন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Humanitarian Media / Story */}
                <div 
                  onClick={() => {
                    setIsUploadModalOpen(true);
                    if (onOpenCreatePost) onOpenCreatePost();
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/90 hover:border-purple-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Clapperboard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                        মানবিক উদ্ধার বা স্টোরি মিডিয়া আপলোড
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        সাহায্যের ভিডিও, ফটো স্টোরি ও রেসকিউ রিপোর্ট কমিউনিটির সাথে শেয়ার করুন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Create Saved Note */}
                <div 
                  onClick={() => setIsCreateNoteModalOpen(true)}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Pin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        সংরক্ষিত জরুরি নোট লিখুন
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        রোগীর প্রেসক্রিপশন, ইমার্জেন্সি কন্টাক্ট নম্বর বা গুরুত্বপূর্ণ তথ্য সেভ রাখুন।
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Emergency SOS Alert */}
                <div 
                  onClick={() => {
                    handleSendMessage('🚨 [জরুরি এসওএস সতর্কতা জারি করা হয়েছে]');
                    showToast('জরুরি এসওএস সংকেত সক্রিয় করা হয়েছে');
                  }}
                  className="bg-linear-to-r from-rose-500 to-red-600 text-white rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Siren className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white">
                        ১-ট্যাপ ইমার্জেন্সি এসওএস ব্রডকাস্ট
                      </h4>
                      <p className="text-[11px] text-rose-100 mt-0.5 leading-snug">
                        নিকটস্থ সমস্ত ভলান্টিয়ার ও জরুরি সার্ভিসে তাৎক্ষণিক বিপদ সংকেত পাঠান।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= 4. REGULAR INBOX FEED (SUBTAB: 'all') ================= */
            <div className="flex-1 overflow-y-auto bg-white flex flex-col">

              {/* 3. Conversation List */}
              <div className="flex-1 divide-y divide-gray-100">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const badgeInfo = getModuleBadge(conv.moduleOrigin);
                    const BadgeIcon = badgeInfo.icon;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveChat(conv)}
                        className="px-3.5 py-3 hover:bg-[#f0f2f5] active:bg-[#e4e6e9] transition-colors cursor-pointer flex items-center space-x-3 group relative"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img 
                            src={conv.avatar} 
                            alt={conv.title} 
                            className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-200"
                          />
                          {conv.onlineStatus && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                          )}
                          {conv.type === 'group' && (
                            <span className="absolute -top-1 -left-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white shadow-xs">
                              <Users className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>

                        {/* Middle Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center space-x-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                {conv.title}
                              </h4>
                              {conv.verified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium shrink-0 ml-1">
                              {conv.lastMessageTime}
                            </span>
                          </div>

                          {/* Module Origin Tag */}
                          <div className="flex items-center space-x-1 mb-1">
                            <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${badgeInfo.bg}`}>
                              <BadgeIcon className="w-2.5 h-2.5" />
                              <span>{conv.moduleTag || badgeInfo.label}</span>
                            </span>
                          </div>

                          {/* Last Message Preview & Actions */}
                          <div className="flex items-center justify-between">
                            <p className={`text-xs truncate pr-2 ${
                              conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'
                            }`}>
                              {conv.lastMessage}
                            </p>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button 
                                onClick={(e) => toggleSaveChat(conv.id, e)}
                                className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${
                                  conv.isSaved || conv.type === 'saved' || conv.id === 'chat-saved' 
                                    ? 'text-amber-500 hover:text-amber-600' 
                                    : 'text-gray-300 hover:text-gray-500 opacity-60 hover:opacity-100'
                                }`}
                                title={conv.isSaved ? "সেভড থেকে সরান" : "সেভ করুন (Saved)"}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${conv.isSaved || conv.type === 'saved' || conv.id === 'chat-saved' ? 'fill-current' : ''}`} />
                              </button>

                              {conv.unreadCount > 0 && (
                                <span className="min-w-[18px] h-[18px] px-1 bg-teal-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-xs">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
                    {activeCategoryTab === 'saved' ? (
                      <div className="flex flex-col items-center max-w-xs">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                          <Bookmark className="w-6 h-6 fill-amber-200" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">কোনো সংরক্ষিত বার্তা নেই</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">
                          যেকোনো চ্যাটের পাশের বুকমার্ক আইকন চেপে সেভ করতে পারেন অথবা নিজের গুরুত্বপূর্ণ নোট লিখে রাখুন।
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsCreateNoteModalOpen(true)}
                            className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700 cursor-pointer"
                          >
                            + নতুন নোট লিখুন
                          </button>
                          <button
                            onClick={() => { setActiveCategoryTab('all'); setTabSubFilter('all'); }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
                          >
                            সব চ্যাটে যান
                          </button>
                        </div>
                      </div>
                    ) : activeCategoryTab === 'personal' ? (
                      <div className="flex flex-col items-center max-w-xs">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                          <User className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">কোনো ব্যক্তিগত চ্যাট নেই</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">
                          কাউকে সরাসরি মেসেজ পাঠাতে "নতুন message" বোতাম ব্যবহার করুন।
                        </p>
                        <button
                          onClick={() => setIsNewChatModalOpen(true)}
                          className="px-3.5 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-700 cursor-pointer"
                        >
                          নতুন মেসেজ লিখুন
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Search className="w-8 h-8 mb-2 stroke-1 text-gray-300" />
                        <p className="text-xs font-medium text-gray-600">কোনো চ্যাট পাওয়া যায়নি</p>
                        <button 
                          onClick={() => { setActiveCategoryTab('all'); setTabSubFilter('all'); setActiveModuleSubFilter('all'); setSearchQuery(''); }}
                          className="mt-2 text-xs text-teal-600 font-bold hover:underline cursor-pointer"
                        >
                          সব ফিল্টার রিসেট করুন
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= FAST NEW CHAT COMPOSER MODAL ================= */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <SquarePen className="w-4 h-4" />
                <h3 className="text-sm font-bold">নতুন বার্তা কম্পোজ করুন</h3>
              </div>
              <button 
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 hover:bg-teal-800 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 shadow-2xs">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="নাম, রক্তদাতা বা ভলান্টিয়ার খুঁজুন..."
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">
                সরাসরি মডিউল পরিচিতি
              </p>

              {conversations.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => {
                    setActiveChat(c);
                    setIsNewChatModalOpen(false);
                  }}
                  className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <img src={c.avatar} alt={c.title} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-gray-900 truncate">{c.title}</h5>
                    <p className="text-[10px] text-gray-500 truncate">{c.moduleTag || 'DestiHope কানেকশন'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE NOTE MODAL (SAVED TAB) ================= */}
      {isCreateNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="px-4 py-3 bg-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Bookmark className="w-4 h-4 fill-white" />
                <h3 className="text-sm font-bold">নতুন সংরক্ষিত নোট লিখুন</h3>
              </div>
              <button 
                onClick={() => setIsCreateNoteModalOpen(false)}
                className="p-1 hover:bg-amber-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewNote} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1.5">নোটের ধরন নির্বাচন করুন:</label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    { id: 'emergency', label: '🚨 জরুরি নোট' },
                    { id: 'prescription', label: '📝 প্রেসক্রিপশন / ওষুধ' },
                    { id: 'contact', label: '📞 জরুরি নম্বর' },
                    { id: 'general', label: '📌 সাধারণ নোট' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewNoteCategory(cat.id as any)}
                      className={`py-1.5 px-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                        newNoteCategory === cat.id
                          ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-2xs'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">নোট বা গুরুত্বপূর্ণ তথ্য:</label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="যেমন: রক্তের জরুরি দরকার হলে ০১৭xxxxxxxx নম্বরে যোগাযোগ করতে হবে..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-amber-500"
                  autoFocus
                  required
                />
              </div>

              <div className="pt-1 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateNoteModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 font-bold hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE GROUP MODAL (GROUPS TAB) ================= */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="px-4 py-3 bg-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Users className="w-4 h-4" />
                <h3 className="text-sm font-bold">নতুন গ্রুপ চ্যাট তৈরি করুন</h3>
              </div>
              <button 
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="p-1 hover:bg-teal-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">গ্রুপের নাম:</label>
                <input
                  type="text"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="যেমন: ঢাকা উত্তর ভলান্টিয়ার স্কোয়াড..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-teal-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">গ্রুপের উদ্দেশ্য / ট্যাগ:</label>
                <select
                  value={newGroupPurpose}
                  onChange={(e) => setNewGroupPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-teal-500 bg-white"
                >
                  <option value="ভলান্টিয়ার রেসকিউ টিম">ভলান্টিয়ার রেসকিউ টিম</option>
                  <option value="জরুরি ব্লাড ডোনার গ্রুপ">জরুরি ব্লাড ডোনার গ্রুপ</option>
                  <option value="নিখোঁজ অনুসন্ধান স্কোয়াড">নিখোঁজ অনুসন্ধান স্কোয়াড</option>
                  <option value="কমিউনিটি এইড সেল">কমিউনিটি এইড সেল</option>
                </select>
              </div>

              <div className="pt-1 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 font-bold hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  গ্রুপ তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 1. TOOL MODAL: EMERGENCY SOS ================= */}
      {activeToolModal === 'sos' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="px-4 py-3 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Siren className="w-5 h-5 animate-pulse" />
                <h3 className="text-sm font-bold">জরুরি SOS ব্রডকাস্ট প্রস্তুত করুন</h3>
              </div>
              <button 
                onClick={() => setActiveToolModal(null)}
                className="p-1 hover:bg-rose-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রোগী / ঘটনার সংক্ষিপ্ত বিবরণ</label>
                <input 
                  type="text" 
                  value={sosPatient} 
                  onChange={(e) => setSosPatient(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-rose-500"
                  placeholder="যেমন: সড়ক দুর্ঘটনা / আইসিইউ জরুরি রোগী..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ঘটনাস্থল / হাসপাতাল লোকেশন</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={sosLocation} 
                    onChange={(e) => setSosLocation(e.target.value)} 
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-rose-500"
                    placeholder="স্থান বা হাসপাতালের নাম..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সংকটের মাত্রা</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setSosUrgency('critical')}
                    className={`text-xs py-2 px-3 rounded-xl font-bold border transition-colors ${
                      sosUrgency === 'critical' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    🚨 অত্যন্ত সংকটজনক
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSosUrgency('urgent')}
                    className={`text-xs py-2 px-3 rounded-xl font-bold border transition-colors ${
                      sosUrgency === 'urgent' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    ⚠️ জরুরি অগ্রাধিকার
                  </button>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-800 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>এই বার্তা পাঠানো হলে নিকটবর্তী নিবন্ধিত ভলান্টিয়ার ও ডোনারদের কাছে সরাসরি সাইরেন নোটিফিকেশন যাবে।</span>
              </div>

              <button 
                onClick={() => {
                  const sosMsg = `🚨 [জরুরি SOS অ্যালার্ট]: ${sosPatient} | লোকেশন: ${sosLocation} | স্ট্যাটাস: ${sosUrgency === 'critical' ? 'অত্যন্ত সংকটজনক' : 'জরুরি অগ্রাধিকার'}`;
                  handleSendMessage(sosMsg);
                  showToast('🚨 ৫০০+ ভলান্টিয়ার ও ডোনারের কাছে SOS ব্রডকাস্ট পাঠানো হয়েছে!');
                  setActiveToolModal(null);
                  if (!activeChat) setActiveChat(conversations[0]);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Siren className="w-4 h-4" />
                <span>ব্রডকাস্ট অ্যালার্ট পাঠান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. TOOL MODAL: BLOOD DISPATCHER ================= */}
      {activeToolModal === 'blood' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="px-4 py-3 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Droplet className="w-5 h-5 fill-current" />
                <h3 className="text-sm font-bold">স্মার্ট ব্লাড রিকোয়েস্ট তৈরি করুন</h3>
              </div>
              <button 
                onClick={() => setActiveToolModal(null)}
                className="p-1 hover:bg-rose-700 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">রক্তের গ্রুপ নির্বাচন করুন</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(grp => (
                    <button 
                      key={grp}
                      type="button"
                      onClick={() => setBloodToolGroup(grp)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        bloodToolGroup === grp 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs scale-105' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">প্রয়োজনীয় ব্যাগ</label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-xl px-2 py-1">
                    <button 
                      type="button"
                      onClick={() => setBloodToolBags(Math.max(1, bloodToolBags - 1))}
                      className="w-6 h-6 rounded-md bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs">{bloodToolBags} ব্যাগ</span>
                    <button 
                      type="button"
                      onClick={() => setBloodToolBags(bloodToolBags + 1)}
                      className="w-6 h-6 rounded-md bg-gray-100 font-bold text-gray-700 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">জরুরি যোগাযোগ</label>
                  <input 
                    type="text" 
                    value={bloodToolContact} 
                    onChange={(e) => setBloodToolContact(e.target.value)} 
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded-xl focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">হাসপাতাল / রক্তদান কেন্দ্র</label>
                <input 
                  type="text" 
                  value={bloodToolHospital} 
                  onChange={(e) => setBloodToolHospital(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <button 
                onClick={() => {
                  const cardMsg = `🩸 [জরুরি রক্তের আবেদন]: ${bloodToolGroup} (${bloodToolBags} ব্যাগ) | হাসপাতাল: ${bloodToolHospital} | যোগাযোগ: ${bloodToolContact}`;
                  handleSendMessage(cardMsg);
                  showToast('🩸 রক্তের আবেদন কার্ড মেসেঞ্জারে সফলভাবে শেয়ার করা হয়েছে!');
                  setActiveToolModal(null);
                  if (!activeChat) setActiveChat(conversations[0]);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Droplet className="w-4 h-4 fill-current" />
                <span>মেসেঞ্জারে ব্লাড কার্ড সেন্ড করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. TOOL MODAL: MISSING RADAR ================= */}
      {activeToolModal === 'find' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="px-4 py-3 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <UserSearch className="w-5 h-5" />
                <h3 className="text-sm font-bold">নিখোঁজ সন্ধান রাডার বুলেটিন</h3>
              </div>
              <button 
                onClick={() => setActiveToolModal(null)}
                className="p-1 hover:bg-emerald-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">নিখোঁজ ব্যক্তির নাম ও বয়স</label>
                <input 
                  type="text" 
                  value={findPerson} 
                  onChange={(e) => setFindPerson(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">সর্বশেষ দেখা যাওয়ার এলাকা</label>
                <input 
                  type="text" 
                  value={findArea} 
                  onChange={(e) => setFindArea(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">অনুসন্ধান হেল্পলাইন নম্বর</label>
                <input 
                  type="text" 
                  value={findContact} 
                  onChange={(e) => setFindContact(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <button 
                onClick={() => {
                  const radarMsg = `🔍 [নিখোঁজ সন্ধান বুলেটিন]: ${findPerson} | সর্বশেষ এলাকা: ${findArea} | তথ্য পেলে জানান: ${findContact}`;
                  handleSendMessage(radarMsg);
                  showToast('🔍 নিখোঁজ সন্ধান বুলেটিন ভলান্টিয়ার চ্যাটে পোস্ট করা হয়েছে!');
                  setActiveToolModal(null);
                  if (!activeChat) setActiveChat(conversations.find(c => c.id === 'chat-3') || conversations[0]);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <UserSearch className="w-4 h-4" />
                <span>সন্ধান বুলেটিন সেন্ড করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. TOOL MODAL: AI HEALTH TRIAGE ================= */}
      {activeToolModal === 'ai' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 bg-purple-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-5 h-5" />
                <h3 className="text-sm font-bold">DestiBrain এআই হেলথ সামারি</h3>
              </div>
              <button 
                onClick={() => setActiveToolModal(null)}
                className="p-1 hover:bg-purple-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">লক্ষণ বা প্রেসক্রিপশন নোট লিখুন</label>
                <textarea 
                  rows={3}
                  value={aiSymptomText} 
                  onChange={(e) => setAiSymptomText(e.target.value)} 
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:outline-hidden focus:border-purple-500"
                  placeholder="যেমন: ৩ দিন ধরে ১০২ জ্বর, প্লাটিলেট কাউন্ট ৬৫,০০০, শরীরে মৃদু র‍্যাশ..."
                />
              </div>

              {/* Sample quick tags */}
              <div className="flex flex-wrap gap-1.5">
                <button 
                  type="button"
                  onClick={() => setAiSymptomText('প্লাটিলেট কাউন্ট ৬৫,০০০ ও হালকা মাথা ঘোরা')}
                  className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200"
                >
                  প্লাটিলেট টেস্ট
                </button>
                <button 
                  type="button"
                  onClick={() => setAiSymptomText('৩ দিন ধরে অবিরাম জ্বর ও গায়ে তীব্র ব্যথা')}
                  className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200"
                >
                  ডেঙ্গু সতর্কতা
                </button>
                <button 
                  type="button"
                  onClick={() => setAiSymptomText('রক্তচাপ ১৪৫/৯৫ ও ক্লান্তি অনুভব')}
                  className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200"
                >
                  উচ্চ রক্তচাপ
                </button>
              </div>

              {/* AI Trigger button */}
              <button 
                type="button"
                onClick={() => {
                  setIsGeneratingAi(true);
                  setTimeout(() => {
                    setAiGeneratedSummary(
                      `📋 এআই প্রাথমিক বিশ্লেষণ:\n• মূল উপসর্গ: ${aiSymptomText || 'প্লাটিলেট হ্রাস ও জ্বর'}\n• জরুরি নির্দেশনা: তরল ও ডাবের পানি গ্রহণ বাড়ান। প্যারাসিটামল ছাড়া অন্য ব্যথানাশক পরিহার করুন।\n• পরামর্শ: দ্রুত নিকটস্থ হেমাটোলজি বা ডেঙ্গু সেন্টারে সিবিসি টেস্ট ফলোআপ করুন।`
                    );
                    setIsGeneratingAi(false);
                  }, 600);
                }}
                disabled={isGeneratingAi}
                className="w-full py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAi ? 'এআই বিশ্লেষণ চলছে...' : 'এআই দিয়ে সামারাইজ করুন'}</span>
              </button>

              {aiGeneratedSummary && (
                <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 text-xs text-purple-950 whitespace-pre-line animate-in fade-in duration-150">
                  {aiGeneratedSummary}
                </div>
              )}

              {aiGeneratedSummary && (
                <button 
                  onClick={() => {
                    handleSendMessage(aiGeneratedSummary);
                    showToast('🧠 এআই স্বাস্থ্য সারসংক্ষেপ চ্যাটে পাঠানো হয়েছে!');
                    setActiveToolModal(null);
                    if (!activeChat) setActiveChat(conversations.find(c => c.id === 'chat-4') || conversations[0]);
                  }}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>চ্যাটে সামারি সেন্ড করুন</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= EMERGENCY VOICE / VIDEO CALL MODAL ================= */}
      {activeCallContact && (
        <div className="fixed inset-0 z-50 bg-gray-950/95 text-white flex flex-col items-center justify-between p-6 animate-in fade-in duration-200">
          <div className="flex flex-col items-center mt-8 text-center">
            <span className="text-xs font-bold text-teal-400 bg-teal-950/70 border border-teal-800 px-3 py-1 rounded-full mb-4">
              {activeCallContact.isVideo ? 'ভিডিও কলিং...' : 'লাইভ ভয়েস কলিং...'}
            </span>
            <div className="relative mb-4">
              <img 
                src={activeCallContact.avatar} 
                alt={activeCallContact.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-teal-500/40 shadow-2xl animate-pulse"
              />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">{activeCallContact.name}</h2>
            <p className="text-xs text-gray-400">{activeCallContact.phone || 'জরুরি ডেস্ক'}</p>
            <p className="text-sm font-mono text-teal-300 font-bold mt-3">
              {formatCallTime(callTimer)}
            </p>
          </div>

          {/* Call Controls */}
          <div className="w-full max-w-xs flex items-center justify-around mb-8">
            <button 
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isCallMuted ? 'bg-rose-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title="মিউট"
            >
              {isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button 
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer"
              title="কল শেষ করুন"
            >
              <PhoneMissed className="w-7 h-7" />
            </button>

            <button 
              onClick={() => setIsCallSpeaker(!isCallSpeaker)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isCallSpeaker ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title="স্পিকার"
            >
              {isCallSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Dedicated DestiChat 24h Story & Broadcast Modal */}
      <DestiChatCreateStoryModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmitStory={(story) => {
          setIsUploadModalOpen(false);
          showToast(`✨ ২৪ ঘণ্টার চ্যাট স্টোরি সফলভাবে পোস্ট হয়েছে!`);
        }}
      />
    </div>
  );
};

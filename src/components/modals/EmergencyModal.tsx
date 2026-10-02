import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  ShieldCheck,
  Heart,
  AlertCircle,
  Ambulance,
  Flame,
  PhoneCall,
  Radio,
  HelpCircle,
  Siren,
  Search,
  Copy,
  Check,
  Droplets,
  Activity,
  Wind,
  Phone,
  UserPlus,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Zap,
  Bed,
  Sparkles,
  Navigation,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Smartphone,
  MapPin,
  FileText,
  User,
  Star,
  CheckCircle,
  Truck,
  Plus,
  Minus,
  Pill,
  Lightbulb,
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCall: (number: string) => void;
  onOpenBloodRequest?: () => void;
  onOpenBloodBank?: () => void;
  onShowToast?: (msg: string) => void;
}

type TabType = 'all' | 'hotlines' | 'firstaid' | 'disaster' | 'upcoming';

interface HotlineItem {
  id: string;
  name: string;
  number: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  isTollFree?: boolean;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onCall,
  onOpenBloodRequest,
  onShowToast,
}) => {
  const { l, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Demo UI Modal State
  const [activeDemoFeature, setActiveDemoFeature] = useState<'ambulance' | 'oxygen' | 'icu' | null>(null);

  // Demo Specific Simulation States
  // Ambulance demo state
  const [ambulanceFilter, setAmbulanceFilter] = useState<'all' | 'icu' | 'ac'>('all');
  const [bookedAmbulance, setBookedAmbulance] = useState<{
    type: string;
    driver: string;
    plate: string;
    eta: number;
    fare: string;
  } | null>(null);

  // Oxygen demo state
  const [selectedOxygenCylinder, setSelectedOxygenCylinder] = useState<'portable' | 'jumbo'>('portable');
  const [needTechnician, setNeedTechnician] = useState(true);
  const [oxygenOrdered, setOxygenOrdered] = useState(false);

  // ICU demo state
  const [selectedHospitalForBed, setSelectedHospitalForBed] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientSpO2, setPatientSpO2] = useState('88%');
  const [bedHoldSuccess, setBedHoldSuccess] = useState(false);

  // ICE Guardian contact in local storage
  const [iceContact, setIceContact] = useState<{ name: string; phone: string }>(() => {
    try {
      const saved = localStorage.getItem('destihope_ice_contact');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { name: '', phone: '' };
  });
  const [isEditingIce, setIsEditingIce] = useState(false);
  const [tempIceName, setTempIceName] = useState('');
  const [tempIcePhone, setTempIcePhone] = useState('');

  // Selected first aid card
  const [expandedFirstAid, setExpandedFirstAid] = useState<number | null>(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      resetDemos();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetDemos = () => {
    setActiveDemoFeature(null);
    setBookedAmbulance(null);
    setOxygenOrdered(false);
    setSelectedHospitalForBed(null);
    setBedHoldSuccess(false);
  };

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify(`${label} কপি করা হয়েছে`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveIce = () => {
    if (!tempIcePhone.trim()) {
      notify('ফোন নম্বর লিখুন');
      return;
    }
    const updated = {
      name: tempIceName.trim() || 'জরুরি কন্টাক্ট',
      phone: tempIcePhone.trim(),
    };
    setIceContact(updated);
    localStorage.setItem('destihope_ice_contact', JSON.stringify(updated));
    setIsEditingIce(false);
    notify('জরুরি অভিভাবক নম্বর সংরক্ষিত হয়েছে');
  };

  if (!isOpen) return null;

  // Master Hotlines list
  const hotlines: HotlineItem[] = [
    {
      id: '999',
      name: l('জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)', 'National Emergency Service (Police, Ambulance, Fire)'),
      number: '999',
      tag: l('টোল ফ্রি • ২৪/৭ সার্বক্ষণিক', 'Toll Free • 24/7 Available'),
      desc: l('পুলিশ সহায়তা, সরকারি অ্যাম্বুলেন্স তলব ও ফায়ার রেসকিউ ইউনিট', 'Police assistance, govt ambulance dispatch & fire rescue unit'),
      icon: ShieldCheck,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      isTollFree: true,
    },
    {
      id: '16263',
      name: l('স্বাস্থ্য বাতায়ন (২৪/৭ সরকারি সার্বক্ষণিক ডাক্তার)', 'Shastho Batayon (24/7 Government Tele-Doctor)'),
      number: '16263',
      tag: l('টেলিমেডিসিন সেবা', 'Telemedicine Service'),
      desc: l('জরুরি অসুস্থতায় অভিজ্ঞ চিকিৎসকের সরাসরি পরামর্শ ও দিকনির্দেশনা', 'Direct consultation and triage guidance from licensed physicians'),
      icon: Heart,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isTollFree: false,
    },
    {
      id: '16163',
      name: l('ফায়ার সার্ভিস ও সিভিল ডিফেন্স নিয়ন্ত্রণ কক্ষ', 'Fire Service & Civil Defense Control Room'),
      number: '16163',
      tag: l('উদ্ধার ও অগ্নিনির্বাপণ', 'Rescue & Firefighting'),
      desc: l('অগ্নিকাণ্ড, ভবন ধস ও মারাত্মক দুর্ঘটনায় উদ্ধারকারী দল', 'Fire extinguishing, building collapse & trauma rescue teams'),
      icon: Flame,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      isTollFree: false,
    },
    {
      id: '333',
      name: l('জাতীয় নাগরিক ও ত্রাণ সহায়তা হেল্পলাইন', 'National Citizen & Relief Helpline (333)'),
      number: '333',
      tag: l('টোল ফ্রি • খাদ্য ও সামাজিক সেবা', 'Toll Free • Food & Social Welfare'),
      desc: l('জরুরি খাদ্য ও দুর্যোগ সহায়তা এবং সরকারি সেবা পাওয়ার তথ্য', 'Emergency food aid, flood relief & government utility information'),
      icon: HelpCircle,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      isTollFree: true,
    },
    {
      id: '109',
      name: l('নারী ও শিশু নির্যাতন প্রতিরোধ জাতীয় হেল্পলাইন', 'National Women & Children Protection Helpline'),
      number: '109',
      tag: l('টোল ফ্রি • আইনি ও আশ্রয় সুরক্ষা', 'Toll Free • Legal & Safe Shelter'),
      desc: l('সহিংসতা, নির্যাতন ও জরুরি সুরক্ষায় প্রশাসনের তাৎক্ষণিক পদক্ষেপ', 'Administrative intervention against domestic violence & harassment'),
      icon: AlertCircle,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      isTollFree: true,
    },
    {
      id: '1090',
      name: l('দুর্যোগের আগাম সতর্কবার্তা ও আবহাওয়া বুলেটিন', 'Disaster Early Warning & Weather Bulletin (1090)'),
      number: '1090',
      tag: l('টোল ফ্রি • সাইক্লোন ও বন্যা', 'Toll Free • Cyclone & Flood Alert'),
      desc: l('ঘূর্ণিঝড়, বন্যা ও প্রাকৃতিক দুর্যোগের সরকারি নির্ভরযোগ্য পূর্বাভাস', 'Reliable government forecasts for cyclones, typhoons & inundations'),
      icon: Radio,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      isTollFree: true,
    },
    {
      id: '1098',
      name: l('শিশু সহায়তা হেল্পলাইন (Childline)', 'National Childline Helpline (1098)'),
      number: '1098',
      tag: l('টোল ফ্রি • শিশু সুরক্ষা', 'Toll Free • Child Protection'),
      desc: l('ঝুঁকিপূর্ণ বা বিপদে থাকা শিশুর সার্বিক নিরাপত্তা ও সহায়তা', 'Total protection and emergency rescue for distressed children'),
      icon: Heart,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      isTollFree: true,
    },
    {
      id: '16116',
      name: l('বিদ্যুৎ জরুরি কন্ট্রোল রুম ও শর্টসার্কিট ঝুঁকি', 'Electricity Emergency Control & Short-Circuit Risk'),
      number: '16116',
      tag: l('বিদ্যুৎ বিপর্যয় টিম', 'Power Outage Emergency Team'),
      desc: l('ছেঁড়া বিদ্যুৎ তার, ট্রান্সফরমার অগ্নিকাণ্ড ও শর্টসার্কিট নিরসন', 'Snapped high-voltage cables, transformer fires & emergency outages'),
      icon: Flame,
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
      isTollFree: false,
    },
  ];

  // First Aid Guides
  const firstAidGuides = [
    {
      title: l('হঠাৎ কার্ডিয়াক অ্যারেস্ট / শ্বাস বন্ধ হলে (CPR)', 'Sudden Cardiac Arrest / Respiratory Arrest (CPR)'),
      badge: l('জীবন বাঁচানোর প্রটোকল', 'Lifesaving Protocol'),
      summary: l('মস্তিষ্কে অক্সিজেন চলাচল বজায় রাখতে তাৎক্ষণিক বুক চাপুন।', 'Perform chest compressions immediately to preserve brain oxygenation.'),
      steps: [
        'রোগীর কাঁধ ধরে জোরে ডাকুন ও শ্বাস-প্রশ্বাস পরীক্ষা করুন (১০ সেকেন্ডের বেশি সময় নেবেন না)।',
        'তাৎক্ষণিকভাবে ৯৯৯-এ কল দিন এবং ফোন স্পিকারে রাখুন।',
        'বুকের ঠিক মাঝখানে দুই হাতের তালু একের ওপর এক রেখে শরীরের ওজন দিয়ে প্রতি মিনিটে ১০০-১২০ বার জোরে চাপুন।',
        'প্রতি ৩০ বার চাপের পর ২ বার কৃত্রিম শ্বাস দিন (যদি জানা থাকে)। ডাক্তার না আসা পর্যন্ত বুক চাপা চালিয়ে যান।',
      ],
      dos: 'শক্ত সমতল মেঝেতে রোগীকে সোজা শুইয়ে বুক চাপুন।',
      donts: 'নরম তোশক বা খাটের ওপর রোগীকে রেখে CPR দেবেন না।',
    },
    {
      title: l('তীব্র রক্তক্ষরণ দ্রুত বন্ধ করার নিয়ম', 'Stopping Severe External Hemorrhage'),
      badge: l('রক্তক্ষরণ নিয়ন্ত্রণ', 'Bleeding Control'),
      summary: l('রক্ত পড়া বন্ধ না করলে রোগী দ্রুত শকে চলে যেতে পারে।', 'Apply continuous direct pressure to prevent hypovolemic shock.'),
      steps: [
        'পরিষ্কার গজ বা সুতি কাপড় দিয়ে ক্ষতস্থানের ওপর সরাসরি দুই হাত দিয়ে একটানা শক্ত চাপ বজায় রাখুন।',
        'ক্ষতস্থান সম্ভব হলে হৃদপিণ্ডের উচ্চতার ওপরে তুলে রাখুন।',
        'প্রথম কাপড় ভিজে গেলেও তা সরাবেন না; তার ওপর আরও কাপড় দিয়ে শক্ত ব্যান্ডেজ বাঁধুন।',
        'রোগীকে শোয়ানো অবস্থায় উষ্ণ রাখুন এবং অতি দ্রুত নিকটস্থ হাসপাতালে নিন।',
      ],
      dos: 'ক্ষতস্থানের ঠিক ওপর একটানা ৫-১০ মিনিট অনড় চাপ দিয়ে রাখুন।',
      donts: 'ক্ষতের মধ্যে কোনো ধারালো বস্তু (কাচ/লোহা) থাকলে তা টেনে বের করবেন না।',
    },
    {
      title: l('সাপের কামড়ে জরুরি করণীয় ও বর্জনীয়', 'Snakebite Emergency: Do’s and Don’ts'),
      badge: l('সতর্কতা নির্দেশিকা', 'Safety Protocol'),
      summary: l('রোগীকে সম্পূর্ণ স্থির রেখে দ্রুত হাসপাতালে নিন।', 'Keep patient totally immobile and transport to nearest hospital immediately.'),
      steps: [
        'রোগীকে স্থির ও সম্পূর্ণ শান্ত রাখুন। আতঙ্কিত হয়ে দৌড়াদৌড়ি বা হাঁটাচলা করতে দেবেন না।',
        'আক্রান্ত হাত বা পায়ের আংটি, ঘড়ি বা আঁটসাঁট কাপড় দ্রুত খুলে ফেলুন।',
        'ক্ষতের ওপর হালকা করে সুতি কাপড় পেঁচিয়ে অবিলম্বে নিকটস্থ সরকারি হাসপাতালে নিন।',
        'বাংলাদেশে যেকোনো বিষধর সাপের কামড়ে সরকারি হাসপাতালে ফ্রি অ্যান্টিভেনম দেওয়া হয়।',
      ],
      dos: 'কাছের উপজেলা স্বাস্থ্য কমপ্লেক্স বা জেলা সদর হাসপাতালে দ্রুত নিয়ে যান।',
      donts: 'দড়ি দিয়ে শক্ত বাঁধন দেবেন না, ব্লেড দিয়ে কাটবেন না, রক্ত চুষবেন না, ওঝার কাছে যাবেন না।',
    },
    {
      title: l('আগুনে পোড়া ও ফুটন্ত পানির তাৎক্ষণিক যত্ন', 'Immediate Care for Burns & Scalds'),
      badge: l('বার্ন কেয়ার', 'Burn Care'),
      summary: l('পোড়ার তীব্রতা কমাতে সাধারণ পানি ঢালুন।', 'Pour ambient tap water continuously for 15-20 minutes.'),
      steps: [
        'পোড়া জায়গায় অবিলম্বে একটানা ১৫-২০ মিনিট সাধারণ তাপমাত্রার বহমান পরিষ্কার পানি ঢালুন।',
        'শরীরের সাথে সেঁটে থাকা কাপড় টেনে খুলবেন না; আলতো করে পরিষ্কার পাতলা কাপড় দিয়ে ঢেকে রাখুন।',
        'রোগী সচেতন থাকলে তাকে প্রচুর খাবার স্যালাইন ও পানি পান করান।',
        'দ্রুত বার্ন ইউনিট বা নিকটস্থ সরকারি হাসপাতালের জরুরি বিভাগে নিন।',
      ],
      dos: 'শুধুমাত্র স্বাভাবিক তাপমাত্রার পরিষ্কার পানি ঢালুন।',
      donts: 'বরফ, ডিমের কুসুম, টুথপেস্ট বা তেল লাগাবেন না। ফোস্কা ফাটাবেন না।',
    },
    {
      title: l('ব্রেন স্ট্রোক দ্রুত সনাক্তকরণ (FAST নিয়ম)', 'Rapid Stroke Identification (FAST Rule)'),
      badge: l('জরুরি স্ট্রোক সংকেত', 'Emergency Stroke Signs'),
      summary: l('প্রথম ৪.৫ ঘণ্টার মধ্যে হাসপাতালে নেওয়া জীবন-মরণ নির্ধারক।', 'Reaching a CT-scan equipped facility within 4.5 hours is critical.'),
      steps: [
        'F (Face): রোগীকে হাসতে বলুন — মুখের একপাশ কি বেঁকে যাচ্ছে?',
        'A (Arms): দুই হাত সমান্তরাল ওপরে তুলতে বলুন — এক হাত কি অবশ হয়ে নিচে নেমে যাচ্ছে?',
        'S (Speech): সহজ কথা বলতে বলুন — কথা কি জড়িয়ে যাচ্ছে বা অস্পষ্ট হচ্ছে?',
        'T (Time): এই লক্ষণগুলোর একটিও মিললে ১ সেকেন্ডও নষ্ট না করে দ্রুত সিটি স্ক্যান সুবিধাযুক্ত হাসপাতালে নিন।',
      ],
      dos: 'তাৎক্ষণিকভাবে রোগীকে একপাশে কাত করে শুইয়ে হাসপাতালে নিয়ে যান।',
      donts: 'স্ট্রোকের রোগীকে মুখে কোনো ওষুধ, পানি বা খাবার দেওয়ার চেষ্টা করবেন না।',
    },
  ];

  // Disaster Awareness Guides
  const disasterGuides = [
    {
      title: l('বন্যা ও আকস্মিক পাহাড়ি ঢলে প্রস্তুতি', 'Preparedness for Floods & Flash Surges'),
      icon: Wind,
      badge: l('বন্যা সুরক্ষা', 'Flood Safety'),
      summary: 'পানির বিপদসীমা বাড়ার আগেই পরিবারের জরুরি সামগ্রী গুছিয়ে নিরাপদ আশ্রয়ে যান।',
      steps: [
        'জরুরি শুকনো খাবার (মুড়ি, চিঁড়া, গুড়), বিশুদ্ধ পানি, খাবার স্যালাইন ও নিয়মিত ওষুধ ওয়াটারপ্রুফ ব্যাগে রাখুন।',
        'ঘরের বিদ্যুতের মেইন সুইচ ও গ্যাসের লাইন সম্পূর্ণ বন্ধ করে বের হন।',
        'জরুরি খাদ্য বা নৌকা সহায়তার জন্য ৩৩৩ অথবা ফায়ার সার্ভিসের ১৬১৬৩ নম্বরে খবর দিন।',
        'বন্যার পানি নামার পর খাবার পানি অবশ্যই ফুটিয়ে বা ফিটকিরি দিয়ে বিশুদ্ধ করে পান করুন।',
      ],
    },
    {
      title: l('ঘূর্ণিঝড় ও জলোচ্ছ্বাসের সতর্কবার্তা', 'Cyclone & Coastal Inundation Warnings'),
      icon: Radio,
      badge: l('সাইক্লোন নিরাপত্তা', 'Cyclone Protection'),
      summary: '১০৯০ নম্বরে কল করে সরকারি সর্বশেষ বিপদ সংকেত নিয়মিত যাচাই করুন।',
      steps: [
        'রেডিও, টিভি বা মোবাইল থেকে ঘূর্ণিঝড়ের গতিবিধি পর্যবেক্ষণ করুন।',
        '৭ বা ৮ নম্বর বিপদ সংকেত ঘোষণার সাথে সাথেই নারী, শিশু ও বৃদ্ধদের নিয়ে পাকা আশ্রয়কেন্দ্রে চলে যান।',
        'মোবাইল ফোন ও পাওয়ার ব্যাংক পূর্ণ চার্জ দিয়ে রাখুন এবং পলিথিনে পেঁচিয়ে সাথে নিন।',
        'গুরুত্বপূর্ণ দলিল, সার্টিফিকেট ও পরিচয়পত্র ওয়াটারপ্রুফ ব্যাগে সুরক্ষিত রাখুন।',
      ],
    },
    {
      title: l('ভূমিকম্পে তাৎক্ষণিক আত্মরক্ষা (Drop, Cover, Hold On)', 'Earthquake Survival (Drop, Cover, Hold On)'),
      icon: ShieldAlert,
      badge: l('ভূমিকম্প সতর্কতা', 'Earthquake Alert'),
      summary: 'ভূমিকম্পের সময় দৌড়াদৌড়ি না করে নিজেকে সুরক্ষিত রাখুন।',
      steps: [
        'ঝাঁকুনি শুরু হলে সাথে সাথে শক্ত টেবিল বা খাটের নিচে ঢুকে বসে মাথা ও ঘাড় হাত দিয়ে ঢেকে রাখুন।',
        'ভূমিকম্পের সময় কখনই লিফট ব্যবহার করবেন না; জানালার কাচ বা ঝুলন্ত ভারী আসবাব থেকে দূরে থাকুন।',
        'রাস্তায় থাকলে বহুতল ভবন, বৈদ্যুতিক খুঁটি ও ওভারহেড তার থেকে দূরে ফাঁকা জায়গায় দাঁড়ান।',
        'ভূমিকম্প থেমে যাওয়ার পর ধীরে ধীরে সিঁড়ি দিয়ে বাইরে নিরাপদ খোলা মাঠে নেমে আসুন।',
      ],
    },
    {
      title: l('বজ্রপাত থেকে বাঁচার জরুরি নিয়ম', 'Lightning Strike Safety Guidelines'),
      icon: Zap,
      badge: l('বজ্রপাত সচেতনতা', 'Lightning Awareness'),
      summary: 'মেঘের ডাক শুনলেই খোলা মাঠ বা গাছের নিচ থেকে সরে পাকা ভবনে আশ্রয় নিন।',
      steps: [
        'বজ্রপাতের সময় খোলা মাঠে, নদীর ধারে বা কোনো বড় গাছের নিচে অবস্থান করবেন না।',
        'ধাতব হাতলযুক্ত ছাতা, মোবাইল চার্জার বা ইলেকট্রিক তার স্পর্শ থেকে দূরে থাকুন।',
        'খোলা জায়গায় আটকে পড়লে দুই পা কাছাকাছি এনে মাটিতে কুঁকড়ে বসে পড়ুন (মাটিতে শুয়ে পড়বেন না)।',
        'যানবাহনে থাকলে গাড়ির কাচ সম্পূর্ণ বন্ধ রেখে গাড়ির ভেতরেই অবস্থান করুন।',
      ],
    },
  ];

  // Active in-development features (with High-Fidelity Realistic Demo UIs)
  const upcomingInDevelopment = [
    {
      id: 'ambulance' as const,
      title: 'জরুরি অ্যাম্বুলেন্স নেটওয়ার্ক (On-Demand Ambulance Dispatch)',
      concept: 'জরুরি প্রয়োজনে ১-ট্যাপে নিকটস্থ অনুমোদিত অ্যাম্বুলেন্স চালকের সাথে যোগাযোগ, লাইভ ম্যাপ ট্র্যাকিং ও দ্রুত রেসপন্স।',
      icon: Ambulance,
      tag: 'কাজ চলছে',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      demoTitle: 'লাইভ অ্যাম্বুলেন্স ডিসপ্যাচ ডেমো',
      highlights: [
        'ম্যাপে নিকটবর্তী অ্যাম্বুলেন্সের লাইভ অবস্থান',
        'আইসিইউ (ICU), সিসিইউ ও সাধারণ ভ্যান নির্বাচন',
        'স্বচ্ছ সরকারি ও নির্ধারিত ন্যায্য ভাড়ার তালিকা',
        'হাসপাতাল ট্রমা টিমের সাথে রোগী আগাম সংযোগ',
      ],
    },
    {
      id: 'icu' as const,
      title: 'হাসপাতাল আইসিইউ ও জরুরি বেড ট্র্যাকার',
      concept: 'মুমূর্ষু রোগীর জীবন বাঁচাতে কোন হাসপাতালে আইসিইউ বা সিসিইউ বেড খালি রয়েছে তা তাৎক্ষণিক জানার সিস্টেম।',
      icon: Bed,
      tag: 'কাজ চলছে',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      demoTitle: 'হাসপাতাল বেড লাইভ ট্র্যাকার ডেমো',
      highlights: [
        'সরকারি ও বেসরকারি হাসপাতালের রিয়েল-টাইম বেড উপাত্ত',
        'ইমার্জেন্সি রুম ট্রমা ডেস্কের সরাসরি যোগাযোগ',
        'অগ্রিম রোগী ট্রায়াজ ও জরুরি বেড বুকিং রিকোয়েস্ট',
      ],
    },
    {
      id: 'oxygen' as const,
      title: 'জরুরি অক্সিজেন সিলিন্ডার সহায়তা নেটওয়ার্ক',
      concept: 'শ্বাসকষ্টের রোগীর জন্য স্থানীয় ভেরিফায়েড সরবরাহকারীদের থেকে দ্রুত অক্সিজেন সিলিন্ডার হোম-ডেলিভারি।',
      icon: Activity,
      tag: 'কাজ চলছে',
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      demoTitle: 'অক্সিজেন এক্সপ্রেস অর্ডার ডেমো',
      highlights: [
        '২৪ ঘণ্টা সক্রিয় স্থানীয় অক্সিজেন ভেন্ডরদের তালিকা',
        'ফ্লোমিটার, হিউমিডিফায়ার ও সিলিন্ডার সেটআপ সহায়তা',
        'জরুরি টেকনিশিয়ান হ্যান্ড-ওভার ও টেস্ট সার্ভিস',
      ],
    },
  ];

  // Future ideas / Visionary concepts (No demo button, just concepts)
  const futureIdeas = [
    {
      title: 'সক্রিয় রক্তের জরুরি কেস ও লাইভ কাউন্টডাউন ট্র্যাকার',
      desc: 'মুহূর্তের নোটিশে মুমূর্ষু রোগীর রক্তের চাহিদা, সময়সীমা গণনা এবং রক্তের ব্যাগ সংগ্রহের অগ্রগতি ট্র্যাকিং সিস্টেম।',
      icon: Droplets,
      tag: 'ভবিষ্যৎ পরিকল্পনা',
    },
    {
      title: 'এক-ট্যাপ নীরব পুলিশ এসওএস মেসেজ (Silent SOS)',
      desc: 'বিপদকালীন সময়ে পরিবারের নির্বাচিত অভিভাবক ও জরুরি কন্ট্রোল রুমে অটোমেটিক সংকেত ও লাইভ জিপিএস লোকেশন পাঠানো।',
      icon: Siren,
      tag: 'ভবিষ্যৎ পরিকল্পনা',
    },
    {
      title: 'ডিজিটাল প্রেসক্রিপশন ও জরুরি ফার্মেসি এক্সপ্রেস',
      desc: 'জরুরি জীবনরক্ষাকারী ওষুধের জন্য নিকটস্থ ২৪ ঘণ্টার ফার্মেসি থেকে ওষুধ সরবরাহের সংযোগ নেটওয়ার্ক।',
      icon: Pill,
      tag: 'আইডিয়া রূপরেখা',
    },
    {
      title: 'জরুরি রক্তচাপ ও সুগার টেলি-মনিটরিং সহায়তা',
      desc: 'বাসায় অসুস্থ রোগীর জন্য প্যারামেডিক সহায়তা ও স্বাস্থ্য বাতায়নের নিয়মিত ফলোআপ সমন্বয়।',
      icon: Heart,
      tag: 'পরবর্তী সংস্করণ',
    },
  ];

  const filteredHotlines = hotlines.filter((h) => {
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.number.includes(q) ||
      h.desc.toLowerCase().includes(q) ||
      h.tag.toLowerCase().includes(q)
    );
  });

  const tabList = [
    { id: 'all', label: l('সব সেবা', 'All Services') },
    { id: 'hotlines', label: l('জরুরি হটলাইন', 'Hotlines') },
    { id: 'firstaid', label: l('প্রাথমিক চিকিৎসা জ্ঞান', 'First Aid') },
    { id: 'disaster', label: l('দুর্যোগে রক্ষার জ্ঞান', 'Disaster Prep') },
    { id: 'upcoming', label: l('আসন্ন সেবা (Coming Soon)', 'Coming Soon') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white text-gray-900 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-hub-header"
    >
      {/* 1. APP-HEADER */}
      <header className="shrink-0 bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 rounded-full transition-all cursor-pointer"
              aria-label={l('ফিরে যান', 'Go Back')}
              title={l('ফিরে যান', 'Go Back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5" />
              </div>
              <div>
                <h1 id="emergency-hub-header" className="text-base font-black text-gray-900 leading-tight">
                  Desti Emergency Hub
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">
                  {l('জরুরি সেবা ও জীবন রক্ষাকারী সহায়তা কেন্দ্র', 'Emergency Services & Lifesaving Support')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 rounded-full transition-all cursor-pointer"
            aria-label={l('বন্ধ করুন', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. TAB NAVIGATION (Without overlay arrow circles) */}
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex items-center space-x-2 overflow-x-auto px-2 py-2 scrollbar-none text-xs">
            {tabList.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'upcoming' && (
                    <span className={`text-[9px] px-1 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 font-bold'}`}>
                      নতুন
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-1 pb-1">
            {tabList.map((t) => (
              <span
                key={t.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeTab === t.id ? 'w-4 bg-red-600' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 3. MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-4 max-w-2xl mx-auto w-full space-y-5">
        {/* ==================== TAB: ALL (সব সেবা) ==================== */}
        {activeTab === 'all' && (
          <div className="space-y-5">
            {/* ১. শীর্ষ ৪টি প্রধান জরুরি হটলাইন বাটন */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {l('তাৎক্ষণিক জরুরি নম্বরসমূহ', 'Immediate Emergency Numbers')}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">{l('সরাসরি ডায়াল করুন', 'Direct Dial')}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { num: '999', title: 'জাতীয় জরুরি সেবা', sub: 'পুলিশ • ফায়ার • অ্যাম্বুলেন্স', color: 'border-red-200 bg-red-50/70 hover:bg-red-100/80 text-red-950', badge: 'টোল ফ্রি' },
                  { num: '16263', title: 'স্বাস্থ্য বাতায়ন', sub: '২৪/৭ সরকারি ডাক্তার সেবা', color: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950', badge: 'চিকিৎসা' },
                  { num: '16163', title: 'ফায়ার সার্ভিস', sub: 'উদ্ধার ও অগ্নিনির্বাপণ', color: 'border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950', badge: 'রেসকিউ' },
                  { num: '333', title: 'নাগরিক ও ত্রাণ', sub: 'খাদ্য ও দুর্যোগ সহায়তা', color: 'border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-950', badge: 'টোল ফ্রি' },
                ].map((item) => (
                  <button
                    key={item.num}
                    onClick={() => onCall(item.num)}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer shadow-2xs ${item.color} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black font-mono tracking-tight">{item.num}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/90 shadow-2xs border border-black/5">
                        {item.badge}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold leading-tight">{item.title}</p>
                      <p className="text-[10px] text-gray-600 line-clamp-1 mt-0.5">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ২. জরুরি অভিভাবক কন্টাক্ট (ICE) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {iceContact.phone ? iceContact.name : 'জরুরি অভিভাবক কন্টাক্ট (ICE)'}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {iceContact.phone ? iceContact.phone : 'বিপদে আপনজনের নম্বর সেভ রাখুন'}
                  </p>
                </div>
              </div>

              {iceContact.phone ? (
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => {
                      setTempIceName(iceContact.name);
                      setTempIcePhone(iceContact.phone);
                      setIsEditingIce(true);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1"
                  >
                    বদলান
                  </button>
                  <button
                    onClick={() => onCall(iceContact.phone)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl shadow-2xs cursor-pointer"
                    title="কল দিন"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingIce(true)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  + নম্বর যোগ
                </button>
              )}
            </div>

            {isEditingIce && (
              <div className="bg-white border border-purple-200 p-3 rounded-2xl space-y-2 shadow-sm">
                <p className="text-xs font-bold text-purple-800">অভিভাবক বা পরিচিতজনের জরুরি নম্বর</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="নাম (যেমন: পিতা / ভাই)"
                    value={tempIceName}
                    onChange={(e) => setTempIceName(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-xs p-2 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="মোবাইল নম্বর"
                    value={tempIcePhone}
                    onChange={(e) => setTempIcePhone(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-xs p-2 rounded-lg text-gray-900 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditingIce(false)}
                    className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    {l('বাতিল', 'Cancel')}
                  </button>
                  <button
                    onClick={handleSaveIce}
                    className="px-3.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg"
                  >
                    {l('সংরক্ষণ করুন', 'Save')}
                  </button>
                </div>
              </div>
            )}

            {/* ৩. আরও জরুরি হটলাইন তালিকা */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  জাতীয় জরুরি হটলাইন ডিরেক্টরি
                </span>
                <button
                  onClick={() => setActiveTab('hotlines')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সবগুলো হটলাইন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'নারী ও শিশু নির্যাতন প্রতিরোধ সেল', number: '109', tag: 'টোল ফ্রি • আইনি সুরক্ষা', icon: AlertCircle, color: 'text-purple-600' },
                  { name: 'দুর্যোগের আগাম সতর্কবার্তা', number: '1090', tag: 'টোল ফ্রি • সাইক্লোন/বন্যা', icon: Radio, color: 'text-teal-600' },
                  { name: l('শিশু সহায়তা হেল্পলাইন (Childline)', 'National Childline Helpline (1098)'), number: '1098', tag: l('টোল ফ্রি • শিশু সুরক্ষা', 'Toll Free • Child Protection'), icon: Heart, color: 'text-indigo-600' },
                  { name: 'বিদ্যুৎ বিপর্যয় ও শর্টসার্কিট টিম', number: '16116', tag: 'বিদ্যুৎ জরুরি কন্ট্রোল', icon: Flame, color: 'text-orange-600' },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="bg-white border border-gray-200 p-2.5 rounded-2xl flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{item.tag}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onCall(item.number)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs rounded-xl flex items-center space-x-1 shrink-0 active:scale-95 shadow-2xs"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{item.number}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ৪. প্রাথমিক চিকিৎসা জ্ঞান হাইলাইটস */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  প্রাথমিক চিকিৎসা জ্ঞান (First Aid)
                </span>
                <button
                  onClick={() => setActiveTab('firstaid')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সম্পূর্ণ গাইড</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { title: 'হঠাৎ হৃদযন্ত্র বন্ধ হলে (CPR)', tip: 'বুকের মাঝখানে প্রতি মিনিটে ১০০-১২০ বার জোরে চাপ দিন।', badge: 'সিপিআর' },
                  { title: 'তীব্র রক্তক্ষরণ বন্ধে', tip: 'পরিষ্কার কাপড় দিয়ে ক্ষতস্থানে সরাসরি ৫-১০ মিনিট অনড় চাপুন।', badge: 'রক্তক্ষরণ' },
                  { title: 'সাপের কামড়ে করণীয়', tip: 'অঙ্গ স্থির রাখুন, শক্ত বাঁধন দেবেন না, দ্রুত হাসপাতালে অ্যান্টিভেনম নিন।', badge: 'সাপের কামড়' },
                  { title: 'আগুনে পোড়া ও গরম পানিতে', tip: '১৫-২০ মিনিট পরিষ্কার সাধারণ পানি ঢালুন (বরফ/টুথপেস্ট দেবেন না)।', badge: 'বার্ন কেয়ার' },
                ].map((item) => (
                  <div
                    key={item.title}
                    onClick={() => setActiveTab('firstaid')}
                    className="bg-white border border-gray-200 p-3 rounded-2xl space-y-1 shadow-2xs cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">{item.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ৫. দুর্যোগে জীবন রক্ষার মূল বিষয়সমূহ */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  দুর্যোগে রক্ষার জ্ঞান ও সতর্কতা
                </span>
                <button
                  onClick={() => setActiveTab('disaster')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>বিস্তারিত দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'বন্যা ও পাহাড়ি ঢল', desc: 'শুকনো খাবার ও বিশুদ্ধ পানি ব্যাগে রাখুন, মেইন সুইচ বন্ধ করুন।' },
                  { name: 'ঘূর্ণিঝড় সতর্কতা', desc: '১০৯০ নম্বরে সরকারি সংকেত জানুন ও পাকা আশ্রয়কেন্দ্রে যান।' },
                  { name: 'ভূমিকম্পে সুরক্ষা', desc: 'Drop, Cover, Hold On — শক্ত টেবিলের নিচে মাথা ঢেকে বসুন।' },
                  { name: 'বজ্রপাত থেকে বাঁচতে', desc: 'খোলা মাঠ বা গাছের নিচ এড়িয়ে পাকা ভবনে আশ্রয় নিন।' },
                ].map((d) => (
                  <div
                    key={d.name}
                    onClick={() => setActiveTab('disaster')}
                    className="bg-white border border-gray-200 p-3 rounded-2xl shadow-2xs cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <p className="text-xs font-bold text-teal-900">{d.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ৬. রক্তের জরুরি আবেদন */}
            <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-red-200 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">জরুরি রক্তের প্রয়োজন?</h3>
                  <p className="text-[11px] text-gray-600">DestiHope প্ল্যাটফর্মে সরাসরি রক্তের আবেদন পোস্ট করুন</p>
                </div>
              </div>

              {onOpenBloodRequest && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenBloodRequest();
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs shrink-0 cursor-pointer"
                >
                  আবেদন করুন
                </button>
              )}
            </div>

            {/* ৭. আসন্ন সেবা ব্যানার */}
            <div
              onClick={() => setActiveTab('upcoming')}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-gray-900">আসন্ন সেবাসমূহ (Coming Soon)</h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">বাস্তবিক ডেমো UI</span>
                  </div>
                  <p className="text-[11px] text-gray-600">অন-ডিমান্ড অ্যাম্বুলেন্স, অক্সিজেন এক্সপ্রেস ও আইসিইউ বেড ট্র্যাকার</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        )}

        {/* ==================== TAB: HOTLINES (জরুরি হটলাইন) ==================== */}
        {activeTab === 'hotlines' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="হটলাইন বা সেবার নাম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 placeholder-gray-400 shadow-2xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                জরুরি সরকারি ও মানবিক হটলাইন ({filteredHotlines.length})
              </span>
            </div>

            <div className="space-y-2">
              {filteredHotlines.map((hotline) => {
                const Icon = hotline.icon;
                const isCopied = copiedId === hotline.id;
                return (
                  <div
                    key={hotline.id}
                    className="bg-white border border-gray-200/90 hover:border-gray-300 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-2xs transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0 text-red-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-gray-900 truncate">{hotline.name}</h3>
                          {hotline.isTollFree && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              টোল ফ্রি
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{hotline.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(hotline.number, hotline.id, hotline.name)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title={l('নম্বর কপি করুন', 'Copy Number')}
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => onCall(hotline.number)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-mono font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{hotline.number}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB: FIRST AID ==================== */}
        {activeTab === 'firstaid' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  জরুরি প্রাথমিক চিকিৎসা নির্দেশিকা
                </h2>
                <p className="text-[11px] text-gray-500">ডাক্তার পৌঁছানোর আগে জীবন রক্ষায় করণীয়</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                অফলাইন প্রস্তুত
              </span>
            </div>

            <div className="space-y-2.5">
              {firstAidGuides.map((guide, idx) => {
                const isOpen = expandedFirstAid === idx;
                return (
                  <div
                    key={guide.title}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => setExpandedFirstAid(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left flex items-center justify-between hover:bg-gray-50/60 cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {guide.badge}
                        </span>
                        <h3 className="text-xs font-bold text-gray-900 mt-1">{guide.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">{guide.summary}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100 bg-gray-50/40 text-xs">
                        <div className="space-y-1.5">
                          <p className="text-[11px] font-bold text-gray-700">ধাপসমূহ:</p>
                          <ol className="space-y-1.5 list-decimal list-inside text-gray-700 leading-relaxed pl-1">
                            {guide.steps.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                            <span className="font-bold block mb-0.5">✓ করণীয়:</span>
                            {guide.dos}
                          </div>
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                            <span className="font-bold block mb-0.5">✕ বর্জনীয়:</span>
                            {guide.donts}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB: DISASTER ==================== */}
        {activeTab === 'disaster' && (
          <div className="space-y-3">
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                দুর্যোগ ব্যবস্থাপনা ও আত্মরক্ষা
              </h2>
              <p className="text-[11px] text-gray-500">বন্যা, ঘূর্ণিঝড় ও ভূমিকম্পে পরিবারের নিরাপত্তা বিধান</p>
            </div>

            <div className="space-y-3">
              {disasterGuides.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.title} className="bg-white border border-gray-200 p-4 rounded-2xl space-y-2 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{d.title}</h3>
                        <span className="text-[9.5px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          {d.badge}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-600 font-medium">{d.summary}</p>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <ul className="text-[11px] text-gray-700 space-y-1.5 list-disc list-inside leading-relaxed">
                        {d.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB: UPCOMING (কাজ চলছে ও বাস্তবসম্মত ডেমো UI) ==================== */}
        {activeTab === 'upcoming' && (
          <div className="space-y-5">
            {/* Header Assurance Banner */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h2 className="text-sm font-bold text-white">পরবর্তী সংস্করণ ও নতুন সেবার বাস্তব রূপরেখা</h2>
              </div>
              <p className="text-xs text-red-100 leading-relaxed">
                যে সেবাগুলোর প্রস্তুতি ও সংযোগের কাজ চলছে সেগুলোর <strong>বাস্তবসম্মত ডেমো UI</strong> দেখতে নিচের বোতামে ট্যাপ করুন। চালুর পর ঠিক কিভাবে সেবাটি পরিচালিত হবে তা এখান থেকে সরাসরি অনুভব করতে পারবেন।
              </p>
            </div>

            {/* ১. কাজ চলছে এমন সেবাগুলোর বাস্তবসম্মত ডেমো কার্ড */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  প্রস্তুতি চলছে (লাইভ ডেমো উপলব্ধ)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ইন্টারেক্টিভ সিমুলেশন
                </span>
              </div>

              {upcomingInDevelopment.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 p-4 rounded-2xl space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h3>
                          <span className="inline-block text-[9.5px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-0.5">
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Realistic Demo UI Button */}
                      <button
                        onClick={() => {
                          resetDemos();
                          setActiveDemoFeature(item.id);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>বাস্তবিক ডেমো দেখুন</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      {item.concept}
                    </p>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5">
                      <p className="text-[10.5px] font-bold text-gray-700">মূল সিস্টেমে যা যা থাকবে:</p>
                      <ul className="text-[10.5px] text-gray-600 space-y-1 list-disc list-inside leading-relaxed">
                        {item.highlights.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ২. ভবিষ্যতে আরও যুক্ত করার পরিকল্পনা রয়েছে (আইডিয়া ও কনসেপ্ট) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ভবিষ্যতে আরও যেসকল সেবা যুক্ত করার পরিকল্পনা রয়েছে
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {futureIdeas.map((idea) => {
                  const Icon = idea.icon;
                  return (
                    <div
                      key={idea.title}
                      className="bg-white border border-dashed border-gray-200 p-3.5 rounded-2xl flex items-start space-x-3 shadow-2xs"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-gray-900">{idea.title}</h4>
                          <span className="text-[9px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {idea.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{idea.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Global Offline Info Note */}
        <div className="p-3 bg-white rounded-xl border border-gray-200 text-center shadow-2xs">
          <p className="text-[11px] text-gray-600 font-medium">
            📡 ফোনে ইন্টারনেট না থাকলেও সিম কার্ড থেকে সরাসরি ৯৯৯ ও ৩৩৩ টোল-ফ্রি কাজ করবে।
          </p>
        </div>
      </main>

      {/* ==================== HIGH-FIDELITY REALISTIC DEMO UI MODAL ==================== */}
      {activeDemoFeature && (
        <div
          className="fixed inset-0 z-60 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveDemoFeature(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Device / App Header */}
            <div className="bg-slate-900 text-white px-4 py-3 shrink-0 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center">
                  {activeDemoFeature === 'ambulance' && <Ambulance className="w-4 h-4" />}
                  {activeDemoFeature === 'oxygen' && <Activity className="w-4 h-4" />}
                  {activeDemoFeature === 'icu' && <Bed className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs text-white">
                      {activeDemoFeature === 'ambulance' && 'অন-ডিমান্ড অ্যাম্বুলেন্স ডিসপ্যাচ'}
                      {activeDemoFeature === 'oxygen' && 'জরুরি অক্সিজেন এক্সপ্রেস ডেলিভারি'}
                      {activeDemoFeature === 'icu' && 'লাইভ আইসিইউ ও জরুরি বেড ট্র্যাকার'}
                    </h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      লাইভ ডেমো
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">বাস্তব অ্যাপে যেভাবে কাজ করবে</p>
                </div>
              </div>

              <button
                onClick={() => setActiveDemoFeature(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DEMO BODY SCROLLER */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
              {/* ---------------- 1. REALISTIC AMBULANCE DISPATCH DEMO ---------------- */}
              {activeDemoFeature === 'ambulance' && (
                <div className="space-y-3.5">
                  {/* Realistic Map Component with streets & active GPS Pins */}
                  <div className="relative h-44 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-inner flex flex-col justify-between p-3">
                    {/* Simulated Street Grid */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-700/60 -translate-y-1/2 rotate-12" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-slate-700/60 -rotate-6" />

                    {/* Top status tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-700 text-[10px] text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>৩টি অ্যাম্বুলেন্স কাছাকাছি লাইভ</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
                        জিপিএস রেসপন্স: ৩-৭ মিনিট
                      </span>
                    </div>

                    {/* Map Pins: User + Nearby Ambulances */}
                    <div className="relative z-10 flex items-center justify-around">
                      {/* Ambulance 1 */}
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-red-600 text-white rounded-full shadow-lg border-2 border-white animate-bounce">
                          <Ambulance className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded mt-0.5">
                          ১.২ কিমি (৪ মি.)
                        </span>
                      </div>

                      {/* User Location */}
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white ring-4 ring-blue-500/30" />
                        <span className="text-[9px] font-bold text-blue-200 bg-blue-950/90 px-1.5 py-0.5 rounded mt-1">
                          আপনার অবস্থান
                        </span>
                      </div>

                      {/* Ambulance 2 */}
                      <div className="flex flex-col items-center opacity-85">
                        <div className="p-1.5 bg-amber-500 text-white rounded-full shadow-md border-2 border-white">
                          <Ambulance className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded mt-0.5">
                          ২.৪ কিমি (৭ মি.)
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 text-[9.5px] text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg truncate">
                      📍 ধানমন্ডি ২৭ রোড, ঢাকা • নিকটতম ট্রমা সেন্টার: ঢাকা মেডিকেল (৩.২ কিমি)
                    </div>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center space-x-1.5 text-xs">
                    {[
                      { id: 'all', label: 'সব ক্যাটাগরি' },
                      { id: 'icu', label: 'আইসিইউ লাইফ সাপোর্ট' },
                      { id: 'ac', label: 'স্ট্যান্ডার্ড এসি' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setAmbulanceFilter(f.id as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          ambulanceFilter === f.id
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Realistic Ambulance Cards */}
                  {!bookedAmbulance ? (
                    <div className="space-y-2.5">
                      {/* Driver 1 */}
                      {(ambulanceFilter === 'all' || ambulanceFilter === 'icu') && (
                        <div className="p-3.5 bg-white border border-red-200 rounded-2xl space-y-2 shadow-2xs">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
                                <Ambulance className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-gray-900">আইসিইউ ক্রিটিক্যাল কেয়ার ভ্যান</h4>
                                  <span className="text-[9px] font-bold text-red-700 bg-red-50 px-1 rounded border border-red-200">
                                    লাইফ সাপোর্ট
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500">চালক: মোঃ সেলিম হোসেন • ৪.৯ ★ (১১২+ ট্রিপ)</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-gray-900">৳ ২,৫০০</span>
                              <span className="block text-[9.5px] text-emerald-700 font-bold">৪ মিনিট দূর</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 text-[9.5px] text-gray-600">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">ভেন্টিলেটর</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">অক্সিজেন লাইন</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">প্যারামেডিক ডাক্তার সহ</span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => notify('চালক মোঃ সেলিমের নম্বরে ডেমো কল প্রেরণ হচ্ছে...')}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>ড্রাইভার কল</span>
                            </button>
                            <button
                              onClick={() => {
                                setBookedAmbulance({
                                  type: 'আইসিইউ ক্রিটিক্যাল কেয়ার ভ্যান',
                                  driver: 'মোঃ সেলিম হোসেন',
                                  plate: 'ঢাকা মেট্রো-ছ ৭১-৪৫২২',
                                  eta: 4,
                                  fare: '৳ ২,৫০০',
                                });
                                notify('অ্যাম্বুলেন্স বুকিং ডেমো সফল হয়েছে!');
                              }}
                              className="flex-1 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>এখনই বুক করুন (ডেমো)</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Driver 2 */}
                      {(ambulanceFilter === 'all' || ambulanceFilter === 'ac') && (
                        <div className="p-3.5 bg-white border border-gray-200 rounded-2xl space-y-2 shadow-2xs">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                                <Truck className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-900">স্ট্যান্ডার্ড এসি অ্যাম্বুলেন্স</h4>
                                <p className="text-[10px] text-gray-500">চালক: মোঃ রফিক শিকদার • ৪.৮ ★ (৮৬ ট্রিপ)</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-gray-900">৳ ১,৫০০</span>
                              <span className="block text-[9.5px] text-blue-700 font-bold">৭ মিনিট দূর</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 text-[9.5px] text-gray-600">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">সিলিন্ডার ব্যাকআপ</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">স্ট্রেচার</span>
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded">ফার্স্ট এইড কিট</span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => notify('চালক মোঃ রফিকের নম্বরে ডেমো কল প্রেরণ হচ্ছে...')}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>ড্রাইভার কল</span>
                            </button>
                            <button
                              onClick={() => {
                                setBookedAmbulance({
                                  type: 'স্ট্যান্ডার্ড এসি অ্যাম্বুলেন্স',
                                  driver: 'মোঃ রফিক শিকদার',
                                  plate: 'ঢাকা মেট্রো-ছ ৬৩-৮৮১৯',
                                  eta: 7,
                                  fare: '৳ ১,৫০০',
                                });
                                notify('অ্যাম্বুলেন্স বুকিং ডেমো সফল হয়েছে!');
                              }}
                              className="flex-1 py-2 bg-gray-900 hover:bg-black active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <span>এখনই বুক করুন (ডেমো)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Active Booking Confirmation Card */
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                      <div className="flex items-center space-x-2 text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-xs font-bold">অ্যাম্বুলেন্স অন-ওয়ে (রওনা হয়েছে)</h4>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1.5 text-xs text-gray-800">
                        <div className="flex justify-between font-bold">
                          <span>{bookedAmbulance.type}</span>
                          <span className="text-emerald-700">{bookedAmbulance.fare}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">চালক: {bookedAmbulance.driver} ({bookedAmbulance.plate})</p>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="font-semibold text-gray-700">⏱️ পৌঁছানোর সময়: ৩:৪৫ মিনিট</span>
                          <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">OTP: ৮৪২৯</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => notify('চালকের সাথে যোগাযোগ সম্পন্ন')}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl"
                        >
                          চালকের সাথে কথা বলুন
                        </button>
                        <button
                          onClick={() => setBookedAmbulance(null)}
                          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl"
                        >
                          {l('বাতিল', 'Cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- 2. REALISTIC OXYGEN EXPRESS DEMO ---------------- */}
              {activeDemoFeature === 'oxygen' && (
                <div className="space-y-3.5">
                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl text-xs text-teal-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold">জরুরি অক্সিজেন হোম-ডেলিভারি ডেমো</p>
                      <p className="text-[10px] text-teal-700">অনুমোদিত ভেন্ডর • ফ্লোমিটার ও সেটআপ সহায়তা</p>
                    </div>
                    <span className="text-[9.5px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                      ২৪ ঘণ্টা রেডি
                    </span>
                  </div>

                  {!oxygenOrdered ? (
                    <div className="space-y-3">
                      {/* Cylinder Option 1 */}
                      <div
                        onClick={() => setSelectedOxygenCylinder('portable')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedOxygenCylinder === 'portable'
                            ? 'bg-teal-50/60 border-teal-500 shadow-2xs'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9.5px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                              পোর্টেবল কিট
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 mt-1">
                              ১.৪ কিউবিক মিটার মেডিকেল অক্সিজেন
                            </h4>
                            <p className="text-[10.5px] text-gray-500 mt-0.5">
                              হালকা ট্রলিসহ রোগী স্থানান্তরে বা জরুরি প্রাথমিক ব্যাকআপে উপযোগী
                            </p>
                          </div>
                          <span className="text-xs font-black text-gray-900">৳ ১,২০০</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600">
                          <span>⏱️ ব্যাকআপ: ৮-১০ ঘণ্টা (২লি/মি)</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">১০টি সিলিন্ডার প্রস্তুত</span>
                        </div>
                      </div>

                      {/* Cylinder Option 2 */}
                      <div
                        onClick={() => setSelectedOxygenCylinder('jumbo')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedOxygenCylinder === 'jumbo'
                            ? 'bg-teal-50/60 border-teal-500 shadow-2xs'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9.5px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                              বড় জাম্বো কিট
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 mt-1">
                              ২.০ কিউবিক মিটার হাসপাতাল গ্রেড অক্সিজেন
                            </h4>
                            <p className="text-[10.5px] text-gray-500 mt-0.5">
                              সারারাত একটানা অক্সিজেন সাপোর্টের জন্য পূর্ণাঙ্গ সিলিন্ডার
                            </p>
                          </div>
                          <span className="text-xs font-black text-gray-900">৳ ১,৮০০</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600">
                          <span>⏱️ ব্যাকআপ: ১৮-২৪ ঘণ্টা (২লি/মি)</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">৬টি সিলিন্ডার প্রস্তুত</span>
                        </div>
                      </div>

                      {/* Accessories / Technician Checkbox */}
                      <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 text-xs">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={needTechnician}
                            onChange={(e) => setNeedTechnician(e.target.checked)}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span className="font-semibold text-gray-800">
                            সেটআপের জন্য অভিজ্ঞ টেকনিশিয়ান প্রয়োজন (+৳ ৩০০)
                          </span>
                        </label>
                        <p className="text-[10px] text-gray-500 pl-5">
                          রেগুলেটর লাগানো ও রোগীর নাকে সঠিক ফ্লোমিটার সেট করার কাজে সহায়তা
                        </p>
                      </div>

                      {/* Bill Summary */}
                      <div className="bg-gray-100 p-3 rounded-xl flex items-center justify-between text-xs font-bold">
                        <span>মোট প্রাক্কলিত মূল্য:</span>
                        <span className="text-teal-900 text-sm">
                          ৳ {selectedOxygenCylinder === 'portable' ? 1200 + (needTechnician ? 300 : 0) : 1800 + (needTechnician ? 300 : 0)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setOxygenOrdered(true);
                          notify('অক্সিজেন সিলিন্ডার এক্সপ্রেস অর্ডার ডেমো সফল হয়েছে!');
                        }}
                        className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        জরুরি ডেলিভারি অর্ডার দিন (ডেমো)
                      </button>
                    </div>
                  ) : (
                    /* Order In-Transit Card */
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3 animate-in fade-in">
                      <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                        <span>অক্সিজেন ডেলিভারি রওনা হয়েছে!</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-teal-100 text-xs space-y-1 text-gray-800">
                        <p className="font-bold">ডেলিভারি রাইডার: মোঃ আমিনুল হক (বাইক ভ্যান)</p>
                        <p className="text-[11px] text-gray-600">ভেন্ডর: গ্রিন লাইফ অক্সিজেন সেন্টার, ধানমন্ডি</p>
                        <p className="text-[11px] font-bold text-teal-700">⏱️ আনুমানিক আগমন: ২২ মিনিট</p>
                      </div>

                      <button
                        onClick={() => setOxygenOrdered(false)}
                        className="w-full py-2 bg-teal-700 text-white font-bold text-xs rounded-xl"
                      >
                        নতুন ডেমো অর্ডার
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- 3. REALISTIC ICU & BED TRACKER DEMO ---------------- */}
              {activeDemoFeature === 'icu' && (
                <div className="space-y-3.5">
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-xs text-purple-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold">হাসপাতাল আইসিইউ ও ট্রমা বেড ট্র্যাকার</p>
                      <p className="text-[10px] text-purple-700">লাইভ প্রাপ্যতা উপাত্ত • এমার্জেন্সি ডেস্ক সংযোগ</p>
                    </div>
                    <span className="text-[9.5px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      সরাসরি সংযোগ
                    </span>
                  </div>

                  {!selectedHospitalForBed ? (
                    <div className="space-y-2.5">
                      {[
                        {
                          name: 'ঢাকা মেডিকেল কলেজ হাসপাতাল (DMCH)',
                          type: 'সরকারি • সেন্ট্রাল ট্রমা',
                          icu: '৩টি ফাঁকা',
                          ccu: '১টি ফাঁকা',
                          vent: '২টি ভেন্টিলেটর যুক্ত',
                          phone: '০২-৫৫১৬৫০৭',
                          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                        },
                        {
                          name: 'কুর্মিটোলা জেনারেল হাসপাতাল',
                          type: 'সরকারি জেনারেল উইং',
                          icu: '৫টি ফাঁকা',
                          ccu: '৩টি ফাঁকা',
                          vent: '৪টি ভেন্টিলেটর যুক্ত',
                          phone: '০২-৮৭৫৪০৭২',
                          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                        },
                        {
                          name: 'জাতীয় হৃদরোগ ইনস্টিটিউট ও হাসপাতাল (NICVD)',
                          type: 'কার্ডিয়াক স্পেশালাইজড',
                          icu: '১টি ফাঁকা',
                          ccu: '৩টি ফাঁকা',
                          vent: '১টি ভেন্টিলেটর যুক্ত',
                          phone: '০২-৯১২২৫৬১',
                          statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
                        },
                        {
                          name: 'শেখ হাসিনা জাতীয় বার্ন ইনস্টিটিউট',
                          type: 'বার্ন ও প্লাস্টিক ট্রমা',
                          icu: '৪টি ফাঁকা',
                          ccu: '২টি ফাঁকা',
                          vent: '৩টি ভেন্টিলেটর যুক্ত',
                          phone: '০২-২২৩৩৮৬০০০',
                          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                        },
                      ].map((hosp) => (
                        <div
                          key={hosp.name}
                          className="p-3.5 bg-white border border-gray-200 rounded-2xl space-y-2 shadow-2xs"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-gray-900">{hosp.name}</h4>
                              <p className="text-[10px] text-gray-500">{hosp.type}</p>
                            </div>
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded border ${hosp.statusColor}`}>
                              {hosp.icu}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-700">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">আইসিইউ: {hosp.icu}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded">সিসিইউ: {hosp.ccu}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{hosp.vent}</span>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => notify(`জরুরি রুম ${hosp.phone} এ ডেমো কল শুরু হচ্ছে...`)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-gray-600" />
                              <span>জরুরি রুম</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedHospitalForBed(hosp.name);
                                setBedHoldSuccess(false);
                              }}
                              className="flex-1 py-1.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              বেড হোল্ড ডেমো রিকোয়েস্ট
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Patient Triage Form simulation */
                    <div className="p-4 bg-white border border-purple-200 rounded-2xl space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{selectedHospitalForBed}</h4>
                          <p className="text-[10px] text-gray-500">জরুরি আইসিইউ ট্রায়াজ বেড আবেদন</p>
                        </div>
                        <button
                          onClick={() => setSelectedHospitalForBed(null)}
                          className="text-xs text-purple-600 font-bold"
                        >
                          পরিবর্তন
                        </button>
                      </div>

                      {!bedHoldSuccess ? (
                        <div className="space-y-2.5 text-xs">
                          <div>
                            <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                              রোগীর নাম:
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: মোঃ জহিরুল ইসলাম"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                                SpO2 অক্সিজেন লেভেল:
                              </label>
                              <input
                                type="text"
                                value={patientSpO2}
                                onChange={(e) => setPatientSpO2(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                                রোগীর অবস্থা:
                              </label>
                              <select className="w-full p-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-xs">
                                <option>সংকটাপন্ন / আইসিইউ প্রয়োজন</option>
                                <option>শ্বাসকষ্টজনিত</option>
                                <option>ট্রমা / সড়ক দুর্ঘটনা</option>
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setBedHoldSuccess(true);
                              notify('হাসপাতাল এমার্জেন্সি ডেস্কে জরুরি বেড রিজার্ভেশন ডেমো সফল!');
                            }}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs mt-1 cursor-pointer"
                          >
                            বেড আগাম রিজার্ভ করুন (ডেমো)
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                          <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>বেড আগাম রিজার্ভেশন সম্পন্ন!</span>
                          </div>
                          <p className="text-[11px] text-emerald-700">
                            হাসপাতাল ট্রমা টিমকে অবগত করা হয়েছে। রোগী হাসপাতালে পৌঁছানোর সাথে সাথেই আইসিইউ টিমে স্থানান্তরিত হবে।
                          </p>
                          <button
                            onClick={() => {
                              setSelectedHospitalForBed(null);
                              setBedHoldSuccess(false);
                            }}
                            className="w-full py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs"
                          >
                            তালিকা দেখুন
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="p-3 bg-white border-t border-gray-200 px-4 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-gray-500 font-medium">
                💡 মূল ভার্সনে রিয়েল-টাইম এপিআই ও সরাসরি পেমেন্ট সুবিধা থাকবে।
              </span>
              <button
                onClick={() => setActiveDemoFeature(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

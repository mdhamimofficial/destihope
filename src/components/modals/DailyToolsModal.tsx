import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  Droplet, 
  Scale, 
  GlassWater, 
  Compass, 
  Clock, 
  SunMedium, 
  PhoneCall, 
  FileText, 
  Copy, 
  Trash2, 
  Volume2, 
  VolumeX, 
  ArrowRightLeft, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  Share2, 
  Minus,
  Plus,
  HeartPulse,
  CalendarDays,
  Percent,
  Siren,
  CheckCircle2,
  Calendar,
  Languages,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DailyToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBloodRequest?: () => void;
  onOpenEmergencyHub?: () => void;
  onOpenTimerModal?: () => void;
  onOpenTranslateModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

type ToolId = 
  | 'blood_calc'
  | 'bmi_calc'
  | 'water_tracker'
  | 'tasbih'
  | 'prayer_times'
  | 'qibla'
  | 'torch'
  | 'siren'
  | 'hotlines'
  | 'scratchpad'
  | 'converter'
  | 'location_share'
  | 'first_aid'
  | 'bp_sugar'
  | 'age_calc'
  | 'discount_calc'
  | 'translator';

export const DailyToolsModal: React.FC<DailyToolsModalProps> = ({
  isOpen,
  onClose,
  onOpenTranslateModal,
  isDarkMode: propIsDarkMode,
  onToggleDarkMode,
}) => {
  const { l, isEn, language, toggleLanguage } = useLanguage();
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // App Theme state & toggle (Them পরিবর্তন)
  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(() => {
    return typeof propIsDarkMode === 'boolean'
      ? propIsDarkMode
      : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) ||
        localStorage.getItem('destihope_theme') === 'dark';
  });

  useEffect(() => {
    if (typeof propIsDarkMode === 'boolean') {
      setInternalDarkMode(propIsDarkMode);
    }
  }, [propIsDarkMode]);

  const handleToggleTheme = () => {
    const nextDark = !internalDarkMode;
    setInternalDarkMode(nextDark);

    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('destihope_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('destihope_theme', 'light');
      }
    }

    showToast(
      nextDark
        ? (language === 'en' ? 'Dark theme active' : 'ডার্ক থিম সক্রিয় হয়েছে')
        : (language === 'en' ? 'Light theme active' : 'লাইট থিম সক্রিয় হয়েছে')
    );
  };

  const handleToggleLanguage = () => {
    toggleLanguage();
    const nextLang = language === 'bn' ? 'en' : 'bn';
    showToast(nextLang === 'en' ? 'Language switched to English' : 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে');
  };
  
  // Tool 1: Blood Calculator State
  const [lastDonationDate, setLastDonationDate] = useState<string>('2026-07-01');
  const [donorGender, setDonorGender] = useState<'male' | 'female'>('male');

  // Tool 2: BMI State
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(7);

  // Tool 3: Water Tracker State
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const saved = localStorage.getItem('desti_daily_water');
    return saved ? parseInt(saved, 10) : 4;
  });

  // Tool 4: Tasbih State
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [tasbihDhikr, setTasbihDhikr] = useState<string>('সুবহানাল্লাহ (SubhanAllah)');

  // Tool 5: Flashlight State
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);
  const [isStrobeMode, setIsStrobeMode] = useState<boolean>(false);

  // Tool 6: Scratchpad State
  const [scratchText, setScratchText] = useState<string>(() => {
    return localStorage.getItem('desti_scratchpad') || '';
  });

  // Tool 7: Converter State
  const [convValue, setConvValue] = useState<number>(1);
  const [convType, setConvType] = useState<'bhori_gram' | 'kg_lb' | 'feet_meter' | 'c_f'>('bhori_gram');

  // Tool 8: Emergency Audio Siren
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Tool 9: BP & Sugar State
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [glucoseMmol, setGlucoseMmol] = useState<number>(5.5);

  // Tool 10: Age Calculator State
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');

  // Tool 11: Discount & VAT State
  const [originalPrice, setOriginalPrice] = useState<number>(1500);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [vatPercent, setVatPercent] = useState<number>(5);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    if (isOpen) {
      setActiveToolId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('desti_daily_water', waterGlasses.toString());
  }, [waterGlasses]);

  useEffect(() => {
    localStorage.setItem('desti_scratchpad', scratchText);
  }, [scratchText]);

  // Audio Siren
  const toggleSiren = () => {
    if (isSirenPlaying) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
      }
      setIsSirenPlaying(false);
      showToast(l('জরুরি সাইরেন বন্ধ করা হয়েছে', 'Emergency siren stopped'));
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        
        const now = ctx.currentTime;
        for (let i = 0; i < 40; i++) {
          osc.frequency.linearRampToValueAtTime(950, now + i * 0.8 + 0.4);
          osc.frequency.linearRampToValueAtTime(600, now + i * 0.8 + 0.8);
        }

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setIsSirenPlaying(true);
        showToast(l('জরুরি সাইরেন বাজছে!', 'Emergency siren active!'));
      } catch (e) {
        showToast(l('অডিও সাইরেন চালু করা যায়নি', 'Audio siren not supported'));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {}
      }
    };
  }, []);

  if (!isOpen) return null;

  // Blood Calculator Logic
  const calculateBloodEligibility = () => {
    const requiredDays = donorGender === 'male' ? 90 : 120;
    const lastDate = new Date(lastDonationDate);
    const nextEligible = new Date(lastDate);
    nextEligible.setDate(nextEligible.getDate() + requiredDays);

    const today = new Date();
    const diffTime = nextEligible.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isEligible = diffDays <= 0;

    return {
      nextDateStr: nextEligible.toLocaleDateString(isEn ? 'en-US' : 'bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      diffDays: Math.max(0, diffDays),
      isEligible
    };
  };

  const bloodResult = calculateBloodEligibility();

  // BMI Calculator Logic
  const calculateBMI = () => {
    const totalInches = (heightFeet * 12) + heightInches;
    const heightMeters = totalInches * 0.0254;
    if (heightMeters <= 0) return { bmi: 0, text: '-', color: 'text-gray-500' };

    const bmiVal = weightKg / (heightMeters * heightMeters);
    const rounded = parseFloat(bmiVal.toFixed(1));

    let text = isEn ? 'Normal Weight' : 'স্বাভাবিক স্বাস্থ্য';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (rounded < 18.5) {
      text = isEn ? 'Underweight' : 'কম ওজন';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (rounded >= 25 && rounded < 30) {
      text = isEn ? 'Overweight' : 'অতিরিক্ত ওজন';
      color = 'text-orange-700 bg-orange-50 border-orange-200';
    } else if (rounded >= 30) {
      text = isEn ? 'Obese' : 'স্থূলতা';
      color = 'text-red-700 bg-red-50 border-red-200';
    }

    return { bmi: rounded, text, color };
  };

  const bmiResult = calculateBMI();

  // Unit Converter
  const convertUnit = () => {
    switch (convType) {
      case 'bhori_gram':
        return `${convValue} ${isEn ? 'Bhori' : 'ভরি'} = ${(convValue * 11.664).toFixed(3)} ${isEn ? 'Grams' : 'গ্রাম'}`;
      case 'kg_lb':
        return `${convValue} ${isEn ? 'KG' : 'কেজি'} = ${(convValue * 2.20462).toFixed(2)} ${isEn ? 'Pound' : 'পাউন্ড'}`;
      case 'feet_meter':
        return `${convValue} ${isEn ? 'Feet' : 'ফুট'} = ${(convValue * 0.3048).toFixed(2)} ${isEn ? 'Meters' : 'মিটার'}`;
      case 'c_f':
        return `${convValue}°C = ${((convValue * 9) / 5 + 32).toFixed(1)}°F`;
    }
  };

  // BD Hotlines
  const BD_HOTLINES = [
    { number: '999', titleBn: 'জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)', titleEn: 'National Emergency 999', tag: 'ফ্রি' },
    { number: '109', titleBn: 'নারী ও শিশু নির্যাতন প্রতিরোধ সেল', titleEn: 'Women & Child Helpline', tag: 'টোল ফ্রি' },
    { number: '333', titleBn: 'জাতীয় তথ্য বাতায়ন ও সরকারি সেবা', titleEn: 'Government Services 333', tag: 'সার্বক্ষণিক' },
    { number: '16263', titleBn: 'স্বাস্থ্য বাতায়ন (২৪ ঘণ্টা ডাক্তার পরামর্শ)', titleEn: 'Health Helpline 16263', tag: 'স্বাস্থ্য' },
    { number: '1098', titleBn: 'চাইল্ড হেল্পলাইন (শিশু সহায়তা)', titleEn: 'Child Helpline 1098', tag: 'শিশু' },
    { number: '16430', titleBn: 'জাতীয় জরুরি রক্তদান সেবা', titleEn: 'National Blood Hotline', tag: 'রক্ত' },
  ];

  // Age Calculator
  const calculateAge = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), daysToBirthday };
  };

  const ageData = calculateAge();

  // BP Interpretation
  const getBPStatus = () => {
    if (systolic < 120 && diastolic < 80) {
      return { text: isEn ? 'Normal Blood Pressure' : 'স্বাভাবিক প্রেশার', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else if (systolic <= 129 && diastolic < 80) {
      return { text: isEn ? 'Elevated' : 'সামান্য বেশি', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else if (systolic <= 139 || diastolic <= 89) {
      return { text: isEn ? 'High BP (Stage 1)' : 'উচ্চ রক্তচাপ (স্টেজ ১)', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    } else {
      return { text: isEn ? 'High BP (Stage 2)' : 'উচ্চ রক্তচাপ (স্টেজ ২)', color: 'text-red-700 bg-red-50 border-red-200' };
    }
  };

  // Sugar Interpretation
  const getSugarStatus = () => {
    if (glucoseMmol < 4.0) {
      return { text: isEn ? 'Low (Hypoglycemia)' : 'কম সুগার (হাইপোগ্লাইসেমিয়া)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    } else if (glucoseMmol <= 5.9) {
      return { text: isEn ? 'Normal Fasting Sugar' : 'স্বাভাবিক খালি পেটে সুগার', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else if (glucoseMmol <= 6.9) {
      return { text: isEn ? 'Pre-Diabetes' : 'প্রি-ডায়াবেটিস ঝুঁকি', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    } else {
      return { text: isEn ? 'Diabetes Level' : 'ডায়াবেটিস মাত্রা', color: 'text-red-700 bg-red-50 border-red-200' };
    }
  };

  // Discount & VAT Calculation
  const discountSavings = (originalPrice * discountPercent) / 100;
  const discountedPrice = Math.max(0, originalPrice - discountSavings);
  const vatAmount = (discountedPrice * vatPercent) / 100;
  const finalPrice = Math.round(discountedPrice + vatAmount);

  // 16 Daily Essential Tools - Clean SVG icons exactly matching Quick Action row aesthetic
  const TOOLS_LIST = [
    {
      id: 'blood_calc' as ToolId,
      nameBn: 'রক্তদান হিসাব',
      nameEn: 'Blood Calculator',
      icon: Droplet,
    },
    {
      id: 'bmi_calc' as ToolId,
      nameBn: 'বিএমআই স্কেল',
      nameEn: 'BMI Scale',
      icon: Scale,
    },
    {
      id: 'water_tracker' as ToolId,
      nameBn: 'পানি ট্র্যাকার',
      nameEn: 'Water Tracker',
      icon: GlassWater,
    },
    {
      id: 'tasbih' as ToolId,
      nameBn: 'তাসবীহ জিকির',
      nameEn: 'Digital Tasbih',
      icon: Sparkles,
    },
    {
      id: 'prayer_times' as ToolId,
      nameBn: 'নামাজের সময়',
      nameEn: 'Prayer Times',
      icon: Clock,
    },
    {
      id: 'qibla' as ToolId,
      nameBn: 'কিবলা কম্পাস',
      nameEn: 'Qibla Compass',
      icon: Compass,
    },
    {
      id: 'torch' as ToolId,
      nameBn: 'স্ক্রিন টর্চ',
      nameEn: 'Flashlight',
      icon: SunMedium,
      isActive: isFlashlightOn,
    },
    {
      id: 'siren' as ToolId,
      nameBn: 'জরুরি সাইরেন',
      nameEn: 'SOS Siren',
      icon: isSirenPlaying ? VolumeX : Siren,
      isActive: isSirenPlaying,
    },
    {
      id: 'hotlines' as ToolId,
      nameBn: 'হটলাইন ৯৯৯',
      nameEn: 'Hotline 999',
      icon: PhoneCall,
    },
    {
      id: 'scratchpad' as ToolId,
      nameBn: 'কুইক নোটবুক',
      nameEn: 'Quick Notes',
      icon: FileText,
    },
    {
      id: 'converter' as ToolId,
      nameBn: 'কনভার্টার',
      nameEn: 'Unit Converter',
      icon: ArrowRightLeft,
    },
    {
      id: 'location_share' as ToolId,
      nameBn: 'লোকেশন শেয়ার',
      nameEn: 'Share Location',
      icon: MapPin,
    },
    {
      id: 'first_aid' as ToolId,
      nameBn: 'ফার্স্ট এইড',
      nameEn: 'First Aid Guide',
      icon: ShieldAlert,
    },
    {
      id: 'bp_sugar' as ToolId,
      nameBn: 'প্রেসার ও সুগার',
      nameEn: 'BP & Glucose',
      icon: HeartPulse,
    },
    {
      id: 'age_calc' as ToolId,
      nameBn: 'বয়স ক্যালকুলেটর',
      nameEn: 'Age Calculator',
      icon: CalendarDays,
    },
    {
      id: 'discount_calc' as ToolId,
      nameBn: 'ডিসকাউন্ট ও ভ্যাট',
      nameEn: 'Discount & VAT',
      icon: Percent,
    },
    {
      id: 'translator' as ToolId,
      nameBn: 'অনুবাদ ও ভোকাবুলারি',
      nameEn: 'Translate & Vocab',
      icon: Languages,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 w-full h-[100dvh] overflow-hidden select-none animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Screen Torchlight Fullscreen Overlay */}
      {isFlashlightOn && (
        <div 
          onClick={() => setIsFlashlightOn(false)}
          className={`fixed inset-0 z-70 flex flex-col items-center justify-between p-8 cursor-pointer ${
            isStrobeMode 
              ? 'bg-white text-black animate-pulse' 
              : 'bg-white text-black'
          }`}
        >
          <div className="text-center pt-8">
            <SunMedium className="w-16 h-16 mx-auto mb-3 text-amber-500 animate-spin-slow" />
            <h1 className="text-2xl font-black tracking-tight">
              {isEn ? 'Desti Emergency Screen Flashlight' : 'ডেস্টি স্ক্রিন টর্চলাইট'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isEn ? 'Screen at maximum white brightness. Tap anywhere to close.' : 'স্ক্রিন সম্পূর্ণ আলো দিচ্ছে। যেকোনো জায়গায় ট্যাপ করলে বন্ধ হবে।'}
            </p>
          </div>

          <div className="flex gap-3 pb-8" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsStrobeMode((p) => !p)}
              className={`px-5 py-2.5 rounded-full text-xs font-black shadow-lg border cursor-pointer transition-all ${
                isStrobeMode ? 'bg-red-600 text-white border-red-700 animate-bounce' : 'bg-gray-200 text-gray-900 border-gray-400'
              }`}
            >
              {isStrobeMode ? (isEn ? 'SOS STROBE ACTIVE' : 'এসওএস ফ্ল্যাশ সক্রিয়') : (isEn ? 'Turn On SOS Strobe' : 'এসওএস ব্লিঙ্ক চালু')}
            </button>
            <button
              onClick={() => setIsFlashlightOn(false)}
              className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold shadow-lg"
            >
              {isEn ? 'Exit Torch' : 'টর্চ বন্ধ করুন'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL HEADER */}
      <header className="px-4 sm:px-5 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          {activeToolId ? (
            <button
              onClick={() => setActiveToolId(null)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-all cursor-pointer shadow-2xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60"
              title={l('সব টুলসে ফিরুন', 'Back to all tools')}
              aria-label={l('সব টুলসে ফিরুন', 'Back to all tools')}
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.4]" />
            </button>
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gray-900 dark:bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-xs border border-gray-800 dark:border-gray-700">
              {/* 4-squares Grid Icon matching Quick Action row */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-base font-extrabold tracking-tight text-gray-950 dark:text-white leading-tight truncate">
              {activeToolId 
                ? (isEn 
                    ? TOOLS_LIST.find(t => t.id === activeToolId)?.nameEn 
                    : TOOLS_LIST.find(t => t.id === activeToolId)?.nameBn)
                : l('নিত্য প্রয়োজনীয় টুলস', 'Daily Essential Tools')
              }
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 truncate">
              {activeToolId 
                ? l('সহজে পরিচালনা করুন', 'Quick Action Utility')
                : l('প্রয়োজনীয় সকল টুলস একনজরে (নামসহ আইকন)', 'All essential utilities with clear names')
              }
            </p>
          </div>
        </div>

        {/* Header Right Actions: Them (Theme) + Language Change (Globe Icon) + Cancel Icon (All 3 comfortably touchable) */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* 1. Theme Change Icon (Them / অ্যাপসের থিম পরিবর্তন) */}
          <button
            id="btn-daily-tools-theme-toggle"
            onClick={handleToggleTheme}
            title={internalDarkMode 
              ? l('লাইট থিম চালু করুন (বর্তমানে ডার্ক মোড)', 'Switch to Light Theme (Currently Dark)') 
              : l('ডার্ক থিম চালু করুন (বর্তমানে লাইট মোড)', 'Switch to Dark Theme (Currently Light)')}
            className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-700 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60 select-none group"
            aria-label={l('অ্যাপসের থিম পরিবর্তন', 'Toggle App Theme')}
          >
            {internalDarkMode ? (
              <Sun className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.2] text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
            ) : (
              <Moon className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.2] text-indigo-600 group-hover:-rotate-12 transition-transform duration-200" />
            )}
          </button>

          {/* 2. Language Change Icon (Globe Icon / অ্যাপসের ভাষা পরিবর্তন) */}
          <button
            id="btn-daily-tools-language-toggle"
            onClick={handleToggleLanguage}
            title={l('ভাষা পরিবর্তন করুন (বাংলা ⇄ English)', 'Switch Language (Bangla ⇄ English)')}
            className="relative w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60 select-none group"
            aria-label={l('ভাষা পরিবর্তন (বাংলা / English)', 'Language Switcher (Bangla / English)')}
          >
            <Globe className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.2] text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-0.5 -right-0.5 text-[8.5px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded-full uppercase leading-none shadow-xs border border-white dark:border-gray-900">
              {language === 'bn' ? 'বাং' : 'EN'}
            </span>
          </button>

          {/* 3. Cancel / Close Icon (Cancel icone / সহজে ক্রস করার জন্য) */}
          <button
            id="btn-daily-tools-close"
            onClick={onClose}
            className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-red-50 active:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-950/60 dark:active:bg-red-900/80 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60 select-none group"
            title={l('বন্ধ করুন', 'Close')}
            aria-label={l('বন্ধ করুন', 'Close')}
          >
            <X className="w-6 h-6 stroke-[2.5] text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:rotate-90 transition-transform duration-150" />
          </button>
        </div>
      </header>

      {/* BODY: CLEAN QUICK ACTION ICONS GRID OR ACTIVE FOCUSED VIEW */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">

          {/* ================= 1. CLEAN QUICK ACTION SVG ICONS GRID ================= */}
          {!activeToolId && (
            <div className="space-y-4">
              {/* Clean 4-Column Icon Grid - Just like Quick Action Row (SVG Icon + Clean Name) */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {TOOLS_LIST.map((tool) => {
                  const Icon = tool.icon;
                  const label = isEn ? tool.nameEn : tool.nameBn;

                  return (
                    <button
                      key={tool.id}
                      id={`btn-daily-tool-${tool.id}`}
                      onClick={() => {
                        if (tool.id === 'translator') {
                          onClose();
                          if (onOpenTranslateModal) onOpenTranslateModal();
                          return;
                        }
                        if (tool.id === 'torch') {
                          setIsFlashlightOn(true);
                          return;
                        }
                        if (tool.id === 'siren') {
                          toggleSiren();
                          return;
                        }
                        setActiveToolId(tool.id);
                      }}
                      className="group flex flex-col items-center justify-start p-1 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer text-center"
                    >
                      {/* Clean SVG Icon Container matching Quick Action Row aesthetic */}
                      <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 border shadow-2xs ${
                        tool.isActive 
                          ? 'bg-red-500 text-white border-red-600 ring-2 ring-red-300' 
                          : 'bg-gray-50/90 group-hover:bg-white text-gray-900 group-hover:text-[#E53935] border-gray-200/90 group-hover:border-[#E53935]'
                      }`}>
                        <Icon className="w-6 h-6 stroke-[2] transition-colors" />
                      </div>

                      {/* Tool Name Directly Below (Clear & Legible) */}
                      <span className="text-[11px] font-bold text-gray-800 text-center leading-tight mt-1.5 w-full line-clamp-2 group-hover:text-[#E53935] transition-colors">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Quick Call Hotline Bar */}
              <div className="bg-red-50/70 border border-red-100 rounded-2xl p-3 flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
                    999
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-gray-950 leading-tight truncate">
                      {l('জাতীয় জরুরি সেবা ৯৯৯', 'National Emergency 999')}
                    </h4>
                    <p className="text-[10.5px] text-gray-500 font-medium truncate">
                      {l('পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সরাসরি কল', 'Direct call police & ambulance')}
                    </p>
                  </div>
                </div>

                <a
                  href="tel:999"
                  className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs active:scale-95 transition-all ml-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{l('কল', 'Call')}</span>
                </a>
              </div>
            </div>
          )}

          {/* ================= 2. ACTIVE FOCUSED TOOL: BLOOD CALCULATOR ================= */}
          {activeToolId === 'blood_calc' && (
            <div className="bg-white border border-red-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 fill-red-600 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('রক্তদানের পরবর্তী তারিখ হিসাব', 'Next Blood Donation Calculator')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('পুরুষদের ৯০ দিন ও নারীদের ১২০ দিন পর পর রক্তদান নিরাপদ', 'Safe interval: 90 days for men, 120 days for women')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('শেষ রক্তদানের তারিখ', 'Last Donation Date')}
                  </label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('লিঙ্গ (Gender)', 'Gender')}
                  </label>
                  <select
                    value={donorGender}
                    onChange={(e) => setDonorGender(e.target.value as 'male' | 'female')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-red-500"
                  >
                    <option value="male">{l('পুরুষ (প্রতি ৯০ দিন পর)', 'Male (90 days)')}</option>
                    <option value="female">{l('নারী (প্রতি ১২০ দিন পর)', 'Female (120 days)')}</option>
                  </select>
                </div>
              </div>

              <div className="bg-red-50/60 border border-red-150 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">
                    {l('পরবর্তী সম্ভাব্য রক্তদানের দিন', 'Next Eligible Date')}
                  </span>
                  <span className="text-sm font-black text-gray-950 block mt-0.5">
                    {bloodResult.nextDateStr}
                  </span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  bloodResult.isEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bloodResult.isEligible ? l('আজই রক্ত দিতে প্রস্তুত!', 'Ready Today!') : `${bloodResult.diffDays} দিন বাকি`}
                </span>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 3. ACTIVE FOCUSED TOOL: BMI CALCULATOR ================= */}
          {activeToolId === 'bmi_calc' && (
            <div className="bg-white border border-emerald-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('বিএমআই ও আদর্শ ওজন ক্যালকুলেটর', 'BMI & Health Calculator')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('উচ্চতা ও ওজনের সঠিক স্বাস্থ্যকর অনুপাত মাপুন', 'Check your Body Mass Index')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('ওজন (কেজি)', 'Weight (kg)')}
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('উচ্চতা (ফুট)', 'Height (ft)')}
                  </label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 font-bold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('ইঞ্চি (in)', 'Inches (in)')}
                  </label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Math.max(0, Math.min(11, Number(e.target.value))))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 font-bold outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-150 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-950">
                    {bmiResult.bmi}
                  </span>
                  <span className="text-xs text-gray-400 font-bold ml-1">BMI</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${bmiResult.color}`}>
                  {bmiResult.text}
                </span>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 4. ACTIVE FOCUSED TOOL: WATER TRACKER ================= */}
          {activeToolId === 'water_tracker' && (
            <div className="bg-white border border-blue-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <GlassWater className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-gray-950 leading-tight">
                      {l('দৈনিক পানি পানের ট্র্যাকার', 'Daily Water Tracker')}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {l('দৈনিক লক্ষ্য: ৮ গ্লাস (২ লিটার)', 'Goal: 8 Glasses Everyday')}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-blue-600">
                  {waterGlasses} / 8 {l('গ্লাস', 'Gl.')}
                </span>
              </div>

              <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <button
                  onClick={() => setWaterGlasses((p) => Math.max(0, p - 1))}
                  className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-lg active:scale-95 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-3xl font-black text-gray-950">
                  {waterGlasses}
                </span>
                <button
                  onClick={() => {
                    const next = waterGlasses + 1;
                    setWaterGlasses(next);
                    if (next === 8) showToast(l('আজকের ৮ গ্লাস পানির লক্ষ্য পূর্ণ হয়েছে!', '8 glasses goal completed!'));
                  }}
                  className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-xs active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 5. ACTIVE FOCUSED TOOL: TASBIH ================= */}
          {activeToolId === 'tasbih' && (
            <div className="bg-white border border-amber-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-gray-950 leading-tight">
                      {l('ডিজিটাল তাসবীহ ও জিকির', 'Digital Tasbih Counter')}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {tasbihDhikr}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[33, 100].map(t => (
                    <button
                      key={t}
                      onClick={() => setTasbihTarget(t)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer ${
                        tasbihTarget === t ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <button
                  onClick={() => {
                    const next = tasbihCount + 1;
                    setTasbihCount(next);
                    if (navigator.vibrate) navigator.vibrate(30);
                    if (next % tasbihTarget === 0) {
                      showToast(l(`মাশাআল্লাহ! ${tasbihTarget} বার পূর্ণ হয়েছে!`, `MashaAllah! ${tasbihTarget} completed!`));
                    }
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer border-4 border-amber-200 select-none"
                >
                  <span className="text-3xl font-black">{tasbihCount}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-85 mt-0.5">
                    {l('ট্যাপ করুন', 'TAP')}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <select
                  value={tasbihDhikr}
                  onChange={(e) => setTasbihDhikr(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-medium max-w-[200px] truncate"
                >
                  <option value="সুবহানাল্লাহ (SubhanAllah)">সুবহানাল্লাহ (SubhanAllah)</option>
                  <option value="আলহামদুলিল্লাহ (Alhamdulillah)">আলহামদুলিল্লাহ (Alhamdulillah)</option>
                  <option value="আল্লাহু আকবার (Allahu Akbar)">আল্লাহু আকবার (Allahu Akbar)</option>
                  <option value="আস্তাগফিরুল্লাহ (Astaghfirullah)">আস্তাগফিরুল্লাহ (Astaghfirullah)</option>
                </select>

                <button
                  onClick={() => setTasbihCount(0)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
                >
                  {l('রিসেট', 'Reset')}
                </button>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer mt-1"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 6. ACTIVE FOCUSED TOOL: PRAYER & QIBLA ================= */}
          {(activeToolId === 'prayer_times' || activeToolId === 'qibla') && (
            <div className="bg-white border border-indigo-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('নামাজের সময়সূচি ও কিবলা কম্পাস', 'Prayer Schedule & Qibla Direction')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('বাংলাদেশ সময় ও কিবলা দিকনির্দেশনা (~২৬২° পশ্চিম-উত্তর-পশ্চিম)', 'Bangladesh time (~262° WNW)')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                {[
                  { name: 'ফজর', time: '৪:৩৫ AM' },
                  { name: 'যোহর', time: '১১:৫৮ AM' },
                  { name: 'আসর', time: '৪:১৫ PM' },
                  { name: 'মাগরিব', time: '৫:৫২ PM' },
                  { name: 'ইশা', time: '৭:০৮ PM' },
                ].map((w) => (
                  <div key={w.name} className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                    <span className="text-[10px] text-indigo-700 font-bold block">{w.name}</span>
                    <span className="text-[11px] font-black text-gray-950 block mt-0.5">{w.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50 border border-teal-150 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Compass className="w-5 h-5 text-teal-600 animate-spin-slow" />
                  <span className="text-xs font-black text-teal-900">
                    {l('কিবলা দিক: ২৬২° (পশ্চিম থেকে সামান্য উত্তর)', 'Qibla: 262° (West-Northwest)')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 7. ACTIVE FOCUSED TOOL: HOTLINES ================= */}
          {activeToolId === 'hotlines' && (
            <div className="bg-white border border-red-150 rounded-3xl p-4 shadow-2xs space-y-3 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('জাতীয় জরুরি হটলাইন ডিরেক্টরি', 'National Emergency BD Hotlines')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('এক ক্লিকে সরাসরি ডায়াল করুন', 'Tap to direct call emergency hotlines')}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto no-scrollbar">
                {BD_HOTLINES.map((h) => (
                  <div key={h.number} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm text-red-600">{h.number}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-50 text-red-600">{h.tag}</span>
                      </div>
                      <span className="text-xs text-gray-800 font-medium block truncate max-w-[210px] mt-0.5">
                        {isEn ? h.titleEn : h.titleBn}
                      </span>
                    </div>

                    <a
                      href={`tel:${h.number}`}
                      className="px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{l('কল', 'Call')}</span>
                    </a>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer mt-1"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 8. ACTIVE FOCUSED TOOL: SCRATCHPAD ================= */}
          {activeToolId === 'scratchpad' && (
            <div className="bg-white border border-cyan-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-gray-950 leading-tight">
                      {l('দ্রুত স্ক্র্যাচপ্যাড নোটবুক', 'Quick Scratchpad Notes')}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {l('ঝটপট নম্বর বা লেখা লিখে রাখুন (অটো সেভ)', 'Instant scratchpad (Auto-saved)')}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(scratchText);
                      showToast(l('কপি হয়েছে!', 'Copied!'));
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-800 cursor-pointer"
                    title="কপি"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setScratchText('');
                      showToast(l('মুছে ফেলা হয়েছে', 'Cleared'));
                    }}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-600 cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={scratchText}
                onChange={(e) => setScratchText(e.target.value)}
                placeholder={l('এখানে প্রয়োজনীয় যেকোনো নোট বা নম্বর লিখুন...', 'Type quick notes or numbers here...')}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-800 outline-none focus:border-cyan-500 font-medium resize-none"
              />

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 9. ACTIVE FOCUSED TOOL: CONVERTER ================= */}
          {activeToolId === 'converter' && (
            <div className="bg-white border border-purple-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <ArrowRightLeft className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('নিত্যদিনের রূপান্তরকারী (Unit Converter)', 'Everyday Unit Converter')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('ভরি, কেজি, ফুট, সেলসিয়াসের সহজ রূপান্তর', 'Convert gold bhori, weight, length')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('পরিমাণ', 'Value')}
                  </label>
                  <input
                    type="number"
                    value={convValue}
                    onChange={(e) => setConvValue(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('রূপান্তর ধরন', 'Type')}
                  </label>
                  <select
                    value={convType}
                    onChange={(e) => setConvType(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium outline-none focus:border-purple-500"
                  >
                    <option value="bhori_gram">{l('স্বর্ণ: ভরি ⇄ গ্রাম', 'Gold: Bhori ⇄ Gram')}</option>
                    <option value="kg_lb">{l('ওজন: কেজি ⇄ পাউন্ড', 'Weight: KG ⇄ Pound')}</option>
                    <option value="feet_meter">{l('দৈর্ঘ্য: ফুট ⇄ মিটার', 'Length: Feet ⇄ Meter')}</option>
                    <option value="c_f">{l('তাপমাত্রা: °C ⇄ °F', 'Temp: °C ⇄ °F')}</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-150 rounded-2xl text-center font-black text-purple-800 text-sm">
                {convertUnit()}
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 10. ACTIVE FOCUSED TOOL: LOCATION SHARE ================= */}
          {activeToolId === 'location_share' && (
            <div className="bg-white border border-emerald-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('লাইভ জিপিএস লোকেশন শেয়ার', 'Live GPS Location Sharing')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('জরুরি প্রয়োজনে পরিবারের সাথে সঠিক অবস্থান শেয়ার করুন', 'Share your exact map coordinates')}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-150 text-xs space-y-2.5">
                <p className="font-bold text-emerald-950">
                  📍 {l('ঢাকা, বাংলাদেশ (জিপিএস কোঅর্ডিনেট লিঙ্ক)', 'Dhaka, Bangladesh (GPS Link Ready)')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
                            navigator.clipboard.writeText(url);
                            showToast(l('ম্যাপ লোকেশন লিঙ্ক কপি হয়েছে!', 'Map link copied!'));
                          },
                          () => {
                            navigator.clipboard.writeText('https://maps.google.com/?q=23.8103,90.4125');
                            showToast(l('ঢাকা লোকেশন লিঙ্ক কপি হয়েছে!', 'Dhaka map link copied!'));
                          }
                        );
                      }
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{l('লিঙ্ক কপি করুন', 'Copy Link')}</span>
                  </button>
                  <a
                    href="sms:999?body=Emergency! I need help at: https://maps.google.com/?q=23.8103,90.4125"
                    className="flex-1 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{l('এসএমএস পাঠান', 'Send SMS')}</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 11. ACTIVE FOCUSED TOOL: FIRST AID ================= */}
          {activeToolId === 'first_aid' && (
            <div className="bg-white border border-orange-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('জরুরি প্রাথমিক চিকিৎসা (First Aid Guide)', 'Emergency First Aid Guide')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('রক্তক্ষরণ, পোড়া ও সাপের কামড়ের তাৎক্ষণিক করণীয়', 'Quick emergency first-aid protocols')}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-150">
                  <span className="font-black text-rose-800 block">🩸 রক্তক্ষরণ হলে:</span>
                  <span className="text-gray-700 text-xs block mt-0.5 font-medium leading-relaxed">পরিষ্কার কাপড় দিয়ে শক্ত করে ক্ষতস্থান চেপে ধরে রাখুন ও হৃৎপিণ্ডের উঁচুতে তুলুন।</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-150">
                  <span className="font-black text-amber-800 block">🔥 শরীর পুড়ে গেলে:</span>
                  <span className="text-gray-700 text-xs block mt-0.5 font-medium leading-relaxed">অন্তত ১০-১৫ মিনিট নরমাল ঠাণ্ডা পানির ধারা ঢালুন (বরফ দেওয়া যাবে না)।</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-150">
                  <span className="font-black text-emerald-800 block">🐍 সাপে কাটলে:</span>
                  <span className="text-gray-700 text-xs block mt-0.5 font-medium leading-relaxed">রোগীকে একদম স্থির রাখুন, রক্ত চলাচলে বাধা দেবেন না, দ্রুত নিকটস্থ হাসপাতালে নিন।</span>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 12. ACTIVE FOCUSED TOOL: BP & SUGAR ================= */}
          {activeToolId === 'bp_sugar' && (
            <div className="bg-white border border-rose-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('ব্লাড প্রেশার ও ব্লাড সুগার রেকর্ড', 'Blood Pressure & Glucose Monitor')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('স্বাভাবিক রেফারেন্স রেঞ্জ ও স্বাস্থ্য সতর্কতা', 'Check systolic/diastolic & sugar levels')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-150 space-y-2">
                  <span className="font-black text-gray-800 block">
                    {l('রক্তচাপ (Blood Pressure - mmHg)', 'Blood Pressure (mmHg)')}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-500 font-bold block mb-1">
                        {l('সিস্টোলিক (উপরের)', 'Systolic (Top)')}
                      </label>
                      <input
                        type="number"
                        value={systolic}
                        onChange={(e) => setSystolic(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-500 font-bold block mb-1">
                        {l('ডায়াস্টোলিক (নিচের)', 'Diastolic (Bottom)')}
                      </label>
                      <input
                        type="number"
                        value={diastolic}
                        onChange={(e) => setDiastolic(Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl border text-xs font-bold text-center ${getBPStatus().color}`}>
                    {systolic}/{diastolic} mmHg — {getBPStatus().text}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-150 space-y-2">
                  <span className="font-black text-gray-800 block">
                    {l('ব্লাড সুগার (Fasting Glucose - mmol/L)', 'Fasting Blood Glucose (mmol/L)')}
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    value={glucoseMmol}
                    onChange={(e) => setGlucoseMmol(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-rose-500"
                  />
                  <div className={`p-2 rounded-xl border text-xs font-bold text-center ${getSugarStatus().color}`}>
                    {glucoseMmol} mmol/L — {getSugarStatus().text}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 13. ACTIVE FOCUSED TOOL: AGE CALCULATOR ================= */}
          {activeToolId === 'age_calc' && (
            <div className="bg-white border border-blue-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('বয়স ও জন্মদিন ক্যালকুলেটর', 'Exact Age & Birthday Calculator')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('বছর, মাস ও দিনের নিখুঁত হিসাব', 'Exact years, months and days')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    {l('জন্ম তারিখ সিলেক্ট করুন', 'Select Date of Birth')}
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-blue-50/70 border border-blue-150 rounded-2xl">
                    <span className="text-2xl font-black text-blue-700 block">{ageData.years}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{l('বছর', 'Years')}</span>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-150 rounded-2xl">
                    <span className="text-2xl font-black text-blue-700 block">{ageData.months}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{l('মাস', 'Months')}</span>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-150 rounded-2xl">
                    <span className="text-2xl font-black text-blue-700 block">{ageData.days}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{l('দিন', 'Days')}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-150 rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    🎂 {l('পরবর্তী জন্মদিনের আর বাকি:', 'Days until next birthday:')}
                  </span>
                  <span className="text-sm font-black text-amber-700">
                    {ageData.daysToBirthday} {l('দিন', 'Days')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          {/* ================= 14. ACTIVE FOCUSED TOOL: DISCOUNT & VAT ================= */}
          {activeToolId === 'discount_calc' && (
            <div className="bg-white border border-amber-150 rounded-3xl p-4 shadow-2xs space-y-3.5 animate-in fade-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Percent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-950 leading-tight">
                    {l('ডিসকাউন্ট ও ভ্যাট ক্যালকুলেটর', 'Discount & VAT Calculator')}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {l('কেনাকাটায় ছাড় ও ভ্যাটসহ চূড়ান্ত মূল্য বের করুন', 'Calculate final price with discount and VAT')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    {l('আসল দাম (টাকা)', 'Original (৳)')}
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    {l('ডিসকাউন্ট (%)', 'Discount %')}
                  </label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">
                    {l('ভ্যাট (%)', 'VAT %')}
                  </label>
                  <input
                    type="number"
                    value={vatPercent}
                    onChange={(e) => setVatPercent(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-150 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{l('আপনার সাশ্রয়:', 'You save:')}</span>
                  <span className="font-bold text-emerald-700">৳ {discountSavings.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{l('ভ্যাট পরিমাণ:', 'VAT added:')}</span>
                  <span className="font-bold text-amber-800">৳ {vatAmount.toFixed(1)}</span>
                </div>
                <div className="border-t border-amber-200 pt-1.5 flex justify-between items-center">
                  <span className="font-black text-gray-900">{l('চূড়ান্ত পরিশোধযোগ্য মূল্য:', 'Final Payable:')}</span>
                  <span className="text-lg font-black text-[#E53935]">৳ {finalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveToolId(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
              >
                ← {l('সব টুলসে ফিরুন', 'Back to All Tools')}
              </button>
            </div>
          )}

          <div className="h-2" />
        </div>
    </div>
  );
};

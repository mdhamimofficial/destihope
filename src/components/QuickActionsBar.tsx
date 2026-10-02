import React from 'react';
import { Sparkles, Siren, AlarmClock, FileText, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface QuickActionsBarProps {
  onAiClick?: () => void;
  onLocationClick: () => void;
  onEmergencyCallClick: () => void;
  onTimerClick: () => void;
  onReportsClick: () => void;
  onTranslateClick?: () => void;
  onLanguageToggle: () => void;
  onModuleGridClick: () => void;
  currentLanguage: 'bn' | 'en';
}

// 4-rounded-squares "More / Grid" icon matching user's exact Screenshot_20260918-010455.png
export const MoreGridIcon: React.FC<{ className?: string; size?: number; strokeWidth?: number }> = ({
  className = "w-6 h-6",
  size = 24,
  strokeWidth = 2.2,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAiClick,
  onLocationClick,
  onEmergencyCallClick,
  onTimerClick,
  onReportsClick,
  onTranslateClick,
  onLanguageToggle,
  onModuleGridClick,
  currentLanguage,
}) => {
  const { l, language } = useLanguage();

  return (
    <div className="bg-white px-4 py-2.5 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 1. Desti AI */}
        <button
          id="btn-quick-ai"
          onClick={onAiClick || onLocationClick}
          title={l('Desti AI (স্মার্ট কৃত্রিম বুদ্ধিমত্তা সহকারী)', 'Desti AI (Smart Artificial Intelligence Assistant)')}
          className="p-2 text-gray-900 hover:text-purple-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label={l('Desti AI সহকারী', 'Desti AI Assistant')}
        >
          <Sparkles className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 2. Desti Emergency Hub (Siren) */}
        <button
          id="btn-quick-emergency-call"
          onClick={onEmergencyCallClick}
          title={l('Desti Emergency Hub (জরুরি হটলাইন, প্রাথমিক চিকিৎসা ও দুর্যোগ সহায়তা)', 'Desti Emergency Hub (Emergency Hotlines, First Aid & Disaster Support)')}
          className="p-2 text-gray-900 hover:text-[#E53935] transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label={l('জরুরি সেবা', 'Emergency Hub')}
        >
          <Siren className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 3. Desti Clock - Smart Alarm & Focus Countdown */}
        <button
          id="btn-quick-timers"
          onClick={onTimerClick}
          title={l('Desti Clock (স্মার্ট অ্যালার্ম ও ফোকাস কাউন্টডাউন)', 'Desti Clock (Smart Alarms & Focus Countdown)')}
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label={l('স্মার্ট অ্যালার্ম ও ঘড়ি', 'Smart Alarms & Clock')}
        >
          <AlarmClock className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 4. Desti Notes - Quick Note Taking */}
        <button
          id="btn-quick-reports"
          onClick={onReportsClick}
          title={l('Desti Notes (যেকোনো কিছু সহজে নোট করুন)', 'Desti Notes (Capture notes easily)')}
          className="p-2 text-gray-900 hover:text-teal-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label={l('দ্রুত নোটবুক', 'Quick Notes')}
        >
          <FileText className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 5. Desti Translate & Vocabulary (বাংলা ⇄ English ও বহুভাষিক অনুবাদ এবং ভোকাবুলারি) */}
        <button
          id="btn-quick-translate"
          onClick={onTranslateClick}
          title={l('Desti Translate (বাংলা ⇄ ইংরেজি ও অন্যান্য ভাষায় অনুবাদ এবং ভোকাবুলারি)', 'Desti Translate (Bangla ⇄ English Multilingual Translator & Vocabulary)')}
          className="p-2 text-gray-900 hover:text-blue-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center group"
          aria-label={l('অনুবাদ ও ভোকাবুলারি', 'Translator & Vocabulary')}
        >
          <Languages className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 6. More / Daily Tools Icon (নিত্য প্রয়োজনীয় টুলস) matching exact Screenshot */}
        <button
          id="btn-quick-modules"
          onClick={onModuleGridClick}
          title={l('নিত্য প্রয়োজনীয় টুলস (রক্তদান ক্যালকুলেটর, বিএমআই, পানি ট্র্যাকার, হটলাইন, তাসবীহ)', 'Daily Essential Tools (Blood Calculator, BMI, Water, Hotlines, Tasbih)')}
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label={l('নিত্য প্রয়োজনীয় টুলস', 'Daily Essential Tools')}
        >
          <MoreGridIcon className="w-6 h-6 stroke-[2.2] text-gray-900 hover:text-red-600 transition-colors" />
        </button>
      </div>
    </div>
  );
};

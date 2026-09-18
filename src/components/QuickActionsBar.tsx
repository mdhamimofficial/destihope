import React from 'react';
import { MapPin, PhoneCall, Timer, FileText, Languages, LayoutGrid } from 'lucide-react';

interface QuickActionsBarProps {
  onLocationClick: () => void;
  onEmergencyCallClick: () => void;
  onTimerClick: () => void;
  onReportsClick: () => void;
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
  onLocationClick,
  onEmergencyCallClick,
  onTimerClick,
  onReportsClick,
  onLanguageToggle,
  onModuleGridClick,
  currentLanguage,
}) => {
  return (
    <div className="bg-white px-4 py-2.5 border-b border-gray-100">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* 1. Location Pin */}
        <button
          id="btn-quick-location"
          onClick={onLocationClick}
          title="কাছাকাছি অবস্থান ও সন্ধান"
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="Location services"
        >
          <MapPin className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 2. Emergency Hotline Phone */}
        <button
          id="btn-quick-emergency-call"
          onClick={onEmergencyCallClick}
          title="জরুরি হটলাইন"
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="Emergency hotlines"
        >
          <PhoneCall className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 3. Timer with Red Dot Badge */}
        <button
          id="btn-quick-timers"
          onClick={onTimerClick}
          title="সক্রিয় রক্তের কাউন্টডাউন টাইমার"
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center relative"
          aria-label="Urgency timers"
        >
          <div className="relative">
            <Timer className="w-6 h-6 stroke-[2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E53935] rounded-full ring-2 ring-white" />
          </div>
        </button>

        {/* 4. Document / Reports */}
        <button
          id="btn-quick-reports"
          onClick={onReportsClick}
          title="রিপোর্ট ও আবেদন সমূহ"
          className="p-2 text-gray-900 hover:text-teal-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="My reports and forms"
        >
          <FileText className="w-6 h-6 stroke-[2]" />
        </button>

        {/* 5. Language Switcher */}
        <button
          id="btn-quick-language"
          onClick={onLanguageToggle}
          title="ভাষা পরিবর্তন"
          className="p-2 text-gray-900 hover:text-blue-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="Switch language"
        >
          <div className="flex items-center space-x-1">
            <Languages className="w-5 h-5 stroke-[2]" />
            <span className="text-[11px] font-bold text-blue-600 leading-none">
              {currentLanguage === 'bn' ? 'বাং' : 'EN'}
            </span>
          </div>
        </button>

        {/* 6. More / Grid Icon matching exact Screenshot_20260918-010455.png */}
        <button
          id="btn-quick-modules"
          onClick={onModuleGridClick}
          title="মোর / সব মডিউল"
          className="p-2 text-gray-900 hover:text-red-600 transition-all active:scale-90 cursor-pointer flex items-center justify-center"
          aria-label="মোর মডিউল মেনু"
        >
          <MoreGridIcon className="w-6 h-6 stroke-[2.2] text-gray-900 hover:text-red-600 transition-colors" />
        </button>
      </div>
    </div>
  );
};

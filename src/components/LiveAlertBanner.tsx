import React from 'react';
import { ChevronRight } from 'lucide-react';

interface LiveAlertBannerProps {
  onAlertClick: () => void;
}

interface AlertItem {
  id: string;
  message: string;
  location: string;
  time: string;
}

const LIVE_ALERTS: AlertItem[] = [
  {
    id: '1',
    message: '০৩ জন O+ রক্তের জন্য অপেক্ষা করছেন',
    location: 'খুলনা, বাংলাদেশ',
    time: '২ মিনিট আগে',
  },
  {
    id: '2',
    message: '০২ ব্যাগ AB- রক্তের জরুরি প্রয়োজন',
    location: 'ঢাকা মেডিকেল, ঢাকা',
    time: '৫ মিনিট আগে',
  },
  {
    id: '3',
    message: '০১ জন B+ রক্তের জন্য অপেক্ষা করছেন',
    location: 'চট্টগ্রাম মেডিকেল কলেজ',
    time: '৮ মিনিট আগে',
  },
  {
    id: '4',
    message: 'নিখোঁজ: সামিউল ইসলাম (সন্ধান দিলে ১০ Hope Points)',
    location: 'আগ্রাবাদ, চট্টগ্রাম',
    time: '১২ মিনিট আগে',
  },
  {
    id: '5',
    message: '০৪ জন A+ ডোনার প্রস্তুত আছেন',
    location: 'রাজশাহী, বাংলাদেশ',
    time: '১৫ মিনিট আগে',
  },
];

export const LiveAlertBanner: React.FC<LiveAlertBannerProps> = ({ onAlertClick }) => {
  return (
    <div
      id="banner-live-alert"
      onClick={onAlertClick}
      className="w-full bg-white border-y border-gray-200/90 px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 transition-colors select-none group relative overflow-hidden"
      role="button"
      tabIndex={0}
      title="জরুরি লাইভ অ্যালার্ট বিস্তারিত দেখতে ক্লিক করুন"
    >
      {/* Left: Fixed Live Indicator with background overlay */}
      <div className="flex items-center shrink-0 pr-2 bg-white z-10 shadow-[4px_0_8px_white]">
        <span className="relative flex h-2.5 w-2.5 items-center justify-center mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E53935]" />
        </span>
        <span className="text-[12px] sm:text-[13px] font-black text-[#E53935] tracking-wide">
          LIVE
        </span>
        <span className="text-gray-300 font-light mx-2 sm:mx-3 text-sm">
          |
        </span>
      </div>

      {/* Center: Continuous Train Marquee (ট্যাক্সট ট্রেনের মতো বিরতিহীনভাবে চলবে) */}
      <div className="flex-1 min-w-0 overflow-hidden relative">
        <div className="animate-train-marquee flex items-center whitespace-nowrap">
          {/* First loop of alerts */}
          {LIVE_ALERTS.map((alert) => (
            <div
              key={`alert-1-${alert.id}`}
              className="inline-flex items-center text-[12px] sm:text-[13px] text-gray-900 font-medium mr-7"
            >
              <span className="font-semibold text-gray-900">{alert.message}</span>
              <span className="text-gray-400 font-bold mx-2">•</span>
              <span className="text-gray-700">{alert.location}</span>
              <span className="text-gray-400 font-bold mx-2">•</span>
              <span className="text-slate-700 text-[11px] font-semibold">{alert.time}</span>
              <span className="text-rose-500 font-bold ml-6 select-none">✦</span>
            </div>
          ))}

          {/* Duplicate loop for continuous seamless infinite train scroll */}
          {LIVE_ALERTS.map((alert) => (
            <div
              key={`alert-2-${alert.id}`}
              className="inline-flex items-center text-[12px] sm:text-[13px] text-gray-900 font-medium mr-7"
            >
              <span className="font-semibold text-gray-900">{alert.message}</span>
              <span className="text-gray-400 font-bold mx-2">•</span>
              <span className="text-gray-700">{alert.location}</span>
              <span className="text-gray-400 font-bold mx-2">•</span>
              <span className="text-slate-700 text-[11px] font-semibold">{alert.time}</span>
              <span className="text-rose-500 font-bold ml-6 select-none">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Fixed Chevron Arrow with background overlay */}
      <div className="shrink-0 pl-2 bg-white z-10 flex items-center shadow-[-4px_0_8px_white]">
        <ChevronRight className="w-4 h-4 text-gray-900 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
};


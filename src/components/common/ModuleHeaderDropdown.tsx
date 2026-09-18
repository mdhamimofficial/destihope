import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Sparkles, 
  Heart, 
  Droplet, 
  UserSearch, 
  Brain, 
  MessageSquare, 
  Film, 
  User,
  Check,
  Layers
} from 'lucide-react';
import { ActiveModule } from '../../types';

// Custom SVG matching the exact 3-tier stacked layers from user's image with isometric perspective
export const ModuleLayersIcon: React.FC<{ className?: string; size?: number; strokeWidth?: number }> = ({
  className = "w-4 h-4",
  size = 20,
  strokeWidth = 2.4,
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
    {/* Top closed diamond/rhombus */}
    <path d="M12 2L3 7L12 12L21 7L12 2Z" />
    {/* Middle layer chevron */}
    <path d="M3 12L12 17L21 12" />
    {/* Bottom layer chevron */}
    <path d="M3 17L12 22L21 17" />
  </svg>
);

export interface ModuleHeaderDropdownProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  darkMode?: boolean;
}

interface ModuleInfo {
  id: ActiveModule;
  label: string;
  nameBn: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
}

export const MODULE_DEFINITIONS: ModuleInfo[] = [
  {
    id: 'hope',
    label: 'DESTI HOPE',
    nameBn: 'সোশ্যাল ও হেল্প ফিড',
    badge: 'হোম ফিড',
    icon: Heart,
    accentColor: '#E53935',
    badgeBg: 'bg-red-50 text-red-700 border-red-200'
  },
  {
    id: 'care',
    label: 'DESTI CARE',
    nameBn: 'রক্তদান ও হাসপাতাল',
    badge: 'জরুরি সেবা',
    icon: Droplet,
    accentColor: '#E11D48',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'find',
    label: 'DESTI FIND',
    nameBn: 'নিখোঁজ অনুসন্ধান নেটওয়ার্ক',
    badge: 'রেসকিউ রাডার',
    icon: UserSearch,
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'brain',
    label: 'DESTI BRAIN',
    nameBn: 'জ্ঞান, ডিবেট ও এআই ডাক্তার',
    badge: 'নলেজ হাব',
    icon: Brain,
    accentColor: '#D97706',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'chat',
    label: 'DESTI CHAT',
    nameBn: 'জরুরি চ্যাট ও অডিও কল',
    badge: 'লাইভ কানেক্ট',
    icon: MessageSquare,
    accentColor: '#0D9488',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  {
    id: 'media',
    label: 'DESTI MEDIA',
    nameBn: 'সচেতনতামূলক রিল ও ভিডিও',
    badge: 'শর্টস ও মিডিয়া',
    icon: Film,
    accentColor: '#9333EA',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'profile',
    label: 'DESTI PROFILE',
    nameBn: 'ব্যক্তিগত প্রোফাইল ও সেটিংস',
    badge: 'অ্যাকাউন্ট',
    icon: User,
    accentColor: '#475569',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200'
  }
];

export const ModuleHeaderDropdown: React.FC<ModuleHeaderDropdownProps> = ({
  activeModule,
  onSelectModule,
  darkMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMod = MODULE_DEFINITIONS.find((m) => m.id === activeModule) || MODULE_DEFINITIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (modId: ActiveModule) => {
    onSelectModule(modId);
    setIsOpen(false);
  };

  const secondWord = currentMod.label.replace('DESTI ', '');

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button with Module Switch Icon */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-1 px-1.5 py-1 rounded-lg transition-all duration-150 active:scale-95 select-none cursor-pointer border ${
          isOpen
            ? darkMode
              ? 'bg-zinc-800 border-zinc-700 text-white'
              : 'bg-gray-100 border-gray-200 text-gray-950'
            : darkMode
              ? 'border-transparent hover:bg-zinc-800/80 text-white'
              : 'border-transparent hover:bg-gray-100/90 text-gray-900'
        }`}
        aria-label="Switch module dropdown"
        aria-expanded={isOpen}
      >
        <div className="flex items-center tracking-tight">
          <span className={`font-black text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-950'}`}>
            DESTI
          </span>
          <span 
            className="font-black text-base sm:text-lg ml-0.5 transition-colors"
            style={{ color: currentMod.accentColor }}
          >
            {secondWord}
          </span>
        </div>

        {/* The user-provided Module Switch Icon (3-tier stacked layers + chevron indicator) */}
        <div className="flex items-center gap-0.5 ml-0.5">
          <div 
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              darkMode 
                ? 'text-zinc-300 group-hover:text-white' 
                : 'text-gray-700 group-hover:text-black'
            }`}
            title="মডিউল পরিবর্তন"
          >
            <ModuleLayersIcon className="w-3.5 h-3.5 stroke-[2.4]" />
          </div>
          <ChevronDown 
            className={`w-3 h-3 transition-transform duration-200 stroke-[2.5] ${
              isOpen ? 'rotate-180 text-red-500' : darkMode ? 'text-zinc-400' : 'text-gray-400'
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div 
          className={`absolute left-0 mt-2 w-64 sm:w-72 rounded-2xl shadow-2xl border z-50 overflow-hidden transform transition-all duration-200 animate-in fade-in slide-in-from-top-2 origin-top-left ${
            darkMode
              ? 'bg-zinc-900 border-zinc-700 text-white divide-zinc-800'
              : 'bg-white border-gray-200 text-gray-900 divide-gray-100'
          }`}
        >
          {/* Header of dropdown */}
          <div className={`p-2.5 border-b flex items-center justify-between ${
            darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center gap-1.5">
              <ModuleLayersIcon className="w-4 h-4 text-red-500 stroke-[2.4]" />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                darkMode ? 'text-zinc-300' : 'text-gray-800'
              }`}>
                মডিউল পরিবর্তন
              </span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-700'
            }`}>
              ৭টি মডিউল
            </span>
          </div>

          {/* Module List Options */}
          <div className="p-1.5 max-h-[380px] overflow-y-auto space-y-1">
            {MODULE_DEFINITIONS.map((mod) => {
              const isSelected = mod.id === activeModule;
              const IconComp = mod.icon;

              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelect(mod.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? darkMode
                        ? 'bg-zinc-800 text-white font-bold'
                        : 'bg-gray-100/90 text-gray-950 font-bold'
                      : darkMode
                        ? 'hover:bg-zinc-800/60 text-zinc-300 hover:text-white'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ 
                        backgroundColor: `${mod.accentColor}18`,
                        color: mod.accentColor 
                      }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold tracking-tight truncate">
                          {mod.label}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className={`text-[10px] truncate ${
                        darkMode ? 'text-zinc-400' : 'text-gray-500'
                      }`}>
                        {mod.nameBn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    ) : (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${
                        darkMode 
                          ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700' 
                          : mod.badgeBg
                      }`}>
                        {mod.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

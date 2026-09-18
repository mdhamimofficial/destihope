import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Home, 
  MessageSquare, 
  Film, 
  Brain, 
  Droplet, 
  UserSearch, 
  User, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ActiveModule } from '../../types';

interface RadialModuleItem {
  id: ActiveModule;
  label: string;
  nameBn: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderLight: string;
  shadowColor: string;
}

// Home module sits prominently in the center hub
export const HOME_MODULE_INFO: RadialModuleItem = {
  id: 'hope',
  label: 'হোম ফিড',
  nameBn: 'Desti Hope',
  tagline: 'জরুরি সেবা ও সামাজিক ফিড',
  icon: Home,
  color: '#E53935',
  bgColor: 'bg-red-500',
  borderLight: 'border-red-200',
  shadowColor: 'shadow-red-500/40'
};

// 6 surrounding modules around the Home center hub in a balanced hexagonal orbit
const SURROUNDING_ORBIT_MODULES: RadialModuleItem[] = [
  {
    id: 'chat',
    label: 'চ্যাট',
    nameBn: 'Desti Chat',
    tagline: 'লাইভ মেসেজিং ও রক্তদান গ্রুপ',
    icon: MessageSquare,
    color: '#0D9488',
    bgColor: 'bg-teal-600',
    borderLight: 'border-teal-200',
    shadowColor: 'shadow-teal-500/30'
  },
  {
    id: 'media',
    label: 'মিডিয়া',
    nameBn: 'Desti Media',
    tagline: 'শর্ট রিলস ও মানবিক স্টোরি',
    icon: Film,
    color: '#9333EA',
    bgColor: 'bg-purple-600',
    borderLight: 'border-purple-200',
    shadowColor: 'shadow-purple-500/30'
  },
  {
    id: 'brain',
    label: 'ব্রেন',
    nameBn: 'Desti Brain',
    tagline: 'এআই স্বাস্থ্য সহকারী ও কুইজ',
    icon: Brain,
    color: '#D97706',
    bgColor: 'bg-amber-600',
    borderLight: 'border-amber-200',
    shadowColor: 'shadow-amber-500/30'
  },
  {
    id: 'care',
    label: 'কেয়ার',
    nameBn: 'Desti Care',
    tagline: 'ব্লাড ডোনার ও হাসপাতাল',
    icon: Droplet,
    color: '#E11D48',
    bgColor: 'bg-rose-600',
    borderLight: 'border-rose-200',
    shadowColor: 'shadow-rose-500/30'
  },
  {
    id: 'find',
    label: 'ফাইন্ড',
    nameBn: 'Desti Find',
    tagline: 'নিখোঁজ সন্ধান ও রেসকিউ রাডার',
    icon: UserSearch,
    color: '#059669',
    bgColor: 'bg-emerald-600',
    borderLight: 'border-emerald-200',
    shadowColor: 'shadow-emerald-500/30'
  },
  {
    id: 'profile',
    label: 'প্রোফাইল',
    nameBn: 'Desti Profile',
    tagline: 'ব্যক্তিগত তথ্য ও সেটিংস',
    icon: User,
    color: '#475569',
    bgColor: 'bg-slate-700',
    borderLight: 'border-slate-200',
    shadowColor: 'shadow-slate-500/30'
  }
];

// All modules combined for status lookups
export const ALL_ORBIT_MODULES: RadialModuleItem[] = [
  HOME_MODULE_INFO,
  ...SURROUNDING_ORBIT_MODULES
];

interface ModuleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (mod: ActiveModule) => void;
  activeModule: ActiveModule;
}

export const ModuleSwitcherModal: React.FC<ModuleSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  activeModule,
}) => {
  // Radius of orbit in pixels (balanced spacing for pure icons)
  const ORBIT_RADIUS = 115;
  const totalSurrounding = SURROUNDING_ORBIT_MODULES.length; // 6 nodes
  const [timeLeft, setTimeLeft] = useState<number>(5);

  const currentMod = ALL_ORBIT_MODULES.find(m => m.id === activeModule) || HOME_MODULE_INFO;

  // 5-second auto-close countdown when modal is open
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      return;
    }

    setTimeLeft(5);

    // 1-second tick for UI countdown
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-dismiss after strictly 5000ms (5 seconds)
    const timeoutId = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="modal-radial-orbit-switcher"
          className="fixed inset-0 z-[120] flex items-center justify-center select-none overflow-hidden"
          onClick={onClose} // Touch/click anywhere outside or on backdrop closes immediately
        >
          {/* Backdrop with frosted blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-md cursor-pointer"
            onClick={onClose}
          />

          {/* Radial Orbit Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 420 }}
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-4 pointer-events-auto"
            onClick={(e) => {
              // If touching empty space inside radial container, also dismiss
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            {/* Orbit Wheel Area */}
            <div 
              className="relative flex items-center justify-center my-6"
              style={{ width: ORBIT_RADIUS * 2 + 80, height: ORBIT_RADIUS * 2 + 80 }}
            >
              {/* Ambient Orbit Guide Circles perfectly passing through satellite icon centers */}
              <div 
                className="absolute pointer-events-none rounded-full border border-white/25 shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
              />
              <div 
                className="absolute pointer-events-none rounded-full border border-white/10 border-dashed"
                style={{ width: ORBIT_RADIUS * 2 + 20, height: ORBIT_RADIUS * 2 + 20 }}
              />

              {/* CENTER HUB: Balanced Home Icon (No text label, harmonious proportion) */}
              <motion.button
                id="radial-center-home-hub"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModule('hope');
                  onClose();
                }}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', damping: 20, stiffness: 450 }}
                className={`relative z-30 w-16 h-16 rounded-full border-[3px] flex items-center justify-center transition-all cursor-pointer shadow-[0_0_28px_rgba(229,57,53,0.4)] ${
                  activeModule === 'hope' 
                    ? 'border-white ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]' 
                    : 'border-white hover:border-amber-200'
                }`}
                style={{
                  background: 'radial-gradient(circle at 75% 25%, #E53935 0%, #B71C1C 55%, #7F1D1D 100%)'
                }}
                aria-label="হোম ফিড"
                title="হোম ফিড"
              >
                <div className="relative flex items-center justify-center">
                  <Home className="w-7 h-7 text-white stroke-[2.3] drop-shadow-md" />
                  {activeModule === 'hope' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-md" />
                  )}
                </div>
              </motion.button>

              {/* 6 Surrounding Orbiting Modules (Pure icon-only nodes, precisely aligned along the circular guide path) */}
              {SURROUNDING_ORBIT_MODULES.map((mod, index) => {
                const isActive = mod.id === activeModule;
                const Icon = mod.icon;

                // 6 nodes spread symmetrically at 60 degree intervals (starting from top -90 deg / -Math.PI / 2)
                const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalSurrounding;
                const x = Math.round(Math.cos(angle) * ORBIT_RADIUS);
                const y = Math.round(Math.sin(angle) * ORBIT_RADIUS);

                return (
                  <motion.div
                    key={mod.id}
                    initial={{ scale: 0.5, opacity: 0, x: 0, y: 0 }}
                    animate={{ scale: 1, opacity: 1, x, y }}
                    exit={{ scale: 0.5, opacity: 0, x: 0, y: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 24,
                      stiffness: 450,
                      delay: index * 0.015
                    }}
                    className="absolute z-20 flex items-center justify-center group cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      id={`radial-module-btn-${mod.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectModule(mod.id);
                        onClose();
                      }}
                      className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 relative ${
                        isActive
                          ? 'ring-4 ring-white shadow-[0_0_24px_rgba(255,255,255,0.7)] scale-110'
                          : 'hover:scale-110 shadow-xl border-2 border-white'
                      }`}
                      style={{
                        backgroundColor: mod.color,
                      }}
                      aria-label={mod.nameBn}
                      title={mod.tagline}
                    >
                      <Icon className="w-6 h-6 text-white stroke-[2.2]" />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-md" />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Currently Active Status Chip with Auto-Close 5s Countdown Timer */}
            <div className="mt-5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 text-white">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-300">বর্তমান:</span>
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: currentMod.color }}
                />
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentMod.nameBn}
                </span>
              </div>
              <span className="text-[10px] text-amber-300/90 font-medium px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                {timeLeft}s পর বন্ধ হবে
              </span>
            </div>

            {/* Close Floating Capsule Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.15 }}
              id="btn-close-radial-orbit"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="mt-5 px-6 py-2 rounded-full bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold tracking-wide flex items-center gap-2 border border-white/20 backdrop-blur-md transition-all active:scale-95 shadow-xl cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
              <span>বন্ধ করুন</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


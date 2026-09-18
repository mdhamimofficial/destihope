import React from 'react';
import { 
  Home, 
  Droplet, 
  AlertTriangle, 
  Clock, 
  MessageCircle, 
  Users, 
  PhoneCall, 
  PlaySquare, 
  Film, 
  Headphones, 
  Bookmark, 
  Brain, 
  HelpCircle, 
  Award, 
  Swords, 
  Building2, 
  Siren, 
  ShieldCheck, 
  UserSearch, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  User, 
  Sparkles,
  Layers,
  Clapperboard,
  Radio,
  LayoutGrid
} from 'lucide-react';
import { ActiveModule } from '../types';

// Custom SVG Icon matching user's exact 3-tier stacked layers module icon ("মডিউল") from Screenshot_20260918-095234.png
export const ModuleLayersIcon: React.FC<{ 
  className?: string; 
  size?: number; 
  strokeWidth?: number;
  showDot?: boolean;
}> = ({
  className = "w-6 h-6",
  size = 24,
  strokeWidth = 2.4,
  showDot = false,
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
    {/* Top diamond layer */}
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    {/* Middle chevron layer */}
    <polyline points="2 12 12 17 22 12" />
    {/* Bottom chevron layer */}
    <polyline points="2 17 12 22 22 17" />
    {/* Satellite dot if requested */}
    {showDot && (
      <circle cx="21" cy="4" r="2.2" fill="currentColor" stroke="none" />
    )}
  </svg>
);

// Custom SVG Icon representing "Home + Switch/Transfer"
const HomeSwitchIcon = ({ className, size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Outer Home Outline */}
    <path d="M3 10l9-7 9 7" />
    <path d="M4 10v11h16V10" />
    {/* Inner Right-facing arrow (Transfer) */}
    <path d="M9 14h6" />
    <path d="M13 12l2 2-2 2" />
    {/* Inner Left-facing arrow (Transfer) */}
    <path d="M15 18H9" />
    <path d="M11 16l-2 2 2 2" />
  </svg>
);

interface BottomNavProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  unreadChatCount?: number;
  onOpenModuleSwitcher?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (subTab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isSwitcher?: boolean;
  badge?: number;
  color?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  unreadChatCount = 2,
  onOpenModuleSwitcher,
  activeSubTab,
  onSelectSubTab,
}) => {
  // Define module-specific action tabs
  const getNavItems = (): NavItem[] => {
    switch (activeModule) {
      case 'chat':
        return [
          { id: 'all', label: 'চ্যাটস', icon: MessageCircle, badge: unreadChatCount > 0 ? unreadChatCount : undefined },
          { id: 'groups', label: 'গ্রুপস', icon: Users },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'blood', label: 'রক্ত কেস', icon: Droplet },
          { id: 'calls', label: 'কল লিস্ট', icon: PhoneCall },
        ];
      case 'media':
        return [
          { id: 'reels', label: 'রিলস', icon: Clapperboard },
          { id: 'home', label: 'ভিডিও', icon: Film },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'audio', label: 'অডিও', icon: Headphones },
          { id: 'saved', label: 'সংরক্ষিত', icon: Bookmark },
        ];
      case 'brain':
        return [
          { id: 'ai', label: 'এআই ডক্টর', icon: Brain },
          { id: 'learn', label: 'প্রশ্নোত্তর', icon: HelpCircle },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'battle', label: 'কুইজ', icon: Award },
          { id: 'debate', label: 'ডিবেট', icon: Swords },
        ];
      case 'care':
        return [
          { id: 'bloodbank', label: 'ডোনার', icon: Droplet },
          { id: 'hospitals', label: 'হাসপাতাল', icon: Building2 },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'ambulance', label: 'অ্যাম্বুলেন্স', icon: Siren },
          { id: 'profile', label: 'প্রোফাইল', icon: User },
        ];
      case 'find':
        return [
          { id: 'cases', label: 'নিখোঁজ', icon: UserSearch },
          { id: 'found', label: 'উদ্ধার', icon: CheckCircle2 },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'radar', label: 'রাডার', icon: Radio },
          { id: 'profile', label: 'প্রোফাইল', icon: User },
        ];
      case 'profile':
        return [
          { id: 'overview', label: 'পরিচিতি', icon: User },
          { id: 'modules', label: 'মডিউল প্রোফাইল', icon: Layers },
          { id: 'module_switcher', label: 'মডিউল', icon: ModuleLayersIcon, isSwitcher: true },
          { id: 'badges', label: 'পয়েন্ট ও ব্যাজ', icon: Award },
          { id: 'security', label: 'নিরাপত্তা', icon: ShieldCheck },
        ];
      case 'hope':
      default:
        return [
          { id: 'hope', label: 'হোম', icon: Home },
          { id: 'chat', label: 'চ্যাট', icon: MessageCircle, badge: unreadChatCount > 0 ? unreadChatCount : undefined },
          { id: 'media', label: 'মিডিয়া', icon: Clapperboard },
          { id: 'brain', label: 'ব্রেন', icon: Brain },
          { id: 'care', label: 'কেয়ার', icon: Droplet },
          { id: 'find', label: 'নিখোঁজ', icon: UserSearch },
        ];
    }
  };

  const navItems = getNavItems();
  const isHome = activeModule === 'hope';

  // Get module theme color
  const getThemeColor = () => {
    switch (activeModule) {
      case 'chat': return 'text-teal-600';
      case 'media': return 'text-purple-600';
      case 'brain': return 'text-amber-600';
      case 'care': return 'text-rose-600';
      case 'find': return 'text-emerald-600';
      case 'profile': return 'text-slate-800';
      case 'hope':
      default:
        return 'text-[#E53935]';
    }
  };

  const activeColorClass = getThemeColor();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className={`flex items-center justify-around ${isHome ? 'px-1.5 h-16' : 'px-1 pt-1 pb-2'}`}>
        {navItems.map((item) => {
          const isActive = isHome ? item.id === 'hope' : activeSubTab === item.id;
          const Icon = item.icon || HomeSwitchIcon;

          // Distinct elevated launcher styling for the module switcher button (Circular launcher with dark-to-crimson gradient glow matching user screenshot)
          if (item.isSwitcher) {
            return (
              <button
                key={item.id}
                id="btn-module-switcher-trigger"
                onClick={() => onOpenModuleSwitcher?.()}
                className="flex-1 flex flex-col items-center justify-center relative -mt-4 group transition-transform active:scale-95 cursor-pointer"
                aria-label="মডিউল পরিবর্তন"
                title="মডিউল সুইচার"
              >
                <div className="relative flex items-center justify-center">
                  <div 
                    className="w-13 h-13 rounded-full border-2 border-white flex items-center justify-center transition-all group-hover:scale-105 shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
                    style={{
                      background: 'radial-gradient(circle at 75% 25%, #7F1D1D 0%, #1E1B4B 45%, #0B0F19 100%)'
                    }}
                  >
                    <ModuleLayersIcon className="w-6 h-6 text-[#FBBF24] stroke-[2.4]" showDot={false} />
                  </div>
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                if (item.isSwitcher) {
                  onOpenModuleSwitcher?.();
                  return;
                }
                if (isHome) {
                  if (item.id === 'hope') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    onSelectModule(item.id as ActiveModule);
                  }
                  return;
                }
                if (item.id === 'back_home') {
                  onSelectModule('hope');
                  return;
                }
                if (onSelectSubTab) {
                  onSelectSubTab(item.id);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center relative transition-transform active:scale-90 ${
                isHome ? 'py-1 px-1 h-full' : 'py-1 px-0.5'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`transition-all duration-200 ${
                    isHome
                      ? `w-[27px] h-[27px] ${
                          isActive
                            ? `${activeColorClass} stroke-[2.3] scale-110 drop-shadow-[0_2px_6px_rgba(229,57,53,0.3)]`
                            : 'text-gray-400 stroke-[1.85] hover:text-gray-700 hover:scale-105'
                        }`
                      : `w-6 h-6 ${
                          isActive
                            ? `${activeColorClass} stroke-[2.4] scale-110`
                            : 'text-gray-500 stroke-[1.8] hover:text-gray-800'
                        }`
                  }`}
                />

                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E53935] text-white text-[10px] font-black rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center leading-none shadow-sm ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label - hidden on Home page */}
              {!isHome && (
                <span
                  className={`text-[8.5px] sm:text-[9.5px] mt-1 transition-colors leading-tight font-medium whitespace-nowrap tracking-tight ${
                    isActive ? `font-bold ${activeColorClass}` : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Active Indicator Dot/Bar */}
              {isActive && (
                <span
                  className={`${
                    isHome
                      ? 'w-1.5 h-1.5 bg-[#E53935] rounded-full mt-1 shadow-[0_0_6px_rgba(229,57,53,0.8)] animate-in fade-in zoom-in-50 duration-200'
                      : 'w-4 h-0.5 bg-current rounded-full mt-0.5 animate-in fade-in zoom-in-50 duration-200'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

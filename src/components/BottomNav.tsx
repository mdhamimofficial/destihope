import React from 'react';
import { 
  Home, 
  Droplet, 
  AlertTriangle, 
  Clock, 
  MessageCircle, 
  MessageSquare,
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
          { id: 'back_home', label: 'Home', icon: Home },
          { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : undefined },
          { id: 'upload', label: 'আপলোড+', icon: PlusCircle },
          { id: 'module_switch', label: 'মডিউল', icon: ModuleLayersIcon },
          { id: 'community', label: 'কমিউনিটি', icon: Users },
        ];
      case 'media':
        return [
          { id: 'back_home', label: 'হোম', icon: Home },
          { id: 'reels', label: 'রিলস', icon: Clapperboard },
          { id: 'videos', label: 'ভিডিও', icon: Film },
          { id: 'audio', label: 'অডিও', icon: Headphones },
          { id: 'saved', label: 'সংরক্ষিত', icon: Bookmark },
        ];
      case 'brain':
        return [
          { id: 'back_home', label: 'হোম', icon: Home },
          { id: 'ai', label: 'এআই ডক্টর', icon: Brain },
          { id: 'learn', label: 'প্রশ্নোত্তর', icon: HelpCircle },
          { id: 'battle', label: 'কুইজ', icon: Award },
          { id: 'debate', label: 'ডিবেট', icon: Swords },
        ];
      case 'care':
        return [
          { id: 'back_home', label: 'হোম', icon: Home },
          { id: 'bloodbank', label: 'ডোনার', icon: Droplet },
          { id: 'hospitals', label: 'হাসপাতাল', icon: Building2 },
          { id: 'ambulance', label: 'অ্যাম্বুলেন্স', icon: Siren },
          { id: 'profile', label: 'প্রোফাইল', icon: User },
        ];
      case 'find':
        return [
          { id: 'back_home', label: 'হোম', icon: Home },
          { id: 'cases', label: 'নিখোঁজ', icon: UserSearch },
          { id: 'found', label: 'উদ্ধার', icon: CheckCircle2 },
          { id: 'radar', label: 'রাডার', icon: Radio },
          { id: 'profile', label: 'প্রোফাইল', icon: User },
        ];
      case 'profile':
        return [
          { id: 'back_home', label: 'হোম', icon: Home },
          { id: 'overview', label: 'পরিচিতি', icon: User },
          { id: 'modules', label: 'মডিউল', icon: Layers },
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

  const isMedia = activeModule === 'media';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-md border-t z-40 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] ${
      isMedia 
        ? 'bg-zinc-950/95 border-zinc-800/80 text-zinc-300' 
        : 'bg-white/95 border-gray-200/80 text-gray-800'
    }`}>
      <div className="flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive = isHome 
            ? item.id === 'hope' 
            : activeModule === 'chat'
            ? (activeSubTab === item.id || (item.id === 'chat' && (!activeSubTab || activeSubTab === 'chat' || activeSubTab === 'all')))
            : activeSubTab === item.id;
          const Icon = item.icon || HomeSwitchIcon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                if (item.id === 'back_home') {
                  onSelectModule('hope');
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
                if (onSelectSubTab) {
                  onSelectSubTab(item.id);
                }
              }}
              className="flex-1 h-full flex flex-col items-center justify-center relative py-1 px-1 cursor-pointer select-none"
              aria-label={item.label}
              title={item.id === 'back_home' ? 'হোম পেজে (Desti Hope) ফিরুন' : item.label}
            >
              <div className="relative flex items-center justify-center p-1 rounded-xl">
                <Icon
                  className={`w-7 h-7 transition-colors duration-150 ${
                    isHome
                      ? isActive
                        ? `${activeColorClass} stroke-[2.4]`
                        : 'text-gray-400 stroke-[2] hover:text-gray-600'
                      : isActive
                      ? `${isMedia ? 'text-purple-400' : activeColorClass} stroke-[2.4]`
                      : item.id === 'back_home'
                      ? (isMedia ? 'text-zinc-400 hover:text-rose-400' : 'text-gray-500 hover:text-[#E53935]') + ' stroke-[2]'
                      : `${isMedia ? 'text-zinc-400 hover:text-zinc-200' : 'text-gray-500 hover:text-gray-700'} stroke-[2]`
                  }`}
                />

                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#E53935] text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none shadow-xs ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Active Indicator Dot (Absolute positioned so it never pushes or shifts the icon position) */}
              {isActive && (
                <span
                  className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                    isHome 
                      ? 'bg-[#E53935]' 
                      : isMedia 
                      ? 'bg-purple-400' 
                      : activeColorClass.includes('teal') 
                      ? 'bg-teal-600' 
                      : 'bg-[#E53935]'
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

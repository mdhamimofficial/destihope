import React from 'react';
import { 
  Home, 
  Droplet, 
  MessageCircle, 
  MessageSquare,
  Users, 
  PlaySquare, 
  Building2, 
  Siren, 
  UserSearch, 
  CheckCircle2, 
  User, 
  Layers,
  Clapperboard,
  Radio,
  PlusCircle,
  HelpCircle,
  Award,
  Swords,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { ActiveModule } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Custom SVG Icon matching user's exact 3-tier stacked layers module icon ("মডিউল")
export const ModuleLayersIcon: React.FC<{ 
  className?: string; 
  size?: number; 
  strokeWidth?: number;
  showDot?: boolean;
}> = ({
  className = "w-5.5 h-5.5",
  size = 22,
  strokeWidth = 2.2,
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
      <circle cx="21" cy="4" r="2" fill="currentColor" stroke="none" />
    )}
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
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isSwitcher?: boolean;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  unreadChatCount = 2,
  onOpenModuleSwitcher,
  activeSubTab,
  onSelectSubTab,
}) => {
  const { l } = useLanguage();

  // Define module-specific action tabs with clean bilingual labels
  const getNavItems = (): NavItem[] => {
    switch (activeModule) {
      case 'chat':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'chat', label: l('চ্যাট', 'Chats'), icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : undefined },
          { id: 'upload', label: l('নতুন', 'New'), icon: PlusCircle },
          { id: 'module_switch', label: l('মডিউল', 'Modules'), icon: ModuleLayersIcon },
          { id: 'community', label: l('গ্রুপ', 'Groups'), icon: Users },
        ];
      case 'media':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'feed', label: l('ফিড', 'Feed'), icon: PlaySquare },
          { id: 'reels', label: l('রিলস', 'Reels'), icon: Clapperboard },
          { id: 'subscriptions', label: l('চ্যানেল', 'Channels'), icon: Users },
          { id: 'chat', label: l('চ্যাট', 'Chat'), icon: MessageCircle, badge: 2 },
          { id: 'profile', label: l('প্রোফাইল', 'Profile'), icon: User },
        ];
      case 'brain':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'ai', label: l('এআই', 'AI Doctor'), icon: Brain },
          { id: 'learn', label: l('প্রশ্ন', 'Q&A'), icon: HelpCircle },
          { id: 'battle', label: l('কুইজ', 'Quiz'), icon: Award },
          { id: 'debate', label: l('ডিবেট', 'Debate'), icon: Swords },
        ];
      case 'care':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'bloodbank', label: l('ডোনার', 'Donors'), icon: Droplet },
          { id: 'hospitals', label: l('হাসপাতাল', 'Hospitals'), icon: Building2 },
          { id: 'ambulance', label: l('অ্যাম্বুলেন্স', 'Ambulance'), icon: Siren },
          { id: 'profile', label: l('প্রোফাইল', 'Profile'), icon: User },
        ];
      case 'find':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'cases', label: l('নিখোঁজ', 'Cases'), icon: UserSearch },
          { id: 'found', label: l('উদ্ধার', 'Rescued'), icon: CheckCircle2 },
          { id: 'radar', label: l('রাডার', 'Radar'), icon: Radio },
          { id: 'profile', label: l('প্রোফাইল', 'Profile'), icon: User },
        ];
      case 'profile':
        return [
          { id: 'back_home', label: l('হোম', 'Home'), icon: Home },
          { id: 'overview', label: l('পরিচিতি', 'Overview'), icon: User },
          { id: 'modules', label: l('মডিউল', 'Modules'), icon: Layers },
          { id: 'badges', label: l('পয়েন্ট', 'Points'), icon: Award },
          { id: 'security', label: l('নিরাপত্তা', 'Security'), icon: ShieldCheck },
        ];
      case 'hope':
      default:
        return [
          { id: 'hope', label: l('হোম', 'Home'), icon: Home },
          { id: 'chat', label: l('চ্যাট', 'Chat'), icon: MessageCircle, badge: unreadChatCount > 0 ? unreadChatCount : undefined },
          { id: 'media', label: l('মিডিয়া', 'Media'), icon: Clapperboard },
          { id: 'brain', label: l('ব্রেন', 'Brain'), icon: Brain },
          { id: 'care', label: l('কেয়ার', 'Care'), icon: Droplet },
          { id: 'find', label: l('নিখোঁজ', 'Find'), icon: UserSearch },
        ];
    }
  };

  const navItems = getNavItems();
  const isHome = activeModule === 'hope';

  // Active module theme color
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
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-lg border-t z-40 bg-white/95 border-gray-200/90 text-gray-800 shadow-[0_-2px_16px_rgba(0,0,0,0.06)] pb-safe select-none">
      <div className="flex items-center justify-around px-1 h-14 sm:h-15">
        {navItems.map((item) => {
          const isActive = isHome 
            ? item.id === 'hope' 
            : activeModule === 'chat'
            ? (activeSubTab === item.id || (item.id === 'chat' && (!activeSubTab || activeSubTab === 'chat' || activeSubTab === 'all')))
            : activeModule === 'media'
            ? (activeSubTab === item.id || ((item.id === 'feed' || item.id === 'home') && (!activeSubTab || activeSubTab === 'home' || activeSubTab === 'videos' || activeSubTab === 'feed')))
            : activeSubTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                if (item.id === 'back_home') {
                  onSelectModule('hope');
                  return;
                }
                if (item.id === 'module_switch') {
                  if (onOpenModuleSwitcher) onOpenModuleSwitcher();
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
              className="flex-1 h-full flex flex-col items-center justify-center relative py-1 px-0.5 cursor-pointer active:scale-95 transition-all group"
              aria-label={item.label}
              title={item.id === 'back_home' ? l('হোম পেজে (Desti Hope) ফিরুন', 'Return to Home (Desti Hope)') : item.label}
            >
              {/* Standardized 22px-24px icon container */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5.5 h-5.5 transition-all duration-150 ${
                    isActive
                      ? `${activeColorClass} stroke-[2.3] scale-105`
                      : item.id === 'back_home'
                      ? 'text-gray-500 group-hover:text-[#E53935] stroke-[1.9]'
                      : 'text-gray-500 group-hover:text-gray-800 stroke-[1.9]'
                  }`}
                />

                {/* Compact, clean badge */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-[#E53935] text-white text-[9px] font-black rounded-full px-1 flex items-center justify-center leading-none shadow-xs ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Standard micro-label below icon for optimal mobile readability */}
              <span 
                className={`text-[10px] tracking-tight leading-none mt-1 truncate max-w-[56px] text-center transition-colors ${
                  isActive 
                    ? `font-bold ${activeColorClass}` 
                    : 'font-medium text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot under label */}
              {isActive && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    activeColorClass.includes('teal')
                      ? 'bg-teal-600'
                      : activeColorClass.includes('purple')
                      ? 'bg-purple-600'
                      : activeColorClass.includes('amber')
                      ? 'bg-amber-600'
                      : activeColorClass.includes('rose')
                      ? 'bg-rose-600'
                      : activeColorClass.includes('emerald')
                      ? 'bg-emerald-600'
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

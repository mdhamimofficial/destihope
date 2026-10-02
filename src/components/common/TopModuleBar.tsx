import React from 'react';
import { 
  Heart, 
  Droplet, 
  UserSearch, 
  Brain, 
  MessageSquare, 
  Film, 
  User,
  Sparkles 
} from 'lucide-react';
import { ActiveModule } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface TopModuleBarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  darkMode?: boolean;
}

const MODULE_TABS = [
  { id: 'hope' as ActiveModule, labelBn: 'হোপ', labelEn: 'Hope', icon: Heart, color: 'text-red-600' },
  { id: 'care' as ActiveModule, labelBn: 'কেয়ার', labelEn: 'Care', icon: Droplet, color: 'text-rose-600' },
  { id: 'find' as ActiveModule, labelBn: 'ফাইন্ড', labelEn: 'Find', icon: UserSearch, color: 'text-emerald-600' },
  { id: 'brain' as ActiveModule, labelBn: 'ব্রেন', labelEn: 'Brain', icon: Brain, color: 'text-amber-600' },
  { id: 'chat' as ActiveModule, labelBn: 'চ্যাট', labelEn: 'Chat', icon: MessageSquare, color: 'text-teal-600' },
  { id: 'media' as ActiveModule, labelBn: 'মিডিয়া', labelEn: 'Media', icon: Film, color: 'text-purple-600' },
  { id: 'profile' as ActiveModule, labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User, color: 'text-slate-600' },
];

export const TopModuleBar: React.FC<TopModuleBarProps> = ({
  activeModule,
  onSelectModule,
  darkMode = false,
}) => {
  const { l } = useLanguage();

  return (
    <div className={`w-full overflow-x-auto no-scrollbar border-b px-2 py-1.5 flex items-center gap-1.5 ${
      darkMode 
        ? 'bg-zinc-950 border-zinc-900 text-zinc-300' 
        : 'bg-white border-gray-100 text-gray-700'
    }`}>
      {MODULE_TABS.map((tab) => {
        const isSelected = tab.id === activeModule;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectModule(tab.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
              isSelected
                ? darkMode
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'bg-gray-900 text-white shadow-xs'
                : darkMode
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
            <span>{l(tab.labelBn, tab.labelEn)}</span>
          </button>
        );
      })}
    </div>
  );
};

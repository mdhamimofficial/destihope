import React from 'react';
import { FeedCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryPillsProps {
  activeCategory: FeedCategory;
  onSelectCategory: (category: FeedCategory) => void;
}

const categories: { id: FeedCategory; bn: string; en: string }[] = [
  { id: 'For You', bn: 'আপনার জন্য', en: 'For You' },
  { id: 'Blood Help', bn: 'রক্তের আবেদন', en: 'Blood Help' },
  { id: 'Missing', bn: 'নিখোঁজ সন্ধান', en: 'Missing' },
  { id: 'News', bn: 'সংবাদ', en: 'News' },
  { id: 'Community', bn: 'কমিউনিটি', en: 'Community' },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { l } = useLanguage();

  return (
    <div className="bg-white px-3 py-1.5 border-b border-gray-100">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`pill-category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[#00897B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {l(cat.bn, cat.en)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

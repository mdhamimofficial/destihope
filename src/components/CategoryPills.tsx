import React from 'react';
import { FeedCategory } from '../types';

interface CategoryPillsProps {
  activeCategory: FeedCategory;
  onSelectCategory: (category: FeedCategory) => void;
}

const categories: FeedCategory[] = [
  'For You',
  'Blood Help',
  'Missing',
  'News',
  'Community',
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white px-3 py-1.5 border-b border-gray-100">
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              id={`pill-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[#00897B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

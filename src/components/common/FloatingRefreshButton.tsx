import React from 'react';
import { ArrowUp, Sparkles, RefreshCw } from 'lucide-react';

interface FloatingRefreshButtonProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  newCount?: number;
  visible?: boolean;
}

export const FloatingRefreshButton: React.FC<FloatingRefreshButtonProps> = ({
  onRefresh,
  isRefreshing = false,
  newCount = 3,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div className="sticky top-16 z-20 flex justify-center w-full pointer-events-none mb-[-42px]">
      <button
        id="btn-floating-social-refresh"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="pointer-events-auto bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-4 py-2 rounded-lg text-xs font-semibold shadow-lg border border-slate-700 dark:border-slate-300 flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer animate-in slide-in-from-top-3 fade-in duration-200"
      >
        {isRefreshing ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400 dark:text-rose-600" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 dark:text-rose-600 flex items-center justify-center">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
          </div>
        )}
        <span>
          {isRefreshing ? 'ফিড আপডেট হচ্ছে...' : `নতুন ${newCount}টি পোস্ট • উপরে যান ও রিফ্রেশ করুন`}
        </span>
        <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
      </button>
    </div>
  );
};

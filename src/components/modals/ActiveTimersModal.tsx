import React from 'react';
import { X, Timer, Droplet, ArrowRight, AlertTriangle } from 'lucide-react';
import { FeedPost } from '../../types';

interface ActiveTimersModalProps {
  isOpen: boolean;
  onClose: () => void;
  bloodPosts: FeedPost[];
  onSelectPost: (post: FeedPost) => void;
}

export const ActiveTimersModal: React.FC<ActiveTimersModalProps> = ({
  isOpen,
  onClose,
  bloodPosts,
  onSelectPost,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">সক্রিয় রক্তের কাউন্টডাউন</h3>
              <p className="text-[11px] text-red-100">সময়-সীমিত জরুরি কেস ট্র্যাকিং</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-11 -mr-2 -my-2 flex items-center justify-center text-white rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 active:scale-90 transition-all cursor-pointer touch-manipulation"
            aria-label="বন্ধ করুন"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {bloodPosts.map((post) => (
            <div
              key={post.id}
              className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center justify-center">
                    {post.bloodDetails?.group}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      {post.bloodDetails?.hospital}
                    </h4>
                    <span className="text-[11px] text-gray-500">
                      {post.location} • {post.bloodDetails?.bagsNeeded} ব্যাগ
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-xs font-black text-red-600 font-mono bg-red-100 px-2 py-0.5 rounded">
                    {post.bloodDetails?.timeRemainingText}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-600 h-1.5 rounded-full animate-pulse"
                  style={{ width: `${post.bloodDetails?.progressPercent || 60}%` }}
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onSelectPost(post);
                    onClose();
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <span>সহায়তা করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {bloodPosts.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-xs">
              এই মুহূর্তে কোনো সক্রিয় সময়-সীমিত রক্তের আবেদন নেই।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

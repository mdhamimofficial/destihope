import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  MoreVertical, 
  Share2, 
  Phone, 
  Heart, 
  MessageCircle, 
  Droplet, 
  Search, 
  Newspaper,
  Info,
  Clock,
  MapPin,
  Flame,
  Check,
  CloudUpload,
  CheckCircle2
} from 'lucide-react';
import { FeedPost } from '../types';

interface HomeFeedProps {
  posts: FeedPost[];
  onHelpBlood: (post: FeedPost) => void;
  onViewMissingDetails: (post: FeedPost) => void;
  onSharePost: (post: FeedPost) => void;
  onCallContact: (phoneNumber: string) => void;
  onShowHopePointsInfo: () => void;
  activeFilter: string;
  onToggleLike?: (postId: string) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  posts,
  onHelpBlood,
  onViewMissingDetails,
  onSharePost,
  onCallContact,
  onShowHopePointsInfo,
  activeFilter,
  onToggleLike,
}) => {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(posts);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Sync state when props change
  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  // Handle like toggle
  const handleToggleLike = (postId: string) => {
    if (onToggleLike) {
      onToggleLike(postId);
    } else {
      setFeedPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const isLiked = !p.isLiked;
            return {
              ...p,
              isLiked,
              likes: isLiked ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        })
      );
    }
  };

  // Filter posts based on Category Pill
  const filteredPosts = feedPosts.filter((post) => {
    if (activeFilter === 'For You') return true;
    if (activeFilter === 'Blood Help') return post.type === 'blood';
    if (activeFilter === 'Missing') return post.type === 'missing';
    if (activeFilter === 'News') return post.type === 'news';
    if (activeFilter === 'Community') return post.type === 'social';
    return true;
  });

  const handleCopyOrCall = (phone: string) => {
    onCallContact(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <div className="divide-y divide-gray-100 bg-gray-50/50 pb-20">
      {filteredPosts.map((post) => {
        // ==================== 1. BLOOD HELP CARD ====================
        if (post.type === 'blood') {
          return (
            <article
              key={post.id}
              id={`card-feed-blood-${post.id}`}
              className="bg-white p-3.5 mb-2 shadow-xs transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white shadow-xs">
                    <Droplet className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 font-normal">
                      {post.timeAgo} • {post.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {post.isPendingSync ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="অফলাইনে পোস্ট তৈরি করা হয়েছে। নেট পেলেই স্বয়ংক্রিয়ভাবে লাইভ হবে">
                      <CloudUpload className="w-3 h-3 text-amber-600 animate-pulse" />
                      অফলাইন
                    </span>
                  ) : post.syncedAt ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="সার্ভারে সিঙ্ক সম্পন্ন">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      সিঙ্কড
                    </span>
                  ) : null}
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
                    জরুরি
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#E53935] text-white tracking-wide">
                    HIGH
                  </span>
                  <button 
                    onClick={() => onSharePost(post)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Content Layout (Matching screenshot image!) */}
              <div className="flex space-x-3 mb-3">
                {/* Left image thumbnail */}
                {post.image && (
                  <div className="w-28 sm:w-32 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative shadow-xs">
                    <img
                      src={post.image}
                      alt="রক্তের ব্যাগ"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {post.bloodDetails?.group}
                    </div>
                  </div>
                )}

                {/* Right text & specifications */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      <span className="text-[#E53935] font-extrabold mr-1">
                        {post.bloodDetails?.group}
                      </span>
                      রক্ত প্রয়োজন
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 mt-1 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center text-gray-700 font-medium">
                        <span className="mr-1">🩸</span>
                        <span>{post.bloodDetails?.bagsNeeded} ব্যাগ প্রয়োজন</span>
                      </div>
                      <div className="flex items-center text-gray-700 font-medium">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{post.bloodDetails?.hospital}</span>
                      </div>
                      <div className="flex items-center text-red-600 font-medium text-[11px]">
                        <span className="mr-1">⏱️</span>
                        <span>{post.bloodDetails?.deadlineHours} ঘণ্টার মধ্যে প্রয়োজন</span>
                        <span className="ml-1 font-bold text-red-700">
                          (⏱️ {post.bloodDetails?.timeRemainingText})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-[#E53935] h-1.5 rounded-full"
                      style={{ width: `${post.bloodDetails?.progressPercent || 68}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <button
                  id={`btn-call-blood-${post.id}`}
                  onClick={() => handleCopyOrCall(post.bloodDetails?.contactPhone || '')}
                  className="flex items-center text-xs font-semibold text-gray-800 hover:text-red-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
                  <span>যোগাযোগ: {post.bloodDetails?.contactPhone}</span>
                  {copiedPhone === post.bloodDetails?.contactPhone && (
                    <span className="ml-2 text-[10px] text-green-600 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-0.5" /> কল/কপি
                    </span>
                  )}
                </button>

                <button
                  id={`btn-assist-blood-${post.id}`}
                  onClick={() => onHelpBlood(post)}
                  className="bg-[#E53935] hover:bg-[#D32F2F] active:scale-95 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-all"
                >
                  সহায়তা করুন
                </button>
              </div>

              {/* Hope Points Indicator */}
              <div className="flex justify-end mt-1">
                <button
                  onClick={onShowHopePointsInfo}
                  className="text-[11px] text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span className="font-semibold text-teal-700">+{post.hopePointsReward || 10} Hope Points</span>
                  <Info className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </article>
          );
        }

        // ==================== 2. MISSING PERSON CARD ====================
        if (post.type === 'missing') {
          return (
            <article
              key={post.id}
              id={`card-feed-missing-${post.id}`}
              className="bg-white p-3.5 mb-2 shadow-xs transition-shadow"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-xs">
                    <Search className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 font-normal">
                      {post.timeAgo} • {post.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {post.isPendingSync ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="অফলাইনে পোস্ট তৈরি করা হয়েছে। নেট পেলেই স্বয়ংক্রিয়ভাবে লাইভ হবে">
                      <CloudUpload className="w-3 h-3 text-amber-600 animate-pulse" />
                      অফলাইন
                    </span>
                  ) : post.syncedAt ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="সার্ভারে সিঙ্ক সম্পন্ন">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      সিঙ্কড
                    </span>
                  ) : null}
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                    নিখোঁজ
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#FEF08A] text-[#854D0E]">
                    খোঁজা হচ্ছে
                  </span>
                  <button 
                    onClick={() => onSharePost(post)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2-Column Content Layout (Matching screenshot image!) */}
              <div className="flex space-x-3 mb-3">
                {/* Left portrait thumbnail */}
                {post.image && (
                  <div className="w-28 sm:w-32 h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-xs relative">
                    <img
                      src={post.image}
                      alt={post.missingDetails?.personName || 'নিখোঁজ ব্যক্তি'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded">
                      ALERT
                    </div>
                  </div>
                )}

                {/* Right text info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      নিখোঁজ: {post.missingDetails?.personName}
                    </h3>

                    <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-4">
                      {post.content}
                    </p>
                  </div>

                  <div className="text-[11px] text-gray-500 font-medium">
                    কেস আইডি: <span className="font-mono text-gray-700 font-semibold">{post.missingDetails?.caseId}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <div className="flex items-center space-x-3">
                  <button
                    id={`btn-share-missing-${post.id}`}
                    onClick={() => onSharePost(post)}
                    className="p-1.5 text-gray-700 hover:text-teal-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Share missing post"
                  >
                    <Share2 className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    id={`btn-call-missing-${post.id}`}
                    onClick={() => handleCopyOrCall(post.missingDetails?.contactPhone || '')}
                    className="p-1.5 text-gray-700 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100"
                    aria-label="Call emergency contact"
                  >
                    <Phone className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <button
                  id={`btn-view-missing-details-${post.id}`}
                  onClick={() => onViewMissingDetails(post)}
                  className="border border-[#00897B] text-[#00897B] hover:bg-teal-50 active:scale-95 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                >
                  <span>বিস্তারিত দেখুন</span>
                  <span className="text-sm leading-none">→</span>
                </button>
              </div>

              {/* Hope Points Indicator */}
              <div className="flex justify-end mt-1">
                <button
                  onClick={onShowHopePointsInfo}
                  className="text-[11px] text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span className="font-semibold text-teal-700">+{post.hopePointsReward || 10} Hope Points</span>
                  <Info className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </article>
          );
        }

        // ==================== 3. DESTI NEWS CARD ====================
        if (post.type === 'news') {
          return (
            <article
              key={post.id}
              id={`card-feed-news-${post.id}`}
              className="bg-white p-3.5 mb-2 shadow-xs transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 font-normal">
                      {post.timeAgo}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onSharePost(post)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Image Banner */}
              {post.image && (
                <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-2.5 bg-gray-100 shadow-xs">
                  <img
                    src={post.image}
                    alt={post.title || 'সংবাদ ছবি'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Body */}
              <h3 className="text-base font-bold text-gray-950 mb-1 leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Footer Engagement (Heart 256, Comment 42, Share 18) */}
              <div className="flex items-center justify-start space-x-6 pt-2 border-t border-gray-100 text-gray-600 text-xs">
                <button
                  id={`btn-like-news-${post.id}`}
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center space-x-1.5 transition-colors ${
                    post.isLiked ? 'text-red-600 font-bold' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-600' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <button
                  id={`btn-comment-news-${post.id}`}
                  onClick={() => onViewMissingDetails(post)}
                  className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </button>

                <button
                  id={`btn-share-news-${post.id}`}
                  onClick={() => onSharePost(post)}
                  className="flex items-center space-x-1.5 hover:text-teal-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{post.shares}</span>
                </button>
              </div>
            </article>
          );
        }

        // ==================== 4. SOCIAL / COMMUNITY CARD ====================
        return (
          <article
            key={post.id}
            id={`card-feed-social-${post.id}`}
            className="bg-white p-3.5 mb-2 shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shadow-xs border border-gray-100"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-gray-900 text-sm">
                      {post.author.name}
                    </span>
                    {post.author.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-normal">
                    {post.timeAgo} {post.location && `• ${post.location}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {post.isPendingSync ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="অফলাইনে পোস্ট তৈরি করা হয়েছে। নেট পেলেই স্বয়ংক্রিয়ভাবে লাইভ হবে">
                    <CloudUpload className="w-3 h-3 text-amber-600 animate-pulse" />
                    অফলাইন
                  </span>
                ) : post.syncedAt ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="সার্ভারে সিঙ্ক সম্পন্ন">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    সিঙ্কড
                  </span>
                ) : null}
                <button 
                  onClick={() => onSharePost(post)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {post.title && (
              <h4 className="text-sm font-bold text-gray-900 mb-1">
                {post.title}
              </h4>
            )}
            <p className="text-xs text-gray-700 leading-relaxed mb-2.5">
              {post.content}
            </p>

            {post.image && (
              <div className="w-full h-44 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img
                  src={post.image}
                  alt="পোস্ট ছবি"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-start space-x-6 pt-2 border-t border-gray-100 text-gray-600 text-xs">
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center space-x-1.5 transition-colors ${
                  post.isLiked ? 'text-red-600 font-bold' : 'hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-600' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => onViewMissingDetails(post)}
                className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button
                onClick={() => onSharePost(post)}
                className="flex items-center space-x-1.5 hover:text-teal-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{post.shares}</span>
              </button>
            </div>
          </article>
        );
      })}

      {filteredPosts.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          এই ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
};

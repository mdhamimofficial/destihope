import React, { useState } from 'react';
import { X, Image, MapPin, Send, WifiOff, Heart, Smile, Sparkles, CheckCircle2 } from 'lucide-react';
import { FeedPost } from '../../types';
import { DIVISION_DISTRICTS_MAP } from '../../data/bangladeshLocations';

interface DestiHopeCreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: FeedPost) => void;
  isOffline?: boolean;
}

const POST_TAGS = [
  '#DestiHope',
  '#মানবিক_সাহায্য',
  '#ভলান্টিয়ার',
  '#রক্তদান',
  '#বাংলাদেশ',
  '#সচেতনতা'
];

const PRESET_IMAGES = [
  { label: 'কমিউনিটি কাজ', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80' },
  { label: 'রক্তদান ক্যাম্পেইন', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80' },
  { label: 'ত্রাণ বিতরণ', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80' },
  { label: 'মেডিকেল ক্যাম্প', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80' }
];

export const DestiHopeCreatePostModal: React.FC<DestiHopeCreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
  isOffline = false,
}) => {
  const [text, setText] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [category, setCategory] = useState<'social' | 'volunteer' | 'news'>('social');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = (tag: string) => {
    if (!text.includes(tag)) {
      setText((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newPost: FeedPost = {
      id: `hope-post-${Date.now()}`,
      type: 'social',
      author: {
        name: 'তানভীর আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        verified: true,
        moduleBadge: 'Hope Member',
        iconBg: 'bg-rose-600'
      },
      timeAgo: 'এইমাত্র',
      location: district,
      title: category === 'volunteer' ? 'ভলান্টিয়ার উদ্যোগ ও সমাজসেবা' : '',
      content: text,
      image: selectedImage || undefined,
      badges: [
        { text: category === 'volunteer' ? 'ভলান্টিয়ার' : 'কমিউনিটি', color: 'text-rose-700', bg: 'bg-rose-50' }
      ],
      likes: 1,
      comments: 0,
      shares: 0,
      isLiked: true,
      hopePointsReward: 10
    };

    onSubmitPost(newPost);
    setText('');
    setSelectedImage(null);
    onClose();
  };

  // Flatten districts for dropdown
  const allDistricts = Object.values(DIVISION_DISTRICTS_MAP).flat();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Desti Hope Branded */}
        <div className="p-4 bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-rose-100">DESTI HOPE</span>
                <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-full font-bold">কমিউনিটি স্টুডিও</span>
              </div>
              <h3 className="font-black text-sm text-white leading-tight">নতুন পোস্ট তৈরি করুন</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-full bg-black/15 hover:bg-black/30 transition-all cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline notice if offline */}
        {isOffline && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center space-x-2 text-xs font-semibold text-amber-800">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>অফলাইন মুড: নেট সংযোগ পেলে স্বয়ংক্রিয়ভাবে পাবলিশ হবে।</span>
          </div>
        )}

        {/* Post Category Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 p-2 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCategory('social')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              category === 'social'
                ? 'bg-white shadow-2xs text-rose-600 border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>সামাজিক পোস্ট</span>
          </button>
          <button
            type="button"
            onClick={() => setCategory('volunteer')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center space-x-1 transition-all ${
              category === 'volunteer'
                ? 'bg-white shadow-2xs text-rose-600 border border-gray-200/80'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>ভলান্টিয়ার স্টোরি</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Text Area */}
          <div className="space-y-1">
            <textarea
              required
              rows={4}
              placeholder={
                category === 'volunteer'
                  ? 'আপনার কোনো ভলান্টিয়ার বা সেবাধর্মী অভিজ্ঞতা শেয়ার করুন...'
                  : 'মানবিক উদ্যোগ, মতামত বা সাহায্য বার্তা শেয়ার করুন...'
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 resize-none transition-all placeholder:text-gray-400"
            />
            <div className="flex justify-between items-center text-[11px] text-gray-400 px-1">
              <span>{text.length} অক্ষর</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> +১০ পয়েন্ট অর্জিত হবে
              </span>
            </div>
          </div>

          {/* Hashtag suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-600">জনপ্রিয় হ্যাশট্যাগ যোগ করুন:</span>
            <div className="flex flex-wrap gap-1.5">
              {POST_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Location Selector */}
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-bold text-xs">আপনার এলাকা / জেলা:</span>
            </div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-white border border-gray-200 text-xs font-bold text-gray-800 py-1.5 px-3 rounded-xl focus:outline-none focus:border-rose-500"
            >
              {allDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Photo Attachment Preview / Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60 cursor-pointer"
              >
                <Image className="w-4 h-4" />
                <span>{selectedImage ? 'ছবি পরিবর্তন করুন' : 'ছবি / ব্যানার যুক্ত করুন'}</span>
              </button>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-[11px] text-gray-500 hover:text-red-500 font-bold"
                >
                  ছবি মুছুন
                </button>
              )}
            </div>

            {selectedImage && (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xs aspect-video">
                <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                  সংযুক্ত ছবি
                </div>
              </div>
            )}

            {showImagePicker && (
              <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-200">
                {PRESET_IMAGES.map((img) => (
                  <div
                    key={img.label}
                    onClick={() => {
                      setSelectedImage(img.url);
                      setShowImagePicker(false);
                    }}
                    className="relative rounded-xl overflow-hidden cursor-pointer border border-gray-200 hover:border-rose-500 transition-all group aspect-video"
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1.5">
                      <span className="text-[10px] font-bold text-white leading-tight">{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>পোস্ট পাবলিশ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

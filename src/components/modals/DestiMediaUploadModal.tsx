import React, { useState } from 'react';
import { X, Clapperboard, Film, Headphones, Upload, Sparkles, Music, Eye, CheckCircle2, Play } from 'lucide-react';
import { MediaItem } from '../../types';

interface DestiMediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMedia: (newMedia: MediaItem) => void;
}

const PRESET_THUMBNAILS = [
  { label: 'রক্তদান সচেতনতা রিলস', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80' },
  { label: 'মানবিক সাহায্য টিম', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80' },
  { label: 'জরুরি অ্যাম্বুলেন্স রেসকিউ', url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=600&q=80' },
  { label: 'মেডিকেল পরামর্শ পডকাস্ট', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80' }
];

const AUDIO_TRACKS = [
  'অরিজিনাল ক্যামেরা অডিও',
  'মানবিক স্নিগ্ধ আবহ সুর (Acoustic)',
  'মোটিভেশনাল ইন্সপিরেশনাল মিউজিক',
  'প্রকৃতি ও পাখির কলকাকলি'
];

export const DestiMediaUploadModal: React.FC<DestiMediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSubmitMedia,
}) => {
  const [mediaType, setMediaType] = useState<'reel' | 'video' | 'audio'>('reel');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('স্বাস্থ্য ও চিকিৎসা');
  const [selectedThumb, setSelectedThumb] = useState(PRESET_THUMBNAILS[0].url);
  const [audioTrack, setAudioTrack] = useState(AUDIO_TRACKS[0]);
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      type: mediaType,
      title: title.trim(),
      creator: {
        name: 'তানভীর আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        isVerified: true,
        subscribers: '১.২K'
      },
      thumbnail: selectedThumb,
      duration: mediaType === 'reel' ? '০০:৪৫' : mediaType === 'audio' ? '০৩:১২' : '০৪:২০',
      views: '১ বার দেখা হয়েছে',
      uploadDate: 'এইমাত্র',
      likes: 1,
      commentsCount: 0,
      category: category
    };

    onSubmitMedia(newMedia);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 text-white rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.25)] border border-purple-500/30 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Creator Studio Top Bar */}
        <div className="p-4 bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-purple-400 font-mono">DESTI MEDIA</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">ক্রিয়েটর স্টুডিও</span>
              </div>
              <h3 className="font-black text-sm text-white">নতুন ভিডিও বা রিলস আপলোড</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/15 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Format Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMediaType('reel')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              mediaType === 'reel'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>শর্ট রিলস (৯:১৬)</span>
          </button>

          <button
            type="button"
            onClick={() => setMediaType('video')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              mediaType === 'video'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>ফুল ভিডিও (১৬:৯)</span>
          </button>

          <button
            type="button"
            onClick={() => setMediaType('audio')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              mediaType === 'audio'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>পডকাস্ট / অডিও</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1 text-xs text-zinc-200">
          {/* Upload Dropzone Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-zinc-900/90 p-4 flex flex-col items-center justify-center text-center space-y-2 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">ভিডিও ফাইল নির্বাচন করুন অথবা ড্রপ করুন</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">MP4, MOV, WebM (সর্বোচ্চ ৫০০ MB পর্যন্ত)</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-purple-900/40 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded-full font-medium">
                {mediaType === 'reel' ? 'রিলস মোড সক্রিয়' : mediaType === 'video' ? 'টিউব মোড সক্রিয়' : 'অডিও ট্র্যাক'}
              </span>
            </div>
          </div>

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-300">ভিডিও / রিলের শিরোনাম *</label>
            <input
              type="text"
              required
              placeholder="একটি আকর্ষণীয় শিরোনাম দিন (যেমন: থ্যালাসেমিয়া রোগীর জন্য যেভাবে সহজে রক্ত খুঁজবেন...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-purple-500 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Caption / Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-300">ক্যাপশন ও হ্যাশট্যাগ</label>
            <textarea
              rows={2}
              placeholder="#DestiMedia #Reels #Health #Humanity বিস্তারিত লিখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-purple-500 text-white placeholder:text-zinc-500 resize-none"
            />
          </div>

          {/* Category & Audio Track */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-medium focus:outline-none focus:border-purple-500"
              >
                <option value="স্বাস্থ্য ও চিকিৎসা">স্বাস্থ্য ও চিকিৎসা</option>
                <option value="মানবিক তথ্যচিত্র">মানবিক তথ্যচিত্র</option>
                <option value="বিজ্ঞান ও প্রযুক্তি">বিজ্ঞান ও প্রযুক্তি</option>
                <option value="বিনোদন ও সমাজ">বিনোদন ও সমাজ</option>
                <option value="জরুরি সচেতনতা">জরুরি সচেতনতা</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1">
                <Music className="w-3 h-3 text-purple-400" />
                <span>ব্যাকগ্রাউন্ড সাউন্ড</span>
              </label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-medium focus:outline-none focus:border-purple-500"
              >
                {AUDIO_TRACKS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Video Thumbnail */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-300">ভিডিও থাম্বনেইল নির্বাচন করুন:</label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_THUMBNAILS.map((thumb) => (
                <div
                  key={thumb.label}
                  onClick={() => setSelectedThumb(thumb.url)}
                  className={`relative rounded-xl overflow-hidden aspect-video cursor-pointer border-2 transition-all ${
                    selectedThumb === thumb.url ? 'border-purple-500 shadow-md shadow-purple-900/50 scale-[1.02]' : 'border-zinc-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9.5px] font-bold text-white truncate">{thumb.label}</span>
                  </div>
                  {selectedThumb === thumb.url && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Visibility & Monetization Badge */}
          <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">ক্রিয়েটর রিওয়ার্ড সক্রিয়</span>
                <span className="text-[10px] text-purple-300">পাবলিশে +১৫ হোপ পয়েন্ট অর্জিত হবে</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-xl border border-zinc-700 text-[10px]">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  visibility === 'public' ? 'bg-purple-600 text-white' : 'text-zinc-400'
                }`}
              >
                পাবলিক
              </button>
              <button
                type="button"
                onClick={() => setVisibility('followers')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  visibility === 'followers' ? 'bg-purple-600 text-white' : 'text-zinc-400'
                }`}
              >
                ফলোয়ার্স
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-800 font-bold transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-purple-900/40 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ভিডিও পাবলিশ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

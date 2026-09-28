import React, { useState } from 'react';
import { X, MessageSquare, Camera, Radio, Users, Sparkles, Send, Smile, Lock, Globe, Clock, Palette } from 'lucide-react';

interface DestiChatCreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitStory: (storyData: { type: string; text: string; bgGradient: string; audience: string }) => void;
}

const STORY_GRADIENTS = [
  { name: 'Emerald Wave', class: 'from-emerald-600 via-teal-700 to-cyan-800' },
  { name: 'Sunset Glow', class: 'from-rose-500 via-orange-600 to-amber-600' },
  { name: 'Midnight Purple', class: 'from-purple-900 via-indigo-900 to-slate-950' },
  { name: 'Deep Crimson', class: 'from-red-700 via-rose-800 to-zinc-950' }
];

const EMOJI_PRESETS = ['❤️', '🩸', '🚑', '🤲', '🌟', '🇧🇩', '✨', '🙏'];

export const DestiChatCreateStoryModal: React.FC<DestiChatCreateStoryModalProps> = ({
  isOpen,
  onClose,
  onSubmitStory,
}) => {
  const [creationType, setCreationType] = useState<'story' | 'broadcast' | 'group'>('story');
  const [storyText, setStoryText] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(STORY_GRADIENTS[0].class);
  const [audience, setAudience] = useState<'contacts' | 'public'>('contacts');

  if (!isOpen) return null;

  const handleAddEmoji = (emoji: string) => {
    setStoryText((prev) => `${prev} ${emoji}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) return;

    onSubmitStory({
      type: creationType,
      text: storyText.trim(),
      bgGradient: selectedGradient,
      audience: audience
    });

    setStoryText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default border border-teal-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Desti Chat */}
        <div className="p-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-teal-100 font-mono">DESTI CHAT</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">স্টোরি ও স্টুডিও</span>
              </div>
              <h3 className="font-black text-sm text-white">স্টোরি বা ব্রডকাস্ট তৈরি করুন</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white rounded-full bg-black/15 hover:bg-black/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creation Type Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-teal-50/60 border-b border-teal-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCreationType('story')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              creationType === 'story'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>২৪ ঘণ্টার স্টোরি</span>
          </button>

          <button
            type="button"
            onClick={() => setCreationType('broadcast')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              creationType === 'broadcast'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>ব্রডকাস্ট চ্যানেল</span>
          </button>

          <button
            type="button"
            onClick={() => setCreationType('group')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              creationType === 'group'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>গ্রুপ বার্তা</span>
          </button>
        </div>

        {/* Live Story Canvas Preview */}
        <div className="p-4 bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`w-full max-w-[280px] aspect-[9/14] rounded-2xl bg-gradient-to-br ${selectedGradient} p-4 text-white shadow-xl flex flex-col justify-between relative border border-white/20`}>
            {/* Story Top Info */}
            <div className="flex items-center justify-between text-white/90 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center font-bold text-xs">
                  তা
                </div>
                <span className="font-bold">আমার স্ট্যাটাস</span>
              </div>
              <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <Clock className="w-2.5 h-2.5" /> ২৪ ঘণ্টা
              </span>
            </div>

            {/* Story Centered Content */}
            <div className="my-auto text-center px-2">
              <p className="text-base sm:text-lg font-bold leading-relaxed break-words drop-shadow-md">
                {storyText || 'আপনার মনের কথা, অনুভূতি বা জরুরি আপডেট লিখুন...'}
              </p>
            </div>

            {/* Story Bottom Badge */}
            <div className="text-center">
              <span className="text-[10px] text-white/70 font-mono tracking-wider">
                DESTI CHAT MY DAY
              </span>
            </div>
          </div>
        </div>

        {/* Controls Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Story Text Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">স্টোরি টেক্সট লিখুন *</label>
            <input
              type="text"
              required
              placeholder="একটি আকর্ষণীয় স্ট্যাটাস লিখুন..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 font-medium"
            />
          </div>

          {/* Quick Emojis */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-gray-500 shrink-0">ইমোজি:</span>
            {EMOJI_PRESETS.map((emo) => (
              <button
                key={emo}
                type="button"
                onClick={() => handleAddEmoji(emo)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-teal-50 hover:scale-110 flex items-center justify-center text-sm transition-all shrink-0 cursor-pointer"
              >
                {emo}
              </button>
            ))}
          </div>

          {/* Background Gradient Palette */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              <span>ব্যাকগ্রাউন্ড থিম নির্বাচন করুন:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {STORY_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setSelectedGradient(g.class)}
                  className={`h-9 rounded-xl bg-gradient-to-r ${g.class} border-2 transition-all cursor-pointer ${
                    selectedGradient === g.class ? 'border-white shadow-md ring-2 ring-teal-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          {/* Audience selection */}
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-200 flex items-center justify-between">
            <span className="font-bold text-gray-700 flex items-center gap-1 text-xs">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>কারা দেখতে পাবে:</span>
            </span>
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setAudience('contacts')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  audience === 'contacts' ? 'bg-teal-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                আমার কন্টাক্টস
              </button>
              <button
                type="button"
                onClick={() => setAudience('public')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  audience === 'public' ? 'bg-teal-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                পাবলিক
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
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
              disabled={!storyText.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-600 hover:opacity-95 disabled:opacity-50 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-teal-700/30 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>স্টোরি পোস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Brain, Stethoscope, HelpCircle, Swords, Image, Sparkles, Send, Bot, CheckCircle2 } from 'lucide-react';
import { BrainQuestion } from '../../types';

interface DestiBrainCreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTopic: (newQuestion: BrainQuestion) => void;
}

const DEPARTMENTS = [
  'মেডিসিন ও প্যাথলজি',
  'শিশু রোগ ও নিউট্রিশন',
  'সার্জারি ও ফার্স্ট এইড',
  'ফার্মেসি ও ড্রাগ ইন্টারঅ্যাকশন',
  'কম্পিউটার সায়েন্স ও এআই',
  'জীববিজ্ঞান ও জিনোমিক্স'
];

export const DestiBrainCreateTopicModal: React.FC<DestiBrainCreateTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmitTopic,
}) => {
  const [topicType, setTopicType] = useState<'clinical' | 'qa' | 'debate'>('clinical');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('#মেডিসিন #ক্লিনিক্যাল_কেস');
  const [enableAiDoc, setEnableAiDoc] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newQuestion: BrainQuestion = {
      id: `brain-q-${Date.now()}`,
      title: title.trim(),
      category: department,
      author: 'তানভীর আহমেদ',
      votes: 1,
      answersCount: 1,
      timeAgo: 'এইমাত্র',
      tags: tags.split(' ').filter(Boolean)
    };

    onSubmitTopic(newQuestion);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default border border-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Desti Brain */}
        <div className="p-4 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-amber-200 font-mono">DESTI BRAIN</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">মেডিকেল ও লার্নিং</span>
              </div>
              <h3 className="font-black text-sm text-white">নতুন কেস স্টাডি বা প্রশ্ন পোস্ট</h3>
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

        {/* Topic Type Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-amber-50/60 border-b border-amber-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setTopicType('clinical');
              setTags('#মেডিসিন #ক্লিনিক্যাল_কেস');
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              topicType === 'clinical'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>ক্লিনিক্যাল কেস</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicType('qa');
              setTags('#প্রশ্ন #পরামর্শ #টিউটোরিয়াল');
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              topicType === 'qa'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>প্রশ্নোত্তর</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTopicType('debate');
              setTags('#ডিবেট #এআই_বিতর্ক #মতবিনিময়');
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              topicType === 'debate'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>এআই ডিবেট</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Department selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">বিষয় বা মেডিকেল ডিপার্টমেন্ট *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-amber-500"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">
              {topicType === 'clinical' 
                ? 'ক্লিনিক্যাল সিনড্রোম বা রোগীর উপসর্গের শিরোনাম *'
                : topicType === 'debate'
                ? 'ডিবেট প্রস্তাবনা (Motion) *'
                : 'আপনার প্রশ্ন সংক্ষেপে লিখুন *'}
            </label>
            <input
              type="text"
              required
              placeholder={
                topicType === 'clinical'
                  ? 'যেমন: তীব্র পেটে ব্যথা ও উচ্চ জ্বরের সাথে প্লাটিলেট কমে যাওয়ার সম্ভাব্য কারণ...'
                  : topicType === 'debate'
                  ? 'যেমন: চিকিৎসাক্ষেত্রে এআই ডায়াগনসিস মানুষের চেয়ে বেশি নির্ভুল...'
                  : 'যেমন: রক্তদানের পর প্লাটিলেট আবার কখন স্বাভাবিক মাত্রায় পৌঁছায়?'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Details / Symptoms */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">বিস্তারিত বিবরণ ও উপসর্গ / তথ্য</label>
            <textarea
              rows={4}
              placeholder="রোগীর পূর্ব ইতিহাস, ল্যাব রিপোর্টের মানদণ্ড অথবা প্রশ্নের পটভূমি বিস্তারিত লিখুন..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">হ্যাশট্যাগ ও কিওয়ার্ড</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 text-amber-800 font-medium"
            />
          </div>

          {/* AI Doctor Triage Toggle */}
          <div 
            onClick={() => setEnableAiDoc(!enableAiDoc)}
            className="flex items-center space-x-2.5 bg-amber-50/70 p-3 rounded-2xl border border-amber-200 cursor-pointer select-none"
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              enableAiDoc ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-300 bg-white'
            }`}>
              {enableAiDoc && <Bot className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>Desti AI ডক্টর তাৎক্ষণিক অটো-ট্রায়াজ সক্রিয় রাখুন</span>
              </span>
              <span className="text-[10px] text-gray-500">পোস্ট হওয়ার সাথে সাথে এআই ক্লিনিক্যাল রেফারেন্স সহ প্রথম বিশ্লেষণ তৈরি করবে।</span>
            </div>
          </div>

          {/* Reward badge */}
          <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between text-indigo-900">
            <span className="text-[11px] font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>নলেজ কন্ট্রিবিউটর রিওয়ার্ড</span>
            </span>
            <span className="text-xs font-black text-indigo-700">+১৫ হোপ পয়েন্ট</span>
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
              disabled={!title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:opacity-95 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-amber-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>কেস সাবমিট করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

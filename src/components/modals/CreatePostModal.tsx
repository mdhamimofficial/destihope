import React, { useState } from 'react';
import { X, Droplet, Search, MessageSquare, Image, MapPin, Send, Check, WifiOff, CloudUpload } from 'lucide-react';
import { FeedPost } from '../../types';
import { DIVISION_DISTRICTS_MAP } from '../../data/bangladeshLocations';
import { getNextCaseId, peekNextCaseId, SUPPORTED_COUNTRIES } from '../../utils/caseIdGenerator';
import { useLanguage } from '../../context/LanguageContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPost: FeedPost) => void;
  isOffline?: boolean;
}

type PostType = 'social' | 'blood' | 'missing';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
  isOffline = false,
}) => {
  const { l } = useLanguage();
  const [postType, setPostType] = useState<PostType>('social');
  const [text, setText] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  
  // Blood fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [bags, setBags] = useState(1);
  const [hospital, setHospital] = useState('');
  const [contactPhone, setContactPhone] = useState('01712-345678');
  const [urgencyHours, setUrgencyHours] = useState(4);

  // Missing fields
  const [missingName, setMissingName] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [clothing, setClothing] = useState('');
  const [missingCountry, setMissingCountry] = useState('BD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() && postType === 'social') return;

    let newPost: FeedPost;

    if (postType === 'blood') {
      newPost = {
        id: `blood-${Date.now()}`,
        type: 'blood',
        author: {
          name: 'DestiBloodBank',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          verified: true,
          moduleBadge: 'Care',
          iconBg: 'bg-red-500'
        },
        timeAgo: 'এইমাত্র',
        location: district,
        badges: [
          { text: 'জরুরি', color: 'text-red-700', bg: 'bg-red-100' },
          { text: 'URGENT', color: 'text-white', bg: 'bg-red-600' }
        ],
        image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=400&q=80',
        title: `${bloodGroup} রক্ত প্রয়োজন`,
        content: text || `${hospital || 'হাসপাতালে'} একজন রোগীর জন্য জরুরি ভিত্তিতে ${bloodGroup} রক্ত প্রয়োজন।`,
        bloodDetails: {
          group: bloodGroup,
          bagsNeeded: bags,
          hospital: hospital || 'ঢাকা মেডিকেল কলেজ হাসপাতাল',
          deadlineHours: urgencyHours,
          timeRemainingText: `০${urgencyHours}:০০:০০ বাকি`,
          progressPercent: 20,
          contactPhone: contactPhone
        },
        likes: 1,
        comments: 0,
        shares: 0,
        hopePointsReward: 10
      };
    } else if (postType === 'missing') {
      newPost = {
        id: `missing-${Date.now()}`,
        type: 'missing',
        author: {
          name: 'DestiFind',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          verified: true,
          moduleBadge: 'Find',
          iconBg: 'bg-teal-600'
        },
        timeAgo: 'এইমাত্র',
        location: district,
        badges: [
          { text: 'নিখোঁজ', color: 'text-amber-800', bg: 'bg-orange-100' },
          { text: 'খোঁজা হচ্ছে', color: 'text-yellow-900', bg: 'bg-amber-200' }
        ],
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        title: `নিখোঁজ: ${missingName || 'অজ্ঞাত ব্যক্তি'}`,
        content: text || `${lastSeenLocation} থেকে নিখোঁজ হয়েছেন। পরনে ছিল ${clothing}। সন্ধান পেলে যোগাযোগ করুন।`,
        missingDetails: {
          personName: missingName || 'ব্যক্তির নাম',
          lastSeenDate: 'আজকে',
          lastSeenLocation: lastSeenLocation || district,
          clothingDescription: clothing || 'সাধারণ পোশাক',
          caseId: getNextCaseId(missingCountry),
          status: 'Searching',
          contactPhone: contactPhone
        },
        likes: 2,
        comments: 0,
        shares: 1,
        hopePointsReward: 10
      };
    } else {
      newPost = {
        id: `social-${Date.now()}`,
        type: 'social',
        author: {
          name: 'তানভীর আহমেদ',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          verified: true
        },
        timeAgo: 'এইমাত্র',
        location: district,
        title: '',
        content: text,
        likes: 0,
        comments: 0,
        shares: 0
      };
    }

    onSubmitPost(newPost);
    setText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{l('নতুন পোস্ট তৈরি করুন', 'Create New Post')}</h3>
            {isOffline && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5">
                <WifiOff className="w-3 h-3" />
                {l('অফলাইন মুডে তৈরি হচ্ছে (নেট আসলে সিঙ্ক হবে)', 'Creating offline (will sync when online)')}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 -mr-2 -my-2 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 active:bg-gray-200 active:scale-90 transition-all cursor-pointer touch-manipulation"
            aria-label={l('বন্ধ করুন', 'Close')}
            title={l('বন্ধ করুন', 'Close')}
          >
            <X className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPostType('social')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors ${
              postType === 'social' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>{l('সাধারণ', 'General')}</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType('blood')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors ${
              postType === 'blood' ? 'bg-white shadow-xs text-red-600 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-red-600" />
            <span>{l('রক্ত প্রয়োজন', 'Blood Request')}</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType('missing')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors ${
              postType === 'missing' ? 'bg-white shadow-xs text-teal-700 font-bold' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-teal-600" />
            <span>{l('নিখোঁজ ব্যক্তি', 'Missing Person')}</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Main textarea */}
          <div>
            <textarea
              required={postType === 'social'}
              rows={3}
              placeholder={
                postType === 'social'
                  ? l('আপনার মতামত লিখুন বা অভিজ্ঞতা শেয়ার করুন...', 'Share your thoughts, updates or experience...')
                  : postType === 'blood'
                  ? l('রোগীর সমস্যা বা প্রয়োজনীয় অতিরিক্ত তথ্য লিখুন...', 'Details of patient condition and requirements...')
                  : l('নিখোঁজ ব্যক্তির বিবরণ ও পরিচিতি লিখুন...', 'Details and identification of missing person...')
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Blood-Specific Fields */}
          {postType === 'blood' && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('রক্তের গ্রুপ', 'Blood Group')}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-bold text-red-600"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('প্রয়োজনীয় ব্যাগ', 'Bags Needed')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bags}
                    onChange={(e) => setBags(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  {l('হাসপাতালের নাম', 'Hospital Name')}
                </label>
                <input
                  type="text"
                  placeholder={l('যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল', 'e.g. Dhaka Medical College Hospital')}
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('জরুরি সময় (ঘণ্টা)', 'Urgency Deadline (Hours)')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={urgencyHours}
                    onChange={(e) => setUrgencyHours(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('জরুরি যোগাযোগ নম্বর', 'Contact Phone Number')}
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Missing-Specific Fields */}
          {postType === 'missing' && (
            <div className="bg-teal-50 p-3 rounded-xl border border-teal-100 space-y-2.5">
              {/* Country and Auto Case ID preview */}
              <div className="bg-white p-2 rounded-lg border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-gray-700">{l('দেশ কোড:', 'Country Code:')}</span>
                  <select
                    value={missingCountry}
                    onChange={(e) => setMissingCountry(e.target.value)}
                    className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded px-2 py-0.5"
                  >
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-gray-500">{l('জেনারেটেড কেস আইডি:', 'Generated Case ID:')}</span>
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-300">
                    {peekNextCaseId(missingCountry)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  {l('নিখোঁজ ব্যক্তির নাম', 'Missing Person Name')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={l('যেমন: সামিউল ইসলাম', 'e.g. Samiul Islam')}
                  value={missingName}
                  onChange={(e) => setMissingName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('সর্বশেষ দেখা যাওয়ার স্থান', 'Last Seen Location')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={l('আগ্রাবাদ, চট্টগ্রাম', 'Agrabad, Chittagong')}
                    value={lastSeenLocation}
                    onChange={(e) => setLastSeenLocation(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {l('জরুরি ফোন নম্বর', 'Emergency Phone Number')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  {l('পোশাকের বর্ণনা', 'Clothing Description')}
                </label>
                <input
                  type="text"
                  placeholder={l('যেমন: নীল টি-শার্ট ও কালো জিন্স', 'e.g. Blue t-shirt and dark jeans')}
                  value={clothing}
                  onChange={(e) => setClothing(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Location tag */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-xs font-semibold text-gray-600 shrink-0">{l('জেলা:', 'District:')}</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-gray-200 bg-white font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none max-w-[200px]"
            >
              {Object.entries(DIVISION_DISTRICTS_MAP)
                .sort(([divA], [divB]) => divA.localeCompare(divB, 'bn'))
                .map(([division, districts]) => (
                  <optgroup key={division} label={`${division} ${l('বিভাগ', 'Division')}`}>
                    {[...districts]
                      .sort((a, b) => a.localeCompare(b, 'bn'))
                      .map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
          </div>

          {/* Submit button */}
          <div className="pt-2 border-t border-gray-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              {l('বাতিল', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
            >
              {isOffline ? (
                <>
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>{l('অফলাইনে সেভ করুন', 'Save Offline')}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{l('পোস্ট করুন', 'Post')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

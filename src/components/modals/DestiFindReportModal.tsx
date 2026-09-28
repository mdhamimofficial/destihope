import React, { useState } from 'react';
import { X, UserSearch, Radio, Shield, MapPin, Phone, Calendar, Image, Send, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { FeedPost } from '../../types';
import { DIVISION_DISTRICTS_MAP } from '../../data/bangladeshLocations';
import { getNextCaseId, peekNextCaseId, SUPPORTED_COUNTRIES } from '../../utils/caseIdGenerator';

interface DestiFindReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (newPost: FeedPost) => void;
}

const PRESET_MISSING_PHOTOS = [
  { label: 'কিশোর বালক', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { label: 'কিশোরী বালিকা', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { label: 'বয়োজ্যেষ্ঠ ব্যক্তি', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { label: 'শিশু', url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=400&q=80' }
];

export const DestiFindReportModal: React.FC<DestiFindReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reportType, setReportType] = useState<'missing_person' | 'lost_item' | 'found'>('missing_person');
  const [selectedCountry, setSelectedCountry] = useState('BD');
  const [personName, setPersonName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('পুরুষ');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [lastSeenDate, setLastSeenDate] = useState('আজ সকাল');
  const [clothing, setClothing] = useState('');
  const [contactPhone, setContactPhone] = useState('01712-345678');
  const [gdNumber, setGdNumber] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_MISSING_PHOTOS[0].url);
  const [radarAlert, setRadarAlert] = useState(true);

  if (!isOpen) return null;

  const allDistricts = Object.values(DIVISION_DISTRICTS_MAP).flat();
  const caseId = peekNextCaseId(selectedCountry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    const actualCaseId = getNextCaseId(selectedCountry);
    const titleText = reportType === 'missing_person' 
      ? `নিখোঁজ: ${personName} (${age ? `${age} বছর` : gender})`
      : reportType === 'lost_item'
      ? `হারিয়ে গেছে: ${personName}`
      : `উদ্ধারকৃত: ${personName}`;

    const contentText = `${lastSeenLocation || district} থেকে নিখোঁজ হয়েছেন। পরনে ছিল: ${clothing || 'সাধারণ পোশাক'}। কোনো সহৃদয় ব্যক্তি সন্ধান পেলে দ্রুত পরিবারের যোগাযোগ নম্বরে অথবা নিকটস্থ থানায় অবহিত করুন। জিডি নং: ${gdNumber || 'প্রক্রিয়াধীন'}।`;

    const newPost: FeedPost = {
      id: `missing-${Date.now()}`,
      type: 'missing',
      author: {
        name: 'DestiFind ব্যুরো',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        verified: true,
        moduleBadge: 'Find Bureau',
        iconBg: 'bg-teal-600'
      },
      timeAgo: 'এইমাত্র',
      location: district,
      badges: [
        { text: '🚨 নিখোঁজ বুলেটিন', color: 'text-white', bg: 'bg-teal-700' },
        { text: actualCaseId, color: 'text-amber-800', bg: 'bg-amber-100' }
      ],
      image: selectedPhoto,
      title: titleText,
      content: contentText,
      missingDetails: {
        personName: personName,
        lastSeenDate: lastSeenDate,
        lastSeenLocation: `${lastSeenLocation ? `${lastSeenLocation}, ` : ''}${district}`,
        clothingDescription: clothing || 'সাধারণ পোশাক',
        caseId: actualCaseId,
        status: 'Searching',
        contactPhone: contactPhone
      },
      likes: 3,
      comments: 0,
      shares: 2,
      hopePointsReward: 15
    };

    onSubmitReport(newPost);
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
        {/* Header: Desti Find Registry */}
        <div className="p-4 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <UserSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-teal-200 font-mono">DESTI FIND</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">নিখোঁজ ব্যুরো</span>
              </div>
              <h3 className="font-black text-sm text-white">নিখোঁজ ব্যক্তি ও সন্ধান এন্ট্রি</h3>
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

        {/* Report Type Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-teal-50/60 border-b border-teal-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => setReportType('missing_person')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              reportType === 'missing_person'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <UserSearch className="w-3.5 h-3.5" />
            <span>নিখোঁজ ব্যক্তি</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('lost_item')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              reportType === 'lost_item'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>হারানো ডকুমেন্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType('found')}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              reportType === 'found'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>উদ্ধারকৃত সন্ধান</span>
          </button>
        </div>

        {/* Country & Live Case ID Preview */}
        <div className="bg-emerald-50/70 px-4 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-gray-700">দেশ কোড:</span>
            <div className="flex gap-1">
              {SUPPORTED_COUNTRIES.slice(0, 3).map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                    selectedCountry === c.code ? 'bg-white border-teal-600 text-teal-800' : 'bg-transparent border-gray-300 text-gray-600'
                  }`}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-gray-500">কেস আইডি:</span>
            <span className="font-mono font-black text-xs text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
              {caseId}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {/* Person Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">
              {reportType === 'missing_person' ? 'নিখোঁজ ব্যক্তির পুরো নাম *' : 'হারানো বস্তু বা ব্যক্তির নাম *'}
            </label>
            <input
              type="text"
              required
              placeholder="যেমন: সায়মা আক্তার (অথবা অজ্ঞাত ব্যক্তি)"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">বয়স (বছর)</label>
              <input
                type="number"
                placeholder="যেমন: ১২"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">লিঙ্গ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:outline-none focus:border-teal-500"
              >
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
                <option value="শিশু">শিশু</option>
              </select>
            </div>
          </div>

          {/* Last Seen Date & Location */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>নিখোঁজের তারিখ ও সময়</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: ২১ সেপ্টেম্বর, সকাল ৯টা"
                value={lastSeenDate}
                onChange={(e) => setLastSeenDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>জেলা / বিভাগ</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-teal-500"
              >
                {allDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Last Seen Location Landmark */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">শেষ দেখার সুনির্দিষ্ট স্থান / ল্যান্ডমার্ক</label>
            <input
              type="text"
              placeholder="যেমন: ফার্মগেট ওভারব্রিজ সংলগ্ন বাসস্ট্যান্ড"
              value={lastSeenLocation}
              onChange={(e) => setLastSeenLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Clothing & Physical details */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">পরনের পোশাক ও শারীরিক কোনো বিশেষ চিহ্ন</label>
            <textarea
              rows={2}
              placeholder="যেমন: নীল রঙের টি-শার্ট ও কালো প্যান্ট। বাঁ চোখের নিচে জন্মদাগ রয়েছে..."
              value={clothing}
              onChange={(e) => setClothing(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Photo Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-teal-600" />
              <span>ছবি নির্বাচন করুন (ফেস ভেরিফাইড)</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_MISSING_PHOTOS.map((p) => (
                <div
                  key={p.label}
                  onClick={() => setSelectedPhoto(p.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                    selectedPhoto === p.url ? 'border-teal-600 shadow-sm scale-102' : 'border-gray-200 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-0.5 text-center">
                    <span className="text-[9px] text-white font-medium">{p.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & GD Info */}
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>পরিবারের ফোন নম্বর *</span>
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white font-mono font-bold text-gray-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span>থানার জিডি নম্বর (GD No)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: জিডি নং ৮৮২ (ঐচ্ছিক)"
                value={gdNumber}
                onChange={(e) => setGdNumber(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white font-mono text-gray-900 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Radar Push Alert Toggle */}
          <div 
            onClick={() => setRadarAlert(!radarAlert)}
            className="flex items-center space-x-2.5 bg-teal-50 p-3 rounded-2xl border border-teal-200 cursor-pointer select-none"
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              radarAlert ? 'bg-teal-700 border-teal-700 text-white' : 'border-gray-300 bg-white'
            }`}>
              {radarAlert && <Radio className="w-3.5 h-3.5 text-white animate-spin" />}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-teal-700" />
                <span>DestiFind রাডার জরুরি পুশ অ্যালার্ট</span>
              </span>
              <span className="text-[10px] text-gray-500">নিকটস্থ ৫ কিমি ব্যাসার্ধের সকল সক্রিয় ভলান্টিয়ারের ফোনে নোটিফিকেশন পাঠাবে।</span>
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
              className="px-6 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-teal-700/30 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>নিখোঁজ বুলেটিন জারি করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

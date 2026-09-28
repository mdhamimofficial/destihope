import React, { useState } from 'react';
import { X, Droplet, Siren, Building2, MapPin, Phone, Clock, AlertTriangle, Send, Sparkles, Check, Car } from 'lucide-react';
import { FeedPost } from '../../types';
import { DIVISION_DISTRICTS_MAP } from '../../data/bangladeshLocations';

interface DestiCareBloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBloodRequest: (newPost: FeedPost) => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const COMMON_REASONS = [
  'সিজারিয়ান অপারেশন',
  'সড়ক দুর্ঘটনা ও ট্রমা',
  'ডেঙ্গু প্লাটিলেট প্রয়োজন',
  'থ্যালাসেমিয়া নিয়মিত রক্তদান',
  'হৃদরোগ ও বাইপাস সার্জারি',
  'অন্যান্য জরুরি অপারেশন'
];

export const DestiCareBloodRequestModal: React.FC<DestiCareBloodRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmitBloodRequest,
}) => {
  const [urgencyLevel, setUrgencyLevel] = useState<'emergency' | 'today' | 'scheduled'>('emergency');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [bags, setBags] = useState(1);
  const [reason, setReason] = useState(COMMON_REASONS[0]);
  const [hospital, setHospital] = useState('');
  const [bedInfo, setBedInfo] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [contactPhone, setContactPhone] = useState('01712-345678');
  const [altPhone, setAltPhone] = useState('');
  const [provideTravelCost, setProvideTravelCost] = useState(true);
  const [urgencyHours, setUrgencyHours] = useState(4);
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const allDistricts = Object.values(DIVISION_DISTRICTS_MAP).flat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hospitalName = hospital.trim() || 'ঢাকা মেডিকেল কলেজ হাসপাতাল';
    const postTitle = `${bloodGroup} জরুরি রক্ত প্রয়োজন (${bags} ব্যাগ)`;
    const postContent = `রোগীর সমস্যা: ${reason}। স্থান: ${hospitalName} ${bedInfo ? `(বেড/কেবিন: ${bedInfo})` : ''}, ${district}। ${provideTravelCost ? 'ডোনারকে যাতায়াত খরচ প্রদান করা হবে।' : ''} ${customNotes ? `অতিরিক্ত তথ্য: ${customNotes}` : ''}`;

    const newBloodPost: FeedPost = {
      id: `blood-${Date.now()}`,
      type: 'blood',
      author: {
        name: 'DestiCare ডিসপ্যাচার',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        verified: true,
        moduleBadge: 'Emergency Dispatcher',
        iconBg: 'bg-rose-600'
      },
      timeAgo: 'এইমাত্র',
      location: district,
      badges: [
        { text: urgencyLevel === 'emergency' ? '🚨 অতি জরুরি' : 'রক্ত প্রয়োজন', color: 'text-white', bg: 'bg-rose-600' },
        { text: `${bags} ব্যাগ`, color: 'text-rose-700', bg: 'bg-rose-50' }
      ],
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=600&q=80',
      title: postTitle,
      content: postContent,
      bloodDetails: {
        group: bloodGroup,
        bagsNeeded: bags,
        hospital: hospitalName,
        deadlineHours: urgencyHours,
        timeRemainingText: `০${urgencyHours}:০০:০০ বাকি`,
        progressPercent: 15,
        contactPhone: contactPhone
      },
      likes: 2,
      comments: 0,
      shares: 1,
      hopePointsReward: 15
    };

    onSubmitBloodRequest(newBloodPost);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Medical Dispatcher Header */}
        <div className="p-4 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner relative">
              <Droplet className="w-5 h-5 text-white fill-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-rose-100 font-mono">DESTI CARE</span>
                <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-full font-bold">ইমার্জেন্সি ডিসপ্যাচ</span>
              </div>
              <h3 className="font-black text-sm text-white">জরুরি রক্তের আবেদন ফর্ম</h3>
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

        {/* Urgency Level Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-rose-50/60 border-b border-rose-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setUrgencyLevel('emergency');
              setUrgencyHours(2);
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              urgencyLevel === 'emergency'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Siren className="w-3.5 h-3.5 animate-pulse" />
            <span>🚨 অতি জরুরি (১-২ ঘণ্টা)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUrgencyLevel('today');
              setUrgencyHours(6);
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              urgencyLevel === 'today'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>🟡 আজকেই প্রয়োজন</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUrgencyLevel('scheduled');
              setUrgencyHours(24);
            }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              urgencyLevel === 'scheduled'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200/70'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>🟢 নির্ধারিত অপারেশন</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Blood Group Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>কাঙ্ক্ষিত রক্তের গ্রুপ নির্বাচন করুন *</span>
              </label>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {bloodGroup} গ্রুপ নির্বাচিত
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setBloodGroup(grp)}
                  className={`py-2 rounded-xl font-black text-sm border transition-all cursor-pointer ${
                    bloodGroup === grp
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs scale-102'
                      : 'bg-white border-gray-200 text-gray-800 hover:border-rose-300 hover:bg-rose-50/50'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Bags Stepper & Reason */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">রক্তের ব্যাগ সংখ্যা</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setBags((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="flex-1 text-center font-black text-sm text-rose-600">{bags} ব্যাগ</span>
                <button
                  type="button"
                  onClick={() => setBags((prev) => Math.min(10, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">রক্তদানের সময়সীমা (ঘণ্টা)</label>
              <select
                value={urgencyHours}
                onChange={(e) => setUrgencyHours(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-bold text-gray-800 focus:outline-none focus:border-rose-500"
              >
                <option value={2}>২ ঘণ্টার মধ্যে (ইমার্জেন্সি)</option>
                <option value={4}>৪ ঘণ্টার মধ্যে</option>
                <option value={8}>৮ ঘণ্টার মধ্যে</option>
                <option value={12}>১২ ঘণ্টার মধ্যে</option>
                <option value={24}>২৪ ঘণ্টার মধ্যে</option>
              </select>
            </div>
          </div>

          {/* Reason / Diagnosis */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">রোগীর সমস্যা / অপারেশনের ধরন</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:border-rose-500"
            >
              {COMMON_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Hospital & Location */}
          <div className="space-y-2.5 bg-gray-50 p-3 rounded-2xl border border-gray-200/80">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>হাসপাতালের নাম *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ঢাকা মেডিকেল"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">কেবিন / বেড / ওয়ার্ড নং</label>
                <input
                  type="text"
                  placeholder="যেমন: ওয়ার্ড ৫, বেড ১২"
                  value={bedInfo}
                  onChange={(e) => setBedInfo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>জেলা / বিভাগ</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-white border border-gray-200 font-bold text-gray-800 focus:outline-none focus:border-rose-500"
              >
                {allDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>যোগাযোগের ফোন *</span>
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-mono font-bold text-gray-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700">বিকল্প ইমার্জেন্সি নম্বর</label>
              <input
                type="tel"
                placeholder="018... (ঐচ্ছিক)"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-mono text-gray-900 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Travel cost assistance toggle */}
          <div 
            onClick={() => setProvideTravelCost(!provideTravelCost)}
            className="flex items-center space-x-2.5 bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 cursor-pointer select-none"
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              provideTravelCost ? 'bg-rose-600 border-rose-600 text-white' : 'border-gray-300 bg-white'
            }`}>
              {provideTravelCost && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-gray-900 block flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-rose-600" />
                <span>ডোনারকে যাতায়াত খরচ প্রদান করা হবে</span>
              </span>
              <span className="text-[10px] text-gray-500">দূরবর্তী এলাকার স্বেচ্ছাসেবী ডোনারদের দ্রুত উপস্থিতিতে সহায়তা করবে।</span>
            </div>
          </div>

          {/* Custom details */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700">অতিরিক্ত কোনো নির্দেশনা থাকলে লিখুন</label>
            <textarea
              rows={2}
              placeholder="যেমন: রোগীর বয়স, রক্তের ক্রসম্যাচিং স্যাম্পল রেডি আছে কিনা ইত্যাদি..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-rose-500 resize-none"
            />
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
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:opacity-95 text-white rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>জরুরি আবেদন প্রচার করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

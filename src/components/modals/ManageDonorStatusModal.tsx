import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Check, 
  Droplet,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserProfile, DonorWillingnessStatus } from '../../types';
import { ALL_DISTRICTS, DISTRICT_UPAZILAS_MAP } from '../../data/bangladeshLocations';

interface ManageDonorStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

export const ManageDonorStatusModal: React.FC<ManageDonorStatusModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave
}) => {
  const [willingness, setWillingness] = useState<DonorWillingnessStatus>(
    currentUser.donorWillingness || (currentUser.isDonorAvailable ? 'available' : 'unavailable')
  );
  const [months, setMonths] = useState<number>(currentUser.availableAfterMonths || 2);
  const [bloodGroup, setBloodGroup] = useState<string>(currentUser.bloodGroup || 'O+');
  const [district, setDistrict] = useState<string>(currentUser.district || 'ঢাকা');
  const [upazila, setUpazila] = useState<string>(currentUser.area || 'ধানমন্ডি');
  const [phone, setPhone] = useState<string>(currentUser.phone || '01700-000000');
  const [donations, setDonations] = useState<number>(currentUser.stats?.donations ?? 4);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setWillingness(currentUser.donorWillingness || (currentUser.isDonorAvailable ? 'available' : 'unavailable'));
      setMonths(currentUser.availableAfterMonths || 2);
      setBloodGroup(currentUser.bloodGroup || 'O+');
      setDistrict(currentUser.district || 'ঢাকা');
      setUpazila(currentUser.area || 'ধানমন্ডি');
      setPhone(currentUser.phone || '01700-000000');
      setDonations(currentUser.stats?.donations ?? 4);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Calculate future date label based on chosen months
  const getFutureMonthName = (m: number) => {
    const banglaMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const now = new Date();
    const futureDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const bengaliYear = (futureDate.getFullYear()).toString();
    const monthName = banglaMonths[futureDate.getMonth()];
    return `${monthName} ${bengaliYear}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateNote = willingness === 'after_months' ? `${months} মাস পর প্রস্তুত (${getFutureMonthName(months)})` : '';
    
    onSave({
      bloodGroup,
      district,
      area: upazila,
      phone,
      isDonorAvailable: willingness === 'available',
      donorWillingness: willingness,
      availableAfterMonths: willingness === 'after_months' ? months : undefined,
      availableDateNote: dateNote,
      stats: {
        ...(currentUser.stats || { rescuesAssisted: 2, answersGiven: 8, postsCount: 5 }),
        donations: Math.max(0, donations)
      }
    });
    onClose();
  };

  const availableUpazilas = DISTRICT_UPAZILAS_MAP[district] || ['সদর'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-h-[92vh] sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Top Handle for mobile */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-red-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">রক্তদান ইচ্ছুকতার স্ট্যাটাস</h3>
              <p className="text-[11px] text-gray-500 font-medium">আপনার প্রাপ্যতা ও সময়সূচি নির্ধারণ করুন</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors border border-gray-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main 3 Options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              আপনি কি রক্ত দিতে ইচ্ছুক?
            </label>

            <div className="grid grid-cols-1 gap-2">
              {/* Option 1: রক্ত দিতে ইচ্ছুক (এখনই প্রস্তুত) */}
              <label
                onClick={() => setWillingness('available')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  willingness === 'available'
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    willingness === 'available' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      আমি রক্ত দিতে ইচ্ছুক (এখনই প্রস্তুত)
                      {willingness === 'available' && (
                        <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                          সক্রিয়
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      যেকোনো মুমূর্ষু রোগীর প্রয়োজনে বা জরুরি সময়ে আপনি রক্তদান করতে পারবেন। সার্চ রেজাল্টে আপনাকে সক্রিয় দেখাবে।
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 mt-1 ${
                  willingness === 'available' ? 'border-emerald-600 bg-white' : 'border-gray-300'
                }`}>
                  {willingness === 'available' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  )}
                </div>
              </label>

              {/* Option 2: কয়েক মাস পরে রক্ত দিতে পারব */}
              <label
                onClick={() => setWillingness('after_months')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  willingness === 'after_months'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    willingness === 'after_months' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      কয়েক মাস পরে রক্ত দিতে পারব
                      {willingness === 'after_months' && (
                        <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                          {months} মাস পর
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      সম্প্রতি রক্ত দিয়েছেন বা কিছুদিন পর দিতে চান? মাস নির্ধারণ করে রাখুন, সময় হলে নিজে থেকেই সচল হবে।
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 mt-1 ${
                  willingness === 'after_months' ? 'border-amber-500 bg-white' : 'border-gray-300'
                }`}>
                  {willingness === 'after_months' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </div>
              </label>

              {/* Option 3: আপাতত ইচ্ছুক নই */}
              <label
                onClick={() => setWillingness('unavailable')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  willingness === 'unavailable'
                    ? 'border-gray-500 bg-gray-100 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    willingness === 'unavailable' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      আপাতত রক্ত দিতে ইচ্ছুক নই
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      শারীরিক অসুস্থতা বা ব্যস্ততার কারণে আপনি রক্তদান কার্যক্রম সাময়িক বন্ধ রাখতে পারবেন।
                    </p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 mt-1 ${
                  willingness === 'unavailable' ? 'border-gray-600 bg-white' : 'border-gray-300'
                }`}>
                  {willingness === 'unavailable' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Sub-selector for "কয়েক মাস পর" */}
          {willingness === 'after_months' && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  কবে রক্ত দিতে পারবেন? (মাস নির্বাচন করুন)
                </span>
                <span className="text-xs font-black text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                  {months} মাস পর ({getFutureMonthName(months)})
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 6].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMonths(m)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      months === m
                        ? 'bg-amber-500 text-white shadow-2xs scale-102'
                        : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    {m} মাস
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                💡 সাধারণত একজন সুস্থ পুরুষ প্রতি ৩ মাস পর পর এবং নারী প্রতি ৪ মাস পর পর নিরাপদে রক্তদান করতে পারেন।
              </p>
            </div>
          )}

          {/* Blood Group Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              আপনার রক্তের গ্রুপ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all border ${
                    bloodGroup === bg
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs scale-102'
                      : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-rose-50/50'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Contact Information */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-800 block">
              ডোনার লোকেশন (কাছাকাছি এলাকার রোগীরা যাতে সহজে যোগাযোগ করতে পারে):
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">জেলা</label>
                <select
                  value={district}
                  onChange={(e) => {
                    const newDist = e.target.value;
                    setDistrict(newDist);
                    const ups = DISTRICT_UPAZILAS_MAP[newDist] || ['সদর'];
                    setUpazila(ups[0]);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
                >
                  {ALL_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">উপজেলা / এলাকা</label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white font-medium focus:ring-1 focus:ring-rose-500 focus:outline-none"
                >
                  {availableUpazilas.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1">যোগাযোগের ফোন নম্বর</label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-rose-500">
                <Phone className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01712-345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs text-gray-800 bg-transparent focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Total Blood Donations Count */}
            <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-900">
                    🩸 মোট রক্তদানের সংখ্যা
                  </label>
                  <p className="text-[10px] text-gray-500">
                    স্মার্ট ডোনার আইডি কার্ড আনলক করতে অন্তত ১ বার রক্তদান আবশ্যক
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDonations(Math.max(0, donations - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black text-rose-600">
                    {donations}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDonations(donations + 1)}
                    className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              {donations >= 1 ? (
                <div className="flex items-center text-[10px] text-emerald-700 font-bold gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>স্মার্ট ডোনার কার্ড আনলক করা হয়েছে ({donations} বার রক্তদান)</span>
                </div>
              ) : (
                <div className="flex items-center text-[10px] text-amber-800 font-medium gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>০ বার রক্তদান — কার্ড আনলক করতে ১ বা ততোধিক সিলেক্ট করুন</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>রক্তদান স্ট্যাটাস ও তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

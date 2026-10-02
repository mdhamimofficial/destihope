import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  Send, 
  Check, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  Heart, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { BloodDonor } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ContactDonorModalProps {
  donor: BloodDonor | null;
  isOpen: boolean;
  onClose: () => void;
  onCall: (phone: string) => void;
  userLocation?: string;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({
  donor,
  isOpen,
  onClose,
  onCall,
  userLocation
}) => {
  const { l, isEn } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  if (!isOpen || !donor) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = donor.phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone}`;

  const defaultMessage = `আসসালামু আলাইকুম ${donor.name} ভাই/আপু, DestiCare অ্যাপ থেকে আপনার সাথে জরুরি রক্তের জন্য যোগাযোগ করছি। আপনার রক্তের গ্রুপ ${donor.bloodGroup}। আপনার সাথে কি কথা বলা যাবে?`;

  const handleSendSMS = () => {
    window.open(`sms:${donor.phone}?body=${encodeURIComponent(defaultMessage)}`, '_blank');
  };

  const handleSendWhatsApp = () => {
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(defaultMessage)}`, '_blank');
  };

  const handleSendAppRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setShowRequestForm(false);
      onClose();
    }, 1800);
  };

  const isAvailableNow = donor.willingnessStatus === 'available' || (donor.isAvailable && !donor.willingnessStatus);
  const isAvailableLater = donor.willingnessStatus === 'after_months';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-200">
        {/* Top Handle for mobile */}
        <div className="pt-2.5 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-red-50/40">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold">
              <Droplet className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">ডোনারের সাথে যোগাযোগ</h3>
              <p className="text-[11px] text-gray-500 font-medium">জরুরি রক্তদানের অনুরোধ ও কল</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors border border-gray-200/80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Donor Profile Card */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-lg font-black leading-none">{donor.bloodGroup}</span>
                <span className="text-[8px] font-bold uppercase mt-1 text-rose-200">রক্তের গ্রুপ</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <h4 className="text-sm font-black text-gray-900 truncate">{donor.name}</h4>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    যাচাইকৃত
                  </span>
                </div>

                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {donor.upazila ? `${donor.upazila}, ` : ''}
                    {donor.area ? `${donor.area}, ` : ''}
                    {donor.district}
                  </span>
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  মোট রক্তদান: <strong className="text-gray-700">{donor.totalDonations ?? donor.donationsCount} বার</strong> • শেষ: {donor.lastDonation}
                </p>
              </div>
            </div>
          </div>

          {/* Willingness Status Banner */}
          <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
            isAvailableNow 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : isAvailableLater
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-gray-100 border-gray-200 text-gray-700'
          }`}>
            {isAvailableNow ? (
              <Heart className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : isAvailableLater ? (
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-0.5">
              <p className="font-bold flex items-center gap-1.5">
                {isAvailableNow && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {isAvailableNow 
                  ? 'রক্ত দিতে ইচ্ছুক (এখনই প্রস্তুত)' 
                  : isAvailableLater
                  ? `কয়েক মাস পর দিতে পারবেন (${donor.availableDateNote || `${donor.availableAfterMonths} মাস পর`})`
                  : 'আপাতত রক্তদানে অনুপলব্ধ'}
              </p>
              <p className="text-[11px] opacity-85 leading-relaxed">
                {donor.willingNote || (isAvailableNow 
                  ? 'এই রক্তদাতা জরুরি প্রয়োজনে দ্রুত রক্তদানে সম্মত আছেন।' 
                  : isAvailableLater 
                  ? 'পূর্ববর্তী রক্তদান বা স্বাস্থ্যগত কারণে বর্তমানে বিরতিতে আছেন।' 
                  : 'ব্যক্তিগত কারণে বর্তমানে রক্তদানে অনুপলব্ধ।')}
              </p>
            </div>
          </div>

          {/* Phone Number Display & Quick Copy */}
          <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                যোগাযোগের ফোন নম্বর
              </span>
              <span className="text-sm font-black text-gray-900 font-mono tracking-wide">
                {donor.phone}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyPhone}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center space-x-1 text-gray-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                </>
              ) : (
                <span>কপি</span>
              )}
            </button>
          </div>

          {/* Direct Communication Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 block">সরাসরি যোগাযোগের মাধ্যম:</span>
            
            {/* Direct Phone Call Button */}
            <button
              type="button"
              onClick={() => onCall(donor.phone)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>সরাসরি কল করুন ({donor.phone})</span>
            </button>

            {/* WhatsApp & SMS Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp মেসেজ</span>
              </button>

              <button
                type="button"
                onClick={handleSendSMS}
                className="py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-98 text-white rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>এসএমএস পাঠান</span>
              </button>
            </div>
          </div>

          {/* DestiCare In-App Blood Request Button / Form */}
          <div className="pt-2 border-t border-gray-100">
            {!showRequestForm ? (
              <button
                type="button"
                onClick={() => setShowRequestForm(true)}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200/80 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Droplet className="w-3.5 h-3.5 fill-rose-600" />
                <span>DestiCare অ্যাপের মাধ্যমে রক্তের আবেদন পাঠান</span>
              </button>
            ) : (
              <form onSubmit={handleSendAppRequest} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">রক্তদানের অনুরোধ ফর্ম</span>
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    বাতিল
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">রোগীর নাম ও সমস্যা</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো. রহিম (সার্জারি রোগী)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1">হাসপাতাল ও এলাকা</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={requestSent}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                >
                  {requestSent ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>অনুরোধ সফলভাবে পাঠানো হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>ডোনারকে অনুরোধ পাঠান</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer note */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
          রক্ত সম্পূর্ণ বিনামূল্যে দান করুন ও গ্রহণ করুন। কোনো প্রকার অর্থ লেনদেন করবেন না।
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, Droplet, Phone, CheckCircle2, Award, HeartHandshake, ShieldAlert } from 'lucide-react';
import { FeedPost } from '../../types';

interface HelpBloodModalProps {
  post: FeedPost | null;
  onClose: () => void;
  onConfirmDonate: (post: FeedPost) => void;
}

export const HelpBloodModal: React.FC<HelpBloodModalProps> = ({
  post,
  onClose,
  onConfirmDonate,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [donorName, setDonorName] = useState('তানভীর আহমেদ');
  const [donorPhone, setDonorPhone] = useState('01712-345678');
  const [hasRecentDonation, setHasRecentDonation] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  const handleConfirm = () => {
    onConfirmDonate(post);
    setStep('success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">রক্তদান সহায়তা</h3>
              <p className="text-xs text-red-100">DestiCare • DestiBloodBank</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-11 -mr-2 -my-2 flex items-center justify-center text-white rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 active:scale-90 transition-all cursor-pointer touch-manipulation"
            aria-label="বন্ধ করুন"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {step === 'details' ? (
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Request Summary Box */}
            <div className="bg-red-50 rounded-xl p-3 border border-red-100">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-red-600">
                  {post.bloodDetails?.group || 'O+'}
                </span>
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  {post.bloodDetails?.bagsNeeded || 2} ব্যাগ প্রয়োজন
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-800 mt-1">
                {post.bloodDetails?.hospital || 'ঢাকা মেডিকেল কলেজ হাসপাতাল'}
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                ⏱️ সময় বাকি: {post.bloodDetails?.timeRemainingText || '০২:১৫:৩০'}
              </p>
            </div>

            {/* Donor Confirmation Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  রোগীর অভিভাবককে বার্তা (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: আমি ৩০ মিনিটের মধ্যে হাসপাতালে পৌঁছাতে পারব।"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              {/* Safety notice from Blueprint */}
              <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded-lg text-[11px] text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  রক্ত কেনাবেচা সম্পূর্ণ নিষিদ্ধ। DestiHope নিরাপদ ও সেবামূলক সংযোগ তৈরি করে।
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center space-x-2">
              <a
                href={`tel:${post.bloodDetails?.contactPhone}`}
                className="flex-1 py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>সরাসরি কল</span>
              </a>

              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>আমি রক্ত দেব</span>
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-base font-bold text-gray-900">
                ধন্যবাদ, আপনার সহায়তা রেকর্ড করা হয়েছে!
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                রোগীর অভিভাবক আপনার সাথে দ্রুত যোগাযোগ করবেন অথবা Desti Chat-এ ব্লাড চ্যাট চালু হবে।
              </p>
            </div>

            {/* Hope Points Reward */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-center space-x-2 text-teal-800">
              <Award className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-sm">+১০ Hope Points অর্জিত হয়েছে!</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
            >
              বন্ধ করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

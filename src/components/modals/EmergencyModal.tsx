import React from 'react';
import { X, PhoneCall, ShieldCheck, Heart, AlertCircle, Ambulance, Flame } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCall: (number: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onCall,
}) => {
  if (!isOpen) return null;

  const hotlines = [
    {
      name: 'জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার)',
      number: '999',
      tag: 'টোল ফ্রি',
      icon: ShieldCheck,
      color: 'bg-red-600 text-white',
      badgeBg: 'bg-red-100 text-red-700',
    },
    {
      name: 'স্বাস্থ্য বাতায়ন (২৪/৭ ডাক্তার পরামর্শ)',
      number: '16263',
      tag: 'স্বাস্থ্য সেবা',
      icon: Heart,
      color: 'bg-emerald-600 text-white',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      name: 'নারী ও শিশু নির্যাতন প্রতিরোধ সেল',
      number: '109',
      tag: 'টোল ফ্রি',
      icon: AlertCircle,
      color: 'bg-purple-600 text-white',
      badgeBg: 'bg-purple-100 text-purple-700',
    },
    {
      name: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স সদর দপ্তর',
      number: '16163',
      tag: 'উদ্ধার ও অগ্নিনির্বাপণ',
      icon: Flame,
      color: 'bg-amber-600 text-white',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'DestiBloodBank কেন্দ্রীয় সহায়তা ডেস্ক',
      number: '01712-345678',
      tag: 'জরুরি রক্তদান',
      icon: Ambulance,
      color: 'bg-rose-600 text-white',
      badgeBg: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">জরুরি জাতীয় হটলাইনসমূহ</h3>
              <p className="text-[11px] text-red-100">বাংলাদেশ প্রেক্ষাপট সহায়তা নেটওয়ার্ক</p>
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

        <div className="p-4 space-y-2.5 max-h-[75vh] overflow-y-auto">
          {hotlines.map((hotline) => {
            const Icon = hotline.icon;
            return (
              <div
                key={hotline.number}
                className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/70 flex items-center justify-between space-x-2"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${hotline.color} flex items-center justify-center shrink-0 shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      {hotline.name}
                    </h4>
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-1 ${hotline.badgeBg}`}>
                      {hotline.tag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onCall(hotline.number)}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-bold rounded-lg shrink-0 flex items-center space-x-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{hotline.number}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500">
            ইন্টারনেট না থাকলেও সাধারণ মোবাইল সিম থেকে সরাসরি কল করা যাবে।
          </p>
        </div>
      </div>
    </div>
  );
};

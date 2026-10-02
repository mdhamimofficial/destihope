import React from 'react';
import { X, Bell, Droplet, Search, Award, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBloodCase: () => void;
  onOpenMissingCase: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onOpenBloodCase,
  onOpenMissingCase,
}) => {
  const { l } = useLanguage();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: l('জরুরি রক্তের নোটিফিকেশন', 'Urgent Blood Alert'),
      desc: l(
        'ঢাকা মেডিকেল কলেজ হাসপাতালে একজন রোগীর জন্য জরুরি O+ রক্ত প্রয়োজন। আপনার রক্ত গ্রুপ O+।',
        'Patient urgently needs O+ blood at Dhaka Medical College Hospital. Your blood group matches O+.'
      ),
      time: l('১৫ মিনিট আগে', '15m ago'),
      type: 'blood',
      icon: Droplet,
      color: 'text-red-600 bg-red-50',
      action: onOpenBloodCase,
    },
    {
      id: 'notif-2',
      title: l('হোপ পয়েন্টস অর্জিত', 'Hope Points Earned'),
      desc: l(
        'একটি রক্তের কেস শেয়ার করায় আপনার প্রোফাইলে +১০ Hope Points যুক্ত হয়েছে!',
        'You earned +10 Hope Points for sharing an emergency blood request!'
      ),
      time: l('১ ঘণ্টা আগে', '1h ago'),
      type: 'points',
      icon: Award,
      color: 'text-teal-600 bg-teal-50',
      action: undefined,
    },
    {
      id: 'notif-3',
      title: l('নিখোঁজ ব্যক্তির নতুন আপডেট', 'Missing Person Case Update'),
      desc: l(
        'কেস FIND-BD-8840 (ফারহানা আক্তার): উদ্ধার সম্পন্ন হয়েছে।',
        'Case FIND-BD-8840 (Farhana Akter): Safely rescued and reunited.'
      ),
      time: l('৩ ঘণ্টা আগে', '3h ago'),
      type: 'missing',
      icon: Search,
      color: 'text-amber-600 bg-amber-50',
      action: onOpenMissingCase,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#E53935]" />
            <h3 className="font-bold text-gray-900 text-base">{l('নোটিফিকেশন', 'Notifications')}</h3>
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

        <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (n.action) {
                    n.action();
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border border-gray-100 transition-colors ${
                  n.action ? 'cursor-pointer hover:bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                      {n.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

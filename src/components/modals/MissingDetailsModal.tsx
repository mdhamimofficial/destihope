import React, { useState } from 'react';
import { X, Phone, Share2, MapPin, Calendar, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';
import { FeedPost } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface MissingDetailsModalProps {
  post: FeedPost | null;
  onClose: () => void;
  onShare: (post: FeedPost) => void;
  onSightingReported: () => void;
}

export const MissingDetailsModal: React.FC<MissingDetailsModalProps> = ({
  post,
  onClose,
  onShare,
  onSightingReported,
}) => {
  const { l } = useLanguage();
  const [showReportSighting, setShowReportSighting] = useState(false);
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingTime, setSightingTime] = useState('');
  const [sightingPhone, setSightingPhone] = useState('');
  const [submittedSighting, setSubmittedSighting] = useState(false);

  if (!post || post.type !== 'missing') return null;

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSighting(true);
    onSightingReported();
    setTimeout(() => {
      setSubmittedSighting(false);
      setShowReportSighting(false);
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 p-4 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded">
              DestiFind • Rescuer Case
            </span>
            <h3 className="font-bold text-base mt-0.5">{post.title}</h3>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-11 -mr-2 -my-2 flex items-center justify-center text-white rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 active:scale-90 transition-all cursor-pointer touch-manipulation"
            aria-label={l('বন্ধ করুন', 'Close')}
            title={l('বন্ধ করুন', 'Close')}
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Photo */}
          {post.image && (
            <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 relative shadow-xs">
              <img
                src={post.image}
                alt={l('নিখোঁজ ছবি', 'Missing person photo')}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-amber-400 text-yellow-950 text-xs font-black px-2 py-0.5 rounded shadow-xs">
                {l('অবস্থা:', 'Status:')} {post.missingDetails?.status === 'Searching' ? l('সন্ধান চলছে', 'Searching') : l('উদ্ধার সম্পন্ন', 'Rescued')}
              </div>
            </div>
          )}

          {/* Details list */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 text-xs">
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
              <span>
                <strong>{l('শেষ দেখা গেছে:', 'Last Seen Location:')}</strong> {post.missingDetails?.lastSeenLocation}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
              <span>
                <strong>{l('তারিখ ও সময়:', 'Date & Time:')}</strong> {post.missingDetails?.lastSeenDate}
              </span>
            </div>
            <div className="text-gray-700 pl-6">
              <strong>{l('পোশাকের বর্ণনা:', 'Clothing Description:')}</strong> {post.missingDetails?.clothingDescription}
            </div>
            <div className="text-gray-700 pl-6">
              <strong>{l('কেস ট্র্যাকিং আইডি:', 'Case Tracking ID:')}</strong>{' '}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">
                {post.missingDetails?.caseId}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed">
            {post.content}
          </p>

          {/* Blueprint Safety Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {l('তথ্য প্রদানকারীর পরিচয় সম্পূর্ণ গোপন রাখা হবে। কোনো অপ্রীতিকর বা অসত্য তথ্য প্রচার আইনত দণ্ডনীয়।', 'Informant identity will be kept strictly confidential. Spreading false or malicious information is punishable by law.')}
            </span>
          </div>

          {/* Sighting form toggle */}
          {showReportSighting ? (
            <form onSubmit={handleSightingSubmit} className="bg-teal-50 p-3 rounded-xl border border-teal-200 space-y-2.5">
              <h4 className="text-xs font-bold text-teal-900 flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span>{l('আপনি কি এই ব্যক্তিকে দেখেছেন?', 'Have you sighted this person?')}</span>
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  {l('কোথায় দেখেছেন?', 'Where did you see them?')}
                </label>
                <input
                  required
                  type="text"
                  placeholder={l('যেমন: জিইসি মোড় বাস স্টপ', 'e.g. GEC Circle Bus Stop')}
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  {l('কখন দেখেছেন?', 'When did you see them?')}
                </label>
                <input
                  required
                  type="text"
                  placeholder={l('যেমন: আজ দুপুর ১২:৩০', 'e.g. Today at 12:30 PM')}
                  value={sightingTime}
                  onChange={(e) => setSightingTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">
                  {l('আপনার মোবাইল নম্বর (যাচাইয়ের জন্য)', 'Your Mobile Number (for verification)')}
                </label>
                <input
                  required
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={sightingPhone}
                  onChange={(e) => setSightingPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              {submittedSighting ? (
                <div className="p-2 bg-green-100 text-green-800 text-xs font-bold rounded text-center flex items-center justify-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{l('তথ্য সফলভাবে জমা হয়েছে! (+১০ HP)', 'Information submitted successfully! (+10 HP)')}</span>
                </div>
              ) : (
                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReportSighting(false)}
                    className="flex-1 py-1.5 text-xs text-gray-600 font-semibold"
                  >
                    {l('বাতিল', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    {l('তথ্য জমা দিন', 'Submit Sighting')}
                  </button>
                </div>
              )}
            </form>
          ) : (
            <button
              onClick={() => setShowReportSighting(true)}
              className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-teal-600" />
              <span>{l('সন্ধান বা দেখা যাওয়ার তথ্য দিন', 'Report a Sighting')}</span>
            </button>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center space-x-2">
          <button
            onClick={() => onShare(post)}
            className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1 hover:bg-gray-100"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{l('শেয়ার করুন', 'Share')}</span>
          </button>

          <a
            href={`tel:${post.missingDetails?.contactPhone}`}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{l('অভিভাবককে কল', 'Call Guardian')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

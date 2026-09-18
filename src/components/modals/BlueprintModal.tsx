import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Open printable blueprint view
    window.open('/blueprint.html', '_blank');
  };

  const handleCopy = () => {
    const textElement = document.getElementById('blueprint-printable-content');
    if (textElement) {
      navigator.clipboard.writeText(textElement.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300">
              <FileText className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>DESTIHOPE Master Blueprint</span>
                <span className="text-[10px] bg-red-600/80 text-white font-semibold px-2 py-0.5 rounded-full">
                  PDF / Printable
                </span>
              </h2>
              <p className="text-[11px] text-gray-300">
                Language-Agnostic Specification for AI & Developers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="বন্ধ করুন"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-gray-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>প্রিন্ট / PDF হিসেবে সংরক্ষণ করার জন্য প্রস্তুত</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-600" />
                  <span>কপি করুন</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>PDF / প্রিন্ট করুন</span>
            </button>
          </div>
        </div>

        {/* Blueprint Scrollable Document View */}
        <div 
          id="blueprint-printable-content"
          className="p-5 overflow-y-auto space-y-6 text-gray-800 text-xs sm:text-sm font-sans leading-relaxed select-text"
        >
          {/* Document Title Header */}
          <div className="border-b-2 border-red-500 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  DESTIHOPE ECOSYSTEM — MASTER SYSTEM BLUEPRINT
                </h1>
                <p className="text-xs font-bold text-red-600 mt-0.5">
                  Universal Architecture, Interaction Engine & Data Flow Specification
                </p>
              </div>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono font-bold border border-gray-200">
                v2.0 • AGNOSTIC
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Note: This specification contains zero programming-language dependencies. Any AI or developer can ingest this blueprint to generate the exact system in Flutter, Kotlin, Swift, React, or Vue.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-2">
              ১. প্ল্যাটফর্ম ওভারভিউ ও কোর আর্কিটেকচার (System Overview)
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">
              <li><strong>মূল উদ্দেশ্য:</strong> মানবিক সংকট, জরুরি রক্তদান, নিখোঁজ মানুষ উদ্ধার, হাসপাতাল-অ্যাম্বুলেন্স সমন্বয়, এআই হেলথ ট্রায়াজ এবং সামাজিক নেটওয়ার্কিং-এর জন্য একটি সেন্ট্রালাইজড সুপার-অ্যাপ।</li>
              <li><strong>ফর্ম ফ্যাক্টর:</strong> মোবাইল-ফার্স্ট সিঙ্গেল ভিউ ফ্রেমওয়ার্ক (সেন্টার্ড মোবাইল রেশিও, ম্যাক্সিমাম উইডথ ৪৫০px)। প্রতিটি বাটন মিনিমাম ৪৪px টাচ ফ্রেন্ডলি।</li>
              <li><strong>অফলাইন রেজিলিয়েন্স:</strong> ডিভাইস ইন্টারনেট বিচ্ছিন্ন থাকলেও লোকাল মেমোরি ক্যাশ থেকে ড্রাফট ও ডেটা সেভ থাকবে এবং টপ হেডারে অফলাইন মোড স্ট্যাটাস প্রদর্শন করবে।</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-2">
              ২. গ্লোবাল নেভিগেশন ও ইন্টারঅ্যাকশন মেকানিক্স (Navigation Framework)
            </h2>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
              <h3 className="font-bold text-gray-900 text-xs">২.১ সেন্ট্রাল অরবিট মডিউল হুইল (Radial Orbit Module Switcher):</h3>
              <p className="text-xs text-gray-600">
                বটম ন্যাভিগেশনের ঠিক কেন্দ্রে অবস্থিত একটি গোল্ডেন-লেয়ার্ড এলিভেটেড বাটন চাপলে পুরো স্ক্রিনের উপর ব্লার ব্যাকড্রপ সহ একটি বৃত্তাকার কক্ষপথ (Radius ~124px) আবির্ভূত হয়:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-xs">
                <li><strong>কেন্দ্রবিন্দু (Center Hub):</strong> অ্যানিমেটেড 'মডিউল' আইকন এবং লাইভ সিগন্যাল ডট।</li>
                <li><strong>কক্ষপথের ৭টি বৃত্তাকার মডিউল আইকন:</strong>
                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-red-600">১. হোম (Hope) — লাল</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-teal-600">২. চ্যাট (Chat) — টিল</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-purple-600">৩. মিডিয়া (Media) — বেগুনি</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-amber-600">৪. ব্রেন (Brain) — অ্যাম্বার</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-rose-600">৫. কেয়ার (Care) — রোজ/ব্লাড</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-emerald-600">৬. নিখোঁজ (Find) — এমারেল্ড</div>
                    <div className="p-1.5 bg-white rounded border border-gray-200 font-semibold text-slate-800">৭. প্রোফাইল (Profile) — স্লেট</div>
                  </div>
                </li>
                <li><strong>ক্লোজ ইন্টারঅ্যাকশন:</strong> নিচে ফ্লোটিং "✕ বন্ধ করুন" ক্যাপসুল বাটন অথবা ব্যাকড্রপে ট্যাপ করলে স্মুথ স্প্রিং ট্রানজিশনে বন্ধ হওয়া।</li>
              </ul>

              <h3 className="font-bold text-gray-900 text-xs mt-3">২.২ অ্যাডাপ্টিভ টপ হেডার (Adaptive Header):</h3>
              <p className="text-xs text-gray-600">
                হেডারের ব্র্যান্ড লোগোতে সক্রিয় মডিউলের নাম পরিবর্তন হয় (DESTI HOPE, DESTI CARE, DESTI FIND)। বামে সাইডবার মেন্যু, ডানে নোটিফিকেশন বেল ও ইনস্ট্যান্ট সার্চ।
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-2">
              ৩. প্রতিটি মডিউলের কার্যপ্রণালী (Module Specifications)
            </h2>

            <div className="space-y-2">
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                <h4 className="font-bold text-red-900 text-xs">মডিউল ১: DESTI HOPE (হোম ফিড ও জরুরি একশন)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  টপ লাইভ অ্যালার্ট ব্যানার, ৪টি কুইক অ্যাকশন (৯৯৯ কল, রক্তের আবেদন, নিখোঁজ সন্ধান, এআই ডক্টর), ক্যাটাগরি ফিল্টার এবং ক্রাইসিস রেসপন্স পোস্ট ফিড।
                </p>
              </div>

              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                <h4 className="font-bold text-teal-900 text-xs">মডিউল ২: DESTI CHAT (কমিউনিটি ও মেসেজিং)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  ৪টি সাব-ট্যাব: চ্যাটস (১-অন-১ মেসেজিং), গ্রুপস (জেলা/উপজেলা ভলান্টিয়ার টিম), রক্ত কেস (জরুরি রক্তের থ্রেড), এবং কল হিস্ট্রি।
                </p>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 text-xs">মডিউল ৩: DESTI MEDIA (রিলস ও সচেতনতা)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  সম্পূর্ণ ডার্ক থিম মোড। টিকটক স্টাইলের ৯:১৬ ফুল-স্ক্রিন রিলস, ল্যান্ডস্কেপ ভিডিও, ফার্স্ট-এইড অডিও পডকাস্ট এবং সেভড লাইব্রেরি।
                </p>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-900 text-xs">মডিউল ৪: DESTI BRAIN (এআই ট্রায়াজ ও নলেজ)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  এআই ডক্টর ট্রায়াজ চ্যাটবট, স্বাস্থ্য প্রশ্নোত্তর, মাল্টিপ্লেয়ার হেলথ কুইজ ব্যাটল এবং স্বাস্থ্যনীতি ফোরাম ডিবেট। হোপ পয়েন্টস পুরস্কার ব্যবস্থা।
                </p>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <h4 className="font-bold text-rose-900 text-xs">মডিউল ৫: DESTI CARE (ব্লাড ব্যাংক ও চিকিৎসা নেটওয়ার্ক)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  ৬৪ জেলা ও ৪৯৫ উপজেলা ড্রপডাউন লোকেশন ফিল্টার, লাইভ ডোনার ডিরেক্টরি (ওয়ান-ট্যাপ কল বাটনসহ), হাসপাতাল আইসিইউ/বেড ট্র্যাকার, অ্যাম্বুলেন্স সেবা এবং ডোনার স্ট্যাটাস ম্যানেজার।
                </p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-xs">মডিউল ৬: DESTI FIND (নিখোঁজ সন্ধান ও রেসকিউ রাডার)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  ইউনিক কেস আইডি জেনারেটর, ৩-উপায় সার্চ (নাম, কেস আইডি, পুলিশ জিডি নম্বর), নিখোঁজ ও উদ্ধারকৃত তালিকা, এবং জিও-লোকেশন রাডার ভিউ।
                </p>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs">মডিউল ৭: DESTI PROFILE (একীভূত প্রোফাইল)</h4>
                <p className="text-xs text-gray-700 mt-1">
                  ডিজিটাল রক্তদাতা আইডি কার্ড, রক্তদানের রেকর্ড, হোপ পয়েন্টস লেভেল ও ব্যাজ, প্রতিটি মডিউলের অ্যাক্টিভিটি হিস্ট্রি এবং নিরাপত্তা সেটিংস।
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-2">
              ৪. ডেটা স্কিমা ও সিস্টেম এন্টিটি (Entities Specification)
            </h2>
            <div className="font-mono text-[11px] bg-slate-900 text-slate-100 p-3 rounded-xl overflow-x-auto space-y-1">
              <p>User: id, name, avatar, bloodGroup, isDonorAvailable, lastDonationDate, district, upazila, hopePoints, role, phone</p>
              <p>FeedPost: id, authorId, category, text, images, urgencyLevel, location, bloodNeeded, missingPersonRef, createdAt</p>
              <p>Donor: id, name, bloodGroup, location (district, upazila), phone, lastDonated, availabilityStatus, donationCount</p>
              <p>MissingCase: id, destiCaseId, policeGdNumber, personName, age, photoUrl, lastSeenLocation, status (missing | found)</p>
              <p>ChatMessage: id, conversationId, senderId, text, mediaUrl, messageType (text | voice | blood_alert), timestamp</p>
              <p>MediaItem: id, title, mediaType (reel | video | podcast), videoUrl, thumbnail, duration, likesCount</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-2 pb-4">
            <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-2">
              ৫. ইউনিভার্সাল এআই প্রম্পট নির্দেশিকা (Universal Prompt)
            </h2>
            <div className="p-3 bg-gray-100 rounded-xl border border-gray-300 text-xs font-mono text-gray-800">
              "Please build a complete mobile-first application implementing the full DestiHope Master Blueprint above. Create all 7 modules (Hope, Chat, Media, Brain, Care, Find, Profile), the central circular radial module switcher in the bottom navigation, contextual headers, emergency modals, and Bangladesh-wide location filtering."
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-gray-500">
            প্রিন্ট বাটনে ক্লিক করে <strong>"Save as PDF"</strong> নির্বাচন করুন।
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

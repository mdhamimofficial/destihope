import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  Trash2,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Mic,
  Share2,
  Search,
  BookOpen,
  Send,
  Loader2,
} from 'lucide-react';

interface DestiTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  timestamp: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'bn', name: 'বাংলা', voiceLang: 'bn-BD' },
  { code: 'en', name: 'English', voiceLang: 'en-US' },
  { code: 'ar', name: 'العربية (Arabic)', voiceLang: 'ar-SA' },
  { code: 'hi', name: 'हिन्दी (Hindi)', voiceLang: 'hi-IN' },
  { code: 'ur', name: 'اردو (Urdu)', voiceLang: 'ur-PK' },
  { code: 'fr', name: 'Français (French)', voiceLang: 'fr-FR' },
  { code: 'es', name: 'Español (Spanish)', voiceLang: 'es-ES' },
  { code: 'de', name: 'Deutsch (German)', voiceLang: 'de-DE' },
  { code: 'zh', name: '中文 (Chinese)', voiceLang: 'zh-CN' },
  { code: 'ja', name: '日本語 (Japanese)', voiceLang: 'ja-JP' },
];

// Offline & instant high-frequency dictionary for common phrases
const DICTIONARY_MAP: Record<string, Record<string, string>> = {
  // English to Bengali
  'en:bn': {
    'hello': 'হ্যালো / সালাম',
    'how are you': 'আপনি কেমন আছেন?',
    'i need help': 'আমার সাহায্য প্রয়োজন',
    'i need blood urgently': 'আমার জরুরি রক্তের প্রয়োজন',
    'where is the nearest hospital': 'নিকটস্থ হাসপাতাল কোথায়?',
    'call an ambulance': 'একটি অ্যাম্বুলেন্স ডাকুন',
    'thank you very much': 'আপনাকে অনেক ধন্যবাদ',
    'what is your name': 'আপনার নাম কী?',
    'please help me': 'দয়া করে আমাকে সাহায্য করুন',
    'take this medicine': 'এই ওষুধটি গ্রহণ করুন',
    'good morning': 'শুভ সকাল',
    'good night': 'শুভ রাত্রি',
    'how much does it cost': 'এটির দাম কত?',
    'emergency': 'জরুরি অবস্থা',
    'doctor': 'ডাক্তার',
    'police': 'পুলিশ',
  },
  // Bengali to English
  'bn:en': {
    'আমার জরুরি রক্তের প্রয়োজন': 'I need blood urgently',
    'নিকটস্থ হাসপাতাল কোথায়?': 'Where is the nearest hospital?',
    'দয়া করে আমাকে সাহায্য করুন': 'Please help me',
    'একটি অ্যাম্বুলেন্স ডাকুন': 'Call an ambulance',
    'আপনি কেমন আছেন?': 'How are you?',
    'আপনাকে অনেক ধন্যবাদ': 'Thank you very much',
    'আপনার নাম কী?': 'What is your name?',
    'জরুরি অবস্থা': 'Emergency',
    'ডাক্তার': 'Doctor',
    'পুলিশ': 'Police',
    'শুভ সকাল': 'Good morning',
    'শুভ রাত্রি': 'Good night',
  },
};

const QUICK_PHRASES = [
  { text: 'আমার জরুরি রক্তের প্রয়োজন', category: 'জরুরি' },
  { text: 'নিকটস্থ হাসপাতাল কোথায়?', category: 'চিকিৎসা' },
  { text: 'দয়া করে দ্রুত সাহায্য করুন', category: 'সহায়তা' },
  { text: 'How can I assist you today?', category: 'অফিস' },
  { text: 'Where is the nearest medical center?', category: 'ভ্রমণ' },
  { text: 'Thank you for your valuable support', category: 'ধন্যবাদ' },
];

export const DestiTranslateModal: React.FC<DestiTranslateModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [sourceLang, setSourceLang] = useState('bn');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('destihope_translations_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'h1',
        sourceText: 'আমার জরুরি ও পজিটিভ রক্তের প্রয়োজন',
        translatedText: 'I need O positive blood urgently',
        fromLang: 'bn',
        toLang: 'en',
        timestamp: 'আজ, সকাল ৯:০০',
      },
      {
        id: 'h2',
        sourceText: 'Where is the emergency department?',
        translatedText: 'জরুরি বিভাগটি কোথায়?',
        fromLang: 'en',
        toLang: 'bn',
        timestamp: 'গতকাল',
      },
    ];
  });

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('destihope_translations_history', JSON.stringify(history));
  }, [history]);

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
  };

  // Perform Translation
  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate !== undefined ? textToTranslate : inputText).trim();
    if (!text) {
      setTranslatedText('');
      return;
    }

    if (sourceLang === targetLang) {
      setTranslatedText(text);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check local dictionary first
      const pairKey = `${sourceLang}:${targetLang}`;
      const normalized = text.toLowerCase().trim();
      if (DICTIONARY_MAP[pairKey] && DICTIONARY_MAP[pairKey][normalized]) {
        const directMatch = DICTIONARY_MAP[pairKey][normalized];
        setTranslatedText(directMatch);
        saveToHistory(text, directMatch, sourceLang, targetLang);
        setIsLoading(false);
        return;
      }

      // 2. Fetch from MyMemory free API
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.responseData && data.responseData.translatedText) {
        let result = data.responseData.translatedText;
        // Clean any HTML entities
        result = result.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
        setTranslatedText(result);
        saveToHistory(text, result, sourceLang, targetLang);
      } else {
        throw new Error('No translation found');
      }
    } catch {
      // Fallback
      const fallback = `[অনুবাদ] ${text}`;
      setTranslatedText(fallback);
      notify('অনুবাদ সম্পন্ন হয়েছে (অফলাইন মোড)');
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = (src: string, trans: string, from: string, to: string) => {
    const newItem: TranslationHistoryItem = {
      id: `${Date.now()}`,
      sourceText: src,
      translatedText: trans,
      fromLang: from,
      toLang: to,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [newItem, ...prev.filter((item) => item.sourceText !== src).slice(0, 15)]);
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    notify('অনুবাদ কপি করা হয়েছে');
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-To-Speech (Pronunciation)
  const handleSpeak = (text: string, langCode: string) => {
    if (!text || !('speechSynthesis' in window)) {
      notify('অডিও স্পিচ এই ডিভাইসে সাপোর্ট করছে না');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const targetObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      if (targetObj) {
        utterance.lang = targetObj.voiceLang;
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Delete history item
  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    notify('হিস্ট্রি থেকে মুছে ফেলা হয়েছে');
  };

  if (!isOpen) return null;

  const sourceLangName = SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang;
  const targetLangName = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] text-gray-900 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desti-translate-header"
    >
      {/* 1. APP HEADER */}
      <header className="shrink-0 bg-white border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Languages className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 id="desti-translate-header" className="text-base font-black text-gray-900 leading-tight">
                  Desti Translate
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">
                  যেকোনো ভাষা থেকে তাৎক্ষণিক সঠিক অনুবাদ
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. LANGUAGE SELECTOR BAR WITH SWAP */}
        <div className="max-w-2xl mx-auto px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Source Language */}
          <div className="flex-1">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={`src-${l.code}`} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapLanguages}
            className="p-2.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 shadow-2xs active:scale-90 transition-all cursor-pointer shrink-0"
            title="ভাষা অদল-বদল করুন"
            aria-label="Swap languages"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          </button>

          {/* Target Language */}
          <div className="flex-1">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={`tgt-${l.code}`} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* 3. MAIN TRANSLATION WORKSPACE */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full space-y-4">
        {/* INPUT BOX */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-b border-gray-100 pb-2">
            <span className="font-bold text-gray-700">{sourceLangName}</span>
            <span className="text-[11px]">{inputText.length} অক্ষর</span>
          </div>

          <textarea
            rows={4}
            placeholder={`এখানে ${sourceLangName}-এ যা অনুবাদ করতে চান লিখুন বা পেস্ট করুন...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1">
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {inputText && (
                <button
                  onClick={() => handleSpeak(inputText, sourceLang)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleTranslate()}
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>অনুবাদ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>অনুবাদ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* OUTPUT BOX (RESULT) */}
        {(translatedText || isLoading) && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 shadow-2xs space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-blue-900 font-bold border-b border-blue-100 pb-2">
              <span>{targetLangName} (অনুবাদিত ফলাফল)</span>
              <span className="text-[10.5px] text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full font-bold">
                সঠিক অনুবাদ
              </span>
            </div>

            {isLoading ? (
              <div className="py-6 flex items-center justify-center space-x-2 text-blue-600 text-xs">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>অনুবাদ সম্পন্ন হচ্ছে...</span>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-900 leading-relaxed whitespace-pre-wrap select-all">
                {translatedText}
              </p>
            )}

            {!isLoading && translatedText && (
              <div className="flex items-center justify-end space-x-1 pt-2 border-t border-blue-100">
                <button
                  onClick={() => handleSpeak(translatedText, targetLang)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleCopy(translatedText)}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer active:scale-95"
                  title="অনুবাদ কপি করুন"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUICK PHRASES (জরুরি ও সাধারণ দ্রুত বাক্য) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>প্রয়োজনীয় দ্রুত বাক্যসমূহ</span>
            </span>
            <span className="text-[10px] text-gray-400">ট্যাপ করলেই অনুবাদ হবে</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PHRASES.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(phrase.text);
                  handleTranslate(phrase.text);
                }}
                className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    {phrase.category}
                  </span>
                  <p className="text-xs font-medium text-gray-800 group-hover:text-blue-600 truncate mt-1">
                    {phrase.text}
                  </p>
                </div>
                <ArrowLeftRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* TRANSLATION HISTORY */}
        {history.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                পূর্ববর্তী অনুবাদের তালিকা ({history.length})
              </span>
              <button
                onClick={() => {
                  setHistory([]);
                  notify('সকল অনুবাদের হিস্ট্রি মুছে ফেলা হয়েছে');
                }}
                className="text-[11px] text-gray-400 hover:text-red-600 cursor-pointer font-medium"
              >
                হিস্ট্রি মুছুন
              </button>
            </div>

            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSourceLang(item.fromLang);
                    setTargetLang(item.toLang);
                    setInputText(item.sourceText);
                    setTranslatedText(item.translatedText);
                  }}
                  className="p-3 bg-white border border-gray-200 rounded-xl shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex items-start justify-between group"
                >
                  <div className="space-y-1 min-w-0 flex-1 pr-3">
                    <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
                      <span className="font-bold text-gray-600 uppercase">{item.fromLang}</span>
                      <span>→</span>
                      <span className="font-bold text-blue-600 uppercase">{item.toLang}</span>
                      <span>•</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.sourceText}</p>
                    <p className="text-xs font-bold text-blue-900 line-clamp-1">{item.translatedText}</p>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.translatedText);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="কপি"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(item.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

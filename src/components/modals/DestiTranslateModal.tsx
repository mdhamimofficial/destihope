import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  Trash2,
  Sparkles,
  RotateCcw,
  Mic,
  MicOff,
  Share2,
  Search,
  BookOpen,
  Send,
  Loader2,
  Star,
  Plus,
  ChevronRight,
  GraduationCap,
  Layers,
  HelpCircle,
  BookmarkCheck,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import {
  VocabularyWord,
  VOCAB_CATEGORIES,
  INITIAL_VOCABULARY_LIST,
} from '../../data/vocabularyData';

interface DestiTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
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
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩', voiceLang: 'bn-BD' },
  { code: 'en', name: 'English (ইংরেজি)', flag: '🇬🇧', voiceLang: 'en-US' },
  { code: 'ar', name: 'العربية (Arabic - আরবি)', flag: '🇸🇦', voiceLang: 'ar-SA' },
  { code: 'hi', name: 'हिन्दी (Hindi - হিন্দি)', flag: '🇮🇳', voiceLang: 'hi-IN' },
  { code: 'ur', name: 'اردو (Urdu - উর্দু)', flag: '🇵🇰', voiceLang: 'ur-PK' },
  { code: 'es', name: 'Español (Spanish - স্প্যানিশ)', flag: '🇪🇸', voiceLang: 'es-ES' },
  { code: 'fr', name: 'Français (French - ফরাসি)', flag: '🇫🇷', voiceLang: 'fr-FR' },
  { code: 'de', name: 'Deutsch (German - জার্মান)', flag: '🇩🇪', voiceLang: 'de-DE' },
  { code: 'zh', name: '中文 (Chinese - চীনা)', flag: '🇨🇳', voiceLang: 'zh-CN' },
  { code: 'ja', name: '日本語 (Japanese - জাপানি)', flag: '🇯🇵', voiceLang: 'ja-JP' },
  { code: 'tr', name: 'Türkçe (Turkish - তুর্কি)', flag: '🇹🇷', voiceLang: 'tr-TR' },
  { code: 'ru', name: 'Русский (Russian - রাশিয়ান)', flag: '🇷🇺', voiceLang: 'ru-RU' },
];

// Offline & instant high-frequency dictionary for emergency & daily sentences
const DICTIONARY_MAP: Record<string, Record<string, string>> = {
  'en:bn': {
    'hello': 'হ্যালো / সালাম',
    'hi': 'হ্যালো',
    'how are you': 'আপনি কেমন আছেন?',
    'i need help': 'আমার সাহায্য প্রয়োজন',
    'i need blood urgently': 'আমার জরুরি রক্তের প্রয়োজন',
    'where is the nearest hospital': 'নিকটস্থ হাসপাতাল কোথায়?',
    'call an ambulance': 'একটি অ্যাম্বুলেন্স ডাকুন',
    'thank you': 'ধন্যবাদ',
    'thank you very much': 'আপনাকে অনেক ধন্যবাদ',
    'what is your name': 'আপনার নাম কী?',
    'my name is': 'আমার নাম',
    'please help me': 'দয়া করে আমাকে সাহায্য করুন',
    'take this medicine': 'এই ওষুধটি গ্রহণ করুন',
    'good morning': 'শুভ সকাল',
    'good night': 'শুভ রাত্রি',
    'how much does it cost': 'এটির দাম কত?',
    'emergency': 'জরুরি অবস্থা',
    'doctor': 'ডাক্তার / চিকিৎসক',
    'police': 'পুলিশ',
    'blood donor': 'রক্তদাতা',
    'oxygen': 'অক্সিজেন',
    'medicine': 'ওষুধ',
    'fever': 'জ্বর',
    'headache': 'মাথাব্যথা',
    'stomach ache': 'পেটব্যথা',
    'i am sick': 'আমি অসুস্থ',
    'where is the pharmacy': 'ওষুধের ফার্মেসি কোথায়?',
    'yes': 'হ্যাঁ',
    'no': 'না',
    'goodbye': 'বিদায়',
  },
  'bn:en': {
    'হ্যালো': 'Hello',
    'আমার জরুরি রক্তের প্রয়োজন': 'I need blood urgently',
    'আমার রক্ত প্রয়োজন': 'I need blood',
    'নিকটস্থ হাসপাতাল কোথায়?': 'Where is the nearest hospital?',
    'দয়া করে আমাকে সাহায্য করুন': 'Please help me',
    'একটি অ্যাম্বুলেন্স ডাকুন': 'Call an ambulance',
    'আপনি কেমন আছেন?': 'How are you?',
    'আমি ভালো আছি': 'I am fine',
    'আপনাকে অনেক ধন্যবাদ': 'Thank you very much',
    'ধন্যবাদ': 'Thank you',
    'আপনার নাম কী?': 'What is your name?',
    'জরুরি অবস্থা': 'Emergency',
    'ডাক্তার': 'Doctor',
    'পুলিশ': 'Police',
    'শুভ সকাল': 'Good morning',
    'শুভ রাত্রি': 'Good night',
    'ওষুধের দোকান কোথায়?': 'Where is the medicine shop?',
    'আমি অসুস্থ বোধ করছি': 'I am feeling sick',
    'রক্তদাতা পাওয়া গেছে?': 'Has a blood donor been found?',
  },
};

const QUICK_PHRASES = [
  { text: 'আমার জরুরি রক্তের প্রয়োজন', from: 'bn', to: 'en', cat: 'রক্তদান' },
  { text: 'নিকটস্থ হাসপাতাল কোথায়?', from: 'bn', to: 'en', cat: 'চিকিৎসা' },
  { text: 'একটি অ্যাম্বুলেন্স দ্রুত ডাকুন', from: 'bn', to: 'en', cat: 'জরুরি' },
  { text: 'Where is the emergency department?', from: 'en', to: 'bn', cat: 'Hospital' },
  { text: 'How can I assist you today?', from: 'en', to: 'bn', cat: 'Support' },
  { text: 'দয়া করে আমাকে ফার্মেসির পথ দেখান', from: 'bn', to: 'en', cat: 'সহায়তা' },
];

export const DestiTranslateModal: React.FC<DestiTranslateModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  isDarkMode: propIsDarkMode,
  onToggleDarkMode,
}) => {
  const { l, isEn } = useLanguage();

  // App Theme state & toggle (Them পরিবর্তন)
  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(() => {
    return typeof propIsDarkMode === 'boolean'
      ? propIsDarkMode
      : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) ||
        localStorage.getItem('destihope_theme') === 'dark';
  });

  useEffect(() => {
    if (typeof propIsDarkMode === 'boolean') {
      setInternalDarkMode(propIsDarkMode);
    }
  }, [propIsDarkMode]);

  const handleToggleTheme = () => {
    const nextDark = !internalDarkMode;
    setInternalDarkMode(nextDark);

    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('destihope_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('destihope_theme', 'light');
      }
    }

    if (onShowToast) {
      onShowToast(
        nextDark
          ? (isEn ? 'Dark theme active' : 'ডার্ক থিম সক্রিয় হয়েছে')
          : (isEn ? 'Light theme active' : 'লাইট থিম সক্রিয় হয়েছে')
      );
    }
  };

  // Active top tab: 'translate' | 'vocabulary' | 'saved'
  const [activeTab, setActiveTab] = useState<'translate' | 'vocabulary' | 'saved'>('translate');

  // Translation States
  const [sourceLang, setSourceLang] = useState('bn');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Translation History
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

  // Vocabulary States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vocabSearchQuery, setVocabSearchQuery] = useState('');
  const [vocabStudyMode, setVocabStudyMode] = useState<'list' | 'flashcard'>('list');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Saved Words & Custom Words (localStorage)
  const [savedWordIds, setSavedWordIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('destihope_saved_vocab_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['med-1', 'med-2', 'acad-1', 'idm-1'];
  });

  const [customWords, setCustomWords] = useState<VocabularyWord[]>(() => {
    try {
      const saved = localStorage.getItem('destihope_custom_vocab_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Modal to add new custom vocabulary word
  const [isAddCustomWordOpen, setIsAddCustomWordOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaningBn, setNewMeaningBn] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newExampleEn, setNewExampleEn] = useState('');
  const [newExampleBn, setNewExampleBn] = useState('');
  const [newCategory, setNewCategory] = useState<VocabularyWord['category']>('daily');

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

  // Persist history & saved words
  useEffect(() => {
    localStorage.setItem('destihope_translations_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('destihope_saved_vocab_ids', JSON.stringify(savedWordIds));
  }, [savedWordIds]);

  useEffect(() => {
    localStorage.setItem('destihope_custom_vocab_list', JSON.stringify(customWords));
  }, [customWords]);

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

      // 2. Fetch from MyMemory public translation API
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.responseData && data.responseData.translatedText) {
        let result = data.responseData.translatedText;
        // Clean any HTML entities
        result = result
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
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

    setHistory((prev) => [newItem, ...prev.filter((item) => item.sourceText !== src).slice(0, 20)]);
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    notify('অনুবাদ ক্লিপবোর্ডে কপি করা হয়েছে');
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
      window.speechSynthesis.speak(utterance);
    } catch {
      notify('অডিও প্লে করতে সমস্যা হচ্ছে');
    }
  };

  // Speech Recognition (Voice Input)
  const handleStartVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify('আপনার ব্রাউজারে ভয়েস টাইপিং সাপোর্ট নেই');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang);
      recognition.lang = langObj ? langObj.voiceLang : 'bn-BD';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      notify('কথা বলুন... শুনছি');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        handleTranslate(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        notify('ভয়েস শনাক্ত করা সম্ভব হয়নি');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Save translation result directly to personal vocabulary
  const handleSaveTranslationToVocab = () => {
    if (!inputText.trim() || !translatedText.trim()) return;

    const newVocabItem: VocabularyWord = {
      id: `custom-trans-${Date.now()}`,
      word: sourceLang === 'en' ? inputText.trim() : translatedText.trim(),
      meaningBn: sourceLang === 'bn' ? inputText.trim() : translatedText.trim(),
      partOfSpeech: 'phrase',
      category: 'daily',
      difficulty: 'basic',
      exampleEn: sourceLang === 'en' ? inputText.trim() : translatedText.trim(),
      exampleBn: sourceLang === 'bn' ? inputText.trim() : translatedText.trim(),
    };

    setCustomWords((prev) => [newVocabItem, ...prev]);
    setSavedWordIds((prev) => [newVocabItem.id, ...prev]);
    notify('ভোকাবুলারিতে সফলভাবে সেভ করা হয়েছে ⭐');
  };

  // Toggle bookmark word
  const toggleSaveWord = (wordId: string) => {
    if (savedWordIds.includes(wordId)) {
      setSavedWordIds((prev) => prev.filter((id) => id !== wordId));
      notify('সংরক্ষিত শব্দ তালিকা থেকে বাদ দেওয়া হয়েছে');
    } else {
      setSavedWordIds((prev) => [...prev, wordId]);
      notify('শব্দটি আপনার তালিকায় সংরক্ষণ করা হয়েছে ⭐');
    }
  };

  // Add custom word submit
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaningBn.trim()) {
      notify('অনুগ্রহ করে ইংরেজি শব্দ এবং বাংলা অর্থ লিখুন');
      return;
    }

    const item: VocabularyWord = {
      id: `custom-${Date.now()}`,
      word: newWord.trim(),
      phonetic: newPhonetic.trim() ? `[${newPhonetic.trim()}]` : undefined,
      meaningBn: newMeaningBn.trim(),
      partOfSpeech: 'noun',
      category: newCategory,
      difficulty: 'basic',
      exampleEn: newExampleEn.trim() || newWord.trim(),
      exampleBn: newExampleBn.trim() || newMeaningBn.trim(),
    };

    setCustomWords((prev) => [item, ...prev]);
    setSavedWordIds((prev) => [item.id, ...prev]);
    setNewWord('');
    setNewMeaningBn('');
    setNewPhonetic('');
    setNewExampleEn('');
    setNewExampleBn('');
    setIsAddCustomWordOpen(false);
    notify('নতুন ভোকাবুলারি যুক্ত করা হয়েছে ✅');
  };

  // Combined vocabulary list
  const allVocabList = [...INITIAL_VOCABULARY_LIST, ...customWords];

  // Filtered vocabulary list
  const filteredVocab = allVocabList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      !vocabSearchQuery.trim() ||
      item.word.toLowerCase().includes(vocabSearchQuery.toLowerCase()) ||
      item.meaningBn.toLowerCase().includes(vocabSearchQuery.toLowerCase()) ||
      (item.exampleEn && item.exampleEn.toLowerCase().includes(vocabSearchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Saved words list
  const savedVocabList = allVocabList.filter((item) => savedWordIds.includes(item.id));

  // Word of the day (deterministic based on current date)
  const todayDayNumber = new Date().getDate();
  const wordOfTheDay = INITIAL_VOCABULARY_LIST[todayDayNumber % INITIAL_VOCABULARY_LIST.length];

  if (!isOpen) return null;

  const sourceLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang);
  const targetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 w-full h-[100dvh] overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. APP HEADER */}
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 mr-2">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Languages className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black text-gray-900 dark:text-white leading-tight flex items-center gap-1.5 truncate">
                <span>Desti Translate</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-md">
                  & Vocab
                </span>
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                {l('বাংলা ⇄ ইংরেজি, বহুভাষিক অনুবাদ ও ভোকাবুলারি', 'Bangla ⇄ English Multilingual Translation & Vocabulary')}
              </p>
            </div>
          </div>

          {/* Header Right Actions: Theme Toggle + Cancel Button - both comfortably touchable */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            <button
              id="btn-translate-theme-toggle"
              onClick={handleToggleTheme}
              title={internalDarkMode 
                ? l('লাইট থিম চালু করুন (বর্তমানে ডার্ক মোড)', 'Switch to Light Theme (Currently Dark)') 
                : l('ডার্ক থিম চালু করুন (বর্তমানে লাইট মোড)', 'Switch to Dark Theme (Currently Light)')}
              className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 text-gray-700 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60 select-none group"
              aria-label={l('অ্যাপসের থিম পরিবর্তন', 'Toggle App Theme')}
            >
              {internalDarkMode ? (
                <Sun className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.2] text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.2] text-indigo-600 group-hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>

            {/* Cancel / Close Button - Big, prominent & easily crossable */}
            <button
              id="btn-translate-close"
              onClick={onClose}
              className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-red-50 active:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-950/60 dark:active:bg-red-900/80 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90 border border-gray-200/60 dark:border-gray-700/60 select-none group shrink-0"
              title={l('বন্ধ করুন', 'Close')}
              aria-label={l('বন্ধ করুন', 'Close')}
            >
              <X className="w-6 h-6 stroke-[2.5] text-gray-700 dark:text-gray-200 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:rotate-90 transition-transform duration-150" />
            </button>
          </div>
        </div>

          {/* 2. TOP PRIMARY TABS: TRANSLATOR vs VOCABULARY vs SAVED */}
          <div className="flex border-t border-gray-100 bg-gray-50/80 px-3 py-1.5 gap-1.5">
            <button
              onClick={() => setActiveTab('translate')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'translate'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>অনুবাদক (Translate)</span>
            </button>

            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'vocabulary'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ভোকাবুলারি (Vocabulary)</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer shrink-0 ${
                activeTab === 'saved'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
              }`}
              title="সংরক্ষিত শব্দ"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">সেভ করা</span>
              <span className="text-[10px] bg-black/15 px-1.5 py-0.2 rounded-full font-black">
                {savedWordIds.length}
              </span>
            </button>
          </div>
        </header>

        {/* 3. MAIN CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* TAB 1: TRANSLATOR */}
          {activeTab === 'translate' && (
            <div className="p-4 max-w-2xl mx-auto space-y-4">
              {/* Quick Language Direction Shortcuts */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => {
                    setSourceLang('bn');
                    setTargetLang('en');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    sourceLang === 'bn' && targetLang === 'en'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇧🇩 বাংলা ➔ 🇬🇧 English
                </button>

                <button
                  onClick={() => {
                    setSourceLang('en');
                    setTargetLang('bn');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    sourceLang === 'en' && targetLang === 'bn'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇬🇧 English ➔ 🇧🇩 বাংলা
                </button>

                <button
                  onClick={() => {
                    setSourceLang('bn');
                    setTargetLang('ar');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    sourceLang === 'bn' && targetLang === 'ar'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇧🇩 বাংলা ➔ 🇸🇦 العربية
                </button>

                <button
                  onClick={() => {
                    setSourceLang('bn');
                    setTargetLang('hi');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    sourceLang === 'bn' && targetLang === 'hi'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇧🇩 বাংলা ➔ 🇮🇳 हिन्दी
                </button>
              </div>

              {/* Language Selector Bar with Swap */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-2xs">
                {/* Source Language Dropdown */}
                <div className="flex-1">
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={`src-${l.code}`} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  onClick={handleSwapLanguages}
                  className="p-2.5 bg-white hover:bg-blue-50 hover:border-blue-300 border border-gray-200 rounded-xl text-blue-600 shadow-2xs active:scale-90 transition-all cursor-pointer shrink-0"
                  title="ভাষা পরিবর্তন (Swap)"
                  aria-label="Swap languages"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                {/* Target Language Dropdown */}
                <div className="flex-1">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={`tgt-${l.code}`} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input Box */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-b border-gray-100 pb-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <span>{sourceLangObj?.flag}</span>
                    <span>{sourceLangObj?.name}</span>
                  </span>
                  <span className="text-[11px]">{inputText.length} অক্ষর</span>
                </div>

                <textarea
                  rows={4}
                  placeholder={`এখানে ${sourceLangObj?.name || ''}-এ যা অনুবাদ করতে চান লিখুন...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleTranslate();
                    }
                  }}
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1">
                    {inputText && (
                      <button
                        onClick={() => setInputText('')}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {inputText && (
                      <button
                        onClick={() => handleSpeak(inputText, sourceLang)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Microphone Voice Input */}
                    <button
                      onClick={handleStartVoice}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                      title={isListening ? 'শুনছি...' : 'ভয়েস টাইপিং'}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleTranslate()}
                    disabled={isLoading || !inputText.trim()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5 cursor-pointer"
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

              {/* Output Result Box */}
              {(translatedText || isLoading) && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 shadow-2xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-blue-900 font-bold border-b border-blue-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span>{targetLangObj?.flag}</span>
                      <span>{targetLangObj?.name} (অনুবাদিত ফলাফল)</span>
                    </span>
                    <span className="text-[10.5px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
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
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-100">
                      {/* Save to Vocabulary button */}
                      <button
                        onClick={handleSaveTranslationToVocab}
                        className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                        title="ভোকাবুলারিতে সেভ করুন"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>ভোকাবুলারিতে সেভ করুন ⭐</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleSpeak(translatedText, targetLang)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="উচ্চারণ শুনুন"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleCopy(translatedText)}
                          className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer active:scale-95"
                          title="অনুবাদ কপি করুন"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Everyday Phrases */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
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
                        setSourceLang(phrase.from);
                        setTargetLang(phrase.to);
                        setInputText(phrase.text);
                        handleTranslate(phrase.text);
                      }}
                      className="p-3 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-300 rounded-xl text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">
                          {phrase.cat}
                        </span>
                        <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 truncate mt-1">
                          {phrase.text}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation History */}
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

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                              setHistory((prev) => prev.filter((h) => h.id !== item.id));
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
            </div>
          )}

          {/* TAB 2: VOCABULARY */}
          {activeTab === 'vocabulary' && (
            <div className="p-4 max-w-2xl mx-auto space-y-4">
              {/* Word of the Day Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>আজকের নির্বাচিত শব্দ (Word of the Day)</span>
                  </span>
                  <button
                    onClick={() => toggleSaveWord(wordOfTheDay.id)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-all cursor-pointer"
                    title="সেভ করুন"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        savedWordIds.includes(wordOfTheDay.id)
                          ? 'fill-amber-300 text-amber-300'
                          : 'text-white/80'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-baseline space-x-2 pt-1">
                  <h3 className="text-xl font-black">{wordOfTheDay.word}</h3>
                  {wordOfTheDay.phonetic && (
                    <span className="text-xs text-blue-100 font-medium">{wordOfTheDay.phonetic}</span>
                  )}
                  <span className="text-[10px] uppercase font-bold bg-white/25 px-1.5 py-0.2 rounded">
                    {wordOfTheDay.partOfSpeech}
                  </span>
                </div>

                <p className="text-sm font-bold text-amber-200">
                  {wordOfTheDay.meaningBn}
                </p>

                <div className="bg-white/10 rounded-xl p-2.5 text-xs text-blue-50 space-y-1">
                  <p className="italic">“{wordOfTheDay.exampleEn}”</p>
                  <p className="text-[11px] text-blue-200">অর্থ: {wordOfTheDay.exampleBn}</p>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => handleSpeak(wordOfTheDay.word, 'en')}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>
              </div>

              {/* Mode Toggle & Search Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="শব্দ খুঁজুন (English or বাংলা)..."
                      value={vocabSearchQuery}
                      onChange={(e) => setVocabSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                    />
                  </div>

                  {/* Mode switcher: List vs Flashcards */}
                  <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200 shrink-0">
                    <button
                      onClick={() => setVocabStudyMode('list')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        vocabStudyMode === 'list'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      তালিকা
                    </button>
                    <button
                      onClick={() => {
                        setVocabStudyMode('flashcard');
                        setFlashcardIndex(0);
                        setIsCardFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        vocabStudyMode === 'flashcard'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      কার্ড মোড
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {VOCAB_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center space-x-1 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.labelBn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FLASHCARD STUDY MODE */}
              {vocabStudyMode === 'flashcard' && filteredVocab.length > 0 && (
                <div className="py-2 space-y-4">
                  {(() => {
                    const currentCard = filteredVocab[flashcardIndex % filteredVocab.length];
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                          <span>
                            কার্ড {flashcardIndex + 1} / {filteredVocab.length}
                          </span>
                          <span className="text-[11px] text-blue-600 font-semibold">
                            ট্যাপ করে অর্থ দেখুন
                          </span>
                        </div>

                        {/* Flip Card Container */}
                        <div
                          onClick={() => setIsCardFlipped(!isCardFlipped)}
                          className="w-full min-h-[220px] bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-sm hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative select-none"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveWord(currentCard.id);
                            }}
                            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-amber-500 rounded-full"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                savedWordIds.includes(currentCard.id)
                                  ? 'fill-amber-400 text-amber-400'
                                  : ''
                              }`}
                            />
                          </button>

                          {!isCardFlipped ? (
                            <div className="space-y-3">
                              <span className="text-[11px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                {currentCard.partOfSpeech}
                              </span>
                              <h4 className="text-3xl font-black text-gray-900 tracking-tight">
                                {currentCard.word}
                              </h4>
                              {currentCard.phonetic && (
                                <p className="text-sm text-gray-500 font-medium">
                                  {currentCard.phonetic}
                                </p>
                              )}
                              <div className="pt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSpeak(currentCard.word, 'en');
                                  }}
                                  className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center space-x-1.5 mx-auto"
                                >
                                  <Volume2 className="w-4 h-4" />
                                  <span>উচ্চারণ শুনুন</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 animate-in fade-in">
                              <span className="text-[11px] uppercase font-bold text-gray-400">
                                বাংলা অর্থ
                              </span>
                              <h4 className="text-2xl font-black text-blue-700">
                                {currentCard.meaningBn}
                              </h4>
                              {currentCard.meaningEn && (
                                <p className="text-xs text-gray-500 italic max-w-sm">
                                  "{currentCard.meaningEn}"
                                </p>
                              )}
                              <div className="mt-3 bg-gray-50 rounded-xl p-3 text-left w-full max-w-md">
                                <p className="text-xs font-semibold text-gray-800">
                                  উদাহরণ: {currentCard.exampleEn}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  অর্থ: {currentCard.exampleBn}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setFlashcardIndex((prev) =>
                                prev === 0 ? filteredVocab.length - 1 : prev - 1
                              );
                            }}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            পূর্ববর্তী শব্দ
                          </button>

                          <button
                            onClick={() => {
                              notify('দারুণ! মুখস্থ হয়েছে চিহ্নিত করা হয়েছে ✅');
                              setIsCardFlipped(false);
                              setFlashcardIndex((prev) => (prev + 1) % filteredVocab.length);
                            }}
                            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                          >
                            <Check className="w-4 h-4" />
                            <span>মুখস্থ হয়েছে</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setFlashcardIndex((prev) => (prev + 1) % filteredVocab.length);
                            }}
                            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            পরবর্তী শব্দ
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* LIST VIEW */}
              {vocabStudyMode === 'list' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold px-1">
                    <span>শব্দ সংখ্যা ({filteredVocab.length})</span>
                    <button
                      onClick={() => setIsAddCustomWordOpen(true)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-xs font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নিজের শব্দ যোগ করুন</span>
                    </button>
                  </div>

                  {filteredVocab.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-bold">কোনো শব্দ পাওয়া যায়নি</p>
                      <p className="text-[11px] text-gray-400 mt-1">অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন</p>
                    </div>
                  ) : (
                    filteredVocab.map((item) => {
                      const isSaved = savedWordIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-2xs hover:border-blue-300 transition-all space-y-1.5"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-base font-black text-gray-900">{item.word}</h4>
                                <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                                  {item.partOfSpeech}
                                </span>
                              </div>
                              {item.phonetic && (
                                <p className="text-xs text-gray-400 font-medium">{item.phonetic}</p>
                              )}
                            </div>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleSpeak(item.word, 'en')}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="উচ্চারণ শুনুন"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => toggleSaveWord(item.id)}
                                className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title={isSaved ? 'সেভ করা আছে' : 'সেভ করুন'}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    isSaved ? 'fill-amber-400 text-amber-400' : ''
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-bold text-blue-900">{item.meaningBn}</p>

                          {item.exampleEn && (
                            <div className="bg-gray-50/80 rounded-xl p-2 text-xs text-gray-600 space-y-0.5">
                              <p className="italic">“{item.exampleEn}”</p>
                              <p className="text-[11px] text-gray-500">বাংলা: {item.exampleBn}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED WORDS (সংরক্ষিত শব্দ) */}
          {activeTab === 'saved' && (
            <div className="p-4 max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">
                    সংরক্ষিত ভোকাবুলারি সংগ্রহ ({savedVocabList.length})
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    আপনার বুকমার্ক করা এবং অনুবাদ থেকে সংরক্ষিত শব্দসমূহ
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCustomWordOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন শব্দ</span>
                </button>
              </div>

              {savedVocabList.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 space-y-2">
                  <Star className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-bold text-gray-600">এখনো কোনো শব্দ সেভ করেননি</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    অনুবাদ করার পর ⭐ বাটনে ট্যাপ করুন অথবা শব্দভাণ্ডার থেকে যেকোনো পছন্দের শব্দ সেভ করুন।
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedVocabList.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-base font-black text-gray-900">{item.word}</h4>
                            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                              {item.partOfSpeech}
                            </span>
                          </div>
                          {item.phonetic && (
                            <p className="text-xs text-gray-400 font-medium">{item.phonetic}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSpeak(item.word, 'en')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="উচ্চারণ শুনুন"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleSaveWord(item.id)}
                            className="p-1.5 text-amber-500 hover:text-gray-400 rounded-lg transition-colors cursor-pointer"
                            title="সেভ তালিকা থেকে সরান"
                          >
                            <Star className="w-4 h-4 fill-amber-400" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-blue-900">{item.meaningBn}</p>

                      {item.exampleEn && (
                        <div className="bg-gray-50 rounded-xl p-2 text-xs text-gray-600">
                          <p className="italic">“{item.exampleEn}”</p>
                          <p className="text-[11px] text-gray-500">বাংলা: {item.exampleBn}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL: ADD CUSTOM WORD */}
        {isAddCustomWordOpen && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsAddCustomWordOpen(false)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>নিজের নতুন ভোকাবুলারি যুক্ত করুন</span>
                </h3>
                <button
                  onClick={() => setIsAddCustomWordOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCustomWord} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    ইংরেজি শব্দ / ফ্রেজ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Compassion"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    বাংলা অর্থ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সহানুভূতি বা পরম দয়া"
                    value={newMeaningBn}
                    onChange={(e) => setNewMeaningBn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    বাংলা উচ্চারণ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: কম্প্যাশন"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    উদাহরণ বাক্য (ইংরেজি)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Show compassion to those in need."
                    value={newExampleEn}
                    onChange={(e) => setNewExampleEn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="daily">🗣️ দৈনন্দিন কথোপকথন</option>
                    <option value="medical">🏥 জরুরি ও চিকিৎসা</option>
                    <option value="office">💼 অফিস ও কর্মক্ষেত্র</option>
                    <option value="travel">✈️ ভ্রমণ ও যাতায়াত</option>
                    <option value="academic">🎓 আইইএলটিএস ও অ্যাডভান্সড</option>
                    <option value="idioms">💡 প্রবাদ ও বাগধারা</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomWordOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

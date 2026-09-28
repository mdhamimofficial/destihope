import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowLeft,
  ImagePlus,
  SlidersHorizontal,
  ChevronDown,
  Droplet,
  HeartPulse,
  FileText,
  Compass,
  RefreshCw,
  Mic,
  MicOff,
  User,
  Sliders,
  ShieldAlert,
  GraduationCap,
  Languages,
  Gauge,
  Camera,
  Trash2,
} from 'lucide-react';

interface DestiAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // base64 preview
  persona?: PersonaType;
  mode?: ResponseMode;
}

type ResponseMode = 'concise' | 'detailed' | 'formal' | 'bullet';
type PersonaType = 'general' | 'health' | 'writer' | 'tutor' | 'emergency';
type OutputLanguage = 'bn' | 'easy_bn' | 'en';
type FontSize = 'sm' | 'base' | 'lg';

const PERSONAS: Record<
  PersonaType,
  { label: string; badge: string; icon: any; color: string; desc: string }
> = {
  general: {
    label: 'স্মার্ট সহকারী',
    badge: 'সাধারণ',
    icon: Sparkles,
    color: 'from-purple-600 to-indigo-600',
    desc: 'দৈনন্দিন সকল তথ্য, জ্ঞান ও সাধারণ প্রশ্নোত্তর',
  },
  health: {
    label: 'স্বাস্থ্য ও রক্তদান',
    badge: 'স্বাস্থ্য',
    icon: HeartPulse,
    color: 'from-rose-500 to-red-600',
    desc: 'ফার্স্ট এইড, রক্তদান প্রস্তুতি ও চিকিৎসা রিপোর্ট বিশ্লেষণ',
  },
  writer: {
    label: 'দরখাস্ত ও রাইটার',
    badge: 'রাইটার',
    icon: FileText,
    color: 'from-blue-500 to-cyan-600',
    desc: 'অফিস চিঠি, দরখাস্ত ও প্রফেশনাল ড্রাফটিং',
  },
  tutor: {
    label: 'স্টাডি ও ক্যারিয়ার',
    badge: 'মেন্টর',
    icon: GraduationCap,
    color: 'from-amber-500 to-orange-600',
    desc: 'পড়াশোনা, গণিত, স্কিল ও ক্যারিয়ার গাইডলাইন',
  },
  emergency: {
    label: 'জরুরি রেসকিউ',
    badge: 'জরুরি',
    icon: ShieldAlert,
    color: 'from-red-600 to-amber-600',
    desc: 'তাৎক্ষণিক দুর্ঘটনা, দুর্যোগ ও জরুরি হটলাইন সহায়তা',
  },
};

const SUGGESTED_QUESTIONS = [
  {
    icon: Camera,
    text: 'প্রেসক্রিপশন বা টেস্ট রিপোর্টের ছবি আপলোড করে এর সহজ ব্যাখ্যা জানতে পারেন',
    label: '📸 ছবি/রিপোর্ট বিশ্লেষণ',
    isAction: true,
  },
  {
    icon: Droplet,
    text: 'রক্তদানের পূর্বে কী প্রস্তুতি নিতে হবে এবং কাদের রক্তদান নিষেধ?',
    label: '🩸 রক্তদানের নিয়মাবলি',
  },
  {
    icon: HeartPulse,
    text: 'হঠাৎ আগুনে পুড়ে গেলে বা কেটে গেলে প্রাথমিক চিকিৎসা কী?',
    label: '🚑 জরুরি ফার্স্ট এইড',
  },
  {
    icon: FileText,
    text: 'অফিস থেকে ৩ দিনের পারিবারিক ছুটির একটি ফরমাল আবেদনপত্র লিখে দাও।',
    label: '📝 ছুটির দরখাস্ত ড্রাফট',
  },
];

export const DestiAiModal: React.FC<DestiAiModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  // User Control Preferences
  const [responseMode, setResponseMode] = useState<ResponseMode>(() => {
    return (localStorage.getItem('desti_mode_clean') as ResponseMode) || 'concise';
  });
  const [persona, setPersona] = useState<PersonaType>(() => {
    return (localStorage.getItem('desti_persona_clean') as PersonaType) || 'general';
  });
  const [outputLang, setOutputLang] = useState<OutputLanguage>(() => {
    return (localStorage.getItem('desti_lang_clean') as OutputLanguage) || 'bn';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('desti_font_clean') as FontSize) || 'base';
  });
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  // UI state
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('desti_chat_clean_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'msg-welcome-clean',
        role: 'assistant',
        content:
          'আসসালামু আলাইকুম! আমি Desti AI, আপনার নির্ভরযোগ্য ব্যক্তিগত স্মার্ট সহকারী।\n\nআপনি যেকোনো প্রশ্ন করতে পারেন, অথবা প্রেসক্রিপশন, রক্তের টেস্ট রিপোর্ট বা ডকুমেন্টের ছবি আপলোড করে তাৎক্ষণিক বিশ্লেষণ নিতে পারেন!',
        timestamp: 'এখনই',
        persona: 'general',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    dataUrl: string;
    mimeType: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save settings
  useEffect(() => {
    localStorage.setItem('desti_mode_clean', responseMode);
    localStorage.setItem('desti_persona_clean', persona);
    localStorage.setItem('desti_lang_clean', outputLang);
    localStorage.setItem('desti_font_clean', fontSize);
  }, [responseMode, persona, outputLang, fontSize]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(scrollToBottom, 80);
    } else {
      document.body.style.overflow = 'unset';
      if (isListening) stopListening();
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (isListening) stopListening();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('desti_chat_clean_v4', JSON.stringify(messages));
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const notify = (msg: string) => {
    if (onShowToast) onShowToast(msg);
  };

  // Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notify('ছবির সাইজ ১০ মেগাবাইট বা তার কম হতে হবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage({
        file,
        dataUrl,
        mimeType: file.type || 'image/jpeg',
      });
      notify('ছবি যুক্ত হয়েছে। এবার প্রশ্ন লিখে পাঠান।');
      textareaRef.current?.focus();
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  // Speech Recognition (Mic)
  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notify('এই ব্রাউজারে ভয়েস টাইপিং সাপোর্ট নেই');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = outputLang === 'en' ? 'en-US' : 'bn-BD';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          notify('কথা বলুন, শুনছি...');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
            notify('ভয়েস গ্রহণ করা হয়েছে');
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          notify('ভয়েস শনাক্ত করা যায়নি');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Send Message (Text & optional Image)
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt !== undefined ? customPrompt : inputPrompt).trim();
    if ((!textToSend && !selectedImage) || isLoading) return;

    const attachedImageUrl = selectedImage ? selectedImage.dataUrl : undefined;
    const attachedImagePayload = selectedImage
      ? { mimeType: selectedImage.mimeType, data: selectedImage.dataUrl }
      : undefined;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend || (selectedImage ? 'এই ছবিটি বিশ্লেষণ করে বাংলায় বিস্তারিত বুঝিয়ে বলুন।' : ''),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      image: attachedImageUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend || 'এই ছবিটি বিশ্লেষণ করে বাংলায় বিস্তারিত বুঝিয়ে বলুন।',
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          mode: responseMode,
          persona: persona,
          outputLang: outputLang,
          image: attachedImagePayload,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const replyText = data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।';

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        persona,
        mode: responseMode,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Offline fallback
      let fallbackText =
        'সংযোগ পেতে সাময়িক বিলম্ব হচ্ছে। জরুরি স্বাস্থ্য বা রক্তদানের তথ্যের জন্য আমাদের ডেডিকেটেড ডিরেক্টরি ব্যবহার করুন অথবা জাতীয় জরুরি সেবা ৯৯৯ ডায়াল করুন।';

      if (textToSend.includes('রক্ত')) {
        fallbackText =
          'রক্তদানের প্রধান শর্তাবলি:\n• ডোনারের বয়স: ১৮-৬০ বছর\n• ওজন: পুরুষ ৫০ কেজি+, নারী ৪৫ কেজি+\n• হিমোগ্লোবিনের মাত্রা: স্বাভাবিক\n• রক্তদানের আগে পর্যাপ্ত পানি পান ও বিশ্রাম নিন\n• প্রতি ৩-৪ মাস অন্তর সুস্থ ব্যক্তি রক্ত দিতে পারেন।';
      } else if (textToSend.includes('ছুটি') || textToSend.includes('দরখাস্ত')) {
        fallbackText =
          'ছুটির আবেদনপত্র নমুনা:\n\nবরাবর,\nউপযুক্ত কর্তৃপক্ষ,\n[প্রতিষ্ঠানের নাম]\n\nবিষয়: জরুরি ছুটির আবেদন।\n\nজনাব,\nবিনীত নিবেদন এই যে, আমার পারিবারিক জরুরি কারণে আগামী [তারিখ] হতে [তারিখ] পর্যন্ত কর্মস্থলে উপস্থিত থাকতে পারব না।\n\nঅতএব, প্রার্থনা এই যে আমাকে উক্ত দিনের ছুটি মঞ্জুর করতে মহোদয়ের মর্জি হয়।\n\nবিনীত,\n[আপনার নাম]';
      }

      const fallbackMessage: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        persona,
        mode: responseMode,
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // Re-generate
  const handleRegenerate = (originalPromptIndex: number) => {
    for (let i = originalPromptIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        handleSendMessage(messages[i].content);
        break;
      }
    }
  };

  // Copy
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify('উত্তর কপি করা হয়েছে');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // TTS
  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      notify('অডিও স্পিচ এই ডিভাইসে সাপোর্ট করছে না');
      return;
    }

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = outputLang === 'en' ? 'en-US' : 'bn-BD';
      utterance.rate = speechSpeed;
      utterance.onstart = () => setIsSpeakingId(id);
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeakingId(null);
    }
  };

  // Clear
  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: `msg-welcome-clean-${Date.now()}`,
      role: 'assistant',
      content:
        'আসসালামু আলাইকুম! চ্যাট হিস্ট্রি রিসেট করা হয়েছে। আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
      timestamp: 'এখনই',
      persona: 'general',
    };
    setMessages([welcome]);
    notify('চ্যাট হিস্ট্রি রিসেট করা হয়েছে');
  };

  if (!isOpen) return null;

  const fontClass =
    fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  const CurrentPersona = PERSONAS[persona];
  const PersonaIcon = CurrentPersona.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] text-gray-900 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desti-ai-header"
    >
      {/* 1. CLEAN APP HEADER (একদম পরিচ্ছন্ন, কোনো অতিরিক্ত ওভারল্যাপিং বার নেই) */}
      <header className="shrink-0 bg-white border-b border-gray-200/90 shadow-2xs z-20">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${CurrentPersona.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
              >
                <PersonaIcon className="w-4.5 h-4.5" />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 id="desti-ai-header" className="text-base font-black text-gray-900 leading-tight">
                    Desti AI
                  </h1>

                  {/* Clean Persona Dropdown Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowPersonaMenu((prev) => !prev)}
                      className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 transition-colors cursor-pointer"
                    >
                      <span>{CurrentPersona.badge}</span>
                      <ChevronDown className="w-3 h-3 text-purple-500" />
                    </button>

                    {/* Persona Dropdown Menu */}
                    {showPersonaMenu && (
                      <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          বিশেষজ্ঞ রোল পরিবর্তন
                        </div>
                        {(Object.keys(PERSONAS) as PersonaType[]).map((key) => {
                          const p = PERSONAS[key];
                          const IconComp = p.icon;
                          const isSel = persona === key;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setPersona(key);
                                setShowPersonaMenu(false);
                                notify(`রোল পরিবর্তন: ${p.label}`);
                              }}
                              className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 text-xs transition-colors cursor-pointer ${
                                isSel ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}
                              >
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{p.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 font-medium truncate max-w-[200px] sm:max-w-none">
                  {CurrentPersona.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Quick Controls & Settings Drawer */}
            <button
              onClick={() => setShowSettingsSheet(true)}
              className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
              title="এআই কন্ট্রোলস ও সেটিংস"
              aria-label="সেটিংস"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Clear history */}
            <button
              onClick={handleClearHistory}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              title="চ্যাট হিস্ট্রি রিসেট করুন"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. CHAT SCROLL AREA (পরিস্কার ও প্রশস্ত কথোপকথন স্ক্রিন) */}
      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full space-y-4">
        {/* Minimal Hero Suggestions when conversation is fresh */}
        {messages.length <= 2 && (
          <div className="py-2 space-y-3 animate-in fade-in">
            <div className="text-center py-4 space-y-1.5">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-gray-900">
                কীভাবে আপনাকে সাহায্য করতে পারি?
              </h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                যেকোনো প্রশ্ন লিখে জানান অথবা প্রেসক্রিপশন ও রিপোর্টের ছবি আপলোড করে জেনে নিন।
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((item, idx) => {
                const ChipIcon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.isAction) {
                        fileInputRef.current?.click();
                      } else {
                        handleSendMessage(item.text);
                      }
                    }}
                    className="p-3 bg-white hover:bg-purple-50/40 border border-gray-200/80 hover:border-purple-300 rounded-2xl text-left transition-all shadow-2xs group cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs mb-1">
                      <ChipIcon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MESSAGES THREAD */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const msgPersona = PERSONAS[msg.persona || 'general'];
          const MsgIcon = msgPersona.icon;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-150`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-0.5 ${
                  isUser
                    ? 'bg-gray-900 text-white'
                    : `bg-gradient-to-tr ${msgPersona.color} text-white`
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <MsgIcon className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Uploaded image if present */}
                {msg.image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs max-w-xs mb-1">
                    <img
                      src={msg.image}
                      alt="Uploaded by user"
                      className="w-full max-h-60 object-cover rounded-2xl bg-gray-100"
                    />
                  </div>
                )}

                {/* Text Bubble */}
                {msg.content && (
                  <div
                    className={`p-3.5 rounded-2xl ${fontClass} leading-relaxed whitespace-pre-wrap select-text ${
                      isUser
                        ? 'bg-gray-900 text-white rounded-tr-xs shadow-2xs font-medium'
                        : 'bg-white text-gray-900 border border-gray-200/90 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}

                {/* Actions Dock */}
                <div
                  className={`flex items-center space-x-2 text-[10px] text-gray-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <>
                      <span>•</span>
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 hover:text-purple-700 transition-colors cursor-pointer flex items-center space-x-1"
                        title="কপি"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>

                      {/* Read aloud */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 hover:text-purple-700 transition-colors cursor-pointer flex items-center space-x-1 ${
                          isSpeakingId === msg.id ? 'text-purple-600 font-bold' : ''
                        }`}
                        title="পড়ে শোনান"
                      >
                        {isSpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-red-500 animate-pulse" />
                            <span className="text-red-600">থামুন</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>শুনুন</span>
                          </>
                        )}
                      </button>

                      {/* Regenerate */}
                      {index > 0 && (
                        <button
                          onClick={() => handleRegenerate(index)}
                          className="p-1 hover:text-purple-700 transition-colors cursor-pointer flex items-center space-x-1 border-l border-gray-200 pl-1.5"
                          title="পুনরায় লিখুন"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-start gap-2.5 animate-in fade-in">
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${CurrentPersona.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <PersonaIcon className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-gray-200/90 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center space-x-2 text-xs text-purple-700">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span className="font-bold">
                {selectedImage ? 'ছবি ও রিপোর্ট বিশ্লেষণ করছে...' : 'Desti AI উত্তর লিখছে...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 3. INPUT BAR WITH ATTACHMENT & PREVIEW */}
      <footer className="shrink-0 bg-white border-t border-gray-200/90 p-3 max-w-2xl mx-auto w-full shadow-lg z-20">
        {/* Selected Image Thumbnail Preview */}
        {selectedImage && (
          <div className="mb-2 p-2 bg-purple-50/60 border border-purple-200/80 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in duration-100">
            <div className="flex items-center space-x-2.5 min-w-0">
              <img
                src={selectedImage.dataUrl}
                alt="Selected"
                className="w-10 h-10 rounded-xl object-cover border border-purple-200 bg-white shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-purple-900 truncate block">
                  ছবি যুক্ত হয়েছে
                </span>
                <span className="text-[10px] text-gray-500 truncate block">
                  {selectedImage.file.name}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={removeSelectedImage}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-full transition-colors cursor-pointer"
              title="ছবি বাতিল করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
              selectedImage
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title="ছবি বা রিপোর্ট আপলোড করুন"
          >
            <ImagePlus className="w-4.5 h-4.5" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={isListening ? 'শোনা বন্ধ করুন' : 'ভয়েস ইনপুট'}
          >
            {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
          </button>

          {/* Textarea */}
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={
                selectedImage
                  ? 'এই ছবিটি নিয়ে যেকোনো প্রশ্ন লিখুন...'
                  : `Desti AI (${CurrentPersona.badge})-কে লিখুন...`
              }
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="w-full bg-gray-100/90 border border-transparent focus:border-purple-500 focus:bg-white pl-3.5 pr-8 py-2.5 rounded-2xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-2xs resize-none"
            />

            {inputPrompt && (
              <button
                type="button"
                onClick={() => setInputPrompt('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full cursor-pointer"
                title="মুছে ফেলুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!inputPrompt.trim() && !selectedImage) || isLoading}
            className="p-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 text-white rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="মেসেজ পাঠান"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Sub-bar hint */}
        <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-gray-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
            <span>{CurrentPersona.label}</span>
            <span>•</span>
            <span>{responseMode === 'concise' ? 'সংক্ষিপ্ত' : responseMode === 'detailed' ? 'বিস্তারিত' : 'ফরমাল'}</span>
          </div>
          <span>ছবি আপলোড ও ভয়েস সাপোর্ট সক্রিয়</span>
        </div>
      </footer>

      {/* 4. PROFESSIONAL CONTROLS & SETTINGS DRAWER (মডেল/স্টাইল নিয়ন্ত্রণের জন্য গোছানো প্যানেল) */}
      {showSettingsSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">এআই কন্ট্রোলস ও পছন্দ</h3>
                  <p className="text-[11px] text-gray-500">আপনার প্রয়োজনমতো এআই কাস্টমাইজ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsSheet(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">বিশেষজ্ঞ ভূমিকা (Expert Persona)</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(PERSONAS) as PersonaType[]).map((key) => {
                  const p = PERSONAS[key];
                  const IconC = p.icon;
                  const isSel = persona === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setPersona(key);
                        notify(`রোল: ${p.label}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        isSel
                          ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-2xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconC className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Response Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">উত্তরের দৈর্ঘ্য ও স্টাইল</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'concise', label: '⚡ সংক্ষিপ্ত' },
                  { id: 'detailed', label: '📋 বিস্তারিত' },
                  { id: 'formal', label: '💼 ফরমাল' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setResponseMode(item.id as ResponseMode);
                      notify(`স্টাইল: ${item.label}`);
                    }}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      responseMode === item.id
                        ? 'border-purple-600 bg-purple-50 text-purple-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">উত্তরের ভাষা</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'bn', label: 'বাংলা (প্রমিত)' },
                  { id: 'easy_bn', label: 'সহজ বাংলা' },
                  { id: 'en', label: 'English' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOutputLang(item.id as OutputLanguage);
                      notify(`ভাষা: ${item.label}`);
                    }}
                    className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      outputLang === item.id
                        ? 'border-purple-600 bg-purple-50 text-purple-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Voice Speed */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">ফন্ট সাইজ</label>
                <div className="flex rounded-xl border border-gray-200 p-0.5 bg-gray-50">
                  {(['sm', 'base', 'lg'] as FontSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        fontSize === sz ? 'bg-white shadow-2xs text-purple-700' : 'text-gray-600'
                      }`}
                    >
                      {sz === 'sm' ? 'ছোট' : sz === 'base' ? 'মাঝারি' : 'বড়'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">পড়ে শোনানোর গতি</label>
                <div className="flex rounded-xl border border-gray-200 p-0.5 bg-gray-50">
                  {[0.85, 1.0, 1.25].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSpeechSpeed(spd)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        speechSpeed === spd ? 'bg-white shadow-2xs text-purple-700' : 'text-gray-600'
                      }`}
                    >
                      {spd === 0.85 ? 'ধীর' : spd === 1.0 ? 'স্বাভাবিক' : 'দ্রুত'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowSettingsSheet(false)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                সংরক্ষণ ও বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Brain, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  Award, 
  Swords, 
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Plus,
  Menu,
  Search,
  Bell,
  Lightbulb
} from 'lucide-react';
import { BrainQuestion, DebateTopic, ActiveModule } from '../../types';
import { mockBrainQuestions, mockDebateTopics } from '../../data/mockData';
import { DestiBrainCreateTopicModal } from '../modals/DestiBrainCreateTopicModal';
import { useLanguage } from '../../context/LanguageContext';

interface DestiBrainViewProps {
  onEarnHopePoints?: (points: number) => void;
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onSearchClick?: () => void;
  onOpenCreatePost?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
}

export const DestiBrainView: React.FC<DestiBrainViewProps> = ({ 
  onEarnHopePoints, 
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenMenu,
  onOpenNotifications,
  onSearchClick,
  onOpenCreatePost,
  activeSubTab = 'ai',
  onSelectSubTab
}) => {
  const { l, isEn } = useLanguage();

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি Desti Brain এআই হেলথ অ্যাসিস্ট্যান্ট। রক্তের প্রয়োজনীয়তা, লক্ষণ পরীক্ষা, জরুরি প্রাথমিক চিকিৎসা বা স্বাস্থ্য বিষয়ে যেকোনো প্রশ্ন করতে পারেন।',
      time: '১০:০০ AM'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Q&A State
  const [questions, setQuestions] = useState<BrainQuestion[]>(mockBrainQuestions);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  // Debate State
  const [debates, setDebates] = useState<DebateTopic[]>(mockDebateTopics);
  const [userVotedSides, setUserVotedSides] = useState<Record<string, 'for' | 'against'>>({});

  // Brain Battle Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const sampleQuiz = [
    {
      question: 'মানবদেহে সার্বজনীন গ্রহীতা (Universal Recipient) রক্তের গ্রুপ কোনটি?',
      options: ['O+', 'AB+', 'O-', 'B+'],
      correct: 1, // AB+
      explanation: 'AB+ রক্তের গ্রুপধারী ব্যক্তি যেকোনো গ্রুপের রক্ত গ্রহণ করতে পারেন কারণ এদের লোহিত রক্তকণিকায় কোনো অ্যান্টিবডি থাকে না।'
    },
    {
      question: 'বাংলাদেশে জাতীয় জরুরি সেবা পাওয়ার হটলাইন নম্বর কত?',
      options: ['৯৯৯', '১০৬', '১০৯', '৩৩৩'],
      correct: 0, // 999
      explanation: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স পেতে বিনামূল্যে ৯৯৯ এ কল করুন।'
    },
    {
      question: 'একবার রক্তদানের পর পুনরায় রক্তদানের জন্য কমপক্ষে কতদিন বিরতি দিতে হয়?',
      options: ['১ মাস', '২ মাস', '৩ থেকে ৪ মাস', '৬ মাস'],
      correct: 2, // 3-4 months
      explanation: 'সাধারণত একজন সুস্থ প্রাপ্তবয়স্ক মানুষ প্রতি ৩ থেকে ৪ মাস পর পর নিরাপদে রক্তদান করতে পারেন।'
    },
    {
      question: 'তীব্র রক্তক্ষরণে আক্রান্ত রোগীকে দ্রুত কোন শিরায় স্যালাইন বা ফ্লুইড দেওয়া হয়?',
      options: ['পেরিফেরাল ইন্ট্রাভেনাস (IV)', 'ধমনী (Artery)', 'ত্বকের নিচে', 'মাংসপেশিতে'],
      correct: 0,
      explanation: 'জরুরি ফ্লুইড রিস্টোরেশনের জন্য পেরিফেরাল IV লাইন সবচেয়ে দ্রুত ও নিরাপদ।'
    }
  ];

  const handleAskAI = (promptText?: string) => {
    const textToSend = promptText || aiPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: 'এইমাত্র'
    };

    setAiMessages(prev => [...prev, userMsg]);
    if (!promptText) setAiPrompt('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiReply = 'আপনার স্বাস্থ্য সংক্রান্ত তথ্যের জন্য ধন্যবাদ। লক্ষণগুলো পর্যবেক্ষণ করুন। প্রয়োজনে জরুরি মেডিকেল হটলাইন ৯৯৯ অথবা নিকটস্থ হাসপাতালে যোগাযোগ করুন।';
      if (textToSend.includes('রক্ত') || textToSend.includes('গ্রুপ')) {
        aiReply = 'রক্তদানের জন্য আপনার ওজন ন্যূনতম ৫০ কেজি এবং বয়স ১৮ থেকে ৬০ বছরের মধ্যে হওয়া আবশ্যক। রক্তদানের ৩-৪ মাস পর পুনরায় রক্ত দেওয়া যায়। রোগীকে রক্ত দেওয়ার পূর্বে ক্রস-ম্যাচিং ও স্ক্রিনিং পরীক্ষা নিশ্চিত করা আবশ্যক।';
      } else if (textToSend.includes('জ্বর') || textToSend.includes('ডেঙ্গু')) {
        aiReply = 'উচ্চ জ্বর এবং তীব্র শরীর ব্যথা থাকলে প্রচুর তরল ও ওরাল স্যালাইন পান করুন। প্যারাসিটামল ছাড়া কোনো ব্যথানাশক (NSAIDs) খাবেন না। রক্তের প্লাটিলেট ও সিবিসি (CBC) পরীক্ষা করিয়ে ডাক্তারের পরামর্শ নিন।';
      } else if (textToSend.includes('কাশি') || textToSend.includes('শ্বাসকষ্ট')) {
        aiReply = 'শ্বাসকষ্ট থাকলে রোগীকে সোজা করে বসিয়ে দিন এবং আলো-বাতাসপূর্ণ স্থানে রাখুন। পালস অক্সিমিটারে অক্সিজেনের মাত্রা ৯২% এর নিচে নামলে অবিলম্বে হাসপাতালে অক্সিজেন সাপোর্ট প্রয়োজন।';
      }

      setAiMessages(prev => [...prev, {
        sender: 'ai',
        text: aiReply,
        time: 'এইমাত্র'
      }]);
      setIsGenerating(false);

      if (onEarnHopePoints) {
        onEarnHopePoints(5);
      }
    }, 1200);
  };

  const handleAnswerQuiz = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === sampleQuiz[currentQuizIndex].correct;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      if (onEarnHopePoints) onEarnHopePoints(10);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < sampleQuiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const toggleUpvote = (id: string) => {
    setUpvotedIds(prev => ({ ...prev, [id]: !prev[id] }));
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        const currentVotes = q.upvotes ?? q.votes;
        return {
          ...q,
          upvotes: upvotedIds[id] ? currentVotes - 1 : currentVotes + 1
        };
      }
      return q;
    }));
  };

  const handleAddTopic = (newTopic: BrainQuestion) => {
    setQuestions((prev) => [newTopic, ...prev]);
    setIsTopicModalOpen(false);
    if (onEarnHopePoints) onEarnHopePoints(15);
    if (onSelectSubTab) onSelectSubTab('learn');
  };

  const voteDebate = (topicId: string, side: 'for' | 'against') => {
    if (userVotedSides[topicId]) return;
    setUserVotedSides(prev => ({ ...prev, [topicId]: side }));
    setDebates(prev => prev.map(d => {
      if (d.id === topicId) {
        return {
          ...d,
          forVotes: side === 'for' ? d.forVotes + 1 : d.forVotes,
          againstVotes: side === 'against' ? d.againstVotes + 1 : d.againstVotes
        };
      }
      return d;
    }));
  };

  return (
    <div className="bg-gray-50 flex-1 flex flex-col min-h-screen pb-20 relative">
      {/* Mobile Top Header - Home Style with Amber Theme */}
      <div className="bg-white border-b border-gray-100 p-2 sm:p-3 sticky top-0 z-20 shadow-2xs flex items-center justify-between">
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenMenu}
            className="w-9 h-9 sm:w-10 sm:h-10 -ml-1 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-95 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectModule && onSelectModule('hope')}
            className="flex items-center tracking-tight px-1.5 py-1 cursor-pointer select-none -ml-0.5 active:opacity-80 transition-opacity"
          >
            <span className="font-black text-base sm:text-lg text-gray-950">DESTI</span>
            <span className="font-black text-base sm:text-lg text-amber-600 ml-0.5">
              BRAIN
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div
            onClick={() => {
              setIsTopicModalOpen(true);
              if (onOpenCreatePost) onOpenCreatePost();
            }}
            className="flex-1 min-w-0 flex items-center justify-between bg-white hover:bg-amber-50/40 active:bg-amber-50/70 border border-gray-200 hover:border-gray-300 active:border-gray-400 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-2xs cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 font-medium truncate">
              নতুন প্রশ্ন বা ডিবেট পোস্ট করুন...
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                ডিবেট করুন
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center shrink-0 ml-1 transition-colors">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right section: Search, Notifications and HP */}
        <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
          {quizScore > 0 && (
             <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 flex items-center mr-1">
               ⚡ {quizScore}
             </span>
          )}

          <button
            onClick={onSearchClick}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-full relative transition-all active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none shadow-xs">
              1
            </span>
          </button>
        </div>
      </div>

      {/* Sub-tab Switcher Pills */}
      <div className="flex items-center px-3 py-2 space-x-1.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar">
        {[
          { id: 'ai', label: '🤖 এআই ডক্টর' },
          { id: 'learn', label: '❓ প্রশ্নোত্তর' },
          { id: 'battle', label: '🏆 কুইজ ব্যাটল' },
          { id: 'debate', label: '⚖️ হেলথ ডিবেট' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectSubTab && onSelectSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= 1. AI DOCTOR TAB ================= */}
      {activeSubTab === 'ai' && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Disclaimer Pill */}
          <div className="bg-amber-50 px-3 py-2 border-b border-amber-100 flex items-center space-x-2 text-[11px] text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="line-clamp-1">
              এআই পরামর্শ শুধুমাত্র প্রাথমিক সচেতনতার জন্য। সংকটকালীন অবস্থায় অবিলম্বে ডাক্তারের পরামর্শ নিন।
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {aiMessages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-amber-600 text-white rounded-br-xs font-medium'
                        : 'bg-gray-100 text-gray-800 rounded-bl-xs border border-gray-200'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center space-x-1 mb-1 text-amber-700 font-bold text-[10px]">
                        <Brain className="w-3.5 h-3.5" />
                        <span>Desti Brain AI</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}

            {isGenerating && (
              <div className="flex items-center space-x-2 text-xs text-amber-600 font-semibold p-2">
                <Brain className="w-4 h-4 animate-bounce" />
                <span>মেডিকেল ডেটাবেস বিশ্লেষণ হচ্ছে...</span>
              </div>
            )}
          </div>

          {/* Quick Symptoms Chips */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {[
              'জ্বর ও ডেঙ্গুর প্রাথমিক লক্ষণ কি?',
              'রক্তদানে শারীরিক সুবিধা কি কি?',
              'তীব্র রক্তক্ষরণে প্রাথমিক ফার্স্ট এইড',
              'শিশুর হঠাৎ শ্বাসকষ্ট হলে করণীয়'
            ].map((symptom, i) => (
              <button
                key={i}
                onClick={() => handleAskAI(symptom)}
                className="px-2.5 py-1 bg-white hover:bg-amber-50 text-[10.5px] font-medium text-gray-700 hover:text-amber-800 rounded-full border border-gray-200 whitespace-nowrap shrink-0 transition-colors shadow-2xs active:scale-95"
              >
                {symptom}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="স্বাস্থ্য বা ফার্স্ট এইড নিয়ে প্রশ্ন লিখুন..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3.5 rounded-full border border-gray-200 focus:outline-none focus:border-amber-500 bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isGenerating || !aiPrompt.trim()}
              className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-full shadow-xs transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ================= 2. COMMUNITY Q&A TAB ================= */}
      {activeSubTab === 'learn' && (
        <div className="flex-1 bg-gray-50 flex flex-col overflow-y-auto">
          <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-1.5">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold text-gray-900">কমিউনিটি হেলথ প্রশ্নোত্তর</h3>
            </div>
            <button
              onClick={() => setIsTopicModalOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-xs active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>প্রশ্ন করুন</span>
            </button>
          </div>

          <div className="p-3 space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">{q.title}</h4>
                  <button
                    onClick={() => toggleUpvote(q.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 transition-all ${
                      upvotedIds[q.id]
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{q.upvotes ?? q.votes}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                  <span>{q.author} • {q.time ?? q.timeAgo}</span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    {q.answersCount} উত্তর
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 3. BATTLE QUIZ TAB ================= */}
      {activeSubTab === 'battle' && (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-between overflow-y-auto">
          {!quizFinished ? (
            <div className="space-y-4">
              {/* Progress & Score Bar */}
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-gray-800">
                    প্রশ্ন {currentQuizIndex + 1} / {sampleQuiz.length}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  স্কোর: {quizScore} HP
                </span>
              </div>

              {/* Question Card */}
              <div className="p-4 bg-white rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 leading-relaxed">
                  {sampleQuiz[currentQuizIndex].question}
                </h3>

                {/* Option Buttons */}
                <div className="space-y-2.5">
                  {sampleQuiz[currentQuizIndex].options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === sampleQuiz[currentQuizIndex].correct;

                    let btnStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-amber-50/50';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-50 border-red-500 text-red-800 font-bold';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerQuiz(i)}
                        disabled={isAnswered}
                        className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle} active:scale-98`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 animate-in fade-in">
                    <span className="font-bold">ব্যাখ্যা: </span>
                    {sampleQuiz[currentQuizIndex].explanation}
                  </div>
                )}
              </div>

              {/* Next Button */}
              {isAnswered && (
                <button
                  onClick={handleNextQuiz}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>{currentQuizIndex < sampleQuiz.length - 1 ? 'পরবর্তী প্রশ্ন' : 'ফলাফল দেখুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            /* Quiz Completed Screen */
            <div className="bg-white rounded-3xl p-6 text-center shadow-lg border border-gray-200 space-y-4 my-auto">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-lg font-black text-gray-900">কুইজ সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-gray-500">আপনার হোপ পয়েন্ট অ্যাকাউন্টে যোগ করা হয়েছে।</p>
              
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 inline-block px-6">
                <span className="text-2xl font-black text-amber-700">+{quizScore} HP</span>
                <p className="text-[10px] text-amber-800 font-bold uppercase mt-0.5">অর্জিত পয়েন্ট</p>
              </div>

              <button
                onClick={resetQuiz}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                <span>আবার খেলুন</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 4. DEBATE TAB ================= */}
      {activeSubTab === 'debate' && (
        <div className="flex-1 bg-gray-50 p-3 space-y-3 overflow-y-auto">
          <div className="p-3 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Swords className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold text-gray-900">জনস্বাস্থ্য ডিবেট এরিনা</h3>
            </div>
            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">লাইভ ভোটিং</span>
          </div>

          {debates.map((deb) => {
            const totalVotes = deb.forVotes + deb.againstVotes;
            const forPercent = totalVotes > 0 ? Math.round((deb.forVotes / totalVotes) * 100) : 50;
            const userVote = userVotedSides[deb.id];

            return (
              <div key={deb.id} className="p-4 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
                <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {deb.category}
                </span>
                <h4 className="text-xs font-bold text-gray-900 leading-snug">{deb.title ?? deb.motion}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{deb.description}</p>

                {/* Voting Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-emerald-700">পক্ষে ({forPercent}%)</span>
                    <span className="text-rose-700">বিপক্ষে ({100 - forPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${forPercent}%` }} className="bg-emerald-500 transition-all duration-500" />
                  </div>
                </div>

                {/* Vote Buttons */}
                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => voteDebate(deb.id, 'for')}
                    disabled={!!userVote}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      userVote === 'for'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    👍 পক্ষে ভোট
                  </button>
                  <button
                    onClick={() => voteDebate(deb.id, 'against')}
                    disabled={!!userVote}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      userVote === 'against'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    👎 বিপক্ষে ভোট
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dedicated Desti Brain Case & Topic Modal */}
      <DestiBrainCreateTopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSubmitTopic={handleAddTopic}
      />
    </div>
  );
};

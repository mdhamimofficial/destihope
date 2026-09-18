import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  ArrowLeft, 
  Paperclip, 
  Smile, 
  Mic, 
  Users, 
  CheckCheck,
  ShieldCheck,
  PhoneIncoming,
  PhoneOutgoing,
  Clock
} from 'lucide-react';
import { ChatConversation, ChatMessage, ActiveModule } from '../../types';
import { mockConversations } from '../../data/mockData';

interface DestiChatViewProps {
  onBackToHome?: () => void;
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
}

export const DestiChatView: React.FC<DestiChatViewProps> = ({ 
  onSelectModule,
  activeSubTab = 'all',
  onSelectSubTab 
}) => {
  const [conversations] = useState<ChatConversation[]>(mockConversations);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [callActive, setCallActive] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'other',
      text: 'আসসালামু আলাইকুম তানভীর ভাই। ঢামেক ইমার্জেন্সিতে রোগী ভর্তি আছে। আপনি কি রক্ত দিতে আসতে পারছেন?',
      time: '১০:০৫ AM'
    },
    {
      id: 'm2',
      sender: 'me',
      text: 'ওয়ালাইকুমুস সালাম। আমি ধানমন্ডি থেকে রওনা হয়েছি, ইনশাআল্লাহ ১৫ মিনিটের মধ্যে পৌঁছাব।',
      time: '১০:০৮ AM'
    },
    {
      id: 'm3',
      sender: 'other',
      text: 'আলহামদুলিল্লাহ ভাই! ডাক্তার সাহেব ব্লাড ক্রস-ম্যাচিংয়ের প্রস্তুতি নিয়ে রাখছেন। দোতলা ট্রান্সফিউশন ইউনিটে চলে আসুন।',
      time: '১০:০৯ AM'
    }
  ]);

  // Mock Emergency Calls History
  const mockCalls = [
    { id: 'c1', name: 'ঢামেক জরুরি ব্লাড ডেস্ক', type: 'incoming', time: 'আজ, ১০:১৫ AM', status: 'missed', phone: '01711-223344', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150' },
    { id: 'c2', name: 'সাদিয়া তাসনিম (A+ ডোনার)', type: 'outgoing', time: 'আজ, ০৯:৪০ AM', duration: '৩ মিনিট ১২ সেকেন্ড', phone: '01822-334455', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 'c3', name: 'চট্টগ্রাম রেসকিউ কোঅর্ডিনেটর', type: 'incoming', time: 'গতকাল, ০৮:২০ PM', duration: '১ মিনিট ৪৫ সেকেন্ড', phone: '01933-445566', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  ];

  // Filtering conversations based on sub-tab
  const filteredConversations = conversations.filter((c) => {
    if (activeSubTab === 'blood') return c.type === 'blood_chat';
    if (activeSubTab === 'groups') return c.type === 'group';
    if (searchQuery) {
      return c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputMessage,
      time: 'এইমাত্র'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Automated simulated reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'other',
        text: 'ধন্যবাদ, বার্তাটি পেয়েছি। মেডিকেল কোঅর্ডিনেটর দ্রুত নিশ্চিত করবেন।',
        time: 'এইমাত্র'
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1100);
  };

  const sendQuickChip = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: 'এইমাত্র'
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="bg-gray-50 flex-1 flex flex-col min-h-screen pb-20 relative">
      {/* Call overlay simulation */}
      {callActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 text-white flex flex-col items-center justify-between p-8 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="text-center mt-12 space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-teal-500/20 border-2 border-teal-400 mx-auto flex items-center justify-center animate-pulse">
                <Phone className="w-10 h-10 text-teal-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-slate-950 animate-ping" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{activeChat?.title || 'DestiChat লাইভ কল'}</h3>
              <p className="text-sm text-teal-300 font-semibold mt-1">সুরক্ষিত ক্রাইসিস নেটওয়ার্ক কল চলছে...</p>
              <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ০০:২৪
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6 mb-12">
            <button
              onClick={() => setCallActive(null)}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl shadow-red-600/30 transition-transform active:scale-95 text-white"
              aria-label="End call"
            >
              <Phone className="w-7 h-7 rotate-[135deg]" />
            </button>
          </div>
        </div>
      )}

      {!activeChat ? (
        /* Conversation / Calls Master View */
        <div className="flex-1 flex flex-col bg-white">
          {/* Mobile Top App Bar */}
          <div className="bg-white border-b border-gray-100 p-2 sm:p-3 sticky top-0 z-20 shadow-2xs flex items-center justify-between">
            <div 
              onClick={() => onSelectModule && onSelectModule('hope')}
              className="flex items-center tracking-tight px-1.5 py-1 cursor-pointer select-none active:opacity-80 transition-opacity"
            >
              <span className="font-black text-base sm:text-lg text-gray-950">DESTI</span>
              <span className="font-black text-base sm:text-lg text-teal-600 ml-0.5">
                CHAT
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                উদ্ধার ও রক্তদাতা নেটওয়ার্ক
              </span>
              <button 
                onClick={() => setCallActive('জরুরি কল')}
                className="p-2 text-teal-700 hover:bg-teal-50 rounded-full transition-colors active:scale-90"
                title="জরুরি কল"
              >
                <Phone className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Quick Search bar */}
          <div className="px-3 pt-2.5 pb-1 bg-white">
            <div className="flex items-center bg-gray-100/90 rounded-xl px-3 py-2 border border-gray-200/60 focus-within:border-teal-500 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="চ্যাট, রক্তদাতা বা গ্রুপ খুঁজুন..."
                className="w-full text-xs text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Sub-tab Pills */}
          <div className="flex items-center px-3 py-2 space-x-1.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'সকল চ্যাট', count: conversations.length },
              { id: 'blood', label: '🩸 রক্ত কেস', count: conversations.filter(c => c.type === 'blood_chat').length },
              { id: 'groups', label: '👥 উদ্ধার গ্রুপ', count: conversations.filter(c => c.type === 'group').length },
              { id: 'calls', label: '📞 কল হিস্ট্রি', count: mockCalls.length }
            ].map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSubTab && onSelectSubTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-teal-800 text-teal-100' : 'bg-gray-200 text-gray-700'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content: Calls or Chat List */}
          {activeSubTab === 'calls' ? (
            <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
              <div className="p-3 bg-teal-50/50 flex items-center justify-between text-xs text-teal-900 font-semibold">
                <span>জরুরি যোগাযোগ লগ</span>
                <span className="text-[10px] text-teal-600 bg-white px-2 py-0.5 rounded-full border border-teal-200">সুরক্ষিত</span>
              </div>
              {mockCalls.map((call) => (
                <div key={call.id} className="p-3.5 hover:bg-gray-50 flex items-center justify-between transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={call.avatar} alt={call.name} referrerPolicy="no-referrer" className="w-11 h-11 rounded-full object-cover border border-gray-200" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{call.name}</h4>
                      <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-0.5">
                        {call.type === 'incoming' ? (
                          <PhoneIncoming className={`w-3.5 h-3.5 ${call.status === 'missed' ? 'text-red-500' : 'text-teal-600'}`} />
                        ) : (
                          <PhoneOutgoing className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>{call.time}</span>
                        {call.duration && <span className="text-gray-400">• {call.duration}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCallActive(call.name)}
                    className="p-2.5 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors active:scale-95"
                    aria-label="Call again"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Conversation list */
            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveChat(conv)}
                  className="p-3.5 hover:bg-gray-50 flex items-center space-x-3.5 cursor-pointer transition-colors active:bg-gray-100"
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200/80 shadow-2xs"
                    />
                    {conv.type === 'blood_chat' && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white font-bold">
                        🩸
                      </span>
                    )}
                    {conv.type === 'group' && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white font-bold">
                        👥
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-xs font-bold text-gray-900 truncate">
                        {conv.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 truncate leading-snug">
                      {conv.lastMessage}
                    </p>

                    {conv.badge && (
                      <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 mt-1">
                        {conv.badge}
                      </span>
                    )}
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Active Conversation Room (Native Mobile Messaging UI) */
        <div className="flex-1 flex flex-col bg-[#F3F6F8]">
          {/* Room Top Bar */}
          <div className="px-3 py-2.5 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-20 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                onClick={() => setActiveChat(null)}
                className="p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative shrink-0">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.title}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-gray-900 truncate flex items-center gap-1">
                  {activeChat.title}
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 inline shrink-0" />
                </h3>
                <p className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                  অনলাইন • রেসপন্স টাইম ২ মি.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0 text-gray-700">
              <button
                onClick={() => setCallActive(activeChat.title)}
                className="p-2 hover:bg-gray-100 rounded-full text-teal-700 transition-colors"
                title="ভয়েস কল"
              >
                <Phone className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setCallActive(`${activeChat.title} (ভিডিও)`)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                title="ভিডিও কল"
              >
                <Video className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Quick Info Banner */}
          <div className="bg-teal-50 px-3 py-1.5 border-b border-teal-100 flex items-center justify-between text-[11px] text-teal-900">
            <span className="font-semibold">রক্তদান ও উদ্ধার সমন্বয় চ্যানেল</span>
            <span className="font-bold text-[10px] bg-teal-200/70 text-teal-800 px-2 py-0.2 rounded-full">ভেরিফাইড</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-br-xs font-medium'
                        : 'bg-white text-gray-800 rounded-bl-xs border border-gray-200/80 font-normal'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5 text-[10px] text-gray-400 px-1">
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-teal-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Response Chips */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {[
              'আমি রক্ত দিতে প্রস্তুত 🩸',
              'হাসপাতালে পৌঁছাতে কতক্ষণ লাগবে? 🏥',
              'রোগীর বিস্তারিত প্রেসক্রিপশন দিন 📋',
              'জরুরি অ্যাম্বুলেন্স প্রয়োজন 🚑'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendQuickChip(chip)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-teal-50 text-[10.5px] font-medium text-gray-700 hover:text-teal-700 rounded-full border border-gray-200/70 whitespace-nowrap transition-colors shrink-0 active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Mobile Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center space-x-2"
          >
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
              title="ইমোজি"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
              title="ফাইল যুক্ত করুন"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="একটি বার্তা লিখুন..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3.5 rounded-full border border-gray-200 focus:outline-none focus:border-teal-500 bg-gray-50 focus:bg-white transition-all"
            />

            {inputMessage.trim() ? (
              <button
                type="submit"
                className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-xs transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => sendQuickChip('🎙️ [ভয়েস মেসেজ: আমি রাস্তায় আছি]')}
                className="p-2.5 text-teal-600 hover:bg-teal-50 rounded-full transition-colors active:scale-90"
                title="ভয়েস নোট"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

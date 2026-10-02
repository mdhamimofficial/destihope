import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  AlarmClock,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Smartphone,
  Volume2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface AlarmItem {
  id: string;
  time: string; // "HH:MM"
  label: string;
  isActive: boolean;
  category: 'study' | 'app_limit' | 'medicine' | 'general';
}

interface AlarmTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

// Pleasant browser audio synthesis
const triggerBeepChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    const now = ctx.currentTime;
    playTone(523.25, now, 0.25); // C5
    playTone(659.25, now + 0.2, 0.25); // E5
    playTone(783.99, now + 0.4, 0.3); // G5
    playTone(1046.5, now + 0.7, 0.6); // C6
  } catch {
    // Audio context may be restricted by browser policy if unprompted
  }
};

export const AlarmTimerModal: React.FC<AlarmTimerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { l, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'countdown' | 'alarm'>('countdown');

  // ---------- COUNTDOWN TIMER STATE ----------
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60); // Default 25 min (Pomodoro)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('পড়াশোনা ও ফোকাস সেশন');
  const [isAlarmRinging, setIsAlarmRinging] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ---------- ALARM CLOCK STATE ----------
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('destihope_alarms_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: '1', time: '06:30', label: 'ভোরের পড়াশোনা শুরু', isActive: true, category: 'study' },
      { id: '2', time: '14:00', label: 'জরুরি ওষুধ খাওয়ার সময়', isActive: true, category: 'medicine' },
      { id: '3', time: '23:00', label: 'স্ক্রিন টাইম শেষ / ফোন বন্ধ', isActive: false, category: 'app_limit' },
    ];
  });

  const [newAlarmTime, setNewAlarmTime] = useState('07:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [newAlarmCategory, setNewAlarmCategory] = useState<'study' | 'app_limit' | 'medicine' | 'general'>('app_limit');
  const [isAddingAlarm, setIsAddingAlarm] = useState(false);

  // Manage body scroll lock
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

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('destihope_alarms_list', JSON.stringify(alarms));
  }, [alarms]);

  // ---------- TIMER LOGIC ----------
  useEffect(() => {
    if (isRunning && remainingSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsRunning(false);
            setIsAlarmRinging(true);
            triggerBeepChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, remainingSeconds]);

  // Sound loop during ringing
  useEffect(() => {
    let soundInterval: NodeJS.Timeout | null = null;
    if (isAlarmRinging) {
      soundInterval = setInterval(() => {
        triggerBeepChime();
      }, 2000);
    }
    return () => {
      if (soundInterval) clearInterval(soundInterval);
    };
  }, [isAlarmRinging]);

  const handleStartPause = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    setIsRunning(!isRunning);
    setIsAlarmRinging(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setIsAlarmRinging(false);
    setRemainingSeconds(totalSeconds);
  };

  const setPresetMinutes = (minutes: number, label: string) => {
    const sec = minutes * 60;
    setIsRunning(false);
    setIsAlarmRinging(false);
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
    setTimerLabel(label);
  };

  const adjustMinutes = (delta: number) => {
    setIsRunning(false);
    setIsAlarmRinging(false);
    const newSec = Math.max(60, totalSeconds + delta * 60);
    setTotalSeconds(newSec);
    setRemainingSeconds(newSec);
  };

  const formatTimeDisplay = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  // ---------- ALARM LIST ACTIONS ----------
  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((al) => (al.id === id ? { ...al, isActive: !al.isActive } : al))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((al) => al.id !== id));
    if (onShowToast) onShowToast('অ্যালার্ম মুছে ফেলা হয়েছে');
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlarmTime) return;

    const newAlarm: AlarmItem = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel.trim() || 'নির্ধারিত অ্যালার্ম',
      isActive: true,
      category: newAlarmCategory,
    };

    setAlarms((prev) => [newAlarm, ...prev]);
    setIsAddingAlarm(false);
    setNewAlarmLabel('');
    if (onShowToast) onShowToast('নতুন অ্যালার্ম সফলভাবে সেট হয়েছে');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white text-gray-900 overflow-hidden animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desti-clock-header"
    >
      {/* 1. APP-HEADER (Full Screen Native Bar) */}
      <header className="shrink-0 bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 rounded-full transition-all cursor-pointer"
              aria-label="ফিরে যান"
              title="ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                <AlarmClock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 id="desti-clock-header" className="text-base font-black text-gray-900 leading-tight">
                  Desti Clock
                </h1>
                <p className="text-[11px] text-gray-500 font-medium">
                  স্মার্ট অ্যালার্ম ও ফোকাস কাউন্টডাউন
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 rounded-full transition-all cursor-pointer"
            aria-label={l('বন্ধ করুন', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. TAB SWITCHER (কাউন্টডাউন | অ্যালার্ম) */}
        <div className="max-w-2xl mx-auto px-4 flex items-center space-x-2 pb-2.5 pt-1">
          <button
            onClick={() => setActiveTab('countdown')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'countdown'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>ফোকাস কাউন্টডাউন</span>
          </button>

          <button
            onClick={() => setActiveTab('alarm')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'alarm'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            <AlarmClock className="w-4 h-4" />
            <span>দৈনিক অ্যালার্ম ({alarms.filter((a) => a.isActive).length})</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN FULL SCREEN CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto bg-gray-50/70 px-4 py-4 max-w-2xl mx-auto w-full space-y-4">
        {/* ===================== TAB 1: COUNTDOWN TIMER ===================== */}
        {activeTab === 'countdown' && (
          <div className="space-y-4">
            {/* ALARM RINGING ALERT BANNER */}
            {isAlarmRinging && (
              <div className="p-4 bg-red-600 text-white rounded-2xl animate-bounce shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <div>
                    <p className="font-bold text-sm">⏰ সময় সমাপ্ত!</p>
                    <p className="text-xs text-red-100">এবার অ্যাপ ব্যবহার বন্ধ করুন বা নির্ধারিত কাজটি করুন।</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAlarmRinging(false)}
                  className="px-4 py-2 bg-white text-red-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-red-50 shadow-md active:scale-95"
                >
                  অ্যালার্ম বন্ধ
                </button>
              </div>
            )}

            {/* BIG HERO DIGITAL TIMER CARD */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 text-center space-y-4 shadow-sm">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700">
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{timerLabel}</span>
              </div>

              {/* Big Digital Display */}
              <div className="py-3">
                <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-gray-900 select-none">
                  {formatTimeDisplay(remainingSeconds)}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200/50">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Quick Minutes Fine-Tuner (+5m, -5m) */}
              <div className="flex items-center justify-center space-x-2 pt-1 text-xs text-gray-500">
                <button
                  onClick={() => adjustMinutes(-5)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 cursor-pointer active:scale-95"
                >
                  - ৫ মিনিট
                </button>
                <span className="text-[11px] text-gray-400">সময় বাড়ান/কমান</span>
                <button
                  onClick={() => adjustMinutes(5)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700 cursor-pointer active:scale-95"
                >
                  + ৫ মিনিট
                </button>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={handleResetTimer}
                  className="p-3.5 rounded-2xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                  title="রিসেট করুন"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={handleStartPause}
                  className={`px-8 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center space-x-2 shadow-sm transition-all active:scale-95 cursor-pointer ${
                    isRunning
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-white" />
                      <span>বিরতি (Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>{remainingSeconds === 0 ? 'পুনরায় শুরু' : 'টাইমার শুরু করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PRESETS FOR STUDENTS & BUSY USERS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ফোকাস ও স্ক্রিন-টাইম প্রিসেট
                </span>
                <span className="text-[11px] text-gray-400">১-ট্যাপে সেট করুন</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { mins: 15, label: '📱 ১৫ মিনিট স্ক্রল লিমিট', sub: 'সোশ্যাল মিডিয়া সময় অপচয় রোধে' },
                  { mins: 25, label: '📚 ২৫ মিনিট পোমোডোরো', sub: 'স্টুডেন্টদের নিবিড় পড়াশোনা' },
                  { mins: 45, label: '🎯 ৪৫ মিনিট ফোকাস টাস্ক', sub: 'কাজের লক্ষ্য বাস্তবায়ন' },
                  { mins: 10, label: '☕ ১০ মিনিট রিল্যাক্স বিরতি', sub: 'কাজের মাঝে বিশ্রাম' },
                ].map((p) => (
                  <button
                    key={p.mins}
                    onClick={() => setPresetMinutes(p.mins, p.label)}
                    className={`p-3.5 text-left rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                      totalSeconds === p.mins * 60
                        ? 'border-red-300 bg-red-50/70 text-red-950 font-bold ring-1 ring-red-400/30'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-800'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{p.label}</p>
                    <p className="text-[10.5px] text-gray-500 mt-1 leading-snug">{p.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* HELPFUL GUIDANCE CARD */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-amber-950 text-xs flex items-start space-x-3 shadow-2xs">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-xs">কীভাবে Desti Clock সাহায্য করে?</p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  স্টুডেন্ট বা ব্যস্ত ব্যক্তিরা অ্যাপে কোনো দরকারি কাজ করতে এসে অতিরিক্ত স্ক্রলিংয়ের ফাঁদে পড়ে যান। টাইমার চালু রাখলে সময় শেষেই অ্যালার্ম বেজে আপনাকে সচেতন করে দেবে, ফলে অ্যাপ বন্ধ করে নিজের কাজে ফিরে যাওয়া সহজ হয়।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SCHEDULED ALARMS ===================== */}
        {activeTab === 'alarm' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  দৈনিক অ্যালার্ম শিডিউল
                </h2>
                <p className="text-[11px] text-gray-400">নির্দিষ্ট সময়ে ডিভাইস আপনাকে রিমাইন্ডার দেবে</p>
              </div>

              {!isAddingAlarm && (
                <button
                  onClick={() => setIsAddingAlarm(true)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ নতুন অ্যালার্ম</span>
                </button>
              )}
            </div>

            {/* ADD NEW ALARM CARD FORM */}
            {isAddingAlarm && (
              <form
                onSubmit={handleCreateAlarm}
                className="p-4 bg-white border border-red-200 rounded-3xl space-y-3 shadow-sm animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <p className="text-xs font-bold text-gray-900">নতুন অ্যালার্ম সেট করুন</p>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    Desti Alarm
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10.5px] text-gray-500 block mb-1 font-bold">সময় (Time):</label>
                    <input
                      type="time"
                      value={newAlarmTime}
                      onChange={(e) => setNewAlarmTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-500 block mb-1 font-bold">ধরন (Category):</label>
                    <select
                      value={newAlarmCategory}
                      onChange={(e) => setNewAlarmCategory(e.target.value as any)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-500"
                    >
                      <option value="app_limit">স্ক্রিন-টাইম শেষ</option>
                      <option value="study">পড়াশোনা শুরু</option>
                      <option value="medicine">ওষুধের সময়</option>
                      <option value="general">সাধারণ অ্যালার্ম</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10.5px] text-gray-500 block mb-1 font-bold">কাজের বিবরণ / লেবেল:</label>
                  <input
                    type="text"
                    placeholder="যেমন: পড়া শেষ করে ঘুম বা ক্লাসে যাওয়া"
                    value={newAlarmLabel}
                    onChange={(e) => setNewAlarmLabel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAlarm(false)}
                    className="px-3.5 py-1.5 text-xs text-gray-500 hover:text-gray-800"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-2xs active:scale-95"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}

            {/* ALARMS LIST */}
            <div className="space-y-2.5">
              {alarms.map((al) => (
                <div
                  key={al.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between shadow-2xs ${
                    al.isActive
                      ? 'bg-white border-gray-200/90'
                      : 'bg-gray-50/70 border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        al.isActive
                          ? 'bg-red-50 text-red-600 border border-red-100 shadow-2xs'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <AlarmClock className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black font-mono text-gray-900">{al.time}</span>
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {al.category === 'study' && 'পড়াশোনা'}
                          {al.category === 'medicine' && 'ওষুধ'}
                          {al.category === 'app_limit' && 'স্ক্রিন লিমিট'}
                          {al.category === 'general' && 'রিমাইন্ডার'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-0.5">{al.label}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleAlarm(al.id)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        al.isActive ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          al.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAlarm(al.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Sound Status Banner */}
        <div className="p-3 bg-white rounded-2xl border border-gray-200 text-center shadow-2xs">
          <p className="text-[11px] text-gray-600 font-medium flex items-center justify-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>স্মার্ট অডিও অ্যালার্ম সক্রিয় • সময় সমাপ্ত হলে স্বয়ংক্রিয় সংকেত বাজবে।</span>
          </p>
        </div>
      </main>
    </div>
  );
};

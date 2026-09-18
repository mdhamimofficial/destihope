import React, { useState } from 'react';
import { 
  Play, 
  Pause,
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  Headphones,
  Film,
  Volume2,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Menu,
  Search,
  Bell,
  Video
} from 'lucide-react';
import { MediaItem, ActiveModule } from '../../types';
import { mockMediaList } from '../../data/mockData';

interface DestiMediaViewProps {
  onOpenModuleSwitcher?: () => void;
  onSelectModule?: (mod: ActiveModule) => void;
  onOpenMenu?: () => void;
  onOpenNotifications?: () => void;
  onSearchClick?: () => void;
  onOpenCreatePost?: () => void;
  activeSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
}

export const DestiMediaView: React.FC<DestiMediaViewProps> = ({ 
  onOpenModuleSwitcher,
  onSelectModule,
  onOpenMenu,
  onOpenNotifications,
  onSearchClick,
  onOpenCreatePost,
  activeSubTab = 'reels',
  onSelectSubTab
}) => {
  const [items] = useState<MediaItem[]>(mockMediaList);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({
    'm1': true,
  });
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({
    'm2': true,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reelComments, setReelComments] = useState<string[]>([
    'অসাধারণ তথ্য! সবার রক্তদান সম্পর্কে এই ভুল ধারণাগুলো ভাঙা উচিত। ❤️',
    'রক্তের গ্রুপ ও ক্রস-ম্যাচিং নিয়ে আরও ভিডিও চাই ডাক্তার আপু।',
    'আমি গত মাসে ৩য় বার রক্ত দিলাম, কোনো দুর্বলতা হয়নি!'
  ]);

  // Audio player state
  const [activeAudio, setActiveAudio] = useState<MediaItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Selected video for modal popup
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);

  const reels = items.filter((i) => i.type === 'reel');
  const videos = items.filter((i) => i.type === 'video');
  const audios = items.filter((i) => i.type === 'audio');
  const savedItems = items.filter((i) => savedMap[i.id]);

  const currentReel = reels[currentReelIndex] || reels[0];

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextReel = () => {
    if (currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setReelComments(prev => [commentText, ...prev]);
    setCommentText('');
  };

  return (
    <div className="bg-slate-950 flex-1 flex flex-col h-full relative text-white pb-20 overflow-hidden">
      {/* Mobile Top Header - Media Style with Purple Theme */}
      <div className="bg-slate-950 border-b border-zinc-900 p-2 sm:p-3 sticky top-0 z-40 shadow-md flex items-center justify-between text-white">
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 -ml-1 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-all active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </button>
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectModule && onSelectModule('hope')}
            className="flex items-center tracking-tight px-1.5 py-1 cursor-pointer select-none -ml-0.5 active:opacity-80 transition-opacity"
          >
            <span className="font-black text-base sm:text-lg text-white">DESTI</span>
            <span className="font-black text-base sm:text-lg text-purple-500 ml-0.5">
              MEDIA
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div
            onClick={onOpenCreatePost}
            className="flex-1 min-w-0 flex items-center justify-between bg-zinc-900 hover:bg-zinc-800/80 active:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 active:border-zinc-500 rounded-full pl-3.5 pr-1.5 py-1.5 sm:py-2 shadow-inner cursor-pointer transition-all mx-1 sm:mx-2 group"
          >
            <span className="text-[11px] xs:text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 font-medium truncate">
              নতুন ভিডিও বা রিল আপলোড করুন...
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <span className="hidden md:inline text-[11px] font-semibold text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-800/60">
                আপলোড করুন
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-900/40 group-hover:bg-purple-900/70 flex items-center justify-center shrink-0 ml-1 transition-colors">
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 group-hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-0 sm:space-x-0.5 shrink-0">
          <button
            onClick={onSearchClick}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full transition-all active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
          </button>

          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-full relative transition-all active:scale-90"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3]" />
            <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 bg-purple-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-zinc-950 leading-none shadow-xs">
              1
            </span>
          </button>
        </div>
      </div>

      {/* ================= REELS TAB (FULL MOBILE IMMERSION) ================= */}
      {activeSubTab === 'reels' && (
        <div className="relative flex-1 flex flex-col bg-black overflow-hidden select-none">
          {/* Top Bar indicator for reels */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-black tracking-tight text-white/90 drop-shadow-md">DESTI<span className="text-purple-400">REELS</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse drop-shadow-md" />
            </div>
          </div>

          {/* Active Reel Canvas */}
          <div 
            className="flex-1 relative flex items-center justify-center bg-zinc-900 cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <img
              src={currentReel.thumbnail}
              alt={currentReel.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30" />

            {/* Play/Pause Center Indicator */}
            {!isPlaying && (
              <div className="relative z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center animate-in zoom-in-75 duration-200">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            )}

            {/* Next / Previous Reel Navigation Gestures */}
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20 flex flex-col space-y-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handlePrevReel}
                disabled={currentReelIndex === 0}
                className={`p-2 rounded-full backdrop-blur-md ${currentReelIndex === 0 ? 'bg-white/5 text-white/20' : 'bg-black/50 text-white hover:bg-black/70'}`}
                title="আগের রিল"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextReel}
                disabled={currentReelIndex === reels.length - 1}
                className={`p-2 rounded-full backdrop-blur-md ${currentReelIndex === reels.length - 1 ? 'bg-white/5 text-white/20' : 'bg-black/50 text-white hover:bg-black/70'}`}
                title="পরের রিল"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Right Side Floating Actions (TikTok/Insta Mobile Style) */}
            <div 
              className="absolute right-3 bottom-14 z-20 flex flex-col items-center space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Creator Avatar with follow plus */}
              <div className="relative mb-1">
                <img
                  src={currentReel.creator.avatar}
                  alt={currentReel.creator.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full border-2 border-purple-500 object-cover shadow-lg"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  +
                </span>
              </div>

              {/* Like Button */}
              <button
                onClick={() => toggleLike(currentReel.id)}
                className="flex flex-col items-center group transition-transform active:scale-75"
              >
                <div className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${likedMap[currentReel.id] ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-white'}`}>
                  <Heart className={`w-6 h-6 ${likedMap[currentReel.id] ? 'fill-red-500 stroke-red-500' : ''}`} />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white shadow-xs">
                  {likedMap[currentReel.id] ? currentReel.likes + 1 : currentReel.likes}
                </span>
              </button>

              {/* Comments Button */}
              <button
                onClick={() => setShowComments(true)}
                className="flex flex-col items-center transition-transform active:scale-75"
              >
                <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">
                  {currentReel.commentsCount + reelComments.length - 3}
                </span>
              </button>

              {/* Bookmark Save */}
              <button
                onClick={() => toggleSave(currentReel.id)}
                className="flex flex-col items-center transition-transform active:scale-75"
              >
                <div className={`p-2.5 rounded-full backdrop-blur-md ${savedMap[currentReel.id] ? 'bg-amber-500/20 text-amber-400' : 'bg-black/40 text-white'}`}>
                  <Bookmark className={`w-6 h-6 ${savedMap[currentReel.id] ? 'fill-amber-400 text-amber-400' : ''}`} />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">সংরক্ষণ</span>
              </button>

              {/* Share */}
              <button
                onClick={() => alert('রিল শেয়ার লিংক কপি করা হয়েছে!')}
                className="flex flex-col items-center transition-transform active:scale-75"
              >
                <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">শেয়ার</span>
              </button>

              {/* Spinning Vinyl Record (Audio) */}
              <div className="w-8 h-8 rounded-full border-2 border-purple-400/80 bg-zinc-900 flex items-center justify-center animate-spin">
                <Volume2 className="w-3.5 h-3.5 text-purple-300" />
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div 
              className="absolute left-4 right-16 bottom-4 z-20 text-left space-y-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs text-white">@{currentReel.creator.name}</span>
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                <span className="text-[10px] px-1.5 py-0.2 bg-purple-900/60 border border-purple-500/40 rounded-full text-purple-200">মেডিকেল ভেরিফাইড</span>
              </div>

              <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                {currentReel.title}
              </p>

              <div className="flex items-center space-x-1 text-[11px] text-purple-300">
                <Volume2 className="w-3 h-3 shrink-0" />
                <span className="truncate">অরিজিনাল অডিও • রক্তদান সচেতনতা বার্তা ২০২৬</span>
              </div>
            </div>
          </div>

          {/* Comments Bottom Sheet Drawer */}
          {showComments && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
              <div className="bg-zinc-900 rounded-t-3xl border-t border-zinc-800 p-4 max-h-[70%] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <h3 className="text-xs font-bold text-white">মন্তব্য ({reelComments.length})</h3>
                  <button onClick={() => setShowComments(false)} className="p-1 rounded-full text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-3">
                  {reelComments.map((com, idx) => (
                    <div key={idx} className="flex space-x-2.5 items-start text-xs">
                      <div className="w-7 h-7 rounded-full bg-purple-800 flex items-center justify-center font-bold text-white shrink-0 text-[10px]">
                        ইউ
                      </div>
                      <div className="flex-1 bg-zinc-800/80 p-2.5 rounded-xl">
                        <p className="text-zinc-200">{com}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="pt-2 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="সুন্দর একটি মন্তব্য লিখুন..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-zinc-800 border border-zinc-700 text-xs text-white rounded-full px-3.5 py-2 focus:outline-none focus:border-purple-500"
                  />
                  <button type="submit" className="p-2 bg-purple-600 rounded-full text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= VIDEOS TAB (FEED GRID) ================= */}
      {activeSubTab === 'home' && (
        <div className="flex-1 bg-zinc-950 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-1.5">
              <Film className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-black text-white">সচেতনতা ভিডিও গ্যালারি</h2>
            </div>
            <span className="text-[11px] text-purple-400 font-bold bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/50">
              {videos.length} ভিডিও
            </span>
          </div>

          <div className="p-3 grid grid-cols-1 gap-3.5">
            {videos.map((vid) => (
              <div 
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className="bg-zinc-900 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-sm hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="relative aspect-video bg-zinc-800">
                  <img src={vid.thumbnail} alt={vid.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                    {vid.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                    <div className="flex items-center space-x-1.5">
                      <img src={vid.creator.avatar} alt={vid.creator.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
                      <span>{vid.creator.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <span>👁️ {vid.views}</span>
                      <span>❤️ {vid.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= AUDIO TAB (FIRST AID PODCASTS) ================= */}
      {activeSubTab === 'audio' && (
        <div className="flex-1 bg-zinc-950 flex flex-col overflow-y-auto">
          <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-1.5">
              <Headphones className="w-5 h-5 text-purple-400" />
              <h2 className="text-sm font-black text-white">জরুরি ভয়েস ও অডিও গাইড</h2>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">লাইভ</span>
          </div>

          <div className="p-3 space-y-2.5">
            {audios.map((aud) => {
              const isCurrent = activeAudio?.id === aud.id;
              return (
                <div
                  key={aud.id}
                  onClick={() => {
                    setActiveAudio(aud);
                    setIsAudioPlaying(isCurrent ? !isAudioPlaying : true);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isCurrent
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/50'
                      : 'bg-zinc-900 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                    <img src={aud.thumbnail} alt={aud.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isCurrent && isAudioPlaying ? (
                        <Pause className="w-5 h-5 text-purple-400 fill-purple-400" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{aud.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{aud.creator.name} • {aud.duration}</p>
                    
                    {/* Simulated live visualizer bars if currently playing */}
                    {isCurrent && isAudioPlaying && (
                      <div className="flex items-end space-x-0.5 h-3 mt-1.5">
                        {[40, 80, 60, 100, 50, 90, 70, 30].map((h, i) => (
                          <span
                            key={i}
                            style={{ height: `${h}%` }}
                            className="w-1 bg-purple-400 rounded-full animate-pulse"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(aud.id);
                    }}
                    className={`p-2 rounded-full ${savedMap[aud.id] ? 'text-amber-400' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SAVED TAB ================= */}
      {activeSubTab === 'saved' && (
        <div className="flex-1 bg-zinc-950 flex flex-col overflow-y-auto">
          <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center space-x-1.5">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-black text-white">সংরক্ষিত স্বাস্থ্য সামগ্রী ({savedItems.length})</h2>
            </div>
          </div>

          <div className="p-3 space-y-2.5">
            {savedItems.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 space-y-2">
                <Bookmark className="w-10 h-10 mx-auto opacity-40 text-amber-400" />
                <p className="text-xs font-semibold">কোনো সংরক্ষিত মিডিয়া নেই</p>
                <p className="text-[11px] text-zinc-500">ভিডিও বা রিলসের বুকমার্ক আইকনে চাপ দিয়ে সংরক্ষণ করুন</p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center space-x-3">
                  <img src={item.thumbnail} alt={item.title} referrerPolicy="no-referrer" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1">{item.title}</h4>
                    <p className="text-[10.5px] text-zinc-400">{item.creator.name}</p>
                  </div>
                  <button
                    onClick={() => toggleSave(item.id)}
                    className="p-2 text-amber-400 hover:text-zinc-400"
                  >
                    <Bookmark className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Video Modal Preview */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center p-4">
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden max-w-sm mx-auto w-full shadow-2xl">
            <div className="relative aspect-video bg-black">
              <img src={selectedVideo.thumbnail} alt={selectedVideo.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-12 h-12 text-purple-400 fill-purple-400 animate-pulse" />
              </div>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-white">{selectedVideo.title}</h3>
              <p className="text-[11px] text-zinc-400">{selectedVideo.creator.name} • {selectedVideo.duration}</p>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

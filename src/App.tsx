import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  QuickActionsBar 
} from './components/QuickActionsBar';
import { 
  LiveAlertBanner 
} from './components/LiveAlertBanner';
import { 
  CategoryPills 
} from './components/CategoryPills';
import { 
  HomeFeed 
} from './components/HomeFeed';
import { 
  BottomNav 
} from './components/BottomNav';
import { 
  SidebarDrawer 
} from './components/SidebarDrawer';

// Modals
import { HelpBloodModal } from './components/modals/HelpBloodModal';
import { MissingDetailsModal } from './components/modals/MissingDetailsModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { AlarmTimerModal } from './components/modals/AlarmTimerModal';
import { DestiNotesModal } from './components/modals/DestiNotesModal';
import { DestiTranslateModal } from './components/modals/DestiTranslateModal';
import { DestiAiModal } from './components/modals/DestiAiModal';
import { ModuleSwitcherModal } from './components/modals/ModuleSwitcherModal';
import { DailyToolsModal } from './components/modals/DailyToolsModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { BlueprintModal } from './components/modals/BlueprintModal';
import { SettingsModal } from './components/modals/SettingsModal';

// Dedicated Modules
import { DestiChatView } from './components/modules/DestiChatView';
import { DestiMediaView } from './components/modules/DestiMediaView';
import { DestiBrainView } from './components/modules/DestiBrainView';
import { DestiCareView } from './components/modules/DestiCareView';
import { DestiFindView } from './components/modules/DestiFindView';
import { DestiProfileView } from './components/modules/DestiProfileView';

import { 
  ActiveModule, 
  FeedCategory, 
  FeedPost, 
  UserProfile 
} from './types';
import { 
  initialFeedPosts, 
  currentUser as defaultUser 
} from './data/mockData';
import { Award, Check, Sparkles, X } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, setLanguage, toggleLanguage, l, t } = useLanguage();
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    const saved = localStorage.getItem('destihope_active_module');
    return (saved as ActiveModule) || 'media';
  });
  const [activeCategory, setActiveCategory] = useState<FeedCategory>('For You');
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => {
    const cached = localStorage.getItem('destihope_feed_data');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return initialFeedPosts;
      }
    }
    return initialFeedPosts;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('destihope_theme') === 'dark';
  });
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncedCount, setSyncedCount] = useState(0);

  // Calculate posts created or edited while offline
  const pendingSyncPosts = feedPosts.filter((p) => p.isPendingSync);
  const pendingSyncCount = pendingSyncPosts.length;

  useEffect(() => {
    localStorage.setItem('destihope_feed_data', JSON.stringify(feedPosts));
  }, [feedPosts]);

  useEffect(() => {
    localStorage.setItem('destihope_active_module', activeModule);
  }, [activeModule]);

  useEffect(() => {
    localStorage.setItem('destihope_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Synchronize offline feed posts when reconnecting
  const syncOfflineData = useCallback(() => {
    setSyncStatus('syncing');

    setTimeout(() => {
      // Mark any offline posts as synced with timestamp
      setFeedPosts((prev) => {
        let count = 0;
        const updated = prev.map((post) => {
          if (post.isPendingSync) {
            count++;
            return {
              ...post,
              isPendingSync: false,
              syncedAt: 'এখনই সিঙ্কড',
            };
          }
          return post;
        });
        setSyncedCount(count);
        return updated;
      });

      setSyncStatus('synced');
      showToast('অফলাইন ডেটা সফলভাবে সিঙ্ক সম্পন্ন হয়েছে!');

      // Return to idle after 3.5 seconds
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3500);
    }, 1800);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // When network reconnects, trigger automatic data sync
      syncOfflineData();
    };
    const handleOffline = () => {
      setIsOffline(true);
      setSyncStatus('idle');
      showToast('অফলাইন মোড সক্রিয়: পোস্ট অফলাইনে সেভ থাকবে');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineData]);

  // Offline simulation toggle for testing
  const handleToggleOfflineMode = () => {
    if (isOffline) {
      setIsOffline(false);
      showToast('অনলাইন মোডে ফিরে এসেছে। ডেটা সিঙ্ক হচ্ছে...');
      syncOfflineData();
    } else {
      setIsOffline(true);
      setSyncStatus('idle');
      showToast('অফলাইন টেস্ট মোড সক্রিয় করা হয়েছে!');
    }
  };

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isHelpBloodOpen, setIsHelpBloodOpen] = useState(false);
  const [selectedBloodPost, setSelectedBloodPost] = useState<FeedPost | null>(null);
  const [isMissingDetailsOpen, setIsMissingDetailsOpen] = useState(false);
  const [selectedMissingPost, setSelectedMissingPost] = useState<FeedPost | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isActiveTimersModalOpen, setIsActiveTimersModalOpen] = useState(false);
  const [isDestiNotesOpen, setIsDestiNotesOpen] = useState(false);
  const [isDestiTranslateOpen, setIsDestiTranslateOpen] = useState(false);
  const [isDestiAiOpen, setIsDestiAiOpen] = useState(false);
  const [isModuleSwitcherOpen, setIsModuleSwitcherOpen] = useState(false);
  const [isDailyToolsOpen, setIsDailyToolsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHopePointsInfoOpen, setIsHopePointsInfoOpen] = useState(false);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sub-tabs state for each module
  const [subTabs, setSubTabs] = useState<Record<string, string>>({
    hope: 'feed',
    chat: 'all',
    media: 'feed',
    brain: 'ai',
    care: 'bloodbank',
    find: 'cases',
    profile: 'overview'
  });

  const handleSelectSubTab = (subTab: string) => {
    if (subTab === 'back_home') {
      setActiveModule('hope');
      return;
    }
    setSubTabs(prev => ({ ...prev, [activeModule]: subTab }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addHopePoints = (pts: number, reason?: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      hopePoints: prev.hopePoints + pts,
    }));
    showToast(`+${pts} Hope Points যোগ হয়েছে! 🎉`);
  };

  // Trigger blood help modal
  const handleOpenBloodHelp = (post: FeedPost) => {
    setSelectedBloodPost(post);
    setIsHelpBloodOpen(true);
  };

  // Confirm blood donation
  const handleConfirmBloodHelp = (post: FeedPost) => {
    addHopePoints(10);
  };

  // Trigger missing person details modal
  const handleOpenMissingDetails = (post: FeedPost) => {
    setSelectedMissingPost(post);
    setIsMissingDetailsOpen(true);
  };

  // Handle post creation
  const handleCreatePost = (newPost: FeedPost) => {
    // If created while offline, mark it as pending sync
    const postToAdd: FeedPost = {
      ...newPost,
      isPendingSync: isOffline,
      syncedAt: isOffline ? undefined : 'লাইভ',
    };

    setFeedPosts((prev) => [postToAdd, ...prev]);

    if (isOffline) {
      showToast('পোস্ট অফলাইনে সংরক্ষিত হয়েছে। নেট সংযোগ পেলেই সিঙ্ক হবে! (+৫ HP)');
    } else {
      showToast('আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে! (+৫ HP)');
    }
    addHopePoints(5);
  };

  // Toggle like directly on feedPosts
  const handleToggleFeedLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
            // If modified while offline, ensure changes persist locally
          };
        }
        return post;
      })
    );
  };

  // Direct phone call action
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
    showToast(`কল করা হচ্ছে: ${phone}`);
  };

  const handleShare = (post: FeedPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title || 'DestiHope Post',
        text: post.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title || 'DestiHope'}\n${post.content}`);
      showToast('লিংক কপি করা হয়েছে! (+৫ HP)');
      addHopePoints(5);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center selection:bg-red-500 selection:text-white transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Mobile Frame Container (Max width matching mobile experience precisely) */}
      <main className={`w-full max-w-md min-h-screen relative flex flex-col shadow-xl overflow-x-hidden transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 border-x border-gray-800' : 'bg-white'
      }`}>
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-xs text-white text-xs font-bold py-2 px-4 rounded-full shadow-2xl flex items-center space-x-2 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}


        {/* Main Content Area by Module */}
        <div className="flex-1 flex flex-col relative">
          {activeModule === 'hope' && (
            <div className="flex-1 flex flex-col h-full">
              <Header
                onOpenMenu={() => setIsSidebarOpen(true)}
                onOpenCreatePost={() => setIsCreatePostOpen(true)}
                onOpenNotifications={() => setIsNotificationOpen(true)}
                onSearchClick={() => {
                  setActiveModule('hope');
                  setActiveCategory('News');
                  showToast('খোঁজার জন্য ক্যাটাগরি ফিল্টার সক্রিয় হয়েছে');
                }}
                unreadNotificationsCount={1}
                isOffline={isOffline}
                activeModule={activeModule}
                onSelectModule={(mod) => setActiveModule(mod)}
                syncStatus={syncStatus}
                syncedCount={syncedCount}
                pendingSyncCount={pendingSyncCount}
                onManualSync={syncOfflineData}
              />
              <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                <QuickActionsBar
                  onAiClick={() => setIsDestiAiOpen(true)}
                  onLocationClick={() => {
                    setIsDestiAiOpen(true);
                  }}
                  onEmergencyCallClick={() => setIsEmergencyModalOpen(true)}
                  onTimerClick={() => setIsActiveTimersModalOpen(true)}
                  onReportsClick={() => setIsDestiNotesOpen(true)}
                  onTranslateClick={() => setIsDestiTranslateOpen(true)}
                  onLanguageToggle={toggleLanguage}
                  onModuleGridClick={() => setIsDailyToolsOpen(true)}
                  currentLanguage={language}
                />
                <LiveAlertBanner
                  onAlertClick={() => {
                    const livePost = feedPosts.find((p) => p.type === 'blood');
                    if (livePost) handleOpenBloodHelp(livePost);
                  }}
                />
                <CategoryPills
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => setActiveCategory(cat)}
                />
                <HomeFeed
                  posts={feedPosts}
                  onHelpBlood={handleOpenBloodHelp}
                  onViewMissingDetails={handleOpenMissingDetails}
                  onSharePost={handleShare}
                  onCallContact={handleCall}
                  onShowHopePointsInfo={() => setIsHopePointsInfoOpen(true)}
                  activeFilter={activeCategory}
                  onToggleLike={handleToggleFeedLike}
                />
              </div>
            </div>
          )}

          {activeModule === 'chat' && (
            <DestiChatView
              onBackToHome={() => setActiveModule('hope')}
              onOpenModuleSwitcher={() => setIsModuleSwitcherOpen(true)}
              onSelectModule={(mod) => setActiveModule(mod)}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              activeSubTab={subTabs['chat']}
              onSelectSubTab={handleSelectSubTab}
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              language={language}
              onToggleLanguage={() => {
                toggleLanguage();
                const nextLang = language === 'bn' ? 'en' : 'bn';
                showToast(nextLang === 'en' ? 'Language switched to English' : 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে');
              }}
              dataSaverEnabled={dataSaverEnabled}
              onToggleDataSaver={() => {
                setDataSaverEnabled((prev) => !prev);
                showToast(language === 'en' ? `Data Saver: ${!dataSaverEnabled ? 'ON' : 'OFF'}` : `ডাটা সেভার মোড: ${!dataSaverEnabled ? 'চালু' : 'বন্ধ'}`);
              }}
              onEmergencyCallClick={() => setIsEmergencyModalOpen(true)}
              onTimerClick={() => setIsActiveTimersModalOpen(true)}
              onReportsClick={() => setIsDestiNotesOpen(true)}
              onLocationClick={() => {
                setActiveModule('care');
                showToast('কাছাকাছি রক্তদান ও হাসপাতাল তালিকা');
              }}
            />
          )}

          {activeModule === 'media' && (
            <DestiMediaView 
              onOpenModuleSwitcher={() => setIsModuleSwitcherOpen(true)}
              onSelectModule={(mod) => setActiveModule(mod)}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onSearchClick={() => {}}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              activeSubTab={subTabs['media']}
              onSelectSubTab={handleSelectSubTab}
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              onEarnHopePoints={(pts, reason) => addHopePoints(pts, reason)}
            />
          )}

          {activeModule === 'brain' && (
            <DestiBrainView
              onEarnHopePoints={(pts) => addHopePoints(pts)}
              onOpenModuleSwitcher={() => setIsModuleSwitcherOpen(true)}
              onSelectModule={(mod) => setActiveModule(mod)}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onSearchClick={() => showToast('ব্রেইন মডিউলে সার্চ ফিচার আসছে')}
              onOpenCreatePost={() => setIsCreatePostOpen(true)}
              activeSubTab={subTabs['brain']}
              onSelectSubTab={handleSelectSubTab}
            />
          )}

          {activeModule === 'care' && (
            <DestiCareView
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenCreateBloodRequest={() => setIsCreatePostOpen(true)}
              onCallContact={handleCall}
              onOpenModuleSwitcher={() => setIsModuleSwitcherOpen(true)}
              onSelectModule={(mod) => setActiveModule(mod)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              activeSubTab={subTabs['care']}
              onSelectSubTab={handleSelectSubTab}
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
            />
          )}

          {activeModule === 'find' && (
            <DestiFindView
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              onOpenMenu={() => setIsSidebarOpen(true)}
              onOpenReportMissing={() => setIsCreatePostOpen(true)}
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onSelectCase={(c) => {
                const p = feedPosts.find((item) => item.missingDetails?.caseId === c.caseId);
                if (p) handleOpenMissingDetails(p);
              }}
              onCallContact={handleCall}
              onOpenModuleSwitcher={() => setIsModuleSwitcherOpen(true)}
              onSelectModule={(mod) => setActiveModule(mod)}
              activeSubTab={subTabs['find']}
              onSelectSubTab={handleSelectSubTab}
            />
          )}

          {activeModule === 'profile' && (
            <DestiProfileView
              user={currentUser}
              onUpdateUser={setCurrentUser}
              onNavigateModule={(mod) => setActiveModule(mod)}
              onSelectModule={(mod) => setActiveModule(mod)}
              dataSaverEnabled={dataSaverEnabled}
              onToggleDataSaver={() => {
                setDataSaverEnabled(!dataSaverEnabled);
                showToast(`ডাটা সেভার মোড: ${!dataSaverEnabled ? 'চালু' : 'বন্ধ'}`);
              }}
              onShowHopePointsInfo={() => setIsHopePointsInfoOpen(true)}
              onBackToHome={() => setActiveModule('hope')}
              activeSubTab={subTabs['profile']}
              onSelectSubTab={handleSelectSubTab}
            />
          )}
        </div>

        {/* Unified Bottom Navigation for all modules */}
        <BottomNav
          activeModule={activeModule}
          onSelectModule={(mod) => {
            if (mod === activeModule) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setActiveModule(mod);
            }
          }}
          unreadChatCount={2}
          onOpenModuleSwitcher={() => setIsModuleSwitcherOpen((prev) => !prev)}
          activeSubTab={subTabs[activeModule]}
          onSelectSubTab={handleSelectSubTab}
        />

        {/* Navigation Sidebar Drawer */}
        <SidebarDrawer
          isOpen={isSidebarOpen}
          activeModule={activeModule}
          onClose={() => setIsSidebarOpen(false)}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setIsSidebarOpen(false);
          }}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            setIsDarkMode((prev) => !prev);
          }}
          currentLang={language}
          onToggleLanguage={() => {
            toggleLanguage();
            const nextLang = language === 'bn' ? 'en' : 'bn';
            showToast(nextLang === 'en' ? 'Language switched to English' : 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে');
          }}
          dataSaverEnabled={dataSaverEnabled}
          onToggleDataSaver={() => {
            setDataSaverEnabled(!dataSaverEnabled);
            showToast(`ডাটা সেভার মোড: ${!dataSaverEnabled ? 'চালু' : 'বন্ধ'}`);
          }}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenBlueprint={() => setIsBlueprintModalOpen(true)}
          isOffline={isOffline}
          onToggleOfflineMode={handleToggleOfflineMode}
          pendingSyncCount={pendingSyncCount}
          onTriggerSync={syncOfflineData}
        />

        {/* Modals */}
        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmitPost={handleCreatePost}
          isOffline={isOffline}
        />

        <HelpBloodModal
          post={selectedBloodPost}
          onClose={() => setIsHelpBloodOpen(false)}
          onConfirmDonate={handleConfirmBloodHelp}
        />

        <MissingDetailsModal
          post={selectedMissingPost}
          onClose={() => setIsMissingDetailsOpen(false)}
          onShare={handleShare}
          onSightingReported={() => {
            addHopePoints(10);
            showToast('দেখা যাওয়ার তথ্য গৃহীত হয়েছে! (+১০ HP)');
          }}
        />

        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          onCall={handleCall}
          onOpenBloodRequest={() => {
            setIsEmergencyModalOpen(false);
            setIsCreatePostOpen(true);
          }}
          onOpenBloodBank={() => {
            setIsEmergencyModalOpen(false);
            setActiveModule('care');
          }}
          onShowToast={showToast}
        />

        <AlarmTimerModal
          isOpen={isActiveTimersModalOpen}
          onClose={() => setIsActiveTimersModalOpen(false)}
          onShowToast={showToast}
        />

        <DestiNotesModal
          isOpen={isDestiNotesOpen}
          onClose={() => setIsDestiNotesOpen(false)}
          onShowToast={showToast}
        />

        <DestiTranslateModal
          isOpen={isDestiTranslateOpen}
          onClose={() => setIsDestiTranslateOpen(false)}
          onShowToast={showToast}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            setIsDarkMode((prev) => !prev);
          }}
        />

        <DestiAiModal
          isOpen={isDestiAiOpen}
          onClose={() => setIsDestiAiOpen(false)}
          onShowToast={showToast}
        />

        <ModuleSwitcherModal
          isOpen={isModuleSwitcherOpen}
          onClose={() => setIsModuleSwitcherOpen(false)}
          onSelectModule={(mod) => setActiveModule(mod)}
          activeModule={activeModule}
          currentUser={currentUser}
          dataSaverEnabled={dataSaverEnabled}
          onToggleDataSaver={() => {
            setDataSaverEnabled((prev) => !prev);
            showToast(language === 'en' ? `Data Saver: ${!dataSaverEnabled ? 'ON' : 'OFF'}` : `ডাটা সেভার মোড: ${!dataSaverEnabled ? 'চালু' : 'বন্ধ'}`);
          }}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onShowHopePointsInfo={() => setIsHopePointsInfoOpen(true)}
        />

        <DailyToolsModal
          isOpen={isDailyToolsOpen}
          onClose={() => setIsDailyToolsOpen(false)}
          onOpenBloodRequest={() => setIsCreatePostOpen(true)}
          onOpenEmergencyHub={() => setIsEmergencyModalOpen(true)}
          onOpenTimerModal={() => setIsActiveTimersModalOpen(true)}
          onOpenTranslateModal={() => setIsDestiTranslateOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            setIsDarkMode((prev) => !prev);
          }}
        />

        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          onOpenBloodCase={() => {
            const bp = feedPosts.find((p) => p.type === 'blood');
            if (bp) handleOpenBloodHelp(bp);
          }}
          onOpenMissingCase={() => {
            const mp = feedPosts.find((p) => p.type === 'missing');
            if (mp) handleOpenMissingDetails(mp);
          }}
        />

        <BlueprintModal
          isOpen={isBlueprintModalOpen}
          onClose={() => setIsBlueprintModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            setIsDarkMode((prev) => !prev);
          }}
          currentLang={language}
          onToggleLanguage={() => {
            toggleLanguage();
            const nextLang = language === 'bn' ? 'en' : 'bn';
            showToast(nextLang === 'en' ? 'Language switched to English' : 'ভাষা পরিবর্তন করে বাংলা করা হয়েছে');
          }}
          dataSaverEnabled={dataSaverEnabled}
          onToggleDataSaver={() => {
            setDataSaverEnabled((prev) => !prev);
          }}
          onSaveNotice={(msg) => showToast(msg)}
        />

        {/* Hope Points Explanation Modal */}
        {isHopePointsInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-sm text-gray-900">Hope Points কী?</h3>
                </div>
                <button
                  onClick={() => setIsHopePointsInfoOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                DestiHope প্ল্যাটফর্মে রক্তদান সহায়তা, নিখোঁজ ব্যক্তির সন্ধান তথ্য প্রদান, শিক্ষামূলক উত্তর ও গঠনমূলক কাজের জন্য সদস্যরা <strong>Hope Points</strong> অর্জন করেন।
              </p>

              <div className="bg-teal-50 rounded-xl p-3 border border-teal-100 space-y-1.5 text-xs text-teal-900">
                <div className="flex justify-between font-medium">
                  <span>🩸 রক্তদান সহায়তা</span>
                  <span className="font-bold text-teal-700">+১০ HP</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>🔍 নিখোঁজ তথ্য যাচাই</span>
                  <span className="font-bold text-teal-700">+১০ HP</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>💡 সঠিক উত্তর প্রদান</span>
                  <span className="font-bold text-teal-700">+৫ HP</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>📢 জরুরি কেস শেয়ার</span>
                  <span className="font-bold text-teal-700">+৫ HP</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400">
                * দ্রষ্টব্য: Hope Points কোনো বাণিজ্যিক মুদ্রা নয়; এটি সামাজিক বিশ্বাস ও ভলান্টিয়ার স্বীকৃতির প্রতীক।
              </div>

              <button
                onClick={() => setIsHopePointsInfoOpen(false)}
                className="w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

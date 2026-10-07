import React from 'react';
import {
  Bell,
  Sparkles,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';
import { FbPageAccount, Language, ThemeConfig } from '../types';
import { playSound } from '../services/sound';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pages: FbPageAccount[];
  selectedPage: FbPageAccount;
  setSelectedPage: (page: FbPageAccount) => void;
  unreadCount: number;
  openNotifications: () => void;
  openAiTester: () => void;
  openShareModal: () => void;
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  lang: Language;
  setLang: (lang: Language) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pages,
  selectedPage,
  setSelectedPage,
  unreadCount,
  openNotifications,
  openAiTester,
  openShareModal,
  themeConfig,
  setThemeConfig,
  lang,
  setLang,
  isOnline
}) => {
  const [pageDropdownOpen, setPageDropdownOpen] = React.useState(false);

  const toggleSound = () => {
    const nextState = !themeConfig.soundEnabled;
    setThemeConfig(prev => ({ ...prev, soundEnabled: nextState }));
    playSound('toggle', nextState);
  };

  const toggleLiveScan = () => {
    const nextState = !themeConfig.isLiveScanning;
    setThemeConfig(prev => ({ ...prev, isLiveScanning: nextState }));
    playSound(nextState ? 'success' : 'click', themeConfig.soundEnabled);
  };

  return (
    <header className="h-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      {/* Zone 1: Brand single text element */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
            playSound('click', themeConfig.soundEnabled);
          }}
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2 select-none"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-sm shadow-blue-500/20">
            FB
          </span>
          <span>AutoMod FB</span>
        </a>

        {/* Page Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 transition-colors border border-neutral-200/60 dark:border-neutral-700/60"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="max-w-[170px] truncate">{selectedPage.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {pageDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {lang === 'vi' ? 'Chọn Fanpage kết nối' : 'Select Connected Page'}
              </div>
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => {
                    setSelectedPage(page);
                    setPageDropdownOpen(false);
                    playSound('click', themeConfig.soundEnabled);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors ${
                    selectedPage.id === page.id ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="truncate font-medium">{page.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">ID: {page.pageId}</p>
                  </div>
                  {page.tokenStatus === 'valid' && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Live</span>
                  )}
                </button>
              ))}
              <div className="border-t border-neutral-100 dark:border-neutral-700/60 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setActiveTab('fb_token');
                    setPageDropdownOpen(false);
                    playSound('click', themeConfig.soundEnabled);
                  }}
                  className="w-full py-1.5 text-center text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {lang === 'vi' ? '+ Thêm Fanpage mới' : '+ Connect New Page'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links (Text with subtle hover) */}
      <nav className="hidden xl:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            playSound('click', themeConfig.soundEnabled);
          }}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {lang === 'vi' ? 'Tổng quan Ads' : 'Overview'}
        </button>
        <button
          onClick={() => {
            setActiveTab('comments');
            playSound('click', themeConfig.soundEnabled);
          }}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'comments'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {lang === 'vi' ? 'Dòng bình luận' : 'Live Stream'}
        </button>
        <button
          onClick={() => {
            setActiveTab('rules');
            playSound('click', themeConfig.soundEnabled);
          }}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'rules'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {lang === 'vi' ? 'Bộ lọc từ khóa' : 'Keyword Filters'}
        </button>
        <button
          onClick={() => {
            setActiveTab('ad_accounts');
            playSound('click', themeConfig.soundEnabled);
          }}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'ad_accounts'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {lang === 'vi' ? 'Chiến dịch Ads' : 'Ad Campaigns'}
        </button>
        <button
          onClick={() => {
            setActiveTab('reports');
            playSound('click', themeConfig.soundEnabled);
          }}
          className={`transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          {lang === 'vi' ? 'Báo cáo & Xuất file' : 'Reports & Export'}
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Network indicator */}
        <div
          title={isOnline ? (lang === 'vi' ? 'Đã kết nối trực tuyến' : 'Online') : (lang === 'vi' ? 'Mất mạng - Chế độ ngoại tuyến' : 'Offline')}
          className="flex items-center text-xs text-neutral-500 mr-1"
        >
          {isOnline ? (
            <Wifi className="w-4 h-4 text-emerald-500" />
          ) : (
            <span className="flex items-center gap-1 text-amber-500 text-[11px] font-medium">
              <WifiOff className="w-4 h-4" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          )}
        </div>

        {/* Live scanning switch */}
        <button
          onClick={toggleLiveScan}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            themeConfig.isLiveScanning
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
          title={themeConfig.isLiveScanning ? 'Đang tự động quét & ẩn' : 'Tạm dừng quét'}
        >
          {themeConfig.isLiveScanning ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">{lang === 'vi' ? 'Auto-Scan BẬT' : 'Auto-Scan ON'}</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Tạm Dừng' : 'Paused'}</span>
            </>
          )}
        </button>

        {/* AI Sandbox button */}
        <button
          onClick={() => {
            openAiTester();
            playSound('click', themeConfig.soundEnabled);
          }}
          className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-200 dark:border-neutral-700"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden lg:inline">{lang === 'vi' ? 'AI Sandbox' : 'AI Sandbox'}</span>
        </button>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          aria-label={themeConfig.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {themeConfig.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>

        {/* Language switch */}
        <button
          onClick={() => {
            const next = lang === 'vi' ? 'en' : 'vi';
            setLang(next);
            playSound('toggle', themeConfig.soundEnabled);
          }}
          className="px-2 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors font-mono"
        >
          {lang.toUpperCase()}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => {
            openNotifications();
            playSound('click', themeConfig.soundEnabled);
          }}
          className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          aria-label="Thông báo cảnh báo"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white font-mono font-bold flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Share Button */}
        <button
          onClick={() => {
            openShareModal();
            playSound('click', themeConfig.soundEnabled);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Chia sẻ' : 'Share'}</span>
        </button>
      </div>
    </header>
  );
};

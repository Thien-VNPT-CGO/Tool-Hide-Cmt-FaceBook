import React, { useState, useEffect, useCallback } from 'react';
import {
  CommentItem,
  FilterRule,
  BlacklistedUser,
  AdCampaign,
  FbPageAccount,
  NotificationItem,
  TeamMember,
  WebhookConfig,
  ApiKeyItem,
  BackupPoint,
  SecuritySettings,
  ThemeConfig,
  Language,
  UserRole
} from './types';
import {
  initialComments,
  initialRules,
  initialBlacklist,
  initialCampaigns,
  initialPages,
  initialTeam,
  initialNotifications,
  initialWebhooks,
  initialApiKeys,
  initialSecurity,
  initialThemeConfig,
  loadFromStorage,
  saveToStorage,
  syncChannel
} from './services/storage';
import { playSound } from './services/sound';
import { analyzeCommentLocal } from './services/aiModerator';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardTab } from './components/tabs/DashboardTab';
import { CommentsTab } from './components/tabs/CommentsTab';
import { RulesTab } from './components/tabs/RulesTab';
import { BlacklistTab } from './components/tabs/BlacklistTab';
import { AdAccountsTab } from './components/tabs/AdAccountsTab';
import { ReportsTab } from './components/tabs/ReportsTab';
import { FbTokenTab } from './components/tabs/FbTokenTab';
import { OpenApiTab } from './components/tabs/OpenApiTab';
import { TeamTab } from './components/tabs/TeamTab';
import { SecurityTab } from './components/tabs/SecurityTab';
import { BackupTab } from './components/tabs/BackupTab';
import { GuideTab } from './components/tabs/GuideTab';
import { SettingsTab } from './components/tabs/SettingsTab';

// Modals
import { NotificationDrawer } from './components/modals/NotificationDrawer';
import { AiTestModal } from './components/modals/AiTestModal';
import { ShareModal } from './components/modals/ShareModal';
import { AddRuleModal } from './components/modals/AddRuleModal';
import { TwoFactorModal } from './components/modals/TwoFactorModal';
import { PrintReportModal } from './components/modals/PrintReportModal';

export default function App() {
  // Theme & Settings
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() =>
    loadFromStorage('theme', initialThemeConfig)
  );
  const [lang, setLang] = useState<Language>('vi');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data
  const [pages, setPages] = useState<FbPageAccount[]>(() =>
    loadFromStorage('pages', initialPages)
  );
  const [selectedPage, setSelectedPage] = useState<FbPageAccount>(() => pages[0] || initialPages[0]);
  const [comments, setComments] = useState<CommentItem[]>(() =>
    loadFromStorage('comments', initialComments)
  );
  const [rules, setRules] = useState<FilterRule[]>(() =>
    loadFromStorage('rules', initialRules)
  );
  const [blacklist, setBlacklist] = useState<BlacklistedUser[]>(() =>
    loadFromStorage('blacklist', initialBlacklist)
  );
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() =>
    loadFromStorage('campaigns', initialCampaigns)
  );
  const [team, setTeam] = useState<TeamMember[]>(() =>
    loadFromStorage('team', initialTeam)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage('notifications', initialNotifications)
  );
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(() =>
    loadFromStorage('webhooks', initialWebhooks)
  );
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() =>
    loadFromStorage('api_keys', initialApiKeys)
  );
  const [security, setSecurity] = useState<SecuritySettings>(() =>
    loadFromStorage('security', initialSecurity)
  );
  const [backupPoints, setBackupPoints] = useState<BackupPoint[]>(() =>
    loadFromStorage('backups', [
      {
        id: 'bp-1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        title: 'Bản sao lưu hệ thống tự động ngày hôm qua',
        sizeKb: 48,
        commentCount: 7,
        ruleCount: 5,
        type: 'auto'
      }
    ])
  );

  // Modals visibility
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAiTestOpen, setIsAiTestOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage('theme', themeConfig);
    // Apply dark class to html document
    if (themeConfig.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeConfig]);

  useEffect(() => { saveToStorage('comments', comments); }, [comments]);
  useEffect(() => { saveToStorage('rules', rules); }, [rules]);
  useEffect(() => { saveToStorage('blacklist', blacklist); }, [blacklist]);
  useEffect(() => { saveToStorage('campaigns', campaigns); }, [campaigns]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('team', team); }, [team]);
  useEffect(() => { saveToStorage('security', security); }, [security]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen to BroadcastChannel for real-time cross-tab synchronization
  useEffect(() => {
    const channel = syncChannel;
    if (!channel) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SYNC_UPDATE') {
        const key = e.data.key;
        if (key === 'comments') setComments(loadFromStorage('comments', initialComments));
        if (key === 'rules') setRules(loadFromStorage('rules', initialRules));
        if (key === 'blacklist') setBlacklist(loadFromStorage('blacklist', initialBlacklist));
        if (key === 'notifications') setNotifications(loadFromStorage('notifications', initialNotifications));
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => channel.removeEventListener('message', handleMessage);
  }, []);

  // Dispatch a notification
  const sendAlertNotification = useCallback((title: string, message: string, severity: 'info' | 'warning' | 'alert' | 'critical', keyword?: string, commentId?: string) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      read: false,
      keyword,
      commentId
    };
    setNotifications(prev => [newNotif, ...prev]);
    playSound('alert', themeConfig.soundEnabled);

    // Browser Push if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.debug('Push notification suppressed:', e);
      }
    }
  }, [themeConfig.soundEnabled]);

  // Function to process comment against active rules and AI
  const processComment = useCallback((rawCmt: Partial<CommentItem>): CommentItem => {
    const text = rawCmt.message || '';
    const textLower = text.toLowerCase();
    const id = rawCmt.id || 'cmt-' + Date.now();

    // Check against blacklist
    const isAuthorBlacklisted = blacklist.find(b => b.fbUid === rawCmt.authorId && b.status === 'blocked');
    if (isAuthorBlacklisted) {
      sendAlertNotification(
        'Phát hiện bình luận từ tài khoản Blacklist!',
        `Tài khoản "${isAuthorBlacklisted.name}" (UID: ${isAuthorBlacklisted.fbUid}) vừa để lại bình luận. Đã ẩn ngay lập tức.`,
        'critical',
        isAuthorBlacklisted.fbUid,
        id
      );
      return {
        id,
        postId: rawCmt.postId || 'post-1001',
        postTitle: rawCmt.postTitle || 'BST Đầm Lụa Dạ Hội Sang Trọng 2026',
        authorId: rawCmt.authorId || 'fb-uid-' + Math.floor(Math.random() * 90000),
        authorName: rawCmt.authorName || 'Người dùng Facebook',
        authorAvatar: rawCmt.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces',
        message: text,
        createdAt: new Date().toISOString(),
        status: 'hidden',
        hiddenReason: `Tài khoản UID nằm trong Danh sách đen: ${isAuthorBlacklisted.reason}`,
        isSpamAI: true,
        aiConfidence: 0.99,
        aiExplanation: 'Tài khoản có lịch sử chèo kéo/phá giá đã được đưa vào blacklist.',
        isAdComment: rawCmt.isAdComment ?? true,
        campaignName: rawCmt.campaignName || 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
      };
    }

    // Check active rules
    let matchedRule: FilterRule | null = null;
    let matchedKeyword = '';

    for (const rule of rules.filter(r => r.enabled)) {
      for (const kw of rule.keywords) {
        if (textLower.includes(kw.toLowerCase())) {
          matchedRule = rule;
          matchedKeyword = kw;
          break;
        }
      }
      if (matchedRule) break;
    }

    // AI heuristic fallback check
    const aiAnalysis = analyzeCommentLocal(text);

    let status: CommentItem['status'] = 'visible';
    let hiddenReason: string | undefined = undefined;
    let autoReplied = false;

    if (matchedRule) {
      if (matchedRule.action === 'hide') {
        status = 'hidden';
        hiddenReason = `${matchedRule.name} (Khớp từ khóa: "${matchedKeyword}")`;
      } else if (matchedRule.action === 'delete') {
        status = 'deleted';
        hiddenReason = `Xóa vi phạm: ${matchedRule.name}`;
      } else if (matchedRule.action === 'flag_review') {
        status = 'flagged';
        hiddenReason = `Cần duyệt: ${matchedRule.name}`;
      } else if (matchedRule.action === 'auto_reply') {
        status = 'hidden';
        hiddenReason = `Đã ẩn SĐT & tự động gửi inbox riêng`;
        autoReplied = true;
      }

      // Update match count for this rule
      setRules(prev => prev.map(r => r.id === matchedRule!.id ? { ...r, matchCount: r.matchCount + 1 } : r));

      sendAlertNotification(
        `Phát hiện từ khóa: "${matchedKeyword}"`,
        `Bình luận chứa từ khóa nhạy cảm. Hệ thống đã kích hoạt hành động "${matchedRule.action}".`,
        matchedRule.severity === 'critical' ? 'critical' : 'alert',
        matchedKeyword,
        id
      );
    } else if (aiAnalysis.isSpam) {
      status = 'hidden';
      hiddenReason = `AI Spam: ${aiAnalysis.reason}`;
      sendAlertNotification(
        'AI phát hiện bình luận nghi vấn!',
        aiAnalysis.reason,
        'alert',
        aiAnalysis.highlightWords[0] || 'AI Trigger',
        id
      );
    }

    return {
      id,
      postId: rawCmt.postId || 'post-1001',
      postTitle: rawCmt.postTitle || 'BST Đầm Lụa Dạ Hội Sang Trọng 2026',
      authorId: rawCmt.authorId || 'fb-uid-' + Math.floor(Math.random() * 90000),
      authorName: rawCmt.authorName || 'Người dùng Facebook',
      authorAvatar: rawCmt.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces',
      message: text,
      createdAt: new Date().toISOString(),
      status,
      hiddenReason,
      matchedRuleId: matchedRule?.id,
      matchedKeywords: matchedKeyword ? [matchedKeyword] : aiAnalysis.highlightWords,
      isSpamAI: aiAnalysis.isSpam,
      aiConfidence: aiAnalysis.confidence,
      aiExplanation: aiAnalysis.reason,
      containsPhone: aiAnalysis.category === 'phone_leak' || Boolean(matchedRule?.category === 'phone_leak'),
      isAdComment: rawCmt.isAdComment ?? true,
      campaignName: rawCmt.campaignName || 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu',
      autoReplied
    };
  }, [blacklist, rules, sendAlertNotification]);

  // Handler for adding comment
  const handleAddComment = useCallback((partial: Partial<CommentItem>) => {
    const processed = processComment(partial);
    setComments(prev => [processed, ...prev]);

    // Update campaign metrics if it's an ad comment
    if (processed.isAdComment && processed.campaignName) {
      setCampaigns(prev => prev.map(c => {
        if (c.name.includes(processed.campaignName!) || processed.campaignName!.includes(c.name)) {
          return {
            ...c,
            totalComments: c.totalComments + 1,
            hiddenComments: processed.status === 'hidden' ? c.hiddenComments + 1 : c.hiddenComments,
            leadsProtected: processed.containsPhone ? c.leadsProtected + 1 : c.leadsProtected,
            estimatedProtectedValue: processed.containsPhone ? c.estimatedProtectedValue + 500000 : c.estimatedProtectedValue
          };
        }
        return c;
      }));
    }
  }, [processComment]);

  // Quick Injections for Test Demonstrations
  const handleInjectTestComment = (type: 'phone' | 'competitor' | 'spam' | 'normal') => {
    if (type === 'phone') {
      handleAddComment({
        authorName: 'Trần Thị Mai',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces',
        message: 'Mình lấy 1 đầm đỏ size M nha bạn, gửi về số 0984.712.984 gọi trước cho mình nhé!',
        postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
        campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
      });
    } else if (type === 'competitor') {
      handleAddComment({
        authorName: 'Kho Sỉ Thời Trang HCM',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces',
        message: 'Shop này bán đắt quá, qua zalo bên em sỉ lẻ rẻ hơn phân nửa mẫu chuẩn hàng loại 1 nè các chị',
        postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
        campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
      });
    } else if (type === 'spam') {
      handleAddComment({
        authorName: 'Cộng Tác Viên Online',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
        message: 'Tuyển CTV làm việc tại nhà rảnh lúc nào làm lúc đó 500k/ngày, ai làm inbox t.me/nhanqua2026',
        postTitle: 'Nồi Chiên Không Dầu Điện Tử 8L - Flash Sale',
        campaignName: 'Camp 2: Nồi Chiên Không Dầu 8L'
      });
    } else {
      handleAddComment({
        authorName: 'Lê Thùy Dung',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
        message: 'Đầm này giặt máy có sợ nhăn không shop? Mình 53kg mặc size nào vừa ạ?',
        postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
        campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
      });
    }
  };

  // Live Auto-Scan simulation loop
  useEffect(() => {
    if (!themeConfig.isLiveScanning) return;

    const interval = setInterval(() => {
      // 30% probability of incoming organic engagement simulation
      if (Math.random() < 0.3) {
        const sampleQuotes = [
          { name: 'Nguyễn Bích Ngọc', msg: 'Tư vấn giúp mình nhé 0903.182.911', phone: true },
          { name: 'Lê Thanh Bình', msg: 'Hàng đẹp lắm shop, giao nhanh nha!', phone: false },
          { name: 'Sỉ Rẻ Toàn Quốc', msg: 'Bên em có sẵn mẫu này bao rẻ hơn shop, ib em nha', phone: false }
        ];
        const pick = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
        handleAddComment({
          authorName: pick.name,
          message: pick.msg,
          campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
        });
      }
    }, themeConfig.autoScanInterval * 1000);

    return () => clearInterval(interval);
  }, [themeConfig.isLiveScanning, themeConfig.autoScanInterval, handleAddComment]);

  // Actions on comments
  const handleHideComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'hidden', hiddenReason: 'Ẩn thủ công bởi quản trị viên' } : c));
  };
  const handleUnhideComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'visible', hiddenReason: undefined } : c));
  };
  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, status: 'deleted', hiddenReason: 'Đã xóa khỏi bài viết' } : c));
  };

  // Rule actions
  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };
  const handleAddRule = (newRule: Omit<FilterRule, 'id' | 'matchCount' | 'createdAt'>) => {
    const item: FilterRule = {
      ...newRule,
      id: 'rule-' + Date.now(),
      matchCount: 0,
      createdAt: new Date().toISOString()
    };
    setRules(prev => [item, ...prev]);
  };
  const handleApplyTemplate = (category: string) => {
    if (category === 'phone_leak') {
      handleAddRule({
        name: 'Gói Chống Lộ SĐT & Cướp Khách Hàng',
        category: 'phone_leak',
        keywords: ['03', '05', '07', '08', '09', '+84', 'sdt', 'sđt', 'zalo', 'phone'],
        isRegex: true,
        action: 'hide',
        autoReplyMessage: 'Dạ shop đã gửi tin nhắn riêng cho bạn rồi ạ! Bạn kiểm tra nhé ❤️',
        enabled: true,
        severity: 'critical'
      });
    } else if (category === 'competitor_price') {
      handleAddRule({
        name: 'Gói Chống Đối Thủ Phá Giá & Chèo Kéo',
        category: 'competitor_price',
        keywords: ['bên em bán', 'bên em có', 'rẻ hơn shop', 'inbox e có sẵn', 'sỉ giá gốc', 'qua link em mua'],
        isRegex: false,
        action: 'hide',
        enabled: true,
        severity: 'critical'
      });
    } else if (category === 'profanity') {
      handleAddRule({
        name: 'Gói Chống Chửi Tục & Bôi Nhọ',
        category: 'profanity',
        keywords: ['lừa đảo', 'đắt như cắt cổ', 'hàng dởm', 'hàng đểu', 'treo đầu dê', 'đm', 'vcl', 'bán đắt'],
        isRegex: false,
        action: 'hide',
        enabled: true,
        severity: 'high'
      });
    } else if (category === 'spam_link') {
      handleAddRule({
        name: 'Gói Chặn Link Spam Tuyển CTV',
        category: 'spam_link',
        keywords: ['tuyển ctv', 'việc làm tại nhà', 't.me/', 'zalo.me/', 'kiếm tiền 500k', 'tải app'],
        isRegex: true,
        action: 'delete',
        enabled: true,
        severity: 'critical'
      });
    }
  };

  // Blacklist actions
  const handleAddBlacklistUser = (user: Omit<BlacklistedUser, 'id' | 'totalCommentsBlocked' | 'addedAt'>) => {
    const item: BlacklistedUser = {
      ...user,
      id: 'bl-' + Date.now(),
      totalCommentsBlocked: 0,
      addedAt: new Date().toISOString()
    };
    setBlacklist(prev => [item, ...prev]);
  };
  const handleRemoveBlacklistUser = (id: string) => {
    setBlacklist(prev => prev.filter(b => b.id !== id));
  };
  const handleToggleBlacklistStatus = (id: string) => {
    setBlacklist(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'blocked' ? 'watching' : 'blocked' } : b));
  };

  // Backup & Restore
  const handleCreateBackup = () => {
    const newPoint: BackupPoint = {
      id: 'bp-' + Date.now(),
      timestamp: new Date().toISOString(),
      title: `Bản sao lưu thủ công ${new Date().toLocaleTimeString('vi-VN')}`,
      sizeKb: Math.round(JSON.stringify({ comments, rules, blacklist, campaigns }).length / 1024),
      commentCount: comments.length,
      ruleCount: rules.length,
      type: 'manual'
    };
    setBackupPoints(prev => [newPoint, ...prev]);

    // Also download JSON
    const dataToExport = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      comments,
      rules,
      blacklist,
      campaigns,
      security
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AutoMod_FB_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (pointId: string) => {
    // Restore point simulator
    playSound('success', themeConfig.soundEnabled);
  };

  const handleImportBackupJson = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.comments) setComments(parsed.comments);
      if (parsed.rules) setRules(parsed.rules);
      if (parsed.blacklist) setBlacklist(parsed.blacklist);
      if (parsed.campaigns) setCampaigns(parsed.campaigns);
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen bg-neutral-100/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors ${
      themeConfig.accentColor === 'cyan' ? 'selection:bg-cyan-500' :
      themeConfig.accentColor === 'emerald' ? 'selection:bg-emerald-500' :
      themeConfig.accentColor === 'violet' ? 'selection:bg-purple-500' :
      themeConfig.accentColor === 'amber' ? 'selection:bg-amber-500' :
      'selection:bg-blue-600'
    } selection:text-white`}>
      {/* Top Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pages={pages}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        unreadCount={unreadNotificationsCount}
        openNotifications={() => setIsNotificationsOpen(true)}
        openAiTester={() => setIsAiTestOpen(true)}
        openShareModal={() => setIsShareOpen(true)}
        themeConfig={themeConfig}
        setThemeConfig={setThemeConfig}
        lang={lang}
        setLang={setLang}
        isOnline={isOnline}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          soundEnabled={themeConfig.soundEnabled}
          userRole="super_admin"
          hiddenCount={comments.filter(c => c.status === 'hidden').length}
          ruleCount={rules.length}
          blacklistCount={blacklist.length}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              comments={comments}
              campaigns={campaigns}
              rules={rules}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onUnhideComment={handleUnhideComment}
              onHideComment={handleHideComment}
              onInjectTestComment={handleInjectTestComment}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'comments' && (
            <CommentsTab
              comments={comments}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onHideComment={handleHideComment}
              onUnhideComment={handleUnhideComment}
              onDeleteComment={handleDeleteComment}
              onBlockUser={(uid, name, reason) => {
                handleAddBlacklistUser({ fbUid: uid, name, reason, addedBy: 'Kiểm duyệt viên', status: 'blocked' });
              }}
              onAddComment={handleAddComment}
            />
          )}

          {activeTab === 'rules' && (
            <RulesTab
              rules={rules}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onToggleRule={handleToggleRule}
              onDeleteRule={handleDeleteRule}
              onOpenAddModal={() => setIsAddRuleOpen(true)}
              onApplyTemplate={handleApplyTemplate}
            />
          )}

          {activeTab === 'blacklist' && (
            <BlacklistTab
              blacklist={blacklist}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onAddUser={handleAddBlacklistUser}
              onRemoveUser={handleRemoveBlacklistUser}
              onToggleStatus={handleToggleBlacklistStatus}
            />
          )}

          {activeTab === 'ad_accounts' && (
            <AdAccountsTab
              campaigns={campaigns}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              comments={comments}
              campaigns={campaigns}
              rules={rules}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onOpenPrintModal={() => setIsPrintReportOpen(true)}
            />
          )}

          {activeTab === 'fb_token' && (
            <FbTokenTab
              pages={pages}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onUpdateToken={(pageId, token) => {
                setPages(prev => prev.map(p => p.pageId === pageId ? { ...p, tokenStatus: 'valid' } : p));
              }}
            />
          )}

          {activeTab === 'open_api' && (
            <OpenApiTab
              webhooks={webhooks}
              apiKeys={apiKeys}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onAddWebhook={(newHook) => {
                setWebhooks(prev => [{ ...newHook, id: 'wh-' + Date.now(), failureCount: 0 }, ...prev]);
              }}
              onDeleteWebhook={(id) => setWebhooks(prev => prev.filter(w => w.id !== id))}
              onGenerateApiKey={(name) => {
                const newKey: ApiKeyItem = {
                  id: 'key-' + Date.now(),
                  name,
                  prefix: `automod_live_${Math.random().toString(36).substring(2, 7)}***${Math.random().toString(36).substring(2, 6)}`,
                  createdAt: new Date().toISOString(),
                  expiresAt: '2027-10-06T00:00:00Z'
                };
                setApiKeys(prev => [newKey, ...prev]);
              }}
            />
          )}

          {activeTab === 'team' && (
            <TeamTab
              team={team}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onAddMember={(mem) => {
                const newMem: TeamMember = {
                  ...mem,
                  id: 'team-' + Date.now(),
                  addedAt: new Date().toISOString(),
                  lastActive: 'Vừa xong'
                };
                setTeam(prev => [...prev, newMem]);
              }}
              onChangeRole={(id, role) => {
                setTeam(prev => prev.map(m => m.id === id ? { ...m, role } : m));
              }}
              onRemoveMember={(id) => {
                setTeam(prev => prev.filter(m => m.id !== id));
              }}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              security={security}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onUpdateSecurity={(newSec) => setSecurity(prev => ({ ...prev, ...newSec }))}
              onOpen2FaModal={() => setIsTwoFactorOpen(true)}
            />
          )}

          {activeTab === 'backup' && (
            <BackupTab
              backupPoints={backupPoints}
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
              onCreateBackup={handleCreateBackup}
              onRestoreBackup={handleRestoreBackup}
              onImportBackupJson={handleImportBackupJson}
            />
          )}

          {activeTab === 'guide' && (
            <GuideTab
              lang={lang}
              soundEnabled={themeConfig.soundEnabled}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              themeConfig={themeConfig}
              setThemeConfig={setThemeConfig}
              lang={lang}
              setLang={setLang}
            />
          )}
        </main>
      </div>

      {/* Slide-overs & Modals */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
      />

      <AiTestModal
        isOpen={isAiTestOpen}
        onClose={() => setIsAiTestOpen(false)}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
        totalComments={comments.length}
        hiddenComments={comments.filter(c => c.status === 'hidden').length}
        leadsSaved={comments.filter(c => c.containsPhone).length}
      />

      <AddRuleModal
        isOpen={isAddRuleOpen}
        onClose={() => setIsAddRuleOpen(false)}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
        onAddRule={handleAddRule}
      />

      <TwoFactorModal
        isOpen={isTwoFactorOpen}
        onClose={() => setIsTwoFactorOpen(false)}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
        onSuccess2Fa={() => setSecurity(prev => ({ ...prev, twoFactorEnabled: true }))}
      />

      <PrintReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        comments={comments}
        campaigns={campaigns}
        rules={rules}
        lang={lang}
        soundEnabled={themeConfig.soundEnabled}
      />
    </div>
  );
}

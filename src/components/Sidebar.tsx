import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  ShieldAlert,
  Users,
  Target,
  FileSpreadsheet,
  KeyRound,
  Webhook,
  UserCheck,
  Lock,
  Database,
  BookOpen,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { playSound } from '../services/sound';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  soundEnabled: boolean;
  userRole: UserRole;
  hiddenCount: number;
  ruleCount: number;
  blacklistCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  soundEnabled,
  userRole,
  hiddenCount,
  ruleCount,
  blacklistCount
}) => {
  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    playSound('click', soundEnabled);
  };

  const navGroups = [
    {
      groupTitle: lang === 'vi' ? 'Quản lý & Tương tác' : 'Moderation & Ads',
      items: [
        {
          id: 'dashboard',
          label: lang === 'vi' ? 'Tổng quan Ads' : 'Ads Overview',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'comments',
          label: lang === 'vi' ? 'Dòng bình luận' : 'Live Comments',
          icon: MessageSquare,
          badge: hiddenCount > 0 ? `${hiddenCount} ẩn` : null,
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
        },
        {
          id: 'ad_accounts',
          label: lang === 'vi' ? 'Chiến dịch Ads' : 'Ad Campaigns',
          icon: Target,
          badge: '4 Camp'
        }
      ]
    },
    {
      groupTitle: lang === 'vi' ? 'Tự động hóa & Bộ lọc' : 'Automation & Rules',
      items: [
        {
          id: 'rules',
          label: lang === 'vi' ? 'Bộ lọc từ khóa' : 'Keyword Filters',
          icon: ShieldAlert,
          badge: `${ruleCount}`
        },
        {
          id: 'blacklist',
          label: lang === 'vi' ? 'Danh sách đen UID' : 'Blacklisted UIDs',
          icon: Users,
          badge: `${blacklistCount}`
        },
        {
          id: 'fb_token',
          label: lang === 'vi' ? 'Kết nối Token FB' : 'FB Token Setup',
          icon: KeyRound,
          badge: 'Live'
        }
      ]
    },
    {
      groupTitle: lang === 'vi' ? 'Phân tích & Tích hợp' : 'Analytics & Integration',
      items: [
        {
          id: 'reports',
          label: lang === 'vi' ? 'Báo cáo & Xuất file' : 'Reports & Export',
          icon: FileSpreadsheet,
          badge: 'PDF/XLS'
        },
        {
          id: 'open_api',
          label: lang === 'vi' ? 'API Mở & Webhooks' : 'Open API & Webhooks',
          icon: Webhook,
          badge: null
        },
        {
          id: 'team',
          label: lang === 'vi' ? 'Phân quyền QTV' : 'Admin Roles',
          icon: UserCheck,
          badge: null
        }
      ]
    },
    {
      groupTitle: lang === 'vi' ? 'Hệ thống & An ninh' : 'System & Security',
      items: [
        {
          id: 'security',
          label: lang === 'vi' ? 'Bảo mật 2FA' : '2FA Security',
          icon: Lock,
          badge: '2FA Bật'
        },
        {
          id: 'backup',
          label: lang === 'vi' ? 'Sao lưu dữ liệu' : 'Backup & Restore',
          icon: Database,
          badge: null
        },
        {
          id: 'guide',
          label: lang === 'vi' ? 'Hướng dẫn sử dụng' : 'Documentation',
          icon: BookOpen,
          badge: null
        },
        {
          id: 'settings',
          label: lang === 'vi' ? 'Tùy chỉnh giao diện' : 'Settings',
          icon: Settings,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] select-none">
      {/* Current User mini status */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
            NT
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              Nguyễn Thành Thiện
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="truncate uppercase font-mono tracking-wider text-[10px]">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div className="px-3 pb-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {group.groupTitle}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Health Footer */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Graph API v21.0</span>
          </div>
          <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">110ms avg</span>
        </div>
      </div>
    </aside>
  );
};

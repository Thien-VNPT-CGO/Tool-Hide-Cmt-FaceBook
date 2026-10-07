import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  PhoneCall,
  Trash2,
  Check
} from 'lucide-react';
import { Language, NotificationItem } from '../../types';
import { playSound } from '../../services/sound';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  lang: Language;
  soundEnabled: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  lang,
  soundEnabled,
  onMarkAsRead,
  onMarkAllRead,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {lang === 'vi' ? 'Trung Tâm Thông Báo Cảnh Báo' : 'Alert Notifications'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={() => {
                  onMarkAllRead();
                  playSound('click', soundEnabled);
                }}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Đã đọc tất cả
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                playSound('click', soundEnabled);
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p>Hiện không có thông báo cảnh báo nào mới.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) onMarkAsRead(n.id);
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  n.read
                    ? 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20'
                    : 'border-rose-200 dark:border-rose-950/80 bg-rose-50/30 dark:bg-rose-950/20 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.severity === 'critical' ? (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {n.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(n.timestamp).toLocaleTimeString('vi-VN')}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                  {n.message}
                </p>

                {n.keyword && (
                  <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 inline-block text-neutral-700 dark:text-neutral-300">
                    Từ khóa: "{n.keyword}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-[11px] text-neutral-400">
              Tổng số {notifications.length} thông báo
            </span>
            <button
              onClick={() => {
                onClearAll();
                playSound('delete', soundEnabled);
              }}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

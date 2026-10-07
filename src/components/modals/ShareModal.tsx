import React, { useState } from 'react';
import {
  X,
  Share2,
  Lock,
  Copy,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Language } from '../../types';
import { playSound } from '../../services/sound';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  totalComments: number;
  hiddenComments: number;
  leadsSaved: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lang,
  soundEnabled,
  totalComments,
  hiddenComments,
  leadsSaved
}) => {
  const [password, setPassword] = useState('Pass@2026');
  const [expiry, setExpiry] = useState('7d');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://automod.vn/share?t=sec_${Math.random().toString(36).substring(2, 10)}&exp=${expiry}`;

  const summaryText = `🛡️ [BÁO CÁO BẢO VỆ TƯƠNG TÁC FB ADS]
• Tổng bình luận quét: ${totalComments}
• Bình luận ẩn vi phạm: ${hiddenComments}
• SĐT khách được cứu: ${leadsSaved} leads
• Liên kết xem chi tiết: ${shareUrl}
• Mật khẩu giải mã: ${password}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    playSound('success', soundEnabled);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    playSound('success', soundEnabled);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Chia Sẻ Dữ Liệu An Toàn Cho Bạn Bè & Đối Tác
            </h2>
          </div>
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

        <p className="text-xs text-neutral-500 mt-3">
          Tạo liên kết xem an toàn có mã hóa và mật khẩu bảo vệ. Bạn bè hoặc sếp có thể xem báo cáo trực tiếp mà không cần đăng nhập vào tài khoản.
        </p>

        {/* Configurations */}
        <div className="space-y-3 mt-4">
          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Mật khẩu bảo vệ liên kết
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Thời hạn của liên kết
            </label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
            >
              <option value="24h">24 giờ (Hết hạn sau 1 ngày)</option>
              <option value="7d">7 ngày (Khuyên dùng)</option>
              <option value="30d">30 ngày</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Liên kết chia sẻ bảo mật (Đã mã hóa token)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/60 font-mono text-neutral-700 dark:text-neutral-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Đã copy' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick summary button */}
        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleCopySummary}
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Copy tin nhắn tóm tắt gửi Zalo / Telegram</span>
          </button>
        </div>
      </div>
    </div>
  );
};

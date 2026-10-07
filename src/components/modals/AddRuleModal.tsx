import React, { useState } from 'react';
import {
  X,
  Plus,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { ActionType, FilterRule, Language, RuleCategory } from '../../types';
import { playSound } from '../../services/sound';

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  onAddRule: (rule: Omit<FilterRule, 'id' | 'matchCount' | 'createdAt'>) => void;
}

export const AddRuleModal: React.FC<AddRuleModalProps> = ({
  isOpen,
  onClose,
  lang,
  soundEnabled,
  onAddRule
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RuleCategory>('phone_leak');
  const [keywordsText, setKeywordsText] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [action, setAction] = useState<ActionType>('hide');
  const [autoReplyMessage, setAutoReplyMessage] = useState('Dạ shop đã gửi tin nhắn riêng cho bạn rồi ạ! Bạn kiểm tra nhé ❤️');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !keywordsText.trim()) return;

    const keywords = keywordsText
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    onAddRule({
      name: name.trim(),
      category,
      keywords,
      isRegex,
      action,
      autoReplyMessage: action === 'auto_reply' || autoReplyMessage ? autoReplyMessage : undefined,
      enabled: true,
      severity
    });

    setName('');
    setKeywordsText('');
    onClose();
    playSound('success', soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {lang === 'vi' ? 'Thêm Bộ Lọc Từ Khóa & Quy Tắc Mới' : 'Add New Filter Rule'}
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

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Tên quy tắc / Mục đích lọc *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Chặn từ khóa hỏi giá sỉ đối thủ..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Phân loại vi phạm
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RuleCategory)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="phone_leak">Lộ SĐT / Cướp khách</option>
                <option value="competitor_price">Đối thủ phá giá & chèo kéo</option>
                <option value="profanity">Chửi tục & Bôi nhọ</option>
                <option value="spam_link">Spam link & Lừa đảo</option>
                <option value="negative_review">Đánh giá tiêu cực</option>
                <option value="custom">Tùy biến nâng cao</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Mức độ nghiêm trọng
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="critical">Khẩn cấp (Ẩn ngay lập tức)</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
              Danh sách từ khóa (Cách nhau bằng dấu phẩy) *
            </label>
            <textarea
              rows={3}
              required
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="giá sỉ, bao nhiêu tiền, rẻ hơn, qua link em, zalo..."
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="regex-check"
              checked={isRegex}
              onChange={(e) => setIsRegex(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="regex-check" className="text-neutral-600 dark:text-neutral-400">
              Sử dụng biểu thức chính quy (Regex pattern)
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Hành động thực thi khi phát hiện
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as ActionType)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="hide">Ẩn bình luận tức thì (is_hidden=true)</option>
                <option value="delete">Xóa vĩnh viễn khỏi bài viết</option>
                <option value="auto_reply">Ẩn & Tự động gửi inbox riêng</option>
                <option value="flag_review">Gắn cờ cảnh báo người duyệt</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Nội dung tin nhắn inbox riêng (Nếu có)
              </label>
              <input
                type="text"
                value={autoReplyMessage}
                onChange={(e) => setAutoReplyMessage(e.target.value)}
                placeholder="Dạ shop đã gửi tin nhắn riêng cho bạn rồi ạ..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Lưu & Kích hoạt quy tắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

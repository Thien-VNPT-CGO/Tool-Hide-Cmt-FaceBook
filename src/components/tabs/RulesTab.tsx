import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { FilterRule, Language } from '../../types';
import { playSound } from '../../services/sound';

interface RulesTabProps {
  rules: FilterRule[];
  lang: Language;
  soundEnabled: boolean;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
  onOpenAddModal: () => void;
  onApplyTemplate: (templateName: string) => void;
}

export const RulesTab: React.FC<RulesTabProps> = ({
  rules,
  lang,
  soundEnabled,
  onToggleRule,
  onDeleteRule,
  onOpenAddModal,
  onApplyTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRules = rules.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Bộ Lọc Từ Khóa & Quy Tắc Ẩn Tự Động' : 'Keyword Filter Rules'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono font-semibold">
              {rules.length} quy tắc hoạt động
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Tự động bắt từ khóa nhạy cảm, biểu thức chính quy (Regex) và cấu hình hành vi xử lý (Ẩn, Xóa, hoặc Tự động phản hồi tin nhắn riêng cho khách).'
              : 'Configure keyword triggers, regex patterns and automated actions.'}
          </p>
        </div>

        <button
          onClick={() => {
            onOpenAddModal();
            playSound('click', soundEnabled);
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'vi' ? '+ Thêm bộ lọc từ khóa' : '+ Add Keyword Filter'}</span>
        </button>
      </div>

      {/* Recommended Pre-built Vietnamese Templates */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60">
        <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{lang === 'vi' ? 'Gói từ khóa mẫu tối ưu sẵn cho Fanpage Bán Hàng & Chạy Ads VN:' : 'Recommended Vietnamese e-commerce rule packages:'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              onApplyTemplate('phone_leak');
              playSound('success', soundEnabled);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs"
          >
            🛡️ Gói Chống Lộ SĐT & Cướp Đơn (09x, 08x, sdt, zalo...)
          </button>
          <button
            onClick={() => {
              onApplyTemplate('competitor_price');
              playSound('success', soundEnabled);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs"
          >
            🚫 Gói Chống Đối Thủ Phá Giá & Chèo Kéo (sỉ, rẻ hơn, qua e...)
          </button>
          <button
            onClick={() => {
              onApplyTemplate('profanity');
              playSound('success', soundEnabled);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs"
          >
            ⚠️ Gói Chống Chửi Tục & Bôi Nhọ (lừa đảo, dởm, đắt thế...)
          </button>
          <button
            onClick={() => {
              onApplyTemplate('spam_link');
              playSound('success', soundEnabled);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-2xs"
          >
            ❌ Gói Chặn Link Spam Tuyển CTV (t.me, kiếm 500k, tải app...)
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
        {[
          { id: 'all', label: lang === 'vi' ? 'Tất cả' : 'All' },
          { id: 'phone_leak', label: lang === 'vi' ? 'Số điện thoại' : 'Phone Numbers' },
          { id: 'competitor_price', label: lang === 'vi' ? 'Đối thủ chèo kéo' : 'Competitor' },
          { id: 'profanity', label: lang === 'vi' ? 'Chửi tục & Bôi nhọ' : 'Profanity' },
          { id: 'spam_link', label: lang === 'vi' ? 'Spam link rác' : 'Spam Links' },
          { id: 'negative_review', label: lang === 'vi' ? 'Đánh giá tiêu cực' : 'Negative' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedCategory(tab.id);
              playSound('click', soundEnabled);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-xl border transition-all ${
              rule.enabled
                ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span>{rule.name}</span>
                  {rule.isRegex && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      Regex
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                  <span className="capitalize">{rule.category.replace('_', ' ')}</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums font-semibold text-blue-600 dark:text-blue-400">
                    {rule.matchCount} lần kích hoạt
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => {
                  onToggleRule(rule.id);
                  playSound('toggle', soundEnabled);
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  rule.enabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
                aria-label="Bật tắt quy tắc"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    rule.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Keyword tags list */}
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Từ khóa kích hoạt ({rule.keywords.length}):
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {rule.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono"
                  >
                    "{kw}"
                  </span>
                ))}
              </div>
            </div>

            {/* Action behavior & Auto-reply */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-500">Hành động:</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                    rule.action === 'hide'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : rule.action === 'delete'
                      ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                  }`}
                >
                  {rule.action === 'hide'
                    ? 'Ẩn comment ngay lập tức'
                    : rule.action === 'delete'
                    ? 'Xóa vĩnh viễn'
                    : 'Gửi tin nhắn riêng'}
                </span>
              </div>

              <button
                onClick={() => {
                  onDeleteRule(rule.id);
                  playSound('delete', soundEnabled);
                }}
                className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                title="Xóa quy tắc này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Auto reply message preview if present */}
            {rule.autoReplyMessage && (
              <div className="mt-2 p-2 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-1.5">
                <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Phản hồi riêng: "{rule.autoReplyMessage}"</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

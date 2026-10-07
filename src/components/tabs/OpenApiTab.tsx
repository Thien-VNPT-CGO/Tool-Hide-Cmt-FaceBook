import React, { useState } from 'react';
import {
  Webhook,
  KeyRound,
  Code,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  Terminal,
  Zap,
  ExternalLink
} from 'lucide-react';
import { ApiKeyItem, Language, WebhookConfig } from '../../types';
import { playSound } from '../../services/sound';

interface OpenApiTabProps {
  webhooks: WebhookConfig[];
  apiKeys: ApiKeyItem[];
  lang: Language;
  soundEnabled: boolean;
  onAddWebhook: (hook: Omit<WebhookConfig, 'id' | 'failureCount'>) => void;
  onDeleteWebhook: (id: string) => void;
  onGenerateApiKey: (name: string) => void;
}

export const OpenApiTab: React.FC<OpenApiTabProps> = ({
  webhooks,
  apiKeys,
  lang,
  soundEnabled,
  onAddWebhook,
  onDeleteWebhook,
  onGenerateApiKey
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New webhook form state
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [hookName, setHookName] = useState('');
  const [hookUrl, setHookUrl] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    playSound('success', soundEnabled);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookName.trim() || !hookUrl.trim()) return;

    onAddWebhook({
      name: hookName.trim(),
      url: hookUrl.trim(),
      secret: 'whsec_' + Math.random().toString(36).substring(2, 12),
      events: ['comment.hidden', 'phone.extracted'],
      active: true,
      lastTriggered: new Date().toISOString()
    });

    setHookName('');
    setHookUrl('');
    setShowAddWebhook(false);
    playSound('success', soundEnabled);
  };

  const codeSnippets = {
    curl: `curl -X POST https://api.automod.vn/v1/comments/hide \\
  -H "Authorization: Bearer automod_live_89f3a***99b2" \\
  -H "Content-Type: application/json" \\
  -d '{
    "comment_id": "104859201948271_9812481",
    "reason": "Chứa số điện thoại khách hàng",
    "send_private_reply": true
  }'`,
    node: `import axios from 'axios';

const response = await axios.post('https://api.automod.vn/v1/comments/hide', {
  comment_id: '104859201948271_9812481',
  reason: 'Chứa số điện thoại khách hàng',
  send_private_reply: true
}, {
  headers: {
    'Authorization': 'Bearer automod_live_89f3a***99b2'
  }
});
console.log('Comment hidden:', response.data);`,
    python: `import requests

url = "https://api.automod.vn/v1/comments/hide"
headers = {
    "Authorization": "Bearer automod_live_89f3a***99b2",
    "Content-Type": "application/json"
}
payload = {
    "comment_id": "104859201948271_9812481",
    "reason": "Chứa số điện thoại khách hàng",
    "send_private_reply": True
}
response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'API Mở & Tích Hợp Webhook Bên Thứ Ba' : 'Open API & Webhook Integrations'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-mono font-semibold">
              RESTful API
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Tích hợp kết nối trực tiếp với CRM Pancake, Haravan, KiotViet, Telegram Bot hoặc website riêng qua Webhooks và khóa bảo mật API.'
              : 'Integrate with third-party CRM, Telegram bots and e-commerce software via Webhooks.'}
          </p>
        </div>

        <button
          onClick={() => {
            onGenerateApiKey('Khóa API Tích Hợp Mới');
            playSound('success', soundEnabled);
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
        >
          <KeyRound className="w-4 h-4" />
          <span>{lang === 'vi' ? '+ Tạo API Key Mới' : '+ Generate API Key'}</span>
        </button>
      </div>

      {/* Webhooks Manager */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <Webhook className="w-4 h-4 text-blue-500" />
              <span>Cấu Hình Webhook Bắn Sự Kiện Thời Gian Thực</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Hệ thống sẽ gửi HTTP POST khi có bình luận bị ẩn hoặc số điện thoại mới được phát hiện.
            </p>
          </div>

          <button
            onClick={() => setShowAddWebhook(!showAddWebhook)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            + Thêm Endpoint Webhook
          </button>
        </div>

        {showAddWebhook && (
          <form onSubmit={handleCreateWebhook} className="mb-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                  Tên hệ thống kết nối
                </label>
                <input
                  type="text"
                  required
                  value={hookName}
                  onChange={(e) => setHookName(e.target.value)}
                  placeholder="Ví dụ: CRM Pancake Bán Hàng"
                  className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                  Payload URL (Endpoint nhận dữ liệu)
                </label>
                <input
                  type="url"
                  required
                  value={hookUrl}
                  onChange={(e) => setHookUrl(e.target.value)}
                  placeholder="https://your-crm.com/api/webhook"
                  className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddWebhook(false)}
                className="px-3 py-1 text-xs text-neutral-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-semibold rounded bg-blue-600 text-white"
              >
                Lưu Webhook
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {webhooks.map((hook) => (
            <div
              key={hook.id}
              className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{hook.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-emerald-600 font-mono">Đang lắng nghe</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 mt-1 truncate max-w-md">
                  {hook.url}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  {hook.events.map((ev, i) => (
                    <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    copyToClipboard(hook.secret, hook.id);
                  }}
                  className="px-2.5 py-1 text-xs rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === hook.id ? 'Đã copy' : 'Copy Secret'}</span>
                </button>
                <button
                  onClick={() => {
                    onDeleteWebhook(hook.id);
                    playSound('delete', soundEnabled);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Snippets Console */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-white shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-semibold">Tài liệu gọi API Ẩn Comment Tức Thì</span>
          </div>

          <div className="flex items-center gap-1">
            {(['curl', 'node', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCodeTab(tab)}
                className={`px-2.5 py-1 text-xs font-mono rounded ${
                  activeCodeTab === tab ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <pre className="mt-3 text-xs font-mono text-emerald-400 overflow-x-auto p-2 leading-relaxed">
          {codeSnippets[activeCodeTab]}
        </pre>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import { FbPageAccount, Language } from '../../types';
import { playSound } from '../../services/sound';
import { REQUIRED_PERMISSIONS, verifyFacebookToken } from '../../services/fbGraphApi';

interface FbTokenTabProps {
  pages: FbPageAccount[];
  selectedPage: FbPageAccount;
  setSelectedPage: (page: FbPageAccount) => void;
  lang: Language;
  soundEnabled: boolean;
  onUpdateToken: (pageId: string, newToken: string) => void;
}

export const FbTokenTab: React.FC<FbTokenTabProps> = ({
  pages,
  selectedPage,
  setSelectedPage,
  lang,
  soundEnabled,
  onUpdateToken
}) => {
  const [tokenInput, setTokenInput] = useState(
    'EAABsbCS1iHgBA...EAAGm0PX2KkL7mZCQ3N8..._PAGE_PERMANENT_TOKEN'
  );
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{
    success: boolean;
    message: string;
    scopes: { name: string; granted: boolean }[];
  } | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    playSound('click', soundEnabled);

    const result = await verifyFacebookToken(tokenInput, selectedPage.pageId);
    setTimeout(() => {
      setIsVerifying(false);
      if (result.isValid) {
        setVerifyStatus({
          success: true,
          message: 'Mã Access Token hoàn toàn hợp lệ! Đầy đủ quyền quản lý bài viết và tương tác Facebook Graph API.',
          scopes: result.scopes
        });
        playSound('success', soundEnabled);
        onUpdateToken(selectedPage.pageId, tokenInput);
      } else {
        setVerifyStatus({
          success: false,
          message: result.errorMessage || 'Mã Token không hợp lệ.',
          scopes: result.scopes
        });
        playSound('alert', soundEnabled);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Quản Lý Kết Nối Facebook Access Token' : 'Facebook Graph API Token Setup'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
              Live Connected
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Sử dụng Page Access Token chính thức từ Facebook for Developers để thực thi các lệnh POST /{comment_id} ẩn bình luận ngay lập tức với tốc độ cao.'
              : 'Secure Page Access Token management with real-time permissions diagnostics.'}
          </p>
        </div>

        <a
          href="https://developers.facebook.com/tools/explorer/"
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
        >
          <span>Mở Graph API Explorer</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Token Input Form */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            Page Access Token (EAA...) - {selectedPage.name}
          </label>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Hạn dùng: Vĩnh viễn (System User Token)
          </span>
        </div>

        <div className="relative">
          <input
            type={showToken ? 'text' : 'password'}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Dán mã Page Access Token (EAA...) vào đây..."
            className="w-full pl-3 pr-20 py-2.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              title={showToken ? 'Ẩn token' : 'Hiện token'}
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(tokenInput);
                playSound('success', soundEnabled);
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              title="Sao chép Token"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-neutral-500">
            Khuyên dùng: Tạo Token vĩnh viễn trong <strong>Trình quản lý kinh doanh (Meta Business Suite)</strong> &gt; Người dùng hệ thống (System Users).
          </p>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Đang kiểm tra quyền...' : 'Kiểm tra & Xác minh Token'}</span>
          </button>
        </div>

        {/* Verification result notification */}
        {verifyStatus && (
          <div
            className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2.5 animate-in fade-in ${
              verifyStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
          >
            {verifyStatus.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{verifyStatus.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Permissions Matrix */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-1">
          Ma Trận Phân Quyền Bắt Buộc (Facebook Scopes Matrix)
        </h2>
        <p className="text-xs text-neutral-500 mb-4">
          Các quyền cần thiết để ứng dụng có thể đọc bình luận và thực thi thao tác ẩn qua API:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {REQUIRED_PERMISSIONS.map((perm) => (
            <div
              key={perm}
              className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                  {perm}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {perm === 'pages_manage_posts'
                    ? 'Quản lý ẩn/xóa bình luận'
                    : perm === 'pages_read_engagement'
                    ? 'Đọc luồng bình luận tương tác'
                    : perm === 'pages_messaging'
                    ? 'Gửi tin nhắn phản hồi riêng'
                    : perm === 'ads_management'
                    ? 'Bảo vệ bài viết trả phí Ads'
                    : 'Quyền hợp lệ'}
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Connected Fanpages list */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3">
          Danh Sách Fanpage Đang Đồng Bộ
        </h2>
        <div className="space-y-3">
          {pages.map((p) => (
            <div
              key={p.id}
              className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                selectedPage.id === p.id
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">{p.name}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">Page ID: {p.pageId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedPage.id === p.id ? (
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60">
                    Đang chọn
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedPage(p);
                      playSound('click', soundEnabled);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                  >
                    Chọn Page này
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Smartphone,
  Key,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Language, SecuritySettings } from '../../types';
import { playSound } from '../../services/sound';

interface SecurityTabProps {
  security: SecuritySettings;
  lang: Language;
  soundEnabled: boolean;
  onUpdateSecurity: (newSec: Partial<SecuritySettings>) => void;
  onOpen2FaModal: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  security,
  lang,
  soundEnabled,
  onUpdateSecurity,
  onOpen2FaModal
}) => {
  const [ipInput, setIpInput] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleToggleIpWhitelist = () => {
    onUpdateSecurity({ ipWhitelistEnabled: !security.ipWhitelistEnabled });
    playSound('toggle', soundEnabled);
  };

  const handleAddIp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    onUpdateSecurity({ allowedIps: [...security.allowedIps, ipInput.trim()] });
    setIpInput('');
    playSound('success', soundEnabled);
  };

  const handleRemoveIp = (ip: string) => {
    onUpdateSecurity({ allowedIps: security.allowedIps.filter(i => i !== ip) });
    playSound('delete', soundEnabled);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Bảo Mật Hai Yếu Tố (2FA) & An Toàn Tài Khoản' : 'Two-Factor Authentication & Security'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
              Mã Hóa AES-256
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Bảo vệ an toàn tuyệt đối cho Token Facebook chính, ngăn chặn tấn công chiếm quyền quản trị và lộ data nhạy cảm bằng mã TOTP 6 số.'
              : 'Enterprise grade account security with TOTP 2FA and IP address whitelisting.'}
          </p>
        </div>

        <button
          onClick={() => {
            onOpen2FaModal();
            playSound('click', soundEnabled);
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>{security.twoFactorEnabled ? 'Cấu hình lại 2FA' : 'Kích hoạt 2FA ngay'}</span>
        </button>
      </div>

      {/* 2FA Status Card */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              security.twoFactorEnabled
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Xác thực 2 bước (Google Authenticator / Authy)
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {security.twoFactorEnabled
                  ? 'Tài khoản của bạn đang được bảo vệ bằng mã bảo mật TOTP 6 số mỗi khi đăng nhập.'
                  : 'Cảnh báo: Tài khoản chưa bật 2FA. Bật 2FA ngay để chống hack Token Facebook.'}
              </p>
            </div>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
            security.twoFactorEnabled
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}>
            {security.twoFactorEnabled ? 'Đang hoạt động' : 'Chưa bật'}
          </span>
        </div>
      </div>

      {/* IP Whitelist & Session Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IP Whitelist */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Danh Sách IP Độc Quyền (Whitelist)</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Chỉ cho phép đăng nhập từ IP văn phòng cố định.
              </p>
            </div>

            <button
              onClick={handleToggleIpWhitelist}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                security.ipWhitelistEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  security.ipWhitelistEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <form onSubmit={handleAddIp} className="flex gap-2 my-3">
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Nhập địa chỉ IPv4 (Ví dụ: 118.69.182.42)..."
              className="flex-1 px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shrink-0"
            >
              Thêm IP
            </button>
          </form>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {security.allowedIps.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-800/50 text-xs font-mono">
                <span>{ip}</span>
                <button
                  onClick={() => handleRemoveIp(ip)}
                  className="text-neutral-400 hover:text-rose-600"
                >
                  Gỡ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Session Log */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" />
            <span>Phiên Đăng Nhập Gần Nhất</span>
          </h2>

          <div className="space-y-3 mt-3 text-xs">
            <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                <span>Thiết bị hiện tại:</span>
                <span className="text-emerald-600 font-mono font-semibold">Đang kết nối</span>
              </div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                {security.lastLogin.device}
              </p>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                IP: {security.lastLogin.ip}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono mt-1">
                Thời gian: {security.lastLogin.time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

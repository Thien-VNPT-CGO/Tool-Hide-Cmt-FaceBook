import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Copy,
  CheckCircle2,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Language } from '../../types';
import { playSound } from '../../services/sound';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
  onSuccess2Fa: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  lang,
  soundEnabled,
  onSuccess2Fa
}) => {
  const [code, setCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const secretKey = 'JBSWY3DPEHPK3PXP';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      playSound('alert', soundEnabled);
      return;
    }

    onSuccess2Fa();
    playSound('success', soundEnabled);
    onClose();
  };

  const copyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setIsCopied(true);
    playSound('success', soundEnabled);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
        <button
          onClick={() => {
            onClose();
            playSound('click', soundEnabled);
          }}
          className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <Smartphone className="w-6 h-6" />
        </div>

        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Cài Đặt Xác Thực 2 Yếu Tố (2FA)
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Quét mã QR bằng ứng dụng <strong>Google Authenticator</strong> hoặc Authy trên điện thoại của bạn.
        </p>

        {/* QR Code SVG representation */}
        <div className="my-4 p-3 rounded-xl bg-white border border-neutral-200 inline-block shadow-sm">
          <svg viewBox="0 0 100 100" className="w-36 h-36">
            <rect width="100" height="100" fill="white" />
            {/* Corner Markers */}
            <rect x="10" y="10" width="24" height="24" fill="black" />
            <rect x="14" y="14" width="16" height="16" fill="white" />
            <rect x="18" y="18" width="8" height="8" fill="black" />

            <rect x="66" y="10" width="24" height="24" fill="black" />
            <rect x="70" y="14" width="16" height="16" fill="white" />
            <rect x="74" y="18" width="8" height="8" fill="black" />

            <rect x="10" y="66" width="24" height="24" fill="black" />
            <rect x="14" y="70" width="16" height="16" fill="white" />
            <rect x="18" y="74" width="8" height="8" fill="black" />

            {/* Pattern Dots */}
            <rect x="42" y="14" width="6" height="6" fill="black" />
            <rect x="52" y="24" width="6" height="6" fill="black" />
            <rect x="42" y="34" width="6" height="6" fill="black" />
            <rect x="24" y="44" width="6" height="6" fill="black" />
            <rect x="44" y="44" width="12" height="12" fill="black" />
            <rect x="64" y="44" width="6" height="6" fill="black" />
            <rect x="74" y="54" width="6" height="6" fill="black" />
            <rect x="42" y="64" width="6" height="6" fill="black" />
            <rect x="54" y="74" width="6" height="6" fill="black" />
            <rect x="74" y="74" width="12" height="12" fill="black" />
          </svg>
        </div>

        {/* Secret Key */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-mono mb-4 text-left">
          <span className="truncate">{secretKey}</span>
          <button
            onClick={copyKey}
            className="text-blue-600 dark:text-blue-400 font-sans font-semibold shrink-0 ml-2"
          >
            {isCopied ? 'Đã copy' : 'Sao chép'}
          </button>
        </div>

        {/* 6 Digit Verification Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''));
              setError(null);
            }}
            placeholder="Nhập 6 số (VD: 482910)"
            className="w-full text-center text-lg tracking-widest font-mono py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          {error && <p className="text-xs text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Xác minh & Kích hoạt 2FA
          </button>
        </form>
      </div>
    </div>
  );
};

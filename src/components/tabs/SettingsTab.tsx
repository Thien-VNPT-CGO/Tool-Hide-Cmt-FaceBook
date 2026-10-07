import React, { useState } from 'react';
import {
  Palette,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  Clock,
  Globe,
  Sliders,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { Language, ThemeConfig } from '../../types';
import { playSound } from '../../services/sound';

interface SettingsTabProps {
  themeConfig: ThemeConfig;
  setThemeConfig: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  themeConfig,
  setThemeConfig,
  lang,
  setLang
}) => {
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  const colors: Array<{ id: ThemeConfig['accentColor']; name: string; hex: string }> = [
    { id: 'blue', name: 'Facebook Classic Blue', hex: '#1877F2' },
    { id: 'cyan', name: 'Cyber Cyan', hex: '#06B6D4' },
    { id: 'emerald', name: 'Emerald Security', hex: '#10B981' },
    { id: 'violet', name: 'Royal Violet', hex: '#8B5CF6' },
    { id: 'amber', name: 'Amber Sunset', hex: '#F59E0B' }
  ];

  const handleRequestPush = async () => {
    playSound('click', themeConfig.soundEnabled);
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('AutoMod FB đã kích hoạt thông báo đẩy!', {
          body: 'Bạn sẽ nhận được cảnh báo ngay lập tức khi phát hiện số điện thoại hoặc từ khóa nhạy cảm.',
          icon: '/favicon.ico'
        });
        setPushStatus('Đã cấp quyền thông báo đẩy thành công trên trình duyệt này!');
        playSound('success', themeConfig.soundEnabled);
      } else {
        setPushStatus('Quyền thông báo bị từ chối trong cài đặt trình duyệt.');
      }
    } else {
      setPushStatus('Trình duyệt không hỗ trợ Web Notification API.');
    }
    setTimeout(() => setPushStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-500" />
          <span>{lang === 'vi' ? 'Tùy Chỉnh Giao Diện & Trải Nghiệm Người Dùng' : 'Appearance & Personalization'}</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
          {lang === 'vi'
            ? 'Cá nhân hóa giao diện làm việc theo phong cách riêng của bạn, bao gồm chế độ sáng/tối, màu chủ đạo thương hiệu, âm thanh phản hồi và thông báo đẩy thời gian thực.'
            : 'Customize workspace themes, accent palettes, interaction audio, and notification triggers.'}
        </p>
      </div>

      {pushStatus && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{pushStatus}</span>
        </div>
      )}

      {/* Theme Mode & Accent Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark / Light Mode */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Chế độ màu hiển thị (Dark / Light Theme)
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setThemeConfig(prev => ({ ...prev, mode: 'light' }));
                playSound('toggle', themeConfig.soundEnabled);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                themeConfig.mode === 'light'
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-neutral-900'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Chế độ Sáng (Light)</span>
              </div>
              {themeConfig.mode === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => {
                setThemeConfig(prev => ({ ...prev, mode: 'dark' }));
                playSound('toggle', themeConfig.soundEnabled);
              }}
              className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                themeConfig.mode === 'dark'
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 text-neutral-100'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold">Chế độ Tối (Dark Mode)</span>
              </div>
              {themeConfig.mode === 'dark' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
            </button>
          </div>
        </div>

        {/* Brand Accent Color */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Màu sắc chủ đạo (Accent Color)
          </h2>

          <div className="space-y-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setThemeConfig(prev => ({ ...prev, accentColor: c.id }));
                  playSound('click', themeConfig.soundEnabled);
                }}
                className={`w-full p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                  themeConfig.accentColor === c.id
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800'
                    : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    style={{ backgroundColor: c.hex }}
                    className="w-4 h-4 rounded-full shadow-xs"
                  />
                  <span>{c.name}</span>
                </div>
                {themeConfig.accentColor === c.id && <CheckCircle2 className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sounds, Push Notifications & Density */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sound Feedback */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-bold text-xs uppercase tracking-wider mb-1">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span>Âm Thanh Phản Hồi Khi Click</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Hiệu ứng âm thanh tinh tế khi bấm nút, thông báo cảnh báo và ẩn comment.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-medium">Bật âm thanh Web Audio</span>
            <button
              onClick={() => {
                const next = !themeConfig.soundEnabled;
                setThemeConfig(prev => ({ ...prev, soundEnabled: next }));
                playSound('toggle', next);
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                themeConfig.soundEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  themeConfig.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-bold text-xs uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-rose-500" />
              <span>Thông Báo Đẩy Trình Duyệt</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Bật thông báo đẩy native trên máy tính/điện thoại ngay khi có từ khóa nhạy cảm.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              onClick={handleRequestPush}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>Kích hoạt quyền thông báo</span>
            </button>
          </div>
        </div>

        {/* Scan Frequency */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-bold text-xs uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Tần Suất Quét Bình Luận</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Thời gian chu kỳ đồng bộ với Facebook Graph Webhook.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
            <select
              value={themeConfig.autoScanInterval}
              onChange={(e) => {
                setThemeConfig(prev => ({ ...prev, autoScanInterval: Number(e.target.value) }));
                playSound('toggle', themeConfig.soundEnabled);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-semibold"
            >
              <option value="3">3 giây (Siêu tốc - Khuyên dùng)</option>
              <option value="5">5 giây (Tiêu chuẩn)</option>
              <option value="10">10 giây (Tiết kiệm tài nguyên)</option>
              <option value="30">30 giây</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

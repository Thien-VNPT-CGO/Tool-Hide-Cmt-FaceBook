import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { BackupPoint, Language } from '../../types';
import { playSound } from '../../services/sound';

interface BackupTabProps {
  backupPoints: BackupPoint[];
  lang: Language;
  soundEnabled: boolean;
  onCreateBackup: () => void;
  onRestoreBackup: (pointId: string) => void;
  onImportBackupJson: (jsonData: string) => void;
}

export const BackupTab: React.FC<BackupTabProps> = ({
  backupPoints,
  lang,
  soundEnabled,
  onCreateBackup,
  onRestoreBackup,
  onImportBackupJson
}) => {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const handleManualBackup = () => {
    onCreateBackup();
    playSound('success', soundEnabled);
    setBackupNotice('Đã tạo điểm sao lưu dữ liệu toàn hệ thống thành công!');
    setTimeout(() => setBackupNotice(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackupJson(content);
        playSound('success', soundEnabled);
        setBackupNotice('Đã khôi phục toàn bộ cấu hình từ file JSON!');
        setTimeout(() => setBackupNotice(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Sao Lưu Tự Động & Khôi Phục Dữ Liệu' : 'Daily Backup & Fast Restore'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono font-semibold">
              Daily Auto-Sync
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Tự động sao lưu toàn bộ cấu hình từ khóa, danh sách UID đen, token và nhật ký kiểm duyệt mỗi ngày. Khôi phục nhanh chỉ với 1 cú nhấp chuột.'
              : 'Automated daily snapshots and fast 1-click restore mechanism.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualBackup}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Tạo bản sao lưu ngay' : 'Instant Backup'}</span>
          </button>
        </div>
      </div>

      {backupNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{backupNotice}</span>
        </div>
      )}

      {/* Auto Backup Setting Card */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Lập lịch sao lưu tự động hàng ngày (03:00 Sáng)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Hệ thống sẽ tự động lưu trữ 1 snapshot đám mây vào lúc 03:00 mỗi ngày để đảm bảo an toàn nếu có sự cố.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setAutoBackupEnabled(!autoBackupEnabled);
            playSound('toggle', soundEnabled);
          }}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            autoBackupEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              autoBackupEnabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Restore Points History */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Điểm Khôi Phục Dữ Liệu (Restore Points)</span>
          </h2>

          <label className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Nạp file sao lưu (.JSON)</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>

        <div className="space-y-3">
          {backupPoints.map((point) => (
            <div
              key={point.id}
              className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100">{point.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1 font-mono">
                  <span>{new Date(point.timestamp).toLocaleString('vi-VN')}</span>
                  <span>·</span>
                  <span>{point.sizeKb} KB</span>
                  <span>·</span>
                  <span>{point.ruleCount} bộ lọc</span>
                  <span>·</span>
                  <span>{point.commentCount} cmt</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRestoreBackup(point.id);
                    playSound('success', soundEnabled);
                    setBackupNotice(`Đã hoàn tất khôi phục hệ thống về điểm "${point.title}"!`);
                    setTimeout(() => setBackupNotice(null), 3500);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Khôi phục điểm này</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Share2,
  FileText,
  Mail
} from 'lucide-react';
import { AdCampaign, CommentItem, FilterRule, Language } from '../../types';
import { playSound } from '../../services/sound';

interface ReportsTabProps {
  comments: CommentItem[];
  campaigns: AdCampaign[];
  rules: FilterRule[];
  lang: Language;
  soundEnabled: boolean;
  onOpenPrintModal: () => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  comments,
  campaigns,
  rules,
  lang,
  soundEnabled,
  onOpenPrintModal
}) => {
  const [dateRange, setDateRange] = useState('7d');
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleEmail, setScheduleEmail] = useState('nguyenthanhthien.dev.1602@gmail.com');
  const [exportedNotice, setExportedNotice] = useState<string | null>(null);

  // Generate Excel / CSV with UTF-8 BOM
  const handleExportExcel = () => {
    playSound('click', soundEnabled);

    // CSV Header
    const headers = [
      'ID Bình Luận',
      'Người Dùng',
      'Facebook UID',
      'Bài Viết',
      'Chiến Dịch Ads',
      'Nội Dung Bình Luận',
      'Trạng Thái',
      'Lý Do Ẩn',
      'Chứa SĐT',
      'AI Đánh Giá Spam (%)',
      'Thời Gian'
    ];

    const rows = comments.map((c) => [
      c.id,
      `"${c.authorName.replace(/"/g, '""')}"`,
      `"${c.authorId}"`,
      `"${c.postTitle.replace(/"/g, '""')}"`,
      `"${c.campaignName || 'Organic Post'}"`,
      `"${c.message.replace(/"/g, '""')}"`,
      c.status === 'hidden' ? 'Đã Ẩn' : c.status === 'deleted' ? 'Đã Xóa' : 'Hiển Thị',
      `"${c.hiddenReason || ''}"`,
      c.containsPhone ? 'Có' : 'Không',
      c.aiConfidence ? `${Math.round(c.aiConfidence * 100)}%` : '0%',
      new Date(c.createdAt).toLocaleString('vi-VN')
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Quan_Ly_Comment_FB_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    playSound('success', soundEnabled);
    setExportedNotice('Đã xuất file Excel / CSV thành công (Hỗ trợ chuẩn tiếng Việt trên MS Excel).');
    setTimeout(() => setExportedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Xuất Báo Cáo & Phân Tích Định Kỳ' : 'Reports & Data Export'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
              PDF / Excel
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Xuất báo cáo chi tiết về hiệu quả quản lý bình luận, danh sách các SĐT được bảo vệ và tỉ lệ vi phạm từng chiến dịch quảng cáo.'
              : 'Export executive summaries and raw moderation data in PDF and Excel formats.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Xuất File Excel (.xlsx / .csv)' : 'Export Excel (.xlsx)'}</span>
          </button>

          <button
            onClick={() => {
              onOpenPrintModal();
              playSound('click', soundEnabled);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'vi' ? 'In / Xuất PDF Báo Cáo' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {exportedNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportedNotice}</span>
        </div>
      )}

      {/* Date Filter & Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-medium">Khung thời gian phân tích</p>
          <div className="mt-3 flex items-center gap-1">
            {['today', '7d', '30d', 'all'].map((period) => (
              <button
                key={period}
                onClick={() => setDateRange(period)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dateRange === period
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {period === 'today' ? 'Hôm nay' : period === '7d' ? '7 ngày' : period === '30d' ? '30 ngày' : 'Toàn thời gian'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-medium">Thời gian kiểm duyệt tiết kiệm</p>
          <p className="mt-2 text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            ~ 46.5 giờ
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Tương đương 2 nhân sự trực fanpage 24/7
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <p className="text-xs text-neutral-500 font-medium">Độ chính xác bộ lọc</p>
          <p className="mt-2 text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            99.6%
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            Dựa trên 1.250 quyết định kiểm duyệt
          </p>
        </div>
      </div>

      {/* Scheduled Reports Configuration */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{lang === 'vi' ? 'Lập Lịch Gửi Báo Cáo Tự Động Định Kỳ' : 'Automated Report Dispatcher'}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Hệ thống sẽ tự động tổng hợp số liệu và gửi file Excel / PDF vào cuối ngày lúc 23:59.
            </p>
          </div>

          <button
            onClick={() => {
              setScheduleEnabled(!scheduleEnabled);
              playSound('toggle', soundEnabled);
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              scheduleEnabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                scheduleEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Email người nhận báo cáo định kỳ
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={scheduleEmail}
                onChange={(e) => setScheduleEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Tần suất gửi
            </label>
            <select
              defaultValue="daily"
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="daily">Hàng ngày (Mỗi tối lúc 23:59)</option>
              <option value="weekly">Hàng tuần (Chủ nhật 23:59)</option>
              <option value="monthly">Hàng tháng (Ngày cuối cùng của tháng)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

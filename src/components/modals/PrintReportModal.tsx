import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AdCampaign, CommentItem, FilterRule, Language } from '../../types';
import { playSound } from '../../services/sound';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: CommentItem[];
  campaigns: AdCampaign[];
  rules: FilterRule[];
  lang: Language;
  soundEnabled: boolean;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  comments,
  campaigns,
  rules,
  lang,
  soundEnabled
}) => {
  if (!isOpen) return null;

  const totalComments = comments.length;
  const hiddenCount = comments.filter(c => c.status === 'hidden').length;
  const phoneCount = comments.filter(c => c.containsPhone).length;
  const spamCount = comments.filter(c => c.isSpamAI).length;
  const totalProtectedValue = phoneCount * 500000;

  const handlePrint = () => {
    playSound('click', soundEnabled);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in print:p-0 print:bg-white">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative print:shadow-none print:border-none print:max-w-none print:w-full print:p-4 text-neutral-900 dark:text-neutral-100">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-bold">Xem Trước Báo Cáo In / Lưu PDF</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Ngay / Lưu PDF</span>
            </button>
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
        </div>

        {/* Printable Paper Content */}
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 border-neutral-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">
                BÁO CÁO HIỆU QUẢ QUẢN LÝ BÌNH LUẬN & FACEBOOK ADS
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Hệ thống AutoMod FB Enterprise · Xuất lúc: {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-blue-600 font-mono">BẢN CHÍNH THỨC</span>
              <p className="text-neutral-500">Mã BC: RPT-2026-OCT</p>
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              <p className="text-[11px] text-neutral-500">Tổng cmt quét</p>
              <p className="text-lg font-bold font-mono text-neutral-900">{totalComments}</p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              <p className="text-[11px] text-neutral-500">Đã ẩn vi phạm</p>
              <p className="text-lg font-bold font-mono text-rose-600">{hiddenCount}</p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              <p className="text-[11px] text-neutral-500">SĐT bảo vệ</p>
              <p className="text-lg font-bold font-mono text-emerald-600">{phoneCount} leads</p>
            </div>
            <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
              <p className="text-[11px] text-neutral-500">Giá trị giữ được</p>
              <p className="text-base font-bold font-mono text-amber-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalProtectedValue)}
              </p>
            </div>
          </div>

          {/* Campaigns Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              1. Hiệu Quả Bảo Vệ Trên Từng Chiến Dịch Ads
            </h3>
            <table className="w-full text-xs text-left border border-neutral-200">
              <thead className="bg-neutral-100 text-neutral-700">
                <tr>
                  <th className="p-2 border">Chiến dịch</th>
                  <th className="p-2 border text-right">Chi phí</th>
                  <th className="p-2 border text-right">Tổng cmt</th>
                  <th className="p-2 border text-right">Đã ẩn</th>
                  <th className="p-2 border text-right">SĐT bảo vệ</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td className="p-2 border font-medium">{camp.name}</td>
                    <td className="p-2 border text-right font-mono">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(camp.spend)}
                    </td>
                    <td className="p-2 border text-right font-mono">{camp.totalComments}</td>
                    <td className="p-2 border text-right font-mono font-semibold text-rose-600">{camp.hiddenComments}</td>
                    <td className="p-2 border text-right font-mono font-bold text-emerald-600">{camp.leadsProtected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs text-neutral-600">
            <div>
              <p className="font-semibold">Người lập báo cáo</p>
              <p className="mt-12 font-medium">Nguyễn Thành Thiện</p>
              <p className="text-[10px] text-neutral-400">Super Admin / Tech Lead</p>
            </div>
            <div>
              <p className="font-semibold">Đại diện kiểm duyệt Facebook</p>
              <p className="mt-12 font-medium">AutoMod FB Engine v21.0</p>
              <p className="text-[10px] text-emerald-600 font-mono">Xác thực điện tử 100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

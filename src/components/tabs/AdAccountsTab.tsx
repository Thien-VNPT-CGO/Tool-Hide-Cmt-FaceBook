import React, { useState } from 'react';
import {
  Target,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  EyeOff,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { AdCampaign, Language } from '../../types';
import { playSound } from '../../services/sound';

interface AdAccountsTabProps {
  campaigns: AdCampaign[];
  lang: Language;
  soundEnabled: boolean;
}

export const AdAccountsTab: React.FC<AdAccountsTabProps> = ({
  campaigns,
  lang,
  soundEnabled
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalComments = campaigns.reduce((acc, c) => acc + c.totalComments, 0);
  const totalHidden = campaigns.reduce((acc, c) => acc + c.hiddenComments, 0);
  const totalProtectedLeads = campaigns.reduce((acc, c) => acc + c.leadsProtected, 0);
  const totalProtectedValue = campaigns.reduce((acc, c) => acc + c.estimatedProtectedValue, 0);

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleSyncAds = () => {
    setIsSyncing(true);
    playSound('click', soundEnabled);
    setTimeout(() => {
      setIsSyncing(false);
      playSound('success', soundEnabled);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Bảo Vệ Tài Khoản Facebook Ads & Chiến Dịch' : 'Facebook Ads Protection Console'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono font-semibold">
              act_8492019482019
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Tự động kiểm soát tất cả bài viết đang chạy quảng cáo trả phí (Dark Post & Page Post). Ngăn chặn thất thoát data SĐT và phá giá của đối thủ trong thời gian thực.'
              : 'Direct integration with Facebook Ads Manager for automated dark post protection.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAds}
            disabled={isSyncing}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
            <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ từ Ads Manager'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Ads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Tổng ngân sách ads đã chi</span>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
            {formatVnd(totalSpend)}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">4 chiến dịch đang kết nối</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Data khách hàng bảo vệ</span>
            <PhoneCall className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {totalProtectedLeads} leads
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Ẩn ngay khi vừa xuất hiện
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Doanh thu giữ lại ước tính</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {formatVnd(totalProtectedValue)}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Tránh rơi vào tay đối thủ</p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>Hệ số đòn bẩy bảo vệ (ROI)</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            x{((totalProtectedValue / (totalSpend || 1))).toFixed(1)} lần
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Bảo toàn hiệu quả chi phí ads</p>
        </div>
      </div>

      {/* Campaigns Detailed Grid */}
      <div className="space-y-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {camp.name}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    camp.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {camp.status === 'active' ? 'Đang chạy phân phối' : 'Tạm dừng'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                  <span className="font-mono">Campaign ID: {camp.campaignId}</span>
                  <span>·</span>
                  <span>Nhóm QC: {camp.adSet}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div>
                  <p className="text-[11px] text-neutral-400">Ngân sách/ngày</p>
                  <p className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {formatVnd(camp.dailyBudget)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Tổng tương tác</p>
                  <p className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {camp.totalComments} cmt
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">Đã ẩn vi phạm</p>
                  <p className="text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                    {camp.hiddenComments} ({Math.round((camp.hiddenComments / camp.totalComments) * 100)}%)
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-400">SĐT được bảo vệ</p>
                  <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {camp.leadsProtected} SĐT
                  </p>
                </div>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Bình luận khách hàng an toàn ({camp.totalComments - camp.hiddenComments})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Đã ẩn tự động ({camp.hiddenComments})
                </span>
              </div>

              <div className="text-xs font-medium text-amber-600 dark:text-amber-400 font-mono">
                Giá trị bảo tồn: {formatVnd(camp.estimatedProtectedValue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import {
  ShieldAlert,
  MessageSquare,
  PhoneCall,
  Flame,
  ArrowUpRight,
  Sparkles,
  Zap,
  TrendingUp,
  EyeOff,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { AdCampaign, CommentItem, FilterRule, Language } from '../../types';
import { playSound } from '../../services/sound';

interface DashboardTabProps {
  comments: CommentItem[];
  campaigns: AdCampaign[];
  rules: FilterRule[];
  lang: Language;
  soundEnabled: boolean;
  onUnhideComment: (id: string) => void;
  onHideComment: (id: string) => void;
  onInjectTestComment: (type: 'phone' | 'competitor' | 'spam' | 'normal') => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  comments,
  campaigns,
  rules,
  lang,
  soundEnabled,
  onUnhideComment,
  onHideComment,
  onInjectTestComment,
  setActiveTab
}) => {
  const totalComments = comments.length;
  const hiddenComments = comments.filter(c => c.status === 'hidden');
  const deletedComments = comments.filter(c => c.status === 'deleted');
  const flaggedComments = comments.filter(c => c.status === 'flagged');
  const phoneLeadsSaved = comments.filter(c => c.containsPhone).length;
  const spamCount = comments.filter(c => c.isSpamAI).length;
  
  // Calculate total protected revenue across campaigns (average value 500k/lead)
  const estimatedRevenueSaved = phoneLeadsSaved * 500000;

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Fast Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-blue-950/30 dark:via-neutral-900 dark:to-neutral-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Bảng Điều Khiển Quản Trị Tương Tác & Ads' : 'Ads & Moderation Dashboard'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold font-mono">
              Graph v21.0
            </span>
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            {lang === 'vi'
              ? 'Hệ thống tự động quét và ẩn comment vi phạm ngay lập tức trong 110ms. Bảo vệ data khách hàng, chặn đối thủ chèo kéo cướp đơn và duy trì điểm chất lượng quảng cáo Facebook.'
              : 'Real-time 110ms auto-hiding engine. Protect leads against poaching, filter competitors and offensive remarks.'}
          </p>
        </div>

        {/* Quick Simulation triggers */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="text-[11px] text-neutral-500 font-medium mr-1 hidden sm:block">
            {lang === 'vi' ? 'Thử nghiệm bắn comment:' : 'Test triggers:'}
          </div>
          <button
            onClick={() => {
              onInjectTestComment('phone');
              playSound('alert', soundEnabled);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-sm flex items-center gap-1.5"
            title="Mô phỏng khách để lại SĐT -> Hệ thống ẩn tức thì"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '+ Thử SĐT' : '+ Phone Test'}</span>
          </button>

          <button
            onClick={() => {
              onInjectTestComment('competitor');
              playSound('alert', soundEnabled);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors shadow-sm flex items-center gap-1.5"
            title="Mô phỏng đối thủ vào comment phá giá"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '+ Thử Đối Thủ' : '+ Competitor'}</span>
          </button>

          <button
            onClick={() => {
              onInjectTestComment('normal');
              playSound('click', soundEnabled);
            }}
            className="px-2.5 py-1.5 text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '+ Comment Sạch' : '+ Clean'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Scanned */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>{lang === 'vi' ? 'Tổng bình luận quét' : 'Total Comments'}</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {totalComments}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18/h
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Tốc độ phản hồi' : 'Latency'}</span>
            <span className="font-mono tabular-nums text-emerald-600 font-medium">110ms</span>
          </div>
        </div>

        {/* Card 2: Auto-Hidden */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>{lang === 'vi' ? 'Bình luận đã ẩn tự động' : 'Auto-Hidden'}</span>
            <EyeOff className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {hiddenComments.length}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              ({totalComments > 0 ? Math.round((hiddenComments.length / totalComments) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Xóa hoàn toàn' : 'Deleted'}</span>
            <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300 font-medium">
              {deletedComments.length} bình luận
            </span>
          </div>
        </div>

        {/* Card 3: Protected Leads */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>{lang === 'vi' ? 'SĐT cướp khách được cứu' : 'Leads Protected'}</span>
            <PhoneCall className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {phoneLeadsSaved}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% cứu thành công</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Tránh lộ đối thủ' : 'Poach prevention'}</span>
            <span className="font-mono tabular-nums text-emerald-600 font-medium">0s trễ</span>
          </div>
        </div>

        {/* Card 4: Est. Revenue Preserved */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-medium">
            <span>{lang === 'vi' ? 'Giá trị bảo vệ ước tính' : 'Protected Value'}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {formatVnd(estimatedRevenueSaved)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>{lang === 'vi' ? 'Dựa trên đòn bẩy đơn' : 'Avg. lead value'}</span>
            <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300 font-medium">500.000₫ / đơn</span>
          </div>
        </div>
      </div>

      {/* Middle Layout: Activity Timeline Chart & Protection Rule Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Visual Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {lang === 'vi' ? 'Biểu Đồ Lọc Bình Luận Theo Giờ (24h Qua)' : 'Comment Moderation Volume (24h)'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {lang === 'vi' ? 'Tần suất xuất hiện bình luận và số lượng bị ẩn tức thời' : 'Incoming vs auto-hidden velocity'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                {lang === 'vi' ? 'Tổng tương tác' : 'Total'}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                {lang === 'vi' ? 'Đã ẩn vi phạm' : 'Hidden'}
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            {[
              { time: '08:00', total: 18, hidden: 4 },
              { time: '10:00', total: 32, hidden: 9 },
              { time: '12:00', total: 54, hidden: 18 },
              { time: '14:00', total: 42, hidden: 11 },
              { time: '16:00', total: 68, hidden: 24 },
              { time: '18:00', total: 85, hidden: 31 },
              { time: '20:00', total: 110, hidden: 42 },
              { time: '22:00', total: 76, hidden: 20 },
            ].map((bar, idx) => {
              const maxVal = 120;
              const totalHeight = (bar.total / maxVal) * 100;
              const hiddenHeight = (bar.hidden / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 bg-neutral-900 text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg font-mono">
                    {bar.time}: {bar.total} quét / {bar.hidden} ẩn
                  </div>

                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                    {/* Total bar */}
                    <div
                      style={{ height: `${totalHeight}%` }}
                      className="w-1/2 bg-blue-500/80 hover:bg-blue-600 rounded-t transition-all"
                    ></div>
                    {/* Hidden bar */}
                    <div
                      style={{ height: `${hiddenHeight}%` }}
                      className="w-1/2 bg-rose-500 hover:bg-rose-600 rounded-t transition-all"
                    ></div>
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-2 font-mono">{bar.time}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>{lang === 'vi' ? 'Bảo vệ bài viết ads cao điểm: 18h - 22h' : 'Peak ad protection hours: 18h - 22h'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              {lang === 'vi' ? 'Tỷ lệ chặn chuẩn xác: 99.4%' : 'Precision: 99.4%'}
            </span>
          </div>
        </div>

        {/* Right 1 Col: Rule Trigger Categories */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {lang === 'vi' ? 'Quy Tắc Kích Hoạt Nhiều Nhất' : 'Top Triggered Rules'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'vi' ? 'Phân loại các loại vi phạm tự động' : 'Triggered rule categories'}
            </p>

            <div className="mt-4 space-y-3.5">
              {rules.map((rule) => {
                const percent = Math.min(100, Math.round((rule.matchCount / 400) * 100));
                return (
                  <div key={rule.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-2 max-w-[200px]">
                        {rule.name}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500 shrink-0 font-semibold">
                        {rule.matchCount} lượt
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${
                          rule.severity === 'critical'
                            ? 'bg-rose-500'
                            : rule.severity === 'high'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
            <button
              onClick={() => {
                setActiveTab('rules');
                playSound('click', soundEnabled);
              }}
              className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>{lang === 'vi' ? 'Cấu hình thêm bộ lọc từ khóa' : 'Manage Keyword Rules'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ad Campaigns Table */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {lang === 'vi' ? 'Hiệu Quả Bảo Vệ Tài Khoản Facebook Ads' : 'Facebook Ads Protection Performance'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'vi' ? 'Chi tiết số bình luận và data khách hàng được bảo vệ trên từng chiến dịch' : 'Campaign level protection breakdown'}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('ad_accounts');
              playSound('click', soundEnabled);
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{lang === 'vi' ? 'Xem chi tiết tất cả chiến dịch' : 'View All Campaigns'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-y border-neutral-200 dark:border-neutral-700/60">
              <tr>
                <th className="py-2.5 px-3 font-semibold">{lang === 'vi' ? 'Chiến dịch Quảng cáo' : 'Campaign Name'}</th>
                <th className="py-2.5 px-3 font-semibold">{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{lang === 'vi' ? 'Ngân sách / ngày' : 'Daily Budget'}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{lang === 'vi' ? 'Tổng cmt' : 'Total Comments'}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{lang === 'vi' ? 'Đã ẩn vi phạm' : 'Auto-Hidden'}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{lang === 'vi' ? 'SĐT bảo vệ' : 'Leads Saved'}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{lang === 'vi' ? 'Giá trị giữ được' : 'Preserved Value'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{camp.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">ID: {camp.campaignId}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      camp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                      {camp.status === 'active' ? (lang === 'vi' ? 'Đang chạy' : 'Active') : (lang === 'vi' ? 'Tạm dừng' : 'Paused')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                    {formatVnd(camp.dailyBudget)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-neutral-900 dark:text-neutral-100">
                    {camp.totalComments}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-rose-600 dark:text-rose-400">
                    {camp.hiddenComments}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                    {camp.leadsProtected}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
                    {formatVnd(camp.estimatedProtectedValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Live Moderation Feed */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {lang === 'vi' ? 'Nhật Ký Xử Lý Bình Luận Vừa Diễn Ra' : 'Recent Moderation Stream'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'vi' ? 'Các bình luận mới nhất được xử lý qua Facebook Graph API' : 'Latest processed actions'}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab('comments');
              playSound('click', soundEnabled);
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{lang === 'vi' ? 'Xem toàn bộ bình luận' : 'View Full Stream'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {comments.slice(0, 4).map((cmt) => (
            <div
              key={cmt.id}
              className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={cmt.authorAvatar}
                  alt={cmt.authorName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                      {cmt.authorName}
                    </span>
                    <span className="text-[11px] text-neutral-400">·</span>
                    <span className="text-[11px] text-neutral-500 truncate max-w-[220px]">
                      {cmt.postTitle}
                    </span>
                    <span className="text-[11px] text-neutral-400">·</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(cmt.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 line-clamp-2">
                    {cmt.message}
                  </p>
                  {cmt.hiddenReason && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{cmt.hiddenReason}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {cmt.status === 'hidden' ? (
                  <button
                    onClick={() => {
                      onUnhideComment(cmt.id);
                      playSound('toggle', soundEnabled);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors flex items-center gap-1 border border-neutral-200 dark:border-neutral-700"
                  >
                    <Eye className="w-3 h-3 text-neutral-500" />
                    <span>{lang === 'vi' ? 'Bỏ ẩn' : 'Unhide'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onHideComment(cmt.id);
                      playSound('delete', soundEnabled);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-900/60"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>{lang === 'vi' ? 'Ẩn ngay' : 'Hide'}</span>
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

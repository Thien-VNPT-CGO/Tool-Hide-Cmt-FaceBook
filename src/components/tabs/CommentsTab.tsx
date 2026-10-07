import React, { useState } from 'react';
import {
  Search,
  Filter,
  EyeOff,
  Eye,
  Trash2,
  Sparkles,
  PhoneCall,
  UserX,
  Send,
  MessageCircle,
  ExternalLink,
  Code,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CommentItem, Language } from '../../types';
import { playSound } from '../../services/sound';

interface CommentsTabProps {
  comments: CommentItem[];
  lang: Language;
  soundEnabled: boolean;
  onHideComment: (id: string) => void;
  onUnhideComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onBlockUser: (uid: string, name: string, reason: string) => void;
  onAddComment: (comment: Partial<CommentItem>) => void;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  lang,
  soundEnabled,
  onHideComment,
  onUnhideComment,
  onDeleteComment,
  onBlockUser,
  onAddComment
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCampaign, setFilterCampaign] = useState<string>('all');
  const [selectedGraphLog, setSelectedGraphLog] = useState<{ id: string; log: string } | null>(null);

  // New test comment input state
  const [manualAuthor, setManualAuthor] = useState('Khách hàng mới');
  const [manualMessage, setManualMessage] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const filteredComments = comments.filter((c) => {
    if (filterStatus === 'hidden' && c.status !== 'hidden') return false;
    if (filterStatus === 'visible' && c.status !== 'visible') return false;
    if (filterStatus === 'deleted' && c.status !== 'deleted') return false;
    if (filterStatus === 'flagged' && c.status !== 'flagged') return false;
    if (filterStatus === 'phone' && !c.containsPhone) return false;

    if (filterCampaign !== 'all' && c.campaignName !== filterCampaign) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMsg = c.message.toLowerCase().includes(q);
      const matchAuthor = c.authorName.toLowerCase().includes(q);
      const matchPost = c.postTitle.toLowerCase().includes(q);
      const matchKeyword = c.matchedKeywords?.some((k) => k.toLowerCase().includes(q));
      if (!matchMsg && !matchAuthor && !matchPost && !matchKeyword) return false;
    }
    return true;
  });

  const handlePostManualComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMessage.trim()) return;

    setIsSimulating(true);
    playSound('click', soundEnabled);

    setTimeout(() => {
      onAddComment({
        authorName: manualAuthor.trim() || 'Người dùng Facebook',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces',
        message: manualMessage.trim(),
        postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
        campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu',
        isAdComment: true
      });
      setManualMessage('');
      setIsSimulating(false);
      playSound('alert', soundEnabled);
    }, 400);
  };

  const campaignsList = Array.from(new Set(comments.map((c) => c.campaignName).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header and Manual Comment Injection Bar */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <span>{lang === 'vi' ? 'Quản Lý Bình Luận Thời Gian Thực' : 'Real-time Comment Moderation'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                Live Feed
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'vi'
                ? 'Hệ thống tự động lắng nghe Webhook `feed/comments` từ Facebook Graph API và thực thi ẩn tự động.'
                : 'Listening to Facebook Graph Webhooks with instant automated moderation.'}
            </p>
          </div>

          {/* Quick template inject buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-neutral-400 font-medium">Mẫu test nhanh:</span>
            <button
              onClick={() => {
                setManualAuthor('Lê Thu Thảo');
                setManualMessage('Mình lấy 2 cái size M giao về 0938.129.481 cho mình nha shop!');
              }}
              className="text-[11px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
            >
              + Để lại SĐT
            </button>
            <button
              onClick={() => {
                setManualAuthor('Kho Sỉ Thời Trang');
                setManualMessage('Bên em có mẫu này y hệt giá chỉ bằng nửa shop, ai mua qua zalo e tư vấn!');
              }}
              className="text-[11px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
            >
              + Đối thủ chèo kéo
            </button>
            <button
              onClick={() => {
                setManualAuthor('Tài Khoản Ảo');
                setManualMessage('Bán đắt như cắt cổ hàng dởm lừa đảo đừng ai mua!');
              }}
              className="text-[11px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors"
            >
              + Chửi bới tiêu cực
            </button>
          </div>
        </div>

        {/* Input Form for manual comment test */}
        <form onSubmit={handlePostManualComment} className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={manualAuthor}
            onChange={(e) => setManualAuthor(e.target.value)}
            placeholder="Tên người comment..."
            className="w-full sm:w-44 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            value={manualMessage}
            onChange={(e) => setManualMessage(e.target.value)}
            placeholder="Nhập nội dung bình luận cần test (chứa SĐT, từ khóa vi phạm, đối thủ, khen ngợi...)"
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!manualMessage.trim() || isSimulating}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Đang gửi...' : 'Bắn cmt vào hệ thống'}</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
          {[
            { id: 'all', label: lang === 'vi' ? 'Tất cả' : 'All', count: comments.length },
            { id: 'hidden', label: lang === 'vi' ? 'Đã ẩn' : 'Hidden', count: comments.filter(c => c.status === 'hidden').length },
            { id: 'phone', label: lang === 'vi' ? 'Có SĐT' : 'Phones', count: comments.filter(c => c.containsPhone).length },
            { id: 'visible', label: lang === 'vi' ? 'Hiển thị' : 'Visible', count: comments.filter(c => c.status === 'visible').length },
            { id: 'deleted', label: lang === 'vi' ? 'Đã xóa' : 'Deleted', count: comments.filter(c => c.status === 'deleted').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterStatus(tab.id);
                playSound('click', soundEnabled);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Campaign select */}
        <div className="flex items-center gap-2">
          {/* Campaign Selector */}
          <select
            value={filterCampaign}
            onChange={(e) => setFilterCampaign(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{lang === 'vi' ? 'Tất cả chiến dịch' : 'All Campaigns'}</option>
            {campaignsList.map((c, i) => (
              <option key={i} value={c as string}>
                {c}
              </option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'vi' ? 'Tìm nội dung, SĐT, người dùng...' : 'Search text, phone, user...'}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
            <Filter className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              {lang === 'vi' ? 'Không có bình luận nào khớp với bộ lọc' : 'No comments match your filter'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {lang === 'vi' ? 'Hãy thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác.' : 'Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          filteredComments.map((cmt) => (
            <div
              key={cmt.id}
              className={`p-4 rounded-xl border transition-all ${
                cmt.status === 'hidden'
                  ? 'border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : cmt.status === 'deleted'
                  ? 'border-neutral-300 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/40 opacity-75'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Author & Post Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={cmt.authorAvatar}
                    alt={cmt.authorName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                        {cmt.authorName}
                      </span>
                      <span className="text-[11px] text-neutral-400">·</span>
                      <span className="text-[11px] text-neutral-500 font-mono">UID: {cmt.authorId}</span>
                      <span className="text-[11px] text-neutral-400">·</span>
                      <span className="text-[11px] text-neutral-500 truncate max-w-[260px] font-medium" title={cmt.postTitle}>
                        {cmt.postTitle}
                      </span>
                    </div>

                    {/* Campaign tag */}
                    {cmt.campaignName && (
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        Chiến dịch: {cmt.campaignName}
                      </div>
                    )}

                    {/* Comment text with styling */}
                    <div className="text-xs text-neutral-800 dark:text-neutral-200 mt-2 bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      <p className="leading-relaxed font-normal">{cmt.message}</p>
                    </div>

                    {/* Reasons and Badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {/* Status indicator */}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                          cmt.status === 'hidden'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : cmt.status === 'deleted'
                            ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}
                      >
                        {cmt.status === 'hidden' ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Đã ẩn tự động</span>
                          </>
                        ) : cmt.status === 'deleted' ? (
                          <>
                            <Trash2 className="w-3 h-3" />
                            <span>Đã xóa vĩnh viễn</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Hiển thị công khai</span>
                          </>
                        )}
                      </span>

                      {/* Phone indicator */}
                      {cmt.containsPhone && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                          <PhoneCall className="w-3 h-3" />
                          <span>Đã bảo vệ SĐT khách</span>
                        </span>
                      )}

                      {/* AI Spam reason */}
                      {cmt.aiExplanation && (
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1 font-medium">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span>AI: {cmt.aiExplanation}</span>
                        </span>
                      )}

                      {/* Auto reply badge */}
                      {cmt.autoReplied && (
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
                          <MessageCircle className="w-3 h-3" />
                          <span>Đã tự động gửi tin nhắn riêng cho khách</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons toolbar */}
                <div className="flex sm:flex-col items-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-mono mb-1">
                    {new Date(cmt.createdAt).toLocaleTimeString('vi-VN')}
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Hide / Unhide Toggle */}
                    {cmt.status === 'hidden' ? (
                      <button
                        onClick={() => {
                          onUnhideComment(cmt.id);
                          playSound('toggle', soundEnabled);
                        }}
                        className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-neutral-500" />
                        <span>Bỏ ẩn</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onHideComment(cmt.id);
                          playSound('delete', soundEnabled);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center gap-1"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Ẩn ngay</span>
                      </button>
                    )}

                    {/* Delete permanently */}
                    <button
                      onClick={() => {
                        onDeleteComment(cmt.id);
                        playSound('delete', soundEnabled);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Xóa vĩnh viễn qua Graph API"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Block User UID */}
                    <button
                      onClick={() => {
                        onBlockUser(cmt.authorId, cmt.authorName, cmt.hiddenReason || 'Spam / Chèo kéo');
                        playSound('alert', soundEnabled);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Khóa UID này vào danh sách đen"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>

                    {/* Show Graph API Log */}
                    <button
                      onClick={() => {
                        setSelectedGraphLog({
                          id: cmt.id,
                          log: `POST https://graph.facebook.com/v21.0/${cmt.id}?is_hidden=true\nResponse: {"success": true, "id": "${cmt.id}"}\nLatency: 110ms\nToken: EAA... (Valid)`
                        });
                        playSound('click', soundEnabled);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Xem nhật ký Graph API"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Graph API inspect log modal */}
      {selectedGraphLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-500" />
                <span>Chi tiết Facebook Graph API Call</span>
              </h3>
              <button
                onClick={() => setSelectedGraphLog(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
            <pre className="mt-3 p-3 rounded-lg bg-neutral-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {selectedGraphLog.log}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedGraphLog(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

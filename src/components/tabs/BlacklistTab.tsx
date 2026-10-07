import React, { useState } from 'react';
import {
  Users,
  UserX,
  Plus,
  Trash2,
  ShieldCheck,
  Search,
  Eye,
  ExternalLink,
  Upload
} from 'lucide-react';
import { BlacklistedUser, Language } from '../../types';
import { playSound } from '../../services/sound';

interface BlacklistTabProps {
  blacklist: BlacklistedUser[];
  lang: Language;
  soundEnabled: boolean;
  onAddUser: (user: Omit<BlacklistedUser, 'id' | 'totalCommentsBlocked' | 'addedAt'>) => void;
  onRemoveUser: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const BlacklistTab: React.FC<BlacklistTabProps> = ({
  blacklist,
  lang,
  soundEnabled,
  onAddUser,
  onRemoveUser,
  onToggleStatus
}) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUid, setNewUid] = useState('');
  const [newName, setNewName] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newStatus, setNewStatus] = useState<'blocked' | 'watching'>('blocked');

  const filtered = blacklist.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return b.name.toLowerCase().includes(q) || b.fbUid.includes(q) || b.reason.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim() || !newName.trim()) return;

    onAddUser({
      fbUid: newUid.trim(),
      name: newName.trim(),
      reason: newReason.trim() || 'Tài khoản có hành vi quấy rối / cướp khách',
      addedBy: 'Admin Nguyễn Thành Thiện',
      status: newStatus
    });

    setNewUid('');
    setNewName('');
    setNewReason('');
    setShowAddForm(false);
    playSound('success', soundEnabled);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Danh Sách Đen Tài Khoản & UID Facebook' : 'Blacklisted Facebook UIDs'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-mono font-semibold">
              {blacklist.length} tài khoản chặn
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Tự động phát hiện và chặn bình luận từ các UID đối thủ, nick clone seeding, bot lừa đảo đã bị nhận diện.'
              : 'Block comments automatically from targeted competitor UIDs or malicious bots.'}
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            playSound('click', soundEnabled);
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 shrink-0"
        >
          <UserX className="w-4 h-4" />
          <span>{lang === 'vi' ? '+ Thêm UID vào danh sách đen' : '+ Add UID to Blacklist'}</span>
        </button>
      </div>

      {/* Add User Form Drawer/Card */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-rose-200 dark:border-rose-950/80 bg-rose-50/20 dark:bg-rose-950/10 space-y-3 animate-in fade-in">
          <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            {lang === 'vi' ? 'Thêm tài khoản Facebook cần chặn' : 'Add New Blacklisted Account'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Facebook UID (ID tài khoản) *
              </label>
              <input
                type="text"
                required
                value={newUid}
                onChange={(e) => setNewUid(e.target.value)}
                placeholder="Ví dụ: 100084920491823"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Tên hiển thị hoặc ghi chú đối thủ *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Shop X Phá Giá (Clone 1)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Chế độ xử lý
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as 'blocked' | 'watching')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="blocked">Khóa & Ẩn tự động ngay lập tức</option>
                <option value="watching">Đang theo dõi (Cảnh báo quản trị viên)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
              Lý do đưa vào danh sách đen
            </label>
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Ví dụ: Rải link shop đối thủ, chửi bới khách hàng trong bài ads..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              Xác nhận thêm
            </button>
          </div>
        </form>
      )}

      {/* Search and Table */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo UID, tên đối thủ hoặc lý do..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-y border-neutral-200 dark:border-neutral-700/60">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tài khoản & UID</th>
                <th className="py-2.5 px-3 font-semibold">Lý do chặn</th>
                <th className="py-2.5 px-3 font-semibold">Trạng thái</th>
                <th className="py-2.5 px-3 font-semibold text-right">Số lần đã chặn</th>
                <th className="py-2.5 px-3 font-semibold">Người thêm</th>
                <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                      <span>UID: {user.fbUid}</span>
                      <a
                        href={`https://facebook.com/${user.fbUid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300 max-w-xs">
                    {user.reason}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => {
                        onToggleStatus(user.id);
                        playSound('toggle', soundEnabled);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                        user.status === 'blocked'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'blocked' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      <span>{user.status === 'blocked' ? 'Đã khóa tự động' : 'Đang theo dõi'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-rose-600 dark:text-rose-400">
                    {user.totalCommentsBlocked} lần
                  </td>
                  <td className="py-3 px-3 text-neutral-500 text-[11px]">
                    <p>{user.addedBy}</p>
                    <p className="text-[10px] text-neutral-400">{new Date(user.addedAt).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onRemoveUser(user.id);
                        playSound('delete', soundEnabled);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Gỡ khỏi danh sách đen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

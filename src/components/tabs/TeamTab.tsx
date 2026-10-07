import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Plus,
  Trash2,
  Mail,
  UserX,
  CheckCircle2
} from 'lucide-react';
import { Language, TeamMember, UserRole } from '../../types';
import { playSound } from '../../services/sound';

interface TeamTabProps {
  team: TeamMember[];
  lang: Language;
  soundEnabled: boolean;
  onAddMember: (member: Omit<TeamMember, 'id' | 'addedAt' | 'lastActive'>) => void;
  onChangeRole: (id: string, newRole: UserRole) => void;
  onRemoveMember: (id: string) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({
  team,
  lang,
  soundEnabled,
  onAddMember,
  onChangeRole,
  onRemoveMember
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('moderator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddMember({
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      status: 'active'
    });

    setName('');
    setEmail('');
    setShowAddForm(false);
    playSound('success', soundEnabled);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">Super Admin</span>;
      case 'moderator':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">Kiểm Duyệt Viên</span>;
      case 'ads_manager':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">Quản Lý Ads</span>;
      case 'viewer':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">Chỉ Xem / Báo Cáo</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{lang === 'vi' ? 'Hệ Thống Phân Quyền Quản Trị Viên (RBAC)' : 'Team & Access Roles'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-mono font-semibold">
              {team.length} thành viên
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
            {lang === 'vi'
              ? 'Phân quyền chặt chẽ giữa Quản trị viên tối cao, Nhân viên kiểm duyệt trực ca, Chuyên viên tối ưu Ads và Nhà phân tích dữ liệu.'
              : 'Flexible role-based access control for team members and external agencies.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'vi' ? '+ Mời thành viên mới' : '+ Invite Member'}</span>
        </button>
      </div>

      {/* Add Member Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-blue-200 dark:border-blue-950/80 bg-blue-50/20 dark:bg-blue-950/10 space-y-3 animate-in fade-in">
          <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            {lang === 'vi' ? 'Thêm thành viên vào hệ thống kiểm duyệt' : 'Add New Team Member'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Hoàng Thu Trang"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Email công việc *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thutrang@automod.vn"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                Vai trò phân quyền
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              >
                <option value="moderator">Kiểm Duyệt Viên (Ẩn/Hiện comment)</option>
                <option value="ads_manager">Chuyên viên Ads (Xem bài QC & SĐT)</option>
                <option value="viewer">Báo cáo viên (Chỉ xem và xuất file)</option>
                <option value="super_admin">Super Admin (Toàn quyền)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white"
            >
              Gửi lời mời tham gia
            </button>
          </div>
        </form>
      )}

      {/* Team Members List */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-y border-neutral-200 dark:border-neutral-700/60">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Thành viên</th>
                <th className="py-2.5 px-3 font-semibold">Vai trò</th>
                <th className="py-2.5 px-3 font-semibold">Hoạt động gần nhất</th>
                <th className="py-2.5 px-3 font-semibold">Trạng thái</th>
                <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{member.name}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {getRoleBadge(member.role)}
                  </td>
                  <td className="py-3 px-3 text-neutral-500 font-mono text-[11px]">
                    {member.lastActive}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {member.role !== 'super_admin' && (
                      <button
                        onClick={() => {
                          onRemoveMember(member.id);
                          playSound('delete', soundEnabled);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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

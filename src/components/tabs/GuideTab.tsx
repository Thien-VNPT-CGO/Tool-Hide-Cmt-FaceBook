import React, { useState } from 'react';
import {
  BookOpen,
  KeyRound,
  ShieldAlert,
  Webhook,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Copy,
  Terminal,
  Server,
  UserCheck,
  CheckSquare,
  Square,
  Download,
  AlertTriangle,
  Sparkles,
  Lock
} from 'lucide-react';
import { Language } from '../../types';
import { playSound } from '../../services/sound';

interface GuideTabProps {
  lang: Language;
  soundEnabled: boolean;
}

export const GuideTab: React.FC<GuideTabProps> = ({ lang, soundEnabled }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    step1: true,
    step2: true,
    step3: false,
    step4: false,
    step5: false,
    step6: false
  });
  const [activeSopTab, setActiveSopTab] = useState<'deploy' | 'onboard' | 'token_guide'>('onboard');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    playSound('toggle', soundEnabled);
  };

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    playSound('success', soundEnabled);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const completedSteps = Object.values(checklist).filter(Boolean).length;
  const totalSteps = Object.keys(checklist).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const faqs = [
    {
      q: '1. Làm thế nào để lấy Token Facebook vĩnh viễn không bao giờ hết hạn?',
      a: 'Bạn vào Meta Business Suite (business.facebook.com) > Cài đặt doanh nghiệp > Người dùng hệ thống (System Users) > Tạo người dùng hệ thống mới > Gán tài sản Trang (Fanpage) với quyền "Quản lý Trang toàn quyền" > Bấm "Tạo mã truy cập mới", chọn thời hạn "Vĩnh viễn (Không bao giờ hết hạn)" và tích chọn các quyền: pages_manage_posts, pages_read_engagement, pages_manage_engagement, ads_management.'
    },
    {
      q: '2. Ẩn bình luận tự động bằng Tool này có bị Facebook phạt hoặc khóa Fanpage không?',
      a: 'Hoàn toàn KHÔNG! Ứng dụng sử dụng Facebook Graph API chính thức được Meta cấp phép (Endpoint POST /{comment_id} với tham số is_hidden=true). Đây là tính năng chuẩn của Facebook dành cho các doanh nghiệp để quản lý tương tác và chăm sóc khách hàng, không sử dụng cookie hay tool lậu giả lập nên đảm bảo an toàn 100% cho Fanpage và tài khoản quảng cáo.'
    },
    {
      q: '3. Khi ẩn bình luận thì khách hàng và đối thủ sẽ nhìn thấy bài viết như thế nào?',
      a: 'Theo cơ chế của Facebook: Người để lại bình luận và bạn bè của họ vẫn nhìn thấy bình luận đó như bình thường (khách không biết mình bị ẩn). Nhưng đối thủ và người lạ lướt vào bài viết sẽ HOÀN TOÀN KHÔNG NHÌN THẤY bình luận đó. Nhờ vậy đối thủ không thể cướp số điện thoại của bạn, đồng thời khách hàng không bị cảm giác khó chịu!'
    },
    {
      q: '4. Tool có hoạt động được trên cả bài viết quảng cáo ẩn (Dark Post / Lead Form) không?',
      a: 'Có! Hệ thống hỗ trợ quét cả bài viết công khai trên Fanpage lẫn các bài viết quảng cáo ẩn (Dark Post Ads) được tạo trong Trình quản lý quảng cáo (Ads Manager).'
    },
    {
      q: '5. Làm sao để chia sẻ quyền cho nhân viên trực ca mà không sợ lộ Token chính?',
      a: 'Bạn vào mục "Phân quyền QTV", gán vai trò "Kiểm duyệt viên" (Moderator) cho nhân viên. Nhân viên này chỉ có quyền xem dòng comment, duyệt ẩn/bỏ ẩn bình luận mà không được xem hay chỉnh sửa mã Token Facebook bí mật.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>{lang === 'vi' ? 'Quy Trình Triển Khai & Bàn Giao Từ A-Z' : 'System Deployment & Onboarding SOP'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
              SOP Chuẩn Doanh Nghiệp
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {lang === 'vi'
              ? 'Tài liệu hướng dẫn triển khai kỹ thuật hạ tầng và các bước bàn giao tài khoản cho từng nhân sự / chi nhánh kinh doanh.'
              : 'Complete technical setup guide and standard operating procedures for new team members.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveSopTab('onboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSopTab === 'onboard'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            📋 Bàn Giao Tài Khoản
          </button>
          <button
            onClick={() => setActiveSopTab('token_guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSopTab === 'token_guide'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            🔑 Lấy Token Vĩnh Viễn
          </button>
          <button
            onClick={() => setActiveSopTab('deploy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSopTab === 'deploy'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            💻 Triển Khai Server
          </button>
        </div>
      </div>

      {/* Interactive Onboarding Checklist Progress Bar */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Checklist Bàn Giao Tài Khoản Mới (6 Bước Chuẩn)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tích chọn từng mục để đảm bảo hệ thống đã hoạt động an toàn trước khi chạy Ads.
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {progressPercent}% Hoàn tất
            </span>
            <p className="text-[11px] text-neutral-400 font-mono">
              {completedSteps}/{totalSteps} bước
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          />
        </div>

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              id: 'step1',
              title: 'Bước 1: Cấp quyền Admin & Nhập Page Access Token',
              desc: 'Vào tab "Kết nối Token FB", dán mã Token EAA... và bấm "Kiểm tra quyền".'
            },
            {
              id: 'step2',
              title: 'Bước 2: Kích hoạt Gói Bộ Lọc Từ Khóa Tiêu Chuẩn',
              desc: 'Vào tab "Bộ lọc từ khóa", bấm áp dụng gói "Chống lộ SĐT" & "Chống đối thủ phá giá".'
            },
            {
              id: 'step3',
              title: 'Bước 3: Thêm các UID Đối Thủ Vào Danh Sách Đen',
              desc: 'Vào tab "Danh sách đen UID", nhập các tài khoản nick clone hay vào spam bài viết.'
            },
            {
              id: 'step4',
              title: 'Bước 4: Bật Bảo Mật 2FA Cho Quản Trị Viên',
              desc: 'Vào tab "Bảo mật 2FA", quét mã Google Authenticator và lưu mã khôi phục.'
            },
            {
              id: 'step5',
              title: 'Bước 5: Thử Nghiệm Bắn Comment Giả Lập',
              desc: 'Vào "Tổng quan Ads", bấm nút "+ Thử SĐT" để kiểm tra hệ thống ẩn trong 110ms.'
            },
            {
              id: 'step6',
              title: 'Bước 6: Cấu Hình Webhook Bắn Về Pancake / Telegram',
              desc: 'Vào tab "API & Webhooks", dán URL webhook để nhận thông báo SĐT khách hàng.'
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                checklist[item.id]
                  ? 'border-emerald-200 dark:border-emerald-950/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="mt-0.5 shrink-0 text-emerald-600">
                {checklist[item.id] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-neutral-400" />
                )}
              </div>
              <div>
                <p className={`font-semibold ${checklist[item.id] ? 'text-emerald-900 dark:text-emerald-300' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {item.title}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tab Detail Views */}
      {activeSopTab === 'onboard' && (
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span>Quy Trình Bàn Giao Cho Tài Khoản Nhân Viên & Chi Nhánh (SOP Chi Tiết)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Áp dụng khi cấp tài khoản mới cho Nhân viên trực ca, Trưởng nhóm Marketing hoặc Đối tác chạy Ads.
            </p>
          </div>

          <div className="space-y-5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {/* Step A */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono">A</span>
                <span>Phân Quyền Vai Trò Theo Vị Trí Công Việc</span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Không cấp quyền Super Admin cho nhân viên thông thường để tránh rủi ro xóa dữ liệu:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong>Kiểm Duyệt Viên (Moderator):</strong> Dành cho nhân viên trực fanpage. Quyền: Xem dòng comment, bỏ ẩn nếu nhầm lẫn, thêm UID vào blacklist.</li>
                <li><strong>Quản Lý Ads (Ads Specialist):</strong> Dành cho media buyer. Quyền: Xem báo cáo chiến dịch, xem số lượng SĐT được bảo vệ và tỷ lệ rủi ro.</li>
                <li><strong>Chỉ Xem / Báo Cáo (Viewer):</strong> Dành cho kế toán / giám đốc. Quyền: Xem bảng điều khiển và xuất file Excel / PDF.</li>
              </ul>
            </div>

            {/* Step B */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono">B</span>
                <span>Quy Tắc Xử Lý Khi Khách Hàng Bị Ẩn Nhầm</span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                Nếu khách hàng khen hoặc bình luận chứa số giống SĐT (ví dụ: "size 09"):
              </p>
              <p className="text-[11px]">
                1. Nhân viên vào tab <strong>"Dòng bình luận"</strong> &gt; Chọn bộ lọc <strong>"Đã ẩn"</strong>.<br />
                2. Tìm bình luận đó và bấm nút <strong>"Bỏ ẩn"</strong> (Icon con mắt).<br />
                3. Bình luận sẽ lập tức hiển thị công khai trở lại trên Facebook qua Graph API trong vòng 0.2 giây.
              </p>
            </div>

            {/* Step C */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-xs mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-mono">C</span>
                <span>Sao Lưu & Bàn Giao Ca Trực</span>
              </h3>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Cuối mỗi ca làm việc lúc 22:00, Trưởng ca vào tab <strong>"Báo cáo & Xuất file"</strong> &gt; Bấm <strong>"Xuất File Excel"</strong> để gửi file danh sách SĐT khách hàng tiềm năng cho bộ phận Telesale gọi điện chốt đơn.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeSopTab === 'token_guide' && (
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-5">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Hướng Dẫn Lấy Token Facebook Vĩnh Viễn Không Bị Checkpoint (Từ A-Z)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Khuyên dùng System User Token (Người dùng hệ thống) từ Meta Business Suite thay vì Token tài khoản cá nhân.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center shrink-0 font-mono text-xs">
                1
              </div>
              <div>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Truy cập Trình quản lý kinh doanh (Meta Business Suite)</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Đăng nhập vào <a href="https://business.facebook.com/settings" target="_blank" rel="noreferrer" className="text-blue-600 underline">business.facebook.com/settings</a> &gt; Vào mục <strong>Người dùng hệ thống (System Users)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center shrink-0 font-mono text-xs">
                2
              </div>
              <div>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Thêm người dùng hệ thống mới</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Đặt tên: <code>AutoMod FB Bot</code>. Vai trò: <strong>Quản trị viên (Admin)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center shrink-0 font-mono text-xs">
                3
              </div>
              <div>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Gán tài sản Trang (Fanpage)</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Bấm "Thêm tài sản" &gt; Chọn Trang bạn muốn ẩn comment &gt; Bật toàn bộ công tắc <strong>"Quản lý Trang toàn quyền"</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center shrink-0 font-mono text-xs">
                4
              </div>
              <div>
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Tạo mã truy cập (Generate Token) vĩnh viễn</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Chọn thời hạn: <strong>Vĩnh viễn (Never Expires)</strong>. Tích chọn các quyền sau:
                </p>
                <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] text-neutral-800 dark:text-neutral-200 mt-2 space-y-1">
                  <p>✓ pages_manage_posts</p>
                  <p>✓ pages_read_engagement</p>
                  <p>✓ pages_manage_engagement</p>
                  <p>✓ ads_management</p>
                  <p>✓ read_insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSopTab === 'deploy' && (
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-500" />
              <span>Hướng Dẫn Triển Khai Trọn Gói 100% Trên Render (All-in-One Fullstack)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Chỉ cần duy nhất 1 Web Service trên Render: Máy chủ Node.js phục vụ đồng thời cả giao diện web React và hệ thống Webhook / Graph API Facebook. Không cần cài đặt Vercel, không lo lỗi CORS!
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="p-4 rounded-xl bg-neutral-950 text-white font-mono text-xs space-y-2">
            <p className="text-emerald-400 font-bold">MÔ HÌNH TRỌN GÓI TRÊN RENDER:</p>
            <p className="text-neutral-300">
              👉 Domain duy nhất: <code>https://automod-fb-app.onrender.com</code>
            </p>
            <p className="text-neutral-300">
              • Giao diện web người dùng: <code>https://automod-fb-app.onrender.com/</code> (React SPA)
            </p>
            <p className="text-neutral-300">
              • Endpoint nhận Webhook Facebook: <code>https://automod-fb-app.onrender.com/webhook</code>
            </p>
            <p className="text-neutral-300">
              • Kiểm tra trạng thái máy chủ: <code>https://automod-fb-app.onrender.com/api/health</code>
            </p>
          </div>

          {/* Step 1: Render Web Service */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Tạo Web Service Trên Render.com</span>
            </h3>
            <div className="space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-7">
              <p>1. Đăng nhập <strong>dashboard.render.com</strong> &gt; Bấm <strong>"New +"</strong> &gt; Chọn <strong>"Web Service"</strong>.</p>
              <p>2. Kết nối kho mã nguồn GitHub của bạn.</p>
              <p>3. Thiết lập chính xác 4 mục sau:</p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                <li>Name: <code>automod-fb-app</code></li>
                <li>Region: <code>Singapore</code> (gần Việt Nam, tốc độ phản hồi nhanh nhất)</li>
                <li>Runtime: <code>Node</code></li>
                <li>Build Command: <code>npm install && npm run build</code></li>
                <li>Start Command: <code>node server.mjs</code></li>
              </ul>
              <p>4. Thêm các biến môi trường (Environment Variables) trong Render:</p>
              <pre className="p-3 rounded-lg bg-neutral-950 text-emerald-400 font-mono text-[11px] leading-relaxed">
{`PORT=10000
FB_VERIFY_TOKEN=automod_fb_secret_token_2026
GEMINI_API_KEY=YOUR_GEMINI_KEY`}
              </pre>
              <p>5. Bấm <strong>"Create Web Service"</strong>. Render sẽ tự động build Vite frontend và máy chủ Node.js vào cùng 1 cổng!</p>
            </div>
          </div>

          {/* Step 2: Facebook Webhook */}
          <div className="space-y-3 text-xs pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Cấu Hình Webhook Trên Meta for Developers</span>
            </h3>
            <div className="space-y-2 text-neutral-600 dark:text-neutral-400 leading-relaxed pl-7">
              <p>1. Vào <strong>developers.facebook.com/apps</strong> &gt; Chọn ứng dụng của bạn.</p>
              <p>2. Vào mục <strong>Webhooks</strong> &gt; Chọn đối tượng <strong>Page (Trang)</strong> &gt; Bấm <strong>"Subscribe to this object"</strong>.</p>
              <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                <li>Callback URL: <code>https://automod-fb-app.onrender.com/webhook</code></li>
                <li>Verify Token: <code>automod_fb_secret_token_2026</code></li>
              </ul>
              <p>3. Trong danh sách sự kiện Trang, tích chọn đăng ký: <code>feed</code>.</p>
              <p>4. Hoàn tất! Giờ đây khi có bình luận trên Facebook, Render sẽ nhận ngay lập tức, tự động ẩn vi phạm và hiển thị trên giao diện web của bạn.</p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Accordion */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span>Câu Hỏi Thường Gặp & Xử Lý Sự Cố (FAQ & Troubleshooting)</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => {
                  setActiveFaq(activeFaq === idx ? null : idx);
                  playSound('click', soundEnabled);
                }}
                className="w-full text-left p-3.5 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between transition-colors text-xs font-semibold text-neutral-900 dark:text-neutral-100"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeFaq === idx && (
                <div className="p-3.5 bg-white dark:bg-neutral-900 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

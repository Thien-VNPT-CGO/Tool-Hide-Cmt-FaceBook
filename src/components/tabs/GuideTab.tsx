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
  Copy
} from 'lucide-react';
import { Language } from '../../types';
import { playSound } from '../../services/sound';

interface GuideTabProps {
  lang: Language;
  soundEnabled: boolean;
}

export const GuideTab: React.FC<GuideTabProps> = ({ lang, soundEnabled }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
      q: '5. Hệ thống có tự động gửi tin nhắn riêng cho khách khi họ để lại số điện thoại không?',
      a: 'Có! Bạn có thể bật tính năng "Tự động phản hồi tin nhắn riêng" trong phần Bộ Lọc Từ Khóa. Ngay khi ẩn bình luận lộ SĐT, hệ thống sẽ tự động inbox vào Messenger của khách để nhân viên tư vấn chốt đơn ngay lập tức.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span>{lang === 'vi' ? 'Tài Liệu Hướng Dẫn Sử Dụng & Tối Ưu Hệ Thống' : 'Documentation & Setup Guide'}</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
          {lang === 'vi'
            ? 'Cẩm nang chi tiết từ A-Z cách kết nối Facebook Graph API, thiết lập bộ từ khóa chống cướp đơn và kinh nghiệm chạy ads hiệu quả.'
            : 'Step-by-step setup guide and best practices for Facebook Ads moderation.'}
        </p>
      </div>

      {/* Guide Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-bold flex items-center justify-center text-sm font-mono mb-3">
            01
          </div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Lấy Token Facebook
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Sử dụng <strong>Graph API Explorer</strong> hoặc <strong>System User Token</strong> từ Trình quản lý doanh nghiệp để cấp mã truy cập vĩnh viễn cho Page.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold flex items-center justify-center text-sm font-mono mb-3">
            02
          </div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Cài Đặt Bộ Từ Khóa
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Chọn gói mẫu từ khóa có sẵn (chặn SĐT, phá giá, link spam) hoặc tự thêm các từ khóa đặc thù theo sản phẩm của shop bạn.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 font-bold flex items-center justify-center text-sm font-mono mb-3">
            03
          </div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Bật Auto-Scan & Báo Cáo
          </h2>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Bật nút <strong>Auto-Scan BẬT</strong> trên thanh công cụ. Hệ thống sẽ trực 24/7, ẩn comment trong 110ms và tự động xuất báo cáo hàng ngày.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span>Câu Hỏi Thường Gặp (FAQ)</span>
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

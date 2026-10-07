import {
  CommentItem,
  FilterRule,
  BlacklistedUser,
  AdCampaign,
  FbPageAccount,
  NotificationItem,
  TeamMember,
  WebhookConfig,
  ApiKeyItem,
  BackupPoint,
  SecuritySettings,
  ThemeConfig
} from '../types';

const STORAGE_KEY_PREFIX = 'automod_fb_';

// Initial Fanpage accounts
export const initialPages: FbPageAccount[] = [
  {
    id: 'page-1',
    pageId: '104859201948271',
    name: 'Thời Trang Thiết Kế Mina Official',
    category: 'Cửa hàng quần áo nữ & Phụ kiện cao cấp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    tokenStatus: 'valid',
    tokenExpiresAt: '2026-12-31T23:59:59Z',
    connectedAt: '2026-03-01T10:00:00Z',
    permissions: ['pages_read_engagement', 'pages_manage_posts', 'pages_manage_engagement', 'ads_management']
  },
  {
    id: 'page-2',
    pageId: '294820194810239',
    name: 'Gia Dụng Thông Minh ZenHome',
    category: 'Đồ gia dụng & Thiết bị nhà bếp thông minh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    tokenStatus: 'valid',
    tokenExpiresAt: '2026-11-20T23:59:59Z',
    connectedAt: '2026-03-10T14:30:00Z',
    permissions: ['pages_read_engagement', 'pages_manage_posts', 'pages_manage_engagement']
  },
  {
    id: 'page-3',
    pageId: '394810294819283',
    name: 'Viện Thẩm Mỹ & Skincare GlowSkin',
    category: 'Spa làm đẹp & Trị liệu da chuyên sâu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces',
    tokenStatus: 'valid',
    tokenExpiresAt: '2026-12-15T23:59:59Z',
    connectedAt: '2026-03-15T09:15:00Z',
    permissions: ['pages_read_engagement', 'pages_manage_posts', 'pages_manage_engagement', 'ads_management']
  }
];

// Initial Rules
export const initialRules: FilterRule[] = [
  {
    id: 'rule-phone',
    name: 'Tự động ẩn Số Điện Thoại khách (Tránh cướp đơn)',
    category: 'phone_leak',
    keywords: ['03', '05', '07', '08', '09', '+84', 'sđt', 'sdt', 'zalo'],
    isRegex: true,
    action: 'hide',
    autoReplyMessage: 'Dạ shop đã gửi tin nhắn riêng cho bạn rồi ạ! Bạn kiểm tra hộp thư chờ nhé ❤️',
    enabled: true,
    matchCount: 384,
    createdAt: '2026-02-10T08:00:00Z',
    severity: 'critical'
  },
  {
    id: 'rule-competitor',
    name: 'Chặn đối thủ chào mời & phá giá',
    category: 'competitor_price',
    keywords: ['bên em có', 'bên em bán rẻ', 'shop mình rẻ hơn', 'inbox e có sẵn', 'sỉ giá gốc', 'qua link em mua'],
    isRegex: false,
    action: 'hide',
    enabled: true,
    matchCount: 142,
    createdAt: '2026-02-12T10:15:00Z',
    severity: 'critical'
  },
  {
    id: 'rule-profanity',
    name: 'Ẩn bình luận chửi tục, lừa đảo, phá hoại thương hiệu',
    category: 'profanity',
    keywords: ['lừa đảo', 'đắt như cắt cổ', 'hàng dởm', 'hàng đểu', 'đm', 'vcl', 'treo đầu dê', 'bán đắt', 'tẩy chay'],
    isRegex: false,
    action: 'hide',
    enabled: true,
    matchCount: 96,
    createdAt: '2026-02-15T11:20:00Z',
    severity: 'high'
  },
  {
    id: 'rule-spam-links',
    name: 'Xóa spam link cờ bạc, lừa đảo tuyển CTV online',
    category: 'spam_link',
    keywords: ['tuyển ctv', 'việc làm tại nhà', 't.me/', 'zalo.me/', 'kiếm tiền 500k', 'tải app', 'nạp thẻ'],
    isRegex: true,
    action: 'delete',
    enabled: true,
    matchCount: 78,
    createdAt: '2026-02-18T14:40:00Z',
    severity: 'critical'
  },
  {
    id: 'rule-negative',
    name: 'Cảnh báo bình luận phàn nàn dịch vụ giao hàng chậm',
    category: 'negative_review',
    keywords: ['giao chậm', 'chưa thấy hàng', 'thất vọng', 'hư hỏng', 'đổi trả', 'lâu quá'],
    isRegex: false,
    action: 'flag_review',
    enabled: true,
    matchCount: 51,
    createdAt: '2026-02-22T09:30:00Z',
    severity: 'medium'
  }
];

// Initial Blacklisted Users
export const initialBlacklist: BlacklistedUser[] = [
  {
    id: 'bl-1',
    fbUid: '100084920491823',
    name: 'Trần Văn Tuấn (Seeder Phá Giá)',
    reason: 'Chuyên spam link shop đối thủ cướp khách dưới bài ads đầm dạ hội',
    totalCommentsBlocked: 34,
    addedAt: '2026-03-02T11:20:00Z',
    addedBy: 'Admin Nguyễn Thiên',
    status: 'blocked'
  },
  {
    id: 'bl-2',
    fbUid: '100092837401928',
    name: 'Lê Hoàng Long (Bot CTV Lừa Đảo)',
    reason: 'Rải link Telegram việc làm ảo kiếm 500k/ngày',
    totalCommentsBlocked: 59,
    addedAt: '2026-03-05T15:10:00Z',
    addedBy: 'Hệ thống AI Tự Động',
    status: 'blocked'
  },
  {
    id: 'bl-3',
    fbUid: '100048102948201',
    name: 'Phạm Thị Thảo (Nghi vấn đối thủ)',
    reason: 'Tài khoản thường xuyên comment "đắt thế" và thả phẫn nộ',
    totalCommentsBlocked: 12,
    addedAt: '2026-03-12T16:45:00Z',
    addedBy: 'Kiểm duyệt viên Mai',
    status: 'watching'
  }
];

// Initial Ad Campaigns
export const initialCampaigns: AdCampaign[] = [
  {
    id: 'camp-1',
    campaignId: '23859201948201928',
    name: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu - Chuyển Đổi Mess',
    adSet: 'Nữ 22-38 Hà Nội & HCM - Thời Trang Công Sở',
    dailyBudget: 2500000,
    spend: 18450000,
    totalComments: 680,
    hiddenComments: 194,
    leadsProtected: 142,
    estimatedProtectedValue: 71000000,
    status: 'active'
  },
  {
    id: 'camp-2',
    campaignId: '23859201948201933',
    name: 'Camp 2: Nồi Chiên Không Dầu Điện Tử 8L - Flash Sale 49%',
    adSet: 'Gia đình 25-50 Toàn Quốc - Thích Nấu Ăn',
    dailyBudget: 4000000,
    spend: 32600000,
    totalComments: 1240,
    hiddenComments: 312,
    leadsProtected: 218,
    estimatedProtectedValue: 109000000,
    status: 'active'
  },
  {
    id: 'camp-3',
    campaignId: '23859201948201945',
    name: 'Camp 3: Combo Serum Cấp Ẩm Phục Hồi B5 GlowSkin',
    adSet: 'Nữ 18-35 - Quan tâm Skincare & Mỹ phẩm Hàn',
    dailyBudget: 1500000,
    spend: 12300000,
    totalComments: 410,
    hiddenComments: 89,
    leadsProtected: 67,
    estimatedProtectedValue: 33500000,
    status: 'active'
  },
  {
    id: 'camp-4',
    campaignId: '23859201948201958',
    name: 'Camp 4: Áo Blazer Tweed Xu Hướng Hàn Quốc 2026',
    adSet: 'Nữ 20-32 - Mua sắm trực tuyến',
    dailyBudget: 1000000,
    spend: 7800000,
    totalComments: 290,
    hiddenComments: 64,
    leadsProtected: 45,
    estimatedProtectedValue: 22500000,
    status: 'paused'
  }
];

// Initial Comments
export const initialComments: CommentItem[] = [
  {
    id: 'cmt-101',
    postId: 'post-1001',
    postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
    authorId: 'fb-user-9812',
    authorName: 'Nguyễn Thị Hương',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces',
    message: 'Shop ơi mình lấy mẫu đầm màu đỏ size L nhé, ship về địa chỉ: 0918.423.891 gọi trước giúp mình',
    createdAt: '2026-10-06T20:25:00Z',
    status: 'hidden',
    hiddenReason: 'Lộ Số Điện Thoại Khách (Tự động ẩn sau 110ms)',
    matchedRuleId: 'rule-phone',
    matchedKeywords: ['0918.423.891'],
    isSpamAI: true,
    aiConfidence: 0.99,
    aiExplanation: 'Chứa SĐT khách hàng tiềm năng. Đã ẩn tức thì và tự động gửi tin nhắn xác nhận đơn.',
    containsPhone: true,
    isAdComment: true,
    campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu',
    autoReplied: true
  },
  {
    id: 'cmt-102',
    postId: 'post-1001',
    postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
    authorId: '100084920491823',
    authorName: 'Trần Văn Tuấn (Seeder)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces',
    message: 'Mẫu này bên em bán rẻ hơn shop nửa giá nè, ai mua sỉ lẻ qua zalo em gửi mẫu chuẩn y chang nhé',
    createdAt: '2026-10-06T20:21:00Z',
    status: 'hidden',
    hiddenReason: 'Đối thủ chèo kéo cướp khách & phá giá',
    matchedRuleId: 'rule-competitor',
    matchedKeywords: ['bên em bán rẻ', 'zalo em'],
    isSpamAI: true,
    aiConfidence: 0.97,
    aiExplanation: 'Tài khoản UID nằm trong danh sách đen + phát hiện hành vi cướp khách từ đối thủ.',
    isAdComment: true,
    campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
  },
  {
    id: 'cmt-103',
    postId: 'post-1002',
    postTitle: 'Nồi Chiên Không Dầu Điện Tử Dung Tích Lớn 8L - Công Nghệ Đối Lưu Rapid Air',
    authorId: 'fb-user-3829',
    authorName: 'Phạm Hồng Ánh',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
    message: 'Tư vấn giúp mình nhé, bảo hành bao lâu vậy shop? Có được kiểm tra hàng trước khi thanh toán không ạ?',
    createdAt: '2026-10-06T20:18:00Z',
    status: 'visible',
    isSpamAI: false,
    aiConfidence: 0.05,
    aiExplanation: 'Khách hàng quan tâm sản phẩm chính hãng, tương tác tự nhiên, an toàn.',
    isAdComment: true,
    campaignName: 'Camp 2: Nồi Chiên Không Dầu 8L'
  },
  {
    id: 'cmt-104',
    postId: 'post-1002',
    postTitle: 'Nồi Chiên Không Dầu Điện Tử Dung Tích Lớn 8L - Công Nghệ Đối Lưu Rapid Air',
    authorId: '100092837401928',
    authorName: 'Lê Hoàng Long',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
    message: 'Tuyển CTV làm việc tại nhà thu nhập 500k-1tr/ngày, tham gia nhóm t.me/vieclamnhanh nhận lì xì ngay',
    createdAt: '2026-10-06T20:14:00Z',
    status: 'deleted',
    hiddenReason: 'Spam link độc hại / tuyển CTV ảo (Đã xóa vĩnh viễn)',
    matchedRuleId: 'rule-spam-links',
    matchedKeywords: ['tuyển ctv', 't.me/'],
    isSpamAI: true,
    aiConfidence: 0.99,
    aiExplanation: 'Nội dung spam lừa đảo rải link tuyển dụng Telegram, tài khoản bot.',
    isAdComment: true,
    campaignName: 'Camp 2: Nồi Chiên Không Dầu 8L'
  },
  {
    id: 'cmt-105',
    postId: 'post-1001',
    postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
    authorId: 'fb-user-5512',
    authorName: 'Hoàng Minh Thư',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces',
    message: 'Vải lụa này có bị nhăn khi giặt máy không ạ? Có size cho người 62kg cao 1m58 không shop?',
    createdAt: '2026-10-06T20:09:00Z',
    status: 'visible',
    isSpamAI: false,
    aiConfidence: 0.04,
    aiExplanation: 'Câu hỏi tư vấn size chuẩn, bình luận chất lượng cho điểm tương tác bài viết.',
    isAdComment: true,
    campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu'
  },
  {
    id: 'cmt-106',
    postId: 'post-1003',
    postTitle: 'Serum Dưỡng Trắng & Tái Tạo Làn Da GlowSkin - Hiệu Quả Sau 14 Ngày',
    authorId: 'fb-user-7731',
    authorName: 'Vũ Đức Mạnh',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces',
    message: 'Bán đắt như cắt cổ lừa đảo người mua hàng dởm, mua về xài ngứa hết mặt đừng ai mua!',
    createdAt: '2026-10-06T19:55:00Z',
    status: 'hidden',
    hiddenReason: 'Từ ngữ xúc phạm, tố cáo không căn cứ (Đã ẩn ngay lập tức)',
    matchedRuleId: 'rule-profanity',
    matchedKeywords: ['bán đắt', 'lừa đảo', 'hàng dởm'],
    isSpamAI: true,
    aiConfidence: 0.95,
    aiExplanation: 'Công kích ác ý tiêu cực, dùng từ khóa nhạy cảm gây tổn hại thương hiệu quảng cáo.',
    isAdComment: true,
    campaignName: 'Camp 3: Combo Serum Cấp Ẩm GlowSkin'
  },
  {
    id: 'cmt-107',
    postId: 'post-1001',
    postTitle: 'BST Đầm Lụa Dạ Hội Sang Trọng 2026 - Giảm 30% Tuần Lễ Vàng',
    authorId: 'fb-user-8991',
    authorName: 'Đặng Mai Phương',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=faces',
    message: 'Ship cho mình 1 đầm màu be size M về số 039.482.1092 nha bạn ơi, giao trước thứ 6 giúp mình',
    createdAt: '2026-10-06T19:42:00Z',
    status: 'hidden',
    hiddenReason: 'Lộ Số Điện Thoại Khách (Tự động ẩn sau 105ms)',
    matchedRuleId: 'rule-phone',
    matchedKeywords: ['039.482.1092'],
    isSpamAI: true,
    aiConfidence: 0.98,
    aiExplanation: 'Phát hiện số điện thoại khách hàng. Đã ẩn để tránh đối thủ liên hệ trước.',
    containsPhone: true,
    isAdComment: true,
    campaignName: 'Camp 1: BST Đầm Lụa Dạ Hội Mùa Thu',
    autoReplied: true
  }
];

// Initial Team Members
export const initialTeam: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Nguyễn Thành Thiện (Super Admin)',
    email: 'nguyenthanhthien.dev.1602@gmail.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
    addedAt: '2026-01-01T00:00:00Z',
    lastActive: 'Vừa xong',
    status: 'active'
  },
  {
    id: 'team-2',
    name: 'Mai Hương Ly (Trưởng nhóm kiểm duyệt)',
    email: 'huongly.moderator@automod.vn',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    addedAt: '2026-02-15T08:30:00Z',
    lastActive: '5 phút trước',
    status: 'active'
  },
  {
    id: 'team-3',
    name: 'Đoàn Quốc Tuấn (Chuyên viên Facebook Ads)',
    email: 'quoctuan.ads@automod.vn',
    role: 'ads_manager',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=faces',
    addedAt: '2026-02-20T14:15:00Z',
    lastActive: '32 phút trước',
    status: 'active'
  },
  {
    id: 'team-4',
    name: 'Trần Bích Thảo (Phân tích dữ liệu & Báo cáo)',
    email: 'bichthao.analyst@automod.vn',
    role: 'viewer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    addedAt: '2026-03-01T10:00:00Z',
    lastActive: '2 giờ trước',
    status: 'active'
  }
];

// Initial Notifications
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Phát hiện số điện thoại khách hàng!',
    message: 'Khách hàng Nguyễn Thị Hương vừa để lại SĐT trên bài viết BST Đầm Lụa. Hệ thống đã ẩn bình luận tức thì trong 110ms.',
    severity: 'critical',
    timestamp: '2026-10-06T20:25:05Z',
    read: false,
    keyword: '0918.423.891',
    commentId: 'cmt-101'
  },
  {
    id: 'notif-2',
    title: 'Cảnh báo đối thủ cướp khách!',
    message: 'Tài khoản Trần Văn Tuấn vừa comment chèo kéo giá rẻ hơn. Hệ thống đã kích hoạt quy tắc ẩn tự động.',
    severity: 'alert',
    timestamp: '2026-10-06T20:21:05Z',
    read: false,
    keyword: 'bên em bán rẻ',
    commentId: 'cmt-102'
  },
  {
    id: 'notif-3',
    title: 'Xóa bình luận spam link Telegram',
    message: 'Tài khoản Lê Hoàng Long bị xóa bình luận lừa đảo tuyển CTV.',
    severity: 'warning',
    timestamp: '2026-10-06T20:14:05Z',
    read: true,
    keyword: 't.me/',
    commentId: 'cmt-104'
  },
  {
    id: 'notif-4',
    title: 'Bình luận chứa từ ngữ tiêu cực',
    message: 'Tài khoản Vũ Đức Mạnh dùng từ "lừa đảo, hàng dởm". Đã ẩn thành công.',
    severity: 'alert',
    timestamp: '2026-10-06T19:55:05Z',
    read: true,
    keyword: 'lừa đảo',
    commentId: 'cmt-106'
  }
];

// Initial Webhooks
export const initialWebhooks: WebhookConfig[] = [
  {
    id: 'hook-1',
    name: 'Đồng bộ CRM Khách Hàng (Pancake / POS)',
    url: 'https://api.pancake.vn/webhook/v1/comments',
    secret: 'whsec_98f4a1029c8e9b',
    events: ['comment.hidden', 'phone.extracted'],
    active: true,
    lastTriggered: '2026-10-06T20:25:06Z',
    failureCount: 0
  },
  {
    id: 'hook-2',
    name: 'Thông báo khẩn cấp qua Telegram Bot',
    url: 'https://api.telegram.org/bot72891823/sendMessage',
    secret: 'whsec_tg_alert_prod',
    events: ['sensitive_keyword.alert', 'competitor.poached'],
    active: true,
    lastTriggered: '2026-10-06T20:21:08Z',
    failureCount: 0
  }
];

export const initialApiKeys: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Khóa API Live Production - Haravan Sync',
    prefix: 'automod_live_89f3a***99b2',
    createdAt: '2026-02-15T09:00:00Z',
    lastUsed: '1 phút trước',
    expiresAt: '2027-02-15T09:00:00Z'
  },
  {
    id: 'key-2',
    name: 'Khóa API Test Sandbox',
    prefix: 'automod_test_21a7b***77c1',
    createdAt: '2026-03-01T14:20:00Z',
    lastUsed: 'Hôm qua',
    expiresAt: '2026-09-01T14:20:00Z'
  }
];

export const initialSecurity: SecuritySettings = {
  twoFactorEnabled: true,
  totpSecret: 'JBSWY3DPEHPK3PXP',
  ipWhitelistEnabled: false,
  allowedIps: ['118.69.182.42', '14.169.88.21'],
  sessionTimeoutMinutes: 120,
  lastLogin: {
    ip: '118.69.182.42 (Viettel Telecom - TP.HCM)',
    device: 'Chrome 124 / macOS Apple Silicon',
    time: '2026-10-06 20:15:32'
  }
};

export const initialThemeConfig: ThemeConfig = {
  mode: 'dark',
  accentColor: 'blue',
  density: 'comfortable',
  soundEnabled: true,
  autoScanInterval: 5,
  isLiveScanning: true
};

// Storage helper with fallback
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    // Broadcast change to other tabs/windows for multi-device sync
    syncChannel?.postMessage({ type: 'SYNC_UPDATE', key, timestamp: Date.now() });
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// BroadcastChannel for real-time synchronization across browser tabs
export const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('automod_fb_realtime_channel')
  : null;

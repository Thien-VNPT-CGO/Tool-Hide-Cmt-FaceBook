export type Language = 'vi' | 'en';

export type UserRole = 'super_admin' | 'moderator' | 'ads_manager' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  addedAt: string;
  lastActive: string;
  status: 'active' | 'suspended';
}

export type ActionType = 'hide' | 'delete' | 'auto_reply' | 'flag_review';

export type RuleCategory = 'phone_leak' | 'competitor_price' | 'spam_link' | 'profanity' | 'negative_review' | 'custom';

export interface FilterRule {
  id: string;
  name: string;
  category: RuleCategory;
  keywords: string[];
  isRegex: boolean;
  action: ActionType;
  autoReplyMessage?: string;
  enabled: boolean;
  matchCount: number;
  createdAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BlacklistedUser {
  id: string;
  fbUid: string;
  name: string;
  reason: string;
  totalCommentsBlocked: number;
  addedAt: string;
  addedBy: string;
  status: 'blocked' | 'watching';
}

export interface CommentItem {
  id: string;
  postId: string;
  postTitle: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  message: string;
  createdAt: string;
  status: 'visible' | 'hidden' | 'deleted' | 'flagged';
  hiddenReason?: string;
  matchedRuleId?: string;
  matchedKeywords?: string[];
  isSpamAI?: boolean;
  aiConfidence?: number;
  aiExplanation?: string;
  containsPhone?: boolean;
  isAdComment: boolean;
  campaignName?: string;
  autoReplied?: boolean;
}

export interface AdCampaign {
  id: string;
  campaignId: string;
  name: string;
  adSet: string;
  dailyBudget: number;
  spend: number;
  totalComments: number;
  hiddenComments: number;
  leadsProtected: number;
  estimatedProtectedValue: number;
  status: 'active' | 'paused';
}

export interface FbPageAccount {
  id: string;
  pageId: string;
  name: string;
  category: string;
  avatar: string;
  tokenStatus: 'valid' | 'expired' | 'missing_permissions';
  tokenExpiresAt: string;
  connectedAt: string;
  permissions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  commentId?: string;
  severity: 'info' | 'warning' | 'alert' | 'critical';
  timestamp: string;
  read: boolean;
  keyword?: string;
}

export interface ThemeConfig {
  mode: 'dark' | 'light';
  accentColor: 'blue' | 'cyan' | 'emerald' | 'violet' | 'amber';
  density: 'comfortable' | 'compact';
  soundEnabled: boolean;
  autoScanInterval: number; // in seconds
  isLiveScanning: boolean;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
  failureCount: number;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt: string;
}

export interface BackupPoint {
  id: string;
  timestamp: string;
  title: string;
  sizeKb: number;
  commentCount: number;
  ruleCount: number;
  type: 'auto' | 'manual';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  totpSecret: string;
  ipWhitelistEnabled: boolean;
  allowedIps: string[];
  sessionTimeoutMinutes: number;
  lastLogin: {
    ip: string;
    device: string;
    time: string;
  };
}

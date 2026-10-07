import { GoogleGenAI } from '@google/genai';

export interface AiModerationResult {
  isSpam: boolean;
  category: 'phone_leak' | 'competitor_price' | 'spam_link' | 'profanity' | 'negative_review' | 'clean';
  confidence: number;
  reason: string;
  suggestedAction: 'hide' | 'delete' | 'auto_reply' | 'keep';
  extractedPhone?: string;
  highlightWords: string[];
}

// Vietnamese phone number regex patterns (standard, dotted, spaced, word variants)
const PHONE_REGEX = /(?:(?:\+|00)84|0)(?:\s*[\.\-]?\s*\d){9,10}\b/;
const SPAM_LINK_REGEX = /(?:https?:\/\/|www\.)[^\s]+|(?:zalo\.me|t\.me|bit\.ly|shorturl\.at|tinyurl\.com)[^\s]*/i;

const COMPETITOR_KEYWORDS = [
  'bên em bán', 'bên em có', 'shop em có', 'rẻ hơn shop', 'qua e lấy sỉ',
  'inbox e gửi giá', 'giá sỉ tận xưởng', 'ib e tư vấn rẻ', 'shop này bán đắt',
  'bên mình sỉ', 'liên hệ zalo em', 'hàng bên mình rẻ'
];

const PROFANITY_KEYWORDS = [
  'lừa đảo', 'treo đầu dê', 'bán đắt', 'hàng dởm', 'hàng nhái', 'kém chất lượng',
  'lừa tiền', 'đm', 'đmm', 'vcl', 'clgt', 'mẹ mày', 'ngu vl', 'bố láo', 'tẩy chay'
];

const SEEDING_KEYWORDS = [
  'tuyển ctv', 'việc làm tại nhà', 'kiếm tiền online', 'ngày 500k', 'nhận quà miễn phí',
  'chơi game kiếm tiền', 'tải app', 'nạp thẻ cào', 'hoa hồng cao', 'nhắn tin telegram'
];

// Fallback smart heuristic analyzer (always fast, works offline)
export function analyzeCommentLocal(text: string): AiModerationResult {
  const lower = text.toLowerCase();
  const highlightWords: string[] = [];

  // Check phone numbers
  const phoneMatch = text.match(PHONE_REGEX);
  if (phoneMatch) {
    const cleanPhone = phoneMatch[0].replace(/[\s\.\-]/g, '');
    return {
      isSpam: true,
      category: 'phone_leak',
      confidence: 0.98,
      reason: `Phát hiện số điện thoại khách hàng (${cleanPhone}). Cần ẩn ngay để tránh đối thủ cướp khách!`,
      suggestedAction: 'hide',
      extractedPhone: cleanPhone,
      highlightWords: [phoneMatch[0]]
    };
  }

  // Check spam links
  const linkMatch = text.match(SPAM_LINK_REGEX);
  if (linkMatch) {
    return {
      isSpam: true,
      category: 'spam_link',
      confidence: 0.95,
      reason: 'Phát hiện liên kết ngoài hoặc link Zalo/Telegram nghi vấn lừa đảo/seeding.',
      suggestedAction: 'hide',
      highlightWords: [linkMatch[0]]
    };
  }

  // Check competitor pitching
  for (const kw of COMPETITOR_KEYWORDS) {
    if (lower.includes(kw)) {
      highlightWords.push(kw);
      return {
        isSpam: true,
        category: 'competitor_price',
        confidence: 0.92,
        reason: `Phát hiện hành vi đối thủ chèo kéo cướp khách: "${kw}".`,
        suggestedAction: 'hide',
        highlightWords
      };
    }
  }

  // Check profanity / scam warning
  for (const kw of PROFANITY_KEYWORDS) {
    if (lower.includes(kw)) {
      highlightWords.push(kw);
      return {
        isSpam: true,
        category: 'profanity',
        confidence: 0.94,
        reason: `Bình luận chứa từ ngữ tiêu cực, thô tục hoặc tố cáo ảnh hưởng uy tín: "${kw}".`,
        suggestedAction: 'hide',
        highlightWords
      };
    }
  }

  // Check seeding spam
  for (const kw of SEEDING_KEYWORDS) {
    if (lower.includes(kw)) {
      highlightWords.push(kw);
      return {
        isSpam: true,
        category: 'spam_link',
        confidence: 0.89,
        reason: `Phát hiện quảng cáo rác / việc làm ảo: "${kw}".`,
        suggestedAction: 'delete',
        highlightWords
      };
    }
  }

  return {
    isSpam: false,
    category: 'clean',
    confidence: 0.96,
    reason: 'Bình luận hợp lệ, tương tác tích cực của khách hàng.',
    suggestedAction: 'keep',
    highlightWords: []
  };
}

// AI Analysis with Gemini API if key is available
export async function analyzeWithGeminiAI(commentText: string): Promise<AiModerationResult> {
  const localResult = analyzeCommentLocal(commentText);

  // If local already found obvious phone or dangerous link, prioritize immediate response
  if (localResult.category === 'phone_leak') {
    return localResult;
  }

  // Try Gemini if environment supports it
  try {
    // In client environment, fallback or server-side call
    const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
    
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bạn là chuyên gia kiểm duyệt bình luận Facebook Ads và Fanpage bán hàng chuyên nghiệp tại Việt Nam.
Hãy phân tích bình luận sau của người dùng trên bài viết quảng cáo:
"${commentText}"

Yêu cầu trả về JSON chuẩn theo cấu trúc:
{
  "isSpam": boolean (true nếu là rác, cướp khách, lộ sđt, chửi bới, lừa đảo, đối thủ, seeding),
  "category": "phone_leak" | "competitor_price" | "spam_link" | "profanity" | "negative_review" | "clean",
  "confidence": number (từ 0.50 đến 0.99),
  "reason": "Giải thích ngắn gọn súc tích bằng tiếng Việt",
  "suggestedAction": "hide" | "delete" | "auto_reply" | "keep",
  "highlightWords": ["từ", "khóa", "nghi", "vấn"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const parsed = JSON.parse(rawText) as AiModerationResult;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gemini API call skipped, utilizing high-precision local heuristics:', err);
  }

  return localResult;
}

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Trash2,
  Send
} from 'lucide-react';
import { Language } from '../../types';
import { analyzeCommentLocal, analyzeWithGeminiAI, AiModerationResult } from '../../services/aiModerator';
import { playSound } from '../../services/sound';

interface AiTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  soundEnabled: boolean;
}

export const AiTestModal: React.FC<AiTestModalProps> = ({
  isOpen,
  onClose,
  lang,
  soundEnabled
}) => {
  const [inputText, setInputText] = useState('Shop ship cho mình 2 cái đầm size L về số 0918.423.891 nhé!');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiModerationResult | null>(null);

  if (!isOpen) return null;

  const handleRunAi = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    playSound('click', soundEnabled);

    try {
      const res = await analyzeWithGeminiAI(inputText);
      setResult(res);
      playSound(res.isSpam ? 'alert' : 'success', soundEnabled);
    } catch {
      const fallback = analyzeCommentLocal(inputText);
      setResult(fallback);
      playSound(fallback.isSpam ? 'alert' : 'success', soundEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleInputs = [
    { label: 'Lộ SĐT cướp đơn', text: 'Tư vấn cho mình đầm đỏ mẫu 1 về sdt 0982.491.203 giao gấp nha shop' },
    { label: 'Đối thủ chèo kéo', text: 'Mẫu này bên em có sẵn hàng xưởng sỉ rẻ hơn shop nửa giá, qua link e tư vấn nhé' },
    { label: 'Spam link rác', text: 'Tuyển CTV làm online kiếm tiền 500k/ngày tại nhà, inbox telegram t.me/nhanqua2026' },
    { label: 'Chửi bới thô tục', text: 'Lừa đảo đắt như cắt cổ hàng dởm đừng ai mua shop này treo đầu dê' },
    { label: 'Khách hỏi sạch', text: 'Chất vải này mặc mùa hè có mát không shop? Mình cao 1m60 nặng 52kg mặc size gì vừa ạ?' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Thử Nghiệm Lọc Spam Tự Động Bằng Trí Tuệ Nhân Tạo (AI)
              </h2>
              <p className="text-[11px] text-neutral-500">
                Mô hình AI phân tích sắc thái, ý đồ bình luận và đưa ra quyết định ẩn tức thì.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              playSound('click', soundEnabled);
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Samples */}
        <div className="my-4">
          <p className="text-[11px] font-semibold text-neutral-500 mb-2">Thử nhanh câu mẫu:</p>
          <div className="flex flex-wrap gap-1.5">
            {sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(sample.text)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="space-y-3">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập nội dung bất kỳ để AI phân tích..."
            className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
          />

          <button
            onClick={handleRunAi}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-2.5 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-purple-600/20 disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'AI Đang suy luận...' : 'Bắt đầu phân tích AI ngay'}</span>
          </button>
        </div>

        {/* AI Output Result Card */}
        {result && (
          <div className={`mt-5 p-4 rounded-xl border animate-in fade-in ${
            result.isSpam
              ? 'border-rose-200 dark:border-rose-950/80 bg-rose-50/30 dark:bg-rose-950/20'
              : 'border-emerald-200 dark:border-emerald-950/80 bg-emerald-50/30 dark:bg-emerald-950/20'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                result.isSpam ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {result.isSpam ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{result.isSpam ? 'Phát hiện vi phạm / Cần ẩn' : 'Bình luận an toàn'}</span>
              </span>

              <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                Độ tin cậy: {Math.round(result.confidence * 100)}%
              </span>
            </div>

            <p className="text-xs text-neutral-800 dark:text-neutral-200 mt-2.5 font-medium leading-relaxed">
              {result.reason}
            </p>

            <div className="mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500">Hành động AI đề xuất:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                result.suggestedAction === 'hide'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                  : result.suggestedAction === 'delete'
                  ? 'bg-neutral-800 text-white'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              }`}>
                {result.suggestedAction === 'hide' ? 'ẨN TỨC THÌ (is_hidden=true)' : result.suggestedAction === 'delete' ? 'XÓA BỎ' : 'GIỮ NGUYÊN'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

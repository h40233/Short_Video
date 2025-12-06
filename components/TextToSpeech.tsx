import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { AudioLines, Play, Loader2, Volume2 } from 'lucide-react';

/**
 * TextToSpeech 元件
 * 功能：輸入文字，呼叫 TTS API，並播放回傳的音訊資料。
 */
const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setAudioUrl(null);

    try {
      const audioBuffer = await geminiService.generateSpeech(text);
      
      // 建立 Blob URL 以供播放
      const blob = new Blob([audioBuffer], { type: 'audio/mp3' }); // Gemini TTS 回傳格式處理
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error("TTS 錯誤:", error);
      alert("語音生成失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <AudioLines className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI 語音合成 (TTS)</h2>
        </div>
        
        <p className="text-slate-400">輸入任何文字，讓 Gemini 用自然的聲音朗讀出來。</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="請輸入要轉換為語音的文字..."
          className="w-full h-40 p-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-100 placeholder-slate-600 resize-none"
        />

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          {audioUrl && (
            <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
              <Volume2 className="w-5 h-5 text-green-400" />
              <audio controls src={audioUrl} className="h-8 w-48" autoPlay />
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={loading || !text}
            className={`ml-auto px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              loading || !text
                ? 'bg-slate-700 text-slate-500'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/40'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                生成語音
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;

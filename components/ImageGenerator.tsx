import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ImageSize } from '../types';
import { Image as ImageIcon, Loader2, Download, Maximize2 } from 'lucide-react';

/**
 * ImageGenerator 元件
 * 功能：提供使用者介面以輸入提示詞並選擇解析度，使用 gemini-3-pro-image-preview 生成圖片。
 */
const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await geminiService.generateImage(prompt, size);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || '圖片生成失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-600 flex items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-emerald-400" />
          Pro 級圖片生成
        </h2>
        <p className="text-slate-400">使用 Nano Banana Pro (Gemini 3 Pro Image) 創造驚人細節</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 控制面板 */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">描述您的想像</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一座漂浮在雲端的賽博龐克城市，霓虹燈光..."
                  className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-100 placeholder-slate-500 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  解析度設定
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(ImageSize).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        size === s
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  loading || !prompt
                    ? 'bg-slate-700 text-slate-500'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : '立即生成'}
              </button>
              
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
          </div>
        </div>

        {/* 預覽區域 */}
        <div className="bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Generated" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a
                  href={imageUrl}
                  download="gemini-image.png"
                  className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" />
                  下載圖片
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-600">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>預覽區域</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;

import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { VideoStyle, UploadStatus } from '../types';
import { Video, Youtube, Loader2, Sparkles, Share2 } from 'lucide-react';

/**
 * VideoGenerator 元件
 * 功能：讓使用者輸入主題、選擇風格，呼叫 API 生成影片，並模擬上傳至 YouTube。
 */
const VideoGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<VideoStyle>(VideoStyle.REALISTIC);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  // 處理生成按鈕點擊
  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setUploadStatus(UploadStatus.IDLE);

    try {
      const url = await geminiService.generateVideo(topic, style);
      setVideoUrl(url);
    } catch (err: any) {
      setError(err.message || '影片生成失敗，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  // 模擬 YouTube 上傳
  const handleUploadToYoutube = () => {
    setUploadStatus(UploadStatus.UPLOADING);
    // 模擬網路延遲
    setTimeout(() => {
      setUploadStatus(UploadStatus.SUCCESS);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center gap-2">
          <Video className="w-8 h-8 text-purple-400" />
          AI 短影音生成器
        </h2>
        <p className="text-slate-400">輸入主題，選擇風格，一鍵生成並上傳</p>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl backdrop-blur-sm">
        <div className="space-y-6">
          {/* 主題輸入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">影片主題</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：一隻玩插頭的貓，結果被電到毛澎起來了..."
              className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-100 placeholder-slate-500 resize-none transition-all"
            />
          </div>

          {/* 風格選擇 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">視覺風格</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(VideoStyle).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    style === s
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 生成按鈕 */}
          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              loading || !topic
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/50'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                正在製作影片 (可能需要幾分鐘)...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                開始生成影片
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-xl text-red-200 text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* 結果展示區 */}
      {videoUrl && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-white">生成結果</h3>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6 relative group">
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              autoPlay
              loop
            />
          </div>

          {/* 上傳 YouTube 區塊 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-slate-100">YouTube 整合</div>
                <div className="text-sm text-slate-400">一鍵發佈您的創意短片</div>
              </div>
            </div>
            
            <button
              onClick={handleUploadToYoutube}
              disabled={uploadStatus === UploadStatus.UPLOADING || uploadStatus === UploadStatus.SUCCESS}
              className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                uploadStatus === UploadStatus.SUCCESS
                  ? 'bg-green-600 text-white cursor-default'
                  : uploadStatus === UploadStatus.UPLOADING
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30'
              }`}
            >
              {uploadStatus === UploadStatus.UPLOADING ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  上傳中...
                </>
              ) : uploadStatus === UploadStatus.SUCCESS ? (
                <>
                  <Share2 className="w-4 h-4" />
                  上傳成功！
                </>
              ) : (
                <>
                  上傳到 YouTube
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;

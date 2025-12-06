import React, { useState } from 'react';
import VideoGenerator from './components/VideoGenerator';
import ImageGenerator from './components/ImageGenerator';
import ChatBot from './components/ChatBot';
import TextToSpeech from './components/TextToSpeech';
import { Video, Image, MessageSquare, AudioLines, Menu, X } from 'lucide-react';

/**
 * App 元件
 * 職責：管理全域導航狀態，並根據選擇的標籤渲染對應的功能元件。
 */
const App: React.FC = () => {
  // 當前選中的功能頁面
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'chat' | 'tts'>('video');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 定義選單項目
  // 修正：統一屬性名稱為 iconColor，避免 TypeScript 聯合型別錯誤
  const menuItems = [
    { id: 'video', label: '短影音生成', icon: Video, iconColor: 'text-purple-400' },
    { id: 'image', label: '圖片生成', icon: Image, iconColor: 'text-emerald-400' },
    { id: 'chat', label: 'AI 聊天', icon: MessageSquare, iconColor: 'text-blue-400' },
    { id: 'tts', label: '語音合成', icon: AudioLines, iconColor: 'text-orange-400' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* 側邊導航欄 (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Studio
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? item.iconColor : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Powered by Google Gemini API
        </div>
      </aside>

      {/* 頂部導航欄 (Mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <h1 className="text-lg font-bold text-white">Gemini Studio</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 手機版選單 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-16 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg ${
                  activeTab === item.id ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 主要內容區域 */}
      <main className="flex-1 md:pl-64 min-h-screen">
        <div className="container mx-auto py-8 px-4 animate-in fade-in duration-500">
          {activeTab === 'video' && <VideoGenerator />}
          {activeTab === 'image' && <ImageGenerator />}
          {activeTab === 'chat' && <ChatBot />}
          {activeTab === 'tts' && <TextToSpeech />}
        </div>
      </main>
    </div>
  );
};

export default App;
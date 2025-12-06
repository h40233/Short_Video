// 定義短影音生成的風格列舉
export enum VideoStyle {
  REALISTIC = '寫實風格',
  AMERICAN_CARTOON = '美式卡通',
  JAPANESE_ANIME = '日式卡通',
  TWO_POINT_FIVE_D = '2.5D',
  PIXEL_ART = '像素風格'
}

// 定義圖片生成的大小列舉
export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

// 定義聊天訊息的介面
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// 定義 YouTube 上傳狀態列舉
export enum UploadStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

// 擴充 Window 介面以支援 AI Studio 的 API Key 選擇器
declare global {
  // 定義 AIStudio 介面，若環境中已存在同名介面，此處定義會與其合併 (Interface Merging)
  // 這確保了 AIStudio 型別具有我們需要的方法 (hasSelectedApiKey, openSelectKey)
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  // 注意：我們移除了對 Window 介面的 aistudio 屬性擴充 (aistudio?: AIStudio)
  // 因為編譯錯誤 "Subsequent property declarations must have the same type" 指出
  // 環境中已經存在 window.aistudio 的定義且型別為 AIStudio。
  // 我們不需要(也不能)重新宣告它，直接使用上述的介面合併即可確保型別正確。
}
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { ImageSize, VideoStyle } from "../types";

/**
 * GeminiService 類別
 * 職責：處理所有與 Google GenAI SDK 的互動，包括模型初始化、API 呼叫與錯誤處理。
 */
class GeminiService {
  private ai: GoogleGenAI | null = null;

  /**
   * 初始化 GoogleGenAI 實例
   * 說明：在使用任何 API 之前，必須確保有 API Key。
   * 對於 Veo 和高級模型，我們使用 window.aistudio 來處理使用者自選 Key 的流程。
   */
  private async ensureInitialized(): Promise<GoogleGenAI> {
    // 檢查是否有選定的 API Key (針對 Veo/Pro 模型)
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }
    
    // 每次呼叫都重新建立實例以確保使用最新的 Key
    // 注意：在實際環境中 process.env.API_KEY 會被自動注入
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return this.ai;
  }

  /**
   * 生成短影音
   * 原理：使用 'veo-3.1-fast-generate-preview' 模型。這是一個非同步操作，需要輪詢 (polling) 直到完成。
   * 
   * @param topic 影片主題
   * @param style 影片風格
   * @returns 生成影片的 URI
   */
  async generateVideo(topic: string, style: VideoStyle): Promise<string> {
    const ai = await this.ensureInitialized();
    
    // 組合 Prompt，將風格與主題結合
    const prompt = `Generate a short video in ${style} style. The content is: ${topic}`;

    console.log(`正在請求生成影片，提示詞: ${prompt}`);

    // 發起生成請求
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    // 輪詢直到操作完成
    while (!operation.done) {
      console.log("影片生成中，等待 5 秒...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("影片生成失敗，未回傳 URI");
    }

    // 回傳包含 API Key 的完整 URL 供前端播放
    return `${videoUri}&key=${process.env.API_KEY}`;
  }

  /**
   * 生成圖片
   * 原理：使用 'gemini-3-pro-image-preview' 模型。支援高解析度設定。
   * 
   * @param prompt 圖片描述
   * @param size 圖片大小 (1K, 2K, 4K)
   * @returns Base64 格式的圖片 URL
   */
  async generateImage(prompt: string, size: ImageSize): Promise<string> {
    const ai = await this.ensureInitialized();

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    // 解析回應中的圖片資料
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("無法從回應中解析圖片資料");
  }

  /**
   * AI 聊天
   * 原理：使用 'gemini-3-pro-preview' 模型進行文字對話。
   * 
   * @param message 使用者訊息
   * @returns 模型的文字回應
   */
  async chat(message: string): Promise<string> {
    const ai = await this.ensureInitialized();

    const chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "你是一個繁體中文的 AI 助手，回答請簡潔有力。",
      }
    });

    const response = await chatSession.sendMessage({ message });
    
    // 確保回傳字串，若為 undefined 則回傳空字串
    return response.text || "";
  }

  /**
   * 文字轉語音 (TTS)
   * 原理：使用 'gemini-2.5-flash-preview-tts' 模型生成音訊。
   * 
   * @param text 要朗讀的文字
   * @returns ArrayBuffer 音訊資料
   */
  async generateSpeech(text: string): Promise<ArrayBuffer> {
    const ai = await this.ensureInitialized();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 使用 Kore 聲音
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("TTS 生成失敗，無音訊資料");
    }

    // 將 Base64 解碼為 ArrayBuffer
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }
}

// 匯出單例模式的 Service
export const geminiService = new GeminiService();

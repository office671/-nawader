
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const MODEL_NAME = 'gemini-3-pro-preview';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async createChatSession(systemInstruction: string): Promise<Chat> {
    return this.ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction,
      },
    });
  }

  async sendMessage(
    chat: Chat, 
    message: string, 
    useThinking: boolean = false
  ): Promise<string> {
    const config: any = {};
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response: GenerateContentResponse = await chat.sendMessage({
      message,
    });
    
    return response.text || "عذراً، لم أتمكن من توليد استجابة.";
  }

  async analyzeImage(
    base64Data: string, 
    mimeType: string, 
    prompt: string,
    useThinking: boolean = false
  ): Promise<string> {
    const config: any = {};
    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      },
      config
    });

    return response.text || "تعذر تحليل الصورة.";
  }
}

export const geminiService = new GeminiService();

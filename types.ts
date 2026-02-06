
export enum AppView {
  CHAT = 'CHAT',
  IMAGE_ANALYSIS = 'IMAGE_ANALYSIS'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isThinking?: boolean;
}

export interface AnalysisResult {
  imageUrl: string;
  analysis: string;
  timestamp: number;
}

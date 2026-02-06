
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Message } from '../types';
import { Chat } from '@google/genai';

interface ChatInterfaceProps {
  isThinkingEnabled: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isThinkingEnabled }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "مرحباً! أنا مساعدك الذكي \"نوادر\". كيف يمكنني مساعدتك اليوم؟" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      chatSessionRef.current = await geminiService.createChatSession(
        "أنت مساعد ذكي ومحترف للغاية يدعى \"نوادر AI\". " +
        "تقدم معلومات دقيقة ومفيدة ومختصرة باللغة العربية. " +
        "إذا قام المستخدم بتفعيل 'وضع التفكير'، قدم منطقاً عميقاً واستنتاجاً خطوة بخطوة."
      );
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(
        chatSessionRef.current, 
        input, 
        isThinkingEnabled
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        isThinking: isThinkingEnabled
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "عذراً، واجهت خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 no-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 text-right ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tl-none shadow-lg shadow-indigo-900/20' 
                : 'bg-slate-800 text-slate-200 rounded-tr-none border border-slate-700/50'
            }`}>
              {msg.isThinking && (
                <div className="flex items-center justify-end space-x-2 space-x-reverse mb-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <span>تم تطبيق التفكير العميق</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-tr-none p-4 flex items-center space-x-3 space-x-reverse">
              <span className="text-sm text-slate-400 mr-2">
                {isThinkingEnabled ? 'جاري تحليل المنطق المعقد...' : 'جاري التفكير...'}
              </span>
              <div className="flex space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative group"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isThinkingEnabled ? "اطرح سؤالاً معقداً..." : "اكتب رسالتك هنا..."}
            className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-2xl py-4 pr-6 pl-14 outline-none transition-all placeholder:text-slate-600 text-slate-200 text-right"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute left-2 top-2 bottom-2 w-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all"
          >
            <svg className="w-5 h-5 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-widest font-bold">
          مدعوم بواسطة Gemini 3 Pro
        </p>
      </div>
    </div>
  );
};

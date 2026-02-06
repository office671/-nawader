
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface ImageAnalyzerProps {
  isThinkingEnabled: boolean;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ isThinkingEnabled }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('حلل هذه الصورة بالتفصيل.');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis('');
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setAnalysis('');

    try {
      const base64Data = selectedImage.split(',')[1];
      const result = await geminiService.analyzeImage(
        base64Data, 
        mimeType, 
        prompt, 
        isThinkingEnabled
      );
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("فشل تحليل الصورة. يرجى التحقق من الملف والمحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto w-full p-6 md:p-10 space-y-10">
        <header className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">الذكاء البصري</h2>
          <p className="text-slate-400">ارفع صورة لاستخراج الرؤى والتصنيفات والسياق الخفي.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Right Column (Input) - In RTL, this appears first */}
          <div className="space-y-6 order-last lg:order-first">
             <div className={`h-full border border-slate-800 bg-slate-900/40 rounded-3xl p-8 min-h-[500px] flex flex-col text-right ${analysis ? 'opacity-100' : 'opacity-40'}`}>
              <div className="flex items-center justify-end space-x-3 space-x-reverse mb-6">
                <h3 className="text-xl font-bold text-white">تقرير الرؤى</h3>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {analysis ? (
                  <div className="prose prose-invert max-w-none text-right">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-slate-500 font-medium">بانتظار نتائج التحليل...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Column (Upload) */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[400px] ${
                selectedImage 
                  ? 'border-indigo-600/50 bg-indigo-600/5' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/30'
              }`}
            >
              {selectedImage ? (
                <div className="w-full h-full relative group">
                  <img 
                    src={selectedImage} 
                    alt="معاينة" 
                    className="w-full h-full object-contain rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-white font-medium">انقر للتغيير</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-indigo-400 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-slate-200">اختر صورة</p>
                    <p className="text-sm text-slate-500">JPG، PNG أو WEBP (بحد أقصى 10 ميجابايت)</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="space-y-3 text-right">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">تعليمات التحليل</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="عن ماذا يجب أن أبحث؟"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none h-24 text-right"
              />
            </div>

            <button
              onClick={startAnalysis}
              disabled={!selectedImage || isLoading}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 space-x-reverse"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>جاري التحليل...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>ابدأ فحص الذكاء</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

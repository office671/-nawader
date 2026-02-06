
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isThinkingEnabled: boolean;
  toggleThinking: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setActiveView, 
  isThinkingEnabled, 
  toggleThinking 
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-l border-slate-800 bg-slate-900/50 order-last">
        <div className="p-6 text-right">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            نوادر AI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 text-right">
          <button
            onClick={() => setActiveView(AppView.CHAT)}
            className={`w-full flex items-center justify-end space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all ${
              activeView === AppView.CHAT 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="font-medium">دردشة ذكية</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>

          <button
            onClick={() => setActiveView(AppView.IMAGE_ANALYSIS)}
            className={`w-full flex items-center justify-end space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all ${
              activeView === AppView.IMAGE_ANALYSIS 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' 
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="font-medium">تحليل الصور</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50">
            <button 
              onClick={toggleThinking}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isThinkingEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isThinkingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">وضع التفكير</span>
              <span className="text-xs text-slate-500">استنتاج عميق</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Mobile Nav Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <h1 className="text-xl font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">نوادر</h1>
          <div className="flex space-x-2 space-x-reverse">
            <button onClick={() => setActiveView(AppView.CHAT)} className={`p-2 rounded-lg ${activeView === AppView.CHAT ? 'text-indigo-400' : 'text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
            <button onClick={() => setActiveView(AppView.IMAGE_ANALYSIS)} className={`p-2 rounded-lg ${activeView === AppView.IMAGE_ANALYSIS ? 'text-indigo-400' : 'text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

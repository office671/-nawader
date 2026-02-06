
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.CHAT);
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);

  const toggleThinking = () => setIsThinkingEnabled(!isThinkingEnabled);

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      isThinkingEnabled={isThinkingEnabled}
      toggleThinking={toggleThinking}
    >
      {activeView === AppView.CHAT ? (
        <ChatInterface isThinkingEnabled={isThinkingEnabled} />
      ) : (
        <ImageAnalyzer isThinkingEnabled={isThinkingEnabled} />
      )}
    </Layout>
  );
};

export default App;

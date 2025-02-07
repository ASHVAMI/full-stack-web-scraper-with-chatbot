import React, { useState } from 'react';
import { UrlInput } from './components/UrlInput';
import { ChatWindow } from './components/ChatWindow';
import { Message, ScrapedContent } from './types';
import { Bot, AlertCircle, History, Settings, Save } from 'lucide-react';
import { format } from 'date-fns';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrapeStatus, setScrapeStatus] = useState<'idle' | 'scraping' | 'ready'>('idle');
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ url: string; date: string }[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScrapeStatus('scraping');
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape content. Please check the URL and try again.');
      }

      const data: ScrapedContent = await response.json();
      setCurrentUrl(url);
      setMessages([]);
      setScrapeStatus('ready');
      setChatHistory(prev => [...prev, { url, date: new Date().toISOString() }]);

      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I've successfully analyzed the content from ${url}. Feel free to ask me any questions about it! [Source](${url})`,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error scraping content:', error);
      setError(error instanceof Error ? error.message : 'Failed to scrape content');
      setScrapeStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUrl) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          url: currentUrl,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportChat = () => {
    const chatData = {
      url: currentUrl,
      messages: messages,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-gray-50 to-gray-100'} py-8 px-4 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Web Scraper Chatbot
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Chat History"
            >
              <History className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Toggle Theme"
            >
              <Settings className="w-5 h-5" />
            </button>
            {messages.length > 0 && (
              <button
                onClick={handleExportChat}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                title="Export Chat"
              >
                <Save className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Enter a website URL to analyze its content. Once processed, you can ask questions about the content and get AI-powered responses with source references.
        </p>

        <UrlInput 
          onSubmit={handleUrlSubmit} 
          isLoading={isLoading} 
          status={scrapeStatus}
          theme={theme}
        />

        {error && (
          <div className={`${theme === 'dark' ? 'bg-red-900/50 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-start space-x-3`}>
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className={theme === 'dark' ? 'text-red-300' : 'text-red-700'}>{error}</p>
          </div>
        )}

        <div className="flex gap-6">
          {showHistory && chatHistory.length > 0 && (
            <div className={`w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 h-[600px] overflow-y-auto`}>
              <h2 className="font-semibold mb-4">Chat History</h2>
              <div className="space-y-2">
                {chatHistory.map((chat, index) => (
                  <button
                    key={index}
                    onClick={() => handleUrlSubmit(chat.url)}
                    className={`w-full text-left p-2 rounded ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="text-sm font-medium truncate">{chat.url}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(chat.date), 'MMM d, yyyy HH:mm')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentUrl && (
            <div className="flex-1 space-y-4 animate-fade-in">
              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-4 shadow-sm border`}>
                <div className="flex items-center space-x-2">
                  <Bot className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Currently analyzing: <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentUrl}</span>
                  </span>
                </div>
              </div>
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
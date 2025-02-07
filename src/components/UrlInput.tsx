import React, { useState } from 'react';
import { Globe, Loader2, Link as LinkIcon } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  status: 'idle' | 'scraping' | 'ready';
  theme: 'light' | 'dark';
}

export function UrlInput({ onSubmit, isLoading, status, theme }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [recentUrls] = useState<string[]>([
    'https://example.com/about',
    'https://example.com/services',
    'https://example.com/contact',
  ]);
  const [showRecent, setShowRecent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
      setShowRecent(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-2">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setShowRecent(true)}
            placeholder="Enter website URL to analyze..."
            className={`block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'border-gray-200 focus:ring-blue-500'
            } focus:outline-none focus:ring-2 focus:border-transparent`}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={`absolute right-2 px-4 py-1.5 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{status === 'scraping' ? 'Analyzing...' : 'Processing...'}</span>
              </div>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {showRecent && !isLoading && (
          <div className={`absolute z-10 w-full mt-12 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } border rounded-lg shadow-lg`}>
            <div className="p-2">
              <div className={`px-3 py-2 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Recent URLs
              </div>
              {recentUrls.map((recentUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setUrl(recentUrl);
                    setShowRecent(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="truncate">{recentUrl}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-8">
          <StatusIndicator
            status={status === 'scraping'}
            label="Content Analysis"
            description="Analyzing webpage content"
            theme={theme}
          />
          <StatusIndicator
            status={status === 'ready'}
            label="AI Ready"
            description="Ready for your questions"
            theme={theme}
          />
        </div>
      </div>
    </form>
  );
}

interface StatusIndicatorProps {
  status: boolean;
  label: string;
  description: string;
  theme: 'light' | 'dark';
}

function StatusIndicator({ status, label, description, theme }: StatusIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-2 h-2 rounded-full ${
          status
            ? 'bg-green-500 animate-pulse'
            : theme === 'dark'
            ? 'bg-gray-600'
            : 'bg-gray-300'
        }`}
      />
      <div>
        <p className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}>{label}</p>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>{description}</p>
      </div>
    </div>
  );
}
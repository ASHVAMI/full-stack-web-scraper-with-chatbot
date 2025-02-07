export interface ScrapedContent {
  id: string;
  url: string;
  content: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  url: string;
  created_at: string;
  messages: Message[];
}
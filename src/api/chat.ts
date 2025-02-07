import { supabase } from '../lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

// Cache for storing chat responses
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Generate a cache key from the message and context
function generateCacheKey(message: string, url: string, history: any[]): string {
  return `${url}:${message}:${history.length}`;
}

export async function generateResponse(message: string, url: string, history: any[]) {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(message, url, history);
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.response;
    }

    // Fetch scraped content with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const { data: scrapedContent } = await supabase
      .from('scraped_content')
      .select('content')
      .eq('url', url)
      .single();

    clearTimeout(timeout);

    if (!scrapedContent) {
      throw new Error('No scraped content found for this URL');
    }

    // Prepare conversation history with enhanced system prompt
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant analyzing content from ${url}. 
                 Use the following scraped content to answer questions.
                 Always include a source reference at the end of your response using markdown link syntax.
                 Format your response like this: "Your detailed answer... [Source](${url})"
                 Content to analyze:
                 ${scrapedContent.content.substring(0, 3000)}...`,
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Generate response using OpenAI with enhanced temperature for more natural responses
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    });

    const response = completion.choices[0].message.content;

    // Store in cache
    responseCache.set(cacheKey, {
      response,
      timestamp: Date.now(),
    });

    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}
import { supabase } from '../lib/supabase';
import * as cheerio from 'cheerio';
import axios from 'axios';

// Cache for storing scraped content temporarily
const scrapeCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Helper function to clean text content
const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
};

// Async function to process sections of HTML in parallel
async function processSections($: cheerio.CheerioAPI, selectors: string[]): Promise<string[]> {
  return await Promise.all(
    selectors.map(async (selector) => {
      return $(selector)
        .map((_, el) => cleanText($(el).text()))
        .get()
        .filter(text => text.length > 0);
    })
  );
}

export async function scrapeWebsite(url: string) {
  try {
    // Check cache first
    const cached = scrapeCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return { url, content: cached.content };
    }

    // Check if content already exists in database
    const { data: existingContent } = await supabase
      .from('scraped_content')
      .select('*')
      .eq('url', url)
      .single();

    if (existingContent) {
      // Update cache and return existing content
      scrapeCache.set(url, {
        content: existingContent.content,
        timestamp: Date.now(),
      });
      return existingContent;
    }

    // Fetch content with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await axios.get(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WebScraper/1.0)',
      },
    });

    clearTimeout(timeout);

    const $ = cheerio.load(response.data);

    // Remove unnecessary elements
    $('script, style, noscript, iframe, img').remove();

    // Process different sections of the page in parallel
    const [
      mainContent,
      headings,
      paragraphs,
      lists
    ] = await processSections($, [
      'main, article, .content, .main',
      'h1, h2, h3, h4, h5, h6',
      'p',
      'ul li, ol li'
    ]);

    // Combine all content
    const content = [
      ...headings,
      ...mainContent,
      ...paragraphs,
      ...lists
    ].join(' ');

    // Store in cache
    scrapeCache.set(url, {
      content,
      timestamp: Date.now(),
    });

    // Store in database
    const { data, error } = await supabase
      .from('scraped_content')
      .insert([{ url, content }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
}
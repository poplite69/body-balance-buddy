
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export class BrowserService {
  /**
   * Opens a URL in an in-app browser or external browser depending on platform
   * @param url The URL to open
   * @param title Optional title for the browser window (mobile only)
   */
  static async openUrl(url: string, title?: string): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Browser plugin for native platforms
      await Browser.open({
        url,
        windowName: title || 'Browser',
        presentationStyle: 'popover',
        toolbarColor: '#33C3F0',
      });
    } else {
      // For web, open in a new tab
      window.open(url, '_blank');
    }
  }

  /**
   * Creates a YouTube search URL
   * @param query The search query
   * @returns YouTube search URL
   */
  static createYouTubeSearchUrl(query: string): string {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }

  /**
   * Creates a TikTok search URL
   * @param query The search query
   * @returns TikTok search URL
   */
  static createTikTokSearchUrl(query: string): string {
    return `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`;
  }
}

/**
 * NUST-specific scraper
 * Website: https://nust.edu.pk
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export interface NUSTData {
  deadlines: {
    applicationStart?: Date;
    applicationDeadline?: Date;
    testDate?: Date;
    meritListDates?: Date[];
  };
  meritLists: Array<{
    program: string;
    closingMerit: number;
    year: number;
  }>;
  announcements: Array<{
    title: string;
    description: string;
    date?: Date;
    url: string;
  }>;
}

export class NUSTScraper {
  private baseUrl = 'https://nust.edu.pk';
  private jinaApiKey: string;

  constructor(jinaApiKey: string) {
    this.jinaApiKey = jinaApiKey;
  }

  /**
   * Main scraping method
   */
  async scrape(): Promise<NUSTData> {
    console.log('🎓 Scraping NUST...');

    const data: NUSTData = {
      deadlines: {},
      meritLists: [],
      announcements: []
    };

    try {
      // Method 1: Try Jina AI Reader
      const jinaData = await this.scrapeWithJina();
      Object.assign(data, jinaData);
    } catch (error) {
      console.warn('Jina scraping failed, trying direct scraping...');
      
      // Method 2: Direct HTML scraping
      try {
        const directData = await this.scrapeDirectly();
        Object.assign(data, directData);
      } catch (directError) {
        console.error('Direct scraping also failed');
      }
    }

    return data;
  }

  /**
   * Scrape using Jina AI Reader API
   */
  private async scrapeWithJina(): Promise<Partial<NUSTData>> {
    const urls = {
      admissions: `${this.baseUrl}/admissions/undergraduates/dates-to-remember/`,
      meritLists: `${this.baseUrl}/admissions/undergraduates/merit-lists/`,
      announcements: `${this.baseUrl}/admissions/undergraduates/`
    };

    const data: Partial<NUSTData> = {
      deadlines: {},
      meritLists: [],
      announcements: []
    };

    // Scrape admissions page
    try {
      const admissionContent = await this.fetchWithJina(urls.admissions);
      data.deadlines = this.extractDeadlines(admissionContent);
      data.announcements = this.extractAnnouncements(admissionContent, urls.admissions);
    } catch (error) {
      console.error('Failed to scrape admissions page:', error);
    }

    // Scrape merit lists page
    try {
      const meritContent = await this.fetchWithJina(urls.meritLists);
      data.meritLists = this.extractMeritLists(meritContent);
    } catch (error) {
      console.error('Failed to scrape merit lists:', error);
    }

    return data;
  }

  /**
   * Scrape directly using Cheerio (HTML parsing)
   */
  private async scrapeDirectly(): Promise<Partial<NUSTData>> {
    const data: Partial<NUSTData> = {
      deadlines: {},
      meritLists: [],
      announcements: []
    };

    try {
      // Fetch the homepage
      const response = await axios.get(`${this.baseUrl}/admissions`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // Extract announcements
      $('.news-item, .announcement-item, article').each((i, elem) => {
        const title = $(elem).find('h2, h3, .title').text().trim();
        const description = $(elem).find('p, .description, .excerpt').text().trim();
        const link = $(elem).find('a').attr('href');

        if (title && description) {
          data.announcements?.push({
            title,
            description: description.substring(0, 200),
            url: link ? (link.startsWith('http') ? link : `${this.baseUrl}${link}`) : this.baseUrl
          });
        }
      });

    } catch (error) {
      console.error('Direct scraping error:', error);
    }

    return data;
  }

  /**
   * Fetch content using Jina AI
   */
  private async fetchWithJina(url: string): Promise<string> {
    const response = await axios.get(`https://r.jina.ai/${url}`, {
      headers: {
        'Authorization': `Bearer ${this.jinaApiKey}`,
        'X-Return-Format': 'markdown',
        'X-Timeout': '30'
      },
      timeout: 35000
    });

    return response.data;
  }

  /**
   * Extract deadline dates from text
   */
  private extractDeadlines(text: string): NUSTData['deadlines'] {
    const deadlines: NUSTData['deadlines'] = {};

    // Common date patterns
    const dateRegex = /(\d{1,2})[\s\-\/]+(January|February|March|April|May|June|July|August|September|October|November|December)[\s\-\/]+(\d{4})/gi;

    // Keywords for different deadlines
    const patterns = {
      applicationDeadline: /(?:last date|deadline|apply by|registration close|application close)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
      testDate: /(?:test date|entry test|examination)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
      applicationStart: /(?:application start|registration open|apply from)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i
    };

    // Try to extract each deadline
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        try {
          const date = new Date(match[1]);
          if (!isNaN(date.getTime())) {
            deadlines[key as keyof typeof deadlines] = date;
          }
        } catch (e) {
          console.warn(`Failed to parse date: ${match[1]}`);
        }
      }
    }

    return deadlines;
  }

  /**
   * Extract merit lists from text
   */
  private extractMeritLists(text: string): NUSTData['meritLists'] {
    const meritLists: NUSTData['meritLists'] = [];

    // Pattern: "Computer Science: 85.5%" or "CS - 85.5"
    const meritRegex = /(Computer Science|Software Engineering|Electrical Engineering|Mechanical Engineering|Civil Engineering|CS|SE|EE|ME|CE)[:\s\-]+(\d{2,3}\.?\d{0,2})%?/gi;

    let match;
    while ((match = meritRegex.exec(text)) !== null) {
      const program = match[1];
      const merit = parseFloat(match[2]);

      if (merit >= 50 && merit <= 100) {
        meritLists.push({
          program,
          closingMerit: merit,
          year: new Date().getFullYear()
        });
      }
    }

    return meritLists;
  }

  /**
   * Extract announcements
   */
  private extractAnnouncements(text: string, sourceUrl: string): NUSTData['announcements'] {
    const announcements: NUSTData['announcements'] = [];

    // Split text into paragraphs
    const paragraphs = text.split('\n\n');

    for (const para of paragraphs) {
      // Look for announcement-like content
      if (para.length > 50 && para.length < 500) {
        const lines = para.split('\n');
        if (lines.length >= 2) {
          announcements.push({
            title: lines[0].substring(0, 100),
            description: para.substring(0, 300),
            url: sourceUrl
          });
        }
      }
    }

    return announcements.slice(0, 5); // Return top 5
  }
}


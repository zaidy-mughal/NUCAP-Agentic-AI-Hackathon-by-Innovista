/**
 * FAST-specific scraper
 * Website: https://www.nu.edu.pk
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export interface FASTData {
  deadlines: {
    applicationStart?: Date;
    applicationDeadline?: Date;
    testDate?: Date;
    meritListDates?: Date[];
  };
  meritLists: Array<{
    program: string;
    campus: string;
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

export class FASTScraper {
  private baseUrl = 'https://www.nu.edu.pk';
  private jinaApiKey: string;

  constructor(jinaApiKey: string) {
    this.jinaApiKey = jinaApiKey;
  }

  async scrape(): Promise<FASTData> {
    console.log('🎓 Scraping FAST...');

    const data: FASTData = {
      deadlines: {},
      meritLists: [],
      announcements: []
    };

    try {
      // Scrape admissions page
      const admissionContent = await this.fetchWithJina(`${this.baseUrl}/Admissions`);
      data.deadlines = this.extractDeadlines(admissionContent);
      data.announcements = this.extractAnnouncements(admissionContent);
    } catch (error) {
      console.error('FAST scraping error:', error);
    }

    return data;
  }

  private async fetchWithJina(url: string): Promise<string> {
    const response = await axios.get(`https://r.jina.ai/${url}`, {
      headers: {
        'Authorization': `Bearer ${this.jinaApiKey}`,
        'X-Return-Format': 'markdown'
      },
      timeout: 30000
    });
    return response.data;
  }

  private extractDeadlines(text: string): FASTData['deadlines'] {
    const deadlines: FASTData['deadlines'] = {};
    
    const patterns = {
      applicationDeadline: /(?:last date|deadline|apply by)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
      testDate: /(?:test date|entry test)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        try {
          const date = new Date(match[1]);
          if (!isNaN(date.getTime())) {
            deadlines[key as keyof typeof deadlines] = date;
          }
        } catch (e) {}
      }
    }

    return deadlines;
  }

  private extractAnnouncements(text: string): FASTData['announcements'] {
    const announcements: FASTData['announcements'] = [];
    const paragraphs = text.split('\n\n');

    for (const para of paragraphs.slice(0, 5)) {
      if (para.length > 50 && para.length < 500) {
        const lines = para.split('\n');
        if (lines.length >= 2) {
          announcements.push({
            title: lines[0].substring(0, 100),
            description: para.substring(0, 300),
            url: this.baseUrl
          });
        }
      }
    }

    return announcements;
  }
}


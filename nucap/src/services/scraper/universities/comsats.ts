/**
 * COMSATS-specific scraper
 * Website: https://www.comsats.edu.pk
 */

import axios from 'axios';

export interface COMSATSData {
  deadlines: {
    applicationStart?: Date;
    applicationDeadline?: Date;
    testDate?: Date;
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
    url: string;
  }>;
}

export class COMSATSScraper {
  private baseUrl = 'https://www.comsats.edu.pk';
  private jinaApiKey: string;

  constructor(jinaApiKey: string) {
    this.jinaApiKey = jinaApiKey;
  }

  async scrape(): Promise<COMSATSData> {
    console.log('🎓 Scraping COMSATS...');

    const data: COMSATSData = {
      deadlines: {},
      meritLists: [],
      announcements: []
    };

    try {
      const admissionContent = await this.fetchWithJina(`${this.baseUrl}/Admissions.aspx`);
      data.deadlines = this.extractDeadlines(admissionContent);
      data.announcements = this.extractAnnouncements(admissionContent);
    } catch (error) {
      console.error('COMSATS scraping error:', error);
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

  private extractDeadlines(text: string): COMSATSData['deadlines'] {
    const deadlines: COMSATSData['deadlines'] = {};
    
    const patterns = {
      applicationDeadline: /(?:last date|deadline)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
      testDate: /(?:test date|NTS test)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-\/]+\d{4})/i,
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

  private extractAnnouncements(text: string): COMSATSData['announcements'] {
    const announcements: COMSATSData['announcements'] = [];
    const paragraphs = text.split('\n\n');

    for (const para of paragraphs.slice(0, 5)) {
      if (para.length > 50 && para.length < 500) {
        announcements.push({
          title: para.split('\n')[0].substring(0, 100),
          description: para.substring(0, 300),
          url: this.baseUrl
        });
      }
    }

    return announcements;
  }
}


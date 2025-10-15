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
  private admissionsUrl = 'https://admissions.nu.edu.pk/';
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
      // Scrape admission schedule page
      const scheduleContent = await this.fetchWithJina(`${this.baseUrl}/admissions/schedule`);
      data.deadlines = this.extractDeadlines(scheduleContent);
      data.announcements = this.extractAnnouncements(scheduleContent);
      
      console.log(`  ✓ Found ${Object.keys(data.deadlines).length} deadlines`);
      console.log(`  ✓ Found ${data.announcements.length} announcements`);
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
    
    // FAST-specific patterns based on actual table format
    // Table format: "| Admission Application Submission | May 19 (Mon) - Jul 4 (Fri) |"
    
    // Pattern 1: Application submission "May 19 (Mon) - Jul 4 (Fri)"
    const appPattern = /([A-Za-z]+)\s+(\d{1,2})\s*\([A-Za-z]+\)\s*-\s*([A-Za-z]+)\s+(\d{1,2})\s*\(([A-Za-z]+)\)/gi;
    let match = appPattern.exec(text);
    
    if (match) {
      try {
        // Extract year from context (look for year in text)
        const yearMatch = text.match(/\b(202[0-9])\b/);
        const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
        
        const dateStr = `${match[3]} ${match[4]}, ${year}`;
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          deadlines.applicationDeadline = date;
          console.log(`  → Application deadline: ${dateStr}`);
        }
      } catch (e) {}
    }

    // Pattern 2: Admission Tests "Jul 7 (Mon) - Jul 18 (Fri)"
    const testPattern = /Admission Tests.*?([A-Za-z]+)\s+(\d{1,2})\s*\([A-Za-z]+\)\s*-\s*([A-Za-z]+)\s+(\d{1,2})\s*\([A-Za-z]+\)/gi;
    match = testPattern.exec(text);
    if (match) {
      try {
        const yearMatch = text.match(/\b(202[0-9])\b/);
        const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
        
        const dateStr = `${match[1]} ${match[2]}, ${year}`;
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          deadlines.testDate = date;
          console.log(`  → Test starts: ${dateStr}`);
        }
      } catch (e) {}
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


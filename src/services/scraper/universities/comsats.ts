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
  private lahoreUrl = 'https://lahore.comsats.edu.pk';
  private islamabadUrl = 'https://islamabad.comsats.edu.pk';
  private admissionsUrl = 'https://admissions.comsats.edu.pk/';
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
      // Try Lahore campus schedule first (most detailed)
      const lahoreContent = await this.fetchWithJina(`${this.lahoreUrl}/admissions/admissions-schedule.aspx`);
      data.deadlines = this.extractDeadlines(lahoreContent);
      data.announcements = this.extractAnnouncements(lahoreContent);
      
      console.log(`  ✓ Found ${Object.keys(data.deadlines).length} deadlines`);
      console.log(`  ✓ Found ${data.announcements.length} announcements`);
    } catch (error) {
      console.error('COMSATS scraping error:', error);
      
      // Fallback to main site
      try {
        const mainContent = await this.fetchWithJina(`${this.baseUrl}/Admissions.aspx`);
        data.deadlines = this.extractDeadlines(mainContent);
        data.announcements = this.extractAnnouncements(mainContent);
      } catch (fallbackError) {
        console.error('COMSATS fallback also failed:', fallbackError);
      }
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
    
    // COMSATS-specific patterns based on actual table format
    // Format: "Admissions Open Sunday, June 01, 2025"
    //         "Application Deadline Extended Monday, July 21, 2025"
    
    // Pattern 1: Admissions Open "Sunday, June 01, 2025"
    const openPattern = /Admissions?\s+Open.*?([A-Za-z]+),?\s+([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi;
    let match = openPattern.exec(text);
    if (match) {
      try {
        const dateStr = `${match[2]} ${match[3]}, ${match[4]}`;
        console.log(`  → Admissions open: ${dateStr}`);
      } catch (e) {}
    }

    // Pattern 2: Application Deadline "Monday, July 21, 2025"
    const deadlinePattern = /Application\s+Deadline.*?([A-Za-z]+),?\s+([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi;
    match = deadlinePattern.exec(text);
    if (match) {
      try {
        const dateStr = `${match[2]} ${match[3]}, ${match[4]}`;
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          deadlines.applicationDeadline = date;
          console.log(`  → Application deadline: ${dateStr}`);
        }
      } catch (e) {}
    }

    // Pattern 3: Entry Test "July 13, 2025" or "July 27-28, 2025"
    const testPattern = /Entry\s+Test.*?([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi;
    const testMatches = Array.from(text.matchAll(testPattern));
    if (testMatches.length > 0) {
      try {
        const firstTest = testMatches[0];
        const dateStr = `${firstTest[1]} ${firstTest[2]}, ${firstTest[3]}`;
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          deadlines.testDate = date;
          console.log(`  → First test date: ${dateStr}`);
        }
      } catch (e) {}
    }

    // Pattern 4: Display of Merit List "Wednesday, Aug 06, 2025"
    const meritPattern = /(?:Display of )?Merit\s+List.*?([A-Za-z]+),?\s+([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi;
    match = meritPattern.exec(text);
    if (match) {
      try {
        const dateStr = `${match[2]} ${match[3]}, ${match[4]}`;
        console.log(`  → Merit list: ${dateStr}`);
      } catch (e) {}
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


/**
 * University Web Scraping Service using Jina AI
 * Scrapes admission data, merit lists, and deadlines from university websites
 */

import axios from 'axios';
import { prisma } from '@/lib/prisma';

export interface ScraperConfig {
  universityId: string;
  universityName: string;
  shortName: string;
  websiteUrl: string;
  pages: {
    admissionPage?: string;
    meritPage?: string;
    announcementPage?: string;
  };
}

export interface ScrapedData {
  deadlines?: {
    applicationStart?: Date;
    applicationDeadline?: Date;
    testDate?: Date;
    firstMeritList?: Date;
    secondMeritList?: Date;
    thirdMeritList?: Date;
    finalMeritList?: Date;
  };
  meritLists?: Array<{
    departmentName: string;
    degree: string;
    closingMerit: number;
    year: number;
    cycle: string;
  }>;
  updates?: Array<{
    title: string;
    description: string;
    publishedDate?: Date;
    sourceUrl: string;
  }>;
}

export class UniversityScraper {
  private jinaApiKey: string;
  
  constructor() {
    this.jinaApiKey = process.env.JINA_API_KEY || '';
    if (!this.jinaApiKey) {
      throw new Error('JINA_API_KEY is not set in environment variables');
    }
  }

  /**
   * Scrape a university website using Jina AI
   */
  async scrapeUniversity(config: ScraperConfig): Promise<{
    success: boolean;
    data?: ScrapedData;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`Starting scrape for ${config.universityName}...`);
      
      // Scrape different pages
      const [admissionData, meritData, announcementData] = await Promise.all([
        config.pages.admissionPage 
          ? this.scrapeWithJina(config.pages.admissionPage)
          : null,
        config.pages.meritPage 
          ? this.scrapeWithJina(config.pages.meritPage)
          : null,
        config.pages.announcementPage 
          ? this.scrapeWithJina(config.pages.announcementPage)
          : null
      ]);

      // Parse and structure data
      const structured = await this.parseData(
        config,
        admissionData,
        meritData,
        announcementData
      );

      // Save to database
      await this.saveToDatabase(config.universityId, structured);

      // Log success
      const executionTime = Date.now() - startTime;
      await this.logScraping(config.universityId, 'success', 'all', executionTime);

      console.log(`✓ Successfully scraped ${config.universityName} in ${executionTime}ms`);

      return { success: true, data: structured };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.logScraping(
        config.universityId, 
        'failed', 
        'all', 
        executionTime, 
        errorMessage
      );

      console.error(`✗ Failed to scrape ${config.universityName}:`, errorMessage);

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Scrape a URL using Jina AI Reader API
   */
  private async scrapeWithJina(url: string): Promise<string> {
    try {
      console.log(`Scraping URL: ${url}`);
      
      const response = await axios.get(
        `https://r.jina.ai/${url}`,
        {
          headers: {
            'Authorization': `Bearer ${this.jinaApiKey}`,
            'X-Return-Format': 'markdown',
            'X-Timeout': '30'
          },
          timeout: 35000 // 35 seconds
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Jina API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search using Jina AI Search API
   */
  private async searchWithJina(queries: string[]): Promise<any> {
    try {
      const response = await axios.post(
        'https://s.jina.ai/',
        {
          q: queries.join(' OR '),
          count: 5
        },
        {
          headers: {
            'Authorization': `Bearer ${this.jinaApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Jina Search API error:', error);
      return null;
    }
  }

  /**
   * Parse scraped data into structured format
   */
  private async parseData(
    config: ScraperConfig,
    admissionHtml: string | null,
    meritHtml: string | null,
    announcementHtml: string | null
  ): Promise<ScrapedData> {
    const structured: ScrapedData = {};

    // Extract deadlines from admission page
    if (admissionHtml) {
      structured.deadlines = this.extractDeadlines(admissionHtml);
    }

    // Extract merit lists
    if (meritHtml) {
      structured.meritLists = this.extractMeritLists(meritHtml, config.shortName);
    }

    // Extract announcements/updates
    if (announcementHtml) {
      structured.updates = this.extractAnnouncements(
        announcementHtml, 
        config.websiteUrl
      );
    }

    return structured;
  }

  /**
   * Extract deadline dates from text
   */
  private extractDeadlines(text: string): ScrapedData['deadlines'] {
    const deadlines: ScrapedData['deadlines'] = {};

    // Common date patterns
    const datePatterns = [
      /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g, // DD/MM/YYYY or DD-MM-YYYY
      /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g, // YYYY/MM/DD or YYYY-MM-DD
      /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi
    ];

    // Keywords for different deadline types
    const keywords = {
      applicationStart: ['application start', 'registration start', 'apply from'],
      applicationDeadline: ['last date', 'deadline', 'application close', 'registration close'],
      testDate: ['test date', 'entry test', 'examination date'],
      firstMeritList: ['1st merit', 'first merit'],
      secondMeritList: ['2nd merit', 'second merit'],
      thirdMeritList: ['3rd merit', 'third merit'],
      finalMeritList: ['final merit', 'last merit']
    };

    // This is a simplified extraction - in production, you'd use more sophisticated NLP
    // or integrate with an LLM for better accuracy

    return deadlines;
  }

  /**
   * Extract merit list data from text
   */
  private extractMeritLists(
    text: string, 
    universityShortName: string
  ): ScrapedData['meritLists'] {
    const meritLists: ScrapedData['meritLists'] = [];

    // This is a placeholder - actual implementation would use regex patterns
    // or LLM to extract department names, degrees, and closing merits
    // Example pattern: "Computer Science BS - 85.5%"

    return meritLists;
  }

  /**
   * Extract announcements/updates from text
   */
  private extractAnnouncements(
    text: string, 
    baseUrl: string
  ): ScrapedData['updates'] {
    const updates: ScrapedData['updates'] = [];

    // This is a placeholder - actual implementation would extract
    // titles, descriptions, and dates from the announcement page

    return updates;
  }

  /**
   * Save scraped data to database
   */
  private async saveToDatabase(
    universityId: string,
    data: ScrapedData
  ): Promise<void> {
    try {
      // Update admission timeline if deadlines found
      if (data.deadlines && Object.keys(data.deadlines).length > 0) {
        const currentYear = new Date().getFullYear();
        const cycle = new Date().getMonth() >= 6 ? `Fall ${currentYear}` : `Spring ${currentYear}`;

        await prisma.admissionTimeline.upsert({
          where: {
            universityId_year_cycle: {
              universityId,
              year: currentYear,
              cycle
            }
          },
          update: {
            ...data.deadlines,
            lastUpdated: new Date(),
            updatedBy: 'system',
            scrapedData: data.deadlines as any
          },
          create: {
            universityId,
            year: currentYear,
            cycle,
            ...data.deadlines,
            updatedBy: 'system',
            scrapedData: data.deadlines as any
          }
        });
      }

      // Save merit lists if found
      if (data.meritLists && data.meritLists.length > 0) {
        for (const merit of data.meritLists) {
          // Find or create department
          const department = await prisma.department.findFirst({
            where: {
              universityId,
              name: merit.departmentName,
              degree: merit.degree
            }
          });

          if (department) {
            await prisma.meritList.create({
              data: {
                universityId,
                departmentId: department.id,
                year: merit.year,
                admissionCycle: merit.cycle,
                meritType: 'Final',
                closingMerit: merit.closingMerit
              }
            });
          }
        }
      }

      // Save updates/announcements
      if (data.updates && data.updates.length > 0) {
        for (const update of data.updates) {
          await prisma.universityUpdate.create({
            data: {
              universityId,
              title: update.title,
              description: update.description,
              updateType: 'general',
              priority: 'medium',
              sourceUrl: update.sourceUrl,
              publishedDate: update.publishedDate,
              isManual: false
            }
          });
        }
      }

      // Update university last scraped timestamp
      await prisma.university.update({
        where: { id: universityId },
        data: { lastScraped: new Date() }
      });

    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  }

  /**
   * Log scraping activity
   */
  private async logScraping(
    universityId: string,
    status: 'success' | 'failed',
    dataType: string,
    executionTime: number,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.scrapingLog.create({
        data: {
          universityId,
          status,
          dataType,
          executionTime,
          errorMessage,
          scheduledAt: new Date(),
          completedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error logging scraping activity:', error);
    }
  }
}

/**
 * University scraping configurations
 */
export const UNIVERSITY_CONFIGS: ScraperConfig[] = [
  {
    universityId: 'nust',
    universityName: 'National University of Sciences & Technology',
    shortName: 'NUST',
    websiteUrl: 'https://nust.edu.pk',
    pages: {
      admissionPage: 'https://nust.edu.pk/admissions/undergraduate',
      meritPage: 'https://nust.edu.pk/admissions/merit-lists',
      announcementPage: 'https://nust.edu.pk/admissions/announcements'
    }
  },
  {
    universityId: 'fast',
    universityName: 'Foundation for Advancement of Science & Technology',
    shortName: 'FAST',
    websiteUrl: 'https://www.nu.edu.pk',
    pages: {
      admissionPage: 'https://www.nu.edu.pk/Admissions',
      meritPage: 'https://www.nu.edu.pk/Admissions/MeritLists',
      announcementPage: 'https://www.nu.edu.pk/News'
    }
  },
  {
    universityId: 'comsats',
    universityName: 'COMSATS University',
    shortName: 'COMSATS',
    websiteUrl: 'https://www.comsats.edu.pk',
    pages: {
      admissionPage: 'https://www.comsats.edu.pk/Admissions.aspx',
      meritPage: 'https://www.comsats.edu.pk/admissions/MeritLists.aspx',
      announcementPage: 'https://www.comsats.edu.pk/News.aspx'
    }
  },
  {
    universityId: 'punjab',
    universityName: 'University of the Punjab',
    shortName: 'PUNJAB',
    websiteUrl: 'https://pu.edu.pk',
    pages: {
      admissionPage: 'https://pu.edu.pk/home/admission',
      meritPage: 'https://pu.edu.pk/home/merit',
      announcementPage: 'https://pu.edu.pk/home/news'
    }
  }
];

export default UniversityScraper;


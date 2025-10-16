/**
 * University Scraping Manager
 * Coordinates scraping across all universities
 */

import { prisma } from '@/lib/prisma';
import { NUSTScraper } from './universities/nust';
import { FASTScraper } from './universities/fast';
import { COMSATSScraper } from './universities/comsats';

export class ScrapingManager {
  private jinaApiKey: string;

  constructor() {
    this.jinaApiKey = process.env.JINA_API_KEY || '';
    if (!this.jinaApiKey) {
      throw new Error('JINA_API_KEY not found in environment variables');
    }
  }

  /**
   * Scrape all universities
   */
  async scrapeAll() {
    console.log('🚀 Starting scraping for all universities...');

    const results = [];

    // Get all active universities from database
    const universities = await prisma.university.findMany({
      where: { isActive: true }
    });

    for (const university of universities) {
      try {
        const result = await this.scrapeUniversity(university.shortName, university.id);
        results.push({
          university: university.name,
          success: result.success,
          message: result.message
        });
      } catch (error) {
        console.error(`Error scraping ${university.name}:`, error);
        results.push({
          university: university.name,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Scrape a specific university
   */
  async scrapeUniversity(shortName: string, universityId: string) {
    const startTime = Date.now();

    try {
      console.log(`📚 Scraping ${shortName}...`);

      let scrapedData: any = {};

      // Use appropriate scraper based on university
      switch (shortName.toUpperCase()) {
        case 'NUST':
          const nustScraper = new NUSTScraper(this.jinaApiKey);
          scrapedData = await nustScraper.scrape();
          break;

        case 'FAST':
          const fastScraper = new FASTScraper(this.jinaApiKey);
          scrapedData = await fastScraper.scrape();
          break;

        case 'COMSATS':
          const comstatsScraper = new COMSATSScraper(this.jinaApiKey);
          scrapedData = await comstatsScraper.scrape();
          break;

        default:
          console.warn(`No custom scraper for ${shortName}, using generic scraping`);
          return {
            success: false,
            message: `No scraper available for ${shortName}`
          };
      }

      // Save scraped data to database
      await this.saveToDatabase(universityId, shortName, scrapedData);

      // Log success
      const executionTime = Date.now() - startTime;
      await this.logScraping(universityId, 'success', 'all', executionTime);

      console.log(`✓ Successfully scraped ${shortName} in ${executionTime}ms`);

      return {
        success: true,
        message: `Successfully scraped ${shortName}`,
        data: scrapedData
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await this.logScraping(universityId, 'failed', 'all', executionTime, errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Save scraped data to database
   */
  private async saveToDatabase(
    universityId: string,
    shortName: string,
    scrapedData: any
  ) {
    try {
      const currentYear = new Date().getFullYear();
      const cycle = new Date().getMonth() >= 6 ? `Fall ${currentYear}` : `Spring ${currentYear}`;

      // Save deadlines if found
      if (scrapedData.deadlines && Object.keys(scrapedData.deadlines).length > 0) {
        await prisma.admissionTimeline.upsert({
          where: {
            universityId_year_cycle: {
              universityId,
              year: currentYear,
              cycle
            }
          },
          update: {
            ...scrapedData.deadlines,
            lastUpdated: new Date(),
            updatedBy: 'system',
            scrapedData: scrapedData as any
          },
          create: {
            universityId,
            year: currentYear,
            cycle,
            ...scrapedData.deadlines,
            updatedBy: 'system',
            scrapedData: scrapedData as any
          }
        });

        console.log(`  ✓ Saved deadlines for ${shortName}`);
      }

      // Save announcements if found
      if (scrapedData.announcements && scrapedData.announcements.length > 0) {
        for (const announcement of scrapedData.announcements.slice(0, 5)) {
          // Check if announcement already exists
          const existing = await prisma.universityUpdate.findFirst({
            where: {
              universityId,
              title: announcement.title
            }
          });

          if (!existing) {
            await prisma.universityUpdate.create({
              data: {
                universityId,
                title: announcement.title,
                description: announcement.description,
                updateType: 'general',
                priority: 'medium',
                sourceUrl: announcement.url,
                publishedDate: announcement.date || new Date(),
                isManual: false
              }
            });
          }
        }

        console.log(`  ✓ Saved ${scrapedData.announcements.length} announcements for ${shortName}`);
      }

      // Save merit lists if found
      if (scrapedData.meritLists && scrapedData.meritLists.length > 0) {
        console.log(`  ⚠ Found ${scrapedData.meritLists.length} merit lists (manual review needed)`);
        // Merit lists usually need manual verification, so we just log them
      }

      // Update university's lastScraped timestamp
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
  ) {
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

  /**
   * Test a single university scraper
   */
  async test(shortName: string) {
    console.log(`🧪 Testing ${shortName} scraper...`);

    const university = await prisma.university.findFirst({
      where: { shortName }
    });

    if (!university) {
      throw new Error(`University ${shortName} not found in database`);
    }

    return await this.scrapeUniversity(shortName, university.id);
  }
}


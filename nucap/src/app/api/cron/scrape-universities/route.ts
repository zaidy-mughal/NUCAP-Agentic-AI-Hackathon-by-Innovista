import { NextRequest, NextResponse } from 'next/server';
import UniversityScraper, { UNIVERSITY_CONFIGS } from '@/services/scraper';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting scheduled university scraping...');

    const scraper = new UniversityScraper();
    
    // Get active universities from database
    const universities = await prisma.university.findMany({
      where: { isActive: true }
    });

    // Match with scraper configs
    const results = [];
    
    for (const uni of universities) {
      const config = UNIVERSITY_CONFIGS.find(
        c => c.shortName === uni.shortName
      );

      if (config) {
        console.log(`Scraping ${uni.name}...`);
        const result = await scraper.scrapeUniversity({
          ...config,
          universityId: uni.id
        });
        results.push({
          university: uni.name,
          ...result
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log(`Scraping completed: ${successCount} successful, ${failedCount} failed`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        successful: successCount,
        failed: failedCount
      },
      results
    });

  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow manual trigger via POST
export async function POST(request: NextRequest) {
  return GET(request);
}


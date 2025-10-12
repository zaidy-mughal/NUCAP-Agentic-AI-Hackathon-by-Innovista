/**
 * CLI tool to test university scrapers
 * Usage: npx tsx scripts/test-scraper.ts [NUST|FAST|COMSATS]
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { ScrapingManager } from '../src/services/scraper/manager';

async function main() {
  const args = process.argv.slice(2);
  const universityName = args[0]?.toUpperCase();

  if (!universityName) {
    console.log('Usage: npx tsx scripts/test-scraper.ts [NUST|FAST|COMSATS]');
    console.log('Example: npx tsx scripts/test-scraper.ts NUST');
    process.exit(1);
  }

  console.log(`\n🧪 Testing ${universityName} scraper...\n`);

  try {
    const manager = new ScrapingManager();
    const result = await manager.test(universityName);

    console.log('\n' + '='.repeat(50));
    console.log('📊 SCRAPING RESULTS');
    console.log('='.repeat(50) + '\n');

    console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`Message: ${result.message}`);

    if (result.data) {
      console.log('\n📅 Deadlines Found:');
      console.log(JSON.stringify(result.data.deadlines, null, 2));

      console.log(`\n📰 Announcements Found: ${result.data.announcements?.length || 0}`);
      if (result.data.announcements?.length > 0) {
        result.data.announcements.forEach((ann: any, i: number) => {
          console.log(`  ${i + 1}. ${ann.title}`);
        });
      }

      console.log(`\n📊 Merit Lists Found: ${result.data.meritLists?.length || 0}`);
      if (result.data.meritLists?.length > 0) {
        result.data.meritLists.forEach((merit: any) => {
          console.log(`  - ${merit.program}: ${merit.closingMerit}%`);
        });
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();


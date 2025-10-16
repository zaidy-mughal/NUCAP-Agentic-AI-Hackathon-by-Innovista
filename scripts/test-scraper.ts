/**
 * CLI tool to test university scrapers
 * Usage: npx tsx scripts/test-scraper.ts [NUST|FAST|COMSATS|ALL]
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
    console.log('Usage: npx tsx scripts/test-scraper.ts [NUST|FAST|COMSATS|ALL]');
    console.log('Example: npx tsx scripts/test-scraper.ts NUST');
    console.log('Example: npx tsx scripts/test-scraper.ts ALL');
    process.exit(1);
  }

  console.log(`\n🧪 Testing ${universityName} scraper(s)...\n`);

  try {
    const manager = new ScrapingManager();
    let results = [];
    
    if (universityName === 'ALL') {
      const allResults = await manager.scrapeAll();
      results = allResults;
    } else {
      const result = await manager.test(universityName);
      results = [result];
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SCRAPING RESULTS');
    console.log('='.repeat(50) + '\n');

    for (const result of results) {
      console.log(`\n🏫 University: ${result.universityName || universityName}`);
      console.log(`Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
      console.log(`Message: ${result.message || (result.error ? result.error : 'OK')}`);

      if (result.data) {
        console.log('\n📅 Deadlines Found:');
        console.log(JSON.stringify(result.data.deadlines, null, 2));

        console.log(`\n📰 Announcements Found: ${result.data.announcements?.length || 0}`);
        if (result.data.announcements?.length > 0) {
          result.data.announcements.slice(0, 3).forEach((ann: any, i: number) => {
            const title = (ann.title || ann.description || 'No title').substring(0, 80);
            console.log(`  ${i + 1}. ${title}`);
          });
        }

        console.log(`\n📊 Merit Lists Found: ${result.data.meritLists?.length || 0}`);
        if (result.data.meritLists?.length > 0) {
          result.data.meritLists.forEach((merit: any) => {
            console.log(`  - ${merit.program}: ${merit.closingMerit}%`);
          });
        }
      }

      console.log('\n' + '-'.repeat(50));
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`\n📈 SUMMARY`);
    console.log(`   Total: ${results.length}`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('\n' + '='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();


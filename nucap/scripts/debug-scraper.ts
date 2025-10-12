/**
 * Debug script to see what Jina AI actually returns
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

async function debugJina(url: string) {
  const jinaApiKey = process.env.JINA_API_KEY;
  
  if (!jinaApiKey) {
    console.error('❌ JINA_API_KEY not found');
    process.exit(1);
  }

  console.log(`\n🔍 Fetching: ${url}\n`);

  try {
    const response = await axios.get(
      `https://r.jina.ai/${url}`,
      {
        headers: {
          'Authorization': `Bearer ${jinaApiKey}`,
          'X-Return-Format': 'markdown'
        },
        timeout: 30000
      }
    );

    console.log('📄 Content Preview (first 2000 characters):\n');
    console.log('═'.repeat(80));
    console.log(response.data.substring(0, 2000));
    console.log('═'.repeat(80));
    
    // Look for date patterns
    console.log('\n🔍 Searching for date patterns...\n');
    
    const datePatterns = [
      /Registration[:\s]+([A-Za-z]+)\s+(\d{1,2})\s*-\s*([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/gi,
      /([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/g,
      /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/g,
      /Series\s+(\d+):\s+Registration\s+([A-Za-z]+\s+\d{1,2}\s*-\s*[A-Za-z]+\s+\d{1,2},?\s+\d{4})/gi
    ];

    for (const pattern of datePatterns) {
      const matches = Array.from(response.data.matchAll(pattern));
      if (matches.length > 0) {
        console.log(`Pattern: ${pattern}`);
        matches.slice(0, 5).forEach((match, i) => {
          console.log(`  Match ${i + 1}: ${match[0]}`);
        });
        console.log('');
      }
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

async function main() {
  const urls = [
    'https://nust.edu.pk/admissions/undergraduates/dates-to-remember/',
    'https://www.nu.edu.pk/admissions/schedule',
    'https://lahore.comsats.edu.pk/admissions/admissions-schedule.aspx'
  ];

  for (const url of urls) {
    await debugJina(url);
    console.log('\n' + '='.repeat(80) + '\n');
  }
}

main().catch(console.error);


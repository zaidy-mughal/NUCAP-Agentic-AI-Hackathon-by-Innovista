/**
 * See full content from Jina AI
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import * as fs from 'fs';

config({ path: resolve(__dirname, '../.env.local') });

async function fetchAndSave(url: string, filename: string) {
  const jinaApiKey = process.env.JINA_API_KEY;
  
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

    // Save to file
    const outputPath = resolve(__dirname, `../debug-output-${filename}.txt`);
    fs.writeFileSync(outputPath, response.data);
    console.log(`✅ Saved to: debug-output-${filename}.txt`);
    console.log(`📏 Length: ${response.data.length} characters`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  await fetchAndSave('https://nust.edu.pk/admissions/undergraduates/dates-to-remember/', 'nust');
  await fetchAndSave('https://www.nu.edu.pk/admissions/schedule', 'fast');
  await fetchAndSave('https://lahore.comsats.edu.pk/admissions/admissions-schedule.aspx', 'comsats');
}

main().catch(console.error);


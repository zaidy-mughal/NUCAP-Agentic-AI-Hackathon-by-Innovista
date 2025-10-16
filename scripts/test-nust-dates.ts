// Load dotenv first before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Now import other modules
import { getSqlClient } from '@/lib/db';
import { customAlphabet } from 'nanoid';

// Create a nanoid generator for cuid-like IDs
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 24);

interface NustSeriesItem {
  name: string;
  online_registration: string | null;
  cbnet: string | null;
  pbnet: string | null;
  test_centre: string | null;
}

async function testNustDatesInsert() {
  console.log('Testing NUST dates insertion...\n');
  
  // Get SQL client with error handling
  const { client: sql, error } = getSqlClient();
  if (error) {
    console.error('Failed to initialize SQL client:', error);
    process.exit(1);
  }
  
  try {
    // Test data similar to what would come from n8n
    const testData = {
      output: {
        series: [
          {
            name: "Series 1",
            online_registration: "5 Oct - 21 Nov 2025",
            cbnet: "22 Nov 2025 onwards",
            pbnet: null,
            test_centre: "Isb"
          }
        ]
      }
    };
    
    console.log('Inserting test data...');
    
    // Process the data similar to the API route
    const series = testData.output.series;
    const results = await Promise.all(
      series.map(async (item: NustSeriesItem) => {
        // Generate a unique ID for each record
        const id = `nust_${generateId()}`;
        // Generate timestamps
        const now = new Date().toISOString();
        
        console.log(`Inserting record with ID: ${id}`);
        console.log(`Data:`, item);
        
        return await sql`
          INSERT INTO nust_test_series (
            "id",
            "seriesName",
            "onlineRegistration",
            "cbnet",
            "pbnet",
            "testCentre",
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${id},
            ${item.name},
            ${item.online_registration},
            ${item.cbnet},
            ${item.pbnet},
            ${item.test_centre},
            ${now},
            ${now}
          )
          ON CONFLICT ("seriesName")
          DO UPDATE SET
            "onlineRegistration" = EXCLUDED."onlineRegistration",
            "cbnet" = EXCLUDED."cbnet",
            "pbnet" = EXCLUDED."pbnet",
            "testCentre" = EXCLUDED."testCentre",
            "updatedAt" = CURRENT_TIMESTAMP
          RETURNING *
        `;
      })
    );
    
    console.log('\n✅ Successfully inserted data:');
    console.log(results.flat());
    
    // Test retrieval
    console.log('\nRetrieving data...');
    const dates = await sql`
      SELECT * FROM nust_test_series 
      ORDER BY "seriesName"
    `;
    
    console.log('✅ Retrieved data:');
    console.log(dates);
    
    // Clean up test data
    console.log('\nCleaning up test data...');
    await sql`
      DELETE FROM nust_test_series 
      WHERE "seriesName" = ${testData.output.series[0].name}
    `;
    
    console.log('✅ Clean up completed');
    console.log('\n🎉 All tests passed! The ID generation fix is working correctly.');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  }
}

testNustDatesInsert();
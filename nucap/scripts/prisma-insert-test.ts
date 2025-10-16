import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testPrismaInsert() {
  console.log('Testing Prisma data insertion to Neon database...\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL found:', databaseUrl ? '✅ Yes' : '❌ No');
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
  
  try {
    // Test data insertion
    console.log('\n1. Testing data insertion...');
    const testUniversity = await prisma.university.create({
      data: {
        name: 'Test University ' + Date.now(),
        shortName: 'TEST' + Date.now(),
        location: 'Test City',
        website: 'https://test.edu.pk',
        testRequired: 'None',
        isActive: true
      }
    });
    console.log(`   ✅ Successfully inserted test university: ${testUniversity.shortName} (ID: ${testUniversity.id})`);
    
    // Test data update
    console.log('\n2. Testing data update...');
    const updatedUniversity = await prisma.university.update({
      where: { id: testUniversity.id },
      data: {
        location: 'Updated Test City'
      }
    });
    console.log(`   ✅ Successfully updated university: ${updatedUniversity.location}`);
    
    // Test data retrieval of inserted record
    console.log('\n3. Testing data retrieval of inserted record...');
    const retrievedUniversity = await prisma.university.findUnique({
      where: { id: testUniversity.id }
    });
    console.log(`   ✅ Successfully retrieved university: ${retrievedUniversity?.name}`);
    
    // Clean up - delete the test record
    console.log('\n4. Cleaning up test data...');
    await prisma.university.delete({
      where: { id: testUniversity.id }
    });
    console.log('   ✅ Test data cleaned up successfully');
    
    await prisma.$disconnect();
    console.log('\n🎉 All Prisma data operations passed! Database insertion and updates are working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing Prisma data operations:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testPrismaInsert();
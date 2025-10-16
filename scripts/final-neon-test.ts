import { neon } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function finalNeonTest() {
  console.log('🧪 Final Comprehensive Neon Database Integration Test\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL found:', databaseUrl ? '✅ Yes' : '❌ No');
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }
  
  try {
    // Test 1: Neon client connection
    console.log('1. Testing Neon client connection...');
    const sql = neon(databaseUrl);
    console.log('   ✅ Neon client created successfully');
    
    // Test 2: Simple Neon query
    console.log('\n2. Testing simple Neon query...');
    const neonResult = await sql`SELECT 1 as test`;
    console.log('   ✅ Neon query executed successfully:', neonResult);
    
    // Test 3: Neon data retrieval
    console.log('\n3. Testing Neon data retrieval...');
    const neonCount = await sql`SELECT COUNT(*) as count FROM universities`;
    console.log('   ✅ Neon data retrieved successfully. Universities count:', neonCount[0].count);
    
    // Test 4: Prisma client connection
    console.log('\n4. Testing Prisma client connection...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
    console.log('   ✅ Prisma client created successfully');
    
    // Test 5: Simple Prisma query
    console.log('\n5. Testing simple Prisma query...');
    const prismaResult = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Prisma query executed successfully:', prismaResult);
    
    // Test 6: Prisma data retrieval
    console.log('\n6. Testing Prisma data retrieval...');
    const prismaCount = await prisma.university.count();
    console.log('   ✅ Prisma data retrieved successfully. Universities count:', prismaCount);
    
    // Test 7: Prisma data insertion
    console.log('\n7. Testing Prisma data insertion...');
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
    console.log(`   ✅ Successfully inserted test university: ${testUniversity.shortName}`);
    
    // Test 8: Neon data retrieval of new record
    console.log('\n8. Testing Neon retrieval of new record...');
    const neonRetrieved = await sql`SELECT name, shortName FROM universities WHERE id = ${testUniversity.id}`;
    console.log('   ✅ Neon retrieved new record:', neonRetrieved[0]);
    
    // Test 9: Prisma data update
    console.log('\n9. Testing Prisma data update...');
    const updatedUniversity = await prisma.university.update({
      where: { id: testUniversity.id },
      data: {
        location: 'Updated Test City'
      }
    });
    console.log(`   ✅ Successfully updated university: ${updatedUniversity.location}`);
    
    // Test 10: Clean up
    console.log('\n10. Cleaning up test data...');
    await prisma.university.delete({
      where: { id: testUniversity.id }
    });
    console.log('   ✅ Test data cleaned up successfully');
    
    await prisma.$disconnect();
    
    console.log('\n🎉 ALL TESTS PASSED! Neon database integration is fully working.');
    console.log('\n📋 Summary of capabilities verified:');
    console.log('   ✅ Neon client connection: Working');
    console.log('   ✅ Neon data retrieval: Working');
    console.log('   ✅ Prisma client connection: Working');
    console.log('   ✅ Prisma data retrieval: Working');
    console.log('   ✅ Prisma data insertion: Working');
    console.log('   ✅ Prisma data update: Working');
    console.log('   ✅ Cross-client compatibility: Working');
    
  } catch (error) {
    console.error('❌ Error during comprehensive test:', error);
    process.exit(1);
  }
}

finalNeonTest();
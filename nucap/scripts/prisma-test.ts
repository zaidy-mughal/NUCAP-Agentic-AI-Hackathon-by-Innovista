import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testPrismaConnection() {
  console.log('Testing Prisma connection to Neon database...\n');
  
  const databaseUrl = process.env.DATABASE_URL;
  console.log('DATABASE_URL found:', databaseUrl ? '✅ Yes' : '❌ No');
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set in environment variables');
    process.exit(1);
  }
  
  try {
    // Test Prisma connection
    console.log('\n1. Testing Prisma connection...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });
    
    console.log('   ✅ Prisma client created successfully');
    
    // Test simple query
    console.log('\n2. Testing simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Query executed successfully:', result);
    
    // Test data retrieval
    console.log('\n3. Testing data retrieval...');
    const count = await prisma.university.count();
    console.log('   ✅ Data retrieved successfully. Universities count:', count);
    
    // Test data retrieval with actual data
    console.log('\n4. Retrieving university data...');
    const universities = await prisma.university.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        shortName: true
      }
    });
    console.log('   ✅ Retrieved university data:');
    universities.forEach(uni => {
      console.log(`      - ${uni.shortName}: ${uni.name}`);
    });
    
    await prisma.$disconnect();
    console.log('\n🎉 All Prisma tests passed! Database connection is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing Prisma connection:', error);
    process.exit(1);
  }
}

testPrismaConnection();
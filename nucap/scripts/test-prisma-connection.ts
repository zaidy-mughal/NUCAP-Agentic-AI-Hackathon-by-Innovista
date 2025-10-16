import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPrismaConnection() {
  console.log('Testing Prisma connection with detailed configuration...\n');

  try {
    // Check environment variables
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.substring(0, 50)}...` : 'NOT SET');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Try to create Prisma client with explicit configuration
    console.log('\nCreating Prisma client...');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['query', 'info', 'warn', 'error'], // Enable detailed logging
    });

    console.log('Prisma client created successfully');

    // Test connection with a simple query
    console.log('\nTesting database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    console.log('Result:', result);

    // Test a more complex query to verify full functionality
    console.log('\nTesting university table access...');
    const universities = await prisma.university.findMany({
      take: 1,
      select: {
        id: true,
        name: true,
        shortName: true,
      }
    });
    console.log('✅ University table access successful');
    console.log('Sample university:', universities[0] || 'No universities found');

    await prisma.$disconnect();
    console.log('\n✅ All Prisma tests passed successfully!');
    
  } catch (error: unknown) {
    console.log('❌ Prisma connection test failed');
    console.log('Error:', (error as Error).message);
    
    // Check if it's a specific Neon/PostgreSQL connection issue
    if ((error as Error).message.includes('Can\'t reach database server')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the Neon database is running');
      console.log('3. Check if there are firewall restrictions');
      console.log('4. Try connecting with a PostgreSQL client like psql');
      console.log('5. Verify the DATABASE_URL in your .env.local file');
    }
  }
}

// Run the test
testPrismaConnection().catch(console.error);
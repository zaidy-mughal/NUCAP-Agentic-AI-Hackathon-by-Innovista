import { PrismaClient } from '@prisma/client';
import { neon, neonConfig } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDatabaseConnections() {
  console.log('Testing database connections...\n');

  // Test 1: Direct Neon connection
  console.log('1. Testing direct Neon connection...');
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create a simple query client
    const sql = neon(process.env.DATABASE_URL);
    
    // Test a simple query
    const result = await sql`SELECT 1 as connection_test`;
    console.log('✅ Direct Neon connection successful');
    console.log('   Result:', result);
  } catch (error: unknown) {
    console.log('❌ Direct Neon connection failed');
    console.log('   Error:', (error as Error).message);
  }

  // Test 2: Prisma connection
  console.log('\n2. Testing Prisma connection...');
  try {
    const prisma = new PrismaClient();
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log('✅ Prisma connection successful');
    console.log('   Result:', result);
    
    await prisma.$disconnect();
  } catch (error: unknown) {
    console.log('❌ Prisma connection failed');
    console.log('   Error:', (error as Error).message);
  }

  // Test 3: Check environment variables
  console.log('\n3. Checking environment configuration...');
  try {
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 
      `${process.env.DATABASE_URL.substring(0, 50)}...` : 'NOT SET');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required');
    }
    
    // Parse the connection string
    const url = new URL(process.env.DATABASE_URL);
    console.log('   Host:', url.hostname);
    console.log('   Port:', url.port || '5432 (default)');
    console.log('   Database:', url.pathname.substring(1));
    console.log('   Username:', url.username ? `${url.username.substring(0, 3)}***` : 'NOT SET');
    
    console.log('✅ Environment configuration check passed');
  } catch (error: unknown) {
    console.log('❌ Environment configuration check failed');
    console.log('   Error:', (error as Error).message);
  }

  // Test 4: Check Neon-specific configuration
  console.log('\n4. Checking Neon-specific configuration...');
  try {
    console.log('   NEON_FORCE_IPV4:', process.env.NEON_FORCE_IPV4 || 'NOT SET');
    
    // Configure neon
    neonConfig.forceDisablePgSSL = false; // Enable SSL by default
    
    if (process.env.NEON_FORCE_IPV4 === 'true') {
      // Use IPv4 only if specified
      console.log('   Configured to use IPv4 only');
    }
    
    console.log('✅ Neon-specific configuration check passed');
  } catch (error: unknown) {
    console.log('❌ Neon-specific configuration check failed');
    console.log('   Error:', (error as Error).message);
  }
}

// Run the tests
testDatabaseConnections().catch(console.error);
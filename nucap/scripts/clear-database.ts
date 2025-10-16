import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing all existing data from the database...');
  
  try {
    // Delete in the correct order to avoid foreign key constraints
    await prisma.studentMatch.deleteMany();
    console.log('✓ Deleted student matches');
    
    await prisma.meritList.deleteMany();
    console.log('✓ Deleted merit lists');
    
    await prisma.admissionTimeline.deleteMany();
    console.log('✓ Deleted admission timelines');
    
    await prisma.universityUpdate.deleteMany();
    console.log('✓ Deleted university updates');
    
    await prisma.scrapingLog.deleteMany();
    console.log('✓ Deleted scraping logs');
    
    await prisma.department.deleteMany();
    console.log('✓ Deleted departments');
    
    await prisma.university.deleteMany();
    console.log('✓ Deleted universities');
    
    await prisma.studentProfile.deleteMany();
    console.log('✓ Deleted student profiles');
    
    await prisma.user.deleteMany();
    console.log('✓ Deleted users');
    
    await prisma.nustTestSeries.deleteMany();
    console.log('✓ Deleted NUST test series');
    
    console.log('✅ All data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Try to fetch universities
    const universities = await prisma.university.findMany({
      take: 1
    });
    
    console.log('Database connection successful');
    console.log('Sample university:', universities[0]);
    
    // Try to create a test university
    console.log('\nTrying to create a test university...');
    const testUniversity = await prisma.university.create({
      data: {
        name: 'Test University DB',
        shortName: 'TESTDB' + Date.now(),
        location: 'Test City',
        website: 'https://test.edu.pk',
        testRequired: 'None',
        isActive: true
      }
    });
    
    console.log('University created successfully:', testUniversity.name);
    
    // Clean up - delete the test university
    await prisma.university.delete({
      where: {
        id: testUniversity.id
      }
    });
    
    console.log('Test university cleaned up');
    
  } catch (error) {
    console.error('Database test failed:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
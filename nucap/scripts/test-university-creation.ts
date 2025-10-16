import { prisma } from '@/lib/prisma';

async function testUniversityCreation() {
  try {
    console.log('Testing university creation...');
    
    // Test data that should work
    const testData = {
      name: 'Test University',
      shortName: 'TEST',
      location: 'Test City',
      website: 'https://test.edu',
      testRequired: 'None',
      isActive: true
    };
    
    console.log('Creating university with data:', testData);
    
    const university = await prisma.university.create({
      data: testData
    });
    
    console.log('University created successfully:', university);
    
    // Clean up - delete the test university
    await prisma.university.delete({
      where: { id: university.id }
    });
    
    console.log('Test university cleaned up');
  } catch (error) {
    console.error('Error creating university:', error);
  }
}

testUniversityCreation();
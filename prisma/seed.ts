import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create Universities
  const nust = await prisma.university.upsert({
    where: { shortName: 'NUST' },
    update: {},
    create: {
      name: 'National University of Sciences & Technology',
      shortName: 'NUST',
      location: 'Islamabad',
      website: 'https://nust.edu.pk',
      contactEmail: 'admissions@nust.edu.pk',
      testRequired: 'NUST',
      isActive: true
    }
  });

  const fast = await prisma.university.upsert({
    where: { shortName: 'FAST' },
    update: {},
    create: {
      name: 'Foundation for Advancement of Science & Technology',
      shortName: 'FAST',
      location: 'Islamabad, Karachi, Lahore, Peshawar',
      website: 'https://www.nu.edu.pk',
      contactEmail: 'admissions@nu.edu.pk',
      testRequired: 'FAST',
      isActive: true
    }
  });

  const comsats = await prisma.university.upsert({
    where: { shortName: 'COMSATS' },
    update: {},
    create: {
      name: 'COMSATS University',
      shortName: 'COMSATS',
      location: 'Islamabad, Lahore, Abbottabad, Attock, Sahiwal, Vehari, Wah',
      website: 'https://www.comsats.edu.pk',
      contactEmail: 'info@comsats.edu.pk',
      testRequired: 'NTS',
      isActive: true
    }
  });

  const punjab = await prisma.university.upsert({
    where: { shortName: 'PUNJAB' },
    update: {},
    create: {
      name: 'University of the Punjab',
      shortName: 'PUNJAB',
      location: 'Lahore',
      website: 'https://pu.edu.pk',
      contactEmail: 'info@pu.edu.pk',
      testRequired: 'None',
      isActive: true
    }
  });

  console.log('✓ Created universities');

  // Create NUST Departments
  const nustCS = await prisma.department.create({
    data: {
      universityId: nust.id,
      name: 'Computer Science',
      degree: 'BS',
      duration: '4 years',
      seats: 150,
      category: 'CS'
    }
  });

  const nustSE = await prisma.department.create({
    data: {
      universityId: nust.id,
      name: 'Software Engineering',
      degree: 'BS',
      duration: '4 years',
      seats: 120,
      category: 'CS'
    }
  });

  const nustEE = await prisma.department.create({
    data: {
      universityId: nust.id,
      name: 'Electrical Engineering',
      degree: 'BE',
      duration: '4 years',
      seats: 100,
      category: 'Engineering'
    }
  });

  // Create FAST Departments
  const fastCS = await prisma.department.create({
    data: {
      universityId: fast.id,
      name: 'Computer Science',
      degree: 'BS',
      duration: '4 years',
      seats: 200,
      category: 'CS'
    }
  });

  const fastSE = await prisma.department.create({
    data: {
      universityId: fast.id,
      name: 'Software Engineering',
      degree: 'BS',
      duration: '4 years',
      seats: 150,
      category: 'CS'
    }
  });

  // Create COMSATS Departments
  const comsatsCS = await prisma.department.create({
    data: {
      universityId: comsats.id,
      name: 'Computer Science',
      degree: 'BS',
      duration: '4 years',
      seats: 180,
      category: 'CS'
    }
  });

  const comstatsSE = await prisma.department.create({
    data: {
      universityId: comsats.id,
      name: 'Software Engineering',
      degree: 'BS',
      duration: '4 years',
      seats: 140,
      category: 'CS'
    }
  });

  console.log('✓ Created departments');

  // Create Merit Lists (2024 data)
  await prisma.meritList.createMany({
    data: [
      // NUST Merit Lists
      {
        universityId: nust.id,
        departmentId: nustCS.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 79.2,
        aggregatePercentage: 79.2,
        matricPercentage: 85.0,
        interPercentage: 82.0,
        testScore: 155.0
      },
      {
        universityId: nust.id,
        departmentId: nustSE.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 77.5,
        aggregatePercentage: 77.5,
        matricPercentage: 83.0,
        interPercentage: 80.0,
        testScore: 150.0
      },
      {
        universityId: nust.id,
        departmentId: nustEE.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 75.8,
        aggregatePercentage: 75.8,
        matricPercentage: 82.0,
        interPercentage: 78.0,
        testScore: 145.0
      },
      // FAST Merit Lists
      {
        universityId: fast.id,
        departmentId: fastCS.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 78.0,
        aggregatePercentage: 78.0,
        matricPercentage: 85.0,
        interPercentage: 80.0,
        testScore: 75.0
      },
      {
        universityId: fast.id,
        departmentId: fastSE.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 76.5,
        aggregatePercentage: 76.5,
        matricPercentage: 83.0,
        interPercentage: 78.0,
        testScore: 72.0
      },
      // COMSATS Merit Lists
      {
        universityId: comsats.id,
        departmentId: comsatsCS.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 75.5,
        aggregatePercentage: 75.5,
        matricPercentage: 82.0,
        interPercentage: 77.0,
        testScore: 70.0
      },
      {
        universityId: comsats.id,
        departmentId: comstatsSE.id,
        year: 2024,
        admissionCycle: 'Fall',
        meritType: 'Final',
        closingMerit: 73.2,
        aggregatePercentage: 73.2,
        matricPercentage: 80.0,
        interPercentage: 75.0,
        testScore: 68.0
      }
    ]
  });

  console.log('✓ Created merit lists');

  // Create Admission Timelines (2025 data)
  await prisma.admissionTimeline.createMany({
    data: [
      {
        universityId: nust.id,
        year: 2025,
        cycle: 'Fall 2025',
        applicationStart: new Date('2025-01-15'),
        applicationDeadline: new Date('2025-03-15'),
        testDate: new Date('2025-04-20'),
        firstMeritList: new Date('2025-06-01'),
        secondMeritList: new Date('2025-06-15'),
        thirdMeritList: new Date('2025-06-30'),
        finalMeritList: new Date('2025-07-15'),
        isActive: true,
        updatedBy: 'system'
      },
      {
        universityId: fast.id,
        year: 2025,
        cycle: 'Fall 2025',
        applicationStart: new Date('2025-02-01'),
        applicationDeadline: new Date('2025-04-30'),
        testDate: new Date('2025-05-25'),
        firstMeritList: new Date('2025-06-20'),
        secondMeritList: new Date('2025-07-05'),
        finalMeritList: new Date('2025-07-20'),
        isActive: true,
        updatedBy: 'system'
      },
      {
        universityId: comsats.id,
        year: 2025,
        cycle: 'Fall 2025',
        applicationStart: new Date('2025-03-01'),
        applicationDeadline: new Date('2025-05-31'),
        testDate: new Date('2025-06-15'),
        firstMeritList: new Date('2025-07-10'),
        secondMeritList: new Date('2025-07-25'),
        finalMeritList: new Date('2025-08-10'),
        isActive: true,
        updatedBy: 'system'
      }
    ]
  });

  console.log('✓ Created admission timelines');

  // Create sample updates
  await prisma.universityUpdate.createMany({
    data: [
      {
        universityId: nust.id,
        title: 'NUST Entry Test 2025 Registration Open',
        description: 'Registration for NUST Entry Test 2025 is now open. Last date to apply is March 15, 2025.',
        updateType: 'deadline',
        priority: 'high',
        sourceUrl: 'https://nust.edu.pk/admissions',
        publishedDate: new Date('2025-01-15'),
        isManual: true,
        createdBy: 'admin'
      },
      {
        universityId: fast.id,
        title: 'FAST Admission Schedule Announced',
        description: 'FAST has announced the admission schedule for Fall 2025. Applications will be accepted until April 30, 2025.',
        updateType: 'deadline',
        priority: 'high',
        sourceUrl: 'https://www.nu.edu.pk/Admissions',
        publishedDate: new Date('2025-02-01'),
        isManual: true,
        createdBy: 'admin'
      },
      {
        universityId: comsats.id,
        title: 'COMSATS Merit Lists 2024 Published',
        description: 'Final merit lists for Fall 2024 admissions have been published on the official website.',
        updateType: 'merit',
        priority: 'medium',
        sourceUrl: 'https://www.comsats.edu.pk/admissions',
        publishedDate: new Date('2024-08-10'),
        isManual: true,
        createdBy: 'admin'
      }
    ]
  });

  console.log('✓ Created university updates');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


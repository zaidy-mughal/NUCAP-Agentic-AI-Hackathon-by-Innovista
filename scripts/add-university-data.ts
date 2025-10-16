import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function addUniversityData() {
  console.log('Adding new university data to the database...');
  
  try {
    // Create NUST University
    const nust = await prisma.university.create({
      data: {
        name: 'National University of Sciences and Technology',
        shortName: 'NUST',
        location: 'Islamabad',
        website: 'https://nust.edu.pk',
        contactEmail: 'admissions@nust.edu.pk',
        testRequired: 'NUST',
        isActive: true
      }
    });
    
    console.log(`✓ Created university: ${nust.name}`);
    
    // Create FAST University
    const fast = await prisma.university.create({
      data: {
        name: 'FAST University (NUCES)',
        shortName: 'FAST',
        location: 'Islamabad, Lahore, Karachi, Peshawar, Chiniot-Faisalabad',
        website: 'https://www.nu.edu.pk',
        contactEmail: 'admissions@nu.edu.pk',
        testRequired: 'FAST',
        isActive: true
      }
    });
    
    console.log(`✓ Created university: ${fast.name}`);
    
    // Create COMSATS University
    const comsats = await prisma.university.create({
      data: {
        name: 'COMSATS University Islamabad',
        shortName: 'COMSATS',
        location: 'Islamabad, Lahore',
        website: 'https://www.comsats.edu.pk',
        contactEmail: 'info@comsats.edu.pk',
        testRequired: 'NTS',
        isActive: true
      }
    });
    
    console.log(`✓ Created university: ${comsats.name}`);
    
    // Create NUST Departments
    const nustDepartments = await Promise.all([
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Computer Science',
          degree: 'BS',
          duration: '4 years',
          seats: 150,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Software Engineering',
          degree: 'BS',
          duration: '4 years',
          seats: 120,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Electrical Engineering',
          degree: 'BE',
          duration: '4 years',
          seats: 100,
          category: 'Engineering'
        }
      }),
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Artificial Intelligence',
          degree: 'BS',
          duration: '4 years',
          seats: 60,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Computer Engineering',
          degree: 'BE',
          duration: '4 years',
          seats: 80,
          category: 'Engineering'
        }
      }),
      prisma.department.create({
        data: {
          universityId: nust.id,
          name: 'Business Analytics',
          degree: 'BS',
          duration: '4 years',
          seats: 50,
          category: 'Business'
        }
      })
    ]);
    
    console.log(`✓ Created ${nustDepartments.length} NUST departments`);
    
    // Create FAST Departments
    const fastDepartments = await Promise.all([
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'Computer Science',
          degree: 'BS',
          duration: '4 years',
          seats: 200,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'Software Engineering',
          degree: 'BS',
          duration: '4 years',
          seats: 150,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'Artificial Intelligence',
          degree: 'BS',
          duration: '4 years',
          seats: 70,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'Electrical Engineering',
          degree: 'BE',
          duration: '4 years',
          seats: 100,
          category: 'Engineering'
        }
      }),
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'Computer Engineering',
          degree: 'BE',
          duration: '4 years',
          seats: 80,
          category: 'Engineering'
        }
      }),
      prisma.department.create({
        data: {
          universityId: fast.id,
          name: 'BBA',
          degree: 'BBA',
          duration: '4 years',
          seats: 120,
          category: 'Business'
        }
      })
    ]);
    
    console.log(`✓ Created ${fastDepartments.length} FAST departments`);
    
    // Create COMSATS Departments
    const comsatsDepartments = await Promise.all([
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Computer Science',
          degree: 'BS',
          duration: '4 years',
          seats: 180,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Software Engineering',
          degree: 'BS',
          duration: '4 years',
          seats: 140,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Artificial Intelligence',
          degree: 'BS',
          duration: '4 years',
          seats: 60,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Data Science',
          degree: 'BS',
          duration: '4 years',
          seats: 50,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Cyber Security',
          degree: 'BS',
          duration: '4 years',
          seats: 50,
          category: 'CS'
        }
      }),
      prisma.department.create({
        data: {
          universityId: comsats.id,
          name: 'Business Data Analytics',
          degree: 'BS',
          duration: '4 years',
          seats: 60,
          category: 'Business'
        }
      })
    ]);
    
    console.log(`✓ Created ${comsatsDepartments.length} COMSATS departments`);
    
    // Create NUST Merit Lists (2025 data)
    const nustMeritLists = await Promise.all([
      prisma.meritList.create({
        data: {
          universityId: nust.id,
          departmentId: nustDepartments[0].id, // Computer Science
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 85.0,
          publishedDate: new Date('2025-09-30')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: nust.id,
          departmentId: nustDepartments[1].id, // Software Engineering
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 83.0,
          publishedDate: new Date('2025-09-30')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: nust.id,
          departmentId: nustDepartments[2].id, // Electrical Engineering
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 78.0,
          publishedDate: new Date('2025-09-30')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: nust.id,
          departmentId: nustDepartments[3].id, // Artificial Intelligence
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 87.0,
          publishedDate: new Date('2025-09-30')
        }
      })
    ]);
    
    console.log(`✓ Created ${nustMeritLists.length} NUST merit lists`);
    
    // Create FAST Merit Lists (2025 data)
    const fastMeritLists = await Promise.all([
      prisma.meritList.create({
        data: {
          universityId: fast.id,
          departmentId: fastDepartments[0].id, // Computer Science
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 85.0,
          publishedDate: new Date('2025-07-23')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: fast.id,
          departmentId: fastDepartments[1].id, // Software Engineering
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 85.0,
          publishedDate: new Date('2025-07-23')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: fast.id,
          departmentId: fastDepartments[2].id, // Artificial Intelligence
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 87.0,
          publishedDate: new Date('2025-07-23')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: fast.id,
          departmentId: fastDepartments[3].id, // Electrical Engineering
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 75.0,
          publishedDate: new Date('2025-07-23')
        }
      })
    ]);
    
    console.log(`✓ Created ${fastMeritLists.length} FAST merit lists`);
    
    // Create COMSATS Merit Lists (2025 data)
    const comsatsMeritLists = await Promise.all([
      prisma.meritList.create({
        data: {
          universityId: comsats.id,
          departmentId: comsatsDepartments[0].id, // Computer Science
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 88.26,
          publishedDate: new Date('2025-08-06')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: comsats.id,
          departmentId: comsatsDepartments[2].id, // Artificial Intelligence
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 87.69,
          publishedDate: new Date('2025-08-06')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: comsats.id,
          departmentId: comsatsDepartments[1].id, // Software Engineering
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 87.20,
          publishedDate: new Date('2025-08-06')
        }
      }),
      prisma.meritList.create({
        data: {
          universityId: comsats.id,
          departmentId: comsatsDepartments[3].id, // Data Science
          year: 2025,
          admissionCycle: 'Fall',
          meritType: 'Final',
          closingMerit: 86.52,
          publishedDate: new Date('2025-08-06')
        }
      })
    ]);
    
    console.log(`✓ Created ${comsatsMeritLists.length} COMSATS merit lists`);
    
    // Create NUST Admission Timelines (2026 data - tentative)
    await prisma.admissionTimeline.create({
      data: {
        universityId: nust.id,
        year: 2026,
        cycle: 'Fall 2026',
        applicationStart: new Date('2025-10-05'),
        applicationDeadline: new Date('2025-11-21'),
        testDate: new Date('2025-11-22'),
        firstMeritList: new Date('2026-07-31'),
        secondMeritList: new Date('2026-08-15'),
        finalMeritList: new Date('2026-09-30'),
        isActive: true,
        updatedBy: 'admin'
      }
    });
    
    console.log('✓ Created NUST admission timeline for Fall 2026');
    
    // Create FAST Admission Timelines (2025 data)
    await prisma.admissionTimeline.create({
      data: {
        universityId: fast.id,
        year: 2025,
        cycle: 'Fall 2025',
        applicationStart: new Date('2025-05-19'),
        applicationDeadline: new Date('2025-07-04'),
        testDate: new Date('2025-07-07'),
        firstMeritList: new Date('2025-07-23'),
        secondMeritList: new Date('2025-08-05'),
        finalMeritList: new Date('2025-08-20'),
        isActive: true,
        updatedBy: 'admin'
      }
    });
    
    console.log('✓ Created FAST admission timeline for Fall 2025');
    
    // Create COMSATS Admission Timelines (2025 data)
    // Islamabad Campus
    await prisma.admissionTimeline.create({
      data: {
        universityId: comsats.id,
        year: 2025,
        cycle: 'Fall 2025 - Islamabad',
        applicationStart: new Date('2025-06-01'),
        applicationDeadline: new Date('2025-07-09'),
        testDate: new Date('2025-07-13'),
        firstMeritList: new Date('2025-07-25'),
        finalMeritList: new Date('2025-08-31'),
        isActive: true,
        updatedBy: 'admin'
      }
    });
    
    // Lahore Campus
    await prisma.admissionTimeline.create({
      data: {
        universityId: comsats.id,
        year: 2025,
        cycle: 'Fall 2025 - Lahore',
        applicationStart: new Date('2025-06-01'),
        applicationDeadline: new Date('2025-07-21'),
        testDate: new Date('2025-07-13'),
        firstMeritList: new Date('2025-08-06'),
        finalMeritList: new Date('2025-08-31'),
        isActive: true,
        updatedBy: 'admin'
      }
    });
    
    console.log('✓ Created COMSATS admission timelines for Fall 2025');
    
    // Create NUST Test Series Data
    const nustTestSeries = await Promise.all([
      prisma.nustTestSeries.create({
        data: {
          seriesName: 'Series 1',
          onlineRegistration: '15 Oct - 21 Nov 2025',
          cbnet: '22 Nov 2025 onwards',
          testCentre: 'Islamabad'
        }
      }),
      prisma.nustTestSeries.create({
        data: {
          seriesName: 'Series 2',
          onlineRegistration: 'Dec 2025 - Jan 2026',
          cbnet: 'Jan 2026 (Islamabad), Mar 2026 (Quetta)',
          pbnet: 'Feb 2026 (Karachi)',
          testCentre: 'Isb, Qta, Kci'
        }
      })
    ]);
    
    console.log(`✓ Created ${nustTestSeries.length} NUST test series entries`);
    
    console.log('✅ All university data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding university data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addUniversityData();
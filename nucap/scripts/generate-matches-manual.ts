/**
 * Manual script to generate matches for existing profiles
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';
import { calculateMerit, calculateMatchScore, evaluateAdmissionChance } from '../src/lib/meritCalculator';

async function generateMatchesForProfile(profileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId }
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  console.log(`\n🎯 Generating matches for profile: ${profileId}`);
  console.log(`   Matric: ${profile.matricPercentage.toFixed(1)}%`);
  console.log(`   Inter: ${profile.interPercentage.toFixed(1)}%`);

  // Fetch all active universities with departments and merit lists
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    include: {
      departments: {
        include: {
          meritLists: {
            orderBy: { year: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  console.log(`\n📚 Found ${universities.length} universities`);

  const matches = [];
  let totalMatches = 0;

  for (const uni of universities) {
    // Get test score for this university
    const testScoreFieldMap: Record<string, keyof typeof profile> = {
      'NUST': 'nustTestScore',
      'FAST': 'fastTestScore',
      'COMSATS': 'ntsTestScore',
      'PUNJAB': 'ntsTestScore'
    };

    const testScoreField = testScoreFieldMap[uni.shortName];
    const testScore = testScoreField ? (profile[testScoreField] as number | null) || 0 : 0;

    // Calculate merit for this university
    const studentMerit = calculateMerit({
      matricPercentage: profile.matricPercentage,
      interPercentage: profile.interPercentage,
      testScore,
      universityShortName: uni.shortName
    });

    console.log(`\n   ${uni.shortName}:`);
    console.log(`     Test Score: ${testScore}`);
    console.log(`     Student Merit: ${studentMerit.toFixed(2)}`);

    // Create matches for each department
    let deptCount = 0;
    for (const dept of uni.departments) {
      if (dept.meritLists.length === 0) continue;

      const closingMerit = dept.meritLists[0].closingMerit;
      const admissionChance = evaluateAdmissionChance(studentMerit, closingMerit);
      const matchScore = calculateMatchScore(
        studentMerit,
        closingMerit,
        profile.preferredCities || [],
        uni.location,
        profile.preferredFields || [],
        dept.category
      );

      matches.push({
        studentProfileId: profileId,
        universityId: uni.id,
        departmentId: dept.id,
        matchScore,
        estimatedMerit: studentMerit,
        requiredMerit: closingMerit,
        admissionChance: admissionChance.chance,
        meritGap: studentMerit - closingMerit
      });

      deptCount++;
    }

    console.log(`     Matched with ${deptCount} departments`);
    totalMatches += deptCount;
  }

  // Delete existing matches for this profile
  const deleted = await prisma.studentMatch.deleteMany({
    where: { studentProfileId: profileId }
  });

  console.log(`\n🗑️  Deleted ${deleted.count} old matches`);

  // Create new matches
  if (matches.length > 0) {
    await prisma.studentMatch.createMany({
      data: matches
    });
    console.log(`✅ Created ${matches.length} new matches`);
  }

  return matches;
}

async function main() {
  try {
    console.log('\n🚀 Starting match generation for all profiles...\n');

    // Get all student profiles
    const profiles = await prisma.studentProfile.findMany({
      include: { user: true }
    });

    if (profiles.length === 0) {
      console.log('❌ No student profiles found. Create one first:');
      console.log('   http://localhost:3000/profile/create');
      return;
    }

    console.log(`Found ${profiles.length} student profile(s)\n`);

    for (const profile of profiles) {
      const userName = profile.user.name || 'Student';
      console.log(`\n${'='.repeat(60)}`);
      console.log(`👤 Processing: ${userName}`);
      console.log('='.repeat(60));

      await generateMatchesForProfile(profile.id);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('🎉 Match generation complete!');
    console.log('='.repeat(60) + '\n');

    // Show summary
    const allMatches = await prisma.studentMatch.findMany({
      include: {
        university: true,
        department: true,
        studentProfile: { include: { user: true } }
      },
      orderBy: { matchScore: 'desc' }
    });

    console.log('\n📊 SUMMARY:');
    console.log(`   Total Matches: ${allMatches.length}`);
    
    if (allMatches.length > 0) {
      console.log('\n🏆 Top 5 Matches:');
      allMatches.slice(0, 5).forEach((match, i) => {
        console.log(`   ${i + 1}. ${match.university.shortName} - ${match.department.name}`);
        console.log(`      Score: ${match.matchScore}, Chance: ${match.admissionChance}, Merit Gap: ${match.meritGap.toFixed(1)}`);
      });
    }

    console.log('\n✅ Dashboard is now ready with all matches!');
    console.log('📱 Visit: http://localhost:3000/dashboard\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


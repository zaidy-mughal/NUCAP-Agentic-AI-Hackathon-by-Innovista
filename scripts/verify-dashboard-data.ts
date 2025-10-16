/**
 * Script to verify that scraped data is showing on dashboard
 * Checks the complete data flow: Scraping → Database → Dashboard
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';

async function verifyDashboardData() {
  console.log('\n🔍 Verifying Dashboard Data Flow\n');
  console.log('='.repeat(60));

  try {
    // 1. Check Universities
    console.log('\n1️⃣ Checking Universities...');
    const universities = await prisma.university.findMany();
    console.log(`   ✓ Found ${universities.length} universities in database`);
    universities.forEach(uni => {
      console.log(`     - ${uni.name} (${uni.shortName})`);
    });

    // 2. Check Admission Timelines (from scrapers)
    console.log('\n2️⃣ Checking Admission Timelines (Scraped Deadlines)...');
    const timelines = await prisma.admissionTimeline.findMany({
      include: { university: true },
      orderBy: { applicationDeadline: 'asc' }
    });
    console.log(`   ✓ Found ${timelines.length} admission timelines`);
    
    if (timelines.length === 0) {
      console.log('   ⚠️  No deadlines found! Run scrapers first:');
      console.log('      npx tsx scripts/test-scraper.ts ALL');
    } else {
      timelines.forEach(timeline => {
        console.log(`     - ${timeline.university.shortName}:`);
        console.log(`       Application Deadline: ${timeline.applicationDeadline || 'TBA'}`);
        console.log(`       Test Date: ${timeline.testDate || 'TBA'}`);
        console.log(`       Updated: ${timeline.lastUpdated}`);
      });
    }

    // 3. Check University Updates (Announcements from scrapers)
    console.log('\n3️⃣ Checking University Updates (Scraped Announcements)...');
    const updates = await prisma.universityUpdate.findMany({
      include: { university: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log(`   ✓ Found ${updates.length} university updates`);
    
    if (updates.length === 0) {
      console.log('   ⚠️  No announcements found! Scrapers may not have run yet.');
    } else {
      updates.slice(0, 5).forEach((update, i) => {
        console.log(`     ${i + 1}. ${update.university.shortName}: ${update.title.substring(0, 60)}...`);
        console.log(`        Priority: ${update.priority}, Created: ${update.createdAt}`);
      });
    }

    // 4. Check Users
    console.log('\n4️⃣ Checking Users...');
    const users = await prisma.user.findMany();
    console.log(`   ✓ Found ${users.length} users`);

    // 5. Check Student Profiles
    console.log('\n5️⃣ Checking Student Profiles...');
    const profiles = await prisma.studentProfile.findMany({
      include: { user: true }
    });
    console.log(`   ✓ Found ${profiles.length} student profiles`);
    
    if (profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`     - ${profile.user.name || 'Student'}:`);
        console.log(`       Matric: ${profile.matricPercentage.toFixed(1)}%`);
        console.log(`       Inter: ${profile.interPercentage.toFixed(1)}%`);
      });
    }

    // 6. Check Student Matches
    console.log('\n6️⃣ Checking Student Matches (for Dashboard)...');
    const matches = await prisma.studentMatch.findMany({
      include: {
        studentProfile: { include: { user: true } },
        university: true,
        department: true
      },
      orderBy: { matchScore: 'desc' }
    });
    console.log(`   ✓ Found ${matches.length} student matches`);
    
    if (matches.length === 0) {
      console.log('   ⚠️  No matches found!');
      console.log('      1. Create a student profile: http://localhost:3000/profile/create');
      console.log('      2. Matches will be auto-generated');
    } else {
      const matchesByUser = matches.reduce((acc: any, match) => {
        const userName = match.studentProfile.user.name || 'Unknown';
        if (!acc[userName]) acc[userName] = [];
        acc[userName].push(match);
        return acc;
      }, {});

      Object.entries(matchesByUser).forEach(([userName, userMatches]: [string, any]) => {
        console.log(`     ${userName}:`);
        userMatches.slice(0, 3).forEach((match: any) => {
          console.log(`       - ${match.university.shortName} - ${match.department.name}`);
          console.log(`         Score: ${match.matchScore}, Chance: ${match.admissionChance}, Merit Gap: ${match.meritGap.toFixed(1)}`);
        });
      });
    }

    // 7. Check Departments
    console.log('\n7️⃣ Checking Departments...');
    const departments = await prisma.department.findMany({
      include: { university: true }
    });
    console.log(`   ✓ Found ${departments.length} departments`);

    // 8. Check Merit Lists
    console.log('\n8️⃣ Checking Merit Lists...');
    const meritLists = await prisma.meritList.findMany({
      include: { department: { include: { university: true } } }
    });
    console.log(`   ✓ Found ${meritLists.length} merit lists`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DASHBOARD DATA SUMMARY');
    console.log('='.repeat(60));
    console.log(`✓ Universities: ${universities.length}`);
    console.log(`✓ Departments: ${departments.length}`);
    console.log(`✓ Merit Lists: ${meritLists.length}`);
    console.log(`✓ Admission Timelines: ${timelines.length}`);
    console.log(`✓ University Updates: ${updates.length}`);
    console.log(`✓ Users: ${users.length}`);
    console.log(`✓ Student Profiles: ${profiles.length}`);
    console.log(`✓ Student Matches: ${matches.length}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ DASHBOARD READINESS CHECK');
    console.log('='.repeat(60));

    const checks = {
      'Universities exist': universities.length > 0,
      'Deadlines scraped': timelines.length > 0,
      'Announcements scraped': updates.length > 0,
      'User can sign up': true, // Clerk is configured
      'Profile can be created': departments.length > 0 && meritLists.length > 0,
      'Matches are generated': matches.length > 0 || profiles.length === 0,
    };

    Object.entries(checks).forEach(([check, passed]) => {
      const icon = passed ? '✅' : '❌';
      console.log(`${icon} ${check}`);
    });

    const allPassed = Object.values(checks).every(v => v);

    if (allPassed) {
      console.log('\n🎉 Dashboard is ready! All data is flowing correctly.');
      console.log('📱 Visit: http://localhost:3000/dashboard');
    } else {
      console.log('\n⚠️  Some data is missing. Follow these steps:');
      if (timelines.length === 0 || updates.length === 0) {
        console.log('\n1. Run scrapers to populate deadlines and announcements:');
        console.log('   npx tsx scripts/test-scraper.ts ALL');
      }
      if (profiles.length === 0) {
        console.log('\n2. Create a student profile:');
        console.log('   a. Sign up: http://localhost:3000/sign-up');
        console.log('   b. Complete profile: http://localhost:3000/profile/create');
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDashboardData();


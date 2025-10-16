import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { calculateMerit, calculateMatchScore, evaluateAdmissionChance } from '@/lib/meritCalculator';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user and profile
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Profile not found. Please create your profile first.' },
        { status: 404 }
      );
    }

    const profile = user.studentProfile;

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

    const matches = [];

    for (const uni of universities) {
      // Get test score for this university
      let testScore = 0;
      if (uni.shortName === 'NUST') testScore = profile.nustTestScore || 0;
      else if (uni.shortName === 'FAST') testScore = profile.fastTestScore || 0;
      else if (uni.shortName === 'COMSATS' || uni.shortName === 'PUNJAB') {
        testScore = profile.ntsTestScore || 0;
      }

      // Calculate merit for this university
      try {
        const studentMerit = calculateMerit({
          matricPercentage: profile.matricPercentage,
          interPercentage: profile.interPercentage,
          testScore,
          universityShortName: uni.shortName
        });

        // Create matches for each department
        for (const dept of uni.departments) {
          if (dept.meritLists.length === 0) continue;

          const closingMerit = dept.meritLists[0].closingMerit;
          const admissionChance = evaluateAdmissionChance(studentMerit, closingMerit);
          const matchScore = calculateMatchScore(
            studentMerit,
            closingMerit,
            profile.preferredCities,
            uni.location,
            profile.preferredFields,
            dept.category
          );

          matches.push({
            studentProfileId: profile.id,
            universityId: uni.id,
            departmentId: dept.id,
            matchScore,
            estimatedMerit: studentMerit,
            requiredMerit: closingMerit,
            admissionChance: admissionChance.chance,
            meritGap: studentMerit - closingMerit
          });
        }
      } catch (error) {
        console.error(`Error calculating merit for ${uni.shortName}:`, error);
      }
    }

    // Delete existing matches for this profile
    await prisma.studentMatch.deleteMany({
      where: { studentProfileId: profile.id }
    });

    // Create new matches
    if (matches.length > 0) {
      await prisma.studentMatch.createMany({
        data: matches
      });
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${matches.length} university matches`,
      matchesCount: matches.length
    });

  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


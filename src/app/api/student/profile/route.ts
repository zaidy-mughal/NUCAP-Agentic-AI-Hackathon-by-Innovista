import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { calculateMerit, calculateMatchScore, evaluateAdmissionChance } from '@/lib/meritCalculator';

// Validation schema
const profileSchema = z.object({
  matricTotalMarks: z.number().min(0).max(1100),
  matricObtainedMarks: z.number().min(0).max(1100),
  matricBoard: z.string().min(1),
  matricYear: z.number().min(2000).max(2030),
  interTotalMarks: z.number().min(0).max(1100),
  interObtainedMarks: z.number().min(0).max(1100),
  interBoard: z.string().min(1),
  interGroup: z.enum(['Pre-Med', 'Pre-Eng', 'Commerce', 'Arts']),
  interYear: z.number().min(2000).max(2030),
  nustTestScore: z.number().min(0).max(200).optional(),
  fastTestScore: z.number().min(0).max(100).optional(),
  ntsTestScore: z.number().min(0).max(100).optional(),
  preferredCities: z.array(z.string()),
  preferredFields: z.array(z.string()),
  budgetRange: z.string().optional()
});

// GET - Fetch student profile
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user.studentProfile
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create student profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = profileSchema.parse(body);

    // Calculate percentages
    const matricPercentage = (validatedData.matricObtainedMarks / validatedData.matricTotalMarks) * 100;
    const interPercentage = (validatedData.interObtainedMarks / validatedData.interTotalMarks) * 100;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });

    if (!user) {
      // Get user info from Clerk
      const clerkUser = await auth();
      
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.sessionClaims?.email as string || '',
          name: clerkUser.sessionClaims?.name as string || null,
          lastLogin: new Date()
        },
        include: { studentProfile: true }
      });
    }

    // Check if profile already exists
    if (user.studentProfile) {
      return NextResponse.json(
        { 
          error: 'Profile already exists. Use PUT to update.',
          profileId: user.studentProfile.id 
        },
        { status: 409 } // Conflict
      );
    }

    // Create student profile
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        ...validatedData,
        matricPercentage,
        interPercentage
      }
    });

    // Generate university matches
    await generateMatches(profile.id, matricPercentage, interPercentage, validatedData);

    return NextResponse.json({
      success: true,
      profile
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: any };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { 
            error: 'A profile already exists for this user.',
            hint: 'Please use the update endpoint to modify your existing profile.'
          },
          { status: 409 }
        );
      }
    }

    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update student profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = profileSchema.parse(body);

    // Calculate percentages
    const matricPercentage = (validatedData.matricObtainedMarks / validatedData.matricTotalMarks) * 100;
    const interPercentage = (validatedData.interObtainedMarks / validatedData.interTotalMarks) * 100;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update profile
    const profile = await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: {
        ...validatedData,
        matricPercentage,
        interPercentage
      }
    });

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete student profile
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Delete profile
    await prisma.studentProfile.delete({
      where: { id: user.studentProfile.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate university matches
async function generateMatches(
  profileId: string,
  matricPercentage: number,
  interPercentage: number,
  profileData: any
) {
  try {
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
      const testScoreField = `${uni.shortName.toLowerCase()}TestScore` as keyof typeof profileData;
      const testScore = profileData[testScoreField] || 0;

      // Calculate merit for this university
      const studentMerit = calculateMerit({
        matricPercentage,
        interPercentage,
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
          profileData.preferredCities || [],
          uni.location,
          profileData.preferredFields || [],
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
      }
    }

    // Delete existing matches for this profile
    await prisma.studentMatch.deleteMany({
      where: { studentProfileId: profileId }
    });

    // Create new matches
    if (matches.length > 0) {
      await prisma.studentMatch.createMany({
        data: matches
      });
    }

    console.log(`✓ Generated ${matches.length} matches for profile ${profileId}`);
  } catch (error) {
    console.error('Error generating matches:', error);
  }
}


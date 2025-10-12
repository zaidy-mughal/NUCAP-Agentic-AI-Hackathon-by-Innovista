import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const deadlineSchema = z.object({
  universityId: z.string(),
  year: z.number(),
  cycle: z.string(),
  applicationStart: z.string().optional(),
  applicationDeadline: z.string().optional(),
  testDate: z.string().optional(),
  firstMeritList: z.string().optional(),
  secondMeritList: z.string().optional(),
  thirdMeritList: z.string().optional(),
  finalMeritList: z.string().optional(),
});

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
    const validatedData = deadlineSchema.parse(body);

    // Convert string dates to Date objects
    const dateFields: any = {};
    if (validatedData.applicationStart) dateFields.applicationStart = new Date(validatedData.applicationStart);
    if (validatedData.applicationDeadline) dateFields.applicationDeadline = new Date(validatedData.applicationDeadline);
    if (validatedData.testDate) dateFields.testDate = new Date(validatedData.testDate);
    if (validatedData.firstMeritList) dateFields.firstMeritList = new Date(validatedData.firstMeritList);
    if (validatedData.secondMeritList) dateFields.secondMeritList = new Date(validatedData.secondMeritList);
    if (validatedData.thirdMeritList) dateFields.thirdMeritList = new Date(validatedData.thirdMeritList);
    if (validatedData.finalMeritList) dateFields.finalMeritList = new Date(validatedData.finalMeritList);

    // Create or update timeline
    const timeline = await prisma.admissionTimeline.upsert({
      where: {
        universityId_year_cycle: {
          universityId: validatedData.universityId,
          year: validatedData.year,
          cycle: validatedData.cycle
        }
      },
      update: {
        ...dateFields,
        updatedBy: 'admin',
        isActive: true
      },
      create: {
        universityId: validatedData.universityId,
        year: validatedData.year,
        cycle: validatedData.cycle,
        ...dateFields,
        updatedBy: 'admin',
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      timeline
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error adding deadline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


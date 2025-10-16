import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { calculateAllMerits, evaluateAdmissionChance } from '@/lib/meritCalculator';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const meritCalculationSchema = z.object({
  matricPercentage: z.number().min(0).max(100),
  interPercentage: z.number().min(0).max(100),
  testScores: z.object({
    NUST: z.number().min(0).max(200).optional(),
    FAST: z.number().min(0).max(100).optional(),
    COMSATS: z.number().min(0).max(100).optional(),
    PUNJAB: z.number().min(0).max(100).optional(),
    PIEAS: z.number().min(0).max(200).optional()
  }).optional()
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
    const validatedData = meritCalculationSchema.parse(body);

    // Calculate merits for all universities
    const testScores = validatedData.testScores || {};
    const merits = calculateAllMerits(
      validatedData.matricPercentage,
      validatedData.interPercentage,
      testScores
    );

    // Fetch universities with their latest merit data
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

    // Match universities and calculate admission chances
    const matchedUniversities = universities.map(uni => {
      const studentMerit = merits[uni.shortName] || 0;
      
      // Get average closing merit from departments
      const departmentMerits = uni.departments
        .filter(dept => dept.meritLists.length > 0)
        .map(dept => dept.meritLists[0].closingMerit);

      const avgClosingMerit = departmentMerits.length > 0
        ? departmentMerits.reduce((a, b) => a + b, 0) / departmentMerits.length
        : 0;

      const admissionChance = avgClosingMerit > 0
        ? evaluateAdmissionChance(studentMerit, avgClosingMerit)
        : null;

      return {
        universityId: uni.id,
        universityName: uni.name,
        shortName: uni.shortName,
        location: uni.location,
        studentMerit,
        avgClosingMerit,
        meritGap: studentMerit - avgClosingMerit,
        admissionChance,
        departments: uni.departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          degree: dept.degree,
          category: dept.category,
          closingMerit: dept.meritLists[0]?.closingMerit || null,
          admissionChance: dept.meritLists[0]
            ? evaluateAdmissionChance(studentMerit, dept.meritLists[0].closingMerit)
            : null
        }))
      };
    });

    // Sort by merit gap (best matches first)
    matchedUniversities.sort((a, b) => b.meritGap - a.meritGap);

    return NextResponse.json({
      success: true,
      merits,
      matchedUniversities
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error calculating merit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


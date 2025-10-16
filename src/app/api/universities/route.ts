import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const testType = searchParams.get('testType');
    const category = searchParams.get('category');

    // Build where clause
    const where: any = { isActive: true };

    if (city) {
      where.location = { contains: city, mode: 'insensitive' };
    }

    if (testType) {
      where.testRequired = testType;
    }

    // Fetch universities
    const universities = await prisma.university.findMany({
      where,
      include: {
        departments: {
          where: category ? { category } : undefined,
          include: {
            meritLists: {
              orderBy: { year: 'desc' },
              take: 1
            }
          }
        },
        timelines: {
          where: { isActive: true },
          orderBy: { year: 'desc' },
          take: 1
        },
        _count: {
          select: {
            departments: true,
            meritLists: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      universities
    });

  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


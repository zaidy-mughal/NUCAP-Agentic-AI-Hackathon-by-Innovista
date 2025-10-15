import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const university = await prisma.university.findUnique({
      where: { id: params.id },
      include: {
        departments: {
          include: {
            meritLists: {
              orderBy: { year: 'desc' },
              take: 3
            }
          }
        },
        timelines: {
          where: { isActive: true },
          orderBy: { year: 'desc' }
        },
        updates: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      university
    });

  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


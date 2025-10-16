import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const universitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  shortName: z.string().min(1, "Short name is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid website URL"),
  testRequired: z.enum(['None', 'NUST', 'FAST', 'NTS']),
  isActive: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = universitySchema.parse(body);

    // Create university
    const university = await prisma.university.create({
      data: {
        ...validatedData,
      }
    });

    return NextResponse.json({
      success: true,
      university
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all universities with departments count
    const universities = await prisma.university.findMany({
      include: {
        _count: {
          select: { departments: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
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
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
    console.log('Admin authentication check result:', isAdmin);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const validatedData = universitySchema.parse(body);
    console.log('Validated data:', validatedData);

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

  } catch (error: unknown) {
    console.error('Error creating university:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    console.log('Admin authentication check result (GET):', isAdmin);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
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

  } catch (error: unknown) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    console.log('Admin authentication check result (DELETE):', isAdmin);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Delete university (this will cascade delete related departments, merit lists, etc.)
    await prisma.university.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'University deleted successfully'
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 }
    );
  }
}
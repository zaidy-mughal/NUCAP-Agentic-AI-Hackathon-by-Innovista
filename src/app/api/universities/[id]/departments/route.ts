import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { z, ZodError } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  degree: z.string().min(1, "Degree type is required"),
  duration: z.string().min(1, "Duration is required"),
  seats: z.number().optional(),
  category: z.string().min(1, "Category is required"),
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const universityId = params.id;
    
    // Check if university exists
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = departmentSchema.parse(body);

    // Create department
    const department = await prisma.department.create({
      data: {
        ...validatedData,
        university: {
          connect: { id: universityId }
        }
      }
    });

    return NextResponse.json({
      success: true,
      department
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const universityId = params.id;
    
    // Check if university exists
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    });

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Fetch all departments for this university
    const departments = await prisma.department.findMany({
      where: { universityId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      departments
    });

  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z, ZodError } from 'zod';
import { isAdminAuthenticated } from '@/lib/adminAuth';

const meritListSchema = z.object({
  universityId: z.string().min(1, "University ID is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  year: z.number().min(2020).max(2030),
  admissionCycle: z.enum(['Fall', 'Spring']),
  meritType: z.enum(['1st', '2nd', '3rd', 'Final']),
  closingMerit: z.number().min(0).max(100),
  aggregatePercentage: z.number().min(0).max(100).optional(),
  matricPercentage: z.number().min(0).max(100).optional(),
  interPercentage: z.number().min(0).max(100).optional(),
  testScore: z.number().min(0).optional(),
  publishedDate: z.string().optional(),
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
    
    // If we receive an array of merit lists, validate each one
    let meritListsToCreate;
    
    if (Array.isArray(body)) {
      meritListsToCreate = body.map(item => meritListSchema.parse(item));
    } else {
      meritListsToCreate = [meritListSchema.parse(body)];
    }

    // Create merit lists
    const createdMeritLists = [];
    
    for (const meritData of meritListsToCreate) {
      const publishedDate = meritData.publishedDate 
        ? new Date(meritData.publishedDate) 
        : undefined;
        
      const meritList = await prisma.meritList.create({
        data: {
          universityId: meritData.universityId,
          departmentId: meritData.departmentId,
          year: meritData.year,
          admissionCycle: meritData.admissionCycle,
          meritType: meritData.meritType,
          closingMerit: meritData.closingMerit,
          aggregatePercentage: meritData.aggregatePercentage,
          matricPercentage: meritData.matricPercentage,
          interPercentage: meritData.interPercentage,
          testScore: meritData.testScore,
          publishedDate: publishedDate,
        }
      });
      
      createdMeritLists.push(meritList);
    }

    return NextResponse.json({
      success: true,
      meritLists: createdMeritLists
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating merit list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
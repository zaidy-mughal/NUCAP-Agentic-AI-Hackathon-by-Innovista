import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear admin session cookie
    const cookieStore = await cookies();
    cookieStore.delete('admin-session');

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
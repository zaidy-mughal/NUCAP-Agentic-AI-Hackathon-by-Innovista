import { NextRequest, NextResponse } from 'next/server';
import { getSqlClient } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Get SQL client with error handling
  const { client: sql, error } = getSqlClient();
  if (error) {
    console.error('Failed to initialize SQL client:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }

  try {
    // Fetch NUST test series data using raw SQL
    const nustTestSeries = await sql`
      SELECT * FROM nust_test_series 
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      series: nustTestSeries
    });

  } catch (error) {
    console.error('Error fetching NUST test series:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
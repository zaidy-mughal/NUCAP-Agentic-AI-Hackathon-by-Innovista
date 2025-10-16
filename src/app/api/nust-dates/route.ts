import { NextRequest, NextResponse } from 'next/server';
import { getSqlClient } from '@/lib/db';
import { customAlphabet } from 'nanoid';

// Create a nanoid generator for cuid-like IDs
const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 24);

type NustSeriesItem = {
	name: string;
	online_registration: string | null;
	cbnet: string | null;
	pbnet: string | null;
	test_centre: string | null;
};

export async function POST(request: NextRequest) {
	const apiKey = request.headers.get('x-api-key');
	if (apiKey !== process.env.N8N_API_KEY) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get SQL client with error handling
	const { client: sql, error } = getSqlClient();
	if (error) {
		console.error('Failed to initialize SQL client:', error);
		return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
	}

	try {
		const data: unknown = await request.json();
		// Helpers to safely extract and validate series
		type SeriesContainer = { output?: { series?: unknown } };
		type ArraySeriesContainer = Array<SeriesContainer>;
		function isNustSeriesItem(value: unknown): value is NustSeriesItem {
			if (!value || typeof value !== 'object') return false;
			const v = value as Record<string, unknown>;
			return (
				typeof v.name === 'string' &&
				'online_registration' in v &&
				'cbnet' in v &&
				'pbnet' in v &&
				'test_centre' in v
			);
		}
		function extractSeries(input: unknown): NustSeriesItem[] | null {
			const tryArray = Array.isArray(input) ? (input as ArraySeriesContainer) : null;
			const trySingle = !Array.isArray(input) ? (input as SeriesContainer) : null;
			const seriesUnknown = tryArray?.[0]?.output?.series ?? trySingle?.output?.series;
			if (!Array.isArray(seriesUnknown)) return null;
			if (!seriesUnknown.every(isNustSeriesItem)) return null;
			return seriesUnknown as NustSeriesItem[];
		}

		const series = extractSeries(data);
		if (!series) {
			return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
		}

		const results = await Promise.all(
			series.map(async (item: NustSeriesItem) => {
				// Generate a unique ID for each record
				const id = `nust_${generateId()}`;
				// Generate timestamps
				const now = new Date().toISOString();
				
				return await sql`
					INSERT INTO nust_test_series (
						"id",
						"seriesName",
						"onlineRegistration",
						"cbnet",
						"pbnet",
						"testCentre",
						"createdAt",
						"updatedAt"
					) VALUES (
						${id},
						${item.name},
						${item.online_registration},
						${item.cbnet},
						${item.pbnet},
						${item.test_centre},
						${now},
						${now}
					)
					ON CONFLICT ("seriesName")
					DO UPDATE SET
						"onlineRegistration" = EXCLUDED."onlineRegistration",
						"cbnet" = EXCLUDED."cbnet",
						"pbnet" = EXCLUDED."pbnet",
						"testCentre" = EXCLUDED."testCentre",
						"updatedAt" = CURRENT_TIMESTAMP
					RETURNING *
				`;
			})
		);

		return NextResponse.json({ success: true, message: `Successfully stored ${results.length} series`, data: results.flat() });
	} catch (error: unknown) {
		console.error('Database error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function GET() {
	// Get SQL client with error handling
	const { client: sql, error } = getSqlClient();
	if (error) {
		console.error('Failed to initialize SQL client:', error);
		return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
	}

	try {
		const dates = await sql`
			SELECT * FROM nust_test_series 
			ORDER BY "seriesName"
		`;
		return NextResponse.json({ success: true, data: dates });
	} catch (error: unknown) {
		console.error('Database error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
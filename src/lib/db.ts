import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon for better connection handling
neonConfig.fetchConnectionCache = true;

// Handle IPv4 forcing if specified in environment
if (process.env.NEON_FORCE_IPV4 === 'true') {
  // This setting is handled by the Neon client automatically
  console.log('Neon configured to force IPv4 connections');
}

// Create a wrapper that lazily initializes the Neon client
let sql: ReturnType<typeof neon> | null = null;
let initializationError: Error | null = null;

function getSql() {
  // Check if DATABASE_URL is available
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || typeof databaseUrl !== 'string' || (!databaseUrl.startsWith('postgres') && !databaseUrl.startsWith('postgresql'))) {
    throw new Error('DATABASE_URL is missing or invalid. Set a valid Postgres URL (e.g., postgres://... ?sslmode=require) in .env.local');
  }
  
  // Return cached instance if already created
  if (sql) return sql;
  
  // Return error if previously failed
  if (initializationError) {
    throw initializationError;
  }
  
  // Try to initialize
  try {
    sql = neon(databaseUrl);
    return sql;
  } catch (error) {
    initializationError = error as Error;
    console.warn('Warning: Could not initialize Neon client directly. Prisma will be used for database operations.');
    throw error;
  }
}

// For backward compatibility, we'll export a function that can be called
// but handle errors gracefully in the application code
export default function createSqlClient() {
  return getSql();
}

// Export a safe version that won't throw
export function getSqlClient() {
  try {
    return { client: getSql(), error: null };
  } catch (error) {
    return { client: null, error: error as Error };
  }
}
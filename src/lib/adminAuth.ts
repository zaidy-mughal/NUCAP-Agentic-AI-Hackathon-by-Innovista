import { cookies } from 'next/headers';

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin-session');
    const expected = process.env.ADMIN_SESSION_TOKEN || 'admin-session-token';
    return !!adminSession && adminSession.value === expected;
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    return false;
  }
}

export async function requireAdminAuth() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    throw new Error('Unauthorized: Admin access required');
  }
  return true;
}
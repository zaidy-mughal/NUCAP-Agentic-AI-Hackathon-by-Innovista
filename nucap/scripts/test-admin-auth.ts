import { isAdminAuthenticated } from '@/lib/adminAuth';

// This is a simple test to verify admin auth functionality
async function testAdminAuth() {
  try {
    // This will return false when no cookie is set
    const isAuthenticated = await isAdminAuthenticated();
    console.log('Admin authentication test result:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('Admin authentication is working correctly - no session found');
    } else {
      console.log('Unexpected: Admin session found');
    }
  } catch (error) {
    console.error('Error testing admin authentication:', error);
  }
}

// Run the test
testAdminAuth();
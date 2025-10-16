import { isAdminAuthenticated } from '@/lib/adminAuth';
import { cookies } from 'next/headers';

// Mock the cookies function
jest.mock('next/headers', () => ({
  cookies: jest.fn()
}));

// Mock environment variables
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  env: {
    ...jest.requireActual('process').env,
    ADMIN_SESSION_TOKEN: 'admin-session-token'
  }
}));

describe('Admin Authentication', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('isAdminAuthenticated', () => {
    it('should return false when no admin session cookie exists', async () => {
      // Mock cookies to return undefined for admin-session
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue(undefined)
      });

      const result = await isAdminAuthenticated();
      expect(result).toBe(false);
    });

    it('should return false when admin session cookie value is not correct', async () => {
      // Mock cookies to return a different value
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue({ value: 'invalid' })
      });

      const result = await isAdminAuthenticated();
      expect(result).toBe(false);
    });

    it('should return true when admin session cookie is properly set', async () => {
      // Mock cookies to return the correct value
      (cookies as jest.Mock).mockReturnValue({
        get: jest.fn().mockReturnValue({ value: 'admin-session-token' })
      });

      const result = await isAdminAuthenticated();
      expect(result).toBe(true);
    });

    it('should handle errors gracefully and return false', async () => {
      // Mock cookies to throw an error
      (cookies as jest.Mock).mockImplementation(() => {
        throw new Error('Cookie error');
      });

      const result = await isAdminAuthenticated();
      expect(result).toBe(false);
    });
  });
});
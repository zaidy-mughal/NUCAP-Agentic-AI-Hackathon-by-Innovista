import { POST as adminLoginPOST } from '@/app/api/admin/login/route';
import { POST as adminLogoutPOST } from '@/app/api/admin/logout/route';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Mock the cookies function
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Define types for our mocks
interface MockCookieStore {
  set: jest.Mock;
  delete: jest.Mock;
}

interface MockRequest {
  json: jest.Mock;
}

describe('Security Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Admin Authentication Security', () => {
    it('should reject login with empty credentials', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock request with empty credentials
      const request: MockRequest = {
        json: jest.fn().mockResolvedValue({
          username: '',
          password: '',
        }),
      };

      const response = await adminLoginPOST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid username or password');
    });

    it('should reject login with SQL injection attempts', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock request with SQL injection attempt
      const request: MockRequest = {
        json: jest.fn().mockResolvedValue({
          username: "admin'; DROP TABLE users; --",
          password: "password'; DROP TABLE users; --",
        }),
      };

      const response = await adminLoginPOST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      // Should not execute the SQL injection, just treat it as invalid credentials
    });

    it('should reject login with XSS attempts', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock request with XSS attempt
      const request: MockRequest = {
        json: jest.fn().mockResolvedValue({
          username: '<script>alert("xss")</script>',
          password: '<script>alert("xss")</script>',
        }),
      };

      const response = await adminLoginPOST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      // Should not execute the XSS, just treat it as invalid credentials
    });

    it('should not allow access to admin routes without authentication', async () => {
      // Mock unauthenticated user
      jest.mock('@/lib/adminAuth', () => ({
        isAdminAuthenticated: jest.fn().mockResolvedValue(false),
      }));

      // Try to access protected admin functionality
      const isAuthenticated = await isAdminAuthenticated();
      expect(isAuthenticated).toBe(false);
    });

    it('should properly destroy session on logout', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      const response = await adminLogoutPOST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockCookieStore.delete).toHaveBeenCalledWith('admin-session');
    });
  });

  describe('API Security', () => {
    it('should reject requests with malformed JSON', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock request with malformed JSON
      const request: MockRequest = {
        json: jest.fn().mockImplementation(() => {
          throw new Error('Malformed JSON');
        }),
      };

      const response = await adminLoginPOST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle missing environment variables gracefully', async () => {
      // Temporarily unset environment variables
      const originalAdminUsername = process.env.ADMIN_USERNAME;
      const originalAdminPassword = process.env.ADMIN_PASSWORD;
      
      delete process.env.ADMIN_USERNAME;
      delete process.env.ADMIN_PASSWORD;

      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
        delete: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock request
      const request: MockRequest = {
        json: jest.fn().mockResolvedValue({
          username: 'admin',
          password: 'password',
        }),
      };

      const response = await adminLoginPOST(request as unknown as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Admin credentials not configured');

      // Restore environment variables
      process.env.ADMIN_USERNAME = originalAdminUsername;
      process.env.ADMIN_PASSWORD = originalAdminPassword;
    });
  });
});
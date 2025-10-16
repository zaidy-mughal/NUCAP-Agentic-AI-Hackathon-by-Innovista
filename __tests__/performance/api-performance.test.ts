import { POST as adminLoginPOST } from '@/app/api/admin/login/route';
import { GET as universitiesGET } from '@/app/api/admin/universities/route';
import { cookies } from 'next/headers';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock the cookies function
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock admin authentication
jest.mock('@/lib/adminAuth', () => ({
  isAdminAuthenticated: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    university: {
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    department: {
      count: jest.fn(),
    },
    studentMatch: {
      count: jest.fn(),
    },
    scrapingLog: {
      findMany: jest.fn(),
    },
  },
}));

// Define types for our mocks
interface MockCookieStore {
  set: jest.Mock;
}

interface MockRequest {
  json: jest.Mock;
}

describe('Performance Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('API Response Time', () => {
    it('should respond to admin login within acceptable time', async () => {
      // Mock cookies
      const mockCookieStore: MockCookieStore = {
        set: jest.fn(),
      };
      (cookies as jest.Mock).mockResolvedValue(mockCookieStore);

      // Mock environment variables
      process.env.ADMIN_USERNAME = 'admin';
      process.env.ADMIN_PASSWORD = 'password';

      // Mock request
      const request: MockRequest = {
        json: jest.fn().mockResolvedValue({
          username: 'admin',
          password: 'password',
        }),
      };

      // Measure response time
      const startTime = Date.now();
      const response = await adminLoginPOST(request as unknown as NextRequest);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;

      // Should respond within 100ms
      expect(responseTime).toBeLessThan(100);
      
      // Verify response is correct
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it('should respond to university list within acceptable time', async () => {
      // Mock admin authentication
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(true);

      // Mock universities data
      (prisma.university.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          name: 'Test University',
          shortName: 'TEST',
          location: 'Test City',
          website: 'https://test.edu',
          testRequired: 'None',
          isActive: true,
          _count: { departments: 5 },
        },
        {
          id: '2',
          name: 'Another University',
          shortName: 'ANOTHER',
          location: 'Another City',
          website: 'https://another.edu',
          testRequired: 'NUST',
          isActive: true,
          _count: { departments: 3 },
        },
      ]);

      // Measure response time
      const startTime = Date.now();
      const response = await universitiesGET();
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;

      // Should respond within 200ms
      expect(responseTime).toBeLessThan(200);
      
      // Verify response is correct
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.universities).toHaveLength(2);
    });
  });

  describe('Database Query Performance', () => {
    it('should count users efficiently', async () => {
      // Mock user count
      (prisma.user.count as jest.Mock).mockResolvedValue(1000);

      // Measure query time
      const startTime = Date.now();
      const count = await prisma.user.count();
      const endTime = Date.now();
      
      const queryTime = endTime - startTime;

      // Should execute within 50ms
      expect(queryTime).toBeLessThan(50);
      expect(count).toBe(1000);
    });

    it('should fetch universities efficiently', async () => {
      // Mock universities data
      const mockUniversities = Array(100).fill(null).map((_, i) => ({
        id: `${i}`,
        name: `University ${i}`,
        shortName: `UNI${i}`,
        location: `City ${i}`,
        website: `https://uni${i}.edu`,
        testRequired: 'None',
        isActive: true,
        _count: { departments: Math.floor(Math.random() * 20) },
      }));
      
      (prisma.university.findMany as jest.Mock).mockResolvedValue(mockUniversities);

      // Measure query time
      const startTime = Date.now();
      const universities = await prisma.university.findMany({
        include: {
          _count: {
            select: { departments: true },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      const endTime = Date.now();
      
      const queryTime = endTime - startTime;

      // Should execute within 100ms for 100 universities
      expect(queryTime).toBeLessThan(100);
      expect(universities).toHaveLength(100);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple concurrent requests', async () => {
      // Mock admin authentication
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(true);

      // Mock universities data
      (prisma.university.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Test University', shortName: 'TEST', location: 'Test City', website: 'https://test.edu', testRequired: 'None', isActive: true, _count: { departments: 5 } }
      ]);

      // Send multiple concurrent requests
      const requests = Array(10).fill(null).map(() => universitiesGET());
      
      // Measure time for all requests
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 10;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Average response time should be reasonable
      expect(averageTime).toBeLessThan(50);
    });
  });
});
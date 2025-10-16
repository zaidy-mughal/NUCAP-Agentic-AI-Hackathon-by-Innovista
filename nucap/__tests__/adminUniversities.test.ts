import { POST as universitiesPOST, GET as universitiesGET } from '@/app/api/admin/universities/route';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock the dependencies
jest.mock('@/lib/adminAuth', () => ({
  isAdminAuthenticated: jest.fn()
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    university: {
      create: jest.fn(),
      findMany: jest.fn()
    }
  }
}));

// Simplified mock request
const createMockRequest = (body?: Record<string, unknown>) => {
  return {
    json: jest.fn().mockResolvedValue(body || {})
  } as unknown as NextRequest;
};

describe('Admin Universities API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/admin/universities', () => {
    it('should return 401 when admin is not authenticated', async () => {
      // Mock unauthenticated admin
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(false);

      const request = createMockRequest({
        name: 'Test University',
        shortName: 'TEST',
        location: 'Test City',
        website: 'https://test.edu',
        testRequired: 'None'
      });

      const response = await universitiesPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create a university when admin is authenticated', async () => {
      // Mock authenticated admin
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(true);

      // Mock university creation
      (prisma.university.create as jest.Mock).mockResolvedValueOnce({
        id: 'uni_123',
        name: 'Test University',
        shortName: 'TEST',
        location: 'Test City',
        website: 'https://test.edu',
        testRequired: 'None',
        isActive: true
      });

      const request = createMockRequest({
        name: 'Test University',
        shortName: 'TEST',
        location: 'Test City',
        website: 'https://test.edu',
        testRequired: 'None'
      });

      const response = await universitiesPOST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.university).toBeDefined();
      expect(data.university.id).toBe('uni_123');
    });
  });

  describe('GET /api/admin/universities', () => {
    it('should return 401 when admin is not authenticated', async () => {
      // Mock unauthenticated admin
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(false);

      const response = await universitiesGET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return universities when admin is authenticated', async () => {
      // Mock authenticated admin
      (isAdminAuthenticated as jest.Mock).mockResolvedValue(true);

      // Mock universities data
      (prisma.university.findMany as jest.Mock).mockResolvedValueOnce([
        {
          id: 'uni_123',
          name: 'Test University',
          shortName: 'TEST',
          location: 'Test City',
          website: 'https://test.edu',
          testRequired: 'None',
          isActive: true,
          _count: {
            departments: 5
          }
        }
      ]);

      const response = await universitiesGET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.universities).toHaveLength(1);
      expect(data.universities[0].id).toBe('uni_123');
    });
  });
});
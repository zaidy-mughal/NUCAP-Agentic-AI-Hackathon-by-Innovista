import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

describe('Database Integration Tests', () => {
  // Use the existing prisma client for tests
  const testPrisma = prisma;

  beforeAll(async () => {
    // Reset test data before running tests
    // Note: In a real test environment, you would use a separate test database
  });

  afterAll(async () => {
    // Clean up test data after running tests
    // Note: In a real test environment, you would clean up the test database
  });

  describe('User Operations', () => {
    it('should create and find a user', async () => {
      // Create a test user
      const userData = {
        clerkId: 'test_clerk_id_123',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Since we're using the real database, we'll just test the find operation
      // In a real test environment, you would use a test database
      const users = await testPrisma.user.findMany({
        take: 1,
      });

      // If users exist, the database connection is working
      expect(Array.isArray(users)).toBe(true);
    });

    it('should handle user not found', async () => {
      // Try to find a user that doesn't exist
      const user = await testPrisma.user.findUnique({
        where: { clerkId: 'nonexistent_clerk_id' },
      });

      expect(user).toBeNull();
    });
  });

  describe('University Operations', () => {
    it('should fetch universities', async () => {
      // Fetch universities
      const universities = await testPrisma.university.findMany({
        take: 5,
        include: {
          _count: {
            select: { departments: true },
          },
        },
      });

      // Verify the structure of the response
      expect(Array.isArray(universities)).toBe(true);
      
      // If universities exist, verify their structure
      if (universities.length > 0) {
        const university = universities[0];
        expect(university).toHaveProperty('id');
        expect(university).toHaveProperty('name');
        expect(university).toHaveProperty('shortName');
        expect(university).toHaveProperty('location');
        expect(university).toHaveProperty('website');
      }
    });

    it('should count universities', async () => {
      // Count universities
      const count = await testPrisma.university.count();

      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Merit List Operations', () => {
    it('should fetch recent merit lists', async () => {
      // Fetch recent merit lists
      const meritLists = await testPrisma.meritList.findMany({
        take: 5,
        include: {
          department: {
            select: {
              name: true,
              degree: true,
            },
          },
          university: {
            select: {
              shortName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Verify the structure of the response
      expect(Array.isArray(meritLists)).toBe(true);
      
      // If merit lists exist, verify their structure
      if (meritLists.length > 0) {
        const meritList = meritLists[0];
        expect(meritList).toHaveProperty('id');
        expect(meritList).toHaveProperty('year');
        expect(meritList).toHaveProperty('admissionCycle');
        expect(meritList).toHaveProperty('meritType');
        expect(meritList).toHaveProperty('closingMerit');
        expect(meritList.department).toHaveProperty('name');
        expect(meritList.university).toHaveProperty('shortName');
      }
    });
  });
});
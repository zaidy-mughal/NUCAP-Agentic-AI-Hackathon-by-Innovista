import { POST } from '@/app/api/student/profile/route';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

// Mock the dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn()
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
    studentProfile: {
      create: jest.fn()
    }
  }
}));

// Simplified mock request
const createMockRequest = (body: Record<string, unknown>) => {
  return {
    json: jest.fn().mockResolvedValue(body)
  } as unknown as NextRequest;
};

describe('Student Profile API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/student/profile', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Mock unauthenticated user
      (auth as unknown as jest.Mock).mockReturnValue({ userId: null });

      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create a new student profile when user is authenticated and profile does not exist', async () => {
      // Mock authenticated user
      (auth as unknown as jest.Mock).mockReturnValue({ 
        userId: 'user_123', 
        sessionClaims: { 
          email: 'test@example.com', 
          name: 'Test User' 
        } 
      });

      // Mock user not found (will be created)
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: 'user_123',
        clerkId: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        studentProfile: null
      });

      // Mock profile creation
      (prisma.studentProfile.create as jest.Mock).mockResolvedValueOnce({
        id: 'profile_123',
        userId: 'user_123',
        matricTotalMarks: 1100,
        matricObtainedMarks: 950,
        matricPercentage: 86.36,
        matricBoard: 'Federal',
        matricYear: 2022,
        interTotalMarks: 1100,
        interObtainedMarks: 900,
        interPercentage: 81.82,
        interBoard: 'Federal',
        interGroup: 'Pre-Eng',
        interYear: 2024
      });

      const request = createMockRequest({
        matricTotalMarks: 1100,
        matricObtainedMarks: 950,
        matricBoard: 'Federal',
        matricYear: 2022,
        interTotalMarks: 1100,
        interObtainedMarks: 900,
        interBoard: 'Federal',
        interGroup: 'Pre-Eng',
        interYear: 2024,
        preferredCities: [],
        preferredFields: []
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.profile).toBeDefined();
      expect(data.profile.id).toBe('profile_123');
    });

    it('should return 409 when profile already exists', async () => {
      // Mock authenticated user
      (auth as unknown as jest.Mock).mockReturnValue({ userId: 'user_123' });

      // Mock user with existing profile
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'user_123',
        clerkId: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        studentProfile: {
          id: 'profile_123'
        }
      });

      const request = createMockRequest({
        matricTotalMarks: 1100,
        matricObtainedMarks: 950,
        matricBoard: 'Federal',
        matricYear: 2022,
        interTotalMarks: 1100,
        interObtainedMarks: 900,
        interBoard: 'Federal',
        interGroup: 'Pre-Eng',
        interYear: 2024,
        preferredCities: [],
        preferredFields: []
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('Profile already exists. Use PUT to update.');
    });
  });
});
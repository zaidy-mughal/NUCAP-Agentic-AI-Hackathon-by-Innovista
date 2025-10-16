import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '@/app/dashboard/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock clerk authentication
jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({
    userId: 'user_123',
  }),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'user_123',
        name: 'Test User',
        studentProfile: null,
      }),
    },
    university: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    admissionTimeline: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    universityUpdate: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    meritList: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

// Mock fetch for NUST test series
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock;

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dashboard with welcome message', async () => {
    // Since DashboardPage is an async component, we need to await it
    const DashboardComponent = await DashboardPage();
    render(DashboardComponent);
    
    // Check if the main elements are rendered
    expect(screen.getByText('NUCAP')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
  });

  it('should show complete profile alert when user has no profile', async () => {
    // Mock user without profile
    const mockUserWithoutProfile = {
      id: 'user_123',
      name: 'Test User',
      studentProfile: null,
    };
    
    jest.requireMock('@/lib/prisma').prisma.user.findUnique.mockResolvedValue(mockUserWithoutProfile);
    
    const DashboardComponent = await DashboardPage();
    render(DashboardComponent);
    
    // Check if the complete profile alert is shown
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete Profile' })).toBeInTheDocument();
  });

  it('should show university database section', async () => {
    const DashboardComponent = await DashboardPage();
    render(DashboardComponent);
    
    // Check if university database section is rendered
    expect(screen.getByText('University Database')).toBeInTheDocument();
  });
});
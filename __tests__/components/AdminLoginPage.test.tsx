import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdminLoginPage from '@/app/admin/login/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock fetch API
global.fetch = jest.fn();

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login form correctly', () => {
    render(<AdminLoginPage />);
    
    // Check if the main elements are rendered
    expect(screen.getByText('NUCAP Admin')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access the admin panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should allow users to type in the username and password fields', async () => {
    render(<AdminLoginPage />);
    
    const user = userEvent.setup();
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'password123');
    
    expect(usernameInput).toHaveValue('admin');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should show error message when login fails', async () => {
    // Mock failed login response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ error: 'Invalid credentials' }),
    });
    
    render(<AdminLoginPage />);
    
    const user = userEvent.setup();
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);
    
    // Wait for error message to appear
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should call router.push on successful login', async () => {
    // Mock successful login response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ success: true }),
    });
    
    const mockPush = jest.fn();
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: mockPush,
      refresh: jest.fn(),
    }));
    
    render(<AdminLoginPage />);
    
    const user = userEvent.setup();
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Wait for router.push to be called
    expect(mockPush).toHaveBeenCalledWith('/admin');
  });
});
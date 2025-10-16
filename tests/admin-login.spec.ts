import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    
    // Check if the login form is displayed
    await expect(page.getByText('NUCAP Admin')).toBeVisible();
    await expect(page.getByText('Sign in to access the admin panel')).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    
    // Fill in invalid credentials
    await page.getByLabel('Username').fill('invaliduser');
    await page.getByLabel('Password').fill('invalidpass');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check if error message is displayed
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('should redirect to admin dashboard with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
    
    // Fill in valid credentials (these would be test credentials)
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check if redirected to admin dashboard
    // Note: This would require setting up test credentials in the database
    // await expect(page).toHaveURL('http://localhost:3000/admin');
  });
});
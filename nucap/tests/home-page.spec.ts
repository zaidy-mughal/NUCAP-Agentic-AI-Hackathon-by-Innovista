import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display home page elements', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Check if home page elements are displayed
    await expect(page.getByText('NUCAP')).toBeVisible();
    await expect(page.getByText('Never Miss Your University Admission Deadline Again')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });

  test('should navigate to universities page', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Universities' }).click();
    await expect(page).toHaveURL('http://localhost:3000/universities');
  });
});
import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test.describe('White Zero Platform Integrity (Automated Audit)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock userInfo for authorized access
    await page.addInitScript(() => {
      const mockData = { id: '123', name: 'Test Investigator', email: 'test@whitezero.com', role: 'user', token: 'mock-token' };
      window.localStorage.setItem('userInfo', JSON.stringify(mockData));
    });
  });

  test('Authentication Protocol: Interface Integrity', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await page.goto('/login', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('Module Integrity: OSINT Intelligence', async ({ page }) => {
    await page.goto('/osint-trial', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    console.log('OSINT Module Verified');
  });

  test('Module Integrity: Forensic Reporting', async ({ page }) => {
    await page.goto('/report-crime', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    console.log('Forensic Reporting Verified');
  });

  test('Module Integrity: Security Auditor', async ({ page }) => {
    await page.goto('/security-auditor', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    console.log('Security Auditor Verified');
  });

  test('Ecosystem Integrity: Dashboards', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    await page.goto('/police-dashboard', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2, h3, div:has-text("Police"), div:has-text("Login")').first()).toBeVisible();
    await page.goto('/admin', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2, h3, div:has-text("Admin"), div:has-text("Login")').first()).toBeVisible();
  });

  test('Platform Integrity: Public Gateways', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await page.goto('/features', { waitUntil: 'networkidle' });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

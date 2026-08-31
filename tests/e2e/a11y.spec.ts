import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    blocking,
    blocking.map((v) => `${v.id} (${v.impact}): ${v.help}`).join('\n'),
  ).toEqual([]);
}

test.describe('accessibility — light theme', () => {
  test('no serious or critical axe violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expectNoSeriousViolations(page);
  });

  test('exactly one h1 and no skipped heading level', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (els) =>
      els.map((el) => Number(el.tagName[1])),
    );
    expect(levels[0]).toBe(1);
    let prev = 0;
    for (const level of levels) {
      expect(level).toBeLessThanOrEqual(prev + 1);
      prev = level;
    }
  });

  test('skip link is keyboard focusable and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#contenido"]').first();
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('contenido');
  });
});

test.describe('accessibility — dark theme', () => {
  test.use({ storageState: undefined });

  test('no serious or critical axe violations in dark mode', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expectNoSeriousViolations(page);
  });

  test('seeded dark preference applies before first paint', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('theme toggle', () => {
  test('click flips .dark and the choice persists across reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
  });
});

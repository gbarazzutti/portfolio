import { test, expect } from '@playwright/test';

test.describe('responsive + runtime health', () => {
  test('no horizontal overflow at 320px and nav stays sticky', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const navTop = await page.locator('nav').evaluate((el) => el.getBoundingClientRect().top);
    expect(navTop).toBeLessThanOrEqual(1);
  });

  test('every section anchor is reachable at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/');
    for (const id of ['servicios', 'proyectos', 'sobre-mi', 'contacto']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('reduced motion makes anchor navigation instant', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    expect(behavior).toBe('auto');
    await context.close();
  });

  test('loads and toggles theme with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await page.locator('#theme-toggle').click();
    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(200);

    expect(errors, errors.join('\n')).toEqual([]);
  });
});

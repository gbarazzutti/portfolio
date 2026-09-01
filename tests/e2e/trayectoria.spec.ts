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

// The page uses one-shot `.reveal` blocks (opacity:0 until seen). Step through
// the whole document so every block is painted before axe runs.
async function revealWholePage(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const tick = () => {
        window.scrollTo(0, y);
        y += Math.round(window.innerHeight * 0.8);
        if (y < document.body.scrollHeight) {
          requestAnimationFrame(tick);
        } else {
          window.scrollTo(0, document.body.scrollHeight);
          setTimeout(() => {
            window.scrollTo(0, 0);
            resolve();
          }, 100);
        }
      };
      tick();
    });
  });
  await page.waitForTimeout(500);
}

test.describe('/trayectoria — accessibility', () => {
  test('no serious or critical axe violations — light theme', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'));
    await page.goto('/trayectoria');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await revealWholePage(page);
    await expectNoSeriousViolations(page);
  });

  test('no serious or critical axe violations — dark theme', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/trayectoria');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await revealWholePage(page);
    await expectNoSeriousViolations(page);
  });
});

test.describe('/trayectoria — structure', () => {
  test('exactly one h1 and no skipped heading level', async ({ page }) => {
    await page.goto('/trayectoria');
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
    await page.goto('/trayectoria');
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#contenido"]').first();
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('contenido');
  });

  test('every in-page anchor resolves to a real id', async ({ page }) => {
    await page.goto('/trayectoria');
    const hrefs = await page.$$eval('a[href^="#"]', (els) =>
      els.map((el) => el.getAttribute('href') ?? ''),
    );
    for (const href of hrefs) {
      const id = href.slice(1);
      if (!id) continue;
      const found = await page.evaluate((x) => !!document.getElementById(x), id);
      expect(found, `missing #${id}`).toBe(true);
    }
  });
});

// Optional browser QA: set PLAYWRIGHT_MODULE to your installed Playwright module.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error' && !msg.text().includes('503')) errors.push(msg.text()); });
  const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
  const routes = ['/', '/services/', '/about/', '/contact/', '/en/', '/en/services/', '/en/about/', '/en/contact/'];
  const folder = path.join(__dirname, '../test-results');
  fs.mkdirSync(folder, { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('html').getAttribute('lang'), route.startsWith('/en') ? 'en' : 'bg');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Overflow: ${route}, ${width}px`);
      assert.equal(await page.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)), true, `Images ${route}`);
      assert.equal(await page.locator('.main-nav>a').count(), 4);
      if (width === 1440 && ['/', '/en/', '/contact/'].includes(route)) await page.screenshot({ path: path.join(folder, `desktop-${route === '/' ? 'bg' : route === '/en/' ? 'en' : 'contact'}.png`), fullPage: true });
      if (width === 390 && route === '/') await page.screenshot({ path: path.join(folder, 'mobile-bg.png'), fullPage: true });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/services/');
  await page.getByRole('button', { name: 'Меню' }).click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.locator('.language-switch a').click();
  await page.waitForURL('**/en/services/');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.goto(origin + '/contact/');
  await page.locator('#name').fill('Иван Петров');
  await page.locator('#email').fill('client@example.com');
  await page.locator('#message').fill('Бих искал да автоматизирам работата с фактури.');
  // Never transmit an email from UI QA: mock the local endpoint.
  await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.getByRole('button', { name: 'Изпрати запитване' }).click();
  await page.locator('#form-status[data-state="success"]').waitFor();
  assert.equal(await page.locator('#name').inputValue(), '');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
  await page.locator('#name').fill('Иван Петров');
  await page.locator('#email').fill('client@example.com');
  await page.locator('#message').fill('Бих искал да автоматизирам работата с фактури.');
  await page.getByRole('button', { name: 'Изпрати запитване' }).click();
  await page.locator('#form-status[data-state="error"]').waitFor();
  assert.ok((await page.locator('#form-status').textContent()).includes('velnovaragroup@gmail.com'));
  assert.equal(await page.locator('#name').inputValue(), 'Иван Петров');
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: 8 routes × 4 widths, images, language switching, mobile menu, success and error form states.');
})().catch(e => { console.error(e); process.exit(1); });

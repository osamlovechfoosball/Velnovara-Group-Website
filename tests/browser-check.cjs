// Browser QA (runs on GitHub; locally: npm install --no-save playwright, npx playwright install chromium,
// then npm start in one terminal and npm run test:browser in another).
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error' && !msg.text().includes('status of 500')) errors.push(msg.text()); });
  const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
  const routes = ['/', '/en/', '/privacy/', '/gdpr/', '/en/privacy/', '/en/gdpr/'];
  const folder = path.join(__dirname, '../test-results');
  fs.mkdirSync(folder, { recursive: true });
  const links = new Set();

  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    for (const route of routes) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      await page.waitForLoadState('networkidle');
      await page.locator('img').evaluateAll(imgs => imgs.forEach(img => { img.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
      assert.equal(await page.locator('h1').count(), 1, `One H1: ${route}`);
      assert.equal(await page.locator('html').getAttribute('lang'), route.startsWith('/en') ? 'en' : 'bg');
      assert.equal(await page.locator('.main-nav>a[data-section]').count(), 4);
      const result = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          clipped: [...document.querySelectorAll('main h1, main h2')].some(h => h.scrollWidth > h.clientWidth + 1),
          duplicates: ids.filter((id, i) => ids.indexOf(id) !== i),
          unnamed: [...document.querySelectorAll('a,button')].filter(e => !e.textContent.trim() && !e.getAttribute('aria-label')).length,
          links: [...document.querySelectorAll('a[href]')].map(e => e.href)
        };
      });
      assert.ok(!result.overflow, `Overflow: ${route}, ${width}px`);
      assert.ok(!result.clipped, `Clipped heading: ${route}, ${width}px`);
      assert.deepEqual(result.duplicates, [], `Duplicate ids: ${route}`);
      assert.equal(result.unnamed, 0, `Unnamed controls: ${route}`);
      result.links.filter(href => href.startsWith(origin)).forEach(href => links.add(href));
      if ((width === 1440 || width === 390) && (route === '/' || route === '/en/')) {
        await page.screenshot({ path: path.join(folder, `${width === 1440 ? 'desktop' : 'mobile'}-${route === '/' ? 'bg' : 'en'}.png`), fullPage: true });
      }
    }
  }

  // Every internal link resolves, and every fragment exists on its page.
  for (const href of links) {
    const url = new URL(href);
    assert.equal((await page.request.get(url.origin + url.pathname)).status(), 200, href);
    if (url.hash) {
      await page.goto(url.origin + url.pathname);
      assert.equal(await page.locator(`[id="${url.hash.slice(1)}"]`).count(), 1, href);
    }
  }

  // Former pages forward to their section (GitHub Pages cannot redirect, so they are small forwarding pages).
  for (const [from, to] of [['/services/', '/#services'], ['/en/about/', '/en/#about'], ['/contact/', '/#contact']]) {
    await page.goto(origin + from);
    await page.waitForURL(url => url.pathname + url.hash === to);
  }
  assert.equal((await page.request.get(origin + '/not-a-page/')).status(), 404);

  // Mobile menu, scroll navigation and language switching.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/');
  await page.locator('.menu-toggle').click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  assert.ok(await page.locator('.main-nav').isVisible());
  await page.locator('.main-nav a[data-section="about"]').click();
  await page.waitForURL('**/#about');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await page.waitForTimeout(800);
  const aboutBefore = await page.locator('#about').evaluate(el => el.getBoundingClientRect().top);
  // dispatchEvent: Playwright's click() first scrolls the sticky header "into view", which moves the page.
  await page.locator('.menu-toggle').dispatchEvent('click');
  await page.locator('.language-switch a').dispatchEvent('click');
  await page.waitForURL(url => url.pathname === '/en/');
  await page.waitForLoadState('load');
  // The visitor stays on the same section after switching language.
  const aboutAfter = await page.locator('#about').evaluate(el => el.getBoundingClientRect().top);
  assert.ok(Math.abs(aboutAfter - aboutBefore) < 60, `Language switch kept position: ${aboutBefore} → ${aboutAfter}`);
  await page.locator('.menu-toggle').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');

  // Services show one at a time.
  await page.goto(origin + '/');
  await page.locator('#tab-ai').click();
  assert.equal(await page.locator('.service:not([hidden])').count(), 1);
  assert.ok(await page.locator('#ai').isVisible());

  // Form states, with Web3Forms mocked so no email is ever sent.
  const web3forms = (status, body) => route => route.request().method() === 'OPTIONS'
    ? route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type, Accept' } })
    : route.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
  let sent = null;
  await page.route('https://api.web3forms.com/**', route => { if (route.request().method() === 'POST') sent = route.request().postDataJSON(); return web3forms(200, { success: true })(route); });
  await page.locator('#name').fill('Иван Петров');
  await page.locator('#email').fill('client@example.com');
  await page.locator('#message').fill('Бих искал да автоматизирам работата с фактури.');
  await page.locator('#contact-form button[type="submit"]').click();
  await page.locator('#form-status[data-state="success"]').waitFor();
  assert.equal(await page.locator('#name').inputValue(), '');
  assert.equal(sent.email, 'client@example.com');
  assert.match(sent.access_key, /^[0-9a-f-]{36}$/);
  await page.unroute('https://api.web3forms.com/**');
  await page.route('https://api.web3forms.com/**', web3forms(500, { success: false }));
  await page.locator('#name').fill('Иван Петров');
  await page.locator('#email').fill('client@example.com');
  await page.locator('#message').fill('Бих искал да автоматизирам работата с фактури.');
  await page.locator('#contact-form button[type="submit"]').click();
  await page.locator('#form-status[data-state="error"]').waitFor();
  assert.ok((await page.locator('#form-status').textContent()).includes('не беше изпратено'));
  assert.equal(await page.locator('#name').inputValue(), 'Иван Петров');

  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: 6 routes × 5 widths, links and fragments, forwarding pages, mobile menu, language switch, service tabs, form states.');
})().catch(e => { console.error(e); process.exit(1); });

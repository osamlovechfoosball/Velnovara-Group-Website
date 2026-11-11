const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const report = [];
  const routes = ['/', '/services/', '/about/', '/contact/', '/en/', '/en/services/', '/en/about/', '/en/contact/'];
  for (const width of [1440, 390, 768, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(`http://localhost:3127${route}`);
      await page.waitForLoadState('networkidle');
      await page.locator('img').evaluateAll(images => images.forEach(i => { i.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.images].every(i => i.complete));
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('h1').count(), 1);
      const metrics = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        images: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        headings: [...document.querySelectorAll('h1,h2,h3')].map(h => h.textContent),
        badLinks: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash)
      }));
      assert.ok(metrics.scrollWidth <= width, `Overflow ${width} ${route}: ${metrics.scrollWidth}`);
      assert.ok(metrics.images, `Image failure ${route}`);
      assert.deepEqual(metrics.badLinks, []);
      assert.deepEqual(errors, []);
      if (width === 1440 || width === 390) await page.screenshot({ path: `design-previews/${route.replaceAll('/', '-').replace(/^-|-$/g, '') || 'home'}-${width}.png`, fullPage: true });
      report.push({ route, width, ...metrics });
      const langLink = page.locator('.language-switch a');
      const expected = route.startsWith('/en') ? route.replace(/^\/en/, '') || '/' : `/en${route}`;
      assert.equal(await langLink.getAttribute('href'), expected);
      if (width < 801) {
        await page.locator('.menu-toggle').click();
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
        assert.ok(await page.locator('#main-nav').isVisible());
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      }
    }
    await page.close();
  }
  const page = await browser.newPage();
  await page.goto('http://localhost:3127/contact/');
  await page.locator('#name').fill('Тестов посетител');
  await page.locator('#email').fill('review@example.com');
  await page.locator('#message').fill('Това е локална проверка на формуляра без изпращане на имейл.');
  // Intercept the endpoint: no live email is sent by this visual test.
  await page.route('**/api/contact', r => r.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }));
  await page.locator('button[type="submit"]').click();
  await page.locator('#form-status[data-state="error"]').waitFor();
  assert.ok((await page.locator('#form-status').textContent()).includes('support@velnovaragroup.eu'));
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.locator('button[type="submit"]').click();
  await page.locator('#form-status[data-state="success"]').waitFor();
  assert.equal(await page.locator('#name').inputValue(), '');
  assert.equal(await page.locator('button[type="submit"] span').textContent(), '↗');
  for (const [route, name, alternate] of [
    ['/contact/?service=ai', 'AI инструменти', '/en/contact/?service=ai'],
    ['/en/contact/?service=ai', 'AI tools', '/contact/?service=ai']
  ]) {
    await page.goto(`http://localhost:3127${route}`);
    assert.equal(await page.locator('#message').inputValue(), `${name}\n\n`);
    const langUrl = new URL(await page.locator('.language-switch a').getAttribute('href'), 'http://localhost:3127');
    assert.equal(langUrl.pathname + langUrl.search, alternate);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3127/');
  assert.equal(await page.locator('.route-dot').evaluate(e => getComputedStyle(e).animationName), 'none');
  const internalLinks = new Set();
  for (const route of routes) {
    await page.goto(`http://localhost:3127${route}`);
    for (const href of await page.locator('a[href^="/"]').evaluateAll(links => links.map(a => a.href))) internalLinks.add(href);
  }
  for (const href of internalLinks) assert.equal((await page.request.get(href)).status(), 200, `Broken link ${href}`);
  fs.writeFileSync('design-previews/visual-review.json', JSON.stringify(report, null, 2));
  await browser.close();
  console.log('Passed 32 page/viewport checks, navigation, language links, images, overflow, anchors and mocked form states.');
})().catch(e => { console.error(e); process.exit(1); });

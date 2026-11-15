import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, env: { ...process.env, SITE_URL: 'https://velnovaragroup.eu' }, stdio: 'ignore' });
const read = path => readFile(root + 'dist/' + path, 'utf8');

test('every page carries the security policy, allowing only Web3Forms as an outside connection', async () => {
  for (const page of ['index.html', 'en/index.html', 'privacy/index.html', 'gdpr/index.html', 'en/privacy/index.html', 'en/gdpr/index.html']) {
    const html = await read(page);
    const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
    assert.ok(csp, `CSP missing on ${page}`);
    assert.match(csp, /script-src 'self';/);
    assert.match(csp, /connect-src 'self' https:\/\/api\.web3forms\.com;/);
    assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin">/, `Referrer policy missing on ${page}`);
  }
});

test('the form has its access key and the page loads app.js as a versioned module', async () => {
  const html = await read('index.html');
  const strings = JSON.parse(html.match(/<script type="application\/json" id="ui-strings">([^<]+)<\/script>/)[1]);
  assert.match(strings.formKey, /^[0-9a-f-]{36}$/);
  const version = html.match(/<script type="module" src="\/app\.js\?v=([0-9a-f]{10})">/)?.[1];
  assert.ok(version, 'app.js module tag missing');
  assert.match(await read('app.js'), new RegExp(`from './enquiry\\.js\\?v=${version}'`));
});

test('GitHub Pages files: custom domain, no Jekyll, forwarding pages for the old routes', async () => {
  assert.equal((await read('CNAME')).trim(), 'velnovaragroup.eu');
  await read('.nojekyll');
  for (const [page, target] of [['services', '/#services'], ['about', '/#about'], ['contact', '/#contact'], ['en/services', '/en/#services']]) {
    assert.match(await read(`${page}/index.html`), new RegExp(`http-equiv="refresh" content="0; url=${target}"`));
  }
});

test('six languages: each homepage has its language, all alternates and the language menu', async () => {
  const languages = ['bg', 'en', 'de', 'fr', 'es', 'it'];
  for (const lang of languages) {
    const html = await read(lang === 'bg' ? 'index.html' : `${lang}/index.html`);
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    for (const other of languages) assert.match(html, new RegExp(`hreflang="${other}" href="https://velnovaragroup\\.eu${other === 'bg' ? '/' : `/${other}/`}"`), `${lang}: alternate ${other}`);
    assert.equal((html.match(/<details class="lang-menu">/g) || []).length, 2, `${lang}: language menus`);
    // Only the Bulgarian homepage picks the visitor's language.
    assert.equal(html.includes('src="/lang.js'), lang === 'bg', `${lang}: lang.js`);
  }
  // Legal pages exist in Bulgarian and English; the other languages link to the English ones.
  assert.match(await read('de/index.html'), /href="\/en\/privacy\/"/);
  await assert.rejects(read('de/privacy/index.html'));
});

test('every language has exactly the same text structure as English', async () => {
  const { content } = await import('../scripts/content.mjs');
  const shape = value => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, shape(value[k])])) : typeof value;
  for (const lang of Object.keys(content)) assert.deepEqual(shape(content[lang]), shape(content.en), `${lang} differs from English`);
});

test('info@ is the main address; support@ is only in the privacy note and legal pages', async () => {
  for (const page of ['index.html', 'en/index.html', 'de/index.html']) {
    const html = await read(page);
    const contact = html.slice(html.indexOf('id="contact"'), html.indexOf('<footer'));
    assert.match(contact, /mailto:info@velnovaragroup\.eu/, page);
    assert.doesNotMatch(contact, /support@/, page);
    assert.match(html.slice(html.indexOf('<footer')), /mailto:support@velnovaragroup\.eu/, page);
  }
  assert.match(await read('privacy/index.html'), /mailto:support@velnovaragroup\.eu/);
});

test('the language picker: supported languages open their own version, everything else English', async () => {
  const { runInNewContext } = await import('node:vm');
  const context = {};
  context.globalThis = context;
  runInNewContext(await readFile(root + 'public/lang.js', 'utf8'), context);
  const pick = context.velnovaraPickLanguage;
  assert.equal(pick(['bg-BG', 'en']), 'bg');
  assert.equal(pick(['de-AT', 'de']), 'de');
  assert.equal(pick(['fr-CA']), 'fr');
  assert.equal(pick(['es-MX', 'en-US']), 'es');
  assert.equal(pick(['it']), 'it');
  assert.equal(pick(['pl-PL', 'ru']), 'en');
  assert.equal(pick(['ja', 'it-IT']), 'it');
  assert.equal(pick([]), 'en');
});

test('the built site contains no secrets or private addresses', async () => {
  const files = (await readdir(root + 'dist', { recursive: true })).filter(f => /\.(html|js|css|xml|txt)$/.test(f));
  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(text, /re_[A-Za-z0-9_]{20,}/, `API key in ${file}`);
    assert.doesNotMatch(text, /velnovaragroup@gmail\.com|osamlovechfoosball/, `private address in ${file}`);
  }
});

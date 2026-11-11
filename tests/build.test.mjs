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

test('the built site contains no secrets or private addresses', async () => {
  const files = (await readdir(root + 'dist', { recursive: true })).filter(f => /\.(html|js|css|xml|txt)$/.test(f));
  for (const file of files) {
    const text = await read(file);
    assert.doesNotMatch(text, /re_[A-Za-z0-9_]{20,}/, `API key in ${file}`);
    assert.doesNotMatch(text, /velnovaragroup@gmail\.com|osamlovechfoosball/, `private address in ${file}`);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createContactHandler, validateContact } from '../contact.mjs';
const data = { name: 'Иван Петров', email: 'client@example.com', message: 'Искам да автоматизирам процеса за фактури.', website: '', language: 'bg', submissionId: 'e34feecb-9c60-4e66-81b5-d64b00466b9f' };
const env = { PUBLIC_ORIGIN: 'https://example.com', RESEND_API_KEY: 'test-key-not-real', CONTACT_FROM: 'Website <website@example.com>', CONTACT_TO: 'velnovaragroup@gmail.com' };
async function request(handler, payload = data, options = {}) {
  const req = Readable.from([Buffer.from(JSON.stringify(payload))]);
  req.method = options.method || 'POST';
  req.headers = { origin: 'https://example.com', 'content-type': 'application/json', ...options.headers };
  req.socket = { remoteAddress: '127.0.0.1' };
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, writeHead(status, headers) { this.status = status; Object.assign(this.headers, headers); }, end(body) { this.body = body ? JSON.parse(body) : null; } };
  await handler(req, res);
  return res;
}
test('validates Unicode names, rejects injection, bad email, bot field and overlong messages', () => {
  assert.equal(validateContact(data).name, data.name);
  for (const patch of [{ name: 'x\r\nBcc: attacker@example.com' }, { email: 'invalid' }, { website: 'bot' }, { message: 'x'.repeat(5001) }, { name: null }]) assert.equal(validateContact({ ...data, ...patch }), null);
});
test('sends only to company address, sets reply-to, preserves message, and awaits provider receipt', async () => {
  let called;
  const handler = createContactHandler({ env, fetchImpl: async (url, options) => { called = { url, ...options }; return { ok: true, json: async () => ({ id: 'receipt-123' }) }; } });
  const result = await request(handler);
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  const payload = JSON.parse(called.body);
  assert.deepEqual(payload.to, ['velnovaragroup@gmail.com']);
  assert.equal(payload.reply_to, data.email);
  assert.ok(payload.text.includes(data.message));
  assert.equal(called.headers['Idempotency-Key'], `website-${data.submissionId}`);
});
test('unconfigured service and provider failures never report success', async () => {
  assert.equal((await request(createContactHandler({ env: { PUBLIC_ORIGIN: env.PUBLIC_ORIGIN } }))).status, 503);
  assert.equal((await request(createContactHandler({ env, fetchImpl: async () => ({ ok: false }) }))).status, 502);
  assert.equal((await request(createContactHandler({ env, fetchImpl: async () => ({ ok: true, json: async () => ({}) }) }))).status, 502);
});
test('rejects foreign origins, non-POST, invalid data, and oversized payloads', async () => {
  const handler = createContactHandler({ env });
  assert.equal((await request(handler, data, { headers: { origin: 'https://evil.example' } })).status, 403);
  assert.equal((await request(handler, data, { method: 'GET' })).status, 405);
  assert.equal((await request(handler, { ...data, email: 'bad' })).status, 400);
  assert.equal((await request(handler, data, { headers: { 'content-length': '25000' } })).status, 413);
});
test('limits bursts without sending extra email', async () => {
  const handler = createContactHandler({ env, fetchImpl: async () => ({ ok: true, json: async () => ({ id: 'ok' }) }) });
  for (let i = 0; i < 5; i++) assert.equal((await request(handler)).status, 200);
  assert.equal((await request(handler)).status, 429);
});

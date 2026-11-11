import test from 'node:test';
import assert from 'node:assert/strict';
import { sendEnquiry, web3formsUrl } from '../public/enquiry.js';

const data = { name: 'Иван Петров', email: 'client@example.com', message: 'Искам да автоматизирам процеса за фактури.', website: '' };
const strings = { formKey: 'test-key-not-real', subject: 'Velnovara Group — website enquiry / запитване' };
const reply = (status, body) => async () => ({ ok: status >= 200 && status < 300, status, json: async () => body });

test('sends the visitor’s details to Web3Forms with the access key and subject', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => { calls.push({ url, options }); return reply(200, { success: true })(); };
  assert.equal(await sendEnquiry({ data, language: 'bg', strings, fetchImpl }), 'success');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, web3formsUrl);
  assert.equal(calls[0].options.method, 'POST');
  const body = JSON.parse(calls[0].options.body);
  assert.deepEqual(
    { key: body.access_key, subject: body.subject, name: body.name, email: body.email, message: body.message, language: body.language, botcheck: body.botcheck },
    { key: strings.formKey, subject: strings.subject, name: data.name, email: data.email, message: data.message, language: 'bg', botcheck: '' }
  );
});

test('a filled honeypot reports success but sends nothing', async () => {
  let called = false;
  const outcome = await sendEnquiry({ data: { ...data, website: 'spam' }, language: 'en', strings, fetchImpl: async () => { called = true; } });
  assert.equal(outcome, 'success');
  assert.equal(called, false);
});

test('without an access key the form says it is unavailable and sends nothing', async () => {
  let called = false;
  assert.equal(await sendEnquiry({ data, language: 'en', strings: { ...strings, formKey: '' }, fetchImpl: async () => { called = true; } }), 'unavailable');
  assert.equal(called, false);
});

test('never reports success unless Web3Forms confirms it', async () => {
  const cases = [
    [reply(200, { success: false }), 'error'],
    [reply(400, { success: false, message: 'Invalid access key' }), 'error'],
    [reply(429, { success: false }), 'rate'],
    [reply(500, {}), 'error'],
    [async () => ({ ok: true, status: 200, json: async () => { throw new SyntaxError('not JSON'); } }), 'error'],
    [async () => { throw new TypeError('Failed to fetch'); }, 'error']
  ];
  for (const [fetchImpl, expected] of cases) assert.equal(await sendEnquiry({ data, language: 'bg', strings, fetchImpl }), expected);
});

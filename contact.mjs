import { createHash } from 'node:crypto';

const WINDOW = 15 * 60 * 1000;
const MAX_BODY = 24000;
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
export function validateContact(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const { name, email, message, website, submissionId } = data;
  if (![name, email, message].every(x => typeof x === 'string')) return null;
  if (name.trim().length < 2 || name.length > 100 || /[\r\n\x00-\x1f]/.test(name)) return null;
  if (email.length > 254 || !emailPattern.test(email) || /[\r\n]/.test(email)) return null;
  if (message.trim().length < 10 || message.length > 5000 || message.includes('\0')) return null;
  if (website && (typeof website !== 'string' || website.length)) return null;
  if (typeof submissionId !== 'string' || !/^[a-f0-9-]{36}$/i.test(submissionId)) return null;
  return { name: name.trim(), email: email.trim(), message: message.trim(), language: data.language === 'en' ? 'en' : 'bg', submissionId };
}
export function createContactHandler({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  const attempts = new Map();
  const reply = (res, code, value) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(JSON.stringify(value));
  };
  return async function contact(req, res) {
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(res, 405, { ok: false }); }
    if (!env.PUBLIC_ORIGIN) return reply(res, 503, { ok: false });
    if (req.headers.origin !== env.PUBLIC_ORIGIN || req.headers['sec-fetch-site'] === 'cross-site') return reply(res, 403, { ok: false });
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return reply(res, 415, { ok: false });
    const client = env.TRUST_PROXY === '1' ? String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim() : req.socket.remoteAddress;
    const key = createHash('sha256').update(String(client)).digest('hex');
    const time = now();
    for (const [ip, entry] of attempts) if (entry.reset < time) attempts.delete(ip);
    if (attempts.size > 10000 && !attempts.has(key)) return reply(res, 429, { ok: false });
    const entry = attempts.get(key) || { count: 0, reset: time + WINDOW };
    entry.count++;
    attempts.set(key, entry);
    if (entry.count > 5) { res.setHeader('Retry-After', String(Math.ceil((entry.reset - time) / 1000))); return reply(res, 429, { ok: false }); }
    if (Number(req.headers['content-length']) > MAX_BODY) return reply(res, 413, { ok: false });
    let raw = '';
    try {
      let length = 0;
      const chunks = [];
      for await (const chunk of req) {
        length += chunk.length;
        if (length > MAX_BODY) return reply(res, 413, { ok: false });
        chunks.push(Buffer.from(chunk));
      }
      raw = Buffer.concat(chunks).toString('utf8');
    } catch { return reply(res, 400, { ok: false }); }
    let data;
    try { data = validateContact(JSON.parse(raw)); } catch { return reply(res, 400, { ok: false }); }
    if (!data) return reply(res, 400, { ok: false });
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !emailPattern.test(env.CONTACT_TO || '')) return reply(res, 503, { ok: false });
    try {
      const result = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `website-${data.submissionId}` },
        body: JSON.stringify({
          from: env.CONTACT_FROM,
          to: [env.CONTACT_TO],
          reply_to: data.email,
          subject: `Velnovara Group — website enquiry / запитване`,
          text: `Name / Име: ${data.name}\nEmail / Имейл: ${data.email}\nLanguage: ${data.language}\n\n${data.message}`
        }),
        signal: AbortSignal.timeout(12000)
      });
      if (!result.ok) return reply(res, 502, { ok: false });
      const receipt = await result.json();
      if (typeof receipt.id !== 'string' || !receipt.id) return reply(res, 502, { ok: false });
      return reply(res, 200, { ok: true });
    } catch { return reply(res, 502, { ok: false }); }
  };
}

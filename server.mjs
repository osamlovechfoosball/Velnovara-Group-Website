import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContactHandler } from './contact.mjs';
import { company } from './scripts/content.mjs';

const project = fileURLToPath(new URL('./', import.meta.url));
const root = resolve(project, 'dist');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const env = { ...process.env, PUBLIC_ORIGIN: process.env.PUBLIC_ORIGIN || `http://localhost:${port}`, CONTACT_TO: process.env.CONTACT_TO || 'velnovaragroup@gmail.com' };
const contact = createContactHandler({ env });
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
// The former separate pages now live as sections of the one-page site.
const movedTo = pathname => {
  const match = pathname.match(/^\/(en\/)?(services|about|contact)\/?$/);
  return match && `/${match[1] || ''}#${match[2]}`;
};
const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'${company.formKey ? ' https://api.web3forms.com' : ''}; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`);
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/contact') return await contact(req, res);
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    const redirect = movedTo(url.pathname);
    if (redirect) { res.writeHead(301, { Location: redirect }); return res.end(); }
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.split('/').some(part => part.startsWith('.')) || pathname.includes('\\')) { res.writeHead(404); return res.end(); }
    let file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root + sep) && file !== root) { res.writeHead(404); return res.end(); }
    try {
      const info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith('/')) { res.writeHead(308, { Location: `${url.pathname}/${url.search}` }); return res.end(); }
        file = resolve(file, 'index.html');
      }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600', 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : await readFile(resolve(root, '404.html')));
    }
  } catch { if (!res.headersSent) res.writeHead(400); res.end(); }
});
server.requestTimeout = 20000;
server.headersTimeout = 15000;
server.listen(port, host, () => {
  console.log(`Velnovara Group: http://localhost:${port}`);
  console.log(env.RESEND_API_KEY && env.CONTACT_FROM ? 'Email integration configured.' : 'Email requires RESEND_API_KEY and CONTACT_FROM. No messages will be falsely reported as sent.');
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));

// Local preview of the built site (dist/), serving it the way GitHub Pages does:
// static files only, folder URLs with a trailing slash, and the site's 404 page.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(404); return res.end(); }
    let file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root + sep) && file !== root) { res.writeHead(404); return res.end(); }
    try {
      const info = await stat(file);
      if (info.isDirectory()) {
        if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: `${url.pathname}/${url.search}` }); return res.end(); }
        file = resolve(file, 'index.html');
      }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : await readFile(resolve(root, '404.html')));
    }
  } catch { if (!res.headersSent) res.writeHead(400); res.end(); }
});
server.listen(port, host, () => console.log(`Velnovara Group preview: http://localhost:${port}`));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => process.exit(0)));

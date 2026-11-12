import { mkdir, writeFile, cp, rm, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { content, company } from './content.mjs';
import { legalPage } from './legal.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = (process.env.SITE_URL || 'https://velnovaragroup.eu').replace(/\/$/, '');
if (!process.env.SITE_URL) console.warn(`SITE_URL is not set; canonical links and the sitemap use ${site}.`);

export const sections = ['top', 'services', 'about', 'contact'];
const legalPages = ['privacy', 'gdpr'];
const year = new Date().getUTCFullYear();
const version = createHash('sha256').update(await readFile(root + 'public/styles.css')).update(await readFile(root + 'public/app.js')).update(await readFile(root + 'public/enquiry.js')).digest('hex').slice(0, 10);

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const base = lang => (lang === 'en' ? '/en/' : '/');
const pathFor = (lang, page = '') => base(lang) + (page ? `${page}/` : '');
const svg = (paths, size = 32) => `<svg viewBox="0 0 ${size} ${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const serviceIcons = [
  '<path d="M6 9h20v14H6zM11 3v6m10-6v6M11 23v6m10-6v6M3 13h3m-3 6h3m20-6h3m-3 6h3"/><path d="m12 16 3 3 5-6"/>',
  '<path d="M16 3 27 9v14l-11 6L5 23V9zM5 9l11 7 11-7M16 16v13"/>',
  '<rect x="4" y="5" width="24" height="22" rx="2"/><path d="M4 12h24M11 12v15M8 8.5h1m3 0h1m3 0h1"/>',
  '<path d="m11 8-8 8 8 8m10-16 8 8-8 8M18 5l-4 22"/>',
  '<rect x="3" y="5" width="26" height="22" rx="2"/><path d="M3 12h26M7 8.5h1m3 0h1m3 0h1M7 17h10m-10 5h16"/>'
];
// Velnovara's own products: logo file and public site, keyed by the name used in content.mjs.
const productMeta = {
  OutboundFinder: { logo: '/assets/products/outboundfinder.svg', url: 'https://outboundfinder.eu', slug: 'outboundfinder' },
  Resido: { logo: '/assets/products/resido.webp', url: 'https://residoco.com', slug: 'resido' }
};

const brand = lang =>
  `<a class="brand" href="${base(lang)}#top" aria-label="Velnovara Group — ${content[lang].home}"><img src="/assets/mark.svg" width="46" height="34" alt=""><span class="brand-type"><span class="brand-name">VELNOVARA</span><span class="brand-group">GROUP</span><span class="brand-slogan">${content[lang].slogan}</span></span></a>`;

// Header links use the rolling-text effect: the word rolls up and a gold copy rolls in from below.
const navLinks = (lang, roll = false) =>
  content[lang].nav.map((label, i) => `<a href="${base(lang)}#${sections[i]}" data-section="${sections[i]}">${roll ? `<span class="roll" data-text="${label}"><span>${label}</span></span>` : label}</a>`).join('');

const header = (lang, page) => {
  const t = content[lang];
  const other = lang === 'bg' ? 'en' : 'bg';
  return `<header class="site-header"><div class="wrap header-inner">${brand(lang)}<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"><span class="menu-label">${t.menu}</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button><nav id="main-nav" class="main-nav" aria-label="${t.navLabel}">${navLinks(lang, true)}<div class="language-switch"><span aria-current="true">${lang.toUpperCase()}</span><a href="${pathFor(other, page)}" lang="${other}" hreflang="${other}" aria-label="${content[other].languageName}">${other.toUpperCase()}</a></div></nav></div></header>`;
};

const footer = lang => {
  const t = content[lang];
  const f = t.footer;
  // One row (logo · menu · legal links), then a short privacy note and one quiet legal line:
  // © company · ЕИК · city. The full address is in the privacy policy.
  const info = [
    `© ${year} ${company.legalName[lang] || 'Velnovara Group'}`,
    company.eik && `${f.eik} ${company.eik}`,
    company.vat && `${f.vat} ${company.vat}`,
    `${company.postal.city[lang]}, ${company.postal.country[lang]}`
  ].filter(Boolean);
  return `<footer class="site-footer"><div class="wrap footer-row">${brand(lang)}<nav class="footer-nav" aria-label="${t.footerNavLabel}">${navLinks(lang)}</nav><nav class="legal-links" aria-label="${t.legalNavLabel}">${legalPages.map((p, i) => `<a href="${pathFor(lang, p)}">${t.legal[i]}</a>`).join('')}</nav></div><div class="wrap footer-bottom"><p class="footer-privacy">${f.privacy.replace('{email}', `<a href="mailto:${company.contactEmail}">${company.contactEmail}</a>`)}</p><p class="footer-info">${info.map(item => `<span>${item}</span>`).join('<span class="sep" aria-hidden="true">·</span>')}</p></div></footer>`;
};

const hero = t => `<section class="hero" id="top"><div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow">${t.hero.eyebrow}</p><h1>${t.hero.title[0]} <span>${t.hero.title[1]}</span></h1><p class="lead">${t.hero.lead}</p><div class="actions"><a class="button" href="#services">${t.hero.primary}<span aria-hidden="true">→</span></a><a class="button button-secondary" href="#contact">${t.hero.secondary}</a></div></div><ul class="workflow" aria-label="${t.hero.cardsLabel}">${t.hero.cards.map(([label, text], i) => `<li class="workflow-card"><span class="workflow-icon">${svg(serviceIcons[i])}</span><strong>${label}</strong><span class="workflow-text">${text}</span></li>`).join('')}</ul></div></section>`;

const services = t => {
  const s = t.services;
  // Tabs: app.js shows one service at a time. Without JavaScript the links still work through :target.
  const index = `<div class="service-tabs" aria-label="${s.indexLabel}">${s.items.map((item, i) => `<a class="service-tab" href="#${item.id}" id="tab-${item.id}"><span class="service-tab-icon">${svg(serviceIcons[i])}</span><span>${item.title}</span></a>`).join('')}</div>`;
  const list = s.items.map((item, i) => `<article class="service" id="${item.id}"><div class="service-head"><span class="icon-badge">${svg(serviceIcons[i])}</span><div><h3>${item.title}</h3><p class="service-pitch">${item.pitch}</p></div></div><p class="service-body">${item.body}</p><ul class="feature-list">${item.features.map(x => `<li>${x}</li>`).join('')}</ul><div class="service-example"><span class="example-label">${s.exampleLabel}</span><p>${item.example}</p></div></article>`).join('');
  return `<section class="section services" id="services"><div class="wrap"><header class="section-head"><p class="eyebrow">${s.label}</p><h2>${s.title}</h2><p class="section-intro">${s.intro}</p></header><div class="services-layout">${index}<div class="service-panels">${list}</div></div></div></section>`;
};


// The Sofia photo comes in AVIF (smallest) with WebP as fallback, in two widths; the browser picks.
const photoSizes = '(max-width: 900px) min(640px, calc(100vw - 40px)), 600px';

const about = t => {
  const a = t.about;
  return `<section class="section about" id="about"><div class="wrap about-grid"><div class="about-copy"><p class="eyebrow">${a.label}</p><h2>${a.title}</h2>${a.body.map(p => `<p>${p}</p>`).join('')}</div><figure class="about-photo"><picture><source type="image/avif" srcset="/assets/sofia-evening-800.avif 800w, /assets/sofia-evening-1200.avif 1200w" sizes="${photoSizes}"><img src="/assets/sofia-evening-800.webp" srcset="/assets/sofia-evening-800.webp 800w, /assets/sofia-evening-1200.webp 1200w" sizes="${photoSizes}" width="1200" height="800" alt="${escape(a.photoAlt)}" loading="lazy" decoding="async"></picture></figure></div><div class="wrap products"><h3 class="products-title">${a.productsTitle}</h3><div class="products-grid">${a.products.map(p => {
    const meta = productMeta[p.name];
    const host = new URL(meta.url).host;
    return `<a class="product product-${meta.slug}" href="${meta.url}" target="_blank" rel="noopener"><span class="product-logo"><img src="${meta.logo}" width="64" height="64" alt=""></span><span class="product-text"><strong class="product-name">${p.name}</strong><span class="product-tagline">${p.tagline}</span></span><span class="product-body">${p.body}</span><span class="product-link">${host} <span aria-hidden="true">↗</span></span></a>`;
  }).join('')}</div></div></section>`;
};

const contactSection = (t, lang) => {
  const c = t.contact;
  return `<section class="section contact" id="contact"><div class="wrap contact-grid"><div class="contact-copy"><p class="eyebrow">${c.label}</p><h2>${c.title}</h2><p class="lead">${c.lead}</p><h3 class="hints-title">${c.hintsTitle}</h3><ul class="contact-hints">${c.hints.map(x => `<li>${x}</li>`).join('')}</ul>${company.contactEmail ? `<p class="email-note">${c.emailNote.replace('{email}', `<a href="mailto:${company.contactEmail}">${company.contactEmail}</a>`)}</p>` : ''}</div><form id="contact-form" class="contact-form" novalidate><h3>${c.formTitle}</h3><div class="form-row"><div class="form-field"><label for="name">${c.name}</label><input id="name" name="name" autocomplete="name" minlength="2" maxlength="100" required placeholder="${escape(c.namePlaceholder)}"></div><div class="form-field"><label for="email">${c.email}</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="${escape(c.emailPlaceholder)}"></div></div><div class="form-field"><label for="message">${c.message}</label><textarea id="message" name="message" minlength="10" maxlength="5000" rows="4" required placeholder="${escape(c.messagePlaceholder)}"></textarea></div><div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><button class="button" type="submit">${t.form.send}<span aria-hidden="true">→</span></button><p class="privacy-note">${c.privacyNote} <a href="${pathFor(lang, 'privacy')}">${t.legal[0]}</a></p><p class="form-status" id="form-status" role="status" aria-live="polite"></p><noscript><p class="form-status">${t.form.unavailable}</p></noscript></form></div></section>`;
};

const structuredData = lang => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Velnovara Group',
  ...(company.legalName[lang] && { legalName: company.legalName[lang] }),
  ...(company.eik && { taxID: company.eik }),
  url: site + base(lang),
  logo: `${site}/apple-touch-icon.png`,
  slogan: content[lang].slogan,
  description: content[lang].meta.description,
  address: { '@type': 'PostalAddress', streetAddress: company.postal.street[lang], postalCode: company.postal.code, addressLocality: company.postal.city[lang], addressCountry: 'BG' },
  ...(company.contactEmail && { email: company.contactEmail }),
  ...(company.contactPhone && { telephone: company.contactPhone })
}).replace(/</g, '\\u003c');

export function render(lang, page = '') {
  const t = content[lang];
  const legalIndex = legalPages.indexOf(page);
  const title = legalIndex < 0 ? t.meta.title : `${t.legal[legalIndex]} | Velnovara Group`;
  const description = legalIndex < 0 ? t.meta.description : `${t.legal[legalIndex]} — Velnovara Group.`;
  const url = site + pathFor(lang, page);
  const strings = JSON.stringify({ ...t.form, menu: t.menu, close: t.close, formKey: company.formKey, subject: 'Velnovara Group — website enquiry / запитване' }).replace(/</g, '\\u003c');
  const font = lang === 'bg' ? 'manrope-cyrillic' : 'manrope-latin';
  const main = legalIndex < 0
    ? hero(t) + services(t) + about(t) + contactSection(t, lang)
    : legalPage(lang, page, t.legal[legalIndex]);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${csp}<title>${title}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="bg" href="${site + pathFor('bg', page)}"><link rel="alternate" hreflang="en" href="${site + pathFor('en', page)}"><link rel="alternate" hreflang="x-default" href="${site + pathFor('bg', page)}"><meta name="theme-color" content="#ffffff"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/assets/fonts/${font}-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css?v=${version}"><meta property="og:type" content="website"><meta property="og:site_name" content="Velnovara Group"><meta property="og:locale" content="${lang === 'bg' ? 'bg_BG' : 'en_GB'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/og-image.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">${legalIndex < 0 ? `<script type="application/ld+json">${structuredData(lang)}</script>` : ''}<script type="application/json" id="ui-strings">${strings}</script><script type="module" src="/app.js?v=${version}"></script></head><body class="page-${page || 'home'}"><a class="skip-link" href="#main">${t.skip}</a>${header(lang, page)}<main id="main">${main}</main>${footer(lang)}</body></html>`;
}

// GitHub Pages cannot send headers, so the page carries its own Content-Security-Policy and referrer policy.
const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'${company.formKey ? ' https://api.web3forms.com' : ''}; object-src 'none'; base-uri 'none'; form-action 'self'"><meta name="referrer" content="strict-origin-when-cross-origin">`;

// GitHub Pages cannot redirect, so the former pages become tiny pages that forward to their section.
const movedPage = (to, lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${site + to}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>Velnovara Group</title></head><body><a href="${to}">Velnovara Group</a></body></html>`;

const notFound = () => `<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>404 | Velnovara Group</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css?v=${version}"></head><body class="page-error"><main class="wrap error-page">${brand('bg')}<div class="error-content"><p class="error-number" aria-hidden="true">404</p><h1>Тази страница не е намерена.</h1><p>Проверете адреса или се върнете към началната страница.</p><p lang="en">We couldn’t find this page. Check the address or return to the homepage.</p><div class="actions"><a class="button" href="/">Към началото<span aria-hidden="true">→</span></a><a class="button button-secondary" href="/en/" lang="en">Home in English</a></div></div></main></body></html>`;

const sitemap = () => {
  const urls = ['bg', 'en'].flatMap(lang => ['', ...legalPages].map(page => `<url><loc>${site + pathFor(lang, page)}</loc><xhtml:link rel="alternate" hreflang="bg" href="${site + pathFor('bg', page)}"/><xhtml:link rel="alternate" hreflang="en" href="${site + pathFor('en', page)}"/></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>\n`;
};

await rm(`${root}dist`, { recursive: true, force: true });
await cp(`${root}public`, `${root}dist`, { recursive: true, filter: src => !src.endsWith('sofia-original.jpg') });
// The module app.js imports enquiry.js; give that import the same version so browsers never mix old and new files.
const appJs = await readFile(`${root}dist/app.js`, 'utf8');
await writeFile(`${root}dist/app.js`, appJs.replace("from './enquiry.js'", `from './enquiry.js?v=${version}'`));
for (const lang of ['bg', 'en']) {
  for (const page of ['', ...legalPages]) {
    const folder = `${root}dist${pathFor(lang, page)}`;
    await mkdir(folder, { recursive: true });
    await writeFile(`${folder}index.html`, render(lang, page));
  }
}
for (const lang of ['bg', 'en']) {
  for (const section of ['services', 'about', 'contact']) {
    await mkdir(`${root}dist${base(lang)}${section}`, { recursive: true });
    await writeFile(`${root}dist${base(lang)}${section}/index.html`, movedPage(`${base(lang)}#${section}`, lang));
  }
}
await writeFile(`${root}dist/404.html`, notFound());
// GitHub Pages: serve the custom domain and publish files as they are.
await writeFile(`${root}dist/CNAME`, `${new URL(site).host}
`);
await writeFile(`${root}dist/.nojekyll`, '');
await writeFile(`${root}dist/sitemap.xml`, sitemap());
await writeFile(`${root}dist/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log('Built the one-page site (Bulgarian + English) and legal pages.');

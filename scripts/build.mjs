import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { content } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export const pages = ['', 'services', 'about', 'contact'];
const ids = ['automation', 'ai', 'platforms', 'apis', 'websites'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pathFor = (lang, page = '') => `${lang === 'en' ? '/en' : ''}/${page}${page ? '/' : ''}`;
const icon = (i) => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${[
  '<path d="M6 9h20v14H6zM11 3v6m10-6v6M11 23v6m10-6v6M3 13h3m-3 6h3m20-6h3m-3 6h3"/><path d="m12 16 3 3 5-6"/>',
  '<path d="M16 3 27 9v14l-11 6L5 23V9zM5 9l11 7 11-7M16 16v13"/><path d="m10 6 12 7"/>',
  '<rect x="4" y="5" width="24" height="22" rx="2"/><path d="M4 12h24M11 12v15M8 8h1m3 0h1m3 0h1"/>',
  '<path d="m12 7-9 9 9 9m8-18 9 9-9 9M18 4l-4 24"/>',
  '<rect x="3" y="5" width="26" height="22" rx="2"/><path d="M3 12h26M7 8h1m3 0h1m3 0h1M7 17h10m-10 5h16"/>'
][i]}</svg>`;
const brand = (lang) => `<a class="brand" href="${pathFor(lang)}" aria-label="Velnovara Group — ${content[lang].nav[0]}"><img src="/assets/mark.svg" width="52" height="39" alt=""><span class="brand-type"><span>VELNOVARA</span><span class="brand-group">GROUP</span></span></a>`;

function servicesCards(t, lang) {
  return `<div class="service-grid">${t.services.map((s, i) => `<a class="service-card" href="${pathFor(lang, 'services')}#${ids[i]}"><div class="service-top"><span class="index">0${i + 1}</span>${icon(i)}</div><h3>${s[0]}</h3><p>${s[1]}</p><span class="text-link">${t.more}</span></a>`).join('')}</div>`;
}
const photograph = t => `<figure class="sofia-photo"><img src="/assets/sofia.webp" width="1400" height="1000" alt="${t.photoAlt}" loading="lazy"><figcaption>${t.photoCaption}</figcaption></figure>`;
const cta = (t, lang) => `<section class="cta wrap"><div><span class="eyebrow">${t.aboutLabel}</span><h2>${t.ctaTitle}</h2><p>${t.ctaText}</p></div><a class="button" href="${pathFor(lang, 'contact')}">${t.talk}</a></section>`;
const process = t => `<section class="section wrap"><div class="section-heading"><span class="eyebrow">${t.processLabel}</span><h2>${t.processTitle}</h2></div><ol class="process">${t.process.map((p, i) => `<li><span class="index">0${i + 1}</span><h3>${p[0]}</h3><p>${p[1]}</p></li>`).join('')}</ol></section>`;

function home(t, lang) {
  return `<section class="hero wrap"><div class="hero-copy"><p class="eyebrow">${t.eyebrow}</p><h1>${t.hero[0]}<br><span>${t.hero[1]}</span></h1><p class="lead">${t.intro}</p><div class="actions"><a class="button" href="${pathFor(lang, 'services')}">${t.explore}</a><a class="text-link" href="${pathFor(lang, 'contact')}">${t.talk}</a></div><div class="hero-foot"><span class="cross" aria-hidden="true">+</span><span>${t.location}</span><span class="hero-foot-line"></span></div></div><div class="system-visual" role="img" aria-label="${t.diagramLabel}"><div class="visual-grid"></div><img class="visual-mark" src="/assets/mark.svg" alt=""><div class="system-tag tag-one"><span class="tag-dot"></span>${t.diagram[1]}</div><div class="system-tag tag-two">${t.diagram[2]}<span class="tag-square"></span></div><div class="system-tag tag-three"><span class="tag-dot"></span>${t.diagram[3]}</div><div class="visual-caption"><span class="index">01 — 05</span><span>${t.diagramLabel}</span></div></div></section>
  <div class="capability-strip"><div class="wrap">${t.services.map(s => `<span>${s[0]}</span>`).join('')}</div></div>
  <section class="section wrap"><div class="section-heading heading-split"><div><span class="eyebrow">${t.servicesLabel}</span><h2>${t.servicesTitle}</h2></div><p>${t.servicesIntro}</p></div>${servicesCards(t, lang)}</section>
  <section class="about-band"><div class="wrap about-split">${photograph(t)}<div class="about-copy"><span class="eyebrow">${t.aboutLabel}</span><h2>${t.aboutHomeTitle}</h2><p>${t.aboutIntro}</p><a class="text-link" href="${pathFor(lang, 'about')}">${t.aboutMore}</a></div></div></section>${process(t)}${cta(t, lang)}`;
}
function services(t, lang) {
  return `<section class="page-intro wrap"><span class="eyebrow">${t.servicesLabel}</span><h1>${t.servicesPageTitle}</h1><p class="lead">${t.servicesPageIntro}</p></section><div class="wrap service-details">${t.services.map((s, i) => `<section class="service-detail" id="${ids[i]}"><div class="detail-title"><span class="index">0${i + 1}</span>${icon(i)}<h2>${s[0]}</h2></div><div><p class="detail-description">${s[1]}</p><ul class="feature-list">${s[2].map(x => `<li>${x}</li>`).join('')}</ul><a class="text-link" href="${pathFor(lang, 'contact')}">${t.discuss}</a></div></section>`).join('')}</div>${process(t)}${cta(t, lang)}`;
}
function about(t, lang) {
  return `<section class="page-intro wrap"><span class="eyebrow">${t.aboutLabel}</span><h1>${t.aboutTitle}</h1><p class="lead">${t.aboutIntro}</p></section><section class="wrap about-story">${photograph(t)}<div><span class="eyebrow">${t.location}</span><h2>${t.aboutHomeTitle}</h2><p>${t.aboutBody}</p><a class="text-link" href="${pathFor(lang, 'services')}">${t.allServices}</a></div></section><section class="section wrap"><div class="section-heading"><span class="eyebrow">${t.principlesLabel}</span></div><div class="principles">${t.principles.map((p, i) => `<article><span class="index">0${i + 1}</span><h2>${p[0]}</h2><p>${p[1]}</p></article>`).join('')}</div></section>${cta(t, lang)}`;
}
function contact(t) {
  return `<section class="contact-layout wrap"><div class="contact-copy"><span class="eyebrow">${t.nav[3]}</span><h1>${t.contactTitle}</h1><p class="lead">${t.contactIntro}</p><div class="contact-info"><div><span class="eyebrow">${t.emailLabel}</span><a class="contact-email" href="mailto:velnovaragroup@gmail.com">velnovaragroup@gmail.com</a></div><div><span class="eyebrow">${t.locationLabel}</span><p>${t.location}</p></div></div><div class="contact-mark"><img src="/assets/mark.svg" width="140" height="103" alt=""></div></div><form id="contact-form" class="contact-form"><h2>${t.formTitle}</h2><label for="name">${t.name}</label><input id="name" name="name" autocomplete="name" minlength="2" maxlength="100" required placeholder="${t.namePlaceholder}"><label for="email">${t.email}</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="${t.emailPlaceholder}"><label for="message">${t.message}</label><textarea id="message" name="message" minlength="10" maxlength="5000" rows="6" required placeholder="${t.messagePlaceholder}"></textarea><div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="privacy-note">${t.privacyNote}</p><button class="button" type="submit">${t.send}</button><p class="form-status" id="form-status" role="status" aria-live="polite"></p><noscript><p>${t.unavailable}</p></noscript></form></section>`;
}
export function render(lang, page) {
  const t = content[lang];
  const i = pages.indexOf(page);
  const otherLang = lang === 'bg' ? 'en' : 'bg';
  const nav = t.nav.map((n, j) => `<a href="${pathFor(lang, pages[j])}"${i === j ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  const strings = JSON.stringify(Object.fromEntries(['send', 'sending', 'success', 'error', 'unavailable', 'invalid', 'rate', 'menu', 'close'].map(k => [k, t[k]]))).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${t.titles[i]} | Velnovara Group</title><meta name="description" content="${escape(t.descriptions[i])}"><meta name="theme-color" content="#f7f7f4"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><link rel="alternate" hreflang="bg" href="${pathFor('bg', page)}"><link rel="alternate" hreflang="en" href="${pathFor('en', page)}"><link rel="alternate" hreflang="x-default" href="${pathFor('bg', page)}"><meta property="og:title" content="${t.titles[i]} | Velnovara Group"><meta property="og:description" content="${escape(t.descriptions[i])}"><meta property="og:type" content="website"><script type="application/json" id="ui-strings">${strings}</script><script src="/app.js" defer></script></head><body><a class="skip-link" href="#main">${t.skip}</a><header class="site-header"><div class="wrap header-inner">${brand(lang)}<button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">${t.menu}<span aria-hidden="true"><i></i><i></i></span></button><nav id="main-nav" class="main-nav" aria-label="${t.menu}">${nav}<div class="language-switch"><span aria-current="true">${lang.toUpperCase()}</span><a href="${pathFor(otherLang, page)}" lang="${otherLang}" hreflang="${otherLang}" aria-label="${otherLang === 'en' ? 'Switch to English' : 'Превключи на български'}">${otherLang.toUpperCase()}</a></div></nav></div></header><main id="main">${page === '' ? home(t, lang) : page === 'services' ? services(t, lang) : page === 'about' ? about(t, lang) : contact(t)}</main><footer class="site-footer"><div class="wrap footer-top"><div>${brand(lang)}<p>${t.footerText}</p></div><nav aria-label="${t.menu}">${nav}</nav><div class="footer-contact"><a href="mailto:velnovaragroup@gmail.com">velnovaragroup@gmail.com</a><span>${t.location}</span></div></div><div class="wrap footer-bottom"><span>© ${new Date().getUTCFullYear()} Velnovara Group. ${t.rights}</span><a href="https://commons.wikimedia.org/wiki/File:Cathedral_Saint_Alexander_Nevsky_(23997168458).jpg" target="_blank" rel="noopener noreferrer">${t.credits}</a></div></footer></body></html>`;
}

await mkdir(`${root}dist`, { recursive: true });
await cp(`${root}public`, `${root}dist`, { recursive: true, filter: src => !src.endsWith('sofia-original.jpg') });
for (const lang of ['bg', 'en']) {
  for (const page of pages) {
    const folder = `${root}dist${pathFor(lang, page)}`;
    await mkdir(folder, { recursive: true });
    await writeFile(`${folder}index.html`, render(lang, page));
  }
}
await writeFile(`${root}dist/404.html`, '<!doctype html><html lang="bg"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 | Velnovara Group</title><link rel="stylesheet" href="/styles.css"><main class="page-intro wrap"><span class="eyebrow">404</span><h1>Страницата не е намерена.<br>Page not found.</h1><a class="button" href="/">Начало / Home</a></main></html>');
await writeFile(`${root}dist/robots.txt`, 'User-agent: *\nAllow: /\n');
console.log('Built 8 complete pages: Bulgarian default + English.');

const strings = JSON.parse(document.querySelector('#ui-strings').textContent);
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('.menu-label').textContent = open ? strings.close : strings.menu;
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });

// Keep the visitor's exact place when switching language. The two languages have different
// text lengths, so the position is saved as "how far into which section" and restored
// instantly on the other page, without the smooth-scroll animation.
const scrollKey = 'velnovara-language-scroll';
const languageLink = document.querySelector('.language-switch a');
languageLink?.addEventListener('click', () => {
  const line = window.scrollY + window.innerHeight * 0.3;
  const section = [...document.querySelectorAll('#top, #services, #about, #contact')].filter(s => s.offsetTop <= line).pop();
  if (!section) return;
  const place = { id: section.id, ratio: (window.scrollY - section.offsetTop) / section.offsetHeight };
  try { sessionStorage.setItem(scrollKey, JSON.stringify(place)); } catch {}
});
let savedPlace = null;
try { savedPlace = JSON.parse(sessionStorage.getItem(scrollKey)); sessionStorage.removeItem(scrollKey); } catch {}
if (savedPlace) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const restore = () => {
    const section = document.getElementById(savedPlace.id);
    if (section) window.scrollTo({ top: section.offsetTop + savedPlace.ratio * section.offsetHeight, behavior: 'instant' });
  };
  restore();
  // Fonts and images can shift the layout slightly once they load; settle on the same spot.
  window.addEventListener('load', restore, { once: true });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuLinks = [...nav.querySelectorAll(':scope > a[data-section]')];

// Mark the menu item for the section in view.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      menuLinks.forEach(link => {
        const current = link.dataset.section === entry.target.id;
        link.toggleAttribute('aria-current', current);
        if (current) link.setAttribute('aria-current', 'location');
      });
    }
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('#top, #services, #about, #contact').forEach(section => observer.observe(section));
}

// Header gains a soft shadow once the page scrolls.
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Services: one service visible at a time, chosen from the list (tabs pattern).
const servicesLayout = document.querySelector('.services-layout');
if (servicesLayout) {
  const tablist = servicesLayout.querySelector('.service-tabs');
  const tabs = [...tablist.querySelectorAll('.service-tab')];
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    panels[i].tabIndex = 0;
  });
  const select = (index, { focus = false, animate = true } = {}) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    const panel = panels[index];
    panel.classList.remove('is-entering');
    if (animate && !reduceMotion) { void panel.offsetWidth; panel.classList.add('is-entering'); }
    if (focus) tabs[index].focus({ preventScroll: true });
    // On phones the list is a horizontal row: bring the chosen chip into view.
    if (tablist.scrollWidth > tablist.clientWidth) {
      tablist.scrollTo({ left: tabs[index].offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };
  tabs.forEach((tab, i) => tab.addEventListener('click', event => { event.preventDefault(); select(i); }));
  tablist.addEventListener('keydown', event => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const next = { ArrowDown: current + 1, ArrowRight: current + 1, ArrowUp: current - 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select((next + tabs.length) % tabs.length, { focus: true });
  });
  select(Math.max(0, panels.findIndex(panel => `#${panel.id}` === location.hash)), { animate: false });
  servicesLayout.classList.add('tabs-ready');
}

// Sections ease in as they scroll into view.
if (!reduceMotion && 'IntersectionObserver' in window) {
  const groups = ['.section-head', '.services-layout', '.about-copy', '.about-photo', '.products-title', '.product', '.contact-copy', '.contact-form', '.legal-page section'];
  const targets = [...document.querySelectorAll(groups.join(','))].filter(el => el.getBoundingClientRect().top > window.innerHeight);
  const revealer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
      setTimeout(() => { entry.target.style.transitionDelay = ''; }, 1200);
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  targets.forEach(el => {
    const siblings = el.parentElement.querySelectorAll(':scope > .product');
    if (el.matches('.product')) el.style.transitionDelay = `${[...siblings].indexOf(el) * 90}ms`;
    el.classList.add('reveal');
    revealer.observe(el);
  });
}

const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonContent = [...button.childNodes].map(node => node.cloneNode(true));

  let startedAt = Date.now();
  let submissionId = crypto.randomUUID();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    button.textContent = strings.sending;
    status.textContent = '';
    status.removeAttribute('data-state');
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, language: document.documentElement.lang, startedAt, submissionId }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        const key = response.status === 503 ? 'unavailable' : response.status === 429 ? 'rate' : response.status === 400 ? 'invalid' : 'error';
        throw new Error(key);
      }
      form.reset(); startedAt = Date.now(); submissionId = crypto.randomUUID();
      status.textContent = strings.success;
      status.dataset.state = 'success';
    } catch (error) {
      status.textContent = strings[error.message] || strings.error;
      status.dataset.state = 'error';
    } finally { button.disabled = false; button.replaceChildren(...buttonContent.map(node => node.cloneNode(true))); }
  });
}

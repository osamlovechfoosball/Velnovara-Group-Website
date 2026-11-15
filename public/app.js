import { sendEnquiry } from './enquiry.js';

// GitHub Pages cannot forbid framing with a header, so if another site embeds this page, leave its frame.
if (window.top !== window.self) window.top.location.href = window.location.href;

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

// Keep the visitor's exact place when switching language. The languages have different
// text lengths, so the position is saved as "how far into which section" and restored
// instantly on the other page, without the smooth-scroll animation.
const scrollKey = 'velnovara-language-scroll';
// The language menu sits at the right of the menu and, on phones and tablets, next to the menu button.
// A language chosen here is remembered, so the homepage address opens in it next time (see lang.js).
document.querySelectorAll('.lang-menu a[data-lang]').forEach(link => link.addEventListener('click', () => {
  try { localStorage.setItem('velnovara-language', link.dataset.lang); } catch {}
  const line = window.scrollY + window.innerHeight * 0.3;
  const section = [...document.querySelectorAll('#top, #services, #about, #contact')].filter(s => s.offsetTop <= line).pop();
  if (!section) return;
  const place = { id: section.id, ratio: (window.scrollY - section.offsetTop) / section.offsetHeight };
  try { sessionStorage.setItem(scrollKey, JSON.stringify(place)); } catch {}
}));
// The language list closes on a click elsewhere or with Escape.
const langMenus = [...document.querySelectorAll('.lang-menu')];
document.addEventListener('click', event => langMenus.forEach(m => { if (m.open && !m.contains(event.target)) m.open = false; }));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  langMenus.forEach(m => { if (m.open) { m.open = false; m.querySelector('summary').focus(); } });
});
let savedPlace = null;
try { savedPlace = JSON.parse(sessionStorage.getItem(scrollKey)); sessionStorage.removeItem(scrollKey); } catch {}
if (savedPlace && 'scrollRestoration' in history) history.scrollRestoration = 'manual';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuLinks = [...nav.querySelectorAll('a[data-section]')];

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

// Services. Computers and tablets: one service visible at a time, chosen from the list (tabs pattern).
// Phones: all services as an accordion, one open at a time, opened by tapping its title.
const servicesLayout = document.querySelector('.services-layout');
if (servicesLayout) {
  const tablist = servicesLayout.querySelector('.service-tabs');
  const tabs = [...tablist.querySelectorAll('.service-tab')];
  const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
  const heads = panels.map(panel => panel.querySelector('.service-head'));
  const phone = window.matchMedia('(max-width: 700px)');
  let current = 0;
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
  });
  const select = (index, { focus = false, animate = true } = {}) => {
    current = index;
    if (phone.matches) return openService(index);
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
  // Phones: the accordion. -1 means every service is closed.
  const openService = index => {
    panels.forEach((panel, i) => {
      panel.hidden = false;
      panel.classList.toggle('open', i === index);
      heads[i].setAttribute('aria-expanded', String(i === index));
    });
  };
  heads.forEach((head, i) => {
    head.addEventListener('click', () => {
      if (!phone.matches) return;
      current = current === i ? -1 : i;
      openService(current);
    });
    head.addEventListener('keydown', event => {
      if (phone.matches && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); head.click(); }
    });
  });
  // Switch between the two patterns when the screen size changes (for example, turning a tablet).
  const applyLayout = () => {
    const accordion = phone.matches;
    servicesLayout.classList.toggle('is-accordion', accordion);
    panels.forEach((panel, i) => {
      if (accordion) {
        panel.removeAttribute('role');
        panel.removeAttribute('aria-labelledby');
        panel.removeAttribute('tabindex');
        heads[i].setAttribute('role', 'button');
        heads[i].tabIndex = 0;
        heads[i].setAttribute('aria-controls', panel.id);
      } else {
        panel.classList.remove('open');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabs[i].id);
        panel.tabIndex = 0;
        ['role', 'tabindex', 'aria-expanded', 'aria-controls'].forEach(name => heads[i].removeAttribute(name));
      }
    });
    select(Math.max(current, 0), { animate: false });
  };
  current = Math.max(0, panels.findIndex(panel => `#${panel.id}` === location.hash));
  applyLayout();
  phone.addEventListener('change', applyLayout);
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

// Phones: the contact form stays closed behind one button, so the section stays short.
// Without JavaScript, and on larger screens, the form is always open.
const contactToggle = document.querySelector('.contact-toggle');
if (form && contactToggle) {
  const contact = form.closest('.contact');
  const phoneScreen = window.matchMedia('(max-width: 700px)');
  const setOpen = open => {
    form.classList.toggle('is-open', open);
    contactToggle.setAttribute('aria-expanded', String(open));
  };
  const applyContactLayout = () => {
    contact.classList.toggle('is-collapsible', phoneScreen.matches);
    contactToggle.hidden = !phoneScreen.matches;
  };
  contactToggle.addEventListener('click', () => {
    const open = contactToggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    if (open) {
      form.querySelector('input').focus({ preventScroll: true });
      contactToggle.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
  applyContactLayout();
  phoneScreen.addEventListener('change', applyContactLayout);
}

if (form) {
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonContent = [...button.childNodes].map(node => node.cloneNode(true));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    button.textContent = strings.sending;
    status.textContent = '';
    status.removeAttribute('data-state');
    const outcome = await sendEnquiry({ data: Object.fromEntries(new FormData(form)), language: document.documentElement.lang, strings });
    if (outcome === 'success') form.reset();
    status.textContent = strings[outcome] || strings.error;
    status.dataset.state = outcome === 'success' ? 'success' : 'error';
    button.disabled = false;
    button.replaceChildren(...buttonContent.map(node => node.cloneNode(true)));
  });
}

// Restore the language-switch position last, once the service tabs have hidden their other
// panels and the page has its final height. Fonts and images can still shift it slightly
// while loading, so settle on the same spot again when everything has loaded.
if (savedPlace) {
  const restore = () => {
    const section = document.getElementById(savedPlace.id);
    if (section) window.scrollTo({ top: section.offsetTop + savedPlace.ratio * section.offsetHeight, behavior: 'instant' });
  };
  restore();
  if (document.readyState === 'complete') requestAnimationFrame(restore);
  else window.addEventListener('load', restore, { once: true });
}

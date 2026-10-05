const strings = JSON.parse(document.querySelector('#ui-strings').textContent);
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.firstChild.textContent = `${open ? strings.close : strings.menu} `;
  nav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });

const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
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
    } finally { button.disabled = false; button.textContent = strings.send; }
  });
}

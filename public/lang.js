// Picks the visitor's language on the homepage address (https://velnovaragroup.eu/), before the page is drawn.
// It uses the language the visitor's phone or browser is set to: no outside service, no cookies, nothing sent.
// Supported languages open their own version; any other language opens the English one.
// A language chosen in the site's language menu is remembered and always wins.
// Links to a specific language (/en/, /de/ ...) are never redirected, and neither are search engines.
(function () {
  var supported = ['bg', 'en', 'de', 'fr', 'es', 'it'];

  function pickLanguage(preferences) {
    for (var i = 0; i < preferences.length; i++) {
      var code = String(preferences[i] || '').toLowerCase().split('-')[0];
      if (supported.indexOf(code) > -1) return code;
    }
    return 'en';
  }
  // Exposed for the tests.
  if (typeof globalThis !== 'undefined') globalThis.velnovaraPickLanguage = pickLanguage;

  if (typeof location === 'undefined' || location.pathname !== '/') return;
  if (navigator.webdriver || /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless/i.test(navigator.userAgent)) return;

  var saved = null;
  try { saved = localStorage.getItem('velnovara-language'); } catch (e) {}
  var language = supported.indexOf(saved) > -1
    ? saved
    : pickLanguage(navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]);
  if (language !== 'bg') location.replace('/' + language + '/' + location.hash);
})();

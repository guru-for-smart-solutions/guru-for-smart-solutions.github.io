/* Guru policies page: language menu, theme button, language switch (all three languages are already in the page;
   this file only chooses which one is shown). Same language/theme modules as the home page. */
(function (w, d) {
  'use strict';
  var root = d.documentElement;
  var NAMES = { ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', en: 'English', es: 'Espa\u00f1ol' };
  var TITLES = {
    ar: '\u0627\u0644\u0633\u064a\u0627\u0633\u0627\u062a \u0648\u0627\u0644\u0634\u0631\u0648\u0637 | Guru for Smart Solutions',
    en: 'Policies and Terms | Guru for Smart Solutions',
    es: 'Pol\u00edticas y condiciones | Guru for Smart Solutions'
  };
  var langBtn = d.getElementById('lang-btn'), langMenu = d.getElementById('lang-menu');

  function scrollToHash() {
    var id = (w.location.hash || '').replace('#', ''); if (!id) return;
    var el = d.getElementById(decodeURIComponent(id));
    if (el) el.scrollIntoView({ block: 'start' });
  }

  function setLang(lang) {
    if (!NAMES[lang]) lang = 'ar';
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    d.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.lang === lang)); });
    var cur = d.getElementById('lang-cur'); if (cur) cur.textContent = NAMES[lang];
    d.title = TITLES[lang];
    if (w.GuruLang) w.GuruLang.persist(lang);
  }

  function items() { return Array.prototype.slice.call(langMenu.querySelectorAll('button')); }
  function openMenu(focusFirst) {
    langMenu.hidden = false; langBtn.setAttribute('aria-expanded', 'true');
    if (focusFirst) { var it = items(); (it.filter(function (i) { return i.getAttribute('aria-checked') === 'true'; })[0] || it[0]).focus(); }
  }
  function closeMenu(returnFocus) { langMenu.hidden = true; langBtn.setAttribute('aria-expanded', 'false'); if (returnFocus) langBtn.focus(); }

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function () { langMenu.hidden ? openMenu(false) : closeMenu(false); });
    langBtn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openMenu(true); } });
    langMenu.addEventListener('keydown', function (e) {
      var it = items(), i = it.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
      else if (e.key === 'Tab') { closeMenu(false); }
    });
    d.addEventListener('click', function (e) { var box = d.getElementById('lang'); if (!langMenu.hidden && box && !box.contains(e.target)) closeMenu(false); });
    langMenu.querySelectorAll('[data-lang]').forEach(function (b) {
      b.addEventListener('click', function () { setLang(b.dataset.lang); closeMenu(true); });
    });
  }

  var themeBtn = d.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (w.GuruTheme) w.GuruTheme.persist(next); else root.setAttribute('data-theme', next);
  });

  setLang(w.GuruLang ? w.GuruLang.resolve() : 'ar');
  if (w.GuruLang) w.GuruLang.onExternalChange(function (l) { if (l !== root.lang) setLang(l); });
  var yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
  /* the browser scrolls to #section before the right language is shown: do it again once it is */
  scrollToHash();
  w.addEventListener('load', scrollToHash);
})(window, document);

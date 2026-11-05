/* Guru shared language module.
   One language choice for the whole site: saved choice > URL (?lang=, used when storage is blocked or on a first visit) > browser language > Arabic.
   The choice is saved, written into the address bar and into every internal link, so it follows
   the visitor between pages, into the embedded dashboard/report, and into pages opened on their own. */
(function (w) {
  'use strict';
  var SUPPORTED = ['ar', 'en', 'es'];
  var KEY = 'guru-lang';

  function isSupported(v) { return SUPPORTED.indexOf(v) !== -1; }
  function readStore() { try { var v = w.localStorage.getItem(KEY); return isSupported(v) ? v : null; } catch (e) { return null; } }
  function writeStore(v) { try { w.localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } }
  function fromQuery() { var m = /[?&]lang=(ar|en|es)(?:&|#|$)/.exec(w.location.search); return m ? m[1] : null; }
  function fromBrowser() {
    var list = (w.navigator.languages && w.navigator.languages.length) ? w.navigator.languages : [w.navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || '').slice(0, 2).toLowerCase();
      if (isSupported(l)) return l;
    }
    return null;
  }

  var lastSeen = null;
  function resolve() { lastSeen = readStore() || fromQuery() || fromBrowser() || 'ar'; return lastSeen; }

  /* put ?lang=xx on every internal link to an .html page, keeping its #hash */
  function decorate(lang) {
    var links = w.document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], href = a.getAttribute('href');
      if (!href || /^(#|mailto:|tel:|javascript:|https?:|\/\/)/i.test(href)) continue;
      var hashAt = href.indexOf('#');
      var path = hashAt === -1 ? href : href.slice(0, hashAt);
      var hash = hashAt === -1 ? '' : href.slice(hashAt);
      if (!/\.html?(\?|$)/i.test(path)) continue;
      path = path.replace(/([?&])lang=[^&]*&?/, '$1').replace(/[?&]$/, '');
      a.setAttribute('href', path + (path.indexOf('?') === -1 ? '?' : '&') + 'lang=' + lang + hash);
    }
  }

  function updateAddressBar(lang) {
    try {
      var u = new URL(w.location.href);
      if (u.searchParams.get('lang') === lang) return;
      u.searchParams.set('lang', lang);
      w.history.replaceState(null, '', u.href);
    } catch (e) { /* not allowed in this context: the saved choice still applies */ }
  }

  function persist(lang) {
    if (!isSupported(lang)) return;
    lastSeen = lang;
    writeStore(lang);
    updateAddressBar(lang);
    decorate(lang);
  }

  /* another tab changed the language, or a restored page holds a newer saved choice */
  function onExternalChange(cb) {
    function recheck() { var v = readStore(); if (v && v !== lastSeen) { lastSeen = v; cb(v); } }
    w.addEventListener('storage', function (e) { if (e.key === KEY && isSupported(e.newValue) && e.newValue !== lastSeen) { lastSeen = e.newValue; cb(e.newValue); } });
    w.addEventListener('pageshow', function (e) { if (e.persisted) recheck(); });
    w.document.addEventListener('visibilitychange', function () { if (!w.document.hidden) recheck(); });
    w.addEventListener('focus', recheck);
  }

  w.GuruLang = { SUPPORTED: SUPPORTED, resolve: resolve, persist: persist, onExternalChange: onExternalChange };
})(window);

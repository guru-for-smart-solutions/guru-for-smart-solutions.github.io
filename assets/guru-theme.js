/* Guru shared theme module.
   One light/dark choice for the whole site: saved choice > URL (?theme=) > system preference.
   It is applied before the page is drawn, saved, written into the address bar and into every internal
   link, and re-applied when another tab changes it or when a page is restored from the back/forward cache. */
(function (w, d) {
  'use strict';
  var KEY = 'guru-theme', root = d.documentElement, current = null, listeners = [];

  function ok(v) { return v === 'dark' || v === 'light'; }
  function read() { try { var v = w.localStorage.getItem(KEY); return ok(v) ? v : null; } catch (e) { return null; } }
  function write(v) { try { w.localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } }
  function fromQuery() { var m = /[?&]theme=(dark|light)(?:&|#|$)/.exec(w.location.search); return m ? m[1] : null; }
  function system() { return (w.matchMedia && w.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark'; }
  /* the saved choice is the latest word (an address-bar value can be stale after going back); the URL is the fallback when storage is blocked */
  function resolve() { return read() || fromQuery() || system(); }

  /* put ?theme=xx on every internal link to an .html page, keeping its #hash */
  function decorate(theme) {
    var links = d.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], href = a.getAttribute('href');
      if (!href || /^(#|mailto:|tel:|javascript:|https?:|\/\/)/i.test(href)) continue;
      var hashAt = href.indexOf('#');
      var path = hashAt === -1 ? href : href.slice(0, hashAt);
      var hash = hashAt === -1 ? '' : href.slice(hashAt);
      if (!/\.html?(\?|$)/i.test(path)) continue;
      path = path.replace(/([?&])theme=[^&]*&?/, '$1').replace(/[?&]$/, '');
      a.setAttribute('href', path + (path.indexOf('?') === -1 ? '?' : '&') + 'theme=' + theme + hash);
    }
  }

  function updateAddressBar(theme) {
    try {
      var u = new URL(w.location.href);
      if (u.searchParams.get('theme') === theme) return;
      u.searchParams.set('theme', theme);
      w.history.replaceState(null, '', u.href);
    } catch (e) { /* not allowed in this context: the saved choice still applies */ }
  }

  function apply(theme, save) {
    if (!ok(theme)) return;
    var changed = theme !== current;
    current = theme;
    if (root.getAttribute('data-theme') !== theme) root.setAttribute('data-theme', theme);
    if (save) write(theme);
    updateAddressBar(theme);
    if (d.body) decorate(theme);
    if (changed) listeners.forEach(function (cb) { try { cb(theme); } catch (e) { /* listener error must not break others */ } });
  }

  /* the visitor chose a theme on this page */
  function persist(theme) { apply(theme, true); }

  /* another tab / a restored page may hold a newer saved choice */
  function recheck() { var v = read(); if (v && v !== current) apply(v, false); }

  function onChange(cb) { if (typeof cb === 'function') listeners.push(cb); }

  w.addEventListener('storage', function (e) { if (e.key === KEY && ok(e.newValue) && e.newValue !== current) apply(e.newValue, false); });
  w.addEventListener('pageshow', function (e) { if (e.persisted) recheck(); });
  d.addEventListener('visibilitychange', function () { if (!d.hidden) recheck(); });
  w.addEventListener('focus', recheck);

  /* start now (script sits in <head>, so nothing has been drawn yet) */
  apply(resolve(), false);
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', function () { decorate(current); });
  else decorate(current);

  w.GuruTheme = { resolve: resolve, persist: persist, onChange: onChange, current: function () { return current; } };
})(window, document);

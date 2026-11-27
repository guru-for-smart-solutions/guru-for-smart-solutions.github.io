/* Guru reviews slider. Shows REAL client screenshots only (list in assets/reviews/reviews.js).
   Empty list -> nothing changes (the "be the first" card stays). Auto-advances, pauses on hover/touch/focus and
   when the section is off screen, no autoplay if the visitor prefers reduced motion. */
(function (w, d) {
  'use strict';
  var list = w.GURU_REVIEWS || [];
  var host = d.getElementById('rev-slider'), empty = d.querySelector('#reviews .reviews-empty');
  if (!host || !list.length) return;
  var root = d.documentElement;
  var T = { ar: { prev: '\u0627\u0644\u0633\u0627\u0628\u0642', next: '\u0627\u0644\u062a\u0627\u0644\u064a', go: '\u0627\u0644\u0631\u0623\u064a \u0631\u0642\u0645 ' }, en: { prev: 'Previous', next: 'Next', go: 'Review ' }, es: { prev: 'Anterior', next: 'Siguiente', go: 'Opini\u00f3n ' } };
  function lang() { return T[root.lang] ? root.lang : 'ar'; }
  function pick(o) { return (o && (o[lang()] || o.ar || o.en)) || ''; }

  var track = d.createElement('div'); track.className = 'rv-track'; track.tabIndex = 0;
  var dots = d.createElement('div'); dots.className = 'rv-dots';
  var slides = list.map(function (r, i) {
    var f = d.createElement('figure'); f.className = 'rv-slide';
    var im = d.createElement('img'); im.src = r.src; im.loading = 'lazy'; im.decoding = 'async'; im.draggable = false;
    f.appendChild(im);
    var c = d.createElement('figcaption'); f.appendChild(c);
    track.appendChild(f);
    var b = d.createElement('button'); b.type = 'button'; b.className = 'rv-dot'; b.addEventListener('click', function () { go(i, true); });
    dots.appendChild(b);
    return { f: f, im: im, c: c, b: b, r: r };
  });
  function mkArrow(dir) {
    var b = d.createElement('button'); b.type = 'button'; b.className = 'rv-arrow rv-' + dir;
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (dir === 'prev' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7') + '"/></svg>';
    return b;
  }
  var bp = mkArrow('prev'), bn = mkArrow('next');
  host.textContent = '';
  var stage = d.createElement('div'); stage.className = 'rv-stage';
  stage.appendChild(track); stage.appendChild(bp); stage.appendChild(bn);
  host.appendChild(stage); host.appendChild(dots);
  host.hidden = false; if (empty) empty.hidden = true;

  var cur = 0, timer = null, hover = false, visible = true, touching = false;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function target(i) {
    var s = slides[i].f, rtl = w.getComputedStyle(track).direction === 'rtl';
    var left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
    return rtl ? left - (track.scrollWidth - track.clientWidth) : left;
  }
  function mark(i) {
    cur = i;
    slides.forEach(function (s, k) { s.f.classList.toggle('is-cur', k === i); s.b.classList.toggle('is-on', k === i); s.b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }
  function go(i, user) {
    i = (i + slides.length) % slides.length; mark(i);
    track.scrollTo({ left: target(i), behavior: reduce ? 'auto' : 'smooth' });
    if (user) restart();
  }
  function nearest() {
    var mid = track.scrollLeft + (w.getComputedStyle(track).direction === 'rtl' ? track.scrollWidth - track.clientWidth : 0) + track.clientWidth / 2, best = 0, bd = 1e9;
    slides.forEach(function (s, k) { var dd = Math.abs(s.f.offsetLeft + s.f.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = k; } });
    return best;
  }
  var st = null;
  track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(function () { var n = nearest(); if (n !== cur) mark(n); }, 90); }, { passive: true });
  bp.addEventListener('click', function () { go(cur - 1, true); });
  bn.addEventListener('click', function () { go(cur + 1, true); });
  track.addEventListener('keydown', function (e) {
    var rtl = w.getComputedStyle(track).direction === 'rtl';
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + (rtl ? -1 : 1), true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur + (rtl ? 1 : -1), true); }
  });

  function tick() { if (!hover && !touching && visible && !d.hidden && !reduce && slides.length > 1) go(cur + 1, false); }
  function restart() { clearInterval(timer); if (!reduce && slides.length > 1) timer = setInterval(tick, 5200); }
  host.addEventListener('mouseenter', function () { hover = true; });
  host.addEventListener('mouseleave', function () { hover = false; });
  host.addEventListener('focusin', function () { hover = true; });
  host.addEventListener('focusout', function () { hover = false; });
  track.addEventListener('touchstart', function () { touching = true; }, { passive: true });
  track.addEventListener('touchend', function () { setTimeout(function () { touching = false; }, 4000); }, { passive: true });
  if (w.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.25 }).observe(host);

  function applyLang() {
    var t = T[lang()];
    host.setAttribute('role', 'region'); host.setAttribute('aria-roledescription', 'carousel');
    bp.setAttribute('aria-label', t.prev); bn.setAttribute('aria-label', t.next);
    slides.forEach(function (s, k) {
      s.im.alt = pick(s.r.alt); s.c.textContent = pick(s.r.cap); s.c.hidden = !s.c.textContent;
      s.b.setAttribute('aria-label', t.go + (k + 1));
    });
  }
  applyLang(); mark(0); restart();
  new MutationObserver(applyLang).observe(root, { attributes: true, attributeFilter: ['lang'] });
  w.addEventListener('resize', function () { track.scrollTo({ left: target(cur), behavior: 'auto' }); });
  w.addEventListener('load', function () { track.scrollTo({ left: target(cur), behavior: 'auto' }); });
})(window, document);

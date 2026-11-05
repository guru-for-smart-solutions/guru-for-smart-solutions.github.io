/* Guru smart header: slides away while reading downwards, returns the moment you scroll up (or reach the top,
   focus the menu, or move the pointer to the top edge). Adds a soft glass state and a thin reading-progress line. */
(function (w, d) {
  'use strict';
  var header = d.querySelector('.site-header'); if (!header) return;
  var root = d.documentElement, hidden = false, lastY = w.pageYOffset || 0, acc = 0, ticking = false;

  var bar = d.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); d.body.appendChild(bar);

  function menuOpen() { var b = d.getElementById('lang-btn'); return !!b && b.getAttribute('aria-expanded') === 'true'; }
  function focusInside() { return header.contains(d.activeElement) && d.activeElement !== d.body; }

  function setHidden(v) {
    if (v === hidden) return;
    hidden = v;
    header.classList.toggle('is-hidden', v);
    root.classList.toggle('hdr-hidden', v);
  }

  function update() {
    ticking = false;
    var y = Math.max(0, w.pageYOffset || root.scrollTop || 0), dy = y - lastY, max = root.scrollHeight - w.innerHeight;
    lastY = y;
    header.classList.toggle('is-scrolled', y > 8);
    bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

    if (y < 90 || menuOpen() || focusInside()) { acc = 0; setHidden(false); return; }
    if (dy === 0) return;
    if ((dy > 0) !== (acc > 0)) acc = 0;     /* direction changed: start counting again */
    acc += dy;
    if (acc > 10) setHidden(true);           /* a deliberate scroll down */
    else if (acc < -10) setHidden(false);    /* any deliberate scroll up */
  }
  function onScroll() { if (!ticking) { ticking = true; w.requestAnimationFrame(update); } }

  w.addEventListener('scroll', onScroll, { passive: true });
  w.addEventListener('resize', onScroll, { passive: true });
  header.addEventListener('focusin', function () { acc = 0; setHidden(false); });
  d.addEventListener('mousemove', function (e) { if (hidden && e.clientY <= 10) { acc = 0; setHidden(false); } }, { passive: true });
  d.addEventListener('keydown', function (e) { if (e.key === 'Home' || e.key === 'PageUp') { acc = 0; } });
  w.addEventListener('pageshow', function () { lastY = w.pageYOffset || 0; update(); });
  update();
})(window, document);

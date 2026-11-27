/* Guru contact: (1) drop-down under the header "Contact us" button, (2) pop-up for the in-page contact buttons,
   (3) two fixed side buttons (WhatsApp, Gmail). Own text in ar / en / es; follows <html lang>.
   Icons are plain generic glyphs (chat bubble, envelope), not brand logos. */
(function (w, d) {
  'use strict';
  var WA = 'https://wa.me/201023290481';
  var TO = 'customer.care.withme@gmail.com';
  var GMAIL = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(TO);
  var root = d.documentElement;

  var TXT = {
    ar: { head: '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627', pick: '\u0627\u062e\u062a\u0631 \u0627\u0644\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0623\u0646\u0633\u0628 \u0644\u0643', wa: '\u0648\u0627\u062a\u0633\u0627\u0628', waS: '\u0627\u0628\u062f\u0623 \u0645\u062d\u0627\u062f\u062b\u0629 \u0627\u0644\u0622\u0646', mail: 'Gmail', mailS: '\u0623\u0631\u0633\u0644 \u0644\u0646\u0627 \u0631\u0633\u0627\u0644\u0629', close: '\u0625\u063a\u0644\u0627\u0642', group: '\u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0648\u0627\u0635\u0644', waA: '\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628', mailA: '\u0631\u0627\u0633\u0644\u0646\u0627 \u0639\u0628\u0631 Gmail' },
    en: { head: 'Contact us', pick: 'Choose what suits you best', wa: 'WhatsApp', waS: 'Start a chat now', mail: 'Gmail', mailS: 'Send us a message', close: 'Close', group: 'Contact options', waA: 'Contact us on WhatsApp', mailA: 'Email us with Gmail' },
    es: { head: 'Cont\u00e1ctanos', pick: 'Elige lo que mejor te venga', wa: 'WhatsApp', waS: 'Inicia un chat ahora', mail: 'Gmail', mailS: 'Env\u00edanos un mensaje', close: 'Cerrar', group: 'Opciones de contacto', waA: 'Cont\u00e1ctanos por WhatsApp', mailA: 'Escr\u00edbenos con Gmail' }
  };
  function L() { var l = root.lang; return TXT[l] || TXT.ar; }

  var ICO = {
    chat: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.6.5-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/><circle cx="8.6" cy="9.5" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="9.5" r=".9" fill="currentColor" stroke="none"/><circle cx="15.4" cy="9.5" r=".9" fill="currentColor" stroke="none"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.6"/><path d="M3.8 7.2 12 13.2l8.2-6"/></svg>',
    go: '<svg class="cx-go" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  /* ---------- official logos: put the real files in assets/icons/ (whatsapp.svg and gmail.svg, or .png) and they replace the generic glyphs ---------- */
  var LOGO = { wa: ['assets/icons/whatsapp.svg', 'assets/icons/whatsapp.png'], mail: ['assets/icons/gmail.svg', 'assets/icons/gmail.png'] };
  var found = {};
  function setLogo(el) {
    var kind = /(^|\s)(fab|cx)-wa(\s|$)/.test(el.className) ? 'wa' : 'mail', slot = el.querySelector('.fab-ico, .cx-ico');
    if (!found[kind] || !slot) return;
    slot.innerHTML = '<img src="' + found[kind] + '" alt="" width="34" height="34" draggable="false">';
    el.classList.add('has-logo');
  }
  function applyLogos() { Array.prototype.forEach.call(d.querySelectorAll('.fab, .cx-item'), setLogo); }
  function probe(kind) {
    var list = LOGO[kind].slice();
    (function next() {
      if (!list.length) return;
      var u = list.shift(), im = new Image();
      im.onload = function () { found[kind] = u; applyLogos(); };
      im.onerror = next; im.src = u;
    })();
  }

  /* ---------- the Gmail link: phones open the Gmail app, computers open Gmail on the web ---------- */
  function platform(ua, touch) {
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && touch > 1)) return 'ios';
    return 'desktop';
  }
  function mailTarget(p) {
    var mailto = 'mailto:' + TO;
    if (p === 'android') return { url: 'intent:' + TO + '#Intent;scheme=mailto;action=android.intent.action.SENDTO;package=com.google.android.gm;S.browser_fallback_url=' + encodeURIComponent(mailto) + ';end', fallback: null };
    if (p === 'ios') return { url: 'googlegmail:///co?to=' + encodeURIComponent(TO), fallback: mailto };
    return null;
  }
  w.__guruMailTarget = function (ua, touch) { return mailTarget(platform(ua, touch)); };
  function onMailClick(e) {
    var t = mailTarget(platform(navigator.userAgent || '', navigator.maxTouchPoints || 0));
    if (!t) return;
    e.preventDefault();
    var left = false;
    function mark() { if (d.hidden) left = true; }
    d.addEventListener('visibilitychange', mark);
    w.addEventListener('pagehide', function () { left = true; });
    w.location.href = t.url;
    if (t.fallback) setTimeout(function () { d.removeEventListener('visibilitychange', mark); if (!left && !d.hidden) w.location.href = t.fallback; }, 1400);
  }

  /* ---------- the two choices (used by the drop-down and by the pop-up) ---------- */
  function item(kind) {
    var t = L(), wa = kind === 'wa';
    var a = d.createElement('a');
    a.className = 'cx-item cx-' + kind;
    a.href = wa ? WA : GMAIL; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.innerHTML = '<span class="cx-ico">' + (wa ? ICO.chat : ICO.mail) + '</span><span class="cx-txt"><b>' + (wa ? t.wa : t.mail) + '</b><small>' +
      (wa ? t.waS : t.mailS) + '</small>' + (wa ? '' : '<small class="cx-addr" dir="ltr">' + TO + '</small>') + '</span>' + ICO.go;
    if (!wa) a.addEventListener('click', onMailClick);
    setLogo(a);
    return a;
  }
  function card(withClose) {
    var t = L(), c = d.createElement('div'); c.className = 'cx-card';
    c.innerHTML = '<div class="cx-head"><b>' + t.head + '</b><span>' + t.pick + '</span></div>' + (withClose ? '<button type="button" class="cx-x" aria-label="' + t.close + '">' + ICO.x + '</button>' : '');
    c.appendChild(item('wa')); c.appendChild(item('mail'));
    return c;
  }

  /* ---------- 1) drop-down under the header button ---------- */
  var btn = d.getElementById('contact-btn'), pop = d.getElementById('contact-pop');
  function popOpen() { return !!btn && btn.getAttribute('aria-expanded') === 'true'; }
  function fillPop() { if (!pop) return; pop.textContent = ''; pop.appendChild(card(false)); }
  function openPop(focus) {
    closeModal(false); fillPop(); pop.hidden = false; btn.setAttribute('aria-expanded', 'true');
    if (focus) { var f = pop.querySelector('a'); if (f) f.focus(); }
  }
  function closePop(back) { if (!pop || pop.hidden) return; pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (back) btn.focus(); }
  if (btn && pop) {
    btn.addEventListener('click', function () { popOpen() ? closePop(false) : openPop(false); });
    btn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); openPop(true); } });
    pop.addEventListener('keydown', function (e) {
      var it = Array.prototype.slice.call(pop.querySelectorAll('a')), i = it.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); closePop(true); }
      else if (e.key === 'Tab') { closePop(false); }
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && popOpen() && !pop.contains(d.activeElement)) closePop(true); });
    d.addEventListener('click', function (e) { var box = d.getElementById('contact-wrap'); if (popOpen() && box && !box.contains(e.target)) closePop(false); });
  }

  /* ---------- 2) pop-up for the contact buttons inside the page ---------- */
  var modal = null, lastFocus = null;
  function openModal(from) {
    closePop(false); closeModal(false);
    lastFocus = from || d.activeElement;
    modal = d.createElement('div'); modal.className = 'cx-modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', L().head);
    var c = card(true); modal.appendChild(c); d.body.appendChild(modal);
    modal.addEventListener('mousedown', function (e) { if (e.target === modal) closeModal(true); });
    c.querySelector('.cx-x').addEventListener('click', function () { closeModal(true); });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(true); }
      else if (e.key === 'Tab') {
        var f = Array.prototype.slice.call(modal.querySelectorAll('a,button')), i = f.indexOf(d.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    root.classList.add('cx-lock');
    modal.querySelector('a').focus();
  }
  function closeModal(back) {
    if (!modal) return;
    modal.remove(); modal = null; root.classList.remove('cx-lock');
    if (back && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('[data-contact-open]') : null;
    if (!a) return; e.preventDefault(); openModal(a);
  });

  /* ---------- 3) the fixed side buttons ---------- */
  var fab = d.createElement('div'); fab.className = 'fab-wrap'; fab.setAttribute('role', 'group');
  function fabBtn(kind) {
    var a = d.createElement('a'); a.className = 'fab fab-' + kind;
    a.href = kind === 'wa' ? WA : GMAIL; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.innerHTML = '<span class="fab-ico">' + (kind === 'wa' ? ICO.chat : ICO.mail) + '</span><span class="fab-tip"></span>';
    if (kind === 'mail') a.addEventListener('click', onMailClick);
    setLogo(a);
    return a;
  }
  var fWa = fabBtn('wa'), fMail = fabBtn('mail'); fab.appendChild(fWa); fab.appendChild(fMail); d.body.appendChild(fab);

  function applyLang() {
    var t = L();
    fab.setAttribute('aria-label', t.group);
    fWa.setAttribute('aria-label', t.waA); fWa.querySelector('.fab-tip').textContent = t.wa;
    fMail.setAttribute('aria-label', t.mailA); fMail.querySelector('.fab-tip').textContent = t.mail;
    if (pop && !pop.hidden) fillPop();
    if (modal) { var from = lastFocus; closeModal(false); openModal(from); }
  }
  applyLang();
  probe('wa'); probe('mail');
  new MutationObserver(applyLang).observe(root, { attributes: true, attributeFilter: ['lang'] });
})(window, document);

/* Guru payment methods: the "Pay from anywhere" section (#pay-root) and the compact footer strip (#foot-pay).
   Brand names are shown as plain text. To show official logos, put the files in assets/pay/ and list them in LOGOS. */
(function (w, d) {
  'use strict';

  /* id -> file inside assets/pay/ (leave empty to show text labels), e.g. { visa: 'visa.svg' } */
  var LOGOS = {};

  var METHODS = [
    { id: 'visa',       name: 'Visa',       icon: 'card',   kind: 'bank' },
    { id: 'mastercard', name: 'Mastercard', icon: 'chip',   kind: 'bank' },
    { id: 'paypal',     name: 'PayPal',     icon: 'send',   kind: 'online' },
    { id: 'applepay',   name: 'Apple Pay',  icon: 'phone',  kind: 'mobile' },
    { id: 'wallets',    name: null,         icon: 'wallet', kind: 'wallets' }   /* generic tile: digital wallets */
  ];
  var FOOTER_IDS = ['visa', 'mastercard', 'paypal', 'applepay'];

  var TXT = {
    ar: { eyebrow: 'طرق الدفع', h: 'ادفع من أي مكان في العالم', p: 'نستقبل المدفوعات من جميع الدول عبر وسائل دفع عالمية آمنة وموثوقة.',
          wallets: 'المحافظ الإلكترونية', k: { bank: 'بطاقة بنكية', online: 'حساب إلكتروني', mobile: 'دفع بالهاتف', crypto: 'عملة رقمية', wallets: 'دفع إلكتروني' }, s1: 'دفع مشفّر عبر بوابات دفع معتمدة', s2: 'لا نحتفظ ببيانات بطاقتك', note: 'تظهر لك الوسيلة الأنسب لبلدك عند إتمام الطلب.',
          foot: 'طرق الدفع', more: 'والمزيد', list: 'طرق الدفع' },
    en: { eyebrow: 'Payment methods', h: 'Pay from anywhere in the world', p: 'We accept payments from every country through secure, globally trusted payment methods.',
          wallets: 'Digital wallets', k: { bank: 'Bank card', online: 'Online account', mobile: 'Mobile pay', crypto: 'Digital currency', wallets: 'Online payment' }, s1: 'Encrypted payment through approved gateways', s2: 'We never keep your card details', note: 'The method that suits your country appears at checkout.',
          foot: 'Payment methods', more: 'and more', list: 'Payment methods' },
    es: { eyebrow: 'Métodos de pago', h: 'Paga desde cualquier lugar del mundo', p: 'Aceptamos pagos desde todos los países mediante métodos de pago globales, seguros y de confianza.',
          wallets: 'Monederos digitales', k: { bank: 'Tarjeta bancaria', online: 'Cuenta en línea', mobile: 'Pago móvil', crypto: 'Moneda digital', wallets: 'Pago en línea' }, s1: 'Pago cifrado mediante pasarelas autorizadas', s2: 'Nunca guardamos los datos de tu tarjeta', note: 'Al pagar verás el método más adecuado para tu país.',
          foot: 'Métodos de pago', more: 'y más', list: 'Métodos de pago' }
  };

  var A = 'viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICON = {
    card:   '<svg ' + A + '><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/></svg>',
    chip:   '<svg ' + A + '><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><rect x="6.5" y="9.5" width="4" height="3.2" rx=".9"/><path d="M14 11h4M14 14.5h4"/></svg>',
    send:   '<svg ' + A + '><path d="M4 9h15l-3.5-3.5M20 15H5l3.5 3.5"/></svg>',
    phone:  '<svg ' + A + '><rect x="6.5" y="3" width="11" height="18" rx="2.8"/><path d="M9.8 11.8l1.7 1.7 3-3.4M10.5 18h3"/></svg>',
    coin:   '<svg ' + A + '><circle cx="12" cy="12" r="8.5"/><path d="M12 6.8v10.4M14.6 9.6c-.5-.9-1.5-1.4-2.6-1.4-1.4 0-2.5.7-2.5 1.9 0 2.5 5 1.3 5 3.9 0 1.2-1.1 1.9-2.5 1.9-1.2 0-2.2-.6-2.7-1.5"/></svg>',
    wallet: '<svg ' + A + '><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><path d="M4 7.5V17a2 2 0 0 0 2 2h12.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 8H6.5A2.5 2.5 0 0 1 4 5.5"/><circle cx="16.5" cy="13.5" r="1"/></svg>',
    shield: '<svg ' + A + '><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9.5 12l2 2 3.5-4"/></svg>',
    lock:   '<svg ' + A + '><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2.5"/></svg>'
  };

  var script = d.currentScript;
  var BASE = script && script.src ? script.src.replace(/[^\/]*(\?.*)?$/, '') + 'pay/' : 'assets/pay/';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lang() { var l = d.documentElement.lang; return TXT[l] ? l : 'ar'; }
  function label(m, t) { return m.name || t.wallets; }

  function tile(m, t) {
    var logo = LOGOS[m.id];
    var inner = logo
      ? '<span class="pay-logo"><img src="' + esc(BASE + logo) + '" alt="' + esc(label(m, t)) + '" loading="lazy"></span>'
      : '<span class="pay-ico">' + ICON[m.icon] + '</span><span class="pay-word' + (m.name ? '' : ' pay-word-sm') + '"' + (m.name ? ' dir="ltr"' : '') + '>' + esc(label(m, t)) + '</span>';
    return '<li class="pay-tile' + (logo ? ' has-logo' : '') + '" role="listitem" aria-label="' + esc(label(m, t)) + '">' + inner +
      '<span class="pay-kind">' + esc(t.k[m.kind]) + '</span></li>';
  }

  var root = d.getElementById('pay-root');
  function renderSection() {
    if (!root) return;
    var t = TXT[lang()];
    root.innerHTML =
      '<div class="pay-head"><p class="eyebrow">' + esc(t.eyebrow) + '</p><h3>' + esc(t.h) + '</h3><p>' + esc(t.p) + '</p></div>' +
      '<ul class="pay-grid" role="list" aria-label="' + esc(t.list) + '">' + METHODS.map(function (m) { return tile(m, t); }).join('') + '</ul>' +
      '<div class="pay-trust"><span>' + ICON.lock + esc(t.s1) + '</span><span>' + ICON.shield + esc(t.s2) + '</span></div>' +
      '<p class="pay-note">' + esc(t.note) + '</p>';
  }

  var foot = d.getElementById('foot-pay');
  function renderFooter() {
    if (!foot) return;
    var t = TXT[lang()];
    var items = METHODS.filter(function (m) { return FOOTER_IDS.indexOf(m.id) !== -1; })
      .map(function (m) { return '<li dir="ltr">' + esc(m.name) + '</li>'; }).join('');
    foot.innerHTML = '<span class="fp-label">' + esc(t.foot) + '</span><ul class="fp-list" aria-label="' + esc(t.list) + '">' + items +
      '<li class="fp-more">+ ' + esc(t.more) + '</li></ul>';
  }

  function renderAll() { renderSection(); renderFooter(); }
  renderAll();
  if (w.MutationObserver) new MutationObserver(renderAll).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] });
})(window, document);

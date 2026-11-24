/* Guru prices: package prices in EUR, plus a currency picker that shows the same prices in any world currency.
   - Prices live in this file only (MJ, DATA, WEB). Base currency is always EUR; other currencies are for display.
   - Exchange rates: free open endpoint of ExchangeRate-API (no key, updated once a day, needs a visible credit link).
     Rates are cached in the browser for 12 hours. If they cannot be loaded, prices simply stay in EUR.
   - Placeholders in index.html: #gp-mj (Mr. Josef card), #gp-data (data analytics), #gp-web (websites).
   - Text is kept here in ar / en / es. No currency symbols: EUR is written as a word in Arabic and as a code in en/es. */
(function (w, d) {
  'use strict';

  var BASE = 'EUR';
  var FX_URL = 'https://open.er-api.com/v6/latest/EUR';
  var FX_TTL = 12 * 3600 * 1000;
  var KEY_CUR = 'guru-cur', KEY_FX = 'guru-fx';
  var WA = 'https://wa.me/201023290481';
  var PINNED = ['EUR', 'USD', 'CAD', 'AED', 'QAR', 'SAR', 'EGP'];
  var SKIP = { XDR: 1 };

  /* ---- the prices (EUR) ---- */
  var MJ = { m: 12, y: 104 };
  /* yearly saving vs 12 monthly payments, computed so it can never drift from the prices above */
  function mjPct() { return Math.round((1 - MJ.y / (MJ.m * 12)) * 100); }
  var DATA = [{ p: 350 }, { p: 820 }, { p: 1850 }];
  var WEB = [{ p: 450 }, { p: 950 }, { p: 2330 }];

  /* ---- text ---- */
  var TXT = {
    ar: {
      cur: '\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0639\u0645\u0644\u0629', from: '\u064a\u0628\u062f\u0623 \u0645\u0646', eg: '\u0645\u062b\u0627\u0644', perM: '/ \u0634\u0647\u0631', perY: '/ \u0633\u0646\u0629', base: '\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064a', cta: '\u0627\u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u0628\u0627\u0642\u0629',
      mjM: '\u0634\u0647\u0631\u064a', mjY: '\u0633\u0646\u0648\u064a', mjSave: '\u0648\u0641\u0651\u0631 \u2066{p}%\u2069', mjEq: '\u064a\u0639\u0627\u062f\u0644 {x} \u0634\u0647\u0631\u064a\u064b\u0627', mjAria: '\u0646\u0648\u0639 \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643',
      pTitle: '\u0627\u062e\u062a\u0631 \u0627\u0644\u0639\u0645\u0644\u0629', pSearch: '\u0627\u0628\u062d\u062b \u0628\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u0644\u0629 \u0623\u0648 \u0631\u0645\u0632\u0647\u0627', pTop: '\u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0633\u062a\u062e\u062f\u0627\u0645\u064b\u0627', pAll: '\u0643\u0644 \u0627\u0644\u0639\u0645\u0644\u0627\u062a', pNone: '\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c \u0645\u0637\u0627\u0628\u0642\u0629',
      pLoad: '\u062c\u0627\u0631\u064d \u062a\u062d\u0645\u064a\u0644 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0631\u0641\u2026', pErr: '\u062a\u0639\u0630\u0651\u0631 \u062a\u062d\u0645\u064a\u0644 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0631\u0641 \u062d\u0627\u0644\u064a\u064b\u0627.', pRetry: '\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629', pClose: '\u0625\u063a\u0644\u0627\u0642', pUpd: '\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b \u0644\u0644\u0623\u0633\u0639\u0627\u0631: {d}',
      note: '\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0629 \u0628\u0627\u0644\u064a\u0648\u0631\u0648. \u0639\u0631\u0636 \u0627\u0644\u0639\u0645\u0644\u0627\u062a \u0627\u0644\u0623\u062e\u0631\u0649 \u0627\u0633\u062a\u0631\u0634\u0627\u062f\u064a \u062d\u0633\u0628 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0631\u0641 \u0627\u0644\u064a\u0648\u0645\u064a\u0629\u060c \u0648\u0642\u062f \u064a\u062e\u062a\u0644\u0641 \u0642\u0644\u064a\u0644\u064b\u0627 \u0639\u0646 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0641\u0639\u0644\u064a \u0639\u0646\u062f \u0627\u0644\u062f\u0641\u0639.',
      src: '\u0645\u0635\u062f\u0631 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0635\u0631\u0641:',
      wa: '\u0645\u0631\u062d\u0628\u064b\u0627\u060c \u0623\u0631\u064a\u062f \u0627\u0644\u0627\u0633\u062a\u0641\u0633\u0627\u0631 \u0639\u0646 \u0628\u0627\u0642\u0629 {n} ({p} \u064a\u0648\u0631\u0648) \u0645\u0646 \u062e\u062f\u0645\u0629 {s}.',
      data: {
        eyebrow: '\u0627\u0644\u0623\u0633\u0639\u0627\u0631', h: '\u0623\u0633\u0639\u0627\u0631 \u062e\u062f\u0645\u0629 \u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
        p: '\u0627\u062e\u062a\u0631 \u062d\u062c\u0645 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0645\u0646\u0627\u0633\u0628 \u0644\u0643. \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u062b\u0627\u0628\u062a\u0629 \u0648\u0648\u0627\u0636\u062d\u0629\u060c \u0648\u0643\u0644 \u0628\u0627\u0642\u0629 \u062a\u0634\u0645\u0644 \u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a \u0648\u0627\u0644\u062f\u0639\u0645.', s: '\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
        perks: ['\u062a\u0639\u062f\u064a\u0644\u0627\u062a \u0645\u062c\u0627\u0646\u064a\u0629 \u2066100%\u2069', '\u062f\u0639\u0645 \u0628\u0639\u062f \u0627\u0644\u062a\u0646\u0641\u064a\u0630 \u0645\u062f\u0649 \u0627\u0644\u062d\u064a\u0627\u0629'],
        fine: '\u0627\u0644\u062a\u0639\u062f\u064a\u0644\u0627\u062a \u0648\u0627\u0644\u062f\u0639\u0645 \u0636\u0645\u0646 \u0646\u0637\u0627\u0642 \u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u0645\u062a\u0641\u0642 \u0639\u0644\u064a\u0647\u060c \u0628\u062f\u0648\u0646 \u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u0627\u062f\u0631 \u0628\u064a\u0627\u0646\u0627\u062a \u0623\u0648 \u0644\u0648\u062d\u0627\u062a \u062c\u062f\u064a\u062f\u0629.',
        pk: [
          { n: '\u0623\u0633\u0627\u0633\u064a', d: '\u0644\u0645\u0646 \u0644\u062f\u064a\u0647 \u0645\u0644\u0641 \u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0627\u062d\u062f (\u0645\u062b\u0644 \u0645\u0644\u0641 Excel \u0644\u0644\u0645\u0628\u064a\u0639\u0627\u062a) \u0648\u064a\u0631\u064a\u062f \u0623\u0646 \u064a\u0631\u0627\u0647 \u0641\u064a \u0644\u0648\u062d\u0629 \u0648\u0627\u0636\u062d\u0629 \u0628\u062f\u0644 \u0623\u0631\u0642\u0627\u0645 \u0645\u062a\u0646\u0627\u062b\u0631\u0629 \u0641\u064a \u062c\u062f\u0627\u0648\u0644.', eg: '\u0635\u0627\u062d\u0628 \u0645\u062d\u0644 \u0623\u0648 \u0639\u064a\u0627\u062f\u0629 \u064a\u0631\u064a\u062f \u0623\u0646 \u064a\u0639\u0631\u0641 \u0641\u064a \u062b\u0648\u0627\u0646\u064d: \u0643\u0645 \u0628\u0639\u0646\u0627 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631\u061f \u0648\u0645\u0627 \u0623\u0643\u062b\u0631 \u0645\u0646\u062a\u062c \u0645\u0628\u064a\u0639\u064b\u0627\u061f', f: ['\u0645\u0635\u062f\u0631 \u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0627\u062d\u062f (Excel \u0623\u0648 CSV)', '\u0644\u0648\u062d\u0629 \u0645\u0624\u0634\u0631\u0627\u062a \u062a\u0641\u0627\u0639\u0644\u064a\u0629 \u0648\u0627\u062d\u062f\u0629', '\u0631\u0633\u0648\u0645 \u0648\u0645\u0624\u0634\u0631\u0627\u062a \u062a\u062c\u064a\u0628 \u0639\u0646 \u0623\u0633\u0626\u0644\u062a\u0643 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629', '\u0634\u0631\u062d \u0645\u0628\u0633\u0651\u0637 \u0644\u0637\u0631\u064a\u0642\u0629 \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0644\u0648\u062d\u0629'] },
          { n: '\u0645\u062a\u0648\u0633\u0637', d: '\u0644\u0645\u0646 \u062a\u062a\u0648\u0632\u0639 \u0628\u064a\u0627\u0646\u0627\u062a\u0647 \u0639\u0644\u0649 \u0623\u0643\u062b\u0631 \u0645\u0646 \u0645\u0635\u062f\u0631 \u0648\u064a\u0631\u064a\u062f \u062a\u0642\u0631\u064a\u0631\u064b\u0627 \u0645\u0643\u062a\u0648\u0628\u064b\u0627 \u064a\u0634\u0631\u062d \u0644\u0647 \u0645\u0627 \u0648\u0631\u0627\u0621 \u0627\u0644\u0623\u0631\u0642\u0627\u0645 \u0648\u0645\u0627 \u064a\u0641\u0639\u0644\u0647 \u0628\u0647\u0627.', eg: '\u0645\u062a\u062c\u0631 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u064a\u062c\u0645\u0639 \u0645\u0628\u064a\u0639\u0627\u062a \u0627\u0644\u0645\u062a\u062c\u0631 \u0648\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0648\u0645\u0644\u0641 \u0627\u0644\u0645\u062e\u0632\u0648\u0646\u060c \u0644\u064a\u0639\u0631\u0641 \u0623\u064a \u0645\u0646\u062a\u062c \u064a\u0631\u0628\u062d \u0648\u0623\u064a \u0625\u0639\u0644\u0627\u0646 \u064a\u0636\u064a\u0651\u0639 \u0627\u0644\u0645\u0627\u0644.', f: ['\u062d\u062a\u0649 3 \u0645\u0635\u0627\u062f\u0631 \u0628\u064a\u0627\u0646\u0627\u062a', '\u0644\u0648\u062d\u0629 \u0645\u0624\u0634\u0631\u0627\u062a \u062a\u0641\u0627\u0639\u0644\u064a\u0629', '\u062a\u0642\u0631\u064a\u0631 \u062a\u062d\u0644\u064a\u0644\u064a \u0645\u0643\u062a\u0648\u0628 \u0645\u062b\u0644 \u0627\u0644\u0623\u0645\u062b\u0644\u0629 \u0623\u0639\u0644\u0627\u0647', '\u062e\u0644\u0627\u0635\u0629 \u0628\u0623\u0647\u0645 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0648\u0645\u0627 \u064a\u0645\u0643\u0646 \u0641\u0639\u0644\u0647 \u0628\u0647\u0627'] },
          { n: '\u0645\u062a\u0642\u062f\u0645', d: '\u0644\u0644\u0634\u0631\u0643\u0627\u062a \u0630\u0627\u062a \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0643\u0628\u064a\u0631\u0629 \u0627\u0644\u062a\u064a \u062a\u062d\u062a\u0627\u062c \u0635\u0648\u0631\u0629 \u0634\u0627\u0645\u0644\u0629 \u0648\u0645\u062a\u0639\u0645\u0642\u0629 \u062a\u064f\u0639\u0631\u0636 \u0639\u0644\u0649 \u0627\u0644\u0625\u062f\u0627\u0631\u0629 \u0648\u062a\u064f\u0628\u0646\u0649 \u0639\u0644\u064a\u0647\u0627 \u0627\u0644\u0642\u0631\u0627\u0631\u0627\u062a.', eg: '\u0634\u0631\u0643\u0629 \u062a\u0648\u0632\u064a\u0639 \u0623\u0648 \u0645\u0635\u0646\u0639 \u0644\u062f\u064a\u0647 \u0639\u0634\u0631\u0627\u062a \u0622\u0644\u0627\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062a\u060c \u0648\u064a\u0631\u064a\u062f \u0623\u0646 \u064a\u0639\u0631\u0641 \u0623\u064a\u0646 \u064a\u0636\u064a\u0639 \u0627\u0644\u0631\u0628\u062d \u0648\u0623\u064a\u0646 \u064a\u062a\u0623\u062e\u0631 \u0627\u0644\u062a\u0633\u0644\u064a\u0645\u060c \u0645\u0639 \u0645\u0644\u062e\u0635 \u062c\u0627\u0647\u0632 \u0644\u0627\u062c\u062a\u0645\u0627\u0639 \u0627\u0644\u0625\u062f\u0627\u0631\u0629.', f: ['\u0628\u064a\u0627\u0646\u0627\u062a \u0643\u0628\u064a\u0631\u0629 (100 \u0623\u0644\u0641 \u0635\u0641 \u0641\u0623\u0643\u062b\u0631)', '\u0644\u0648\u062d\u0629 \u0645\u0646 \u0639\u062f\u0629 \u0635\u0641\u062d\u0627\u062a\u060c \u0644\u0643\u0644 \u0635\u0641\u062d\u0629 \u0632\u0627\u0648\u064a\u0629 \u062a\u062d\u0644\u064a\u0644', '\u062a\u0642\u0631\u064a\u0631 \u062a\u062d\u0644\u064a\u0644\u064a \u0643\u0627\u0645\u0644', '\u0645\u0644\u062e\u0635 \u062a\u0646\u0641\u064a\u0630\u064a \u0644\u0644\u0625\u062f\u0627\u0631\u0629'] }
        ]
      },
      web: {
        eyebrow: '\u0627\u0644\u0623\u0633\u0639\u0627\u0631', h: '\u0628\u0627\u0642\u0627\u062a \u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0645\u0648\u0627\u0642\u0639', p: '\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0636\u062d\u0629 \u062d\u0633\u0628 \u062d\u062c\u0645 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0630\u064a \u062a\u062d\u062a\u0627\u062c\u0647.', s: '\u062a\u0635\u0645\u064a\u0645 \u0627\u0644\u0645\u0648\u0627\u0642\u0639',
        perks: [], fine: '',
        pk: [
          { n: '\u0635\u0641\u062d\u0629 \u0647\u0628\u0648\u0637', d: '\u0635\u0641\u062d\u0629 \u0648\u0627\u062d\u062f\u0629 \u0645\u0631\u0643\u0651\u0632\u0629 \u062a\u0639\u0631\u0651\u0641 \u0627\u0644\u0646\u0627\u0633 \u0628\u062e\u062f\u0645\u062a\u0643 \u0648\u062a\u062f\u0641\u0639\u0647\u0645 \u0644\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0645\u0628\u0627\u0634\u0631\u0629.', eg: '\u0645\u062f\u0631\u0651\u0628 \u0623\u0648 \u0637\u0628\u064a\u0628 \u0623\u0648 \u062d\u0650\u0631\u0641\u064a \u064a\u0631\u064a\u062f \u0635\u0641\u062d\u0629 \u0648\u0627\u062d\u062f\u0629 \u064a\u0636\u0639 \u0631\u0627\u0628\u0637\u0647\u0627 \u0641\u064a \u062d\u0633\u0627\u0628\u0647 \u0639\u0644\u0649 \u0625\u0646\u0633\u062a\u063a\u0631\u0627\u0645 \u0623\u0648 \u0641\u064a \u0625\u0639\u0644\u0627\u0646\u0647.', f: ['\u0635\u0641\u062d\u0629 \u0648\u0627\u062d\u062f\u0629 \u0645\u0635\u0645\u0651\u0645\u0629 \u062d\u0633\u0628 \u0646\u0634\u0627\u0637\u0643', '3 \u0644\u063a\u0627\u062a: \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0648\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629 \u0648\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064a\u0629', '\u062a\u0638\u0647\u0631 \u0628\u0634\u0643\u0644 \u0633\u0644\u064a\u0645 \u0639\u0644\u0649 \u0643\u0644 \u0627\u0644\u0634\u0627\u0634\u0627\u062a', '\u0623\u0632\u0631\u0627\u0631 \u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0648\u0627\u0644\u0628\u0631\u064a\u062f'] },
          { n: '\u0645\u0648\u0642\u0639 \u0623\u0639\u0645\u0627\u0644', d: '\u0645\u0648\u0642\u0639 \u0643\u0627\u0645\u0644 \u0628\u0639\u062f\u0629 \u0635\u0641\u062d\u0627\u062a \u064a\u0639\u0631\u0651\u0641 \u0628\u0646\u0634\u0627\u0637\u0643 \u0628\u0627\u0644\u062a\u0641\u0635\u064a\u0644\u060c \u0648\u064a\u0633\u0627\u0639\u062f \u0639\u0645\u0644\u0627\u0621\u0643 \u0639\u0644\u0649 \u0625\u064a\u062c\u0627\u062f\u0643 \u0639\u0644\u0649 \u062c\u0648\u062c\u0644 \u0648\u0627\u0644\u062b\u0642\u0629 \u0628\u0643.', eg: '\u0634\u0631\u0643\u0629 \u0645\u0642\u0627\u0648\u0644\u0627\u062a \u0623\u0648 \u0645\u0643\u062a\u0628 \u0645\u062d\u0627\u0645\u0627\u0629 \u0623\u0648 \u0645\u0631\u0643\u0632 \u062a\u062f\u0631\u064a\u0628: \u0635\u0641\u062d\u0629 \u0644\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0623\u062e\u0631\u0649 \u0644\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0648\u062b\u0627\u0644\u062b\u0629 \u0639\u0646 \u0627\u0644\u0634\u0631\u0643\u0629 \u0648\u0631\u0627\u0628\u0639\u0629 \u0644\u0644\u062a\u0648\u0627\u0635\u0644.', f: ['\u062d\u062a\u0649 5 \u0635\u0641\u062d\u0627\u062a', '3 \u0644\u063a\u0627\u062a', '\u0623\u0633\u0627\u0633\u064a\u0627\u062a \u062a\u062d\u0633\u064a\u0646 \u0645\u062d\u0631\u0643\u0627\u062a \u0627\u0644\u0628\u062d\u062b (SEO) \u0644\u064a\u0633\u0647\u0644 \u0638\u0647\u0648\u0631\u0643 \u0641\u064a \u0646\u062a\u0627\u0626\u062c \u0627\u0644\u0628\u062d\u062b', '\u0631\u0628\u0637 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u062e\u0627\u0635 \u0628\u0643', '\u0623\u0632\u0631\u0627\u0631 \u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628 \u0648\u0627\u0644\u0628\u0631\u064a\u062f'] },
          { n: '\u0645\u0648\u0642\u0639 \u0645\u062a\u0642\u062f\u0645', d: '\u0645\u0648\u0642\u0639 \u0623\u0643\u0628\u0631 \u0628\u062a\u062c\u0631\u0628\u0629 \u0645\u0645\u064a\u0632\u0629 \u0644\u0644\u0632\u0627\u0626\u0631\u060c \u0641\u064a\u0647 \u062d\u062c\u0632 \u0623\u0648 \u062f\u0641\u0639 \u0623\u0648 \u0623\u0642\u0633\u0627\u0645 \u0645\u0635\u0645\u0651\u0645\u0629 \u062e\u0635\u064a\u0635\u064b\u0627 \u0644\u0646\u0634\u0627\u0637\u0643.', eg: '\u0639\u064a\u0627\u062f\u0629 \u062a\u0633\u062a\u0642\u0628\u0644 \u062d\u062c\u0648\u0632\u0627\u062a \u0627\u0644\u0645\u0648\u0627\u0639\u064a\u062f\u060c \u0623\u0648 \u0645\u0631\u0643\u0632 \u062a\u0639\u0644\u064a\u0645\u064a \u064a\u0639\u0631\u0636 \u062f\u0648\u0631\u0627\u062a\u0647 \u0648\u064a\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u062f\u0641\u0639\u060c \u0623\u0648 \u0645\u062d\u0644 \u064a\u0639\u0631\u0636 \u0645\u0646\u062a\u062c\u0627\u062a\u0647 \u0628\u0637\u0631\u064a\u0642\u0629 \u062c\u0630\u0627\u0628\u0629.', f: ['\u062d\u062a\u0649 10 \u0635\u0641\u062d\u0627\u062a', '\u062d\u062c\u0632 \u0623\u0648 \u062f\u0641\u0639 \u0623\u0648 \u0623\u0642\u0633\u0627\u0645 \u0645\u062e\u0635\u0635\u0629 \u062d\u0633\u0628 \u0646\u0634\u0627\u0637\u0643', '\u062d\u0631\u0643\u0627\u062a \u0648\u062a\u0641\u0627\u0639\u0644\u0627\u062a \u0645\u0645\u064a\u0632\u0629', '3 \u0644\u063a\u0627\u062a', '\u0623\u0633\u0627\u0633\u064a\u0627\u062a SEO \u0648\u0631\u0628\u0637 \u0627\u0644\u062f\u0648\u0645\u064a\u0646 \u0627\u0644\u062e\u0627\u0635 \u0628\u0643'] }
        ]
      }
    },
    en: {
      cur: 'Change currency', from: 'Starting from', eg: 'For example', perM: '/ month', perY: '/ year', base: 'Base price', cta: 'Request this package',
      mjM: 'Monthly', mjY: 'Yearly', mjSave: 'Save {p}%', mjEq: 'equals {x} per month', mjAria: 'Billing period',
      pTitle: 'Choose currency', pSearch: 'Search currency or code', pTop: 'Most used', pAll: 'All currencies', pNone: 'No matching currency',
      pLoad: 'Loading exchange rates\u2026', pErr: 'Exchange rates could not be loaded right now.', pRetry: 'Try again', pClose: 'Close', pUpd: 'Rates last updated: {d}',
      note: 'Base prices are in EUR. Other currencies are shown as a guide using daily exchange rates and may differ slightly from the final amount at payment.',
      src: 'Exchange rates source:',
      wa: 'Hello, I would like to ask about the {n} package ({p} EUR) of the {s} service.',
      data: {
        eyebrow: 'Pricing', h: 'Data analytics pricing',
        p: 'Pick the project size that fits you. Prices are fixed and clear, and every package includes revisions and support.', s: 'data analytics',
        perks: ['100% free revisions', 'Lifetime support after delivery'],
        fine: 'Revisions and support cover the agreed project scope, without adding new data sources or new dashboards.',
        pk: [
          { n: 'Starter', d: 'For anyone with one data file (such as a sales spreadsheet) who wants to see it in one clear dashboard instead of scattered numbers.', eg: 'A shop or clinic owner who wants to know in seconds: how much did we sell this month, and which product sells best?', f: ['One data source (Excel or CSV)', 'One interactive KPI dashboard', 'Charts and indicators that answer your main questions', 'A short guide on how to read the dashboard'] },
          { n: 'Standard', d: 'For data spread across several sources, with a written report that explains what is behind the numbers and what to do about it.', eg: 'An online store combining shop sales, ad costs and a stock file to see which product earns money and which ad wastes it.', f: ['Up to 3 data sources', 'Interactive KPI dashboard', 'Written analytical report like the examples above', 'A summary of the key findings and what to do with them'] },
          { n: 'Advanced', d: 'For companies with large data that need a complete, in-depth picture to show management and base decisions on.', eg: 'A distribution company or factory with tens of thousands of orders that wants to know where profit leaks and where deliveries slip, with a summary ready for the management meeting.', f: ['Large datasets (100,000+ rows)', 'A multi-page dashboard, each page with its own angle of analysis', 'Full analytical report', 'Executive summary for management'] }
        ]
      },
      web: {
        eyebrow: 'Pricing', h: 'Website design packages', p: 'Clear prices based on the size of the website you need.', s: 'website design',
        perks: [], fine: '',
        pk: [
          { n: 'Landing page', d: 'One focused page that introduces your service and encourages people to contact you directly.', eg: 'A coach, doctor or craftsman who wants one page to link from an Instagram profile or an ad.', f: ['One page designed around your business', '3 languages: Arabic, English and Spanish', 'Looks right on every screen', 'Contact buttons for WhatsApp and email'] },
          { n: 'Business website', d: 'A complete multi-page website that presents your business in detail and helps customers find and trust you on Google.', eg: 'A construction company, law office or training center: one page for services, one for past work, one about the company and one to get in touch.', f: ['Up to 5 pages', '3 languages', 'SEO basics so people can find you in search results', 'Your own domain connected', 'Contact buttons for WhatsApp and email'] },
          { n: 'Advanced website', d: 'A larger site with a distinctive visitor experience, including booking, payment or sections built specifically for your business.', eg: 'A clinic taking appointment bookings, a learning center presenting courses and taking payments, or a shop presenting its products attractively.', f: ['Up to 10 pages', 'Booking, payment or custom sections for your business', 'Premium motion and interactions', '3 languages', 'SEO basics and your own domain'] }
        ]
      }
    },
    es: {
      cur: 'Cambiar moneda', from: 'Desde', eg: 'Por ejemplo', perM: '/ mes', perY: '/ a\u00f1o', base: 'Precio base', cta: 'Solicitar este paquete',
      mjM: 'Mensual', mjY: 'Anual', mjSave: 'Ahorra {p} %', mjEq: 'equivale a {x} al mes', mjAria: 'Periodo de facturaci\u00f3n',
      pTitle: 'Elige la moneda', pSearch: 'Buscar moneda o c\u00f3digo', pTop: 'M\u00e1s usadas', pAll: 'Todas las monedas', pNone: 'No hay monedas que coincidan',
      pLoad: 'Cargando tipos de cambio\u2026', pErr: 'No se pudieron cargar los tipos de cambio ahora.', pRetry: 'Reintentar', pClose: 'Cerrar', pUpd: '\u00daltima actualizaci\u00f3n: {d}',
      note: 'Los precios base est\u00e1n en EUR. Las dem\u00e1s monedas se muestran como referencia con tipos de cambio diarios y pueden diferir un poco del importe final al pagar.',
      src: 'Fuente de los tipos de cambio:',
      wa: 'Hola, me gustar\u00eda consultar sobre el paquete {n} ({p} EUR) del servicio de {s}.',
      data: {
        eyebrow: 'Precios', h: 'Precios del an\u00e1lisis de datos',
        p: 'Elige el tama\u00f1o de proyecto que te conviene. Los precios son fijos y claros, y cada paquete incluye cambios y soporte.', s: 'an\u00e1lisis de datos',
        perks: ['Cambios 100% gratis', 'Soporte de por vida tras la entrega'],
        fine: 'Los cambios y el soporte cubren el alcance acordado del proyecto, sin a\u00f1adir nuevas fuentes de datos ni nuevos paneles.',
        pk: [
          { n: 'B\u00e1sico', d: 'Para quien tiene un archivo de datos (como una hoja de ventas) y quiere verlo en un panel claro en lugar de cifras sueltas.', eg: 'El due\u00f1o de una tienda o cl\u00ednica que quiere saber en segundos: \u00bfcu\u00e1nto vendimos este mes y qu\u00e9 producto se vende m\u00e1s?', f: ['Una fuente de datos (Excel o CSV)', 'Un panel de indicadores interactivo', 'Gr\u00e1ficos e indicadores que responden a tus preguntas principales', 'Una gu\u00eda breve para leer el panel'] },
          { n: 'Est\u00e1ndar', d: 'Para datos repartidos en varias fuentes, con un informe escrito que explica lo que hay detr\u00e1s de las cifras y qu\u00e9 hacer con ello.', eg: 'Una tienda en l\u00ednea que une ventas, coste de anuncios y un archivo de inventario para saber qu\u00e9 producto da beneficio y qu\u00e9 anuncio hace perder dinero.', f: ['Hasta 3 fuentes de datos', 'Panel de indicadores interactivo', 'Informe anal\u00edtico escrito como los ejemplos de arriba', 'Resumen de los hallazgos clave y qu\u00e9 hacer con ellos'] },
          { n: 'Avanzado', d: 'Para empresas con datos grandes que necesitan una visi\u00f3n completa y profunda para presentar a la direcci\u00f3n y decidir.', eg: 'Una distribuidora o f\u00e1brica con decenas de miles de pedidos que quiere saber d\u00f3nde se pierde beneficio y d\u00f3nde se retrasan las entregas, con un resumen listo para la reuni\u00f3n de direcci\u00f3n.', f: ['Datos grandes (m\u00e1s de 100.000 filas)', 'Panel de varias p\u00e1ginas, cada una con un \u00e1ngulo de an\u00e1lisis', 'Informe anal\u00edtico completo', 'Resumen ejecutivo para la direcci\u00f3n'] }
        ]
      },
      web: {
        eyebrow: 'Precios', h: 'Paquetes de dise\u00f1o web', p: 'Precios claros seg\u00fan el tama\u00f1o del sitio que necesitas.', s: 'dise\u00f1o web',
        perks: [], fine: '',
        pk: [
          { n: 'P\u00e1gina de aterrizaje', d: 'Una p\u00e1gina enfocada que presenta tu servicio y anima a la gente a contactarte directamente.', eg: 'Un entrenador, m\u00e9dico o artesano que quiere una p\u00e1gina para enlazar desde su perfil de Instagram o su anuncio.', f: ['Una p\u00e1gina dise\u00f1ada para tu negocio', '3 idiomas: \u00e1rabe, ingl\u00e9s y espa\u00f1ol', 'Se ve bien en todas las pantallas', 'Botones de contacto por WhatsApp y correo'] },
          { n: 'Sitio de negocio', d: 'Un sitio completo de varias p\u00e1ginas que presenta tu negocio en detalle y ayuda a que los clientes te encuentren en Google y conf\u00eden en ti.', eg: 'Una constructora, un despacho de abogados o un centro de formaci\u00f3n: una p\u00e1gina de servicios, otra de trabajos anteriores, otra sobre la empresa y otra de contacto.', f: ['Hasta 5 p\u00e1ginas', '3 idiomas', 'Bases de SEO para que te encuentren en los resultados de b\u00fasqueda', 'Tu propio dominio conectado', 'Botones de contacto por WhatsApp y correo'] },
          { n: 'Sitio avanzado', d: 'Un sitio m\u00e1s grande con una experiencia distintiva para el visitante, con reservas, pagos o secciones creadas para tu negocio.', eg: 'Una cl\u00ednica que recibe reservas de citas, un centro de formaci\u00f3n que presenta cursos y cobra, o una tienda que muestra sus productos de forma atractiva.', f: ['Hasta 10 p\u00e1ginas', 'Reservas, pagos o secciones a medida para tu negocio', 'Animaciones e interacciones premium', '3 idiomas', 'Bases de SEO y tu propio dominio'] }
        ]
      }
    }
  };

  /* ---- icons ---- */
  var A = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICON = {
    coin: '<svg ' + A + ' width="16" height="16"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.6 5.3 3.6 8.5s-1.2 6-3.6 8.5c-2.4-2.5-3.6-5.3-3.6-8.5s1.2-6 3.6-8.5z"/></svg>',
    chev: '<svg ' + A + ' width="14" height="14" class="gp-chev"><path d="M6 9l6 6 6-6"/></svg>',
    search: '<svg ' + A + ' width="18" height="18"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
    close: '<svg ' + A + ' width="18" height="18"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg ' + A + ' width="18" height="18" class="gp-tick"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    tick: '<svg ' + A + ' width="18" height="18"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  /* ---- state ---- */
  var cur = BASE, fx = null, fxState = 'idle', pending = null;
  var mjPer = 'm';
  var pop = null, back = null, trigger = null, isOpen = false, query = '', openedAt = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lang() { var l = d.documentElement.lang; return TXT[l] ? l : 'ar'; }
  function T() { return TXT[lang()]; }
  function isMobile() { return w.matchMedia && w.matchMedia('(max-width:600px)').matches; }

  function store(k, v) { try { w.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  function load(k) { try { return w.localStorage.getItem(k); } catch (e) { return null; } }

  /* ---- rates ---- */
  function readCache() {
    try { var c = JSON.parse(load(KEY_FX)); if (c && c.rates && c.rates.EUR === 1 && c.t) return c; } catch (e) { /* ignore */ }
    return null;
  }
  function rate(code) {
    if (code === BASE) return 1;
    return fx && fx.rates && typeof fx.rates[code] === 'number' ? fx.rates[code] : null;
  }
  function activeCur() { return rate(cur) ? cur : BASE; }

  function loadFx(force) {
    var c = readCache();
    if (c && !force && Date.now() - c.t < FX_TTL) { fx = c; fxState = 'ok'; return Promise.resolve(); }
    if (pending) return pending;
    if (!w.fetch || !w.Promise) { fx = c; fxState = c ? 'ok' : 'error'; return Promise.resolve(); }
    fxState = 'loading'; refreshPanel();
    var ctl = w.AbortController ? new w.AbortController() : null;
    var timer = w.setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    pending = w.fetch(FX_URL, ctl ? { signal: ctl.signal } : undefined)
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (j) {
        if (!j || j.result !== 'success' || !j.rates || j.rates.EUR !== 1) throw new Error('bad');
        fx = { t: Date.now(), upd: j.time_last_update_unix || null, rates: j.rates };
        store(KEY_FX, JSON.stringify(fx)); fxState = 'ok';
      })
      .catch(function () { if (c) { fx = c; fxState = 'ok'; } else { fxState = 'error'; } })
      .then(function () { w.clearTimeout(timer); pending = null; listCache = null; renderAll(); refreshPanel(); });
    return pending;
  }

  /* ---- formatting ---- */
  function fmt(v) {
    var r = v >= 100 ? Math.round(v) : Math.round(v * 100) / 100;
    var whole = r % 1 === 0;
    return r.toLocaleString('en-US', { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
  }
  var dn = {};
  function cname(code) {
    var l = lang();
    try { dn[l] = dn[l] || new Intl.DisplayNames([l], { type: 'currency' }); return dn[l].of(code) || code; } catch (e) { return code; }
  }
  function unit(code) { return lang() === 'ar' ? esc(cname(code)) : '<bdi dir="ltr">' + esc(code) + '</bdi>'; }
  function money(eur, code) {
    var v = eur * (rate(code) || 1);
    return '<bdi dir="ltr">' + fmt(v) + '</bdi> ' + unit(code);
  }

  /* ---- building blocks ---- */
  function trig(id) {
    var c = activeCur();
    return '<button type="button" class="gp-cur" data-gp-open data-gp-id="' + id + '" aria-haspopup="dialog" aria-expanded="false" aria-label="' + esc(T().cur) + ': ' + c + '">' +
      ICON.coin + '<span dir="ltr">' + c + '</span>' + ICON.chev + '</button>';
  }
  function baseLine(eur, per) {
    if (activeCur() === BASE) return '';
    return '<p class="gp-base">' + esc(T().base) + ': ' + money(eur, BASE) + (per ? ' ' + esc(per) : '') + '</p>';
  }
  function priceLine(eur, per, id) {
    var c = activeCur();
    return '<div class="gp-line"><div class="gp-price"><span class="gp-amt"><bdi dir="ltr">' + fmt(eur * rate(c)) + '</bdi></span>' +
      '<span class="gp-unit">' + unit(c) + '</span>' + (per ? '<span class="gp-per">' + esc(per) + '</span>' : '') + '</div>' + trig(id) + '</div>';
  }

  function renderMJ() {
    var el = d.getElementById('gp-mj'); if (!el) return;
    var t = T(), y = mjPer === 'y';
    var eur = y ? MJ.y : MJ.m;
    el.innerHTML =
      '<div class="gp-seg" role="group" aria-label="' + esc(t.mjAria) + '">' +
        '<button type="button" data-gp-per="m" aria-pressed="' + (!y) + '">' + esc(t.mjM) + '</button>' +
        '<button type="button" data-gp-per="y" aria-pressed="' + y + '">' + esc(t.mjY) + '<em>' + esc(t.mjSave.replace('{p}', mjPct())) + '</em></button>' +
      '</div>' +
      priceLine(eur, y ? t.perY : t.perM, 'mj') +
      (y ? '<p class="gp-sub">' + esc(t.mjEq).replace('{x}', money(MJ.y / 12, activeCur())) + '</p>' : '') +
      baseLine(eur, y ? t.perY : t.perM);
  }

  function waLink(t, name, eur, service) {
    var msg = t.wa.replace('{n}', name).replace('{p}', fmt(eur)).replace('{s}', service);
    return WA + '?text=' + encodeURIComponent(msg);
  }

  function renderPack(kind, list, hostId) {
    var el = d.getElementById(hostId); if (!el) return;
    var t = T(), k = t[kind];
    var cards = list.map(function (it, i) {
      var pk = k.pk[i];
      var feats = k.perks.map(function (x) { return '<li class="is-perk">' + ICON.tick + '<span>' + esc(x) + '</span></li>'; })
        .concat(pk.f.map(function (x) { return '<li>' + ICON.tick + '<span>' + esc(x) + '</span></li>'; })).join('');
      return '<article class="card gp-card">' +
        '<h4 class="gp-name">' + esc(pk.n) + '</h4><p class="gp-desc">' + esc(pk.d) + '</p>' +
        '<p class="gp-eg"><b>' + esc(t.eg) + ':</b> ' + esc(pk.eg) + '</p>' +
        '<div class="gp-pricebox"><span class="gp-from">' + esc(t.from) + '</span>' + priceLine(it.p, '', kind + i) + baseLine(it.p, '') + '</div>' +
        '<ul class="gp-feat">' + feats + '</ul>' +
        '<a class="btn btn-gold gp-cta" href="' + esc(waLink(t, pk.n, it.p, k.s)) + '" target="_blank" rel="noopener">' + esc(t.cta) + '</a>' +
        '</article>';
    }).join('');
    el.innerHTML =
      '<header class="gp-head"><p class="eyebrow">' + esc(k.eyebrow) + '</p><h3>' + esc(k.h) + '</h3><p>' + esc(k.p) + '</p></header>' +
      '<div class="gp-grid">' + cards + '</div>' +
      (k.fine ? '<p class="gp-fine">' + esc(k.fine) + '</p>' : '') +
      '<p class="gp-note">' + esc(t.note) + ' ' + esc(t.src) + ' <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener" dir="ltr">Rates By Exchange Rate API</a></p>';
  }

  function renderAll() {
    renderMJ(); renderPack('data', DATA, 'gp-data'); renderPack('web', WEB, 'gp-web');
    /* the buttons were rebuilt: point the open panel at the new one */
    if (isOpen && trigger) {
      var nt = d.querySelector('[data-gp-id="' + trigger.getAttribute('data-gp-id') + '"]');
      if (nt) { trigger = nt; nt.setAttribute('aria-expanded', 'true'); }
    }
  }

  /* ---- picker panel ---- */
  var listCache = null;
  function allCodes() {
    var l = lang();
    if (listCache && listCache.l === l) return listCache.items;
    var items = Object.keys(fx.rates).filter(function (c) { return /^[A-Z]{3}$/.test(c) && !SKIP[c]; })
      .map(function (c) { var n = cname(c); return { code: c, name: n, key: norm(n + ' ' + c) }; });
    items.sort(function (a, b) { return a.name.localeCompare(b.name, l); });
    listCache = { l: l, items: items };
    return items;
  }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g, ''); }

  function opt(it, sel) {
    return '<button type="button" class="gp-opt" role="option" data-code="' + it.code + '" aria-selected="' + (it.code === sel) + '">' +
      '<b dir="ltr">' + it.code + '</b><span>' + esc(it.name) + '</span>' + ICON.check + '</button>';
  }

  function listHtml() {
    var t = T();
    if (fxState === 'loading' && !fx) return '<p class="gp-msg">' + esc(t.pLoad) + '</p>';
    if (!fx) return '<p class="gp-msg">' + esc(t.pErr) + '</p><button type="button" class="btn btn-ghost btn-sm gp-retry" data-gp-retry>' + esc(t.pRetry) + '</button>';
    var items = allCodes(), sel = activeCur(), q = norm(query.trim());
    if (q) {
      var hit = items.filter(function (it) { return it.key.indexOf(q) !== -1; });
      return hit.length ? hit.map(function (it) { return opt(it, sel); }).join('') : '<p class="gp-msg">' + esc(t.pNone) + '</p>';
    }
    var top = PINNED.map(function (c) { return items.filter(function (it) { return it.code === c; })[0]; }).filter(Boolean);
    var rest = items.filter(function (it) { return PINNED.indexOf(it.code) === -1; });
    return '<p class="gp-sec">' + esc(t.pTop) + '</p>' + top.map(function (it) { return opt(it, sel); }).join('') +
      '<p class="gp-sec">' + esc(t.pAll) + '</p>' + rest.map(function (it) { return opt(it, sel); }).join('');
  }

  function buildPanel() {
    if (pop) return;
    back = d.createElement('div'); back.className = 'gp-back'; back.hidden = true;
    pop = d.createElement('div'); pop.className = 'gp-pop'; pop.hidden = true;
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true');
    d.body.appendChild(back); d.body.appendChild(pop);
    back.addEventListener('click', function () { closePanel(true); });
    pop.addEventListener('input', function (e) {
      if (e.target && e.target.classList.contains('gp-q')) { query = e.target.value; var l = pop.querySelector('.gp-list'); if (l) { l.innerHTML = listHtml(); l.scrollTop = 0; } }
    });
  }

  function panelHtml() {
    var t = T();
    var upd = '';
    if (fx && fx.upd) {
      try { upd = new Date(fx.upd * 1000).toLocaleDateString(lang() === 'ar' ? 'ar-u-nu-latn' : lang(), { year: 'numeric', month: 'short', day: 'numeric' }); } catch (e) { upd = ''; }
    }
    return '<div class="gp-pop-h"><b>' + esc(t.pTitle) + '</b><button type="button" class="gp-x" data-gp-close aria-label="' + esc(t.pClose) + '">' + ICON.close + '</button></div>' +
      '<label class="gp-search">' + ICON.search + '<input class="gp-q" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(t.pSearch) + '" aria-label="' + esc(t.pSearch) + '" value="' + esc(query) + '"></label>' +
      '<div class="gp-list" role="listbox" aria-label="' + esc(t.pTitle) + '">' + listHtml() + '</div>' +
      '<p class="gp-foot">' + (upd ? esc(t.pUpd).replace('{d}', upd) + ' \u00b7 ' : '') + '<a href="https://www.exchangerate-api.com" target="_blank" rel="noopener" dir="ltr">Rates By Exchange Rate API</a></p>';
  }

  function refreshPanel() {
    if (!isOpen || !pop) return;
    var q = pop.querySelector('.gp-q'), had = q && d.activeElement === q;
    pop.innerHTML = panelHtml();
    if (had) { var nq = pop.querySelector('.gp-q'); if (nq) nq.focus({ preventScroll: true }); }
    place();
  }

  function place() {
    if (!pop || !isOpen) return;
    if (isMobile()) { pop.style.left = pop.style.top = pop.style.width = ''; pop.classList.add('is-sheet'); return; }
    pop.classList.remove('is-sheet');
    if (!trigger) return;
    var r = trigger.getBoundingClientRect(), vw = d.documentElement.clientWidth, vh = w.innerHeight;
    var pw = Math.min(340, vw - 24);
    pop.style.width = pw + 'px';
    var rtl = d.documentElement.dir === 'rtl';
    var left = rtl ? r.right - pw : r.left;
    left = Math.max(12, Math.min(left, vw - pw - 12));
    var ph = pop.offsetHeight, top = r.bottom + 8;
    if (top + ph > vh - 12) top = (r.top - 8 - ph > 12) ? r.top - 8 - ph : Math.max(12, vh - ph - 12);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }

  function openPanel(btn) {
    buildPanel();
    if (isOpen) closePanel(false);
    trigger = btn; isOpen = true; query = ''; openedAt = Date.now();
    btn.setAttribute('aria-expanded', 'true');
    pop.innerHTML = panelHtml();
    pop.hidden = false;
    var mob = isMobile();
    back.hidden = !mob;
    if (mob) d.documentElement.classList.add('gp-lock');
    place();
    w.requestAnimationFrame(function () { pop.classList.add('is-in'); if (mob) back.classList.add('is-in'); });
    loadFx(false).then(function () { refreshPanel(); });
    if (!mob && !(w.matchMedia && w.matchMedia('(pointer:coarse)').matches)) { var q = pop.querySelector('.gp-q'); if (q) q.focus({ preventScroll: true }); }
  }

  function closePanel(refocus) {
    if (!isOpen || !pop) return;
    isOpen = false;
    pop.classList.remove('is-in'); back.classList.remove('is-in');
    pop.hidden = true; back.hidden = true;
    d.documentElement.classList.remove('gp-lock');
    if (trigger) { trigger.setAttribute('aria-expanded', 'false'); if (refocus) trigger.focus(); }
  }

  function choose(code) {
    var id = trigger ? trigger.getAttribute('data-gp-id') : null;
    cur = code; store(KEY_CUR, code);
    closePanel(false);
    renderAll();
    if (id) { var nb = d.querySelector('[data-gp-id="' + id + '"]'); if (nb) nb.focus({ preventScroll: true }); }
  }

  /* ---- events ---- */
  d.addEventListener('click', function (e) {
    var t = e.target;
    var open = t.closest && t.closest('[data-gp-open]');
    if (open) { if (isOpen && trigger === open) closePanel(true); else openPanel(open); return; }
    var per = t.closest && t.closest('[data-gp-per]');
    if (per) { mjPer = per.getAttribute('data-gp-per'); renderMJ(); var b = d.querySelector('[data-gp-per="' + mjPer + '"]'); if (b) b.focus({ preventScroll: true }); return; }
    var o = t.closest && t.closest('.gp-opt');
    if (o) { choose(o.getAttribute('data-code')); return; }
    if (t.closest && t.closest('[data-gp-close]')) { closePanel(true); return; }
    if (t.closest && t.closest('[data-gp-retry]')) { fx = null; loadFx(true); return; }
    if (isOpen && pop && !pop.contains(t)) closePanel(false);
  });

  d.addEventListener('keydown', function (e) {
    if (!isOpen || !pop) return;
    if (e.key === 'Escape') { e.preventDefault(); closePanel(true); return; }
    if (e.key === 'Tab') {
      var f = pop.querySelectorAll('button:not([disabled]),input,a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var opts = [].slice.call(pop.querySelectorAll('.gp-opt'));
      if (!opts.length) return;
      e.preventDefault();
      var i = opts.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') i = i < 0 ? 0 : Math.min(opts.length - 1, i + 1);
      else if (i <= 0) { var q = pop.querySelector('.gp-q'); if (q) q.focus(); return; } else i -= 1;
      opts[i].focus(); opts[i].scrollIntoView({ block: 'nearest' });
    }
  });

  w.addEventListener('scroll', function () { if (isOpen && !isMobile() && Date.now() - openedAt > 400) closePanel(false); }, { passive: true });
  w.addEventListener('resize', function () { if (isOpen) { var m = isMobile(); back.hidden = !m; d.documentElement.classList.toggle('gp-lock', m); place(); } });

  /* ---- start ---- */
  var saved = load(KEY_CUR);
  if (saved && /^[A-Z]{3}$/.test(saved)) cur = saved;
  var cached = readCache();
  if (cached) { fx = cached; fxState = 'ok'; }
  renderAll();
  if (cur !== BASE && (!cached || Date.now() - cached.t >= FX_TTL)) loadFx(false);
  if (w.MutationObserver) new MutationObserver(function () { listCache = null; if (isOpen) closePanel(false); renderAll(); }).observe(d.documentElement, { attributes: true, attributeFilter: ['lang'] });
})(window, document);

(function () {
  'use strict';

  var T = {
    ar: {
      noteT:'تنويه:', noteB:'تم إخفاء هوية الشركات في هذا المشروع حفاظًا على الخصوصية، ونُشر بعد الحصول على إذن.',
      goDash:'استعرض اللوحة التفاعلية', goRep:'اقرأ التقرير', repPrint:'طباعة أو حفظ PDF',
      skip:'تخطَّ إلى المحتوى', navTools:'الأدوات', navData:'تحليل البيانات', navAcademy:'الأكاديمية', navPricing:'الباقات', navReviews:'آراء العملاء',
      ctaContact:'تواصل معنا', back:'كل مشاريع تحليل البيانات',
      pTitle:'التعافي من اضطرابات سلاسل الإمداد',
      pLead:'تحليل 100,000 حادثة اضطراب في سلاسل الإمداد: الخسارة في الإيرادات بالدولار، وزمن التعافي بالأيام. لوحة تفاعلية بملخص تنفيذي وورقة عمل للمحلل.',
      f1:'حادثة اضطراب محلَّلة', f2:'واجهتان: ملخص تنفيذي وورقة عمل المحلل', f3:'لغات: عربي · English · Español',
      dashH:'اللوحة التفاعلية', full:'فتح بملء الشاشة',
      repH:'تقرير المشروع', repEmpty:'التقرير قيد الإعداد', repEmptyP:'سيتوفر هنا للقراءة والتحميل بعد اعتماده.',
      soon:'قريبًا', repFile:'تقرير المشروع (PDF)', repDl:'تحميل التقرير', repOpen:'افتح التقرير في تبويب جديد',
      ctaH2:'عندك بيانات تحتاج تحليلًا مماثلًا؟', ctaP2:'أخبرنا عن بياناتك وسنقترح عليك الطريقة الأنسب.',
      ctaWa:'واتساب', ctaMail:'راسلنا بالبريد'
    },
    en: {
      noteT:'Notice:', noteB:'Company identities in this project have been anonymised to protect privacy, and it is published with permission.',
      goDash:'Explore the dashboard', goRep:'Read the report', repPrint:'Print / save as PDF',
      skip:'Skip to content', navTools:'Tools', navData:'Data Analytics', navAcademy:'Academy', navPricing:'Pricing', navReviews:'Reviews',
      ctaContact:'Contact us', back:'All data analytics projects',
      pTitle:'Supply Chain Disruption Recovery',
      pLead:'An analysis of 100,000 supply chain disruption incidents: revenue loss in US dollars and recovery in days. An interactive dashboard with an executive summary and an analyst workbench.',
      f1:'disruption incidents analysed', f2:'views: executive summary and analyst workbench', f3:'languages: العربية · English · Español',
      dashH:'Interactive dashboard', full:'Open full screen',
      repH:'Project report', repEmpty:'The report is being prepared', repEmptyP:'It will be available here to read and download once approved.',
      soon:'Coming soon', repFile:'Project report (PDF)', repDl:'Download report', repOpen:'Open the report in a new tab',
      ctaH2:'Have data that needs a similar analysis?', ctaP2:'Tell us about your data and we will suggest the best approach.',
      ctaWa:'WhatsApp', ctaMail:'Email us'
    },
    es: {
      noteT:'Aviso:', noteB:'Se ha ocultado la identidad de las empresas de este proyecto para proteger su privacidad, y se publica con su autorización.',
      goDash:'Explorar el panel', goRep:'Leer el informe', repPrint:'Imprimir / guardar PDF',
      skip:'Saltar al contenido', navTools:'Herramientas', navData:'Análisis de datos', navAcademy:'Academia', navPricing:'Planes', navReviews:'Opiniones',
      ctaContact:'Contáctanos', back:'Todos los proyectos de análisis de datos',
      pTitle:'Recuperación ante disrupciones de la cadena de suministro',
      pLead:'Un análisis de 100.000 incidentes de disrupción en la cadena de suministro: pérdida de ingresos en dólares y recuperación en días. Un panel interactivo con resumen ejecutivo y mesa de trabajo del analista.',
      f1:'incidentes de disrupción analizados', f2:'vistas: resumen ejecutivo y mesa del analista', f3:'idiomas: العربية · English · Español',
      dashH:'Panel interactivo', full:'Abrir a pantalla completa',
      repH:'Informe del proyecto', repEmpty:'El informe está en preparación', repEmptyP:'Estará disponible aquí para leer y descargar una vez aprobado.',
      soon:'Próximamente', repFile:'Informe del proyecto (PDF)', repDl:'Descargar informe', repOpen:'Abrir el informe en una pestaña nueva',
      ctaH2:'¿Tienes datos que necesitan un análisis similar?', ctaP2:'Cuéntanos sobre tus datos y te sugeriremos el mejor enfoque.',
      ctaWa:'WhatsApp', ctaMail:'Escríbenos'
    }
  };
  var NAMES = {ar:'العربية', en:'English', es:'Español'};

  var root = document.documentElement;
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }

  function setLang(lang){
    if (!T[lang]) lang = 'ar';
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var v = T[lang][el.getAttribute('data-i18n')]; if (v != null) el.textContent = v;
    });
    document.querySelectorAll('#lang-menu [data-lang]').forEach(function(b){ b.setAttribute('aria-checked', String(b.dataset.lang === lang)); });
    document.getElementById('lang-cur').textContent = NAMES[lang];
    var arr = document.querySelector('.crumb .arr'); if (arr) arr.textContent = lang === 'ar' ? '→' : '←';
    document.title = T[lang].pTitle + ' — Guru';
    GuruLang.persist(lang); sync();
  }
  function setTheme(t){ if (window.GuruTheme) GuruTheme.persist(t); else { root.setAttribute('data-theme', t); set('guru-theme', t); } sync(); }

  /* language menu */
  var btn = document.getElementById('lang-btn'), menu = document.getElementById('lang-menu');
  function items(){ return Array.prototype.slice.call(menu.querySelectorAll('button')); }
  function openMenu(f){ menu.hidden = false; btn.setAttribute('aria-expanded','true');
    if (f) { var i = items(); (i.filter(function(x){return x.getAttribute('aria-checked')==='true';})[0] || i[0]).focus(); } }
  function closeMenu(r){ menu.hidden = true; btn.setAttribute('aria-expanded','false'); if (r) btn.focus(); }
  btn.addEventListener('click', function(){ menu.hidden ? openMenu(false) : closeMenu(false); });
  btn.addEventListener('keydown', function(e){ if (e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); openMenu(true); } });
  menu.addEventListener('keydown', function(e){
    var i = items(), k = i.indexOf(document.activeElement);
    if (e.key==='ArrowDown'){ e.preventDefault(); i[(k+1)%i.length].focus(); }
    else if (e.key==='ArrowUp'){ e.preventDefault(); i[(k-1+i.length)%i.length].focus(); }
    else if (e.key==='Escape'){ e.preventDefault(); closeMenu(true); }
    else if (e.key==='Tab'){ closeMenu(false); }
  });
  document.addEventListener('click', function(e){ if (!menu.hidden && !document.getElementById('lang').contains(e.target)) closeMenu(false); });
  menu.querySelectorAll('[data-lang]').forEach(function(b){ b.addEventListener('click', function(){ setLang(b.dataset.lang); closeMenu(true); }); });
  document.getElementById('theme').addEventListener('click', function(){ setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

  /* embedded frames (dashboard + report): sync, auto height, in-page navigation */
  var frames = [document.getElementById('dash'), document.getElementById('rep')];
  function sync(){
    frames.forEach(function(f){ try { f.contentWindow.postMessage({type:'guru-sync', lang: root.lang, theme: root.getAttribute('data-theme')}, '*'); } catch(e){} });
  }
  function headerOffset(){ var s = document.querySelector('.subnav'); return 68 + (s ? s.offsetHeight : 0) + 12; }
  window.addEventListener('message', function(e){
    var f = frames.filter(function(x){ return x.contentWindow === e.source; })[0];
    if (!f || !e.data) return;
    if (e.data.type === 'guru-ready') sync();
    if (e.data.type === 'guru-height' && e.data.h > 200) f.style.height = e.data.h + 'px';
    if (e.data.type === 'guru-goto') window.scrollTo({top: f.getBoundingClientRect().top + window.scrollY + e.data.y - headerOffset(), behavior: 'smooth'});
    if (e.data.type === 'guru-open') { var t = document.getElementById(e.data.id); if (t) window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - headerOffset() + 12, behavior: 'smooth'}); }
  });
  frames.forEach(function(f){ f.addEventListener('load', sync); });
  document.getElementById('print-rep').addEventListener('click', function(){
    try { frames[1].contentWindow.postMessage({type:'guru-print'}, '*'); } catch(e){ window.open('report.html','_blank'); }
  });

  /* sub-navigation highlight */
  var links = document.querySelectorAll('.subnav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if (en.isIntersecting) links.forEach(function(a){ a.classList.toggle('on', a.dataset.sec === en.target.id); }); });
    }, {rootMargin:'-30% 0px -60% 0px'});
    ['dashboard','report','contact'].forEach(function(id){ var el = document.getElementById(id); if (el) io.observe(el); });
  }

  if (window.GuruTheme) GuruTheme.onChange(function(){ sync(); });
  setLang(GuruLang.resolve());
  GuruLang.onExternalChange(function(l){ if (l !== root.lang) setLang(l); });

  /* load the embedded pages already in the visitor's language and theme (no flash) */
  function frameSrc(base){ return base + '?lang=' + root.lang + '&theme=' + root.getAttribute('data-theme'); }
  document.getElementById('dash').src = frameSrc('dashboard.html');
  document.getElementById('rep').src = frameSrc('report.html');
  document.getElementById('yr').textContent = new Date().getFullYear();
})();

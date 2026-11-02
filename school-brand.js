/* School identity: Cyrillic З with superscript ц. Shared by the site and GetCourse. */
(function () {
  'use strict';
  if (window.__schoolPartnerIntroInstalled === '20261102-inline') return;
  window.__schoolPartnerIntroInstalled = '20261102-inline';
  // Keep the legacy guard so a cached bundle cannot reinstall the old banner.
  window.__schoolBrandInstalled = '20261102-sber';
  var base = 'https://cifrazakup.ru/';
  var mark = base + 'assets/school-mark.svg';
  var selector = '[class~="brand__mark"],[class$="-brand__mark"]';
  var css = '.school-brand-icon{display:block!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain}' +
    '.school-brand-link{display:inline-flex!important;align-items:center;gap:12px;text-decoration:none!important;color:inherit;font:700 17px/1.2 Arial,sans-serif}' +
    '.school-brand-link>img{display:block;width:38px;height:38px;flex:none}' +
    '.school-brand-bar{box-sizing:border-box;width:100%;max-width:1200px;margin:0 auto;padding:20px;color:#14161d}' +
    '.school-brand-bottom{border-top:1px solid #e4e6e0;margin-top:28px}' +
    '.school-brand-in-footer{margin-bottom:20px}' +
    '.school-partner-banner,.school-partner-spacer{display:none!important}' +
    '.school-partner-eyebrow{display:flex;align-items:center;gap:9px;margin:0 0 22px;font-family:inherit;font-size:12.5px;font-weight:700;line-height:1.6;letter-spacing:.16em;text-transform:uppercase;color:#0e8a52}' +
    '.school-partner-eyebrow::before{content:"";width:26px;height:2px;flex:none;background:currentColor;border-radius:2px}' +
    '.school-partner-eyebrow--light{color:#5fd29a}' +
    '.school-partner-intro-wrap{max-width:1200px;margin:0 auto;padding:0 20px}' +
    '@media print{.school-brand-bar{display:none}}';
  var style = document.createElement('style');
  style.id = 'school-brand-style';
  style.textContent = css;
  document.head.appendChild(style);

  function icon(rel, href, type) {
    var link = document.querySelector('link[rel="' + rel + '"]');
    if (!link) { link = document.createElement('link'); link.rel = rel; document.head.appendChild(link); }
    link.href = base + href;
    if (type) link.type = type;
  }
  // Remove ambiguous legacy icon declarations before adding the canonical pair.
  document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(function (el) { el.remove(); });
  icon('icon', 'favicon.svg', 'image/svg+xml');
  icon('apple-touch-icon', 'apple-touch-icon.png');

  function image() {
    var img = document.createElement('img');
    img.src = mark; img.alt = ''; img.className = 'school-brand-icon';
    img.setAttribute('aria-hidden', 'true');
    img.width = 38; img.height = 38;
    return img;
  }
  function link() {
    var a = document.createElement('a'); a.className = 'school-brand-link';
    a.href = base; a.setAttribute('aria-label', 'Закупки в цифре — главная');
    var img = image(); img.className = ''; a.appendChild(img);
    var text = document.createElement('span'); text.textContent = 'Закупки в цифре'; a.appendChild(text);
    return a;
  }
  function bar(parent, before, footer) {
    var el = document.createElement(footer ? 'footer' : 'header');
    el.className = 'school-brand-bar' + (footer ? ' school-brand-bottom' : '');
    el.appendChild(link());
    parent.insertBefore(el, before);
  }
  function partnerIntro(content) {
    if (!content || content.querySelector('[data-school-partner-intro]')) return;
    var heading = content.querySelector('h1');
    var officialDoc = content.querySelector('.czdoc,.czprog');
    var scope = heading && !officialDoc && (heading.closest('section') || heading.parentElement);
    var eyebrow = scope && scope.querySelector('[class*="eyebrow"]');
    // /brainstorm has the same eyebrow styled inline, without a CSS class.
    var previous = heading && !officialDoc && heading.previousElementSibling;
    if (!eyebrow && previous && previous.textContent.trim().length < 400 &&
        getComputedStyle(previous).textTransform === 'uppercase' &&
        parseFloat(getComputedStyle(previous).fontSize) <= 16) eyebrow = previous;
    var text = eyebrow ? eyebrow.textContent.trim().replace(/\s+/g, ' ') : '';
    var partner = 'Совместно со Сбер А';
    var existing = /совместно\s+со\s+[«"“]?Сбер\s+А[»"”]?/i;
    if (existing.test(text)) {
      text = text.replace(existing, partner);
      text = text.replace(/Совместно со Сбер А\s+(?![·—–|])/i, partner + ' · ');
    } else if (/партн[её]р ЭТП [«"]Сбер А[»"]/i.test(text)) {
      text = text.replace(/партн[её]р ЭТП [«"]Сбер А[»"]/i, partner);
    } else if (/^Онлайн-школа «Закупки в цифре»/i.test(text)) {
      text = text.replace(/^Онлайн-школа «Закупки в цифре»/i, 'Онлайн-школа «Закупки в цифре» · ' + partner);
    } else {
      text = 'Онлайн-школа «Закупки в цифре» · ' + partner +
        (text ? ' · ' + text.replace(/^Курс школы\s*·\s*/i, '') : '');
    }
    if (!eyebrow) {
      eyebrow = document.createElement('div');
      eyebrow.className = 'school-partner-eyebrow';
      if (heading && !officialDoc) {
        var color = getComputedStyle(heading).color.match(/\d+/g) || [];
        if (color.length >= 3 && Number(color[0]) > 190 && Number(color[1]) > 190 && Number(color[2]) > 190) {
          eyebrow.classList.add('school-partner-eyebrow--light');
        }
        heading.parentNode.insertBefore(eyebrow, heading);
      } else {
        // Keep the approved document and native access/form blocks unchanged.
        var target = officialDoc || content.querySelector('header');
        var wrapper = document.createElement('div');
        wrapper.className = 'school-partner-intro-wrap';
        wrapper.appendChild(eyebrow);
        if (officialDoc) target.parentNode.insertBefore(wrapper, target);
        else if (target) target.parentNode.insertBefore(wrapper, target.nextSibling);
        else content.insertBefore(wrapper, content.firstChild);
      }
    }
    var decoration = eyebrow.querySelector('[aria-hidden="true"]');
    if (decoration) decoration = decoration.cloneNode(true);
    eyebrow.textContent = text;
    if (decoration) eyebrow.insertBefore(decoration, eyebrow.firstChild);
    eyebrow.setAttribute('data-school-partner-intro', '1');
  }
  function apply() {
    // A previously cached bootstrap may have inserted a banner; the CSS hides it
    // without triggering its old observer to keep recreating the element.
    document.body.classList.remove('school-has-partner');
    var accountLogo = document.querySelector('.gc-account-logo .logo-link img');
    if (accountLogo && accountLogo.src !== mark) {
      accountLogo.src = mark; accountLogo.alt = 'Закупки в цифре';
      accountLogo.style.width = '50px'; accountLogo.style.height = '50px'; accountLogo.style.objectFit = 'contain';
    }
    if (accountLogo && accountLogo.closest('a')) accountLogo.closest('a').href = base;
    // Public page content only: never alter the GetCourse editor or administration UI.
    if (/^\/(pl|cms)\//.test(location.pathname)) return;
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.querySelector('.school-brand-icon')) return;
      el.textContent = ''; el.appendChild(image());
    });
    // The older /brainstorm landing uses inline styles, without brand classes.
    document.querySelectorAll('sup').forEach(function (sup) {
      var parent = sup.parentElement;
      if (/^цф?$/.test(sup.textContent.trim()) && /^Зцф?$/.test(parent.textContent.replace(/\s/g, ''))) {
        parent.textContent = ''; parent.style.display = 'block'; parent.style.width = '100%'; parent.style.height = '100%';
        parent.appendChild(image());
      }
    });
    // Documents keep their approved text unchanged; identity sits outside the document.
    document.querySelectorAll('.czdoc,.czprog').forEach(function (doc) {
      if (doc.getAttribute('data-school-brand')) return;
      doc.setAttribute('data-school-brand', '1');
      bar(doc.parentNode, doc, false); bar(doc.parentNode, doc.nextSibling, true);
    });
    if (/^\/(oferta|privacy|svedeniya)\.html$/.test(location.pathname) && !document.querySelector('footer')) {
      bar(document.body, null, true);
    }
    if (location.pathname === '/landings/main-getcourse.html' && !document.querySelector('.school-brand-bar')) {
      bar(document.body, document.body.firstChild, false); bar(document.body, null, true);
    }
    // Existing older webinar navigation and footer retain their contents and links.
    if (location.pathname === '/gzissues' || location.pathname === '/gzissues_promo') {
      var brand = document.querySelector('header .brand');
      if (brand && !brand.querySelector('.school-brand-link')) {
        brand.textContent = ''; brand.appendChild(link());
      }
      var footer = document.querySelector('footer .wrap');
      if (footer && !footer.querySelector('.school-brand-link')) {
        var wrap = document.createElement('div'); wrap.className = 'school-brand-in-footer';
        wrap.appendChild(link()); footer.insertBefore(wrap, footer.firstChild);
      }
    }
    // Recording, waiting and entrance pages have no school navigation of their own.
    // Keep the platform blocks and access rules in place and add identity around them.
    var content = document.querySelector('.gc-main-content.front-page-content');
    var pendingBundle = document.querySelector('#cz-root:not([data-ready]),#cz-course:not([data-ready]),#muh-root:not([data-ready]),#lev-root:not([data-ready]),#pst-root:not([data-ready]),#opt-root:not([data-ready])');
    if (content && !pendingBundle) {
      if (!content.querySelector('header')) bar(content, content.firstChild, false);
      if (!content.querySelector('footer')) bar(content, null, true);
    }
    // The school name and mark always lead home, rather than to a landing's hero.
    document.querySelectorAll('img[src="' + mark + '"]').forEach(function (img) {
      var home = img.closest('a');
      if (home) { home.href = base; home.removeAttribute('target'); }
    });
    if (!pendingBundle) partnerIntro(content || document.body);
  }
  function start() {
    apply();
    // GetCourse bundles insert their page blocks after DOMContentLoaded.
    var scheduled = false;
    new MutationObserver(function (changes) {
      if (scheduled || !changes.some(function (m) { return m.addedNodes.length; })) return;
      scheduled = true;
      requestAnimationFrame(function () { scheduled = false; apply(); });
    }).observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

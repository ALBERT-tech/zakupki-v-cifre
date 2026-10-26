# -*- coding: utf-8 -*-
"""Вебинары Альберта Гизатуллина серии «ИИ в закупках: одна проблема, три уровня решения».
Из исходника landings/<slug>.html собирает
1) <slug>.html — страница на cifrazakup.ru. Записи и оплаты на сайте нет: все кнопки «Записаться»
   ведут на форму GetCourse, utm-метки захода дописываются в ссылку;
2) landings/gc-<slug>.js — содержимое для страницы GetCourse gc.cifrazakup.ru/<slug> (слаг = utm_campaign).
   На GetCourse ставятся блок «HTML-код» с <div id="<prefix>-root"> (всё до тёмного блока «Запись»),
   родная форма GetCourse с предложением и блок «HTML-код» с <div id="<prefix>-foot"> (подвал).
   Правки исходника попадают на GetCourse сами после пуша (кеш GitHub Pages до 10 минут);
3) landings/gc-<slug>-blocks.html — коды блоков для вставки на GetCourse.
Устроен как tools/build_levina1.py, но один на все вебинары серии: данные страницы берутся из исходника
(<title>, description, og — из WEBINARS ниже). Допущения и вопросы команде — в шапке исходника.

Запуск: python tools/build_webinar.py postavshiki opyt44   (без аргументов — все из WEBINARS)
"""
import io, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WEBINARS = {
    'postavshiki': dict(
        prefix='pst', draft=False,
        og_title='ИИ в закупках: поставщики из реестра контрактов',
        og_desc='Вебинар Альберта Гизатуллина 16 ноября в 18:30 МСК. Три КП за день вместо трёх недель: промпт, скилл, сервис kp.robotender.ru. 1,5 часа, 2 500 ₽.',
    ),
    'opyt44': dict(
        prefix='opt', draft=False,
        og_title='ИИ в закупках: опыт по 44-ФЗ',
        og_desc='Вебинар Альберта Гизатуллина 23 ноября в 18:30 МСК. Какой контракт подтвердит опыт, а какой отклонят: промпт-чеклист, выгрузка из ЕИС, сервис проверки по ИНН. 1,5 часа, 2 500 ₽.',
    ),
}
OG_IMAGE = 'https://cifrazakup.ru/assets/albert.jpg'

CTA_FORM = 'Заполните форму ниже, и мы пришлём ссылку на эфир.'
CTA_SITE = 'Запись и оплата на учебной платформе школы, ссылку на эфир пришлём на почту.'

UTM_JS = '''<script>
/* utm-метки захода дописываются в ссылки на GetCourse — как на главной */
(function(){
  var q=location.search.slice(1).split('&').filter(function(p){return /^utm_/.test(p);});
  if(!q.length) return;
  document.querySelectorAll('a[href^="https://gc.cifrazakup.ru/"]').forEach(function(a){
    var h=a.getAttribute('href'), k=h.indexOf('#'), base=k<0?h:h.slice(0,k), hash=k<0?'':h.slice(k);
    a.setAttribute('href', base+(base.indexOf('?')<0?'?':'&')+q.join('&')+hash);
  });
})();
</script>
'''


def read(p):
    with io.open(p, encoding='utf-8', newline='') as f:
        return f.read()


def write(p, s):
    with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(s)


def between(s, a, b):
    i = s.index(a)
    j = s.index(b, i)
    return s[i:j]


def build(slug):
    cfg = WEBINARS[slug]
    p = cfg['prefix']
    gc_page = 'https://gc.cifrazakup.ru/' + slug
    gc_form = gc_page + '#kel-register'  # якорь-блок на странице GetCourse стоит прямо перед формой
    src = read(os.path.join(ROOT, 'landings', slug + '.html'))

    title = re.search(r'<title>(.*?)</title>', src, re.S).group(1).strip()
    description = re.search(r'<meta name="description" content="(.*?)">', src, re.S).group(1)
    style = between(src, '<style>\n@import', '</style>')[len('<style>\n'):]
    init_js = between(src, '<script>\n(function(){', '</script>')[len('<script>\n'):]
    main_html = between(src, '<!-- ═════════ ✂ БЛОК 1.', '<!-- ═════ Здесь вставьте нативный блок')
    foot_html = between(src, '<!-- ═════════ ✂ ПОДВАЛ', '</body>')
    main_html = re.sub(r'<!--.*?-->\n?', '', main_html, flags=re.S)
    foot_html = re.sub(r'<!--.*?-->\n?', '', foot_html, flags=re.S)
    reg = 'href="#%s-register"' % p
    assert main_html.count(reg) == 4, main_html.count(reg)
    assert main_html.count(CTA_FORM) == 1

    # ---------- 1. страница сайта ----------
    btn = ('\n      <a href="' + gc_form + '" class="%s-btn %s-btn--primary %s-btn--lg" style="margin-top:30px">Записаться и оплатить\n' % (p, p, p) +
           '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>\n'
           '      </a>')
    site_main = main_html.replace(reg, 'href="' + gc_form + '"').replace(CTA_FORM, CTA_SITE)
    i = site_main.index('<div class="%s-microcta">' % p)
    j = site_main.index('</div>', i) + len('</div>')
    site_main = site_main[:j] + btn + site_main[j:]
    site_main = site_main.replace('<a href="#%s-hero" class="%s-brand"' % (p, p), '<a href="index.html" class="%s-brand"' % p)
    site_foot = foot_html.replace(reg, 'href="' + gc_form + '"')
    site_foot = site_foot.replace(
        '<a href="https://cifrazakup.ru" target="_blank" rel="noopener">cifrazakup.ru</a>',
        '<a href="svedeniya.html">Сведения об образовательной организации</a>\n      <a href="index.html">Все курсы и вебинары</a>')

    robots = '<meta name="robots" content="noindex">\n' if cfg['draft'] else ''
    site = ('<!DOCTYPE html>\n<html lang="ru">\n<head>\n<meta charset="UTF-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
            '<title>' + title + '</title>\n'
            '<meta name="description" content="' + description + '">\n' + robots +
            '<meta name="theme-color" content="#14161d">\n'
            '<meta property="og:type" content="website">\n'
            '<meta property="og:title" content="' + cfg['og_title'] + '">\n'
            '<meta property="og:description" content="' + cfg['og_desc'] + '">\n'
            '<meta property="og:image" content="' + OG_IMAGE + '">\n'
            '<meta property="og:locale" content="ru_RU">\n'
            '<link rel="icon" href="favicon.ico" sizes="32x32">\n'
            '<link rel="icon" type="image/svg+xml" href="favicon.svg">\n'
            '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
            '<style>body{margin:0;background:#fff}</style>\n</head>\n<body>\n'
            '<!-- НЕ ПРАВИТЬ РУКАМИ: собирается tools/build_webinar.py ' + slug + ' из landings/' + slug + '.html. Запись и оплата — на GetCourse. -->\n'
            '<style>\n' + style + '</style>\n<script>\n' + init_js + '</script>\n' + site_main + site_foot + UTM_JS + '</body>\n</html>\n')
    write(os.path.join(ROOT, slug + '.html'), site)

    # ---------- 2. GetCourse ----------
    gc_css = style + '\n/* только для GetCourse: блоки страницы — flex-строка */\n#%s-root,#%s-foot{width:100%%}\n' % (p, p)
    bundle = (
        "/* Вебинар Альберта Гизатуллина для " + gc_page + ". НЕ ПРАВИТЬ РУКАМИ:\n"
        "   собирается tools/build_webinar.py " + slug + " из landings/" + slug + ".html. */\n"
        "(function () {\n"
        "  'use strict';\n"
        "  var CSS = " + json.dumps(gc_css, ensure_ascii=False) + ";\n"
        "  var MAIN = " + json.dumps(main_html, ensure_ascii=False) + ";\n"
        "  var FOOT = " + json.dumps(foot_html, ensure_ascii=False) + ";\n"
        "  function widen(el) { var b = el.closest ? el.closest('.lt-block') : null;\n"
        "    if (b) { b.style.minWidth = '0'; b.style.maxWidth = '100%'; b.style.width = '100%'; b.style.flex = '1 1 100%'; } }\n"
        "  function fill(id, html) { var el = document.getElementById(id);\n"
        "    if (!el || el.getAttribute('data-ready')) return !!el;\n"
        "    widen(el); el.innerHTML = html; el.setAttribute('data-ready', '1'); return true; }\n"
        "  var head = document.head || document.getElementsByTagName('head')[0];\n"
        "  if (!document.getElementById('" + p + "-style')) { var st = document.createElement('style'); st.id = '" + p + "-style';\n"
        "    st.textContent = CSS; head.appendChild(st); }\n"
        "  if (!fill('" + p + "-root', MAIN)) return;\n"
        "  function foot() { fill('" + p + "-foot', FOOT); }\n"
        "  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', foot); } else { foot(); }\n"
        + init_js +
        "})();\n"
    )
    write(os.path.join(ROOT, 'landings', 'gc-' + slug + '.js'), bundle)

    blocks = ('<!-- Вебинар Альберта Гизатуллина на GetCourse (' + gc_page + '). Порядок блоков:\n'
              '     1) «HTML-код» — БЛОК А ниже; 2) якорь kel-register; 3) родная форма GetCourse с предложением\n'
              '     (см. вопросы в landings/' + slug + '.html); 4) «HTML-код» — БЛОК Б ниже.\n'
              '     Содержимое подтягивается с cifrazakup.ru. -->\n\n'
              '<!-- ✂ БЛОК А -->\n'
              '<div id="' + p + '-root"><div style="padding:48px 20px;text-align:center;font:16px/1.5 Arial,sans-serif;color:#5c616e">Загружаем страницу… '
              'Если она не появилась, откройте <a href="https://cifrazakup.ru/' + slug + '.html" style="color:#0e8a52">cifrazakup.ru/' + slug + '.html</a>.</div></div>\n'
              '<script src="https://cifrazakup.ru/landings/gc-' + slug + '.js"></script>\n\n'
              '<!-- ✂ БЛОК Б -->\n'
              '<div id="' + p + '-foot"></div>\n')
    write(os.path.join(ROOT, 'landings', 'gc-' + slug + '-blocks.html'), blocks)
    print('ok: %s.html %d, gc-%s.js %d' % (slug, len(site), slug, len(bundle)))


if __name__ == '__main__':
    for s in (sys.argv[1:] or list(WEBINARS)):
        build(s)

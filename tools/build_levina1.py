# -*- coding: utf-8 -*-
"""ЧЕРНОВИК. Вебинар Ильяны Левиной «Новая модель бизнеса в эпоху ИИ» (10.11.2026): из одного исходника
landings/levina1.html собирает
1) levina1.html — страница на cifrazakup.ru. Записи и оплаты на сайте нет: все кнопки «Записаться»
   ведут на форму GetCourse (GC_FORM), utm-метки захода дописываются в ссылку;
2) landings/gc-levina1.js — содержимое для страницы GetCourse (GC_PAGE; слаг задаёт Михаил). На GetCourse ставятся
   блок «HTML-код» с <div id="lev-root"> (всё до тёмного блока «Запись»), родная форма GetCourse с предложением
   на 3 000 ₽ и блок «HTML-код» с <div id="lev-foot"> (подвал). Правки исходника попадают на GetCourse
   сами после пуша (кеш GitHub Pages до 10 минут). Коды блоков — landings/gc-levina1-blocks.html.
Допущения и вопросы команде — в шапке landings/levina1.html. Устроен как tools/build_mukhina.py.

Запуск: python tools/build_levina1.py
"""
import io, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'landings', 'levina1.html')
GC_PAGE = 'https://gc.cifrazakup.ru/levina1'  # правило: адрес = utm_campaign из таблицы (levina1)
GC_FORM = GC_PAGE + '#kel-register'  # якорь-блок на странице GetCourse стоит прямо перед формой


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


src = read(SRC)
style = between(src, '<style>\n@import', '</style>')[len('<style>\n'):]
init_js = between(src, '<script>\n(function(){', '</script>')[len('<script>\n'):]
main_html = between(src, '<!-- ═════════ ✂ БЛОК 1.', '<!-- ═════ Здесь вставьте нативный блок')
foot_html = between(src, '<!-- ═════════ ✂ БЛОК 9.', '</body>')
main_html = re.sub(r'<!--.*?-->\n?', '', main_html, flags=re.S)
foot_html = re.sub(r'<!--.*?-->\n?', '', foot_html, flags=re.S)
assert main_html.count('href="#lev-register"') == 4, main_html.count('href="#lev-register"')

# ---------- 1. страница сайта ----------
CTA_OLD = '<span><b>Начало в 10:00 по Москве, 3 000 ₽.</b> Заполните форму ниже, и мы пришлём ссылку на эфир.</span>'
CTA_NEW = ('<span><b>Начало в 10:00 по Москве, 3 000 ₽.</b> Запись и оплата — на учебной платформе школы, '
           'ссылку на эфир пришлём на почту.</span>')
BTN = ('\n      <a href="' + GC_FORM + '" class="lev-btn lev-btn--primary lev-btn--lg" style="margin-top:30px">Записаться и оплатить\n'
       '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>\n'
       '      </a>')
site_main = main_html.replace('href="#lev-register"', 'href="' + GC_FORM + '"')
assert CTA_OLD in site_main
site_main = site_main.replace(CTA_OLD, CTA_NEW)
i = site_main.index('<div class="lev-microcta">')
j = site_main.index('</div>', i) + len('</div>')
site_main = site_main[:j] + BTN + site_main[j:]
site_main = site_main.replace('<a href="#lev-hero" class="lev-brand"', '<a href="index.html" class="lev-brand"')
site_foot = foot_html.replace('href="#lev-register"', 'href="' + GC_FORM + '"')
site_foot = site_foot.replace(
    '<a href="https://cifrazakup.ru" target="_blank" rel="noopener">cifrazakup.ru</a>',
    '<a href="svedeniya.html">Сведения об образовательной организации</a>\n      <a href="index.html">Все курсы и вебинары</a>')

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

site = '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Новая модель бизнеса в эпоху ИИ: как масштабировать себя, а не штат — вебинар Ильяны Левиной · Закупки в цифре</title>
<meta name="description" content="Вебинар для предпринимателей и экспертов 10 ноября 2026 в 10:00 МСК: как расти без пропорционального роста штата, перестать быть бутылочным горлышком своего бизнеса и собрать личную AI-архитектуру на 2027 год. 1,5 часа, 3 000 ₽, запись на 90 дней. Спикер — Ильяна Левина.">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#14161d">
<meta property="og:type" content="website">
<meta property="og:title" content="Новая модель бизнеса в эпоху ИИ: как масштабировать себя, а не штат">
<meta property="og:description" content="Вебинар Ильяны Левиной 10 ноября в 10:00 МСК. Деньги, время, статус, будущее: личная AI-архитектура на 2027 год. 1,5 часа, 3 000 ₽.">
<meta property="og:image" content="https://cifrazakup.ru/assets/levina.jpg">
<meta property="og:locale" content="ru_RU">
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>body{margin:0;background:#fff}</style>
</head>
<body>
<!-- ЧЕРНОВИК, не публиковать до согласования (meta robots noindex снять при публикации). НЕ ПРАВИТЬ РУКАМИ: собирается tools/build_levina1.py из landings/levina1.html. Запись и оплата — на GetCourse. -->
<style>
''' + style + '''</style>
<script>
''' + init_js + '''</script>
''' + site_main + site_foot + UTM_JS + '''</body>
</html>
'''
write(os.path.join(ROOT, 'levina1.html'), site)

# ---------- 2. GetCourse ----------
gc_css = style + '\n/* только для GetCourse: блоки страницы — flex-строка */\n#lev-root,#lev-foot{width:100%}\n'
bundle = (
    "/* Вебинар Ильяны Левиной для " + GC_PAGE + ". НЕ ПРАВИТЬ РУКАМИ:\n"
    "   собирается tools/build_levina1.py из landings/levina1.html. */\n"
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
    "  if (!document.getElementById('lev-style')) { var st = document.createElement('style'); st.id = 'lev-style';\n"
    "    st.textContent = CSS; head.appendChild(st); }\n"
    "  if (!fill('lev-root', MAIN)) return;\n"
    "  function foot() { fill('lev-foot', FOOT); }\n"
    "  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', foot); } else { foot(); }\n"
    + init_js +
    "})();\n"
)
write(os.path.join(ROOT, 'landings', 'gc-levina1.js'), bundle)

blocks = '''<!-- Вебинар Ильяны Левиной на GetCourse (''' + GC_PAGE + '''). Порядок блоков:
     1) «HTML-код» — БЛОК А ниже; 2) якорь kel-register; 3) родная форма GetCourse с предложением
     на 3 000 ₽ (ещё не заведено, см. вопросы в landings/levina1.html); 4) «HTML-код» — БЛОК Б ниже.
     Содержимое подтягивается с cifrazakup.ru. -->

<!-- ✂ БЛОК А -->
<div id="lev-root"><div style="padding:48px 20px;text-align:center;font:16px/1.5 Arial,sans-serif;color:#5c616e">Загружаем страницу… Если она не появилась, откройте <a href="https://cifrazakup.ru/levina1.html" style="color:#0e8a52">cifrazakup.ru/levina1.html</a>.</div></div>
<script src="https://cifrazakup.ru/landings/gc-levina1.js"></script>

<!-- ✂ БЛОК Б -->
<div id="lev-foot"></div>
'''
write(os.path.join(ROOT, 'landings', 'gc-levina1-blocks.html'), blocks)
print('ok: levina1.html %d, gc-levina1.js %d' % (len(site), len(bundle)))

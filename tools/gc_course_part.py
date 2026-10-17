# -*- coding: utf-8 -*-
"""Часть сборки: gc-course-ai.js — страница курса «Искусственный интеллект в закупках» (course-ai.html)
одним скриптом для страницы GetCourse gc.cifrazakup.ru/course_ai.
Вызывается из build_main_getcourse.py после gc_embed_part.py (exec в общем пространстве имён:
ROOT, css_all, form_js, api_line уже определены).

На GetCourse ставится ОДИН блок «HTML-код» из landings/gc-course-ai-block.html; он подтягивает gc-course-ai.js
с cifrazakup.ru, поэтому правки course-ai.html появляются на GetCourse сами после пересборки и пуша.
Оплаты на странице нет: форма заявки уходит на наш бэкенд (как на сайте), кнопки программы ведут на страницу
GetCourse /course_ai_program (полный текст программы, tools/build_gc_program.py), PDF скачивается оттуда."""
import io, os, re, json

course = io.open(os.path.join(ROOT, 'course-ai.html'), encoding='utf-8').read()


def course_section(start_marker, end_marker):
    a = course.index(start_marker); b = course.index(end_marker, a)
    return course[a:b]


GC = 'https://gc.cifrazakup.ru/'
SITE_URL = 'https://cifrazakup.ru/'


def gc_links(html):
    """Ссылки страницы курса → адреса для GetCourse. Якоря #… внутри страницы не трогаем."""
    html = re.sub(r'(src|href)="((?:assets|documents)/[^"]+)"', lambda m: '%s="%s%s"' % (m.group(1), SITE_URL, m.group(2)), html)
    html = html.replace('href="index.html#schedule"', 'href="%smain#schedule"' % GC)
    html = html.replace('href="index.html"', 'href="%smain"' % GC)
    html = html.replace('href="privacy.html"', 'href="%sprivacypolicy"' % GC)
    html = html.replace('href="oferta.html"', 'href="%soferta"' % GC)
    html = html.replace('href="svedeniya.html"', 'href="%ssvedeniya.html"' % SITE_URL)
    left = re.findall(r'(?:src|href)="(?!https?:|mailto:|tel:|#)([^"]+)"', html)
    assert not left, left
    # программа на GetCourse — своя страница с полным текстом (tools/build_gc_program.py), PDF скачивается оттуда
    pdf = 'href="%sdocuments/01-programma-ii-v-zakupkah.pdf"' % SITE_URL
    assert html.count(pdf) == 5, html.count(pdf)
    html = html.replace(pdf, 'href="%scourse_ai_program"' % GC)
    for old, new in (('Программа курса (PDF)', 'Программа курса'), ('Открыть программу (PDF)', 'Открыть программу'),
                     ('Программа (PDF)', 'Полная программа'), ('PDF, 3 страницы · ', '')):
        assert old in html, old
        html = html.replace(old, new)
    assert 'PDF' not in re.sub(r'<[^>]+>', '', html), 'на странице курса GetCourse остался текст PDF'
    return html


header_c = course_section('<!-- ===== Header', '<div class="mobile-menu"')
header_c = header_c.replace('<header class="header" id="header">', '<header class="header cz-top">')
header_c = re.sub(r'\s*<button class="burger".*?</button>', '', header_c, flags=re.S)
assert 'cz-top' in header_c and 'burger' not in header_c
body_c = course_section('<!-- ===== Hero', '<!-- ===== Footer')
footer_c = course_section('<!-- ===== Footer', '<script src="script.js')
page_c = '<div class="cz">' + gc_links(header_c + body_c + footer_c) + '</div>'
assert 'id="leadForm"' in page_c and 'id="program"' in page_c and page_c.count(GC + 'course_ai_program') == 5
assert 'Златоуст' not in page_c and 'кв. 196' not in page_c

css_course = css_all + (
    "\n/* страница курса на GetCourse: кнопка «Полная программа» в шапке видна до 560px, ниже она есть в первом экране */\n"
    "@media(max-width:560px){.cz .cz-top .nav__cta .btn--ghost{display:none}}\n"
)

bundle_c = (
    "/* Страница курса «Искусственный интеллект в закупках» для GetCourse (gc.cifrazakup.ru/course_ai). НЕ ПРАВИТЬ РУКАМИ:\n"
    "   собирается tools/build_main_getcourse.py (часть gc_course_part.py) из course-ai.html, styles.css, script.js.\n"
    "   Оплаты нет: заявка уходит на бэкенд школы, программа — страница gc.cifrazakup.ru/course_ai_program. */\n"
    "(function () {\n"
    "  'use strict';\n"
    "  var root = document.getElementById('cz-course');\n"
    "  if (!root || root.getAttribute('data-ready')) return;\n"
    "  /* страница GetCourse — flex-строка: без этого блок не сжимается уже самой длинной строки и появляется горизонтальная прокрутка */\n"
    "  var blk = root.closest ? root.closest('.lt-block') : null;\n"
    "  if (blk) { blk.style.minWidth = '0'; blk.style.maxWidth = '100%'; blk.style.width = '100%'; blk.style.flex = '1 1 100%'; }\n"
    "  var head = document.head || document.getElementsByTagName('head')[0];\n"
    "  if (!document.getElementById('cz-font')) { var l = document.createElement('link'); l.id = 'cz-font'; l.rel = 'stylesheet';\n"
    "    l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap'; head.appendChild(l); }\n"
    "  if (!document.getElementById('cz-style')) { var st = document.createElement('style'); st.id = 'cz-style'; st.textContent = "
    + json.dumps(css_course, ensure_ascii=False) + "; head.appendChild(st); }\n"
    "  root.innerHTML = " + json.dumps(page_c, ensure_ascii=False) + ";\n"
    "  root.setAttribute('data-ready', '1');\n"
    "  /* ---- форма заявки (из script.js) ---- */\n"
    "  (function () {\n    " + api_line + "\n" + form_js + "  })();\n"
    "  /* ---- чат-ассистент ---- */\n"
    "  if (!window.__czChat) { window.__czChat = 1; var c = document.createElement('script'); c.src = 'https://cifrazakup.ru/chatbot.js'; c.defer = true; document.body.appendChild(c); }\n"
    "})();\n"
)
io.open(os.path.join(ROOT, 'landings', 'gc-course-ai.js'), 'w', encoding='utf-8', newline='\n').write(bundle_c)

block_c = ('<!-- Курс «Искусственный интеллект в закупках» для GetCourse: ОДИН блок «HTML-код» на странице /course_ai. Содержимое подтягивается с cifrazakup.ru. -->\n'
           '<div id="cz-course"><div style="padding:48px 20px;text-align:center;font:16px/1.5 Arial,sans-serif;color:#5c616e">'
           'Загружаем страницу курса… Если она не появилась, откройте '
           '<a href="https://cifrazakup.ru/course-ai.html" style="color:#0e8a52">cifrazakup.ru/course-ai.html</a> или '
           '<a href="https://cifrazakup.ru/documents/01-programma-ii-v-zakupkah.pdf" style="color:#0e8a52">программу курса (PDF)</a>.</div></div>\n'
           '<script src="https://cifrazakup.ru/landings/gc-course-ai.js"></script>\n')
io.open(os.path.join(ROOT, 'landings', 'gc-course-ai-block.html'), 'w', encoding='utf-8', newline='\n').write(block_c)
print('gc-course-ai.js', len(bundle_c.encode('utf-8')), 'bytes; block snippet', len(block_c), 'chars')

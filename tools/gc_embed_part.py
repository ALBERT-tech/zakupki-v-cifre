# -*- coding: utf-8 -*-
"""Часть сборки: gc-main.js — вся главная cifrazakup.ru одним скриптом для страницы gc.cifrazakup.ru/main.
Вызывается из build_main_getcourse.py (exec в его пространстве имён: index, js, scoped, extra, section, absolutize,
hero, sched, experts, about, ROOT уже определены).

На GetCourse ставится ОДИН блок «HTML-код» из landings/gc-main-block.html; он подтягивает gc-main.js с cifrazakup.ru,
поэтому правки главной появляются на GetCourse сами (кеш GitHub Pages — до 10 минут).
Записи и оплаты на сайте не происходят: кнопки событий ведут на лендинги GetCourse (ссылки из Google-таблицы)."""
import io, os, re, json

nav_links = section('<div class="nav__links">', '</div>\n      <div class="nav__cta">')
header_lite = ('<header class="header cz-top"><div class="wrap"><nav class="nav">'
               '<a href="https://cifrazakup.ru/" class="brand" aria-label="Закупки в цифре"><span class="brand__mark"><span>З<sup>цф</sup></span></span>'
               '<span class="brand__txt"><span class="brand__name logo-formula">Закупки<sup>в цифре</sup></span><span class="brand__sub">Онлайн-школа</span></span></a>'
               + nav_links + '</div><div class="nav__cta">'
               '<a href="https://gc.cifrazakup.ru/cms/system/login" class="btn btn--ghost">Войти</a>'
               '<a href="#schedule" class="btn btn--primary" id="navCta">Расписание</a></div></nav></div></header>')
trust = section('<!-- ===== Trust', '<!-- ===== Schedule')
register = section('<!-- ===== Register', '<!-- ===== Footer')
footer = section('<!-- ===== Footer', '<script src="script.js')
page_html = '<div class="cz">' + ''.join(absolutize(x) for x in (header_lite, hero, trust, sched, experts, about, register, footer)) + '</div>'
assert 'id="leadForm"' in page_html and 'id="feed"' in page_html and 'id="nextCard"' in page_html

js_embed = js.replace("var AI_COURSE_PAGE = 'course-ai.html';", "var AI_COURSE_PAGE = 'https://cifrazakup.ru/course-ai.html';")
js_embed = js_embed.replace("document.querySelector('.hero')", "document.querySelector('.cz .hero')")
assert "cifrazakup.ru/course-ai.html" in js_embed

site_js = io.open(os.path.join(ROOT, 'script.js'), encoding='utf-8').read()
a = site_js.index('  // Lead form'); b = site_js.index('  // Аккордеон')
form_js = site_js[a:b]
api_line = re.search(r"var API_BASE = '[^']+';", site_js).group(0)

extra_embed = (
    "\n/* только для встраивания на GetCourse */\n"
    ".cz .header.cz-top{position:relative;background:var(--ink);border-bottom:1px solid var(--line-dark)}\n"
    ".cz .cz-top .nav__cta .btn--ghost{display:inline-flex}\n"
    "@media(max-width:560px){.cz .cz-top .nav__cta .btn--ghost{padding:9px 14px}}\n"
)
css_all = scoped + extra + extra_embed

bundle = (
    "/* Главная cifrazakup.ru для GetCourse (gc.cifrazakup.ru/main). НЕ ПРАВИТЬ РУКАМИ:\n"
    "   собирается tools/build_main_getcourse.py из index.html, styles.css, schedule.js, script.js. */\n"
    "(function () {\n"
    "  'use strict';\n"
    "  var root = document.getElementById('cz-root');\n"
    "  if (!root || root.getAttribute('data-ready')) return;\n"
    "  /* страница GetCourse — flex-строка: без этого блок не сжимается уже самой длинной строки и появляется горизонтальная прокрутка */\n"
    "  var blk = root.closest ? root.closest('.lt-block') : null;\n"
    "  if (blk) { blk.style.minWidth = '0'; blk.style.maxWidth = '100%'; blk.style.width = '100%'; blk.style.flex = '1 1 100%'; }\n"
    "  var head = document.head || document.getElementsByTagName('head')[0];\n"
    "  if (!document.getElementById('cz-font')) { var l = document.createElement('link'); l.id = 'cz-font'; l.rel = 'stylesheet';\n"
    "    l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap'; head.appendChild(l); }\n"
    "  if (!document.getElementById('cz-style')) { var st = document.createElement('style'); st.id = 'cz-style'; st.textContent = "
    + json.dumps(css_all, ensure_ascii=False) + "; head.appendChild(st); }\n"
    "  root.innerHTML = " + json.dumps(page_html, ensure_ascii=False) + ";\n"
    "  root.setAttribute('data-ready', '1');\n"
    "  /* ---- расписание (schedule.js) ---- */\n" + js_embed + "\n"
    "  /* ---- форма заявки (из script.js) ---- */\n"
    "  (function () {\n    " + api_line + "\n" + form_js + "  })();\n"
    "  /* ---- чат-ассистент ---- */\n"
    "  if (!window.__czChat) { window.__czChat = 1; var c = document.createElement('script'); c.src = 'https://cifrazakup.ru/chatbot.js'; c.defer = true; document.body.appendChild(c); }\n"
    "})();\n"
)
io.open(os.path.join(ROOT, 'landings', 'gc-main.js'), 'w', encoding='utf-8', newline='\n').write(bundle)

block = ('<!-- Главная школы для GetCourse: ОДИН блок «HTML-код» на странице /main. Содержимое подтягивается с cifrazakup.ru. -->\n'
         '<div id="cz-root"><div style="padding:48px 20px;text-align:center;font:16px/1.5 Arial,sans-serif;color:#5c616e">'
         'Загружаем страницу школы… Если она не появилась, откройте <a href="https://cifrazakup.ru/" style="color:#0e8a52">cifrazakup.ru</a>.</div></div>\n'
         '<script src="https://cifrazakup.ru/landings/gc-main.js"></script>\n')
io.open(os.path.join(ROOT, 'landings', 'gc-main-block.html'), 'w', encoding='utf-8', newline='\n').write(block)
print('gc-main.js', len(bundle.encode('utf-8')), 'bytes; block snippet', len(block), 'chars')

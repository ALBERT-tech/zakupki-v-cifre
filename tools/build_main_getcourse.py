# -*- coding: utf-8 -*-
"""Собирает landings/main-getcourse.html — главную школы в блочной разметке для GetCourse (для Михаила).
Источники: index.html (секции), styles.css (стили, обёрнутые в .cz), schedule.js (скрипт расписания).
Запуск из корня репозитория: python tools/build_main_getcourse.py
Правила: UTF-8 с BOM, первая строка <meta charset>, блоки с маркерами ✂, все пути абсолютные (https://cifrazakup.ru/…)."""
import io, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://cifrazakup.ru/'
OUT = os.path.join(ROOT, 'landings', 'main-getcourse.html')

index = io.open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
css = io.open(os.path.join(ROOT, 'styles.css'), encoding='utf-8').read()
js = io.open(os.path.join(ROOT, 'schedule.js'), encoding='utf-8').read()


def section(start_marker, end_marker):
    a = index.index(start_marker); b = index.index(end_marker, a)
    return index[a:b]


def absolutize(html):
    html = re.sub(r'(src|href)="(assets/[^"]+)"', lambda m: '%s="%s%s"' % (m.group(1), SITE, m.group(2)), html)
    html = re.sub(r'href="(course-ai\.html|privacy\.html|oferta\.html|svedeniya\.html)"', lambda m: 'href="%s%s"' % (SITE, m.group(1)), html)
    html = html.replace('href="#register"', 'href="%s#register"' % SITE)
    return html


# ---------- CSS: обернуть каждый селектор в .cz ----------
def scope_css(text):
    text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    out = []
    i = 0
    n = len(text)

    def rewrite_selector(sel):
        sel = sel.strip()
        if not sel:
            return sel
        if sel.startswith(':root'):
            return '.cz' + sel[5:]
        if sel in ('html', 'body'):
            return '.cz'
        if sel.startswith('body.') or sel.startswith('body '):
            return '.cz' + sel[4:]
        if sel.startswith('*') or sel.startswith('::selection'):
            return '.cz ' + sel
        return '.cz ' + sel

    def parse(block, depth):
        res = []
        j = 0
        while j < len(block):
            k = block.find('{', j)
            if k < 0:
                res.append(block[j:]); break
            head = block[j:k].strip()
            # найти парную }
            d = 1; m = k + 1
            while m < len(block) and d:
                if block[m] == '{': d += 1
                elif block[m] == '}': d -= 1
                m += 1
            body = block[k + 1:m - 1]
            if head.startswith('@media') or head.startswith('@supports'):
                res.append(head + '{' + parse(body, depth + 1) + '}')
            elif head.startswith('@keyframes') or head.startswith('@font-face') or head.startswith('@'):
                res.append(head + '{' + body + '}')
            else:
                sels = ','.join(rewrite_selector(s) for s in head.split(','))
                res.append(sels + '{' + body + '}')
            j = m
        return ''.join(res)

    return parse(text, 0)


scoped = scope_css(css)
extra = '''
/* поправки под страницу GetCourse: нет нашей фиксированной шапки */
.cz{font-family:var(--ff);color:var(--text);line-height:1.6;font-size:17px;-webkit-font-smoothing:antialiased}
.cz .hero{padding-top:64px}
.cz .today{margin:0 0 32px}
.cz .hero__actions .btn--ghost{color:#fff;border-color:rgba(255,255,255,.28)}
.cz .section{padding:80px 0}
.cz img{max-width:100%}
/* анимация появления на сайте включается script.js; здесь его нет — показываем сразу */
.cz .reveal{opacity:1;transform:none;transition:none}
'''

hero = section('<!-- ===== Hero', '<!-- ===== Trust')
hero = hero.replace('<a href="course-ai.html" class="btn btn--ghost btn--lg" style="color:#fff;border-color:rgba(255,255,255,.25)">Главный курс: ИИ в закупках</a>',
                    '<a href="https://cifrazakup.ru/course-ai.html" class="btn btn--ghost btn--lg">Главный курс: ИИ в закупках</a><a href="https://gc.cifrazakup.ru/cms/system/login" class="btn btn--ghost btn--lg">Войти в кабинет</a>')
sched = section('<span id="catalog"></span>', '<!-- ===== Experts')
experts = section('<!-- ===== Experts', '<!-- ===== About')
about = section('<span id="how"></span>', '<!-- ===== Register')
footer_partner = '''<div class="cz-partner wrap">
  <div class="footer__partner"><span class="footer__partner-lbl">Партнёр школы</span><span class="sber"><img src="https://cifrazakup.ru/assets/sber-a-logo.svg" alt="Сбер А"></span></div>
  <p class="footer__req">ИП Герасимова Регина Гарифьяновна · ИНН 740416503778 · ОГРНИП 325745600086173 · г. Уфа · <a href="https://cifrazakup.ru/oferta.html">Договор-оферта</a> · <a href="https://cifrazakup.ru/privacy.html">Политика ПДн</a> · <a href="https://cifrazakup.ru/svedeniya.html">Сведения об образовательной организации</a></p>
</div>'''

# ---------- JS: адреса под GetCourse ----------
js_gc = js.replace("var AI_COURSE_PAGE = 'course-ai.html';", "var AI_COURSE_PAGE = 'https://cifrazakup.ru/course-ai.html';")
js_gc = js_gc.replace("'#register'", "'https://cifrazakup.ru/#register'")
js_gc = js_gc.replace("document.querySelector('.hero')", "document.querySelector('.cz .hero')")
js_gc = js_gc.replace("it.href.indexOf('#register') === 0", "it.href.indexOf('https://cifrazakup.ru/#register') === 0")
assert "cifrazakup.ru/#register" in js_gc and ".cz .hero" in js_gc

blocks = []
blocks.append(('БЛОК 1 · Стили и шрифт (ставить первым на странице)',
               '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n<style>\n' + scoped + extra + '\n</style>'))
blocks.append(('БЛОК 2 · Полоса «Сегодня» и ближайшее событие', '<div class="cz">\n' + absolutize(hero) + '</div>'))
blocks.append(('БЛОК 3 · Расписание карточками', '<div class="cz">\n' + absolutize(sched) + '</div>'))
blocks.append(('БЛОК 4 · Эксперты', '<div class="cz">\n' + absolutize(experts) + '</div>'))
blocks.append(('БЛОК 5 · Как проходит обучение и вопросы', '<div class="cz">\n' + absolutize(about) + '</div>'))
blocks.append(('БЛОК 6 · Партнёр и реквизиты', '<div class="cz" style="background:#0e1015;padding:36px 0">\n' + footer_partner + '\n</div>'))
blocks.append(('БЛОК 7 · Скрипт расписания (ставить последним)', '<script>\n' + js_gc + '\n</script>'))

head = '''<meta charset="utf-8">
<!--
  Главная школы «Закупки в цифре» для GetCourse (gc.cifrazakup.ru). Собрано автоматически из cifrazakup.ru: tools/build_main_getcourse.py.
  Как размещать: на странице GetCourse добавить блоки «HTML-код» и вставить содержимое каждого блока между маркерами ✂ в отдельный блок,
  в том же порядке. Блок 1 (стили) — первым, блок 7 (скрипт) — последним. Шапку и подвал GetCourse не трогаем.
  Данные расписания читаются из Google-таблицы «Расписание ЦифраЗакуп» (вкладка «Расписание для сайта») при открытии страницы.
  Фото и логотип берутся с cifrazakup.ru/assets/, ссылки на оферту и политику — на cifrazakup.ru.
  Если GetCourse вырежет <script> из блока 7, используйте блок «JavaScript» или «Код в конце body» в настройках страницы.
-->
'''
parts = [head]
for i, (title, body) in enumerate(blocks, 1):
    parts.append('\n\n<!-- ✂ ======================== %s ======================== ✂ -->\n' % title)
    parts.append(body)
parts.append('\n\n<!-- ✂ ======================== КОНЕЦ ======================== ✂ -->\n')
data = ''.join(parts)
io.open(OUT, 'w', encoding='utf-8-sig', newline='\n').write(data)
print('written', OUT, len(data.encode('utf-8')), 'bytes;', 'blocks', len(blocks))

# встраиваемая версия главной (один блок на GetCourse)
exec(io.open(os.path.join(ROOT, 'tools', 'gc_embed_part.py'), encoding='utf-8').read())

# страница курса «Искусственный интеллект в закупках» (один блок на GetCourse, без оплаты)
exec(io.open(os.path.join(ROOT, 'tools', 'gc_course_part.py'), encoding='utf-8').read())

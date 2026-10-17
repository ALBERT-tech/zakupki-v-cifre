# -*- coding: utf-8 -*-
"""Собирает landings/gc-program-ai-block.html — полный текст утверждённой программы
«Искусственный интеллект в закупках» для страницы GetCourse gc.cifrazakup.ru/course_ai_program.
Источник истины — documents/01-programma-ii-v-zakupkah.pdf (приказ № 1 от 21.09.2026). Текст ниже перенесён из PDF
дословно; при сборке скрипт сверяет набор слов страницы с текстом PDF (PyMuPDF) и падает при расхождении.
Текст вставляется статично (документ должен читаться без скриптов). Если программа изменится — поправить PDF и текст здесь,
пересобрать (python tools/build_gc_program.py) и заменить код блока на GetCourse."""
import io, os, re, html
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_REL = "documents/01-programma-ii-v-zakupkah.pdf"
PDF_URL = "https://cifrazakup.ru/" + PDF_REL
COURSE_URL = "https://gc.cifrazakup.ru/course_ai"
E = html.escape

ORG = ("Индивидуальный предприниматель Герасимова Регина Гарифьяновна",
       "ИНН 740416503778, ОГРНИП 325745600086173, адрес: 450092, Республика Башкортостан, г. Уфа, ул. Авроры, д. 29")
APPROVED = ("УТВЕРЖДЕНО", "приказом ИП Герасимова Р.Г.", "№ 1 от «21» сентября 2026 г.")
KIND = "ДОПОЛНИТЕЛЬНАЯ ОБЩЕРАЗВИВАЮЩАЯ ПРОГРАММА"
TITLE = "«Искусственный интеллект в закупках»"
PASSPORT = [
    "Направленность: социально-гуманитарная",
    "Категория слушателей: взрослые (18+)",
    "Объём: 20 академических часов. Срок освоения: 10 недель",
    "Форма обучения: заочная, с применением исключительно электронного обучения и дистанционных образовательных технологий",
]
S1 = [
    "Программа адресована специалистам по закупкам, поставщикам и руководителям, которые хотят применять инструменты искусственного интеллекта в закупочной деятельности. Актуальность обусловлена быстрым распространением ИИ-инструментов и их доказанной эффективностью в рутинных операциях закупочного цикла: поиске закупок, анализе документации, подготовке заявок и сопровождении исполнения контрактов.",
    "Цель программы — сформировать у слушателей практические навыки применения инструментов искусственного интеллекта на всех этапах участия в закупках.",
    "Задачи: познакомить с возможностями и ограничениями современных ИИ-инструментов; отработать применение ИИ для поиска и анализа закупок; научить готовить документы заявки и деловую переписку с поддержкой ИИ; показать способы автоматизации рутинных операций.",
    "Обучение ведётся полностью дистанционно через электронную информационно-образовательную среду (ЭИОС) на платформе GetCourse: вебинары в режиме реального времени, записи занятий, практические задания, тестирование.",
]
S2_KNOW = [
    "устройство закупочного цикла по 44-ФЗ, 223-ФЗ и в коммерческих закупках в объёме, необходимом для применения ИИ-инструментов;",
    "возможности, ограничения и риски применения больших языковых моделей в работе с закупочной документацией;",
    "требования к обращению с конфиденциальными данными при работе с ИИ-сервисами.",
]
S2_CAN = [
    "настраивать поиск и мониторинг закупок и приоритизировать их с помощью ИИ;",
    "проводить экспресс-анализ документации закупки и выявлять риски с помощью ИИ;",
    "готовить проекты документов заявки и деловой переписки с поддержкой ИИ и проверять их корректность;",
    "автоматизировать рутинные операции закупочной деятельности без навыков программирования.",
]
TOPICS = [
    ("Рынок закупок и место ИИ: обзор 44-ФЗ, 223-ФЗ и коммерческих закупок", "практическое задание",
     "Роль закупок в экономике, различия 44-ФЗ, 223-ФЗ и коммерческих закупок. Возможности и границы применения ИИ на каждом этапе закупочного цикла."),
    ("Основы работы с нейросетями: модели, промптинг, ограничения и риски", "практическое задание",
     "Как устроены большие языковые модели. Приёмы постановки задач (промптинг), проверка результатов, конфиденциальность данных и типовые ошибки доверия ИИ."),
    ("Поиск и мониторинг закупок с помощью ИИ: агрегаторы, автопоиски", "практическое задание",
     "Настройка поиска и мониторинга закупок в агрегаторах, использование ИИ для фильтрации и приоритизации найденных закупок под профиль компании."),
    ("Экспресс-анализ документации закупки с ИИ: ТЗ, проект контракта, риски", "практическое задание",
     "Быстрый разбор технического задания и проекта контракта с помощью ИИ: обязательные требования, документы на товар, риски и штрафные санкции."),
    ("Анализ рынка и цен с ИИ: НМЦК, конкуренты, история закупок", "практическое задание",
     "Оценка ёмкости рынка и цен: анализ истории закупок, расчёт целесообразности участия, подготовка ценового предложения с поддержкой ИИ."),
    ("Подготовка заявки с помощью ИИ: формы, первые части, типовые ошибки", "практическое задание",
     "Формирование заявки: соответствие формам, подготовка первых частей, проверка комплектности с ИИ, типовые причины отклонения заявок."),
    ("Деловая переписка и защита интересов: запросы разъяснений, жалобы", "практическое задание",
     "Запросы разъяснений, ответы заказчику, жалобы: структура документов, тональность, подготовка проектов документов с ИИ."),
    ("Автоматизация рутины: таблицы, отчёты, ИИ-агенты без программирования", "практическое задание",
     "Автоматизация повторяющихся операций: работа с таблицами, сводные отчёты, простые ИИ-сценарии без навыков программирования."),
    ("ИИ на этапе исполнения контракта: документы, акты, претензионная работа", "практическое задание",
     "Документооборот исполнения контракта: акты, счета, переписка, претензионная работа с использованием ИИ-инструментов."),
    ("Личная система работы с ИИ в закупках. Итоговая аттестация", "итоговое тестирование",
     "Сборка индивидуальной системы работы с ИИ под задачи слушателя. Итоговое тестирование."),
]
S4 = "Продолжительность обучения — 10 недель (один поток). Режим занятий: один вебинар в неделю продолжительностью 2 академических часа. Начало обучения — по мере комплектования группы (потока). Итоговая аттестация проводится на заключительном занятии."
S6 = [
    "Текущий контроль — выполнение практических заданий к темам 1–9 в ЭИОС. Итоговая аттестация — итоговое тестирование в ЭИОС (20 вопросов); аттестация считается пройденной при 70% и более правильных ответов. Слушателю, успешно прошедшему итоговую аттестацию, выдаётся сертификат о прохождении обучения, не являющийся документом об образовании и (или) о квалификации.",
    "Примеры вопросов итогового тестирования: какие данные нельзя передавать в публичные ИИ-сервисы при работе с закупочной документацией; какие элементы технического задания следует проверить вручную после анализа с помощью ИИ; чем отличается запрос разъяснений от жалобы.",
]
S7 = "Реализация программы обеспечивается ЭИОС на платформе GetCourse: личные кабинеты слушателей, доступ к материалам и записям занятий из любой точки, фиксация хода обучения и результатов аттестации. Занятия проводят преподаватели, имеющие профильное образование и практический опыт в сфере закупок и применения ИИ-инструментов. Техническая поддержка слушателей осуществляется в течение всего срока обучения."
S8 = [
    "Федеральный закон от 05.04.2013 № 44-ФЗ «О контрактной системе в сфере закупок»;",
    "Федеральный закон от 18.07.2011 № 223-ФЗ «О закупках товаров, работ, услуг отдельными видами юридических лиц»;",
    "методические материалы и практические руководства по работе с ИИ-инструментами, разработанные преподавателями программы;",
    "записи вебинаров, шаблоны промптов и рабочие тетради в ЭИОС.",
]
SIGN = ("Индивидуальный предприниматель", "/ Р.Г. Герасимова /")

STYLE = """<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* страница GetCourse — flex-строка: блок должен сжиматься до ширины экрана, иначе таблица распирает страницу */
.lt-block:has(.czprog){min-width:0;max-width:100%;flex:1 1 100%}
.czprog{--ink:#14161d;--text:#1a1d26;--muted:#5c616e;--line:#e4e6e0;--accent:#0e8a52;--soft:#f1f8f4;max-width:min(860px,100vw);margin:0 auto;padding:40px 20px 64px;font-family:"Manrope",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--text);background:#fff;color-scheme:light;font-size:16px;line-height:1.65;box-sizing:border-box;min-width:0}
.czprog *{box-sizing:border-box}
.czprog a{color:var(--accent)}
.czprog .bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin:0 0 28px;padding:0 0 18px;border-bottom:1px solid var(--line)}
.czprog .bar__back{font-weight:700;text-decoration:none;font-size:15px}
.czprog .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:50px;background:var(--accent);color:#fff;font-weight:700;font-size:14.5px;text-decoration:none;line-height:1.2}
.czprog .btn svg{width:18px;height:18px;flex:none}
.czprog .btn:hover{background:#0b7344;color:#fff}
.czprog .org{text-align:center;font-size:13.5px;color:var(--muted);line-height:1.5;margin:0 0 26px}
.czprog .org b{display:block;color:var(--ink);font-size:14.5px}
.czprog .approved{margin:0 0 30px auto;width:max-content;max-width:100%;font-size:14.5px;line-height:1.5}
.czprog .approved b{display:block;letter-spacing:.06em}
.czprog .kind{text-align:center;font-weight:800;letter-spacing:.05em;font-size:14px;color:var(--muted);margin:0}
.czprog h1{text-align:center;font-size:32px;line-height:1.2;font-weight:800;letter-spacing:-.02em;color:var(--ink);margin:6px 0 24px;text-wrap:balance}
.czprog .passport{margin:0 0 30px;padding:16px 20px;background:var(--soft);border-left:3px solid var(--accent);border-radius:0 12px 12px 0;list-style:none}
.czprog .passport li{margin:3px 0}
.czprog h2{font-size:20px;line-height:1.3;font-weight:800;color:var(--ink);margin:34px 0 12px}
.czprog p{margin:0 0 12px}
.czprog ul.dash{margin:0 0 12px;padding-left:0;list-style:none}
.czprog ul.dash li{position:relative;padding-left:20px;margin:4px 0}
.czprog ul.dash li::before{content:"–";position:absolute;left:0;color:var(--muted)}
.czprog .tbl{overflow-x:auto;margin:0 0 12px;border:1px solid var(--line);border-radius:12px}
.czprog table{border-collapse:collapse;width:100%;min-width:560px;font-size:14.5px;line-height:1.45}
.czprog th,.czprog td{padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top;text-align:left}
.czprog th{background:#f6f7f4;font-weight:700;color:var(--ink)}
.czprog td.n,.czprog th.n{text-align:center;font-variant-numeric:tabular-nums;white-space:nowrap}
.czprog tr.total td{font-weight:800;border-bottom:0}
.czprog .topic b{color:var(--ink)}
.czprog .sign{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;margin:36px 0 0}
.czprog .sign__line{flex:0 1 220px;border-bottom:1px solid var(--text);height:1.2em}
.czprog .src{margin-top:36px;padding-top:16px;border-top:1px solid var(--line);color:#7a7f8c;font-size:13.5px}
@media(max-width:560px){.czprog{padding:28px 16px 48px;font-size:15.5px}.czprog h1{font-size:25px}.czprog .approved{margin-left:0}.czprog .bar .btn{width:100%;justify-content:center}}
</style>"""

PDF_ICON = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>')


def doc_body():
    """Текст документа (то, что сверяется с PDF)."""
    out = []
    out.append('<div class="org"><b>%s</b>%s</div>' % (E(ORG[0]), E(ORG[1])))
    out.append('<div class="approved"><b>%s</b>%s<br>%s</div>' % tuple(E(x) for x in APPROVED))
    out.append('<p class="kind">%s</p>' % E(KIND))
    out.append('<h1>%s</h1>' % E(TITLE))
    out.append('<ul class="passport">' + ''.join('<li>%s</li>' % E(x) for x in PASSPORT) + '</ul>')
    out.append('<h2>1. Пояснительная записка</h2>' + ''.join('<p>%s</p>' % E(x) for x in S1))
    out.append('<h2>2. Планируемые результаты освоения программы</h2>'
               '<p>В результате освоения программы слушатель будет знать:</p>'
               '<ul class="dash">' + ''.join('<li>%s</li>' % E(x) for x in S2_KNOW) + '</ul>'
               '<p>Слушатель будет уметь:</p>'
               '<ul class="dash">' + ''.join('<li>%s</li>' % E(x) for x in S2_CAN) + '</ul>')
    rows = ''.join('<tr><td class="n">%d</td><td>%s</td><td class="n">2</td><td class="n">2</td><td>%s</td></tr>' % (i, E(t), E(c))
                   for i, (t, c, _) in enumerate(TOPICS, 1))
    out.append('<h2>3. Учебный план</h2><div class="tbl"><table>'
               '<thead><tr><th class="n">№</th><th>Наименование темы</th><th class="n">Всего, ак. ч</th><th class="n">Вебинар, ак. ч</th><th>Форма контроля</th></tr></thead>'
               '<tbody>' + rows + '<tr class="total"><td></td><td>Итого</td><td class="n">20</td><td class="n">20</td><td></td></tr></tbody></table></div>')
    out.append('<h2>4. Календарный учебный график</h2><p>%s</p>' % E(S4))
    out.append('<h2>5. Содержание программы</h2>' + ''.join(
        '<p class="topic"><b>Тема %d. %s.</b> %s</p>' % (i, E(t), E(d)) for i, (t, _, d) in enumerate(TOPICS, 1)))
    out.append('<h2>6. Формы аттестации и оценочные материалы</h2>' + ''.join('<p>%s</p>' % E(x) for x in S6))
    out.append('<h2>7. Организационно-педагогические условия</h2><p>%s</p>' % E(S7))
    out.append('<h2>8. Учебно-методическое обеспечение</h2><ul class="dash">' + ''.join('<li>%s</li>' % E(x) for x in S8) + '</ul>')
    out.append('<div class="sign"><span>%s</span><span class="sign__line"></span><span>%s</span></div>' % (E(SIGN[0]), E(SIGN[1])))
    return '\n'.join(out)


def words(text):
    text = text.replace('­', '')
    text = re.sub(r'-\s*\n\s*', '-', text)          # перенос после дефиса в PDF: «ИИ-\nсценарии»
    return Counter(w for w in re.findall(r'[0-9A-Za-zА-Яа-яЁё%№]+(?:[-.][0-9A-Za-zА-Яа-яЁё]+)*', text) if w)


def check_against_pdf(body_html):
    import fitz  # PyMuPDF
    pdf = fitz.open(os.path.join(ROOT, PDF_REL))
    pdf_text = '\n'.join(p.get_text() for p in pdf)
    page_text = html.unescape(re.sub(r'<[^>]+>', ' ', body_html))
    a, b = words(pdf_text), words(page_text)
    missing, extra = a - b, b - a
    assert not missing and not extra, ('расхождение с PDF', dict(missing), dict(extra))
    return sum(a.values())


body = doc_body()
n = check_against_pdf(body)
assert 'кв.' not in body and 'Златоуст' not in body

block = ('<!-- Программа «Искусственный интеллект в закупках» (приказ № 1 от 21.09.2026) для страницы GetCourse /course_ai_program.\n'
         '     Текст перенесён из ' + PDF_REL + ' и сверен с ним скриптом tools/build_gc_program.py. Правьте PDF и скрипт, не этот блок. -->\n'
         + STYLE + '\n<div class="czprog">\n'
         '<div class="bar"><a class="bar__back" href="' + COURSE_URL + '">← Курс «Искусственный интеллект в закупках»</a>'
         '<a class="btn" href="' + PDF_URL + '" target="_blank" rel="noopener">' + PDF_ICON + 'Скачать программу (PDF)</a></div>\n'
         + body +
         '\n<p class="src">Программа утверждена приказом ИП Герасимова Р.Г. № 1 от 21.09.2026. '
         'Утверждённый документ в PDF: <a href="' + PDF_URL + '" target="_blank" rel="noopener">скачать</a>. '
         'Сведения об образовательной организации: <a href="https://cifrazakup.ru/svedeniya.html">cifrazakup.ru/svedeniya.html</a>.</p>\n'
         '</div>\n')
io.open(os.path.join(ROOT, 'landings', 'gc-program-ai-block.html'), 'w', encoding='utf-8', newline='\n').write(block)
print('gc-program-ai-block.html', len(block.encode('utf-8')), 'bytes; words checked against PDF:', n)

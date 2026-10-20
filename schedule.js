/* Расписание школы «Закупки в цифре».
   Источник: Google-таблица «Расписание ЦифраЗакуп», вкладка «Расписание для сайта» (публичная по ссылке).
   Что рисует на главной: полосу «Сегодня» (#todayBar), карточку «Ближайшее событие» или событие по utm_campaign (#nextCard),
   кнопку в шапке (#navCta), сетку карточек с фильтром (#feed, кнопки [data-f]) и список программ в форме (#course).
   Если таблица недоступна, показывает встроенный снимок SNAPSHOT (обновлён 20.10.2026) — страница никогда не пустая.

   Колонки таблицы (по заголовкам, порядок не важен): Статус | Категория | Название | Описание | Дата проведения |
   Время проведения по МСК | Цена | Ссылка на лендинг | Теги (через запятую, ; или перенос) | Спикер | Формат | Длительность |
   Для кого (через запятую) | Порядок на сайте | utm_campaign. Теги и «Для кого» видны на карточках метками.
   Статусы: «Публикация» и «В разработке» видны, остальное («Черновик» и т. п.) скрыто.
   Даты: 06.10.2026 · 12.2026 · 30 сентября [2026] · 15 - 17 декабря 2026 · 15 декабря - 17 декабря 2026 · декабрь 2026.
   utm: при заходе на главную с ?utm_campaign=<метка> карточка справа сверху показывает строку с такой же меткой
   (или строку, чей лендинг заканчивается на /<метка>), а все utm_* дописываются в ссылку на лендинг. */
(function () {
  'use strict';
  var SHEET_ID = '1zclq-WUyMAsDVkbuj60ndqX5E3eylqTGin-oihKbZLc';
  var GID = '1095022827';
  /* Основной адрес — export: отдаёт ячейки как есть. Запасной — gviz: он угадывает тип колонки и обнуляет ячейки
     другого типа (текст «15 - 17 декабря 2026» в колонке дат, «Бесплатно» в колонке цен), поэтому только как фолбэк. */
  var SHEET_URLS = [
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?format=csv&gid=' + GID + '&_=' + Date.now(),
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&gid=' + GID + '&_=' + Date.now()
  ];
  var AI_COURSE_PAGE = 'course-ai.html'; /* у курса «ИИ в закупках» пока нет лендинга на платформе — ведём на страницу сайта */
  var SNAPSHOT = [{"status": "Публикация", "cat": "Госзакупки", "title": "Курс «Бюджетное окружение процесса закупок. Просто о сложном»", "desc": "Практический курс для заказчиков и финансовых специалистов, работающих на стыке 44-ФЗ и бюджетного процесса.", "date": "15 - 17 декабря 2026", "time": "", "price": "9000", "link": "https://gc.cifrazakup.ru/budgetenv", "tags": "3 занятия;\nОнлайн + доступ к записям;", "speaker": "Кристина Маркова", "format": "Курс", "dur": "3 занятия", "order": "1", "utm": "budgetenv", "aud": "Заказчики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Оценка государственного и муниципального имущества при выставлении на торги", "desc": "практический кейс по токсичным активам. Что стоит за отчётом об оценке, кто отвечает, когда бумага расходится с реальностью, и как продать объект, который годами висит в казне. Разбор реального кейса — от оценки до продажи руинированного объекта.", "date": "06.10.2026", "time": "10:00", "price": "Бесплатно", "link": "https://gc.cifrazakup.ru/ocenka_g_m_prop", "tags": "Разбор реального кейса;\nЧек-лист заказа оценки", "speaker": "Елена Кельберг", "format": "Вебинар", "dur": "1 эфир", "order": "3", "utm": "ocenka_g_m_prop", "aud": "Покупатели, Заказчики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Вводная лекция: «44-ФЗ: карта закупки глазами поставщика — от заявки до контракта».", "desc": "Открываем курс из 6 занятий для поставщиков, которые работают или планируют работать в госзакупках. \nОбзор контрактной системы.\nCпособы определения поставщика, этапы закупочного цикла.\nТипичные зоны риска для поставщика.", "date": "30.09.2026", "time": "10:00", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 1", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Заявка и допуск к закупке. \nЗаявка, которую не отклонят: требования к участнику и типичные ошибки", "desc": "Требования к участникам закупки.\nСостав заявки по способам закупки.\nОснования для отказа в допуске.\nРабота с документацией заказчика.\nРазбор реальных кейсов отклонения заявок.", "date": "08.10.2026", "time": "14:00", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 2", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Обеспечение и финансовые риски.\nОбеспечение заявки и исполнения контракта: деньги, банковская гарантия и антидемпинг", "desc": "Виды и размеры обеспечения.\nБанковская гарантия против денежного обеспечения.\nАнтидемпинговые меры при снижении цены.\nПоследствия непредоставления обеспечения.", "date": "13.10.2026", "time": "12:30", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 3", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Исполнение контракта и приёмка.\nОт поставки до подписи: как пройти приёмку без конфликта с заказчиком", "desc": "Порядок исполнения контракта.\nЭкспертиза и приёмка товаров/работ/услуг, документальное оформление.\nРеестровые записи и соответствие товара заявке — с учётом накопленной у вас практики по спорам о реестровых записях и национальном режиме.", "date": "20.10.2026", "time": "10:00", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 4", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Изменение и расторжение контракта.\nКогда контракт меняется или расторгается: права поставщика.", "desc": "Основания и порядок изменения условий контракта\nОдносторонний отказ заказчика и поставщика.Судебная практика по спорным расторжениям\nКак минимизировать риск потери контракта.", "date": "27.10.2026", "time": "10:00", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 5", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "Публикация", "cat": "Госзакупки", "title": "Госзакупки без потерь. Споры, жалобы и РНП. Итоговый разбор практики курса.", "desc": "Порядок обжалования действий заказчика в ФАС.\nАдминистративная и судебная защита прав поставщика.\nМеханизм включения в РНП и способы его избежать.\nИтоговый разбор практики курса.", "date": "05.11.2026", "time": "14:00", "price": "2000", "link": "https://gc.cifrazakup.ru/omilonaets_6steps", "tags": "Занятие 6", "speaker": "Ольга Милонаец", "format": "Курс", "dur": "6 занятий", "order": "3", "utm": "omilonaets_6steps", "aud": "Поставщики"}, {"status": "В разработке", "cat": "ИИ в закупках", "title": "Искусственный интеллект в закупках", "desc": "ИИ на каждом этапе закупки: поиск и анализ закупок, оценка цен, подготовка заявки и переписки, исполнение контракта. 20 академических часов, вебинар раз в неделю, итоговое тестирование и сертификат. Без программирования.", "date": "", "time": "", "price": "75000", "link": "", "tags": "20 ак. часов; 10 недель; вебинар раз в неделю", "speaker": "Альберт Гизатуллин", "format": "Курс", "dur": "10 занятий", "order": "4", "utm": "", "aud": ""}, {"status": "Черновик", "cat": "ИИ в закупках", "title": "Вебинар «ИИ в закупках: претензионная работа по 44-ФЗ с помощью нейросети»", "desc": "За 1,5 часа собираем претензию или ответ на неё по вашему контракту и уносим инструменты, чтобы дальше делать это за 20 минут. Пять типовых ситуаций, живые демо на реальных контрактах, калькулятор пеней и база знаний в подарок.", "date": "05.09.2026", "time": "11:00", "price": "1000", "link": "https://gc.cifrazakup.ru/gzissues_promo", "tags": "Запись 30 дней; Калькулятор пеней и база знаний", "speaker": "Альберт Гизатуллин", "format": "Вебинар", "dur": "1,5 часа", "order": "5", "utm": "gzissues", "aud": ""}];

  var feed = document.getElementById('feed');
  if (!feed) return;

  /* ── CSV (RFC 4180: кавычки, переносы строк внутри ячеек) ── */
  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { q = false; } }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }
  function rowsToObjects(rows) {
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    function col(re) { for (var i = 0; i < head.length; i++) if (re.test(head[i])) return i; return -1; }
    var C = { status: col(/^статус/), cat: col(/^категор/), title: col(/^назван/), desc: col(/^описан/), date: col(/^дата/), time: col(/^время/), price: col(/^цена/), link: col(/^ссылка/), tags: col(/^теги/), speaker: col(/^спикер/), format: col(/^формат/), dur: col(/^длительн/), order: col(/^порядок/), utm: col(/^utm/), aud: col(/^для кого/) };
    if (C.title < 0 || C.status < 0) return null;
    return rows.slice(1).map(function (r) {
      var o = {};
      for (var k in C) o[k] = C[k] >= 0 && r[C[k]] != null ? String(r[C[k]]).trim() : '';
      return o;
    }).filter(function (o) { return o.title; });
  }

  /* ── даты ── */
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var MONTHS_NOM = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  var MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  var MIDX = {}; MONTHS.forEach(function (m, i) { MIDX[m] = i; }); MONTHS_NOM.forEach(function (m, i) { MIDX[m] = i; });
  function inMonth(i) { var m = MONTHS_NOM[i]; return /[ьй]$/.test(m) ? m.slice(0, -1) + 'е' : m + 'е'; }
  var curYear = new Date().getFullYear();
  function parseDate(s) {
    s = (s || '').trim().replace(/\s+/g, ' '); if (!s) return null; var m;
    if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s*[-–—]\s*(\d{1,2})\.(\d{1,2})\.(\d{4}))?$/))) { var r = { d: new Date(+m[3], +m[2] - 1, +m[1]), day: true }; if (m[4]) r.end = new Date(+m[6], +m[5] - 1, +m[4]); return r; }
    if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return { d: new Date(+m[1], +m[2] - 1, +m[3]), day: true };
    if ((m = s.match(/^(\d{1,2})\.(\d{4})$/))) return { d: new Date(+m[2], +m[1] - 1, 1), day: false };
    if ((m = s.match(/^(\d{1,2})(?:\s+([а-яё]+))?\s*[-–—]\s*(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?$/i))) {
      var m2 = MIDX[m[4].toLowerCase()], m1 = m[2] ? MIDX[m[2].toLowerCase()] : m2; if (m1 === undefined || m2 === undefined) return null;
      var y = m[5] ? +m[5] : curYear; return { d: new Date(y, m1, +m[1]), day: true, end: new Date(y, m2, +m[3]) };
    }
    if ((m = s.match(/^(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?$/i))) { var mi = MIDX[m[2].toLowerCase()]; if (mi === undefined) return null; return { d: new Date(m[3] ? +m[3] : curYear, mi, +m[1]), day: true }; }
    if ((m = s.match(/^([а-яё]+)\s+(\d{4})$/i))) { var mm = MIDX[m[1].toLowerCase()]; if (mm === undefined) return null; return { d: new Date(+m[2], mm, 1), day: false }; }
    return null;
  }
  function dayDiff(a, b) { return Math.round((a - b) / 864e5); }
  function dayStr(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function rangeStr(dt) {
    if (!dt) return ''; if (!dt.day) return MONTHS_NOM[dt.d.getMonth()] + ' ' + dt.d.getFullYear();
    if (dt.end) return dt.d.getMonth() === dt.end.getMonth() ? dt.d.getDate() + '–' + dt.end.getDate() + ' ' + MONTHS[dt.d.getMonth()] : dayStr(dt.d) + ' – ' + dayStr(dt.end);
    return dayStr(dt.d);
  }
  /* крупная дата: числа большие, месяцы маленькие серые рядом; диапазон — два числа через тире */
  function dateBig(dt, time) {
    if (!dt) return '<span class="d d--muted">—</span><span class="m">дата уточняется</span>';
    if (!dt.day) return '<span class="d">' + MONTHS_SHORT[dt.d.getMonth()] + '</span><span class="m">' + dt.d.getFullYear() + '</span>';
    var one = function (d) { return '<span class="d">' + d.getDate() + '</span><span class="m">' + MONTHS_SHORT[d.getMonth()] + '</span>'; };
    var html = one(dt.d) + (dt.end ? '<span class="dash">–</span>' + one(dt.end) : '');
    return html + (time && !dt.end ? '<small>' + esc(time) + ' МСК</small>' : '');
  }

  /* ── утилиты ── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function price(s) { s = (s || '').trim(); if (!s) return ''; if (/бесплатн/i.test(s)) return 'Бесплатно'; var n = parseInt(s.replace(/\s/g, ''), 10); if (isNaN(n)) return s; if (n === 0) return 'Бесплатно'; return n.toLocaleString('ru-RU') + ' ₽'; }
  function fmtTime(t) { return (t || '').trim().replace(/^(\d{1,2})[-.](\d{2})/, '$1:$2'); }
  function splitList(s) { var seen = {}; return (s || '').split(/[,;\n]/).map(function (t) { return t.replace(/\s+/g, ' ').trim(); }).filter(function (t) { var k = t.toLowerCase(); if (!t || seen[k]) return false; seen[k] = 1; return true; }); }
  var AUD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 010 6.4M18.5 14.8c1.7.8 2.7 2.5 3 5.2"/></svg>';
  /* метки карточки: сначала «Для кого» (с иконкой), затем теги; max — сколько тегов показать */
  function chips(it, max) {
    var a = it.aud.map(function (t) { return '<span class="pill pill--aud" title="Для кого">' + AUD_ICON + esc(t) + '</span>'; });
    var g = (max ? it.tags.slice(0, max) : it.tags).map(function (t) { return '<span class="pill pill--tag">' + esc(t) + '</span>'; });
    return a.concat(g).join('');
  }
  function slug(link) { var m = (link || '').replace(/[?#].*$/, '').match(/\/([^\/]+)\/?$/); return m ? m[1].toLowerCase() : ''; }

  /* ── utm из адреса главной ── */
  function getUtm() {
    var out = {};
    try { new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/i.test(k) && v) out[k.toLowerCase()] = v; }); } catch (e) { }
    return out;
  }
  function withUtm(href, utm) {
    if (!href || !/^https?:/i.test(href)) return href;
    var q = Object.keys(utm).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(utm[k]); }).join('&');
    if (!q) return href; return href + (href.indexOf('?') >= 0 ? '&' : '?') + q;
  }

  /* ── модель ── */
  var utm = getUtm(), filter = 'all', items = [], utmItem = null, today;
  function compute(rows) {
    today = new Date(); today.setHours(0, 0, 0, 0);
    items = rows.map(function (r) {
      var it = {
        status: r.status || '', title: (r.title || '').replace(/^"+|"+$/g, '').replace(/\s+/g, ' ').trim(), desc: r.desc || '',
        date: parseDate(r.date), time: fmtTime(r.time), price: r.price || '', link: (r.link || '').trim(),
        tags: splitList(r.tags), aud: splitList(r.aud),
        speaker: r.speaker || '', format: r.format || '', dur: r.dur || '', cat: r.cat || '',
        order: parseFloat(r.order) || 999, utm: (r.utm || '').trim().toLowerCase()
      };
      /* тег, совпадающий с длительностью или форматом («3 занятия»), уже есть в строке под названием — не повторяем */
      it.tags = it.tags.filter(function (t) { var k = t.toLowerCase(); return k !== it.dur.toLowerCase() && k !== it.format.toLowerCase(); });
      it.free = /бесплатн/i.test(it.price) || parseInt(it.price, 10) === 0;
      it.isWeb = /вебинар/i.test(it.format) || (!it.format && /вебинар/i.test(it.title));
      it.soon = /разработ/i.test(it.status);
      it.visible = /публикац|разработ/i.test(it.status);
      if (!it.link && /интеллект/i.test(it.title)) it.link = AI_COURSE_PAGE;
      var diff = it.date ? dayDiff(it.date.d, today) : null, endDiff = it.date && it.date.end ? dayDiff(it.date.end, today) : null;
      if (it.soon) { it.state = 'soon'; it.badge = 'Скоро'; it.cls = 'pill--muted'; it.btn = it.link ? 'Подробнее о курсе' : 'Оставить заявку'; it.href = it.link || '#register'; }
      else if (!it.date) { it.state = 'open'; it.badge = 'Идёт набор'; it.cls = 'pill--ok'; it.btn = 'Подробнее'; it.href = it.link || '#register'; }
      else if (it.isWeb) {
        if (diff === 0) { it.state = 'today'; it.badge = 'Сегодня' + (it.time ? ' в ' + it.time + ' МСК' : ''); it.cls = 'pill--live'; it.btn = 'Подключиться'; it.href = it.link || '#register'; }
        else if (diff > 0) { it.state = 'up'; it.badge = diff === 1 ? 'Завтра' : diff <= 7 ? 'Через ' + diff + ' дн.' : 'Регистрация открыта'; it.cls = diff <= 7 ? 'pill--hot' : 'pill--ok'; it.btn = it.free ? 'Зарегистрироваться бесплатно' : 'Зарегистрироваться'; it.href = it.link || '#register'; }
        else { it.state = 'past'; it.badge = 'Запись доступна'; it.cls = 'pill--muted'; it.btn = 'Смотреть запись'; it.href = it.link || '#register'; }
      } else {
        if (!it.date.day) { it.state = diff >= 0 ? 'up' : 'open'; it.badge = diff >= 0 ? 'Старт в ' + inMonth(it.date.d.getMonth()) + ' ' + it.date.d.getFullYear() : 'Идёт набор'; it.cls = 'pill--ok'; it.btn = 'Записаться'; it.href = it.link || '#register'; }
        else if (diff > 0) { it.state = 'up'; it.badge = 'Старт ' + dayStr(it.date.d); it.cls = diff <= 7 ? 'pill--hot' : 'pill--ok'; it.btn = 'Записаться'; it.href = it.link || '#register'; }
        else if (endDiff !== null && endDiff < 0) { it.state = 'past'; it.badge = 'Поток прошёл'; it.cls = 'pill--muted'; it.btn = 'Следующий поток'; it.href = '#register'; }
        else { it.state = 'open'; it.badge = diff === 0 ? 'Стартует сегодня' : 'Поток идёт · набор открыт'; it.cls = diff === 0 ? 'pill--live' : 'pill--ok'; it.btn = 'Присоединиться'; it.href = it.link || '#register'; }
      }
      it.href = withUtm(it.href, utm); it.diff = diff;
      it.live = it.state === 'today' || (it.state === 'open' && diff === 0);
      return it;
    }).filter(function (it) { return it.visible; });
    var rank = { today: 0, up: 1, open: 2, soon: 3, past: 4 };
    function rk(i) { return i.live ? 0 : rank[i.state]; }
    items.sort(function (a, b) {
      if (rk(a) !== rk(b)) return rk(a) - rk(b);
      if (a.state === 'past') return b.date.d - a.date.d;
      if (a.date && b.date) return a.date.d - b.date.d;
      return a.order - b.order;
    });
    utmItem = null;
    if (utm.utm_campaign) {
      var c = utm.utm_campaign.toLowerCase();
      utmItem = items.filter(function (i) { return i.utm === c || (!i.utm && slug(i.link) === c); })[0] || null;
    }
  }

  /* ── полоса «Сегодня» ── */
  function renderToday() {
    var bar = document.getElementById('todayBar'), hero = document.querySelector('.hero');
    if (!bar) return;
    var w = bar.querySelector('.wrap');
    var ev = items.filter(function (i) { return i.live || (i.state === 'up' && i.isWeb && i.diff <= 3); })[0];
    if (!ev) { bar.classList.remove('on'); w.innerHTML = ''; if (hero) hero.classList.remove('has-today'); return; }
    var when = ev.diff === 0 ? 'Сегодня' + (ev.time ? ' в ' + ev.time + ' МСК' : '') : (ev.diff === 1 ? 'Завтра' : 'Через ' + ev.diff + ' дн.') + (ev.time ? ', ' + ev.time + ' МСК' : '');
    var ttl = new RegExp('^' + ev.format, 'i').test(ev.title) ? ev.title : ev.format + ' «' + ev.title + '»';
    w.innerHTML = '<span class="today__when">' + esc(when) + '</span><span class="today__t">' + esc(ttl) + (ev.speaker ? ' · ' + esc(ev.speaker) : '') + (ev.free ? ' · бесплатно' : '') + '</span><a class="btn today__btn" href="' + esc(ev.href) + '">' + esc(ev.diff === 0 ? (ev.isWeb ? 'Подключиться' : 'Присоединиться') : 'Зарегистрироваться') + '</a>';
    bar.classList.add('on'); if (hero) hero.classList.add('has-today');
  }

  /* ── карточка в hero и кнопка в шапке ── */
  function renderNext() {
    var c = document.getElementById('nextCard'), cta = document.getElementById('navCta');
    if (!c) return;
    var nearest = items.filter(function (i) { return i.live || i.state === 'up'; })[0] || items.filter(function (i) { return i.state === 'open'; })[0] || items[0];
    var ev = utmItem || nearest;
    var lbl = utmItem ? (utmItem.isWeb ? 'Вебинар по вашей ссылке' : 'Курс по вашей ссылке') : 'Ближайшее событие';
    var after = items.filter(function (i) { return i !== ev && (i.live || i.state === 'up' || i.state === 'open'); })[0];
    if (cta) {
      if (utmItem) { cta.textContent = 'Оставить заявку'; cta.href = '#register'; cta.setAttribute('data-course', utmItem.title); }
      else { cta.href = '#schedule'; cta.removeAttribute('data-course'); cta.textContent = ev && ev.date ? (ev.live ? 'Сегодня' + (ev.time ? ' в ' + ev.time : '') : 'Ближайшее: ' + (ev.date.day ? ev.date.d.getDate() + ' ' + MONTHS[ev.date.d.getMonth()].slice(0, 3) : MONTHS_NOM[ev.date.d.getMonth()])) : 'Расписание'; }
    }
    if (!ev) { c.innerHTML = '<div class="next__lbl"><span>Ближайшее событие</span></div><p class="next__meta">Пока ничего не запланировано. Оставьте заявку, сообщим о старте.</p>'; return; }
    c.innerHTML = '<div class="next__lbl"><span>' + lbl + '</span><span class="pill ' + ev.cls + '">' + esc(ev.badge) + '</span></div>' +
      '<div class="next__date">' + (ev.date ? dateBig(ev.date, ev.time) : '<b>Скоро</b>') + '</div><div class="next__title">' + esc(ev.title) + '</div>' +
      '<div class="next__meta">' + esc([ev.speaker, ev.format + (ev.dur ? ', ' + ev.dur : '')].filter(Boolean).join(' · ')) + '</div>' +
      (ev.aud.length || ev.tags.length ? '<div class="next__row">' + chips(ev, 3) + '</div>' : '') +
      '<div class="next__foot"><span class="next__price">' + esc(price(ev.price)) + '</span>' + link(ev, 'btn btn--primary') + '</div>' +
      (after ? '<div class="next__after">' + (utmItem ? 'Ближайшее событие школы: ' : 'Следующее: ') + esc(after.title) + (after.date ? ' · ' + esc(rangeStr(after.date)) : '') + '</div>' : '');
  }
  function link(it, cls) {
    var dc = it.href.indexOf('#register') === 0 ? ' data-course="' + esc(it.title) + '"' : '';
    return '<a href="' + esc(it.href) + '" class="' + cls + '"' + dc + '>' + esc(it.btn) + '</a>';
  }

  /* ── сетка карточек и фильтр ── */
  function match(i, f) { if (f === 'all') return true; if (f === 'past') return i.state === 'past'; if (f === 'free') return i.free; if (f === 'Курс') return !i.isWeb; if (f === 'Вебинар') return i.isWeb; return true; }
  function renderFeed() {
    document.querySelectorAll('.flt[data-f]').forEach(function (b) { var f = b.getAttribute('data-f'); var n = b.querySelector('.flt__n'); if (n) n.textContent = items.filter(function (i) { return match(i, f); }).length; b.classList.toggle('on', f === filter); });
    var list = items.filter(function (i) { return match(i, filter); });
    if (utmItem && list.indexOf(utmItem) > 0) { list.splice(list.indexOf(utmItem), 1); list.unshift(utmItem); }
    if (!list.length) { feed.innerHTML = '<div class="ev-empty">В этом разделе пока пусто. Оставьте заявку, сообщим о старте.</div>'; return; }
    feed.innerHTML = list.map(function (it) {
      var tags = (it === utmItem ? '<span class="pill pill--utm">По вашей ссылке</span>' : '') + '<span class="pill pill--fmt">' + esc(it.format || 'Программа') + '</span><span class="pill ' + it.cls + '">' + esc(it.badge) + '</span>';
      var meta = [it.speaker, it.dur, it.cat].filter(Boolean).join(' · ');
      var d = it.desc.split('\n').map(function (p) { return p.trim(); }).filter(Boolean);
      var more = d.length ? '<details class="ev__more"><summary>Подробнее</summary><div class="ev__panel">' + d.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></details>' : '';
      var ch = (it.aud.length || it.tags.length) ? '<div class="ev__chips">' + chips(it) + '</div>' : '';
      return '<article class="ev' + (it.live ? ' ev--today' : '') + (it.state === 'past' ? ' ev--past' : '') + (it === utmItem ? ' ev--utm' : '') + '">' +
        '<div class="ev__top"><div class="ev__date">' + dateBig(it.date, it.time) + '</div><div class="ev__tags">' + tags + '</div></div>' +
        '<div class="ev__title">' + esc(it.title) + '</div><div class="ev__meta">' + esc(meta) + '</div>' + ch + more +
        '<div class="ev__side"><span class="ev__price' + (it.free ? ' free' : '') + '">' + esc(price(it.price)) + '</span>' + link(it, 'btn btn--primary btn--sm') + '</div></article>';
    }).join('');
    feed.setAttribute('data-count', list.length);
  }
  function setFilter(f) { filter = f; renderFeed(); }

  /* ── список программ в форме заявки ── */
  function renderForm() {
    var s = document.getElementById('course'); if (!s) return;
    var cur = s.value, seen = {};
    var opts = items.filter(function (i) { if (seen[i.title]) return false; seen[i.title] = 1; return true; }).map(function (i) { return '<option value="' + esc(i.title) + '">' + esc(i.title) + '</option>'; });
    s.innerHTML = opts.join('') + '<option value="Пока не определился">Пока не определился</option>';
    var want = utmItem ? utmItem.title : cur;
    if (want) { for (var i = 0; i < s.options.length; i++) if (s.options[i].value === want) { s.selectedIndex = i; break; } }
  }

  /* «Оставить заявку» на карточке → подставляем программу в форму (кнопки появляются после отрисовки) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-course]'); if (!a) return;
    var sel = document.getElementById('course'); if (!sel) return;
    var name = a.getAttribute('data-course'), found = false;
    for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === name) { sel.selectedIndex = i; found = true; break; }
    if (!found) { var o = document.createElement('option'); o.value = name; o.textContent = name; sel.insertBefore(o, sel.lastElementChild); sel.value = name; }
  });
  /* фильтры: кнопки над сеткой и ссылки в шапке/меню с data-f */
  document.querySelectorAll('[data-f]').forEach(function (b) { b.addEventListener('click', function () { setFilter(b.getAttribute('data-f')); }); });

  function draw(rows, source) { compute(rows); renderToday(); renderNext(); renderFeed(); renderForm(); feed.setAttribute('data-source', source); }

  draw(SNAPSHOT, 'snapshot');
  if (!window.fetch) return;
  function load(i) {
    if (i >= SHEET_URLS.length) return; /* таблица недоступна — остаётся снимок */
    fetch(SHEET_URLS[i], { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (text) {
      var rows = parseCSV(text); if (rows.length < 2) throw new Error('empty');
      var objs = rowsToObjects(rows); if (!objs || !objs.length) throw new Error('no rows');
      draw(objs, i === 0 ? 'sheet' : 'sheet-gviz');
    }).catch(function () { load(i + 1); });
  }
  load(0);
})();

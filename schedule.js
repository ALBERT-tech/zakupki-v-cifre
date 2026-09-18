/* Расписание программ из Google-таблицы «Расписание ЦифраЗакуп», вкладка «Расписание для сайта».
   Страница читает таблицу при открытии; если таблица недоступна — остаётся статичный список из HTML.
   Колонки (по заголовкам, порядок не важен): Статус | Категория | Название | Описание | Дата проведения |
   Время проведения по МСК | Цена | Ссылка на лендинг | Теги (через ;) | Спикер | Формат | Длительность | Порядок на сайте */
(function () {
  'use strict';
  var SHEET_ID = '1zclq-WUyMAsDVkbuj60ndqX5E3eylqTGin-oihKbZLc';
  var GID = '1095022827';
  var URL = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:csv&gid=' + GID + '&_=' + Date.now();

  var box = document.querySelector('#programs .modules');
  if (!box || !window.fetch) return;

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

  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var MONTH_IDX = { 'января': 0, 'январь': 0, 'февраля': 1, 'февраль': 1, 'марта': 2, 'март': 2, 'апреля': 3, 'апрель': 3, 'мая': 4, 'май': 4, 'июня': 5, 'июнь': 5, 'июля': 6, 'июль': 6, 'августа': 7, 'август': 7, 'сентября': 8, 'сентябрь': 8, 'октября': 9, 'октябрь': 9, 'ноября': 10, 'ноябрь': 10, 'декабря': 11, 'декабрь': 11 };

  /* «06.10.2026», «12.2026», «30 сентября», «2026-10-06» → {date, dayKnown} */
  function parseDate(s) {
    s = (s || '').trim(); if (!s) return null;
    var m;
    if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))) return { d: new Date(+m[3], +m[2] - 1, +m[1]), day: true };
    if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return { d: new Date(+m[1], +m[2] - 1, +m[3]), day: true };
    if ((m = s.match(/^(\d{1,2})\.(\d{4})$/))) return { d: new Date(+m[2], +m[1] - 1, 1), day: false };
    if ((m = s.match(/^(\d{1,2})\s+([а-яё]+)(?:\s+(\d{4}))?/i))) {
      var mi = MONTH_IDX[m[2].toLowerCase()]; if (mi === undefined) return null;
      var y = m[3] ? +m[3] : new Date().getFullYear();
      return { d: new Date(y, mi, +m[1]), day: true };
    }
    if ((m = s.match(/^([а-яё]+)\s+(\d{4})$/i))) { var mj = MONTH_IDX[m[1].toLowerCase()]; if (mj !== undefined) return { d: new Date(+m[2], mj, 1), day: false }; }
    return null;
  }
  var MONTHS_NOM = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
  function fmtDate(p, time) {
    if (!p) return '';
    var d = p.d;
    var s = p.day ? d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : MONTHS_NOM[d.getMonth()] + ' ' + d.getFullYear();
    time = (time || '').trim().replace(/^(\d{1,2})[-.](\d{2})/, '$1:$2');
    if (time && p.day) s += ', ' + time + ' МСК';
    return s;
  }
  function fmtPrice(s) {
    s = (s || '').trim(); if (!s) return '';
    var n = parseInt(s.replace(/\s/g, ''), 10);
    if (isNaN(n)) return s;
    if (n === 0) return 'Бесплатно';
    return n.toLocaleString('ru-RU') + ' ₽';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var PLUS = '<span class="module__toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></span>';

  function render(items) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var html = items.map(function (it, i) {
      var isFree = /бесплатн/i.test(it.price) || parseInt(it.price, 10) === 0;
      var past = !!(it.date && it.date.day && it.date.d < today);
      var soon = /разработ/i.test(it.status);
      var tag = soon ? 'Скоро' : past ? 'Запись' : isFree ? 'Бесплатно' : 'Набор открыт';
      var tagCls = 'prog__tag' + ((isFree && !soon && !past) ? ' prog__tag--ink' : '');

      var sub = [];
      if (it.speaker) sub.push(it.speaker);
      var fmt = [it.format, it.duration].filter(Boolean).join(', ');
      if (fmt) sub.push(fmt);
      if (it.date) sub.push((past ? 'эфир был ' : '') + fmtDate(it.date, it.time));
      var price = fmtPrice(it.price); if (price) sub.push(price);

      var isWebinar = /вебинар/i.test(it.format) || /вебинар/i.test(it.title);
      var btnText = soon ? 'Оставить заявку' : !it.link ? 'Оставить заявку' : isFree && !past ? 'Зарегистрироваться бесплатно' : isWebinar ? 'Перейти на страницу вебинара' : 'Перейти на страницу курса';
      var href = it.link && !soon ? it.link : '#register';
      var dataCourse = href === '#register' ? ' data-course="' + esc(it.title) + '"' : '';
      var tags = it.tags.filter(Boolean);

      return '<details class="module"' + (i === 0 ? ' open' : '') + '>' +
        '<summary class="module__head"><span class="module__no">' + pad(i + 1) + '</span>' +
        '<span class="module__titles"><span class="module__title">' + esc(it.title) + '</span>' +
        '<span class="module__sub">' + esc(sub.join(' · ')) + '</span></span>' +
        '<span class="' + tagCls + '">' + tag + '</span>' + PLUS + '</summary>' +
        '<div class="module__body">' +
        (it.desc ? '<p class="prog__desc">' + esc(it.desc).replace(/\n+/g, '<br>') + '</p>' : '') +
        (tags.length ? '<ul' + (it.desc ? '' : ' style="border-top:1px solid var(--line);padding-top:20px"') + '>' + tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="prog__foot"><a href="' + esc(href) + '" class="btn btn--primary"' + dataCourse + '>' + btnText + ' ' + ARROW + '</a>' +
        (it.category ? '<span class="course-card__soon">' + esc(it.category) + '</span>' : '') +
        '</div></div></details>';
    }).join('');
    box.innerHTML = html;
    box.setAttribute('data-source', 'sheet');

    /* открыт один пункт */
    var all = box.querySelectorAll('details');
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
    /* «Оставить заявку» — подставляем название в форму */
    box.querySelectorAll('a[data-course]').forEach(function (a) {
      a.addEventListener('click', function () {
        var sel = document.getElementById('course'); if (!sel) return;
        var name = a.getAttribute('data-course'), found = false;
        for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === name) { sel.selectedIndex = i; found = true; break; }
        if (!found) { var o = document.createElement('option'); o.value = name; o.textContent = name; sel.insertBefore(o, sel.lastElementChild); sel.value = name; }
      });
    });
  }

  fetch(URL, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (text) {
    var rows = parseCSV(text); if (rows.length < 2) return;
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    function col(re) { for (var i = 0; i < head.length; i++) if (re.test(head[i])) return i; return -1; }
    var C = { status: col(/^статус/), cat: col(/^категор/), title: col(/^назван/), desc: col(/^описан/), date: col(/^дата/), time: col(/^время/), price: col(/^цена/), link: col(/^ссылка/), tags: col(/^теги/), speaker: col(/^спикер/), format: col(/^формат/), dur: col(/^длительн/), order: col(/^порядок/) };
    if (C.title < 0 || C.status < 0) return;
    function g(r, k) { return C[k] >= 0 && r[C[k]] != null ? String(r[C[k]]).trim() : ''; }
    var items = rows.slice(1).filter(function (r) { return g(r, 'title'); }).map(function (r) {
      return {
        status: g(r, 'status'), category: g(r, 'cat'), title: g(r, 'title').replace(/^"+|"+$/g, ''), desc: g(r, 'desc'),
        date: parseDate(g(r, 'date')), time: g(r, 'time'), price: g(r, 'price'), link: g(r, 'link'),
        tags: g(r, 'tags').split(/;|\n/).map(function (t) { return t.trim(); }),
        speaker: g(r, 'speaker'), format: g(r, 'format'), duration: g(r, 'dur'),
        order: parseFloat(g(r, 'order')) || 999
      };
    }).filter(function (it) { return /публикац|разработ/i.test(it.status); });
    if (!items.length) return;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    items.sort(function (a, b) {
      var pa = !!(a.date && a.date.day && a.date.d < today), pb = !!(b.date && b.date.day && b.date.d < today);
      var sa = /разработ/i.test(a.status), sb = /разработ/i.test(b.status);
      if (pa !== pb) return pa ? 1 : -1;          /* прошедшие — вниз */
      if (sa !== sb) return sa ? 1 : -1;          /* «в разработке» — после актуальных */
      return a.order - b.order;
    });
    render(items);
  }).catch(function () { /* таблица недоступна — остаётся статичный список */ });
})();

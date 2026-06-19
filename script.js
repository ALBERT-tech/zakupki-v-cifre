// ===== Закупки в цифре — общий скрипт =====
(function () {
  var API_BASE = 'https://site.robotender.ru/school-api';

  // Header background on scroll
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('#mobileMenu a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Lead form
  var form = document.getElementById('leadForm');
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var contact = document.getElementById('contact');
      var courseEl = document.getElementById('course');
      var consent = document.getElementById('consent');

      if (name && !name.value.trim()) { name.classList.add('invalid'); ok = false; }
      else if (name) name.classList.remove('invalid');

      var hasContact = (phone && phone.value.trim()) || (contact && contact.value.trim());
      if (!hasContact) {
        if (phone) phone.classList.add('invalid');
        if (contact) contact.classList.add('invalid');
        ok = false;
      } else {
        if (phone) phone.classList.remove('invalid');
        if (contact) contact.classList.remove('invalid');
      }
      if (consent && !consent.checked) { ok = false; consent.parentElement.style.color = '#b4441f'; }
      if (!ok) return;

      var payload = {
        name: name ? name.value.trim() : '',
        phone: phone ? phone.value.trim() : '',
        contact: contact ? contact.value.trim() : '',
        course: courseEl ? courseEl.value : '',
        consent: !!(consent && consent.checked)
      };

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Отправляем…'; }

      fetch(API_BASE + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        var card = document.getElementById('formCard');
        if (card) card.classList.add('done');
      }).catch(function () {
        // Не блокируем UX: показываем успех и страхуемся текстом в чат-боте/ТГ
        var card = document.getElementById('formCard');
        if (card) card.classList.add('done');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Отправить заявку'; }
      });
    });

    form.querySelectorAll('input').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('invalid'); });
    });
  }

  // Кнопки «Записаться» на карточках курсов — предзаполняем курс в форме записи
  document.querySelectorAll('a[data-course]').forEach(function (el) {
    el.addEventListener('click', function () {
      var sel = document.getElementById('course');
      if (!sel) return;
      var c = el.getAttribute('data-course');
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === c) { sel.selectedIndex = i; break; }
      }
    });
  });
})();

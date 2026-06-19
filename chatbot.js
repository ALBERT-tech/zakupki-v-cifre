/* ── Чат-ассистент школы «Закупки в цифре» ──
   Floating-кнопка + панель, стриминг с /school-api/chat (AgentPlatform).
   Помогает выбрать курс, отвечает по программам, мягко собирает заявку → Telegram.
── */
(function () {
  var API_URL = 'https://site.robotender.ru/school-api/chat';
  var GREETING = 'Здравствуйте! 👋 Я ассистент школы «Закупки в цифре». Подскажу по курсам — ИИ в госзакупках, 44/223-ФЗ, бухгалтерия. С чем вам помочь?';

  var history = [];

  var style = document.createElement('style');
  style.textContent = `
    .ai-fab{position:fixed;right:24px;bottom:24px;z-index:9998;width:60px;height:60px;border-radius:50%;
      background:#0e8a52;box-shadow:0 6px 24px rgba(14,138,82,.45);cursor:pointer;border:none;
      display:flex;align-items:center;justify-content:center;transition:transform .2s ease, box-shadow .2s ease;}
    .ai-fab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 10px 32px rgba(14,138,82,.6);}
    .ai-fab svg{width:28px;height:28px;fill:#fff;}
    .ai-panel{position:fixed;right:24px;bottom:96px;z-index:9999;width:380px;max-width:calc(100vw - 32px);
      height:560px;max-height:calc(100vh - 130px);background:#fff;border:1px solid rgba(20,22,29,.1);
      border-radius:18px;box-shadow:0 16px 48px rgba(20,22,29,.2);display:none;flex-direction:column;overflow:hidden;
      font-family:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
    .ai-panel.open{display:flex;animation:aiPop .25s ease;}
    @keyframes aiPop{from{opacity:0;transform:translateY(12px) scale(.98);}to{opacity:1;transform:none;}}
    .ai-head{background:#14161d;color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px;}
    .ai-head .ai-ava{width:38px;height:38px;border-radius:50%;background:rgba(14,138,82,.25);
      display:flex;align-items:center;justify-content:center;font-size:18px;}
    .ai-head .ai-t{font-weight:800;font-size:15px;line-height:1.2;letter-spacing:-.01em;}
    .ai-head .ai-s{font-size:12px;opacity:.7;}
    .ai-head .ai-x{margin-left:auto;cursor:pointer;font-size:22px;line-height:1;opacity:.85;background:none;border:none;color:#fff;}
    .ai-head .ai-x:hover{opacity:1;}
    .ai-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;background:#f5f6f3;}
    .ai-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;}
    .ai-msg.bot{background:#fff;border:1px solid rgba(20,22,29,.08);color:#1a1d26;align-self:flex-start;border-bottom-left-radius:4px;}
    .ai-msg.user{background:#0e8a52;color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
    .ai-typing{align-self:flex-start;color:#5c616e;font-size:13px;padding:4px 6px;}
    .ai-foot{padding:12px;border-top:1px solid rgba(20,22,29,.08);background:#fff;display:flex;gap:8px;align-items:flex-end;}
    .ai-foot textarea{flex:1;resize:none;border:1.5px solid rgba(20,22,29,.14);border-radius:12px;padding:10px 12px;
      font-family:inherit;font-size:14px;max-height:96px;outline:none;line-height:1.4;}
    .ai-foot textarea:focus{border-color:#0e8a52;}
    .ai-send{width:40px;height:40px;min-width:40px;border-radius:10px;border:none;background:#0e8a52;
      cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;}
    .ai-send:hover{background:#0a6c40;}
    .ai-send:disabled{opacity:.5;cursor:not-allowed;}
    .ai-send svg{width:18px;height:18px;fill:#fff;}
    .ai-note{text-align:center;font-size:11px;color:#94A3B8;padding:0 12px 10px;background:#fff;}
    @media(max-width:480px){.ai-panel{right:8px;bottom:84px;height:calc(100vh - 110px);}}
  `;
  document.head.appendChild(style);

  var fab = document.createElement('button');
  fab.className = 'ai-fab';
  fab.setAttribute('aria-label', 'Открыть чат');
  fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.04 2 11c0 2.7 1.34 5.1 3.46 6.73L4.5 21.5l4.13-1.7c1.05.3 2.18.46 3.37.46 5.52 0 10-4.04 10-9s-4.48-9-10-9z"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'ai-panel';
  panel.innerHTML = `
    <div class="ai-head">
      <div class="ai-ava">🎓</div>
      <div>
        <div class="ai-t">Ассистент школы</div>
        <div class="ai-s">Закупки в цифре · обычно отвечает сразу</div>
      </div>
      <button class="ai-x" aria-label="Закрыть">×</button>
    </div>
    <div class="ai-body" id="aiBody"></div>
    <div class="ai-foot">
      <textarea id="aiInput" rows="1" placeholder="Спросите про курсы…"></textarea>
      <button class="ai-send" id="aiSend" aria-label="Отправить">
        <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
      </button>
    </div>
    <div class="ai-note">ИИ может ошибаться. Для записи — форма на сайте.</div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var body  = panel.querySelector('#aiBody');
  var input = panel.querySelector('#aiInput');
  var send  = panel.querySelector('#aiSend');
  var busy = false, greeted = false;

  function stripMd(s) {
    return s
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^\s*[*-]\s+/gm, '• ');
  }

  function addMsg(role, text) {
    var el = document.createElement('div');
    el.className = 'ai-msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function togglePanel(openIt) {
    var open = openIt !== undefined ? openIt : !panel.classList.contains('open');
    panel.classList.toggle('open', open);
    if (open) {
      if (!greeted) { addMsg('bot', GREETING); greeted = true; }
      setTimeout(function () { input.focus(); }, 100);
    }
  }

  fab.addEventListener('click', function () { togglePanel(); });
  panel.querySelector('.ai-x').addEventListener('click', function () { togglePanel(false); });

  input.addEventListener('input', function () {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 96) + 'px';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });
  send.addEventListener('click', doSend);

  async function doSend() {
    var text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    input.style.height = 'auto';
    addMsg('user', text);
    history.push({ role: 'user', content: text });

    busy = true; send.disabled = true;
    var typing = document.createElement('div');
    typing.className = 'ai-typing';
    typing.textContent = 'печатает…';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    var botEl = null, acc = '';
    try {
      var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-20) }),
      });
      if (!res.ok || !res.body) throw new Error('http ' + res.status);

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buf = '';
      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buf += decoder.decode(chunk.value, { stream: true });
        var parts = buf.split('\n\n');
        buf = parts.pop();
        for (var i = 0; i < parts.length; i++) {
          var line = parts[i].trim();
          if (!line.startsWith('data:')) continue;
          var obj;
          try { obj = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
          if (obj.delta) {
            if (typing.parentNode) typing.remove();
            if (!botEl) botEl = addMsg('bot', '');
            acc += obj.delta;
            botEl.textContent = stripMd(acc);
            body.scrollTop = body.scrollHeight;
          } else if (obj.error) {
            if (typing.parentNode) typing.remove();
            if (!botEl) botEl = addMsg('bot', '');
            botEl.textContent = obj.error;
          }
        }
      }
      if (typing.parentNode) typing.remove();
      if (acc) history.push({ role: 'assistant', content: acc });
    } catch (e) {
      if (typing.parentNode) typing.remove();
      addMsg('bot', 'Связь прервалась. Попробуйте ещё раз или оставьте заявку через форму на сайте.');
    } finally {
      busy = false; send.disabled = false;
      input.focus();
    }
  }
})();

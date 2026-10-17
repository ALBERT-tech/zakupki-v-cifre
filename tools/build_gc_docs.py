# -*- coding: utf-8 -*-
"""Собирает HTML-блоки для системных страниц GetCourse из наших документов:
  landings/gc-oferta-block.html   ← oferta.html   (страница gc.cifrazakup.ru/oferta)
  landings/gc-privacy-block.html  ← privacy.html  (страницы gc.cifrazakup.ru/privacypolicy и /privacypolicy1)
Источник истины — oferta.html и privacy.html на cifrazakup.ru. Текст вставляется в GetCourse статично
(юридический документ должен читаться без скриптов). После правки oferta/privacy — пересобрать и заменить блок на GetCourse.
Запуск из корня репозитория: python tools/build_gc_docs.py"""
import io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE = """<style>
.czdoc{max-width:820px;margin:0 auto;padding:48px 20px 64px;font-family:"Manrope",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1a1d26;font-size:16px;line-height:1.65}
.czdoc h1{font-size:34px;line-height:1.15;font-weight:800;letter-spacing:-.02em;color:#14161d;margin:0 0 8px}
.czdoc h2{font-size:20px;font-weight:800;color:#14161d;margin:32px 0 10px}
.czdoc p{margin:0 0 12px} .czdoc ul,.czdoc ol{margin:0 0 12px;padding-left:22px} .czdoc li{margin:4px 0}
.czdoc .updated{color:#5c616e;font-size:14.5px;margin-bottom:22px}
.czdoc .note{padding:14px 16px;background:#f1f8f4;border-left:3px solid #0e8a52;border-radius:0 10px 10px 0;margin:0 0 22px;font-size:15px}
.czdoc a{color:#0e8a52;text-decoration:underline;text-underline-offset:3px}
.czdoc .src{margin-top:36px;padding-top:16px;border-top:1px solid #e4e6e0;color:#8a8f9c;font-size:13.5px}
</style>"""


def build(src, out, page_url):
    html = io.open(os.path.join(ROOT, src), encoding="utf-8").read()
    m = re.search(r'<main class="wrap">(.*?)</main>', html, re.S)
    assert m, src
    body = m.group(1).strip()
    # относительные ссылки → абсолютные на cifrazakup.ru
    body = re.sub(r'href="(?!https?:|mailto:|tel:|#)([^"]+)"', r'href="https://cifrazakup.ru/\1"', body)
    assert "Златоуст" not in body and "кв. 196" not in body
    block = ("<!-- Текст синхронизирован с " + page_url + " (" + src + " в репозитории сайта). Правьте сайт, затем пересоберите tools/build_gc_docs.py. -->\n"
             + STYLE + '\n<div class="czdoc">\n' + body +
             '\n<p class="src">Актуальная редакция документа также опубликована на сайте школы: <a href="' + page_url + '">' + page_url + '</a></p>\n</div>\n')
    io.open(os.path.join(ROOT, "landings", out), "w", encoding="utf-8", newline="\n").write(block)
    print(out, len(block.encode("utf-8")), "bytes")


build("oferta.html", "gc-oferta-block.html", "https://cifrazakup.ru/oferta.html")
build("privacy.html", "gc-privacy-block.html", "https://cifrazakup.ru/privacy.html")

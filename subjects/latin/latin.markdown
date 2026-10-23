---
title: Latein
layout: page
permalink: /latin
published: true
has_toc: true
---

1. TOC
{:toc}

## Inhalt

Die Inhalte stützen sich auf den Lateinunterricht an der UZH, für den wir das Lehrmittel ***BreVIA, Kompaktkurs Latein für Oberstufe und Uni (Peter Jitschin, Günter Laser, Sabine Lösch, Barbara Scholz) (Vandenhoeck & Ruprecht, Göttingen) (ISBN: 978-3-525-70253-6)*** verwenden.

Die wichtigsten Grammatikthemen sind auf dieser Seite zusammengefasst, wo möglich habe ich versucht kompakte Tabellen für mein eigenes Verständnis zu formulieren. Letztere befinden sich im [untersten Abschnitt dieser Page](#tabellenverzeichnis).

## Tabellenverzeichnis

{% assign tables = site.latin | where: "type", "table" %}
{% for table in tables %}

---

### {{table.title}} {#{{table.name}}}

{{table.content}}

---

{% endfor %}

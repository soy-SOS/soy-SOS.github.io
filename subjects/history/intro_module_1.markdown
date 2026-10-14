---
layout: page
title: Basismodul 1
parent: Geschichte
permalink: /history/bm1/
published: true
---

1. TOC
{:toc}

## Übersicht Lektüre

{% assign items = site.reading | where: "module", "bm1" %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}

{% for item in sorted_items %}

### {{ item.name }} ({{ item.author }}, {{ item.year }})

{% include zip.html
  title=item.author
  content=item.author_info
  open="open"
  %}

(Datum Lektüreauftrag: {{item.assignment_date}})

{{ item.content }}

{% endfor %}

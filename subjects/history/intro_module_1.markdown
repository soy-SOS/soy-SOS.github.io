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

{% assign items = site.history | where: "module", "bm1" | compact %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}

{% for item in sorted_items %}

---

### {{ item.heading }} ({{ item.author }}, {{ item.year }}) {#{{item.title | downcase}}}

{% include components/zip.html
  title=item.author
  content=item.author_info
  open="open"
  %}

({{item.assignment_date}}, Lektüreauftrag)

{{ item.content }}

{% endfor %}

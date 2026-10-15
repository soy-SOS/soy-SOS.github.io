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

{% include content/reading_entry.md item=item %}

{% endfor %}

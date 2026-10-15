---
layout: page
title: Politische Systeme und Theorien 1
parent: Politikwissenschaft
permalink: /poli-sci/pst1/
published: true
---

1. TOC
{:toc}

## Übersicht Lektüre

{% assign items = site.poli_sci | where: "module", "pst1" | compact %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}

{% for item in sorted_items %}

{% include content/reading_entry.md item=item %}

{% endfor %}

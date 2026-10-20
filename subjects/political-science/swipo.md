---
layout: page
title: Einführung in die Schweizer Politik
parent: Politikwissenschaft
permalink: /poli-sci/swipo/
published: true
---


1. TOC
{:toc}

## Übersicht Lektüre

{% assign items = site.poli_sci | where: "module", "swipo" | compact %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}

{% for item in sorted_items %}

{% include content/reading_entry.md item=item %}

{% endfor %}

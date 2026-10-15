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

---

{% assign author = item.auth_info | map: "name" | join: " & " %}

### {{ item.heading }} ({{ author }}, {{ item.year }}) {#{{item.title | downcase}}}

{% if item.auth_info.size > 0 %}

| Name | Details            |
|:----| :-------------------|
{% for a in item.auth_info %}| {{a.name}} | {{a.info}} |
{%endfor%}

{% endif %}

({{item.assignment_date}}, Lektüreauftrag)

{{ item.content }}

{% endfor %}

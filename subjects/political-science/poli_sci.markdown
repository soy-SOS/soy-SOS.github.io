---
title: Politikwissenschaft
layout: page
permalink: /poli-sci/
published: true
---

**ACHTUNGACHTUNG: Hier noch mega in progress, noch nix passt hier sorryyyy.**

Die bisherigen und laufenden Module des Studiengangs Politikwissenschaft werden hier aufgelistet und mit jeweiligen Notizen und Ressourcen in Verbindung gebracht.

## Module Politikwissenschaft

### Politische Systeme und Theorien I

[Link]

### Einführung in die Schweizer Politik

[Link]

### Einführung in die Methoden und Statistik

[Link]

## Lektüre

{% assign items = site.poli_sci | where: "module", "" | compact %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}
{% assign url = site.baseurl | append: "/poli-sci" %}

| Datum | Modul | Author | Jahr:Titel |
| :-: | :-- | :------- | :------------------ |
| {% for i in sorted_items %} [{{ i.assignment_date }}]({{url}}/{{i.module}}#{{i.title | downcase}}) | {{ i.module | upcase }} | {{ i.author }} | {{ i.year }}: {{i.heading}} |
| {%endfor%}

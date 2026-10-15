---
layout: page
title: Geschichte
permalink: /history/
---

Im Fach Geschichte wurden bis jetzt folgende Module behandelt.

## Basismodul 1

[Link zur entsprechenden Seite]({{site.baseurl}}/history/bm1/)

Das Modul ist aufgeteilt in Proseminar 1 und 2. Hier lernen wir die Grundlagen der Geschichtswissenschaft. Der Leistungsnachweis besteht aus dem Forschungsbericht und der Proseminararbeit.

## Einführungsvorlesung

*Es existiert hier noch keine Seite mit Informationen oder Zusammenfassungen aus der Vorlesung.*

Dieses Vorlesungsmodul dient der groben Übersicht über historische Themenbereiche und gibt uns somit eine breitgefächerte Perspektive über diverse Fokusbereiche der Geschichtswissenschaft. Hier beschränken wir uns nicht zwingend auf eine bestimmte Epoche.

## Lektüre (alles)

{% assign items = site.history | where: "module", "bm1" | compact %}
{% assign sorted_items = items | sort: "assignment_date" | reverse %}
{% assign url = site.baseurl | append: "/history" %}

| Datum | Modul | Author | Jahr:Titel |
| :-: | :-- | :------- | :------------------ |
{% for i in sorted_items %} | [{{ i.assignment_date }}]({{url}}/{{i.module}}#{{i.title | downcase}}) | {{ i.module | upcase }} | {{ i.author }} | {{ i.year }}: {{i.heading}} |
{%endfor%}

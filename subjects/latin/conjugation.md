---
title: Konjugation
parent: Latein
has_toc: true
published: false
---


* TOC
{:toc}

---

{% assign conjugations = site.data.latin.grammar.conjugations %}

Verben sind Bestandteile eines Satzes, die Prozesse, Handlungen oder Zustände beschreiben können. Sie werden entsprechend ihres Bezugs angepasst, so wie es auch im Deutschen ist. Die Anpassung auf Bezugssatzglied, Zeit und Modus nennt man Konjugation.

Verben werden angepasst entsprechend

* der Person (Bezug, wer führt Aktion aus?)
* Modus
  * Indikativ
  * Konjunktiv
  * Imperativ
* Tempus
  * Präsens (Gegenwart)
  * Perfekt (analog zu FR passé simple)
  * Imperfekt (analog zu FR imparfait)
  * Futur 1
* Aktiv / Passiv

### Die Verbarten

Verben haben, wie auch die Nomen, verschiedene Klassen, entsprechend derer sie andere Konjugationsregeln befolgen müssen.

Die angaben bezüglich Person, Zeit und Modus geschehen im Lateinischen immer über Verbstamm, Einschub in der Mitte, oder die Endung.

### Stammgruppen

TODO: insert stammgruppen präses

### Aktiv, Indikativ

Aktiv, indikativ ist die erste Art, wie wir lernen zu konjugieren. Die Gliederung des Satzes ist

`Subjekt` + `Prädikat / konjugiertes Verb`

> amicus venit.
>> Der Freund kommt.

Gebildet wird es mit:

`Stammgruppe` + `Endung`,

wobei die Stammgruppe und Endung von der Zeitform und der Konjugationsklasse des Verbes abhängt.

#### Präsens

{% assign pres = conjugations.active.mode.indicative.present.class%}

{% assign sg1 = pres | map: "ending_forms" | map: "first_sg" %}
{% assign sg2 = pres | map: "ending_forms" | map: "second_sg" %}
{% assign sg3 = pres | map: "ending_forms" | map: "third_sg" %}
{% assign pl1 = pres | map: "ending_forms" | map: "first_pl" %}
{% assign pl2 = pres | map: "ending_forms" | map: "second_pl" %}
{% assign pl3 = pres | map: "ending_forms" | map: "third_pl" %}

| Person | {% for c in pres %}{{ c.display }}| {% endfor %}
|:-------| {% for c in pres %}:-------:| {% endfor %}
| Beispiel | {% for c in pres %}{{ c.example }}| {% endfor %}
| Stamm | {% for c in pres %} *[stamm]*{%if c.stem.suffix != ""%}-{{c.stem.suffix}}{%endif%} | {% endfor %}
| 1 Sg | {% for p in sg1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Sg | {% for p in sg2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Sg | {% for p in sg3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 1 Pl | {% for p in pl1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Pl | {% for p in pl2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Pl | {% for p in pl3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}

#### Perfekt

{% assign perf = conjugations.active.mode.indicative.perfect.class%}

{% assign sg1 = perf | map: "ending_forms" | map: "first_sg" %}
{% assign sg2 = perf | map: "ending_forms" | map: "second_sg" %}
{% assign sg3 = perf | map: "ending_forms" | map: "third_sg" %}
{% assign pl1 = perf | map: "ending_forms" | map: "first_pl" %}
{% assign pl2 = perf | map: "ending_forms" | map: "second_pl" %}
{% assign pl3 = perf | map: "ending_forms" | map: "third_pl" %}

| Person | {% for c in perf %}{{ c.display }}| {% endfor %}
|:-------| {% for c in perf %}:-------:| {% endfor %}
| Beispiel | {% for c in perf %}{{ c.example }}| {% endfor %}
| Stamm | {% for c in perf %} *[stamm]*{%if c.stem.suffix != ""%}-{{c.stem.suffix}}{%endif%} | {% endfor %}
| 1 Sg | {% for p in sg1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Sg | {% for p in sg2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Sg | {% for p in sg3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 1 Pl | {% for p in pl1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Pl | {% for p in pl2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Pl | {% for p in pl3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}

#### Imperfekt (Präteritum)

* Präsensstamm  

* Tempuszeichen  

* Personalendung  

{% assign imperf = conjugations.active.mode.indicative.imperfect.class%}

{% assign sg1 = imperf | map: "ending_forms" | map: "first_sg" %}
{% assign sg2 = imperf | map: "ending_forms" | map: "second_sg" %}
{% assign sg3 = imperf | map: "ending_forms" | map: "third_sg" %}
{% assign pl1 = imperf | map: "ending_forms" | map: "first_pl" %}
{% assign pl2 = imperf | map: "ending_forms" | map: "second_pl" %}
{% assign pl3 = imperf | map: "ending_forms" | map: "third_pl" %}

| Person | {% for c in imperf %}{{ c.display }}| {% endfor %}
|:-------| {% for c in imperf %}:-------:| {% endfor %}
| Beispiel | {% for c in imperf %}{{ c.example }}| {% endfor %}
| Stamm | {% for c in imperf %} *[stamm]*{%if c.stem.suffix != ""%}-{{c.stem.suffix}}{%endif%} | {% endfor %}
| 1 Sg | {% for p in sg1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Sg | {% for p in sg2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Sg | {% for p in sg3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 1 Pl | {% for p in pl1 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 2 Pl | {% for p in pl2 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}
| 3 Pl | {% for p in pl3 %}{%if p contains "binding_vowel"%}{{p.binding_vowel}}-{%endif%}-{{p.suffix}} | {% endfor %}

#### Plusqumperfekt TODO

* perfektstamm
* endung imperfekt esse

audire: (stamm: audiv)

1. audiv-eram
2. audiv-eras
3. audiv-erat

4. audiv-eramus
5. audiv-eratis
6. audiv-erant

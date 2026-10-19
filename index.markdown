---
layout: home
---


## Übersicht Lektüre

{% assign all_readings = site.history | concat: site.poli_sci %}

{%
  include content/reading_table.md
  collection=all_readings
  sort_by="assignment_date"
  reverse=true
%}

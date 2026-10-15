{%- assign status = include.item.status -%}
{% assign baseurl = include.url -%}
{% assign module = include.item.module | downcase -%}
{% assign title = include.item.title | downcase -%}
{%- assign date = include.item.assignment_date | date: "%d.%m.%y" -%}
[{{ date }} {{status}}]({{baseurl}}/{{module}}#{{title}}){%-
    if status == "DONE" -%}{: .label .label-green}{%
      elsif status == "WIP" -%}{: .label .label-yellow}{%
      elsif status == "TODO" -%}{: .label .label-red}{%
    endif
  -%}

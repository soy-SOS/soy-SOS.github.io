{% assign decls = site.data.latin.grammar.declinations %}
{% assign f = decls.all_types | where: "number", include.num %}
{% assign kasi = "Nom Sg,Gen Sg,Dat Sg,Akk Sg,Abl Sg,Nom Pl,Gen Pl,Dat Pl,Akk Pl,Abl Pl" | split: ","%}

|  | {% for type in f %} *{{type.name | slice: 0,9}}<br>{{type.subtype | slice: 0,9}}<br>{{type.example}}* |{% endfor %}
| :---- | {% for type in f %} :---: | {%endfor%}
| {% for i in (0..9) %}{{kasi[i]}} | {% for type in f %}
{%-assign forms = type.forms-%}
{{forms[i]}} | {%endfor%}
{%endfor%}

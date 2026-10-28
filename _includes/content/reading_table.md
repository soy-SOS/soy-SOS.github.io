{% assign input_data = include.collection %}
{% assign items = input_data | where: "subject", include.subject | compact %}

{% if include.module != nil %}
  {% assign items = items | where: "module", include.module | compact %}
{% endif %}

{% if include.sort_by != nil %}
  {% assign items = items | sort: include.sort_by %}
{% endif %}

{% if include.reverse != nil and include.reverse == true %}
  {% assign items = items | reverse %}
{% endif %}

{% assign inc_url = site.baseurl | append: "/" | append: include.subject %}

| Datum, Status | Modul | Author | Jahr:Titel |
| :-: | :-- | :------- | :------------------ |
| {% for i in items%}{%

    if include.subject == nil
    %}{% assign url = site.baseurl | append: i.subject %}{%
    else %}{% assign url = inc_url %}{%endif%}{%

    include content/date_label.md item=i url=url -%} | {{
    i.module | upcase }} | {{
    i.auth_info | map: "name" | join: " & " }} | {{
    i.year }}: {{i.heading}} |
| {%endfor%}

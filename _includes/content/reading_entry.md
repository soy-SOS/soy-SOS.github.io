
---

{% assign author = include.item.auth_info | map: "name" | join: " & " %}

### {{ include.item.heading }} ({{ author }}, {{ include.item.year }}) {#{{include.item.title | downcase}}}

{% if include.item.auth_info.size > 0 %}

| Name | Details            |
|:----| :-------------------|
{% for a in include.item.auth_info %}| {{a.name}} | {{a.info}} |
{%endfor%}

{% endif %}

({{ include.item.assignment_date }}, Lektüreauftrag)

{{ include.item.content }}

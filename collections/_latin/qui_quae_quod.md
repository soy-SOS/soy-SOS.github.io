---
title: qui / quae / quod (Relativpronomina)
name: relative-pronomina-qqq
type: table
---

{% assign pronouns = site.data.latin.grammar.declinations.pronouns %}
{% assign kasi = "Nom Sg,Gen Sg,Dat Sg,Akk Sg,Abl Sg,Nom Pl,Gen Pl,Dat Pl,Akk Pl,Abl Pl" | split: ","%}
{%assign qqq = pronouns.relative.items[0] %}

| Kasus | m | f | n | Deutsch |
| :---- | :--: | :--: | :--: | -----: |
| {%for k in kasi
%}{{k}} | {%
assign mfn = qqq.la[forloop.index0] | split: "/"
%} {{mfn[0]}} | {{mfn[1]}} | {{mfn[2]}} | {{qqq.de[forloop.index0]}} |
{%endfor%}

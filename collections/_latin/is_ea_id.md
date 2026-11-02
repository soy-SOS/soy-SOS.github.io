---
title: is / ea / id (Personalpronomina)
name: personal-pronomina-iei
type: table
---
{% assign pronouns = site.data.latin.grammar.declinations.pronouns %}
{% assign iseaid = pronouns.personal.items[2] %}
{% assign kasi = "Nom Sg,Gen Sg,Dat Sg,Akk Sg,Abl Sg,Nom Pl,Gen Pl,Dat Pl,Akk Pl,Abl Pl" | split: ","%}

| Kasus | m | f | n | Deutsch |
| :---- | :--: | :--: | :--: | -----: |
| {%for k in kasi
%}{{k}} | {%
assign mfn = iseaid.la[forloop.index0] | split: "/"
%} {{mfn[0]}} | {{mfn[1]}} | {{mfn[2]}} | {{iseaid.de[forloop.index0]}} |
{%endfor%}

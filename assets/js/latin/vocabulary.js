class Inflection {
  constructor(id, stem, ends, forms, tempusSign) {
    this.id = id;
    this.stem = stem;
    this.ends = ends;
    this.forms = [];
    for (let i = 0; i < forms.length; ++i) {
      this.forms
        .push(forms[i]
          .replace("[stem]", stem)
          .replace("[end]", ends[i])
          .replace("[tempus_sign]", tempusSign));
    }
    this.tempusSign = tempusSign;
  }
}

class Rule {
  constructor(id, inflections, tempusSign) {
    this.id = id;
    this.inflections = inflections;
    this.tempusSign = tempusSign;
  }
}

function generateInflections(inflections, tempusSign) {
  return inflections
    .map(i => new Inflection(
      i['id'], i['stem'], i['ends'], i['forms'], tempusSign
    ));
}

class RuleSet {
  #adjectiveRules;
  #verbRules;
  #substantiveRules;
  #allRules;

  constructor(jsonData) {
    const classes = jsonData.filter(item => Object.hasOwn(item, 'id'));

    this.#adjectiveRules = classes
      .filter(c => c['id'].startsWith('adjective'))
      .map(c => ({ id: c['id'], inflections: c['inflections'] }))
      .map(it => new Rule(it.id, generateInflections(it.inflections, ""), ""));
    this.#verbRules = classes
      .filter(c => c['id'].startsWith('verb'))
      .map(c => ({ id: c['id'], inflections: c['inflections'], tempusSign: c['tempus_sign'] }))
      .map(it => {
        return new Rule(it.id, generateInflections(it.inflections, it.tempusSign), it.tempusSign);
      });
    this.#substantiveRules = classes
      .filter(c => c['id'].startsWith('substantive'))
      .map(c => ({ id: c['id'], inflections: c['inflections'] }))
      .map(it => new Rule(it.id, generateInflections(it.inflections, ""), ""));

    this.#allRules = [...this.#adjectiveRules, ...this.#verbRules, ...this.#substantiveRules];
  }

  adjectiveRules() { return this.#adjectiveRules; }
  verbRules() { return this.#verbRules; }
  substantiveRules() { return this.#substantiveRules; }
  allRules() { return this.#allRules; }

  getInflectionsById(id) {
    return this.#allRules
      .flatMap(r => r.inflections)
      .filter(inflection => inflection.id.startsWith(id));
  }

  getApplicableRules(id) {
    return this.#allRules.filter(r => id.startsWith(r.id));
  }
}

class Word {
  #word;
  #id;
  #root;
  #unit;
  #meanings;
  #overrides;
  #exclude;
  #superSign;
  #compSign;
  #jsonItem;
  #forms;
  wordEntries;

  constructor(jsonItem) {
    this.#jsonItem = jsonItem;
    this.#word = jsonItem['word'];
    this.#id = jsonItem['class'];
    this.#root = jsonItem['root'];
    this.#unit = parseInt(jsonItem['unit']);
    this.#meanings = jsonItem['meanings'];
    this.#overrides = new Map([]);
    this.#forms = new Map([]);
    if (Object.keys(jsonItem).includes('override')) {
      for (let o of jsonItem['override']) {
        this.#overrides.set(o.id, o.forms);
        this.#forms.set(o.id, o.forms);
      }
    }
    this.#exclude = [];
    if (Object.keys(jsonItem).includes('exclude')) {
      this.#exclude = jsonItem['exclude'];
    }
    this.#superSign = "";
    if (Object.keys(jsonItem).includes('super_sign')) {
      this.#superSign = jsonItem['super_sign'];
    }
    this.#compSign = "";
    if (Object.keys(jsonItem).includes('comp_sign')) {
      this.#compSign = jsonItem['comp_sign'];
    }
  }

  id() { return this.#id; }
  word() { return this.#word; }
  unit() { return this.#unit; }
  forms() { return this.#forms; }
  meanings() { return this.#meanings; }

  slimEntries() {
    return new Map([
      ...Object.entries({
        word: this.#word,
        id: this.#id,
        root: this.#root,
        unit: this.#unit,
        meanings: this.#meanings
      }),
      ...this.#forms]);
  }

  getFormById(id) {
    for (let [keyId, valueForms] of this.#forms) {
      if (keyId.startsWith(id)) {
        return valueForms;
      }
      if (keyId.endsWith(id)) {
        return valueForms;
      }
    }
    return [];
  }

  filterForms(allowedModifiers) {
    let filteredForms = [];
    for (let [k, v] of this.#forms) {
      let matchCount = 0;
      allowedModifiers.forEach(mod => mod.some(m => k.includes(m)) ? matchCount += 1 : matchCount += 0);
      if (allowedModifiers.length == matchCount) {
        filteredForms.push({ id: k, forms: v });
      }
    }
    return filteredForms;
  }

  createForm(form) {
    const maxIt = form.split('[').length;
    let newForm = form;
    for (let i = 0; i < maxIt; ++i) {
      const start = newForm.indexOf('[');
      const end = newForm.indexOf(']');
      const fieldName = newForm.substring(start + 1, end);
      if (Object.keys(this.#jsonItem).includes(fieldName)) {
        newForm = newForm.replace(`[${fieldName}]`, this.#jsonItem[fieldName]);
        continue;
      }

      for (let v of Object.values(this.#jsonItem)) {
        if (Object.keys(v).includes(fieldName)) {
          newForm = newForm.replace(`[${fieldName}]`, v[fieldName]);
          break;
        }
      }
    }
    return newForm;
  }

  excludedIds() {
    return this.#exclude.map(e => e.id);
  }

  inflectAll(ruleSet) {
    const allApplicableInflections = ruleSet
      .getInflectionsById(this.#id)
      .filter(inflection => {
        if (this.excludedIds().includes("*")) {
          return false;
        }
        for (let ex of this.excludedIds()) {
          if (inflection.id.startsWith(ex)) {
            return false;
          }
        }
        return true;
      });
    let forms = new Map();
    for (const inflection of allApplicableInflections) {
      const id = inflection.id;
      if (this.#forms.has(id)) {
        forms.set(id, this.#forms.get(id));
        continue;
      }
      if (this.#overrides.has(id)) {
        forms.set(id, this.#overrides.get(id));
        continue;
      }
      forms.set(id, inflection.forms.map(f => this.createForm(f)));
    }
    this.#forms = forms;
    this.wordEntries = this.slimEntries();
    return forms;
  }
}

class Vocabulary {
  #words = [];
  #ruleSet;

  constructor(jsonData, ruleJson) {
    this.jsonData = jsonData;
    this.#ruleSet = new RuleSet(ruleJson);
    [...Object.values(jsonData)]
      .flat()
      .map(item => this.#words.push(new Word(item)));

    this.#words
      .forEach(w => w.inflectAll(this.#ruleSet));
  }

  words() { return this.#words; }
  wordsEntries(words) { return words.map(w => w.wordEntries); }
  wordsByUnit(unit) {
    return this.#words.filter(word => word.unit() == unit);
  }
  wordsAsSimpleForms(words) { return words.map(w => w.slimEntries()); }

  getVerbs() {
    return this.#words.filter(w => w.id().startsWith('verb'));
  }
  groupByClassAndUnit(words) {
    return new Map([...this.#groupByUnit(words)].map(
      it => [it[0], (this.#groupByWordClass(it[1]))]
    ));
  }

  declCurrentJoinedForms() {
    return this.#words
      .filter(it => it.id().startsWith('substantive'))
      .map(it => ({ word: it.word(), forms: Array.from(it.forms())[0][1] }))
      .map(it => `${it.word}: [${it.forms.join(", ")}]`).join("\n");
  }
  verbCurrentJoinedForms(wordKind) {
    let words = this.#words.filter(it => it.id().startsWith(wordKind));
    let forms = [];
    for (let word of words) {
      let res = `${word.word()}:\n  forms:\n`;
      for (let form of word.forms()) {
        const adjustedForms = form[1].map(f => f == "" ? `""` : f);
        res += `    - id: ${form[0]}\n`;
        res += `      forms: [${adjustedForms.toString()}]\n`;
      }
      forms.push(res);
    }
    return forms.join("\n");
  }
  #groupByUnit(words) {
    const units = Map.groupBy(words, word => word.unit());
    return new Map([...units.entries()].sort((a, b) => a[0] - b[0]));
  }
  #groupByWordClass(words) {
    return Map.groupBy(words, word => word.id().split('.')[0]);
  }
}
function randInt(max) {
  return Math.floor(Math.random() * max);
}


function randomCardItem(verbs, allowedModifiers) {
  const randomWordIndex = randInt(verbs.length - 1);
  const randomWord = verbs[randomWordIndex];
  const availableForms = randomWord.filterForms(allowedModifiers);
  const form = availableForms[randInt(availableForms.length - 1)];
  const idParts = form.id.split(".");
  const tempus = idParts[idParts.length - 1];
  const voice = idParts[idParts.length - 2];
  const modus = idParts[idParts.length - 3];
  const person = randInt(form.forms.length - 1);

  const modi = new Map(Object.entries({ subjunctive: "Konj.", indicative: "Ind.", imperative: "Imp." }));
  const tempora = new Map(Object.entries({ present: "Präs.", imperfect: "Imperf.", perfect: "Perf.", plusquamperfect: "Plusquamp." }));
  const voices = new Map(Object.entries({ active: "Akt.", passive: "Pass." }));
  const persons = ["1. Sg", "2. Sg", "3. Sg", "1. Pl", "2. Pl", "3. Pl"];

  return ({
    form: form.forms[person],
    tempus: tempora.get(tempus),
    class: idParts[1],
    voice: voices.get(voice),
    unit: randomWord.unit(),
    modus: modi.get(modus),
    person: persons[person],
    meaning: randomWord.meanings().join(", "),
    infinitive: randomWord.word()
  });
}

function getVerbFilterValue(ids) {
  let available = [];
  ids.forEach(id => {
    const selector = document.querySelectorAll(id);
    let selectorMatches = [];
    let selectorAll = [];
    selector.forEach(box => {
      if (box.checked == true) {
        selectorMatches.push(box.getAttributeNode("value").value);
      }
      selectorAll.push(box.getAttributeNode("value").value);
    });
    available.push(selectorMatches.length == 0 ? selectorAll : selectorMatches);
  });
  return available;
}

function displayVerbs(verbs, divContainedId) {
  const flashCardDiv = "conjugation-container-flashcards-s";
  const unitMin = (document.getElementById("conf-unit-min").value);
  const unitMax = (document.getElementById("conf-unit-max").value);
  const itemNum = (document.getElementById("conf-cardmax").value);
  let allowedModifiers = getVerbFilterValue([".conf-tempus", ".conf-voice", ".conf-modus"]);

  const filterVerbs = verbs
    .filter(v => v.unit() >= unitMin && v.unit() <= unitMax)
    .filter(v => v != undefined);

  let inner = "";
  let currentDisplay = document.getElementById(flashCardDiv);
  if (currentDisplay != null && currentDisplay.isConnected) {
    currentDisplay.remove();
  }
  for (let i = 0; i < itemNum; ++i) {
    const item = randomCardItem(filterVerbs, allowedModifiers);
    inner +=
      `<div class="card conjugations" id="${i}" onclick="this.classList.toggle('flipped')">
        <div class="card-inner">
          <div class="card-front">
          <p style="font-size:80%;">${item.class}</p>
            <p class="question-text" style="font-size: 125%;">
              ${item.form}
            </p>
            ${item.unit}
          </div>
          <div class="card-back">
            <p style="font-size: small;font-weight:normal;"><i>${item.meaning}</i></p>
            <p>
              <b>${item.infinitive}</b><br>
              ${item.modus} ${item.voice} ${item.tempus} ${item.person}
            </p>
          </div>
        </div>
      </div>`;
  }
  let div = document.createElement("div");
  div.id = flashCardDiv;
  div.innerHTML = inner;

  document.getElementById(divContainedId).appendChild(div);
  return filterVerbs;
}

function shuffle(containerDiv) {
  let currentDisplay = document.getElementById(containerDiv);
  if (currentDisplay == null || !currentDisplay.isConnected) {
    return;
  }
  let cards = currentDisplay.children;
  let frag = document.createDocumentFragment();
  while (cards.length) {
    frag.appendChild(cards[Math.floor(Math.random() * cards.length)]);
  }
  currentDisplay.appendChild(frag);
}

function flipAll() {
  document.querySelectorAll('.card.conjugations').forEach(e => e.classList.toggle('flipped'));
}

function isAllowedUnit(item, allowedUnits) {
  if (allowedUnits.length == 0) {
    return true;
  }
  return allowedUnits.includes(item["unit"]);
}

function isAllowedClass(item, allowedClasses) {
  if (allowedClasses.length == 0) {
    return true;
  }
  return allowedClasses.includes(item["class"]);
}

function mapToTempora(w, c, tempora) {
  const wordHasExclusions = Object.keys(w).includes("exclude_ts");
  const ts = tempora
    .filter(t => {
      return wordHasExclusions ? !w["exclude_ts"].includes(t["name"]) : true;
    });
  return { w: w, c: c, ts: ts };
}

function getTensesString(data, tense, separator) {
  if (tense == "infinitive") {
    return data[tense];
  }
  if (!Object.keys(data).includes(tense)) {
    return "N/A";
  }
  return data[tense].join(separator);
}

function removeMacros(text) {
  let macroToNormal = {
    "ā": "a", "ē": "e", "ī": "i", "ō": "o", "ū": "u"
  };
  for (let [k, v] of new Map(Object.entries(macroToNormal))) {
    text = text.replaceAll(k, v);
  }
  return text;
}

function removeDash(text) {
  return text.replaceAll("-", "");
}

class ConjugationTable {
  constructor(id, wordData, headerToDataMapping, omitDash, omitMacros) {
    this.id = id;
    this.wordData = wordData;
    this.headerToDataMapping = headerToDataMapping;
    this.omitDash = omitDash;
    this.omitMacros = omitMacros;
    this.tenseSeparator = "<br>";
  }

  display() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const headRow = document.createElement("tr");
    for (const heading of this.headerToDataMapping.map(m => m.head)) {
      const cell = document.createElement("th");
      cell.textContent = heading;
      headRow.appendChild(cell);
    }
    thead.append(headRow);

    for (const data of this.wordData) {
      const row = document.createElement("tr");
      const items =
        this.headerToDataMapping.map(m => getTensesString(data, m.dataField, this.tenseSeparator));
      for (const item of items) {
        const cell = document.createElement("td");
        let innerText = item;
        if (this.omitMacros) {
          innerText = removeMacros(innerText);
        }
        if (this.omitDash) {
          innerText = removeDash(innerText);
        }
        cell.innerHTML = innerText;
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById(this.id).appendChild(table);
  }
}

function formConjugations(jsonData) {
  if (jsonData == undefined) {
    console.log("jsonData is undefined, returning.");
    return;
  }
  const persons = jsonData["classes"]["persons"];
  const tempora = jsonData["classes"]["tempori"];
  const classes = jsonData["classes"]["classes"];
  console.log(classes);
  const words = Object.keys(jsonData)
    .flatMap(key => key.startsWith("unit") ? jsonData[key] : []);

  const conjugations = words
    .map(word => ({ w: word, c: classes.find(c => c["subtype"] == word["subtype"]) }))
    .map(it = ({ w, c }) => mapToTempora(w, c, tempora))
    .flatMap(it = ({ w, c, ts }) => {
      let result = {
        unit: w["unit"],
        class: c["name"],
        infinitive: w["infinitive"],
        meanings: w["meanings"]
      };
      if (w["class"] == "irregular") {
        ts.forEach((t) => {
          result = new Object({ ...result, [t["name"]]: w[t["name"]] });
        });
        return result;
      }
      for (t of ts) {
        let conjs = [];
        const root = w["root"][t["stem"]];
        const formation = c["formation"][t["name"]];
        const ends = t["base_endings"];
        const tempusSign = c["tempus_sign"];

        const stem = c["stem"][t["stem"]].replace("[root]", root);
        for (let i = 0; i < persons.length; ++i) {
          const form = formation[i]
            .replace("[root]", root)
            .replace("[stem]", stem)
            .replaceAll("-", "")
            .replace("[temp]", `-${tempusSign}`)
            .replace("[end]", `-${ends[i]}`);
          conjs.push(form);
        }
        result = new Object({ ...result, [t["name"]]: conjs });
      }
      return result;
    });
  return conjugations;
}

class FilterOptions {
  #_itemMax;
  #_itemNum = 20;
  #_allowedTenses;
  #_allowedPersons;
  #_unitMin;
  #_unitMax;
  #_allTenses;
  // conf-cardmax
  constructor(allTenses, itemNum, allowedTenses, allowedPersons, unitMin, unitMax) {
    this.#_allTenses = allTenses;
    this.#_itemMax = 100;
    this.#_itemNum = itemNum;
    this.#_allowedTenses = allowedTenses;
    this.#_allowedPersons = allowedPersons;
    this.#_unitMin = unitMin;
    this.#_unitMax = unitMax;
  }

  allowedTenses() { return this.#_allowedTenses; }
  setAllowedTenses(allowedTenses) {
    if (!Array.isArray(allowedTenses)) {
      return;
    }
    let tenses = Array.from(allowedTenses);
    if (tenses.length == 0) {
      tenses = this.#_allTenses;
    }
    this.#_allowedTenses = tenses;
  }

  itemNum() { return this.#_itemNum; }
  setItemNum(itemNum) {
    if (itemNum == undefined) {
      // Do nothing if input invalid.
      return;
    }
    const num = parseInt(itemNum);
    if (num.toString() != itemNum) {
      return;
    }
    if (num > this.#_itemMax || num <= 0) {
      // Do nothing if `itemNum` is outside of cutoff range.
      return;
    }
    this.#_itemNum = num;
  }

  unitMin() { return this.#_unitMin; }
  setUnitMin(unitMin) {
    if (unitMin == undefined) {
      return;
    }
    const parsed = parseInt(unitMin);
    if (parsed.toString() !== unitMin) {
      // Do nothing if input invalid.
      return;
    }
    if (parsed < 0 || parsed > 23) {
      // Do nothing if `unitMax` is outside of cutoff range.
      return;
    }
    this.#_unitMin = parsed;
  }

  unitMax() { return this.#_unitMax; }
  setUnitMax(unitMax) {
    if (unitMax == undefined) {
      // Do nothing if input invalid.
      return;
    }
    let parsed = parseInt(unitMax);
    if (parsed.toString() !== unitMax) {
      return;
    }
    if (parsed > 23 || parsed <= 0) {
      // Do nothing if `unitMax` is outside of cutoff range.
      return;
    }
    if (parsed < this.unitMin()) {
      parsed = this.unitMin();
    }
    this.#_unitMax = parsed;
  }

  toString() {
    const out = `
    FilterOptions {
      itemMax: ${this.#_itemMax}
      itemNum: ${this.#_itemNum}
      unitRange: [${this.#_unitMin} - ${this.#_unitMax}]

      tenses: ${this.#_allowedTenses.join(", ")}
      persons: ${this.#_allowedPersons.join(", ")}
    }
    `;
    return out;
  }
}

class Conjugations {
  #_displayDivId = "";
  #_conjugations;
  #_allConjugations;
  #_allTenses;
  #_allPersons = ["1 Sg.", "2 Sg.", "3 Sg.", "1 Pl.", "2 Pl.", "3 Pl."];
  #_tenseInternalToExternal;
  #_filters;


  #_divIdMappings = {
    "display-table": "conjugation-container-display-table",
    "quiz-table": "conjugation-container-quiz-table",
    "flashcards-s": "conjugation-container-flashcards-s"
  };

  constructor(jsonData) {
    const tensesMappings = [
      ["present", "Präsens"],
      ["perfect", "Perfekt"],
      ["imperfect", "Imperfekt"],
      ["plusquamperfect", "Plusquamperfekt"]
    ];
    this.#_tenseInternalToExternal = new Map(tensesMappings);

    this.#_allTenses = Array.from(this.#_tenseInternalToExternal.keys());
    this.#_allConjugations = formConjugations(jsonData);
    this.#_conjugations = formConjugations(jsonData);
    this.#_displayDivId = this.#_divIdMappings["flashcards-s"];


    this.#_filters = new FilterOptions(this.#_allTenses, 5, this.#_allTenses, this.#_allPersons, 1, 2);
  }

  setFilters() {
    let tenses = [];
    document.querySelectorAll(".conf-tempus").forEach(box => {
      if (box.checked == true) {
        tenses.push(box.getAttributeNode("value").value);
      }
    });
    this.#_filters.setAllowedTenses(tenses);
    this.#_filters.setUnitMin(document.getElementById("conf-unit-min").value);
    this.#_filters.setUnitMax(document.getElementById("conf-unit-max").value);
    this.#_filters.setItemNum(document.getElementById("conf-cardmax").value);
    this.#_conjugations = this.#_allConjugations
      .filter(i => i.unit >= this.#_filters.unitMin() && i.unit <= this.#_filters.unitMax())
      .filter(i => {
        for (let tense of this.#_filters.allowedTenses()) {
          if (Object.keys(i).includes(tense)) {
            return true;
          }
        }
        return false;
      });
  }

  divIdMappings() {
    return this.#_divIdMappings;
  }

  #randInt(max) {
    return Math.floor(Math.random() * max);
  }

  #randomTempus(word) {
    const tenses = this.#_filters.allowedTenses();
    let tempus = tenses[this.#randInt(tenses.length)];
    while (!Object.keys(word).includes(tempus)) {
      tempus = tenses[this.#randInt(tenses.length)];
    }
    return tempus;
  }

  #randomCardItem() {
    const randomWordIndex = this.#randInt(this.#_conjugations.length - 1);
    const randomWord = this.#_conjugations[randomWordIndex];
    const tempus = this.#randomTempus(randomWord);
    const person = this.#randInt(randomWord[tempus].length - 1);

    return ({
      form: randomWord[tempus][person].replaceAll("-", ""),
      tempus: this.#_tenseInternalToExternal.get(tempus),
      person: this.#_allPersons[person],
      meaning: randomWord.meanings.join(", "),
      infinitive: randomWord.infinitive
    });
  }

  #displayFlashcardsS(parentDiv) {
    const maxItems = this.#_filters.itemNum();
    let inner = "";
    console.log(this.#_conjugations);
    for (let i = 0; i < maxItems; ++i) {
      const item = this.#randomCardItem();
      const cardTemplate =
        `<div class="card conjugations" id="${i}" onclick="this.classList.toggle('flipped')">
        <div class="card-inner">
          <div class="card-front">
            <p class="question-text">
              <i>${item.infinitive}</i><br>${item.tempus} ${item.person}
            </p> 
          </div>
          <div class="card-back">
            <p style="font-size: small;font-weight:normal;"><i>${item.meaning}</i></p>
            <p style="font-weight:normal;">
              <b>${item.form}</b>
            </p>
          </div>
        </div>
      </div>`;
      inner += (cardTemplate);
    }
    let div = document.createElement("div");
    div.id = this.#_displayDivId;
    div.innerHTML = inner;

    document.getElementById(parentDiv).appendChild(div);
  }

  shuffle() {
    let currentDisplay = document.getElementById(this.#_displayDivId);
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

  flipAll() {
    document.querySelectorAll('.card.conjugations').forEach(e => e.classList.toggle('flipped'));
  }

  display(parentDiv) {
    this.setFilters();
    console.log(this.#_filters.toString());
    let currentDisplay = document.getElementById(this.#_displayDivId);
    if (currentDisplay != null && currentDisplay.isConnected) {
      currentDisplay.remove();
    }
    this.#displayFlashcardsS(parentDiv);
  }
}

function mytest(containerId, jsonData) {
  if (jsonData == undefined) {
    console.log("jsonData is undefined, returning.");
    return;
  }
  const persons = jsonData["classes"]["persons"];
  const tempori = jsonData["classes"]["tempori"];
  const classes = jsonData["classes"]["classes"];
  const words = Object.keys(jsonData)
    .flatMap(key => key.startsWith("unit") ? jsonData[key] : []);

  const myunits = [];
  const myclasses = [];

  const conjugations = words
    .filter(word => isAllowedUnit(word, myunits))
    .filter(word => isAllowedClass(word, myclasses))
    .map(word => ({ w: word, c: classes.find(c => c["subtype"] == word["subtype"]) }))
    .map(it = ({ w, c }) => mapToTempora(w, c, tempori))
    .flatMap(it = ({ w, c, ts }) => {
      let result = {
        unit: w["unit"],
        class: c["name"],
        infinitive: w["infinitive"],
      };
      if (w["class"] == "irregular") {
        ts.forEach((t) => {
          result = new Object({ ...result, [t["name"]]: w[t["name"]] });
        });
        return result;
      }
      for (t of ts) {
        let conjs = [];
        const root = w["root"][t["stem"]];
        const formation = c["formation"][t["name"]];
        const ends = t["base_endings"];
        const tempusSign = c["tempus_sign"];

        const stem = c["stem"][t["stem"]].replace("[root]", root);
        for (let i = 0; i < persons.length; ++i) {
          const form = formation[i]
            .replace("[root]", root)
            .replace("[stem]", stem)
            .replaceAll("-", "")
            .replace("[temp]", `-${tempusSign}`)
            .replace("[end]", `-${ends[i]}`);
          conjs.push(form);
        }
        result = new Object({ ...result, [t["name"]]: conjs });
      }
      return result;
    });
  const tableMappings = [
    { head: "Infinitiv", dataField: "infinitive" },
    { head: "Präsens", dataField: "present" },
    { head: "Perfekt", dataField: "perfect" },
    { head: "Imperfekt", dataField: "imperfect" },
    { head: "Plusquamperfekt", dataField: "plusquamperfect" }
  ];
  const encoder = new TextEncoder();
  const smth = encoder.encode(JSON.stringify(conjugations));
  const size = smth.length;
  const kb = size / 1024;
  console.log(`KB: ${kb}`);
  console.log(`MB: ${kb / 1024}`);
  for (let i = 0; i < conjugations.length; ++i) {
    sessionStorage.setItem(i, JSON.stringify(conjugations[i]));
  }

  const table = new ConjugationTable(containerId, conjugations, tableMappings, true, true);
  table.displayTable();
}

function saveToSession(jsonData, selecteUnits, selectedClasses) {
  if (sessionStorage.length != 0) {
    return;
  }
  if (jsonData == undefined) {
    console.log("jsonData is undefined, returning.");
    return;
  }
  const persons = jsonData["classes"]["persons"];
  const tempori = jsonData["classes"]["tempori"];
  const classes = jsonData["classes"]["classes"];
  const words = Object.keys(jsonData)
    .flatMap(key => key.startsWith("unit") ? jsonData[key] : []);

  const conjugations = words
    .filter(word => isAllowedUnit(word, selecteUnits))
    .filter(word => isAllowedClass(word, selectedClasses))
    .map(word => ({ w: word, c: classes.find(c => c["subtype"] == word["subtype"]) }))
    .map(it = ({ w, c }) => mapToTempora(w, c, tempori))
    .flatMap(it = ({ w, c, ts }) => {
      let result = {
        unit: w["unit"],
        class: c["name"],
        infinitive: w["infinitive"],
      };
      if (w["class"] == "irregular") {
        ts.forEach((t) => {
          result = new Object({ ...result, [t["name"]]: w[t["name"]] });
        });
        return result;
      }
      for (t of ts) {
        let conjs = [];
        const root = w["root"][t["stem"]];
        const formation = c["formation"][t["name"]];
        const ends = t["base_endings"];
        const tempusSign = c["tempus_sign"];

        const stem = c["stem"][t["stem"]].replace("[root]", root);
        for (let i = 0; i < persons.length; ++i) {
          const form = formation[i]
            .replace("[root]", root)
            .replace("[stem]", stem)
            .replaceAll("-", "")
            .replace("[temp]", `-${tempusSign}`)
            .replace("[end]", `-${ends[i]}`);
          conjs.push(form);
        }
        result = new Object({ ...result, [t["name"]]: conjs });
      }
      return result;
    });
  for (let i = 0; i < conjugations.length; ++i) {
    sessionStorage.setItem(i, JSON.stringify(conjugations[i]));
  }
  return;
}

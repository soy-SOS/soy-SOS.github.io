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

class Conjugations {
  #_displayDivId = "";
  #_conjugations;
  #_allConjugations;
  #_allTenses = ["present", "imperfect", "perfect", "plusquamperfect"];
  #_allowedTenses;

  #_divIdMappings = {
    "display-table": "conjugation-container-display-table",
    "quiz-table": "conjugation-container-quiz-table",
    "flashcards-s": "conjugation-container-flashcards-s"
  };

  constructor(jsonData) {
    this.#_allConjugations = formConjugations(jsonData);
    this.#_conjugations = formConjugations(jsonData);
    this.#_displayDivId = this.#_divIdMappings["flashcards-s"];
    this.#_allowedTenses = this.#_allTenses;
  }

  divIdMappings() {
    return this.#_divIdMappings;
  }

  #displayTable() {

  }

  #randInt(max) {
    return Math.floor(Math.random() * max);
  }

  #displayFlashcardsS(parentDiv) {
    const maxItems = 30;
    let inner = "";
    for (let i = 0; i < maxItems; ++i) {
      const randomWordIndex = this.#randInt(this.#_conjugations.length - 1);
      let tempus = this.#_allowedTenses[this.#randInt(this.#_allowedTenses.length)];
      let person = this.#randInt(5);
      const randomWord = this.#_conjugations[randomWordIndex];
      while (!Object.keys(randomWord).includes(tempus)) {
        tempus = this.#_allowedTenses[this.#randInt(this.#_allowedTenses.length)];
      }
      while (randomWord[tempus].length < person + 1) {
        person = this.#randInt(5);
      }
      const randomWordForm = randomWord[tempus][person];

      const meaningStr = randomWord["meanings"].join(", ");
      const loopIndex = i;
      const infinitive = randomWord["infinitive"];
      const cardTemplate =
        `<div class="card conjugations" id="${loopIndex}" onclick="this.classList.toggle('flipped')">
        <div class="card-inner">
          <div class="card-front">
            <p class="question-text">
              <i>${infinitive}</i><br>${tempus} ${person}
            </p> 
          </div>
          <div class="card-back">
            <p style="font-size: small;font-weight:normal;"><i>${meaningStr}</i></p>
            <p style="font-weight:normal;">
              <b>${randomWordForm}</b>
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

  #applyFilters() {
    let tenses = [];
    document.querySelectorAll(".conf-tempus").forEach(box => {
      if (box.checked == true) {
        tenses.push(box.getAttributeNode("value").value);
      }
    });
    if (tenses.length == 0) {
      this.#_allowedTenses = this.#_allTenses;
    } else {
      this.#_allowedTenses = tenses;
    }
    let unitMin = document.getElementById("conf-unit-min").value;
    let unitMax = document.getElementById("conf-unit-max").value;
    this.#_conjugations = this.#_allConjugations
      .filter(i => i.unit >= unitMin && i.unit <= unitMax);
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
    this.#applyFilters();
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

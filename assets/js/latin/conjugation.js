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

  displayTable() {
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

// class WordClass {
//   constructor(id, name, displayName, stemFormations, wordFormations) {
//     this.id = id;
//     this.name = name;
//     this.displayName = displayName;
//     this.stemFormations = stemFormations;
//     this.wordFormations = wordFormations;
//   }
// }

// // class Word {
// //   constructor(data, wordClass, roots) {
// //     this.word = data["infinitive"];
// //     this.metaData = {
// //       unit: data["unit"],
// //       meanings: data["meanings"],
// //       excludedTempora: data["exlude_ts"]
// //     };
// //     this.wordClass = wordClass;
// //     this.roots = roots;
// //     this.forms = conjugate();
// //   }

// //   conjugate() {
// //     if(this.wordClass.name == "irregular"){

// //     }
// //   }
// // }

// class Tempus {
//   constructor(name, displayName, stem, base_endings) {
//     this.name = name;
//     this.displayName = displayName;
//     this.stem = stem;
//     this.base_endings = base_endings;
//   }
// }

// class Conjugation {
//   #classes;
//   #persons;
//   #tempora;
//   #words;

//   constructor(classes, persons, tempora, words) {
//     this.#persons = persons;
//     this.#tempora = tempora
//       .map(t => new Tempus(t["name"], t["display"], t["stem"], t["base_endings"]));
//     this.#classes = classes.map(c => new WordClass(
//       c["class"], c["subtype"], c["name"], c["stem"], c["formation"]
//     ));
//     this.#words = words;
//   }
//   #initWords(words, classes) {
//     const bla = [];
//     bla.map(word => word["subtype"]);
//   }
// }

// function initData() {

// }

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

function addFlashCards(divName, num) {
  let indices = [];
  const maxIndex = sessionStorage.length - 1;
  for (let i = 0; i < num; ++i) {
    const index = Math.floor(Math.random() * maxIndex);

    
  }
}

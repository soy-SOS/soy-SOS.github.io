function onSelectTopicByName(attribute, targetName) {
  document
    .querySelectorAll('.' + targetName).forEach(e => {
      if (e.className.includes(attribute)) {
        e.style.display = 'block';
      } else {
        e.style.display = 'none';
      }
    });
  return;
}

function restyleFilterButtons(button, buttonName) {
  document.querySelectorAll('.' + buttonName).forEach(e => {
    if (e.isEqualNode(button)) {
      e.classList.add('on');
    } else {
      e.classList.remove('on');
    }
  });
  return;
}

function onFilterByAttribute(button, attribute, targetName, buttonName) {
  if (button.classList.contains('on')) {
    // No changes if the filter is already applied.
    return;
  }
  onSelectTopicByName(attribute, targetName);
  restyleFilterButtons(button, buttonName);
  return;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function loadcon(items) {
  const maxId = document.querySelectorAll('.conjugations').length - 1;
  let arr = [];
  for (let i = 0; i <= items; ++i) {
    arr.push(getRandomInt(maxId));
  }
  document.querySelectorAll('.conjugations').forEach(e => {
    if (arr.includes(Number(e.id))) {
      e.setAttribute('style', 'display:inline-table;');
    } else {
      e.setAttribute('style', 'display:none;');
    }
  });
  let list = document.querySelector('.conjugate'), i;
  for (i = list.children.length; i >= 0; i--) {
    list.appendChild(list.children[Math.random() * i | 0]);
  }
  return;
}

function switchBack() {
  document.querySelectorAll('.card.conjugations').forEach(e => e.classList.toggle('flipped'));
}

function showVals(classname) {
  document.getElementById(classname).children;

}

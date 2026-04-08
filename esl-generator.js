const LEVEL_ORDER = ["Pre A1", "A1", "A2", "B1", "B2", "C1", "C2"];
const FILLER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const state = {
  filteredWords: [],
  worksheetType: "word search",
  includeImages: false,
  grid: []
};

function levelIndex(level) {
  return LEVEL_ORDER.indexOf(level);
}

function inLevelRange(level, min, max) {
  const idx = levelIndex(level);
  return idx >= levelIndex(min) && idx <= levelIndex(max);
}

function shuffle(arr) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function placeWord(grid, word) {
  const size = grid.length;
  const upper = word.toUpperCase().replace(/[^A-Z]/g, "");
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 1]
  ];

  for (let tries = 0; tries < 200; tries += 1) {
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
    const startX = Math.floor(Math.random() * size);
    const startY = Math.floor(Math.random() * size);

    const endX = startX + dx * (upper.length - 1);
    const endY = startY + dy * (upper.length - 1);

    if (endX < 0 || endX >= size || endY < 0 || endY >= size) {
      continue;
    }

    let fits = true;
    for (let i = 0; i < upper.length; i += 1) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      const existing = grid[y][x];
      if (existing && existing !== upper[i]) {
        fits = false;
        break;
      }
    }

    if (!fits) {
      continue;
    }

    for (let i = 0; i < upper.length; i += 1) {
      const x = startX + dx * i;
      const y = startY + dy * i;
      grid[y][x] = upper[i];
    }
    return true;
  }

  return false;
}

function generateWordSearch(words, size = 12) {
  const grid = createEmptyGrid(size);
  shuffle(words).forEach((entry) => {
    placeWord(grid, entry.word);
  });

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!grid[y][x]) {
        grid[y][x] = FILLER[Math.floor(Math.random() * FILLER.length)];
      }
    }
  }

  return grid;
}

function buildFillBlanks(words) {
  return words.map((entry) => {
    const letters = entry.word.split("");
    if (letters.length < 3) {
      return `${entry.word[0] || "_"}__`;
    }

    const missingIndex = Math.floor(Math.random() * (letters.length - 2)) + 1;
    letters[missingIndex] = "_";
    return letters.join("");
  });
}

function filterWords(db, level, partOfSpeech) {
  return db
    .filter((entry) => inLevelRange(level, entry.levelMin, entry.levelMax))
    .filter((entry) => entry.partOfSpeech === partOfSpeech)
    .slice(0, 10);
}

function imageMarkup(words) {
  return `
    <div class="word-image-row">
      ${words
        .map(
          (entry) => `
            <div class="word-image">
              <img src="${entry.image}" alt="${entry.word}">
              <span>${entry.word}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderWorksheet() {
  const preview = document.getElementById("worksheetPreview");
  if (!state.filteredWords.length) {
    preview.innerHTML = "<p>No matching words found for this selection.</p>";
    document.getElementById("pdfBtn").disabled = true;
    return;
  }

  const title = `${state.worksheetType === "word search" ? "Word Search" : "Fill in the Blank"} - ${state.filteredWords[0].partOfSpeech}`;
  const instructions =
    state.worksheetType === "word search"
      ? "Find all vocabulary words in the puzzle grid. Words may be horizontal, vertical, or diagonal."
      : "Complete each word by filling in the missing letter.";

  const wordList = state.filteredWords
    .map((entry) => `<span class="word-tag">${entry.word}</span>`)
    .join("");

  let content = `
    <h2>${title}</h2>
    <p><strong>Instructions:</strong> ${instructions}</p>
    <h3>Word List</h3>
    <div class="word-list">${wordList}</div>
  `;

  if (state.worksheetType === "word search") {
    content += `
      <h3>Puzzle Grid</h3>
      <div class="grid">
        ${state.grid.flat().map((letter) => `<div class="cell">${letter}</div>`).join("")}
      </div>
    `;
  } else {
    const blanks = buildFillBlanks(state.filteredWords);
    content += `
      <h3>Exercises</h3>
      ${blanks
        .map((blank, idx) => `<div class="blank-item">${idx + 1}. ${blank}</div>`)
        .join("")}
    `;
  }

  if (state.includeImages) {
    content += `<h3>Vocabulary Images</h3>${imageMarkup(state.filteredWords)}`;
  }

  preview.innerHTML = content;
  document.getElementById("pdfBtn").disabled = false;
}

async function exportPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ format: "a4", unit: "mm" });

  let y = 15;
  doc.setFontSize(18);
  doc.text("ESL Worksheet", 15, y);

  y += 8;
  doc.setFontSize(11);
  const inst =
    state.worksheetType === "word search"
      ? "Find the words in the grid."
      : "Fill in each missing letter.";
  doc.text(`Instructions: ${inst}`, 15, y);

  y += 8;
  doc.text("Word List:", 15, y);
  y += 6;
  const wordLine = state.filteredWords.map((w) => w.word).join(", ");
  const wrapped = doc.splitTextToSize(wordLine, 180);
  doc.text(wrapped, 15, y);
  y += wrapped.length * 5 + 3;

  if (state.worksheetType === "word search") {
    doc.text("Puzzle Grid:", 15, y);
    y += 5;
    doc.setFont("courier", "normal");
    state.grid.forEach((row) => {
      doc.text(row.join(" "), 15, y);
      y += 5;
    });
    doc.setFont("helvetica", "normal");
  } else {
    doc.text("Exercises:", 15, y);
    y += 6;
    buildFillBlanks(state.filteredWords).forEach((blank, idx) => {
      doc.text(`${idx + 1}. ${blank}`, 15, y);
      y += 6;
    });
  }

  if (state.includeImages) {
    y += 2;
    doc.text("Images:", 15, y);
    y += 6;
    for (const entry of state.filteredWords.slice(0, 6)) {
      try {
        const dataUrl = await toDataURL(entry.image);
        doc.addImage(dataUrl, "JPEG", 15, y, 12, 12);
      } catch (err) {
        doc.rect(15, y, 12, 12);
      }
      doc.text(entry.word, 30, y + 8);
      y += 15;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
  }

  doc.save("esl-worksheet.pdf");
}

function toDataURL(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

async function init() {
  const response = await fetch("esl-vocabulary.json");
  const db = await response.json();

  document.getElementById("generateBtn").addEventListener("click", () => {
    const level = document.getElementById("levelSelect").value;
    const pos = document.getElementById("posSelect").value;

    state.worksheetType = document.getElementById("typeSelect").value;
    state.includeImages = document.getElementById("imagesToggle").checked;
    state.filteredWords = filterWords(db, level, pos);
    state.grid = generateWordSearch(state.filteredWords, 12);

    renderWorksheet();
  });

  document.getElementById("pdfBtn").addEventListener("click", exportPdf);
}

init();

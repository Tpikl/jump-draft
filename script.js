const boxPool = [
  "Angels",
  "Armed",
  "Beasts",
  "Bloody",
  "Bookworms",
  "Burning",
  "Chaos",
  "Clerics",
  "Copied",
  "Dinner",
  "Dinosaurs",
  "Dragons",
  "Drowned",
  "Elves",
  "Enchanted",
  "Encounter",
  "Explorers",
  "Fun Guys",
  "Ghastly",
  "Giddyap",
  "Goblins",
  "Grave Robbers",
  "Healers",
  "Heroes",
  "Icky",
  "Illusions",
  "Inventive",
  "Landfall",
  "Legion",
  "Modified",
  "Neer Do Wells",
  "Nefarious",
  "Ninjas",
  "Of the Coast",
  "Prideful",
  "Snakes",
  "Soaring",
  "Stalwart",
  "Stoked",
  "Surprise!",
  "Too Many",
  "Treasures",
  "Vampires",
  "Warriors",
  "Wizards",
  "Zealots"
]; // Hardcoded box pool
let players = [];
let pool = [...boxPool];
let roundOptions = [];
let currentRound = 1;

document.getElementById("startDraft").addEventListener("click", startDraft);
document.getElementById("nextRound").addEventListener("click", nextRound);

function startDraft() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  if (numPlayers < 2 || numPlayers > 8) {
    alert("Please enter a valid number of players (2-8).");
    return;
  }

  // Initialize players and reset state
  players = Array.from({ length: numPlayers }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    drafted: [],
  }));
  pool = [...boxPool];
  roundOptions = [];
  currentRound = 1;

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("draft").classList.remove("hidden");
  startRound();
}

function startRound() {
  roundOptions = players.map(() => assignBoxes(pool));
  displayDraftOptions();
}

function assignBoxes(pool) {
  let boxes = [];
  while (boxes.length < 3) {
    const box = pool[Math.floor(Math.random() * pool.length)];
    if (!boxes.includes(box)) boxes.push(box);
  }
  return boxes;
}

function displayDraftOptions() {
  const playerDrafts = document.getElementById("playerDrafts");
  playerDrafts.innerHTML = ""; // Clear previous round

  roundOptions.forEach((options, i) => {
    const player = players[i];
    const draftDiv = document.createElement("div");
    draftDiv.classList.add("player-draft");
    draftDiv.innerHTML = `
      <h3>${player.name}</h3>
      <div class="boxes">
        ${options.map(box => `<span class="box" data-player="${player.id}" data-box="${box}">${box}</span>`).join("")}
      </div>
    `;
    playerDrafts.appendChild(draftDiv);
  });

  // Add click listeners for box selection
  document.querySelectorAll(".box").forEach(box => {
    box.addEventListener("click", handleBoxSelection);
  });
}

function handleBoxSelection(e) {
  const playerId = parseInt(e.target.getAttribute("data-player"));
  const selectedBox = e.target.getAttribute("data-box");
  const playerIndex = playerId - 1;

  // Update player's drafted boxes
  players[playerIndex].drafted.push(selectedBox);

  // Remove selected box from pool and return remaining to pool
  pool.splice(pool.indexOf(selectedBox), 1);
  const remainingBoxes = roundOptions[playerIndex].filter(box => box !== selectedBox);
  pool.push(...remainingBoxes);

  // Disable the player's selection UI
  e.target.closest(".player-draft").querySelectorAll(".box").forEach(box => {
    box.style.pointerEvents = "none";
    box.style.opacity = 0.6;
  });

  // Check if all players have made their selection
  if (players.every((_, i) => players[i].drafted.length === currentRound)) {
    document.getElementById("nextRound").classList.remove("hidden");
  }
}

function nextRound() {
  if (pool.length < players.length * 3) {
    alert("Draft completed! No more boxes available.");
    displayResults();
    return;
  }

  currentRound++;
  document.getElementById("nextRound").classList.add("hidden");
  startRound();
}

function displayResults() {
  const playerDrafts = document.getElementById("playerDrafts");
  playerDrafts.innerHTML = "<h2>Draft Results</h2>";
  players.forEach(player => {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("player-draft");
    resultDiv.innerHTML = `
      <h3>${player.name}</h3>
      <p>Drafted Boxes: ${player.drafted.join(", ")}</p>
    `;
    playerDrafts.appendChild(resultDiv);
  });
}

const boxPool = [
  "Prideful",
  "Giddyap",
  "Angels (1)",
  "Angels (2)",
  "Heroes (1)",
  "Heroes (2)",
  "Legion (1)",
  "Legion (2)",
  "Healers (1)",
  "Healers (2)",
  "Healers (3)",
  "Healers (4)",
  "Stalwart (1)",
  "Stalwart (2)",
  "Stalwart (3)",
  "Stalwart (4)",
  "Armed (1)",
  "Armed (2)",
  "Armed (3)",
  "Armed (4)",
  "Enchanted (1)",
  "Enchanted (2)",
  "Enchanted (3)",
  "Enchanted (4)",
  "Illusions",
  "Ninjas",
  "Of the Coast (1)",
  "Of the Coast (2)",
  "Drowned (1)",
  "Drowned (2)",
  "Wizards (1)",
  "Wizards (2)",
  "Soaring (1)",
  "Soaring (2)",
  "Soaring (3)",
  "Soaring (4)",
  "Surprise! (1)",
  "Surprise! (2)",
  "Surprise! (3)",
  "Surprise! (4)",
  "Bookworms (1)",
  "Bookworms (2)",
  "Bookworms (3)",
  "Bookworms (4)",
  "Inventive (1)",
  "Inventive (2)",
  "Inventive (3)",
  "Inventive (4)",
  "Snakes",
  "Nefarious",
  "Treasures (1)",
  "Treasures (2)",
  "Clerics (1)",
  "Clerics (2)",
  "Clerics (3)",
  "Clerics (4)",
  "N'er-do-wells (1)",
  "N'er-do-wells (2)",
  "Icky (1)",
  "Icky (2)",
  "Vampires (1)",
  "Vampires (2)",
  "Vampires (3)",
  "Vampires (4)",
  "Grave Robbers (1)",
  "Grave Robbers (2)",
  "Grave Robbers (3)",
  "Grave Robbers (4)",
  "Ghastly (1)",
  "Ghastly (2)",
  "Ghastly (3)",
  "Ghastly (4)",
  "Too Many",
  "Burning",
  "Dragons (1)",
  "Dragons (2)",
  "Copied (1)",
  "Copied (2)",
  "Warriors (1)",
  "Warriors (2)",
  "Stoked (1)",
  "Stoked (2)",
  "Stoked (3)",
  "Stoked (4)",
  "Goblins (1)",
  "Goblins (2)",
  "Goblins (3)",
  "Goblins (4)",
  "Bloody (1)",
  "Bloody (2)",
  "Bloody (3)",
  "Bloody (4)",
  "Zealots (1)",
  "Zealots (2)",
  "Zealots (3)",
  "Zealots (4)",
  "Dinner",
  "Modified",
  "Fun Guys (1)",
  "Fun Guys (2)",
  "Beasts (1)",
  "Beasts (2)",
  "Dinosaurs (1)",
  "Dinosaurs (2)",
  "Encounter (1)",
  "Encounter (2)",
  "Encounter (3)",
  "Encounter (4)",
  "Explorers (1)",
  "Explorers (2)",
  "Explorers (3)",
  "Explorers (4)",
  "Elves (1)",
  "Elves (2)",
  "Elves (3)",
  "Elves (4)",
  "Landfall (1)",
  "Landfall (2)",
  "Landfall (3)",
  "Landfall (4)",
  "Chaos",
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

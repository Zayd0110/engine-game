// Elements
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const explanationScreen = document.getElementById("explanation-screen");

const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const playAgainBtn = document.getElementById("play-again-btn");

const partsContainer = document.getElementById("parts-container");
const assemblyContainer = document.getElementById("assembly-container");

const hintBtn = document.getElementById("hintBtn");
const hintContainer = document.getElementById("hint-container");
const scoreContainer = document.getElementById("score-container");
const explanationText = document.getElementById("explanation-text");

// Game data
const engineParts = [
  { id: "airIntake", name: "Air Intake" },
  { id: "turbocharger", name: "Turbocharger" },
  { id: "fuelInjector", name: "Fuel Injector" },
  { id: "cylinder", name: "Cylinder" },
  { id: "piston", name: "Piston" },
  { id: "crankshaft", name: "Crankshaft" },
  { id: "camshaft", name: "Camshaft" },
  { id: "engineHead", name: "Engine Head" },
  { id: "compressionAction", name: "Compression Action" },
  { id: "engineStart", name: "Engine Start" },
];

// Game state
let playerName = "";
let score = 0;
let hintsUsed = 0;
const maxHints = 2;

let draggedPart = null;

// Initialize
function init() {
  // Clear previous
  partsContainer.innerHTML = "";
  assemblyContainer.innerHTML = "";
  hintContainer.textContent = "";
  scoreContainer.textContent = "Score: 0";
  hintsUsed = 0;
  score = 0;

  // Add parts to partsPool
  engineParts.forEach((part) => {
    const partEl = document.createElement("div");
    partEl.classList.add("part");
    partEl.setAttribute("draggable", true);
    partEl.id = part.id;
    partEl.textContent = part.name;
    partsContainer.appendChild(partEl);

    // Drag events
    partEl.addEventListener("dragstart", dragStart);
    partEl.addEventListener("dragend", dragEnd);
  });

  // Setup assembly container drag events
  assemblyContainer.addEventListener("dragover", dragOver);
  assemblyContainer.addEventListener("drop", dropPart);

  // Reset UI
  hintBtn.disabled = false;
  hintContainer.textContent = `Hints left: ${maxHints - hintsUsed}`;
}

startBtn.addEventListener("click", () => {
  const nameVal = playerNameInput.value.trim();
  if (!nameVal) {
    alert("Please enter your name");
    return;
  }
  playerName = nameVal;
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  explanationScreen.classList.add("hidden");

  init();
});

playAgainBtn.addEventListener("click", () => {
  playerNameInput.value = "";
  loginScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  explanationScreen.classList.add("hidden");
});

hintBtn.addEventListener("click", useHint);

// Drag functions
function dragStart(e) {
  draggedPart = e.target;
  e.dataTransfer.setData("text/plain", draggedPart.id);
  setTimeout(() => {
    draggedPart.classList.add("dragging");
  }, 0);
}

function dragEnd(e) {
  draggedPart.classList.remove("dragging");
  draggedPart = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dropPart(e) {
  e.preventDefault();
  const partId = e.dataTransfer.getData("text/plain");
  const partEl = document.getElementById(partId);

  // Only add if not already in assembly
  if (!assemblyContainer.contains(partEl)) {
    assemblyContainer.appendChild(partEl);
    score += 10;
    updateScore();

    checkCompletion();
  }
}

// Update score display
function updateScore() {
  scoreContainer.textContent = `Score: ${score}`;
}

// Check if all parts are assembled
function checkCompletion() {
  if (assemblyContainer.children.length === engineParts.length) {
    showExplanation();
  }
}

// Show combustion explanation
function showExplanation() {
  gameScreen.classList.add("hidden");
  explanationScreen.classList.remove("hidden");
  explanationText.innerHTML = `
    <strong>Combustion Cycle:</strong><br />
    1. Air Intake: Air enters the cylinder.<br />
    2. Compression: Piston compresses the air-fuel mixture.<br />
    3. Power Stroke: Fuel ignites, pushing the piston down.<br />
    4. Exhaust: Exhaust gases are expelled.<br />
    This cycle repeats to power the engine.
  `;
}

// Hint system (50-50 style: remove 2 incorrect parts from parts pool)
function useHint() {
  if (hintsUsed >= maxHints) {
    hintContainer.textContent = "No more hints available.";
    hintBtn.disabled = true;
    return;
  }

  // Find parts NOT in assembly
  const availableParts = Array.from(partsContainer.children).filter(
    (part) => !assemblyContainer.contains(part)
  );

  if (availableParts.length <= 2) {
    hintContainer.textContent = "Not enough parts to remove for hint.";
    return;
  }

  // Randomly remove 2 parts from availableParts as hints
  let removedCount = 0;
  while (removedCount < 2) {
    const idx = Math.floor(Math.random() * availableParts.length);
    const part = availableParts[idx];

    // Remove part element
    partsContainer.removeChild(part);
    availableParts.splice(idx, 1);
    removedCount++;
  }

  hintsUsed++;
  hintContainer.textContent = `Hints left: ${maxHints - hintsUsed}`;
}


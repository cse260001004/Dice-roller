const diceDiv = document.getElementById("dice");
const resultText = document.getElementById("result");
const historyList = document.getElementById("history");
const roll1Button = document.getElementById("roll1");
const roll2Button = document.getElementById("roll2");
const clearButton = document.getElementById("clearHistory");
 
// Which of the 9 grid cells (0 to 8) should have a pip for each number.
// Cells are numbered left to right, top to bottom:
//   0 1 2
//   3 4 5
//   6 7 8
const pipPositions = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};
 
// This array remembers the last 5 rolls
let history = [];
 
// ---------- 1. Random number between 1 and 6 ----------
function randomDie() {
  // Math.random() gives a decimal from 0 up to (but not including) 1.
  // Multiply by 6 -> 0 to 5.99, Math.floor cuts the decimal -> 0 to 5,
  // then +1 -> 1 to 6. Every number has an equal chance.
  return Math.floor(Math.random() * 6) + 1;
}
 
// Make a list of random numbers, one per die
function randomValues(count) {
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push(randomDie());
  }
  return values;
}
 
// ---------- 2. Draw one die face using pips ----------
function drawDie(value) {
  const die = document.createElement("div");
  die.className = "die";
 
  // Make 9 cells. Put a pip in the cells that this number needs.
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
 
    if (pipPositions[value].includes(i)) {
      const pip = document.createElement("div");
      pip.className = "pip";
      cell.appendChild(pip);
    }
 
    die.appendChild(cell);
  }
 
  return die;
}
 
// Show a list of numbers as dice on the page
function showDice(values) {
  diceDiv.innerHTML = ""; // remove the old dice
  for (let i = 0; i < values.length; i++) {
    diceDiv.appendChild(drawDie(values[i]));
  }
}
 
// ---------- 3. Show the history list ----------
function showHistory() {
  historyList.innerHTML = "";
 
  // If there is nothing in history, show a small message
  if (history.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No rolls yet.";
    historyList.appendChild(emptyItem);
    return;
  }
 
  for (let i = 0; i < history.length; i++) {
    const item = document.createElement("li");
    item.textContent = history[i];
    historyList.appendChild(item);
  }
}
 
function addToHistory(text) {
  history.unshift(text);   // add to the start (newest first)
  if (history.length > 5) {
    history.pop();         // remove the oldest one
  }
  showHistory();
}
 
// Empty the history array and refresh the list on the page
function clearHistory() {
  history = [];
  showHistory();
}
 
// ---------- 4. Roll the dice (with animation) ----------
function rollDice(count) {
  // Disable buttons so the user cannot click during the animation
  roll1Button.disabled = true;
  roll2Button.disabled = true;
 
  // Start the shake animation (defined in CSS)
  diceDiv.classList.add("rolling");
  resultText.textContent = "Rolling...";
 
  // Every 80 ms, show random faces so it looks like the dice are spinning
  const spinTimer = setInterval(function () {
    showDice(randomValues(count));
  }, 80);
 
  // After 0.7 seconds, stop and show the real result
  setTimeout(function () {
    clearInterval(spinTimer);
    diceDiv.classList.remove("rolling");
 
    const values = randomValues(count);
    showDice(values);
 
    // Work out the total
    let total = 0;
    for (let i = 0; i < values.length; i++) {
      total += values[i];
    }
 
    // Show the result text and save it in history
    if (count === 1) {
      resultText.textContent = "You rolled: " + total;
      addToHistory("Rolled " + total);
    } else {
      const text = values.join(" + ") + " = " + total;
      resultText.textContent = "Total: " + total;
      addToHistory(text);
    }
 
    // Enable the buttons again
    roll1Button.disabled = false;
    roll2Button.disabled = false;
  }, 700);
}
 
// ---------- 5. Connect buttons to the function ----------
roll1Button.addEventListener("click", function () {
  rollDice(1);
});
 
roll2Button.addEventListener("click", function () {
  rollDice(2);
});
 
clearButton.addEventListener("click", clearHistory);
 
// Show one die when the page first loads
showDice([1]);
showHistory(); // shows "No rolls yet." at the start
 
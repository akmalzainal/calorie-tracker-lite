"use strict";

"use strict";

// ---------- Element selectors ----------
const elLimit = document.querySelector("#limit");
const btnSaveLimit = document.querySelector("#saveLimit");
const elTotal = document.querySelector("#total");
const elRemaining = document.querySelector("#remaining");
const elBar = document.querySelector("#bar"); // 👈 this is your progress bar
const elFoodName = document.querySelector("#foodName");
const elFoodCals = document.querySelector("#foodCals");
const btnAdd = document.querySelector("#addBtn");
const btnReset = document.querySelector("#resetBtn");
const elList = document.querySelector("#list");
const elToday = document.querySelector("#today");

// ---------- State ----------
let entries = [];
let limit = 1700;

// ---------- Functions ----------
function render() {
  const total = entries.reduce((sum, e) => sum + e.calories, 0);
  elTotal.textContent = total;
  const remaining = Math.max(0, limit - total);
  elRemaining.textContent = remaining;

  // progress bar
  const pct = Math.min(100, (total / Math.max(limit, 1)) * 100);
  elBar.style.width = pct + "%";
  elBar.style.background = total > limit ? "var(--danger)" : "var(--accent)";
}

// addEntry, deleteEntry, resetDay, etc...

// ---------- Actions ----------
function addEntry() {
  const name = elFoodName.value.trim();
  const cals = Number(elFoodCals.value);
  if (!name || !Number.isFinite(cals) || cals < 0) return;
  entries.push({ id: crypto.randomUUID(), name, calories: Math.round(cals) });
  elFoodName.value = "";
  elFoodCals.value = "";
  elFoodName.focus();
  render();
}

function deleteEntry(id) {
  entries = entries.filter((e) => e.id !== id);
  render();
}

function resetDay() {
  if (!confirm("Reset today's entries?")) return;
  entries = [];
  render();
}

function saveLimit() {
  const val = Number(elLimit.value);
  if (!Number.isFinite(val) || val < 0) return;
  limit = Math.round(val);
  render();
}

// ---------- Events ----------
btnAdd.addEventListener("click", addEntry);
[elFoodName, elFoodCals].forEach((el) =>
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addEntry();
  })
);

btnReset.addEventListener("click", resetDay);
btnSaveLimit.addEventListener("click", saveLimit);

elList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const li = e.target.closest(".item");
  if (!li) return;
  deleteEntry(li.dataset.id);
});

function loadDay(dateKey = new Date().toISOString().slice(0, 10)) {
  elToday.textContent = dateKey;
}
loadDay();

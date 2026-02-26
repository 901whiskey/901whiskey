const STORAGE_KEY = "gym-tracker-exercises-v1";

const form = document.getElementById("exercise-form");
const list = document.getElementById("exercise-list");
const filterInput = document.getElementById("filter-input");
const template = document.getElementById("exercise-item-template");

const totalWorkoutsEl = document.getElementById("total-workouts");
const uniqueExercisesEl = document.getElementById("unique-exercises");
const totalVolumeEl = document.getElementById("total-volume");

const state = {
  exercises: loadExercises(),
  filter: "",
};

initializeFormDate();
render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const entry = {
    id: crypto.randomUUID(),
    name: String(formData.get("name") || "").trim(),
    date: String(formData.get("date") || ""),
    sets: Number(formData.get("sets")),
    reps: Number(formData.get("reps")),
    weight: Number(formData.get("weight")),
    notes: String(formData.get("notes") || "").trim(),
  };

  if (!entry.name || !entry.date || entry.sets <= 0 || entry.reps <= 0 || entry.weight < 0) {
    return;
  }

  state.exercises.unshift(entry);
  saveExercises(state.exercises);
  form.reset();
  initializeFormDate();
  render();
});

filterInput.addEventListener("input", () => {
  state.filter = filterInput.value.trim().toLowerCase();
  render();
});

function render() {
  renderSummary();
  renderList();
}

function renderSummary() {
  totalWorkoutsEl.textContent = String(state.exercises.length);

  const uniqueNames = new Set(state.exercises.map((item) => item.name.toLowerCase()));
  uniqueExercisesEl.textContent = String(uniqueNames.size);

  const volume = state.exercises.reduce(
    (sum, item) => sum + item.sets * item.reps * item.weight,
    0,
  );
  totalVolumeEl.textContent = formatNumber(volume);
}

function renderList() {
  list.innerHTML = "";

  const filtered = state.exercises.filter((item) =>
    item.name.toLowerCase().includes(state.filter),
  );

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No exercises yet. Add one above to start tracking.";
    list.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);

    node.querySelector(".exercise-name").textContent = item.name;
    node.querySelector(".exercise-meta").textContent =
      `${item.date} • ${item.sets} sets × ${item.reps} reps @ ${item.weight} kg`;

    const notes = node.querySelector(".exercise-notes");
    if (item.notes) {
      notes.textContent = `Notes: ${item.notes}`;
    } else {
      notes.remove();
    }

    node.querySelector("button").addEventListener("click", () => {
      state.exercises = state.exercises.filter((record) => record.id !== item.id);
      saveExercises(state.exercises);
      render();
    });

    list.appendChild(node);
  });
}

function initializeFormDate() {
  const dateInput = form.elements.namedItem("date");
  if (dateInput) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
}

function loadExercises() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveExercises(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Math.round(value));
}

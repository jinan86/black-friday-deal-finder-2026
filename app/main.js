// Friday Finds: hash routing + live filtering.
//   #/            the board, with search and filters
//   #/deal/<id>   one deal
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.
import { deals } from "./data.js";
import { board, detail, missing, applyFilters, card } from "./views.js";

const app = document.getElementById("app");

const state = { q: "", category: "All", store: "All stores", minOff: 0, sort: "discount" };

function rerenderGrid() {
  const grid = document.getElementById("grid");
  const count = document.getElementById("count");
  if (!grid || !count) return;
  const list = applyFilters(state);
  grid.innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="empty">No deals match those filters. Try clearing the search or lowering the discount bar.</p>`;
  count.textContent = `Showing ${list.length} of ${deals.length} deals`;
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Deal not found"} | Friday Finds`;
    app.innerHTML = found ? detail(found) : missing();
  } else {
    document.title = "Friday Finds — Black Friday Deal Finder 2026";
    app.innerHTML = board(state);
    const q = app.querySelector("#q");
    const store = app.querySelector("#store");
    const minoff = app.querySelector("#minoff");
    const sort = app.querySelector("#sort");
    q.addEventListener("input", () => {
      state.q = q.value;
      rerenderGrid();
    });
    store.addEventListener("change", () => {
      state.store = store.value;
      rerenderGrid();
    });
    minoff.addEventListener("change", () => {
      state.minOff = Number(minoff.value);
      rerenderGrid();
    });
    sort.addEventListener("change", () => {
      state.sort = sort.value;
      rerenderGrid();
    });
    app.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.category = chip.dataset.cat;
        app.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === chip));
        rerenderGrid();
      });
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();

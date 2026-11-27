// Views for Friday Finds: the deal board (list) and one deal (detail).
// Pure string builders — no network, no side effects.
import { deals, money, pctOff, verdict } from "./data.js";

export const CATEGORIES = [...new Set(deals.map((d) => d.category))].sort();
export const STORES = [...new Set(deals.map((d) => d.store))].sort();

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function card(d) {
  const p = pctOff(d);
  return `<article class="card" data-id="${d.id}">
    <div class="card-top">
      <span class="cat">${esc(d.category)}</span>
      <span class="verdict v${p >= 50 ? "strong" : p >= 30 ? "good" : p >= 20 ? "solid" : "modest"}">${verdict(d)}</span>
    </div>
    <h3><a href="#/deal/${d.id}">${esc(d.title)}</a></h3>
    <p class="store">${esc(d.store)}</p>
    <p class="price"><span class="now">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="off">−${p}%</span></p>
    <p class="save">You save ${money(d.was - d.price)}</p>
    <p class="meta">Checked ${esc(d.checked.slice(0, 10))} · ${esc(d.source)}</p>
    <p class="actions">
      <a class="btn detail" href="#/deal/${d.id}">Details</a>
      <a class="btn store-link" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a>
    </p>
  </article>`;
}

export function board(state) {
  const list = applyFilters(state);
  const best = [...deals].sort((a, b) => pctOff(b) - pctOff(a))[0];
  const counts = CATEGORIES.map(
    (c) => `<li><span>${esc(c)}</span><b>${deals.filter((d) => d.category === c).length}</b></li>`,
  ).join("");
  const storeCounts = STORES.map(
    (s) => `<li><span>${esc(s)}</span><b>${deals.filter((d) => d.store === s).length}</b></li>`,
  ).join("");
  const chips = ["All", ...CATEGORIES]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? " on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`,
    )
    .join("");
  const storeOpts = ["All stores", ...STORES]
    .map(
      (s) =>
        `<option value="${esc(s)}"${state.store === s ? " selected" : ""}>${esc(s)}</option>`,
    )
    .join("");
  const discOpts = [
    ["0", "Any discount"],
    ["20", "20% off or more"],
    ["30", "30% off or more"],
    ["50", "50% off or more"],
  ]
    .map(
      ([v, label]) =>
        `<option value="${v}"${String(state.minOff) === v ? " selected" : ""}>${label}</option>`,
    )
    .join("");
  const sortOpts = [
    ["discount", "Biggest discount"],
    ["price", "Lowest price"],
    ["az", "A–Z"],
  ]
    .map(
      ([v, label]) =>
        `<option value="${v}"${state.sort === v ? " selected" : ""}>${label}</option>`,
    )
    .join("");
  const rows = list.length
    ? list.map(card).join("")
    : `<p class="empty">No deals match those filters. Try clearing the search or lowering the discount bar.</p>`;
  return `
  <section class="stats" aria-label="Board summary">
    <div><b>${deals.length}</b><span>deals checked</span></div>
    <div><b>${CATEGORIES.length}</b><span>categories</span></div>
    <div><b>${STORES.length}</b><span>stores</span></div>
    <div><b>−${pctOff(best)}%</b><span>best cut: ${esc(best.title)}</span></div>
  </section>
  <section class="controls" aria-label="Search and filters">
    <label class="search">Search deals
      <input id="q" type="search" placeholder="Try “headphones”, “Amazon”, “Kitchen”…" value="${esc(state.q)}" autocomplete="off">
    </label>
    <div class="chips" role="group" aria-label="Category">${chips}</div>
    <div class="selects">
      <label>Store <select id="store">${storeOpts}</select></label>
      <label>Discount <select id="minoff">${discOpts}</select></label>
      <label>Sort <select id="sort">${sortOpts}</select></label>
    </div>
  </section>
  <p class="count" id="count" aria-live="polite">Showing ${list.length} of ${deals.length} deals</p>
  <section class="grid" id="grid">${rows}</section>
  <section class="breakdown">
    <div><h2>By category</h2><ul>${counts}</ul></div>
    <div><h2>By store</h2><ul>${storeCounts}</ul></div>
    <div><h2>How this board works</h2>
      <p>Every price on this page was read from a named deals roundup on 27 November 2026 and
      written down with its source and check time. Prices move during Black Friday week —
      always confirm the price at the store before you buy. This board earns nothing from
      clicks and takes no commission.</p></div>
  </section>`;
}

export function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  let list = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All stores" && d.store !== state.store) return false;
    if (pctOff(d) < state.minOff) return false;
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  if (state.sort === "price") list = [...list].sort((a, b) => a.price - b.price);
  else if (state.sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else list = [...list].sort((a, b) => pctOff(b) - pctOff(a));
  return list;
}

export function detail(d) {
  const p = pctOff(d);
  const others = deals
    .filter((x) => x.category === d.category && x.id !== d.id)
    .slice(0, 3);
  return `
  <p class="crumb"><a href="#/">← All deals</a></p>
  <article class="detail">
    <div class="card-top">
      <span class="cat">${esc(d.category)}</span>
      <span class="verdict v${p >= 50 ? "strong" : p >= 30 ? "good" : p >= 20 ? "solid" : "modest"}">${verdict(d)}</span>
    </div>
    <h2>${esc(d.title)}</h2>
    <p class="store">${esc(d.store)}</p>
    <p class="price big"><span class="now">${money(d.price)}</span>
      <span class="was">${money(d.was)}</span>
      <span class="off">−${p}%</span></p>
    <p class="save">You save ${money(d.was - d.price)} off the usual ${money(d.was)} price.</p>
    ${d.note ? `<p class="note">${esc(d.note)}</p>` : ""}
    <dl class="facts">
      <div><dt>Store</dt><dd>${esc(d.store)}</dd></div>
      <div><dt>Category</dt><dd>${esc(d.category)}</dd></div>
      <div><dt>Sale price</dt><dd>${money(d.price)}</dd></div>
      <div><dt>Usual price</dt><dd>${money(d.was)}</dd></div>
      <div><dt>Discount</dt><dd>${p}% off</dd></div>
      <div><dt>Checked</dt><dd>${esc(d.checked.replace("T", " ").replace("Z", " UTC"))}</dd></div>
      <div><dt>Source</dt><dd>${esc(d.source)}</dd></div>
    </dl>
    <p class="actions">
      <a class="btn store-link" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a>
      <a class="btn detail" href="#/">Back to all deals</a>
    </p>
    <p class="fine">Prices were checked on 27 November 2026 and can change. Confirm the price at the store before buying.</p>
    ${
      others.length
        ? `<h3>More in ${esc(d.category)}</h3><div class="grid">${others.map(card).join("")}</div>`
        : ""
    }
  </article>`;
}

export function missing() {
  return `<p class="empty">That deal is not on this board. <a href="#/">See all deals</a>.</p>`;
}

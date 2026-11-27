![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/jinan86/black-friday-deal-finder-2026/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/jinan86/black-friday-deal-finder-2026/reward.svg)

# Friday Finds — Black Friday Deal Finder 2026

A Black Friday deal finder for the [make.fun bounty](https://make.fun/bounty/black-friday-deal-finder-01): 24 real Black Friday 2026 deals across 11 categories and 7 stores, each with its sale price, usual price, discount, store link, the source where the price was read, and the time it was checked.

## How deals were checked

Every deal on this board was read by hand on **Friday 27 November 2026** from a named deals roundup that states the store and the price — Bee Bulletin's Black Friday tech deals, Tom's Guide's "30 Black Friday deals under $30", Topsave's Black Friday 2026 deals page, and USA TODAY's best Black Friday sales roundup. No deal was copied from another entry or invented. Prices move during Black Friday week, so the board shows the check time on every card and tells shoppers to confirm the price at the store before buying.

## What it does

- Live search across product, store and category
- Category chips, store dropdown, minimum-discount filter (20%+ / 30%+ / 50%+), and sorting by biggest discount, lowest price, or A–Z
- A plain-language verdict per deal (STRONG DEAL / GOOD DEAL / SOLID DEAL / MODEST) based only on how deep the cut is
- A detail page for every deal (`#/deal/<id>`) with the full facts, source and check time
- Summary stats computed from the deals: counts by category and store, best discount
- Phone layout: single column, big tap targets, filters usable at 390 px wide

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests: `app/` is plain static files (`index.html`, `style.css`, `main.js`, `views.js`, `data.js`).

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## License

MIT — see [LICENSE](LICENSE).

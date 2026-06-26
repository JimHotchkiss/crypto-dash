# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test runner configured in this project.

## Environment

API endpoints come from environment variables read via `import.meta.env` (Vite convention — they must be prefixed `VITE_`). They are defined in `.env`:

- `VITE_COINS_API_URL` — CoinGecko markets list endpoint (used for the home page coin list)
- `VITE_COIN_API_URL` — CoinGecko coin base endpoint (used for coin details and chart data; the code appends `/:id` and `/:id/market_chart`)

Data comes from the public [CoinGecko API](https://www.coingecko.com/). The free tier is rate-limited, so expect occasional fetch failures that surface as the in-app error state.

## Architecture

React 19 + Vite SPA. Routing is via `react-router` v7, set up in `src/main.jsx` (`BrowserRouter`) and `src/App.jsx` (`Routes`). Routes: `/` (home), `/about`, `/coin/:id` (details), `*` (not found).

State and data fetching are split deliberately:

- **Home list state lives in `App.jsx`, not the home page.** `App` owns `coins`, `loading`, `error`, `limit`, `filter`, and `sortBy`, fetches the coin list (re-fetching whenever `limit` changes), and passes everything down to `HomePage` as props. `HomePage` is presentational — it does the client-side filtering (by name/symbol) and sorting (the `sortBy` switch) on the already-fetched array, then renders the `CoinCard` grid plus the control components (`FilterInput`, `LimitSelector`, `SortSelector`).
- **Detail and chart pages fetch their own data.** `CoinDetailsPage` (`src/pages/coin-details.jsx`) reads `:id` via `useParams`, fetches the full coin object, and renders deeply nested CoinGecko fields (`coin.market_data.*`, `coin.links.*`). `CoinChart` (`src/components/CoinChart.jsx`) is a self-contained child that independently fetches 7-day `market_chart` prices for its `coinId`.

Each component that fetches owns its own `loading`/`error` state and renders the shared `Spinner` (react-spinners) while pending.

Charts use Chart.js via `react-chartjs-2`; `CoinChart` must `ChartJS.register(...)` the scales/elements it uses, and relies on `chartjs-adapter-date-fns` for the time-scale x-axis.

When adding a new sort option, update both the `<SortSelector>` options and the `switch` in `HomePage` — they are kept in sync manually.

/commit-msg Skill test
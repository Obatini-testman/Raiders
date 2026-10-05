# Baseline — Basketball Season Tracker

A mobile-first, local-first basketball season tracker built with plain HTML, CSS, and JavaScript. No build step or package installation is required.

## Run it

Open `index.html` in a modern browser. Data is saved in that browser's local storage. Use **More → Export backup** to download a complete JSON backup, and **Import backup** to restore one.

The initial season is marked as sample data and is for preview. It includes two teams, example players, and games. **More → Reset sample data** restores that sample set.

## Checks

Run the calculation and parser tests with `npm test` (Node.js test runner; there are no installed dependencies).

## What is included

- Dashboard, Games, Statistics, Players, and More views, with mobile navigation.
- Game entry for either team, home/away venue, scores, notes, line score paste, participation status, and home table duty.
- Paste parsing for whitespace, multiple spaces, tabs, hyphens, and comma separated lines.
- Unknown-name review with likely player suggestions; no fuzzy match is accepted silently.
- Derived team and player stats, player profiles and game histories, per-team breakdowns, and attendance reporting.
- Player, team, season, and table-duty contributor management.
- JSON backup import with validation and preview; importing replaces the current browser data.
- Extensible stat types in the stored model; the current entry UI exposes points and fouls.

## Data model

Games contain team and season references, scores, participation records, and table-duty contributor IDs. Players are global and have no permanent team assignment. Each appearance stores a participation status and a `stats` object keyed by stat name, so future values such as rebounds or assists can be added without changing the relationships. Results, records, points totals, averages, and percentages are calculated from games and appearances.

This MVP stores data only in the current browser profile. It does not sync between devices or provide an account/cloud database. Keep a JSON backup when moving browsers or devices.

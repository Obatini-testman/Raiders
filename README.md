# Harrogate Raiders Basketball Season Tracker

A mobile-first basketball season tracker built with plain HTML, CSS and JavaScript. It can run locally, or use Supabase for a shared public-read/admin-write tracker across phones and computers.

## Set up shared access

The site can be public while game entry stays limited to the tracker admin. Supabase Row Level Security enforces this in the database, not only in the page controls. Anyone who can access the site can read the game data, so do not store private or sensitive information in it.

1. Create a Supabase project and create an Auth user for the admin. Disable public sign-ups in the Supabase Auth settings; create/invite only your own admin account.
2. Run `supabase-schema.sql` in the Supabase SQL Editor. It is configured for `rossetherington25@gmail.com` as the only admin writer.
3. In Supabase project settings, copy the Project URL and the browser-safe publishable key. Put these and the same admin email in `supabase-config.js` (`supabaseUrl`, `publishableKey`, and `adminEmail`). These values are public browser configuration. **Never use a `service_role` or secret key in this file.**
4. Publish the site from the repository root, for example with GitHub Pages. The Supabase project must allow requests from the site's origin in its Auth URL configuration.
5. Open the site, sign in with **Admin sign in**, and use **More → Import backup** to load your existing tracker JSON if you have one. The first admin visit initializes the shared row with the sample data when it does not exist. Export a backup before importing because import replaces all shared tracker data.

Visitors can view the shared tracker without signing in. Only the configured admin email can insert/update the shared record. The database does not grant delete access. Keep a downloaded JSON backup regularly.

## Run locally

Open `index.html` in a modern browser. If `supabase-config.js` is empty, the app runs in local-only mode and saves data in that browser's local storage. Local-only changes do not sync to other devices.

## Features

- Dashboard, Games, Statistics, Players, and More views with mobile navigation.
- Game entry for either team, home/away venue, scores, notes, player line scores, participation status, and home table duty.
- Paste parsing for whitespace, multiple spaces, tabs, hyphens, and comma-separated lines.
- Unknown-name review with likely player suggestions; no fuzzy match is accepted silently.
- Derived team/player stats, player profiles and game histories, per-team breakdowns, and attendance reporting.
- Player, team, season, and table-duty contributor management.
- Validated JSON backup import with preview and export.

## Checks

Run the calculation and parser tests with `npm test` (Node.js test runner; no installed dependencies).

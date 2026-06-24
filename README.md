# Amazon iNOPs · Task Tracker

A lightweight, shareable task-management tool for the **Amazon iNOPs implementation sprint (24 Jun – 6 Jul 2026)**.
Built as a single static web app — no server, no build step — so it can be hosted free on **GitHub Pages** and shared with the Amazon team via a link.

## Features
- **Create & edit tasks** — title, date, owner, workstream, status, notes
- **Status checklist** — mark tasks `Not Started → In Progress → Done → Blocked`; tick the checkbox to complete
- **Dashboard** — totals, % complete donut, and progress by workstream and owner
- **Day-wise plan** — every day 24 Jun → 6 Jul with its tasks (weekends shown as rest days)
- **Export / Import JSON** — back up or share the current task set
- **Amazon theme** — Squid Ink + Amazon Orange

## Data & sharing
Tasks are stored in the browser via `localStorage`, so each person's edits stay on their own device.
To share a common set of tasks, use **Export JSON** and send the file; others use **Import JSON**.
The default plan lives in [`js/seed.js`](js/seed.js) and can be restored anytime with **Reset to plan**.

## Run locally
Just open `index.html` in a browser. (No dependencies.)

## Publish on GitHub Pages
1. Push this folder to a GitHub repository.
2. Repo **Settings → Pages → Build and deployment → Source: `Deploy from a branch`**, branch `main`, folder `/ (root)`.
3. Your shareable link will be: `https://<your-username>.github.io/<repo-name>/`

## Tech
Plain HTML, CSS and vanilla JavaScript. No frameworks, no external requests — fully self-contained.

---
© 2026 · Built for Dhwani × Amazon iNOPs. MIT licensed.

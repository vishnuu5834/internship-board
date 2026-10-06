# Responsive Internship Board

An accessible internship listing interface that works on mobile, tablet and desktop. Built with plain HTML, CSS and JavaScript, with no framework.

**Live preview:** _add your deployed URL here_

## Features
- Semantic HTML: `header`, `main`, `search` form, `article` cards, `dl` metadata
- Reusable card renderer (`createCard`) driven by `internships.json`
- Search by title, company, location or skill, plus a domain filter
- Loading, empty and error states (with a Try again button)
- Keyboard support: skip link, visible focus rings, `/` focuses search, `Esc` clears search, Save buttons use `aria-pressed`
- Labeled form controls and a live status region (`aria-live`) announcing result counts
- Responsive grid: 1 column (mobile), 2 (tablet ≥640px), 3 (desktop ≥1000px)
- Respects `prefers-reduced-motion`

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
(A local server is needed because the data is loaded with `fetch`.)

## Project structure
```
index.html        page structure
styles.css        responsive styles
app.js            data loading, filtering, rendering
internships.json  sample (fictional) internship records
```

## Deploy (GitHub Pages)
Repo → Settings → Pages → Deploy from branch → `main` / root.

## Screenshots
Add screenshots to a `screenshots/` folder and link them here:
- `screenshots/mobile.png`
- `screenshots/tablet.png`
- `screenshots/desktop.png`
- `screenshots/empty-state.png`
- `screenshots/error-state.png`

# Gym Exercise Tracker

A lightweight single-page app for gym users to log exercises and monitor progress.

## Features

- Add exercise entries with date, sets, reps, weight, and notes
- View workout summary metrics:
  - total workouts
  - unique exercises
  - total volume (sets × reps × weight)
- Filter history by exercise name
- Delete workout entries
- Persistent storage with browser `localStorage`

## Run locally

Because this app uses plain HTML/CSS/JS, you can open `index.html` directly in your browser.

Or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

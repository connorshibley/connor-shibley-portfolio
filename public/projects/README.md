# How to add photos to your projects

Each project has its own folder below. Drop images inside and they'll show up in the expanded project gallery on the site — no code changes needed as long as the filenames match `01.jpg`, `02.jpg`, `03.jpg`.

## Folders
- `projects/hws-literacy/`        — HWS AI Literacy Course
- `projects/cst-dashboard/`       — CST Logistics Dashboard QA
- `projects/ai-bootcamp/`         — AI Club Bootcamp
- `projects/weekly-digest/`       — AI Club Weekly Digest
- `projects/linkedin-analytics/`  — Licom LinkedIn Analytics
- `projects/literacy-guide/`      — Campus AI Literacy Guide

## Filenames
Each folder expects:
- `01.jpg`  → first tile (leftmost)
- `02.jpg`  → second tile (middle)
- `03.jpg`  → third tile (rightmost)

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`. If you use a different extension, update the filename in `components.jsx` under the matching project's `photos` array.

## Adding more than 3 photos per project
Open `components.jsx`, find the project's `photos: [...]` array, and add more entries like:
```
{ src: 'projects/hws-literacy/04.jpg', cap: 'Another caption here' }
```

## Captions
The caption under each photo lives in the same `photos` array as the `cap` field. Edit it there anytime.

## If a photo is missing
Tiles with no file show a "IMG · MISSING" placeholder. Just drop the file in and refresh.

# Ikea Kreativ-Inspired Room Designer (1-week Prototype)

🚀 [Live Demo](https://ikea-project-nine.vercel.app/)

This was built as a 1-week proof-of-concept prototype inspired by Ikea Kreativ. While the project didn't continue, I decided to open-source it as a portfolio artifact.

## Highlights
- Room templates and custom image backgrounds
- Place 3D furniture models in the scene
- Move/rotate with snapping and bounds; keyboard shortcuts (M/R, Delete, Undo/Redo)
- Local save/load (no backend) + share link + JSON export + screenshot
- Camera presets (Front/Left/Iso/Reset) and Fit-to-Scene
- Performance overlay toggle
- Bill of Materials: item prices, live subtotal, CSV export

## Tech Stack

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=fff" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white" />
  <img alt="React Three Fiber" src="https://img.shields.io/badge/React%20Three%20Fiber-000?logo=react&logoColor=61DAFB" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-000?logo=react&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white" />
</p>

- Next.js (App Router) for UI and bundling
- React Three Fiber + Drei for 3D
- Three.js under the hood
- Zustand for state management
- Tailwind for UI styling
- postprocessing (Outline) for selection feedback

## Getting Started

Requirements: Node 18+

```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:3000`.

## How to Use
- Templates: open “Room Templates”, pick one.
- Upload: use “Upload Image” to design on your own room photo.
- Furniture: add items from the library; click to select.
- Move/Rotate: press M for Move (translate), R for Rotate; drag gizmos.
- Delete: select an item, press Delete/Backspace.
- Undo/Redo: Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z; buttons in sidebar.
- Snap/Bounds: items snap to grid and clamp to a plane.
- Save/Load: Save to localStorage; Load from localStorage.
- Share/Export: Copy Share Link, Download JSON, Screenshot.
- Camera: Front/Left/Iso/Reset + Fit-to-Scene.
- Performance: toggle overlay in sidebar.
- BOM: live subtotal and CSV export in sidebar.

## Notes & Scope
- Frontend-only prototype. No authentication or backend persistence.
- 3D models are simple placeholders under `public/3d-models`.
- Designed to be easily extended with backend APIs later (projects, catalog, templates).

## License
MIT. Use at your own risk.

# CampusSphere — Modern Frontend Frameworks Project

CampusSphere is a responsive student productivity and campus-life dashboard built with **React 18, Vite, React Router and modern CSS**.

## Features
- Dashboard with task statistics, completion progress and upcoming campus events
- Task manager: add, complete, filter and delete tasks
- Campus event planner: add events and filter by category
- Curated learning resources with external links
- Search across the active page
- Dark/light theme toggle
- Responsive sidebar and layouts for desktop, tablet and mobile
- Persistent data using browser `localStorage`
- Reusable React components, hooks, routing and controlled forms

## Requirements
- Node.js 18 or later
- npm

## Run locally
1. Extract the ZIP file.
2. Open the extracted `CampusSphere_MFEF_Project` folder in VS Code.
3. Open Terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```
The optimized production files are generated in the `dist` folder.

## Project structure
```text
CampusSphere_MFEF_Project/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── PROJECT_REPORT.md
└── src/
    ├── App.jsx
    ├── data.js
    ├── main.jsx
    └── styles.css
```

## Notes
- The project is a frontend demonstration. It does not include a server-side database or authentication service.
- Tasks, events and theme preference are stored in the browser's local storage on the device/browser used.
- The sample dashboard date and initial sample data are set to November 2026 for the academic demonstration. You can edit sample data in `src/data.js`.

## Suggested demonstration sequence
1. Show the responsive dashboard and statistics.
2. Add a task, change its status, filter it and delete it.
3. Add a campus event and filter event categories.
4. Search for a task or resource.
5. Switch between dark and light themes.
6. Refresh the page to demonstrate local persistence.
7. Run `npm run build` to demonstrate production bundling.

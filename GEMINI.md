# DistillLearn (AI Learning Assistant) - Development Guide

## Project Overview
DistillLearn is an AI-powered study platform that optimizes long-term retention using the FSRS (Free Spaced Repetition Scheduler) algorithm. It generates study plans, flashcards, and notes from user materials (PDFs or prompts).

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v3, React Router v7, Axios, Lucide React, React Markdown.
- **Backend:** Node.js, Express 5 (ESM), MongoDB (Mongoose), Google GenAI (Gemini 2.5 Flash-Lite), `ts-fsrs`, Multer.
- **Deployment:** Vercel (Frontend), Vercel/Node.js (Backend).

## Architecture & Conventions

### Backend
- **Pattern:** Controller-Model-Route architecture.
- **Module System:** ES Modules (`import`/`export`).
- **Entry Point:** `backend/server.js`.
- **Database:** Mongoose schemas in `backend/models/`.
- **API Routes:** Defined in `backend/routes/`, prefixed with `/api`.
- **Error Handling:** Centralized middleware in `backend/middleware/errorHandler.js`.
- **AI Integration:** Centralized in `backend/utils/geminiService.js`. Uses structured JSON outputs with `responseSchema`.
- **Validation:** `express-validator` used in routes/controllers.
- **Naming:** 
  - Routes: `plural-kebab-case` (e.g., `/api/study-plans`).
  - Controllers/Files: `camelCase.js`.
  - Models: `PascalCase.js`.

### Frontend
- **Framework:** React 19 (Functional Components, Hooks).
- **Styling:** Tailwind CSS v3 with a custom theme in `tailwind.config.js`.
- **Routing:** React Router v7 (Data Router pattern preferred, though currently using `<Routes>`).
- **State Management:** React Context API for Authentication (`AuthContext.jsx`).
- **API Layer:** Axios instance in `src/utils/axiosInstance.js`. Services in `src/services/` handle API calls.
- **Components:** 
  - `src/components/common/ui.jsx` contains shared UI primitives.
  - Page-level components in `src/pages/`.
- **Naming:**
  - Components/Folders: `PascalCase`.
  - Services/Utils: `camelCase.js`.

## Workflows

### Local Development
1. **Backend:** 
   ```bash
   cd backend
   npm run dev
   ```
   Requires a `.env` file with `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Runs on `http://localhost:5173` by default.

### Coding Standards
- **Surgical Updates:** Always prefer targeted changes over large refactors.
- **AI-First:** When modifying Gemini prompts, maintain the structured JSON response pattern.
- **Responsiveness:** Ensure all new UI components are responsive using Tailwind's utility classes.
- **Validation:** Always validate request bodies on the backend using `express-validator`.

## Key Files & Directories
- `backend/utils/geminiService.js`: Core AI logic.
- `backend/models/StudyPlan.js`: Primary data structure for learning paths.
- `frontend/src/context/AuthContext.jsx`: User session management.
- `frontend/src/components/common/ui.jsx`: Reusable UI elements.

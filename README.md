# DistillLearn

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blueviolet.svg)](https://ai.google.dev/)
[![FSRS](https://img.shields.io/badge/Spaced_Repetition-ts--fsrs-orange.svg)](https://github.com/open-spaced-repetition/ts-fsrs)

---

## The Problem That Started This

Before exams, I had three tabs open at all times: ChatGPT for notes, YouTube for video explanations, and whatever note-taking tool I was using that week. Switching between them constantly broke focus. Half the time the YouTube video was bad, ChatGPT gave me a wall of text with no structure, and by the time I understood a topic I had already forgotten the previous one.

**DistillLearn collapses all of that into one page.**

For every topic in your study plan, you get:
- **AI-generated study notes** — streamed live to the page as they're written, structured to the topic's actual nature (exam-focused for theory, skill-focused for practical subjects).
- **Curated YouTube embeds** — fetched and ranked automatically, embedded directly so you never leave the page.
- **Flashcards** — extracted from the notes themselves and scheduled via the FSRS algorithm.

You study, watch, and review in a single focused workspace.

---

## How It Works

### 1. Create a Study Plan

Feed DistillLearn your material in any of three ways:

| Source | What you provide | How it's processed |
|---|---|---|
| **PDF** | Upload a PDF (syllabus, notes, textbook chapter) | `pdf-parse` extracts text → Gemini parses it into discrete topics |
| **Syllabus text** | Paste raw outline or syllabus text | Gemini extracts clean, searchable topic names |
| **AI Prompt** | Describe what you want to learn | Gemini generates a progressive 8–18 topic roadmap from fundamentals up |

Gemini (`gemini-2.5-flash`) returns structured JSON for each topic: a name and a realistic study-hours estimate.

### 2. Review and Edit Topics in the Syllabus Builder

Before committing, you see every AI-generated topic. Add, remove, rename, or adjust estimated hours. Only after you confirm does the plan get saved and starter flashcards get created.

### 3. Study a Topic — Everything on One Page

When you open a topic, a single two-column workspace loads:

**Left column — Study Notes (8/12 width)**
- If notes haven't been generated yet, the backend immediately initiates a **Server-Sent Events (SSE) stream**.
- Notes are written by Gemini and rendered token-by-token using `react-markdown` with full support for LaTeX math (`$` inline, `$$` block via KaTeX), syntax-highlighted code blocks, GFM tables, and blockquotes.
- State updates are throttled to 50ms for smooth rendering without CPU spikes.
- Once the stream completes, notes are persisted to MongoDB so subsequent visits are instant.

**Right column — Video Explanations & Mastery (4/12 width)**
- Video fetching runs **in parallel** with note generation using `yt-search`.
- The Video Scoring Engine ranks results by: trusted channel match (+2 pts: Neso Academy, Khan Academy, MIT OCW, CrashCourse, Gate Smashers), title relevance (+1 pt), then by view count as a tiebreaker.
- Top 3 videos are embedded as iframes — no tab switching required.
- A retention rate bar shows your FSRS mastery progress for this specific topic.

### 4. Flashcard Review (FSRS)

After generating notes, Gemini runs a second pass to extract up to 10 high-value flashcards from the content. These are merged with the 2 "starter" cards created when the plan was first saved.

Reviews use the **ts-fsrs v5** scheduler with the standard four-button rating system:
- **Again** — forgotten, restart interval
- **Hard** — remembered with effort
- **Good** — clean recall
- **Easy** — effortless

The scheduler calculates the exact next review date based on each card's stability and difficulty parameters — not a fixed box system.

Every review is logged to a `ReviewLog` collection, enabling the dashboard to compute streaks, retention trends, and heatmaps without client-side calculations.

### 5. Dashboard

The dashboard gives you a truthful picture of your learning:

- **Due today** count and trend vs. yesterday
- **Current streak** and longest streak (calculated from `ReviewLog` dates)
- **Retention rate** overall and week-over-week delta
- **GitHub-style heatmap** — shows review intensity by day, click any day to see which topics you reviewed
- **Per-subject breakdowns** — due cards and progress percentage for each study plan

---

## Tech Stack

### Frontend
| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router 7 |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v3 (custom design tokens) |
| Markdown | `react-markdown` + `remark-gfm` + `remark-math` |
| Math | KaTeX via `rehype-katex` |
| Code highlighting | `react-syntax-highlighter` (vscDarkPlus theme) |
| HTTP client | Axios |
| Toasts | `react-hot-toast` |
| Analytics | `@vercel/analytics` |

### Backend
| Layer | Tech |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose |
| Auth | JWT (HTTP-only cookies) + bcrypt |
| AI | `@google/genai` — Gemini 2.5 Flash |
| FSRS | `ts-fsrs` v5 |
| YouTube | `yt-search` + custom scoring engine |
| PDF | `pdf-parse` |
| File uploads | Multer |
| Validation | `express-validator` |

### Database Models

| Model | Purpose |
|---|---|
| `User` | Auth, OTP email verification |
| `StudyPlan` | Subject, topics array, exam date, source type |
| `TopicContent` | Cached notes, video, flashcards per topic key |
| `Flashcard` | Per-user FSRS card state (stability, difficulty, due date, etc.) |
| `ReviewLog` | Immutable log of every review for analytics |

---

## Architecture Notes

**Topic keys** are deterministic slugs (`subjectName:topicName` normalized), shared between `StudyPlan.topics`, `TopicContent`, and `Flashcard` records. This allows topic content to be cached globally (one generation serves all users who study the same topic) while flashcard progress remains per-user.

**Content generation flow:**
1. First request → backend acquires a DB lock (`status: generating`), immediately sets cache to `ready` with empty notes to unblock the frontend.
2. Frontend detects empty notes → opens SSE stream.
3. Notes stream in; video fetching runs in parallel; both saved to MongoDB on completion.
4. Flashcard extraction from notes runs as a fire-and-forget background task after the stream ends.

**Multi-key Gemini support:** `GEMINI_API_KEYS` accepts a comma-separated list of API keys. The backend round-robins requests across them to stay under per-key rate limits.

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Setup

```bash
git clone https://github.com/yourusername/distilllearn.git
cd distilllearn
```

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
# Optional: comma-separated for round-robin load balancing
# GEMINI_API_KEYS=key1,key2,key3
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

**Frontend:**
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## Roadmap

- [ ] Stripe integration for Pro tier
- [ ] User credit system for AI usage
- [ ] RAG: PDF-to-notes with source citations
- [ ] React Native mobile app
- [ ] Public plan sharing and community library

---

*Built to stop switching tabs during exam prep.*

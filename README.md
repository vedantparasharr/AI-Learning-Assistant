# DistillLearn - AI-Powered Spaced Repetition Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![ts-fsrs](https://img.shields.io/badge/Spaced_Repetition-FSRS-orange.svg)](https://github.com/open-spaced-repetition/ts-fsrs)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-blueviolet.svg)](https://ai.google.dev/)

DistillLearn is a high-performance, strictly professional learning environment that bridges the gap between passive reading and active recall. By leveraging Google Gemini's advanced generative AI and the scientifically proven FSRS (Free Spaced Repetition Scheduler) algorithm, DistillLearn transforms dense study materials into actionable, structured learning paths with zero friction.

## 🚀 The Core Philosophy

Most learning applications suffer from two critical flaws: they force you to manually create every single flashcard (excessive friction), or they use primitive "box-style" scheduling (inefficient review times). Furthermore, many platforms are plagued by distracting gamification and busy UIs.

**DistillLearn solves these problems by focusing on three pillars:**
1. **Intelligent Ingestion:** It uses AI to **distill** your PDFs, raw notes, or simple prompts into logical topics and starter flashcards automatically.
2. **Mathematical Optimization:** It implements the modern gold-standard **FSRS algorithm** to schedule your reviews at the mathematically optimal time, maximizing long-term memory retention.
3. **The "Scholar's Workbench" Design:** A strictly minimalist, expert-focused UI with deep indigos, cool alabasters, and muted teals. We prioritize contrast, readability (65–75ch line limits), and low cognitive overhead. No distractions, just study.

---

## 🛠️ Complete Technology Stack

### Frontend (The Workspace)
- **Framework:** React 19 & Vite for lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS integrated with a custom-defined design system (`DESIGN.md`).
- **Routing:** React Router 7.
- **State & Data Fetching:** `@tanstack/react-query` (v5) combined with standard React Hooks.
- **Markdown & Math:** `react-markdown`, `katex`, `rehype-katex`, and `remark-math` for precise rendering of technical notes.
- **UI Components:** Custom flat-by-default architecture, strict WCAG AA adherence.

### Backend (The Engine)
- **Server:** Node.js powered by the modern Express 5 framework.
- **Database:** MongoDB via Mongoose, utilizing advanced aggregation pipelines for high-performance dashboard statistics.
- **Authentication:** JWT (JSON Web Tokens) with secure HTTP-only cookies and bcrypt password hashing.
- **AI Integration:** `@google/genai` (Google Gemini SDK) for intelligent text distillation and structured JSON generation.
- **Algorithms:** `ts-fsrs` (Free Spaced Repetition Scheduler v5) to handle the complex review scheduling math.
- **File Handling:** `multer` for secure uploads and `pdf-parse` for stateless document extraction.
- **Video Curation:** `yt-search` combined with a custom scoring engine to fetch top educational content.

---

## ✨ Deep-Dive Features

### 1. Multi-Source Study Plan Generation
You can generate complete study plans from three distinct sources:
- **PDF Uploads:** The system performs stateless PDF processing with smart truncation to prevent payload bloating, ensuring the AI strictly focuses on the document's core context.
- **Raw Syllabus Text:** Paste any syllabus, and the AI parses it into a logical curriculum.
- **AI Prompts:** Simply ask to learn "Quantum Mechanics," and Gemini maps out a structured path.

### 2. Smart Video Curation & Scoring
Instead of generic YouTube results, DistillLearn employs a sophisticated **Video Scoring Engine** (`videoScoring.js`). It cross-references topic keywords with video metadata (view count, duration, trusted educational channels) to ensure only the highest-quality, most relevant explanations accompany your study material.

### 3. FSRS-Driven Active Recall
The core of the platform is the review system. Users interact with study cards using the standard "Again, Hard, Good, Easy" rating matrix. Behind the scenes, the `ts-fsrs` engine calculates the precise interval for the next review based on the latest memory science, drastically reducing study time while increasing retention.

### 4. High-Performance Analytics Dashboard
A data-driven overview of your learning journey:
- **GitHub-Style Heatmap:** Visually track your daily review activity.
- **Streak & Load Tracking:** Aggregations happen entirely at the database level, ensuring the app scales effortlessly as your review history grows.
- **Prioritized Queue:** The dashboard always highlights exactly what you need to study *today*.

### 5. Interactive Syllabus Builder
Before committing to a learning path, you can review and edit AI-generated topics, adjust estimated study hours, and manually curate the roadmap. This guarantees the AI acts as an assistant, not a dictator.

---

## 🏗️ Technical Architecture Highlights

- **Stateless Document Processing:** PDFs are parsed in memory and discarded. Text is intelligently chunked before being sent to the Gemini API, maintaining low overhead and fast response times.
- **Advanced Aggregation Pipelines:** The MongoDB backend handles complex queries (like calculating current streaks and daily loads) natively in the database, minimizing server memory usage.
- **Custom Design Tokens:** The frontend uses a deeply customized Tailwind config mapping to the "Scholar's Workbench" design philosophy—Primary: Deep Indigo (`#1a146b`), Neutral: Cool Alabaster (`#f8f9ff`).
- **Secure by Default:** Features robust input validation (`express-validator`), secure cookie handling, and CORS restrictions.

---

## 🏃 Getting Started (Local Development)

### Prerequisites
- Node.js v18+ (v20+ recommended)
- A running MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/distilllearn.git
   cd distilllearn
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

---

## 📈 Roadmap (SaaS-Ready)

- [ ] **Pro Subscriptions:** Integration with Stripe/Lemon Squeezy for premium tiers.
- [ ] **Credit System:** Granular tracking of AI compute usage per user.
- [ ] **RAG Implementation:** Direct PDF-to-Notes generation using advanced Retrieval-Augmented Generation.
- [ ] **Mobile App:** A React Native companion app for reviewing on the go.
- [ ] **Collaborative Hub:** One-click sharing and cloning of community-created study plans.

---
*DistillLearn — Built for scholars who value their time.*

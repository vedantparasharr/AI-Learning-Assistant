# DistillLearn - AI-Powered Spaced Repetition Platform

DistillLearn is a high-performance learning environment that bridges the gap between passive reading and active recall. By leveraging Gemini's advanced AI and the scientifically proven FSRS (Free Spaced Repetition Scheduler) algorithm, DistillLearn transforms dense study materials into actionable, structured learning paths.

## 🚀 The Core Philosophy

Most learning apps suffer from two problems: they either force you to manually create every single flashcard (too much friction), or they use primitive "box-style" scheduling (too inefficient).

DistillLearn solves both. It uses AI to **distill** your PDFs and notes into topics and starter flashcards, then uses the **FSRS algorithm** to schedule your reviews at the mathematically optimal time to ensure long-term retention.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router 7.
- **Backend:** Node.js (Express 5), MongoDB (Mongoose), JWT Auth.
- **AI Engine:** Google Gemini (Generative AI) with structured JSON output.
- **Algorithm:** [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) (The modern gold standard for Spaced Repetition).
- **Video Intelligence:** `yt-search` with a custom ranking & scoring engine.
- **Processing:** PDF-parse for document extraction, Multer for file handling.

## ✨ Key Features

- **Multi-Source Ingestion:** Generate study plans from PDFs, raw text syllabi, or AI prompts.
- **Smart Video Curation:** Automatically finds and ranks the best YouTube explanations for every topic using a custom **Video Scoring Engine** that considers keyword relevance, view count, video duration, and trusted educational channels.
- **FSRS-Driven Reviews:** Study cards using the "Again, Hard, Good, Easy" rating system, with intervals calculated by the latest memory science research.
- **Optimized Dashboard:** A clean, data-driven dashboard featuring a GitHub-style activity heatmap, streak tracking, and a prioritized daily review queue.
- **Interactive Syllabus Builder:** Review and edit AI-generated topics, adjust estimated study hours, and manage your learning roadmap before committing.
- **Collaborative Learning:** Share your study plans with a single click or clone plans created by others in the community.

## 🏗️ Technical Architecture Highlights

- **Video Scoring Engine:** A sophisticated utility (`videoScoring.js`) that ranks educational content by cross-referencing topic keywords with video metadata to ensure you only see the highest-quality explanations.
- **Optimized Aggregations:** The dashboard uses MongoDB Aggregation Pipelines to calculate streaks and metrics directly at the database level, ensuring scalability to millions of records.
- **Stateless PDF Processing:** Efficient text extraction with smart truncation to prevent payload bloating while preserving AI grounding.
- **Robust Security:** HTTP-only cookies, password hashing with bcrypt, and OTP email verification.

## 🏃 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance
- Google Gemini API Key

### Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/distilllearn.git
   cd distilllearn
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file (JWT_SECRET, GEMINI_API_KEY, MONGO_URI, etc.)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📈 Roadmap (SaaS-Ready)

- [ ] Stripe/Lemon Squeezy integration for Pro subscriptions.
- [ ] User credit system for AI-intensive tasks.
- [ ] Direct PDF-to-Notes generation using RAG.
- [ ] Mobile-native application using React Native.

---
*Built for scholars who value their time.*

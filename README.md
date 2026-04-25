# DistillLearn (AI Learning Assistant)

DistillLearn is an AI-powered study platform designed to optimize long-term memory retention through the **FSRS (Free Spaced Repetition Scheduler)** algorithm. It enables students to generate structured study roadmaps from raw materials (such as PDFs or prompts), automatically generates flashcard decks, and manages a daily review queue to ensure efficient learning.

## 🌟 Key Features

- **Automated Study Roadmaps**: Upload a syllabus (PDF) or provide a text prompt to let the AI instantly extract and generate a structured, multi-topic study plan.
- **FSRS Spaced Repetition Engine**: Employs the `ts-fsrs` algorithm to dynamically schedule flashcard reviews, maximizing memory retention and minimizing study time.
- **AI-Powered Flashcards & Notes**: Automatically generates starter flashcard decks and comprehensive exam-oriented markdown notes for individual topics using Google's Gemini AI.
- **Daily Review Queue**: A focused, distraction-free dashboard that presents users with their due flashcards for the day based on their individualized FSRS parameters.
- **Curated Video Resources**: Integrates YouTube search and video scoring to supplement topic notes with highly relevant educational videos.
- **Secure Authentication**: Robust user authentication, including JWT-based session management, bcrypt password hashing, and email verification.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Markdown & HTTP**: React Markdown, Axios

### Backend
- **Runtime Environment**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI Integrations**: Google GenAI (Gemini 2.5 Flash-Lite)
- **Spaced Repetition Engine**: `ts-fsrs`
- **File Parsing & Uploads**: Multer, PDF-Parse
- **External Integrations**: YouTube Search API (`yt-search`)
- **Authentication**: JWT, bcryptjs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or a MongoDB Atlas connection string)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "AI Learning Assistant"
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=8000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GEMINI_API_KEY=your_gemini_api_key
     ```
   - Start the backend server in development mode:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   - Start the frontend Vite development server:
     ```bash
     npm run dev
     ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

- `/backend` 
  - `controllers/` - API route logic (auth, study plans, flashcards, topics, progress).
  - `models/` - Mongoose schemas (User, StudyPlan, TopicContent, Flashcard).
  - `routes/` - Express route definitions.
  - `utils/` - Core services including `geminiService`, `pdfParser`, and `videoScoring`.
- `/frontend`
  - `src/pages/` - Core UI views (Dashboard, Flashcards queue, StudyPlan builder, Topic study).
  - `src/components/` - Reusable UI components.
  - `src/services/` - Axios API integration layer.

## 📝 License

This project is licensed under the ISC License.

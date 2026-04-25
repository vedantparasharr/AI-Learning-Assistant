import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RequireAuth from "./components/auth/RequireAuth";
import ReviewQueuePage from "./pages/Flashcards/ReviewQueuePage";
import StudyPlanBuilderPage from "./pages/StudyPlan/StudyPlanBuilderPage";
import TopicStudyPage from "./pages/Study/TopicStudyPage";
import SyllabusPage from "./pages/Syllabus/SyllabusPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SharedStudyPlanPage from "./pages/Shared/SharedStudyPlanPage";
import { useAuth } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-medium tracking-tight">Loading...</p>
      </div>
    );

  return (
    <Router>
      <Analytics />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route
          path="/verify-email"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <VerifyEmailPage />
            )
          }
        />
        <Route path="/shared/:shareSlug" element={<SharedStudyPlanPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/study-plan/new" element={<StudyPlanBuilderPage />} />
          <Route path="/learning-path/new" element={<Navigate to="/study-plan/new" replace />} />
          <Route path="/plans/:planId" element={<SyllabusPage />} />
          <Route path="/study/:topicKey" element={<TopicStudyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/flashcards" element={<ReviewQueuePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;

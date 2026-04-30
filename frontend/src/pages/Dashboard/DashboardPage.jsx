import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";
import ActivityHeatmap from "../../components/dashboard/ActivityHeatmap";

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboardSummary();
        if (res?.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = user?.username || "Scholar";

  // Derived values for better readability
  const dueCards = dashboardData?.dueCards || 0;
  const streak = dashboardData?.streak || 0;
  const maxStreak = dashboardData?.maxStreak || 0;
  const totalActiveDays = dashboardData?.totalActiveDays || 0;
  const joinedAt = dashboardData?.joinedAt || null;
  const subjects = dashboardData?.subjects || [];
  const reviewBreakdown = dashboardData?.reviewBreakdown || { learn: 0, review: 0, new: 0 };
  const estimatedReviewMinutes = dashboardData?.estimatedReviewMinutes || 0;
  const heatmapData = dashboardData?.heatmapData || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body-md text-on-surface-variant animate-pulse">
          Loading your learning environment...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto">
      <header className="mb-lg">
        <h1 className="font-h1 text-h1 text-on-surface mb-xs">
          {getGreeting()}, {userName}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your distilled learning environment is ready. You have {dueCards}{" "}
          items to review today.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter mb-xl">
        {/* Daily Review Card (FSRS) */}
        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-[0_10px_30px_-15px_rgba(49,46,129,0.15)] border-t-2 border-primary relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  psychology
                </span>
                Daily Review
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                FSRS Spaced Repetition Queue
              </p>
            </div>
            <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-3 py-1 rounded-full">
              High Priority
            </span>
          </div>

          <div className="relative z-10 flex items-end gap-6 mt-auto">
            <div className="flex flex-col">
              <span className="font-display text-display text-primary leading-none">
                {dueCards}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-2">
                Cards Due Today
              </span>
            </div>
            
            <div className="flex gap-4 flex-1 items-center justify-end">
              <ReviewStat label="Learn" count={reviewBreakdown.learn} colorClass="bg-error-container text-on-error-container" />
              <ReviewStat label="Review" count={reviewBreakdown.review} colorClass="bg-surface-variant text-primary-container" />
              <ReviewStat label="New" count={reviewBreakdown.new} colorClass="bg-secondary-container text-on-secondary-container" />
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-outline-variant flex justify-between items-center">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              Estimated time: ~{estimatedReviewMinutes} mins
            </div>
            <Link
              to="/flashcards"
              className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg transition-colors shadow-sm"
            >
              Start Review
            </Link>
          </div>
        </div>

        {/* Quick Upload Action */}
        <div className="col-span-12 md:col-span-4 bg-primary-container rounded-xl p-6 shadow-[0_10px_30px_-15px_rgba(49,46,129,0.2)] flex flex-col items-center justify-center text-center relative group overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 duration-300 min-h-[280px]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/20">
            <span className="material-symbols-outlined text-white text-[32px]">
              upload_file
            </span>
          </div>
          <h3 className="font-h3 text-h3 text-white mb-2 relative z-10">
            Distill New Document
          </h3>
          <p className="font-body-sm text-body-sm text-primary-fixed-dim mb-6 relative z-10">
            Upload PDF, DOCX, or text to generate a new study plan and
            flashcards.
          </p>
          <Link
            to="/study-plan/new"
            className="bg-white text-primary font-label-md text-label-md px-6 py-2 rounded-lg transition-colors shadow-sm relative z-10 w-full hover:bg-surface-container-low"
          >
            Browse Files
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Recent Study Plans */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-h2 text-h2 text-on-surface">
              Recent Study Plans
            </h2>
            <Link
              to="/plans"
              className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant flex items-center gap-1 transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          {subjects.length > 0 ? (
            subjects.slice(0, 3).map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))
          ) : (
            <div className="bg-surface-container rounded-xl p-8 text-center border border-dashed border-outline-variant">
              <p className="text-on-surface-variant">No active study plans found.</p>
              <Link to="/study-plan/new" className="text-primary font-semibold mt-2 inline-block">Create your first plan</Link>
            </div>
          )}
        </div>

        {/* Learning Activity Heatmap */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <ActivityHeatmap 
            heatmapData={heatmapData} 
            streak={streak} 
            maxStreak={maxStreak} 
            totalActiveDays={totalActiveDays} 
            joinedAt={joinedAt}
          />
        </div>
      </div>
    </div>
  );
};

// Helper components for better organization
const ReviewStat = ({ label, count, colorClass }) => (
  <div className="flex flex-col gap-1 items-center">
    <span className={`w-12 h-12 rounded-full flex items-center justify-center font-body-md text-body-md font-semibold ${colorClass}`}>
      {count}
    </span>
    <span className="font-label-sm text-label-sm text-on-surface-variant">
      {label}
    </span>
  </div>
);

const SubjectCard = ({ subject }) => {
  const progress = subject.progressPercentage || 0;
  
  return (
    <Link
      to={`/plans/${subject.id}`}
      className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_15px_-5px_rgba(49,46,129,0.08)] border border-surface-container-high hover:border-primary-container transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
          <div>
            <h4 className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
              {subject.subjectName}
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {subject.topicCount} topics • {subject.dueCount} cards due
            </p>
          </div>
        </div>
        <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed-dim/20 px-2 py-1 rounded">
          Active
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default DashboardPage;

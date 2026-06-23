import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dashboardService from "../../services/dashboardService";
import ActivityHeatmap from "../../components/dashboard/ActivityHeatmap";



const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsOffline(false);
      const res = await dashboardService.getDashboardSummary();
      if (res?.success && res.data) {
        setDashboardData(res.data);
      } else {
        setDashboardData(null);
        setIsOffline(true);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setDashboardData(null);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Keyboard Navigation / Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "r") {
        e.preventDefault();
        navigate("/flashcards");
        toast.success("Navigating to Flashcard Review Queue");
      } else if (key === "u") {
        e.preventDefault();
        navigate("/study-plan/new");
        toast.success("Navigating to New Plan Upload");
      } else if (key === "p") {
        e.preventDefault();
        navigate("/plans");
        toast.success("Navigating to Study Plans");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = "Vedant";

  // Data mapping with fallback values
  const dueCards = dashboardData?.dueCards ?? 0;
  const streak = dashboardData?.streak ?? 0;
  const totalActiveDays = dashboardData?.totalActiveDays ?? 0;
  const joinedAt = dashboardData?.joinedAt ?? null;
  const subjects = dashboardData?.subjects ?? [];
  const heatmapData = dashboardData?.heatmapData ?? {};
  
  const totalCards = dashboardData?.totalCards ?? 0;
  const plansCount = dashboardData?.plansCount ?? 0;
  const retentionRate = dashboardData?.retentionRate ?? 0;
  const cardsReviewed = dashboardData?.cardsReviewed ?? 0;
  const dueCardsTrend = dashboardData?.dueCardsTrend ?? 0;
  const retentionRateTrend = dashboardData?.retentionRateTrend ?? 0;

  // loading state skeletons
  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto space-y-lg animate-pulse">
        <header className="mb-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-9 w-64 bg-surface-container rounded-lg mb-2" />
            <div className="h-5 w-96 bg-surface-container rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-surface-container rounded-full" />
            <div className="h-10 w-28 bg-surface-container rounded-lg" />
          </div>
        </header>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-[110px]" />
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-[110px]" />
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-[110px]" />
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 h-[110px]" />
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-8 space-y-4">
            <div className="h-7 w-48 bg-surface-container rounded-lg mb-2" />
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[100px]" />
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[100px]" />
          </div>
          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-surface-container border border-outline-variant/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 text-on-surface font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-outline text-[20px]" aria-hidden="true">
              cloud_off
            </span>
            <span>
              <strong>System Offline</strong> — Connection to backend failed. Could not fetch latest dashboard data.
            </span>
          </div>
          <button
            onClick={fetchDashboard}
            className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md uppercase tracking-wider flex items-center gap-1 focus:outline-none focus:underline shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Retry Connection
          </button>
        </div>
      )}

      {/* Header */}
      <header className="mb-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">
            {getGreeting()}, {userName}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            You have {dueCards} cards due for review today
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {/* Review Cards Button */}
          <Link
            to="/flashcards"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-5 py-3 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            Review cards
          </Link>
          
          {/* New Plan Button */}
          <Link
            to="/study-plan/new"
            className="border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md px-5 py-3 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New plan
          </Link>
        </div>
      </header>

      {/* Statistics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
        
        {/* CARDS DUE (Interactive link to review) */}
        <Link
          to="/flashcards"
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 hover:border-primary-container/40 hover:shadow-sm transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
        >
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
            Cards Due
          </span>
          <div className="flex flex-col mt-2">
            <span className="text-[32px] font-bold text-on-surface leading-none">
              {dueCards}
            </span>
            <span className={`text-[11px] font-semibold mt-1 flex items-center gap-0.5 ${dueCardsTrend > 0 ? 'text-secondary' : dueCardsTrend < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
              {dueCardsTrend !== 0 && (
                <span className="material-symbols-outlined text-[12px]">
                  {dueCardsTrend > 0 ? 'trending_up' : 'trending_down'}
                </span>
              )}
              {dueCardsTrend === 0 ? 'no change from yesterday' : `${Math.abs(dueCardsTrend)} from yesterday`}
            </span>
          </div>
        </Link>

        {/* TOTAL CARDS */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 flex flex-col justify-between min-h-[110px] shadow-sm select-none">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
            Total Cards
          </span>
          <div className="flex flex-col mt-2">
            <span className="text-[32px] font-bold text-on-surface leading-none">
              {totalCards}
            </span>
            <span className="text-[11px] text-on-surface-variant/70 mt-1">
              across {plansCount} plans
            </span>
          </div>
        </div>

        {/* RETENTION RATE */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 flex flex-col justify-between min-h-[110px] shadow-sm select-none">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
            Retention Rate
          </span>
          <div className="flex flex-col mt-2">
            <span className="text-[32px] font-bold text-on-surface leading-none">
              {retentionRate}%
            </span>
            <span className={`text-[11px] font-semibold mt-1 flex items-center gap-0.5 ${retentionRateTrend > 0 ? 'text-secondary' : retentionRateTrend < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
              {retentionRateTrend !== 0 && (
                <span className="material-symbols-outlined text-[12px]">
                  {retentionRateTrend > 0 ? 'trending_up' : 'trending_down'}
                </span>
              )}
              {retentionRateTrend === 0 ? 'no change this week' : `${Math.abs(retentionRateTrend)}% this week`}
            </span>
          </div>
        </div>

        {/* CARDS REVIEWED */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 flex flex-col justify-between min-h-[110px] shadow-sm select-none">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
            Cards Reviewed
          </span>
          <div className="flex flex-col mt-2">
            <span className="text-[32px] font-bold text-on-surface leading-none">
              {cardsReviewed.toLocaleString()}
            </span>
            <span className="text-[11px] text-on-surface-variant/70 mt-1">
              all time
            </span>
          </div>
        </div>

      </div>

      {/* Plans & Heatmap Row */}
      <div className="grid grid-cols-12 gap-gutter">
        
        {/* Recent Study Plans List */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-1">
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
            <div className="flex flex-col gap-3">
              {subjects.slice(0, 3).map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant/60 rounded-xl p-8 text-center flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[36px] text-outline mb-2">
                menu_book
              </span>
              <p className="text-on-surface-variant font-body-sm text-body-sm">
                No active study plans found. Get started by creating your first plan.
              </p>
              <Link
                to="/study-plan/new"
                className="text-primary font-semibold text-sm mt-2 inline-block hover:underline"
              >
                Create your first plan
              </Link>
            </div>
          )}
        </div>

        {/* Heatmap Section */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="mb-1 hidden md:block">
            <h2 className="font-h2 text-h2 text-on-surface invisible">Activity</h2>
          </div>
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <ActivityHeatmap 
              heatmapData={heatmapData} 
              streak={streak} 
              maxStreak={dashboardData?.maxStreak ?? 0} 
              totalActiveDays={totalActiveDays} 
              joinedAt={joinedAt}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const SubjectCard = ({ subject }) => {
  const progress = subject.progressPercentage || 0;
  
  return (
    <Link
      to={`/plans/${subject.id}`}
      className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 hover:border-primary-container/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/60 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-body-md text-body-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
            {subject.subjectName}
          </h4>
          <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
            {subject.topicCount} topics • {subject.dueCount} cards due
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full sm:w-[160px]">
          <div className="flex-1 h-1.5 bg-surface-container border border-outline-variant/65 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-semibold text-xs text-on-surface w-9 text-right shrink-0">
            {progress}%
          </span>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider text-secondary bg-secondary-container/20 border border-secondary/15 px-2 py-0.5 rounded shrink-0">
          Active
        </span>
      </div>
    </Link>
  );
};

export default DashboardPage;

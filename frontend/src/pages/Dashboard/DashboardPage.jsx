import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import progressService from "../../services/progressService";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await progressService.getDashboard();
        if (res?.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const dueCards = dashboardData?.dueCards || 0;
  const streak = dashboardData?.streak || 0;
  const subjects = dashboardData?.subjects || [];

  return (
    <>
      <header className="mb-lg">
        <h1 className="font-h1 text-h1 text-on-surface mb-xs">
          Welcome back, Scholar
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your distilled learning environment is ready. You have {dueCards} items to
          review today.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter mb-xl">
        {/* Daily Review Card (FSRS) - Spans 8 cols */}
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
              <div className="flex flex-col gap-1 items-center">
                <span className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-body-md text-body-md font-semibold">
                  12
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Learn
                </span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <span className="w-12 h-12 rounded-full bg-surface-variant text-primary-container flex items-center justify-center font-body-md text-body-md font-semibold">
                  25
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Review
                </span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <span className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-body-md text-body-md font-semibold">
                  5
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  New
                </span>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-6 pt-6 border-t border-outline-variant flex justify-between items-center">
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>
              Estimated time: ~20 mins
            </div>
            <button className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg transition-colors shadow-sm">
              Start Review
            </button>
          </div>
        </div>

        {/* Quick Upload Action - Spans 4 cols */}
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
          <button className="bg-white text-primary font-label-md text-label-md px-6 py-2 rounded-lg transition-colors shadow-sm relative z-10 w-full hover:bg-surface-container-low">
            Browse Files
          </button>
        </div>
      </div>

      {/* Lower Section: Study Plans & Progress */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Recent Study Plans - Spans 7 cols */}
        <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-h2 text-h2 text-on-surface">
              Recent Study Plans
            </h2>
            <button className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant flex items-center gap-1 transition-colors">
              View All
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </div>

          {subjects.length > 0 ? (
  subjects.slice(0, 2).map((subject) => {
    const staticProgress = 50;

    return (
      <div
        key={subject.id}
        className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_15px_-5px_rgba(49,46,129,0.08)] border border-surface-container-high hover:border-primary-container transition-colors cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>

            <div>
              <h4 className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                {subject.subjectName}
              </h4>

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {subject.topics?.[0]?.name || "Topics Available"}
              </p>
            </div>
          </div>

          <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed-dim/20 px-2 py-1 rounded">
            Active
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
            <span>Progress</span>
            <span>{staticProgress}%</span>
          </div>

          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${staticProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  })
) : (
            <p className="text-on-surface-variant mt-4">No active study plans found.</p>
          )}
        </div>

        {/* Learning Progress Chart Area - Spans 5 cols */}
        <div className="col-span-12 md:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-[0_10px_30px_-15px_rgba(49,46,129,0.1)] border border-surface-container-high">
          <h2 className="font-h3 text-h3 text-on-surface mb-6">
            Learning Activity
          </h2>
          {/* Faux Chart Structure */}
          <div className="h-48 flex items-end justify-between gap-2 border-b border-outline-variant pb-2 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-on-surface-variant font-label-sm text-label-sm -ml-4 w-6 py-1">
              <span className="-translate-y-1/2">100</span>
              <span className="-translate-y-1/2">50</span>
              <span className="translate-y-1/2">0</span>
            </div>
            {/* Bars */}
            <div className="w-full flex justify-around items-end h-full pl-6">
              <div className="w-[12%] bg-surface-variant rounded-t-sm h-[30%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  30
                </div>
              </div>
              <div className="w-[12%] bg-surface-variant rounded-t-sm h-[50%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  50
                </div>
              </div>
              <div className="w-[12%] bg-surface-variant rounded-t-sm h-[80%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  80
                </div>
              </div>
              <div className="w-[12%] bg-primary rounded-t-sm h-[100%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  100
                </div>
              </div>
              <div className="w-[12%] bg-surface-variant rounded-t-sm h-[60%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  60
                </div>
              </div>
              <div className="w-[12%] bg-surface-variant rounded-t-sm h-[40%] hover:bg-primary-container transition-colors relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  40
                </div>
              </div>
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-around items-center pt-2 pl-6 text-on-surface-variant font-label-sm text-label-sm">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span className="text-primary font-bold">Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="mt-6 flex justify-between items-center bg-surface p-3 rounded-lg border border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">
                local_fire_department
              </span>
              <span className="font-body-sm text-body-sm text-on-surface">
                Current Streak
              </span>
            </div>
            <span className="font-h3 text-h3 text-on-surface">{streak} Days</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

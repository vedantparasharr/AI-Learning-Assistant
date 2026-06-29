import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dashboardService from "../../services/dashboardService";
import ActivityHeatmap from "../../components/dashboard/ActivityHeatmap";
import { PageShell, PrimaryLinkButton, InlineLinkButton, TextLink } from "../../components/common/ui";
import { useAuth } from "../../context/AuthContext";


const DashboardPage = () => {
  const { user } = useAuth();

  const fetchDashboard = async () => {
    const res = await dashboardService.getDashboardSummary();

    if (!res?.success) {
      throw new Error("Failed to fetch dashboard");
    }

    return res.data;
  };

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboard
  })

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.username || "Scholar";

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

  // loading state skeletons — rendered inside PageShell so header + spacing match exactly
  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto animate-pulse">
        <div className="space-y-lg">
          {/* Header skeleton — mirrors PageShell's internal "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-xs">
              {/* h1 equivalent: font-h1 on "Good evening, Vedant" */}
              <div className="h-10 w-60 bg-surface-container rounded-lg" />
              {/* description: "You have X cards due for review today" */}
              <div className="h-5 w-72 bg-surface-container rounded-lg mt-1" />
            </div>
            {/* actions: "Review cards" + "New plan" buttons */}
            <div className="flex w-full flex-wrap gap-3 lg:w-auto">
              <div className="h-11 w-[130px] bg-surface-container rounded-lg" />
              <div className="h-11 w-[100px] bg-surface-container rounded-lg" />
            </div>
          </div>

          {/* Stats grid — 4 equal cards, matching grid-cols-4 gap-gutter, min-h-[110px] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 min-h-[110px]" />
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 min-h-[110px]" />
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 min-h-[110px]" />
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 min-h-[110px]" />
          </div>

          {/* Plans + Heatmap — mirrors exact col-span-8 / col-span-4 split */}
          <div className="grid grid-cols-12 gap-gutter">
            {/* Left: "Recent Study Plans" heading row + 3 subject cards */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                {/* "Recent Study Plans" h2 */}
                <div className="h-8 w-52 bg-surface-container rounded-lg" />
                {/* "View All →" link */}
                <div className="h-5 w-16 bg-surface-container rounded-lg" />
              </div>
              <div className="flex flex-col gap-3">
                {/* Each SubjectCard is p-5 with an icon (w-10 h-10) + text block + progress bar — ~80px tall in practice */}
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[80px]" />
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[80px]" />
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl h-[80px]" />
              </div>
            </div>
            {/* Right: invisible spacer h2 + ActivityHeatmap card */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
              {/* The invisible <h2>Activity</h2> spacer that aligns heatmap with plans header row */}
              <div className="mb-1 hidden md:block">
                <div className="h-8 w-0" />
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl flex-1 min-h-[280px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-lg">

      {/* Header */}
      <PageShell
        title={`${getGreeting()}, ${userName}`}
        description={`You have ${dueCards} cards due for review today`}
        actions={
          <>
            {/* Review Cards Button */}
            <PrimaryLinkButton
              to="/flashcards"
              className="px-5 py-3 sm:py-2.5"
            >
              <span className="material-symbols-outlined text-[1.125rem]">psychology</span>
              Review cards
            </PrimaryLinkButton>

            {/* New Plan Button */}
            <InlineLinkButton
              to="/study-plan/new"
              className="px-5 py-3 sm:py-2.5"
            >
              <span className="material-symbols-outlined text-[1.125rem]">add</span>
              New plan
            </InlineLinkButton>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">

          {/* CARDS DUE (Interactive link to review) */}
          <Link
            to="/flashcards"
            className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 hover:shadow-sm transition-all flex flex-col justify-between min-h-[110px] group cursor-pointer"
          >
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Cards Due
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-h2 text-h2 text-on-surface leading-none tabular-data">
                {dueCards}
              </span>
              <span className={`font-label-sm text-label-sm mt-1 flex items-center gap-0.5 ${dueCardsTrend > 0 ? 'text-emerald-600 dark:text-emerald-400' : dueCardsTrend < 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
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
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Total Cards
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-h2 text-h2 text-on-surface leading-none tabular-data">
                {totalCards}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                across {plansCount} plans
              </span>
            </div>
          </div>

          {/* RETENTION RATE */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 flex flex-col justify-between min-h-[110px] shadow-sm select-none">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Retention Rate
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-h2 text-h2 text-on-surface leading-none tabular-data">
                {retentionRate}%
              </span>
              <span className={`font-label-sm text-label-sm mt-1 flex items-center gap-0.5 ${retentionRateTrend > 0 ? 'text-secondary' : retentionRateTrend < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
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
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Cards Reviewed
            </span>
            <div className="flex flex-col mt-2">
              <span className="font-h2 text-h2 text-on-surface leading-none tabular-data">
                {cardsReviewed.toLocaleString()}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
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
              <TextLink
                to="/plans"
                className="flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-[1rem]">
                  arrow_forward
                </span>
              </TextLink>
            </div>

            {subjects.length > 0 ? (
              <div className="flex flex-col gap-3">
                {subjects.slice(0, 3).map((subject) => (
                  <SubjectCard key={subject.id} subject={subject} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-dashed border-outline-variant/60 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[2.25rem] text-outline mb-2">
                  menu_book
                </span>
                <p className="text-on-surface-variant font-body-sm text-body-sm">
                  No active study plans found. Get started by creating your first plan.
                </p>
                <TextLink
                  to="/study-plan/new"
                  className="font-semibold text-sm mt-2 inline-block"
                >
                  Create your first plan
                </TextLink>
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
      </PageShell>
    </div>
  );
};

const SubjectCard = ({ subject }) => {
  const progress = subject.progressPercentage || 0;

  return (
    <Link
      to={`/plans/${subject.id}`}
      className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/60 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group cursor-pointer"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/60 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
          <span className="material-symbols-outlined text-[1.25rem]">menu_book</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-body-lg text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
            {subject.subjectName}
          </h4>
          <p className="font-body-sm text-label-sm text-on-surface-variant mt-0.5">
            {subject.topicCount} topics • {subject.dueCount} cards due
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full sm:w-[160px]">
          <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface w-9 text-right shrink-0 tabular-data">
            {progress}%
          </span>
        </div>

        <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 border border-secondary/15 px-2 py-0.5 rounded shrink-0">
          Active
        </span>
      </div>
    </Link>
  );
};

export default DashboardPage;

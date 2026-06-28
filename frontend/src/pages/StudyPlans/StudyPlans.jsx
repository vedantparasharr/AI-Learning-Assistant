import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  ConfirmationModal,
  EmptyState,
  ErrorState,
  PageShell,
  PrimaryButton,
  SecondaryButton,
} from "../../components/common/ui";
import studyPlanService from "../../services/studyPlanService";
import { formatDate } from "../../utils/formatters";

const SORTS = {
  RECENTLY_UPDATED: "recently-updated",
  EXAM_DATE: "exam-date",
  PROGRESS: "progress",
};

const StudyPlans = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState(SORTS.RECENTLY_UPDATED);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const query = searchParams.get("query")?.trim() || "";

  const fetchPlans = async () => {
    const response = await studyPlanService.getStudyPlans();
    if (!response.data) throw new Error("Failed to load study plans!")
    return Array.isArray(response?.data) ? response.data : [];
  };

  const { isPending: loading, error: queryError, data: plans = [] } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  })

  const filteredAndSortedPlans = useMemo(() => {
    const q = query.toLowerCase();

    return plans
      .filter((plan) =>
        !q || [plan.planName, plan.sourceLabel, ...(plan.topicNames || [])].join(" ").toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === SORTS.EXAM_DATE) return (new Date(a.examDate).getTime() || 0) - (new Date(b.examDate).getTime() || 0);
        if (sortBy === SORTS.PROGRESS) return b.progress - a.progress;
        return (new Date(b.updatedAt).getTime() || 0) - (new Date(a.updatedAt).getTime() || 0);
      });
  }, [plans, query, sortBy]);

  const hasActiveRefinements = Boolean(query);

  const clearRefinements = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("query");
    setSearchParams(nextParams);
  };

  const requestDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (planId) => studyPlanService.deleteStudyPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['plans'],
      });
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  });

  const handleConfirmDelete = () => {
    if (!planToDelete) return;
    deleteMutation.mutate(planToDelete.planId);
  };

  const headerActions = (
    <PrimaryButton
      type="button"
      className="w-full sm:w-auto"
      onClick={() => navigate("/study-plan/new")}
    >
      Create study plan
    </PrimaryButton>
  );

  return (
    <PageShell
      title="Study Plans"
      description="Review your active plans, pick up where you left off, and keep upcoming exams in view."
      actions={headerActions}
    >

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-outline-variant/60">
        <div className="font-body-sm text-body-sm text-on-surface-variant flex flex-wrap items-center gap-2">
          <span>Showing <span className="font-semibold text-on-surface">{filteredAndSortedPlans.length}</span> {filteredAndSortedPlans.length === 1 ? "study plan" : "study plans"}</span>
          {hasActiveRefinements && (
            <>
              <span aria-hidden="true" className="text-outline-variant/60">•</span>
              <div className="flex flex-wrap gap-1.5">
                {query && (
                  <span className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs text-on-surface-variant border border-outline-variant/60">
                    “{query}”
                  </span>
                )}

                <button
                  type="button"
                  className="text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                  onClick={clearRefinements}
                >
                  Clear
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">


          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-sm text-on-surface shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Sort plans"
          >
            <option value={SORTS.RECENTLY_UPDATED}>Recently Updated</option>
            <option value={SORTS.EXAM_DATE}>Exam Date</option>
            <option value={SORTS.PROGRESS}>Progress</option>
          </select>
        </div>
      </div>

      {queryError && (
        <ErrorState
          title="We couldn't load your study plans"
          description={`${queryError.message || queryError} You can retry now or create a new plan if you were starting fresh.`}
          action={(
            <div className="flex flex-wrap gap-3">
              <PrimaryButton onClick={fetchPlans}>
                Retry
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => navigate("/study-plan/new")}>
                Create study plan
              </SecondaryButton>
            </div>
          )}
        />
      )}

      {loading && (
        <div className="space-y-gutter animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-surface-container shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-surface-container rounded" />
                  <div className="h-3 w-32 bg-surface-container rounded" />
                </div>
              </div>
              <div className="sm:w-32 w-full">
                <div className="h-3 w-full bg-surface-container rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredAndSortedPlans.length === 0 && (
        <EmptyState
          title={hasActiveRefinements ? "No plans match your current filters" : "You haven't created a study plan yet"}
          description={
            hasActiveRefinements
              ? "Try clearing the current search or subject filter to see all of your plans again."
              : "Turn notes, prompts, or documents into a plan with topics, progress tracking, and a clear next step."
          }
          action={hasActiveRefinements ? (
            <SecondaryButton type="button" onClick={clearRefinements}>
              Clear filters
            </SecondaryButton>
          ) : (
            <PrimaryButton
              onClick={() => navigate("/study-plan/new")}
            >
              Create your first study plan
            </PrimaryButton>
          )}
        />
      )}

      {!loading && filteredAndSortedPlans.length > 0 && (
        <div className="space-y-gutter">
          {filteredAndSortedPlans.map((plan) => (
            <article
              key={plan.planId}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(13,28,46,0.08)] border border-outline-variant/60 hover:shadow-sm transition-all flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group cursor-pointer"
              onClick={() => navigate(`/plans/${plan.planId}`)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-body-lg text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                    {plan.planName}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant">
                    <span className="inline-flex items-center rounded bg-surface-container-high px-1.5 py-0.5 font-medium">
                      {plan.sourceLabel}
                    </span>
                    <span>•</span>
                    <span>{plan.completedTopics}/{plan.topicCount} topics</span>
                    {plan.examDate && (
                      <>
                        <span>•</span>
                        <span>Exam: {formatDate(plan.examDate)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
                <div className="flex items-center gap-3 w-full sm:w-[180px]">
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>
                  <span className="font-semibold text-xs text-on-surface w-9 text-right shrink-0">
                    {plan.progress}%
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error-container hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeletePlan(plan);
                    }}
                    disabled={deleteMutation.isPending && deleteMutation.variables === plan.planId}
                    aria-label="Delete plan"
                  >
                    {deleteMutation.isPending && deleteMutation.variables === plan.planId ? (
                      <span className="h-4 w-4 animate-spin rounded-full border border-error border-t-transparent" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Study Plan?"
        message={`Are you sure you want to delete "${planToDelete?.planName || "this study plan"}"? This action is permanent and cannot be undone.`}
        confirmLabel="Delete plan"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
          deleteMutation.reset();
        }}
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        error={deleteMutation.error?.message}
      />
    </PageShell>
  );
};

export default StudyPlans;

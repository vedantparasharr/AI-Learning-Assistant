import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ConfirmationModal,
  EmptyState,
  ErrorState,
  LoadingState,
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

const toEpoch = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const clampPercentage = (value) => Math.max(0, Math.min(100, value));

const getProgressPercentage = (plan) => {
  if (typeof plan.progressPercentage === "number") {
    return clampPercentage(Math.round(plan.progressPercentage));
  }

  const topics = Array.isArray(plan.topics) ? plan.topics : [];
  if (topics.length === 0) {
    return 0;
  }

  const completedTopics = topics.filter((topic) => topic.completionStatus === "completed").length;
  return clampPercentage(Math.round((completedTopics / topics.length) * 100));
};

const getSourceLabel = (sourceType) => {
  switch (sourceType) {
    case "document":
      return "Document";
    case "prompt":
      return "Prompt";
    case "text":
      return "Notes";
    default:
      return "Manual";
  }
};

const getTopicPreview = (topics) => {
  if (!topics.length) {
    return "No topics have been outlined yet.";
  }

  const names = topics
    .map((topic) => topic?.name?.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return "Topics are ready to be refined.";
  }

  if (names.length <= 3) {
    return names.join(" • ");
  }

  return `${names.slice(0, 3).join(" • ")} +${names.length - 3} more`;
};

const buildSearchParams = ({ query, subject }) => {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (subject && subject !== "all") {
    params.set("subject", subject);
  }

  return params;
};

const StudyPlans = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plans, setPlans] = useState([]);
  const [sortBy, setSortBy] = useState(SORTS.RECENTLY_UPDATED);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingPlanId, setDeletingPlanId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const query = searchParams.get("query")?.trim() || "";
  const subjectFilter = searchParams.get("subject") || "all";

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await studyPlanService.getStudyPlans();
      const incomingPlans = Array.isArray(response?.data) ? response.data : [];
      setPlans(incomingPlans);
    } catch (requestError) {
      setError(requestError?.message || "Failed to load study plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const normalizedPlans = useMemo(
    () =>
      plans.map((plan) => {
        const topics = Array.isArray(plan.topics) ? plan.topics : [];
        const completedTopics = topics.filter((topic) => topic.completionStatus === "completed").length;
        const progressPercentage = getProgressPercentage(plan);

        return {
          ...plan,
          planId: String(plan._id || plan.id),
          topicCount: topics.length,
          completedTopics,
          progressPercentage,
          sourceLabel: getSourceLabel(plan.sourceType),
          topicPreview: getTopicPreview(topics),
        };
      }),
    [plans],
  );

  const subjects = useMemo(() => {
    const unique = [...new Set(normalizedPlans.map((plan) => plan.subjectName).filter(Boolean))];
    return unique.sort((left, right) => left.localeCompare(right));
  }, [normalizedPlans]);

  const filteredAndSortedPlans = useMemo(() => {
    const loweredQuery = query.toLowerCase();

    const filtered = subjectFilter === "all"
      ? normalizedPlans
      : normalizedPlans.filter((plan) => plan.subjectName === subjectFilter);

    const searched = loweredQuery
      ? filtered.filter((plan) => {
        const haystack = [
          plan.subjectName,
          plan.sourceLabel,
          plan.topicPreview,
          ...(plan.topics || []).map((topic) => topic.name),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(loweredQuery);
      })
      : filtered;

    const sorted = [...searched];

    if (sortBy === SORTS.EXAM_DATE) {
      sorted.sort((left, right) => toEpoch(left.examDate) - toEpoch(right.examDate));
      return sorted;
    }

    if (sortBy === SORTS.PROGRESS) {
      sorted.sort((left, right) => right.progressPercentage - left.progressPercentage);
      return sorted;
    }

    sorted.sort((left, right) => toEpoch(right.updatedAt) - toEpoch(left.updatedAt));
    return sorted;
  }, [normalizedPlans, query, sortBy, subjectFilter]);

  const hasActiveRefinements = Boolean(query) || subjectFilter !== "all";

  const handleSubjectChange = (nextSubject) => {
    setSearchParams(buildSearchParams({ query, subject: nextSubject }));
  };

  const clearRefinements = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("query");
    nextParams.delete("subject");
    setSearchParams(nextParams);
  };

  const requestDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      setDeletingPlanId(planToDelete.planId);
      setError("");
      await studyPlanService.deleteStudyPlan(planToDelete.planId);
      setPlans((current) => current.filter((plan) => String(plan._id || plan.id) !== String(planToDelete.planId)));
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (requestError) {
      setError(requestError?.message || "Failed to delete study plan");
    } finally {
      setDeletingPlanId("");
    }
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
                {subjectFilter !== "all" && (
                  <span className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs text-on-surface-variant border border-outline-variant/60">
                    {subjectFilter}
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
            value={subjectFilter}
            onChange={(event) => handleSubjectChange(event.target.value)}
            className="min-h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-sm text-on-surface shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filter by subject"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

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

      {error ? (
        <ErrorState
          title="We couldn't load your study plans"
          description={`${error} You can retry now or create a new plan if you were starting fresh.`}
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
      ) : null}

      {loading ? (
        <LoadingState label="Loading your study plans" />
      ) : null}

      {!loading && filteredAndSortedPlans.length === 0 ? (
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
      ) : null}

      {!loading && filteredAndSortedPlans.length > 0 ? (
        <div className="space-y-gutter">
          {filteredAndSortedPlans.map((plan) => (
            <article
              key={plan.planId}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(13,28,46,0.08)] border border-outline-variant/60 hover:border-primary/40 transition-all flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group cursor-pointer"
              onClick={() => navigate(`/plans/${plan.planId}`)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-on-background group-hover:text-primary transition-colors truncate">
                    {plan.subjectName}
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
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-secondary transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: `${plan.progressPercentage}%` }}
                    />
                  </div>
                  <span className="font-semibold text-xs text-on-surface w-9 text-right shrink-0">
                    {plan.progressPercentage}%
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 border-error/20 text-error hover:bg-error-container/20 hover:border-error/40 hover:text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeletePlan(plan);
                    }}
                    disabled={deletingPlanId === plan.planId}
                    aria-label="Delete plan"
                  >
                    {deletingPlanId === plan.planId ? (
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
      ) : null}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Study Plan?"
        message={`Are you sure you want to delete "${planToDelete?.subjectName || "this study plan"}"? This action is permanent and cannot be undone.`}
        confirmLabel="Delete plan"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        isDestructive={true}
        isLoading={deletingPlanId !== ""}
      />
    </PageShell>
  );
};

export default StudyPlans;

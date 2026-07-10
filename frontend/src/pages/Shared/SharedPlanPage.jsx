import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import studyPlanService from "../../services/studyPlanService";
import { useAuth } from "../../context/AuthContext";
import PublicPageLayout from "../../components/common/PublicPageLayout";
import { PrimaryButton, SecondaryButton, ErrorState } from "../../components/common/ui";

const SharedPlanPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    data: plan,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["sharedPlan", slug],
    queryFn: async () => {
      const response = await studyPlanService.getSharedStudyPlan(slug);
      if (!response?.success) throw new Error("Plan not found");
      return response.data;
    },
    enabled: !!slug,
  });

  const cloneMutation = useMutation({
    mutationFn: () => studyPlanService.cloneSharedStudyPlan(slug),
    onSuccess: () => navigate("/plans"),
  });

  const handleClone = () => {
    if (!isAuthenticated) {
      navigate(`/register?redirect=/shared/${slug}`);
      return;
    }
    cloneMutation.mutate();
  };

  const progress = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    if (topics.length === 0) return 0;
    const completed = topics.filter((t) => t.completionStatus === "completed").length;
    return Math.round((completed / topics.length) * 100);
  }, [plan]);

  const totalHours = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    return topics.reduce((sum, t) => sum + (t.estimated_hours || 1), 0);
  }, [plan]);

  // ─── Loading skeleton ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PublicPageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-surface-container rounded" />
          <div className="h-10 w-2/3 bg-surface-container rounded" />
          <div className="h-4 w-full bg-surface-container rounded" />
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60">
            <div className="h-4 w-32 bg-surface-container rounded mb-2" />
            <div className="h-8 w-48 bg-surface-container rounded mb-4" />
            <div className="h-2 w-full bg-surface-container rounded-full" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/60"
            />
          ))}
        </div>
      </PublicPageLayout>
    );
  }

  // ─── Error / not found ────────────────────────────────────────────────────────
  if (queryError || !plan) {
    return (
      <PublicPageLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-6 text-center">
          <span className="material-symbols-outlined text-[56px] text-on-surface-variant">
            link_off
          </span>
          <ErrorState
            title="This plan isn't available"
            description="The link may have expired or the owner may have removed it."
            action={
              <SecondaryButton onClick={() => navigate("/")}>
                <span className="material-symbols-outlined text-[18px]">home</span>
                Go home
              </SecondaryButton>
            }
          />
        </div>
      </PublicPageLayout>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-lg">

        {/* ── Shared badge + title ─────────────────────────────────────────── */}
        <div>
          {/* Read-only badge — inline style matching app chip vocabulary */}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/60 bg-surface-container px-3 py-1 font-label-sm text-label-sm text-on-surface-variant mb-4">
            <span className="material-symbols-outlined text-[14px]">share</span>
            Shared plan · read-only
          </span>

          <h1 className="font-h1 text-h1 text-on-background">{plan.subjectName}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 font-body-sm text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
              {plan.topics?.length || 0} topics
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              ~{totalHours}h total
            </span>
            {plan.examDate && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">event</span>
                  Exam:{" "}
                  {new Date(plan.examDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Progress card ────────────────────────────────────────────────── */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider block mb-1">
                Overall Progress
              </span>
              <span className="font-h3 text-h3 text-on-background">{progress}% Completed</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              ~{totalHours}h total
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Topics list ──────────────────────────────────────────────────── */}
        <div className="space-y-md">
          <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">
              format_list_bulleted
            </span>
            Curriculum Modules
          </h2>

          <div className="space-y-3">
            {(plan.topics || []).map((topic, index) => (
              <div
                key={topic.topic_key}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  topic.completionStatus === "completed"
                    ? "border-primary/30 bg-surface-container-lowest"
                    : "border-outline-variant/60 bg-surface-container-lowest"
                }`}
              >
                {/* Status indicator — read-only, no checkbox interaction */}
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    topic.completionStatus === "completed"
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant"
                  }`}
                  aria-label={
                    topic.completionStatus === "completed" ? "Completed" : "Not completed"
                  }
                >
                  {topic.completionStatus === "completed" && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold truncate ${
                      topic.completionStatus === "completed"
                        ? "line-through text-on-surface-variant/60"
                        : "text-on-background"
                    }`}
                  >
                    {topic.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Module {index + 1} · {topic.estimated_hours || 1}h est.
                    {topic.completionStatus === "in_progress" && (
                      <span className="ml-2 text-secondary font-semibold inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        In Progress
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Clone CTA ────────────────────────────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-on-background">Want to study this yourself?</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {isAuthenticated
                ? "Clone this plan into your account and start tracking your progress."
                : "Create a free account to clone this plan and track your progress."}
            </p>
            {cloneMutation.error && (
              <p className="mt-2 font-body-sm text-body-sm text-error" role="alert">
                {cloneMutation.error?.message || "Something went wrong. Please try again."}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated && (
              <SecondaryButton onClick={() => navigate(`/login?redirect=/shared/${slug}`)}>
                Sign in
              </SecondaryButton>
            )}
            <PrimaryButton
              onClick={handleClone}
              disabled={cloneMutation.isPending}
              aria-label={isAuthenticated ? "Clone this plan" : "Sign up to clone this plan"}
            >
              {cloneMutation.isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary border-t-transparent" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
              )}
              {isAuthenticated ? "Clone this plan" : "Sign up — it's free"}
            </PrimaryButton>
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default SharedPlanPage;

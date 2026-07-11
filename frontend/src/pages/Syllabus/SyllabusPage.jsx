import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import studyPlanService from "../../services/studyPlanService";
import topicService from "../../services/topicService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageShell, PrimaryButton, SecondaryButton } from "../../components/common/ui";

const SyllabusPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);

  const { data: plan, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["studyPlan", planId],
    queryFn: async () => {
      const response = await studyPlanService.getStudyPlanOverview(planId);
      if (!response?.success) throw new Error("Failed to load study plan");
      return response.data;
    },
    enabled: !!planId,
  });

  const error = queryError?.message || "";

  const shareMutation = useMutation({
    mutationFn: () => studyPlanService.shareStudyPlan(planId),
    onSuccess: (response) => {
      const shareUrl = response?.data?.shareUrl;
      if (shareUrl) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    },
  });

  const progress = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    if (topics.length === 0) return 0;
    const completed = topics.filter((t) => t.completionStatus === "completed").length;
    return Math.round((completed / topics.length) * 100);
  }, [plan]);

  const remainingHours = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    return topics
      .filter((t) => t.completionStatus !== "completed")
      .reduce((sum, t) => sum + (t.estimated_hours || 1), 0);
  }, [plan]);

  const toggleMutation = useMutation({
    mutationFn: ({ topicKey, nextStatus }) =>
      topicService.markTopicCompleted(topicKey, nextStatus),
    onMutate: async ({ topicKey, nextStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["studyPlan", planId] });
      const previousPlan = queryClient.getQueryData(["studyPlan", planId]);
      queryClient.setQueryData(["studyPlan", planId], (old) => {
        if (!old) return old;
        return {
          ...old,
          topics: old.topics.map((t) =>
            t.topic_key === topicKey ? { ...t, completionStatus: nextStatus } : t
          ),
        };
      });
      return { previousPlan };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["studyPlan", planId], context.previousPlan);
    },
  });

  const toggleTopicCompletion = (topicKey, currentStatus) => {
    const nextStatus = currentStatus === "completed" ? "in_progress" : "completed";
    toggleMutation.mutate({ topicKey, nextStatus });
  };

  const handleNavigateToTopic = (e, topic) => {
    e.stopPropagation();
    if (topic.completionStatus === "pending") {
      queryClient.setQueryData(["studyPlan", planId], (old) => {
        if (!old) return old;
        return {
          ...old,
          topics: old.topics.map((t) =>
            t.topic_key === topic.topic_key ? { ...t, completionStatus: "in_progress" } : t
          ),
        };
      });
    }
    navigate(`/study/${topic.topic_key}`);
  };

  const modules = useMemo(() => plan?.topics || [], [plan]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto space-y-lg animate-pulse">
        <div className="space-y-sm">
          <div className="h-4 w-48 bg-surface-container rounded mb-2" />
          <div className="h-10 w-3/4 max-w-2xl bg-surface-container rounded-lg" />
          <div className="h-6 w-1/2 max-w-xl bg-surface-container rounded mt-4" />
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 max-w-3xl mt-4">
          <div className="h-4 w-32 bg-surface-container rounded mb-2" />
          <div className="h-8 w-48 bg-surface-container rounded mb-4" />
          <div className="h-2 w-full bg-surface-container rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 min-h-[160px] flex flex-col"
            >
              <div className="h-6 w-3/4 bg-surface-container rounded mb-2" />
              <div className="h-4 w-full bg-surface-container rounded mb-1" />
              <div className="h-4 w-5/6 bg-surface-container rounded mb-4" />
              <div className="flex justify-between items-center mt-auto">
                <div className="h-4 w-24 bg-surface-container rounded" />
                <div className="h-8 w-24 bg-surface-container rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border border-error/20 bg-error-container p-lg text-on-error-container"
        role="alert"
      >
        <h3 className="font-h3 text-h3">We couldn't load your study plan</h3>
        <p className="mt-xs font-body-sm text-body-sm">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-xl text-center">
        <h3 className="font-h3 text-h3 text-on-background">Study plan not found</h3>
      </div>
    );
  }

  const shareButton = (
    <button
      type="button"
      onClick={() => shareMutation.mutate()}
      disabled={shareMutation.isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:bg-surface-container hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      aria-label="Share study plan"
    >
      {shareMutation.isPending ? (
        <span className="h-4 w-4 animate-spin rounded-full border border-on-surface border-t-transparent" />
      ) : copied ? (
        <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
      ) : (
        <span className="material-symbols-outlined text-[18px]">share</span>
      )}
      <span>{copied ? "Link copied!" : "Share"}</span>
    </button>
  );

  const actionButtons = (
    <div className="flex items-center gap-2">
      {user?.email === "iemvedant@gmail.com" && (
        <button
          onClick={async () => {
            if (!plan?.topics) return;
            for (const topic of plan.topics) {
              try {
                await topicService.generateTopicContent(topic.topic_key);
              } catch (err) {
                console.error(err);
              }
            }
            alert("All topics rendered!");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface shadow-sm transition hover:bg-surface-container hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Render All
        </button>
      )}
      {shareButton}
    </div>
  );

  return (
    <div className="max-w-container-max mx-auto pb-lg">
      <PageShell
        breadcrumbs={
          <nav className="flex flex-wrap items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <Link to="/plans" className="hover:text-primary transition-colors">
              Study Plans
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-semibold line-clamp-1 max-w-full break-all sm:break-normal">
              {plan.subjectName}
            </span>
          </nav>
        }
        title={plan.subjectName}
        description={
          plan.description ||
          "Review and progress through curriculum modules to hit your learning goals."
        }
        actions={actionButtons}
      >
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 max-w-3xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider block mb-1">
                Overall Progress
              </span>
              <span className="font-h3 text-h3 text-on-background">{progress}% Completed</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Est. {Math.round(remainingHours)}h remaining
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-md">
          <h2 className="font-h2 text-h2 text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">
              format_list_bulleted
            </span>
            Curriculum Modules
          </h2>
          <div className="space-y-3">
            {modules.map((topic, index) => (
              <article
                key={topic.topic_key}
                className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60 hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                onClick={(e) => handleNavigateToTopic(e, topic)}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      topic.completionStatus === "completed"
                        ? "border-primary bg-primary text-on-primary"
                        : "border-outline-variant hover:border-primary"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopicCompletion(topic.topic_key, topic.completionStatus);
                    }}
                    aria-label={
                      topic.completionStatus === "completed" ? "Mark incomplete" : "Mark complete"
                    }
                  >
                    {topic.completionStatus === "completed" && (
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-semibold text-on-background group-hover:text-primary transition-colors truncate ${
                        topic.completionStatus === "completed"
                          ? "line-through text-on-surface-variant/60"
                          : ""
                      }`}
                    >
                      {topic.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant flex-wrap">
                      <span>Module {index + 1}</span>
                      <span>•</span>
                      <span>{topic.estimated_hours || 1} hrs est.</span>
                      {topic.completionStatus === "in_progress" && (
                        <>
                          <span>•</span>
                          <span className="text-secondary font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            In Progress
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant shrink-0 sm:hidden ml-2">
                  chevron_right
                </span>
                <div className="hidden sm:flex items-center gap-4 shrink-0 pl-4">
                  <div className="flex items-center gap-2 shrink-0">
                    {topic.completionStatus === "completed" ? (
                      <SecondaryButton
                        onClick={(e) => handleNavigateToTopic(e, topic)}
                        className="!h-9 !min-h-[36px] !px-4 !py-1 text-sm"
                      >
                        Review
                      </SecondaryButton>
                    ) : (
                      <PrimaryButton
                        onClick={(e) => handleNavigateToTopic(e, topic)}
                        className="!h-9 !min-h-[36px] !px-4 !py-1 text-sm gap-1"
                      >
                        {topic.completionStatus === "in_progress" ? "Resume" : "Start"}
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageShell>
    </div>
  );
};

export default SyllabusPage;

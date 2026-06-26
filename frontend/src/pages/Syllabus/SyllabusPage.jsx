import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";
import topicService from "../../services/topicService";
import { PageShell } from "../../components/common/ui";

const SyllabusPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await studyPlanService.getStudyPlanOverview(planId);
        if (response?.success) {
          setPlan(response.data);
        } else {
          setError("Failed to load study plan");
        }
      } catch (requestError) {
        setError(requestError?.message || "Failed to load study plan");
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchOverview();
    }
  }, [planId]);

  // Compute progress percentage dynamically
  const progress = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    if (topics.length === 0) return 0;
    const completed = topics.filter((t) => t.completionStatus === "completed").length;
    return Math.round((completed / topics.length) * 100);
  }, [plan]);

  // Compute remaining estimated study hours dynamically
  const remainingHours = useMemo(() => {
    const topics = Array.isArray(plan?.topics) ? plan.topics : [];
    return topics
      .filter((t) => t.completionStatus !== "completed")
      .reduce((sum, t) => sum + (t.estimated_hours || 1), 0);
  }, [plan]);

  const toggleTopicCompletion = async (topicKey, currentStatus) => {
    const nextStatus = currentStatus === "completed" ? "in_progress" : "completed";

    // Optimistic Update
    setPlan((currentPlan) => {
      if (!currentPlan) return currentPlan;
      const updatedTopics = currentPlan.topics.map((t) =>
        t.topic_key === topicKey ? { ...t, completionStatus: nextStatus } : t
      );
      return {
        ...currentPlan,
        topics: updatedTopics,
      };
    });

    try {
      await topicService.markTopicCompleted(topicKey, nextStatus);
    } catch (err) {
      console.error("Failed to update topic completion status", err);
      // Rollback on failure
      setPlan((currentPlan) => {
        if (!currentPlan) return currentPlan;
        const revertedTopics = currentPlan.topics.map((t) =>
          t.topic_key === topicKey ? { ...t, completionStatus: currentStatus } : t
        );
        return {
          ...currentPlan,
          topics: revertedTopics,
        };
      });
    }
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
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 shadow-[0_4px_15px_-5px_rgba(13,28,46,0.08)] max-w-3xl mt-4">
          <div className="h-4 w-32 bg-surface-container rounded mb-2" />
          <div className="h-8 w-48 bg-surface-container rounded mb-4" />
          <div className="h-2 w-full bg-surface-container rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 min-h-[160px] flex flex-col">
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
      <div className="rounded-xl border border-error/20 bg-error-container p-lg text-on-error-container" role="alert">
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

  return (
    <div className="max-w-container-max mx-auto pb-lg">
        <PageShell
          breadcrumbs={
            <nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <Link to="/plans" className="hover:text-primary transition-colors">
                Study Plans
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold">{plan.subjectName}</span>
            </nav>
          }
          title={plan.subjectName}
          description={plan.description || "Review and progress through curriculum modules to hit your learning goals."}
        >


        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 shadow-[0_4px_15px_-5px_rgba(13,28,46,0.08)] max-w-3xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider block mb-1">
                Overall Progress
              </span>
              <span className="font-h3 text-h3 text-on-background">
                {progress}% Completed
              </span>
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
          <span className="material-symbols-outlined text-primary text-[28px]">format_list_bulleted</span>
          Curriculum Modules
        </h2>

        <div className="space-y-3">
          {modules.map((topic, index) => (
            <article
              key={topic.topic_key}
              className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_2px_8px_-4px_rgba(13,28,46,0.08)] border border-outline-variant/60 hover:shadow-sm transition-all flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group cursor-pointer"
              onClick={() => navigate(`/study/${topic.topic_key}`)}
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
                  aria-label={topic.completionStatus === "completed" ? "Mark incomplete" : "Mark complete"}
                >
                  {topic.completionStatus === "completed" && (
                    <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold text-on-background group-hover:text-primary transition-colors ${
                    topic.completionStatus === "completed" ? "line-through text-on-surface-variant/60" : ""
                  }`}>
                    {topic.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant">
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

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/study/${topic.topic_key}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex h-9 items-center justify-center gap-1 rounded-lg px-3 py-1 font-label-md text-label-md transition-colors ${
                      topic.completionStatus === "completed"
                        ? "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                        : "bg-primary text-on-primary hover:opacity-80 transition-opacity"
                    }`}
                  >
                    {topic.completionStatus === "completed" ? (
                      <>Review</>
                    ) : topic.completionStatus === "in_progress" ? (
                      <>
                        Resume
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </>
                    ) : (
                      <>
                        Start
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </>
                    )}
                  </Link>
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

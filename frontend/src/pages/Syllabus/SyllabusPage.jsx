import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import studyPlanService from "../../services/studyPlanService";
import { formatDate } from "../../utils/formatters";
import {
  ErrorState,
  InlineLinkButton,
  LoadingState,
  PageShell,
  PrimaryButton,
  SectionCard,
} from "../../components/common/ui";

const SyllabusPage = () => {
  const { planId } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sharing, setSharing] = useState(false);

  const getPublicBaseUrl = () => {
    const configured = (import.meta.env.VITE_PUBLIC_APP_URL || "").replace(/\/$/, "");
    if (configured) {
      return configured;
    }
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin.replace(/\/$/, "");
    }
    return "https://distilllearn.com";
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const response = await studyPlanService.shareStudyPlan(planId);
      const shareSlug = response.data?.shareSlug;
      const shareUrl = shareSlug ? `${getPublicBaseUrl()}/shared/${shareSlug}` : response.data?.shareUrl;

      if (shareUrl && typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }

      toast.success(shareUrl ? "Share link copied" : "Study plan is now shareable");
    } catch (requestError) {
      toast.error(requestError.error || requestError.message || "Could not create a share link");
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await studyPlanService.getStudyPlanOverview(planId);
        setOverview(response.data);
      } catch (requestError) {
        setError(requestError.error || requestError.message || "Unable to load study plan");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [planId]);

  if (loading) {
    return <LoadingState label="Loading study plan" />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  return (
    <PageShell
      title={overview?.subjectName || "Study Plan"}
      description={`Exam on ${formatDate(overview?.examDate)}`}
      actions={
        <>
          <Link to="/flashcards">
            <PrimaryButton>Review now</PrimaryButton>
          </Link>
          <PrimaryButton type="button" onClick={handleShare} disabled={sharing}>
            {sharing ? "Sharing..." : "Share"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-6">
        <SectionCard title="Topics" description="Open any topic to study with video, notes, flashcards, and weak-point repair in one flow.">
          <div className="space-y-3">
            {(overview?.topics || []).map((topic) => (
              <Link
                key={topic.topic_key}
                to={`/study/${topic.topic_key}`}
                className="block rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">{topic.name}</h3>
                  </div>

                  <div className="flex items-center gap-4 sm:min-w-55 sm:justify-end">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {topic.dueCount} due
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
};

export default SyllabusPage;

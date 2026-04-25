import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import studyPlanService from "../../services/studyPlanService";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatters";
import { ErrorState, LoadingState, PrimaryButton, SecondaryButton } from "../../components/common/ui";

const SharedStudyPlanPage = () => {
  const { shareSlug } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await studyPlanService.getSharedStudyPlan(shareSlug);
        setPlan(response.data);
      } catch (requestError) {
        setError(requestError.error || requestError.message || "Unable to load this shared study plan");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [shareSlug]);

  const totalHours = useMemo(
    () => (plan?.topics || []).reduce((sum, topic) => sum + (Number(topic.estimated_hours) || 0), 0),
    [plan],
  );

  const handleClone = async () => {
    if (!shareSlug) {
      return;
    }

    if (!isAuthenticated) {
      const returnTo = `${location.pathname}${location.search || ""}`;
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: false });
      return;
    }

    try {
      setCloning(true);
      const response = await studyPlanService.cloneSharedStudyPlan(shareSlug);
      const clonedPlanId = response.data?.studyPlan?._id;
      toast.success("Study plan cloned");
      if (clonedPlanId) {
        navigate(`/plans/${clonedPlanId}`, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (requestError) {
      toast.error(requestError.error || requestError.message || "Failed to clone this study plan");
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading shared study plan" fullScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,147,36,0.16),transparent_40%),linear-gradient(180deg,#fffdf6_0%,#f8fafc_55%,#eef2ff_100%)] p-4">
        <div className="w-full max-w-2xl">
          <ErrorState description={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,147,36,0.16),transparent_40%),linear-gradient(180deg,#fffdf6_0%,#f8fafc_55%,#eef2ff_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl rounded-4xl border border-white/70 bg-white p-5 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.4)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Shared study plan</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{plan?.subjectName || "Study Plan"}</h1>
            <p className="mt-2 text-sm text-slate-600">Exam date: {formatDate(plan?.examDate)} | {(plan?.topics || []).length} topics | {totalHours} estimated hours</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <PrimaryButton type="button" onClick={handleClone} disabled={cloning}>
              {cloning ? "Cloning..." : "Clone this plan"}
            </PrimaryButton>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <SecondaryButton type="button">{isAuthenticated ? "Go to dashboard" : "Sign in"}</SecondaryButton>
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {(plan?.topics || []).map((topic) => {

            return (
              <article key={topic.topic_key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">{topic.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{topic.estimated_hours}h estimated</p>
                  </div>

                  <div className="w-full sm:w-56">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SharedStudyPlanPage;

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import progressService from "../../services/progressService";
import { ErrorState, LoadingState, PrimaryButton, SecondaryButton } from "../../components/common/ui";

const RATING_OPTIONS = [
  { value: "again", label: "Again", tone: "bg-rose-600 hover:bg-rose-500 text-white", hint: "Still stuck" },
  { value: "hard", label: "Hard", tone: "bg-amber-500 hover:bg-amber-400 text-slate-950", hint: "Took effort" },
  { value: "good", label: "Good", tone: "bg-sky-600 hover:bg-sky-500 text-white", hint: "Recall was okay" },
  { value: "easy", label: "Easy", tone: "bg-emerald-600 hover:bg-emerald-500 text-white", hint: "Too easy" },
];

const ReviewQueuePage = () => {
  const [searchParams] = useSearchParams();
  const topicKey = searchParams.get("topicKey") || "";

  const [queue, setQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [sessionSummary, setSessionSummary] = useState(null);

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [queueResponse, dashboardResponse] = await Promise.all([
        flashcardService.getQueue(topicKey),
        progressService.getDashboard().catch(() => null),
      ]);

      const cards = queueResponse.data || [];
      setQueue(cards);
      setInitialCount(cards.length);
      setReviewedCount(0);
      setAgainCount(0);
      setRevealed(false);

      if (dashboardResponse?.data) {
        setDashboardSummary(dashboardResponse.data);
      }
    } catch (requestError) {
      setError(requestError.error || requestError.message || "Unable to load the review queue");
    } finally {
      setLoading(false);
    }
  }, [topicKey]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const currentCard = queue[0] || null;
  const progressPercent = initialCount === 0 ? 0 : Math.round((reviewedCount / initialCount) * 100);



  const handleReview = async (rating) => {
    if (!currentCard) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await flashcardService.reviewCard(currentCard._id, rating);
      setQueue((current) => current.slice(1));
      setReviewedCount((value) => value + 1);
      if (rating === "again") {
        setAgainCount((value) => value + 1);
      }
      setRevealed(false);

      if (response.data?.dashboard) {
        setSessionSummary(response.data.dashboard);
      }


    } catch (requestError) {
      toast.error(requestError.error || requestError.message || "Could not save the review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading review mode" fullScreen />;
  }

  if (error) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl p-4 sm:p-8">
        <ErrorState description={error} action={<SecondaryButton onClick={loadQueue}>Try again</SecondaryButton>} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,147,36,0.16),transparent_38%),linear-gradient(180deg,#fffdf6_0%,#f8fafc_55%,#eef2ff_100%)] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Review mode</p>
              <p className="mt-1 text-sm text-slate-700">
                {topicKey ? "Topic-focused queue" : "Daily queue"} | {queue.length} remaining
              </p>
            </div>
            <Link to="/dashboard" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
              Exit
            </Link>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-slate-950 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-600">Progress: {reviewedCount}/{initialCount || queue.length} ({progressPercent}%)</p>
        </div>



        {!currentCard ? (
          <section className="rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{reviewedCount > 0 ? "Session complete" : "No due cards"}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {reviewedCount > 0 ? "Great run. Here is your session recap." : topicKey ? "This topic is caught up for now." : "You are caught up for now."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reviewed</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{reviewedCount}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Again</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-rose-600">{againCount}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Streak</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{sessionSummary?.streak || dashboardSummary?.streak || 0}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next review</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{sessionSummary?.hoursUntilNextReview || dashboardSummary?.hoursUntilNextReview || 0}h</p>
              </article>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton type="button" onClick={loadQueue}>Refresh queue</PrimaryButton>
              <Link to="/dashboard">
                <SecondaryButton type="button">Back to dashboard</SecondaryButton>
              </Link>

            </div>
          </section>
        ) : (
          <section className="flex flex-1 items-center justify-center py-2 sm:py-4">
            <div className="w-full max-w-4xl space-y-5">
              <div className="flip-card mx-auto block w-full">
                <div className={`flip-card-inner ${revealed ? "flipped" : ""}`}>
                  <article className="flip-card-front rounded-4xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 text-center shadow-[0_25px_70px_-42px_rgba(15,23,42,0.5)] sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">Question</p>
                    <h1 className="mx-auto mt-8 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {currentCard.question}
                    </h1>
                    <p className="mt-6 text-sm text-slate-500">Think first, then reveal when ready.</p>
                  </article>

                  <article className="flip-card-back rounded-4xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)] p-6 text-center shadow-[0_25px_70px_-42px_rgba(15,23,42,0.5)] sm:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Answer</p>
                    <h2 className="mx-auto mt-8 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                      {currentCard.answer}
                    </h2>
                    <p className="mt-6 text-sm text-slate-500">Choose how well you recalled it.</p>
                  </article>
                </div>
              </div>

              {!revealed ? (
                <div className="flex justify-center">
                  <PrimaryButton type="button" className="px-8 py-3 text-base" onClick={() => setRevealed(true)}>
                    Show Answer
                  </PrimaryButton>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {RATING_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReview(option.value)}
                      className={`rounded-2xl px-4 py-4 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${option.tone}`}
                    >
                      <p className="text-lg">{option.label}</p>
                      <p className="mt-1 text-xs font-medium opacity-90">{option.hint}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ReviewQueuePage;

import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import progressService from "../../services/progressService";

const RATING_OPTIONS = [
  { value: "again", label: "Again", color: "border-error text-error hover:bg-error-container", hint: "< 1m" },
  { value: "hard", label: "Hard", color: "border-outline text-on-surface-variant hover:border-primary hover:text-primary", hint: "6m" },
  { value: "good", label: "Good", color: "bg-primary text-on-primary", hint: "10m" },
  { value: "easy", label: "Easy", color: "bg-secondary text-on-secondary", hint: "4d" },
];

export default function ReviewQueuePage() {
  const [searchParams] = useSearchParams();
  const topicKey = searchParams.get("topicKey") || "";

  const [queue, setQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [againCount, setAgainCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);

      const [queueRes] = await Promise.all([
        flashcardService.getQueue(topicKey),
        progressService.getDashboard().catch(() => null),
      ]);

      const cards = queueRes.data || [];
      setQueue(cards);
      setInitialCount(cards.length);
      setReviewedCount(0);
      setAgainCount(0);
      setRevealed(false);
    } catch (err) {
      toast.error("Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [topicKey]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const currentCard = queue[0];
  const progress =
    initialCount === 0
      ? 0
      : Math.round((reviewedCount / initialCount) * 100);

  const handleReview = async (rating) => {
    if (!currentCard || submitting || isFlipping) return;

    try {
      setSubmitting(true);
      setIsFlipping(true);

      // 1. flip back
      setRevealed(false);

      // 2. wait for animation
      await new Promise((res) => setTimeout(res, 500));

      // 3. update backend + queue
      await flashcardService.reviewCard(currentCard._id, rating);

      setQueue((prev) => prev.slice(1));
      setReviewedCount((v) => v + 1);

      if (rating === "again") {
        setAgainCount((v) => v + 1);
      }

      // 4. allow interaction again
      setTimeout(() => {
        setIsFlipping(false);
      }, 50);

    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-on-background">

      {/* HEADER */}
      <header className="flex items-center justify-between px-lg py-md bg-surface-container-lowest border-b border-surface-variant shadow-sm">

        <div className="w-1/4">
          <Link to="/dashboard" className="flex items-center gap-xs text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined text-[20px]">close</span>
            <span className="text-label-md uppercase tracking-wider">End Session</span>
          </Link>
        </div>

        <div className="w-2/4 flex flex-col items-center gap-xs">
          <div className="w-full max-w-md flex justify-between text-label-sm uppercase tracking-wider text-on-surface-variant">
            <span>Today's Queue</span>
            <span className="text-secondary font-semibold">
              {reviewedCount} / {initialCount}
            </span>
          </div>

          <div className="w-full max-w-md h-[8px] bg-tertiary-fixed rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="w-1/4 flex justify-end">
          <div className="flex items-center gap-sm px-sm py-xs bg-surface-container rounded-full">
            <span className="material-symbols-outlined text-[16px] text-primary">
              folder_copy
            </span>
            <span className="text-label-md uppercase tracking-wider">
              {topicKey || "All Topics"}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center p-xl">

        {!currentCard ? (
          <h1 className="text-xl font-semibold">Session complete</h1>
        ) : (
          <div className="w-full max-w-[800px]">

            <div className="flip-card">
              <div className={`flip-card-inner ${revealed ? "flipped" : ""}`}>

                {/* FRONT */}
                <div
                  onClick={() => {
                    if (!revealed && !isFlipping) setRevealed(true);
                  }}
                  className="flip-card-front bg-surface-container-lowest rounded-xl shadow border-t-[3px] border-primary p-xxl flex flex-col justify-center text-center cursor-pointer"
                >
                  <span className="text-label-md uppercase tracking-wider text-on-surface-variant mb-lg">
                    Concept
                  </span>

                  <h2 className="text-h1 max-w-2xl mx-auto">
                    {currentCard.question}
                  </h2>
                </div>

                {/* BACK */}
                <div className="flip-card-back bg-surface-container-lowest rounded-xl shadow border-t-[3px] border-secondary p-xxl flex flex-col justify-center text-center">

                  <span className="text-label-md uppercase tracking-wider text-on-surface-variant mb-md">
                    Explanation
                  </span>

                  <p className="text-body-lg max-w-2xl mx-auto">
                    {currentCard.answer}
                  </p>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            {revealed && (
              <div className="mt-xl grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
                {RATING_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    disabled={submitting || isFlipping}
                    onClick={() => handleReview(opt.value)}
                    className={`flex flex-col items-center justify-center py-md rounded-lg transition ${opt.color}`}
                  >
                    <span className="uppercase">{opt.label}</span>
                    <span className="text-sm opacity-80">{opt.hint}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="pb-xl" />
    </div>
  );
}
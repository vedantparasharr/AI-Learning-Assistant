import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";

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
  const [isFlipping, setIsFlipping] = useState(false);

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      const res = await flashcardService.getQueue(topicKey);
      const cards = res.data || [];
      
      setQueue(cards);
      setInitialCount(cards.length);
      setReviewedCount(0);
      setAgainCount(0);
      setRevealed(false);
    } catch {
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

  const accuracy = reviewedCount > 0 
    ? Math.round(((reviewedCount - againCount) / reviewedCount) * 100) 
    : 0;

  const handleReview = async (rating) => {
    if (!currentCard || isFlipping) return;

    const cardToReview = currentCard;

    // 1. Optimistic Update: Advance queue and update counts immediately
    setQueue((prev) => prev.slice(1));
    setReviewedCount((v) => v + 1);
    if (rating === "again") {
      setAgainCount((v) => v + 1);
    }

    // 2. Start flip-back animation for the NEXT card (or session complete state)
    setIsFlipping(true);
    setRevealed(false);

    // 3. Backend call in background
    flashcardService.reviewCard(cardToReview._id, rating).catch((err) => {
      console.error("Failed to sync review:", err);
      toast.error("Connection error: Review not synced");
    });

    // 4. Reset flipping state after animation completes (matches CSS transition)
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
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
          <div className="w-full max-w-md text-center">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-surface-variant">
              <div className="w-16 h-16 bg-primary-container text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">task_alt</span>
              </div>
              
              <h2 className="text-h3 font-h3 text-on-background mb-8">Session Complete</h2>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-display text-primary leading-none mb-1">{reviewedCount}</span>
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Reviewed</span>
                </div>
                <div className="flex flex-col border-x border-surface-variant">
                  <span className="text-3xl font-display text-error leading-none mb-1">{againCount}</span>
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Again</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-display text-secondary leading-none mb-1">{accuracy}%</span>
                  <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Accuracy</span>
                </div>
              </div>

              {againCount > 0 && (
                <p className="text-body-md text-on-surface-variant mb-8 px-4">
                  {againCount} {againCount === 1 ? 'card' : 'cards'} marked "again" will come back in your next session.
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={loadQueue}
                  className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-3 rounded-lg shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  Review Again
                </button>
                <Link 
                  to="/dashboard" 
                  className="w-full border border-outline text-primary font-label-md text-label-md uppercase tracking-wider py-3 rounded-lg hover:bg-surface-container transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
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
                    disabled={isFlipping}
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
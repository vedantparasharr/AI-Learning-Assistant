import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";
import { LoadingState } from "../../components/common/ui";

const RATING_OPTIONS = [
  { value: "again", label: "Again", hint: "< 1m" },
  { value: "hard", label: "Hard", hint: "6m" },
  { value: "good", label: "Good", hint: "10m" },
  { value: "easy", label: "Easy", hint: "4d" },
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

  const [lastReviewedCard, setLastReviewedCard] = useState(null);
  const [lastRating, setLastRating] = useState(null);

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
      setLastReviewedCard(null);
      setLastRating(null);
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

  const handleReview = useCallback(async (rating) => {
    if (!currentCard || isFlipping) return;

    const cardToReview = currentCard;

    // Track for undo
    setLastReviewedCard(cardToReview);
    setLastRating(rating);

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
  }, [currentCard, isFlipping]);

  const handleUndo = useCallback(() => {
    if (!lastReviewedCard) return;

    // Restore to queue
    setQueue((prev) => [lastReviewedCard, ...prev]);
    setReviewedCount((v) => Math.max(0, v - 1));
    if (lastRating === "again") {
      setAgainCount((v) => Math.max(0, v - 1));
    }

    // Reset undo state
    setLastReviewedCard(null);
    setLastRating(null);
    setRevealed(false);
    toast.success("Review undone");
  }, [lastReviewedCard, lastRating]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Space or Enter to reveal
      if (e.key === " " || e.key === "Enter") {
        if (!revealed && currentCard && !isFlipping) {
          e.preventDefault();
          setRevealed(true);
        }
      }

      // Ratings: 1-4
      if (revealed && currentCard && !isFlipping) {
        if (key === "1") {
          e.preventDefault();
          handleReview("again");
        } else if (key === "2") {
          e.preventDefault();
          handleReview("hard");
        } else if (key === "3") {
          e.preventDefault();
          handleReview("good");
        } else if (key === "4") {
          e.preventDefault();
          handleReview("easy");
        }
      }

      // Undo: z / Z
      if (key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [revealed, currentCard, isFlipping, lastReviewedCard, lastRating, handleReview, handleUndo]);

  if (loading) {
    return (
      <div className="flex-1 w-full max-w-container-max mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <LoadingState label="Loading your session..." />
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-lg">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">
            {topicKey ? `Review: ${topicKey}` : "Global Review Queue"}
          </h1>
        </div>

        {/* MINIMAL PROGRESS AND UNDO */}
        <div className="flex items-center gap-4 text-body-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-4 py-2 shadow-sm h-11">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">Progress</span>
            <span className="text-secondary font-bold text-xs">{reviewedCount} / {initialCount}</span>
            {lastReviewedCard && (
              <button
                onClick={handleUndo}
                className="text-primary hover:text-primary-container font-semibold transition-colors flex items-center gap-1 focus:outline-none focus:underline text-[11px] ml-2"
                title="Undo last rating (shortcut: z)"
              >
                <span className="material-symbols-outlined text-[14px]">undo</span>
                Undo
              </button>
            )}
          </div>
          
          <div className="flex-1 h-[4px] bg-surface-container-high rounded-[9999px] overflow-hidden min-w-[60px] max-w-[120px]">
            <div
              className="h-full bg-secondary transition-all duration-500 ease-out rounded-[9999px]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        {!currentCard ? (
          <div className="w-full max-w-md text-center">
            <div className="bg-surface-container-lowest rounded-[12px] p-8 border border-outline-variant/60 shadow-sm">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">task_alt</span>
              </div>
              
              <h2 className="text-h3 font-h3 text-on-surface mb-8">Session Complete</h2>

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
                  className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-3 rounded-xl hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  Review Again
                </button>
                <Link 
                  to="/dashboard" 
                  className="w-full border border-outline-variant text-primary font-label-md text-label-md uppercase tracking-wider py-3 rounded-xl hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors block text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[800px]">

            <div className="flip-card mx-auto min-h-[400px] w-full">
              <div className={`flip-card-inner ${revealed ? "flipped" : ""} min-h-[400px]`}>

                {/* FRONT */}
                <button
                  onClick={() => {
                    if (!revealed && !isFlipping) setRevealed(true);
                  }}
                  className="flip-card-front bg-surface-container-lowest rounded-[12px] border border-outline-variant/60 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all p-12 flex flex-col justify-center text-center cursor-pointer min-h-[400px] w-full"
                >
                  <span className="text-label-md uppercase tracking-wider text-on-surface-variant mb-8 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">school</span>
                    Concept
                  </span>

                  <div className="overflow-y-auto max-h-[250px] w-full px-2">
                    <h2 className="text-h2 font-display text-on-surface max-w-2xl mx-auto">
                      {currentCard.question}
                    </h2>
                  </div>

                  <span className="text-[11px] text-on-surface-variant/60 mt-8 lowercase italic">
                    (Click card or press Space to reveal answer)
                  </span>
                </button>

                {/* BACK */}
                <div className="flip-card-back bg-surface-container-lowest rounded-[12px] border border-outline-variant/60 p-12 flex flex-col justify-center text-center min-h-[400px] w-full">
                  <span className="text-label-md uppercase tracking-wider text-on-surface-variant mb-6 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">explore</span>
                    Explanation
                  </span>

                  <div className="overflow-y-auto max-h-[280px] w-full px-2">
                    <p className="text-body-lg text-on-surface max-w-2xl mx-auto leading-relaxed">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ACTIONS */}
            <div className="w-full min-h-[96px] relative flex items-center justify-center mt-8">
              {/* SHOW ANSWER BUTTON */}
              <div
                className={`w-full max-w-xs transition-all duration-300 transform ${
                  revealed
                    ? "opacity-0 scale-95 pointer-events-none absolute"
                    : "opacity-100 scale-100 relative"
                }`}
              >
                <button
                  disabled={isFlipping || revealed}
                  onClick={() => {
                    if (!isFlipping) setRevealed(true);
                  }}
                  className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider rounded-xl hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                  Show Answer
                  <span className="text-[10px] opacity-60 lowercase font-normal">(space)</span>
                </button>
              </div>

              {/* RATING OPTIONS BUTTONS */}
              <div
                className={`w-full transition-all duration-300 transform ${
                  revealed
                    ? "opacity-100 scale-100 relative"
                    : "opacity-0 scale-95 pointer-events-none absolute"
                }`}
              >
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 w-full">
                  {RATING_OPTIONS.map((opt, idx) => {
                    let btnClasses = "";
                    if (opt.value === "again") {
                      btnClasses = "border-error text-error hover:bg-error/10 focus:ring-error";
                    } else if (opt.value === "hard") {
                      btnClasses = "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-primary";
                    } else if (opt.value === "good") {
                      btnClasses = "border-primary text-primary hover:bg-primary/10 focus:ring-primary";
                    } else if (opt.value === "easy") {
                      btnClasses = "border-secondary text-secondary hover:bg-secondary/10 focus:ring-secondary";
                    }

                    return (
                      <button
                        key={opt.value}
                        disabled={isFlipping || !revealed}
                        onClick={() => handleReview(opt.value)}
                        className={`flex flex-col items-center justify-center py-3 rounded-xl border bg-surface-container-lowest transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnClasses}`}
                      >
                        <span className="uppercase font-semibold tracking-wider text-sm mb-0.5 flex items-center gap-1">
                          {opt.label}
                          <span className="text-[10px] opacity-60 font-normal">({idx + 1})</span>
                        </span>
                        <span className="text-[11px] opacity-75">{opt.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
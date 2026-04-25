import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import topicService from "../../services/topicService";
import {
  ErrorState,
  InlineLinkButton,
  PageShell,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
} from "../../components/common/ui";

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

const getTodayKey = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const getPomodoroStorageKey = () => `distilllearn:pomodoro:sessions:${getTodayKey()}`;

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const playSoftNotification = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }
    const context = new AudioContextClass();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = "sine";
    osc.frequency.value = 680;
    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.45);
  } catch {
    // Ignore notification audio failures silently.
  }
};

const PomodoroWidget = ({ topicKey }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    return Number(window.localStorage.getItem(getPomodoroStorageKey())) || 0;
  });
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          playSoftNotification();

          if (mode === "work") {
            const nextCount = sessionCount + 1;
            setSessionCount(nextCount);
            if (typeof window !== "undefined") {
              window.localStorage.setItem(getPomodoroStorageKey(), String(nextCount));
            }
            setMode("break");
            setShowNudge(true);
            return BREAK_SECONDS;
          }

          setMode("work");
          return WORK_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [mode, running, sessionCount]);

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(mode === "work" ? WORK_SECONDS : BREAK_SECONDS);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 w-75 max-w-[calc(100vw-2rem)]">
      {collapsed ? (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="ml-auto flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)]"
        >
          Pomodoro {formatTimer(secondsLeft)}
        </button>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pomodoro</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{mode === "work" ? "Work block" : "Break block"}</p>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="rounded-xl border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600"
            >
              Hide
            </button>
          </div>

          <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{formatTimer(secondsLeft)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Today: {sessionCount} work sessions</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton type="button" onClick={() => setRunning((current) => !current)}>
              {running ? "Pause" : "Play"}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={resetTimer}>
              Reset
            </SecondaryButton>
          </div>

          {showNudge ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Work block complete. Great focus. 
              <Link to={`/flashcards?topicKey=${topicKey}`} className="font-semibold underline underline-offset-4">
                Review this topic now
              </Link>
              .
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const TopicStudySkeleton = () => (
  <PageShell title="Preparing topic" description="Generating the best study material for this topic.">
    <div className="space-y-6">
      <div className="skeleton-block h-44 rounded-3xl" />
      <div className="skeleton-block h-80 rounded-3xl" />
      <div className="skeleton-block h-56 rounded-3xl" />
      <div className="skeleton-block h-48 rounded-3xl" />
    </div>
  </PageShell>
);

const TopicStudyPage = () => {
  const { topicKey } = useParams();
  const timeoutRef = useRef(null);
  const [loadingState, setLoadingState] = useState("loading");
  const [payload, setPayload] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  const [error, setError] = useState("");

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fetchTopic = useCallback(async ({ reset = false } = {}) => {
    try {
      if (reset) {
        setLoadingState("loading");
        setPayload(null);
        setError("");
      }

      const response = await topicService.generateTopicContent(topicKey);
      const data = response.body?.data || null;
      if (data) {
        setPayload(data);
        setSelectedVideoId(data.content?.video?.videoId || "");
      }

      if (response.status === 202) {
        setLoadingState("generating");
        return;
      }

      if (response.status === 500) {
        setLoadingState("error");
        setError(response.body?.error || "Topic generation failed.");
        return;
      }

      setLoadingState("ready");
      setError("");
    } catch (requestError) {
      setLoadingState("error");
      setError(requestError.error || requestError.message || "Unable to load this topic");
    }
  }, [topicKey]);

  useEffect(() => {
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      fetchTopic({ reset: true });
    }, 0);

    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout, fetchTopic]);

  useEffect(() => {
    if (loadingState !== "generating") {
      return undefined;
    }

    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      fetchTopic();
    }, 3000);

    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout, fetchTopic, loadingState]);

  const topic = payload?.topic || null;
  const content = payload?.content || null;
  const cards = payload?.cards || [];

  const videos = useMemo(() => {
    const primary = content?.video ? [content.video] : [];
    return [...primary, ...(content?.fallback_videos || [])].filter(Boolean);
  }, [content]);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.videoId === selectedVideoId) || videos[0] || null,
    [videos, selectedVideoId],
  );

  const dueCards = cards.filter((card) => new Date(card.due) <= new Date());

  if (loadingState === "loading" || loadingState === "generating") {
    return <TopicStudySkeleton />;
  }

  if (loadingState === "error") {
    return (
      <PageShell title={topic?.name || "Topic"} description="We couldn�t prepare this topic right now.">
        <ErrorState description={error} action={<SecondaryButton onClick={() => fetchTopic({ reset: true })}>Try again</SecondaryButton>} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={topic?.name || "Topic"}
      description={`${topic?.dueCount || 0} due`}
      actions={
        <>
          <Link to={`/flashcards?topicKey=${topicKey}`}>
            <PrimaryButton>Review Now</PrimaryButton>
          </Link>
          <InlineLinkButton to={`/plans/${topic?.studyPlanId}`}>Back to study plan</InlineLinkButton>
        </>
      }
    >
      <div className="space-y-6">
        <SectionCard title="Video" description="Top-ranked learning video for this topic.">
          {selectedVideo ? (
            <div className="space-y-4">
              {videos.length > 1 ? (
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Switch video</span>
                  <select
                    value={selectedVideo.videoId}
                    onChange={(event) => setSelectedVideoId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  >
                    {videos.map((video, index) => (
                      <option key={video.videoId || `${video.url}-${index}`} value={video.videoId}>
                        {index === 0 ? "Best match" : `Alternative ${index}`}: {video.title}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.65)]">
                <div className="aspect-video">
                  <iframe
                    title={selectedVideo.title}
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No high-confidence video result yet for this topic.</p>
          )}
        </SectionCard>

        <SectionCard
          title="Notes"
          description="Short, exam-focused notes. Collapse them once you�re done so the screen stays clean."
          action={
            <SecondaryButton type="button" onClick={() => setShowNotes((current) => !current)}>
              {showNotes ? "Collapse" : "Expand"}
            </SecondaryButton>
          }
        >
          {showNotes ? (
            <div className="study-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content?.notes || "No notes available."}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Notes are collapsed.</p>
          )}
        </SectionCard>

        <SectionCard title="Flashcards" description="Topic cards are listed here. Due cards are highlighted so you know what needs attention first.">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">{cards.length} card(s) in this topic</p>
            <p className="text-sm font-semibold text-slate-900">{dueCards.length} due now</p>
          </div>

          <div className="space-y-3">
            {cards.map((card) => {
              const dueNow = new Date(card.due) <= new Date();
              return (
                <article
                  key={card._id}
                  className={`rounded-3xl border p-4 ${dueNow ? "border-rose-200 bg-rose-50/60" : "border-slate-200 bg-white"}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-slate-950">{card.question}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{card.answer}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                        {card.source}
                      </span>
                      {dueNow ? (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                          Due
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>
      </div>
      <PomodoroWidget topicKey={topicKey} />
    </PageShell>
  );
};

export default TopicStudyPage;

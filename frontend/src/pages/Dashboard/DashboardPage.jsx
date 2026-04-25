import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import progressService from "../../services/progressService";
import {
  EmptyState,
  ErrorState,
  InlineLinkButton,
  LoadingState,
  PageShell,
  PrimaryButton,
} from "../../components/common/ui";

const getDaysUntilExam = (value) => {
  const examDate = new Date(value);
  if (Number.isNaN(examDate.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(
    0,
    Math.ceil((examDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)),
  );
};

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await progressService.getDashboard();
        setDashboard(response.data);
      } catch (requestError) {
        setError(
          requestError.error ||
            requestError.message ||
            "Unable to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const firstSubject = useMemo(
    () => (dashboard?.subjects || [])[0] || null,
    [dashboard],
  );
  const daysUntilExam = firstSubject
    ? getDaysUntilExam(firstSubject.examDate)
    : null;

  if (loading) {
    return <LoadingState label="Loading pressure screen" />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  if (!dashboard?.subjects?.length) {
    return (
      <PageShell
        title="Dashboard"
        description="Open the loop by creating your first study plan."
        actions={
          <InlineLinkButton to="/study-plan/new">
            Create study plan
          </InlineLinkButton>
        }
      >
        <EmptyState
          title="No study plan yet"
          description="Paste notes, upload a PDF, or ask AI what you want to study. DistillLearn will build your subject workspace with review cards and topic study pages."
          action={
            <InlineLinkButton to="/study-plan/new">Start here</InlineLinkButton>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Dashboard"
      description="Open -> Review -> Fix weak topics -> Repeat until exam."
    >
      <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)] sm:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <Flame className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em]">
                Streak
              </p>
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {dashboard.streak || 0}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Days until exam
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              {daysUntilExam ?? "-"}
            </p>
          </article>
        </div>

        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {dashboard.dueCards > 0
              ? `You have ${dashboard.dueCards} cards due`
              : "All caught up"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {dashboard.dueCards > 0
              ? `You have cards due to review today.`
              : `Next review in ${dashboard.hoursUntilNextReview || 18} hour${dashboard.hoursUntilNextReview === 1 ? "" : "s"}.`}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/flashcards">
              <PrimaryButton>Start Review</PrimaryButton>
            </Link>
            <InlineLinkButton to="/study-plan/new">
              Add another study plan
            </InlineLinkButton>
          </div>
        </section>

        <div className="space-y-4">
          {dashboard.subjects.map((subject) => (
            <article
              key={subject.id}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                    {subject.subjectName}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {subject.topicCount} topics |{" "}
                    {subject.cardCount} cards | {subject.dueCount} due
                  </p>
                </div>

                <Link
                  to={`/plans/${subject.id}`}
                  className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
                >
                  Continue studying
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </PageShell>
  );
};

export default DashboardPage;

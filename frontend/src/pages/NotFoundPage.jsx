import { Link } from "react-router-dom";
import { InlineLinkButton, PageShell, SectionCard } from "../components/common/ui";

const NotFoundPage = () => {
  return (
    <PageShell
      title="Page not found"
      description="The page you requested does not exist in the current DistillLearn 2.0 flow."
    >
      <SectionCard>
        <div className="space-y-4 text-sm text-slate-600">
          <p>
            Try heading back to the dashboard or opening the study plan builder to continue.
          </p>
          <div className="flex flex-wrap gap-3">
            <InlineLinkButton to="/dashboard">Go to dashboard</InlineLinkButton>
            <Link
              to="/study-plan/new"
              className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Build a study plan
            </Link>
          </div>
        </div>
      </SectionCard>
    </PageShell>
  );
};

export default NotFoundPage;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";
import { ErrorState, LoadingState } from "../../components/common/ui";

const subjectOptions = ["All Subjects", "Sciences", "Economics", "Humanities"];

const getPlanId = (plan) => plan?._id || plan?.id;

const inferSubjectGroup = (plan) => {
  const name = String(plan?.subjectName || "").toLowerCase();

  if (/(science|biology|physics|chemistry|neuro|medicine|math|data|computer)/.test(name)) {
    return "Sciences";
  }

  if (/(economics|finance|market|business|accounting)/.test(name)) {
    return "Economics";
  }

  if (/(history|literature|philosophy|politics|sociology|humanities)/.test(name)) {
    return "Humanities";
  }

  return "Sciences";
};

const calculateProgress = (topics = []) => {
  if (!topics.length) {
    return 0;
  }

  const completedCount = topics.filter((topic) => topic.completionStatus === "completed").length;
  return Math.round((completedCount / topics.length) * 100);
};

const StudyPlanCard = ({ plan, highlighted = false }) => {
  const planId = getPlanId(plan);
  const topics = plan.topics || [];
  const progress = calculateProgress(topics);
  const cardCount = topics.reduce((total, topic) => total + (Number(topic.totalCards) || 0), 0);
  const firstTopic = topics[0]?.name || "A distilled learning path built from your materials.";

  return (
    <article
      className={`bg-surface-container-lowest border-t-2 ${
        highlighted ? "border-primary" : "border-outline-variant hover:border-primary"
      } rounded-xl p-lg flex flex-col shadow-sm shadow-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 group min-h-[280px]`}
    >
      <div className="flex justify-between items-start mb-md">
        <span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">
          {plan.subjectName || "Study Plan"}
        </span>
        <button className="text-outline hover:text-on-surface transition-colors" type="button" aria-label="Plan actions">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>

      <Link to={`/plans/${planId}`} className="block">
        <h3 className="font-h3 text-h3 text-on-surface mb-xs group-hover:text-primary transition-colors cursor-pointer">
          {plan.subjectName || "Untitled Study Plan"}
        </h3>
      </Link>

      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-lg">
        {firstTopic}
      </p>

      <div className="flex items-center gap-lg mb-xl mt-auto">
        <div className="flex items-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">subject</span>
          <span className="font-label-md text-label-md">{topics.length} Topics</span>
        </div>
        <div className="flex items-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">style</span>
          <span className="font-label-md text-label-md">{cardCount} Cards</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-xs">
          <span className="font-label-md text-label-md text-on-surface-variant">Progress</span>
          <span className="font-label-md text-label-md text-secondary">{progress}%</span>
        </div>
        <div className="h-[8px] w-full bg-tertiary-fixed rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
};

const StudyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("Last Active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await studyPlanService.getStudyPlans();
        const basePlans = response?.data || [];

        const plansWithMetrics = await Promise.all(
          basePlans.map(async (plan) => {
            try {
              const overview = await studyPlanService.getStudyPlanOverview(getPlanId(plan));
              return { ...plan, topics: overview?.data?.topics || plan.topics || [] };
            } catch {
              return plan;
            }
          }),
        );

        setPlans(plansWithMetrics);
      } catch (requestError) {
        setError(requestError.error || requestError.message || "Unable to load study plans");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const visiblePlans = useMemo(() => {
    const filteredPlans =
      subjectFilter === "All Subjects"
        ? plans
        : plans.filter((plan) => inferSubjectGroup(plan) === subjectFilter);

    return [...filteredPlans].sort((left, right) => {
      if (sortBy === "Recently Added") {
        return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      }

      if (sortBy === "Progress (High-Low)") {
        return calculateProgress(right.topics) - calculateProgress(left.topics);
      }

      return new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0);
    });
  }, [plans, sortBy, subjectFilter]);

  if (loading) {
    return <LoadingState label="Loading study plans" />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-xl">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface mb-xs">Study Plans</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your active curriculums and distilled learning paths.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <div className="relative">
            <select
              className="appearance-none bg-surface-container-lowest border border-outline-variant rounded p-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm min-w-[160px] cursor-pointer"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              {subjectOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-surface-container-lowest border border-outline-variant rounded p-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm min-w-[160px] cursor-pointer"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option>Last Active</option>
              <option>Recently Added</option>
              <option>Progress (High-Low)</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {visiblePlans.map((plan, index) => (
          <StudyPlanCard key={getPlanId(plan)} plan={plan} highlighted={index === 0} />
        ))}

        <Link
          to="/study-plan/new"
          className="bg-surface border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-lowest rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-none transition-all duration-300 cursor-pointer group min-h-[280px]"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-on-primary">add</span>
          </div>
          <h3 className="font-h3 text-h3 text-on-surface mb-xs">Create Plan</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Compile a new curriculum</p>
        </Link>
      </div>
    </div>
  );
};

export default StudyPlans;

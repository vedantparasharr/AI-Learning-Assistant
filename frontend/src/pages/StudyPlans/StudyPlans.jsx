import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";

const SORTS = {
	LAST_ACTIVE: "last-active",
	RECENTLY_ADDED: "recently-added",
	PROGRESS: "progress",
};

const toEpoch = (value) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const StudyPlans = () => {
	const [plans, setPlans] = useState([]);
	const [subjectFilter, setSubjectFilter] = useState("all");
	const [sortBy, setSortBy] = useState(SORTS.LAST_ACTIVE);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [openMenuPlanId, setOpenMenuPlanId] = useState("");
	const [deletingPlanId, setDeletingPlanId] = useState("");
	const [searchParams] = useSearchParams();
	const query = searchParams.get("query")?.trim().toLowerCase() || "";

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await studyPlanService.getStudyPlans();
				const incomingPlans = Array.isArray(response?.data) ? response.data : [];
				setPlans(incomingPlans);
			} catch (requestError) {
				setError(requestError?.message || "Failed to load study plans");
			} finally {
				setLoading(false);
			}
		};

		fetchPlans();
	}, []);

	const subjects = useMemo(() => {
		const unique = [...new Set(plans.map((plan) => plan.subjectTag).filter(Boolean))];
		return unique.sort((left, right) => left.localeCompare(right));
	}, [plans]);

	const filteredAndSortedPlans = useMemo(() => {
		const filtered = subjectFilter === "all"
			? plans
			: plans.filter((plan) => plan.subjectTag === subjectFilter);

		const searched = query
			? filtered.filter((plan) => {
				const haystack = [plan.subjectName, plan.subjectTag, plan.snippet]
					.join(" ")
					.toLowerCase();
				return haystack.includes(query);
			})
			: filtered;

		const sorted = [...searched];
		if (sortBy === SORTS.RECENTLY_ADDED) {
			sorted.sort((left, right) => toEpoch(right.createdAt) - toEpoch(left.createdAt));
			return sorted;
		}

		if (sortBy === SORTS.PROGRESS) {
			sorted.sort((left, right) => (right.progressPercentage || 0) - (left.progressPercentage || 0));
			return sorted;
		}

		sorted.sort((left, right) => toEpoch(right.updatedAt) - toEpoch(left.updatedAt));
		return sorted;
	}, [plans, sortBy, subjectFilter, query]);

	const handleDeletePlan = async (planId) => {
		const targetPlan = plans.find((plan) => String(plan.id) === String(planId));
		const confirmed = window.confirm(
			`Delete ${targetPlan?.subjectName || "this study plan"}? This action cannot be undone.`,
		);

		if (!confirmed) {
			return;
		}

		try {
			setDeletingPlanId(String(planId));
			setError("");
			await studyPlanService.deleteStudyPlan(planId);
			setPlans((current) => current.filter((plan) => String(plan.id) !== String(planId)));
			setOpenMenuPlanId("");
		} catch (requestError) {
			setError(requestError?.message || "Failed to delete study plan");
		} finally {
			setDeletingPlanId("");
		}
	};

	return (
		<>
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
							value={subjectFilter}
							onChange={(event) => setSubjectFilter(event.target.value)}
							className="appearance-none bg-surface-container-lowest border border-outline-variant rounded p-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm min-w-[160px] cursor-pointer"
						>
							<option value="all">All Subjects</option>
							{subjects.map((subject) => (
								<option key={subject} value={subject}>
									{subject}
								</option>
							))}
						</select>
						<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
							expand_more
						</span>
					</div>

					<div className="relative">
						<select
							value={sortBy}
							onChange={(event) => setSortBy(event.target.value)}
							className="appearance-none bg-surface-container-lowest border border-outline-variant rounded p-2 pl-4 pr-10 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm min-w-[160px] cursor-pointer"
						>
							<option value={SORTS.LAST_ACTIVE}>Last Active</option>
							<option value={SORTS.RECENTLY_ADDED}>Recently Added</option>
							<option value={SORTS.PROGRESS}>Progress (High-Low)</option>
						</select>
						<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
							expand_more
						</span>
					</div>
				</div>
			</div>

			{error ? (
				<div className="bg-error-container text-on-error-container border border-error rounded-xl p-lg mb-xl">
					{error}
				</div>
			) : null}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
				{!loading && filteredAndSortedPlans.map((plan, index) => {
					const isFeatured = index === 0;
					const borderClass = isFeatured
						? "border-t-2 border-primary"
						: "border-t-2 border-outline-variant hover:border-primary";
					const menuOpen = String(openMenuPlanId) === String(plan.id);

					return (
						<div
							key={plan.id}
							className={`bg-surface-container-lowest rounded-xl p-lg flex flex-col shadow-sm shadow-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 group ${borderClass}`}
						>
							<div className="flex justify-between items-start mb-md">
								<span className="bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full">
									{plan.subjectTag || "General"}
								</span>
								<div className="relative">
									<button
										type="button"
										className="text-outline hover:text-on-surface transition-colors"
										onClick={() => setOpenMenuPlanId(menuOpen ? "" : String(plan.id))}
										aria-label="Plan options"
									>
										<span className="material-symbols-outlined text-[20px]">more_vert</span>
									</button>

									{menuOpen ? (
										<div className="absolute right-0 mt-2 w-36 rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_10px_30px_-15px_rgba(49,46,129,0.2)] z-10 py-1">
											<button
												type="button"
												onClick={() => handleDeletePlan(plan.id)}
												disabled={deletingPlanId === String(plan.id)}
												className="w-full text-left px-3 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
											>
												{deletingPlanId === String(plan.id) ? "Deleting..." : "Delete Plan"}
											</button>
										</div>
									) : null}
								</div>
							</div>

							<Link to={`/plans/${plan.id}`} className="block">
								<h3 className="font-h3 text-h3 text-on-surface mb-xs group-hover:text-primary transition-colors cursor-pointer">
									{plan.subjectName}
								</h3>

								<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-lg">
									{plan.snippet}
								</p>
							</Link>

							<Link to={`/plans/${plan.id}`} className="block">
								<div className="flex items-center gap-lg mb-xl mt-auto">
									<div className="flex items-center gap-xs text-on-surface-variant">
										<span className="material-symbols-outlined text-[18px]">subject</span>
										<span className="font-label-md text-label-md">{plan.topicCount || 0} Topics</span>
									</div>

									<div className="flex items-center gap-xs text-on-surface-variant">
										<span className="material-symbols-outlined text-[18px]">style</span>
										<span className="font-label-md text-label-md">{plan.cardCount || 0} Cards</span>
									</div>
								</div>

								<div>
									<div className="flex justify-between items-end mb-xs">
										<span className="font-label-md text-label-md text-on-surface-variant">Progress</span>
										<span className="font-label-md text-label-md text-secondary">
											{plan.progressPercentage || 0}%
										</span>
									</div>
									<div className="h-[8px] w-full bg-tertiary-fixed rounded-full overflow-hidden">
										<div
											className="h-full bg-secondary rounded-full"
											style={{ width: `${plan.progressPercentage || 0}%` }}
										/>
									</div>
								</div>
							</Link>
						</div>
					);
				})}

				<Link
					to="/study-plan/new"
					className="bg-surface border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-lowest rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-none transition-all duration-300 cursor-pointer group min-h-[280px]"
				>
					<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-container transition-colors">
						<span className="material-symbols-outlined text-[32px] text-primary group-hover:text-on-primary">
							add
						</span>
					</div>
					<h3 className="font-h3 text-h3 text-on-surface mb-xs">Create Plan</h3>
					<p className="font-body-sm text-body-sm text-on-surface-variant">Compile a new curriculum</p>
				</Link>
			</div>

			{!loading && filteredAndSortedPlans.length === 0 ? (
				<p className="text-on-surface-variant mt-lg">No study plans match the selected filter.</p>
			) : null}

			{loading ? (
				<p className="text-on-surface-variant mt-lg">Loading study plans...</p>
			) : null}
		</>
	);
};

export default StudyPlans;

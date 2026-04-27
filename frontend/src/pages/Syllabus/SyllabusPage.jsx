import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";

const topicAccent = (stage) => {
	if (stage === "completed") {
		return {
			icon: "psychiatry",
			iconWrap: "bg-surface text-secondary",
			badgeWrap: "bg-secondary-container text-on-secondary-container",
			badgeIcon: "check_circle",
			badgeText: "Completed",
			cardClass:
				"bg-surface-container-lowest rounded-xl p-lg relative overflow-hidden group border border-surface-variant hover:shadow-[0_15px_30px_-10px_rgba(26,20,107,0.1)] transition-all duration-300",
			topRule: "bg-secondary-fixed",
			actionText: "Review",
			actionClass: "font-label-md text-label-md text-primary hover:text-primary-container transition-colors",
		};
	}

	if (stage === "in_progress") {
		return {
			icon: "electric_bolt",
			iconWrap: "bg-primary-fixed text-primary",
			badgeWrap: "bg-primary-container text-on-primary shadow-sm",
			badgeIcon: "clock_loader_40",
			badgeText: "In Progress",
			cardClass:
				"bg-surface-container-lowest rounded-xl p-lg relative overflow-hidden group shadow-[0_10px_30px_-15px_rgba(26,20,107,0.15)] border-t-[3px] border-t-primary border-l border-r border-b border-surface-variant transform md:-translate-y-1 transition-all duration-300",
			topRule: "",
			actionText: "Resume",
			actionClass:
				"flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors",
		};
	}

	return {
		icon: "science",
		iconWrap: "bg-surface-variant text-primary",
		badgeWrap: "bg-primary-fixed text-primary",
		badgeIcon: "radio_button_unchecked",
		badgeText: "Not Started",
		cardClass:
			"bg-surface-container-lowest rounded-xl p-lg relative overflow-hidden group border border-outline-variant hover:border-primary hover:shadow-[0_15px_30px_-10px_rgba(26,20,107,0.08)] transition-all duration-300",
		topRule: "",
		actionText: "Start",
		actionClass:
			"flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary-container transition-colors",
	};
};

const SyllabusPage = () => {
	const { planId } = useParams();
	const [plan, setPlan] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchOverview = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await studyPlanService.getStudyPlanOverview(planId);
				if (response?.success) {
					setPlan(response.data);
				} else {
					setError("Failed to load study plan");
				}
			} catch (requestError) {
				setError(requestError?.message || "Failed to load study plan");
			} finally {
				setLoading(false);
			}
		};

		if (planId) {
			fetchOverview();
		}
	}, [planId]);

	const progress = plan?.progressPercentage || 0;
	const modules = useMemo(() => plan?.topics || [], [plan]);

	if (loading) {
		return <p className="text-on-surface-variant">Loading study plan...</p>;
	}

	if (error) {
		return <p className="text-error">{error}</p>;
	}

	if (!plan) {
		return <p className="text-on-surface-variant">Study plan not found.</p>;
	}

	return (
		<>
			<div className="mb-xxl max-w-3xl">
				<nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-lg">
					<Link to="/plans" className="hover:text-primary transition-colors">
						Study Plans
					</Link>
					<span className="material-symbols-outlined text-[14px]">chevron_right</span>
					<span className="text-primary font-semibold">{plan.subjectName}</span>
				</nav>

				<h1 className="font-display text-display text-on-background mb-unit">
					{plan.subjectName}
				</h1>

				<p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">
					{plan.description}
				</p>

				<div className="bg-surface-container-lowest p-lg rounded-xl shadow-[0_10px_20px_-10px_rgba(26,20,107,0.05)] border border-surface-variant">
					<div className="flex justify-between items-end mb-md">
						<div>
							<span className="font-label-md text-label-md text-primary tracking-widest uppercase block mb-xs">
								Overall Progress
							</span>
							<span className="font-h3 text-h3 text-on-background">
								{progress}% Completed
							</span>
						</div>

						<span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
							<span className="material-symbols-outlined text-[16px]">schedule</span>
							Est. {Math.round(plan.remainingEstimatedHours || 0)}h remaining
						</span>
					</div>

					<div className="h-[8px] w-full bg-tertiary-fixed rounded-full overflow-hidden relative">
						<div
							className="absolute top-0 left-0 h-full bg-secondary-fixed rounded-full transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</div>

			<div className="mb-xl">
				<h2 className="font-h2 text-h2 text-on-background mb-lg flex items-center gap-3">
					<span className="material-symbols-outlined text-primary text-[28px]">view_cozy</span>
					Curriculum Modules
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					{modules.map((topic) => {
						const accent = topicAccent(topic.stage);
						const stage = topic.stage === "completed" ? "completed" : (topic.stage === "in_progress" ? "in_progress" : "not_started");
						const lessonCount = topic.lessonCount || 1;
						const completed = Math.min(lessonCount, topic.lessonsCompleted || 0);
						const moduleProgress = lessonCount > 0 ? Math.round((completed / lessonCount) * 100) : 0;

						return (
							<article key={topic.topic_key} className={accent.cardClass}>
								{accent.topRule ? <div className={`absolute top-0 left-0 w-full h-[3px] ${accent.topRule}`} /> : null}

								<div className="flex justify-between items-start mb-xl">
									<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${accent.iconWrap}`}>
										<span className="material-symbols-outlined text-[24px]">{accent.icon}</span>
									</div>

									<span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm ${accent.badgeWrap}`}>
										<span className="material-symbols-outlined text-[12px]">{accent.badgeIcon}</span>
										{accent.badgeText}
									</span>
								</div>

								<h3 className="font-h3 text-h3 mb-xs text-on-background">
									{topic.name}
								</h3>

								<p className="font-body-sm text-body-sm mb-lg line-clamp-2 text-on-surface-variant">
									{topic.name} concepts, key mechanisms, and high-yield revision targets.
								</p>

								{stage !== "completed" ? (
									<div className="mb-md">
										<div className="flex justify-between mb-xs">
											<span className="font-label-sm text-label-sm text-on-surface-variant">
												Lesson {completed} of {lessonCount}
											</span>
											<span className="font-label-sm text-label-sm text-primary">{moduleProgress}%</span>
										</div>

										<div className="h-[4px] w-full bg-tertiary-fixed rounded-full overflow-hidden">
											<div className="h-full bg-primary rounded-full" style={{ width: `${moduleProgress}%` }} />
										</div>
									</div>
								) : null}

								<div className="mt-auto pt-md border-t flex items-center justify-between border-surface-variant">
									<span className="font-label-sm text-label-sm text-on-surface-variant">
										Module {topic.moduleNumber} • {lessonCount} Lessons
									</span>

									{stage === "in_progress" ? (
										<Link to={`/study/${topic.topic_key}`} className={accent.actionClass}>
											Resume
											<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
										</Link>
									) : stage === "not_started" ? (
										<Link to={`/study/${topic.topic_key}`} className={accent.actionClass}>
											Start
											<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
										</Link>
									) : (
										<Link to={`/study/${topic.topic_key}`} className={accent.actionClass}>
											Review
										</Link>
									)}
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default SyllabusPage;

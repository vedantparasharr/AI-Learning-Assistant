import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import topicService from "../../services/topicService";

const formatViews = (views) => {
	const count = Number(views) || 0;
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M views`;
	}

	if (count >= 1000) {
		return `${Math.round(count / 1000)}K views`;
	}

	return `${count} views`;
};

const TopicStudyPage = () => {
	const { topicKey } = useParams();
	const navigate = useNavigate();
	const [payload, setPayload] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [completing, setCompleting] = useState(false);
	const [completionMessage, setCompletionMessage] = useState("");

	useEffect(() => {
		let cancelled = false;

		const loadTopic = async (attempt = 0) => {
			try {
				if (attempt === 0) {
					setLoading(true);
					setError("");
				}

				const response = await topicService.generateTopicContent(topicKey);
				const status = response?.status;
				const body = response?.body;

				if (cancelled) {
					return;
				}

				if (status === 200 && body?.success) {
					setPayload(body.data);
					setLoading(false);
					return;
				}

				if (status === 202 && attempt < 25) {
					window.setTimeout(() => {
						loadTopic(attempt + 1);
					}, 1800);
					return;
				}

				throw new Error(body?.error || body?.message || "Failed to load topic content");
			} catch (requestError) {
				if (!cancelled) {
					setError(requestError?.message || "Failed to load topic content");
					setLoading(false);
				}
			}
		};

		if (topicKey) {
			loadTopic();
		}

		return () => {
			cancelled = true;
		};
	}, [topicKey]);

	const topic = payload?.topic;
	const markdownNotes = payload?.content?.notes || "";
	const notesSections = useMemo(() => payload?.notesSections || [], [payload]);
	const curatedVideos = useMemo(() => payload?.curatedVideos || [], [payload]);
	const mastery = payload?.mastery || {};

	const handleMarkCompleted = async () => {
		if (!topic?.topic_key || completing) {
			return;
		}

		try {
			setCompleting(true);
			setCompletionMessage("");
			const response = await topicService.markTopicCompleted(topic.topic_key);
			const update = response?.data || {};

			setPayload((previous) => {
				if (!previous) {
					return previous;
				}

				return {
					...previous,
					topic: {
						...previous.topic,
						completionStatus: "completed",
					},
					mastery: {
						...previous.mastery,
						status: "completed",
					},
				};
			});

			setCompletionMessage(`Marked completed. Plan progress is now ${update.progressPercentage || 0}%.`);
		} catch (requestError) {
			setCompletionMessage(requestError?.message || "Could not update completion status.");
		} finally {
			setCompleting(false);
		}
	};

	if (loading) {
		return <p className="text-on-surface-variant">Preparing topic content...</p>;
	}

	if (error) {
		return <p className="text-error">{error}</p>;
	}

	if (!payload || !topic) {
		return <p className="text-on-surface-variant">Topic data unavailable.</p>;
	}

	return (
		<>
			<div className="flex-1 w-full max-w-container-max mx-auto">
				<nav className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-8">
					<Link to="/plans" className="hover:text-primary transition-colors">
						Study Plans
					</Link>
					<span className="material-symbols-outlined text-[14px]">chevron_right</span>
					<Link to={`/plans/${topic.studyPlanId}`} className="hover:text-primary transition-colors">
						{topic.subjectName}
					</Link>
					<span className="material-symbols-outlined text-[14px]">chevron_right</span>
					<span className="text-primary font-semibold">{topic.name}</span>
				</nav>

				<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-xxl">
					<div>
						<h1 className="font-display text-display text-on-surface mb-2">{topic.name}</h1>
						<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
							{topic.overview}
						</p>
						{completionMessage ? (
							<p className="font-body-sm text-body-sm text-secondary mt-3">{completionMessage}</p>
						) : null}
					</div>

					<div className="flex-shrink-0 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={handleMarkCompleted}
							disabled={topic.completionStatus === "completed" || completing}
							className="border border-primary text-primary font-label-md text-label-md uppercase tracking-wider px-6 py-4 rounded-lg hover:bg-surface-container-low transition-all disabled:opacity-60 disabled:cursor-not-allowed"
						>
							{topic.completionStatus === "completed" ? "Completed" : (completing ? "Saving..." : "Mark as Completed")}
						</button>

						<button
							type="button"
							onClick={() => navigate(`/flashcards?topicKey=${encodeURIComponent(topic.topic_key)}`)}
							className="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider px-8 py-4 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-3"
						>
							<span className="material-symbols-outlined">view_carousel</span>
							Start Flashcard Review
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
					<div className="lg:col-span-8 flex flex-col gap-gutter">
						<div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_25px_-5px_rgba(26,20,107,0.05),0_8px_10px_-6px_rgba(26,20,107,0.01)] border-t-2 border-primary p-10 h-full">
							<div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
								<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
									<span className="material-symbols-outlined">psychiatry</span>
								</div>
								<h2 className="font-h2 text-h2 text-on-surface">AI Distilled Notes</h2>
							</div>

							<div className="space-y-8">
								{markdownNotes ? (
									<div className="space-y-6">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={{
												h2: ({ children }) => (
													<h3 className="font-h3 text-h3 text-primary mb-3 mt-8 first:mt-0 flex items-center gap-2">
														<span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
														{children}
													</h3>
												),
												h3: ({ children }) => (
													<h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-2 mt-6">{children}</h4>
												),
												p: ({ children }) => (
													<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">{children}</p>
												),
												ul: ({ children }) => (
													<ul className="space-y-2 pl-5 mb-4 list-disc marker:text-secondary text-on-surface">{children}</ul>
												),
												ol: ({ children }) => (
													<ol className="space-y-2 pl-5 mb-4 list-decimal marker:text-secondary text-on-surface">{children}</ol>
												),
												li: ({ children }) => (
													<li className="font-body-sm text-body-sm leading-relaxed">{children}</li>
												),
												strong: ({ children }) => (
													<strong className="font-semibold text-on-surface">{children}</strong>
												),
												code: ({ children }) => (
													<code className="bg-surface-container px-1.5 py-0.5 rounded text-on-surface text-[0.9em]">{children}</code>
												),
											}}
										>
											{markdownNotes}
										</ReactMarkdown>
									</div>
								) : notesSections.length > 0 ? (
									notesSections.map((section) => (
										<div key={section.heading}>
											<h3 className="font-h3 text-h3 text-primary mb-3 flex items-center gap-2">
												<span className="material-symbols-outlined text-secondary text-[20px]">bolt</span>
												{section.heading}
											</h3>
											{section.body ? (
												<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4 pl-7">{section.body}</p>
											) : null}
										</div>
									))
								) : (
									<p className="font-body-md text-body-md text-on-surface-variant">
										Notes are being prepared for this topic.
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="lg:col-span-4 flex flex-col gap-gutter">
						<div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_25px_-5px_rgba(26,20,107,0.05),0_8px_10px_-6px_rgba(26,20,107,0.01)] p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-h3 text-h3 text-on-surface text-lg">Topic Mastery</h3>
								<span className="font-label-md text-label-md text-secondary bg-secondary-container px-2 py-1 rounded">
									{mastery.status === "completed" ? "Completed" : "In Progress"}
								</span>
							</div>

							<div className="flex items-end gap-2 mb-3">
								<span className="font-display text-display text-primary leading-none text-4xl">
									{mastery.retentionRate || 0}%
								</span>
								<span className="font-body-sm text-body-sm text-on-surface-variant mb-1">retention rate</span>
							</div>

							<div className="w-full h-2 bg-tertiary-fixed rounded-full overflow-hidden">
								<div
									className="h-full bg-secondary rounded-full"
									style={{ width: `${mastery.retentionRate || 0}%` }}
								/>
							</div>

							<div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
								<span>{mastery.masteredCards || 0} Cards Mastered</span>
								<span>{mastery.totalCards || 0} Total Cards</span>
							</div>
						</div>

						<div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_25px_-5px_rgba(26,20,107,0.05),0_8px_10px_-6px_rgba(26,20,107,0.01)] p-6 flex-1">
							<div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-variant">
								<span className="material-symbols-outlined text-primary">smart_display</span>
								<h3 className="font-h3 text-h3 text-on-surface text-lg">Curated Video Explanations</h3>
							</div>

							<div className="space-y-6">
								{curatedVideos.length > 0 ? (
									curatedVideos.map((video) => (
										<button
											key={`${video.rank}-${video.url}`}
											type="button"
											onClick={() => {
												if (video.url) {
													window.open(video.url, "_blank", "noopener,noreferrer");
												}
											}}
											className="block group w-full text-left"
										>
											<div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-surface-container">
												{video.thumbnail ? (
													<img
														alt={video.title}
														src={video.thumbnail}
														className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												) : null}

												<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
													<div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/30">
														<span className="material-symbols-outlined">play_arrow</span>
													</div>
												</div>

												{video.duration ? (
													<div className="absolute bottom-2 right-2 bg-black/80 text-white font-label-sm text-label-sm px-2 py-0.5 rounded backdrop-blur-md">
														{video.duration}
													</div>
												) : null}
											</div>

											<div>
												<h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">
													{video.title}
												</h4>
												<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
													{video.authorName || "Recommended Channel"}
													{video.views ? ` • ${formatViews(video.views)}` : ""}
												</p>
											</div>
										</button>
									))
								) : (
									<p className="font-body-sm text-body-sm text-on-surface-variant">
										Video recommendations will appear once available.
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TopicStudyPage;

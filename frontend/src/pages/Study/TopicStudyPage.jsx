import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import topicService from "../../services/topicService";
import { LoadingState, ErrorState, PrimaryButton, SecondaryButton } from "../../components/common/ui";

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
		return (
			<div className="flex-1 w-full max-w-container-max mx-auto p-6 flex items-center justify-center min-h-[50vh]">
				<LoadingState label="Preparing topic content..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 w-full max-w-container-max mx-auto p-6">
				<ErrorState title="Failed to load topic" description={error} />
			</div>
		);
	}

	if (!payload || !topic) {
		return (
			<div className="flex-1 w-full max-w-container-max mx-auto p-6">
				<ErrorState title="Topic unavailable" description="The requested topic data could not be retrieved." />
			</div>
		);
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
						{completionMessage ? (
							<p className="font-body-sm text-body-sm text-secondary mt-3">{completionMessage}</p>
						) : null}
					</div>

					<div className="flex-shrink-0 flex flex-wrap items-center gap-3">
						<SecondaryButton
							type="button"
							onClick={handleMarkCompleted}
							disabled={topic.completionStatus === "completed" || completing}
							className="w-full sm:w-auto text-primary border-primary/40 hover:bg-primary/5 hover:border-primary min-h-11 px-6 font-semibold"
						>
							{topic.completionStatus === "completed" ? "Completed" : (completing ? "Saving..." : "Mark as completed")}
						</SecondaryButton>

						<PrimaryButton
							type="button"
							onClick={() => navigate(`/flashcards?topicKey=${encodeURIComponent(topic.topic_key)}`)}
							className="w-full sm:w-auto flex items-center gap-2 min-h-11 px-6 font-semibold"
						>
							<span className="material-symbols-outlined text-[20px]">view_carousel</span>
							Start flashcard review
						</PrimaryButton>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
					<div className="lg:col-span-8 flex flex-col gap-gutter">
						<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-10 h-full">
							<div className="flex items-center gap-3 mb-8 pb-4 border-b border-surface-variant">
								<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
									<span className="material-symbols-outlined">psychiatry</span>
								</div>
								<h2 className="font-h2 text-h2 text-on-surface">AI Distilled Notes</h2>
							</div>

							<div className="space-y-8 max-w-prose">
								{markdownNotes ? (
									<div className="space-y-6">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={{
												h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-on-surface">{children}</h1>,
												h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-6 text-on-surface pb-1 border-b border-surface-variant">{children}</h2>,
												h3: ({ children }) => <h3 className="text-xl font-medium mb-3 mt-5 text-on-surface">{children}</h3>,
												h4: ({ children }) => <h4 className="text-lg font-medium mb-2 mt-4 text-on-surface">{children}</h4>,
												p: ({ children }) => <p className="mb-4 text-on-surface-variant leading-relaxed">{children}</p>,
												ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-on-surface-variant">{children}</ul>,
												ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-on-surface-variant">{children}</ol>,
												li: ({ children }) => <li className="text-on-surface-variant">{children}</li>,
												blockquote: ({ children }) => <blockquote className="border-l-4 border-surface-variant pl-4 italic text-on-surface-variant mb-4">{children}</blockquote>,
												hr: () => <hr className="my-6 border-surface-variant" />,
												table: ({ children }) => <div className="overflow-x-auto mb-4 border border-surface-variant rounded"><table className="min-w-full divide-y divide-surface-variant">{children}</table></div>,
												thead: ({ children }) => <thead className="bg-surface-container-low">{children}</thead>,
												th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-on-surface border-b border-surface-variant">{children}</th>,
												td: ({ children }) => <td className="px-4 py-2 text-on-surface-variant border-b border-surface-variant">{children}</td>,
												strong: ({ children }) => <strong className="font-semibold text-on-surface">{children}</strong>,
												code: ({ node, className, children, ...props }) => {
													const match = /language-(\w+)/.exec(className || "");
													const isInline = !match && (!node || node.position?.start?.line === node.position?.end?.line);
													
													if (!isInline && match) {
														return (
															<div className="rounded-md overflow-hidden mb-4 border border-surface-variant">
																<div className="flex items-center px-4 py-2 bg-surface-container-high text-on-surface-variant text-xs font-mono">
																	{match[1]}
																</div>
																<SyntaxHighlighter
																	style={vscDarkPlus}
																	language={match[1]}
																	PreTag="div"
																	customStyle={{ margin: 0, padding: "1rem", fontSize: "0.875rem" }}
																	{...props}
																>
																	{String(children).replace(/\n$/, "")}
																</SyntaxHighlighter>
															</div>
														);
													} else if (!isInline) {
														return (
															<pre className="p-4 rounded-md bg-[#0d1117] text-[#e6edf3] font-mono text-sm overflow-x-auto mb-4 border border-surface-variant">
																<code {...props}>{children}</code>
															</pre>
														);
													}
													return (
														<code className="bg-surface-container text-on-surface px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
															{children}
														</code>
													);
												},
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
						<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6">
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
									className="h-full bg-secondary rounded-full transition-[width] duration-500 ease-out"
									style={{ width: `${mastery.retentionRate || 0}%` }}
								/>
							</div>

							<div className="flex justify-between mt-2 font-label-sm text-label-sm text-on-surface-variant">
								<span>{mastery.masteredCards || 0} Cards Mastered</span>
								<span>{mastery.totalCards || 0} Total Cards</span>
							</div>
						</div>

						<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6 flex-1">
							<div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-variant">
								<span className="material-symbols-outlined text-primary">smart_display</span>
								<h3 className="font-h3 text-h3 text-on-surface text-lg">Video Explanations</h3>
							</div>

							<div className="space-y-6">
								{curatedVideos.length > 0 ? (
									curatedVideos.map((embedUrl, index) => (
										<div key={index} className="w-full aspect-video rounded-lg overflow-hidden bg-surface-container border border-surface-variant/40">
											<iframe
												width="100%"
												height="100%"
												src={embedUrl}
												title={`Video Explanation ${index + 1}`}
												frameBorder="0"
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
												allowFullScreen
												className="w-full h-full border-0"
											></iframe>
										</div>
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

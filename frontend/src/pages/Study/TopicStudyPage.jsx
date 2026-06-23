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
												h2: ({ children }) => (
													<h2 className="font-h2 text-h2 text-primary mb-5 mt-12 first:mt-0 pb-3 border-b border-surface-variant flex items-center gap-3">
														<span className="material-symbols-outlined text-secondary text-[26px]">bolt</span>
														{children}
													</h2>
												),
												h3: ({ children }) => (
													<h3 className="font-h3 text-h3 text-on-surface font-bold mb-4 mt-10">{children}</h3>
												),
												h4: ({ children }) => (
													<h4 className="font-body-lg text-body-lg text-on-surface font-semibold mb-3 mt-8 uppercase tracking-wider opacity-80">{children}</h4>
												),
												p: ({ children }) => (
													<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6 last:mb-0">{children}</p>
												),
												ul: ({ children }) => (
													<ul className="space-y-3 pl-6 mb-6 list-disc marker:text-primary text-on-surface">{children}</ul>
												),
												ol: ({ children }) => (
													<ol className="space-y-3 pl-6 mb-6 list-decimal marker:text-primary text-on-surface">{children}</ol>
												),
												li: ({ children }) => (
													<li className="font-body-md text-body-md leading-relaxed pl-2">{children}</li>
												),
												blockquote: ({ children }) => (
													<blockquote className="border-l border-primary bg-surface-container-low px-6 py-4 my-6 italic text-on-surface-variant rounded-r-lg">
														{children}
													</blockquote>
												),
												hr: () => <hr className="my-12 border-surface-variant" />,
												table: ({ children }) => (
													<div className="overflow-x-auto my-10 rounded-xl border border-outline-variant shadow-lg bg-surface-container-lowest">
														<table className="w-full text-left border-collapse">{children}</table>
													</div>
												),
												thead: ({ children }) => <thead className="bg-surface-container-low text-on-surface font-bold">{children}</thead>,
												th: ({ children }) => <th className="px-6 py-4 border-b border-outline-variant text-[12px] uppercase tracking-widest font-black">{children}</th>,
												td: ({ children }) => <td className="px-6 py-5 border-b border-outline-variant text-body-sm align-top">{children}</td>,
												tr: ({ children }) => <tr className="hover:bg-surface-container-lowest transition-colors border-b last:border-0 border-outline-variant/30">{children}</tr>,
												strong: ({ children }) => (
													<strong className="font-bold text-on-surface underline decoration-secondary/30 decoration-2 underline-offset-2">{children}</strong>
												),
												pre: ({ children }) => (
													<div className="relative my-10 rounded-xl overflow-hidden bg-[#0d1117] group border border-white/10 shadow-2xl">
														<div className="flex items-center justify-between px-5 py-2.5 bg-white/5 border-b border-white/10">
															<span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold">Reference Implementation</span>
															<div className="flex gap-2">
																<div className="w-2.5 h-2.5 rounded-full bg-error/40" />
																<div className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
																<div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
															</div>
														</div>
														{children}
													</div>
												),
												code: ({ node, className, children, ...props }) => {
													const match = /language-(\w+)/.exec(className || "");
													const isBlock = match || (node?.position?.start?.line !== node?.position?.end?.line);

													if (match) {
														return (
															<SyntaxHighlighter
																style={vscDarkPlus}
																language={match[1]}
																PreTag="div"
																customStyle={{
																	margin: 0,
																	padding: "2rem",
																	backgroundColor: "transparent",
																	fontSize: "14px",
																	lineHeight: "2",
																}}
																className="scrollbar-thin scrollbar-thumb-white/10"
																{...props}
															>
																{String(children).replace(/\n$/, "")}
															</SyntaxHighlighter>
														);
													}

													if (isBlock) {
														return (
															<pre className="p-8 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 text-[#e6edf3] font-mono text-[14px] leading-loose">
																<code {...props}>{children}</code>
															</pre>
														);
													}

													return (
														<code className="bg-surface-container-high text-primary px-1.5 py-0.5 rounded font-mono text-[0.85em] font-semibold border border-outline-variant" {...props}>
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

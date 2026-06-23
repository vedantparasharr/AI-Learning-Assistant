import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";
import { Input, Textarea, PrimaryButton } from "../../components/common/ui";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const SOURCE_MODES = [
  {
    id: "document",
    label: "Upload PDF",
    icon: "cloud_upload",
    helper: "Best when your course material is already collected in one file.",
  },
  {
    id: "text",
    label: "Paste syllabus",
    icon: "article",
    helper: "Best for exact topic extraction from a syllabus or lecture list.",
  },
  {
    id: "prompt",
    label: "Describe a goal",
    icon: "psychology",
    helper: "Best when you want a new plan from a learning objective.",
  },
];

const NEXT_STEPS = [
  "AI analyzes your source",
  "Topics are drafted",
  "You review before saving",
];

const validatePdf = (candidate) => {
  if (!candidate) return "Upload a PDF file before generating topics.";
  if (candidate.type && candidate.type !== "application/pdf") {
    return "Only PDF files are supported for document upload.";
  }
  if (!candidate.name.toLowerCase().endsWith(".pdf")) {
    return "Choose a file with a .pdf extension.";
  }
  if (candidate.size > MAX_PDF_SIZE) {
    return "PDF must be less than 10MB.";
  }
  return "";
};

const normalizeTopic = (topic) => ({
  name: String(topic?.name || "").trim(),
  estimated_hours:
    Number(topic?.estimated_hours) > 0 ? Number(topic.estimated_hours) : 1,
});

export default function StudyPlanBuilderPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState("document");
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [sourceText, setSourceText] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generationError, setGenerationError] = useState("");
  const [createError, setCreateError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const currentMode = SOURCE_MODES.find((mode) => mode.id === inputMode);

  const hasInvalidTopics = useMemo(
    () =>
      topics.length === 0 ||
      topics.some(
        (topic) =>
          !String(topic.name || "").trim() ||
          !(Number(topic.estimated_hours) > 0),
      ),
    [topics],
  );

  const setFieldError = (field, message) => {
    setFieldErrors((current) => ({ ...current, [field]: message }));
  };

  const clearFieldError = (field) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    setGenerationError("");
    clearFieldError("source");
  };

  const handleFileCandidate = (candidate) => {
    const error = validatePdf(candidate);
    if (error) {
      setFile(null);
      setFieldError("source", error);
      return;
    }

    setFile(candidate);
    clearFieldError("source");
    setGenerationError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileCandidate(event.dataTransfer.files?.[0]);
  };

  const validateSourceStep = () => {
    const nextErrors = {};

    if (!subjectName.trim()) {
      nextErrors.subjectName = "Enter a subject name before generating topics.";
    }

    if (inputMode === "document") {
      const fileError = validatePdf(file);
      if (fileError) nextErrors.source = fileError;
    } else if (!text.trim()) {
      nextErrors.source =
        inputMode === "text"
          ? "Paste syllabus content before generating topics."
          : "Describe the learning goal before generating topics.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProcess = async () => {
    if (!validateSourceStep()) return;

    try {
      setLoading(true);
      setGenerationError("");

      const res = await studyPlanService.parseStudyPlan({
        file,
        outlineText: inputMode === "text" ? text : "",
        learningPrompt: inputMode === "prompt" ? text : "",
        sourceMode: inputMode,
        subjectName: subjectName.trim(),
      });

      const payload = res.data || {};
      const normalized = (payload.topics || [])
        .map(normalizeTopic)
        .filter((topic) => topic.name);

      if (normalized.length === 0) {
        setTopics([]);
        setGenerationError(
          "No usable topics were generated. Try a more specific source, paste the key sections, or describe the goal in more detail.",
        );
        return;
      }

      setTopics(normalized);
      setSourceText(payload.sourceText || text);
      toast.success("Topics generated");
      setStep(2);
    } catch (err) {
      setGenerationError(
        err.message ||
          "Topics could not be generated. Check the source and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (hasInvalidTopics) {
      setCreateError(
        "Every topic needs a name and an estimate greater than zero before saving.",
      );
      return;
    }

    try {
      setLoading(true);
      setCreateError("");

      const res = await studyPlanService.createStudyPlan({
        subjectName: subjectName.trim(),
        examDate,
        topics,
        sourceText,
        sourceType: inputMode,
      });

      toast.success("Study plan created");
      navigate(`/plans/${res.data.studyPlan._id}`);
    } catch (err) {
      setCreateError(
        err.message ||
          "The study plan could not be created. Review the topics and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateTopic = (index, field, value) => {
    setCreateError("");
    setTopics((current) =>
      current.map((topic, topicIndex) =>
        topicIndex === index ? { ...topic, [field]: value } : topic,
      ),
    );
  };

  const removeTopic = (index) => {
    setCreateError("");
    setTopics((current) => current.filter((_, topicIndex) => topicIndex !== index));
  };

  const addTopic = () => {
    setCreateError("");
    setTopics((current) => [...current, { name: "", estimated_hours: 1 }]);
  };

  return (
    <div className="w-full">
      <div className="mb-lg">
        <h1 className="font-h1 text-h1 text-on-background">
          {step === 1 ? "Source Material" : "Review Topics"}
        </h1>
        <p className="mt-xs max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          {step === 1
            ? "Choose one source, add plan details, then generate topics you can verify before saving."
            : "Clean up the generated outline before it becomes your study plan."}
        </p>
      </div>

      <ol className="mb-lg grid gap-sm sm:grid-cols-2">
        {[
          { number: 1, label: "Provide source material" },
          { number: 2, label: "Review and create plan" },
        ].map((item) => {
          const isActive = step === item.number;
          const isComplete = step > item.number;

          return (
            <li
              key={item.number}
              className={`flex items-center gap-sm rounded-xl border px-md py-sm ${
                isActive || isComplete
                  ? "border-primary bg-primary-fixed text-primary"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface-variant"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-lowest font-label-md text-label-md">
                {isComplete ? (
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    check
                  </span>
                ) : (
                  item.number
                )}
              </span>
              <span className="font-body-sm text-body-sm font-semibold">
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <div className="space-y-lg">
          <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
            <div className="mb-md">
              <h2 className="font-h3 text-h3 text-on-surface">
                Choose a source
              </h2>
              <p className="mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
                Pick the format that matches what you have now. You can switch
                modes without losing text already entered.
              </p>
            </div>

            <div
              className="grid gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-xs md:grid-cols-3"
              role="tablist"
              aria-label="Source type"
            >
              {SOURCE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={inputMode === mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex min-h-12 items-center justify-center gap-xs rounded-lg px-sm py-2 font-label-md text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                    inputMode === mode.id
                      ? "border border-outline-variant bg-surface-container-lowest text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    {mode.icon}
                  </span>
                  {mode.label}
                </button>
              ))}
            </div>

            <p className="mt-sm font-body-sm text-body-sm text-on-surface-variant">
              {currentMode.helper}
            </p>

            <div className="mt-md">
              {inputMode === "document" ? (
                <div
                  className={`rounded-xl border border-dashed p-xl text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary-fixed"
                      : "border-outline-variant bg-background"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <span
                    className="material-symbols-outlined mx-auto mb-sm flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-low text-[28px] text-primary"
                    aria-hidden="true"
                  >
                    cloud_upload
                  </span>
                  <h3 className="font-h3 text-h3 text-on-surface">
                    Upload PDF material
                  </h3>
                  <p className="mx-auto mt-xs max-w-lg font-body-sm text-body-sm text-on-surface-variant">
                    Drag a PDF here, or use the button to choose one. Files must
                    be under 10MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    id="fileUpload"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={(event) =>
                      handleFileCandidate(event.target.files?.[0])
                    }
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-md inline-flex min-h-11 items-center justify-center rounded-lg border border-primary px-md py-2 font-label-md text-label-md text-primary transition-colors hover:bg-primary hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    Select PDF file
                  </button>

                  {file ? (
                    <div className="mx-auto mt-md flex max-w-xl items-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-sm text-left">
                      <span
                        className="material-symbols-outlined text-[20px] text-primary"
                        aria-hidden="true"
                      >
                        description
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body-sm text-body-sm font-semibold text-on-surface">
                          {file.name}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-outline transition-colors hover:bg-error-container hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20"
                        aria-label="Remove selected PDF"
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          close
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-outline-variant/60 bg-background p-md">
                  <Textarea
                    id="source-text"
                    label={inputMode === "text" ? "Paste syllabus content" : "Describe the learning goal"}
                    value={text}
                    onChange={(event) => {
                      setText(event.target.value);
                      clearFieldError("source");
                      setGenerationError("");
                    }}
                    placeholder={
                      inputMode === "text"
                        ? "Paste the course syllabus, lecture list, or topic outline here."
                        : "Example: Build a 6-week study plan for data structures before an interview."
                    }
                    className="mt-sm h-64 w-full resize-none"
                  />
                </div>
              )}

              {fieldErrors.source ? (
                <p className="mt-sm font-body-sm text-body-sm text-error" role="alert">
                  {fieldErrors.source}
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
            <h2 className="font-h3 text-h3 text-on-surface">Plan details</h2>
            <div className="mt-md grid gap-md md:grid-cols-2">
              <Input
                id="subject-name"
                type="text"
                label={<span>Subject name <span className="text-error">*</span></span>}
                value={subjectName}
                onChange={(event) => {
                  setSubjectName(event.target.value);
                  clearFieldError("subjectName");
                }}
                error={fieldErrors.subjectName}
                placeholder="e.g. Data Structures"
              />

              <Input
                id="target-date"
                type="date"
                label="Target date"
                min={today}
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
              />
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-lg">
            <div className="grid gap-lg lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h2 className="font-label-md text-label-md text-on-surface-variant">
                  What happens next
                </h2>
                <div className="mt-sm flex flex-wrap gap-sm">
                  {NEXT_STEPS.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body-sm text-body-sm text-on-surface"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-primary"
                        aria-hidden="true"
                      >
                        check_circle
                      </span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <PrimaryButton
                type="button"
                onClick={handleProcess}
                disabled={loading || !subjectName.trim()}
                className="min-h-12"
              >
                {loading ? "Generating topics..." : "Generate topics"}
                <span
                  className="material-symbols-outlined text-[20px]"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </PrimaryButton>
            </div>

            {generationError ? (
              <div
                className="mt-md rounded-lg border border-error bg-error-container p-md text-on-error-container"
                role="alert"
              >
                <p className="font-body-sm text-body-sm font-semibold">
                  {generationError}
                </p>
                <div className="mt-sm flex flex-wrap gap-sm">
                  <button
                    type="button"
                    onClick={handleProcess}
                    disabled={loading}
                    className="rounded-lg bg-surface-container-lowest px-sm py-2 font-label-md text-label-md text-error transition-colors hover:bg-error-container disabled:opacity-70"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleModeChange(inputMode === "document" ? "text" : "document")
                    }
                    className="rounded-lg border border-error px-sm py-2 font-label-md text-label-md text-error transition-colors hover:bg-surface-container-lowest"
                  >
                    Switch source mode
                  </button>
                  <Link
                    to="/help-center"
                    className="rounded-lg border border-error px-sm py-2 font-label-md text-label-md text-error transition-colors hover:bg-surface-container-lowest"
                  >
                    Open Help Center
                  </Link>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : (
        <section className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-lg">
          <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-h3 text-h3 text-on-surface">
                Topics to study
              </h2>
              <p className="mt-xs max-w-2xl font-body-sm text-body-sm text-on-surface-variant">
                Edit unclear names and time estimates before saving. Blank
                topics cannot be created.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-lg bg-surface-container px-sm py-xs font-label-md text-label-md text-on-surface-variant">
              {topics.length} {topics.length === 1 ? "topic" : "topics"}
            </span>
          </div>

          {createError ? (
            <div
              className="mb-md rounded-lg border border-error bg-error-container p-md font-body-sm text-body-sm text-on-error-container"
              role="alert"
            >
              {createError}
            </div>
          ) : null}

          {topics.length === 0 ? (
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-lg text-center">
              <h3 className="font-body-md text-body-md font-semibold text-on-surface">
                No usable topics yet
              </h3>
              <p className="mx-auto mt-xs max-w-lg font-body-sm text-body-sm text-on-surface-variant">
                Go back and provide a more specific source, or add a topic
                manually to start the plan.
              </p>
              <div className="mt-md flex flex-wrap justify-center gap-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-outline-variant px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-lowest"
                >
                  Back to source
                </button>
                <button
                  type="button"
                  onClick={addTopic}
                  className="rounded-lg bg-primary px-md py-2 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container"
                >
                  Add topic
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col rounded-xl border border-outline-variant/60 bg-surface-container-low overflow-x-auto">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-[minmax(0,1fr)_140px_44px] gap-sm bg-surface-container-lowest px-md py-sm border-b border-outline-variant/60">
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Topic name
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Total Hours
                </span>
                <span></span>
              </div>
              
              <div className="divide-y divide-outline-variant/60">
                {topics.map((topic, index) => {
                  const missingName = !String(topic.name || "").trim();
                  const invalidHours = !(Number(topic.estimated_hours) > 0);

                  return (
                    <div
                      key={index}
                      className="grid gap-sm p-sm lg:px-md lg:py-xs lg:grid-cols-[minmax(0,1fr)_140px_44px] lg:items-center hover:bg-surface-container-lowest transition-colors"
                    >
                      {/* Mobile Label */}
                      <label
                        className="lg:hidden block font-label-sm text-label-sm text-on-surface-variant mb-1"
                        htmlFor={`topic-name-${index}`}
                      >
                        Topic name
                      </label>
                      <div className="flex flex-col">
                        <input
                          id={`topic-name-${index}`}
                          value={topic.name}
                          onChange={(event) =>
                            updateTopic(index, "name", event.target.value)
                          }
                          placeholder="Topic name"
                          className={`w-full rounded-lg border bg-background px-3 py-2 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            missingName
                              ? "border-error focus:border-error"
                              : "border-outline-variant focus:border-primary"
                          }`}
                        />
                        {missingName ? (
                          <p className="mt-1 font-label-sm text-label-sm text-error">
                            Required
                          </p>
                        ) : null}
                      </div>

                      {/* Mobile Label */}
                      <div className="flex items-center gap-sm lg:block">
                        <label
                          className="lg:hidden block w-24 font-label-sm text-label-sm text-on-surface-variant"
                          htmlFor={`topic-hours-${index}`}
                        >
                          Total Hours
                        </label>
                        <div className="flex-1 flex flex-col">
                          <input
                            id={`topic-hours-${index}`}
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={topic.estimated_hours}
                            onChange={(event) =>
                              updateTopic(
                                index,
                                "estimated_hours",
                                Number(event.target.value),
                              )
                            }
                            className={`w-full rounded-lg border bg-background px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              invalidHours
                                ? "border-error focus:border-error"
                                : "border-outline-variant focus:border-primary"
                            }`}
                          />
                          {invalidHours ? (
                            <p className="mt-1 font-label-sm text-label-sm text-error">
                              Invalid
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-outline transition-colors hover:bg-error-container hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/20 place-self-end lg:place-self-center"
                        aria-label={`Remove topic ${index + 1}`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          aria-hidden="true"
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-lg flex flex-wrap items-center gap-md border-t border-outline-variant/60 pt-lg">
            <button
              type="button"
              onClick={addTopic}
              className="inline-flex min-h-11 items-center gap-xs rounded-lg border border-outline-variant px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                add
              </span>
              Add topic
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateError("");
                setStep(1);
              }}
              className="min-h-11 rounded-lg border border-outline-variant px-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Back
            </button>
            <div className="flex-1" />
            <PrimaryButton
              type="button"
              onClick={handleCreate}
              disabled={loading || hasInvalidTopics}
            >
              {loading ? "Creating..." : "Create study plan"}
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                check_circle
              </span>
            </PrimaryButton>
          </div>
        </section>
      )}
    </div>
  );
}

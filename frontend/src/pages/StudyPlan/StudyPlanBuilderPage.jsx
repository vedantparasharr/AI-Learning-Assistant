import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";
import { Input, Textarea, PrimaryButton, PageShell } from "../../components/common/ui";
import toast from "react-hot-toast";

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const SOURCE_MODES = [
  {
    id: "document",
    label: "Upload PDF",
    icon: "cloud_upload",
    helper: "Drag & drop a file, or browse.",
  },
  {
    id: "text",
    label: "Paste syllabus",
    icon: "article",
    helper: "Paste the exact topic list or outline.",
  },
  {
    id: "prompt",
    label: "Describe a goal",
    icon: "psychology",
    helper: "Tell us what you want to learn.",
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
    <div className="max-w-container-max mx-auto pb-24">
      <PageShell
        title={step === 1 ? "New Study Plan" : "Review Topics"}
        description={
          step === 1
            ? "Provide your source material and we'll automatically generate a structured study plan."
            : "Review and adjust your generated topics before saving the plan."
        }
      >
        <div className="w-full mt-2">

          {/* Progress Indicator - Minimalist Line */}
          <div className="mb-12 flex items-center gap-0" role="list">
            {[
              { label: "Source material", number: 1 },
              { label: "Review & save", number: 2 },
            ].map((item, i) => {
              const isComplete = step > item.number;
              const isActive = step === item.number;
              return (
                <div key={item.number} role="listitem" className="flex items-center flex-1 min-w-0">
                  <div className={`flex items-center gap-3 py-2 pr-4 ${i > 0 ? "pl-4" : ""}`}>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-all ${isComplete
                        ? "bg-secondary text-on-secondary"
                        : isActive
                          ? "bg-primary text-on-primary ring-4 ring-primary/10"
                          : "bg-surface-container-high text-on-surface-variant"
                        }`}
                    >
                      {isComplete ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        item.number
                      )}
                    </span>
                    <span
                      className={`font-label-md text-label-md transition-colors ${isActive ? "text-on-background" : isComplete ? "text-secondary" : "text-on-surface-variant"
                        }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {i < 1 && (
                    <div
                      className={`flex-1 h-px mx-4 transition-colors ${step > 1 ? "bg-secondary" : "bg-outline-variant/40"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
              {/* Left Column: Source Material */}
              <div className="lg:col-span-7 flex flex-col">
                {/* Section 1: Source */}
                <section className="flex flex-col h-full">
                  <h2 className="font-h3 text-h3 text-on-surface mb-6">How do you want to start?</h2>

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6" role="tablist">
                    {SOURCE_MODES.map((mode) => {
                      const isSelected = inputMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() => handleModeChange(mode.id)}
                          className={`group relative flex items-center gap-2.5 rounded-lg border px-4 py-2 font-label-md text-label-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-low hover:text-on-surface"
                            }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{mode.icon}</span>
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Input Area */}
                  <div className="relative flex-1 flex flex-col min-h-[320px]">
                    {inputMode === "document" ? (
                      <div
                        className={`group relative overflow-hidden rounded-xl transition-all duration-300 flex-1 flex flex-col ${isDragging
                          ? "bg-primary/5 ring-2 ring-primary"
                          : "bg-surface-container-lowest hover:bg-surface-container-low"
                          }`}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                      >
                        {/* Subtle dashed border that only appears clearly on drag */}
                        <div className={`absolute inset-0 rounded-xl border-2 border-dashed pointer-events-none transition-colors duration-300 ${isDragging ? "border-primary/30" : "border-outline-variant/30 group-hover:border-outline-variant/60"}`} />

                        <div className="relative px-8 py-16 text-center flex flex-col items-center justify-center h-full">
                          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300 ${isDragging ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-high text-primary group-hover:bg-primary/10"}`}>
                            <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                          </div>
                          <h3 className="font-h3 text-h3 text-on-surface mb-1">Upload your material</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[260px] mx-auto mb-6 leading-relaxed">
                            Drag & drop a PDF syllabus or textbook chapter (max 10MB).
                          </p>

                          <input
                            ref={fileInputRef}
                            id="fileUpload"
                            type="file"
                            accept=".pdf,application/pdf"
                            className="sr-only"
                            onChange={(event) => handleFileCandidate(event.target.files?.[0])}
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/60 bg-surface-container-lowest px-5 font-label-sm text-label-sm text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          >
                            Browse files
                          </button>
                        </div>
                      </div>
                    ) : (
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
                        className="flex-1 w-full resize-none rounded-xl bg-surface-container-lowest border-outline-variant/50 focus:bg-background focus:border-primary transition-colors text-body-sm placeholder:text-on-surface-variant/50 leading-relaxed"
                        containerClassName="flex-1 flex flex-col"
                      />
                    )}

                    {/* File attached floating indicator */}
                    {file && inputMode === "document" && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-full bg-surface shadow-md border border-outline-variant/20 px-4 py-2 animate-in slide-in-from-bottom-4 fade-in">
                        <span className="material-symbols-outlined text-[20px] text-primary">description</span>
                        <div className="flex items-center gap-2">
                          <span className="font-label-md text-label-md text-on-surface max-w-[200px] truncate">{file.name}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
                        </div>
                        <div className="w-px h-4 bg-outline-variant/40" />
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30"
                          aria-label="Remove attached file"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    )}

                    {fieldErrors.source && (
                      <p className="mt-3 font-body-sm text-body-sm text-error animate-in fade-in" role="alert">
                        {fieldErrors.source}
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Settings & Actions (Sticky) */}
              <div className="lg:col-span-5 relative">
                <div className="sticky top-24 space-y-10 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 sm:p-8 shadow-sm h-full">
                  {/* Section 2: Details */}
                  <section>
                    <h2 className="font-h3 text-h3 text-on-surface mb-6">Plan details</h2>
                    <div className="flex flex-col gap-6">
                      <div className="space-y-2">
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
                          className="bg-surface-container-lowest"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          id="target-date"
                          type="date"
                          label="Target date (Optional)"
                          min={today}
                          value={examDate}
                          onChange={(event) => setExamDate(event.target.value)}
                          className="bg-surface-container-lowest"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Action Row */}
                  <div className="pt-8 flex flex-col gap-6">
                    {generationError && (
                      <div className="rounded-xl bg-error-container/50 border border-error/20 p-5 text-on-error-container animate-in fade-in">
                        <p className="font-body-md text-body-md font-medium mb-4">{generationError}</p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleProcess}
                            disabled={loading}
                            className="rounded-full bg-error text-on-error px-5 py-2 font-label-md text-label-md transition-colors hover:bg-error/90 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30 focus-visible:ring-offset-2"
                          >
                            Try again
                          </button>
                          <button
                            type="button"
                            onClick={() => handleModeChange(inputMode === "document" ? "text" : "document")}
                            className="rounded-full border border-error/30 px-5 py-2 font-label-md text-label-md text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30 focus-visible:ring-offset-2"
                          >
                            Switch input mode
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-8 pt-4 border-t border-outline-variant/30">
                      <div className="flex flex-col gap-4">
                        {NEXT_STEPS.map((item, index) => (
                          <div key={item} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary/70">check_circle</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">{item}</span>
                          </div>
                        ))}
                      </div>
                      <PrimaryButton
                        type="button"
                        onClick={handleProcess}
                        disabled={loading || !subjectName.trim()}
                        className="h-12 w-full text-[15px] shadow-md"
                      >
                        {loading ? "Analyzing..." : "Generate topics"}
                        <span className="material-symbols-outlined text-[20px] ml-2">arrow_forward</span>
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-h2 text-h2 text-on-surface tracking-tight mb-2">
                    Topics to study
                  </h2>
                  <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant">
                    We've extracted these topics. Edit any unclear names and set realistic time estimates before saving.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-1.5 font-label-md text-label-md text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">list_alt</span>
                  {topics.length} {topics.length === 1 ? "topic" : "topics"} found
                </div>
              </div>

              {createError && (
                <div className="mb-8 rounded-xl border border-error/20 bg-error-container/50 p-4 font-body-md text-body-md text-on-error-container animate-in fade-in">
                  {createError}
                </div>
              )}

              {topics.length === 0 ? (
                <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-16 text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2">No topics generated</h3>
                  <p className="mx-auto max-w-md font-body-md text-body-md text-on-surface-variant mb-8">
                    We couldn't extract distinct topics from the source. Try a different source, or add topics manually.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="rounded-full border border-outline-variant px-6 py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      Back to source
                    </button>
                    <PrimaryButton type="button" onClick={addTopic}>
                      Add first topic
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_160px_60px] gap-4 bg-surface-container-low/50 px-6 py-3 border-b border-outline-variant/40">
                    <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Topic Name</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Est. Hours</span>
                    <span></span>
                  </div>

                  <div className="divide-y divide-outline-variant/20">
                    {topics.map((topic, index) => {
                      const missingName = !String(topic.name || "").trim();
                      const invalidHours = !(Number(topic.estimated_hours) > 0);

                      return (
                        <div
                          key={index}
                          className="grid gap-4 p-4 md:px-6 md:py-3 md:grid-cols-[1fr_160px_60px] md:items-center bg-transparent hover:bg-surface-container-low/30 transition-colors group"
                        >
                          <div className="flex flex-col">
                            <input
                              aria-label="Topic name"
                              value={topic.name}
                              onChange={(event) => updateTopic(index, "name", event.target.value)}
                              placeholder="e.g., Introduction to Algorithms"
                              className={`w-full bg-transparent px-3 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg border-2 border-transparent transition-colors ${missingName ? "bg-error-container/20 !border-error/50" : "hover:border-outline-variant/30 focus:border-primary/30 focus:bg-surface-container-lowest"
                                }`}
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              aria-label="Estimated hours"
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={topic.estimated_hours}
                              onChange={(event) => updateTopic(index, "estimated_hours", Number(event.target.value))}
                              className={`w-24 bg-transparent px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg border-2 border-transparent transition-colors ${invalidHours ? "bg-error-container/20 !border-error/50" : "hover:border-outline-variant/30 focus:border-primary/30 focus:bg-surface-container-lowest"
                                }`}
                            />
                            <span className="font-body-sm text-body-sm text-on-surface-variant">hrs</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTopic(index)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant/50 transition-all hover:bg-error-container hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50 place-self-end md:place-self-center md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 focus:opacity-100"
                            aria-label={`Remove topic`}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={addTopic}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant/60 px-6 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low hover:border-outline-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add topic
                </button>

                <div className="flex items-center gap-4 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateError("");
                      setStep(1);
                    }}
                    className="h-11 rounded-full px-6 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    Back to source
                  </button>
                  <PrimaryButton
                    type="button"
                    onClick={handleCreate}
                    disabled={loading || hasInvalidTopics}
                    className="h-12 px-8 text-[15px]"
                  >
                    {loading ? "Saving..." : "Save plan"}
                  </PrimaryButton>
                </div>
              </div>
            </section>
          )}
        </div>
      </PageShell>
    </div>
  );
}

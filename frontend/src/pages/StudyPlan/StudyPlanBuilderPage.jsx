import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, MessageSquareText, UploadCloud } from "lucide-react";
import studyPlanService from "../../services/studyPlanService";
import {
  EmptyState,
  ErrorState,
  PageShell,
  PrimaryButton,
  SecondaryButton,
  SectionCard,
} from "../../components/common/ui";

const blankTopic = () => ({
  name: "",
  estimated_hours: 1,
});

const SOURCE_MODES = [
  {
    id: "prompt",
    title: "AI Prompt",
    description: "Tell AI what you want to study and get a topic roadmap.",
    icon: MessageSquareText,
  },
  {
    id: "text",
    title: "Paste Notes",
    description: "Paste modules, units, or rough notes.",
    icon: FileText,
  },
  {
    id: "document",
    title: "Upload PDF",
    description: "Upload syllabus or notes PDF to extract topics.",
    icon: UploadCloud,
  },
];

const StudyPlanBuilderPage = () => {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");

  const [sourceMode, setSourceMode] = useState("prompt");
  const [learningPrompt, setLearningPrompt] = useState("");
  const [outlineText, setOutlineText] = useState("");
  const [file, setFile] = useState(null);

  const [topics, setTopics] = useState([]);
  const [sourceText, setSourceText] = useState("");
  const [sourceType, setSourceType] = useState("manual");

  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [hasGenerated, setHasGenerated] = useState(false);

  const parsedTopicCount = useMemo(
    () => topics.filter((t) => t.name.trim()).length,
    [topics],
  );

  // =====================
  // Generate Topics
  // =====================
  const handleParse = async () => {
    if (sourceMode === "document" && !file) {
      return setError("Upload a PDF");
    }
    if (sourceMode === "text" && !outlineText.trim()) {
      return setError("Paste your notes");
    }
    if (sourceMode === "prompt" && !learningPrompt.trim()) {
      return setError("Describe what you want to study");
    }

    try {
      setParsing(true);
      setError("");

      const res = await studyPlanService.parseStudyPlan({
        file: sourceMode === "document" ? file : null,
        outlineText: sourceMode === "text" ? outlineText : "",
        learningPrompt: sourceMode === "prompt" ? learningPrompt : "",
        sourceMode,
        subjectName,
      });

      const payload = res.data || {};

      const normalized = (payload.topics || []).map((t) => ({
        name: String(t?.name || "").trim(),
        estimated_hours:
          Number(t?.estimated_hours) > 0 ? Number(t.estimated_hours) : 1,
      }));

      setTopics(normalized);
      setSourceText(
        payload.sourceText ||
          (sourceMode === "prompt" ? learningPrompt : outlineText)
      );
      setSourceType(payload.sourceType || sourceMode);

      setHasGenerated(true);

      toast.success("Study plan topics generated");
    } catch (err) {
      setError(err.error || err.message || "Failed to generate topics");
    } finally {
      setParsing(false);
    }
  };

  // =====================
  // Topic Editing
  // =====================
  const updateTopic = (i, key, value) => {
    setTopics((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [key]: value } : t))
    );
  };

  const removeTopic = (i) => {
    setTopics((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addTopic = () => {
    setTopics((prev) => [...prev, blankTopic()]);
  };

  // =====================
  // Create Plan
  // =====================
  const handleCreate = async () => {
    try {
      setSaving(true);
      setError("");

      const res = await studyPlanService.createStudyPlan({
        subjectName,
        examDate,
        topics,
        sourceText,
        sourceType,
      });

      toast.success("Study plan created");

      navigate(`/plans/${res.data.studyPlan._id}`);
    } catch (err) {
      setError(err.error || err.message || "Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    setSourceMode("prompt");
    setLearningPrompt("");
    setOutlineText("");
    setFile(null);
    setTopics([]);
    setSourceText("");
    setSourceType("manual");
    setHasGenerated(false);
    setError("");
  };

  return (
    <PageShell
      title="Study Plan Builder"
      description="Step 1: provide content. Step 2: review and edit topics before creating the study plan."
    >
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* ================= INPUT PHASE ================= */}
        {!hasGenerated && (
          <SectionCard
            title="Step 1: Provide Content"
            description="Choose one mode and generate topics."
          >
            <div className="space-y-5">

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Subject</span>
                <input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g. DSA, Backend Development"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Target Date (optional)</span>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              {/* Mode Switch */}
              <div className="grid gap-3 sm:grid-cols-3 mt-2">
                {SOURCE_MODES.map((m) => {
                  const Icon = m.icon;
                  const active = sourceMode === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSourceMode(m.id)}
                      className={`rounded-3xl border p-4 text-left transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-semibold tracking-tight">{m.title}</span>
                      </div>
                      <p className={`mt-2 text-xs leading-5 ${active ? "text-slate-200" : "text-slate-500"}`}>
                        {m.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Inputs */}
              {sourceMode === "prompt" && (
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">What do you want to study?</span>
                  <textarea
                    value={learningPrompt}
                    onChange={(e) => setLearningPrompt(e.target.value)}
                    placeholder="Example: I want to study backend with Node, Express, MongoDB, auth, and deployment."
                    className="h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              )}

              {sourceMode === "text" && (
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Paste notes or outline</span>
                  <textarea
                    value={outlineText}
                    onChange={(e) => setOutlineText(e.target.value)}
                    placeholder="Paste your modules, notes, or unit list..."
                    className="h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              )}

              {sourceMode === "document" && (
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Upload PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </label>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton type="button" onClick={handleParse} disabled={parsing}>
                  {parsing ? "Generating..." : "Generate Topics"}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={resetAll}>
                  Reset
                </SecondaryButton>
              </div>

              {error && <ErrorState description={error} />}
            </div>
          </SectionCard>
        )}

        {/* ================= EDIT PHASE ================= */}
        {hasGenerated && (
          <SectionCard
            title="Step 2: Review and Edit Topics"
            description="Manual editing appears only after content is parsed."
            action={
              <span className="text-sm text-slate-500">
                {parsedTopicCount} topics
              </span>
            }
          >
            {topics.length === 0 ? (
              <EmptyState
                title="No topics generated"
                description="Try again or add manually"
              />
            ) : (
              <div className="space-y-3">
                {topics.map((t, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[1fr_140px_auto] md:items-center"
                  >
                    <input
                      value={t.name}
                      onChange={(e) =>
                        updateTopic(i, "name", e.target.value)
                      }
                      placeholder="Topic name"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />

                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={t.estimated_hours}
                      onChange={(e) =>
                        updateTopic(
                          i,
                          "estimated_hours",
                          Number(e.target.value) || 1,
                        )
                      }
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />

                    <SecondaryButton type="button" onClick={() => removeTopic(i)}>
                      Remove
                    </SecondaryButton>
                  </div>
                ))}

                <div className="flex flex-wrap gap-3 pt-2">
                  <SecondaryButton type="button" onClick={addTopic}>
                    + Add Topic
                  </SecondaryButton>

                  <SecondaryButton type="button" onClick={() => setHasGenerated(false)}>
                    Back to content
                  </SecondaryButton>

                  <PrimaryButton
                    type="button"
                    onClick={handleCreate}
                    disabled={
                      saving ||
                      !subjectName.trim() ||
                      parsedTopicCount === 0
                    }
                  >
                    {saving ? "Creating..." : "Create Study Plan"}
                  </PrimaryButton>
                </div>
              </div>
            )}

            {error && <ErrorState description={error} />}
          </SectionCard>
        )}
      </div>
    </PageShell>
  );
};

export default StudyPlanBuilderPage;
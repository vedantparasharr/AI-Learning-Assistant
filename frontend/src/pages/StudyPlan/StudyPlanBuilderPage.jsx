import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studyPlanService from "../../services/studyPlanService";
import toast from "react-hot-toast";

export default function UploadMain() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [sourceText, setSourceText] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleProcess = async () => {
    if (!subjectName.trim()) {
      return toast.error("Subject Name is required");
    }

    if (!file && !text.trim()) {
      return toast.error("Provide file or text");
    }

    if (file && file.size > 10 * 1024 * 1024) {
      return toast.error("PDF must be less than 10MB");
    }

    try {
      setLoading(true);

      const res = await studyPlanService.parseStudyPlan({
        file,
        outlineText: text,
        sourceMode: file ? "document" : "text",
        subjectName,
      });

      const payload = res.data || {};
      const normalized = (payload.topics || []).map((t) => ({
        name: String(t?.name || "").trim(),
        estimated_hours:
          Number(t?.estimated_hours) > 0 ? Number(t.estimated_hours) : 1,
      }));

      setTopics(normalized);
      setSourceText(payload.sourceText || text);
      toast.success("Topics Generated");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      const res = await studyPlanService.createStudyPlan({
        subjectName,
        examDate,
        topics,
        sourceText,
        sourceType: file ? "document" : "text",
      });

      toast.success("Study plan created");
      navigate(`/plans/${res.data.studyPlan._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to create plan");
    } finally {
      setLoading(false);
    }
  };

  const updateTopic = (index, field, value) =>
    setTopics(
      topics.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );

  const removeTopic = (index) =>
    setTopics(topics.filter((_, i) => i !== index));

  const addTopic = () =>
    setTopics([...topics, { name: "", estimated_hours: 1 }]);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-lg">
        <h1 className="font-h1 text-h1 text-on-background mb-xs">
          {step === 1 ? "Source Material" : "Review Topics"}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {step === 1
            ? "Provide the foundational content for your study session."
            : "Adjust the generated topics and estimated hours for your study plan."}
        </p>
      </div>

      {/* Main Layout Grid */}
      {step === 1 ? (
        <div className="grid grid-cols-12 gap-gutter">
          {/* Left Column: Upload Area */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-lg">
            {/* Drop Zone */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest hover:border-primary transition-colors duration-300 flex flex-col items-center justify-center py-xxl px-lg text-center cursor-pointer shadow-[0_4px_20px_-4px_rgba(26,20,107,0.04)]">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-md">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: "32px" }}
                >
                  cloud_upload
                </span>
              </div>

              <h3 className="font-h3 text-h3 text-on-surface mb-xs">
                Upload Document
              </h3>

              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-lg">
                Drag and drop your PDF, DOCX, or TXT files here, or click to
                browse your computer.
              </p>

              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <label
                htmlFor="fileUpload"
                className="border border-primary text-primary hover:bg-surface-container-low font-label-md text-label-md py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Select File
              </label>
            </div>

            {/* Alternate: Paste Text Area */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(26,20,107,0.04)] p-lg border border-surface-variant">
              <label className="block font-label-md text-label-md text-on-surface mb-sm">
                Or Paste Raw Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your lecture notes or article text here..."
                className="w-full h-32 bg-background border border-outline-variant rounded-lg p-md font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Right Column: Processing State & Options */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(26,20,107,0.08)] p-xl border-t-2 border-primary h-full flex flex-col">
              {/* Plan Details */}
              <div className="mb-xl">
                <h2 className="font-h3 text-h3 text-on-surface mb-md">
                  Plan Details
                </h2>

                <div className="flex flex-col gap-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs">
                      Subject Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Data Structures"
                      className="w-full bg-background border border-outline-variant rounded-lg p-md font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-xs">
                      Target Date (Optional)
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-background border border-outline-variant rounded-lg p-md font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* File State */}
              {file && (
                <div className="mb-xl">
                  <h2 className="font-label-md text-label-md text-on-surface-variant uppercase mb-md tracking-widest">
                    Current Document
                  </h2>
                  <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      description
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
                        {file.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      onClick={() => setFile(null)}
                      className="text-outline hover:text-error transition-colors"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        close
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Processing Actions */}
              <div className="flex-1 flex flex-col">
                <h2 className="font-label-md text-label-md text-on-surface-variant uppercase mb-md tracking-widest">
                  What Happens Next
                </h2>

                <div className="flex flex-col gap-sm bg-surface-container-low p-md rounded-xl border border-outline-variant">
                  {[
                    "AI analyzes your material",
                    "Breaks down into topics",
                    "You review and edit",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-on-surface"
                    >
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontSize: "20px" }}
                      >
                        check_circle
                      </span>
                      <span className="font-body-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proceed Button */}
              <div className="mt-xl pt-lg border-t border-surface-variant">
                <button
                  onClick={handleProcess}
                  disabled={loading}
                  className="w-full bg-secondary hover:bg-on-secondary-container text-on-secondary py-3 rounded-lg font-body-md text-body-md font-semibold transition-colors flex justify-center items-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Generate Topics"}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_-4px_rgba(26,20,107,0.08)] p-xl border-t-2 border-primary">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-h3 text-h3 text-on-surface">Topics to Study</h2>
            <div className="text-sm font-label-md text-on-surface-variant bg-surface-container px-sm py-xs rounded-md">
              {topics.length} topics
            </div>
          </div>

          {topics.length === 0 ? (
            <p className="text-on-surface-variant text-center py-xl">
              No topics generated.
            </p>
          ) : (
            <div className="flex flex-col gap-sm">
              {topics.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-md items-center bg-surface-container-low p-md rounded-lg border border-outline-variant"
                >
                  <input
                    value={t.name}
                    onChange={(e) => updateTopic(i, "name", e.target.value)}
                    placeholder="Topic name"
                    className="flex-1 w-full bg-background border border-outline-variant rounded-lg p-md font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <div className="flex items-center gap-sm w-full sm:w-auto">
                    <span className="font-label-sm text-on-surface-variant hidden sm:inline-block">
                      Hours:
                    </span>
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
                      className="w-24 bg-background border border-outline-variant rounded-lg p-md font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                    <button
                      onClick={() => removeTopic(i)}
                      className="p-sm text-outline hover:text-error transition-colors"
                      title="Remove Topic"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-xl flex flex-wrap gap-md items-center pt-lg border-t border-surface-variant">
            <button
              onClick={addTopic}
              className="border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-md text-label-md py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                add
              </span>
              Add Topic
            </button>
            <button
              onClick={() => setStep(1)}
              className="border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-md text-label-md py-2 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <div className="flex-1" />
            <button
              onClick={handleCreate}
              disabled={loading || topics.length === 0}
              className="bg-primary hover:bg-primary-dark text-on-primary py-2 px-6 rounded-lg font-body-md text-body-md font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Creating..." : "Create Study Plan"}
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                check_circle
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

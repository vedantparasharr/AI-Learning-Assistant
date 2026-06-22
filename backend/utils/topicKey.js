const slugify = (value) =>
  String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const buildTopicKey = (subjectName, topicName, suffix = 0) => {
  const base = slugify(`${subjectName}-${topicName}`) || "topic";
  return suffix > 0 ? `${base}-${suffix}` : base;
};

export const sanitizeTopics = (topics) =>
  (Array.isArray(topics) ? topics : [])
    .map((topic) => ({
      name: String(topic?.name || "").trim(),
      estimated_hours:
        Number(topic?.estimated_hours) > 0
          ? Number(topic.estimated_hours)
          : 1,
    }))
    .filter((topic) => topic.name);

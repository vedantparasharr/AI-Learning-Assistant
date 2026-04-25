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

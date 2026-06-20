export const formatDate = (value, options = {}) => {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: options.withTime ? "short" : undefined,
  }).format(new Date(value));
};
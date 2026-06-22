import ytSearch from "yt-search";

const TRUSTED_CHANNELS = [
  "Neso Academy",
  "Gate Smashers",
  "Khan Academy",
  "CrashCourse",
  "MIT OpenCourseWare",
];

export const getTopTopicVideos = async (topicName, subjectName) => {
  try {
    const query = `${topicName} ${subjectName}`.trim();
    const searchResults = await ytSearch(query);
    const videos = Array.isArray(searchResults?.videos)
      ? searchResults.videos.slice(0, 12)
      : [];

    const scored = videos.map((video) => {
      const titleLower = String(video.title || "").toLowerCase();
      const topicLower = topicName.toLowerCase();
      const authorLower = String(video.author?.name || "").toLowerCase();

      const isTrusted = TRUSTED_CHANNELS.some(
        (channel) => channel.toLowerCase() === authorLower
      );

      let score = 0;
      if (isTrusted) score += 2;
      if (titleLower.includes(topicLower)) score += 1;

      return {
        title: video.title,
        url: video.url,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        duration: video.timestamp,
        seconds: Number(video.seconds) || 0,
        views: Number(video.views) || 0,
        authorName: video.author?.name || "",
        score,
      };
    });

    return scored
      .sort((left, right) => right.score - left.score || right.views - left.views)
      .slice(0, 3);
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
};

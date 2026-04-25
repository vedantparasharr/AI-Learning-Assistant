import ytSearch from "yt-search";

const TRUSTED_CHANNELS = [
  "Neso Academy",
  "Gate Smashers",
  "Khan Academy",
  "CrashCourse",
  "MIT OpenCourseWare",
];

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);

const getKeywordScore = (topicName, videoTitle) => {
  const topicWords = [...new Set(tokenize(topicName))];

  if (topicWords.length === 0) {
    return 0.5;
  }

  const titleWords = new Set(tokenize(videoTitle));
  const matches = topicWords.filter((word) => titleWords.has(word)).length;

  if (matches === 0) {
    return 0.5;
  }

  return matches / topicWords.length;
};

const getViewsScore = (views) => Math.min((Number(views) || 0) / 1000000, 1);

const getDurationScore = (seconds) => {
  const minutes = (Number(seconds) || 0) / 60;
  return minutes >= 6 && minutes <= 25 ? 1 : 0.2;
};

const getWhitelistBoost = (authorName) => {
  const normalizedAuthor = String(authorName || "").trim().toLowerCase();

  return TRUSTED_CHANNELS.some(
    (channel) => channel.toLowerCase() === normalizedAuthor,
  )
    ? 0.3
    : 0;
};

const serializeVideo = (video, score) => ({
  title: video.title,
  url: video.url,
  videoId: video.videoId,
  thumbnail: video.thumbnail,
  duration: video.timestamp,
  seconds: Number(video.seconds) || 0,
  views: Number(video.views) || 0,
  authorName: video.author?.name || "",
  score: Number(score.toFixed(4)),
});

export const getTopTopicVideos = async (topicName, subjectName) => {
  const query = `${topicName} ${subjectName}`.trim();
  const searchResults = await ytSearch(query);
  const videos = Array.isArray(searchResults?.videos)
    ? searchResults.videos.slice(0, 15)
    : [];

  if (videos.length === 0) {
    return [];
  }

  return videos
    .map((video) => {
      const keywordScore = getKeywordScore(topicName, video.title);
      const viewsScore = getViewsScore(video.views);
      const durationScore = getDurationScore(video.seconds);
      const whitelistBoost = getWhitelistBoost(video.author?.name);
      const finalScore =
        keywordScore * 0.5 +
        viewsScore * 0.3 +
        durationScore * 0.2 +
        whitelistBoost;

      return serializeVideo(video, finalScore);
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
};

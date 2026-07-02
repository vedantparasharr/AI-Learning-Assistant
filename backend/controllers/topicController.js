import * as topicService from "../services/topicService.js";

// @desc Generate topic content
// @route POST api/topics/:topicKey/generate
// @access private
export const generateTopicContent = async (req, res, next) => {
  try {
    const { topicKey } = req.params;
    const { status, data } = await topicService.getOrGenerateTopicContentService(
      req.user._id,
      topicKey
    );

    const isAccepted = status === "generating";
    const code = isAccepted ? 202 : 200;
    const message = isAccepted
      ? "Topic content is still generating. Please retry shortly."
      : "Topic content retrieved successfully";

    return res.status(code).json({
      success: true,
      data,
      message,
      statusCode: code,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Stream topic content (videos and notes)
// @route GET api/topics/:topicKey/stream
// @access private
export const streamTopicContent = async (req, res, next) => {
  try {
    await topicService.streamTopicContentService(req, res);
  } catch (error) {
    next(error);
  }
};

// @desc Mark topic completed
// @route PATCH api/topics/:topicKey/complete
// @access private
export const markTopicCompleted = async (req, res, next) => {
  try {
    const { topicKey } = req.params;
    const { completionStatus = "completed" } = req.body;
    const data = await topicService.markTopicCompletedService(req.user._id, topicKey, completionStatus);

    return res.status(200).json({
      success: true,
      data,
      message: `Topic marked as ${completionStatus}`,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};

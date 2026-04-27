import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const generateTopicContent = async (topicKey) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.TOPICS.GENERATE(topicKey),
      {},
      {
        validateStatus: (status) => [200, 202, 500].includes(status),
      },
    );

    return {
      status: response.status,
      body: response.data,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to generate topic content" };
  }
};

const markTopicCompleted = async (topicKey) => {
  try {
    const response = await axiosInstance.patch(API_PATHS.TOPICS.COMPLETE(topicKey));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark topic completed" };
  }
};

const topicService = {
  generateTopicContent,
  markTopicCompleted,
};

export default topicService;

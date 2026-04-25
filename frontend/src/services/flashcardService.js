import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const activateTopic = async (topicKey) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.ACTIVATE_TOPIC(topicKey));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to sync topic flashcards" };
  }
};

const getQueue = async (topicKey = "") => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_QUEUE, {
      params: topicKey ? { topicKey } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch review queue" };
  }
};

const reviewCard = async (cardId, rating) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_CARD(cardId), {
      rating,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to review flashcard" };
  }
};

const flashcardService = {
  activateTopic,
  getQueue,
  reviewCard,
};

export default flashcardService;

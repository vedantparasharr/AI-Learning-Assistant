import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const getDashboardSummary = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_SUMMARY);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch dashboard" };
  }
};

const getActivityByDate = async (date) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_ACTIVITY_BY_DATE(date));
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch daily activity" };
  }
};

const dashboardService = {
  getDashboardSummary,
  getActivityByDate,
};

export default dashboardService;

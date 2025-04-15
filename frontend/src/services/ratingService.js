import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/ratings`;

export const submitRating = async (messageId, rating) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(`${API_URL}`, {
      messageId,
      rating
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to submit rating", error.response?.data || error.message);
    throw error;
  }
};

export const getRating = async (messageId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch rating", error.response?.data || error.message);
    return null;
  }
};

export const getUserRating = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // Expected to return { avgRating, totalRatings }
  } catch (err) {
    console.error("Failed to fetch user rating", err.response?.data || err.message);
    return null;
  }
};

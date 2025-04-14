import axios from "axios";

// const API_URL = "http://localhost:5000/api/ratings"; // Adjust URL as needed
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/rating`;

// Fetch User Ratings
export const fetchRatings = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

// Submit a New Rating
export const submitRating = async (ratingData) => {
  const response = await axios.post(`${API_URL}/submit`, ratingData);
  return response.data;
};

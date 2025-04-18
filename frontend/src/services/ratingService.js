import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/ratings`;

// Utility to get the authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const rateUser = async (fromUser, toUser, rating) => {
  const res = await axios.post(
    `${API}/rate`,
    { fromUser, toUser, rating },
    getAuthHeaders() // Attach token here
  );
  return res.data;
};

export const getAverageRating = async (userId) => {
  const res = await axios.get(`${API}/average/${userId}`, getAuthHeaders());
  return res.data;
};

export const checkIfAlreadyRated = async (fromUser, toUser) => {
  const res = await axios.get(
    `${API}/check`,
    {
      params: { fromUser, toUser },
      ...getAuthHeaders(), // Attach token here
    }
  );
  return res.data;
};

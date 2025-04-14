import axios from "axios";

// const API_URL = "http://localhost:5000/api/match";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/match`;


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Fetch matched users based on skills
const getMatchedSkills = async (skills) => {
  try {
    if (!skills || skills.length === 0) return { teaching: [], learning: [], mutual: [] };

    const skillsQuery = skills.join(",");
    console.log("Fetching Matched Skills for:", skillsQuery);

    const response = await axios.get(`${API_URL}/find?skill=${encodeURIComponent(skillsQuery)}`, getAuthHeaders());

    return response.data || { teaching: [], learning: [], mutual: [] };
  } catch (error) {
    console.error("Error fetching matched skills:", error.response?.data || error.message);
    return { teaching: [], learning: [], mutual: [] };
  }
};

// Fetch Match Details by ID
const getMatchById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error fetching match details:", error.response?.data || error.message);
    return null;
  }
};

// Send Match Request
const sendMatchRequest = async (userId, partnerId, skills, matchType) => {
  try {
    const response = await axios.post(
      `${API_URL}/request`,
      { user1: userId, user2: partnerId, skills, matchType },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error sending match request:", error.response?.data || error.message);
    return null;
  }
};

export default { getMatchedSkills, getMatchById, sendMatchRequest };

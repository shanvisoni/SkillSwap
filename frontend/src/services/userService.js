import axios from "axios";

// const API_URL = "http://localhost:5000/api/users"; // Backend URL
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;


// ✅ Get User Info by ID
const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};


// ✅ Update User Profile
const updateUserProfile = async (profile, token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};


// ✅ Get Recent Skills
const getRecentSkills = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent skills:", error);
    return [];
  }
};

// ✅ Get User Activity Feed
const getActivityFeed = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile/activity`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activity feed:", error);
    return [];
  }
};
// const userSearch= {
//   searchUsers: async (query) => {
//     const response = await axios.get(`${API_URL}/search?query=${query}`);
//     return response.data;
//   }
// };

const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
};
const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};


const userService = { getUserById, updateUserProfile, getRecentSkills, getActivityFeed,searchUsers,getAllUsers  };

export default userService;

import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth"; // Adjust URL as needed
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;


export const loginUser = async (credentials) => {
  try {
    console.log("Sending Login Request:", credentials);
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Received Login Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Login API Error:", err.response?.data || err.message);
    
    // Instead of throwing the err
    // or, return a structured response
    return { error: err.response?.data?.message || "Invalid credentials" };
  }
};



// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Returns { user, token }
  } catch (err) {
    console.error("Registration Error:", err.response?.data?.message || err.message);
    throw err.response?.data || { message: "Registration failed" };
  }
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// Fetch User Profile
export const getUserProfile = async (token) => {
  if (!token) return null; // Prevent unnecessary API calls

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Fetch Current User
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null; // ✅ Prevent request if no token

  try {
    const response = await axios.get(`${API_URL}/current-user`, {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is prefixed correctly
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);

    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem("token"); // ✅ Remove expired/invalid token
    }

    return null;
  }
};



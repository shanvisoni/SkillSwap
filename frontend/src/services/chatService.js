import axios from "axios";
// import { ToastContainer,toast } from 'react-toastify';


// const API_URL = "http://localhost:5000/api/chat"; // Change as per your backend
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/chat`;

// ✅ Fetch previous chat history
export const fetchChatHistory = async (token, userId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error.response?.data || error.message;
  }
};

export const sendMessage = async (token, receiver, text) => {
  console.log("📤 Sending message:", { receiver, text });

  try {
    const response = await axios.post(
      `${API_URL}/send`,
      { receiver, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response; // Don't throw here
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return error.response; // Return error response instead of throwing
  }
};



export const getUnreadMessages = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found, user may not be logged in.");
    return [];
  }

  try {
    const response = await axios.get(`${API_URL}/unread`, { // Fixed API path
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching unread messages:", error.response?.data || error.message);
    return [];
  }
};

export const markMessagesAsRead = async (senderId) => {
  const token = localStorage.getItem("token");

  try {
    await axios.patch(`${API_URL}/read/${senderId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Marked messages as read for", senderId);
  } catch (error) {
    console.error("❌ Failed to mark messages as read:", error);
  }
};



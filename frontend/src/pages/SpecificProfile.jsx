import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

const SpecificProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({ avgRating: 0, total: 0 });

  const handleChatClick = () => {
    navigate(`/chats/${userId}`); // Navigate to chat page
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/ratings/average/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const ratingData = await res.json();
        setRatingInfo(ratingData);
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    fetchUserProfile();
    fetchUserRating();
  }, [userId]);

  if (!user)
    return (
      <p className="text-center text-gray-500 text-lg mt-10 animate-pulse">
        Loading profile...
      </p>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-lg p-6 max-w-xl w-full border border-white/30 transition duration-300 hover:scale-105 hover:shadow-blue-300">
        {/* Profile Header */}
        <h2 className="text-3xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          {user.name}'s Profile
        </h2>

        {/* Profile Details */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-white text-lg">
          <p className="font-semibold">📛 Name:</p>
          <p>{user.name}</p>

          <p className="font-semibold">📧 Email:</p>
          <p>{user.email}</p>

          <p className="font-semibold">📍 Location:</p>
          <p>{user.location || "Not provided"}</p>

          <p className="font-semibold">⏳ Availability:</p>
          <p>{user.availability}</p>

          <p className="font-semibold">💼 Profession:</p>
          <p>
            {user.skills.length > 0 ? user.skills.join(", ") : "Not specified"}
          </p>

          <p className="font-semibold">🎓 Teaching:</p>
          <p>
            {user.teaching.length > 0
              ? user.teaching.join(", ")
              : "Not specified"}
          </p>

          <p className="font-semibold">📖 Learning:</p>
          <p>
            {user.learning.length > 0
              ? user.learning.join(", ")
              : "Not specified"}
          </p>

          <p className="font-semibold">⭐ Ratings:</p>
          <p>
            {ratingInfo.total > 0
              ? `⭐ ${ratingInfo.total} Ratings (Avg: ${ratingInfo.avgRating}/5)`
              : "No ratings yet"}
          </p>
        </div>

        {/* Chat Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
            onClick={handleChatClick}
          >
            💬 Chat Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecificProfile;

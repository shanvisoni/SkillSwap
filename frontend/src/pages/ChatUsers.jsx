import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChatUsers = () => {
  const { token } = useContext(AuthContext);
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); // Initialize activeChatId

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        let data = await res.json();
  
        // Move unread users to the top
        data.sort((a, b) => {
          if (a._id === activeChatId) return -1; // Move active chat user to the top
          if (b._id === activeChatId) return 1;
          return b.unreadMessages - a.unreadMessages; // Sort by unread messages
        });
        
  
        setChatUsers(data);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };
    fetchChatUsers();
  }, [token]);
  

  return (
    <div className="bg-black min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-md bg-gradient-to-br from-[#86003C] via-[#E41F7B] to-[#FF8BA0] text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Chat Users</h2>

        <div className="space-y-4">
  {chatUsers.length > 0 ? (
    chatUsers.map((user) => ( // ✅ Removed extra {}
      <div
        key={user._id}
        onClick={() => navigate(`/chats/${user._id}`)}
        className={`p-4 rounded-xl shadow-lg cursor-pointer 
          transition-transform duration-300 ease-in-out flex items-center gap-3 
          border border-[#FF8BA0] ${user.unreadMessages > 0 ? "bg-yellow-400 animate-bounce border-yellow-600" : "bg-[#86003C] hover:bg-[#E41F7B] hover:scale-105"}`}
      >
        <div className="w-10 h-10 bg-[#FF8BA0] rounded-full flex items-center justify-center text-black font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-lg font-semibold">{user.name}</span>
    
        {user.unreadMessages > 0 && (
          <span className="ml-auto text-xs px-2 py-1 bg-red-500 text-white rounded-full animate-pulse">
            {user.unreadMessages} New
          </span>
        )}
      </div>
    ))
  ) : (
    <p className="text-gray-200 text-center animate-fade-in">No chat users yet.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default ChatUsers;







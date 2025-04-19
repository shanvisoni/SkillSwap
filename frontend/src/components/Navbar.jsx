

import {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUnreadMessages } from "../services/chatService";
import { useChat } from "../context/ChatContext";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const { socket } = useChat();


const fetchUnreadMessages = async () => {
  try {
    const messages = await getUnreadMessages();
    const totalUnread = messages.reduce((sum, msg) => sum + msg.count, 0);
    setUnreadCount(totalUnread);
  } catch (error) {
    console.error("Error fetching unread messages:", error);
  }
};

// ✅ On mount or user change, start polling
useEffect(() => {
  if (!user) return;
  fetchUnreadMessages();

  const interval = setInterval(fetchUnreadMessages, 10000);
  return () => clearInterval(interval);
}, [user]);

// ✅ Listen for new messages using socket
useEffect(() => {
  if (!socket) return;

  const handleNewMessage = () => {
    fetchUnreadMessages(); // update badge immediately
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket]);

// ✅ When user visits chat, mark messages as read & re-fetch
const markMessagesAsRead = async (chatId) => {
  try {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/read/${chatId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    await fetchUnreadMessages(); // ✅ correct value after reading
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};


  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* <Link to="/" className="text-2xl font-bold">SkillSwap</Link> */}
        <Link to="/" className="flex items-center space-x-2">
  <span className="text-3xl animate-pulse drop-shadow-lg">🤝</span>
  <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent drop-shadow-md">
    Skill<span className="italic text-white">Swap</span>
  </span>
</Link>




        <ul className="hidden md:flex space-x-6">
          <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
          <li><Link to="/dashboard" className="hover:text-bclue-400">Dashboard</Link></li>
          <li><Link to="/profile" className="hover:text-blue-400">Profile</Link></li>
          <li className="relative">
          <Link to="/chats" className="hover:text-blue-400" onClick={() => markMessagesAsRead(user?._id)}>
  Chat {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
</Link>

            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </li>
          <li><Link to="/progress" className="hover:text-blue-400">Progress</Link></li>
        </ul>

        <div className="hidden md:flex space-x-4">
          {user ? (
            <>
              <span className="font-semibold">{user.name}</span>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center space-y-4 mt-4">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          <li className="relative">
          <Link to="/chats" className="hover:text-blue-400" onClick={() => markMessagesAsRead(user?._id)}>
  Chat {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
</Link>

            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-md border border-white">
                {unreadCount}
              </span>
            )}
          </li>
          <li><Link to="/progress" onClick={() => setMenuOpen(false)}>Progress</Link></li>
          {user ? (
            <>
              <li><span className="font-semibold">{user.name}</span></li>
              <li>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">Login</Link></li>
              <li><Link to="/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">Sign Up</Link></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

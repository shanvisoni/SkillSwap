// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const ChatUsers = () => {
//   const { token } = useContext(AuthContext);
//   const [chatUsers, setChatUsers] = useState([]);
//   const [activeChatId, setActiveChatId] = useState(null); // Initialize activeChatId

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/users`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) return;
//         let data = await res.json();
  
//         // Move unread users to the top
//         data.sort((a, b) => {
//           if (a._id === activeChatId) return -1; // Move active chat user to the top
//           if (b._id === activeChatId) return 1;
//           return b.unreadMessages - a.unreadMessages; // Sort by unread messages
//         });
        
  
//         setChatUsers(data);
//       } catch (error) {
//         console.error("Error fetching chat users:", error);
//       }
//     };
//     fetchChatUsers();
//   }, [token]);
  

//   return (
//     <div className="bg-black min-h-screen p-6 flex justify-center">
//       <div className="w-full max-w-md bg-gradient-to-br from-[#86003C] via-[#E41F7B] to-[#FF8BA0] text-white p-6 rounded-2xl shadow-xl">
//         <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Chat Users</h2>

//         <div className="space-y-4">
//   {chatUsers.length > 0 ? (
//     chatUsers.map((user) => ( // ✅ Removed extra {}
//       <div
//         key={user._id}
//         onClick={() => navigate(`/chats/${user._id}`)}
//         className={`p-4 rounded-xl shadow-lg cursor-pointer 
//           transition-transform duration-300 ease-in-out flex items-center gap-3 
//           border border-[#FF8BA0] ${user.unreadMessages > 0 ? "bg-yellow-400 animate-bounce border-yellow-600" : "bg-[#86003C] hover:bg-[#E41F7B] hover:scale-105"}`}
//       >
//         <div className="w-10 h-10 bg-[#FF8BA0] rounded-full flex items-center justify-center text-black font-bold">
//           {user.name.charAt(0).toUpperCase()}
//         </div>
//         <span className="text-lg font-semibold">{user.name}</span>
    
//         {user.unreadMessages > 0 && (
//           <span className="ml-auto text-xs px-2 py-1 bg-red-500 text-white rounded-full animate-pulse">
//             {user.unreadMessages} New
//           </span>
//         )}
//       </div>
//     ))
//   ) : (
//     <p className="text-gray-200 text-center animate-fade-in">No chat users yet.</p>
//   )}
// </div>

//       </div>
//     </div>
//   );
// };

// export default ChatUsers;




 //--update for message ordering------------------

import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import { getUnreadMessages, markMessagesAsRead } from "../services/chatService";

const ChatUsers = () => {
  const { token, user: currentUser } = useContext(AuthContext);
  const { socket, isSocketReady } = useChat();
  const [chatUsers, setChatUsers] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const navigate = useNavigate();

  // Sort function that prioritizes both unread messages AND recent activity
  const sortChatUsers = useCallback((users) => {
    return [...users].sort((a, b) => {
      // First sort by unread messages (descending)
      if (a.unreadMessages > 0 || b.unreadMessages > 0) {
        return b.unreadMessages - a.unreadMessages;
      }
      // Then sort by last message time (descending)
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
  }, []);

  // Fetch initial users and unread counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chat users
        const usersRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!usersRes.ok) return;
        let users = await usersRes.json();

        // Fetch unread counts
        const unreadRes = await getUnreadMessages();
        const unreadMap = unreadRes.reduce((acc, curr) => {
          acc[curr.senderId] = curr.count;
          return acc;
        }, {});

        // Merge data and sort
        users = users.map(user => ({
          ...user,
          unreadMessages: unreadMap[user._id] || 0
        }));

        setChatUsers(sortChatUsers(users));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token, sortChatUsers]);

  // Handle real-time updates
  useEffect(() => {
    if (!isSocketReady || !socket || !currentUser) return;

    const handleNewMessage = (message) => {
      setChatUsers(prevUsers => {
        const isCurrentUserReceiver = message.receiver === currentUser._id;
        const senderId = isCurrentUserReceiver ? message.sender : message.receiver;
        
        const userIndex = prevUsers.findIndex(u => u._id === senderId);
        let updatedUsers = [...prevUsers];

        if (userIndex >= 0) {
          // User exists - update their data
          const [user] = updatedUsers.splice(userIndex, 1);
          user.lastMessageTime = message.createdAt;
          if (isCurrentUserReceiver) {
            user.unreadMessages = (user.unreadMessages || 0) + 1;
          }
          updatedUsers.unshift(user);
        } else {
          // New user - add to top
          updatedUsers.unshift({
            _id: senderId,
            name: message.senderName || "New User",
            lastMessageTime: message.createdAt,
            unreadMessages: isCurrentUserReceiver ? 1 : 0
          });
        }

        return sortChatUsers(updatedUsers);
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [isSocketReady, socket, currentUser, sortChatUsers]);

  const handleUserClick = async (userId) => {
    setActiveChatId(userId);
    // Mark messages as read when clicking on a user
    await markMessagesAsRead(userId);
    // Update the unread count
    setChatUsers(prev =>
      sortChatUsers(
        prev.map(user =>
          user._id === userId ? { ...user, unreadMessages: 0 } : user
        )
      )
    );
    navigate(`/chats/${userId}`);
  };

  return (
    <div className="bg-black min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-md bg-gradient-to-br from-[#86003C] via-[#E41F7B] to-[#FF8BA0] text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in">Chat Users</h2>

        <div className="space-y-4">
          {chatUsers.length > 0 ? (
            chatUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className={`p-4 rounded-xl shadow-lg cursor-pointer 
                  transition-transform duration-300 ease-in-out flex items-center gap-3 
                  border ${user._id === activeChatId ? "border-white bg-[#E41F7B]" : 
                  user.unreadMessages > 0 ? "bg-yellow-400 border-yellow-600 animate-bounce" : 
                  "bg-[#86003C] border-[#FF8BA0] hover:bg-[#E41F7B] hover:scale-105"}`}
              >
                <div className="w-10 h-10 bg-[#FF8BA0] rounded-full flex items-center justify-center text-black font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <span className="text-lg font-semibold">{user.name || "New User"}</span>
                </div>
                {user.unreadMessages > 0 && (
                  <span className="ml-2 text-xs px-2 py-1 bg-red-500 text-white rounded-full animate-pulse">
                    {user.unreadMessages}
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












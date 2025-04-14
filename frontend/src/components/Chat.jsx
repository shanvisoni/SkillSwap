import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import moment from "moment";
import { useChat } from "../context/ChatContext";
import { ToastContainer,toast } from 'react-toastify';
import { markMessagesAsRead } from "../services/chatService";


const Chat = ({ receiverId: propReceiverId }) => {
  const { user } = useContext(AuthContext);
  const { userId: paramReceiverId } = useParams();
  const receiverId = propReceiverId || paramReceiverId;

  if (typeof receiverId === "string" && receiverId.length !== 24) {
    console.error("Invalid receiverId format!");
  }


  const { socket, messages, loadChatHistory, selectedChat,setMessages  } = useChat();
  const [text, setText] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const messagesEndRef = useRef(null);


    // Add debug logs for messages
    useEffect(() => {
      console.log("Current messages:", messages);
    }, [messages]);
  
  // 🧠 Load messages on mount
  useEffect(() => {
    if (receiverId) {
      loadChatHistory(receiverId);
      fetchReceiverName();
      markMessagesAsRead(receiverId);
    }


     // ✅ Mark messages as read when chat is opened
  }, [receiverId]);

  useEffect(() => {
    
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   
  }, [messages]);


  useEffect(() => {
    if (!socket || !user?._id) return;
    
    console.log("Socket ID:", socket.id); // Should show a socket ID
    console.log("Socket connected:", socket.connected); // Should be true
  
    socket.on("connect", () => {
      console.log("✅ Socket connected!");
    });
  
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  
    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });
    // socket.emit("userConnected", user._id);
    console.log("Joined room for user:", user._id);
  }, [socket, user?._id]);


  const handleSendMessage = async () => {
    if (!text.trim() || !socket || !receiverId) return;
  
    console.log("Attempting to send:", { 
      text: text.trim(), 
      socket: socket.connected,
      receiverId 
    });
  
    const message = {
      sender: user._id,
      receiver: receiverId,
      text: text.trim(),
      senderName: user.name
    };
  
    socket.emit("sendMessage", message, (ack) => {
      console.log("Server acknowledgement:", ack);
      if (ack?.status === "success") {
        setText(""); // Clear input only on success
      } else {
        toast.error(ack?.error || "Failed to send message");
        console.error("Send error:", ack?.error);
      }
    });
  };
  
  // Message listener
// Message listener
useEffect(() => {
  if (!socket || !setMessages) return;

  const handleNewMessage = (message) => {
    console.log("Received new message:", message);
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      const exists = prev.some(m => m._id === message._id);
      return exists ? prev : [...prev, message];
    });
  };

  socket.on("newMessage", handleNewMessage);
  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket, setMessages]);



  // 🔍 Fetch receiver name
  const fetchReceiverName = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${receiverId}`);
      if (!res.ok) return;
      
      const data = await res.json();
      setReceiverName(data.username || data.name || "Unknown");
    } catch (err) {
      console.error("Error fetching receiver name:", err);
    }
  };

  return (
    
    <div className="min-h-screen bg-black">
              <ToastContainer/>
      
      <div className="flex flex-col h-[600px] w-full max-w-lg mx-auto bg-[#86003C] text-white p-4 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-[#FF8BA0]">
          {receiverName ? `Chat with ${receiverName}` : "Chat"}
        </h2>

        {/* 💬 Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E41F78] rounded-lg shadow-sm h-[500px] hidden-scrollbar">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const isSender =
                msg.sender === user._id || msg.sender?._id === user._id;
              const formattedTime = moment(msg.createdAt).format("hh:mm A");

              return (
                <div
                  key={index}
                  className={`p-3 max-w-[75%] rounded-lg shadow-md text-sm ${
                    isSender
                      ? "bg-[#FF8BA0] text-white self-end ml-auto text-right"
                      : "bg-[#86003C] text-white self-start text-left"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-[10px] text-gray-250 mt-1">{formattedTime}</div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-300 text-center">No messages yet.</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* 📝 Message Input */}
        <div className="mt-2 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-[#FF8BA0] text-black border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E41F78]"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 rounded-full bg-[#FF8BA0] hover:bg-[#ff7290] text-white"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};


export default Chat;









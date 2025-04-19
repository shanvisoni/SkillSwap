import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import moment from "moment";
import { useChat } from "../context/ChatContext";
import { ToastContainer, toast } from 'react-toastify';
import { markMessagesAsRead } from "../services/chatService";
import { checkIfAlreadyRated } from "../services/ratingService";
import RatingPopup from "./RatingPopup";

const Chat = ({ receiverId: propReceiverId }) => {
  const { user } = useContext(AuthContext);
  const { userId: paramReceiverId } = useParams();
  const receiverId = propReceiverId || paramReceiverId;

  const { socket, messages, loadChatHistory, selectedChat, setMessages, isSocketReady } = useChat();
  const [text, setText] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!receiverId) return;

    const loadChat = async () => {
      setIsLoading(true);
      try {
        const totalMessages = await loadChatHistory(receiverId);
        await fetchReceiverName();
        await markMessagesAsRead(receiverId);
        if (totalMessages >= 10) {
          await checkRating();
        } else {
          setShowPopup(false); // Don't show popup
        }
  
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSocketReady) {
      loadChat();
    } else {
      const timeout = setTimeout(() => {
        loadChat();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [receiverId, isSocketReady]);

  const checkRating = async () => {
    if (!receiverId || !user) return;
    const { alreadyRated } = await checkIfAlreadyRated(user._id, receiverId);
    setHasRated(alreadyRated);
    setShowPopup(!alreadyRated);
  };

  const handlePopupClose = (rated) => {
    if (rated) setHasRated(true);
    setShowPopup(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on("connect", () => {
      console.log("✅ Socket connected!");
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });
  }, [socket, user?._id]);

  const handleSendMessage = async () => {
    if (!text.trim() || !socket || !receiverId || isLoading) return;

    const message = {
      sender: user._id,
      receiver: receiverId,
      text: text.trim(),
      senderName: user.name
    };

    socket.emit("sendMessage", message, (ack) => {
      if (ack?.status === "success") {
        setText("");
      } else {
        toast.error(ack?.error || "Failed to send message");
      }
    });
  };

  useEffect(() => {
    if (!socket || !setMessages) return;

    const handleNewMessage = (message) => {
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages]);

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
      <ToastContainer />

      {showPopup && !hasRated && (
        <RatingPopup fromUser={user._id} toUser={receiverId} onClose={handlePopupClose} />
      )}

      <div className="flex flex-col h-[600px] w-full max-w-lg mx-auto bg-[#86003C] text-white p-4 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-2 text-[#FF8BA0]">
          {receiverName ? `Chat with ${receiverName}` : "Chat"}
        </h2>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E41F78] rounded-lg shadow-sm h-[500px] hidden-scrollbar">
          {isLoading ? (
            <p className="text-gray-300 text-center">Loading messages...</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id || msg.createdAt}
                className={`p-3 max-w-[75%] rounded-lg shadow-md text-sm ${
                  msg.sender === user._id || msg.sender?._id === user._id
                    ? "bg-[#FF8BA0] text-white self-end ml-auto text-right"
                    : "bg-[#86003C] text-white self-start text-left"
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-250 mt-1">
                  {moment(msg.createdAt).format("hh:mm A")}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center">No messages yet.</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

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

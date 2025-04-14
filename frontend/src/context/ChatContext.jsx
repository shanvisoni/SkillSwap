

import { createContext, useContext, useEffect, useState ,useRef} from "react";
import { fetchChatHistory } from "../services/chatService";
import { io } from "socket.io-client";

const ChatContext = createContext();
// const SOCKET_URL = "http://localhost:5000"; // Backend WebSocket server
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const selectedChatRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Ensure this is stored properly



  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);


// ChatContext.jsx
useEffect(() => {
  if (!token || !userId) return;

  const newSocket = io(SOCKET_URL, { auth: { token } });

  newSocket.on("connect", () => {
    console.log("✅ Connected to WebSocket:", newSocket.id);
    newSocket.emit("userConnected", userId);
  });

  newSocket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket");
  });

  const handleNewMessage = (message) => {
    const currentChat = selectedChatRef.current;
    console.log("📩 Incoming:", message);
    console.log("👀 Current Chat Ref:", currentChat);

    const isCurrentChat =
      message.sender === currentChat || message.receiver === currentChat;

    if (isCurrentChat) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  };

  // Prevent adding multiple listeners
  newSocket.off("newMessage"); // ✅ Clear any existing listeners before adding
  newSocket.on("newMessage", handleNewMessage);

  setSocket(newSocket);

  return () => {
    newSocket.off("connect");
    newSocket.off("disconnect");
    newSocket.off("newMessage");
    newSocket.disconnect();
  };
}, [token, userId]);




  // ✅ Load chat history when user selects a chat
  const loadChatHistory = async (chatUserId) => {
    try {
      setMessages([]); // Clear previous messages
      const chatData = await fetchChatHistory(token, chatUserId);
      setMessages(chatData);
      setSelectedChat(chatUserId);
    } catch (error) {
      console.error("❌ Failed to load chat history:", error);
    }
  };

  return (
    <ChatContext.Provider value={{ socket, messages, loadChatHistory, selectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);



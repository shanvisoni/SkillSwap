
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { fetchChatHistory } from "../services/chatService";
import { io } from "socket.io-client";

const ChatContext = createContext();
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false); // Add this line
  const selectedChatRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!token || !userId) return;

    const newSocket = io(SOCKET_URL, { 
      auth: { token },
      transports: ['websocket'] // Add this for better connection
    });

    const handleConnect = () => {
      console.log("✅ Connected to WebSocket:", newSocket.id);
      newSocket.emit("userConnected", userId);
      setIsSocketReady(true); // Set socket ready when connected
    };

    const handleDisconnect = () => {
      console.log("❌ Disconnected from WebSocket");
      setIsSocketReady(false); // Set socket not ready when disconnected
    };

    const handleNewMessage = (message) => {
      const currentChat = selectedChatRef.current;
      const isCurrentChat = message.sender === currentChat || message.receiver === currentChat;
      
      if (isCurrentChat) {
        setMessages(prev => {
          // Prevent duplicates by checking message ID or timestamp
          const exists = prev.some(m => m._id === message._id || 
            (m.sender === message.sender && m.createdAt === message.createdAt));
          return exists ? prev : [...prev, message];
        });
      }
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("newMessage", handleNewMessage);

    setSocket(newSocket);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("newMessage", handleNewMessage);
      newSocket.disconnect();
      setIsSocketReady(false);
    };
  }, [token, userId]);

  const loadChatHistory = async (chatUserId) => {
    try {
      const chatData = await fetchChatHistory(token, chatUserId);
      setMessages(chatData);
      setSelectedChat(chatUserId);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([]);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      socket, 
      messages, 
      loadChatHistory, 
      selectedChat,
      isSocketReady // Add this to context value
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);






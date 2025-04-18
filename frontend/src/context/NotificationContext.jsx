import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchUnreadCount } from '../services/chatService';
import { io } from 'socket.io-client'; // Add this import


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [socket, setSocket] = useState(null); // Add socket state

  // Initialize socket connection
 // Replace your socket effect with this more robust version


 const handleNewMessage = (message) => {
   if (message.receiver === user._id) {
     setUnreadCounts(prev => ({
       ...prev,
       [message.sender]: (prev[message.sender] || 0) + 1
     }));
     setTotalUnread(prev => prev + 1);
   }
 };
 useEffect(() => {
    if (!socket) return;
handleNewMessage();

   // In NotificationContext.jsx
socket.on('newMessage', (message) => {
    if (message.receiver === user._id && !location.pathname.includes(message.sender)) {
      // Only update if not currently viewing that chat
      setUnreadCounts(prev => ({
        ...prev,
        [message.sender]: (prev[message.sender] || 0) + 1
      }));
    }
  });

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, user]);
useEffect(() => {
    if (!user || !token) return;
  
    let retryCount = 0;
    const maxRetries = 5;
    let newSocket;
  
    const connectSocket = () => {
      newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        query: { userId: user._id, token },
        transports: ['websocket'],
        reconnection: false, // We'll handle manually
        timeout: 5000
      });
  
      newSocket.on('connect', () => {
        retryCount = 0; // Reset on successful connection
        console.log('Socket connected');
      });
  
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(connectSocket, Math.min(1000 * retryCount, 10000));
        }
      });
  
      newSocket.on('newMessage', handleNewMessage);
    };
  
    connectSocket();
  
    return () => {
      if (newSocket) {
        newSocket.off('newMessage', handleNewMessage);
        newSocket.disconnect();
      }
    };
  }, [user, token]);

  const updateUnreadCount = async () => {
    if (!user || !token) return;
    
    try {
      const counts = await fetchUnreadCount(token);
      setUnreadCounts(counts);
      
      // Calculate total unread messages
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      setTotalUnread(total);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Poll for new messages every 30 seconds
  useEffect(() => {
    updateUnreadCount();
    const interval = setInterval(updateUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, token]);

  // Listen for new messages via socket
 

  return (
    <NotificationContext.Provider value={{ unreadCounts, totalUnread, updateUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
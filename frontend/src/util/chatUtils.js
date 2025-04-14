export const markMessagesAsRead = async (chatId, token, setUnreadCount) => {
    if (!chatId) return;
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/read/${chatId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // Reset unread messages count
      if (setUnreadCount) {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };
  


// import { Server } from "socket.io";
// import Message from "../models/Message.js";

// const userSockets = {}; // { userId: [socketId1, socketId2] }

// const setupSocket = (server) => {
//   const io = new Server(server, {
//     cors: { 
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST"]
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("🔗 User connected:", socket.id);

//     // Handle user connection
//     socket.on("userConnected", (userId) => {
//       if (!userId) {
//         console.error("❌ Error: Missing user ID during connection");
//         return;
//       }
      
//       if (!userSockets[userId]) userSockets[userId] = [];
//       userSockets[userId].push(socket.id);
//       console.log("✅ User connected:", userId);
//     });

//     // Handle message sending
//     socket.on("sendMessage", async (message, callback) => {
//       try {
//         console.log("Received message from:", message.sender);
        
//         // 1. Save to database
//         const newMessage = new Message({
//           sender: message.sender,
//           receiver: message.receiver,
//           text: message.text,
//           createdAt: new Date()
//         });
//         await newMessage.save();

//         console.log("Message saved:", newMessage._id);

//         // 2. Broadcast to both users
//         const broadcast = (userId) => {
//           if (userSockets[userId]) {
//             userSockets[userId].forEach(socketId => {
//               io.to(socketId).emit("newMessage", newMessage.toObject());
//             });
//           }
//         };

//         broadcast(message.sender);
//         broadcast(message.receiver);

//         // 3. Send success response
//         callback({ 
//           status: "success", 
//           message: "Message sent successfully" 
//         });

//       } catch (error) {
//         console.error("❌ Error handling message:", error);
//         callback({ 
//           status: "error", 
//           error: error.message 
//         });
//       }
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log("❌ User disconnected:", socket.id);
//       for (const userId in userSockets) {
//         userSockets[userId] = userSockets[userId].filter(id => id !== socket.id);
//         if (userSockets[userId].length === 0) {
//           delete userSockets[userId];
//           console.log("🔻 Removed user from active list:", userId);
//         }
//       }
//     });
//   });

//   return io;
// };

// export default setupSocket;













// --------------userList changes are made here------


import { Server } from "socket.io";
import Message from "../models/Message.js";
import dotenv from "dotenv";
dotenv.config();


const userSockets = {}; // { userId: [socketId1, socketId2] }

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { 
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    console.log("🔗 User connected:", socket.id);

    // Handle user connection
    socket.on("userConnected", (userId) => {
      if (!userId) {
        console.error("❌ Error: Missing user ID during connection");
        return;
      }
      
      if (!userSockets[userId]) userSockets[userId] = [];
      userSockets[userId].push(socket.id);
      console.log("✅ User connected:", userId);
    });

    // Handle message sending
    socket.on("sendMessage", async (message, callback) => {
      try {
        console.log("Received message from:", message.sender);
        
        // 1. Save to database
        const newMessage = new Message({
          sender: message.sender,
          receiver: message.receiver,
          text: message.text,
          createdAt: new Date()
        });
        await newMessage.save();

        console.log("Message saved:", newMessage._id);

        // 2. Broadcast to both users
        const broadcast = (userId) => {
          if (userSockets[userId]) {
            userSockets[userId].forEach(socketId => {
              io.to(socketId).emit("newMessage", newMessage.toObject());
            });
          }
        };

        broadcast(message.sender);
        broadcast(message.receiver);

        // 3. Send success response
        callback({ 
          status: "success", 
          message: "Message sent successfully" 
        });

      } catch (error) {
        console.error("❌ Error handling message:", error);
        callback({ 
          status: "error", 
          error: error.message 
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      for (const userId in userSockets) {
        userSockets[userId] = userSockets[userId].filter(id => id !== socket.id);
        if (userSockets[userId].length === 0) {
          delete userSockets[userId];
          console.log("🔻 Removed user from active list:", userId);
        }
      }
    });
  });

  return io;
};

export default setupSocket;
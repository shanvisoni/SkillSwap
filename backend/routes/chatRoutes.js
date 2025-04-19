
import express from "express";
import { saveMessage, getChatHistory,getChatUsers} from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";
const router = express.Router();

router.post("/send", protect, saveMessage);
// router.get("/users", protect, fetchChatUsers);
router.get("/history/:userId", protect, getChatHistory); // ✅ Changed route for clarity

router.get("/users", protect, getChatUsers);

router.post("/test-log", (req, res) => {
  console.log("✅ /test-log route hit");
  console.log("📥 Body:", req.body);
  process.stdout.write("👀 Hello from saveMessage\n");
console.error("🚨 Fallback error log");


  res.json({ msg: "Got it" });
});



router.get('/unread', protect, async (req, res) => {
    try {
        // Step 1: Check messages before aggregation
        const unreadMessages = await Message.find({
            receiver: req.user._id,
            read: false
        });
        console.log("Unread Messages:", unreadMessages); // ✅ Debugging

        // Step 2: Aggregation to count unread messages per sender
        const counts = await Message.aggregate([
            { 
              $match: { 
                receiver: new mongoose.Types.ObjectId(req.user._id), 
                read: false // ✅ Should filter only unread messages
              } 
            },
            {
              $group: {
                _id: { $toString: "$sender" }, // Convert sender ID to string
                count: { $sum: 1 }, // ✅ Count only unread messages
                lastMessageTime: { $max: "$createdAt" } // ✅ Latest message time
              }
            },
            { $sort: { lastMessageTime: -1 } } // ✅ Sort by latest unread messages
          ]);

        console.log("Aggregation Result:", counts); // ✅ Debugging

        // Convert MongoDB ObjectId to strings
        const result = counts.map(item => ({
            senderId: item._id.toString(),
            count: item.count,
            lastMessageTime: item.lastMessageTime
        }));
      
        res.json(result);

    } catch (error) {
        console.error("Error in /unread route:", error);
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});


// Mark messages as read
router.patch('/read/:senderId', protect, async (req, res) => {
    try {
      await Message.updateMany(
        {
          sender: req.params.senderId,
          receiver: req.user._id,
          read: false
        },
        { $set: { read: true } }
      );
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
export default router;

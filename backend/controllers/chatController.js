
import Message from "../models/Message.js";
import mongoose from "mongoose";
// import NotificationService from "../src/service/NotificationService.js";
// import User from "../models/User.js"; // ⬅️ Make sure this is at the top


export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "❌ User ID is required!" });
    }

    const currentUserId = req.user.id; // Get logged-in user ID

    // 🔹 Find chat messages between both users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate("sender receiver", "name email") // Populate name & email for better frontend display
    .sort({ createdAt: 1 }); // Sort by oldest first

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};


// export const saveMessage = async (req, res) => {
//   try {
//     const { receiver, text, title, body } = req.body;
//     const sender = req.user?.id;

//     if (!req.user) {
//       return res.status(401).json({ message: "🚫 Not authorized, no token" });
//     }

//     if (!receiver || !text?.trim()) {
//       return res.status(400).json({ message: "❌ Receiver and message text are required" });
//     }

//     // ✅ Save message to DB
//     const message = new Message({ sender, receiver, text });
//     await message.save();

//     // ✅ Fetch receiver's FCM token from DB
//     const receiverUser = await User.findById(receiver);
//     const deviceToken = receiverUser?.fcmToken;

//     // ✅ Send notification if token & details are available
//     if (deviceToken && title && body) {
//       await NotificationService.sendNotification(deviceToken, title, body);
//     }

//     res.status(201).json({
//       message: "✅ Message saved and notification sent (if applicable)",
//       data: message,
//     });

//     console.log({
//       message: "✅ Message saved and notification sent (if applicable)",
//       data: message,
//     });

//   } catch (error) {
//     console.error("❌ Error in saveMessage:", error);
//     res.status(500).json({ message: "Internal server error", error });
//   }
// };

export const saveMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;
    const sender = req.user?.id;

    if (!req.user) {
      return res.status(401).json({ message: "🚫 Not authorized, no token" });
    }

    if (!receiver || !text?.trim()) {
      return res.status(400).json({ message: "❌ Receiver and message text are required" });
    }

    const message = new Message({ sender, receiver, text });
    await message.save();

    res.status(201).json({
      message: "✅ Message saved",
      data: message,
    });

    console.log({
      message: "✅ Message saved",
      data: message,
    });

  } catch (error) {
    console.error("❌ Error in saveMessage:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



export const getChatUsers = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    console.log("Logged-in User ID:", userId);
    console.log("User ID Type:", typeof req.user.id);

    const chatUsers = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"]
          }
        }
      },
      {
        $lookup: {
          from: "users", // ✅ Correct collection name
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email"
        }
      }
    ]);

    console.log("Chat Users Found:", chatUsers);
    res.status(200).json(chatUsers);
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

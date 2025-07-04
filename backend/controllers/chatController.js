
import Message from "../models/Message.js";
import mongoose from "mongoose";



export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: " User ID is required!" });
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

    // res.status(200).json(messages);

    

    //------updation for rating count---------
    res.status(200).json({ messages, totalMessages: messages.length });




  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};

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
    console.log("Fetching chat users for user:", req.user.id); // Debug log
    
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Debug: Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID:", req.user.id);
      return res.status(400).json({ message: "Invalid user ID" });
    }

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

    console.log("Found chat users:", chatUsers.length); // Debug log
    res.status(200).json(chatUsers);
    
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};



//------------update for chatUsers ordering showing-------------------------------------------


// export const getChatUsers = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized - User not found in request" });
//     }

//     const idString = req.user.id;
//     if (!mongoose.Types.ObjectId.isValid(idString)) {
//       console.error("Invalid user ID:", idString);
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     const userId = new mongoose.Types.ObjectId(idString);
//     console.log("Fetching chat users for user:", userId);

//     const chatUsers = await Message.aggregate([
//       {
//         $match: {
//           $or: [{ sender: userId }, { receiver: userId }]
//         }
//       },
//       { $sort: { createdAt: -1 } },
//       {
//         $group: {
//           _id: {
//             $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"]
//           },
//           lastMessage: { $first: "$$ROOT" },
//           lastMessageTime: { $max: "$createdAt" }
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "userDetails"
//         }
//       },
//       { $unwind: {
//         path: "$userDetails",
//         preserveNullAndEmptyArrays: true
//       }},
//       {
//         $project: {
//           _id: "$userDetails._id",
//           name: "$userDetails.name",
//           email: "$userDetails.email",
//           lastMessageTime: 1,
//           lastMessage: {
//             text: "$lastMessage.text",
//             createdAt: "$lastMessage.createdAt"
//           }
//         }
//       },
//       { $sort: { lastMessageTime: -1 } }
//     ]);

//     console.log("Found chat users:", chatUsers.length);
//     res.status(200).json(chatUsers);

//   } catch (error) {
//     console.error("Error fetching chat users:", error.message, error.stack);
//     res.status(500).json({ 
//       message: "Server error", 
//       error: error.message 
//     });
//     console.error("Aggregation failed:", aggError.message);
//     res.status(500).json({ message: "Aggregation failed", error: aggError.message });
//   }
// };

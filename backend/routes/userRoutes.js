

import express from 'express';
import { 
  getUserProfile, updateUserProfile, 
  getRecentSkills, getActivityFeed, getUserById 
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Profile Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Dashboard Routes
router.get('/recent-skills', getRecentSkills);
router.get('/profile/activity', protect, getActivityFeed);  // Renamed for clarity



router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Search Query:", query);
    
    if (!query) {
      console.log("No query provided.");
      return res.json([]);
    }
    
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { skills: { $elemMatch: { $regex: query, $options: "i" } } }, // ✅ Fixed
        { learning: { $elemMatch: { $regex: query, $options: "i" } } }, // ✅ Fixed
        { teaching: { $elemMatch: { $regex: query, $options: "i" } } } // ✅ Fixed
      ]
    });
    
    console.log("Users found:", users.length);
    res.json(users);
  } catch (error) {
    console.error("Search error:", error.message, error.stack);
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
});



router.get('/:userId', getUserById);  // New route for fetching a user by ID



export default router;



import User from '../models/User.js';
import Match from '../models/Match.js'; 

export const findMatchingUsers = async (req, res) => {
  try {
    console.log("Request Query:", req.query);
    let { skill } = req.query;
    const userId = req.user._id; // Get logged-in user's ID

    if (!skill) return res.status(400).json({ message: "Skill is required" });

    const skillArray = Array.isArray(skill) ? skill : skill.split(",").map(s => s.trim());

    console.log("Skill Array:", skillArray);

    // Find the logged-in user details
    const currentUser = await User.findById(userId).lean(); 
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Ensure teaching and learning fields are always arrays
    currentUser.teaching = currentUser.teaching || [];
    currentUser.learning = currentUser.learning || [];

    const { teaching, learning } = currentUser;


    const usersLearningFromMe = await User.find({ 
      learning: { $in: teaching }, 
      _id: { $ne: userId } // Exclude self
    }).select("_id name learning").lean();
    
    // Filter only the matched learning skills
    usersLearningFromMe.forEach(user => {
      user.matchedLearning = user.learning.filter(skill => teaching.includes(skill));
      delete user.learning; // Remove full learning array, keep only matched skills
    });
    

    // Find users whose teaching skills match my learning skills
    const lowerTeaching = teaching.map(skill => skill.toLowerCase());
    const lowerLearning = learning.map(skill => skill.toLowerCase());


    

    const usersTeachingMe = await User.find({ 
      teaching: { $in: lowerLearning.map(skill => new RegExp(`^${skill}$`, "i")) }, 
      _id: { $ne: userId } 
    }).select("_id name teaching").lean();
    
    // Filter only the matched skills
    usersTeachingMe.forEach(user => {
      user.matchedTeaching = user.teaching.filter(skill => lowerLearning.includes(skill.toLowerCase()));
      delete user.teaching; // Remove full teaching array, keep only matched skills
    });
    



    let matchRecords = [];

    usersLearningFromMe.forEach(learner => {
      const matchedSkills = teaching.filter(skill => learner.learning?.includes(skill));
      if (matchedSkills.length > 0) {
        matchRecords.push({
          user1: userId,
          user2: learner._id,
          skills: matchedSkills,
          matchType: "Teaching"
        });
      }
    });

    // Store Matches for Learning
    usersTeachingMe.forEach(teacher => {
      const matchedSkills = learning.filter(skill => teacher.teaching?.includes(skill));
      if (matchedSkills.length > 0) {
        matchRecords.push({
          user1: teacher._id,
          user2: userId,
          skills: matchedSkills,
          matchType: "Learning"
        });
      }
    });

    // Save matches to the database (avoid duplicates)
    for (const match of matchRecords) {
      const exists = await Match.findOne({
        user1: match.user1,
        user2: match.user2
      });

      if (!exists) {
        await Match.create(match);
      } else if (exists.skills.length === 0) {
        // If match exists but skills are empty, update it
        exists.skills = match.skills;
        await exists.save();
      }
    }

    res.json({ learningFromMe: usersLearningFromMe, teachingMe: usersTeachingMe });

  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Error fetching matches" });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name teachingSkills learningSkills");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send Match Request
export const sendMatchRequest = async (req, res) => {
  try {
    const { userId, partnerId, skills, matchType } = req.body;

    if (!userId || !partnerId || !skills || !matchType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a match already exists
    const existingMatch = await Match.findOne({ user1: userId, user2: partnerId });

    if (existingMatch) {
      return res.status(400).json({ message: "Match request already exists" });
    }

    // Create a new match request
    const newMatch = new Match({
      user1: userId,
      user2: partnerId,
      skills,
      matchType,
      status: "Pending",
    });

    await newMatch.save();

    res.json({ message: "Match request sent successfully", match: newMatch });
  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ message: "Error sending match request" });
  }
};

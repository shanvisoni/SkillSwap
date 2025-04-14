import User from '../models/User.js';

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('ratings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  console.log("User ID from token:", req.user._id); // Debugging
  try {
    const { name, bio, skills, teaching, learning ,availability,location} = req.body;
    console.log("Received Data:", req.body); // Debugging

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.teaching = teaching || user.teaching;
    user.learning = learning || user.learning;
    user.availability = availability || user.availability;
    user.location = location || user.location;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};


// ✅ Get User by ID (for dashboard or profile viewing)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password').populate('ratings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};




export const getRecentSkills = async (req, res) => {
  try {
    const users = await User.find({ skills: { $exists: true, $ne: [] } })
      .select("skills bio _id")
      .sort({ updatedAt: -1 })
      .limit(10);

    const skills = users.flatMap(user =>
      user.skills.map(skill => ({
        id: user._id,
        name: skill,
        description: user.bio,
        userId: user._id,
      }))
    );

    res.json(skills);
  } catch (error) {
    console.error("Recent Skills Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch skills", error: error.message });
  }
};

// ✅ Get User Activity Feed
export const getActivityFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("activityFeed");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.activityFeed || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity feed" });
  }
};

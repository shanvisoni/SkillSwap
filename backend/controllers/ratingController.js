
import Rating from '../models/Rating.js';
import Message from '../models/Message.js';

export const submitRating = async (req, res) => {
  const { toUser, stars, comment } = req.body;
  const fromUser = req.user._id;

  try {
    const existing = await Rating.findOne({ fromUser, toUser });
    if (existing) return res.status(400).json({ message: "You have already rated this user." });

    const rating = new Rating({ fromUser, toUser, stars, comment });
    await rating.save();

    res.status(201).json({ message: "Rating submitted!", rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkRatingStatus = async (req, res) => {
  const { to } = req.query; // the user being rated
  const from = req.user._id;

  try {
    const hasRated = await Rating.exists({ fromUser: from, toUser: to });
    const hasChatHistory = await Message.exists({
      $or: [
        { sender: from, receiver: to },
        { sender: to, receiver: from }
      ]
    });

    res.json({ hasRated, hasChatHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const ratings = await Rating.find({ toUser: userId });
    const average = ratings.reduce((sum, r) => sum + r.stars, 0) / (ratings.length || 1);
    res.json({ average: average.toFixed(1), count: ratings.length, ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

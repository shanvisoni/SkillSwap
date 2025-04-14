import Rating from '../models/Rating.js';
import { sendNotification } from '../utils/sendNotification.js';

export const submitRating = async (req, res) => {
  try {
    const { user, rating, review } = req.body;

    if (!user || !rating) {
      return res.status(400).json({ message: 'User ID and rating required' });
    }

    const newRating = await Rating.create({
      rater: req.user._id,
      user,
      rating,
      review,
    });

    // Send a notification to the rated user
    sendNotification(user, `You have received a new rating of ${rating} stars!`);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Rating submission failed' });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await Rating.find({ user: userId }).populate('rater', 'name');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

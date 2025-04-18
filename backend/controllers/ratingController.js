import Rating from '../models/Rating.js';

export const giveRating = async (req, res) => {
  const { fromUser, toUser, rating } = req.body;
  try {
    const existing = await Rating.findOne({ fromUser, toUser });
    if (existing) return res.status(400).json({ message: 'You have already rated this user.' });

    const newRating = new Rating({ fromUser, toUser, rating });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserAverageRating = async (req, res) => {
  const { userId } = req.params;
  try {
    const ratings = await Rating.find({ toUser: userId });
    if (ratings.length === 0) return res.json({ avgRating: 0 });

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / ratings.length;
    res.json({ avgRating: avg.toFixed(1), total: ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkIfRated = async (req, res) => {
  const { fromUser, toUser } = req.query;
  try {
    const rating = await Rating.findOne({ fromUser, toUser });
    res.json({ alreadyRated: !!rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

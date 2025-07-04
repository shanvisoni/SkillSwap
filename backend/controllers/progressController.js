import Progress from '../models/Progress.js';
import { sendNotification } from '../utils/sendNotification.js'; 
import { formatDate } from '../utils/formatDate.js'; 

export const updateProgress = async (req, res) => {
  try {
    const { skill, progressLevel } = req.body;

    if (!skill || progressLevel === undefined) return res.status(400).json({ message: 'Skill and progress required' });

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, skill },
      { progressLevel },
      { new: true, upsert: true }
    );

    sendNotification(req.user._id, `Your progress in ${skill} has been updated to ${progressLevel}%`);

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    const formattedProgress = progress.map((p) => ({
      ...p.toObject(),
      createdAt: formatDate(p.createdAt),
    }));

    res.json(formattedProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
};

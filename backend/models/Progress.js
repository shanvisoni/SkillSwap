import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skill: { type: String, required: true },
  progressLevel: { type: Number, min: 0, max: 100, default: 0 }, // Progress percentage
  milestones: [{ description: String, achieved: Boolean }]
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);

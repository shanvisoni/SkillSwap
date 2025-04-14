import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user being rated
  rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user giving the rating
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model('Rating', ratingSchema);

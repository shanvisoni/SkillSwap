import mongoose from 'mongoose';
const matchSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [{ type: String, required: true }],  // Array of matched skills
  matchType: { type: String, enum: ["Teaching", "Learning", "Mutual"], required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Match", matchSchema);

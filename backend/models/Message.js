
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

export default mongoose.model('Message', messageSchema);

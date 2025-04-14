import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  bio: { type: String, default: "" },

  // Skills and Interests
  skills: [{ type: String, required: false }], 
  teaching: [{ type: String, default: [] }], 
  learning: [{ type: String, default: [] }], 

  availability: { type: String, default: 'Flexible' },

  // Simple Location Field
  location: { type: String, default: "" }, // e.g., "New York, USA"

  // Ratings (Referenced)
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  

}, { timestamps: true });

export default mongoose.model('User', userSchema);

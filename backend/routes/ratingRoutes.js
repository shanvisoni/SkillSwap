import express from 'express';
import { submitRating, checkRatingStatus, getUserRatings } from '../controllers/ratingController.js';
import protect from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, submitRating);
router.get('/check', protect, checkRatingStatus);
router.get('/:userId', getUserRatings); // Fetch ratings for a user

export default router;
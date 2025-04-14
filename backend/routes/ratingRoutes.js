import express from 'express';
import { submitRating, getUserRatings } from '../controllers/ratingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/rate', protect, submitRating);
router.get('/:userId', getUserRatings);

export default router;

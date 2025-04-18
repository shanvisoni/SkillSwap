import express from 'express';
import { giveRating, getUserAverageRating, checkIfRated } from '../controllers/ratingController.js';

const router = express.Router();

router.post('/rate', giveRating);
router.get('/average/:userId', getUserAverageRating);
router.get('/check', checkIfRated);

export default router;

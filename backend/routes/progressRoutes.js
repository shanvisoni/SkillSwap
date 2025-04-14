import express from 'express';
import { updateProgress, getUserProgress } from '../controllers/progressController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/update', protect, updateProgress);
router.get('/', protect, getUserProgress);

export default router;

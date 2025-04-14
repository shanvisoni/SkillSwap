import express from 'express';
import { findMatchingUsers, getMatchById, sendMatchRequest } from '../controllers/matchController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/find', protect, findMatchingUsers); 
router.get('/:id', protect, getMatchById); 
router.post('/request', protect, sendMatchRequest); 

export default router;

import express from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

// ✅ Route → controller
router.post('/api/chat', chatController);

export default router;

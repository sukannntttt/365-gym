import { Router } from 'express';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get user profile
router.get('/profile', authenticate, getUserProfile);

// Update user profile
router.put('/profile', authenticate, updateUserProfile);

// Delete user account
router.delete('/account', authenticate, deleteUserAccount);

export default router;
import express from 'express';
import { createUser, getUser, updateUser, deleteUser, loginUser, logoutUser, getCurrentUser, getUserByEmail, getUserByUsername, verifyEmail, forgotPassword, resetPassword } from '../controllers/user.js';
import { authenticate } from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post('/create', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Protected routes (authentication required)
userRouter.get('/me', authenticate, getCurrentUser);
userRouter.get('/email/:email', authenticate, getUserByEmail);
userRouter.get('/username/:username', authenticate, getUserByUsername);
userRouter.get('/:id', authenticate, getUser);
userRouter.put('/:id', authenticate, updateUser);
userRouter.delete('/:id', authenticate, deleteUser);

export default userRouter;
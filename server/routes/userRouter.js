import express from 'express';
import { createUser, getUser, updateUser, deleteUser, loginUser, getUserByEmail, getUserByUsername, verifyEmail, forgotPassword, resetPassword } from '../controllers/user.js';

const userRouter = express.Router();
userRouter.post('/create', createUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/login', loginUser);

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);


userRouter.get('/email/:email', getUserByEmail);
userRouter.get('/username/:username', getUserByUsername);
userRouter.get('/:id', getUser);


userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);



export default userRouter;
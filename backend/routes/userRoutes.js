import express from 'express';
import { getUserData, updateCreditBalance } from '../controllers/userController.js';
import userAuth from '../middlewares/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.patch('/updateCreditBalance', userAuth, updateCreditBalance);

export default userRouter
import express from 'express'
import { createOrder, verifyOrder } from '../controllers/paymentController.js';
import userAuth from '../middlewares/userAuth.js'

const paymentRouter = express.Router();

paymentRouter.post('/create-order',userAuth, createOrder);
paymentRouter.post('/verify-order',userAuth, verifyOrder);


export default paymentRouter
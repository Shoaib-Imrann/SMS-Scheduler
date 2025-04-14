import express from 'express'
import {  sendEmailOtp, verifyEmailOtp, checkLoginEmail, login, isAuthenticated } from '../controllers/emailController.js';
import userAuth from '../middlewares/userAuth.js'

const emailRouter = express.Router();

emailRouter.post('/check-email', checkLoginEmail);
emailRouter.post('/login', login);
emailRouter.post('/send-email-otp', sendEmailOtp);
emailRouter.post('/verify-email-otp', verifyEmailOtp);
emailRouter.get('/is-auth',userAuth, isAuthenticated);

export default emailRouter
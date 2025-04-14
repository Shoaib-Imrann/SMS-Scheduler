import express from 'express'
import { register, getShoppersByGroup } from '../controllers/shopperController.js';
import userAuth from '../middlewares/userAuth.js';

const shopperRouter = express.Router();

shopperRouter.post('/register',userAuth, register);
shopperRouter.get('/getShoppersGroup',userAuth, getShoppersByGroup);


export default shopperRouter
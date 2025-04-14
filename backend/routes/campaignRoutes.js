import express from 'express'
import {  createCampaign, fetchCampaign } from '../controllers/campaignController.js';
import userAuth from '../middlewares/userAuth.js'

const campaignRouter = express.Router();

campaignRouter.post('/launch',userAuth, createCampaign);
campaignRouter.get('/getCampaigns',userAuth, fetchCampaign);


export default campaignRouter
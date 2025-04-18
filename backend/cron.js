// cron.js
import mongoose from 'mongoose';
import { sendScheduledCampaigns } from './utils/scheduler.js';
import dotenv from 'dotenv';
dotenv.config();


const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected for CRON");

    await sendScheduledCampaigns();

    console.log("Campaigns processed. Exiting now.");
    process.exit();
  } catch (err) {
    console.error("Error in cron:", err);
    process.exit(1);
  }
};

run();

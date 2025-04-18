// cron.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { sendScheduledCampaigns } from './utils/scheduler.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

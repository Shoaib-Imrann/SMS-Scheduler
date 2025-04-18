import cron from "node-cron";
import campaignModel from "../models/campaignModel";  // Adjust path based on your structure
import shopperModel from "../models/shopperModel";    // Adjust path based on your structure
import client from "twilio"; // Twilio client
import merchantModel from "../models/merchantModel"; // Adjust path based on your structure

const sendMessages = async (campaign, phoneNumbers, message) => {
  for (const phone of phoneNumbers) {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }

  // Update campaign status to sent
  await campaignModel.findByIdAndUpdate(campaign._id, { status: "sent" });

  // Update merchant's stats
  await merchantModel.findByIdAndUpdate(campaign.merchantId, {
    $inc: {
      campaigns: 1,
      messagesSent: phoneNumbers.length,
    },
  });
};

// This function will be called by cron job to process all due campaigns
export const handleScheduledCampaigns = async () => {
  const now = new Date();
  
  try {
    // Find campaigns that are scheduled and due to be sent
    const campaigns = await campaignModel.find({
      status: "scheduled",
      scheduleTime: { $lte: now },
    });

    // Process each campaign
    for (const campaign of campaigns) {
      const { merchantId, message, group } = campaign;

      let query = { merchantId };

      if (group === "last7days") {
        query.lastTransactionDate = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
      } else if (group === "last30days") {
        query.lastTransactionDate = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
      }

      const shoppers = await shopperModel.find(query);
      const phoneNumbers = shoppers.map((s) => s.phoneNumber);

      await sendMessages(campaign, phoneNumbers, message);
    }
  } catch (err) {
    console.error("💣 Cron Job Error:", err);
  }
};

// Set up a cron job that runs every 5 minutes to handle scheduled campaigns
cron.schedule("*/5 * * * *", handleScheduledCampaigns, {
  timezone: "UTC", // Adjust to your timezone if needed
});

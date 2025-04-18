// utils/scheduler.js
import campaignModel from "../models/campaignModel.js";
import merchantModel from "../models/merchantModel.js";
import shopperModel from "../models/shopperModel.js";
import { client } from "../config/twilio.js"; // adjust path if needed

export const sendScheduledCampaigns = async () => {
  const now = new Date();

  const campaigns = await campaignModel.find({
    status: "scheduled",
    scheduleTime: { $lte: now }
  });

  for (const campaign of campaigns) {
    const shoppers = await shopperModel.find({ merchantId: campaign.merchantId });
    const phoneNumbers = shoppers.map((shopper) => shopper.phoneNumber);

    for (const phone of phoneNumbers) {
      await client.messages.create({
        body: campaign.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
    }

    await campaignModel.findByIdAndUpdate(campaign._id, { status: "sent" });

    await merchantModel.findByIdAndUpdate(campaign.merchantId, {
      $inc: {
        campaigns: 1,
        messagesSent: phoneNumbers.length,
      },
    });

    console.log(`Campaign "${campaign.name}" sent to ${phoneNumbers.length} recipients.`);
  }
};

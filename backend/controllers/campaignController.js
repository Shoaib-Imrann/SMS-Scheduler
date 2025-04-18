import cron from "node-cron";
import shopperModel from "../models/shopperModel.js";
import campaignModel from "../models/campaignModel.js";
import merchantModel from "../models/merchantModel.js";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const createCampaign = async (req, res) => {
  const { name, message, scheduleTime, group } = req.body;
  const merchantId = req.userId;
  if (!merchantId) {
    return res.status(400).json({ error: "Merchant ID missing" });
  }

  const now = new Date();
  const scheduledDate = new Date(scheduleTime); // parse direct

  // Build shopper query
  let query = { merchantId };
  if (group === "last7days") {
    query.lastTransactionDate = { $gte: new Date(now - 7*24*60*60*1000) };
  } else if (group === "last30days") {
    query.lastTransactionDate = { $gte: new Date(now - 30*24*60*60*1000) };
  }

  try {
    // Get recipients
    const shoppers = await shopperModel.find(query);
    const phoneNumbers = shoppers.map(s => s.phoneNumber);

    // Create campaign record
    const campaign = await campaignModel.create({
      merchantId,
      name,
      message,
      scheduleTime: scheduledDate,
      group,
      totalRecipients: phoneNumbers.length,
      totalCost: phoneNumbers.length * 7.5,
      status: "scheduled" // always start scheduled
    });

    // Function to send & update
    const sendMessages = async () => {
      for (const to of phoneNumbers) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to
        });
      }
      await campaignModel.findByIdAndUpdate(campaign._id, { status: "sent" });
      await merchantModel.findByIdAndUpdate(merchantId, {
        $inc: { campaigns: 1, messagesSent: phoneNumbers.length }
      });
    };

    // Decide immediate vs scheduled
    if (scheduledDate <= now) {
      // IMMEDIATE
      await sendMessages();
    } else {
      // SCHEDULED (UTC)
      const cronTime = [
        scheduledDate.getUTCMinutes(),
        scheduledDate.getUTCHours(),
        scheduledDate.getUTCDate(),
        scheduledDate.getUTCMonth() + 1,
        "*"
      ].join(" ");

      // cron.schedule(cronTime, sendMessages, { timezone: "UTC" });
    }

    return res.status(201).json({ message: "Campaign scheduled successfully." });
  } catch (err) {
    console.error("❌ Error launching campaign:", err);
    return res.status(500).json({ error: "Failed to create campaign" });
  }
};



export const fetchCampaign = async (req, res) => {
  const merchantId = req.userId;

  if (!merchantId) {
    return res.status(400).json({ error: "Merchant ID not found in token" });
  }

  try {
    const campaigns = await campaignModel
      .find({ merchantId })
      .sort({ createdAt: -1 }); // Show latest first

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res
      .status(500)
      .json({ error: "Something went wrong fetching your campaigns" });
  }
};

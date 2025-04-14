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
  const scheduledDate = new Date(scheduleTime);

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

  try {
    const shoppers = await shopperModel.find(query);
    const phoneNumbers = shoppers.map((shopper) => shopper.phoneNumber);
    const totalRecipients = phoneNumbers.length;
    const totalCost = totalRecipients * 7.5;

    const campaign = new campaignModel({
      merchantId,
      name,
      message,
      scheduleTime: scheduledDate,
      group,
      totalRecipients,
      totalCost,
      status: scheduledDate > now ? "scheduled" : "sent",
    });

    await campaign.save();

    const sendMessages = async () => {
      for (const phone of phoneNumbers) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
      }

      // Update campaign status to sent
      await campaignModel.findByIdAndUpdate(campaign._id, { status: "sent" });
      //   console.log(`Campaign "${name}" executed and marked as sent`);
      await merchantModel.findByIdAndUpdate(merchantId, {
        $inc: {
          campaigns: 1,
          messagesSent: phoneNumbers.length,
        },
      });
    };

    // Schedule if time is in future, else send now
    if (scheduledDate > now) {
      const cronTime = `${scheduledDate.getUTCMinutes()} ${scheduledDate.getUTCHours()} ${scheduledDate.getUTCDate()} ${
        scheduledDate.getUTCMonth() + 1
      } *`;

      cron.schedule(cronTime, sendMessages, {
        timezone: "UTC", // or adjust to local like 'Asia/Kolkata'
      });

      //   console.log(`📅 Campaign "${name}" scheduled for ${scheduledDate.toISOString()}`);
    } else {
      await sendMessages();
    }

    res.status(201).json({ message: "Campaign scheduled successfully." });
  } catch (err) {
    console.error("❌ Error launching campaign:", err);
    res.status(500).json({ error: "Failed to create campaign" });
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

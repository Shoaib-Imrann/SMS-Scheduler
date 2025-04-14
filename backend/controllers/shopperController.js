// shopperController.js
import shopperModel from "../models/shopperModel.js";
import merchantModel from "../models/merchantModel.js";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const merchantId = req.userId;
    const { name, phoneNumber, lastTransactionDate, totalSpent } = req.body;

    let existingShopper = await shopperModel.findOne({ phoneNumber });
    if (existingShopper) {
      return res.status(400).json({
        success: false,
        message: "This shopper already exists",
      });
    }

    const newShopper = new shopperModel({
      merchantId,
      name,
      phoneNumber,
      lastTransactionDate,
      totalSpent,
    });

    await newShopper.save();

    await merchantModel.findByIdAndUpdate(merchantId, {
      $inc: { shoppers: 1 },
    });

    return res.status(201).json({
      success: true,
      data: newShopper,
      message: "Shopper created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong: " + err.message,
    });
  }
};

export const getShoppersByGroup = async (req, res) => {
  const { group } = req.query;
  const merchantId = req.userId;

  if (!merchantId) {
    return res.status(400).json({ error: "Merchant ID not found in token" });
  }

  let query = { merchantId };
  const now = new Date();

  console.log("Group received:", group);

  if (group === "last7days") {
    query.lastTransactionDate = {
      $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    };
  } else if (group === "last30days") {
    query.lastTransactionDate = {
      $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };
  } else if (group === "all") {
    // No filters
  } else if (group === "custom") {
    // Custom filter logic
  }

  try {
    const shoppers = await shopperModel.find(query);
    res.json(shoppers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching shoppers" });
  }
};

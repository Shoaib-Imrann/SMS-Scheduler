// models/Campaign.js
import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  scheduleTime: {
    type: Date,
    required: true,
  },
  group: {
    type: String,
    enum: ['all', 'last7days', 'last30days', 'custom'],
    required: true,
  },
  totalRecipients: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'failed'],
    default: 'scheduled',
  },
}, { timestamps: true });

const campaignModel  = mongoose.models.campaign || mongoose.model("Campaign",CampaignSchema);
export default campaignModel;

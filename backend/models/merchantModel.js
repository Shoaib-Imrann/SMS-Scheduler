import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    required: true,
    default: 37.5,
  },
  campaigns: {
    type: Number,
    default: 0,
  },
  shoppers: {
    type: Number,
    default: 0,
  },
  messagesSent: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const merchantModel  = mongoose.models.merchant || mongoose.model("merchant", merchantSchema);
export default merchantModel;

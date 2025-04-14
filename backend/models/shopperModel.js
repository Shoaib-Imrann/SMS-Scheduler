import mongoose from 'mongoose';

const shopperSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  lastTransactionDate: {
    type: Date,
  },
  totalSpent: {
    type: Number,
    default: 0.0,
  },
}, { timestamps: true });

const shopperModel  = mongoose.models.shopper || mongoose.model("shopper",shopperSchema);
export default shopperModel;

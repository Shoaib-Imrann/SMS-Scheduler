import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    amount: {
      type: Number, // Stored in rupees, not paise
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true, 
  }
);

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;

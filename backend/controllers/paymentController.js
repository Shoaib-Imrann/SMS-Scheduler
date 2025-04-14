import Razorpay from "razorpay";
import crypto from "crypto";
import merchantModel from "../models/merchantModel.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Set your env variables
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Math.random().toString(36).substr(2, 9)}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;
    const userId = req.userId;

    // console.log("🔐 Razorpay Details:", razorpay_order_id, razorpay_payment_id, razorpay_signature);
    // console.log("👤 userId:", userId);

    if (!process.env.RAZORPAY_KEY_SECRET) {
      //   console.error("❌ RAZORPAY_KEY_SECRET is missing");
      return res
        .status(500)
        .json({ status: "failure", message: "Razorpay secret not configured" });
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // console.log("💰 Amount received in body:", amount);
      const addedCredits = amount ? amount / 100 : 0;

      if (!userId) {
        console.error("❌ No user ID found");
        return res
          .status(401)
          .json({ status: "failure", message: "Unauthorized user" });
      }

      // 🔥 No callback, only async/await
      const updatedUser = await merchantModel.findByIdAndUpdate(
        userId,
        { $inc: { creditBalance: addedCredits } },
        { new: true }
      );

      //   console.log('✅ Update successful:', updatedUser);
      return res.status(200).json({
        status: "success",
        message: "Payment verified and credit balance updated",
        user: updatedUser,
      });
    } else {
      console.warn("⚠️ Signature mismatch");
      return res
        .status(400)
        .json({ status: "failure", message: "Invalid signature" });
    }
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

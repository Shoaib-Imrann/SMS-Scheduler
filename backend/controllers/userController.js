import merchantModel from "../models/merchantModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await merchantModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
        campaigns: user.campaigns,
        messagesSent: user.messagesSent,
        shoppers: user.shoppers,
      },
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data" });
  }
};

export const updateCreditBalance = async (req, res) => {
  const { amount } = req.body;
  const merchantId = req.userId; // Assuming userId is the merchantId

  if (!merchantId) {
    return res.status(400).json({ error: "Merchant ID is missing" });
  }

  try {
    // Fetch the merchant from the database using the merchantId
    const merchant = await merchantModel.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({ error: "Merchant not found" });
    }

    if (merchant.creditBalance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Reduce the credit balance
    merchant.creditBalance -= amount;

    await merchant.save();

    res
      .status(200)
      .json({
        message: "Credit balance updated successfully",
        creditBalance: merchant.creditBalance,
      });
  } catch (err) {
    console.error("❌ Error updating credit balance:", err);
    res.status(500).json({ error: "Failed to update credit balance" });
  }
};

import dotenv from 'dotenv';
import twilio from 'twilio';
import campaignModel from '../models/campaignModel.js';
import shopperModel from '../models/shopperModel.js';
import merchantModel from '../models/merchantModel.js';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendScheduledCampaigns = async () => {
  const nowUtc = new Date();
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(nowUtc.getTime() + IST_OFFSET_MS);

//   console.log("⏰ Now (IST):", nowIst.toISOString());

  const campaigns = await campaignModel.find({
    status: 'scheduled',
    scheduleTime: { $lte: nowIst },
  });

//   console.log(`📊 Found ${campaigns.length} campaign(s)`);

  for (const c of campaigns) {
    // console.log(`🕒 Scheduled time: ${c.scheduleTime.toISOString()}`);
    // console.log(`🕓 Now (UTC): ${nowUtc.toISOString()}`);
    // console.log(`— Sending "${c.name}" scheduled @ ${c.scheduleTime.toISOString()}`);

    // Dynamically build group query based on campaign group
    let query = { merchantId: c.merchantId };
    const now = new Date();

    if (c.group === 'last7days') {
      query.lastTransactionDate = {
        $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      };
    } else if (c.group === 'last30days') {
      query.lastTransactionDate = {
        $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const shoppers = await shopperModel.find(query);
    const numbers = shoppers.map(s => s.phoneNumber);

    // console.log(`📞 Sending to ${numbers.length} recipients`);
    // shoppers.forEach(s =>
    //   console.log(`   ➤ ${s.phoneNumber} - Last TX: ${s.lastTransactionDate?.toISOString()}`)
    // );

    for (const to of numbers) {
      try {
        const msg = await client.messages.create({
          body: c.message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to,
        });
        // console.log(`   ✅ Sent to ${to}, SID ${msg.sid}`);
      } catch (err) {
        console.error(`   ❌ Failed to send to ${to}:`, err.message);
      }
    }

    // Update campaign status and merchant stats
    await campaignModel.findByIdAndUpdate(c._id, { status: 'sent' });
    await merchantModel.findByIdAndUpdate(c.merchantId, {
      $inc: { campaigns: 1, messagesSent: numbers.length },
    });
  }
};

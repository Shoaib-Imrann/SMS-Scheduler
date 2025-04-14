// backend/config/twilioConfig.js
import 'dotenv/config';

export const accountSid = process.env.TWILIO_ACCOUNT_SID;
export const authToken = process.env.TWILIO_AUTH_TOKEN;
export const serviceSid = process.env.TWILIO_SERVICE_SID;
export const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// smsService.js
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log("SMS Sent:", result.sid);
    return result;
  } catch (err) {
    console.error("SMS Error:", err);
    throw err;
  }
};

module.exports = sendSMS;

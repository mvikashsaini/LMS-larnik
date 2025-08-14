const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number
 * @param {string} message - Message content
 * @returns {Promise<Object>} Twilio message object
 */
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log(`SMS sent successfully to ${to}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error('Failed to send SMS');
  }
};

/**
 * Send OTP via SMS
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Twilio message object
 */
const sendOTP = async (phone, otp) => {
  const message = `Your Larnik verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
  return await sendSMS(phone, message);
};

/**
 * Send welcome SMS
 * @param {string} phone - Phone number
 * @param {string} name - User name
 * @returns {Promise<Object>} Twilio message object
 */
const sendWelcomeSMS = async (phone, name) => {
  const message = `Welcome to Larnik, ${name}! Thank you for joining our learning platform. Start your learning journey today!`;
  return await sendSMS(phone, message);
};

/**
 * Send enrollment confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} courseTitle - Course title
 * @returns {Promise<Object>} Twilio message object
 */
const sendEnrollmentConfirmationSMS = async (phone, courseTitle) => {
  const message = `Congratulations! You have successfully enrolled in "${courseTitle}". Check your email for course access details.`;
  return await sendSMS(phone, message);
};

/**
 * Send payment confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} amount - Payment amount
 * @param {string} courseTitle - Course title
 * @returns {Promise<Object>} Twilio message object
 */
const sendPaymentConfirmationSMS = async (phone, amount, courseTitle) => {
  const message = `Payment of ₹${amount} for "${courseTitle}" has been confirmed. You can now access your course.`;
  return await sendSMS(phone, message);
};

/**
 * Send certificate notification SMS
 * @param {string} phone - Phone number
 * @param {string} courseTitle - Course title
 * @returns {Promise<Object>} Twilio message object
 */
const sendCertificateNotificationSMS = async (phone, courseTitle) => {
  const message = `Congratulations! You have completed "${courseTitle}" and earned your certificate. Download it from your dashboard.`;
  return await sendSMS(phone, message);
};

/**
 * Send settlement notification SMS
 * @param {string} phone - Phone number
 * @param {string} amount - Settlement amount
 * @returns {Promise<Object>} Twilio message object
 */
const sendSettlementNotificationSMS = async (phone, amount) => {
  const message = `Your settlement request of ₹${amount} has been processed and will be credited to your account within 2-3 business days.`;
  return await sendSMS(phone, message);
};

/**
 * Send password reset SMS
 * @param {string} phone - Phone number
 * @param {string} resetCode - Reset code
 * @returns {Promise<Object>} Twilio message object
 */
const sendPasswordResetSMS = async (phone, resetCode) => {
  const message = `Your password reset code is: ${resetCode}. Valid for 10 minutes. Do not share this code with anyone.`;
  return await sendSMS(phone, message);
};

/**
 * Send bulk SMS
 * @param {Array<string>} phoneNumbers - Array of phone numbers
 * @param {string} message - Message content
 * @returns {Promise<Array>} Array of Twilio message objects
 */
const sendBulkSMS = async (phoneNumbers, message) => {
  const promises = phoneNumbers.map(phone => sendSMS(phone, message));
  return await Promise.allSettled(promises);
};

/**
 * Verify phone number
 * @param {string} phone - Phone number to verify
 * @returns {Promise<Object>} Verification result
 */
const verifyPhoneNumber = async (phone) => {
  try {
    const result = await client.lookups.v1.phoneNumbers(phone).fetch({
      type: ['carrier', 'caller-name']
    });
    
    return {
      valid: true,
      carrier: result.carrier,
      countryCode: result.countryCode,
      nationalFormat: result.nationalFormat
    };
  } catch (error) {
    console.error('Phone verification error:', error);
    return {
      valid: false,
      error: error.message
    };
  }
};

/**
 * Get SMS delivery status
 * @param {string} messageSid - Twilio message SID
 * @returns {Promise<Object>} Message status
 */
const getSMSStatus = async (messageSid) => {
  try {
    const message = await client.messages(messageSid).fetch();
    return {
      sid: message.sid,
      status: message.status,
      direction: message.direction,
      from: message.from,
      to: message.to,
      body: message.body,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    };
  } catch (error) {
    console.error('SMS status check error:', error);
    throw new Error('Failed to get SMS status');
  }
};

/**
 * Get SMS history
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of SMS messages
 */
const getSMSHistory = async (filters = {}) => {
  try {
    const messages = await client.messages.list({
      limit: filters.limit || 50,
      dateSent: filters.dateSent,
      from: filters.from,
      to: filters.to
    });
    
    return messages.map(message => ({
      sid: message.sid,
      status: message.status,
      direction: message.direction,
      from: message.from,
      to: message.to,
      body: message.body,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      price: message.price,
      priceUnit: message.priceUnit
    }));
  } catch (error) {
    console.error('SMS history error:', error);
    throw new Error('Failed to get SMS history');
  }
};

module.exports = {
  sendSMS,
  sendOTP,
  sendWelcomeSMS,
  sendEnrollmentConfirmationSMS,
  sendPaymentConfirmationSMS,
  sendCertificateNotificationSMS,
  sendSettlementNotificationSMS,
  sendPasswordResetSMS,
  sendBulkSMS,
  verifyPhoneNumber,
  getSMSStatus,
  getSMSHistory
};

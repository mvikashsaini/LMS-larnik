const Razorpay = require('razorpay');

const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET
};

const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret
});

const createOrder = async (options) => {
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
};

const verifyPaymentSignature = (paymentId, signature, body = null) => {
  try {
    const crypto = require('crypto');
    const secret = razorpayConfig.key_secret;
    
    let expectedSignature;
    if (body) {
      // For webhook verification
      const text = JSON.stringify(body);
      expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex');
    } else {
      // For payment verification
      const text = paymentId + '|' + body;
      expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(text)
        .digest('hex');
    }
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

const capturePayment = async (paymentId, amount) => {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount);
    return payment;
  } catch (error) {
    console.error('Payment capture error:', error);
    throw new Error('Failed to capture payment');
  }
};

const processRefund = async (paymentId, amount) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount
    });
    return refund;
  } catch (error) {
    console.error('Refund processing error:', error);
    throw new Error('Failed to process refund');
  }
};

const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Payment fetch error:', error);
    throw new Error('Failed to fetch payment details');
  }
};

const getRefundDetails = async (refundId) => {
  try {
    const refund = await razorpay.payments.fetchRefund(refundId);
    return refund;
  } catch (error) {
    console.error('Refund fetch error:', error);
    throw new Error('Failed to fetch refund details');
  }
};

const createPaymentLink = async (options) => {
  try {
    const paymentLink = await razorpay.paymentLink.create(options);
    return paymentLink;
  } catch (error) {
    console.error('Payment link creation error:', error);
    throw new Error('Failed to create payment link');
  }
};

module.exports = {
  razorpayConfig,
  razorpay,
  createOrder,
  verifyPaymentSignature,
  capturePayment,
  processRefund,
  getPaymentDetails,
  getRefundDetails,
  createPaymentLink
};

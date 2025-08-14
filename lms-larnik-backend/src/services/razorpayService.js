const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create order
  async createOrder(amount, currency = 'INR', receipt = null) {
    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Capture payment
  async capturePayment(paymentId, amount) {
    try {
      const payment = await this.razorpay.payments.capture(
        paymentId,
        amount * 100, // Convert to paise
        'INR'
      );

      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('Get payment details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process refund
  async processRefund(paymentId, amount, reason = 'Refund') {
    try {
      const refund = await this.razorpay.payments.refund(
        paymentId,
        {
          amount: amount * 100, // Convert to paise
          speed: 'normal',
          notes: {
            reason: reason
          }
        }
      );

      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get refund details
  async getRefundDetails(refundId) {
    try {
      const refund = await this.razorpay.payments.fetchRefund(refundId);
      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Get refund details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create payment link
  async createPaymentLink(amount, description, callbackUrl, callbackMethod = 'get') {
    try {
      const paymentLink = await this.razorpay.paymentLink.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        description: description,
        callback_url: callbackUrl,
        callback_method: callbackMethod
      });

      return {
        success: true,
        paymentLink: paymentLink
      };
    } catch (error) {
      console.error('Payment link creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(body, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  // Get settlement details
  async getSettlementDetails(settlementId) {
    try {
      const settlement = await this.razorpay.settlements.fetch(settlementId);
      return {
        success: true,
        settlement: settlement
      };
    } catch (error) {
      console.error('Get settlement details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all settlements
  async getSettlements(options = {}) {
    try {
      const settlements = await this.razorpay.settlements.all(options);
      return {
        success: true,
        settlements: settlements
      };
    } catch (error) {
      console.error('Get settlements error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create virtual account
  async createVirtualAccount(customerId, description) {
    try {
      const virtualAccount = await this.razorpay.virtualAccounts.create({
        customer_id: customerId,
        description: description,
        close_by: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
        notes: {
          description: description
        }
      });

      return {
        success: true,
        virtualAccount: virtualAccount
      };
    } catch (error) {
      console.error('Virtual account creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get virtual account details
  async getVirtualAccountDetails(virtualAccountId) {
    try {
      const virtualAccount = await this.razorpay.virtualAccounts.fetch(virtualAccountId);
      return {
        success: true,
        virtualAccount: virtualAccount
      };
    } catch (error) {
      console.error('Get virtual account details error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Close virtual account
  async closeVirtualAccount(virtualAccountId) {
    try {
      const virtualAccount = await this.razorpay.virtualAccounts.close(virtualAccountId);
      return {
        success: true,
        virtualAccount: virtualAccount
      };
    } catch (error) {
      console.error('Close virtual account error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new RazorpayService();

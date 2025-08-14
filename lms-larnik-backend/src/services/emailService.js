const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send OTP email
  async sendOTP(email, otp, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your Larnik LMS OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Larnik LMS - OTP Verification</h2>
          <p>Hello ${name},</p>
          <p>Your OTP for Larnik LMS login is:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #3B82F6; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated email from Larnik LMS. Please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Larnik LMS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Welcome to Larnik LMS!</h2>
          <p>Hello ${name},</p>
          <p>Welcome to Larnik LMS! We're excited to have you on board.</p>
          <p>Start your learning journey by exploring our courses:</p>
          <ul>
            <li>Browse courses by category</li>
            <li>Learn at your own pace</li>
            <li>Earn certificates upon completion</li>
            <li>Track your progress</li>
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Happy learning!</p>
          <p>Best regards,<br>The Larnik LMS Team</p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send course enrollment confirmation
  async sendEnrollmentConfirmation(email, name, courseTitle) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Course Enrollment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Course Enrollment Confirmation</h2>
          <p>Hello ${name},</p>
          <p>You have successfully enrolled in the course: <strong>${courseTitle}</strong></p>
          <p>You can now access your course content and start learning!</p>
          <p>Happy learning!</p>
          <p>Best regards,<br>The Larnik LMS Team</p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send certificate notification
  async sendCertificateNotification(email, name, courseTitle, certificateUrl) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Certificate Ready for Download',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Certificate Ready!</h2>
          <p>Hello ${name},</p>
          <p>Congratulations! You have successfully completed the course: <strong>${courseTitle}</strong></p>
          <p>Your certificate is ready for download. Click the link below to download your certificate:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${certificateUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Download Certificate</a>
          </div>
          <p>Keep learning and growing!</p>
          <p>Best regards,<br>The Larnik LMS Team</p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send payment confirmation
  async sendPaymentConfirmation(email, name, courseTitle, amount) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Payment Confirmation</h2>
          <p>Hello ${name},</p>
          <p>Your payment of ₹${amount} for the course <strong>${courseTitle}</strong> has been successfully processed.</p>
          <p>You can now access your course content immediately.</p>
          <p>Thank you for choosing Larnik LMS!</p>
          <p>Best regards,<br>The Larnik LMS Team</p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send password reset email
  async sendPasswordReset(email, name, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>You have requested to reset your password. Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
          </div>
          <p>This link is valid for 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The Larnik LMS Team</p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send bulk notification
  async sendBulkNotification(emails, subject, message) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: emails.join(','),
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Larnik LMS Notification</h2>
          <div>${message}</div>
          <hr>
          <p style="color: #6B7280; font-size: 12px;">
            This is an automated email from Larnik LMS.
          </p>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();

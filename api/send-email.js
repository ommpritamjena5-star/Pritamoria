const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (req, res) => {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // 1. Verify EMAIL_API_SECRET to authenticate Render's request
  const authHeader = req.headers.authorization;
  const expectedSecret = process.env.EMAIL_API_SECRET;
  
  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { type, email, name, otp } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Recipient email is required' });
  }

  // Define email subjects and templates
  let subject = '';
  let html = '';
  let themeColor = '#22c55e'; // Green default

  if (type === 'welcome') {
    subject = 'Welcome to Pritamoria! 🌿';
    themeColor = '#22c55e';
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
        <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
        <h2 style="color: #4ade80;">Welcome to Pritamoria, ${name || 'Friend'}!</h2>
        <p style="color: #d1d5db;">We're thrilled to have you join our botanical AI community.</p>
        <p style="color: #d1d5db;">You can now identify plants, detect diseases, and learn expert care tips.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="color: #9ca3af; font-size: 12px;">Pritamoria AI - Where Nature Meets Intelligence</p>
        </div>
      </div>
    `;
  } else if (type === 'login-alert') {
    subject = 'New login to your Pritamoria account';
    themeColor = '#3b82f6'; // Blue
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
        <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #3b82f6;" />
        <h2 style="color: #60a5fa;">New Login Detected</h2>
        <p style="color: #d1d5db;">Hi ${name || 'User'},</p>
        <p style="color: #d1d5db;">We noticed a new login to your Pritamoria account.</p>
        <p style="color: #d1d5db;">If this was you, you can safely ignore this email. If you don't recognize this activity, please reset your password immediately.</p>
      </div>
    `;
  } else if (type === 'forgot-password-otp') {
    subject = 'Your Pritamoria Password Reset Code';
    themeColor = '#22c55e';
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
        <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
        <h2 style="color: #4ade80;">Password Reset Request</h2>
        <p style="color: #d1d5db;">You requested a password reset. Here is your 6-digit verification code:</p>
        <div style="background: #111; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4ade80;">${otp || '------'}</span>
        </div>
        <p style="color: #d1d5db;">This code will expire in 15 minutes.</p>
        <p style="color: #d1d5db;">If you did not request this, please ignore this email.</p>
      </div>
    `;
  } else if (type === 'reset-password-success') {
    subject = 'Your Pritamoria password has been reset';
    themeColor = '#22c55e';
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
        <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
        <h2 style="color: #4ade80;">Password Reset Successful</h2>
        <p style="color: #d1d5db;">Hi ${name || 'User'},</p>
        <p style="color: #d1d5db;">The password for your Pritamoria account has been successfully changed.</p>
        <p style="color: #d1d5db;">If you did not make this change, please reset your password again immediately.</p>
      </div>
    `;
  } else {
    return res.status(400).json({ success: false, message: 'Invalid email type specified' });
  }

  // Resolve logo path in Vercel serverless environment
  const logoPath = path.join(process.cwd(), 'public/pritamoria_logo.jpeg');
  const attachments = [];
  
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'pritamoria_logo.jpeg',
      path: logoPath,
      cid: 'logo@pritamoria.ai',
      contentDisposition: 'inline',
      contentType: 'image/jpeg'
    });
  }

  try {
    const mailOptions = {
      from: `"Pritamoria AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('❌ Vercel Serverless Nodemailer Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

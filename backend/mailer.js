const nodemailer = require('nodemailer');

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

// Utility to send an email
const sendEmail = async (to, subject, htmlContent) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set in .env. Skipping email sending.');
    console.warn(`[SIMULATED EMAIL to ${to}]: ${subject}`);
    return;
  }

  try {
    const mailOptions = {
      from: `"Pritamoria AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: 'pritamoria_logo.jpeg',
          path: require('path').join(__dirname, '../public/pritamoria_logo.jpeg'),
          cid: 'logo@pritamoria.ai',
          contentDisposition: 'inline',
          contentType: 'image/jpeg'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

const delegateEmail = async (type, email, name, otp) => {
  try {
    const response = await fetch(process.env.VERCEL_EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_SECRET}`
      },
      body: JSON.stringify({ type, email, name, otp })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      console.log(`📧 Delegated email [${type}] to Vercel: success`);
    } else {
      console.error(`❌ Delegated email [${type}] to Vercel failed:`, data.message || response.statusText);
    }
  } catch (error) {
    console.error(`❌ Error calling Vercel email delegation for [${type}]:`, error);
  }
};

const sendWelcomeEmail = (email, name) => {
  if (process.env.VERCEL_EMAIL_API_URL) {
    delegateEmail('welcome', email, name);
    return;
  }
  const subject = 'Welcome to Pritamoria! 🌿';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
      <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
      <h2 style="color: #4ade80;">Welcome to Pritamoria, ${name}!</h2>
      <p style="color: #d1d5db;">We're thrilled to have you join our botanical AI community.</p>
      <p style="color: #d1d5db;">You can now identify plants, detect diseases, and learn expert care tips.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
        <p style="color: #9ca3af; font-size: 12px;">Pritamoria AI - Where Nature Meets Intelligence</p>
      </div>
    </div>
  `;
  sendEmail(email, subject, html);
};

const sendLoginAlert = (email, name) => {
  if (process.env.VERCEL_EMAIL_API_URL) {
    delegateEmail('login-alert', email, name);
    return;
  }
  const subject = 'New login to your Pritamoria account';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
      <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #3b82f6;" />
      <h2 style="color: #60a5fa;">New Login Detected</h2>
      <p style="color: #d1d5db;">Hi ${name},</p>
      <p style="color: #d1d5db;">We noticed a new login to your Pritamoria account.</p>
      <p style="color: #d1d5db;">If this was you, you can safely ignore this email. If you don't recognize this activity, please reset your password immediately.</p>
    </div>
  `;
  sendEmail(email, subject, html);
};

const sendPasswordResetOtp = (email, otp) => {
  if (process.env.VERCEL_EMAIL_API_URL) {
    delegateEmail('forgot-password-otp', email, null, otp);
    return;
  }
  const subject = 'Your Pritamoria Password Reset Code';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
      <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
      <h2 style="color: #4ade80;">Password Reset Request</h2>
      <p style="color: #d1d5db;">You requested a password reset. Here is your 6-digit verification code:</p>
      <div style="background: #111; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4ade80;">${otp}</span>
      </div>
      <p style="color: #d1d5db;">This code will expire in 15 minutes.</p>
      <p style="color: #d1d5db;">If you did not request this, please ignore this email.</p>
    </div>
  `;
  sendEmail(email, subject, html);
};

const sendPasswordResetSuccess = (email, name) => {
  if (process.env.VERCEL_EMAIL_API_URL) {
    delegateEmail('reset-password-success', email, name);
    return;
  }
  const subject = 'Your Pritamoria password has been reset';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px; text-align: center;">
      <img src="cid:logo@pritamoria.ai" alt="Pritamoria Logo" style="width: 80px; height: 80px; border-radius: 15px; margin-bottom: 15px; border: 1px solid #22c55e;" />
      <h2 style="color: #4ade80;">Password Reset Successful</h2>
      <p style="color: #d1d5db;">Hi ${name},</p>
      <p style="color: #d1d5db;">The password for your Pritamoria account has been successfully changed.</p>
      <p style="color: #d1d5db;">If you did not make this change, please reset your password again immediately.</p>
    </div>
  `;
  sendEmail(email, subject, html);
};

module.exports = {
  sendWelcomeEmail,
  sendLoginAlert,
  sendPasswordResetOtp,
  sendPasswordResetSuccess
};

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const imagePath = path.join(__dirname, '../public/pritamoria_logo.jpeg');
console.log("Checking image path:", imagePath);
console.log("Image exists?", fs.existsSync(imagePath));

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Logo Email',
      html: '<h1>Test</h1><img src="cid:pritamoria_logo" />',
      attachments: [
        {
          filename: 'pritamoria_logo.jpeg',
          path: imagePath,
          cid: 'pritamoria_logo'
        }
      ]
    });
    console.log('✅ Success! Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

run();

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const User = require('./models/User');
const PersonalizedPlant = require('./models/PersonalizedPlant');
const { sendWelcomeEmail, sendLoginAlert, sendPasswordResetOtp, sendPasswordResetSuccess } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pritamoria_db';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to Local MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to Local MongoDB!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// Authentication Routes
// ==========================================

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered. Please sign in instead.' });
    }

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: phoneNumber.trim(),
      password: password // Storing as plain text per original logic (Note: use bcrypt in production)
    });

    await newUser.save();
    
    // Send Welcome Email
    sendWelcomeEmail(newUser.email, newUser.name);

    // Remove password from response
    const userResponse = { id: newUser._id, name: newUser.name, email: newUser.email, phoneNumber: newUser.phoneNumber };
    
    res.status(201).json({ success: true, message: 'Account created successfully!', user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not found. Please check your email or sign up.' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }
    
    // Send Login Alert (async, doesn't block response)
    sendLoginAlert(user.email, user.name);

    const userResponse = { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber };
    res.status(200).json({ success: true, message: 'Login successful!', user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Request OTP for Password Reset
app.post('/api/auth/forgot-password-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Don't reveal if user exists or not for security, just return success
      return res.status(200).json({ success: true, message: 'If an account exists with this email, an OTP has been sent.' });
    }
    
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Set OTP and expiry (15 mins from now)
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    
    // Send Email
    sendPasswordResetOtp(user.email, otp);
    
    res.status(200).json({ success: true, message: 'If an account exists with this email, an OTP has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error generating OTP.' });
  }
});

// Verify OTP & Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({ 
      email: email.toLowerCase().trim()
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid request.' });
    }
    
    // Verify OTP
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    
    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    
    // Reset password and clear OTP
    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();
    
    // Send confirmation email
    sendPasswordResetSuccess(user.email, user.name);
    
    res.status(200).json({ success: true, message: 'Password successfully reset! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
});

// ==========================================
// Garden / Personalized Plants Routes
// ==========================================

// Get all personalized plants for a user
app.get('/api/garden/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plants = await PersonalizedPlant.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, plants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving garden.' });
  }
});

// Add a new plant to garden
app.post('/api/garden', async (req, res) => {
  try {
    const {
      userId,
      name,
      species,
      images,
      onboardingAnswers,
      aiCarePlan
    } = req.body;

    if (!userId || !name || !species) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Calculate next dates based on AI intervals
    const nextWateringDate = new Date(Date.now() + (aiCarePlan.wateringIntervalDays || 7) * 24 * 60 * 60 * 1000);
    const nextFertilizingDate = new Date(Date.now() + (aiCarePlan.fertilizingIntervalDays || 30) * 24 * 60 * 60 * 1000);

    const newPlant = new PersonalizedPlant({
      userId,
      name,
      species,
      images: images || [],
      onboardingAnswers,
      aiCarePlan,
      careLogs: [],
      nextWateringDate,
      nextFertilizingDate
    });

    await newPlant.save();
    res.status(201).json({ success: true, plant: newPlant, message: 'Plant added to garden!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saving plant.' });
  }
});

// Delete a plant from garden
app.delete('/api/garden/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params;
    await PersonalizedPlant.findByIdAndDelete(plantId);
    res.status(200).json({ success: true, message: 'Plant removed from garden.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting plant.' });
  }
});

// Log a care action (watered, fertilized, etc.)
app.post('/api/garden/:plantId/log', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { log } = req.body;

    if (!log || !log.action) {
      return res.status(400).json({ success: false, message: 'Missing log action.' });
    }

    const plant = await PersonalizedPlant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found.' });
    }

    const newLog = {
      action: log.action,
      note: log.note || '',
      timestamp: new Date()
    };

    plant.careLogs.push(newLog);

    // Recalculate next dates based on logged action
    if (log.action === 'watered') {
      plant.nextWateringDate = new Date(Date.now() + (plant.aiCarePlan.wateringIntervalDays || 7) * 24 * 60 * 60 * 1000);
    } else if (log.action === 'fertilized') {
      plant.nextFertilizingDate = new Date(Date.now() + (plant.aiCarePlan.fertilizingIntervalDays || 30) * 24 * 60 * 60 * 1000);
    }

    await plant.save();
    res.status(200).json({ success: true, plant, message: 'Care logged successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error logging care action.' });
  }
});

// Add a progress photo and update care plan
app.post('/api/garden/:plantId/progress-photo', async (req, res) => {
  try {
    const { plantId } = req.params;
    const { image, aiCarePlan } = req.body;

    if (!image || !aiCarePlan) {
      return res.status(400).json({ success: false, message: 'Missing image or care plan details.' });
    }

    const plant = await PersonalizedPlant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found.' });
    }

    // Push new image
    plant.images.push(image);
    // Update care plan
    plant.aiCarePlan = aiCarePlan;
    
    // Add care log for photo update
    plant.careLogs.push({
      action: 'photo_updated',
      note: 'Uploaded a progress photo for AI health monitoring.',
      timestamp: new Date()
    });

    await plant.save();
    res.status(200).json({ success: true, plant, message: 'Progress photo saved and AI care plan updated!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saving progress photo.' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const careLogSchema = new mongoose.Schema({
  action: {
    type: String, // 'watered' | 'fertilized' | 'pruned' | 'repotted' | 'sprayed'
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const personalizedPlantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String // base64 representation of plant images
  }],
  onboardingAnswers: {
    location: {
      type: String,
      required: true // 'indoor' | 'outdoor' | 'balcony' | 'greenhouse'
    },
    sunlight: {
      type: String,
      required: true // 'low' | 'indirect' | 'direct' | 'partial'
    },
    wateringFrequency: {
      type: String,
      required: true // 'daily' | 'few-days' | 'weekly' | 'bi-weekly' | 'monthly' | 'dry'
    },
    soilType: {
      type: String,
      required: true // 'potting-mix' | 'garden-soil' | 'succulent' | 'sandy' | 'clay'
    },
    plantSize: {
      type: String,
      required: true // 'small' | 'medium' | 'large'
    },
    currentHealth: {
      type: String,
      required: true // 'healthy' | 'minor' | 'sick' | 'critical'
    },
    symptoms: {
      type: String,
      default: ''
    }
  },
  aiCarePlan: {
    wateringInstructions: {
      type: String,
      required: true
    },
    wateringIntervalDays: {
      type: Number,
      default: 7
    },
    lightInstructions: {
      type: String,
      required: true
    },
    soilAndFertilizer: {
      type: String,
      required: true
    },
    fertilizingIntervalDays: {
      type: Number,
      default: 30
    },
    healthDiagnostics: {
      type: String,
      required: true
    },
    generalCareTips: [{
      type: String
    }],
    healthScore: {
      type: Number,
      default: 100
    }
  },
  careLogs: [careLogSchema],
  nextWateringDate: {
    type: Date
  },
  nextFertilizingDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PersonalizedPlant', personalizedPlantSchema);

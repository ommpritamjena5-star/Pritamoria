# 🌿 Pritamoria AI - Plant Intelligence

<div align="center">
  <img src="./public/pritamoria_logo.jpeg" alt="Pritamoria Logo" width="200" style="border-radius: 20px; box-shadow: 0 0 20px rgba(34,197,94,0.4);" />
</div>

## 📖 What is Pritamoria?
**Pritamoria AI** is an advanced, intelligent web application designed to bridge the gap between nature and technology. It serves as a comprehensive "botanical AI community" that empowers users to identify plants, detect diseases, and discover expert care tips using cutting-edge artificial intelligence. 

## 🎯 Purpose
The primary purpose of Pritamoria is to provide farmers, gardeners, botanists, and plant enthusiasts with an accessible, highly accurate tool to understand and care for their flora. By utilizing visual AI processing and conversational AI, Pritamoria eliminates the guesswork from plant care, ensuring healthier plants and better crop yields.

## 🌟 How it is Beneficial
- **Instant Knowledge:** Identify unknown plants and their characteristics in seconds just by uploading a photo.
- **Disease Prevention & Cure:** Early detection of plant diseases saves entire crops or beloved houseplants from dying. Pritamoria not only diagnoses the issue but provides actionable remedies.
- **Accessible Expert Advice:** The integrated voice-and-text AI chatbot acts as a 24/7 agronomist, answering complex questions regarding fertilizers, sunlight needs, and seasonal care.
- **Secure Ecosystem:** A fully authenticated environment ensures user data is private, backed by OTP verification and real-time email security alerts.

## ✨ Detailed Features

### 1. 🔍 Visual Plant Identification
- Upload any image of a plant, leaf, or flower.
- The AI analyzes the visual data to identify the species, common names, origin, and general characteristics.

### 2. 🦠 Disease Detection & Diagnosis
- Upload images of sick or wilting plants.
- Pritamoria scans for visual symptoms of common and rare plant diseases (e.g., blight, powdery mildew, rust).
- Provides a health status and confidence score.

### 3. 💊 Care & Remedies Search
- A comprehensive database of plant diseases and their cures.
- Search for specific plant issues and instantly receive organic and chemical treatment recommendations.
- Premium UI with glassmorphism and dynamic filtering.

### 4. 🤖 Pritamoria AI Assistant (Chatbot)
- **Voice & Text Input:** Ask questions by typing or speaking directly into the app (Speech-to-Text).
- **Context-Aware:** Strictly trained to assist with plant-related queries, fertilizers, disease prevention, and botanical knowledge.
- **Exclusive Access:** The AI chatbot is an exclusive feature only available to authenticated (logged-in) users.

### 5. 🔐 Robust Authentication & Security
- **Secure Sign-Up & Login:** Users create accounts to access premium features.
- **Email Notifications:** Powered by Nodemailer, the system sends beautifully branded emails for:
  - Welcome greetings upon registration.
  - Security alerts when a new login is detected.
- **Advanced Password Recovery:** Users can reset passwords securely via a 6-digit OTP sent to their email, followed by a password reset confirmation email.

## 🛠️ Technology Stack

Pritamoria is built on a modern, high-performance web stack:

### Frontend (Client-Side)
- **Framework:** React 18 + Vite (for lightning-fast builds)
- **Styling:** Tailwind CSS (with custom Glassmorphism, dark mode aesthetics, and animations)
- **Icons & UI:** Lucide React, Radix UI components
- **Routing:** React Router

### Backend (Server-Side)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Local instance for rapid data processing) via Mongoose
- **Authentication:** Custom token/session logic with encrypted validation.

### Artificial Intelligence & APIs
- **Core AI Engine:** Google Generative AI (`@google/generative-ai` - Gemini 1.5/2.5 Flash models)
- **Speech Recognition:** Web Speech API integration for the Chatbot.

### Communication
- **Email Service:** Nodemailer using Gmail SMTP (IPv4 forced, secure transmission) to handle OTPs and alerts.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on port `27017`

### Environment Configuration
Create a `.env` file in the root directory of the project:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Running the Application

**1. Start the Backend Server:**
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
node server.js
```

**2. Start the Frontend Application:**
Open a second terminal in the root directory:
```bash
npm install
npm run dev
```

Your application will now be running on the local network!
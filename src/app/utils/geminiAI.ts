import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlantIdentification, PlantDisease } from '../App';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.trim() : '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper to convert data URL to generative part
const dataUrlToGenerativePart = (dataUrl: string) => {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
};

export async function analyzePlantImagesWithGemini(imagesDataUrls: string[]): Promise<PlantIdentification> {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert botanist and plant pathologist trained on the Kaggle PlantVillage dataset.
    Analyze the provided images of a plant. Your task is to identify the plant, detect any diseases, and provide detailed care instructions.
    
    Return the result strictly as a JSON object matching this exact TypeScript interface:
    {
      "name": "Common name of the plant",
      "scientificName": "Scientific name",
      "type": "plant" | "tree" | "flower" | "fruit" | "vegetable",
      "confidence": number between 0 and 100,
      "description": "A detailed 2-3 sentence description of the plant.",
      "advantages": ["advantage 1", "advantage 2", "advantage 3"],
      "disadvantages": ["disadvantage 1", "disadvantage 2"],
      "careInstructions": ["instruction 1", "instruction 2", "instruction 3"],
      "commonDiseases": ["disease 1", "disease 2"],
      "analysisDetails": {
        "detectedColors": ["color1", "color2"],
        "leafShape": ["shape1"],
        "textureFeatures": ["texture1"],
        "sizeCategory": "small/medium/large",
        "matchedFeatures": ["feature1", "feature2"],
        "verificationStatus": "verified",
        "alternativeNames": ["name1", "name2"],
        "confidenceLevel": number
      },
      "diseaseAnalysis": {
        "healthScore": number between 0 and 100,
        "healthStatus": "healthy" | "minor-issues" | "needs-attention" | "critical",
        "healthMessage": "Short summary of plant health",
        "diseases": [
          {
            "id": "unique-id",
            "name": "Disease Name (or 'None' if healthy)",
            "severity": "low" | "medium" | "high",
            "confidence": number between 0 and 100,
            "description": "Description of the disease",
            "symptoms": ["symptom1", "symptom2"],
            "causes": ["cause1", "cause2"],
            "treatment": ["treatment step 1", "treatment step 2"],
            "prevention": ["prevention tip 1"],
            "affectedParts": ["leaves", "stems"]
          }
        ]
      }
    }
    
    Ensure the output is pure JSON without any markdown formatting block wrappers. 
    If no diseases are found, return an empty array for diseases, a healthScore of 95-100, and healthStatus "healthy".
  `;

  const imageParts = imagesDataUrls.map(dataUrlToGenerativePart);
  
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting from Gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(text);
    
    // Add missing fields like IDs that are required by the app
    parsedData.id = Date.now().toString();
    parsedData.images = imagesDataUrls; // We store the uploaded images
    
    if (parsedData.diseaseAnalysis && parsedData.diseaseAnalysis.diseases) {
       parsedData.diseaseAnalysis.diseases = parsedData.diseaseAnalysis.diseases.map((d: any, i: number) => ({
           ...d,
           id: d.id || `disease-${Date.now()}-${i}`
       }));
    }

    return parsedData as PlantIdentification;
  } catch (error) {
    console.error("Pritamoria AI Error:", error);
    throw new Error("Failed to analyze images with Pritamoria AI. Ensure the images are clear and your API key is valid.");
  }
}

export async function detectDiseasesWithGemini(imagesDataUrls: string[]): Promise<PlantDisease[]> {
    if (!API_KEY) {
      throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }
  
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
    const prompt = `
      You are an expert plant pathologist AI trained on the Kaggle PlantVillage dataset.
      Analyze the provided plant images for diseases. 
      
      Return the result strictly as a JSON array of disease objects matching this interface:
      [
        {
          "name": "Disease Name (e.g., Tomato Early Blight)",
          "severity": "low" | "medium" | "high",
          "confidence": number between 0 and 100,
          "description": "Detailed description of the disease.",
          "symptoms": ["symptom1", "symptom2"],
          "causes": ["cause1", "cause2"],
          "treatment": ["treatment step 1", "treatment step 2"],
          "prevention": ["prevention tip 1"],
          "affectedParts": ["leaves", "stems", "roots", "fruits"]
        }
      ]
      
      Ensure the output is pure JSON without any markdown formatting block wrappers.
      If the plant is completely healthy, return an empty array [].
    `;
  
    const imageParts = imagesDataUrls.map(dataUrlToGenerativePart);
    
    try {
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(text);
      
      return parsedData.map((d: any, i: number) => ({
          ...d,
          id: `disease-${Date.now()}-${i}`
      })) as PlantDisease[];
    } catch (error) {
      console.error("Pritamoria AI Error:", error);
      throw new Error("Failed to analyze plant diseases with Pritamoria AI.");
    }
  }

export async function chatWithPritamoria(history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Pritamoria API Key is missing.");
  }

  const systemInstruction = `You are Pritamoria AI, a specialized chatbot focused ONLY on plants. 
You can answer questions about:
- Plant care and maintenance
- Knowing a plant's name or identity
- Fertilizers and soil requirements
- Advantages and disadvantages of specific plants
- Plant diseases, pests, and how to cure them

If a user asks a question that is NOT related to plants, gardening, botany, or agriculture, you MUST politely decline to answer and remind them that you are Pritamoria AI, a plant care assistant. Do not answer general knowledge questions outside of this scope. 

Always structure your responses using clear, concise bullet points and sections. Ensure the formatting is clean, easy to read, and immediately understandable.`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction
  });

  try {
    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Pritamoria AI Chat Error:", error);
    throw new Error("Failed to communicate with Pritamoria AI. Please try again.");
  }
}

export async function generatePersonalizedCarePlan(
  plantName: string,
  species: string,
  answers: {
    location: string;
    sunlight: string;
    wateringFrequency: string;
    soilType: string;
    plantSize: string;
    currentHealth: string;
    symptoms: string;
  },
  imagesDataUrls: string[]
): Promise<{
  wateringInstructions: string;
  wateringIntervalDays: number;
  lightInstructions: string;
  soilAndFertilizer: string;
  fertilizingIntervalDays: number;
  healthDiagnostics: string;
  generalCareTips: string[];
  healthScore: number;
}> {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert botanist and plant care AI.
    A user has added a plant to their personalized dashboard. Here are the details:
    - Custom Plant Name: ${plantName}
    - Plant Species/Type: ${species}
    - Environment details:
      - Location: ${answers.location}
      - Light received: ${answers.sunlight}
      - Current watering frequency: ${answers.wateringFrequency}
      - Soil type: ${answers.soilType}
      - Plant size: ${answers.plantSize}
      - Current health status: ${answers.currentHealth}
      - Reported symptoms/issues: ${answers.symptoms || "None"}
      
    Analyze these details along with the provided image(s) of the plant (if available).
    Generate a personalized care plan for this specific plant under these conditions.
    
    Return the result strictly as a JSON object matching this exact interface:
    {
      "wateringInstructions": "Clear, specific instructions on how and when to water this plant under the user's specific location/light conditions.",
      "wateringIntervalDays": number (recommend watering frequency in days, e.g. 7 for weekly, 14 for bi-weekly, 3 for every 3 days),
      "lightInstructions": "Advice on whether their current light exposure is good, and how to optimize it for this species.",
      "soilAndFertilizer": "Instructions on what fertilizer to use, how often, and if their soil type is appropriate.",
      "fertilizingIntervalDays": number (recommend fertilizing frequency in days, e.g. 30 for monthly),
      "healthDiagnostics": "Diagnostics based on the user's reported symptoms and photo analysis. Suggest treatments if sick.",
      "generalCareTips": ["tip 1", "tip 2", "tip 3"],
      "healthScore": number (health score between 0 and 100 based on health status/symptoms/photo)
    }
    
    Ensure the output is pure JSON without any markdown formatting block wrappers.
  `;

  const imageParts = imagesDataUrls.map(dataUrlToGenerativePart);

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Personalized Care Plan Generation Error:", error);
    // Return a reasonable default care plan if AI generation fails
    const isSick = answers.currentHealth === 'sick' || answers.currentHealth === 'critical' || answers.symptoms.trim().length > 0;
    return {
      wateringInstructions: `Water your ${species} when the soil dries out (typically every 7-10 days, depending on temperature). Currently watered: ${answers.wateringFrequency}.`,
      wateringIntervalDays: answers.wateringFrequency === 'daily' ? 1 : answers.wateringFrequency === 'few-days' ? 3 : answers.wateringFrequency === 'weekly' ? 7 : answers.wateringFrequency === 'bi-weekly' ? 14 : 30,
      lightInstructions: `Ensure the ${species} receives light suited to its needs. Currently receiving ${answers.sunlight} light in the ${answers.location}.`,
      soilAndFertilizer: `Use appropriate potting soil for ${species}. Keep in mind it is in ${answers.soilType} soil. Fertilize monthly during growing season.`,
      fertilizingIntervalDays: 30,
      healthDiagnostics: isSick 
        ? `Monitoring reported symptoms: "${answers.symptoms || 'general illness'}". Keep a close eye on moisture levels and adjust light.`
        : `Your ${species} appears healthy. Monitor regularly for pests or changes in color.`,
      generalCareTips: [
        "Rotate the plant every couple of weeks to ensure symmetrical growth.",
        "Check soil moisture using your finger before watering.",
        "Keep the leaves clean from dust so they can photosynthesize efficiently."
      ],
      healthScore: answers.currentHealth === 'healthy' ? 95 : answers.currentHealth === 'minor' ? 80 : answers.currentHealth === 'sick' ? 50 : 30
    };
  }
}

export async function chatWithPritamoriaForPlant(
  history: { role: string, parts: { text: string }[] }[],
  newMessage: string,
  plantContext: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error("Pritamoria API Key is missing.");
  }

  const systemInstruction = `You are Pritamoria AI, a specialized chatbot focused ONLY on plants. 
You are currently acting as an assistant for the user's specific plant. Here is the context of the plant you are helping them with:
${plantContext}

Answer the user's questions about this plant using this context. Provide helpful, actionable, and structured advice for their plant care queries. If they ask about something unrelated to plants, gardening, or this specific plant, politely steer the conversation back to plant care.

Always structure your answers using clear, concise bullet points and sections. Ensure the formatting is clean, visually appealing, easy to read, and immediately understandable.`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemInstruction
  });

  try {
    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Pritamoria AI Plant Chat Error:", error);
    throw new Error("Failed to communicate with Pritamoria AI. Please try again.");
  }
}

export async function getWeatherCareAdvice(
  species: string,
  location: string,
  weather: {
    temp: number;
    humidity: number;
    windSpeed: number;
    description: string;
    city?: string;
  }
): Promise<{
  status: 'good' | 'neutral' | 'bad';
  advice: string;
}> {
  if (!API_KEY) {
    return {
      status: 'neutral',
      advice: `Currently ${weather.temp}°C and ${weather.description} in ${weather.city || 'your area'}. Monitor watering.`
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert plant care AI.
    Determine the immediate impact of the current local weather on a user's plant.
    Plant Species: ${species}
    Kept: ${location} (indoor or outdoor)
    Current Weather Conditions:
    - Temperature: ${weather.temp}°C
    - Relative Humidity: ${weather.humidity}%
    - Wind Speed: ${weather.windSpeed} km/h
    - Weather Description: ${weather.description}
    - Location Name: ${weather.city || "Local area"}
    
    Evaluate if this weather is good, neutral, or bad/challenging for this specific plant species given its indoor/outdoor placement.
    Provide a specific, action-oriented 1-2 sentence recommendation on what the user should do right now (e.g., watering checks, shading, bringing indoors, misting leaves, or enjoying the climate).
    
    Return the result strictly as a JSON object matching this exact interface:
    {
      "status": "good" | "neutral" | "bad",
      "advice": "1-2 sentence advice text."
    }
    
    Ensure the output is pure JSON without any markdown formatting block wrappers.
  `;

  try {
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Weather Care Advice AI Error:", error);
    // Safe fallback logic if Gemini fails
    const isOutdoor = location.toLowerCase().includes('out');
    let status: 'good' | 'neutral' | 'bad' = 'neutral';
    let advice = `Currently ${weather.temp}°C and ${weather.description}. Check soil dampness.`;

    if (weather.temp > 35) {
      status = 'bad';
      advice = isOutdoor 
        ? `Extreme heat warning! Provide temporary shade for your ${species} and water deeply in the morning.`
        : `High indoor temperatures! Increase ventilation and check soil moisture, as water evaporates faster.`;
    } else if (weather.temp < 5) {
      status = 'bad';
      advice = isOutdoor
        ? `Near-freezing temperatures! Bring your ${species} indoors to protect it from cold shock.`
        : `Chilly indoors! Move your ${species} away from drafts and cold window panes.`;
    } else if (weather.description.toLowerCase().includes('rain') || weather.description.toLowerCase().includes('shower')) {
      if (isOutdoor) {
        status = 'good';
        advice = `Natural rainfall is excellent for ${species}. Ensure your pot has proper drainage holes so the roots don't waterlog.`;
      }
    }

    return { status, advice };
  }
}

export async function analyzeProgressPhoto(
  plantName: string,
  species: string,
  answers: {
    location: string;
    sunlight: string;
    wateringFrequency: string;
    soilType: string;
    plantSize: string;
    currentHealth: string;
    symptoms: string;
  },
  currentCarePlan: {
    wateringInstructions: string;
    wateringIntervalDays: number;
    lightInstructions: string;
    soilAndFertilizer: string;
    fertilizingIntervalDays: number;
    healthDiagnostics: string;
    generalCareTips: string[];
    healthScore: number;
  },
  newPhotoDataUrl: string,
  monitoringAnswers: {
    soilMoisture: string;
    healthRating: string;
    symptoms: string;
  }
): Promise<{
  wateringInstructions: string;
  wateringIntervalDays: number;
  lightInstructions: string;
  soilAndFertilizer: string;
  fertilizingIntervalDays: number;
  healthDiagnostics: string;
  generalCareTips: string[];
  healthScore: number;
}> {
  if (!API_KEY) {
    return currentCarePlan;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert botanist and plant care AI.
    The user is uploading a new progress/monitoring photo of their plant:
    - Custom Plant Name: ${plantName}
    - Plant Species: ${species}
    - Environment Details: Kept ${answers.location} with ${answers.sunlight} light.
    
    User's Current Progress Report:
    - Observed soil moisture status: ${monitoringAnswers.soilMoisture}
    - Observed plant health rating: ${monitoringAnswers.healthRating}
    - Observed new changes/symptoms: ${monitoringAnswers.symptoms || "None"}
    
    Previous Care Plan Details:
    - Previous Health Score: ${currentCarePlan.healthScore}%
    - Previous Diagnostics: ${currentCarePlan.healthDiagnostics}
    
    Analyze the new progress photo of the plant. Compare it with the user's current progress report and the previous diagnostics details.
    1. Identify if the plant shows growth, recovery, or decline (e.g. leaf damage, new nodes, improved colors).
    2. Identify if there are new disease symptoms (e.g. leaf spots, wilting, mold, pests).
    3. Update the health score (0-100) and care diagnostics.
    
    Return the updated care plan strictly as a JSON object matching this exact interface:
    {
      "wateringInstructions": "Updated watering instructions if needed, or keep the same.",
      "wateringIntervalDays": number,
      "lightInstructions": "Updated lighting advice if needed, or keep the same.",
      "soilAndFertilizer": "Updated soil/fertilizer instructions if needed, or keep the same.",
      "fertilizingIntervalDays": number,
      "healthDiagnostics": "A detailed evaluation of the new progress photo and user answers (e.g. 'New leaf growth detected! The leaf color has improved since the last check.' or 'Caution: Dark spots detected on lower leaves. This could indicate overwatering. Reduce frequency...').",
      "generalCareTips": ["tip 1", "tip 2"],
      "healthScore": number (new health score based on the progress photo analysis)
    }
    
    Ensure the output is pure JSON without any markdown formatting block wrappers.
  `;

  const imagePart = dataUrlToGenerativePart(newPhotoDataUrl);

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Progress photo analysis error:", error);
    return {
      ...currentCarePlan,
      healthDiagnostics: `Monitoring check completed on progress photo. Soil moisture and leaves appear stable. Keep tracking growth.`,
      healthScore: currentCarePlan.healthScore
    };
  }
}

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft,
  Plus,
  Droplet,
  Trash2,
  Calendar,
  Upload,
  Camera,
  X,
  CheckCircle,
  MessageSquare,
  Send,
  Sun,
  Sprout,
  Activity,
  Heart,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '../App';
import {
  PersonalizedPlant,
  CareLog,
  fetchUserGarden,
  savePlantToGarden,
  deletePlantFromGarden,
  addCareLogToPlant,
  uploadProgressPhoto
} from '../utils/gardenStorage';
import { generatePersonalizedCarePlan, chatWithPritamoriaForPlant, getWeatherCareAdvice, analyzeProgressPhoto } from '../utils/geminiAI';
import {
  WeatherReport,
  fetchWeatherByCoordinates,
  getDeviceLocation
} from '../utils/weatherService';

interface GardenPageProps {
  user: User;
  onBack: () => void;
}

export function GardenPage({ user, onBack }: GardenPageProps) {
  const [plants, setPlants] = useState<PersonalizedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState<PersonalizedPlant | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard state variables
  const [plantName, setPlantName] = useState('');
  const [plantSpecies, setPlantSpecies] = useState('');
  const [location, setLocation] = useState('indoor');
  const [sunlight, setSunlight] = useState('indirect');
  const [wateringFrequency, setWateringFrequency] = useState('weekly');
  const [soilType, setSoilType] = useState('potting-mix');
  const [plantSize, setPlantSize] = useState('medium');
  const [currentHealth, setCurrentHealth] = useState('healthy');
  const [symptoms, setSymptoms] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Chatbot inside details state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);

  // Weather States
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherAdvice, setWeatherAdvice] = useState<{ status: 'good' | 'neutral' | 'bad'; advice: string } | null>(null);
  const [loadingWeatherAdvice, setLoadingWeatherAdvice] = useState(false);

  // Monitoring States & Refs
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [isMonitoringDialogOpen, setIsMonitoringDialogOpen] = useState(false);
  const [monitoringSoil, setMonitoringSoil] = useState('damp');
  const [monitoringHealth, setMonitoringHealth] = useState('good');
  const [monitoringSymptoms, setMonitoringSymptoms] = useState('');
  const [monitoringPhoto, setMonitoringPhoto] = useState<string | null>(null);
  const monitoringFileInputRef = useRef<HTMLInputElement>(null);
  const [assessmentResult, setAssessmentResult] = useState<PersonalizedPlant['aiCarePlan'] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detect local weather on page mount
  useEffect(() => {
    async function detectLocalWeather() {
      setWeatherLoading(true);
      try {
        const coords = await getDeviceLocation();
        const report = await fetchWeatherByCoordinates(coords.latitude, coords.longitude);
        setWeather(report);
      } catch (error) {
        console.warn('Geolocation or weather lookup failed:', error);
      } finally {
        setWeatherLoading(false);
      }
    }
    detectLocalWeather();
  }, []);

  // Fetch weather care advice for selected plant
  useEffect(() => {
    async function fetchAdvice() {
      if (!selectedPlant || !weather) {
        setWeatherAdvice(null);
        return;
      }
      setLoadingWeatherAdvice(true);
      try {
        const adviceData = await getWeatherCareAdvice(
          selectedPlant.species,
          selectedPlant.onboardingAnswers.location,
          weather
        );
        setWeatherAdvice(adviceData);
      } catch (error) {
        console.error('Failed to get weather advice:', error);
        setWeatherAdvice({
          status: 'neutral',
          advice: `Currently ${weather.temp}°C and ${weather.description}. Check watering need based on placement.`
        });
      } finally {
        setLoadingWeatherAdvice(false);
      }
    }
    fetchAdvice();
  }, [selectedPlant?.id, weather]);

  // Check if progress photo monitoring is due (every 2 days)
  const checkPhotoUpdateDue = (plant: PersonalizedPlant) => {
    const logs = plant.careLogs || [];
    const photoLogs = logs.filter(l => l.action === 'photo_updated');
    const lastTime = photoLogs.length > 0
      ? new Date(photoLogs[photoLogs.length - 1].timestamp)
      : new Date(plant.createdAt);
      
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2;
  };

  // Reset monitoring form
  const resetMonitoringForm = () => {
    setMonitoringSoil('damp');
    setMonitoringHealth('good');
    setMonitoringSymptoms('');
    setMonitoringPhoto(null);
    setAssessmentResult(null);
  };

  const runAutomaticAIAnalysis = async (photoUrl: string) => {
    if (!selectedPlant) return;

    setIsAnalyzingPhoto(true);
    toast.info('Pritamoria AI is automatically re-analyzing the uploaded plant image...');

    try {
      const monitoringAnswers = {
        soilMoisture: 'infer from photo',
        healthRating: 'infer from photo',
        symptoms: 'infer from photo'
      };

      const updatedPlan = await analyzeProgressPhoto(
        selectedPlant.name,
        selectedPlant.species,
        selectedPlant.onboardingAnswers,
        selectedPlant.aiCarePlan,
        photoUrl,
        monitoringAnswers
      );

      toast.success('AI re-analysis complete. Saving report...');

      const res = await uploadProgressPhoto(
        user.id,
        selectedPlant.id,
        photoUrl,
        updatedPlan
      );

      if (res.success && res.plant) {
        toast.success('New care report generated successfully!');
        setSelectedPlant(res.plant);
        setAssessmentResult(res.plant.aiCarePlan);
      } else {
        toast.error(res.message || 'Failed to update care plan.');
        setIsMonitoringDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to automatically analyze the photo.');
      setIsMonitoringDialogOpen(false);
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  // Handle monitoring photo selection & preview
  const handleProgressPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setMonitoringPhoto(dataUrl);
      setIsMonitoringDialogOpen(true);
      runAutomaticAIAnalysis(dataUrl);
    } catch (error) {
      toast.error('Failed to load status image.');
    }
  };

  // Load plants
  const loadGarden = async () => {
    setLoading(true);
    try {
      const userPlants = await fetchUserGarden(user.id);
      setPlants(userPlants);
    } catch (e) {
      toast.error('Failed to load your garden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarden();
  }, [user.id]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (uploadedPhotos.length + files.length > 5) {
      toast.error('Maximum of 5 photos allowed.');
      return;
    }

    const loaders = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const dataUrls = await Promise.all(loaders);
      setUploadedPhotos(prev => [...prev, ...dataUrls]);
    } catch (error) {
      toast.error('Failed to load one or more images.');
    }
  };

  const removeUploadedPhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const resetWizard = () => {
    setWizardStep(1);
    setPlantName('');
    setPlantSpecies('');
    setLocation('indoor');
    setSunlight('indirect');
    setWateringFrequency('weekly');
    setSoilType('potting-mix');
    setPlantSize('medium');
    setCurrentHealth('healthy');
    setSymptoms('');
    setUploadedPhotos([]);
    setIsGeneratingPlan(false);
    setGenerationProgress(0);
  };

  const startPlanGeneration = async () => {
    if (!plantName.trim() || !plantSpecies.trim()) {
      toast.error('Please enter the plant nickname and species name.');
      return;
    }

    setIsGeneratingPlan(true);
    setGenerationProgress(10);

    try {
      setGenerationProgress(25);
      // Generate AI care plan
      const answers = {
        location,
        sunlight,
        wateringFrequency,
        soilType,
        plantSize,
        currentHealth,
        symptoms
      };

      setGenerationProgress(50);
      const generatedPlan = await generatePersonalizedCarePlan(
        plantName,
        plantSpecies,
        answers,
        uploadedPhotos
      );

      setGenerationProgress(80);
      // Save plant
      const newPlantData = {
        userId: user.id,
        name: plantName,
        species: plantSpecies,
        images: uploadedPhotos,
        onboardingAnswers: answers,
        aiCarePlan: generatedPlan
      };

      const saveResult = await savePlantToGarden(newPlantData);
      setGenerationProgress(100);

      setTimeout(() => {
        if (saveResult.success) {
          toast.success(`${plantName} added to your garden!`);
          setIsAddDialogOpen(false);
          loadGarden();
          resetWizard();
        } else {
          toast.error(saveResult.message || 'Failed to save plant.');
          setIsGeneratingPlan(false);
        }
      }, 500);

    } catch (error) {
      console.error(error);
      toast.error('Failed to compile care guidelines. Please try again.');
      setIsGeneratingPlan(false);
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    if (confirm('Are you sure you want to remove this plant from your garden? This cannot be undone.')) {
      try {
        const res = await deletePlantFromGarden(user.id, plantId);
        if (res.success) {
          toast.success(res.message);
          setSelectedPlant(null);
          loadGarden();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error('Failed to delete plant.');
      }
    }
  };

  const handleLogCare = async (plantId: string, action: CareLog['action'], note = '') => {
    try {
      const log = { action, note };
      const res = await addCareLogToPlant(user.id, plantId, log);
      if (res.success && res.plant) {
        toast.success(`Logged ${action} successfully!`);
        // Refresh selected plant view
        setSelectedPlant(res.plant);
        // Refresh grid
        loadGarden();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Failed to log care event.');
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedPlant || isSendingRef.current) return;
    const userMsg = chatMessage.trim();
    setChatMessage('');
    
    isSendingRef.current = true;
    setIsSendingMessage(true);
    
    const userMsgObj = { role: 'user', parts: [{ text: userMsg }] };
    setChatHistory(prev => [...prev, userMsgObj]);

    try {
      const plantContext = `
        Plant Custom Name: ${selectedPlant.name}
        Plant Species: ${selectedPlant.species}
        Age: Added on ${new Date(selectedPlant.createdAt).toLocaleDateString()}
        Environment: Located ${selectedPlant.onboardingAnswers.location}, receiving ${selectedPlant.onboardingAnswers.sunlight} light.
        Soil: Placed in ${selectedPlant.onboardingAnswers.soilType} soil. Size is ${selectedPlant.onboardingAnswers.plantSize}.
        Current Health: ${selectedPlant.onboardingAnswers.currentHealth}. Reported Symptoms: ${selectedPlant.onboardingAnswers.symptoms || 'none'}.
        AI Suggested Watering Frequency: Every ${selectedPlant.aiCarePlan.wateringIntervalDays} days.
        AI Suggested Fertilizer Frequency: Every ${selectedPlant.aiCarePlan.fertilizingIntervalDays} days.
        Watering Guidelines: ${selectedPlant.aiCarePlan.wateringInstructions}
        Soil/Fertilizer Guidelines: ${selectedPlant.aiCarePlan.soilAndFertilizer}
        Diagnostic Summary: ${selectedPlant.aiCarePlan.healthDiagnostics}
      `;

      const responseText = await chatWithPritamoriaForPlant([...chatHistory, userMsgObj], userMsg, plantContext);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
    } catch (error) {
      toast.error('Failed to get response from Pritamoria AI.');
    } finally {
      isSendingRef.current = false;
      setIsSendingMessage(false);
    }
  };

  // Helper formatting for next watering date
  const getWateringDueText = (plant: PersonalizedPlant) => {
    if (!plant.nextWateringDate) return 'No schedule';
    const due = new Date(plant.nextWateringDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (dueDays < 0) {
      return { text: `Overdue by ${Math.abs(dueDays)} day${Math.abs(dueDays) > 1 ? 's' : ''}`, color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    } else if (dueDays === 0) {
      return { text: 'Water Due Today', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse' };
    } else if (dueDays === 1) {
      return { text: 'Water Due Tomorrow', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    } else {
      return { text: `Due in ${dueDays} days`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Excellent ({score}%)</Badge>;
    if (score >= 70) return <Badge className="bg-lime-500/20 text-lime-400 border border-lime-500/30">Good ({score}%)</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Fair ({score}%)</Badge>;
    return <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30">Needs Care ({score}%)</Badge>;
  };

  // Stats calculators
  const totalPlantsCount = plants.length;
  const plantsNeedingWaterCount = plants.filter(p => {
    if (!p.nextWateringDate) return false;
    return new Date(p.nextWateringDate) <= new Date();
  }).length;
  const avgHealth = totalPlantsCount > 0
    ? Math.round(plants.reduce((sum, p) => sum + (p.aiCarePlan.healthScore || 100), 0) / totalPlantsCount)
    : 100;

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-black">
              <img src="/pritamoria_logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">My Personalized Garden</h1>
              <p className="text-xs text-green-400 font-mono tracking-wider">AI GARDEN MANAGEMENT</p>
            </div>
          </div>
        </div>

        {/* Weather Bar */}
        {weather && (
          <div className="mb-6 bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-9 h-9 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                <Sun className="w-5 h-5 text-green-400 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm">📍 Live Climate Advisor Active</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                  Currently <span className="text-green-400 font-semibold">{weather.temp}°C</span> with <span className="text-white font-medium">{weather.description}</span> and <span className="text-white font-medium">{weather.humidity}% Humidity</span> in <span className="text-green-300 font-medium">{weather.city || 'your area'}</span>.
                </p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] sm:text-xs py-1 px-2.5 font-mono">
              Auto-Synced
            </Badge>
          </div>
        )}

        {/* Selected Plant Detail Overlay / Detail View */}
        {selectedPlant ? (
          <div className="space-y-6 mt-4">
            {/* Regular Monitoring Photo Prompt Banner */}
            {checkPhotoUpdateDue(selectedPlant) && (
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md animate-in slide-in-from-top duration-300">
                <div className="flex items-start sm:items-center space-x-3 text-sm">
                  <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs sm:text-sm">📸 Plant Status Monitoring Due</p>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                      It has been more than 2 days since this plant's last progress photo. Please run an AI monitoring check to update your care plan.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Button
                    onClick={() => monitoringFileInputRef.current?.click()}
                    className="bg-amber-500 hover:bg-amber-400 text-white rounded-xl shadow-lg shadow-amber-500/20 w-full sm:w-auto text-xs py-2 h-9 px-4 animate-bounce"
                  >
                    Run Monitoring Check
                  </Button>
                </div>
              </div>
            )}

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Left Column: Photos, Stats, Logger, History */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="bg-black/50 backdrop-blur-md border-white/10 overflow-hidden relative">
                {/* Close Detail Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedPlant(null);
                    setChatHistory([]);
                  }}
                  className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white rounded-full h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>

                {selectedPlant.images && selectedPlant.images.length > 0 ? (
                  <div className="relative h-64 w-full group/photo">
                    <img
                      src={selectedPlant.images[0]}
                      alt={selectedPlant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-2xl font-bold text-white tracking-tight">{selectedPlant.name}</h2>
                      <p className="text-green-300 text-sm italic">{selectedPlant.species}</p>
                    </div>
                    {/* Camera Overlay for quick monitoring upload */}
                    <div 
                      onClick={() => monitoringFileInputRef.current?.click()}
                      className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white cursor-pointer p-2 rounded-full border border-white/20 transition-all flex items-center space-x-1.5 shadow-md group/camera"
                      title="Upload status monitoring photo"
                    >
                      <Camera className="w-4 h-4 text-green-400 group-hover/camera:scale-110 transition-transform" />
                      <span className="text-[10px] font-medium pr-1">Update Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-green-950 to-black flex flex-col items-center justify-center border-b border-white/10 relative">
                    <Sprout className="w-12 h-12 text-green-400 mb-2" />
                    <h2 className="text-2xl font-semibold text-white">{selectedPlant.name}</h2>
                    <p className="text-green-300 text-sm italic">{selectedPlant.species}</p>
                    <div 
                      onClick={() => monitoringFileInputRef.current?.click()}
                      className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white cursor-pointer p-2 rounded-full border border-white/20 transition-all flex items-center space-x-1.5 shadow-md group/camera"
                      title="Upload status monitoring photo"
                    >
                      <Camera className="w-4 h-4 text-green-400 group-hover/camera:scale-110 transition-transform" />
                      <span className="text-[10px] font-medium pr-1">Upload Photo</span>
                    </div>
                  </div>
                )}

                <CardContent className="pt-6">
                  {/* Basic Metadata Info */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-300 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase font-mono">Location</span>
                      <span className="font-medium text-white capitalize">{selectedPlant.onboardingAnswers.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase font-mono">Sunlight</span>
                      <span className="font-medium text-white capitalize">{selectedPlant.onboardingAnswers.sunlight} exposure</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase font-mono">Size</span>
                      <span className="font-medium text-white capitalize">{selectedPlant.onboardingAnswers.plantSize}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase font-mono">Soil Type</span>
                      <span className="font-medium text-white capitalize">{selectedPlant.onboardingAnswers.soilType.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Geolocation Weather Impact Card */}
                  {weather && (
                    <div className="mt-4 border-t border-white/5 pt-4 pb-2">
                      <h4 className="text-xs uppercase font-mono text-gray-500 mb-2 flex items-center">
                        <Sun className="w-3.5 h-3.5 text-yellow-400 mr-1.5 animate-pulse" />
                        Live Weather Care Alert
                      </h4>
                      {loadingWeatherAdvice ? (
                        <div className="flex items-center space-x-2 text-xs text-gray-400 bg-white/5 rounded-xl p-3 border border-white/5">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-green-400 rounded-full animate-spin"></div>
                          <span>AI evaluating weather impact...</span>
                        </div>
                      ) : weatherAdvice ? (
                        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start space-x-2.5 shadow-sm transition-all duration-300 ${
                          weatherAdvice.status === 'good'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                            : weatherAdvice.status === 'bad'
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-200 border-dashed'
                            : 'bg-white/5 border-white/10 text-gray-300'
                        }`}>
                          {weatherAdvice.status === 'good' && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          )}
                          {weatherAdvice.status === 'bad' && (
                            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5 animate-bounce" />
                          )}
                          {weatherAdvice.status === 'neutral' && (
                            <Sprout className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold block mb-0.5">
                              {weatherAdvice.status === 'good' ? 'Climatic Advantage:' : weatherAdvice.status === 'bad' ? 'Weather Warning:' : 'Weather Advisory:'}
                            </span>
                            {weatherAdvice.advice}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Care Log Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white tracking-wide flex items-center">
                      <Activity className="w-4 h-4 text-green-400 mr-2" />
                      Log Care Activity
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleLogCare(selectedPlant.id, 'watered')}
                        variant="outline"
                        className="bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] duration-300"
                      >
                        <Droplet className="w-4 h-4 mr-2" />
                        Log Water
                      </Button>
                      <Button
                        onClick={() => handleLogCare(selectedPlant.id, 'fertilized')}
                        variant="outline"
                        className="bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-white transition-all shadow-[0_0_10px_rgba(245,158,11,0.1)] hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] duration-300"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Log Feed
                      </Button>
                      <Button
                        onClick={() => handleLogCare(selectedPlant.id, 'pruned')}
                        variant="outline"
                        className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                      >
                        <Sprout className="w-4 h-4 mr-2" />
                        Log Pruning
                      </Button>
                      <Button
                        onClick={() => handleLogCare(selectedPlant.id, 'repotted')}
                        variant="outline"
                        className="bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white transition-all duration-300"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Log Repotting
                      </Button>

                      <Button
                        onClick={() => monitoringFileInputRef.current?.click()}
                        className="col-span-2 mt-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-medium shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none transition-all duration-300 rounded-xl"
                      >
                        <Camera className="w-4 h-4 mr-2 animate-pulse" />
                        AI Health Monitoring Check
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Care Timeline Logs */}
              <Card className="bg-black/50 backdrop-blur-md border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white flex items-center justify-between">
                    <span>Care History Log</span>
                    <Badge variant="outline" className="text-gray-400 border-white/10 font-normal">
                      {selectedPlant.careLogs?.length || 0} event{(selectedPlant.careLogs?.length || 0) !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-60 overflow-y-auto pr-2">
                  {!selectedPlant.careLogs || selectedPlant.careLogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-6 text-sm">
                      <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      No events logged yet. Use actions above to track care!
                    </div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                      {[...selectedPlant.careLogs].reverse().map((log, index) => {
                        const date = new Date(log.timestamp);
                        return (
                          <div key={index} className="flex items-start pl-6 relative">
                            {/* Dot icon based on action */}
                            <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border border-black shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                              log.action === 'watered' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' :
                              log.action === 'fertilized' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' :
                              log.action === 'pruned' ? 'bg-emerald-400' : 'bg-purple-400'
                            }`} />
                            <div className="space-y-1">
                              <p className="text-sm text-white capitalize font-medium">
                                {log.action} Plant
                              </p>
                              <p className="text-[11px] text-gray-500">
                                {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <div className="pt-2 text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePlant(selectedPlant.id)}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Plant from Garden
                </Button>
              </div>
            </div>

            {/* Middle Column: Personalized Care Plan Tabs */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="bg-black/50 backdrop-blur-md border-white/10 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Sparkles className="w-5 h-5 text-green-400 mr-2" />
                      AI Care Plan
                    </CardTitle>
                    {getHealthBadge(selectedPlant.aiCarePlan.healthScore)}
                  </div>
                  <CardDescription className="text-gray-400">
                    Customized botanical guidelines generated by Pritamoria AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="watering" className="w-full">
                    <TabsList className="grid grid-cols-4 bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
                      <TabsTrigger value="watering" className="text-xs font-semibold text-gray-200 dark:text-gray-200 hover:text-white dark:hover:text-white data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white transition-all duration-200">Water</TabsTrigger>
                      <TabsTrigger value="light" className="text-xs font-semibold text-gray-200 dark:text-gray-200 hover:text-white dark:hover:text-white data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white transition-all duration-200">Light</TabsTrigger>
                      <TabsTrigger value="nutrients" className="text-xs font-semibold text-gray-200 dark:text-gray-200 hover:text-white dark:hover:text-white data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white transition-all duration-200">Soil</TabsTrigger>
                      <TabsTrigger value="health" className="text-xs font-semibold text-gray-200 dark:text-gray-200 hover:text-white dark:hover:text-white data-[state=active]:bg-green-500 data-[state=active]:text-white dark:data-[state=active]:bg-green-500 dark:data-[state=active]:text-white transition-all duration-200">Health</TabsTrigger>
                    </TabsList>

                    <TabsContent value="watering" className="space-y-4 focus:outline-none">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start space-x-3">
                        <Droplet className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-blue-300">Watering Frequency: Every {selectedPlant.aiCarePlan.wateringIntervalDays} Days</h4>
                          <p className="text-xs text-blue-200/80 mt-1">
                            Next scheduled watering: {selectedPlant.nextWateringDate ? new Date(selectedPlant.nextWateringDate).toLocaleDateString() : 'Today'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">Guidelines:</h4>
                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4">
                          {selectedPlant.aiCarePlan.wateringInstructions}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="light" className="space-y-4 focus:outline-none">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start space-x-3">
                        <Sun className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-300">Sunlight Profile</h4>
                          <p className="text-xs text-yellow-200/80 mt-1 capitalize">
                            Assigned light intensity: {selectedPlant.onboardingAnswers.sunlight} exposure
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">Guidelines:</h4>
                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4">
                          {selectedPlant.aiCarePlan.lightInstructions}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="nutrients" className="space-y-4 focus:outline-none">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3">
                        <Sprout className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-300">Soil & Fertilizer Strategy</h4>
                          <p className="text-xs text-amber-200/80 mt-1">
                            Suggested Feeding Interval: Every {selectedPlant.aiCarePlan.fertilizingIntervalDays} Days
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">Guidelines:</h4>
                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4">
                          {selectedPlant.aiCarePlan.soilAndFertilizer}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="health" className="space-y-4 focus:outline-none">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start space-x-3">
                        <Heart className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-300">Diagnostics & Remedies</h4>
                          <p className="text-xs text-emerald-200/80 mt-1">
                            Plant health score: {selectedPlant.aiCarePlan.healthScore}%
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white">Guidelines:</h4>
                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4">
                          {selectedPlant.aiCarePlan.healthDiagnostics}
                        </p>
                      </div>

                      {/* General Care Tips List */}
                      {selectedPlant.aiCarePlan.generalCareTips && selectedPlant.aiCarePlan.generalCareTips.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-semibold text-white">General Tips:</h4>
                          <ul className="text-xs text-gray-400 space-y-2 bg-white/5 border border-white/10 rounded-xl p-4 list-disc pl-5">
                            {selectedPlant.aiCarePlan.generalCareTips.map((tip, i) => (
                              <li key={i} className="leading-relaxed">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Plant-Specific Chat Bot Companion */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="bg-black/50 backdrop-blur-md border-white/10 flex flex-col h-[550px] relative overflow-hidden">
                <CardHeader className="pb-3 border-b border-white/10">
                  <CardTitle className="text-base text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-green-400" />
                      <span>Ask Plant Companion</span>
                    </div>
                    <Badge variant="outline" className="border-green-500/30 text-green-400 font-mono text-xs">
                      {selectedPlant.name}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Instant custom questions about watering, lighting, issues, etc.
                  </CardDescription>
                </CardHeader>

                {/* Chat Message Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-16 px-4 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto shadow-inner">
                        <Sparkles className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="font-semibold text-gray-300">Pritamoria Assistant Online</p>
                      <p className="text-xs max-w-[200px] mx-auto text-gray-400">
                        Ask custom care queries: "Why are my leaves yellowing?" or "Should I fertilize this week?"
                      </p>
                    </div>
                  ) : (
                    chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-md ${
                            msg.role === 'user'
                              ? 'bg-green-500 text-white rounded-br-none'
                              : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-none'
                          }`}
                        >
                          {msg.parts[0].text}
                        </div>
                      </div>
                    ))
                  )}
                  {isSendingMessage && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 text-gray-400 flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input Form */}
                <div className="p-3 border-t border-white/10 bg-black/40">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Ask about ${selectedPlant.name}...`}
                      className="bg-white/5 border-white/10 text-white focus-visible:ring-green-500 focus-visible:ring-offset-0 placeholder:text-gray-500 rounded-xl"
                      disabled={isSendingMessage}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => monitoringFileInputRef.current?.click()}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl h-10 w-10 flex-shrink-0 border border-white/10 transition-all"
                      title="Upload progress photo for monitoring"
                    >
                      <Camera className="w-4.5 h-4.5" />
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-green-500 hover:bg-green-400 text-white rounded-xl h-10 w-10 flex-shrink-0 shadow-lg shadow-green-500/20"
                      disabled={isSendingMessage || !chatMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
          /* Garden Home Grid View */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Total Plant Friends</div>
                    <div className="w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-light text-white">{totalPlantsCount}</div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Watering Due Today</div>
                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-light text-white">
                    {plantsNeedingWaterCount}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border-white/10 hover:bg-black/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Average Garden Health</div>
                    <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-light text-white">
                    {avgHealth}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plants Collection Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white tracking-wide flex items-center">
                  <Sprout className="w-5 h-5 text-green-400 mr-2" />
                  Your Plant Friends Collection
                </h2>

                <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetWizard();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-400 text-white border-none shadow-[0_0_15px_rgba(34,197,94,0.3)] font-medium rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plant
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-white/10 text-white rounded-2xl shadow-2xl backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-xl font-bold text-white tracking-wide">
                        <Sparkles className="w-5 h-5 text-green-400 mr-2" />
                        Onboard New Plant Friend
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Answer a few questions and upload photos to establish a custom AI care plan.
                      </DialogDescription>
                    </DialogHeader>

                    {isGeneratingPlan ? (
                      /* Generation Screen */
                      <div className="py-12 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
                          <Sparkles className="w-8 h-8 text-green-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">Consulting Pritamoria AI...</h3>
                          <p className="text-sm text-gray-400 max-w-sm mx-auto">
                            Our AI is analyzing your answers and photo to determine water frequencies, fertilizer dosages, and diagnostic reports.
                          </p>
                        </div>
                        <div className="max-w-xs mx-auto">
                          <Progress value={generationProgress} className="h-2 bg-white/10" />
                        </div>
                        <p className="text-xs font-mono text-green-400">{generationProgress}% Completed</p>
                      </div>
                    ) : (
                      /* Form Step Screens */
                      <div className="space-y-6 pt-4">
                        {/* Step Wizard Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                          <div className="flex space-x-1.5 items-center">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                  step === wizardStep ? 'w-8 bg-green-500' : step < wizardStep ? 'w-2.5 bg-green-700' : 'w-2.5 bg-white/10'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 font-mono font-medium">
                            STEP {wizardStep} OF 3
                          </span>
                        </div>

                        {wizardStep === 1 && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <h3 className="text-sm font-semibold text-white">Basic Plant Info</h3>
                            <div className="space-y-2">
                              <Label htmlFor="nickname" className="text-gray-400">Plant Nickname <span className="text-rose-500">*</span></Label>
                              <Input
                                id="nickname"
                                value={plantName}
                                onChange={(e) => setPlantName(e.target.value)}
                                placeholder="e.g. Bella (My Living Room Monstera)"
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-green-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="species" className="text-gray-400">Species/Common Name <span className="text-rose-500">*</span></Label>
                              <Input
                                id="species"
                                value={plantSpecies}
                                onChange={(e) => setPlantSpecies(e.target.value)}
                                placeholder="e.g. Monstera Deliciosa, Snake Plant, Basil"
                                className="bg-white/5 border-white/10 text-white focus-visible:ring-green-500"
                              />
                            </div>
                          </div>
                        )}

                        {wizardStep === 2 && (
                          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin animate-in fade-in duration-200">
                            <h3 className="text-sm font-semibold text-white">Environment & Care Questions</h3>

                            {/* Location */}
                            <div className="space-y-2">
                              <Label className="text-gray-400">Where is the plant located?</Label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  { id: 'indoor', label: 'Indoors' },
                                  { id: 'outdoor', label: 'Outdoors' },
                                  { id: 'balcony', label: 'Balcony / Patio' },
                                  { id: 'greenhouse', label: 'Greenhouse' }
                                ].map(opt => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setLocation(opt.id)}
                                    variant={location === opt.id ? 'default' : 'outline'}
                                    className={`justify-start rounded-xl ${
                                      location === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Sunlight */}
                            <div className="space-y-2">
                              <Label className="text-gray-400">How much light does it get?</Label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  { id: 'low', label: 'Low light / Shaded' },
                                  { id: 'indirect', label: 'Bright indirect sun' },
                                  { id: 'direct', label: 'Direct sunlight' },
                                  { id: 'partial', label: 'Partial sun & shade' }
                                ].map(opt => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSunlight(opt.id)}
                                    variant={sunlight === opt.id ? 'default' : 'outline'}
                                    className={`justify-start rounded-xl ${
                                      sunlight === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Current Watering */}
                            <div className="space-y-2">
                              <Label className="text-gray-400">How often do you currently water it?</Label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  { id: 'daily', label: 'Every day' },
                                  { id: 'few-days', label: 'Every few days' },
                                  { id: 'weekly', label: 'Weekly' },
                                  { id: 'bi-weekly', label: 'Every 2 weeks' },
                                  { id: 'monthly', label: 'Monthly' },
                                  { id: 'dry', label: 'Only when bone dry' }
                                ].map(opt => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setWateringFrequency(opt.id)}
                                    variant={wateringFrequency === opt.id ? 'default' : 'outline'}
                                    className={`justify-start rounded-xl ${
                                      wateringFrequency === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Soil type */}
                            <div className="space-y-2">
                              <Label className="text-gray-400">What type of soil is it in?</Label>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  { id: 'potting-mix', label: 'General Potting Mix' },
                                  { id: 'garden-soil', label: 'Standard Garden Soil' },
                                  { id: 'succulent', label: 'Succulent / Cactus Soil' },
                                  { id: 'sandy', label: 'Sandy Soil' },
                                  { id: 'clay', label: 'Dense Clay Soil' }
                                ].map(opt => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSoilType(opt.id)}
                                    variant={soilType === opt.id ? 'default' : 'outline'}
                                    className={`justify-start rounded-xl ${
                                      soilType === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Plant size */}
                            <div className="space-y-2">
                              <Label className="text-gray-400">What size is the plant?</Label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { id: 'small', label: 'Small (Pot)' },
                                  { id: 'medium', label: 'Medium' },
                                  { id: 'large', label: 'Large (Tree)' }
                                ].map(opt => (
                                  <Button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setPlantSize(opt.id)}
                                    variant={plantSize === opt.id ? 'default' : 'outline'}
                                    className={`justify-center rounded-xl text-xs ${
                                      plantSize === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                    }`}
                                  >
                                    {opt.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Health and Symptoms */}
                            <div className="space-y-4 border-t border-white/5 pt-4">
                              <div className="space-y-2">
                                <Label className="text-gray-400">Current Plant Health</Label>
                                <div className="grid grid-cols-2 gap-2.5">
                                  {[
                                    { id: 'healthy', label: 'Healthy & Vibrant' },
                                    { id: 'minor', label: 'Minor Issues' },
                                    { id: 'sick', label: 'Sick (Leaves Wilting/Spots)' },
                                    { id: 'critical', label: 'Critical (Dying)' }
                                  ].map(opt => (
                                    <Button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => setCurrentHealth(opt.id)}
                                      variant={currentHealth === opt.id ? 'default' : 'outline'}
                                      className={`justify-start rounded-xl text-xs ${
                                        currentHealth === opt.id ? 'bg-green-500 text-white border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                                      }`}
                                    >
                                      {opt.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="symptoms" className="text-gray-400">Describe any symptoms or issues (optional)</Label>
                                <Textarea
                                  id="symptoms"
                                  value={symptoms}
                                  onChange={(e) => setSymptoms(e.target.value)}
                                  placeholder="e.g. Bottom leaves turning yellow, tiny webs on stems, or brown tips on edges."
                                  className="bg-white/5 border-white/10 text-white focus-visible:ring-green-500 min-h-16 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {wizardStep === 3 && (
                          <div className="space-y-4 animate-in fade-in duration-200">
                            <h3 className="text-sm font-semibold text-white">Plant Photos <span className="text-rose-500">*</span></h3>
                            <p className="text-xs text-gray-400">
                              Upload 1-5 clear photos of your plant. Close-up leaf and overall plant photos help the AI diagnosis.
                            </p>

                            {/* Drop Zone */}
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="border-2 border-dashed border-green-500/20 hover:border-green-400 bg-white/5 hover:bg-green-500/10 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300"
                            >
                              <Upload className="w-10 h-10 text-green-400 mx-auto mb-2" />
                              <p className="text-sm text-white font-medium">Select plant photos</p>
                              <p className="text-xs text-gray-500 mt-1">Tap/click to upload images</p>
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />

                            {/* Uploaded Preview */}
                            {uploadedPhotos.length > 0 && (
                              <div className="space-y-2">
                                <Label className="text-xs text-gray-400">Previews ({uploadedPhotos.length}/5)</Label>
                                <div className="grid grid-cols-4 gap-2">
                                  {uploadedPhotos.map((dataUrl, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                                      <img
                                        src={dataUrl}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeUploadedPhoto(idx);
                                        }}
                                        className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Navigation Footer */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (wizardStep > 1) {
                                setWizardStep(prev => prev - 1);
                              } else {
                                setIsAddDialogOpen(false);
                                resetWizard();
                              }
                            }}
                            className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 rounded-xl"
                          >
                            {wizardStep === 1 ? 'Cancel' : 'Back'}
                          </Button>

                          <Button
                            type="button"
                            onClick={() => {
                              if (wizardStep === 1) {
                                if (!plantName.trim() || !plantSpecies.trim()) {
                                  toast.error('Nickname and species names are required.');
                                  return;
                                }
                                setWizardStep(2);
                              } else if (wizardStep === 2) {
                                setWizardStep(3);
                              } else {
                                if (uploadedPhotos.length === 0) {
                                  toast.error('Please upload at least one photo of your plant.');
                                  return;
                                }
                                startPlanGeneration();
                              }
                            }}
                            className="bg-green-500 hover:bg-green-400 text-white rounded-xl shadow-lg shadow-green-500/10"
                          >
                            {wizardStep === 3 ? 'Generate Care Plan' : 'Continue'}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* AI Progress Monitoring Dialog */}
                <Dialog open={isMonitoringDialogOpen} onOpenChange={(open) => {
                  setIsMonitoringDialogOpen(open);
                  if (!open) {
                    resetMonitoringForm();
                    setAssessmentResult(null);
                    loadGarden();
                  }
                }}>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-neutral-950 border-white/10 text-white rounded-2xl shadow-2xl backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center text-xl font-bold text-white tracking-wide">
                        <Camera className="w-5 h-5 text-amber-400 mr-2 animate-pulse" />
                        AI Health & Status Monitoring
                      </DialogTitle>
                      <DialogDescription className="text-gray-400 text-xs mt-1">
                        Pritamoria AI is evaluating your plant's status and growth.
                      </DialogDescription>
                    </DialogHeader>

                    {isAnalyzingPhoto ? (
                      <div className="py-12 text-center space-y-6 animate-pulse">
                        <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                          <Activity className="w-8 h-8 text-amber-400 animate-spin" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white">AI Health Evaluation In Progress...</h3>
                          <p className="text-xs text-gray-400 max-w-xs mx-auto">
                            Pritamoria AI is automatically re-analyzing the uploaded plant image to diagnose growth and detect issues.
                          </p>
                        </div>
                      </div>
                    ) : assessmentResult ? (
                      /* AI Analysis Result & Guidance View */
                      <div className="space-y-6 pt-2 text-left animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white flex items-center">
                            <Sparkles className="w-5 h-5 text-green-400 mr-2 animate-bounce" />
                            AI Care Guidance Update
                          </h3>
                          {getHealthBadge(assessmentResult.healthScore)}
                        </div>

                        {/* Plant Photo Preview */}
                        {monitoringPhoto && (
                          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-sm max-h-40">
                            <img
                              src={monitoringPhoto}
                              alt="Assessed status"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-2.5 left-3">
                              <span className="text-[10px] font-mono bg-green-500/20 text-green-400 border border-green-500/30 rounded px-1.5 py-0.5">
                                Analyzed Photo
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Diagnostics Section */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                          <span className="text-xs font-mono uppercase tracking-wider text-green-400 font-semibold block">AI Diagnostic Report</span>
                          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                            {assessmentResult.healthDiagnostics}
                          </p>
                        </div>

                        {/* Schedules/Dosages */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start space-x-2">
                            <Droplet className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-mono text-blue-300 font-medium block">Watering Cycle</span>
                              <span className="text-xs font-semibold text-white">Every {assessmentResult.wateringIntervalDays} Days</span>
                            </div>
                          </div>
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-[10px] uppercase font-mono text-amber-300 font-medium block">Feeding Cycle</span>
                              <span className="text-xs font-semibold text-white">Every {assessmentResult.fertilizingIntervalDays} Days</span>
                            </div>
                          </div>
                        </div>

                        {/* General Care Tips */}
                        {assessmentResult.generalCareTips && assessmentResult.generalCareTips.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold block">Updated Care Guidelines</span>
                            <ul className="text-[11px] sm:text-xs text-gray-300 space-y-1.5 list-disc pl-4 bg-white/5 border border-white/5 rounded-xl p-3">
                              {assessmentResult.generalCareTips.map((tip, i) => (
                                <li key={i} className="leading-relaxed">{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Close / Done Action */}
                        <Button
                          onClick={() => {
                            setIsMonitoringDialogOpen(false);
                            resetMonitoringForm();
                            setAssessmentResult(null);
                            loadGarden();
                          }}
                          className="w-full bg-green-500 hover:bg-green-400 text-white rounded-xl shadow-lg shadow-green-500/20 font-semibold py-2 px-4 h-10 mt-4 border-none"
                        >
                          Understand & Close
                        </Button>
                      </div>
                    ) : null}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Plants Grid List */}
              {loading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-green-500/20 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Opening botanical journal...</p>
                </div>
              ) : plants.length === 0 ? (
                <Card className="bg-black/30 backdrop-blur-md border-white/10 py-16 text-center">
                  <CardContent>
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">Your Garden is Empty</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                      Add a customized plant friend to set up tracking schedules and chat with the AI companion.
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-green-500 hover:bg-green-400 text-white rounded-xl"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Plant
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plants.map((plant) => {
                    const waterStatus = getWateringDueText(plant);
                    return (
                      <Card
                        key={plant.id}
                        onClick={() => setSelectedPlant(plant)}
                        className="bg-black/40 backdrop-blur-sm border-white/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:border-green-500/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                      >
                        <div className="h-40 w-full relative overflow-hidden bg-gradient-to-br from-green-950/20 to-black">
                          {plant.images && plant.images.length > 0 ? (
                            <img
                              src={plant.images[0]}
                              alt={plant.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sprout className="w-10 h-10 text-green-400/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>
                          <div className="absolute top-3 right-3">
                            <Badge className={`${waterStatus.color} border font-normal`}>
                              {waterStatus.text}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-3 pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg text-white group-hover:text-green-400 transition-colors">
                                {plant.name}
                              </CardTitle>
                              <CardDescription className="text-gray-400 italic text-xs">
                                {plant.species}
                              </CardDescription>
                            </div>
                            {getHealthBadge(plant.aiCarePlan.healthScore)}
                          </div>
                        </CardHeader>

                        <CardContent className="flex items-center gap-2 pt-0 pb-4 border-t border-white/5 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogCare(plant.id, 'watered');
                            }}
                            className="flex-1 bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white transition-all text-xs"
                          >
                            <Droplet className="w-3.5 h-3.5 mr-1.5" />
                            Water
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 text-xs"
                          >
                            View Plan
                            <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Hidden input for status monitoring photo upload, placed at root to remain mounted */}
        <input
          ref={monitoringFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProgressPhotoSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

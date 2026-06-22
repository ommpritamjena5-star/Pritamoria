import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft,
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  Activity,
  Bug,
  Droplets,
  Sun,
  Leaf,
  Camera,
  AlertCircle,
  TrendingUp,
  X,
  Eye,
  Search,
  Database,
  ExternalLink,
} from "lucide-react";
import {
  calculatePlantHealthScore,
  getAllDiseases,
} from "../utils/diseaseDetection";
import { detectDiseasesWithGemini } from "../utils/geminiAI";
import type { PlantDisease } from "../App";

interface DiseaseDetectionPageProps {
  onBack: () => void;
}

export function DiseaseDetectionPage({
  onBack,
}: DiseaseDetectionPageProps) {
  const [uploadedImages, setUploadedImages] = useState<
    string[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectedDiseases, setDetectedDiseases] = useState<
    PlantDisease[]
  >([]);
  const [healthScore, setHealthScore] = useState<number | null>(
    null,
  );
  const [healthStatus, setHealthStatus] = useState<
    | "healthy"
    | "minor-issues"
    | "needs-attention"
    | "critical"
    | null
  >(null);
  const [healthMessage, setHealthMessage] =
    useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Helper to wait
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setUploadedImages(
              [...uploadedImages, ...newImages].slice(0, 5),
            );
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(
      uploadedImages.filter((_, i) => i !== index),
    );
  };

  const analyzeImages = async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowResults(false);

    try {
      setAnalysisProgress(10);

      // Analyze with Pritamoria AI
      setAnalysisProgress(40);
      const diseases = await detectDiseasesWithGemini(uploadedImages);

      setAnalysisProgress(80);
      setDetectedDiseases(diseases);

      setAnalysisProgress(90);

      // Calculate health score
      const healthData = calculatePlantHealthScore(diseases);
      setHealthScore(healthData.score);
      setHealthStatus(healthData.status);
      setHealthMessage(healthData.message);

      setAnalysisProgress(100);

      // Show results
      setTimeout(() => {
        setShowResults(true);
        setActiveTab("results");
        setIsAnalyzing(false);
      }, 500);
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      alert(error instanceof Error ? error.message : 'Failed to analyze plant diseases. Please try again.');
    }
  };

  const resetAnalysis = () => {
    setUploadedImages([]);
    setDetectedDiseases([]);
    setHealthScore(null);
    setHealthStatus(null);
    setHealthMessage("");
    setShowResults(false);
    setActiveTab("upload");
  };

  const getSeverityColor = (
    severity: "low" | "medium" | "high",
  ) => {
    switch (severity) {
      case "low":
        return "bg-yellow-500";
      case "medium":
        return "bg-orange-500";
      case "high":
        return "bg-red-500";
    }
  };

  const getSeverityIcon = (
    severity: "low" | "medium" | "high",
  ) => {
    switch (severity) {
      case "low":
        return Info;
      case "medium":
        return AlertTriangle;
      case "high":
        return AlertCircle;
    }
  };

  const getHealthStatusColor = (
    status:
      | "healthy"
      | "minor-issues"
      | "needs-attention"
      | "critical",
  ) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "minor-issues":
        return "text-yellow-600 bg-yellow-100";
      case "needs-attention":
        return "text-orange-600 bg-orange-100";
      case "critical":
        return "text-red-600 bg-red-100";
    }
  };

  const allDiseases = getAllDiseases();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-black">
                <img src="/pritamoria_logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl text-white font-medium">Disease Detection</h1>
                <p className="text-sm text-gray-400">
                  AI-Powered Plant Health Analysis
                </p>
              </div>
            </div>
          </div>
          {showResults && (
            <Button
              onClick={resetAnalysis}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Data Source Reference Banner */}
        {/* <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <Database className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Disease Detection Database:</strong>{" "}
              Powered by PlantVillage Dataset with 38+ disease
              classes across 14 crop species
            </div>
            <div className="flex space-x-2 ml-4">
              <a
                href="https://www.kaggle.com/code/hk9088/plant-disese-detecton"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Kaggle Dataset
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="https://en.wikipedia.org/wiki/Plant_pathology"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Wikipedia Reference
              </a>
            </div>
          </AlertDescription>
        </Alert> */}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-black/40 backdrop-blur-md border border-white/10 text-gray-400">
            <TabsTrigger value="upload" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md font-medium transition-all duration-200">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!showResults}
              className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-md font-medium transition-all duration-200"
            >
              <Activity className="w-4 h-4 mr-2" />
              Analysis Results
            </TabsTrigger>
            {/* <TabsTrigger value="database">
              <Search className="w-4 h-4 mr-2" />
              Disease Database
            </TabsTrigger> */}
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upload Plant Images</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload 1-5 clear images of your plant showing
                  any symptoms or areas of concern. Multiple
                  angles and close-ups of affected areas will
                  improve accuracy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-rose-500/30 rounded-lg p-12 text-center hover:border-rose-400 hover:bg-rose-500/10 transition-all bg-black/20">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="disease-image-upload"
                    disabled={uploadedImages.length >= 5}
                  />
                  <label
                    htmlFor="disease-image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Camera className="w-16 h-16 text-rose-400 mb-4" />
                    <p className="text-white mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">
                      PNG, JPG up to 10MB (
                      {uploadedImages.length}/5 images)
                    </p>
                  </label>
                </div>

                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div>
                    <h3 className="mb-4">
                      Uploaded Images ({uploadedImages.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Analyzing images...
                      </span>
                      <span className="text-green-400">
                        {analysisProgress}%
                      </span>
                    </div>
                    <Progress
                      value={analysisProgress}
                      className="h-2 bg-white/10"
                    />
                  </div>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={analyzeImages}
                  disabled={
                    uploadedImages.length === 0 || isAnalyzing
                  }
                  className="w-full bg-green-500 hover:bg-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-none transition-all"
                  size="lg"
                >
                  {isAnalyzing
                    ? "Analyzing..."
                    : "Analyze for Diseases"}
                </Button>

                {/* Tips */}
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Pro Tips:</strong> For best results,
                    include close-up photos of affected leaves,
                    stems, or other plant parts. Good lighting
                    and focus are essential for accurate
                    detection.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {showResults && (
              <>
                {/* Health Score Card */}
                <Card className="border-white/10 bg-black/40 backdrop-blur-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl mb-2 text-white">
                          Plant Health Score
                        </h3>
                        <p className="text-gray-400">
                          {healthMessage}
                        </p>
                      </div>
                      <div className="text-center">
                        <div
                          className="text-5xl mb-2"
                          style={{
                            color:
                              healthScore && healthScore >= 80
                                ? "#22c55e"
                                : healthScore &&
                                  healthScore >= 60
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        >
                          {healthScore}
                        </div>
                        <Badge
                          className={
                            healthStatus
                              ? getHealthStatusColor(
                                healthStatus,
                              )
                              : ""
                          }
                        >
                          {healthStatus
                            ?.replace("-", " ")
                            .toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={healthScore || 0}
                      className="h-3 bg-white/10"
                    />
                  </CardContent>
                </Card>

                {/* Detected Diseases */}
                {detectedDiseases.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="text-xl">
                        Detected Issues (
                        {detectedDiseases.length})
                      </h3>
                      <Badge variant="outline" className="text-gray-300 border-white/20">
                        <Eye className="w-3 h-3 mr-1" />
                        AI Analysis
                      </Badge>
                    </div>

                    {detectedDiseases.map((disease, index) => {
                      const SeverityIcon = getSeverityIcon(
                        disease.severity,
                      );
                      return (
                        <Card
                          key={disease.id}
                          className="overflow-hidden bg-black/40 backdrop-blur-md border-white/10"
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-12 h-12 ${getSeverityColor(disease.severity)} rounded-lg flex items-center justify-center flex-shrink-0`}
                                >
                                  <SeverityIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg text-white">
                                    {disease.name}
                                  </CardTitle>
                                  <CardDescription className="mt-1 text-gray-400">
                                    {disease.description}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-300">
                                  Confidence
                                </div>
                                <div className="text-xl">
                                  {disease.confidence}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <Badge variant="outline" className="text-gray-300 border-white/20">
                                Severity:{" "}
                                {disease.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-gray-300 border-white/20">
                                Affects:{" "}
                                {disease.affectedParts.join(
                                  ", ",
                                )}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem value="symptoms">
                                <AccordionTrigger>
                                  <div className="flex items-center space-x-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>
                                      Symptoms (
                                      {disease.symptoms.length})
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {disease.symptoms.map(
                                      (symptom, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <span className="text-orange-500 mt-1">
                                            •
                                          </span>
                                          <span className="text-gray-300">
                                            {symptom}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="causes">
                                <AccordionTrigger>
                                  <div className="flex items-center space-x-2">
                                    <Info className="w-4 h-4" />
                                    <span>
                                      Causes (
                                      {disease.causes.length})
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {disease.causes.map(
                                      (cause, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <span className="text-blue-500 mt-1">
                                            •
                                          </span>
                                          <span className="text-gray-300">
                                            {cause}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="treatment">
                                <AccordionTrigger>
                                  <div className="flex items-center space-x-2">
                                    <Activity className="w-4 h-4" />
                                    <span>
                                      Treatment Plan (
                                      {disease.treatment.length}
                                      )
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {disease.treatment.map(
                                      (step, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <span className="text-green-500 mt-1 flex-shrink-0">
                                            {i + 1}.
                                          </span>
                                          <span className="text-gray-300">
                                            {step}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>

                              <AccordionItem value="prevention">
                                <AccordionTrigger>
                                  <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4" />
                                    <span>
                                      Prevention Tips (
                                      {
                                        disease.prevention
                                          .length
                                      }
                                      )
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {disease.prevention.map(
                                      (tip, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                          <span className="text-gray-300">
                                            {tip}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl mb-2">
                        Great News!
                      </h3>
                      <p className="text-gray-300">
                        No diseases detected in your plant
                        images. Your plant appears to be
                        healthy!
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* General Care Recommendations */}
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>General Care Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start space-x-3">
                        <Droplets className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <div className="text-sm mb-1">
                            Watering
                          </div>
                          <p className="text-sm text-gray-300">
                            Check soil moisture before watering.
                            Water at soil level.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Sun className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                          <div className="text-sm mb-1">
                            Lighting
                          </div>
                          <p className="text-sm text-gray-300">
                            Ensure appropriate light levels for
                            your plant species.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Leaf className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <div className="text-sm mb-1">
                            Inspection
                          </div>
                          <p className="text-sm text-gray-300">
                            Regularly inspect leaves and stems
                            for early disease signs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Disease Database Tab - Hidden */}
          {/* 
          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl mb-1">
                    {allDiseases.length}
                  </div>
                  <div className="text-sm text-gray-300">
                    Total Diseases
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Leaf className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl mb-1">14</div>
                  <div className="text-sm text-gray-300">
                    Plant Species
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Shield className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl mb-1">38+</div>
                  <div className="text-sm text-gray-300">
                    Disease Classes
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl mb-1">
                    AI-Powered
                  </div>
                  <div className="text-sm text-gray-300">
                    Detection System
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Plant Disease Database</CardTitle>
                <CardDescription>
                  Browse our comprehensive database based on the
                  PlantVillage Dataset with symptoms,
                  treatments, and prevention strategies. Click
                  on any disease for detailed information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allDiseases.map((disease) => {
                    const SeverityIcon = getSeverityIcon(
                      disease.severity,
                    );
                    return (
                      <Card
                        key={disease.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-10 h-10 ${getSeverityColor(disease.severity)} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <SeverityIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">
                                {disease.name}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {disease.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline">
                              Severity:{" "}
                              {disease.severity.toUpperCase()}
                            </Badge>
                            {disease.plantType && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {disease.plantType}
                              </Badge>
                            )}
                          </div>
                          {(disease.wikipediaUrl ||
                            disease.kaggleReference) && (
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              {disease.wikipediaUrl && (
                                <a
                                  href={disease.wikipediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Wikipedia
                                </a>
                              )}
                              {disease.kaggleReference && (
                                <a
                                  href={disease.kaggleReference}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Database className="w-3 h-3 mr-1" />
                                  Dataset
                                </a>
                              )}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="info">
                              <AccordionTrigger>
                                View Details
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4">
                                <div>
                                  <div className="text-sm mb-2 flex items-center space-x-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                    <span>Symptoms</span>
                                  </div>
                                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                                    {disease.symptoms
                                      .slice(0, 3)
                                      .map((symptom, i) => (
                                        <li key={i}>
                                          • {symptom}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                                <div>
                                  <div className="text-sm mb-2 flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    <span>Key Treatments</span>
                                  </div>
                                  <ul className="text-sm text-gray-300 space-y-1 ml-6">
                                    {disease.treatment
                                      .slice(0, 3)
                                      .map((treatment, i) => (
                                        <li key={i}>
                                          • {treatment}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          */}
        </Tabs>
      </main>
    </div>
  );
}
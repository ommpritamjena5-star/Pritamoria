import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  CheckCircle,
  Leaf,
  AlertCircle,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchWikipediaData,
  generateCareInstructions,
  generateAdvantages,
  generateDisadvantages,
  generateCommonDiseases
} from '../utils/plantIdentification';
import {
  analyzeImageFeatures,
  matchPlantByFeatures,
  plantDatabase
} from '../utils/imageAnalysis';
import { analyzePlantImagesWithGemini } from '../utils/geminiAI';
import type { PlantIdentification } from '../App';

// Helper function to convert File to Base64 Data URL
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface IdentificationPageProps {
  onPlantIdentified: (plant: PlantIdentification) => void;
  onBack: () => void;
}

export function IdentificationPage({ onPlantIdentified, onBack }: IdentificationPageProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (uploadedImages.length + files.length > 5) {
      toast.error('You can upload maximum 5 images');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }

      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }

      return true;
    });

    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (uploadedImages.length < 2) {
      toast.error('Please upload at least 2 images for better accuracy');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      setAnalysisProgress(10);
      toast.info('Preparing images for AI analysis...');

      // Convert all uploaded files to Data URLs for Gemini
      const dataUrls = await Promise.all(uploadedImages.map(fileToDataUrl));

      setAnalysisProgress(40);
      toast.success('Analyzing with expert botanical AI...');

      // Call Gemini API
      const identifiedPlant = await analyzePlantImagesWithGemini(dataUrls);

      setAnalysisProgress(90);

      // Complete analysis
      setAnalysisProgress(100);

      // Brief delay to show completion
      setTimeout(() => {
        setIsAnalyzing(false);
        onPlantIdentified(identifiedPlant);
        toast.success(`Plant identified as ${identifiedPlant.name} with ${Math.round(identifiedPlant.confidence)}% confidence!`);
      }, 800);

    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze plant. Please try again with clearer images.');
    }
  };

  // Combine features from multiple images for better accuracy
  const combineImageFeatures = (features: any[]) => {
    if (features.length === 0) return null;
    if (features.length === 1) return features[0];

    // Combine colors by frequency
    const allColors = features.flatMap(f => f.colors.dominant);
    const colorCounts: { [key: string]: number } = {};
    allColors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });

    const dominantColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color);

    // Combine other features by taking most common
    const combinedShapes = [...new Set(features.flatMap(f => f.shapes.leafShape))];
    const combinedTextures = [...new Set(features.flatMap(f => f.textures.surface))];

    return {
      colors: {
        dominant: dominantColors,
        secondary: features[0].colors.secondary,
        hasVariegation: features.some(f => f.colors.hasVariegation),
        colorIntensity: features[0].colors.colorIntensity
      },
      shapes: {
        leafShape: combinedShapes,
        plantStructure: features[0].shapes.plantStructure,
        symmetry: features[0].shapes.symmetry,
        edgeType: features[0].shapes.edgeType
      },
      textures: {
        surface: combinedTextures,
        patterns: features[0].textures.patterns,
        glossiness: features[0].textures.glossiness
      },
      size: features[0].size,
      patterns: features[0].patterns,
      structure: features[0].structure
    };
  };

  // Calculate confidence based on feature matching
  const calculateConfidence = (features: any, plant: any) => {
    let matches = 0;
    let total = 0;

    // Color matching (30% weight)
    const colorMatches = features.colors.dominant.filter((color: string) =>
      plant.visualFeatures.colors.some((plantColor: string) =>
        color.includes(plantColor) || plantColor.includes(color)
      )
    ).length;
    matches += colorMatches * 3;
    total += features.colors.dominant.length * 3;

    // Shape matching (25% weight)
    const shapeMatches = features.shapes.leafShape.filter((shape: string) =>
      plant.visualFeatures.leafShape.some((plantShape: string) =>
        shape.includes(plantShape) || plantShape.includes(shape)
      )
    ).length;
    matches += shapeMatches * 2.5;
    total += features.shapes.leafShape.length * 2.5;

    // Texture matching (20% weight)
    const textureMatches = features.textures.surface.filter((texture: string) =>
      plant.visualFeatures.texture.some((plantTexture: string) =>
        texture.includes(plantTexture) || plantTexture.includes(texture)
      )
    ).length;
    matches += textureMatches * 2;
    total += features.textures.surface.length * 2;

    // Size matching (15% weight)
    if (features.size.plantSize === plant.visualFeatures.size) {
      matches += 1.5;
    }
    total += 1.5;

    // Structure matching (10% weight)
    const structureMatches = features.structure.arrangement.filter((arr: string) =>
      plant.visualFeatures.structure.some((plantStruct: string) =>
        arr.includes(plantStruct) || plantStruct.includes(arr)
      )
    ).length;
    matches += structureMatches;
    total += features.structure.arrangement.length;

    const confidence = total > 0 ? (matches / total) * 100 : 50;
    return Math.max(Math.min(confidence, 98), 75); // Cap between 75-98%
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-black">
              <img src="/pritamoria_logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-medium">Plant Identification</span>
          </div>
        </div>

        {!isAnalyzing ? (
          <div className="space-y-8">
            {/* Instructions */}
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5 text-green-400" />
                  <span>AI Plant Identification</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload 2-5 clear photos of your plant for accurate identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-medium">📸 Photo Tips:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Take photos in good lighting</li>
                      <li>• Include leaves, flowers, and stems</li>
                      <li>• Capture different angles</li>
                      <li>• Show the overall plant structure</li>
                    </ul>
                  </div>
                  <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-medium">🎯 Best Results:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 4-5 photos recommended</li>
                      <li>• Close-up and wide shots</li>
                      <li>• Focus on unique features</li>
                      <li>• Clear, unblurred images</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-blue-300">
                    More photos = higher accuracy. Our AI analyzes multiple angles for better identification.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardContent className="pt-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-green-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 hover:bg-green-500/10 transition-all bg-black/20"
                >
                  <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg text-white mb-2">Upload Plant Photos</h3>
                  <p className="text-gray-400 mb-4">
                    Click to select or drag and drop your images here
                  </p>
                  <Button variant="outline" className="border-green-500/30 text-green-400 bg-transparent hover:bg-green-500/20 hover:text-green-300">
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Uploaded Images */}
            {uploadedImages.length > 0 && (
              <Card className="bg-black/40 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>Uploaded Images ({uploadedImages.length}/5)</span>
                    <Badge variant="outline" className={uploadedImages.length >= 4 ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-yellow-500 text-yellow-400 bg-yellow-500/10'}>
                      {uploadedImages.length >= 4 ? 'Excellent' : uploadedImages.length >= 2 ? 'Good' : 'Add More'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={startAnalysis}
                    className="w-full bg-green-500 hover:bg-green-400 text-white border-none shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all mt-4"
                    size="lg"
                    disabled={uploadedImages.length === 0}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Identify Plant with AI
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Analysis in Progress */
          <Card className="text-center bg-black/40 backdrop-blur-md border-white/10">
            <CardContent className="pt-12 pb-12">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Brain className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
              <h3 className="text-xl mb-4 text-white">AI Analysis in Progress</h3>
              <p className="text-gray-400 mb-6">
                Our advanced AI is analyzing your plant images...
              </p>
              <div className="max-w-md mx-auto mb-4">
                <Progress value={analysisProgress} className="h-2 bg-white/10" />
              </div>
              <p className="text-sm text-gray-300">{analysisProgress}% Complete</p>

              <div className="mt-8 text-left max-w-md mx-auto">
                <h4 className="text-sm font-medium mb-2 text-white">Analysis Steps:</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`w-4 h-4 ${analysisProgress >= 10 ? 'text-green-400' : 'text-gray-400'}`} />
                    <span>Preparing images {analysisProgress >= 10 ? 'complete' : 'in progress...'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysisProgress >= 40 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : analysisProgress >= 10 ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-green-400 rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>
                    )}
                    <span>Sending to Pritamoria AI {analysisProgress >= 40 ? 'complete' : analysisProgress >= 10 ? 'in progress...' : 'pending'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysisProgress >= 90 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : analysisProgress >= 40 ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-green-400 rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>
                    )}
                    <span>Expert AI Analysis & Diagnostics {analysisProgress >= 90 ? 'complete' : analysisProgress >= 40 ? 'analyzing...' : 'pending'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {analysisProgress >= 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : analysisProgress >= 90 ? (
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-green-400 rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>
                    )}
                    <span>Finalizing results {analysisProgress >= 100 ? 'complete' : analysisProgress >= 90 ? 'in progress...' : 'pending'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
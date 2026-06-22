import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Leaf, 
  Shield, 
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bug,
  ExternalLink,
  Eye,
  Palette,
  Shapes
} from 'lucide-react';
import { AdvancedAnalysisCard } from './AdvancedAnalysisCard';
import type { PlantIdentification } from '../App';

interface PlantResultPageProps {
  plant: PlantIdentification;
  onBack: () => void;
  onNewIdentification: () => void;
}

export function PlantResultPage({ plant, onBack, onNewIdentification }: PlantResultPageProps) {
  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
          <Button onClick={onNewIdentification} className="bg-green-500 hover:bg-green-400 text-white border-none shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Camera className="w-4 h-4 mr-2" />
            Identify Another Plant
          </Button>
        </div>

        {/* Identification Result Header */}
        <Card className="mb-8 bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white mb-1">{plant.name}</CardTitle>
                  <CardDescription className="text-xl italic font-medium text-gray-400 mb-2">
                    {plant.scientificName}
                  </CardDescription>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                      {plant.confidence}% Match
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 capitalize border-white/20 text-gray-300">
                      {plant.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Identified Plant</div>
                <div className="text-2xl font-bold text-green-400">{plant.confidence}%</div>
                <div className="text-sm text-gray-300">Confidence</div>
              </div>
            </div>
          </CardHeader>
          
          {/* Plant Name Verification */}
          <CardContent className="pt-0">
            <div className={`rounded-lg p-4 mb-4 ${
              plant.analysisDetails?.verificationStatus === 'verified' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-blue-500/10 border border-blue-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className={`w-5 h-5 ${
                  plant.analysisDetails?.verificationStatus === 'verified' 
                    ? 'text-green-400' 
                    : 'text-blue-400'
                }`} />
                <span className={`font-semibold ${
                  plant.analysisDetails?.verificationStatus === 'verified' 
                    ? 'text-green-300' 
                    : 'text-blue-300'
                }`}>
                  {plant.analysisDetails?.verificationStatus === 'verified' 
                    ? 'Verified Plant Identification' 
                    : 'Cross-Referenced Plant Identification'}
                </span>
                {plant.analysisDetails?.verificationStatus === 'verified' && (
                  <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">
                    Botanically Verified
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium text-gray-400">Primary Name:</span>
                  <div className="text-white font-medium">{plant.name}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Scientific Name:</span>
                  <div className="text-gray-300 italic">{plant.scientificName}</div>
                </div>
              </div>

              {plant.analysisDetails?.alternativeNames && plant.analysisDetails.alternativeNames.length > 0 && (
                <div className="mb-3">
                  <span className="font-medium text-gray-400 text-sm">Alternative Names:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plant.analysisDetails.alternativeNames.slice(0, 4).map((name, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {plant.analysisDetails?.matchedFeatures && (
                <div className="pt-3 border-t border-green-500/20">
                  <span className="font-medium text-gray-400 text-sm">Key Matched Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {plant.analysisDetails.matchedFeatures.slice(0, 5).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white">
                        {feature.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              {plant.description}
            </p>
            {plant.wikipediaUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(plant.wikipediaUrl, '_blank')}
                className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 bg-transparent"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn more on Wikipedia
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Analysis Details */}
        {plant.analysisDetails && (
          <Card className="mb-8 bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Eye className="w-5 h-5 text-blue-400" />
                <span>Visual Analysis Results</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Features detected from your uploaded images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-2 text-white">
                    <Palette className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium">Detected Colors</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plant.analysisDetails.detectedColors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-black/30 text-white">
                        {color.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-2 text-white">
                    <Shapes className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Leaf Shape</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plant.analysisDetails.leafShape.map((shape, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-black/30 text-white">
                        {shape.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-2 text-white">
                    <Leaf className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">Texture & Size</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plant.analysisDetails.textureFeatures.map((texture, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-black/30 text-white">
                        {texture}
                      </Badge>
                    ))}
                    <Badge variant="secondary" className="text-xs bg-black/30 text-white border border-white/20">
                      {plant.analysisDetails.sizeCategory} size
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Uploaded Images */}
        <Card className="mb-8 bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Uploaded Images</CardTitle>
            <CardDescription className="text-gray-400">
              Images analyzed for plant identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {plant.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Plant image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Analysis Results */}
        {plant.analysisDetails?.advancedAnalysis && (
          <div className="mb-8">
            <AdvancedAnalysisCard advancedAnalysis={plant.analysisDetails.advancedAnalysis} />
          </div>
        )}

        {/* Disease Detection Results */}
        {plant.diseaseAnalysis && (
          <Card className="mb-8 bg-black/40 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>Plant Health Analysis</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-powered disease detection and health assessment
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    plant.diseaseAnalysis.healthStatus === 'healthy' ? 'text-green-400' :
                    plant.diseaseAnalysis.healthStatus === 'minor-issues' ? 'text-yellow-400' :
                    plant.diseaseAnalysis.healthStatus === 'needs-attention' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {plant.diseaseAnalysis.healthScore}
                  </div>
                  <div className="text-sm text-gray-400">Health Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Health Status Banner */}
              <div className={`rounded-lg p-4 mb-6 ${
                plant.diseaseAnalysis.healthStatus === 'healthy' ? 'bg-green-500/10 border border-green-500/20' :
                plant.diseaseAnalysis.healthStatus === 'minor-issues' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                plant.diseaseAnalysis.healthStatus === 'needs-attention' ? 'bg-orange-500/10 border border-orange-500/20' :
                'bg-red-500/10 border border-red-500/20'
              }`}>
                <div className="flex items-center space-x-3">
                  {plant.diseaseAnalysis.healthStatus === 'healthy' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${
                      plant.diseaseAnalysis.healthStatus === 'healthy' ? 'text-green-300' :
                      plant.diseaseAnalysis.healthStatus === 'minor-issues' ? 'text-yellow-300' :
                      plant.diseaseAnalysis.healthStatus === 'needs-attention' ? 'text-orange-300' :
                      'text-red-300'
                    }`}>
                      {plant.diseaseAnalysis.healthStatus === 'healthy' ? 'Healthy Plant' :
                       plant.diseaseAnalysis.healthStatus === 'minor-issues' ? 'Minor Issues Detected' :
                       plant.diseaseAnalysis.healthStatus === 'needs-attention' ? 'Needs Attention' :
                       'Critical Condition'}
                    </h4>
                    <p className="text-gray-300 text-sm mt-1">
                      {plant.diseaseAnalysis.healthMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detected Diseases */}
              {plant.diseaseAnalysis.diseases.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-white mb-3">Detected Issues ({plant.diseaseAnalysis.diseases.length})</h4>
                  {plant.diseaseAnalysis.diseases.map((disease) => (
                    <Card key={disease.id} className="border border-white/10 bg-white/5">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{disease.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              disease.severity === 'high' ? 'bg-red-500' :
                              disease.severity === 'medium' ? 'bg-orange-500' :
                              'bg-yellow-500'
                            }>
                              {disease.severity} severity
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-gray-300">
                              {disease.confidence}% match
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-gray-400">{disease.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="symptoms" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-white/10 text-gray-400">
                            <TabsTrigger value="symptoms" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">Symptoms</TabsTrigger>
                            <TabsTrigger value="causes" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">Causes</TabsTrigger>
                            <TabsTrigger value="treatment" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">Treatment</TabsTrigger>
                            <TabsTrigger value="prevention" className="text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">Prevention</TabsTrigger>
                          </TabsList>

                          <TabsContent value="symptoms" className="mt-3">
                            <ul className="space-y-2 text-sm">
                              {disease.symptoms.map((symptom, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>

                          <TabsContent value="causes" className="mt-3">
                            <ul className="space-y-2 text-sm">
                              {disease.causes.map((cause, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{cause}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>

                          <TabsContent value="treatment" className="mt-3">
                            <ul className="space-y-2 text-sm">
                              {disease.treatment.map((step, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>

                          <TabsContent value="prevention" className="mt-3">
                            <ul className="space-y-2 text-sm">
                              {disease.prevention.map((tip, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-300">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Diseases Detected</h4>
                  <p className="text-gray-400">
                    Your plant appears healthy with no visible disease symptoms. Continue with regular care and monitoring.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Information Tabs */}
        <Card className="bg-black/40 backdrop-blur-md border-white/10">
          <CardContent className="pt-6">
            <Tabs defaultValue="advantages" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-white/10 text-gray-400">
                <TabsTrigger value="advantages" className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Advantages</span>
                </TabsTrigger>
                <TabsTrigger value="disadvantages" className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Disadvantages</span>
                </TabsTrigger>
                <TabsTrigger value="care" className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Care</span>
                </TabsTrigger>
                <TabsTrigger value="diseases" className="flex items-center space-x-1 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm font-medium transition-all duration-200">
                  <Bug className="w-4 h-4" />
                  <span className="hidden sm:inline">Diseases</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="advantages" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 text-white">
                    <ThumbsUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg">Plant Advantages & Benefits</h3>
                  </div>
                  <div className="grid gap-3">
                    {plant.advantages.map((advantage, index) => (
                      <Card key={index} className="border-green-500/20 bg-green-500/10">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">{advantage}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="disadvantages" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 text-white">
                    <ThumbsDown className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg">Potential Disadvantages & Challenges</h3>
                  </div>
                  <div className="grid gap-3">
                    {plant.disadvantages.map((disadvantage, index) => (
                      <Card key={index} className="border-orange-500/20 bg-orange-500/10">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-300">{disadvantage}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="care" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 text-white">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg">Care Instructions & Tips</h3>
                  </div>
                  <div className="grid gap-3">
                    {plant.careInstructions.map((instruction, index) => (
                      <Card key={index} className="border-blue-500/20 bg-blue-500/10">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <Leaf className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-300">{instruction}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Card className="border-green-500/30 bg-green-500/10 mt-6">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-400 mt-1" />
                        <div>
                          <h4 className="font-medium text-green-300 mb-2">Pro Tip</h4>
                          <p className="text-green-200/80 text-sm">
                            Monitor your plant regularly and adjust care based on seasonal changes. 
                            Each plant is unique and may need slight modifications to these general guidelines.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="diseases" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4 text-white">
                    <Bug className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg">Common Diseases & Protection</h3>
                  </div>
                  <div className="grid gap-3">
                    {plant.commonDiseases.map((disease, index) => (
                      <Card key={index} className="border-red-500/20 bg-red-500/10">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-300 mb-2">{disease}</p>
                              <div className="text-sm text-red-300/90">
                                <strong>Prevention:</strong> {getPreventionTip(disease)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="border-blue-500/20 bg-blue-500/10 mt-6">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-400 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-300 mb-2">General Protection Tips</h4>
                          <ul className="text-blue-200/80 text-sm space-y-1">
                            <li>• Ensure proper drainage to prevent root rot</li>
                            <li>• Maintain appropriate humidity levels</li>
                            <li>• Regular inspection for early problem detection</li>
                            <li>• Quarantine new plants before introducing to collection</li>
                            <li>• Use clean tools when pruning or repotting</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onNewIdentification} size="lg" className="bg-green-500 hover:bg-green-400 text-white border-none shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <Camera className="w-5 h-5 mr-2" />
            Identify Another Plant
          </Button>
          <Button variant="outline" size="lg" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
            <BookOpen className="w-5 h-5 mr-2" />
            Save to My Plants
          </Button>
        </div>

        {/* Thank You Section */}
        <div className="mt-12 text-center py-8">
          <h3 className="text-xl mb-2 text-white/90">Thank You for Using Pritamoria</h3>
          <p className="text-gray-400">
            We hope this information helps you better understand and care for your plant!
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate prevention tips (could be moved to a utils file)
function getPreventionTip(disease: string): string {
  const tips: { [key: string]: string } = {
    'root rot': 'Ensure well-draining soil and avoid overwatering',
    'spider mites': 'Maintain higher humidity and regular misting',
    'yellowing leaves': 'Provide bright, indirect light and check watering schedule',
    'brown leaf tips': 'Use filtered water and increase humidity around the plant'
  };
  
  const lowerDisease = disease.toLowerCase();
  for (const key in tips) {
    if (lowerDisease.includes(key)) {
      return tips[key];
    }
  }
  
  return 'Maintain proper care conditions and monitor plant health regularly';
}
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Search,
  Leaf,
  Bug,
  Droplets,
  Sun,
  Scissors,
  Heart,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Shield
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getAllDiseases } from '../utils/diseaseDetection';

interface CareAndRemediesPageProps {
  onBack: () => void;
}

export function CareAndRemediesPage({ onBack }: CareAndRemediesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const careCategories = [
    {
      id: 'watering',
      icon: Droplets,
      title: 'Watering Guide',
      description: 'Learn proper watering techniques for different plant types',
      color: 'bg-blue-500'
    },
    {
      id: 'lighting',
      icon: Sun,
      title: 'Light Requirements',
      description: 'Understanding light needs for healthy plant growth',
      color: 'bg-yellow-500'
    },
    {
      id: 'pruning',
      icon: Scissors,
      title: 'Pruning & Maintenance',
      description: 'Proper pruning techniques to keep plants healthy',
      color: 'bg-purple-500'
    },
    {
      id: 'diseases',
      icon: Bug,
      title: 'Disease Prevention',
      description: 'Identify and prevent common plant diseases',
      color: 'bg-red-500'
    }
  ];

  const commonDiseases = [
    {
      name: 'Root Rot',
      symptoms: ['Yellowing leaves', 'Soft, brown roots', 'Wilting despite moist soil'],
      causes: ['Overwatering', 'Poor drainage', 'Contaminated soil'],
      treatment: ['Stop watering immediately', 'Remove affected roots', 'Repot in fresh, well-draining soil'],
      prevention: ['Use well-draining soil', 'Water only when top soil is dry', 'Ensure proper drainage holes'],
      severity: 'high'
    },
    {
      name: 'Spider Mites',
      symptoms: ['Fine webbing on leaves', 'Yellow stippling', 'Tiny moving dots on leaves'],
      causes: ['Low humidity', 'Warm, dry conditions', 'Poor air circulation'],
      treatment: ['Increase humidity', 'Rinse leaves with water', 'Use insecticidal soap'],
      prevention: ['Maintain 50%+ humidity', 'Regular misting', 'Good air circulation'],
      severity: 'medium'
    },
    {
      name: 'Powdery Mildew',
      symptoms: ['White powdery coating on leaves', 'Stunted growth', 'Leaf distortion'],
      causes: ['High humidity with poor air flow', 'Overcrowding', 'Cool temperatures'],
      treatment: ['Improve air circulation', 'Reduce humidity', 'Apply fungicide'],
      prevention: ['Space plants properly', 'Avoid overhead watering', 'Ensure good ventilation'],
      severity: 'medium'
    },
    {
      name: 'Aphids',
      symptoms: ['Small green/black insects', 'Sticky honeydew', 'Curled leaves'],
      causes: ['New growth attracts aphids', 'Overcrowding', 'Stressed plants'],
      treatment: ['Rinse with water', 'Use insecticidal soap', 'Introduce beneficial insects'],
      prevention: ['Regular inspection', 'Healthy plant care', 'Avoid over-fertilizing'],
      severity: 'low'
    }
  ];

  const careGuides = [
    {
      category: 'Watering',
      tips: [
        'Check soil moisture before watering - stick finger 1-2 inches into soil',
        'Water thoroughly until it drains from the bottom holes',
        'Use room temperature water to avoid shocking roots',
        'Water in the morning to allow leaves to dry during the day',
        'Reduce watering frequency in winter when growth slows'
      ]
    },
    {
      category: 'Lighting',
      tips: [
        'Most houseplants prefer bright, indirect light',
        'Rotate plants weekly for even growth',
        'Move plants closer to windows in winter',
        'Use grow lights for plants in low-light areas',
        'Watch for signs of too much light: bleached or brown leaves'
      ]
    },
    {
      category: 'Humidity',
      tips: [
        'Most tropical plants prefer 40-60% humidity',
        'Group plants together to increase local humidity',
        'Use a humidifier during dry seasons',
        'Place plants on pebble trays with water',
        'Mist around (not directly on) plants occasionally'
      ]
    },
    {
      category: 'Fertilizing',
      tips: [
        'Feed during growing season (spring and summer)',
        'Use diluted fertilizer to prevent root burn',
        'Reduce or stop fertilizing in winter',
        'Choose fertilizer based on plant type',
        'Flush soil occasionally to prevent salt buildup'
      ]
    }
  ];

  const dbDiseases = getAllDiseases()
    .filter(d => !d.name.toLowerCase().includes('healthy'))
    .map(d => ({
      name: d.name,
      symptoms: d.symptoms,
      causes: d.causes,
      treatment: d.treatment,
      prevention: d.prevention,
      severity: d.severity
    }));

  const allAvailableDiseases = [...commonDiseases];
  dbDiseases.forEach(dbD => {
    if (!allAvailableDiseases.some(d => d.name === dbD.name)) {
      allAvailableDiseases.push(dbD);
    }
  });

  const filteredDiseases = allAvailableDiseases.filter(disease =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
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
            <span className="text-green-500 text-xl font-bold tracking-wider">Plant Care & Remedies</span>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-gradient-to-br from-black/60 to-green-900/20 backdrop-blur-xl border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl text-white font-bold">
              <Heart className="w-6 h-6 text-green-400 animate-pulse" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">Comprehensive Plant Care Guide</span>
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Learn how to keep your plants healthy and treat common problems with expert advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative group overflow-hidden rounded-xl border border-green-500/30">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758448183463-ff819a37f9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGxlYWYlMjBpZGVudGlmaWNhdGlvbiUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NTkxMzU5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Healthy plants"
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
                <div className="text-white transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                  <h3 className="text-3xl font-bold mb-2 text-green-300">Expert Plant Care</h3>
                  <p className="text-green-100/80 font-light">Prevention is better than cure</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="care-guides" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/60 backdrop-blur-xl border border-green-500/20 text-gray-400 p-1 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <TabsTrigger value="care-guides" className="flex items-center space-x-2 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:text-green-400 rounded-lg transition-all duration-300">
              <Leaf className="w-4 h-4" />
              <span className="font-medium tracking-wide">Care Guides</span>
            </TabsTrigger>
            <TabsTrigger value="disease-remedies" className="flex items-center space-x-2 text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-rose-400 rounded-lg transition-all duration-300">
              <Bug className="w-4 h-4" />
              <span className="font-medium tracking-wide">Disease Remedies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="care-guides">
            {/* Care Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {careCategories.map((category) => (
                <Card key={category.id} className="group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-300 cursor-pointer bg-black/60 backdrop-blur-xl border-white/10 hover:border-green-500/30">
                  <CardHeader className="pb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors"></div>
                    <div className={`w-14 h-14 ${category.color} bg-opacity-20 border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors">{category.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-400 mt-2 leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Care Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {careGuides.map((guide, index) => (
                <Card key={index} className="bg-black/60 backdrop-blur-xl border-white/10 hover:border-yellow-500/30 transition-colors duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                  <CardHeader className="border-b border-white/5 bg-white/5">
                    <CardTitle className="flex items-center space-x-3 text-white">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-yellow-400 animate-pulse" />
                      </div>
                      <span className="text-xl tracking-wide">{guide.category} Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {guide.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          </div>
                          <p className="text-gray-300 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disease-remedies">
            {/* Search */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-2xl group">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl group-focus-within:bg-rose-500/40 transition-colors duration-500"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-rose-400 w-5 h-5 z-10" />
                <Input
                  placeholder="Search diseases or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg bg-black/60 backdrop-blur-xl border-rose-500/30 text-white placeholder:text-gray-500 rounded-full focus:border-rose-400 focus:ring-rose-400/50 relative z-10 shadow-2xl"
                />
              </div>
            </div>

            {/* Disease Cards */}
            <div className="grid gap-8">
              {filteredDiseases.map((disease, index) => (
                <Card key={index} className="overflow-hidden bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl border-white/10 hover:border-rose-500/30 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] group">
                  <CardHeader className="border-b border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <CardTitle className="flex items-center space-x-3 text-white">
                        <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                          <Bug className="w-6 h-6 text-rose-400" />
                        </div>
                        <span className="text-2xl tracking-wide">{disease.name}</span>
                      </CardTitle>
                      <Badge variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/10 px-4 py-1 text-sm uppercase tracking-wider">
                        {disease.severity} severity
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-medium text-rose-400 mb-2 flex items-center space-x-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Symptoms</span>
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {disease.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-rose-500">•</span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-medium text-orange-400 mb-2">Causes</h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {disease.causes.map((cause, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="text-orange-500">•</span>
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-medium text-blue-400 mb-2 flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>Treatment</span>
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {disease.treatment.map((treatment, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span>{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h4 className="font-medium text-green-400 mb-2 flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>Prevention</span>
                          </h4>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {disease.prevention.map((prevention, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{prevention}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDiseases.length === 0 && (
              <Card className="text-center py-12 bg-black/40 backdrop-blur-md border-white/10">
                <CardContent>
                  <Bug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg mb-2 text-white">No diseases found</h3>
                  <p className="text-gray-400">
                    Try searching for different symptoms or disease names
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Emergency Contact */}
        <Card className="mt-12 border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <h4 className="font-medium text-yellow-400 mb-2">Plant Emergency?</h4>
                <p className="text-yellow-200/80 text-sm mb-3">
                  If your plant is severely affected and these remedies don't help within a few days,
                  consider consulting with a local garden center or plant specialist.
                </p>
                <Button variant="outline" size="sm" className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/20 bg-transparent">
                  Find Local Expert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thank You Section */}
        <div className="mt-12 text-center py-8">
          <h3 className="text-xl mb-2 text-white/90">Thank You for Caring for Plants</h3>
          <p className="text-gray-400">
            Healthy plants make for a healthier environment. Keep learning and growing!
          </p>
        </div>
      </div>
    </div>
  );
}
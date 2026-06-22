import React, { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { IdentificationPage } from './components/IdentificationPage';
import { CareAndRemediesPage } from './components/CareAndRemediesPage';
import { DiseaseDetectionPage } from './components/DiseaseDetectionPage';
import { PlantResultPage } from './components/PlantResultPage';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { GardenPage } from './components/GardenPage';
// import { ViewUserData } from './components/ViewUserData';
import { Toaster } from './components/ui/sonner';
import { Chatbot } from './components/Chatbot';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type PlantDisease = {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  affectedParts: string[];
};

export type PlantIdentification = {
  id: string;
  name: string;
  scientificName: string;
  type: 'plant' | 'tree' | 'flower' | 'fruit' | 'vegetable';
  confidence: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
  careInstructions: string[];
  commonDiseases: string[];
  images: string[];
  wikipediaUrl?: string;
  analysisDetails?: {
    detectedColors: string[];
    leafShape: string[];
    textureFeatures: string[];
    sizeCategory: string;
    matchedFeatures: string[];
    verificationStatus?: 'verified' | 'cross-referenced' | 'unverified';
    alternativeNames?: string[];
    confidenceLevel?: number;
  };
  diseaseAnalysis?: {
    diseases: PlantDisease[];
    healthScore: number;
    healthStatus: 'healthy' | 'minor-issues' | 'needs-attention' | 'critical';
    healthMessage: string;
  };
};

export type Page = 'welcome' | 'auth' | 'dashboard' | 'identify' | 'care' | 'disease' | 'result' | 'garden';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [user, setUser] = useState<User | null>(null);
  const [currentPlant, setCurrentPlant] = useState<PlantIdentification | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('welcome');
  };

  const handlePlantIdentified = (plant: PlantIdentification) => {
    setCurrentPlant(plant);
    setCurrentPage('result');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onGetStarted={() => setCurrentPage('auth')} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onBack={() => setCurrentPage('welcome')} />;
      case 'dashboard':
        return (
          <Dashboard
            user={user!}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'garden':
        return (
          <GardenPage
            user={user!}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'identify':
        return (
          <IdentificationPage
            onPlantIdentified={handlePlantIdentified}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'care':
        return (
          <CareAndRemediesPage
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'disease':
        return (
          <DiseaseDetectionPage
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'result':
        return (
          <PlantResultPage
            plant={currentPlant!}
            onBack={() => setCurrentPage('identify')}
            onNewIdentification={() => setCurrentPage('identify')}
          />
        );
      default:
        return <WelcomePage onGetStarted={() => setCurrentPage('auth')} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="/greenery_hero.png"
          alt="Lush Greenery Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen h-full">
        {renderCurrentPage()}
        <Toaster />
        <Chatbot 
          isLoggedIn={!!user} 
          onRequireAuth={() => setCurrentPage('auth')} 
        />
      </div>
    </div>
  );
}
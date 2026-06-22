import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Scan,
  Leaf,
  ShieldCheck,
  Library,
  LogOut,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  Search,
  Heart,
  Activity,
  Sprout
} from 'lucide-react';
import type { User, Page } from '../App';
import { fetchUserGarden } from '../utils/gardenStorage';

interface DashboardProps {
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [gardenCount, setGardenCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const plants = await fetchUserGarden(user.id);
        setGardenCount(plants.length);
      } catch (e) {
        console.error('Failed to load garden count for dashboard:', e);
      }
    }
    loadStats();
  }, [user.id]);

  const features = [
    {
      icon: Scan,
      title: 'Plant Identification',
      description: 'Advanced ensemble AI with multi-image analysis, morphology detection & 95%+ accuracy',
      action: () => onNavigate('identify'),
      color: 'bg-green-500/20 text-green-400 border border-green-500/30',
      badge: 'Advanced AI'
    },
    {
      icon: Sprout,
      title: 'My Garden Dashboard',
      description: 'Onboard your plant friends, track watering, and get personalized AI care guidance',
      action: () => onNavigate('garden'),
      color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      badge: 'Personalized AI'
    },
    {
      icon: ShieldCheck,
      title: 'Care & Remedies',
      description: 'Learn about plant diseases, protection methods, and comprehensive care guides',
      action: () => onNavigate('care'),
      color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      badge: 'Expert Tips'
    },
    {
      icon: Activity,
      title: 'Disease Detection',
      description: 'Advanced AI analysis to detect plant diseases and get treatment recommendations',
      action: () => onNavigate('disease'),
      color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      badge: 'New Feature'
    },
    {
      icon: Library,
      title: 'Plant Encyclopedia',
      description: 'Browse our extensive database of plant information and botanical insights',
      action: () => { },
      color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      badge: 'Coming Soon'
    }
  ];

  const stats = [
    { label: 'My Garden Plants', value: gardenCount.toString(), icon: Sprout },
    { label: 'Plants Identified', value: '12', icon: Search },
    { label: 'Care Tips Used', value: '15', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] overflow-hidden border border-green-500/30 bg-black">
              <img src="/pritamoria_logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl text-green-500 font-semibold tracking-wide">Pritamoria</h1>
              <p className="text-xs text-green-400/80 uppercase tracking-wider">AI Plant Intelligence</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <UserIcon className="w-4 h-4 text-green-400" />
              <span>Welcome, <span className="text-white font-medium">{user.name}</span></span>
            </div>
            <Button variant="outline" onClick={onLogout} size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12 text-center mt-4">
          <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">AI-Powered Plant Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Plant Discovery</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the world of plants with our advanced AI technology. Identify species,
            learn about care, detect diseases, and become a botanical expert.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10 text-center hover:bg-black/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center shadow-inner">
                    <stat.icon className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="text-3xl font-light text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-md border-white/10 relative overflow-hidden hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:border-green-500/30 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-gray-300">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl text-white tracking-wide">{feature.title}</CardTitle>
                <CardDescription className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={feature.action}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-green-500 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300"
                  variant="outline"
                >
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-16 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-md border border-green-500/30 rounded-3xl p-10 text-center shadow-[0_0_40px_rgba(34,197,94,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-noise opacity-10"></div>
          <h3 className="text-3xl mb-4 font-bold text-white tracking-tight relative z-10">Ready to Identify Your First Plant?</h3>
          <p className="text-green-200/80 text-lg mb-8 max-w-2xl mx-auto relative z-10 font-light">
            Upload 4-5 clear photos of your plant from different angles for the most accurate
            identification. Our AI will analyze the images instantly.
          </p>
          <Button
            onClick={() => onNavigate('identify')}
            size="lg"
            className="bg-green-500 hover:bg-green-400 text-white border-none shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 relative z-10 px-8 py-6 text-lg"
          >
            <Scan className="w-5 h-5 mr-3" />
            Start Identification Now
          </Button>
        </div>

        {/* Thank You Section */}
        <div className="mt-12 text-center py-8">
          <h3 className="text-xl mb-2 text-white/80 font-light">Thank You for Visiting Pritamoria</h3>
          <p className="text-gray-500 text-sm">
            Powered by advanced botanical AI and expert knowledge.
          </p>
        </div>
      </main>
    </div>
  );
}
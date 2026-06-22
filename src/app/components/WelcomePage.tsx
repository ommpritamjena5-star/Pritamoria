import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Leaf, Camera, Shield, Brain } from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-20 h-20 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-green-500/20 border border-green-500/30 bg-black">
            <img src="/pritamoria_logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-green-500 text-xl font-bold tracking-wider">Pritamoria</span>
        </div>
        <Button
          onClick={onGetStarted}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Get Started
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-green-100 flex items-center space-x-2 font-medium tracking-wide uppercase text-sm">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Plant Intelligence</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Where Nature Meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 italic">Intelligence</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Upload 4-5 photos of any plant, tree, flower, or fruit, and let our AI
            identify it with expert-level accuracy. Get instant care tips, disease
            detection, and botanical insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Identifying
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-4"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">99%</div>
              <div className="text-gray-300 font-medium uppercase tracking-wider text-sm">Accuracy Rate</div>
            </Card>
            <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">50K+</div>
              <div className="text-gray-300 font-medium uppercase tracking-wider text-sm">Plant Species</div>
            </Card>
            <Card className="bg-black/30 backdrop-blur-sm border-white/20 p-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">24/7</div>
              <div className="text-gray-300 font-medium uppercase tracking-wider text-sm">AI Analysis</div>
            </Card>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 bg-black/40 backdrop-blur-sm py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-tight">
            Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 italic">Plant Enthusiasts</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">Smart Identification</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Upload multiple photos for accurate AI-powered plant identification
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">Disease Detection</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Detect plant diseases and get treatment recommendations
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">Care Instructions</h3>
              <p className="text-gray-300 font-light leading-relaxed">
                Get detailed care guides and botanical information
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
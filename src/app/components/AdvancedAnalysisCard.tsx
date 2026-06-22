import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Brain,
  Leaf,
  Activity,
  GitBranch,
  CheckCircle,
  Layers,
  Microscope,
  TrendingUp
} from 'lucide-react';

interface AdvancedAnalysisCardProps {
  advancedAnalysis?: any;
}

export function AdvancedAnalysisCard({ advancedAnalysis }: AdvancedAnalysisCardProps) {
  if (!advancedAnalysis) return null;

  const {
    leafMorphology,
    growthStage,
    morphologicalPatterns,
    spatialFeatures,
    multiImageConsistency,
    ensembleVotes
  } = advancedAnalysis;

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>Advanced AI Analysis</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Multi-layer botanical analysis with ensemble algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Multi-Image Consistency */}
        {multiImageConsistency && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Layers className="w-5 h-5 text-blue-400" />
              <h4>Multi-Image Cross-Reference</h4>
            </div>
            <div className="space-y-2 pl-7">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Color Consistency</span>
                  <span className="text-sm font-medium text-white">{multiImageConsistency.colorConsistency}%</span>
                </div>
                <Progress value={multiImageConsistency.colorConsistency} className="h-2 bg-white/10" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Shape Consistency</span>
                  <span className="text-sm font-medium text-white">{multiImageConsistency.shapeConsistency}%</span>
                </div>
                <Progress value={multiImageConsistency.shapeConsistency} className="h-2 bg-white/10" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Overall Reliability</span>
                  <span className="text-sm font-medium text-green-400">{multiImageConsistency.overallReliability}%</span>
                </div>
                <Progress value={multiImageConsistency.overallReliability} className="h-2 bg-white/10" />
              </div>
            </div>
          </div>
        )}

        {/* Growth Stage */}
        {growthStage && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h4>Growth Stage Detection</h4>
            </div>
            <div className="pl-7 space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize border-white/20 text-gray-300">
                  {growthStage.stage}
                </Badge>
                <span className="text-sm text-gray-400">{growthStage.confidence}% confidence</span>
              </div>
              <div className="text-sm text-gray-300">
                <strong className="text-gray-400">Indicators:</strong> {growthStage.indicators.join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Leaf Morphology */}
        {leafMorphology && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <Leaf className="w-5 h-5 text-green-400" />
              <h4>Leaf Morphology Analysis</h4>
            </div>
            <div className="pl-7 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Complexity:</span>{' '}
                <Badge variant="outline" className="ml-1 capitalize text-xs border-white/20 text-gray-300">
                  {leafMorphology.complexity}
                </Badge>
              </div>
              <div>
                <span className="text-gray-400">Margin:</span>{' '}
                <span className="font-medium capitalize text-gray-300">{leafMorphology.margin.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400">Venation:</span>{' '}
                <span className="font-medium capitalize text-gray-300">{leafMorphology.venation.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-400">Arrangement:</span>{' '}
                <span className="font-medium capitalize text-gray-300">{leafMorphology.arrangement.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Morphological Patterns */}
        {morphologicalPatterns && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <Microscope className="w-5 h-5 text-indigo-400" />
              <h4>Morphological Patterns</h4>
            </div>
            <div className="pl-7 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Symmetry:</span>{' '}
                <Badge variant="outline" className="ml-1 capitalize text-xs border-white/20 text-gray-300">
                  {morphologicalPatterns.symmetry}
                </Badge>
              </div>
              <div>
                <span className="text-gray-400">Texture:</span>{' '}
                <span className="font-medium capitalize text-gray-300">{morphologicalPatterns.textureClass.join(', ')}</span>
              </div>
              {morphologicalPatterns.surfaceFeatures.length > 0 && (
                <div className="col-span-2">
                  <span className="text-gray-400">Surface Features:</span>{' '}
                  <span className="font-medium capitalize text-gray-300">{morphologicalPatterns.surfaceFeatures.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spatial Features */}
        {spatialFeatures && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <h4>Spatial Structure</h4>
            </div>
            <div className="pl-7 grid grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Density:</span>{' '}
                <Badge variant="outline" className="ml-1 capitalize text-xs border-white/20 text-gray-300">
                  {spatialFeatures.densityEstimate}
                </Badge>
              </div>
              <div>
                <span className="text-gray-400">Height:</span>{' '}
                <Badge variant="outline" className="ml-1 capitalize text-xs border-white/20 text-gray-300">
                  {spatialFeatures.heightEstimate}
                </Badge>
              </div>
              <div className="col-span-3">
                <span className="text-gray-400">Branching:</span>{' '}
                <span className="font-medium capitalize text-gray-300">{spatialFeatures.branchingPattern.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Ensemble Voting */}
        {ensembleVotes && ensembleVotes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <Activity className="w-5 h-5 text-purple-400" />
              <h4>Ensemble Algorithm Consensus</h4>
            </div>
            <div className="pl-7 space-y-2">
              {ensembleVotes.map((vote: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">{vote.algorithm}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs border-white/20 text-gray-300">{vote.confidence}%</Badge>
                    <span className="text-gray-400 text-xs">weight: {vote.weight}%</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  {ensembleVotes.length} independent algorithms reached consensus for this identification
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

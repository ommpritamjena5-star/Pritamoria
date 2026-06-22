// Plant identification utilities and Wikipedia integration

export interface WikipediaPlantData {
  title: string;
  extract: string;
  thumbnail?: string;
  pageurl: string;
}

export interface AnalysisResult {
  plant: {
    name: string;
    scientificName: string;
    type: 'plant' | 'tree' | 'flower' | 'fruit' | 'vegetable';
    searchTerm: string;
  };
  confidence: number;
  matchedFeatures: string[];
}

// Fetch plant data from Wikipedia
export async function fetchWikipediaData(searchTerm: string): Promise<WikipediaPlantData | null> {
  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Wikipedia API request failed');
    }
    
    const data = await response.json();
    
    return {
      title: data.title || searchTerm,
      extract: data.extract || 'No description available from Wikipedia.',
      thumbnail: data.thumbnail?.source,
      pageurl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm)}`
    };
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return null;
  }
}

// Generate care instructions based on plant type and Wikipedia data
export function generateCareInstructions(plantName: string, plantType: string): string[] {
  const baseInstructions: { [key: string]: string[] } = {
    plant: [
      'Water when the top inch of soil feels dry to touch',
      'Provide bright, indirect sunlight for 6-8 hours daily',
      'Maintain humidity levels between 40-60% for optimal growth',
      'Fertilize monthly during the growing season (spring and summer)',
      'Repot every 1-2 years or when roots become pot-bound'
    ],
    tree: [
      'Water deeply but less frequently, allowing soil to dry between waterings',
      'Provide adequate space for root and canopy growth',
      'Prune dead or damaged branches regularly',
      'Apply slow-release fertilizer in early spring',
      'Monitor for signs of pests or diseases regularly'
    ],
    flower: [
      'Water at the base to avoid wetting the flowers and leaves',
      'Deadhead spent blooms to encourage new flower production',
      'Provide morning sunlight and afternoon shade in hot climates',
      'Apply balanced fertilizer every 2-3 weeks during blooming season',
      'Protect from strong winds that may damage delicate petals'
    ],
    fruit: [
      'Water consistently to maintain soil moisture without waterlogging',
      'Provide full sun exposure for at least 6-8 hours daily',
      'Apply compost or organic fertilizer regularly during growing season',
      'Prune to improve air circulation and light penetration',
      'Harvest fruits when fully ripe for best flavor and nutrition'
    ],
    vegetable: [
      'Maintain consistent soil moisture throughout the growing season',
      'Provide nutrient-rich, well-draining soil with organic matter',
      'Ensure adequate spacing between plants for proper growth',
      'Apply balanced fertilizer according to specific crop requirements',
      'Harvest at the right time for optimal taste and nutritional value'
    ]
  };
  
  return baseInstructions[plantType] || baseInstructions.plant;
}

// Generate advantages based on plant characteristics
export function generateAdvantages(plantName: string, plantType: string): string[] {
  const commonAdvantages: { [key: string]: string[] } = {
    plant: [
      'Improves indoor air quality by filtering toxins and pollutants',
      'Low maintenance and adaptable to various indoor conditions',
      'Adds natural beauty and greenery to living spaces',
      'Can be easily propagated to create new plants',
      'Helps reduce stress and improve mental well-being'
    ],
    tree: [
      'Provides shade and natural cooling for outdoor spaces',
      'Produces oxygen and helps combat climate change',
      'Creates habitat for wildlife and beneficial insects',
      'Can increase property value when mature',
      'Offers long-term environmental and aesthetic benefits'
    ],
    flower: [
      'Attracts beneficial pollinators like bees and butterflies',
      'Provides beautiful colors and fragrances to gardens',
      'Can be used for cut flower arrangements',
      'Adds seasonal interest and visual appeal',
      'Many varieties are deer and pest resistant'
    ],
    fruit: [
      'Provides fresh, nutritious food for consumption',
      'Can reduce grocery costs when properly maintained',
      'Attracts beneficial wildlife to the garden',
      'Offers seasonal beauty with blossoms and fruit',
      'Many varieties are rich in vitamins and antioxidants'
    ],
    vegetable: [
      'Supplies fresh, healthy produce for daily nutrition',
      'Reduces dependence on store-bought vegetables',
      'Allows control over growing methods and pesticide use',
      'Provides satisfaction of growing your own food',
      'Can be preserved through various methods for year-round use'
    ]
  };
  
  return commonAdvantages[plantType] || commonAdvantages.plant;
}

// Generate disadvantages based on plant characteristics
export function generateDisadvantages(plantName: string, plantType: string): string[] {
  const commonDisadvantages: { [key: string]: string[] } = {
    plant: [
      'May be toxic to pets or children if ingested',
      'Requires regular care and attention to thrive',
      'Can attract pests like spider mites or aphids',
      'May cause allergic reactions in sensitive individuals',
      'Needs appropriate lighting and environmental conditions'
    ],
    tree: [
      'Requires significant space and long-term commitment',
      'May cause foundation or plumbing issues if planted too close to structures',
      'Can be expensive to remove or treat if diseased',
      'May drop leaves, fruit, or branches requiring cleanup',
      'Growth can interfere with power lines or neighboring properties'
    ],
    flower: [
      'Blooming period may be relatively short',
      'May trigger allergies in sensitive individuals',
      'Requires specific care during different seasons',
      'Can be damaged by extreme weather conditions',
      'May need protection from deer and other wildlife'
    ],
    fruit: [
      'May take several years to produce significant yields',
      'Susceptible to various pests and diseases',
      'Requires specific climate conditions to thrive',
      'May need cross-pollination from other varieties',
      'Fruit can attract unwanted wildlife or insects'
    ],
    vegetable: [
      'Requires consistent care and attention throughout growing season',
      'Vulnerable to various pests, diseases, and weather conditions',
      'May need specific soil conditions and regular fertilization',
      'Growing season may be limited by climate',
      'Initial setup costs for seeds, tools, and soil amendments'
    ]
  };
  
  return commonDisadvantages[plantType] || commonDisadvantages.plant;
}

// Generate common diseases based on plant type
export function generateCommonDiseases(plantName: string, plantType: string): string[] {
  const commonDiseases: { [key: string]: string[] } = {
    plant: [
      'Root rot caused by overwatering and poor drainage',
      'Spider mites in low humidity environments',
      'Yellowing leaves from inadequate light or overwatering',
      'Brown leaf tips from low humidity or water quality issues'
    ],
    tree: [
      'Fungal infections during wet, humid conditions',
      'Bark beetle infestations in stressed trees',
      'Leaf spot diseases from poor air circulation',
      'Canker diseases affecting branches and trunk'
    ],
    flower: [
      'Powdery mildew in humid conditions with poor air flow',
      'Aphid infestations on tender new growth',
      'Botrytis (gray mold) on flowers in cool, wet weather',
      'Thrips damage causing silvered or stippled leaves'
    ],
    fruit: [
      'Fungal diseases like black spot or anthracnose',
      'Bacterial infections causing fruit rot',
      'Insect pests like fruit flies or scale insects',
      'Nutrient deficiencies affecting fruit development'
    ],
    vegetable: [
      'Damping-off disease in seedlings',
      'Blight diseases affecting leaves and fruit',
      'Insect pests like aphids, caterpillars, or beetles',
      'Viral diseases transmitted by insects or contaminated tools'
    ]
  };
  
  return commonDiseases[plantType] || commonDiseases.plant;
}
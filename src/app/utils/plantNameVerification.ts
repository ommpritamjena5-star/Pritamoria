// Plant name verification and cross-reference utilities

export interface PlantNameData {
  primaryName: string;
  scientificName: string;
  commonNames: string[];
  family: string;
  synonyms: string[];
  verified: boolean;
}

// Known plant synonyms and alternative names for cross-verification
const plantSynonyms: { [key: string]: PlantNameData } = {
  'Monstera deliciosa': {
    primaryName: 'Monstera deliciosa',
    scientificName: 'Monstera deliciosa',
    commonNames: ['Swiss Cheese Plant', 'Split Leaf Philodendron', 'Ceriman'],
    family: 'Araceae',
    synonyms: ['Philodendron pertusum'],
    verified: true
  },
  'Sansevieria trifasciata': {
    primaryName: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    commonNames: ['Mother-in-Law\'s Tongue', 'Viper\'s Bowstring Hemp', 'Saint George\'s Sword'],
    family: 'Asparagaceae',
    synonyms: ['Dracaena trifasciata'],
    verified: true
  },
  'Ficus lyrata': {
    primaryName: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    commonNames: ['Banjo Fig', 'Lyre Leaf Fig'],
    family: 'Moraceae',
    synonyms: ['Ficus pandurata'],
    verified: true
  },
  'Spathiphyllum wallisii': {
    primaryName: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    commonNames: ['White Sails', 'Spathe Flower', 'Closet Plant'],
    family: 'Araceae',
    synonyms: ['Spathiphyllum floribundum'],
    verified: true
  },
  'Ficus elastica': {
    primaryName: 'Rubber Tree',
    scientificName: 'Ficus elastica',
    commonNames: ['Rubber Plant', 'Indian Rubber Bush', 'Rubber Fig'],
    family: 'Moraceae',
    synonyms: ['Ficus elastica var. decora'],
    verified: true
  },
  'Chlorophytum comosum': {
    primaryName: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    commonNames: ['Airplane Plant', 'Spider Ivy', 'Ribbon Plant'],
    family: 'Asparagaceae',
    synonyms: ['Chlorophytum comosum var. variegatum'],
    verified: true
  },
  'Aloe vera': {
    primaryName: 'Aloe Vera',
    scientificName: 'Aloe vera',
    commonNames: ['True Aloe', 'Medicinal Aloe', 'Barbados Aloe'],
    family: 'Asphodelaceae',
    synonyms: ['Aloe barbadensis', 'Aloe vulgaris'],
    verified: true
  },
  'Nephrolepis exaltata': {
    primaryName: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    commonNames: ['Sword Fern', 'Ladder Fern', 'Fishbone Fern'],
    family: 'Nephrolepidaceae',
    synonyms: ['Nephrolepis biserrata'],
    verified: true
  },
  'Crassula ovata': {
    primaryName: 'Jade Plant',
    scientificName: 'Crassula ovata',
    commonNames: ['Money Tree', 'Lucky Plant', 'Dollar Plant'],
    family: 'Crassulaceae',
    synonyms: ['Crassula argentea', 'Crassula portulacea'],
    verified: true
  },
  'Epipremnum aureum': {
    primaryName: 'Golden Pothos',
    scientificName: 'Epipremnum aureum',
    commonNames: ['Devil\'s Ivy', 'Money Plant', 'Hunter\'s Robe'],
    family: 'Araceae',
    synonyms: ['Scindapsus aureus', 'Rhaphidophora aurea'],
    verified: true
  },
  'Dracaena marginata': {
    primaryName: 'Dragon Tree',
    scientificName: 'Dracaena marginata',
    commonNames: ['Madagascar Dragon Tree', 'Red-edged Dracaena', 'Rainbow Tree'],
    family: 'Asparagaceae',
    synonyms: ['Dracaena cincta'],
    verified: true
  },
  'Zamioculcas zamiifolia': {
    primaryName: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    commonNames: ['Zanzibar Gem', 'Eternity Plant', 'Emerald Palm'],
    family: 'Araceae',
    synonyms: ['Caladium zamiaefolium'],
    verified: true
  }
};

// Verify and cross-reference plant name
export function verifyPlantName(scientificName: string, commonName: string): PlantNameData | null {
  // Direct lookup by scientific name
  const directMatch = plantSynonyms[scientificName];
  if (directMatch) {
    return directMatch;
  }
  
  // Search by common name
  for (const [key, plantData] of Object.entries(plantSynonyms)) {
    if (plantData.commonNames.some(name => 
      name.toLowerCase() === commonName.toLowerCase() ||
      plantData.primaryName.toLowerCase() === commonName.toLowerCase()
    )) {
      return plantData;
    }
  }
  
  // Search by synonyms
  for (const [key, plantData] of Object.entries(plantSynonyms)) {
    if (plantData.synonyms.some(synonym => 
      synonym.toLowerCase() === scientificName.toLowerCase()
    )) {
      return plantData;
    }
  }
  
  return null;
}

// Get the most accurate name for display
export function getAccuratePlantName(scientificName: string, commonName: string): {
  displayName: string;
  scientificName: string;
  alternativeNames: string[];
  confidence: 'verified' | 'probable' | 'unverified';
} {
  const verified = verifyPlantName(scientificName, commonName);
  
  if (verified) {
    return {
      displayName: verified.primaryName,
      scientificName: verified.scientificName,
      alternativeNames: verified.commonNames,
      confidence: 'verified'
    };
  }
  
  // If not in our verified database, return as-is with lower confidence
  return {
    displayName: commonName,
    scientificName: scientificName,
    alternativeNames: [],
    confidence: 'unverified'
  };
}

// Check if a plant identification is accurate based on multiple sources
export function validatePlantIdentification(
  identifiedName: string, 
  scientificName: string, 
  visualFeatures: string[]
): {
  isAccurate: boolean;
  confidence: number;
  corrections?: {
    suggestedName: string;
    suggestedScientific: string;
    reason: string;
  };
} {
  const verified = verifyPlantName(scientificName, identifiedName);
  
  if (verified) {
    return {
      isAccurate: true,
      confidence: 95,
    };
  }
  
  // Look for potential matches based on visual features
  const potentialMatches = findPotentialMatches(visualFeatures);
  
  if (potentialMatches.length > 0) {
    const bestMatch = potentialMatches[0];
    return {
      isAccurate: false,
      confidence: 60,
      corrections: {
        suggestedName: bestMatch.primaryName,
        suggestedScientific: bestMatch.scientificName,
        reason: 'Visual features suggest this alternative identification'
      }
    };
  }
  
  return {
    isAccurate: false,
    confidence: 30
  };
}

// Find potential plant matches based on visual features
function findPotentialMatches(visualFeatures: string[]): PlantNameData[] {
  const matches: { plant: PlantNameData; score: number }[] = [];
  
  const featureKeywords = visualFeatures.map(f => f.toLowerCase());
  
  for (const [key, plantData] of Object.entries(plantSynonyms)) {
    let score = 0;
    
    // Check if visual features match common plant characteristics
    const plantKeywords = [
      ...plantData.commonNames.map(name => name.toLowerCase()),
      plantData.primaryName.toLowerCase(),
      plantData.family.toLowerCase()
    ];
    
    for (const feature of featureKeywords) {
      for (const keyword of plantKeywords) {
        if (keyword.includes(feature) || feature.includes(keyword)) {
          score += 1;
        }
      }
    }
    
    if (score > 0) {
      matches.push({ plant: plantData, score });
    }
  }
  
  return matches
    .sort((a, b) => b.score - a.score)
    .map(m => m.plant)
    .slice(0, 3);
}

// Format plant name for display with proper capitalization
export function formatPlantName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Format scientific name with proper italicization markers
export function formatScientificName(name: string): string {
  // Ensure first letter of each part is capitalized
  const parts = name.split(' ');
  if (parts.length >= 2) {
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    for (let i = 1; i < parts.length; i++) {
      parts[i] = parts[i].toLowerCase();
    }
  }
  return parts.join(' ');
}

// Get detailed plant information including taxonomy
export function getDetailedPlantInfo(scientificName: string): {
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  } | null;
  nativeRegion: string[];
  careLevel: 'Easy' | 'Moderate' | 'Difficult';
  lightRequirement: string;
  waterRequirement: string;
} | null {
  // This would typically come from a comprehensive botanical database
  // For now, providing sample data for common plants
  
  const plantDetails: { [key: string]: any } = {
    'Monstera deliciosa': {
      taxonomy: {
        kingdom: 'Plantae',
        phylum: 'Tracheophyta',
        class: 'Liliopsida',
        order: 'Alismatales',
        family: 'Araceae',
        genus: 'Monstera',
        species: 'M. deliciosa'
      },
      nativeRegion: ['Central America', 'Southern Mexico'],
      careLevel: 'Easy' as const,
      lightRequirement: 'Bright, indirect light',
      waterRequirement: 'Water when top soil is dry'
    },
    'Sansevieria trifasciata': {
      taxonomy: {
        kingdom: 'Plantae',
        phylum: 'Tracheophyta',
        class: 'Liliopsida',
        order: 'Asparagales',
        family: 'Asparagaceae',
        genus: 'Sansevieria',
        species: 'S. trifasciata'
      },
      nativeRegion: ['West Africa', 'Nigeria', 'Congo'],
      careLevel: 'Easy' as const,
      lightRequirement: 'Low to bright light',
      waterRequirement: 'Water sparingly, drought tolerant'
    }
  };
  
  return plantDetails[scientificName] || null;
}
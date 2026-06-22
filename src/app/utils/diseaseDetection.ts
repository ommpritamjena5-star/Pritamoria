// Comprehensive disease detection and analysis for plants
// Based on PlantVillage Dataset used in plant disease detection models
// Reference: https://www.kaggle.com/code/hk9088/plant-disese-detecton/notebook
// Dataset includes 38 disease classes across 14 crop species

export interface DiseaseSymptom {
  name: string;
  severity: 'low' | 'medium' | 'high';
  indicators: string[];
}

export interface PlantDisease {
  id: string;
  name: string;
  plantType?: string; // Specific plant this disease affects
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  affectedParts: string[];
  visualIndicators: {
    colors: string[];
    patterns: string[];
    textures: string[];
  };
  kaggleReference?: string; // Reference to dataset
  wikipediaUrl?: string; // Wikipedia link for more info
}

// Comprehensive disease database based on PlantVillage Dataset
// Reference: https://www.kaggle.com/code/hk9088/plant-disese-detecton/notebook
const diseaseDatabase: Omit<PlantDisease, 'id' | 'confidence'>[] = [
  // APPLE DISEASES
  {
    name: 'Apple Scab',
    plantType: 'Apple',
    severity: 'high',
    description: 'Fungal disease causing dark, scabby lesions on leaves and fruit, one of the most serious apple diseases.',
    symptoms: [
      'Olive-green to dark brown spots on leaves',
      'Velvety or scabby appearance on spots',
      'Leaves may yellow and drop prematurely',
      'Corky, scabby lesions on fruits',
      'Fruits may be cracked or deformed',
      'Reduced fruit quality and marketability'
    ],
    causes: [
      'Venturia inaequalis fungus',
      'Cool, wet spring weather (55-75°F)',
      'High humidity during leaf emergence',
      'Infected fallen leaves overwintering',
      'Spores spread by rain and wind',
      'Poor air circulation in orchard'
    ],
    treatment: [
      'Apply fungicides at tight cluster stage',
      'Use captan, myclobutanil, or mancozeb',
      'Remove and destroy infected leaves and fruit',
      'Prune to improve air circulation',
      'Apply lime sulfur during dormant season',
      'Continue fungicide program through growing season'
    ],
    prevention: [
      'Plant scab-resistant apple varieties',
      'Rake and remove fallen leaves in autumn',
      'Prune trees for good air circulation',
      'Apply preventive fungicide sprays',
      'Avoid overhead irrigation',
      'Maintain proper tree spacing'
    ],
    affectedParts: ['leaves', 'fruits', 'twigs'],
    visualIndicators: {
      colors: ['olive-green', 'dark-brown', 'black', 'velvety'],
      patterns: ['scabby-lesions', 'spots', 'corky-texture'],
      textures: ['velvety', 'scabby', 'rough', 'corky']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Apple_scab'
  },
  {
    name: 'Apple Black Rot',
    plantType: 'Apple',
    severity: 'high',
    description: 'Fungal disease causing leaf spots, fruit rot, and limb cankers, can cause severe crop losses.',
    symptoms: [
      'Purple bordered leaf spots',
      'Dark brown to black rot on fruits',
      'Fruits develop concentric rings (frog-eye pattern)',
      'Mummified fruits remain on tree',
      'Cankers on branches and limbs',
      'Leaf defoliation'
    ],
    causes: [
      'Botryosphaeria obtusa fungus',
      'Warm, humid weather',
      'Wounded or stressed trees',
      'Infected mummified fruits',
      'Pruning wounds or injuries',
      'Poor orchard sanitation'
    ],
    treatment: [
      'Remove and destroy mummified fruits',
      'Prune out infected branches and cankers',
      'Apply captan or thiophanate-methyl fungicide',
      'Improve tree vigor through proper care',
      'Thin fruits to prevent overcrowding',
      'Disinfect pruning tools between cuts'
    ],
    prevention: [
      'Maintain good orchard sanitation',
      'Remove mummies and infected material',
      'Prune to improve air circulation',
      'Apply preventive fungicide sprays',
      'Avoid tree stress and injuries',
      'Practice proper fertilization and watering'
    ],
    affectedParts: ['leaves', 'fruits', 'branches'],
    visualIndicators: {
      colors: ['purple-border', 'dark-brown', 'black', 'brown-rot'],
      patterns: ['concentric-rings', 'frog-eye', 'mummified'],
      textures: ['rotten', 'dry', 'mummified', 'sunken']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Black_rot_(apple)'
  },
  {
    name: 'Apple Cedar Rust',
    plantType: 'Apple',
    severity: 'medium',
    description: 'Fungal disease requiring both apple and cedar trees to complete lifecycle, causes bright orange spots.',
    symptoms: [
      'Bright yellow-orange spots on upper leaf surface',
      'Small dark spots in center of yellow areas',
      'Orange gelatinous tubes on leaf undersides',
      'Fruit infections with orange spots',
      'Premature leaf drop',
      'Reduced fruit quality'
    ],
    causes: [
      'Gymnosporangium juniperi-virginianae fungus',
      'Requires both apple and cedar/juniper hosts',
      'Wet spring weather',
      'Spores from cedar galls infect apple',
      'Cool temperatures (46-75°F)',
      'Proximity to cedar or juniper trees'
    ],
    treatment: [
      'Apply fungicides during pink and petal fall stages',
      'Use myclobutanil or mancozeb',
      'Remove nearby cedar or juniper trees if possible',
      'Remove cedar galls in late winter',
      'Continue fungicide applications through season',
      'Improve air circulation around trees'
    ],
    prevention: [
      'Plant rust-resistant apple varieties',
      'Remove eastern red cedar within several hundred yards',
      'Apply preventive fungicides in spring',
      'Maintain tree health and vigor',
      'Prune for good air circulation',
      'Monitor cedar trees for galls'
    ],
    affectedParts: ['leaves', 'fruits'],
    visualIndicators: {
      colors: ['bright-orange', 'yellow-orange', 'rust-colored'],
      patterns: ['orange-spots', 'gelatinous-tubes', 'clustered-spots'],
      textures: ['gelatinous', 'raised', 'bumpy']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Gymnosporangium_juniperi-virginianae'
  },

  // BLUEBERRY DISEASES  
  {
    name: 'Blueberry Healthy',
    plantType: 'Blueberry',
    severity: 'low',
    description: 'Healthy blueberry plant showing normal growth characteristics and no disease symptoms.',
    symptoms: [
      'Green, healthy foliage',
      'Normal leaf color and texture',
      'No spots, lesions, or discoloration',
      'Vigorous growth',
      'Normal fruit development',
      'No signs of pests or diseases'
    ],
    causes: [
      'Proper care and maintenance',
      'Adequate water and nutrients',
      'Good air circulation',
      'Disease-resistant variety',
      'Optimal growing conditions',
      'Regular monitoring and care'
    ],
    treatment: [
      'Continue regular care routine',
      'Maintain consistent watering',
      'Apply appropriate fertilizer',
      'Monitor for early disease signs',
      'Prune as needed',
      'Maintain mulch layer'
    ],
    prevention: [
      'Maintain proper watering schedule',
      'Use acidic, well-draining soil (pH 4.5-5.5)',
      'Apply organic mulch',
      'Fertilize appropriately',
      'Prune for air circulation',
      'Monitor regularly for issues'
    ],
    affectedParts: ['none'],
    visualIndicators: {
      colors: ['green', 'healthy', 'vibrant'],
      patterns: ['normal', 'uniform'],
      textures: ['smooth', 'healthy', 'normal']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton'
  },

  // CHERRY DISEASES
  {
    name: 'Cherry Powdery Mildew',
    plantType: 'Cherry',
    severity: 'medium',
    description: 'Fungal disease causing white powdery coating on leaves, especially on sweet cherries.',
    symptoms: [
      'White powdery coating on leaves and shoots',
      'Leaves curl and become distorted',
      'Stunted shoot growth',
      'Premature leaf drop',
      'Reduced fruit quality',
      'Young leaves most susceptible'
    ],
    causes: [
      'Podosphaera clandestina fungus',
      'Moderate temperatures (60-80°F)',
      'High humidity',
      'Poor air circulation',
      'Shaded conditions',
      'Stressed trees'
    ],
    treatment: [
      'Apply sulfur or potassium bicarbonate',
      'Use myclobutanil or propiconazole fungicide',
      'Prune infected shoots',
      'Improve air circulation',
      'Remove heavily infected growth',
      'Apply fungicides at regular intervals'
    ],
    prevention: [
      'Plant resistant cherry varieties',
      'Ensure good air circulation',
      'Avoid overhead irrigation',
      'Prune regularly for airflow',
      'Apply preventive fungicides',
      'Remove infected material promptly'
    ],
    affectedParts: ['leaves', 'shoots', 'fruits'],
    visualIndicators: {
      colors: ['white-powder', 'gray-coating'],
      patterns: ['powdery-coating', 'widespread'],
      textures: ['powdery', 'fuzzy', 'dusty']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Powdery_mildew'
  },

  // CORN DISEASES
  {
    name: 'Corn Common Rust',
    plantType: 'Corn',
    severity: 'medium',
    description: 'Fungal disease causing reddish-brown pustules on corn leaves, common in sweet corn.',
    symptoms: [
      'Small, circular to elongate reddish-brown pustules',
      'Pustules on both sides of leaves',
      'Pustules rupture releasing rusty spores',
      'Severe infection causes leaf yellowing',
      'Premature leaf death',
      'Reduced photosynthesis and yield'
    ],
    causes: [
      'Puccinia sorghi fungus',
      'Moderate temperatures (60-77°F)',
      'High humidity and dew',
      'Wind-borne spores',
      'Prolonged leaf wetness',
      'Susceptible varieties'
    ],
    treatment: [
      'Apply fungicides if severe (propiconazole, azoxystrobin)',
      'Usually not economical to treat field corn',
      'Remove heavily infected plants in small plantings',
      'Improve air circulation',
      'Monitor disease progression',
      'Consider treatment for sweet corn or seed production'
    ],
    prevention: [
      'Plant resistant hybrid varieties',
      'Plant early to avoid peak spore levels',
      'Ensure adequate plant spacing',
      'Rotate crops',
      'Remove volunteer corn and host weeds',
      'Apply preventive fungicides for high-value crops'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['reddish-brown', 'rust-colored', 'orange-brown'],
      patterns: ['pustules', 'scattered-spots', 'elongate'],
      textures: ['raised', 'pustular', 'powdery']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Common_rust'
  },
  {
    name: 'Corn Northern Leaf Blight',
    plantType: 'Corn',
    severity: 'high',
    description: 'Fungal disease causing long cigar-shaped lesions on corn leaves, can significantly reduce yield.',
    symptoms: [
      'Long (1-6 inches), cigar-shaped gray-green lesions',
      'Lesions turn tan or brown with age',
      'Lesions run parallel to leaf veins',
      'Lower leaves infected first',
      'Can spread to upper leaves and ears',
      'Severe infections cause leaf death'
    ],
    causes: [
      'Exserohilum turcicum fungus (formerly Helminthosporium)',
      'Moderate temperatures (65-80°F)',
      'High humidity and prolonged leaf wetness',
      'Infected corn residue',
      'Susceptible varieties',
      'Consecutive corn plantings'
    ],
    treatment: [
      'Apply fungicides at first sign (azoxystrobin, pyraclostrobin)',
      'Use at tasseling for maximum benefit',
      'Multiple applications may be needed',
      'Remove infected lower leaves in small plantings',
      'Improve air circulation',
      'Consider fungicide economics for field corn'
    ],
    prevention: [
      'Plant resistant hybrids (most effective)',
      'Rotate with non-host crops',
      'Bury or remove corn residue',
      'Avoid planting corn after corn',
      'Ensure proper plant spacing',
      'Apply preventive fungicides in high-risk areas'
    ],
    affectedParts: ['leaves', 'husks'],
    visualIndicators: {
      colors: ['gray-green', 'tan', 'brown', 'necrotic'],
      patterns: ['cigar-shaped', 'elongated', 'parallel-to-veins'],
      textures: ['dry', 'necrotic', 'papery']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Northern_corn_leaf_blight'
  },
  {
    name: 'Corn Gray Leaf Spot',
    plantType: 'Corn',
    severity: 'high',
    description: 'Fungal disease causing rectangular gray lesions between leaf veins, serious in humid regions.',
    symptoms: [
      'Small, rectangular, tan to gray lesions',
      'Lesions confined between leaf veins',
      'Lesions may coalesce causing large dead areas',
      'Lower leaves infected first',
      'Severe infections cause premature death',
      'Can affect ears and stalks'
    ],
    causes: [
      'Cercospora zeae-maydis fungus',
      'Warm, humid weather (75-85°F)',
      'Extended periods of high humidity',
      'Corn residue from previous crop',
      'Reduced tillage systems',
      'Susceptible hybrids'
    ],
    treatment: [
      'Apply fungicides (azoxystrobin, pyraclostrobin, propiconazole)',
      'Treat at first symptom or preventively',
      'May require multiple applications',
      'Most effective when applied before tasseling',
      'Monitor disease levels closely',
      'Consider economics of treatment'
    ],
    prevention: [
      'Plant resistant hybrids',
      'Rotate crops (2-year minimum)',
      'Bury or remove corn residue',
      'Use conventional tillage when possible',
      'Avoid continuous corn planting',
      'Select hybrids rated for gray leaf spot resistance'
    ],
    affectedParts: ['leaves', 'husks', 'stalks'],
    visualIndicators: {
      colors: ['tan', 'gray', 'brown', 'necrotic'],
      patterns: ['rectangular', 'between-veins', 'blocky'],
      textures: ['dry', 'necrotic', 'papery']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Gray_leaf_spot'
  },

  // GRAPE DISEASES
  {
    name: 'Grape Black Rot',
    plantType: 'Grape',
    severity: 'high',
    description: 'Devastating fungal disease of grapes causing fruit mummification and leaf lesions.',
    symptoms: [
      'Small reddish-brown leaf spots',
      'Spots enlarge with tan centers and dark borders',
      'Black pycnidia (tiny dots) in leaf lesions',
      'Fruit infections start as tan spots',
      'Infected berries shrivel and mummify',
      'Mummies remain on vine through winter'
    ],
    causes: [
      'Guignardia bidwellii fungus',
      'Warm, wet weather (60-90°F)',
      'Rainfall and high humidity',
      'Infected mummified berries',
      'Spores spread by rain splash',
      'Poor air circulation in canopy'
    ],
    treatment: [
      'Apply fungicides from bud break through fruit set',
      'Use mancozeb, captan, or myclobutanil',
      'Multiple applications needed',
      'Remove and destroy mummified berries',
      'Prune infected canes',
      'Maintain spray schedule through bloom'
    ],
    prevention: [
      'Remove mummified berries in winter',
      'Prune vines for good air circulation',
      'Apply dormant lime sulfur spray',
      'Start fungicide program early (bud break)',
      'Remove infected leaves and shoots',
      'Maintain good vineyard sanitation'
    ],
    affectedParts: ['leaves', 'fruits', 'shoots'],
    visualIndicators: {
      colors: ['reddish-brown', 'tan', 'black', 'dark-border'],
      patterns: ['spots', 'mummified-fruit', 'black-dots'],
      textures: ['dry', 'mummified', 'shriveled', 'hard']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Grape_black_rot'
  },
  {
    name: 'Grape Leaf Blight (Isariopsis)',
    plantType: 'Grape',
    severity: 'medium',
    description: 'Fungal disease causing angular brown spots on grape leaves, common in humid regions.',
    symptoms: [
      'Small, angular, reddish-brown leaf spots',
      'Spots enlarge and turn dark brown',
      'Yellow halo around lesions',
      'Lesions may coalesce',
      'Premature defoliation',
      'Reduced vine vigor'
    ],
    causes: [
      'Pseudocercospora vitis (Isariopsis) fungus',
      'Warm, humid weather',
      'Prolonged leaf wetness',
      'Poor air circulation',
      'Dense canopy',
      'Overhead irrigation'
    ],
    treatment: [
      'Apply copper-based fungicides',
      'Use mancozeb or captan',
      'Remove infected leaves',
      'Improve air circulation through pruning',
      'Reduce canopy density',
      'Avoid overhead irrigation'
    ],
    prevention: [
      'Prune for good air circulation',
      'Train vines to reduce canopy density',
      'Apply preventive fungicides',
      'Remove and destroy fallen leaves',
      'Avoid overhead watering',
      'Maintain vine vigor'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['reddish-brown', 'dark-brown', 'yellow-halo'],
      patterns: ['angular-spots', 'coalescing'],
      textures: ['dry', 'necrotic']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton'
  },

  // ORANGE DISEASES
  {
    name: 'Orange Haunglongbing (Citrus Greening)',
    plantType: 'Orange',
    severity: 'high',
    description: 'Devastating bacterial disease with no cure, one of the most serious citrus diseases worldwide.',
    symptoms: [
      'Yellowing of leaf veins and blotchy mottling',
      'Asymmetric yellow patterns on leaves',
      'Small, lopsided fruits with bitter taste',
      'Premature fruit drop',
      'Green, poorly colored fruits',
      'Tree decline and eventual death'
    ],
    causes: [
      'Candidatus Liberibacter bacteria',
      'Transmitted by Asian citrus psyllid insect',
      'Infected budwood or trees',
      'No cure once infected',
      'Systemic disease affecting entire tree',
      'Spreads rapidly in warm climates'
    ],
    treatment: [
      'No cure available - remove infected trees',
      'Control psyllid vectors with insecticides',
      'Nutritional therapy may extend tree life',
      'Apply systemic insecticides',
      'Remove infected trees to prevent spread',
      'Quarantine affected areas'
    ],
    prevention: [
      'Plant certified disease-free trees',
      'Control Asian citrus psyllid populations',
      'Remove infected trees immediately',
      'Use insecticides on young trees',
      'Inspect trees regularly',
      'Follow regional quarantine regulations'
    ],
    affectedParts: ['leaves', 'fruits', 'entire-tree'],
    visualIndicators: {
      colors: ['yellow', 'blotchy-mottling', 'asymmetric-yellow', 'green-fruit'],
      patterns: ['vein-yellowing', 'mottling', 'asymmetric'],
      textures: ['normal', 'bitter-fruit', 'small-fruit']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Citrus_greening_disease'
  },

  // PEACH DISEASES
  {
    name: 'Peach Bacterial Spot',
    plantType: 'Peach',
    severity: 'high',
    description: 'Bacterial disease causing leaf spots and fruit lesions, serious problem in wet seasons.',
    symptoms: [
      'Small angular dark spots on leaves',
      'Shot-hole appearance as dead tissue drops out',
      'Spots on fruit start small and expand',
      'Fruit lesions are dark, sunken, and cracked',
      'Severe defoliation',
      'Twig cankers in severe cases'
    ],
    causes: [
      'Xanthomonas arboricola pv. pruni bacteria',
      'Warm, wet weather',
      'Wind-driven rain',
      'Infected plant material',
      'Contaminated pruning tools',
      'Hail or insect damage creating wounds'
    ],
    treatment: [
      'Apply copper sprays during dormancy',
      'Use oxytetracycline during bloom (where legal)',
      'Prune out infected twigs',
      'Improve air circulation',
      'Avoid overhead irrigation',
      'Disinfect pruning tools'
    ],
    prevention: [
      'Plant resistant varieties',
      'Apply copper sprays at leaf fall and spring',
      'Prune for good air circulation',
      'Avoid wounding trees',
      'Remove and destroy infected fruit',
      'Practice good sanitation'
    ],
    affectedParts: ['leaves', 'fruits', 'twigs'],
    visualIndicators: {
      colors: ['dark-spots', 'purple-black', 'sunken-lesions'],
      patterns: ['shot-hole', 'angular-spots', 'cracked'],
      textures: ['sunken', 'cracked', 'rough', 'scabby']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Bacterial_spot'
  },

  // PEPPER DISEASES
  {
    name: 'Pepper Bacterial Spot',
    plantType: 'Pepper',
    severity: 'medium',
    description: 'Bacterial disease causing leaf spots and fruit lesions, significantly affecting pepper quality.',
    symptoms: [
      'Small dark brown to black spots on leaves',
      'Yellow halo around leaf spots',
      'Raised corky spots on fruits',
      'Defoliation in severe infections',
      'Reduced fruit quality and marketability',
      'Spots may have greasy appearance'
    ],
    causes: [
      'Xanthomonas bacteria',
      'Warm wet weather',
      'Contaminated seeds or transplants',
      'Overhead watering or rain splash',
      'Spread by handling wet plants',
      'Wind-driven rain'
    ],
    treatment: [
      'Apply copper-based bactericides',
      'Remove severely infected plants',
      'Avoid working with wet plants',
      'Improve air circulation',
      'Use drip irrigation instead of overhead',
      'Consider acibenzolar-S-methyl for resistance induction'
    ],
    prevention: [
      'Use disease-free seeds and transplants',
      'Plant resistant varieties',
      'Avoid overhead irrigation',
      'Practice crop rotation (3 years)',
      'Sanitize tools and equipment',
      'Remove plant debris after harvest'
    ],
    affectedParts: ['leaves', 'fruits', 'stems'],
    visualIndicators: {
      colors: ['dark-brown', 'black', 'yellow-halo', 'corky-spots'],
      patterns: ['small-spots', 'raised-lesions', 'scabby'],
      textures: ['greasy', 'corky', 'raised', 'scabby']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Bacterial_spot'
  },

  // POTATO DISEASES
  {
    name: 'Potato Early Blight',
    plantType: 'Potato',
    severity: 'high',
    description: 'Common fungal disease of potatoes causing dark lesions with concentric rings on leaves and tubers.',
    symptoms: [
      'Dark brown to black lesions with concentric rings on older leaves',
      'Yellow halo surrounding lesions',
      'Lower leaves affected first',
      'V-shaped lesions pointing toward center of leaf',
      'Brown corky spots on tubers',
      'Premature defoliation reduces yield'
    ],
    causes: [
      'Alternaria solani fungus',
      'Warm weather (75-85°F)',
      'Alternating wet and dry periods',
      'Plant stress or nutrient deficiency',
      'Poor air circulation',
      'Infected seed tubers or plant debris'
    ],
    treatment: [
      'Apply chlorothalonil or mancozeb fungicide',
      'Remove and destroy infected foliage',
      'Improve air circulation',
      'Maintain adequate nitrogen levels',
      'Apply protective fungicide sprays regularly',
      'Hill up soil to protect developing tubers'
    ],
    prevention: [
      'Plant certified disease-free seed potatoes',
      'Use resistant varieties',
      'Rotate crops (3-4 years)',
      'Maintain plant vigor with proper fertilization',
      'Avoid overhead irrigation',
      'Remove volunteer potatoes and plant debris'
    ],
    affectedParts: ['leaves', 'tubers'],
    visualIndicators: {
      colors: ['dark-brown', 'black', 'yellow-halo', 'brown-corky'],
      patterns: ['concentric-rings', 'target-pattern', 'v-shaped'],
      textures: ['dry', 'necrotic', 'corky', 'sunken']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Early_blight'
  },
  {
    name: 'Potato Late Blight',
    plantType: 'Potato',
    severity: 'high',
    description: 'Extremely destructive disease that caused the Irish Potato Famine, affects leaves, stems, and tubers.',
    symptoms: [
      'Water-soaked spots on leaves turning brown to black',
      'White fuzzy mold on underside of leaves',
      'Dark lesions on stems',
      'Purplish-brown rot on tubers',
      'Entire plant can die within days',
      'Characteristic musty smell'
    ],
    causes: [
      'Phytophthora infestans oomycete',
      'Cool wet weather (50-70°F)',
      'High humidity (>90%)',
      'Infected seed potatoes',
      'Spores spread by wind and rain',
      'Can survive in cull piles and volunteers'
    ],
    treatment: [
      'Apply fungicides immediately (chlorothalonil, mancozeb, copper)',
      'Use systemic fungicides (metalaxyl, cymoxanil)',
      'Destroy infected plants',
      'Do not harvest from infected fields for 2-3 weeks',
      'Kill vines before harvest to prevent tuber infection',
      'Cure tubers properly before storage'
    ],
    prevention: [
      'Plant certified disease-free seed',
      'Plant resistant varieties',
      'Monitor weather forecasts - disease prediction systems available',
      'Apply preventive fungicides before infection',
      'Destroy cull piles and volunteer potatoes',
      'Ensure good field drainage'
    ],
    affectedParts: ['leaves', 'stems', 'tubers', 'entire-plant'],
    visualIndicators: {
      colors: ['brown-black', 'water-soaked', 'white-mold', 'purplish-brown'],
      patterns: ['irregular-blotches', 'spreading', 'fuzzy-mold'],
      textures: ['water-soaked', 'mushy', 'fuzzy', 'rotting']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Phytophthora_infestans'
  },

  // RASPBERRY DISEASES
  {
    name: 'Raspberry Healthy',
    plantType: 'Raspberry',
    severity: 'low',
    description: 'Healthy raspberry plant showing normal growth and no disease symptoms.',
    symptoms: [
      'Green healthy foliage',
      'Normal leaf color and texture',
      'No spots or lesions',
      'Vigorous cane growth',
      'Normal fruit development',
      'No pest or disease signs'
    ],
    causes: [
      'Proper cultural practices',
      'Adequate nutrition and water',
      'Good air circulation',
      'Disease-resistant variety',
      'Optimal growing conditions',
      'Regular maintenance'
    ],
    treatment: [
      'Continue regular care',
      'Maintain watering schedule',
      'Apply appropriate fertilizer',
      'Monitor for issues',
      'Prune spent canes',
      'Maintain mulch'
    ],
    prevention: [
      'Plant in well-drained soil',
      'Ensure good air circulation',
      'Water consistently',
      'Apply balanced fertilizer',
      'Remove old canes after fruiting',
      'Monitor regularly'
    ],
    affectedParts: ['none'],
    visualIndicators: {
      colors: ['green', 'healthy', 'vibrant'],
      patterns: ['normal', 'uniform'],
      textures: ['smooth', 'healthy']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton'
  },

  // SOYBEAN DISEASES
  {
    name: 'Soybean Healthy',
    plantType: 'Soybean',
    severity: 'low',
    description: 'Healthy soybean plant with no disease symptoms.',
    symptoms: [
      'Green healthy leaves',
      'Normal growth and development',
      'No spots or discoloration',
      'Vigorous plant growth',
      'Normal pod development',
      'No pest damage'
    ],
    causes: [
      'Proper crop management',
      'Good soil health',
      'Adequate moisture',
      'Resistant variety',
      'Optimal conditions',
      'Preventive practices'
    ],
    treatment: [
      'Continue current practices',
      'Monitor regularly',
      'Maintain soil fertility',
      'Ensure proper drainage',
      'Scout for pests/diseases',
      'Follow best practices'
    ],
    prevention: [
      'Rotate crops',
      'Use certified seed',
      'Maintain soil pH 6.0-6.8',
      'Ensure adequate drainage',
      'Monitor throughout season',
      'Apply inoculant if needed'
    ],
    affectedParts: ['none'],
    visualIndicators: {
      colors: ['green', 'healthy'],
      patterns: ['normal'],
      textures: ['smooth', 'healthy']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton'
  },

  // SQUASH DISEASES
  {
    name: 'Squash Powdery Mildew',
    plantType: 'Squash',
    severity: 'medium',
    description: 'Very common fungal disease of cucurbits causing white powdery growth on leaves.',
    symptoms: [
      'White powdery spots on leaves and stems',
      'Spots enlarge and coalesce',
      'Leaves turn yellow and die',
      'Reduced photosynthesis',
      'Premature defoliation',
      'Reduced fruit quality and yield'
    ],
    causes: [
      'Podosphaera xanthii or Erysiphe cichoracearum fungi',
      'Moderate temperatures (68-80°F)',
      'High humidity but can occur in dry conditions',
      'Poor air circulation',
      'Dense foliage',
      'Stressed plants'
    ],
    treatment: [
      'Apply sulfur or potassium bicarbonate',
      'Use fungicides (myclobutanil, azoxystrobin)',
      'Apply neem oil or horticultural oil',
      'Remove heavily infected leaves',
      'Improve air circulation',
      'Water at soil level'
    ],
    prevention: [
      'Plant resistant varieties',
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Apply preventive fungicide sprays',
      'Remove plant debris',
      'Don\'t overcrowd plants'
    ],
    affectedParts: ['leaves', 'stems'],
    visualIndicators: {
      colors: ['white-powder', 'gray-coating', 'yellow-leaves'],
      patterns: ['powdery-coating', 'spreading'],
      textures: ['powdery', 'fuzzy', 'dusty']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Powdery_mildew'
  },

  // STRAWBERRY DISEASES
  {
    name: 'Strawberry Leaf Scorch',
    plantType: 'Strawberry',
    severity: 'medium',
    description: 'Fungal disease causing purple spots and leaf tissue death, common in wet conditions.',
    symptoms: [
      'Small purple to reddish-brown spots on leaves',
      'Spots enlarge and centers turn grayish',
      'Numerous spots give scorched appearance',
      'Older leaves affected more severely',
      'Reduced plant vigor',
      'Lower fruit yield'
    ],
    causes: [
      'Diplocarpon earlianum fungus',
      'Warm humid weather',
      'Overhead irrigation',
      'Prolonged leaf wetness',
      'Infected plant material',
      'Poor air circulation'
    ],
    treatment: [
      'Remove and destroy infected leaves',
      'Apply fungicides (captan, myclobutanil)',
      'Improve air circulation',
      'Reduce overhead irrigation',
      'Thin plants if overcrowded',
      'Apply protective fungicides'
    ],
    prevention: [
      'Plant resistant varieties',
      'Use certified disease-free plants',
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Remove old leaves after harvest',
      'Practice crop rotation'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['purple', 'reddish-brown', 'grayish-center'],
      patterns: ['numerous-spots', 'scorched-appearance'],
      textures: ['dry', 'necrotic', 'crispy']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Strawberry_diseases'
  },

  // TOMATO DISEASES
  {
    name: 'Tomato Early Blight',
    plantType: 'Tomato',
    severity: 'high',
    description: 'Fungal disease caused by Alternaria solani, creating dark spots with concentric rings on lower leaves.',
    symptoms: [
      'Dark brown spots with concentric rings (target-like pattern) on older leaves',
      'Yellow halo around spots',
      'Leaves turn yellow and drop prematurely',
      'Stem lesions with dark brown sunken areas',
      'Fruit spots near stem end with concentric rings',
      'Defoliation starting from bottom of plant'
    ],
    causes: [
      'Alternaria solani fungus',
      'Warm temperatures (75-85°F)',
      'High humidity and wet conditions',
      'Overhead watering',
      'Poor air circulation',
      'Plant stress and nutrient deficiency'
    ],
    treatment: [
      'Remove and destroy infected leaves immediately',
      'Apply chlorothalonil or copper-based fungicide',
      'Use fungicides containing mancozeb or azoxystrobin',
      'Prune lower branches to improve air circulation',
      'Apply mulch to prevent soil splash',
      'Maintain consistent watering schedule'
    ],
    prevention: [
      'Use disease-resistant tomato varieties',
      'Rotate crops (3-4 year rotation)',
      'Space plants adequately for air circulation',
      'Water at soil level, avoid wetting foliage',
      'Apply preventive fungicide early in season',
      'Remove plant debris at end of season'
    ],
    affectedParts: ['leaves', 'stems', 'fruits'],
    visualIndicators: {
      colors: ['dark-brown', 'black', 'yellow-halo', 'brown-spots'],
      patterns: ['concentric-rings', 'target-pattern', 'circular-lesions'],
      textures: ['dry', 'necrotic', 'papery', 'sunken']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Early_blight'
  },
  {
    name: 'Tomato Late Blight',
    plantType: 'Tomato',
    severity: 'high',
    description: 'Devastating disease caused by Phytophthora infestans, can destroy entire crop in days.',
    symptoms: [
      'Large irregular dark brown or black blotches on leaves',
      'Water-soaked appearance on leaves',
      'White fuzzy growth on underside of leaves in humid conditions',
      'Dark brown firm spots on green and ripe fruits',
      'Entire plant can collapse in 7-14 days',
      'Characteristic musty odor'
    ],
    causes: [
      'Phytophthora infestans oomycete',
      'Cool wet weather (60-70°F)',
      'High humidity (>90%)',
      'Prolonged leaf wetness',
      'Spores spread by wind and rain',
      'Infected seed potatoes or transplants'
    ],
    treatment: [
      'Act immediately - disease spreads rapidly',
      'Apply copper-based fungicide or chlorothalonil',
      'Use systemic fungicides (metalaxyl, mefenoxam)',
      'Remove and destroy entire infected plants',
      'Do not compost infected material',
      'May need to destroy entire crop if severe'
    ],
    prevention: [
      'Plant resistant varieties when available',
      'Provide excellent air circulation',
      'Avoid overhead irrigation',
      'Apply preventive fungicide before symptoms appear',
      'Monitor weather - disease thrives in cool, wet conditions',
      'Keep plants dry, water early in day'
    ],
    affectedParts: ['leaves', 'stems', 'fruits', 'entire-plant'],
    visualIndicators: {
      colors: ['dark-brown', 'black', 'water-soaked', 'white-fuzzy'],
      patterns: ['irregular-blotches', 'spreading-lesions', 'white-mold'],
      textures: ['water-soaked', 'mushy', 'fuzzy-mold', 'collapsed']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Phytophthora_infestans'
  },
  {
    name: 'Tomato Bacterial Spot',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Bacterial disease causing small dark spots on leaves and fruits, can significantly reduce yield.',
    symptoms: [
      'Small dark brown to black spots on leaves',
      'Yellow halo around spots on leaves',
      'Spots may have greasy appearance',
      'Raised dark spots on green fruits',
      'Severe defoliation in advanced stages',
      'Reduced fruit quality and marketability'
    ],
    causes: [
      'Xanthomonas bacteria species',
      'Warm wet weather conditions',
      'Overhead watering or rain splash',
      'Contaminated seeds or transplants',
      'Spread by handling wet plants',
      'Wind-driven rain'
    ],
    treatment: [
      'Apply copper-based bactericide',
      'Remove severely infected plants',
      'Avoid working with plants when wet',
      'Improve air circulation',
      'Reduce humidity around plants',
      'Consider streptomycin sprays (where legal)'
    ],
    prevention: [
      'Use certified disease-free seeds and transplants',
      'Plant resistant varieties',
      'Avoid overhead irrigation',
      'Provide adequate plant spacing',
      'Remove plant debris after harvest',
      'Practice 3-year crop rotation'
    ],
    affectedParts: ['leaves', 'fruits', 'stems'],
    visualIndicators: {
      colors: ['dark-brown', 'black', 'yellow-halo', 'greasy-spots'],
      patterns: ['small-spots', 'scattered-lesions', 'raised-spots'],
      textures: ['greasy', 'scabby', 'raised', 'rough']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Bacterial_spot'
  },
  {
    name: 'Tomato Leaf Mold',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Fungal disease common in greenhouses, causing yellow spots on upper leaf surface and mold on lower surface.',
    symptoms: [
      'Pale green or yellow spots on upper leaf surface',
      'Olive-green to gray-brown velvety mold on lower leaf surface',
      'Older leaves affected first',
      'Leaves curl, wither and drop',
      'Rarely affects fruit directly',
      'Thrives in humid greenhouse conditions'
    ],
    causes: [
      'Passalora fulva fungus (formerly Fulvia fulva)',
      'High humidity (>85%)',
      'Poor air circulation',
      'Temperatures 60-80°F',
      'Greenhouse or enclosed growing conditions',
      'Overhead watering'
    ],
    treatment: [
      'Reduce humidity below 85%',
      'Improve ventilation and air circulation',
      'Remove infected leaves',
      'Apply chlorothalonil or copper fungicide',
      'Space plants properly',
      'Avoid overhead watering'
    ],
    prevention: [
      'Plant resistant varieties',
      'Maintain proper greenhouse ventilation',
      'Keep humidity levels low',
      'Water at base of plants',
      'Provide adequate spacing',
      'Sanitize greenhouse between crops'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['yellow-spots', 'olive-green', 'gray-brown', 'velvety-mold'],
      patterns: ['upper-yellow-spots', 'lower-mold', 'velvety-coating'],
      textures: ['velvety', 'fuzzy', 'mold', 'wilted']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Tomato_leaf_mold'
  },
  {
    name: 'Tomato Septoria Leaf Spot',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Fungal disease causing numerous small circular spots with gray centers on leaves.',
    symptoms: [
      'Small circular spots with dark borders and gray centers',
      'Tiny black dots (fruiting bodies) in center of spots',
      'Lower leaves affected first, progressing upward',
      'Leaves turn yellow and drop',
      'Severe defoliation reduces fruit quality',
      'Does not typically affect stems or fruit'
    ],
    causes: [
      'Septoria lycopersici fungus',
      'Warm wet weather (60-80°F)',
      'High humidity',
      'Rain splash spreading spores',
      'Infected plant debris in soil',
      'Overhead watering'
    ],
    treatment: [
      'Remove and destroy infected leaves',
      'Apply chlorothalonil or mancozeb fungicide',
      'Mulch around plants to prevent soil splash',
      'Stake plants for better air circulation',
      'Remove lower leaves touching ground',
      'Maintain regular fungicide schedule'
    ],
    prevention: [
      'Use disease-free transplants',
      'Rotate crops for 3 years',
      'Mulch to prevent soil splash',
      'Water at soil level',
      'Space plants for good air flow',
      'Remove all plant debris at end of season'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['gray-center', 'dark-border', 'yellow-leaves', 'black-dots'],
      patterns: ['circular-spots', 'small-spots', 'black-dots', 'numerous-lesions'],
      textures: ['dry', 'necrotic', 'spotted']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Septoria_leaf_spot'
  },
  {
    name: 'Tomato Yellow Leaf Curl Virus',
    plantType: 'Tomato',
    severity: 'high',
    description: 'Viral disease transmitted by whiteflies causing severe stunting and leaf yellowing.',
    symptoms: [
      'Upward curling of leaf margins',
      'Yellowing of leaf edges (interveinal chlorosis)',
      'Severe stunting of plants',
      'Flowers drop before fruit set',
      'Little to no fruit production',
      'Bushy appearance due to shortened internodes'
    ],
    causes: [
      'Tomato yellow leaf curl virus (TYLCV)',
      'Transmitted by whiteflies (Bemisia tabaci)',
      'Infected transplants',
      'Warm weather favoring whitefly activity',
      'No cure once infected',
      'Virus persists in whiteflies and infected plants'
    ],
    treatment: [
      'No cure - remove and destroy infected plants',
      'Control whitefly populations with insecticides',
      'Use yellow sticky traps',
      'Apply insecticidal soap or neem oil',
      'Use reflective mulches to repel whiteflies',
      'Remove infected plants to prevent spread'
    ],
    prevention: [
      'Plant resistant varieties',
      'Use insect-proof screens in greenhouses',
      'Control whiteflies before they spread virus',
      'Remove weeds that host whiteflies',
      'Use virus-free transplants',
      'Apply systemic insecticides at transplanting'
    ],
    affectedParts: ['leaves', 'entire-plant'],
    visualIndicators: {
      colors: ['yellow', 'yellow-edges', 'light-green', 'pale'],
      patterns: ['upward-curling', 'interveinal-yellowing', 'stunted'],
      textures: ['curled', 'thick', 'leathery', 'cupped']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Tomato_yellow_leaf_curl_virus'
  },
  {
    name: 'Tomato Mosaic Virus',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Viral disease causing mottled light and dark green pattern on leaves and reduced fruit quality.',
    symptoms: [
      'Mottled light and dark green pattern on leaves',
      'Distorted or fern-like leaves',
      'Stunted plant growth',
      'Yellow streaking on fruits',
      'Reduced fruit size and quality',
      'Browning of fruit interior (internal browning)'
    ],
    causes: [
      'Tomato mosaic virus (ToMV) or Tobacco mosaic virus (TMV)',
      'Mechanical transmission (handling, tools, clothing)',
      'Contaminated seeds',
      'Spread by aphids in some cases',
      'Virus very stable, survives in debris',
      'Transmitted through plant sap'
    ],
    treatment: [
      'No cure - remove infected plants immediately',
      'Sanitize tools with 10% bleach solution',
      'Wash hands before handling healthy plants',
      'Do not smoke near tomato plants (tobacco carries TMV)',
      'Control aphid populations',
      'Destroy infected plants - do not compost'
    ],
    prevention: [
      'Plant resistant varieties',
      'Use virus-free certified seeds',
      'Sanitize tools and hands regularly',
      'Avoid tobacco use near plants',
      'Control aphid vectors',
      'Remove and destroy infected plants immediately'
    ],
    affectedParts: ['leaves', 'fruits', 'entire-plant'],
    visualIndicators: {
      colors: ['mottled-green', 'light-dark-green', 'yellow-streaks'],
      patterns: ['mosaic-pattern', 'mottling', 'distorted-leaves'],
      textures: ['distorted', 'fern-like', 'malformed']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Tomato_mosaic_virus'
  },
  {
    name: 'Tomato Target Spot',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Fungal disease causing spots with concentric rings on leaves, stems, and fruits.',
    symptoms: [
      'Brown spots with concentric rings on leaves',
      'Spots can be small or large (up to 1/2 inch)',
      'Yellow halo may surround lesions',
      'Affects leaves, stems, and fruits',
      'Defoliation in severe cases',
      'Fruit lesions are dark, sunken with concentric rings'
    ],
    causes: [
      'Corynespora cassiicola fungus',
      'Warm humid weather (65-90°F)',
      'High humidity and leaf wetness',
      'Poor air circulation',
      'Overhead irrigation',
      'Dense plant canopy'
    ],
    treatment: [
      'Apply fungicides (chlorothalonil, mancozeb, azoxystrobin)',
      'Remove infected plant material',
      'Improve air circulation through pruning',
      'Apply fungicides preventively',
      'Mulch to reduce soil splash',
      'Maintain dry foliage'
    ],
    prevention: [
      'Plant resistant varieties when available',
      'Provide adequate plant spacing',
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Apply preventive fungicides',
      'Remove plant debris after harvest'
    ],
    affectedParts: ['leaves', 'stems', 'fruits'],
    visualIndicators: {
      colors: ['brown-spots', 'yellow-halo', 'dark-sunken'],
      patterns: ['concentric-rings', 'target-spots', 'circular-lesions'],
      textures: ['sunken', 'dry', 'necrotic']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Target_spot'
  },
  {
    name: 'Tomato Spider Mites (Two-Spotted)',
    plantType: 'Tomato',
    severity: 'medium',
    description: 'Tiny arachnids that feed on plant sap, causing stippling and webbing on leaves.',
    symptoms: [
      'Tiny yellow or white speckles on leaves (stippling)',
      'Fine webbing on undersides of leaves',
      'Leaves turn bronze, yellow, or brown',
      'Leaf drop in severe infestations',
      'Visible tiny moving dots under magnification',
      'Reduced plant vigor and yield'
    ],
    causes: [
      'Tetranychus urticae (two-spotted spider mite)',
      'Hot, dry weather favors reproduction',
      'Low humidity',
      'Dusty conditions',
      'Stressed or water-deficient plants',
      'Rapid reproduction (7-10 days per generation)'
    ],
    treatment: [
      'Spray plants with strong water jet to dislodge mites',
      'Apply insecticidal soap or neem oil',
      'Use miticides (abamectin, bifenazate) for severe cases',
      'Increase humidity around plants',
      'Introduce predatory mites (Phytoseiulus persimilis)',
      'Rotate miticide classes to prevent resistance'
    ],
    prevention: [
      'Maintain adequate plant moisture',
      'Increase humidity in dry conditions',
      'Remove dusty conditions',
      'Monitor plants regularly',
      'Encourage beneficial predators',
      'Avoid broad-spectrum insecticides that kill predators'
    ],
    affectedParts: ['leaves'],
    visualIndicators: {
      colors: ['yellow-speckles', 'bronze', 'brown-leaves'],
      patterns: ['stippling', 'webbing', 'speckled'],
      textures: ['dry', 'webbed', 'crispy']
    },
    kaggleReference: 'https://www.kaggle.com/code/hk9088/plant-disese-detecton',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Spider_mite'
  }
];

// Advanced disease detection using multi-layer analysis with improved accuracy
export function analyzeForDiseases(imageFeatures: any[]): PlantDisease[] {
  if (!imageFeatures || imageFeatures.length === 0) {
    return [];
  }

  const detectedDiseases: PlantDisease[] = [];
  
  // Extract and analyze features from all images
  const featureAnalysis = extractComprehensiveFeatures(imageFeatures);
  
  // Analyze each disease using advanced multi-factor scoring
  diseaseDatabase.forEach((disease, index) => {
    const analysisResult = analyzeDiseaseMatch(disease, featureAnalysis, imageFeatures);
    
    // Only include diseases with significant confidence (threshold: 30%)
    if (analysisResult.confidence >= 30) {
      detectedDiseases.push({
        id: `disease_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...disease,
        confidence: analysisResult.confidence
      });
    }
  });
  
  // Sort by confidence and apply post-processing filters
  const filteredDiseases = applyPostProcessingFilters(detectedDiseases, featureAnalysis);
  
  // Return top 5 most likely diseases
  return filteredDiseases.slice(0, 5);
}

// Extract comprehensive features from all images with cross-image correlation
function extractComprehensiveFeatures(imageFeatures: any[]) {
  const allColors = imageFeatures.flatMap(f => [...f.colors.dominant, ...f.colors.secondary]);
  const allTextures = imageFeatures.flatMap(f => f.textures.surface);
  const allPatterns = imageFeatures.flatMap(f => f.textures.patterns);
  const allShapes = imageFeatures.flatMap(f => f.shapes?.edgeType || []);
  const allMarkings = imageFeatures.flatMap(f => f.patterns?.markings || []);
  
  // Calculate consistency across images (higher consistency = more reliable detection)
  const colorConsistency = calculateFeatureConsistency(imageFeatures.map(f => f.colors.dominant));
  const textureConsistency = calculateFeatureConsistency(imageFeatures.map(f => f.textures.surface));
  const patternConsistency = calculateFeatureConsistency(imageFeatures.map(f => f.textures.patterns));
  
  // Detect disease-specific indicators
  const diseaseIndicators = {
    hasSpots: allPatterns.some(p => p.includes('spot')) || allMarkings.some(m => m.includes('spot')),
    hasWilting: allPatterns.some(p => p.includes('wilted')) || allShapes.some(s => s.includes('wilted')),
    hasDiscoloration: allColors.some(c => ['brown', 'yellow', 'black', 'white-powder'].some(d => c.includes(d))),
    hasDryness: allTextures.some(t => ['dry', 'crispy', 'necrotic'].some(d => t.includes(d))),
    hasHoles: allPatterns.some(p => p.includes('holes')),
    hasCurling: allPatterns.some(p => p.includes('curled')),
    hasMold: allColors.some(c => c.includes('white-powder') || c.includes('mold')) || 
             allTextures.some(t => t.includes('fuzzy') || t.includes('powdery'))
  };
  
  return {
    allColors,
    allTextures,
    allPatterns,
    allShapes,
    allMarkings,
    colorConsistency,
    textureConsistency,
    patternConsistency,
    diseaseIndicators,
    imageCount: imageFeatures.length
  };
}

// Calculate feature consistency across multiple images
function calculateFeatureConsistency(featureSets: any[][]): number {
  if (featureSets.length <= 1) return 1.0;
  
  const allFeatures = featureSets.flat();
  const featureCounts: { [key: string]: number } = {};
  
  allFeatures.forEach(feature => {
    featureCounts[feature] = (featureCounts[feature] || 0) + 1;
  });
  
  const maxOccurrence = Math.max(...Object.values(featureCounts));
  const consistency = maxOccurrence / featureSets.length;
  
  return Math.min(1.0, consistency);
}

// Advanced disease matching with multi-layer analysis
function analyzeDiseaseMatch(disease: any, features: any, imageFeatures: any[]): { confidence: number } {
  let totalScore = 0;
  let weights = 0;
  
  // Layer 1: Visual Indicator Matching (35% weight)
  const colorScore = calculateColorMatchScore(disease.visualIndicators.colors, features.allColors);
  totalScore += colorScore.score * 0.35;
  weights += 0.35;
  
  // Layer 2: Texture Analysis (25% weight)
  const textureScore = calculateTextureMatchScore(disease.visualIndicators.textures, features.allTextures);
  totalScore += textureScore.score * 0.25;
  weights += 0.25;
  
  // Layer 3: Pattern Recognition (20% weight)
  const patternScore = calculatePatternMatchScore(disease.visualIndicators.patterns, features.allPatterns);
  totalScore += patternScore.score * 0.20;
  weights += 0.20;
  
  // Layer 4: Symptom Correlation (10% weight)
  const symptomScore = calculateSymptomCorrelation(disease, features);
  totalScore += symptomScore * 0.10;
  weights += 0.10;
  
  // Layer 5: Disease Indicator Matching (10% weight)
  const indicatorScore = matchDiseaseIndicators(disease, features.diseaseIndicators);
  totalScore += indicatorScore * 0.10;
  weights += 0.10;
  
  // Apply consistency bonus (more images with consistent features = higher confidence)
  const consistencyBonus = (features.colorConsistency + features.textureConsistency + features.patternConsistency) / 3;
  totalScore *= (0.8 + consistencyBonus * 0.4); // Up to 20% bonus for high consistency
  
  // Apply multi-image bonus (more images = better detection)
  const imageBonus = Math.min(0.15, features.imageCount * 0.03); // Up to 15% bonus
  totalScore *= (1.0 + imageBonus);
  
  // Normalize to 0-100 confidence scale
  const confidence = Math.round(Math.min(100, Math.max(0, totalScore * 100)));
  
  return { confidence };
}

// Enhanced color matching with semantic understanding
function calculateColorMatchScore(diseaseColors: string[], imageColors: string[]): { score: number; matches: string[] } {
  const matches: string[] = [];
  let score = 0;
  
  diseaseColors.forEach(diseaseColor => {
    imageColors.forEach(imageColor => {
      const similarity = getColorSimilarity(diseaseColor, imageColor);
      if (similarity > 0.6) {
        matches.push(diseaseColor);
        score += similarity;
      }
    });
  });
  
  // Normalize score based on total possible matches
  const normalizedScore = Math.min(1.0, score / Math.max(diseaseColors.length, 1));
  
  return { score: normalizedScore, matches: [...new Set(matches)] };
}

// Calculate color similarity with weighted scoring
function getColorSimilarity(color1: string, color2: string): number {
  // Exact match
  if (color1 === color2) return 1.0;
  
  // Check semantic similarity
  if (areColorsSimilar(color1, color2)) return 0.85;
  
  // Partial match
  if (color1.includes(color2) || color2.includes(color1)) return 0.7;
  
  // Check for color family matches
  const colorFamilies = {
    'brown': ['tan', 'brown', 'dark-brown', 'reddish-brown', 'orange-brown', 'corky'],
    'yellow': ['yellow', 'yellowing', 'pale', 'yellow-halo', 'yellow-spots', 'lime'],
    'black': ['black', 'dark', 'dark-spots', 'brown-black', 'very-dark'],
    'white': ['white', 'white-powder', 'pale', 'white-mold', 'fuzzy'],
    'green': ['green', 'dark-green', 'light-green', 'olive-green', 'blue-green']
  };
  
  for (const [family, variants] of Object.entries(colorFamilies)) {
    if (variants.some(v => color1.includes(v)) && variants.some(v => color2.includes(v))) {
      return 0.65;
    }
  }
  
  return 0.0;
}

// Enhanced texture matching
function calculateTextureMatchScore(diseaseTextures: string[], imageTextures: string[]): { score: number; matches: string[] } {
  const matches: string[] = [];
  let score = 0;
  
  diseaseTextures.forEach(diseaseTexture => {
    imageTextures.forEach(imageTexture => {
      if (imageTexture === diseaseTexture) {
        matches.push(diseaseTexture);
        score += 1.0;
      } else if (imageTexture.includes(diseaseTexture) || diseaseTexture.includes(imageTexture)) {
        matches.push(diseaseTexture);
        score += 0.75;
      } else if (areTexturesSimilar(imageTexture, diseaseTexture)) {
        matches.push(diseaseTexture);
        score += 0.6;
      }
    });
  });
  
  const normalizedScore = Math.min(1.0, score / Math.max(diseaseTextures.length, 1));
  return { score: normalizedScore, matches: [...new Set(matches)] };
}

// Check texture similarity
function areTexturesSimilar(texture1: string, texture2: string): boolean {
  const similarGroups = [
    ['dry', 'crispy', 'necrotic', 'papery'],
    ['fuzzy', 'powdery', 'dusty', 'mold'],
    ['wet', 'water-soaked', 'greasy', 'mushy'],
    ['rough', 'scabby', 'corky', 'raised'],
    ['smooth', 'glossy', 'waxy']
  ];
  
  for (const group of similarGroups) {
    if (group.some(t => texture1.includes(t)) && group.some(t => texture2.includes(t))) {
      return true;
    }
  }
  
  return false;
}

// Enhanced pattern matching
function calculatePatternMatchScore(diseasePatterns: string[], imagePatterns: string[]): { score: number; matches: string[] } {
  const matches: string[] = [];
  let score = 0;
  
  diseasePatterns.forEach(diseasePattern => {
    imagePatterns.forEach(imagePattern => {
      if (imagePattern === diseasePattern) {
        matches.push(diseasePattern);
        score += 1.0;
      } else if (imagePattern.includes(diseasePattern) || diseasePattern.includes(imagePattern)) {
        matches.push(diseasePattern);
        score += 0.8;
      } else if (arePatternsSimilar(imagePattern, diseasePattern)) {
        matches.push(diseasePattern);
        score += 0.65;
      }
    });
  });
  
  const normalizedScore = Math.min(1.0, score / Math.max(diseasePatterns.length, 1));
  return { score: normalizedScore, matches: [...new Set(matches)] };
}

// Check pattern similarity
function arePatternsSimilar(pattern1: string, pattern2: string): boolean {
  const similarGroups = [
    ['spots', 'speckled', 'dotted', 'stippling'],
    ['spots', 'lesions', 'blotches'],
    ['wilted', 'drooping', 'sagging'],
    ['curled', 'twisted', 'distorted'],
    ['concentric', 'rings', 'target', 'bullseye']
  ];
  
  for (const group of similarGroups) {
    if (group.some(p => pattern1.includes(p)) && group.some(p => pattern2.includes(p))) {
      return true;
    }
  }
  
  return false;
}

// Calculate symptom correlation score
function calculateSymptomCorrelation(disease: any, features: any): number {
  let correlationScore = 0;
  let totalChecks = 0;
  
  // Check if symptoms correlate with detected visual features
  const symptoms = disease.symptoms.map((s: string) => s.toLowerCase());
  
  // Check for color-related symptoms
  if (symptoms.some((s: string) => s.includes('brown') || s.includes('yellow') || s.includes('black'))) {
    totalChecks++;
    if (features.diseaseIndicators.hasDiscoloration) correlationScore++;
  }
  
  // Check for texture-related symptoms
  if (symptoms.some((s: string) => s.includes('dry') || s.includes('wilted') || s.includes('crispy'))) {
    totalChecks++;
    if (features.diseaseIndicators.hasDryness) correlationScore++;
  }
  
  // Check for pattern-related symptoms
  if (symptoms.some((s: string) => s.includes('spot') || s.includes('lesion') || s.includes('patch'))) {
    totalChecks++;
    if (features.diseaseIndicators.hasSpots) correlationScore++;
  }
  
  // Check for mold/powder symptoms
  if (symptoms.some((s: string) => s.includes('powder') || s.includes('mold') || s.includes('fuzzy'))) {
    totalChecks++;
    if (features.diseaseIndicators.hasMold) correlationScore++;
  }
  
  return totalChecks > 0 ? correlationScore / totalChecks : 0;
}

// Match disease-specific indicators
function matchDiseaseIndicators(disease: any, indicators: any): number {
  let score = 0;
  let totalIndicators = 0;
  
  const symptoms = disease.symptoms.map((s: string) => s.toLowerCase());
  
  // Check each indicator
  if (indicators.hasSpots) {
    totalIndicators++;
    if (symptoms.some((s: string) => s.includes('spot') || s.includes('lesion'))) score++;
  }
  
  if (indicators.hasWilting) {
    totalIndicators++;
    if (symptoms.some((s: string) => s.includes('wilt') || s.includes('droop'))) score++;
  }
  
  if (indicators.hasDiscoloration) {
    totalIndicators++;
    if (symptoms.some((s: string) => s.includes('yellow') || s.includes('brown') || s.includes('discolor'))) score++;
  }
  
  if (indicators.hasDryness) {
    totalIndicators++;
    if (symptoms.some((s: string) => s.includes('dry') || s.includes('crisp') || s.includes('necrotic'))) score++;
  }
  
  if (indicators.hasMold) {
    totalIndicators++;
    if (symptoms.some((s: string) => s.includes('powder') || s.includes('mold') || s.includes('fuzzy'))) score++;
  }
  
  return totalIndicators > 0 ? score / totalIndicators : 0.5;
}

// Apply post-processing filters to improve accuracy
function applyPostProcessingFilters(diseases: PlantDisease[], features: any): PlantDisease[] {
  // Sort by confidence
  diseases.sort((a, b) => b.confidence - a.confidence);
  
  // Remove duplicates and very low confidence results
  const filtered = diseases.filter((disease, index, self) => 
    disease.confidence >= 30 && 
    index === self.findIndex(d => d.name === disease.name)
  );
  
  // If we have high-confidence results, filter out low-confidence ones
  const maxConfidence = filtered.length > 0 ? filtered[0].confidence : 0;
  if (maxConfidence >= 70) {
    return filtered.filter(d => d.confidence >= maxConfidence * 0.5);
  }
  
  // If we have medium confidence, keep results within reasonable range
  if (maxConfidence >= 50) {
    return filtered.filter(d => d.confidence >= maxConfidence * 0.6);
  }
  
  // Otherwise return all filtered results
  return filtered;
}

// Enhanced color similarity matching for disease detection
function areColorsSimilar(color1: string, color2: string): boolean {
  const similarityMap: { [key: string]: string[] } = {
    'brown': ['brown', 'tan', 'dark-spots', 'necrotic', 'dark-brown', 'corky', 'brown-spots', 'reddish-brown', 'orange-brown'],
    'yellow': ['yellow', 'yellowing', 'pale', 'lime-yellow', 'yellow-halo', 'yellow-spots', 'yellow-edges', 'yellow-orange'],
    'black': ['black', 'dark', 'very-dark', 'dark-spots', 'brown-black', 'dark-brown'],
    'white': ['white', 'white-powder', 'bleached', 'pale', 'white-mold', 'white-fuzzy', 'gray-white-fuzzy'],
    'gray': ['gray', 'grey', 'gray-coating', 'gray-mold', 'gray-center', 'olive-green'],
    'green': ['green', 'dark-green', 'light-green', 'mottled-green', 'olive-green', 'blue-green'],
    'red': ['red', 'reddish', 'rust-colored', 'orange', 'reddish-brown', 'red-tint'],
    'orange': ['orange', 'bright-orange', 'yellow-orange', 'rust-colored'],
    'purple': ['purple', 'purplish', 'purple-border', 'purplish-brown'],
    'water-soaked': ['water-soaked', 'wet', 'soaked', 'water', 'greasy'],
  };
  
  for (const [base, variants] of Object.entries(similarityMap)) {
    if (variants.some(v => color1.includes(v)) && variants.some(v => color2.includes(v))) {
      return true;
    }
  }
  
  return false;
}

// Generate disease health score based on detected diseases
export function calculatePlantHealthScore(diseases: PlantDisease[]): {
  score: number;
  status: 'healthy' | 'minor-issues' | 'needs-attention' | 'critical';
  message: string;
} {
  if (diseases.length === 0) {
    return {
      score: 95,
      status: 'healthy',
      message: 'Your plant appears healthy with no visible disease symptoms detected.'
    };
  }
  
  // Calculate health score based on detected diseases and their severity
  const highSeverityCount = diseases.filter(d => d.severity === 'high').length;
  const mediumSeverityCount = diseases.filter(d => d.severity === 'medium').length;
  const lowSeverityCount = diseases.filter(d => d.severity === 'low').length;
  
  let healthScore = 95;
  healthScore -= highSeverityCount * 35;  // High severity: -35 points each
  healthScore -= mediumSeverityCount * 18; // Medium severity: -18 points each
  healthScore -= lowSeverityCount * 10;    // Low severity: -10 points each
  healthScore = Math.max(10, healthScore);
  
  let status: 'healthy' | 'minor-issues' | 'needs-attention' | 'critical';
  let message: string;
  
  if (healthScore >= 75) {
    status = 'minor-issues';
    message = 'Your plant has minor issues that should be addressed soon to prevent further damage.';
  } else if (healthScore >= 50) {
    status = 'needs-attention';
    message = 'Your plant needs immediate attention. Follow the treatment recommendations carefully.';
  } else {
    status = 'critical';
    message = 'CRITICAL: Your plant is in serious condition. Immediate action required to save it!';
  }
  
  return { score: healthScore, status, message };
}

// Get disease by name (for manual lookup)
export function getDiseaseInfo(diseaseName: string): PlantDisease | null {
  const disease = diseaseDatabase.find(d => 
    d.name.toLowerCase() === diseaseName.toLowerCase()
  );
  
  if (disease) {
    return {
      id: `disease_${Date.now()}`,
      ...disease,
      confidence: 100
    };
  }
  
  return null;
}

// Get all diseases (for reference and database browsing)
export function getAllDiseases(): PlantDisease[] {
  return diseaseDatabase.map((disease, index) => ({
    id: `disease_${index}`,
    ...disease,
    confidence: 100
  }));
}

// Get diseases by plant type (useful for targeted diagnosis)
export function getDiseasesByPlantType(plantType: string): PlantDisease[] {
  return diseaseDatabase
    .filter(d => d.plantType === plantType || d.plantType === 'Multiple')
    .map((disease, index) => ({
      id: `disease_${plantType}_${index}`,
      ...disease,
      confidence: 100
    }));
}

// Get disease statistics for educational purposes
export function getDiseaseStatistics(): {
  totalDiseases: number;
  byPlantType: { [key: string]: number };
  bySeverity: { high: number; medium: number; low: number };
} {
  const byPlantType: { [key: string]: number } = {};
  const bySeverity = { high: 0, medium: 0, low: 0 };
  
  diseaseDatabase.forEach(disease => {
    if (disease.plantType) {
      byPlantType[disease.plantType] = (byPlantType[disease.plantType] || 0) + 1;
    }
    bySeverity[disease.severity]++;
  });
  
  return {
    totalDiseases: diseaseDatabase.length,
    byPlantType,
    bySeverity
  };
}

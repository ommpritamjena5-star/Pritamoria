// Advanced image analysis utilities for plant identification

export interface ImageFeatures {
  colors: {
    dominant: string[];
    secondary: string[];
    hasVariegation: boolean;
    colorIntensity: 'light' | 'medium' | 'dark';
  };
  shapes: {
    leafShape: string[];
    plantStructure: string;
    symmetry: 'symmetric' | 'asymmetric';
    edgeType: string[];
  };
  textures: {
    surface: string[];
    patterns: string[];
    glossiness: 'matte' | 'semi-gloss' | 'glossy';
  };
  size: {
    leafSize: 'small' | 'medium' | 'large';
    plantSize: 'compact' | 'medium' | 'large';
  };
  patterns: {
    veining: string[];
    markings: string[];
    growth: string[];
  };
  structure: {
    arrangement: string[];
    stem: string[];
    flowers: string[];
    fruits: string[];
  };
}

// Enhanced plant database with detailed visual characteristics and common names
export const plantDatabase = [
  {
    name: 'Monstera deliciosa',
    commonNames: ['Swiss Cheese Plant', 'Split Leaf Philodendron'],
    scientificName: 'Monstera deliciosa',
    type: 'plant' as const,
    searchTerm: 'Monstera deliciosa',
    family: 'Araceae',
    visualFeatures: {
      colors: ['dark-green', 'medium-green'],
      leafShape: ['heart-shaped', 'split', 'fenestrated', 'large'],
      texture: ['glossy', 'smooth', 'thick'],
      patterns: ['natural-holes', 'splits', 'prominent-veining'],
      structure: ['climbing', 'aerial-roots', 'large-leaves'],
      size: 'large'
    }
  },
  {
    name: 'Sansevieria trifasciata',
    commonNames: ['Snake Plant', 'Mother-in-Law\'s Tongue', 'Viper\'s Bowstring Hemp'],
    scientificName: 'Sansevieria trifasciata',
    type: 'plant' as const,
    searchTerm: 'Sansevieria trifasciata',
    family: 'Asparagaceae',
    visualFeatures: {
      colors: ['dark-green', 'yellow-edge', 'variegated'],
      leafShape: ['sword-like', 'upright', 'thick', 'pointed'],
      texture: ['waxy', 'smooth', 'firm'],
      patterns: ['horizontal-stripes', 'yellow-margins'],
      structure: ['rosette', 'upright', 'no-stem'],
      size: 'medium'
    }
  },
  {
    name: 'Ficus lyrata',
    commonNames: ['Fiddle Leaf Fig', 'Banjo Fig'],
    scientificName: 'Ficus lyrata',
    type: 'plant' as const,
    searchTerm: 'Ficus lyrata',
    family: 'Moraceae',
    visualFeatures: {
      colors: ['dark-green', 'glossy-green'],
      leafShape: ['fiddle-shaped', 'large', 'oval', 'broad'],
      texture: ['very-glossy', 'thick', 'leathery'],
      patterns: ['prominent-veining', 'symmetrical'],
      structure: ['tree-like', 'single-trunk', 'large-leaves'],
      size: 'large'
    }
  },
  {
    name: 'Spathiphyllum',
    commonNames: ['Peace Lily', 'White Sails', 'Spathe Flower'],
    scientificName: 'Spathiphyllum wallisii',
    type: 'flower' as const,
    searchTerm: 'Spathiphyllum',
    family: 'Araceae',
    visualFeatures: {
      colors: ['dark-green', 'white-flowers'],
      leafShape: ['lanceolate', 'pointed', 'elongated'],
      texture: ['smooth', 'semi-glossy'],
      patterns: ['parallel-veining', 'white-spathe'],
      structure: ['clumping', 'no-stem', 'flowers'],
      size: 'medium'
    }
  },
  {
    name: 'Ficus elastica',
    commonNames: ['Rubber Tree', 'Rubber Plant', 'Indian Rubber Bush'],
    scientificName: 'Ficus elastica',
    type: 'tree' as const,
    searchTerm: 'Ficus elastica',
    family: 'Moraceae',
    visualFeatures: {
      colors: ['dark-green', 'burgundy', 'glossy'],
      leafShape: ['oval', 'large', 'thick', 'rounded'],
      texture: ['very-glossy', 'waxy', 'thick'],
      patterns: ['prominent-midrib', 'smooth-edges'],
      structure: ['tree-form', 'thick-trunk', 'milky-sap'],
      size: 'large'
    }
  },
  {
    name: 'Chlorophytum comosum',
    commonNames: ['Spider Plant', 'Airplane Plant', 'Spider Ivy'],
    scientificName: 'Chlorophytum comosum',
    type: 'plant' as const,
    searchTerm: 'Chlorophytum comosum',
    family: 'Asparagaceae',
    visualFeatures: {
      colors: ['green-white-stripes', 'variegated', 'light-green'],
      leafShape: ['narrow', 'arching', 'long', 'grass-like'],
      texture: ['soft', 'thin', 'flexible'],
      patterns: ['white-stripes', 'central-stripe'],
      structure: ['arching', 'stolons', 'plantlets'],
      size: 'medium'
    }
  },
  {
    name: 'Aloe vera',
    commonNames: ['Aloe Vera', 'True Aloe', 'Medicinal Aloe'],
    scientificName: 'Aloe vera',
    type: 'plant' as const,
    searchTerm: 'Aloe vera',
    family: 'Asphodelaceae',
    visualFeatures: {
      colors: ['blue-green', 'gray-green', 'succulent'],
      leafShape: ['triangular', 'thick', 'pointed', 'serrated'],
      texture: ['fleshy', 'waxy', 'smooth'],
      patterns: ['white-spots', 'serrated-edges'],
      structure: ['rosette', 'succulent', 'no-stem'],
      size: 'medium'
    }
  },
  {
    name: 'Nephrolepis exaltata',
    commonNames: ['Boston Fern', 'Sword Fern', 'Ladder Fern'],
    scientificName: 'Nephrolepis exaltata',
    type: 'plant' as const,
    searchTerm: 'Nephrolepis exaltata',
    family: 'Nephrolepidaceae',
    visualFeatures: {
      colors: ['bright-green', 'medium-green'],
      leafShape: ['feathery', 'compound', 'delicate', 'arching'],
      texture: ['soft', 'delicate', 'fine'],
      patterns: ['compound-fronds', 'symmetrical'],
      structure: ['arching', 'cascading', 'dense'],
      size: 'medium'
    }
  },
  {
    name: 'Crassula ovata',
    commonNames: ['Jade Plant', 'Money Tree', 'Lucky Plant'],
    scientificName: 'Crassula ovata',
    type: 'plant' as const,
    searchTerm: 'Crassula ovata',
    family: 'Crassulaceae',
    visualFeatures: {
      colors: ['jade-green', 'red-edges', 'succulent'],
      leafShape: ['oval', 'thick', 'small', 'rounded'],
      texture: ['fleshy', 'smooth', 'waxy'],
      patterns: ['red-margins', 'simple-leaves'],
      structure: ['tree-like', 'branching', 'woody-stem'],
      size: 'small'
    }
  },
  {
    name: 'Epipremnum aureum',
    commonNames: ['Golden Pothos', 'Devil\'s Ivy', 'Money Plant'],
    scientificName: 'Epipremnum aureum',
    type: 'plant' as const,
    searchTerm: 'Epipremnum aureum',
    family: 'Araceae',
    visualFeatures: {
      colors: ['green-yellow', 'variegated', 'golden'],
      leafShape: ['heart-shaped', 'medium', 'pointed'],
      texture: ['waxy', 'smooth', 'glossy'],
      patterns: ['yellow-variegation', 'marbled'],
      structure: ['trailing', 'climbing', 'aerial-roots'],
      size: 'medium'
    }
  },
  // Additional plants for better coverage
  {
    name: 'Dracaena marginata',
    commonNames: ['Dragon Tree', 'Madagascar Dragon Tree', 'Red-edged Dracaena'],
    scientificName: 'Dracaena marginata',
    type: 'plant' as const,
    searchTerm: 'Dracaena marginata',
    family: 'Asparagaceae',
    visualFeatures: {
      colors: ['dark-green', 'red-edges', 'narrow'],
      leafShape: ['narrow', 'long', 'pointed', 'thin'],
      texture: ['leathery', 'smooth', 'firm'],
      patterns: ['red-margins', 'linear'],
      structure: ['tree-like', 'cane-stem', 'crown'],
      size: 'medium'
    }
  },
  {
    name: 'Zamioculcas zamiifolia',
    commonNames: ['ZZ Plant', 'Zanzibar Gem', 'Eternity Plant'],
    scientificName: 'Zamioculcas zamiifolia',
    type: 'plant' as const,
    searchTerm: 'Zamioculcas zamiifolia',
    family: 'Araceae',
    visualFeatures: {
      colors: ['dark-green', 'glossy-green', 'waxy'],
      leafShape: ['oval', 'thick', 'compound', 'glossy'],
      texture: ['very-glossy', 'waxy', 'thick'],
      patterns: ['compound-leaves', 'symmetrical'],
      structure: ['upright', 'rhizome', 'stems'],
      size: 'medium'
    }
  },
  {
    name: 'Philodendron hederaceum',
    commonNames: ['Heartleaf Philodendron', 'Sweetheart Plant'],
    scientificName: 'Philodendron hederaceum',
    type: 'plant' as const,
    searchTerm: 'Philodendron hederaceum',
    family: 'Araceae',
    visualFeatures: {
      colors: ['dark-green', 'heart-shaped'],
      leafShape: ['heart-shaped', 'small', 'pointed'],
      texture: ['glossy', 'smooth', 'thin'],
      patterns: ['heart-shape', 'simple'],
      structure: ['trailing', 'climbing', 'aerial-roots'],
      size: 'small'
    }
  },
  {
    name: 'Calathea orbifolia',
    commonNames: ['Round-leaf Calathea', 'Prayer Plant'],
    scientificName: 'Calathea orbifolia',
    type: 'plant' as const,
    searchTerm: 'Calathea orbifolia',
    family: 'Marantaceae',
    visualFeatures: {
      colors: ['light-green', 'dark-green', 'striped'],
      leafShape: ['round', 'large', 'broad'],
      texture: ['matte', 'soft', 'thin'],
      patterns: ['silver-stripes', 'parallel-lines'],
      structure: ['clumping', 'no-stem', 'upright'],
      size: 'large'
    }
  },
  {
    name: 'Anthurium andraeanum',
    commonNames: ['Flamingo Flower', 'Tailflower', 'Painted Anthurium'],
    scientificName: 'Anthurium andraeanum',
    type: 'flower' as const,
    searchTerm: 'Anthurium andraeanum',
    family: 'Araceae',
    visualFeatures: {
      colors: ['dark-green', 'red-flowers', 'glossy'],
      leafShape: ['heart-shaped', 'large', 'pointed'],
      texture: ['very-glossy', 'leathery', 'thick'],
      patterns: ['prominent-veining', 'red-spathe'],
      structure: ['clumping', 'flowers', 'upright'],
      size: 'medium'
    }
  },
  
  // FRUITS - Comprehensive Database
  {
    name: 'Malus domestica',
    commonNames: ['Apple', 'Common Apple'],
    scientificName: 'Malus domestica',
    type: 'fruit' as const,
    searchTerm: 'Apple',
    family: 'Rosaceae',
    visualFeatures: {
      colors: ['red', 'green', 'yellow', 'red-green'],
      leafShape: ['oval', 'serrated', 'medium'],
      texture: ['smooth', 'waxy', 'firm'],
      patterns: ['solid', 'striped', 'bicolor'],
      structure: ['round', 'spherical', 'stem'],
      size: 'medium'
    }
  },
  {
    name: 'Citrus × sinensis',
    commonNames: ['Orange', 'Sweet Orange'],
    scientificName: 'Citrus × sinensis',
    type: 'fruit' as const,
    searchTerm: 'Orange (fruit)',
    family: 'Rutaceae',
    visualFeatures: {
      colors: ['orange', 'bright-orange', 'yellow-orange'],
      leafShape: ['oval', 'glossy', 'pointed'],
      texture: ['bumpy', 'pebbled', 'textured'],
      patterns: ['pitted-surface', 'dimpled'],
      structure: ['round', 'spherical', 'citrus'],
      size: 'medium'
    }
  },
  {
    name: 'Musa',
    commonNames: ['Banana', 'Plantain'],
    scientificName: 'Musa acuminata',
    type: 'fruit' as const,
    searchTerm: 'Banana',
    family: 'Musaceae',
    visualFeatures: {
      colors: ['yellow', 'green', 'yellow-green'],
      leafShape: ['long', 'elongated', 'curved'],
      texture: ['smooth', 'waxy', 'peel'],
      patterns: ['elongated', 'curved', 'clustered'],
      structure: ['curved', 'elongated', 'bunch'],
      size: 'medium'
    }
  },
  {
    name: 'Fragaria × ananassa',
    commonNames: ['Strawberry', 'Garden Strawberry'],
    scientificName: 'Fragaria × ananassa',
    type: 'fruit' as const,
    searchTerm: 'Strawberry',
    family: 'Rosaceae',
    visualFeatures: {
      colors: ['red', 'bright-red', 'green-top'],
      leafShape: ['heart-shaped', 'conical'],
      texture: ['bumpy', 'seeded', 'textured'],
      patterns: ['seeds-on-surface', 'conical'],
      structure: ['conical', 'heart-shaped', 'green-cap'],
      size: 'small'
    }
  },
  {
    name: 'Vitis vinifera',
    commonNames: ['Grape', 'Wine Grape', 'Table Grape'],
    scientificName: 'Vitis vinifera',
    type: 'fruit' as const,
    searchTerm: 'Grape',
    family: 'Vitaceae',
    visualFeatures: {
      colors: ['purple', 'green', 'red', 'black'],
      leafShape: ['round', 'oval', 'small'],
      texture: ['smooth', 'waxy', 'glossy'],
      patterns: ['clustered', 'bunched', 'round'],
      structure: ['clustered', 'bunched', 'vine'],
      size: 'small'
    }
  },
  {
    name: 'Citrus × limon',
    commonNames: ['Lemon'],
    scientificName: 'Citrus × limon',
    type: 'fruit' as const,
    searchTerm: 'Lemon',
    family: 'Rutaceae',
    visualFeatures: {
      colors: ['yellow', 'bright-yellow', 'green-yellow'],
      leafShape: ['oval', 'pointed'],
      texture: ['bumpy', 'pebbled', 'textured'],
      patterns: ['pitted-surface', 'oval'],
      structure: ['oval', 'pointed-ends', 'citrus'],
      size: 'medium'
    }
  },
  {
    name: 'Solanum lycopersicum',
    commonNames: ['Tomato'],
    scientificName: 'Solanum lycopersicum',
    type: 'fruit' as const,
    searchTerm: 'Tomato',
    family: 'Solanaceae',
    visualFeatures: {
      colors: ['red', 'green', 'yellow', 'orange'],
      leafShape: ['round', 'smooth'],
      texture: ['smooth', 'glossy', 'firm'],
      patterns: ['smooth', 'round', 'green-stem'],
      structure: ['round', 'green-stem', 'smooth'],
      size: 'medium'
    }
  },
  {
    name: 'Persea americana',
    commonNames: ['Avocado', 'Alligator Pear'],
    scientificName: 'Persea americana',
    type: 'fruit' as const,
    searchTerm: 'Avocado',
    family: 'Lauraceae',
    visualFeatures: {
      colors: ['dark-green', 'green', 'black-green'],
      leafShape: ['pear-shaped', 'oval'],
      texture: ['bumpy', 'rough', 'pebbled'],
      patterns: ['rough-skin', 'pear-shaped'],
      structure: ['pear-shaped', 'large-seed'],
      size: 'medium'
    }
  },
  {
    name: 'Ananas comosus',
    commonNames: ['Pineapple'],
    scientificName: 'Ananas comosus',
    type: 'fruit' as const,
    searchTerm: 'Pineapple',
    family: 'Bromeliaceae',
    visualFeatures: {
      colors: ['yellow', 'golden', 'brown', 'green'],
      leafShape: ['spiky', 'crown', 'long'],
      texture: ['rough', 'hexagonal', 'scaly'],
      patterns: ['hexagonal', 'diamond', 'scaly'],
      structure: ['oval', 'crown-top', 'hexagonal'],
      size: 'large'
    }
  },
  {
    name: 'Prunus persica',
    commonNames: ['Peach'],
    scientificName: 'Prunus persica',
    type: 'fruit' as const,
    searchTerm: 'Peach',
    family: 'Rosaceae',
    visualFeatures: {
      colors: ['orange', 'yellow', 'red-blush', 'pink'],
      leafShape: ['round', 'fuzzy'],
      texture: ['fuzzy', 'velvety', 'soft'],
      patterns: ['fuzzy-skin', 'round', 'cleft'],
      structure: ['round', 'cleft', 'fuzzy'],
      size: 'medium'
    }
  },
  {
    name: 'Rubus idaeus',
    commonNames: ['Raspberry', 'Red Raspberry'],
    scientificName: 'Rubus idaeus',
    type: 'fruit' as const,
    searchTerm: 'Raspberry',
    family: 'Rosaceae',
    visualFeatures: {
      colors: ['red', 'pink', 'black', 'golden'],
      leafShape: ['round', 'clustered'],
      texture: ['bumpy', 'drupelets', 'soft'],
      patterns: ['clustered-drupelets', 'hollow'],
      structure: ['clustered', 'hollow-center', 'aggregate'],
      size: 'small'
    }
  },
  {
    name: 'Vaccinium corymbosum',
    commonNames: ['Blueberry', 'Highbush Blueberry'],
    scientificName: 'Vaccinium corymbosum',
    type: 'fruit' as const,
    searchTerm: 'Blueberry',
    family: 'Ericaceae',
    visualFeatures: {
      colors: ['blue', 'purple', 'dark-blue'],
      leafShape: ['round', 'small'],
      texture: ['smooth', 'waxy', 'bloom'],
      patterns: ['round', 'star-bottom', 'smooth'],
      structure: ['round', 'small', 'clustered'],
      size: 'small'
    }
  },
  {
    name: 'Citrullus lanatus',
    commonNames: ['Watermelon'],
    scientificName: 'Citrullus lanatus',
    type: 'fruit' as const,
    searchTerm: 'Watermelon',
    family: 'Cucurbitaceae',
    visualFeatures: {
      colors: ['green', 'dark-green', 'striped', 'red-inside'],
      leafShape: ['oval', 'large', 'round'],
      texture: ['smooth', 'hard-rind', 'striped'],
      patterns: ['striped', 'mottled', 'oval'],
      structure: ['large', 'oval', 'striped'],
      size: 'large'
    }
  },
  {
    name: 'Cucumis melo',
    commonNames: ['Cantaloupe', 'Muskmelon'],
    scientificName: 'Cucumis melo',
    type: 'fruit' as const,
    searchTerm: 'Cantaloupe',
    family: 'Cucurbitaceae',
    visualFeatures: {
      colors: ['orange', 'tan', 'beige', 'netted'],
      leafShape: ['round', 'netted'],
      texture: ['netted', 'rough', 'ribbed'],
      patterns: ['netted', 'webbed', 'round'],
      structure: ['round', 'netted-rind', 'ribbed'],
      size: 'large'
    }
  },
  {
    name: 'Mangifera indica',
    commonNames: ['Mango'],
    scientificName: 'Mangifera indica',
    type: 'fruit' as const,
    searchTerm: 'Mango',
    family: 'Anacardiaceae',
    visualFeatures: {
      colors: ['yellow', 'red', 'green', 'orange'],
      leafShape: ['oval', 'elongated'],
      texture: ['smooth', 'waxy', 'firm'],
      patterns: ['smooth', 'oval', 'single-seed'],
      structure: ['oval', 'flat-seed', 'smooth'],
      size: 'medium'
    }
  },

  // VEGETABLES - Comprehensive Database
  {
    name: 'Daucus carota',
    commonNames: ['Carrot', 'Garden Carrot'],
    scientificName: 'Daucus carota',
    type: 'vegetable' as const,
    searchTerm: 'Carrot',
    family: 'Apiaceae',
    visualFeatures: {
      colors: ['orange', 'purple', 'yellow', 'white'],
      leafShape: ['tapered', 'elongated', 'feathery-top'],
      texture: ['smooth', 'firm', 'crunchy'],
      patterns: ['tapered', 'root', 'elongated'],
      structure: ['tapered-root', 'green-top', 'elongated'],
      size: 'medium'
    }
  },
  {
    name: 'Brassica oleracea',
    commonNames: ['Broccoli', 'Calabrese'],
    scientificName: 'Brassica oleracea var. italica',
    type: 'vegetable' as const,
    searchTerm: 'Broccoli',
    family: 'Brassicaceae',
    visualFeatures: {
      colors: ['green', 'dark-green', 'blue-green'],
      leafShape: ['tree-like', 'clustered', 'florets'],
      texture: ['bumpy', 'textured', 'clustered'],
      patterns: ['clustered-florets', 'tree-like'],
      structure: ['tree-like', 'thick-stem', 'florets'],
      size: 'medium'
    }
  },
  {
    name: 'Lactuca sativa',
    commonNames: ['Lettuce', 'Garden Lettuce'],
    scientificName: 'Lactuca sativa',
    type: 'vegetable' as const,
    searchTerm: 'Lettuce',
    family: 'Asteraceae',
    visualFeatures: {
      colors: ['green', 'red', 'light-green'],
      leafShape: ['ruffled', 'round', 'loose'],
      texture: ['soft', 'crisp', 'thin'],
      patterns: ['ruffled', 'layered', 'rosette'],
      structure: ['rosette', 'layered', 'leafy'],
      size: 'medium'
    }
  },
  {
    name: 'Capsicum annuum',
    commonNames: ['Bell Pepper', 'Sweet Pepper'],
    scientificName: 'Capsicum annuum',
    type: 'vegetable' as const,
    searchTerm: 'Bell pepper',
    family: 'Solanaceae',
    visualFeatures: {
      colors: ['green', 'red', 'yellow', 'orange'],
      leafShape: ['blocky', 'bell-shaped', 'lobed'],
      texture: ['smooth', 'glossy', 'waxy'],
      patterns: ['bell-shaped', 'lobed', 'hollow'],
      structure: ['bell-shaped', 'hollow', 'thick-walls'],
      size: 'medium'
    }
  },
  {
    name: 'Cucumis sativus',
    commonNames: ['Cucumber'],
    scientificName: 'Cucumis sativus',
    type: 'vegetable' as const,
    searchTerm: 'Cucumber',
    family: 'Cucurbitaceae',
    visualFeatures: {
      colors: ['green', 'dark-green'],
      leafShape: ['elongated', 'cylindrical'],
      texture: ['bumpy', 'waxy', 'smooth'],
      patterns: ['elongated', 'cylindrical', 'seeds'],
      structure: ['elongated', 'cylindrical', 'vine'],
      size: 'medium'
    }
  },
  {
    name: 'Allium cepa',
    commonNames: ['Onion', 'Bulb Onion'],
    scientificName: 'Allium cepa',
    type: 'vegetable' as const,
    searchTerm: 'Onion',
    family: 'Amaryllidaceae',
    visualFeatures: {
      colors: ['yellow', 'white', 'red', 'purple'],
      leafShape: ['round', 'bulbous', 'layered'],
      texture: ['papery', 'layered', 'smooth'],
      patterns: ['layered', 'round', 'papery-skin'],
      structure: ['bulbous', 'layered', 'round'],
      size: 'medium'
    }
  },
  {
    name: 'Solanum tuberosum',
    commonNames: ['Potato'],
    scientificName: 'Solanum tuberosum',
    type: 'vegetable' as const,
    searchTerm: 'Potato',
    family: 'Solanaceae',
    visualFeatures: {
      colors: ['brown', 'yellow', 'red', 'white'],
      leafShape: ['oval', 'round', 'irregular'],
      texture: ['rough', 'bumpy', 'firm'],
      patterns: ['eyes', 'bumpy', 'oval'],
      structure: ['oval', 'eyes', 'tuber'],
      size: 'medium'
    }
  },
  {
    name: 'Spinacia oleracea',
    commonNames: ['Spinach'],
    scientificName: 'Spinacia oleracea',
    type: 'vegetable' as const,
    searchTerm: 'Spinach',
    family: 'Amaranthaceae',
    visualFeatures: {
      colors: ['dark-green', 'green'],
      leafShape: ['oval', 'pointed', 'smooth'],
      texture: ['smooth', 'soft', 'thin'],
      patterns: ['veined', 'smooth', 'oval'],
      structure: ['rosette', 'leafy', 'clustered'],
      size: 'small'
    }
  },
  {
    name: 'Brassica oleracea capitata',
    commonNames: ['Cabbage', 'Head Cabbage'],
    scientificName: 'Brassica oleracea var. capitata',
    type: 'vegetable' as const,
    searchTerm: 'Cabbage',
    family: 'Brassicaceae',
    visualFeatures: {
      colors: ['green', 'purple', 'red', 'white'],
      leafShape: ['round', 'layered', 'compact'],
      texture: ['smooth', 'waxy', 'firm'],
      patterns: ['layered', 'round', 'veined'],
      structure: ['round', 'dense', 'layered'],
      size: 'large'
    }
  },
  {
    name: 'Cucurbita pepo',
    commonNames: ['Zucchini', 'Courgette'],
    scientificName: 'Cucurbita pepo',
    type: 'vegetable' as const,
    searchTerm: 'Zucchini',
    family: 'Cucurbitaceae',
    visualFeatures: {
      colors: ['green', 'yellow', 'dark-green'],
      leafShape: ['elongated', 'cylindrical'],
      texture: ['smooth', 'firm', 'glossy'],
      patterns: ['elongated', 'cylindrical', 'striped'],
      structure: ['elongated', 'cylindrical', 'squash'],
      size: 'medium'
    }
  },
  {
    name: 'Phaseolus vulgaris',
    commonNames: ['Green Bean', 'String Bean', 'Snap Bean'],
    scientificName: 'Phaseolus vulgaris',
    type: 'vegetable' as const,
    searchTerm: 'Green bean',
    family: 'Fabaceae',
    visualFeatures: {
      colors: ['green', 'yellow', 'purple'],
      leafShape: ['elongated', 'pod', 'narrow'],
      texture: ['smooth', 'crisp', 'firm'],
      patterns: ['elongated', 'pod', 'beans-inside'],
      structure: ['pod', 'elongated', 'vine'],
      size: 'small'
    }
  },
  {
    name: 'Pisum sativum',
    commonNames: ['Pea', 'Garden Pea'],
    scientificName: 'Pisum sativum',
    type: 'vegetable' as const,
    searchTerm: 'Pea',
    family: 'Fabaceae',
    visualFeatures: {
      colors: ['green', 'light-green'],
      leafShape: ['pod', 'round-peas'],
      texture: ['smooth', 'waxy', 'firm'],
      patterns: ['pod', 'round-seeds', 'vine'],
      structure: ['pod', 'round-peas', 'vine'],
      size: 'small'
    }
  },
  {
    name: 'Brassica oleracea botrytis',
    commonNames: ['Cauliflower'],
    scientificName: 'Brassica oleracea var. botrytis',
    type: 'vegetable' as const,
    searchTerm: 'Cauliflower',
    family: 'Brassicaceae',
    visualFeatures: {
      colors: ['white', 'cream', 'purple', 'green'],
      leafShape: ['round', 'clustered', 'compact'],
      texture: ['bumpy', 'compact', 'firm'],
      patterns: ['clustered-florets', 'compact'],
      structure: ['round', 'compact', 'florets'],
      size: 'large'
    }
  },
  {
    name: 'Beta vulgaris',
    commonNames: ['Beetroot', 'Beet', 'Garden Beet'],
    scientificName: 'Beta vulgaris',
    type: 'vegetable' as const,
    searchTerm: 'Beetroot',
    family: 'Amaranthaceae',
    visualFeatures: {
      colors: ['red', 'purple', 'dark-red', 'golden'],
      leafShape: ['round', 'bulbous', 'root'],
      texture: ['smooth', 'firm', 'waxy'],
      patterns: ['round', 'root', 'tap-root'],
      structure: ['round', 'tap-root', 'green-top'],
      size: 'medium'
    }
  },
  {
    name: 'Raphanus sativus',
    commonNames: ['Radish', 'Garden Radish'],
    scientificName: 'Raphanus sativus',
    type: 'vegetable' as const,
    searchTerm: 'Radish',
    family: 'Brassicaceae',
    visualFeatures: {
      colors: ['red', 'pink', 'white', 'purple'],
      leafShape: ['round', 'oval', 'small'],
      texture: ['smooth', 'crisp', 'firm'],
      patterns: ['round', 'root', 'white-tip'],
      structure: ['round', 'tap-root', 'green-top'],
      size: 'small'
    }
  },

  // FLOWERS - Comprehensive Database
  {
    name: 'Rosa',
    commonNames: ['Rose'],
    scientificName: 'Rosa',
    type: 'flower' as const,
    searchTerm: 'Rose',
    family: 'Rosaceae',
    visualFeatures: {
      colors: ['red', 'pink', 'white', 'yellow', 'orange'],
      leafShape: ['layered-petals', 'compound-leaves'],
      texture: ['velvety', 'soft', 'delicate'],
      patterns: ['layered-petals', 'spiral', 'thorny-stem'],
      structure: ['layered', 'thorny-stem', 'single-flower'],
      size: 'medium'
    }
  },
  {
    name: 'Tulipa',
    commonNames: ['Tulip'],
    scientificName: 'Tulipa',
    type: 'flower' as const,
    searchTerm: 'Tulip',
    family: 'Liliaceae',
    visualFeatures: {
      colors: ['red', 'yellow', 'pink', 'white', 'purple'],
      leafShape: ['cup-shaped', 'long-leaves'],
      texture: ['smooth', 'waxy', 'delicate'],
      patterns: ['cup-shaped', 'six-petals', 'single-flower'],
      structure: ['cup-shaped', 'single-stem', 'six-petals'],
      size: 'medium'
    }
  },
  {
    name: 'Helianthus annuus',
    commonNames: ['Sunflower', 'Common Sunflower'],
    scientificName: 'Helianthus annuus',
    type: 'flower' as const,
    searchTerm: 'Sunflower',
    family: 'Asteraceae',
    visualFeatures: {
      colors: ['yellow', 'golden', 'brown-center'],
      leafShape: ['large-petals', 'disk-center'],
      texture: ['rough', 'textured', 'coarse'],
      patterns: ['ray-petals', 'disk-center', 'large'],
      structure: ['large-disk', 'ray-petals', 'tall-stem'],
      size: 'large'
    }
  },
  {
    name: 'Narcissus',
    commonNames: ['Daffodil', 'Narcissus'],
    scientificName: 'Narcissus',
    type: 'flower' as const,
    searchTerm: 'Daffodil',
    family: 'Amaryllidaceae',
    visualFeatures: {
      colors: ['yellow', 'white', 'orange-center'],
      leafShape: ['trumpet', 'six-petals'],
      texture: ['smooth', 'delicate', 'papery'],
      patterns: ['trumpet-center', 'six-petals', 'single'],
      structure: ['trumpet', 'six-petals', 'single-stem'],
      size: 'medium'
    }
  },
  {
    name: 'Lilium',
    commonNames: ['Lily'],
    scientificName: 'Lilium',
    type: 'flower' as const,
    searchTerm: 'Lily',
    family: 'Liliaceae',
    visualFeatures: {
      colors: ['white', 'orange', 'pink', 'yellow', 'red'],
      leafShape: ['trumpet-shaped', 'six-petals'],
      texture: ['smooth', 'waxy', 'delicate'],
      patterns: ['trumpet-shaped', 'six-petals', 'spotted'],
      structure: ['trumpet', 'six-petals', 'prominent-stamens'],
      size: 'large'
    }
  },
  {
    name: 'Chrysanthemum',
    commonNames: ['Chrysanthemum', 'Mum'],
    scientificName: 'Chrysanthemum',
    type: 'flower' as const,
    searchTerm: 'Chrysanthemum',
    family: 'Asteraceae',
    visualFeatures: {
      colors: ['yellow', 'white', 'red', 'purple', 'pink'],
      leafShape: ['layered-petals', 'dense'],
      texture: ['soft', 'layered', 'delicate'],
      patterns: ['layered-petals', 'dense', 'pompom'],
      structure: ['dense', 'layered', 'pompom-shaped'],
      size: 'medium'
    }
  },
  {
    name: 'Orchidaceae',
    commonNames: ['Orchid'],
    scientificName: 'Orchidaceae',
    type: 'flower' as const,
    searchTerm: 'Orchid',
    family: 'Orchidaceae',
    visualFeatures: {
      colors: ['purple', 'white', 'pink', 'yellow'],
      leafShape: ['irregular', 'three-petals', 'unique'],
      texture: ['waxy', 'smooth', 'delicate'],
      patterns: ['three-petals', 'lip-petal', 'spotted'],
      structure: ['three-petals', 'lip-petal', 'stem'],
      size: 'medium'
    }
  },
  {
    name: 'Gerbera jamesonii',
    commonNames: ['Gerbera Daisy', 'Transvaal Daisy'],
    scientificName: 'Gerbera jamesonii',
    type: 'flower' as const,
    searchTerm: 'Gerbera',
    family: 'Asteraceae',
    visualFeatures: {
      colors: ['red', 'pink', 'orange', 'yellow', 'white'],
      leafShape: ['ray-petals', 'disk-center'],
      texture: ['smooth', 'delicate', 'soft'],
      patterns: ['ray-petals', 'disk-center', 'daisy-like'],
      structure: ['disk-center', 'ray-petals', 'single-stem'],
      size: 'medium'
    }
  },
  {
    name: 'Hydrangea',
    commonNames: ['Hydrangea', 'Hortensia'],
    scientificName: 'Hydrangea macrophylla',
    type: 'flower' as const,
    searchTerm: 'Hydrangea',
    family: 'Hydrangeaceae',
    visualFeatures: {
      colors: ['blue', 'pink', 'white', 'purple'],
      leafShape: ['clustered', 'round-cluster'],
      texture: ['soft', 'delicate', 'papery'],
      patterns: ['clustered', 'round-cluster', 'mophead'],
      structure: ['clustered', 'mophead', 'shrub'],
      size: 'large'
    }
  },
  {
    name: 'Lavandula',
    commonNames: ['Lavender'],
    scientificName: 'Lavandula',
    type: 'flower' as const,
    searchTerm: 'Lavender',
    family: 'Lamiaceae',
    visualFeatures: {
      colors: ['purple', 'lavender', 'blue-purple'],
      leafShape: ['spike', 'small-flowers'],
      texture: ['soft', 'fuzzy', 'aromatic'],
      patterns: ['spike', 'clustered', 'small-flowers'],
      structure: ['spike', 'clustered', 'aromatic'],
      size: 'small'
    }
  },
  {
    name: 'Viola tricolor',
    commonNames: ['Pansy'],
    scientificName: 'Viola tricolor',
    type: 'flower' as const,
    searchTerm: 'Pansy',
    family: 'Violaceae',
    visualFeatures: {
      colors: ['purple', 'yellow', 'white', 'mixed'],
      leafShape: ['five-petals', 'face-like'],
      texture: ['velvety', 'soft', 'delicate'],
      patterns: ['five-petals', 'face-pattern', 'bicolor'],
      structure: ['five-petals', 'face-like', 'low'],
      size: 'small'
    }
  },
  {
    name: 'Petunia',
    commonNames: ['Petunia'],
    scientificName: 'Petunia × atkinsiana',
    type: 'flower' as const,
    searchTerm: 'Petunia',
    family: 'Solanaceae',
    visualFeatures: {
      colors: ['purple', 'pink', 'white', 'red'],
      leafShape: ['trumpet-shaped', 'five-lobed'],
      texture: ['velvety', 'soft', 'sticky'],
      patterns: ['trumpet-shaped', 'five-lobed', 'veined'],
      structure: ['trumpet', 'five-lobed', 'spreading'],
      size: 'small'
    }
  },
  {
    name: 'Tagetes',
    commonNames: ['Marigold'],
    scientificName: 'Tagetes',
    type: 'flower' as const,
    searchTerm: 'Marigold',
    family: 'Asteraceae',
    visualFeatures: {
      colors: ['orange', 'yellow', 'red-orange'],
      leafShape: ['layered-petals', 'round'],
      texture: ['soft', 'ruffled', 'aromatic'],
      patterns: ['layered-petals', 'pompom', 'dense'],
      structure: ['pompom', 'layered', 'compact'],
      size: 'small'
    }
  },
  {
    name: 'Hibiscus',
    commonNames: ['Hibiscus', 'Rose Mallow'],
    scientificName: 'Hibiscus rosa-sinensis',
    type: 'flower' as const,
    searchTerm: 'Hibiscus',
    family: 'Malvaceae',
    visualFeatures: {
      colors: ['red', 'pink', 'yellow', 'white', 'orange'],
      leafShape: ['five-petals', 'large'],
      texture: ['delicate', 'thin', 'papery'],
      patterns: ['five-petals', 'prominent-stamen', 'large'],
      structure: ['five-petals', 'prominent-stamen', 'trumpet'],
      size: 'large'
    }
  },
  {
    name: 'Dianthus',
    commonNames: ['Carnation', 'Pink'],
    scientificName: 'Dianthus caryophyllus',
    type: 'flower' as const,
    searchTerm: 'Carnation',
    family: 'Caryophyllaceae',
    visualFeatures: {
      colors: ['pink', 'red', 'white', 'yellow'],
      leafShape: ['ruffled-petals', 'layered'],
      texture: ['ruffled', 'delicate', 'soft'],
      patterns: ['ruffled-petals', 'layered', 'fringed'],
      structure: ['ruffled', 'layered', 'clove-scented'],
      size: 'medium'
    }
  }
];

// Simulate advanced image analysis using canvas and image processing
export function analyzeImageFeatures(imageFile: File): Promise<ImageFeatures> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const features = extractVisualFeatures(imageData, imageFile.name);
      resolve(features);
    };
    
    img.onerror = () => {
      // Fallback to simulation if image loading fails
      resolve(simulateImageAnalysis(imageFile.name));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
}

// Extract visual features from image data
function extractVisualFeatures(imageData: ImageData | undefined, fileName: string): ImageFeatures {
  if (!imageData) {
    return simulateImageAnalysis(fileName);
  }
  
  const pixels = imageData.data;
  const colorAnalysis = analyzeColors(pixels);
  const shapeAnalysis = analyzeShapes(pixels, imageData.width, imageData.height);
  const textureAnalysis = analyzeTexture(pixels);
  
  return {
    colors: colorAnalysis,
    shapes: shapeAnalysis,
    textures: textureAnalysis,
    size: estimateSize(imageData.width, imageData.height),
    patterns: analyzePatterns(pixels),
    structure: analyzeStructure(pixels, imageData.width, imageData.height)
  };
}

// Analyze color distribution in the image
function analyzeColors(pixels: Uint8ClampedArray): ImageFeatures['colors'] {
  const colorCounts: { [key: string]: number } = {};
  const totalPixels = pixels.length / 4;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Categorize colors
    const colorCategory = categorizeColor(r, g, b);
    colorCounts[colorCategory] = (colorCounts[colorCategory] || 0) + 1;
  }
  
  // Sort colors by frequency
  const sortedColors = Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([color]) => color);
  
  const dominant = sortedColors.slice(0, 3);
  const secondary = sortedColors.slice(3, 6);
  
  return {
    dominant,
    secondary,
    hasVariegation: checkVariegation(sortedColors),
    colorIntensity: determineColorIntensity(dominant)
  };
}

// Enhanced categorizeColor with better precision for fruits/vegetables/flowers
function categorizeColor(r: number, g: number, b: number): string {
  const hsl = rgbToHsl(r, g, b);
  const [h, s, l] = hsl;
  
  // Very dark or very light detection
  if (l < 0.15) return 'black';
  if (l < 0.25 && s < 0.2) return 'dark-brown';
  if (l > 0.85) return 'white';
  if (l > 0.75 && s < 0.15) return 'very-light';
  
  // Gray detection
  if (s < 0.1) return l > 0.5 ? 'light-gray' : 'dark-gray';
  if (s < 0.2) return l > 0.5 ? 'beige' : 'tan';
  
  // Enhanced color categorization for better fruit/veg/flower detection
  // Red range (0-30 degrees)
  if (h >= 0 && h < 15) {
    if (s > 0.6 && l > 0.4 && l < 0.65) return 'bright-red';
    if (s > 0.4) return 'red';
    return 'pink';
  }
  
  // Orange-red range (15-30 degrees)
  if (h >= 15 && h < 30) {
    if (l < 0.4) return 'red-brown';
    if (s > 0.6) return 'red-orange';
    return 'red';
  }
  
  // Orange range (30-50 degrees)
  if (h >= 30 && h < 50) {
    if (l > 0.6 && s > 0.7) return 'bright-orange';
    if (l > 0.5) return 'orange';
    return 'dark-orange';
  }
  
  // Yellow-orange range (50-65 degrees)
  if (h >= 50 && h < 65) {
    if (l > 0.6) return 'yellow-orange';
    if (l > 0.4) return 'golden';
    return 'brown';
  }
  
  // Yellow range (65-85 degrees)
  if (h >= 65 && h < 85) {
    if (s > 0.6 && l > 0.5) return 'bright-yellow';
    if (s > 0.4) return 'yellow';
    if (l < 0.4) return 'olive';
    return 'yellow-green';
  }
  
  // Yellow-green range (85-100 degrees)
  if (h >= 85 && h < 100) {
    if (l > 0.5) return 'lime-green';
    return 'yellow-green';
  }
  
  // Green range (100-140 degrees)
  if (h >= 100 && h < 140) {
    if (l > 0.6) return 'light-green';
    if (l > 0.35 && l < 0.6) return 'green';
    if (l <= 0.35) return 'dark-green';
    return 'medium-green';
  }
  
  // Blue-green/Teal range (140-180 degrees)
  if (h >= 140 && h < 180) {
    if (s > 0.4) return 'blue-green';
    return 'teal';
  }
  
  // Cyan range (180-200 degrees)
  if (h >= 180 && h < 200) return 'cyan';
  
  // Blue range (200-250 degrees)
  if (h >= 200 && h < 250) {
    if (l > 0.5 && s < 0.5) return 'light-blue';
    if (s > 0.5) return 'blue';
    return 'dark-blue';
  }
  
  // Purple range (250-280 degrees)
  if (h >= 250 && h < 280) {
    if (l > 0.5) return 'lavender';
    return 'purple';
  }
  
  // Magenta/Pink range (280-330 degrees)
  if (h >= 280 && h < 330) {
    if (l > 0.6) return 'pink';
    if (s > 0.5) return 'magenta';
    return 'purple';
  }
  
  // Red-pink range (330-360 degrees)
  if (l > 0.6) return 'pink';
  if (s > 0.5) return 'red';
  return 'pink';
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s, l];
}

// Analyze shape characteristics
function analyzeShapes(pixels: Uint8ClampedArray, width: number, height: number): ImageFeatures['shapes'] {
  // Simplified shape analysis based on edge detection and contours
  const aspectRatio = width / height;
  const edgeComplexity = calculateEdgeComplexity(pixels, width, height);
  
  return {
    leafShape: determineLeafShape(aspectRatio, edgeComplexity),
    plantStructure: determinePlantStructure(aspectRatio, edgeComplexity),
    symmetry: determineSymmetry(pixels, width, height),
    edgeType: determineEdgeType(edgeComplexity)
  };
}

// Determine leaf shape based on analysis
function determineLeafShape(aspectRatio: number, edgeComplexity: number): string[] {
  const shapes = [];
  
  if (aspectRatio > 2) shapes.push('elongated', 'narrow');
  else if (aspectRatio < 0.8) shapes.push('round', 'broad');
  else shapes.push('oval', 'medium');
  
  if (edgeComplexity > 0.7) shapes.push('serrated', 'complex');
  else if (edgeComplexity > 0.3) shapes.push('lobed', 'moderate');
  else shapes.push('smooth', 'simple');
  
  return shapes;
}

// Calculate edge complexity for shape analysis
function calculateEdgeComplexity(pixels: Uint8ClampedArray, width: number, height: number): number {
  // Simplified edge detection
  let edgePixels = 0;
  const totalPixels = (width * height);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const current = (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;
      
      const neighbors = [
        (pixels[((y-1) * width + x) * 4] + pixels[((y-1) * width + x) * 4 + 1] + pixels[((y-1) * width + x) * 4 + 2]) / 3,
        (pixels[(y * width + (x+1)) * 4] + pixels[(y * width + (x+1)) * 4 + 1] + pixels[(y * width + (x+1)) * 4 + 2]) / 3,
        (pixels[((y+1) * width + x) * 4] + pixels[((y+1) * width + x) * 4 + 1] + pixels[((y+1) * width + x) * 4 + 2]) / 3,
        (pixels[(y * width + (x-1)) * 4] + pixels[(y * width + (x-1)) * 4 + 1] + pixels[(y * width + (x-1)) * 4 + 2]) / 3
      ];
      
      const maxDiff = Math.max(...neighbors.map(n => Math.abs(current - n)));
      if (maxDiff > 30) edgePixels++;
    }
  }
  
  return edgePixels / totalPixels;
}

// Simulate image analysis when real analysis isn't possible
function simulateImageAnalysis(fileName: string): ImageFeatures {
  // Use filename and random factors to simulate consistent analysis
  const seed = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => min + (seed % (max - min));
  
  const greenVariants = ['light-green', 'medium-green', 'dark-green', 'blue-green'];
  const leafShapes = ['oval', 'heart-shaped', 'elongated', 'round', 'pointed'];
  const textures = ['glossy', 'matte', 'waxy', 'smooth', 'rough'];
  
  return {
    colors: {
      dominant: [
        greenVariants[random(0, greenVariants.length)],
        random(0, 10) > 7 ? 'variegated' : greenVariants[random(0, greenVariants.length)]
      ],
      secondary: ['brown', 'yellow'],
      hasVariegation: random(0, 10) > 6,
      colorIntensity: ['light', 'medium', 'dark'][random(0, 3)] as 'light' | 'medium' | 'dark'
    },
    shapes: {
      leafShape: [leafShapes[random(0, leafShapes.length)]],
      plantStructure: ['upright', 'spreading', 'climbing'][random(0, 3)],
      symmetry: random(0, 10) > 3 ? 'symmetric' : 'asymmetric',
      edgeType: ['smooth', 'serrated', 'lobed'][random(0, 3)] === 'smooth' ? ['smooth'] : ['serrated']
    },
    textures: {
      surface: [textures[random(0, textures.length)]],
      patterns: random(0, 10) > 6 ? ['striped'] : ['solid'],
      glossiness: ['matte', 'semi-gloss', 'glossy'][random(0, 3)] as 'matte' | 'semi-gloss' | 'glossy'
    },
    size: {
      leafSize: ['small', 'medium', 'large'][random(0, 3)] as 'small' | 'medium' | 'large',
      plantSize: ['compact', 'medium', 'large'][random(0, 3)] as 'compact' | 'medium' | 'large'
    },
    patterns: {
      veining: ['prominent', 'subtle', 'parallel'][random(0, 3)] === 'prominent' ? ['prominent'] : ['subtle'],
      markings: random(0, 10) > 8 ? ['spots'] : [],
      growth: ['dense', 'sparse'][random(0, 2)] === 'dense' ? ['dense'] : ['sparse']
    },
    structure: {
      arrangement: ['alternate', 'opposite', 'whorled'][random(0, 3)] === 'alternate' ? ['alternate'] : ['opposite'],
      stem: ['thick', 'thin', 'woody'][random(0, 3)] === 'thick' ? ['thick'] : ['thin'],
      flowers: random(0, 10) > 8 ? ['present'] : [],
      fruits: random(0, 10) > 9 ? ['present'] : []
    }
  };
}

// Additional helper functions
function checkVariegation(colors: string[]): boolean {
  return colors.some(color => color.includes('variegated') || color.includes('stripe'));
}

function determineColorIntensity(dominantColors: string[]): 'light' | 'medium' | 'dark' {
  const darkColors = dominantColors.filter(color => color.includes('dark'));
  const lightColors = dominantColors.filter(color => color.includes('light'));
  
  if (darkColors.length > lightColors.length) return 'dark';
  if (lightColors.length > 0) return 'light';
  return 'medium';
}

function determinePlantStructure(aspectRatio: number, edgeComplexity: number): string {
  if (aspectRatio > 1.5) return 'upright';
  if (edgeComplexity > 0.5) return 'bushy';
  return 'compact';
}

function determineSymmetry(pixels: Uint8ClampedArray, width: number, height: number): 'symmetric' | 'asymmetric' {
  // Simplified symmetry check
  return Math.random() > 0.3 ? 'symmetric' : 'asymmetric';
}

function determineEdgeType(edgeComplexity: number): string[] {
  if (edgeComplexity > 0.6) return ['serrated', 'complex'];
  if (edgeComplexity > 0.3) return ['lobed'];
  return ['smooth'];
}

function estimateSize(width: number, height: number): ImageFeatures['size'] {
  const totalPixels = width * height;
  
  return {
    leafSize: totalPixels > 500000 ? 'large' : totalPixels > 200000 ? 'medium' : 'small',
    plantSize: totalPixels > 600000 ? 'large' : totalPixels > 250000 ? 'medium' : 'compact'
  };
}

function analyzeTexture(pixels: Uint8ClampedArray): ImageFeatures['textures'] {
  // Simplified texture analysis
  return {
    surface: ['smooth'],
    patterns: ['solid'],
    glossiness: 'semi-gloss'
  };
}

function analyzePatterns(pixels: Uint8ClampedArray): ImageFeatures['patterns'] {
  return {
    veining: ['subtle'],
    markings: [],
    growth: ['dense']
  };
}

function analyzeStructure(pixels: Uint8ClampedArray, width: number, height: number): ImageFeatures['structure'] {
  return {
    arrangement: ['alternate'],
    stem: ['medium'],
    flowers: [],
    fruits: []
  };
}

// Advanced plant matching with improved algorithms for fruits/vegetables/flowers
export function matchPlantByFeatures(features: ImageFeatures): typeof plantDatabase[0] | null {
  const matches = plantDatabase.map(plant => {
    const score = calculateEnhancedPlantMatchScore(features, plant);
    return {
      plant,
      score: score.totalScore,
      breakdown: score.breakdown,
      confidence: 0
    };
  });
  
  // Sort by score
  matches.sort((a, b) => b.score - a.score);
  
  // Enhanced confidence calculation
  const bestMatch = matches[0];
  const secondBest = matches[1];
  const thirdBest = matches[2];
  
  if (!bestMatch || bestMatch.score < 0.25) {
    return null; // No good match found
  }
  
  // Calculate confidence based on multiple factors
  let confidence = bestMatch.score * 80; // Base confidence from score
  
  // Bonus for clear winner
  if (secondBest) {
    const scoreGap = bestMatch.score - secondBest.score;
    confidence += scoreGap * 25; // Up to 25% bonus for score gap
  }
  
  // Bonus for consistent top matches
  if (thirdBest) {
    const consistencyGap = secondBest ? secondBest.score - thirdBest.score : 0;
    if (consistencyGap > 0.1) {
      confidence += 5; // Small bonus for consistency
    }
  }
  
  // Cap confidence at 95%
  bestMatch.confidence = Math.min(95, Math.max(30, Math.round(confidence)));
  
  return bestMatch.plant;
}

// Enhanced matching score calculation with improved weighting
function calculateEnhancedPlantMatchScore(features: ImageFeatures, plant: typeof plantDatabase[0]): { 
  totalScore: number; 
  breakdown: { [key: string]: number } 
} {
  const breakdown: { [key: string]: number } = {};
  let totalScore = 0;
  let maxScore = 0;
  
  // Adjust weights based on plant type
  const isFlower = plant.type === 'flower';
  const isFruit = plant.type === 'fruit';
  const isVegetable = plant.type === 'vegetable';
  
  // Color matching - Critical for fruits/vegetables/flowers (40-50% weight)
  const colorWeight = (isFruit || isVegetable) ? 0.50 : isFlower ? 0.45 : 0.35;
  const colorScore = calculateAdvancedColorMatch(features.colors, plant.visualFeatures.colors);
  breakdown.color = colorScore;
  totalScore += colorScore * colorWeight;
  maxScore += colorWeight;
  
  // Shape matching - Important for all types (20-25% weight)
  const shapeWeight = isVegetable ? 0.25 : isFruit ? 0.20 : 0.20;
  const shapeScore = calculateAdvancedShapeMatch(features.shapes, plant.visualFeatures.leafShape);
  breakdown.shape = shapeScore;
  totalScore += shapeScore * shapeWeight;
  maxScore += shapeWeight;
  
  // Texture matching - Very important for fruits (20-25% weight)
  const textureWeight = isFruit ? 0.25 : isVegetable ? 0.15 : 0.20;
  const textureScore = calculateAdvancedTextureMatch(features.textures, plant.visualFeatures.texture);
  breakdown.texture = textureScore;
  totalScore += textureScore * textureWeight;
  maxScore += textureWeight;
  
  // Pattern matching - Important for flowers and some vegetables (10-15% weight)
  const patternWeight = isFlower ? 0.15 : 0.10;
  const patternScore = calculateAdvancedPatternMatch(features.patterns, plant.visualFeatures.patterns);
  breakdown.pattern = patternScore;
  totalScore += patternScore * patternWeight;
  maxScore += patternWeight;
  
  // Structure matching - Important for identifying plant form (10% weight)
  const structureWeight = 0.10;
  const structureScore = calculateStructureMatch(features.structure, plant.visualFeatures.structure);
  breakdown.structure = structureScore;
  totalScore += structureScore * structureWeight;
  maxScore += structureWeight;
  
  // Size matching - Less critical but helpful (5% weight)
  const sizeWeight = 0.05;
  const sizeScore = features.size.plantSize === plant.visualFeatures.size ? 1 : 0.5;
  breakdown.size = sizeScore;
  totalScore += sizeScore * sizeWeight;
  maxScore += sizeWeight;
  
  return {
    totalScore: maxScore > 0 ? totalScore / maxScore : 0,
    breakdown
  };
}

// Advanced color matching with semantic understanding for fruits/veggies/flowers
function calculateAdvancedColorMatch(features: ImageFeatures['colors'], plantColors: string[]): number {
  let matches = 0;
  let totalChecks = 0;
  const allFeatureColors = [...features.dominant, ...features.secondary];
  
  for (const plantColor of plantColors) {
    totalChecks++;
    let bestMatchScore = 0;
    
    for (const featureColor of allFeatureColors) {
      const matchScore = getAdvancedColorSimilarity(featureColor, plantColor);
      bestMatchScore = Math.max(bestMatchScore, matchScore);
    }
    
    matches += bestMatchScore;
  }
  
  // Bonus for color intensity match
  const intensityBonus = 0.1;
  
  // Bonus for variegation match
  let variegationBonus = 0;
  if (features.hasVariegation && plantColors.some(c => 
    c.includes('variegated') || c.includes('stripe') || c.includes('bicolor')
  )) {
    variegationBonus = 0.2;
  }
  
  const baseScore = totalChecks > 0 ? matches / totalChecks : 0;
  return Math.min(1.0, baseScore + intensityBonus + variegationBonus);
}

// Get advanced color similarity with fruit/vegetable/flower color families
function getAdvancedColorSimilarity(color1: string, color2: string): number {
  // Exact match
  if (color1 === color2) return 1.0;
  
  // Enhanced color families for fruits/vegetables/flowers
  const colorFamilies: { [key: string]: { [key: string]: number } } = {
    // Reds
    'red': { 'red': 1.0, 'bright-red': 0.95, 'dark-red': 0.85, 'red-orange': 0.7, 'pink': 0.65 },
    'bright-red': { 'bright-red': 1.0, 'red': 0.95, 'red-orange': 0.75 },
    'dark-red': { 'dark-red': 1.0, 'red': 0.85, 'purple': 0.6, 'brown': 0.5 },
    
    // Oranges
    'orange': { 'orange': 1.0, 'bright-orange': 0.95, 'yellow-orange': 0.85, 'red-orange': 0.85, 'golden': 0.7 },
    'bright-orange': { 'bright-orange': 1.0, 'orange': 0.95, 'yellow-orange': 0.8 },
    
    // Yellows
    'yellow': { 'yellow': 1.0, 'bright-yellow': 0.95, 'golden': 0.85, 'yellow-orange': 0.75, 'yellow-green': 0.65 },
    'bright-yellow': { 'bright-yellow': 1.0, 'yellow': 0.95, 'golden': 0.8 },
    'golden': { 'golden': 1.0, 'yellow': 0.85, 'orange': 0.7, 'tan': 0.6 },
    
    // Greens
    'green': { 'green': 1.0, 'medium-green': 0.95, 'dark-green': 0.85, 'light-green': 0.85, 'blue-green': 0.7 },
    'dark-green': { 'dark-green': 1.0, 'green': 0.85, 'blue-green': 0.75 },
    'light-green': { 'light-green': 1.0, 'green': 0.85, 'yellow-green': 0.75, 'lime-green': 0.9 },
    'lime-green': { 'lime-green': 1.0, 'light-green': 0.9, 'yellow-green': 0.85 },
    'blue-green': { 'blue-green': 1.0, 'green': 0.7, 'dark-green': 0.75, 'teal': 0.8 },
    
    // Blues/Purples
    'blue': { 'blue': 1.0, 'dark-blue': 0.85, 'light-blue': 0.85, 'purple': 0.65 },
    'purple': { 'purple': 1.0, 'lavender': 0.85, 'magenta': 0.8, 'blue': 0.65, 'pink': 0.7 },
    'lavender': { 'lavender': 1.0, 'purple': 0.85, 'pink': 0.75 },
    
    // Pinks
    'pink': { 'pink': 1.0, 'red': 0.65, 'lavender': 0.75, 'magenta': 0.7 },
    
    // Browns/Tans
    'brown': { 'brown': 1.0, 'tan': 0.85, 'dark-brown': 0.9, 'golden': 0.6 },
    'tan': { 'tan': 1.0, 'brown': 0.85, 'beige': 0.9, 'golden': 0.7 },
    
    // Whites/Creams
    'white': { 'white': 1.0, 'cream': 0.9, 'beige': 0.75, 'very-light': 0.85 },
    'cream': { 'cream': 1.0, 'white': 0.9, 'beige': 0.85 }
  };
  
  // Check family matches
  if (colorFamilies[color1] && colorFamilies[color1][color2]) {
    return colorFamilies[color1][color2];
  }
  
  // Check reverse
  if (colorFamilies[color2] && colorFamilies[color2][color1]) {
    return colorFamilies[color2][color1];
  }
  
  // Partial string match
  if (color1.includes(color2) || color2.includes(color1)) {
    return 0.7;
  }
  
  // Check for common substrings
  const words1 = color1.split('-');
  const words2 = color2.split('-');
  const commonWords = words1.filter(w => words2.includes(w));
  if (commonWords.length > 0) {
    return 0.5;
  }
  
  return 0.0;
}

// Advanced shape matching for fruits/vegetables
function calculateAdvancedShapeMatch(features: ImageFeatures['shapes'], plantShapes: string[]): number {
  let matches = 0;
  let totalChecks = plantShapes.length;
  
  const allShapes = features.leafShape;
  
  for (const plantShape of plantShapes) {
    let bestMatch = 0;
    
    for (const featureShape of allShapes) {
      const similarity = getShapeSimilarity(featureShape, plantShape);
      bestMatch = Math.max(bestMatch, similarity);
    }
    
    matches += bestMatch;
  }
  
  return totalChecks > 0 ? matches / totalChecks : 0;
}

// Get shape similarity score
function getShapeSimilarity(shape1: string, shape2: string): number {
  if (shape1 === shape2) return 1.0;
  
  const shapeSynonyms: { [key: string]: { [key: string]: number } } = {
    'round': { 'round': 1.0, 'spherical': 0.95, 'circular': 0.95, 'oval': 0.75 },
    'oval': { 'oval': 1.0, 'round': 0.75, 'elongated': 0.7, 'elliptical': 0.95 },
    'elongated': { 'elongated': 1.0, 'long': 0.95, 'cylindrical': 0.85, 'oval': 0.7 },
    'cylindrical': { 'cylindrical': 1.0, 'elongated': 0.85, 'tube': 0.9 },
    'conical': { 'conical': 1.0, 'cone': 0.95, 'pointed': 0.7 },
    'heart-shaped': { 'heart-shaped': 1.0, 'cordate': 0.95 },
    'bell-shaped': { 'bell-shaped': 1.0, 'bell': 0.95, 'blocky': 0.8 }
  };
  
  if (shapeSynonyms[shape1] && shapeSynonyms[shape1][shape2]) {
    return shapeSynonyms[shape1][shape2];
  }
  
  if (shapeSynonyms[shape2] && shapeSynonyms[shape2][shape1]) {
    return shapeSynonyms[shape2][shape1];
  }
  
  if (shape1.includes(shape2) || shape2.includes(shape1)) return 0.7;
  
  return 0.0;
}

// Advanced texture matching
function calculateAdvancedTextureMatch(features: ImageFeatures['textures'], plantTextures: string[]): number {
  let matches = 0;
  let totalChecks = plantTextures.length;
  
  const allTextures = features.surface;
  
  for (const plantTexture of plantTextures) {
    let bestMatch = 0;
    
    for (const featureTexture of allTextures) {
      const similarity = getTextureSimilarity(featureTexture, plantTexture);
      bestMatch = Math.max(bestMatch, similarity);
    }
    
    matches += bestMatch;
  }
  
  return totalChecks > 0 ? matches / totalChecks : 0;
}

// Get texture similarity
function getTextureSimilarity(texture1: string, texture2: string): number {
  if (texture1 === texture2) return 1.0;
  
  const textureSynonyms: { [key: string]: { [key: string]: number } } = {
    'smooth': { 'smooth': 1.0, 'glossy': 0.8, 'waxy': 0.7, 'firm': 0.6 },
    'glossy': { 'glossy': 1.0, 'waxy': 0.85, 'smooth': 0.8, 'shiny': 0.95 },
    'waxy': { 'waxy': 1.0, 'glossy': 0.85, 'smooth': 0.7 },
    'bumpy': { 'bumpy': 1.0, 'rough': 0.85, 'textured': 0.9, 'pebbled': 0.85 },
    'rough': { 'rough': 1.0, 'bumpy': 0.85, 'coarse': 0.9, 'textured': 0.8 },
    'fuzzy': { 'fuzzy': 1.0, 'velvety': 0.85, 'soft': 0.75, 'hairy': 0.9 },
    'velvety': { 'velvety': 1.0, 'fuzzy': 0.85, 'soft': 0.8 },
    'soft': { 'soft': 1.0, 'delicate': 0.85, 'smooth': 0.6 }
  };
  
  if (textureSynonyms[texture1] && textureSynonyms[texture1][texture2]) {
    return textureSynonyms[texture1][texture2];
  }
  
  if (textureSynonyms[texture2] && textureSynonyms[texture2][texture1]) {
    return textureSynonyms[texture2][texture1];
  }
  
  if (texture1.includes(texture2) || texture2.includes(texture1)) return 0.7;
  
  return 0.0;
}

// Advanced pattern matching
function calculateAdvancedPatternMatch(features: ImageFeatures['patterns'], plantPatterns: string[]): number {
  let matches = 0;
  let totalChecks = plantPatterns.length;
  
  const allPatterns = [...features.veining, ...features.markings];
  
  for (const plantPattern of plantPatterns) {
    let bestMatch = 0;
    
    for (const featurePattern of allPatterns) {
      if (featurePattern === plantPattern) bestMatch = Math.max(bestMatch, 1.0);
      else if (featurePattern.includes(plantPattern) || plantPattern.includes(featurePattern)) {
        bestMatch = Math.max(bestMatch, 0.8);
      }
    }
    
    matches += bestMatch;
  }
  
  return totalChecks > 0 ? matches / totalChecks : 0.5;
}

// Structure matching
function calculateStructureMatch(features: ImageFeatures['structure'], plantStructure: string[]): number {
  let matches = 0;
  let totalChecks = plantStructure.length;
  
  const allStructure = [...features.arrangement, ...features.stem];
  
  for (const plantStruct of plantStructure) {
    for (const featureStruct of allStructure) {
      if (featureStruct === plantStruct) matches++;
      else if (featureStruct.includes(plantStruct) || plantStruct.includes(featureStruct)) {
        matches += 0.7;
      }
    }
  }
  
  return totalChecks > 0 ? Math.min(1.0, matches / totalChecks) : 0.5;
}

// Calculate detailed matching score for a plant
function calculatePlantMatchScore(features: ImageFeatures, plant: typeof plantDatabase[0]): number {
  let totalScore = 0;
  let maxScore = 0;
  
  // Color matching (35% weight) - Most important for plant identification
  const colorScore = calculateColorMatch(features.colors, plant.visualFeatures.colors);
  totalScore += colorScore * 0.35;
  maxScore += 0.35;
  
  // Shape matching (25% weight) - Critical for leaf identification
  const shapeScore = calculateShapeMatch(features.shapes, plant.visualFeatures.leafShape);
  totalScore += shapeScore * 0.25;
  maxScore += 0.25;
  
  // Texture matching (20% weight) - Important for surface characteristics
  const textureScore = calculateTextureMatch(features.textures, plant.visualFeatures.texture);
  totalScore += textureScore * 0.20;
  maxScore += 0.20;
  
  // Pattern matching (10% weight) - Helpful for distinctive markings
  const patternScore = calculatePatternMatch(features.patterns, plant.visualFeatures.patterns);
  totalScore += patternScore * 0.10;
  maxScore += 0.10;
  
  // Size matching (10% weight) - General size category
  const sizeScore = features.size.plantSize === plant.visualFeatures.size ? 1 : 0;
  totalScore += sizeScore * 0.10;
  maxScore += 0.10;
  
  return maxScore > 0 ? totalScore / maxScore : 0;
}

// Detailed color matching with semantic understanding
function calculateColorMatch(features: ImageFeatures['colors'], plantColors: string[]): number {
  let matches = 0;
  let total = features.dominant.length;
  
  for (const featureColor of features.dominant) {
    for (const plantColor of plantColors) {
      if (areColorsCompatible(featureColor, plantColor)) {
        matches += 1;
        break;
      }
    }
  }
  
  // Bonus for variegation match
  if (features.hasVariegation && plantColors.some(c => c.includes('variegated') || c.includes('stripe'))) {
    matches += 0.5;
  }
  
  return total > 0 ? matches / total : 0;
}

// Check if two colors are semantically compatible
function areColorsCompatible(color1: string, color2: string): boolean {
  const colorSynonyms: { [key: string]: string[] } = {
    'green': ['light-green', 'dark-green', 'medium-green', 'jade-green', 'blue-green', 'glossy-green'],
    'dark-green': ['dark-green', 'deep-green', 'forest-green'],
    'light-green': ['light-green', 'bright-green', 'lime-green'],
    'variegated': ['variegated', 'striped', 'white-stripe', 'yellow-variegation', 'green-white-stripes'],
    'yellow': ['yellow', 'golden', 'yellow-edge', 'yellow-margins']
  };
  
  // Direct match
  if (color1 === color2) return true;
  
  // Check synonyms
  for (const [base, synonyms] of Object.entries(colorSynonyms)) {
    if (synonyms.includes(color1) && synonyms.includes(color2)) {
      return true;
    }
  }
  
  // Partial match
  return color1.includes(color2) || color2.includes(color1);
}

// Enhanced shape matching
function calculateShapeMatch(features: ImageFeatures['shapes'], plantShapes: string[]): number {
  let matches = 0;
  let total = features.leafShape.length;
  
  for (const featureShape of features.leafShape) {
    for (const plantShape of plantShapes) {
      if (areShapesCompatible(featureShape, plantShape)) {
        matches += 1;
        break;
      }
    }
  }
  
  return total > 0 ? matches / total : 0;
}

// Check shape compatibility
function areShapesCompatible(shape1: string, shape2: string): boolean {
  const shapeSynonyms: { [key: string]: string[] } = {
    'heart-shaped': ['heart-shaped', 'cordate'],
    'oval': ['oval', 'elliptical', 'ovate'],
    'round': ['round', 'circular', 'orbicular'],
    'long': ['long', 'elongated', 'lanceolate'],
    'narrow': ['narrow', 'linear', 'sword-like'],
    'pointed': ['pointed', 'acute', 'acuminate']
  };
  
  if (shape1 === shape2) return true;
  
  for (const [base, synonyms] of Object.entries(shapeSynonyms)) {
    if (synonyms.includes(shape1) && synonyms.includes(shape2)) {
      return true;
    }
  }
  
  return shape1.includes(shape2) || shape2.includes(shape1);
}

// Texture matching
function calculateTextureMatch(features: ImageFeatures['textures'], plantTextures: string[]): number {
  let matches = 0;
  let total = features.surface.length;
  
  for (const featureTexture of features.surface) {
    for (const plantTexture of plantTextures) {
      if (areTexturesCompatible(featureTexture, plantTexture)) {
        matches += 1;
        break;
      }
    }
  }
  
  return total > 0 ? matches / total : 0;
}

// Check texture compatibility
function areTexturesCompatible(texture1: string, texture2: string): boolean {
  const textureSynonyms: { [key: string]: string[] } = {
    'glossy': ['glossy', 'shiny', 'very-glossy'],
    'smooth': ['smooth', 'even', 'flat'],
    'waxy': ['waxy', 'coated', 'lustrous'],
    'thick': ['thick', 'fleshy', 'succulent']
  };
  
  if (texture1 === texture2) return true;
  
  for (const [base, synonyms] of Object.entries(textureSynonyms)) {
    if (synonyms.includes(texture1) && synonyms.includes(texture2)) {
      return true;
    }
  }
  
  return texture1.includes(texture2) || texture2.includes(texture1);
}

// Pattern matching
function calculatePatternMatch(features: ImageFeatures['patterns'], plantPatterns: string[]): number {
  let matches = 0;
  let total = Math.max(features.veining.length + features.markings.length, 1);
  
  const allFeaturePatterns = [...features.veining, ...features.markings];
  
  for (const featurePattern of allFeaturePatterns) {
    for (const plantPattern of plantPatterns) {
      if (featurePattern === plantPattern || 
          featurePattern.includes(plantPattern) || 
          plantPattern.includes(featurePattern)) {
        matches += 1;
        break;
      }
    }
  }
  
  return matches / total;
}
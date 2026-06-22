import type { User } from '../App';

export interface CareLog {
  id?: string;
  action: 'watered' | 'fertilized' | 'pruned' | 'repotted' | 'sprayed' | 'photo_updated';
  note?: string;
  timestamp: string;
}

export interface PersonalizedPlant {
  id: string;
  userId: string;
  name: string;
  species: string;
  images: string[];
  onboardingAnswers: {
    location: string;
    sunlight: string;
    wateringFrequency: string;
    soilType: string;
    plantSize: string;
    currentHealth: string;
    symptoms: string;
  };
  aiCarePlan: {
    wateringInstructions: string;
    wateringIntervalDays: number;
    lightInstructions: string;
    soilAndFertilizer: string;
    fertilizingIntervalDays: number;
    healthDiagnostics: string;
    generalCareTips: string[];
    healthScore: number;
  };
  careLogs: CareLog[];
  nextWateringDate?: string;
  nextFertilizingDate?: string;
  createdAt: string;
}

const API_BASE_URL = '/api/garden';

// Helper to get local plants
function getLocalPlants(userId: string): PersonalizedPlant[] {
  try {
    const key = `pritamoria_garden_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return [];
  }
}

// Helper to save local plants
function saveLocalPlants(userId: string, plants: PersonalizedPlant[]) {
  try {
    const key = `pritamoria_garden_${userId}`;
    localStorage.setItem(key, JSON.stringify(plants));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export async function fetchUserGarden(userId: string): Promise<PersonalizedPlant[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Map database fields if needed (e.g. converting database _id to id)
        const mappedPlants = data.plants.map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        // Sync with local storage
        saveLocalPlants(userId, mappedPlants);
        return mappedPlants;
      }
    }
  } catch (error) {
    console.warn('Backend offline, falling back to local storage for garden fetch:', error);
  }
  return getLocalPlants(userId);
}

export async function savePlantToGarden(plantData: Omit<PersonalizedPlant, 'id' | 'createdAt' | 'careLogs'>): Promise<{ success: boolean; plant?: PersonalizedPlant; message: string }> {
  const localId = `plant-${Date.now()}`;
  const localPlant: PersonalizedPlant = {
    ...plantData,
    id: localId,
    createdAt: new Date().toISOString(),
    careLogs: [],
    nextWateringDate: new Date(Date.now() + (plantData.aiCarePlan.wateringIntervalDays || 7) * 24 * 60 * 60 * 1000).toISOString(),
    nextFertilizingDate: new Date(Date.now() + (plantData.aiCarePlan.fertilizingIntervalDays || 30) * 24 * 60 * 60 * 1000).toISOString()
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plantData)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const dbPlant = {
          ...data.plant,
          id: data.plant._id || data.plant.id
        };
        // Update local storage too
        const local = getLocalPlants(plantData.userId);
        local.push(dbPlant);
        saveLocalPlants(plantData.userId, local);
        return { success: true, plant: dbPlant, message: 'Plant saved to database!' };
      }
    }
  } catch (error) {
    console.warn('Backend offline, saving plant locally:', error);
  }

  // Fallback to local
  const local = getLocalPlants(plantData.userId);
  local.push(localPlant);
  saveLocalPlants(plantData.userId, local);
  return { success: true, plant: localPlant, message: 'Saved locally (offline mode).' };
}

export async function deletePlantFromGarden(userId: string, plantId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/${plantId}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const local = getLocalPlants(userId).filter(p => p.id !== plantId);
        saveLocalPlants(userId, local);
        return { success: true, message: 'Plant removed from garden.' };
      }
    }
  } catch (error) {
    console.warn('Backend offline, deleting plant locally:', error);
  }

  // Local delete fallback
  const local = getLocalPlants(userId).filter(p => p.id !== plantId);
  saveLocalPlants(userId, local);
  return { success: true, message: 'Plant removed from local garden (offline mode).' };
}

export async function addCareLogToPlant(
  userId: string,
  plantId: string,
  log: Omit<CareLog, 'timestamp'>
): Promise<{ success: boolean; plant?: PersonalizedPlant; message: string }> {
  const newLog: CareLog = {
    ...log,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${plantId}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: newLog })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const dbPlant = {
          ...data.plant,
          id: data.plant._id || data.plant.id
        };
        // Sync local
        const local = getLocalPlants(userId).map(p => p.id === plantId ? dbPlant : p);
        saveLocalPlants(userId, local);
        return { success: true, plant: dbPlant, message: 'Care logged!' };
      }
    }
  } catch (error) {
    console.warn('Backend offline, adding care log locally:', error);
  }

  // Local fallback
  const local = getLocalPlants(userId);
  const plantIndex = local.findIndex(p => p.id === plantId);
  if (plantIndex !== -1) {
    const plant = local[plantIndex];
    plant.careLogs = plant.careLogs || [];
    plant.careLogs.push(newLog);

    // Update schedules based on logged action
    if (log.action === 'watered') {
      plant.nextWateringDate = new Date(Date.now() + (plant.aiCarePlan.wateringIntervalDays || 7) * 24 * 60 * 60 * 1000).toISOString();
    } else if (log.action === 'fertilized') {
      plant.nextFertilizingDate = new Date(Date.now() + (plant.aiCarePlan.fertilizingIntervalDays || 30) * 24 * 60 * 60 * 1000).toISOString();
    }

    local[plantIndex] = plant;
    saveLocalPlants(userId, local);
    return { success: true, plant, message: 'Care logged locally (offline mode).' };
  }

  return { success: false, message: 'Plant not found in garden.' };
}

export async function uploadProgressPhoto(
  userId: string,
  plantId: string,
  image: string,
  aiCarePlan: PersonalizedPlant['aiCarePlan']
): Promise<{ success: boolean; plant?: PersonalizedPlant; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/${plantId}/progress-photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, aiCarePlan })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        const dbPlant = {
          ...data.plant,
          id: data.plant._id || data.plant.id
        };
        // Update local
        const local = getLocalPlants(userId).map(p => p.id === plantId ? dbPlant : p);
        saveLocalPlants(userId, local);
        return { success: true, plant: dbPlant, message: 'Progress photo saved!' };
      }
    }
  } catch (error) {
    console.warn('Backend offline, uploading progress photo locally:', error);
  }

  // Fallback to local
  const local = getLocalPlants(userId);
  const plantIndex = local.findIndex(p => p.id === plantId);
  if (plantIndex !== -1) {
    const plant = local[plantIndex];
    plant.images = plant.images || [];
    plant.images.push(image);
    plant.aiCarePlan = aiCarePlan;
    plant.careLogs = plant.careLogs || [];
    plant.careLogs.push({
      action: 'photo_updated' as any,
      note: 'Uploaded a progress photo for AI health monitoring.',
      timestamp: new Date().toISOString()
    });

    local[plantIndex] = plant;
    saveLocalPlants(userId, local);
    return { success: true, plant, message: 'Saved progress photo locally (offline mode).' };
  }

  return { success: false, message: 'Plant not found.' };
}


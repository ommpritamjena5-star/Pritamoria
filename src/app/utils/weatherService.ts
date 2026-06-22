export interface WeatherReport {
  temp: number; // in Celsius
  humidity: number;
  windSpeed: number;
  description: string;
  conditionCode: number;
  city?: string;
}

// Maps WMO codes to human readable weather descriptions
export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Sunny & Clear';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzling';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Overcast';
}

export async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (response.ok) {
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Your Location';
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
  return 'Your Location';
}

export async function fetchWeatherByCoordinates(lat: number, lon: number): Promise<WeatherReport> {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error('Failed to retrieve weather data from Open-Meteo');
    }
    const data = await response.json();
    const current = data.current;
    const city = await getCityName(lat, lon);

    return {
      temp: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      conditionCode: current.weather_code,
      description: getWeatherDescription(current.weather_code),
      city
    };
  } catch (error) {
    console.error('Weather service fetch error:', error);
    throw error;
  }
}

export function getDeviceLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000 }
    );
  });
}

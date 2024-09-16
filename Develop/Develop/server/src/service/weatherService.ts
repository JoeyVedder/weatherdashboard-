import dotenv from 'dotenv'; 
import axios from 'axios'; // Importing axios will help with HTTP

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  forecast: Array<{ date: string; temperature: number; description: string }>;

  constructor(temperature: number, description: string, forecast: Array<{ date: string; temperature: number; description: string }>) {
    this.temperature = temperature;
    this.description = description;
    this.forecast = forecast;
  }
}

// Complete the WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;

  constructor(apiKey: string) {
    this.baseURL = 'https://api.openweathermap.org';
    this.apiKey = apiKey;
  }

  
  // Create fetchLocationData method
async fetchLocationData(query: string): Promise<any> { // A Promise can resolve to any type of value
    try {
      const response = await axios.get(`${this.baseURL}/data/2.5/weather`, {
        params: {
          q: query,
          appid: this.apiKey,
          units: 'metric' // for temperature in Celsius
        }
      });
      return response.data;
    } catch (error: any) {
      // Throws a new error with a custom message
      throw new Error('Error fetching location data: ' + error.message);
    }
  }

  // Create destructureLocationData method
  destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    return { lat, lon }; // returning an object that fits the Coordinates interface
  }

  // Create buildWeatherQuery method
  buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Create buildGeocodeQuery method
  buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching weather data: ' + error.message);
    }
  }

  // Build parseCurrentWeather method
  parseCurrentWeather(response: any): Weather {
    const { main, weather } = response.list[0];
    const temperature = main.temp;
    const description = weather[0].description;
    const forecast = this.buildForecastArray(response);
    return new Weather(temperature, description, forecast);
  }

  // Complete buildForecastArray method
  buildForecastArray(weatherData: any): Array<{ date: string; temperature: number; description: string }> {
    return weatherData.list.map((item: any) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
    }));
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      return this.parseCurrentWeather(weatherData);
    } catch (error: any) {
      throw new Error('Error getting weather for city: ' + error.message);
    }
  }
}

const apiKey = process.env.WEATHER_API_KEY as string; // Type assertion for environment variable
const weatherService = new WeatherService(apiKey);

export default weatherService;

import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}


// Define a class for the Weather object
interface Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
}

// Complete the WeatherService class
class WeatherService {
  baseURL: string;
  API_Key: string;

  constructor(apiKey: string) {
    this.baseURL = 'https://api.openweathermap.org';
    this.API_Key = apiKey;
  }


  // Create fetchLocationData method
  async fetchLocationData(query: string): Promise<any> {  // A Promise can resolve to any type of value
    try {
      console.log("this is a fetchLocationData query", query);
      const response = await fetch(query);
      console.log("This is a fetchLocationData response", response);
      return response;
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

  // Create buildGeocodeQuery method
  buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.API_Key}`;
  }


  // Create buildWeatherQuery method
  buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.API_Key}&units=metric`;
  }


  // Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    console.log("this is a fetchAndDestructureLocationData query", query);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(url);
      return response;
    } catch (error: any) {
      throw new Error('Error fetching weather data: ' + error.message);
    }
  }

  // Build parseCurrentWeather method
  parseCurrentWeather(response: any): Weather {
    return {
      city: response.name, 
      date: response.date,
      tempF: response.main.tempF,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity,
      icon: response.weather[0].icon,
      iconDescription: response.weather[0].iconDescription 
    };
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
      console.log("Coordinates", coordinates);
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log("this is a full weatherData", weatherData);
      return this.parseCurrentWeather(weatherData);
    } catch (error: any) {
      throw new Error('Error getting weather for city: ' + error.message);
    }
  }
}

const apiKey = process.env.WEATHER_API_KEY as string; // Type assertion for environment variable
const weatherService = new WeatherService(apiKey);

export default weatherService;


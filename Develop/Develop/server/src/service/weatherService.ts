import dotenv from 'dotenv';
import { Dayjs } from 'dayjs';

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  cityName: string;
  date: Dayjs | string;
  temp: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
}

class WeatherService {
  baseURL: string;
  API_Key?: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    this.API_Key = process.env.API_KEY || '';
  }

  async fetchLocationData(query: string): Promise<any> {
    try {
      console.log("Fetching location data with query:", query);
      const response = await fetch(query);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message); // Handle API error responses
      }
      return data;
    } catch (error: any) {
      throw new Error('Error fetching location data: ' + error.message);
    }
  }

  destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    return { lat, lon };
  }

  buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${cityName}&appid=${this.API_Key}`;
  }

  async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message); // Handle API error responses
      }
      return data;
    } catch (error: any) {
      throw new Error('Error fetching weather data: ' + error.message);
    }
  }

  buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.API_Key}&units=metric`;
  }

  parseCurrentWeather(response: any): Weather {
    return {
      cityName: response.city.name,
      date: response.list[0].dt_txt, // Getting the date from the first forecast
      temp: response.list[0].main.temp,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
      icon: response.list[0].weather[0].icon,
      iconDescription: response.list[0].weather[0].description
    };
  }

  async getWeatherForCity(cityName: string): Promise<Weather> {
    try {
      const geocodeQuery = this.buildGeocodeQuery(cityName);
      const coordinates = await this.fetchAndDestructureLocationData(geocodeQuery);
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log("Weather Data:", weatherData);
      return this.parseCurrentWeather(weatherData);
    } catch (error: any) {
      throw new Error('Error getting weather for city: ' + error.message);
    }
  }

  async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    console.log("Fetching and destructuring location data with query:", query);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
}

const weatherService = new WeatherService();

export default weatherService;

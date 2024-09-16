import fs from 'fs/promises'; // For async file operations
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}

  getDetails(): string {
    return `City Name: ${this.name}, City ID: ${this.id}`;
  }
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> { 
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      } else {
        throw error;
      }
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> { 
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.filePath, data, 'utf8');
    } catch (error) {
      throw new Error('Error writing to searchHistory.json: ' + (error as Error).message);
    }
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities.map(city => new City(city.name, city.id));
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<void> { // Changed id to number
    const cities = await this.read();
    const newCity = new City(name, uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();

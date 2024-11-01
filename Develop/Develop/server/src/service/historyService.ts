import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private async read() {
    return await fs.readFile("db/history.json", "utf-8");
  }

  private async write(cities: City[]) {
    console.log("Writing cities to file:", cities);
    await fs.writeFile(
      "db/history.json",
      JSON.stringify(cities),
      "utf-8"
    );
  }

  async getCities(): Promise<City[]> {
    const data: string = await this.read();
    return JSON.parse(data);
  }

  async addCity(city: string) {
    try {
      let cityExists = false;
      console.log("Adding city to history:", city);
      const cities: City[] = await this.getCities();
      
      cities.forEach((existingCity) => {
        if (city === existingCity.name) {
          console.log(city, "already exists in history.");
          cityExists = true;
        }
      });

      if (!cityExists) {
        console.log("City successfully added to history.");
        cities.push(new City(city, uuidv4()));
        await this.write(cities);
      }
    } catch (error) {
      console.log("Error adding city:", error);
    }
  }

  async removeCity(id: string) {
    console.log("Removing city with ID:", id);
    try {
      const cities = await this.getCities();
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].id === id) {
          console.log(
            `Match found! Removing city "${cities[i].name}".`
          );
          cities.splice(i, 1);
          console.log("City removed successfully.");
          await this.write(cities);
          break;
        }
      }
    } catch (error) {
      console.log(`Error removing city with ID ${id}:`, error);
    }
  }
}

export default new HistoryService();

import { Router, type Request, type Response } from "express";

const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

router.post("/", async (req: Request, res: Response) => {
  console.log("Received Weather POST Request from", req.ip);

  try {
    await HistoryService.addCity(req.body.cityName);
    const weatherData = await WeatherService.getWeatherForCity(req.body.cityName);

    if (!weatherData) {
      throw new Error("Data not found, please try again.");
    }

    console.log(typeof weatherData);
    console.log(typeof weatherData[0]);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.log("Error handling weather request:", error);
    return res.status(500).json({ error: `An error occurred: ${error}` });
  }
});

router.get("/history", async (req: Request, res: Response) => {
  console.log("Received History GET Request from", req.ip);

  try {
    const cityList = await HistoryService.getCities();
    return res.status(200).json(cityList);
  } catch (error) {
    console.log("Error retrieving history:", error);
    return res.status(500).json({ error: `An error occurred: ${error}` });
  }
});

router.delete("/history/:id", async (req: Request, res: Response) => {
  console.log("Received History DELETE Request from", req.ip);

  await HistoryService.removeCity(req.params.id);

  return res.sendStatus(404);
});

export default router;

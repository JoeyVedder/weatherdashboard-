import express, { Request, Response } from 'express';
import HistoryService from '../../service/historyService.js'; 
import WeatherService from '../../service/weatherService.js'; 

const router = express.Router();

// Define a type for the request parameters for the DELETE route
interface ParamsId {
  id: string;
}

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body as { city?: string }; // Extract 'city' from 'req.body' with optional string type

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity();
    // Save city to search history
    await HistoryService.addCity(city);
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error); // Log error details with custom message
    return res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

// GET search history
router.get('/history', async (res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving search history:', error); 
    return res.status(500).json({ error: 'An error occurred while retrieving search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request<ParamsId>, res: Response) => { // Use ParamsId interface for 'req.params'
  const { id } = req.params; // Extract 'id' from 'req.params'

  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City has been removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error); 
    return res.status(500).json({ error: 'An error occurred while trying to remove city from search history' });
  }
});

export default router;

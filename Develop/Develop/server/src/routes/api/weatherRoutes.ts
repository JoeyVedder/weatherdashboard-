import express, { Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = express.Router();

// Helper function to handle responses
const sendResponse = (res: Response, statusCode: number, data: any) => {
  return res.status(statusCode).json(data);
};

// Define a type for the request parameters for the DELETE route
interface ParamsId {
  id: string;
}

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body as { city?: string }; // Extract 'city' from 'req.body' with optional string type

  if (!city) {
    return sendResponse(res, 400, { error: 'City name is required' });
  }

  try {
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log(weatherData);
    // Save city to search history
    await HistoryService.addCity(city);
    return sendResponse(res, 200, weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error); // Log error details with custom message
    return sendResponse(res, 500, { error: 'An error occurred while retrieving weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => { // FIX: Added 'req' parameter
  try {
    const history = await HistoryService.getCities();
    return sendResponse(res, 200, history);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return sendResponse(res, 500, { error: 'An error occurred while retrieving search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request<ParamsId>, res: Response) => { // Use ParamsId interface for 'req.params'
  const { id } = req.params; // Extract 'id' from 'req.params'

  try {
    await HistoryService.removeCity(id);
    return sendResponse(res, 200, { message: 'City has been removed from search history' });
  } catch (error) {
    console.error('Error removing city from search history:', error);
    return sendResponse(res, 500, { error: 'An error occurred while trying to remove city from search history' });
  }
});

export default router;

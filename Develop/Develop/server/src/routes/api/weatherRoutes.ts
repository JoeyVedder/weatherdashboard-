import express from 'express';
import weatherService from './weatherService'; 
import HistoryService from './HistoryService'; 

const router = express.Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }
  try {
    // TODO: GET weather data from city name
    const weatherData = await weatherService.getWeatherByCity(city);
    // TODO: save city to search history
    await HistoryService.saveCityToHistory(city);
    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while retrieving weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getSearchHistory();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while retrieving search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
 // Extract the `id` parameter from the request's URL parameters
  const { id } = req.params;


  try {
    await HistoryService.deleteCityFromHistory(id);
    return res.status(200).json({ message: 'City has been removed from search history' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while trying to remove city from search history' });
  }
});

export default router;

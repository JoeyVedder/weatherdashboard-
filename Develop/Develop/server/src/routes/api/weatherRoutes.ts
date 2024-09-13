import { Router } from 'express';
import weatherService from '../../service/weatherService';
import historyService from '../../service/historyService';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  const { city } = req.body;
  if(!city) {
    return res.status(400).json({ error: 'City name is required'});
  }
  try {
    // TODO: GET weather data from city name
    const weatherData = await weatherService.getWeatherByCity(city);
    // TODO: save city to search history
    await historyService.saveCityToHistory(city);
    return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: 'An error occured while retrieving weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const history = await historyService.getSearchHistory();
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: 'An error occured while retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await historyService.deleteCityFromHistory(id);
    return res.status(200).json({ message: 'City has been removed from search history'});
  } catch (error) {
    return res.status(500).json({ error: 'An error has occured while trying to remove city from search history'});
  }
});

export default router;

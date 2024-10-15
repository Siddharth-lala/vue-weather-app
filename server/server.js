const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

//used weatherapi because openweatherapi became a paid service

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    }
}));

app.use(express.json());

const weatherApiKey = '';

app.post('/getWeather', async (req, res) => {
    const city = req.body.city;
    try {
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
            params: {
                key: weatherApiKey,
                q: city
            }
        });

        const weatherData = weatherResponse.data;

        const forecast = {
            location: weatherData.location.name,
            region: weatherData.location.region,
            country: weatherData.location.country,
            localtime: weatherData.location.localtime,
            temperature: weatherData.current.temp_c,
            wind_speed: weatherData.current.wind_kph,
            precipitation: weatherData.current.precip_mm,
            humidity: weatherData.current.humidity,
            condition: weatherData.current.condition.text,
            icon: weatherData.current.condition.icon
        };

        res.json({ forecast });
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});

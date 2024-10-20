const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const buildSustainabilityString = (weatherData) => {
    const { temp_c, condition, wind_kph, air_quality, humidity } = weatherData.current;

    let tips = [];

    if (temp_c > 20) {
        tips.push("It's warm today - try reducing air conditioning to save energy.\n");
    } else if (temp_c < 10) {
        tips.push("It's cold today - dress warmly to avoid turning up the heat indoors.\n");
    } else {
        tips.push("The temperature is mild - open windows to regulate indoor temperature .\n");
    }

    if (condition.text.toLowerCase().includes("rain")) {
        tips.push("Rainy day ahead - put a bucket outside to harvest rainwater.\n");
    } else if (condition.text.toLowerCase().includes("sunny")) {
        tips.push("It's sunny! Make use of natural light to reduce electricity consumption.\n");
    } else {
        tips.push(`Weather is ${condition.text.toLowerCase()}.\n`);
    }

    if (wind_kph > 40) {
        tips.push("Strong winds today! Consider wind energy solutions.\n");
    } else {
        tips.push("Winds are calm. Perfect day for outdoor activities.\n");
    }

    // Air quality
    if (air_quality['us-epa-index'] > 2) {
        tips.push("Air quality isn't great. Reduce vehicle emissions by using public transport, walking or cycling today.\n");
    } else {
        tips.push("Air quality is good. Enjoy outdoor activities while maintaining sustainable habits.\n");
    }

    // Humidity
    if (humidity > 70) {
        tips.push("High humidity detected. Be careful of mosquitos.\n");
    } else {
        tips.push("Humidity levels are low. Consider energy-efficient humidifiers if necessary.\n");
    }

    return tips.join(" ");
}


const buildPackingString = (weatherData) => {
    let packingSuggestion = '';
    if (weatherData.current.temp_c < 10) {
        packingSuggestion += 'Pack warm clothes. ';
    }
    if (weatherData.current.precip_mm > 0) {
        packingSuggestion += 'Pack an umbrella. ';
    }
    if (weatherData.current.wind_kph > 20) {
        packingSuggestion += 'Wear windproof clothing. ';
    }
    return packingSuggestion
}


//used weatherapi because openweatherapi became a paid service

app.use(cors());

app.use(express.json());

const weatherApiKey = '';

app.post('/getWeather', async (req, res) => {
    const city = req.body.city;
    try {
        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
            params: {
                key: weatherApiKey,
                q: city,
                aqi: 'yes'
            }
        });


        const weatherData = weatherResponse.data;



        let packingSuggestion = buildPackingString(weatherData)
        let sustainabilityTips = buildSustainabilityString(weatherData)

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
            icon: weatherData.current.condition.icon,
            epaIndex: weatherData.current.air_quality['us-epa-index'],
            packingSuggestion: packingSuggestion,
            sustainabilityTips
        };

        res.json({ forecast });
    } catch (error) {
        res.status(500).send('Error fetching weather data');
    }
});

app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});




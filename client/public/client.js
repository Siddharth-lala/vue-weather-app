const App = {
    setup() {
        const city = Vue.ref('');
        const weatherData = Vue.ref(null);
        const error = Vue.ref(null);

        const getWeather = async () => {
            try {
                const response = await fetch('http://localhost:3000/getWeather', { // Use backend API running on port 3000
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city: city.value })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();
                weatherData.value = data.forecast;
                error.value = null;
            } catch (err) {
                error.value = 'Could not fetch weather data. Please try again.';
                weatherData.value = null;
            }
        };

        return { city, weatherData, error, getWeather };
    },
    template: `
      <div>
        <h1>Weather Forecast</h1>
        <input v-model="city" placeholder="Enter city name" />
        <button @click="getWeather">Get Forecast</button>
  
        <p v-if="error" style="color: red;">{{ error }}</p>
  
        <div v-if="weatherData">
          <h2>Weather in {{ weatherData.location }}, {{ weatherData.country }}</h2>
          <p><strong>Local Time:</strong> {{ weatherData.localtime }}</p>
          <p><strong>Temperature:</strong> {{ weatherData.temperature }}°C</p>
          <p><strong>Condition:</strong> {{ weatherData.condition }}</p>
          <p><strong>Wind Speed:</strong> {{ weatherData.wind_speed }} kph</p>
          <p><strong>Precipitation:</strong> {{ weatherData.precipitation }} mm</p>
          <p><strong>Humidity:</strong> {{ weatherData.humidity }}%</p>
          <img :src="weatherData.icon" alt="Weather Icon" />
        </div>
      </div>
    `
};

Vue.createApp(App).mount('#app');

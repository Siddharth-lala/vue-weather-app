// Create the Vue app
const app = Vue.createApp({
    data() {
      return {
        city: '',           
        weatherData: null,  
        date: null,         
        errorMessage: null,
      };
    },
    methods: {
      async fetchWeather() {
        try {
          const response = await fetch('http://localhost:3000/getWeather', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: this.city })
          });
          const data = await response.json();
          if (response.ok) {
            this.weatherData = data.forecast;
            this.errorMessage = null;

            

          } else {
            this.weatherData = null;
            this.errorMessage = 'Error fetching weather data!';
          }
        } catch (error) {
          this.errorMessage = 'Error connecting to the server!';
          console.error(error);
        }
      }
    },
    template: `
      <div class="container">
        <div class="card">
          <h2>Weather App</h2>
  
          <!-- Input field for city -->
          <div class="input-section">
            <p-inputtext v-model="city" placeholder="Enter city" aria-label="City input"></p-inputtext>
            <p-button label="Submit" icon="pi pi-search" @click="fetchWeather"></p-button>
          </div>
  
  
          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <p>{{ errorMessage }}</p>
          </div>
  
          <!-- Weather Details -->
          <div v-if="weatherData" class="weather-details">
            <h3>{{ weatherData.location }}, {{ weatherData.country }}</h3>
            <p>{{ weatherData.localtime }}</p>
            <img :src="weatherData.icon" :alt="weatherData.condition" aria-label="Weather icon">
            <p>Condition: {{ weatherData.condition }}</p>
            <p class="temperature">{{ weatherData.temperature }} °C</p>
            <p>Wind Speed: {{ weatherData.wind_speed }} km/h</p>
            <p>Precipitation: {{ weatherData.precipitation }} mm</p>
            <p>Humidity: {{ weatherData.humidity }} %</p>
            <p>Air Pollution: {{ weatherData.epaIndex}} <span class='weatherWarning'>{{weatherData.epaIndex > 2 ? '!!!': ''}}</span></p>
            <p class="packing">{{weatherData.packingSuggestion}}</p>
            <p class="tips">Sustainability Tips:</p>
            <p class="tips">{{weatherData.sustainabilityTips}}</p>
            </div>
        </div>
      </div>
    `
  });
  

  app.use(PrimeVue.Config);
  app.component('p-button', PrimeVue.Button);
  app.component('p-inputtext', PrimeVue.InputText);

  // Mount the app
  app.mount('#app');
  
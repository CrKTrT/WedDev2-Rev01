// used reference code from weather trend experiment and used there to connect openweathermap and trend lines

import axios from "axios";

const apiKey = process.env.OPENWEATHER_API_KEY; //I'll create a seperate .env file to add an API key'

export const openWeatherService = {

  async getCurrent(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  },

  async getForecast(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }
};

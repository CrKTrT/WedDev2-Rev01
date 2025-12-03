export const stationAnalytics = {

  // Here reporting on max and min temperature from weather reports
  calculateMaxMin(reports) {
    
    if (reports.length === 0) {
      return {
        min: { temp: null, windSpeed: null, pressure: null },
        max: { temp: null, windSpeed: null, pressure: null }
      };
    }

    let min = {
      temp: reports[0].temp,
      windSpeed: reports[0].windSpeed,
      pressure: reports[0].pressure,
    };

    let max = {
      temp: reports[0].temp,
      windSpeed: reports[0].windSpeed,
      pressure: reports[0].pressure,
    };

    for (let r of reports) {

      // Temperature
      if (r.temp < min.temp) min.temp = r.temp;
      if (r.temp > max.temp) max.temp = r.temp;

      // Wind Speed
      if (r.windSpeed < min.windSpeed) min.windSpeed = r.windSpeed;
      if (r.windSpeed > max.windSpeed) max.windSpeed = r.windSpeed;

      // Pressure
      if (r.pressure < min.pressure) min.pressure = r.pressure;
      if (r.pressure > max.pressure) max.pressure = r.pressure;
    }

    return { min, max };

},

//Trend line calculation for charts 
calculateTrends(reports) {
    return {
      trendLabels: reports.map(r => r.time),
      tempTrend: reports.map(r => r.temp),
      windTrend: reports.map(r => r.windSpeed),
      pressureTrend: reports.map(r => r.pressure),
    };
  }
};

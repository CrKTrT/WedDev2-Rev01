import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";
import { openWeatherService } from "../services/openweather-service.js"; //new addition for openWeatherService 

export const stationController = {

// Here I am changing from playlist to Station and Reporting view 
async index(request, response) {
    const stationId = request.params.stationId;
    const station = await stationStore.getStationById(stationId);
    const reports = await reportStore.getReportsByStationId(stationId);

    const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;
    const maxMin = stationAnalytics.calculateMaxMin(reports);

    const viewData = {
      title: station.name,
      station,
      reports,
      latest: latestReport,
    //  max / min summary fields as added in the station-summary partial
      minTemp: maxMin.min.temp,
      maxTemp: maxMin.max.temp,

      minWind: maxMin.min.windSpeed,
      maxWind: maxMin.max.windSpeed,

      minPressure: maxMin.min.pressure,
      maxPressure: maxMin.max.pressure,

      //trend line reference code addition
      tempTrend: latestReport?.tempTrend || [],
      trendLabels: latestReport?.trendLabels || [],
      //trendLabels,
      //tempTrend,
      //windTrend,
      //pressureTrend
    };
    response.render("station-view", viewData);
  },

  // Here I am adding station reports using openweather , reads will come as an auto reads
  async addReport(request, response) {
    const stationId = request.params.stationId;
    //const station = await stationStore.getStationById(stationId);

    const newReport = {
      time: new Date().toISOString(),
      code: request.body.code,
      temp: Number(request.body.temp),
      windSpeed: Number(Number(request.body.windSpeed).toFixed(2)),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
      tempTrend: [],
      trendLabels: [],

    };

  //console.log(`Adding new report for station ${station.name}`);
    await reportStore.addReport(stationId, newReport);

    response.redirect("/station/" + stationId);
  },

  // new additon for weather reading from Openweather and eads will come as an auto reads

  //step1 : autoreading 
   async autoRead(request, response) {
    const stationId = request.params.stationId;
    const station = await stationStore.getStationById(stationId);

  //step2: weather data fetching from openweather using lat, lang 
    const weather = await openWeatherService.getCurrent(station.lat, station.lng);

  //step3: weather data trends on forecasts using lat lang
  const forecast = await openWeatherService.getForecast(station.lat, station.lng);

    const tempTrend = [];
    const trendLabels = [];

    const list = forecast.list.slice(0, 10);

    for (const item of list) {
      tempTrend.push(item.main.temp);
      trendLabels.push(item.dt_txt);
  }

    const newReport = {
      time: new Date().toISOString(),
      code: weather.weather[0].id,
      icon: weather.weather[0].icon,
      temp: weather.main.temp,
      windSpeed: Number((weather.wind.speed * 3.6).toFixed(2)),
      windDirection: weather.wind.deg,
      pressure: weather.main.pressure,
      tempTrend,
      trendLabels
  };

   await reportStore.addReport(stationId, newReport);
    response.redirect("/station/" + stationId);
  },

  
  // Here I am deleting station reports
   //async deleteStation(request, response) {
    //const stationId = request.params.stationId;
    //const reportId = request.params.reportId;

    //console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    //await reportStore.deleteReport(reportId);

    //response.redirect("/station/" + stationId);
  //},

   async deleteStation(request, response) {
    const stationId = request.params.stationId;

    //console.log(`Deleting Station ${stationId}`);

  //Here option to delete the station itself
    await stationStore.deleteStationById(stationId);

   // Here delete all reports under the added station
    await reportStore.deleteReportByStationId(stationId);

    response.redirect("/dashboard");
   }

};
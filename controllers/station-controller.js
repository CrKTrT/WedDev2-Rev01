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


    // Here generate trend from the last 10 reports

    let trendLabels = [];
    let tempTrend = [];
    let windTrend = [];
    let pressureTrend = [];

    if (reports.length > 0) {
      const lastReports = reports.slice(-10);
      trendLabels = lastReports.map(r => {
        const d = new Date(r.time);
        return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      });
      tempTrend = lastReports.map(r => Number(r.temp.toFixed(2)));
      windTrend = lastReports.map(r => Number(r.windSpeed.toFixed(2)));
      pressureTrend = lastReports.map(r => Number(r.pressure.toFixed(2)));
    }


    //const lastReports = reports.slice(-10); // last 10 reports
    //const trendLabels = lastReports.map(r => r.time);
    //const trendLabels = lastReports.map(r => {
      //const d = new Date(r.time);
      //return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    //});


    //const tempTrend = lastReports.map(r => Number(r.temp.toFixed(2)));
    //const windTrend = lastReports.map(r => Number(r.windSpeed.toFixed(2)));
    //const pressureTrend = lastReports.map(r => Number(r.pressure.toFixed(2)));

    const viewData = {
      title: station.name,
      station,
      reports,
      latest: latestReport,
    //  max / min summary fields as added in the station-summary partial
      //minTemp: maxMin.min.temp.toFixed(2),
      //maxTemp: maxMin.max.temp.toFixed(2),
      minTemp: maxMin.min?.temp !== null ? maxMin.min?.temp.toFixed(2) : "--", //fix to check null case and dashbaord load issue
      maxTemp: maxMin.max?.temp !== null ? maxMin.max?.temp.toFixed(2) : "--",
      
      //minWind: maxMin.min.windSpeed.toFixed(2),
      //maxWind: maxMin.max.windSpeed.toFixed(2),
      minWind: maxMin.min?.windSpeed !== null ? maxMin.min?.windSpeed.toFixed(2) : "--", //fix to check null case and dashbaord load issue
      maxWind: maxMin.max?.windSpeed !== null ? maxMin.max?.windSpeed.toFixed(2) : "--", //fix to check null case and dashbaord load issue

      //minPressure: maxMin.min.pressure.toFixed(2),
      //maxPressure: maxMin.max.pressure.toFixed(2),
      minPressure: maxMin.min?.pressure !== null ? maxMin.min?.pressure.toFixed(2) : "--", //fix to check null case and dashbaord load issue
      maxPressure: maxMin.max?.pressure !== null ? maxMin.max?.pressure.toFixed(2) : "--", //fix to check null case and dashbaord load issue 

      //trend line reference code addition
      //tempTrend: latestReport?.tempTrend || [],
      //trendLabels: latestReport?.trendLabels || [],
      trendLabels,
      tempTrend,
      windTrend,
      pressureTrend
      //trendLabels: trends.trendLabels,
      //tempTrend: trends.tempTrend.map(t => t.toFixed(2)),
      //windTrend: trends.windTrend.map(w => w.toFixed(2)),
      //pressureTrend: trends.pressureTrend.map(p => p.toFixed(2))
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

    const forecastList = forecast.list.slice(0, 10);

    //for (const item of list) {
      //tempTrend.push(item.main.temp);
      //trendLabels.push(item.dt_txt);

    //const list = forecast.list.slice(0, 10);
    for (const item of forecastList) {
        tempTrend.push(Number(item.main.temp.toFixed(2)));
        
        const d = new Date(item.dt_txt);
        trendLabels.push(`${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`);

  }

    const newReport = {
      time: new Date().toISOString(),
      code: weather.weather[0].id,
      icon: weather.weather[0].icon,
      temp: Number(weather.main.temp.toFixed(2)),
      windSpeed: Number((weather.wind.speed * 3.6).toFixed(2)),
      windDirection: weather.wind.deg,
      pressure: Number(weather.main.pressure.toFixed(2)),
      tempTrend, //tempTrend.map(t => Number(t.toFixed(2))),
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
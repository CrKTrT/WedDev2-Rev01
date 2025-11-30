import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { stationAnalytics } from "../utils/station-analytics.js";

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
    };
    response.render("station-view", viewData);
  },

  // Here I am adding station reports
  async addReport(request, response) {
    const stationId = request.params.stationId;
    const station = await stationStore.getStationById(stationId);

    const newReport = {
      time: new Date().toISOString(),
      code: request.body.code,
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };

  console.log(`Adding new report for station ${station.name}`);
    await reportStore.addReport(stationId, newReport);

    response.redirect("/station/" + stationId);
  },

    // Here I am deleting station reports
   async deleteReport(request, response) {
    const stationId = request.params.stationId;
    const reportId = request.params.reportId;

    console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    await reportStore.deleteReport(reportId);

    response.redirect("/station/" + stationId);
  },

  //Here option to delete the station itself
    await stationStore.deleteStationByID(stationId);

    await reportStore.deleteReportByStationId(stationId);

    response.redirect("/dashboard");
   }

};
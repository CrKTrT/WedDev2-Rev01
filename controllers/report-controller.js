import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async index(request, response) {
    const stationId = request.params.stationId;
    const reportId = request.params.reportId;
    console.log(`Editing Track ${reportId} from Station ${stationId}`);

    const viewData = {
      title: "Edit Weather Report",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
    };
    response.render("report-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationId;
    const reportId = request.params.reportId;
    
    const updatedReport = {
      code: request.body.code,
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
      date: request.body.date || new Date().toISOString(),
    };

    console.log(`Updating Report ${reportId} from Station ${stationId}`);
    await reportStore.updateReport(reportId, updatedReport);
    response.redirect("/station/" + stationId);
  },
};

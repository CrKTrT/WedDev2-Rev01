import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllTracks() {
    await db.read();
    return db.data.reports;
  },

  //Here addition of new report by a station ID T or D station
  async addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  //Here report related to a station 
  async getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === stationId);
  },

  //here report generation by a ID
  async getReportById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === reportId);
  },

  //Here deletion of a report
  async deleteReport(reportId) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === reportId);
    if (index !== -1) {
      db.data.reports.splice(index, 1);
      await db.write();
    }
  },

  //Here all reports deletion option
  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  //Here update an existing report
  async updateReport(reportId, updatedReport) {
    const report = await this.getReportById(reportId);
    if (report) {
      report.temp = updatedReport.temp;
      report.windSpeed = updatedReport.windSpeed;
      report.pressure = updatedReport.pressure;
      report.code = updatedReport.code; // optional: weather code
      report.date = updatedReport.date;
      await db.write();
    }
  },
};

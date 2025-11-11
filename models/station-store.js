import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { reportStore } from "./report-store.js";

const db = initStore("stations");

export const stationStore = {
    //Here I am getting all the stations
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  // HEre I am adding a new station as required [replacing playlist with station]
  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  // Here getting a station by ID
  async getStationById(id) {
    await db.read();
    const station = db.data.stations.find((station) => station._id === id);
    if (station) { //used if logic to get station report
        station.reports = await reportStore.getReportsByStationId(station._id);
    }
    return station;
  },

  //Here details as per the stations based on the userIDs
  async getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },

  //Here deleting a station by userID pr ID who is logged in 
  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  //Here deleting all stations
  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
};

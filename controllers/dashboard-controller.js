import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

export const dashboardController = {
    //here showing all stations for the used who loggedin at the time
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      response.redirect("/login");
      return;
    }

    // change to get stations data as per the user
    
    let stations = await stationStore.getStationsByUserId(loggedInUser._id);

    // station sorting alphabetically 
   stations = stations.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    // Report for each station
    for (const station of stations) {
      const reports = await reportStore.getReportsByStationId(station._id);
      station.latest = reports.length > 0 ? reports[reports.length - 1] : null;
    }

    const viewData = {
      title: "Weather Dashboard",
      user: loggedInUser,
      stations,
    };

    
    console.log("dashboard rendering for:", loggedInUser.email);
    response.render("dashboard-view", viewData);
  },

  //Here a new station is being added [changing playlist to station]
 async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    
    const newStation = {
      name: request.body.name,
      lat: Number(request.body.lat),
      lng: Number(request.body.lng),
      userid: loggedInUser._id,
    };

    console.log(`Adding new station: ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  //Here a new station is being deleted [changing playlist to station] [commented below code as deletion via station-controller]
  //async deleteStation(request, response) {
  //const stationId = request.params.id;
  //  console.log(`Deleting station ${stationId}`);
  //  await stationStore.deleteStationById(stationId);
  //  response.redirect("/dashboard");
  //},
};

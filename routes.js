import express from "express";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { reportController } from "./controllers/report-controller.js";
import { aboutController } from "./controllers/about-controller.js";

export const router = express.Router();

// Here account related controls added - login, signup, logout etc
router.get("/", accountsController.index);
router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);

// Dashboard related control where station details add, delete etc
router.get("/dashboard", dashboardController.index);
router.post("/dashboard/addstation", dashboardController.addStation);
router.get("/dashboard/deletestation/:stationId", dashboardController.deleteStation);


// Here getting station and report 
router.get("/station/:stationId", stationController.index);
router.post("/station/:stationId/addreport", reportController.addReport);
router.get("/station/:stationId/deletereport/:reportId", reportController.deleteReport);
router.get("/station/:stationId/autoread", stationController.autoread);

router.get("/about", aboutController.index);
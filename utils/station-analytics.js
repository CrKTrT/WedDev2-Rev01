export const stationAnalytics = {

  // Here reporting on max and min temperature from weather reports
  calculateMaxMin(reports) {
    let max = null;
    let min = null;

    if (reports.length > 0) {
      max = reports[0].temp;
      min = reports[0].temp;

      for (let i = 1; i < reports.length; i++) {
        if (reports[i].temp > max) max = reports[i].temp;
        if (reports[i].temp < min) min = reports[i].temp;
      }
    }

    return { max, min };
  }

};


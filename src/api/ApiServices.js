import axios from "axios";

import {
  makeUserService,
  makeUniversityService,
  makeEstablishmentService,
  makeLaboratoryService,
  makeTeamService,
  makeScraperService,
  makeAuthentificationService,
  makeStatisticsService,
  makeNotificationsService,
  makePhdStudentsService,
} from "./services";

const makeApiServices = ({ token, alertService }) => {
  const { pushAlert } = alertService;

  const setUpInterceptors = ({ api, serviceName }) => {
    const printer = ({ status, type }) => (prenable) => {
      const color = status === "fulfilled" ? "Green" : "Red";
      console.log("%c" + type + " : ", "color:" + color);
      console.log(prenable);
      if (type === "response" && status === "rejected") {
        const message = `Une erreur de type : ${prenable.message} depuis le service de ${serviceName} de l'application`;
        pushAlert({
          message,
          type: "danger",
          // , autoClose: false
        });
      }
      return prenable;
    };

    api.interceptors.request.use(
      printer({ status: "fulfilled", type: "request" }),
      printer({ status: "rejected", type: "request" })
    );
    api.interceptors.response.use(
      printer({ status: "fulfilled", type: "response" }),
      printer({ status: "rejected", type: "response" })
    );
  };

  const backendApiNoAuth = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + "/auth",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
  });

  const scraperApi = axios.create({
    baseURL: process.env.REACT_APP_SCRAPER_URL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  setUpInterceptors({ api: backendApiNoAuth, serviceName: "back-office" });
  setUpInterceptors({ api: scraperApi, serviceName: "web scraping" });

  if (!token)
    return {
      authentificationService: makeAuthentificationService(backendApiNoAuth),
      scraperService: makeScraperService(scraperApi),
    };

  const backendApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + "/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  setUpInterceptors({ api: backendApi, serviceName: "back-office" });

  return {
    authentificationService: makeAuthentificationService(backendApiNoAuth),
    scraperService: makeScraperService(scraperApi),
    userService: makeUserService(backendApi),
    universityService: makeUniversityService(backendApi),
    establishmentService: makeEstablishmentService(backendApi),
    laboratoryService: makeLaboratoryService(backendApi),
    teamService: makeTeamService(backendApi),
    phdStudentService: makePhdStudentsService(backendApi),
    statisticsService: makeStatisticsService(backendApi),
    notificationsService: makeNotificationsService(backendApi),
  };
};

export default makeApiServices;

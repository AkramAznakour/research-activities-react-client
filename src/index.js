import React, { useEffect } from "react";
import { render } from "react-dom";
import { Router, Switch, Route as PublicRoute } from "react-router-dom";

import { createBrowserHistory } from "history";
import { AppProvider } from "./context/AppContext";

import Route from "./routes/Route";

import LoginPage from "./views/Auth/LoginPage";
import Visitors from "./views/Visitors/Visitors";

import MenuBar from "./views/layout/MenuBar";
import NavBar from "./views/layout/NavBar";
import ApplicationAlerts from "./views/components/ApplicationAlerts";
import Footer from "./views/layout/Footer";

import { routes } from "./routes/routes";

import "./assets/css/datatables.css";
import "./assets/css/tabler.css";

import "popper.js/dist/popper";
import "bootstrap/dist/js/bootstrap";

const history = createBrowserHistory();

const App = () => (
  <AppProvider>
    <Router history={history}>
      <Switch>
        <PublicRoute exact path="/login" component={LoginPage} />    
        <PublicRoute exact path="/visitors" component={Visitors} />    
        <PublicRoute exact path="/visitors/author-search/:authorName" component={Visitors} />    
        <PublicRoute exact path="/visitors/author/:platform/:authorId" component={Visitors} />    
        <Route path="/*" component={MainLayout} />
      </Switch>
    </Router>
  </AppProvider>
);

const MainLayout = () => {

  return <div className="page">
  <div className="flex-fill">
    <NavBar />
    <MenuBar />
    <ApplicationAlerts />
    <div className="my-3 my-md-5">
      <div className="container">
        <Router history={history}>
          <Switch>
            {routes.map((route, index) => (
              <Route exact {...route} key={index} />
            ))}
          </Switch>
        </Router>
      </div>
    </div>
  </div>
  <Footer />
</div>
};

render(<App />, document.getElementById("root"));

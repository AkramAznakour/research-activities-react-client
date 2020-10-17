import React, { useEffect } from "react";
import { createBrowserHistory } from "history";

import MenuBar from "../../views/layout/MenuBar";
import NavBar from "../../views/layout/NavBar";
import ApplicationAlerts from "../../views/components/ApplicationAlerts";
import Footer from "../../views/layout/Footer";
import { useParams } from "react-router-dom";
import AuthorSearch from "../Author/AuthorSearch";
import Author from "../Author/Author";

const history = createBrowserHistory();

const Visitors = () => {
  let { authorName, platform, authorId } = useParams();
  console.log(authorName);
  return (
    <div className="page">
      <div className="flex-fill">
        <NavBar />
        <ApplicationAlerts />
        <div className="my-3 my-md-5">
          <div className="container">
            {authorName && <AuthorSearch />}
            {platform && authorId && <Author />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Visitors;

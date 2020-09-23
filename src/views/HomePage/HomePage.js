import React, { useContext } from "react";

import image1 from "../../assets/images/illustrations/undraw_people_search.svg";
import image2 from "../../assets/images/illustrations/undraw_hire_te5y.svg";
import { Link } from "react-router-dom";
import { LoopIcon, SettingsIcon } from "../components/icons";
import { AppContext } from "../../context/AppContext";

const HomePage = () => {
  const { user, UserHelper } = useContext(AppContext);

  return (
    <div className="row">
      <div
        className={`empty  text-center ${
          user.roles.includes("TEAM_HEAD")   ? "col-md-6" : "col-md-12"
        }`}
      >
        <div className="empty-icon">
          <img src={image1} className="h-8 mb-4" alt="" />
        </div>
        <p className="empty-title h3">Bienvenue sur la page d'accueil </p>
        <p className="empty-subtitle text-muted">
          Essayez de utiliser la barre de recherche pour trouver l'auteur que
          vous recherchez.
        </p>
        <div className="empty-action">
          <button
            onClick={() => {
              document.getElementById("author-search-input").focus();
            }}
            className="btn btn-primary"
          >
            <LoopIcon />
            Rechercher un auteur
          </button>
        </div>
      </div>

      {user.roles.includes("TEAM_HEAD") && (
        <div className="empty col-md-6">
          <div className="empty-icon">
            <img src={image2} className="h-8 mb-4" alt="" />
          </div>
          <p className="empty-title h3">
            Etant {UserHelper.userShortBio(user)}
          </p>
          <p className="empty-subtitle text-muted">
            vous pouvez gerer cette equipe
          </p>
          {user.teamsHeaded.map(({ abbreviation, _id }) => (
            <div className="empty-action">
              <Link to={`/team/${_id}`} className="btn btn-primary">
                <SettingsIcon />
                Gérer votre equipe {abbreviation}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

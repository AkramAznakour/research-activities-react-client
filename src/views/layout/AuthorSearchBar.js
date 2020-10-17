import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { LoopIcon } from "../components/icons";

const AuthorSearchBar = ({ history }) => {
  const { user } = useContext(AppContext);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const authorName = e.target.value;
      if (authorName.trim().length === 0) return;
      if (user) history.push("/author-search/" + authorName);
      else history.push("/visitors/author-search/" + authorName);
    }
  };

  return (
    <form className="form-inline w-50 mr-4 d-none d-md-flex">
      <div className="input-icon w-100">
        <span className="input-icon-addon">
          <LoopIcon />
        </span>
        <input
          id="author-search-input"
          onKeyDown={handleKeyDown}
          type="text"
          className="form-control form-control-flush w-100"
          placeholder="Rechercher ici un auteur. Exemple : Nom Prenom"
        />
      </div>
    </form>
  );
};

export default AuthorSearchBar;

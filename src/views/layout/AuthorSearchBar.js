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
    <form className=" w-100 ">
      <div className="input-icon w-100">
        <span className="input-icon-addon">
          <LoopIcon />
        </span>
        <input
          id="author-search-input"
          onKeyDown={handleKeyDown}
          type="text"
          className="form-control form-control-flush w-100"
          placeholder="Exemple : Nom Prenom. Rechercher ici un auteur... "
        />
      </div>
    </form>
  );
};

export default AuthorSearchBar;

import React from "react";
import { LoopIcon } from "../components/icons";

const AuthorSearchBar = ({ history }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const authorName = e.target.value;
      if (authorName.trim().length === 0) return;
      history.push("/author-search/" + authorName);
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
          placeholder="Rechercher ici un auteur ..."
        />
      </div>
    </form>
  );
};

export default AuthorSearchBar;

import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <h1>Page non trouvée</h1>
      <h3>
        Retourner à la : <Link to="/"> Page d'accueil </Link>
      </h3>
    </div>
  );
}

export default PageNotFound;

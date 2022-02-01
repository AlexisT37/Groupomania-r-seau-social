import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import banner from "./banner.svg";
import Profile from "./pages/Profile";
import Latest from "./pages/Latest";

function App() {
  /* objet qui contient le nom d'utilisateur, l'id de l'utilisateur, ainsi qu'un */
  /* booléen qui vérifie l'état d'autentification de l'utilisateur */
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        /* le middleware d'autentification enverra une erreur s'il ne reconnait pas de token valide */
        /* donc dans ce cas, le AuthState sera faux */
        if (response.data.error) {
          /* on utilise l'opérateur ... pour faire une destructuration, ce qui signifie que l'on laisse le reste de l'objet inchangé */
          /* mais on va modifier le status et le mettre en faux */
          setAuthState({ ...authState, status: false });
          /* sinon il est vrai */
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            //! Attention added admin
            admin: false,
          });
        }
      });
  }, []);

  const logout = () => {
    /* pour se déconnecter, on retire le token du locasStorage */
    localStorage.removeItem("accessToken");
    /* puis on met le réinitialise le authState */
    setAuthState({ username: "", id: 0, status: false });
    window.location.pathname = "/login";
  };

  return (
    <div className="main">
      <div
        className="banner"
        // style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={banner} alt="coucou" />
      </div>

      <div className="App">
        {/* grace a useState, on peut accéder à l'information de plus haut niveau (donc App.js) dans les enfants */}
        {/* Cela signifie qu'on peut savoir partout si l'utilisateur est autentifié */}
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <Router>
            <div className="navbar">
              <div className="links">
                {/* on utilise le booléen authstate.status comme condition d'affichage des liens */}
                {/* si authState.status est faux, alors l'utilisateur n'est pas connecté, donc */}
                {/* on permet de voir les liens pour créer un post et la page d'accueil.  */}
                {/* Autrement on ne peut que se connecter ou s'inscrire */}
                {!authState.status ? (
                  <>
                    <Link to="/login"> Se connecter</Link>
                    <Link to="/registration"> S'inscrire</Link>
                  </>
                ) : (
                  <>
                    <Link to="/"> Page d'accueil</Link>
                    <Link to="/createpost"> Créer un post</Link>
                  </>
                )}
              </div>
              <div className="latest">
                {authState.status && (
                  <Link to="/latest">
                    <button> Derniers posts </button>
                  </Link>
                )}
              </div>
              <div className="loggedInContainer">
                <Link to={`/profile/${authState.id}`}>
                  {authState.username}
                </Link>
                {authState.status && (
                  <button onClick={logout}>Se déconnecter</button>
                )}
              </div>
            </div>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/createpost" exact component={CreatePost} />
              <Route path="/post/:id" exact component={Post} />
              <Route path="/registration" exact component={Registration} />
              <Route path="/login" exact component={Login} />
              <Route path="/profile/:id" exact component={Profile} />
              <Route path="/latest" exact component={Latest} />

              {/* page de redirection */}
              <Route path="*" exact component={PageNotFound} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;

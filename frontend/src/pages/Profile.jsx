import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);

  console.log(authState);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
      console.log("helo");
    });
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
      console.log("helo2");
    });
  }, []);

  const deactivateUser = () => {
    axios
      .put(`http://localhost:3001/auth/deactivate/${id}`, {
        username: username,
      })
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          /* il faut ajouter le nom d'utilisateur car si on ne le fait que par le biais du corps de la requête*/
          /* cela ne marchera que pour le premier post de la session  */

          console.log("compte désactivé !");
          // window.location.reload(false);
          // console.log(location.pathname);

          /* pour se déconnecter, on retire le token du locasStorage */
          localStorage.removeItem("accessToken");
          /* puis on met le réinitialise le authState */
          setAuthState({ username: "", id: 0, status: false });
          window.location.pathname = "/login";
        }
      });
  };

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        <h1>{username}</h1>
        {username == authState.username ||
          (authState.admin === true && (
            <button
              onClick={() => {
                console.log("Hello clique desactiver");
                // console.log(username);
                // console.log(id);
                // console.log(authState.username);
                console.log("trying to find");
                // console.log(authState.usernamePrimal);
                // const teso = authState;
                // console.log(teso);
                // console.log(typeof teso);

                deactivateUser();
              }}
            >
              Désactiver Compte
            </button>
          ))}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            /* on ajoute la valeur key pour éviter les warnings d'argument non utilisé */
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              {/* on a déplacé le onclick de façon à ce qu'on n'aille sur la page du post que si on clique au milieu */}
              {/* alors que si on like, on ne va pas sur la page du post */}
              <div
                className="body"
                onClick={() => {
                  history.push(`/post/${value.id}`);
                }}
              >
                {value.postText}
              </div>
              <div className="footer">
                <div className="username">{value.username}</div>
                <div className="buttons">
                  <label> J'aime : {value.Likes.length}</label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;

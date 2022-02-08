import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  /* on va utiliser le useContext déclencher l'état de connexion */
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      /* puisque les requêtes backend contiennent error dans leur response en cas d'erreur, alors on peut */
      /* utiliser le paramètre suivant: s'il y a une erreur */
      if (response.data.error) {
        alert(response.data.error);
      } else {
        /* //todo on va utiliser le localstorage */
        localStorage.setItem("accessToken", response.data.token);
        /* l'utilisateur est connecté, donc le authState devient vrai */
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
          admin: response.data.admin,
        });
        history.push("/");
      }
    });
  };

  return (
    <div className="loginContainer">
      <label>Nom d'utilisateur : </label>
      <input
        type="text"
        onChange={(event) => {
          /* Username state sera égal a la valeur dans le champ utliisateur */
          setUsername(event.target.value);
        }}
      />
      <label>Mot de passe : </label>
      <input
        type="password"
        onChange={(event) => {
          /* Username state sera égal a la valeur dans le champ utliisateur */
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;

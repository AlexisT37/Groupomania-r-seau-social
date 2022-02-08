import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { Image } from "cloudinary-react";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState, setAuthState } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/auth/basicinfo/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setUsername(response.data.username);
      });
    axios
      .get(`http://localhost:3001/posts/byuserId/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data);
      });
  }, []);

  /* fonction pour liker un post en frontend */
  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            /* on ne garde que les id qui ne sont pas egaux a notre postId */
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          /* si notre postId n'est pas présent alors on l'ajoute au tableau */
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

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
        {(username == authState.username || authState.admin === true) && (
          <button
            onClick={() => {
              deactivateUser();
            }}
          >
            Désactiver Compte
          </button>
        )}
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            /* on ajoute la valeur key pour éviter les warnings d'argument non utilisé */
            <div key={key} className="post">
              <div className="title"> {value.title} </div>
              {/* on a déplacé le onclick de façon à ce qu'on n'aille sur la page du post que si on clique au milieu */}
              {/* alors que si on like, on ne va pas sur la page du post */}
              <div className="image">
                <Image cloudName="testgroupopen" publicId={value.imgId}></Image>
              </div>
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
                  <ThumbUpAltIcon
                    onClick={() => {
                      likeAPost(value.id);
                    }}
                    /* si le post des posts likés inclut notre id, alors on veut avoir l'option de ne plus liker notre post */
                    /* a l'inverse, si le tableau n'inclut pas notre id, on veut pouvoir liker notre post */
                    className={
                      likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                    }
                  />
                  <label> {value.Likes.length}</label>
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

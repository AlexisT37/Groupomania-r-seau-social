import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Latest() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  /* redirection vers la page de connexion s'il n'y a pas de login */
  useEffect(() => {
    /* nouvelle façon de rediriger en utilisant la présence du accesstoken dans le localstorage */
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/posts/latest", {
          /* a présent il faut le token pour pouvoir voir les posts */
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          /* comme on récupère un objet qui contient ce qui était précédemente response.data */
          /* il faut descendre d'un niveau et récupérer listOfPosts */
          setListOfPosts(response.data.listOfPostsLatest);

          setLikedPosts(
            /* on parcourt le tableau d'objets de façon à n'obtenir que les id des posts de chaque like */
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
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

  return (
    <div>
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
              <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>
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
  );
}

export default Latest;

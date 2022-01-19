import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { RedditIcon, RedditShareButton } from "react-share";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  // console.log("object debut");
  // console.log(postObject);
  // console.log("object fin");

  let history = useHistory();
  let location = useLocation();
  //! Attention added admin
  // console.log(authState);

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
    /* le tableau vide est là pour nous empêcher d'avoir une boucle infinie */
    /* Depuis react 16.8, on aura un message d'eslint nous disant qu'il faut remplir le tableau */
    /* on utilise le commentaire suivant pour désactiver l'alerte d'eslint */
    /* on pourra essayer les solutions de stackoverflow plus tard */
    /* https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook */
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
          /* pour utiliser le webtoken dans le front, il faut passer le header comme argument à post */
        },
        {
          headers: {
            /* //todo on va utiliser le localstorage, il faudra se deconecter */
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          /* il faut ajouter le nom d'utilisateur car si on ne le fait que par le biais du corps de la requête*/
          /* cela ne marchera que pour le premier post de la session  */

          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          /* on utilise la déstructuration pour ajouter le commentaire créé avec le front a la base de données */
          setComments([...comments, commentToAdd]);
          /* une fois le comment posté, le commentaire devient une string vide */
          /* ainsi le champ est à nouveau vide */
          setNewComment("");
          console.log("Commentaire ajouté !");
          // window.location.reload(false);
          // console.log(location.pathname);
          history.push(location.pathname);
        }
      });
  };

  const deleteComment = (id) => {
    // console.log(id);
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        /* au lieu de chercher à supprimer un commentaire, on utilise la méthode filter.*/
        /* filter va retourner un nouveau tableau qui contient seulement les éléments qui valident notre condition */
        /* ainsi, on retourne un nouveau tableau contient tous les commentaires sauf celui qui a l'id de notre commentaire cible */
        setComments(
          comments.filter((valeur) => {
            return valeur.id !== id;
            //! type
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
      });
  };

  // const sharePost = () => {
  // const shareUrl = URLSearchParams;
  // };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title"> {postObject.title} </div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">
            {postObject.username} {/* type == === */}
            {(authState.username === postObject.username ||
              authState.admin === true) && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Supprimer
              </button>
            )}
            <div className="reddit">
              <RedditShareButton
                className="redditShare"
                url={window.location.href}
              >
                <RedditIcon size={40} round={true} />
              </RedditShareButton>
            </div>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Votre commentaire..."
            autoComplete="on"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Ajouter Commentaire</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              /* on ajoute la valeur key pour éviter les warnings d'argument non utilisé */
              <div key={key} className="comment">
                {comment.commentBody}
                <label>Utilisateur : {comment.username}</label>
                {/* si le nom d'utilisateur obtenu dans le authstate est égal à l'utilisateur qui a écrit le commentaire */}
                {/* //! type */}
                {(authState.username === comment.username ||
                  authState.admin === true) && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;

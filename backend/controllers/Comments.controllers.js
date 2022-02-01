const express = require("express");
const { Comments } = require("../models");

exports.getPostId = async (req, res) => {
  const postId = req.params.postId;
  /* noter requete sql ou le postId de la table des commentaires est la même que celle des params */
  /* donc l'id du post dont l'on recherche les commentaires*/
  /* on renvoie donc tous les commentaires qui correspondent au post */
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
};

/* on utilise le validateToken pour verifier si on a le droit de commenter */
exports.postComment = async (req, res) => {
  const comment = req.body;
  /* on récupère le username contenu dans le req.body, lui même obtenu grâce au token */
  const username = req.user.username;
  // console.log(username);
  /* à présent le commentaire aura un nom d'utilisateur qui lui vient du corps de la requète, qui lui-même vient du token */
  comment.username = username;
  await Comments.create(comment);
  res.json(comment);
};

exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  await Comments.destroy({
    where: {
      id: commentId,
    },
  })
    .then(() => {
      res.status(200).json("Commentaire supprimé");
    })
    .catch((error) => {
      res.status(200).json({ error });
    });
};

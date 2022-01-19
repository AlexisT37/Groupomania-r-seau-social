/* route des posts */
/* voir tous les posts */
/* créer un nouveau post */

const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

/* Si on va avec le navigateur sur /posts alors on a hello world */
router.get("/", validateToken, async (req, res) => {
  /* methode findAll pour executer select * form en mysql, puis en renvoie la liste en json */
  const listOfPosts = await Posts.findAll({ include: [Likes] });

  /* on établit une liste de tous les posts que notre utilisateur a liké en utilisant les informations obtenue dans le token de validateToken*/
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  /* au lieu de retourner juste la liste de tous les posts, on retourne aussi la liste de tous les posts likés par l'utilisateur */
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/latest", validateToken, async (req, res) => {
  const hello = "hello";
  const listOfPostsLatest = await Posts.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    include: [Likes],
  });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPostsLatest: listOfPostsLatest, likedPosts: likedPosts });
  // res.json({ message: hello });
});

router.get("/byId/:id", async (req, res) => {
  try {
    // console.log("hello");
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});

router.get("/byuserId/:id", async (req, res) => {
  try {
    // console.log("hello");
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes],
    });
    res.json(listOfPosts);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  /* puisqu'on ne recoit plus le nom d'utilisateur depuis le frontend, on le donne depuis le backend a la place, par le biais du token*/
  post.username = req.user.username;
  /* on cree un post en utilisant la fonction create, */
  /* c'est une methode du modele Posts et on utilise post, cad le req.body, en argument */
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("Post supprimé");
});

module.exports = router;

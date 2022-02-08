const { Posts, Likes } = require("../models");
exports.getAllPosts = async (req, res) => {
  /* methode findAll pour executer select * form en mysql, puis en renvoie la liste en json */
  const listOfPosts = await Posts.findAll({ include: [Likes] });

  /* on établit une liste de tous les posts que notre utilisateur a liké en utilisant les informations obtenue dans le token de validateToken*/
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  /* au lieu de retourner juste la liste de tous les posts, on retourne aussi la liste de tous les posts likés par l'utilisateur */
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
};

exports.latest = async (req, res) => {
  const listOfPostsLatest = await Posts.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    include: [Likes],
  });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPostsLatest: listOfPostsLatest, likedPosts: likedPosts });
};

exports.getPostById = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

exports.getPostByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes],
    });
    res.json(listOfPosts);
  } catch (error) {
    console.log(error);
  }
};

exports.createPost = async (req, res) => {
  const post = req.body;
  /* puisqu'on ne recoit plus le nom d'utilisateur depuis le frontend, on le donne depuis le backend a la place, par le biais du token*/
  post.username = req.user.username;
  /* on cree un post en utilisant la fonction create, */
  /* c'est une methode du modele Posts et on utilise post, cad le req.body, en argument */
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
};

exports.deletePost = async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  res.json("Post supprimé");
};
